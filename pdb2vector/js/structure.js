// Build a residue/chain model from parsed atoms and assign secondary structure.

const AMINO = new Set([
  'ALA', 'ARG', 'ASN', 'ASP', 'CYS', 'GLN', 'GLU', 'GLY', 'HIS', 'ILE', 'LEU', 'LYS', 'MET', 'PHE', 'PRO', 'SER',
  'THR', 'TRP', 'TYR', 'VAL', 'MSE', 'SEC', 'PYL', 'UNK', 'HSD', 'HSE', 'HSP', 'HID', 'HIE', 'HIP', 'CYX', 'ASH', 'GLH', 'LYN',
]);
const NUCLEIC = new Set(['A', 'C', 'G', 'U', 'T', 'DA', 'DC', 'DG', 'DT', 'DU', 'I', 'DI', 'N']);

export function buildModel(parsed) {
  const { atoms } = parsed;
  const residues = [];
  const chains = new Map();
  let cur = null;
  for (let i = 0; i < atoms.length; i++) {
    const a = atoms[i];
    if (!cur || cur.chain !== a.chain || cur.resi !== a.resi || cur.icode !== a.icode || cur.resn !== a.resn) {
      cur = {
        index: residues.length,
        chain: a.chain,
        resi: a.resi,
        icode: a.icode,
        resn: a.resn,
        atoms: [],
        het: a.het,
        ss: 'C',
        b: 0,
      };
      residues.push(cur);
      if (!chains.has(a.chain)) chains.set(a.chain, { id: a.chain, residues: [], atomCount: 0 });
      chains.get(a.chain).residues.push(cur);
    }
    a.residue = cur.index;
    cur.atoms.push(i);
    chains.get(a.chain).atomCount++;
    if (a.name === 'CA') cur.ca = i;
    else if (a.name === 'N') cur.n = i;
    else if (a.name === 'C') cur.c = i;
    else if (a.name === 'O' || a.name === 'OT1') { if (cur.o === undefined) cur.o = i; }
    else if (a.name === 'P') cur.p = i;
    else if (a.name === "C4'" || a.name === 'C4*') cur.c4 = i;
  }

  for (const r of residues) {
    const resn = r.resn.toUpperCase();
    r.isProtein = r.ca !== undefined && (AMINO.has(resn) || (r.n !== undefined && r.c !== undefined));
    r.isNucleic = !r.isProtein && (NUCLEIC.has(resn) || r.c4 !== undefined) && (r.p !== undefined || r.c4 !== undefined);
    r.isPolymer = r.isProtein || r.isNucleic;
    r.isLigand = !r.isPolymer;
    if (r.isProtein) r.b = atoms[r.ca].b;
    else r.b = r.atoms.reduce((s, k) => s + atoms[k].b, 0) / r.atoms.length;
    // Trace atom used for cartoon backbone.
    r.trace = r.isProtein ? r.ca : r.isNucleic ? (r.p ?? r.c4) : undefined;
  }

  // Order chains by first appearance; mark which ones contain a polymer.
  const chainList = [...chains.values()];
  for (const c of chainList) {
    c.polymer = c.residues.some((r) => r.isPolymer);
    c.protein = c.residues.some((r) => r.isProtein);
    c.length = c.residues.filter((r) => r.isPolymer).length;
  }

  const model = { atoms, residues, chains: chainList, title: parsed.title || '' };
  assignEntities(model, parsed.entities || {});
  assignSecondaryStructure(model, parsed.ss);
  return model;
}

function dist(a, b) {
  const dx = a.x - b.x, dy = a.y - b.y, dz = a.z - b.z;
  return Math.sqrt(dx * dx + dy * dy + dz * dz);
}

// Two polymer residues are bonded neighbours along the chain.
export function connected(model, r1, r2) {
  if (!r1 || !r2 || r1.chain !== r2.chain) return false;
  const a = model.atoms;
  if (r1.isProtein && r2.isProtein) {
    if (r1.c !== undefined && r2.n !== undefined) return dist(a[r1.c], a[r2.n]) < 2.0;
    return dist(a[r1.ca], a[r2.ca]) < 4.3;
  }
  if (r1.isNucleic && r2.isNucleic) return dist(a[r1.trace], a[r2.trace]) < 8.5;
  return false;
}

