// Label/depth buffers -> layered, editable SVG.
import { traceRegion, ringsToPath } from './trace.js';
import { mix, darken, lighten, shadeDepth } from './colors.js';

export const STYLE_DEFAULTS = {
  outlineWidth: 2,
  outlineColor: '#1d1d1f',
  backOutline: true, // thicker outline around the whole silhouette
  smooth: 1, // 0 = polygons, 1 = smooth curves
  sigma: 1.0, // pre-trace blur (px)
  tol: 0.6, // simplification tolerance (px)
  shading: 'flat', // 'flat' | 'bands' (depth contours, surface) | 'depth' (per-region Goodsell shading)
  bands: 5, // number of depth contour levels
  shadeRange: 0.3, // OKLab lightness span from back (dark) to front (light)
  bandLines: true, // thin contour lines between depth bands
  fog: 0, // 0..1 depth cueing
  fogColor: '#ffffff',
  twoTone: true, // cartoon: shade back faces / ribbon edges
  background: null,
  title: 'PDB2Vector',
};

const esc = (s) => String(s).replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&apos;' }[c]));
const fmtW = (v) => String(Math.round(v * 100) / 100);
const safeId = (s) => String(s).replace(/[^A-Za-z0-9_-]/g, '_');

export function shadeColor(label, style) {
  let c = label.color;
  if (!style.twoTone) return c;
  if (label.shade === 'bottom') c = lighten(c, 0.38);
  else if (label.shade === 'side') c = darken(c, 0.3);
  else if (label.shade === 'rung') c = lighten(c, 0.25);
  return c;
}

// Colour of depth band b (0 = deepest) out of N: darker at the back, lighter in front.
export function bandColor(base, b, N, range) {
  return shadeDepth(base, N > 1 ? b / (N - 1) : 0.5, range);
}

// Robust depth statistics of the visible pixels: a normalisation that ignores
// the extreme 1% at either end, and N-band thresholds that blend equal depth
// steps with equal-area quantiles (pure depth steps leave the front bands tiny
// on globular proteins; pure quantiles lose the sense of real depth).
export function depthModel(img, N = 0) {
  const { label, depth } = img;
  const total = label.length;
  const stride = Math.max(1, Math.floor(total / 400000));
  const vals = [];
  for (let k = 0; k < total; k += stride) if (label[k] >= 0 && Number.isFinite(depth[k])) vals.push(depth[k]);
  const sorted = Float32Array.from(vals).sort();
  const q = (p) => (sorted.length ? sorted[Math.min(sorted.length - 1, Math.max(0, Math.floor(p * (sorted.length - 1))))] : 0);
  const lo = q(0.01), hi = q(0.99);
  const span = hi - lo || 1;
  const thresholds = [];
  for (let b = 1; b < N; b++) thresholds.push(0.5 * (lo + (span * b) / N) + 0.5 * q(b / N));
  const norm = (z) => Math.max(0, Math.min(1, (z - lo) / span));
  return { lo, hi, norm, thresholds };
}

// Final fill colour per label (two-tone shading, per-region depth shading, fog).
export function labelFills(labels, st, dm, style) {
  return labels.map((L, i) => {
    let c = shadeColor(L, style);
    if (!st[i].n) return c;
    const x = dm.norm(st[i].z); // 0 back .. 1 front
    if (style.shading === 'depth') c = shadeDepth(c, x, style.shadeRange);
    if (style.fog > 0) c = mix(c, style.fogColor, Math.min(0.95, style.fog * (1 - x)));
    return c;
  });
}

