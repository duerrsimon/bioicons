// Build renderable scenes (spheres + triangle mesh) with region labels from a model.
import { MOLTYPE_COLORS, CHAIN_PALETTE, PALETTES, SEQUENTIAL, sequentialColors, SS_COLORS, LIGAND_COLOR, NUCLEIC_COLOR, gradientColor, plddtColor } from './colors.js';
import { connected, residueMolType } from './structure.js';

const VDW = { C: 1.7, N: 1.55, O: 1.52, S: 1.8, P: 1.8, Se: 1.9, Fe: 1.4, Zn: 1.39, Mg: 1.73, Ca: 1.97, Cl: 1.75, Na: 2.27, K: 2.75 };

export const DEFAULTS = {
  mode: 'surface', // 'surface' | 'cartoon'
  colorBy: 'chain', // 'chain' | 'entity' | 'moltype' | 'ss' | 'rainbow' | 'plddt' | 'single'
  entityColors: {},
  molTypeColors: MOLTYPE_COLORS,
  singleColor: '#636EFA',
  ligandColor: LIGAND_COLOR,
  chainColors: {},
  hiddenChains: [],
  ligands: false,
  probe: 0.6,
  residueOutlines: false,
  rainbowBins: 12,
  gradient: 'rainbow', // N -> C ramp: 'rainbow' | 'viridis' | 'cividis' | 'magma'
  tubeRadius: 0.35,
  helixWidth: 1.5,
  strandWidth: 1.25,
  ribbonThickness: 0.3,
  ssMode: 'auto',
};

// One colour per entity (copies of the same molecule share it).
export function defaultEntityColors(model, palette = 'plotly', offset = 0) {
  const ents = model.entities || [];
  const pal = SEQUENTIAL[palette] ? sequentialColors(palette, ents.length) : PALETTES[palette] || CHAIN_PALETTE;
  const out = {};
  ents.forEach((e, i) => { out[e.id] = pal[(i + offset) % pal.length]; });
  return out;
}

export function defaultChainColors(model, palette = 'plotly', offset = 0) {
  const poly = model.chains.filter((c) => c.polymer);
  // Sequential maps are spread evenly over the chains; qualitative ones cycle.
  const pal = SEQUENTIAL[palette] ? sequentialColors(palette, poly.length) : PALETTES[palette] || CHAIN_PALETTE;
  const out = {};
  poly.forEach((c, i) => { out[c.id] = pal[(i + offset) % pal.length]; });
  model.chains.filter((c) => !c.polymer).forEach((c) => { out[c.id] = pal[0]; });
  return out;
}

function residueColorFn(model, o) {
  const chainPos = new Map();
  for (const c of model.chains) {
    const poly = c.residues.filter((r) => r.isPolymer);
    poly.forEach((r, i) => chainPos.set(r.index, poly.length > 1 ? i / (poly.length - 1) : 0));
  }
  return (r) => {
    if (r.isLigand) return o.colorBy === 'chain' ? o.ligandColor : o.ligandColor;
    switch (o.colorBy) {
      case 'ss': return r.isNucleic ? NUCLEIC_COLOR : SS_COLORS[r.ss] || SS_COLORS.C;
      case 'rainbow': {
        const bins = Math.max(2, o.rainbowBins | 0);
        const t = Math.round((chainPos.get(r.index) || 0) * (bins - 1)) / (bins - 1);
        return gradientColor(o.gradient, t);
      }
      case 'plddt': return plddtColor(r.b);
      case 'entity': return o.entityColors[r.entity] || CHAIN_PALETTE[0];
      case 'moltype': return (o.molTypeColors || MOLTYPE_COLORS)[residueMolType(r)];
      case 'single': return o.singleColor;
      default: return o.chainColors[r.chain] || CHAIN_PALETTE[0];
    }
  };
}

class LabelTable {
  constructor() { this.list = []; this.map = new Map(); }
  get(key, info) {
    let id = this.map.get(key);
    if (id === undefined) {
      id = this.list.length;
      this.map.set(key, id);
      this.list.push({ id, key, ...info });
    }
    return id;
  }
}