export function assignSecondaryStructure(model, fileSS, mode = 'auto') {
  for (const r of model.residues) r.ss = 'C';
  let usedFile = false;
  if (mode !== 'compute' && fileSS && fileSS.length) {
    // Assembly files suffix chain ids (A-2); map back to the asymmetric unit id.
    const byChain = new Map();
    for (const s of fileSS) {
      if (!byChain.has(s.chain)) byChain.set(s.chain, []);
      byChain.get(s.chain).push(s);
    }
    for (const r of model.residues) {
      if (!r.isProtein) continue;
      const list = byChain.get(r.chain) || byChain.get(r.chain.split('-')[0]);
      if (!list) continue;
      for (const s of list) {
        if (r.resi >= s.start && r.resi <= s.end) {
          if (s.type === 'H' || r.ss === 'C') r.ss = s.type;
        }
      }
    }
    usedFile = model.residues.some((r) => r.ss !== 'C');
  }
  if (!usedFile) computeDSSP(model);
  model.ssSource = usedFile ? 'file' : 'computed';
  cleanSS(model);
}

// Remove one-residue helices/strands which render poorly.
function cleanSS(model) {
  for (const c of model.chains) {
    const rs = c.residues.filter((r) => r.isProtein);
    for (let i = 0; i < rs.length; i++) {
      const s = rs[i].ss;
      if (s === 'C') continue;
      let j = i;
      while (j + 1 < rs.length && rs[j + 1].ss === s && connected(model, rs[j], rs[j + 1])) j++;
      const len = j - i + 1;
      if ((s === 'H' && len < 3) || (s === 'E' && len < 2)) for (let k = i; k <= j; k++) rs[k].ss = 'C';
      i = j;
    }
  }
}

// --- Simplified DSSP (Kabsch & Sander H-bond energy) -----------------------

