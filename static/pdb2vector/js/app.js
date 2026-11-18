import { parseStructure } from './parser.js';
import { buildModel, assignSecondaryStructure } from './structure.js';
import { buildScene, defaultChainColors, defaultEntityColors } from './scene.js';
import { PALETTES, SEQUENTIAL, SS_COLORS, MOLTYPE_COLORS, MOLTYPE_NAMES, gradientColor } from './colors.js';
import { rasterize } from './render.js';
import { vectorize } from './vectorize.js';
import { drawPreview } from './preview.js';
import { pcaRotation, axisAngle, mul, orthonormalize } from './view.js';

const $ = (id) => document.getElementById(id);

const state = {
  parsed: null,
  model: null,
  name: 'structure',
  source: null, // {type, id, assembly}
  R: null,
  chainColors: {},
  hidden: new Set(),
  palette: 'plotly',
  entityColors: {},
  molTypeColors: { ...MOLTYPE_COLORS },
  colorsTouched: false, // user picked a palette or chain colour themselves
  scene: null,
  result: null, // last vectorisation result
  dragging: false,
};

// --- Settings ------------------------------------------------------------------

function sceneOptions() {
  return {
    mode: $('mode').querySelector('.active').dataset.value,
    colorBy: $('color-by').value,
    gradient: $('gradient').value,
    singleColor: $('single-color').value,
    chainColors: state.chainColors,
    entityColors: state.entityColors,
    molTypeColors: state.molTypeColors,
    hiddenChains: [...state.hidden],
    ligands: $('ligands').checked,
    probe: +$('probe').value,
    residueOutlines: $('residue-outlines').checked,
    helixWidth: +$('helix-width').value,
    strandWidth: +$('strand-width').value,
    tubeRadius: +$('tube-radius').value,
  };
}

function shadingValue() {
  const v = $('shading').value;
  return v === 'bands' && sceneOptions().mode !== 'surface' ? 'depth' : v;
}

function styleOptions() {
  const res = +$('resolution').value;
  const k = res / 1200; // outline widths are specified for the default detail level
  return {
    outlineWidth: +$('outline-width').value * k,
    outlineColor: $('outline-color').value,
    backOutline: $('back-outline').checked,
    smooth: +$('smooth').value,
    tol: +$('tol').value,
    sigma: Math.max(0.8, k),
    shading: shadingValue(),
    bands: +$('bands').value,
    bandLines: $('band-lines').checked,
    shadeRange: +$('shade-range').value,
    fog: +$('fog').value,
    twoTone: $('two-tone').checked,
    background: $('background').value || null,
    title: `${state.name} ${sceneOptions().mode}`,
  };
}

// --- Worker --------------------------------------------------------------------

let worker = null;
let workerBusy = false;
let pendingJob = false;
let jobId = 0;
try {
  worker = new Worker(new URL('./worker.js', import.meta.url), { type: 'module' });
  worker.onmessage = (ev) => onVectorResult(ev.data);
  worker.onerror = () => { worker = null; workerBusy = false; };
} catch {
  worker = null;
}

function pushSceneToWorker() {
  if (worker) worker.postMessage({ type: 'scene', scene: state.scene });
}

function requestVector() {
  if (!state.scene) return;
  pendingJob = true;
  if (!workerBusy) dispatchVector();
}

function dispatchVector() {
  pendingJob = false;
  workerBusy = true;
  const id = ++jobId;
  $('busy').hidden = false;
  const job = { type: 'vectorize', id, R: state.R, size: +$('resolution').value, style: styleOptions() };
  if (worker) {
    worker.postMessage(job);
  } else {
    setTimeout(() => {
      try {
        const t0 = performance.now();
        const img = rasterize(state.scene, job.R, { size: job.size, fit: 'sphere' });
        const res = vectorize(img, state.scene, job.style);
        res.ms = Math.round(performance.now() - t0);
        onVectorResult({ type: 'result', id, ...res });
      } catch (e) {
        onVectorResult({ type: 'error', id, message: e.message });
      }
    }, 0);
  }
}

function onVectorResult(msg) {
  workerBusy = false;
  if (pendingJob) { dispatchVector(); return; }
  $('busy').hidden = true;
  if (msg.type === 'error') { showStatus(`Vectorization failed: ${msg.message}`, true); return; }
  state.result = msg;
  if (!state.dragging) showSVG();
  updateMeta();
}

