// Raster region -> vector outline.
// A binary mask is lightly blurred, iso-contoured at 0.5 with marching squares
// (consistently oriented, saddles resolved by the cell centre), simplified with
// Ramer-Douglas-Peucker and finally emitted as smooth closed Bezier paths.

function gaussianKernel(sigma) {
  const r = Math.max(1, Math.ceil(sigma * 2.5));
  const k = new Float32Array(2 * r + 1);
  let s = 0;
  for (let i = -r; i <= r; i++) { k[i + r] = Math.exp(-(i * i) / (2 * sigma * sigma)); s += k[i + r]; }
  for (let i = 0; i < k.length; i++) k[i] /= s;
  return { k, r };
}

function blur(field, w, h, sigma) {
  if (!(sigma > 0.05)) return field;
  const { k, r } = gaussianKernel(sigma);
  const tmp = new Float32Array(w * h);
  for (let y = 0; y < h; y++) {
    const row = y * w;
    for (let x = 0; x < w; x++) {
      let s = 0;
      const a = Math.max(0, x - r), b = Math.min(w - 1, x + r);
      for (let xx = a; xx <= b; xx++) s += field[row + xx] * k[xx - x + r];
      tmp[row + x] = s;
    }
  }
  const out = new Float32Array(w * h);
  for (let y = 0; y < h; y++) {
    const a = Math.max(0, y - r), b = Math.min(h - 1, y + r);
    for (let x = 0; x < w; x++) {
      let s = 0;
      for (let yy = a; yy <= b; yy++) s += tmp[yy * w + x] * k[yy - y + r];
      out[y * w + x] = s;
    }
  }
  return out;
}

// Marching squares on field (w x h samples). Returns rings in sample coordinates.
export function marchingSquares(f, w, h, iso = 0.5) {
  const next = new Map();
  const Hk = (i, j) => (j * w + i) * 2; // edge (i,j)-(i+1,j)
  const Vk = (i, j) => (j * w + i) * 2 + 1; // edge (i,j)-(i,j+1)
  const cross = [];
  for (let j = 0; j < h - 1; j++) {
    for (let i = 0; i < w - 1; i++) {
      const tl = f[j * w + i] > iso, tr = f[j * w + i + 1] > iso;
      const br = f[(j + 1) * w + i + 1] > iso, bl = f[(j + 1) * w + i] > iso;
      if (tl === tr && tr === br && br === bl) continue;
      cross.length = 0;
      // clockwise: top, right, bottom, left. type 1 = exit (in->out), 0 = entry
      if (tl !== tr) cross.push(Hk(i, j), tl ? 1 : 0);
      if (tr !== br) cross.push(Vk(i + 1, j), tr ? 1 : 0);
      if (br !== bl) cross.push(Hk(i, j + 1), br ? 1 : 0);
      if (bl !== tl) cross.push(Vk(i, j), bl ? 1 : 0);
      if (cross.length === 4) {
        if (cross[1] === 0) next.set(cross[0], cross[2]);
        else next.set(cross[2], cross[0]);
      } else {
        const c = (f[j * w + i] + f[j * w + i + 1] + f[(j + 1) * w + i + 1] + f[(j + 1) * w + i]) / 4;
        const centerIn = c > iso;
        for (let p = 0; p < 4; p++) {
          if (cross[2 * p + 1] !== 0) continue;
          const q = centerIn ? (p + 3) % 4 : (p + 1) % 4;
          next.set(cross[2 * p], cross[2 * q]);
        }
      }
    }
  }
  const point = (key) => {
    const e = key >> 1;
    const i = e % w, j = (e - i) / w;
    if ((key & 1) === 0) {
      const a = f[j * w + i], b = f[j * w + i + 1];
      return [i + (iso - a) / (b - a), j];
    }
    const a = f[j * w + i], b = f[(j + 1) * w + i];
    return [i, j + (iso - a) / (b - a)];
  };
  const rings = [];
  for (const start of next.keys()) {
    if (!next.has(start)) continue;
    const ring = [];
    let k = start;
    let guard = 0;
    while (next.has(k) && guard++ < 1e7) {
      ring.push(point(k));
      const n = next.get(k);
      next.delete(k);
      k = n;
      if (k === start) break;
    }
    if (ring.length >= 3) rings.push(ring);
  }
  return rings;
}