// Merge connected fragments smaller than minPix pixels into the neighbouring
// label they share the longest border with. Removes specks and slivers that
// would otherwise turn into tiny paths or pin-holes. Modifies img.label in place.
export function cleanupFragments(img, minPix) {
  const { w, h, label } = img;
  const n = w * h;
  const seen = new Uint8Array(n);
  const queue = new Int32Array(n);
  const counts = new Map();
  for (let s = 0; s < n; s++) {
    if (seen[s]) continue;
    const L = label[s];
    let head = 0, tail = 0;
    queue[tail++] = s;
    seen[s] = 1;
    let big = false;
    while (head < tail) {
      const k = queue[head++];
      const x = k % w;
      const nb = [x > 0 ? k - 1 : -1, x < w - 1 ? k + 1 : -1, k >= w ? k - w : -1, k < n - w ? k + w : -1];
      for (const q of nb) {
        if (q < 0 || seen[q] || label[q] !== L) continue;
        seen[q] = 1;
        queue[tail++] = q;
      }
      if (tail >= minPix && !big) big = true;
    }
    if (big) continue;
    // small component: find dominant neighbour label
    counts.clear();
    for (let i = 0; i < tail; i++) {
      const k = queue[i];
      const x = k % w;
      const nb = [x > 0 ? k - 1 : -1, x < w - 1 ? k + 1 : -1, k >= w ? k - w : -1, k < n - w ? k + w : -1];
      for (const q of nb) {
        if (q < 0) { counts.set(-1, (counts.get(-1) || 0) + 1); continue; }
        const M = label[q];
        if (M !== L) counts.set(M, (counts.get(M) || 0) + 1);
      }
    }
    let best = L, bc = 0;
    for (const [M, c] of counts) if (c > bc) { bc = c; best = M; }
    if (best === L) continue;
    // Borrow a depth from a neighbour of the new label (needed when filling holes).
    let zfill = -Infinity;
    for (let i = 0; i < tail && zfill === -Infinity; i++) {
      const k = queue[i];
      for (const q of [k - 1, k + 1, k - w, k + w]) {
        if (q >= 0 && q < n && label[q] === best && Number.isFinite(img.depth[q])) { zfill = img.depth[q]; break; }
      }
    }
    for (let i = 0; i < tail; i++) {
      const k = queue[i];
      label[k] = best;
      if (best < 0) img.depth[k] = -Infinity;
      else if (!Number.isFinite(img.depth[k])) img.depth[k] = zfill;
    }
  }
}

// Per-label pixel statistics: bbox, count, mean depth.
export function labelStats(img, nLabels) {
  const { w, h, label, depth } = img;
  const st = Array.from({ length: nLabels }, () => ({ x0: w, y0: h, x1: -1, y1: -1, n: 0, z: 0 }));
  let zlo = Infinity, zhi = -Infinity;
  for (let y = 0; y < h; y++) {
    for (let x = 0; x < w; x++) {
      const k = y * w + x;
      const L = label[k];
      if (L < 0) continue;
      const s = st[L];
      if (x < s.x0) s.x0 = x; if (x > s.x1) s.x1 = x;
      if (y < s.y0) s.y0 = y; if (y > s.y1) s.y1 = y;
      s.n++; s.z += depth[k];
      if (depth[k] < zlo) zlo = depth[k];
      if (depth[k] > zhi) zhi = depth[k];
    }
  }
  for (const s of st) if (s.n) s.z /= s.n;
  return { st, zlo, zhi };
}