function showSVG() {
  const host = $('svg-host');
  if (!state.result) return;
  host.innerHTML = state.result.svg;
  const svg = host.querySelector('svg');
  const [fw, fh] = state.result.frame;
  svg.setAttribute('viewBox', `0 0 ${fw} ${fh}`);
  svg.removeAttribute('width');
  svg.removeAttribute('height');
  host.hidden = false;
  $('preview').hidden = true;
  for (const b of ['copy-svg', 'download-svg', 'copy-png', 'download-png']) $(b).disabled = false;
}

function updateMeta() {
  const r = state.result;
  if (!r) { $('meta').textContent = ' '; return; }
  const kb = new Blob([r.svg]).size / 1024;
  $('meta').textContent = `${Math.round(r.width)} × ${Math.round(r.height)} px · ${r.regions} shapes · ${kb >= 1024 ? (kb / 1024).toFixed(1) + ' MB' : kb.toFixed(0) + ' KB'} · ${r.ms} ms`;
}

// --- Preview -------------------------------------------------------------------

let previewQueued = false;
function schedulePreview() {
  if (previewQueued) return;
  previewQueued = true;
  requestAnimationFrame(() => {
    previewQueued = false;
    if (!state.scene) return;
    const canvas = $('preview');
    const box = $('viewer').getBoundingClientRect();
    let size = Math.min(box.width, box.height) * Math.min(2, window.devicePixelRatio || 1);
    // keep large scenes interactive
    const heavy = (state.scene.mesh ? state.scene.mesh.triLabel.length / 4 : 0) + (state.scene.spheres ? state.scene.spheres.r.length : 0);
    const cap = heavy > 300000 ? 360 : heavy > 80000 ? 480 : 720;
    size = Math.max(200, Math.min(cap, Math.round(size)));
    drawPreview(canvas, state.scene, state.R, styleOptions(), size);
    canvas.hidden = false;
    $('svg-host').hidden = true;
  });
}

// --- Loading -------------------------------------------------------------------

function showStatus(html, error = false) {
  const s = $('status');
  s.hidden = false;
  s.classList.toggle('error', error);
  s.innerHTML = html;
}

async function fetchText(url) {
  const r = await fetch(url);
  if (!r.ok) throw new Error(r.status === 404 ? 'not found' : `HTTP ${r.status}`);
  return r.text();
}

async function loadRCSB(id, assembly) {
  id = id.trim().toUpperCase();
  if (!/^[0-9][A-Z0-9]{3}$/.test(id) && !/^PDB_[0-9A-Z]{8}$/.test(id)) {
    showStatus('Please enter a valid 4-character PDB ID (e.g. 4HHB).', true);
    return;
  }
  showStatus(`Fetching <b>${id}</b> from RCSB PDB…`);
  const file = assembly ? `${id}-assembly1.cif` : `${id}.cif`;
  try {
    const text = await fetchText(`https://files.rcsb.org/download/${file}`);
    await loadText(text, file, id, { type: 'pdb', id, assembly });
  } catch (e) {
    showStatus(`Could not load <b>${id}</b>${assembly ? ' (assembly 1)' : ''} from RCSB: ${e.message}.`, true);
  }
}

async function loadAFDB(acc) {
  acc = acc.trim().toUpperCase().replace(/^AF-/, '').replace(/-F1.*$/, '');
  if (!/^[A-Z0-9]{6,10}$/.test(acc)) {
    showStatus('Please enter a UniProt accession (e.g. P69905).', true);
    return;
  }
  showStatus(`Fetching <b>${acc}</b> from AlphaFold DB…`);
  try {
    let url = null;
    try {
      const r = await fetch(`https://alphafold.ebi.ac.uk/api/prediction/${acc}`);
      if (r.ok) {
        const js = await r.json();
        const entry = Array.isArray(js) ? js.find((e) => e.cifUrl) || js[0] : js;
        url = entry && (entry.cifUrl || entry.pdbUrl);
      } else if (r.status === 404) {
        throw new Error('no prediction for this accession');
      }
    } catch (e) {
      if (e.message.startsWith('no prediction')) throw e;
    }
    if (!url) url = `https://alphafold.ebi.ac.uk/files/AF-${acc}-F1-model_v6.cif`;
    const text = await fetchText(url);
    await loadText(text, url.split('/').pop(), `AF-${acc}`, { type: 'af', id: acc });
  } catch (e) {
    showStatus(`Could not load <b>${acc}</b> from AlphaFold DB: ${e.message}.`, true);
  }
}