export function computeDSSP(model) {
  const A = model.atoms;
  const res = model.residues.filter((r) => r.isProtein);
  const n = res.length;
  if (!n) return;
  const hasBackbone = res.filter((r) => r.n !== undefined && r.c !== undefined && r.o !== undefined).length > 0.8 * n;
  if (!hasBackbone) {
    caOnlySS(model, res);
    return;
  }
  // H positions
  const H = new Array(n);
  const prevConn = new Array(n).fill(false);
  for (let i = 0; i < n; i++) {
    const r = res[i];
    if (r.n === undefined) continue;
    const N = A[r.n];
    if (i > 0 && connected(model, res[i - 1], r) && res[i - 1].c !== undefined && res[i - 1].o !== undefined && r.resn !== 'PRO') {
      const C = A[res[i - 1].c], O = A[res[i - 1].o];
      let dx = C.x - O.x, dy = C.y - O.y, dz = C.z - O.z;
      const l = Math.hypot(dx, dy, dz) || 1;
      H[i] = { x: N.x + dx / l, y: N.y + dy / l, z: N.z + dz / l };
      prevConn[i] = true;
    }
  }
  const conn = new Array(n).fill(false); // conn[i]: i and i+1 bonded
  for (let i = 0; i + 1 < n; i++) conn[i] = connected(model, res[i], res[i + 1]);

  // Spatial hash on CA
  const cell = 9;
  const grid = new Map();
  const key = (x, y, z) => `${x},${y},${z}`;
  for (let i = 0; i < n; i++) {
    const ca = A[res[i].ca];
    const k = key(Math.floor(ca.x / cell), Math.floor(ca.y / cell), Math.floor(ca.z / cell));
    if (!grid.has(k)) grid.set(k, []);
    grid.get(k).push(i);
  }
  // hb: Set of i*n+j meaning CO(i) ... HN(j)
  const hb = new Set();
  for (let j = 0; j < n; j++) {
    if (!H[j]) continue;
    const Nj = A[res[j].n];
    const Hj = H[j];
    const ca = A[res[j].ca];
    const gx = Math.floor(ca.x / cell), gy = Math.floor(ca.y / cell), gz = Math.floor(ca.z / cell);
    let best1 = 0, best1i = -1, best2 = 0, best2i = -1;
    for (let ox = -1; ox <= 1; ox++) for (let oy = -1; oy <= 1; oy++) for (let oz = -1; oz <= 1; oz++) {
      const list = grid.get(key(gx + ox, gy + oy, gz + oz));
      if (!list) continue;
      for (const i of list) {
        if (i === j || (Math.abs(i - j) < 2 && res[i].chain === res[j].chain)) continue;
        const ri = res[i];
        if (ri.c === undefined || ri.o === undefined) continue;
        const cai = A[ri.ca];
        if (dist(cai, ca) > 9) continue;
        const C = A[ri.c], O = A[ri.o];
        const rON = dist(O, Nj), rCH = dist(C, Hj), rOH = dist(O, Hj), rCN = dist(C, Nj);
        if (rON < 0.5 || rCH < 0.5 || rOH < 0.5 || rCN < 0.5) continue;
        const e = 27.888 * (1 / rON + 1 / rCH - 1 / rOH - 1 / rCN);
        if (e < -0.5) {
          if (e < best1) { best2 = best1; best2i = best1i; best1 = e; best1i = i; }
          else if (e < best2) { best2 = e; best2i = i; }
        }
      }
    }
    if (best1i >= 0) hb.add(best1i * n + j);
    if (best2i >= 0) hb.add(best2i * n + j);
  }
  const HB = (i, j) => i >= 0 && j >= 0 && i < n && j < n && hb.has(i * n + j);
  const contiguous = (i, k) => {
    // residues i..i+k all chain-connected
    if (i < 0 || i + k >= n) return false;
    for (let m = i; m < i + k; m++) if (!conn[m]) return false;
    return true;
  };

  const ss = new Array(n).fill('C');
  // Alpha helices: 4-turns at i-1 and i -> residues i..i+3 helical
  const turn4 = new Array(n).fill(false);
  for (let i = 0; i + 4 < n; i++) if (contiguous(i, 4) && HB(i, i + 4)) turn4[i] = true;
  for (let i = 1; i + 3 < n; i++) {
    if (turn4[i - 1] && turn4[i]) for (let k = i; k <= i + 3; k++) ss[k] = 'H';
  }
  // Bridges
  const bridged = new Array(n).fill(0);
  const partners = Array.from({ length: n }, () => []);
  for (let i = 1; i + 1 < n; i++) {
    if (!contiguous(i - 1, 2)) continue;
    const ca = A[res[i].ca];
    const gx = Math.floor(ca.x / cell), gy = Math.floor(ca.y / cell), gz = Math.floor(ca.z / cell);
    for (let ox = -1; ox <= 1; ox++) for (let oy = -1; oy <= 1; oy++) for (let oz = -1; oz <= 1; oz++) {
      const list = grid.get(key(gx + ox, gy + oy, gz + oz));
      if (!list) continue;
      for (const j of list) {
        if (j <= i + 2 && res[j].chain === res[i].chain && j > i - 3) continue;
        if (j < 1 || j + 1 >= n || !contiguous(j - 1, 2)) continue;
        const par = (HB(i - 1, j) && HB(j, i + 1)) || (HB(j - 1, i) && HB(i, j + 1));
        const anti = (HB(i, j) && HB(j, i)) || (HB(i - 1, j + 1) && HB(j - 1, i + 1));
        if (par || anti) {
          bridged[i] = 1;
          partners[i].push(j);
        }
      }
    }
  }
  // Strand = bridge that is part of a ladder (neighbouring residue also bridged
  // to a neighbour of the partner); fill single-residue bulges.
  for (let i = 0; i < n; i++) {
    if (!bridged[i] || ss[i] === 'H') continue;
    let ladder = false;
    for (const j of partners[i]) {
      for (const d of [-1, 1]) {
        if (i + d >= 0 && i + d < n && partners[i + d] && partners[i + d].some((p) => Math.abs(p - j) <= 2 && p !== j)) ladder = true;
      }
    }
    if (ladder) ss[i] = 'E';
  }
  for (let i = 1; i + 1 < n; i++) {
    if (ss[i] === 'C' && ss[i - 1] === 'E' && ss[i + 1] === 'E' && conn[i - 1] && conn[i]) ss[i] = 'E';
  }
  for (let i = 0; i < n; i++) res[i].ss = ss[i];
}

