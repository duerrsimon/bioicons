// Structure file parsing (PDB and mmCIF) -> flat atom list.
// Only the first model is kept, waters are dropped, and for alternate
// locations only the first conformer is kept.

const WATER = new Set(['HOH', 'WAT', 'DOD', 'H2O', 'SOL', 'TIP', 'TIP3']);

function keepAltloc(alt) {
  return alt === '' || alt === '.' || alt === '?' || alt === 'A' || alt === '1';
}

function guessElement(name, resn) {
  const n = name.replace(/[^A-Za-z]/g, '');
  if (!n) return 'C';
  // Common two-letter ions are written as the residue name.
  const two = n.slice(0, 2).toUpperCase();
  if (['FE', 'ZN', 'MG', 'MN', 'CA', 'CL', 'NA', 'CU', 'CO', 'NI', 'BR', 'SE'].includes(two) && resn && resn.toUpperCase() === two) {
    return two[0] + two[1].toLowerCase();
  }
  return n[0].toUpperCase();
}

export function parsePDB(text) {
  const atoms = [];
  const helices = [];
  const sheets = [];
  let title = '';
  let modelSeen = false;
  const lines = text.split(/\r?\n/);
  for (const line of lines) {
    const rec = line.slice(0, 6);
    if (rec === 'MODEL ') {
      if (modelSeen) break;
      modelSeen = true;
      continue;
    }
    if (rec === 'ENDMDL') break;
    if (rec === 'TITLE ') {
      title += line.slice(10).trim() + ' ';
      continue;
    }
    if (rec === 'HELIX ') {
      helices.push({
        chain: line.slice(19, 20).trim(),
        start: parseInt(line.slice(21, 25), 10),
        end: parseInt(line.slice(33, 37), 10),
      });
      continue;
    }
    if (rec === 'SHEET ') {
      sheets.push({
        chain: line.slice(21, 22).trim(),
        start: parseInt(line.slice(22, 26), 10),
        end: parseInt(line.slice(33, 37), 10),
      });
      continue;
    }
    if (rec !== 'ATOM  ' && rec !== 'HETATM') continue;
    const alt = line.slice(16, 17).trim();
    if (!keepAltloc(alt)) continue;
    const resn = line.slice(17, 20).trim();
    if (WATER.has(resn)) continue;
    const name = line.slice(12, 16).trim();
    let elem = line.length >= 78 ? line.slice(76, 78).trim() : '';
    if (!elem) elem = guessElement(name, resn);
    elem = elem[0].toUpperCase() + elem.slice(1).toLowerCase();
    if (elem === 'H' || elem === 'D') continue;
    atoms.push({
      het: rec === 'HETATM',
      name,
      resn,
      chain: line.slice(21, 22).trim() || 'A',
      resi: parseInt(line.slice(22, 26), 10),
      icode: line.slice(26, 27).trim(),
      x: parseFloat(line.slice(30, 38)),
      y: parseFloat(line.slice(38, 46)),
      z: parseFloat(line.slice(46, 54)),
      b: parseFloat(line.slice(60, 66)) || 0,
      elem,
    });
  }
  const ss = [];
  for (const h of helices) ss.push({ ...h, type: 'H' });
  for (const s of sheets) ss.push({ ...s, type: 'E' });
  return { atoms, ss, title: title.trim() };
}

// --- mmCIF -----------------------------------------------------------------

function tokenize(line) {
  const out = [];
  let i = 0;
  const n = line.length;
  while (i < n) {
    const c = line[i];
    if (c === ' ' || c === '\t') { i++; continue; }
    if (c === "'" || c === '"') {
      // Quoted token: ends at a matching quote followed by whitespace/EOL.
      let j = i + 1;
      while (j < n && !(line[j] === c && (j + 1 === n || line[j + 1] === ' ' || line[j + 1] === '\t'))) j++;
      out.push(line.slice(i + 1, j));
      i = j + 1;
      continue;
    }
    let j = i;
    while (j < n && line[j] !== ' ' && line[j] !== '\t') j++;
    out.push(line.slice(i, j));
    i = j;
  }
  return out;
}

// Parse every loop_ category in the file into {category: {fields, rows}}.
// Only categories in `wanted` are materialised.
function parseCifLoops(text, wanted) {
  const lines = text.split(/\r?\n/);
  const result = {};
  const single = {};
  let i = 0;
  const n = lines.length;
  while (i < n) {
    const line = lines[i].trim();
    if (line === 'loop_') {
      i++;
      const fields = [];
      while (i < n && lines[i].trimStart().startsWith('_')) {
        fields.push(lines[i].trim());
        i++;
      }
      const cat = fields.length ? fields[0].split('.')[0] : '';
      const keep = wanted.has(cat);
      const rows = [];
      let buf = [];
      while (i < n) {
        const l = lines[i];
        const t = l.trimStart();
        if (t.startsWith('_') || t.startsWith('loop_') || t.startsWith('data_')) break;
        if (t.startsWith('#')) { i++; if (buf.length === 0) break; continue; }
        if (l.startsWith(';')) {
          // Multi-line text field.
          let txt = l.slice(1);
          i++;
          while (i < n && !lines[i].startsWith(';')) { txt += '\n' + lines[i]; i++; }
          i++;
          if (keep) buf.push(txt);
        } else {
          if (keep) {
            const toks = tokenize(l);
            for (const tk of toks) buf.push(tk);
          }
          i++;
        }
        if (keep) {
          while (buf.length >= fields.length) {
            rows.push(buf.slice(0, fields.length));
            buf = buf.slice(fields.length);
          }
        }
      }
      if (keep) {
        const names = fields.map((f) => f.split('.').slice(1).join('.'));
        result[cat] = { fields: names, rows };
      }
      continue;
    }
    if (line.startsWith('_')) {
      // key value pairs (non-loop categories)
      const toks = tokenize(line);
      const key = toks[0];
      let val = toks.length > 1 ? toks.slice(1).join(' ') : null;
      i++;
      if (val === null && i < n) {
        if (lines[i].startsWith(';')) {
          let txt = lines[i].slice(1);
          i++;
          while (i < n && !lines[i].startsWith(';')) { txt += ' ' + lines[i]; i++; }
          i++;
          val = txt;
        } else {
          val = tokenize(lines[i]).join(' ');
          i++;
        }
      }
      const cat = key.split('.')[0];
      if (wanted.has(cat)) {
        (single[cat] ||= {})[key.split('.').slice(1).join('.')] = val;
      }
      continue;
    }
    i++;
  }
  // Single-valued categories become one-row loops.
  for (const [cat, kv] of Object.entries(single)) {
    if (!result[cat]) result[cat] = { fields: Object.keys(kv), rows: [Object.values(kv)] };
  }
  return result;
}