async function loadFile(file) {
  showStatus(`Reading <b>${escapeHtml(file.name)}</b>…`);
  try {
    const text = await file.text();
    await loadText(text, file.name, file.name.replace(/\.(pdb|ent|cif|mmcif|txt)$/i, ''), { type: 'file' });
  } catch (e) {
    showStatus(`Could not read <b>${escapeHtml(file.name)}</b>: ${escapeHtml(e.message)}`, true);
  }
}

const escapeHtml = (s) => String(s).replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));

async function loadText(text, filename, name, source) {
  const parsed = parseStructure(text, filename);
  const model = buildModel(parsed);
  state.parsed = parsed;
  state.model = model;
  state.name = name.replace(/[^A-Za-z0-9_.-]/g, '_');
  state.source = source;
  if ($('ss-mode').value === 'compute') assignSecondaryStructure(model, parsed.ss, 'compute');
  state.chainColors = defaultChainColors(model, state.palette);
  state.entityColors = defaultEntityColors(model, state.palette);
  state.hidden = new Set();
  state.result = null;
  renderChainList();
  rebuildScene({ resetView: true });
  const poly = model.residues.filter((r) => r.isPolymer).length;
  const chains = model.chains.filter((c) => c.polymer).length;
  // Loaded-structure badge in the top-left corner of the canvas.
  const t = model.title ? model.title.trim() : '';
  const titleHtml = t ? `<span class="info-title" title="${escapeHtml(t)}">${escapeHtml(t.length > 90 ? t.slice(0, 88) + '…' : t)}</span>` : '';
  $('structure-info').innerHTML = `<b>${escapeHtml(name)}</b> · ${chains} chain${chains === 1 ? '' : 's'} · ${poly.toLocaleString()} residues${titleHtml}`;
  $('structure-info').hidden = false;
  $('status').hidden = true;
  $('empty').hidden = true;
  $('viewtools').hidden = false;
  $('hint').hidden = false;
  updateURL();
}

function updateURL() {
  const s = state.source;
  const p = new URLSearchParams();
  if (s && s.type === 'pdb') { p.set('pdb', s.id); if (s.assembly) p.set('assembly', '1'); }
  else if (s && s.type === 'af') p.set('af', s.id);
  const mode = sceneOptions().mode;
  if (s && s.type !== 'file' && mode !== 'surface') p.set('mode', mode);
  if (s && s.type !== 'file' && $('shading').value !== 'flat') p.set('shading', shadingValue());
  if (new URLSearchParams(location.search).get('embed') === '1') p.set('embed', '1');
  const q = p.toString();
  history.replaceState(null, '', q ? `?${q}` : location.pathname);
}

// --- Scene ---------------------------------------------------------------------

function rebuildScene({ resetView = false } = {}) {
  if (!state.model) return;
  state.scene = buildScene(state.model, sceneOptions());
  if (resetView || !state.R) {
    const pts = state.scene.mesh ? state.scene.mesh.pos : state.scene.spheres ? state.scene.spheres.xyz : new Float32Array(9);
    state.R = pcaRotation(pts);
  }
  pushSceneToWorker();
  if (!state.result) schedulePreview();
  requestVector();
}

let rebuildTimer = null;
function rebuildSoon() {
  clearTimeout(rebuildTimer);
  rebuildTimer = setTimeout(() => rebuildScene(), 120);
}
let vectorTimer = null;
function vectorSoon() {
  clearTimeout(vectorTimer);
  vectorTimer = setTimeout(requestVector, 120);
}

// --- Chain list ----------------------------------------------------------------

// Colour/visibility chips: one per chain, entity or molecule type depending on
// the colour mode. Visibility always acts on the underlying chains.
function colorGroups() {
  const m = state.model;
  const by = $('color-by').value;
  if (by === 'entity') {
    return m.entities.map((e) => {
      const name = e.description ? e.description.replace(/\s+/g, ' ') : `Entity ${e.id}`;
      return {
        key: e.id, label: name.length > 34 ? name.slice(0, 32) + '…' : name, sub: e.chains.join(', '), wide: true,
        title: `${name} · ${MOLTYPE_NAMES[e.molType] || e.molType} · chains ${e.chains.join(', ')}`,
        chains: e.chains, colors: state.entityColors,
      };
    });
  }
  if (by === 'moltype') {
    return ['protein', 'dna', 'rna'].map((t) => ({ t, chains: m.chains.filter((c) => c.polymer && c.molType === t).map((c) => c.id) }))
      .filter((g) => g.chains.length)
      .map((g) => ({ key: g.t, label: MOLTYPE_NAMES[g.t], sub: `${g.chains.length} chain${g.chains.length > 1 ? 's' : ''}`, wide: true, title: `chains ${g.chains.join(', ')}`, chains: g.chains, colors: state.molTypeColors }));
  }
  return m.chains.filter((c) => c.polymer || $('ligands').checked).map((c) => ({
    key: c.id, label: c.id, title: `Chain ${c.id} · ${c.length} residues`, chains: [c.id], colors: by === 'chain' ? state.chainColors : null,
  }));
}