function finishScene(scene) {
  // Centre and bounding radius over everything drawn.
  let sx = 0, sy = 0, sz = 0, n = 0;
  const acc = (arr) => { for (let i = 0; i < arr.length; i += 3) { sx += arr[i]; sy += arr[i + 1]; sz += arr[i + 2]; n++; } };
  if (scene.spheres) acc(scene.spheres.xyz);
  if (scene.mesh) acc(scene.mesh.pos);
  const c = n ? [sx / n, sy / n, sz / n] : [0, 0, 0];
  let rad = 1;
  const rr = (arr, extra) => {
    for (let i = 0; i < arr.length; i += 3) {
      const d = Math.hypot(arr[i] - c[0], arr[i + 1] - c[1], arr[i + 2] - c[2]) + (extra ? extra[i / 3] : 0);
      if (d > rad) rad = d;
    }
  };
  if (scene.spheres) rr(scene.spheres.xyz, scene.spheres.r);
  if (scene.mesh) rr(scene.mesh.pos);
  scene.center = c;
  scene.radius = rad;
  return scene;
}

export function buildScene(model, options) {
  const o = { ...DEFAULTS, ...options };
  const hidden = new Set(o.hiddenChains);
  const colorOf = residueColorFn(model, o);
  const labels = new LabelTable();
  const scene = { mode: o.mode, labels: labels.list };

  const sphereXYZ = [], sphereR = [], sphereL = [];
  const addAtoms = (r, labelId, radScale = 1, probe = 0) => {
    for (const k of r.atoms) {
      const a = model.atoms[k];
      sphereXYZ.push(a.x, a.y, a.z);
      sphereR.push((VDW[a.elem] ?? 1.7) * radScale + probe);
      sphereL.push(labelId);
    }
  };

  if (o.mode === 'surface') {
    for (const r of model.residues) {
      if (hidden.has(r.chain)) continue;
      if (r.isLigand && !o.ligands) continue;
      const color = colorOf(r);
      let key, info;
      if (r.isLigand) {
        key = `lig|${r.index}`;
        info = { chain: r.chain, color, shade: 'base', kind: 'ligand', name: `${r.resn}_${r.chain}${r.resi}` };
      } else if (o.residueOutlines) {
        key = `res|${r.index}`;
        info = { chain: r.chain, color, shade: 'base', kind: 'residue', name: `${r.resn}${r.resi}` };
      } else {
        key = `${r.chain}|${color}`;
        info = { chain: r.chain, color, shade: 'base', kind: 'surface' };
      }
      addAtoms(r, labels.get(key, info), 1, o.probe);
    }
  } else {
    buildCartoon(model, o, colorOf, labels, scene, hidden);
    if (o.ligands) {
      for (const r of model.residues) {
        if (!r.isLigand || hidden.has(r.chain)) continue;
        const id = labels.get(`lig|${r.index}`, { chain: r.chain, color: colorOf(r), shade: 'base', kind: 'ligand', name: `${r.resn}_${r.chain}${r.resi}` });
        addAtoms(r, id, 0.75, 0);
      }
    }
  }
  if (sphereR.length) {
    scene.spheres = { xyz: new Float32Array(sphereXYZ), r: new Float32Array(sphereR), label: new Int32Array(sphereL) };
  }
  return finishScene(scene);
}

// --- Cartoon -----------------------------------------------------------------

const sub = (a, b) => [a[0] - b[0], a[1] - b[1], a[2] - b[2]];
const add = (a, b) => [a[0] + b[0], a[1] + b[1], a[2] + b[2]];
const scl = (a, s) => [a[0] * s, a[1] * s, a[2] * s];
const dot = (a, b) => a[0] * b[0] + a[1] * b[1] + a[2] * b[2];
const crs = (a, b) => [a[1] * b[2] - a[2] * b[1], a[2] * b[0] - a[0] * b[2], a[0] * b[1] - a[1] * b[0]];
const nrm = (a) => { const l = Math.hypot(a[0], a[1], a[2]) || 1; return [a[0] / l, a[1] / l, a[2] / l]; };
const P3 = (atom) => [atom.x, atom.y, atom.z];
const smoothstep = (t) => t * t * (3 - 2 * t);

function catmull(p0, p1, p2, p3, t) {
  const t2 = t * t, t3 = t2 * t;
  const f = (a, b, c, d) => 0.5 * (2 * b + (-a + c) * t + (2 * a - 5 * b + 4 * c - d) * t2 + (-a + 3 * b - 3 * c + d) * t3);
  return [f(p0[0], p1[0], p2[0], p3[0]), f(p0[1], p1[1], p2[1], p3[1]), f(p0[2], p1[2], p2[2], p3[2])];
}

function polymerSegments(model, chain) {
  const segs = [];
  let cur = [];
  for (const r of chain.residues) {
    if (!r.isPolymer || r.trace === undefined) continue;
    if (cur.length && !connected(model, cur[cur.length - 1], r)) { segs.push(cur); cur = []; }
    cur.push(r);
  }
  if (cur.length) segs.push(cur);
  return segs.filter((s) => s.length >= 2);
}