export function parseCIF(text) {
  const cats = parseCifLoops(text, new Set(['_atom_site', '_struct_conf', '_struct_sheet_range', '_struct', '_entity', '_entity_poly']));
  const site = cats._atom_site;
  if (!site) throw new Error('No _atom_site records found in mmCIF file');
  const f = Object.fromEntries(site.fields.map((name, idx) => [name, idx]));
  const col = (row, ...names) => {
    for (const nm of names) if (f[nm] !== undefined) return row[f[nm]];
    return undefined;
  };
  const atoms = [];
  let firstModel = null;
  for (const row of site.rows) {
    const model = col(row, 'pdbx_PDB_model_num');
    if (model !== undefined) {
      if (firstModel === null) firstModel = model;
      else if (model !== firstModel) continue;
    }
    const alt = col(row, 'label_alt_id') || '';
    if (!keepAltloc(alt)) continue;
    const resn = col(row, 'auth_comp_id', 'label_comp_id') || 'UNK';
    if (WATER.has(resn)) continue;
    const name = col(row, 'auth_atom_id', 'label_atom_id') || '';
    let elem = col(row, 'type_symbol') || '';
    if (!elem || elem === '?' || elem === '.') elem = guessElement(name, resn);
    elem = elem[0].toUpperCase() + elem.slice(1).toLowerCase();
    if (elem === 'H' || elem === 'D') continue;
    let resiStr = col(row, 'auth_seq_id', 'label_seq_id');
    if (resiStr === '.' || resiStr === '?') resiStr = col(row, 'label_seq_id');
    let resi = parseInt(resiStr, 10);
    if (Number.isNaN(resi)) resi = 0;
    const ic = col(row, 'pdbx_PDB_ins_code') || '';
    atoms.push({
      het: col(row, 'group_PDB') === 'HETATM',
      name,
      resn,
      chain: col(row, 'auth_asym_id', 'label_asym_id') || 'A',
      resi,
      icode: ic === '?' || ic === '.' ? '' : ic,
      x: parseFloat(col(row, 'Cartn_x')),
      y: parseFloat(col(row, 'Cartn_y')),
      z: parseFloat(col(row, 'Cartn_z')),
      b: parseFloat(col(row, 'B_iso_or_equiv')) || 0,
      elem,
      entity: col(row, 'label_entity_id'),
    });
  }

  // Entity names and polymer types, keyed by entity id.
  const entities = {};
  const loop = (cat) => {
    const c = cats[cat];
    if (!c) return [];
    return c.rows.map((row) => Object.fromEntries(c.fields.map((f, i) => [f, row[i]])));
  };
  const clean = (v) => (v && v !== '?' && v !== '.' ? v : '');
  for (const e of loop('_entity')) {
    entities[e.id] = { id: e.id, description: clean(e.pdbx_description), kind: clean(e.type) };
  }
  for (const p of loop('_entity_poly')) {
    (entities[p.entity_id] ||= { id: p.entity_id, description: '', kind: 'polymer' }).polyType = clean(p.type);
  }

  const ss = [];
  const readRanges = (cat, type, typeFilter) => {
    const c = cats[cat];
    if (!c) return;
    const g = Object.fromEntries(c.fields.map((name, idx) => [name, idx]));
    for (const row of c.rows) {
      if (typeFilter && g.conf_type_id !== undefined && !typeFilter(row[g.conf_type_id])) continue;
      const chain = row[g.beg_auth_asym_id ?? g.beg_label_asym_id];
      const start = parseInt(row[g.beg_auth_seq_id ?? g.beg_label_seq_id], 10);
      const end = parseInt(row[g.end_auth_seq_id ?? g.end_label_seq_id], 10);
      if (chain && !Number.isNaN(start) && !Number.isNaN(end)) ss.push({ chain, start, end, type });
    }
  };
  readRanges('_struct_conf', 'H', (t) => /^HELX/.test(t || ''));
  readRanges('_struct_sheet_range', 'E');

  let title = '';
  if (cats._struct) {
    const k = cats._struct.fields.indexOf('title');
    if (k >= 0) title = cats._struct.rows[0][k] || '';
  }
  return { atoms, ss, title, entities };
}

export function parseStructure(text, filename = '') {
  const lower = filename.toLowerCase();
  const isCif = lower.endsWith('.cif') || lower.endsWith('.mmcif') || /^data_/m.test(text.slice(0, 2000)) || text.includes('_atom_site.');
  const res = isCif ? parseCIF(text) : parsePDB(text);
  if (!res.atoms.length) throw new Error('No atoms found in file');
  return res;
}