function renderChainList() {
  const host = $('chains');
  host.innerHTML = '';
  if (!state.model) return;
  const colorBy = $('color-by').value;
  const groups = colorGroups();
  for (const g of groups) {
    const chip = document.createElement('label');
    const off = g.chains.every((id) => state.hidden.has(id));
    chip.className = 'chip' + (off ? ' off' : '') + (g.wide ? ' wide' : '');
    chip.title = g.title;
    const cb = document.createElement('input');
    cb.type = 'checkbox';
    cb.checked = !off;
    cb.addEventListener('change', () => {
      for (const id of g.chains) { if (cb.checked) state.hidden.delete(id); else state.hidden.add(id); }
      chip.classList.toggle('off', !cb.checked);
      rebuildSoon();
    });
    const name = document.createElement('span');
    name.className = 'cname';
    name.textContent = g.label;
    if (g.sub) {
      const sub = document.createElement('span');
      sub.className = 'csub';
      sub.textContent = g.sub;
      name.append(sub);
    }
    chip.append(cb, name);
    if (g.colors) {
      const col = document.createElement('input');
      col.type = 'color';
      col.value = g.colors[g.key];
      col.addEventListener('input', () => { g.colors[g.key] = col.value; state.colorsTouched = true; rebuildSoon(); });
      chip.append(col);
    }
    host.append(chip);
  }
  const paletteModes = colorBy === 'chain' || colorBy === 'entity';
  $('chain-actions').hidden = groups.length < 2;
  $('chains-shuffle').hidden = !paletteModes;
  $('palette-wrap').hidden = !paletteModes;
  $('gradient-wrap').hidden = colorBy !== 'rainbow';
}

function updateLegend() {
  const by = $('color-by').value;
  const lg = $('ss-legend');
  $('single-wrap').hidden = by !== 'single';
  if (by === 'ss') {
    lg.innerHTML = `<span><i style="background:${SS_COLORS.H}"></i>Helix</span><span><i style="background:${SS_COLORS.E}"></i>Strand</span><span><i style="background:${SS_COLORS.C}"></i>Loop</span>`;
    lg.hidden = false;
  } else if (by === 'plddt') {
    lg.innerHTML = '<span><i style="background:#0053D6"></i>&gt;90</span><span><i style="background:#65CBF3"></i>70–90</span><span><i style="background:#FFDB13"></i>50–70</span><span><i style="background:#FF7D45"></i>&lt;50</span>';
    lg.hidden = false;
  } else lg.hidden = true;
  // Gradient preview for N -> C colouring and sequential chain palettes.
  const ramp = $('ramp');
  const name = by === 'rainbow' ? $('gradient').value : (by === 'chain' || by === 'entity') && SEQUENTIAL[$('palette').value] ? $('palette').value : null;
  if (name) {
    const stops = Array.from({ length: 11 }, (_, i) => gradientColor(name, i / 10)).join(', ');
    ramp.style.background = `linear-gradient(90deg, ${stops})`;
    ramp.dataset.left = by === 'rainbow' ? 'N' : `first ${by}`;
    ramp.dataset.right = by === 'rainbow' ? 'C' : `last ${by}`;
    ramp.hidden = false;
  } else ramp.hidden = true;
}

// --- Interaction ---------------------------------------------------------------

function rotateBy(R) {
  state.R = orthonormalize(mul(R, state.R));
}