function buildCartoon(model, o, colorOf, labels, scene, hidden) {
  const A = model.atoms;
  const pos = [];
  const tri = [];
  const triLabel = [];
  const K = 12; // vertices per cross-section
  const NSUB = 6; // samples per residue
  const tube = o.tubeRadius;
  const thick = o.ribbonThickness / 2;
  const prof = (r) => {
    if (r.isNucleic) return { hw: tube * 2.2, hh: tube * 2.2, e: 1, flat: false };
    if (r.ss === 'H') return { hw: o.helixWidth, hh: thick, e: 0.25, flat: true };
    if (r.ss === 'E') return { hw: o.strandWidth, hh: thick, e: 0.25, flat: true };
    return { hw: tube, hh: tube, e: 1, flat: false };
  };

  for (const chain of model.chains) {
    if (hidden.has(chain.id)) continue;
    const segs = polymerSegments(model, chain);
    segs.forEach((seg, segIdx) => {
      const n = seg.length;
      // Element ids: runs of identical SS
      const elem = new Array(n);
      let e = 0;
      for (let i = 0; i < n; i++) { if (i > 0 && seg[i].ss !== seg[i - 1].ss) e++; elem[i] = e; }
      const ss = seg.map((r) => (r.isNucleic ? 'N' : r.ss));

      // Guide points
      let P = seg.map((r) => P3(A[r.trace]));
      const Psm = P.map((p, i) => {
        if (ss[i] === 'E' && i > 0 && i < n - 1 && ss[i - 1] === 'E' && ss[i + 1] === 'E') {
          return add(scl(p, 0.5), scl(add(P[i - 1], P[i + 1]), 0.25));
        }
        return p;
      });
      P = Psm;
      const T = P.map((p, i) => nrm(sub(P[Math.min(n - 1, i + 1)], P[Math.max(0, i - 1)])));
      // Side (width) vectors
      const Sv = new Array(n);
      for (let i = 0; i < n; i++) {
        const r = seg[i];
        let s;
        if (r.isProtein && r.o !== undefined && r.c !== undefined) {
          s = sub(P3(A[r.o]), P3(A[r.c]));
        } else {
          const prev = seg[Math.max(0, i - 1)], next = seg[Math.min(n - 1, i + 1)];
          const ca = P3(A[r.trace]);
          const b = add(sub(P3(A[prev.trace]), ca), sub(P3(A[next.trace]), ca));
          s = crs(T[i], b);
          if (Math.hypot(...s) < 1e-3) s = crs(T[i], [0.3, 0.5, 0.8]);
        }
        s = nrm(sub(s, scl(T[i], dot(s, T[i]))));
        if (i > 0 && dot(s, Sv[i - 1]) < 0) s = scl(s, -1);
        Sv[i] = s;
      }

      // Generate rings
      const rings = [];
      const colorKey = (i) => {
        const r = seg[i];
        const col = colorOf(r);
        return { col, group: `${chain.id}|${segIdx}|${elem[i]}|${col}` };
      };
      const pushRing = (c, t, s, p, ri) => {
        let side = nrm(sub(s, scl(t, dot(s, t))));
        const nrmv = nrm(crs(t, side));
        rings.push({ c, side, n: nrmv, ...p, ri });
      };
      for (let i = 0; i < n - 1; i++) {
        const p0 = P[Math.max(0, i - 1)], p1 = P[i], p2 = P[i + 1], p3 = P[Math.min(n - 1, i + 2)];
        const isArrow = ss[i] === 'E' && ss[i + 1] !== 'E';
        const pa = prof(seg[i]), pb = prof(seg[i + 1]);
        for (let k = 0; k < NSUB; k++) {
          const t = k / NSUB;
          const c = catmull(p0, p1, p2, p3, t);
          const cn = catmull(p0, p1, p2, p3, t + 0.02);
          const tan = nrm(sub(cn, c));
          const s = nrm(add(scl(Sv[i], 1 - t), scl(Sv[i + 1], t)));
          const ri = t < 0.5 || isArrow ? i : i + 1;
          let p;
          if (isArrow) {
            if (k === 0) pushRing(c, tan, s, { ...pa }, i);
            const tt = t;
            p = { hw: o.strandWidth * 1.6 * (1 - tt) + tube * tt, hh: thick * (1 - tt) + tube * tt, e: 0.25 + 0.75 * tt, flat: true };
          } else {
            const u = smoothstep(t);
            p = { hw: pa.hw + (pb.hw - pa.hw) * u, hh: pa.hh + (pb.hh - pa.hh) * u, e: pa.e + (pb.e - pa.e) * u, flat: (t < 0.5 ? pa : pb).flat };
          }
          pushRing(c, tan, s, p, ri);
        }
      }
      {
        const i = n - 1;
        const tan = T[i];
        pushRing(P[i], tan, Sv[i], prof(seg[i]), i);
      }

      // Mesh
      const ringBase = [];
      for (const R of rings) {
        ringBase.push(pos.length / 3);
        for (let k = 0; k < K; k++) {
          const th = (2 * Math.PI * k) / K + Math.PI / K;
          const cs = Math.cos(th), sn = Math.sin(th);
          const x = R.hw * Math.sign(cs) * Math.abs(cs) ** R.e;
          const y = R.hh * Math.sign(sn) * Math.abs(sn) ** R.e;
          pos.push(R.c[0] + R.side[0] * x + R.n[0] * y, R.c[1] + R.side[1] * x + R.n[1] * y, R.c[2] + R.side[2] * x + R.n[2] * y);
        }
      }
      const labelFor = (ri, shade) => {
        const { col, group } = colorKey(ri);
        return labels.get(`${group}|${shade}`, { chain: chain.id, color: col, shade, kind: 'cartoon', ss: ss[ri], group });
      };
      // Face classification per vertex slot k (edge k -> k+1) in the flat profile.
      const faceShade = new Array(K);
      for (let k = 0; k < K; k++) {
        const th = (2 * Math.PI * (k + 0.5)) / K + Math.PI / K;
        const sn = Math.sin(th);
        faceShade[k] = sn > 0.6 ? 'top' : sn < -0.6 ? 'bottom' : 'side';
      }
      for (let q = 0; q + 1 < rings.length; q++) {
        const Ra = rings[q], Rb = rings[q + 1];
        const a0 = ringBase[q], b0 = ringBase[q + 1];
        const flat = Ra.flat && Rb.flat;
        for (let k = 0; k < K; k++) {
          const k1 = (k + 1) % K;
          const lab = labelFor(Ra.ri, flat ? faceShade[k] : 'tube');
          tri.push(a0 + k, a0 + k1, b0 + k1, a0 + k, b0 + k1, b0 + k);
          triLabel.push(lab, lab);
        }
      }
      // End caps
      const cap = (q) => {
        const R = rings[q];
        const ci = pos.length / 3;
        pos.push(...R.c);
        const lab = labelFor(R.ri, R.flat ? 'side' : 'tube');
        for (let k = 0; k < K; k++) {
          tri.push(ci, ringBase[q] + k, ringBase[q] + ((k + 1) % K));
          triLabel.push(lab);
        }
      };
      cap(0);
      cap(rings.length - 1);

      // Nucleic acids: a stick ("rung") from the backbone to the base.
      for (let i = 0; i < n; i++) {
        const r = seg[i];
        if (!r.isNucleic) continue;
        const purine = /^D?[AGI]$/.test(r.resn.toUpperCase());
        let tip;
        for (const k of r.atoms) {
          const nm = A[k].name;
          if (nm === (purine ? 'N1' : 'N3')) { tip = P3(A[k]); break; }
        }
        if (!tip) continue;
        const base = P[i];
        const axis = sub(tip, base);
        const len = Math.hypot(...axis);
        if (len < 1) continue;
        const ax = scl(axis, 1 / len);
        let u = crs(ax, Math.abs(ax[0]) < 0.9 ? [1, 0, 0] : [0, 1, 0]);
        u = nrm(u);
        const v = crs(ax, u);
        const rr = tube * 1.6;
        const lab = labelFor(i, 'rung');
        const KS = 8;
        const b0 = pos.length / 3;
        for (const c of [base, tip]) {
          for (let k = 0; k < KS; k++) {
            const th = (2 * Math.PI * k) / KS;
            const x = Math.cos(th) * rr, y = Math.sin(th) * rr;
            pos.push(c[0] + u[0] * x + v[0] * y, c[1] + u[1] * x + v[1] * y, c[2] + u[2] * x + v[2] * y);
          }
        }
        const tipC = pos.length / 3;
        pos.push(...tip);
        for (let k = 0; k < KS; k++) {
          const k1 = (k + 1) % KS;
          tri.push(b0 + k, b0 + k1, b0 + KS + k1, b0 + k, b0 + KS + k1, b0 + KS + k);
          tri.push(tipC, b0 + KS + k, b0 + KS + k1);
          triLabel.push(lab, lab, lab);
        }
      }
    });
  }
  if (triLabel.length) {
    scene.mesh = { pos: new Float32Array(pos), tri: new Uint32Array(tri), triLabel: new Int32Array(triLabel) };
  }
}