function rdp(pts, tol) {
  if (pts.length < 3) return pts;
  const keep = new Uint8Array(pts.length);
  keep[0] = keep[pts.length - 1] = 1;
  const stack = [[0, pts.length - 1]];
  const tol2 = tol * tol;
  while (stack.length) {
    const [a, b] = stack.pop();
    const [ax, ay] = pts[a], [bx, by] = pts[b];
    const dx = bx - ax, dy = by - ay;
    const L2 = dx * dx + dy * dy;
    let best = -1, bi = -1;
    for (let i = a + 1; i < b; i++) {
      const [px, py] = pts[i];
      let d2;
      if (L2 === 0) d2 = (px - ax) ** 2 + (py - ay) ** 2;
      else {
        const c = dx * (py - ay) - dy * (px - ax);
        d2 = (c * c) / L2;
      }
      if (d2 > best) { best = d2; bi = i; }
    }
    if (best > tol2) { keep[bi] = 1; stack.push([a, bi], [bi, b]); }
  }
  return pts.filter((_, i) => keep[i]);
}

export function simplifyRing(ring, tol) {
  if (ring.length < 8 || tol <= 0) return ring;
  // split at the point farthest from ring[0]
  let far = 0, fd = -1;
  for (let i = 1; i < ring.length; i++) {
    const d = (ring[i][0] - ring[0][0]) ** 2 + (ring[i][1] - ring[0][1]) ** 2;
    if (d > fd) { fd = d; far = i; }
  }
  const a = rdp(ring.slice(0, far + 1), tol);
  const b = rdp(ring.slice(far).concat([ring[0]]), tol);
  return a.slice(0, -1).concat(b.slice(0, -1));
}

export function ringArea(r) {
  let s = 0;
  for (let i = 0, n = r.length; i < n; i++) {
    const [x1, y1] = r[i], [x2, y2] = r[(i + 1) % n];
    s += x1 * y2 - x2 * y1;
  }
  return s / 2;
}

// Trace the region where test(k) is true, restricted to bbox [x0..x1]x[y0..y1]
// of an image with width W. Returns rings in image pixel coordinates.
export function traceRegion(W, H, bbox, test, opts = {}) {
  const sigma = opts.sigma ?? 1;
  const pad = Math.ceil(sigma * 2.5) + 2;
  const [x0, y0, x1, y1] = bbox;
  const bw = x1 - x0 + 1 + 2 * pad, bh = y1 - y0 + 1 + 2 * pad;
  let field = new Float32Array(bw * bh);
  let count = 0;
  for (let y = y0; y <= y1; y++) {
    const row = (y - y0 + pad) * bw + pad - x0;
    const src = y * W;
    for (let x = x0; x <= x1; x++) {
      if (test(src + x)) { field[row + x] = 1; count++; }
    }
  }
  if (!count) return [];
  field = blur(field, bw, bh, sigma);
  const rings = marchingSquares(field, bw, bh, 0.5);
  const ox = x0 - pad + 0.5, oy = y0 - pad + 0.5;
  const minArea = opts.minArea ?? 2;
  const tol = opts.tol ?? 0.5;
  const out = [];
  for (const r of rings) {
    for (const p of r) { p[0] += ox; p[1] += oy; }
    if (Math.abs(ringArea(r)) < minArea) continue;
    const s = simplifyRing(r, tol);
    if (s.length >= 3) out.push(s);
  }
  return out;
}

const fmt = (v) => {
  const r = Math.round(v * 100) / 100;
  return Object.is(r, -0) ? '0' : String(r);
};

// Closed Catmull-Rom spline -> cubic Bezier path data. smooth in [0,1].
export function ringsToPath(rings, smooth = 1, dx = 0, dy = 0) {
  let d = '';
  for (const r of rings) {
    const n = r.length;
    const P = (i) => r[(i + n) % n];
    d += `M${fmt(r[0][0] - dx)} ${fmt(r[0][1] - dy)}`;
    if (smooth <= 0 || n < 4) {
      for (let i = 1; i < n; i++) d += `L${fmt(r[i][0] - dx)} ${fmt(r[i][1] - dy)}`;
    } else {
      const k = smooth / 6;
      for (let i = 0; i < n; i++) {
        const p0 = P(i - 1), p1 = P(i), p2 = P(i + 1), p3 = P(i + 2);
        const c1x = p1[0] + (p2[0] - p0[0]) * k, c1y = p1[1] + (p2[1] - p0[1]) * k;
        const c2x = p2[0] - (p3[0] - p1[0]) * k, c2y = p2[1] - (p3[1] - p1[1]) * k;
        d += `C${fmt(c1x - dx)} ${fmt(c1y - dy)} ${fmt(c2x - dx)} ${fmt(c2y - dy)} ${fmt(p2[0] - dx)} ${fmt(p2[1] - dy)}`;
      }
    }
    d += 'Z';
  }
  return d;
}