function setupViewer() {
  const v = $('viewer');
  let last = null;
  let moved = false;
  v.addEventListener('pointerdown', (e) => {
    if (!state.scene || e.target.closest('.viewtools')) return;
    v.setPointerCapture(e.pointerId);
    last = { x: e.clientX, y: e.clientY };
    moved = false;
    state.dragging = true;
    v.classList.add('dragging');
  });
  v.addEventListener('pointermove', (e) => {
    if (!last) return;
    const dx = e.clientX - last.x, dy = e.clientY - last.y;
    if (!dx && !dy) return;
    last = { x: e.clientX, y: e.clientY };
    moved = true;
    const k = Math.PI / Math.max(300, Math.min(v.clientWidth, v.clientHeight));
    if (e.shiftKey) rotateBy(axisAngle(0, 0, 1, -dx * k));
    else rotateBy(mul(axisAngle(1, 0, 0, dy * k), axisAngle(0, 1, 0, dx * k)));
    schedulePreview();
  });
  const end = () => {
    if (!last) return;
    last = null;
    state.dragging = false;
    v.classList.remove('dragging');
    if (moved) requestVector();
  };
  v.addEventListener('pointerup', end);
  v.addEventListener('pointercancel', end);
  let wheelTimer = null;
  v.addEventListener('wheel', (e) => {
    if (!state.scene) return;
    e.preventDefault();
    rotateBy(axisAngle(0, 0, 1, -e.deltaY * 0.003));
    schedulePreview();
    clearTimeout(wheelTimer);
    wheelTimer = setTimeout(requestVector, 200);
  }, { passive: false });

  $('viewtools').addEventListener('click', (e) => {
    const b = e.target.closest('[data-rot]');
    if (!b || !state.scene) return;
    const r = b.dataset.rot;
    if (r === 'reset') {
      const pts = state.scene.mesh ? state.scene.mesh.pos : state.scene.spheres.xyz;
      state.R = pcaRotation(pts);
    } else {
      const axis = r[0];
      const ang = (parseFloat(r.slice(1)) * Math.PI) / 180;
      rotateBy(axisAngle(axis === 'x' ? 1 : 0, axis === 'y' ? 1 : 0, axis === 'z' ? 1 : 0, ang));
    }
    schedulePreview();
    requestVector();
  });
}

// --- Export --------------------------------------------------------------------

function toast(msg) {
  const t = $('toast');
  t.textContent = msg;
  t.classList.add('show');
  clearTimeout(toast.timer);
  toast.timer = setTimeout(() => t.classList.remove('show'), 2200);
}

function fileBase() {
  return `${state.name}_${sceneOptions().mode}`;
}

function download(blob, name) {
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = name;
  document.body.append(a);
  a.click();
  a.remove();
  setTimeout(() => URL.revokeObjectURL(url), 1000);
}

function svgToPng() {
  return new Promise((resolve, reject) => {
    const r = state.result;
    const scale = Math.max(1, Math.min(4, 2400 / Math.max(r.width, r.height)));
    const img = new Image();
    const url = URL.createObjectURL(new Blob([r.svg], { type: 'image/svg+xml' }));
    img.onload = () => {
      const c = document.createElement('canvas');
      c.width = Math.round(r.width * scale);
      c.height = Math.round(r.height * scale);
      const ctx = c.getContext('2d');
      ctx.drawImage(img, 0, 0, c.width, c.height);
      URL.revokeObjectURL(url);
      c.toBlob((b) => (b ? resolve(b) : reject(new Error('PNG encoding failed'))), 'image/png');
    };
    img.onerror = () => { URL.revokeObjectURL(url); reject(new Error('Could not render SVG')); };
    img.src = url;
  });
}

function setupExport() {
  $('download-svg').addEventListener('click', () => {
    if (state.result) download(new Blob([state.result.svg], { type: 'image/svg+xml' }), `${fileBase()}.svg`);
  });
  $('copy-svg').addEventListener('click', async () => {
    if (!state.result) return;
    try {
      await navigator.clipboard.writeText(state.result.svg);
      toast('SVG markup copied — paste into Illustrator, Inkscape, Figma…');
    } catch {
      toast('Clipboard not available in this browser');
    }
  });
  $('download-png').addEventListener('click', async () => {
    if (!state.result) return;
    try { download(await svgToPng(), `${fileBase()}.png`); } catch (e) { toast(e.message); }
  });
  $('copy-png').addEventListener('click', async () => {
    if (!state.result) return;
    try {
      await navigator.clipboard.write([new ClipboardItem({ 'image/png': svgToPng() })]);
      toast('PNG copied to clipboard');
    } catch {
      toast('Copying images is not supported in this browser');
    }
  });
}