export function vectorize(img, scene, styleIn = {}) {
  const style = { ...STYLE_DEFAULTS, ...styleIn };
  const { w, h, label, depth } = img;
  const labels = scene.labels;
  // Regions smaller than ~2.5 outline widths across would render as solid outline blobs.
  const autoFrag = Math.max(8, Math.round(style.sigma * style.sigma * 8), Math.round((2.5 * style.outlineWidth) ** 2));
  if (style.minFragment !== 0) cleanupFragments(img, style.minFragment ?? autoFrag);
  const { st } = labelStats(img, labels.length);
  const useBands = style.shading === 'bands' && scene.mode === 'surface' && style.bands > 1;
  const dm = depthModel(img, useBands ? style.bands : 0);
  const topts = { sigma: style.sigma, tol: style.tol, minArea: Math.max(2, style.sigma * 3) };
  const sw = style.outlineWidth;
  // Depth bands are smoothed a little more so they read as soft contours, and
  // islands too small to see are dropped.
  const bopts = { sigma: style.sigma * 1.8, tol: style.tol * 1.2, minArea: Math.max(30, style.sigma * style.sigma * 70) };

  const fill = labelFills(labels, st, dm, style);

  // Draw order: back to front (by mean depth) so overlapping strokes look right.
  const order = labels.map((_, i) => i).filter((i) => st[i].n > 0).sort((a, b) => st[a].z - st[b].z);

  const regions = []; // {label, d}
  for (const i of order) {
    const s = st[i];
    const rings = traceRegion(w, h, [s.x0, s.y0, s.x1, s.y1], (k) => label[k] === i, topts);
    if (!rings.length) continue;
    const region = { i, d: ringsToPath(rings, style.smooth), bands: [] };
    if (useBands) {
      const N = style.bands;
      for (let b = 1; b < N; b++) {
        const zt = dm.thresholds[b - 1];
        const br = traceRegion(w, h, [s.x0, s.y0, s.x1, s.y1], (k) => label[k] === i && depth[k] >= zt, bopts);
        if (!br.length) continue;
        const col = bandColor(fill[i], b, N, style.shadeRange);
        const line = mix(bandColor(fill[i], b - 1, N, style.shadeRange), style.outlineColor, 0.45);
        region.bands.push({ d: ringsToPath(br, style.smooth), color: col, line, level: b });
      }
      // The base region itself is the deepest band.
      region.baseColor = bandColor(fill[i], 0, N, style.shadeRange);
    }
    if (style.shading === 'depth') {
      // Thinner lines towards the viewer, as in cellscape's Goodsell mode.
      const x = dm.norm(s.z);
      region.strokeWidth = sw * (1.2 - 0.75 * x);
    }
    regions.push(region);
  }

  let silhouette = '';
  if (sw > 0 && style.backOutline) {
    const rings = traceRegion(w, h, [0, 0, w - 1, h - 1], (k) => label[k] >= 0, topts);
    silhouette = ringsToPath(rings, style.smooth);
  }

  // Crop to content (plus room for the outline).
  let bx0 = w, by0 = h, bx1 = 0, by1 = 0;
  for (const s of st) if (s.n) { bx0 = Math.min(bx0, s.x0); by0 = Math.min(by0, s.y0); bx1 = Math.max(bx1, s.x1 + 1); by1 = Math.max(by1, s.y1 + 1); }
  if (bx1 <= bx0) { bx0 = 0; by0 = 0; bx1 = w; by1 = h; }
  const pad = Math.ceil(sw * 2 + style.sigma * 2 + 4);
  const vb = [bx0 - pad, by0 - pad, bx1 - bx0 + 2 * pad, by1 - by0 + 2 * pad];

  // Assemble SVG grouped by chain (in order of first appearance in the label table).
  const chainOrder = [];
  const byChain = new Map();
  for (const L of labels) if (!byChain.has(L.chain)) { byChain.set(L.chain, []); chainOrder.push(L.chain); }
  for (const r of regions) byChain.get(labels[r.i].chain).push(r);

  const out = [];
  out.push(`<svg xmlns="http://www.w3.org/2000/svg" viewBox="${vb.join(' ')}" width="${vb[2]}" height="${vb[3]}">`);
  out.push(`<title>${esc(style.title)}</title>`);
  out.push('<desc>Generated with PDB2Vector</desc>');
  if (style.background) out.push(`<rect id="background" x="${vb[0]}" y="${vb[1]}" width="${vb[2]}" height="${vb[3]}" fill="${style.background}"/>`);
  if (silhouette) {
    out.push(`<g id="silhouette"><path d="${silhouette}" fill="${style.outlineColor}" stroke="${style.outlineColor}" stroke-width="${sw * 2}" stroke-linejoin="round"/></g>`);
  }
  const regionName = (r) => {
    const L = labels[r.i];
    if (L.kind === 'ligand' || L.kind === 'residue') return L.name;
    if (L.kind === 'cartoon') {
      if (L.shade === 'rung') return 'base';
      return `${L.ss === 'H' ? 'helix' : L.ss === 'E' ? 'strand' : L.ss === 'N' ? 'nucleic' : 'loop'}_${L.shade}`;
    }
    return 'surface';
  };
  // Fills, grouped by chain; within a chain keep back-to-front order.
  for (const ch of chainOrder) {
    const rs = byChain.get(ch);
    if (!rs.length) continue;
    out.push(`<g id="chain_${safeId(ch)}">`);
    for (const r of rs) {
      const nm = safeId(`${ch}_${regionName(r)}_${r.i}`);
      if (r.bands.length) {
        out.push(`<g id="${nm}">`);
        out.push(`<path d="${r.d}" fill="${r.baseColor}" fill-rule="evenodd"/>`);
        for (const b of r.bands) {
          const ln = style.bandLines && sw > 0 ? ` stroke="${b.line}" stroke-width="${fmtW(sw * 0.4)}" stroke-linejoin="round"` : '';
          out.push(`<path d="${b.d}" fill="${b.color}" fill-rule="evenodd"${ln}/>`);
        }
        out.push('</g>');
      } else {
        out.push(`<path id="${nm}" d="${r.d}" fill="${fill[r.i]}" fill-rule="evenodd"/>`);
      }
    }
    out.push('</g>');
  }
  if (sw > 0) {
    out.push(`<g id="outlines" fill="none" stroke="${style.outlineColor}" stroke-width="${sw}" stroke-linejoin="round" stroke-linecap="round">`);
    for (const r of regions) out.push(r.strokeWidth ? `<path d="${r.d}" stroke-width="${fmtW(r.strokeWidth)}"/>` : `<path d="${r.d}"/>`);
    out.push('</g>');
  }
  out.push('</svg>');
  return { svg: out.join('\n'), width: vb[2], height: vb[3], viewBox: vb, frame: [w, h], regions: regions.length };
}