// CA-only fallback: helix if i..i+3 CA distances look helical, strand if extended
// and close to another extended segment.
function caOnlySS(model, res) {
  const A = model.atoms;
  const n = res.length;
  const ca = res.map((r) => A[r.ca]);
  const ss = new Array(n).fill('C');
  for (let i = 0; i + 4 < n; i++) {
    let ok = true;
    for (let k = i; k < i + 4; k++) if (!connected(model, res[k], res[k + 1])) ok = false;
    if (!ok) continue;
    const d2 = dist(ca[i], ca[i + 2]), d3 = dist(ca[i], ca[i + 3]), d4 = dist(ca[i], ca[i + 4]);
    if (Math.abs(d2 - 5.4) < 0.6 && Math.abs(d3 - 5.0) < 0.8 && Math.abs(d4 - 6.2) < 0.8) for (let k = i; k <= i + 4; k++) ss[k] = 'H';
  }
  const ext = new Array(n).fill(false);
  for (let i = 1; i + 1 < n; i++) {
    if (ss[i] !== 'C') continue;
    if (connected(model, res[i - 1], res[i]) && connected(model, res[i], res[i + 1]) && dist(ca[i - 1], ca[i + 1]) > 6.2) ext[i] = true;
  }
  for (let i = 0; i < n; i++) {
    if (!ext[i]) continue;
    for (let j = 0; j < n; j++) {
      if (Math.abs(i - j) < 3 || !ext[j]) continue;
      const d = dist(ca[i], ca[j]);
      if (d > 4.2 && d < 5.6) { ss[i] = 'E'; break; }
    }
  }
  for (let i = 0; i < n; i++) res[i].ss = ss[i];
}

// --- Entities and molecule types ---------------------------------------------

const DNA_RES = new Set(['DA', 'DC', 'DG', 'DT', 'DU', 'DI']);

// Molecule type of a residue: protein, dna, rna or ligand.
export function residueMolType(r) {
  if (r.isProtein) return 'protein';
  if (r.isNucleic) return DNA_RES.has(r.resn.toUpperCase()) ? 'dna' : 'rna';
  return 'ligand';
}

// Group polymer chains into entities. mmCIF files label them directly
// (label_entity_id); for PDB files chains with an identical sequence are grouped.
function assignEntities(model, fileEntities) {
  const A = model.atoms;
  const entities = new Map();
  const bySeq = new Map();
  let auto = 0;
  for (const c of model.chains) {
    const poly = c.residues.filter((r) => r.isPolymer);
    const types = new Map();
    for (const r of poly) { const t = residueMolType(r); types.set(t, (types.get(t) || 0) + 1); }
    c.molType = poly.length ? [...types.entries()].sort((a, b) => b[1] - a[1])[0][0] : 'ligand';
    if (!poly.length) { c.entity = null; continue; }
    // most common entity id among the chain's polymer atoms
    const counts = new Map();
    for (const r of poly) {
      const e = A[r.atoms[0]].entity;
      if (e && e !== '?' && e !== '.') counts.set(e, (counts.get(e) || 0) + 1);
    }
    let id;
    if (counts.size) {
      id = [...counts.entries()].sort((a, b) => b[1] - a[1])[0][0];
    } else {
      const seq = poly.map((r) => r.resn).join('-');
      if (!bySeq.has(seq)) bySeq.set(seq, String(++auto));
      id = bySeq.get(seq);
    }
    c.entity = id;
    if (!entities.has(id)) {
      const fe = fileEntities[id] || {};
      entities.set(id, { id, description: fe.description || '', polyType: fe.polyType || '', molType: c.molType, chains: [] });
    }
    entities.get(id).chains.push(c.id);
  }
  for (const r of model.residues) {
    const c = model.chains.find((x) => x.id === r.chain);
    r.entity = r.isPolymer ? c.entity : null;
  }
  model.entities = [...entities.values()];
}