// --- Controls ------------------------------------------------------------------

function setupControls() {
  // tabs
  document.querySelectorAll('.tab').forEach((t) => t.addEventListener('click', () => {
    document.querySelectorAll('.tab').forEach((x) => x.classList.toggle('active', x === t));
    document.querySelectorAll('.tabpane').forEach((p) => p.classList.toggle('active', p.dataset.pane === t.dataset.tab));
  }));
  $('form-rcsb').addEventListener('submit', (e) => { e.preventDefault(); loadRCSB($('pdb-id').value, $('pdb-assembly').checked); });
  $('form-afdb').addEventListener('submit', (e) => { e.preventDefault(); loadAFDB($('af-id').value); });
  document.querySelectorAll('[data-pdb]').forEach((a) => a.addEventListener('click', (e) => {
    e.preventDefault();
    $('pdb-id').value = a.dataset.pdb;
    $('pdb-assembly').checked = !!a.dataset.assembly;
    loadRCSB(a.dataset.pdb, !!a.dataset.assembly);
  }));
  document.querySelectorAll('[data-af]').forEach((a) => a.addEventListener('click', (e) => {
    e.preventDefault();
    $('af-id').value = a.dataset.af;
    loadAFDB(a.dataset.af);
  }));
  // upload
  const drop = $('drop');
  $('file').addEventListener('change', (e) => { if (e.target.files[0]) loadFile(e.target.files[0]); e.target.value = ''; });
  for (const ev of ['dragenter', 'dragover']) drop.addEventListener(ev, (e) => { e.preventDefault(); drop.classList.add('over'); });
  for (const ev of ['dragleave', 'drop']) drop.addEventListener(ev, (e) => { e.preventDefault(); drop.classList.remove('over'); });
  drop.addEventListener('drop', (e) => { const f = e.dataTransfer.files[0]; if (f) loadFile(f); });
  // allow dropping files anywhere on the viewer too
  const v = $('viewer');
  v.addEventListener('dragover', (e) => e.preventDefault());
  v.addEventListener('drop', (e) => { e.preventDefault(); const f = e.dataTransfer.files[0]; if (f) loadFile(f); });

  // representation
  $('mode').addEventListener('click', (e) => {
    const b = e.target.closest('button');
    if (!b || b.classList.contains('active')) return;
    $('mode').querySelectorAll('button').forEach((x) => x.classList.toggle('active', x === b));
    syncVisibility();
    rebuildScene();
    updateURL();
  });
  $('color-by').addEventListener('change', () => { renderChainList(); updateLegend(); rebuildScene(); });
  $('single-color').addEventListener('input', rebuildSoon);
  $('ligands').addEventListener('change', () => { renderChainList(); rebuildScene(); });
  $('residue-outlines').addEventListener('change', () => rebuildScene());
  $('shading').addEventListener('change', () => {
    syncVisibility();
    // Depth styles look best with Goodsell's soft pastels.
    if ($('shading').value !== 'flat' && !state.colorsTouched && state.palette !== 'goodsell') {
      setPalette('goodsell');
      rebuildScene();
    } else {
      requestVector();
    }
    updateURL();
  });
  $('gradient').addEventListener('change', () => { updateLegend(); rebuildScene(); });
  $('palette').addEventListener('change', () => {
    state.colorsTouched = true;
    setPalette($('palette').value);
    updateLegend();
    rebuildScene();
  });
  $('ss-mode').addEventListener('change', () => {
    if (!state.model) return;
    assignSecondaryStructure(state.model, state.parsed.ss, $('ss-mode').value);
    rebuildScene();
  });
  $('chains-all').addEventListener('click', () => { state.hidden.clear(); renderChainList(); rebuildScene(); });
  $('chains-shuffle').addEventListener('click', () => {
    const byEntity = $('color-by').value === 'entity';
    const count = byEntity ? state.model.entities.length : state.model.chains.filter((c) => c.polymer).length;
    const n = SEQUENTIAL[state.palette] ? count : PALETTES[state.palette].length;
    const offset = 1 + Math.floor(Math.random() * Math.max(1, n - 1));
    if (byEntity) state.entityColors = defaultEntityColors(state.model, state.palette, offset);
    else state.chainColors = defaultChainColors(state.model, state.palette, offset);
    renderChainList();
    rebuildScene();
  });

  const sliders = [
    ['probe', 'probe-out', (v) => `${(+v).toFixed(1)} Å`, 'scene'],
    ['bands', 'bands-out', (v) => v, 'style'],
    ['shade-range', 'range-out', (v) => `${Math.round(v * 100)}%`, 'style'],
    ['helix-width', 'helix-out', (v) => `${(2 * v).toFixed(1)} Å`, 'scene'],
    ['strand-width', 'strand-out', (v) => `${(2 * v).toFixed(1)} Å`, 'scene'],
    ['tube-radius', 'tube-out', (v) => `${(2 * v).toFixed(1)} Å`, 'scene'],
    ['outline-width', 'outline-out', (v) => `${v} px`, 'style'],
    ['fog', 'fog-out', (v) => `${Math.round(v * 100)}%`, 'style'],
    ['resolution', 'res-out', (v) => `${v} px`, 'style'],
    ['smooth', 'smooth-out', (v) => (+v).toFixed(1), 'style'],
    ['tol', 'tol-out', (v) => `${(+v).toFixed(1)} px`, 'style'],
  ];
  for (const [id, out, fmt, kind] of sliders) {
    const el = $(id);
    const sync = () => { $(out).textContent = fmt(el.value); };
    sync();
    el.addEventListener('input', () => { sync(); if (kind === 'scene') rebuildSoon(); else vectorSoon(); });
  }
  for (const id of ['outline-color', 'two-tone', 'back-outline', 'background', 'band-lines']) {
    $(id).addEventListener(id === 'outline-color' ? 'input' : 'change', vectorSoon);
  }
}

function setPalette(name) {
  state.palette = name;
  $('palette').value = name;
  if (state.model) {
    state.chainColors = defaultChainColors(state.model, name);
    state.entityColors = defaultEntityColors(state.model, name);
    renderChainList();
  }
  updateLegend();
}

function syncVisibility() {
  const mode = $('mode').querySelector('.active').dataset.value;
  document.querySelectorAll('[data-show]').forEach((el) => { el.hidden = el.dataset.show !== mode; });
  // Depth contours only exist for surfaces.
  const bandsOpt = $('shading').querySelector('[data-only=surface]');
  bandsOpt.disabled = mode !== 'surface';
  bandsOpt.hidden = mode !== 'surface';
  if (mode !== 'surface' && $('shading').value === 'bands') $('shading').value = 'depth';
  const sh = $('shading').value;
  document.querySelectorAll('[data-show-shading]').forEach((el) => { el.hidden = !el.dataset.showShading.split(' ').includes(sh); });
}

function initFromURL() {
  const p = new URLSearchParams(location.search);
  let framed = false;
  try { framed = window.self !== window.top; } catch { framed = true; }
  if (p.get('embed') === '1' || framed) document.body.classList.add('embed');
  const shading = p.get('shading');
  if (['flat', 'bands', 'depth'].includes(shading)) {
    $('shading').value = shading;
    if (shading !== 'flat') setPalette('goodsell');
  }
  const mode = p.get('mode');
  if (mode === 'cartoon' || mode === 'surface') {
    $('mode').querySelectorAll('button').forEach((x) => x.classList.toggle('active', x.dataset.value === mode));
  }
  syncVisibility();
  if (p.get('pdb')) {
    $('pdb-id').value = p.get('pdb');
    $('pdb-assembly').checked = p.get('assembly') === '1';
    loadRCSB(p.get('pdb'), p.get('assembly') === '1');
  } else if (p.get('af')) {
    document.querySelector('.tab[data-tab=afdb]').click();
    $('af-id').value = p.get('af');
    loadAFDB(p.get('af'));
  }
}

// Same "N icons" counter as the bioicons.com start page; silently skipped
// where the icon index is not available (local dev, other hosts).
function loadIconCount() {
  fetch('/icons/icons.json')
    .then((r) => (r.ok ? r.json() : null))
    .then((icons) => {
      if (!Array.isArray(icons) || !icons.length) return;
      $('icon-count-n').textContent = icons.length;
      $('icon-count').hidden = false;
    })
    .catch(() => {});
}

setupControls();
setupViewer();
setupExport();
updateLegend();
initFromURL();
if (!document.body.classList.contains('embed')) {
  if ('requestIdleCallback' in window) requestIdleCallback(loadIconCount, { timeout: 3000 });
  else setTimeout(loadIconCount, 1500);
}
window.addEventListener('resize', () => { if (state.scene && !$('preview').hidden) schedulePreview(); });
