// Fast raster preview drawn while the user rotates the molecule.
import { rasterize } from './render.js';
import { hexToRgb } from './colors.js';
import { labelStats, labelFills, bandColor, depthModel, STYLE_DEFAULTS } from './vectorize.js';

export function drawPreview(canvas, scene, R, styleIn, size) {
  const style = { ...STYLE_DEFAULTS, ...styleIn };
  const img = rasterize(scene, R, { size, fit: 'sphere' });
  const { w, h, label, depth } = img;
  if (canvas.width !== w || canvas.height !== h) { canvas.width = w; canvas.height = h; }
  const ctx = canvas.getContext('2d');
  const data = ctx.createImageData(w, h);
  const px = data.data;
  const { st } = labelStats(img, scene.labels.length);
  const bands = scene.mode === 'surface' && style.shading === 'bands' && style.bands > 1 ? style.bands : 0;
  const dm = depthModel(img, bands);
  const fills = labelFills(scene.labels, st, dm, style);
  const th = dm.thresholds;
  // Pre-compute rgb for each label (and each band).
  const rgb = fills.map((c) => {
    if (!bands) return [hexToRgb(c)];
    return Array.from({ length: bands }, (_, b) => hexToRgb(bandColor(c, b, bands, style.shadeRange)));
  });
  const oc = hexToRgb(style.outlineColor);
  const outline = style.outlineWidth > 0;
  for (let y = 0; y < h; y++) {
    for (let x = 0; x < w; x++) {
      const k = y * w + x;
      const L = label[k];
      if (L < 0) continue;
      let c;
      const edge = outline && (x === 0 || y === 0 || x === w - 1 || y === h - 1 ||
        label[k - 1] !== L || label[k + 1] !== L || label[k - w] !== L || label[k + w] !== L);
      if (edge) c = oc;
      else if (bands) {
        let b = 0;
        while (b < th.length && depth[k] >= th[b]) b++;
        c = rgb[L][b];
      }
      else c = rgb[L][0];
      const p = 4 * k;
      px[p] = c[0]; px[p + 1] = c[1]; px[p + 2] = c[2]; px[p + 3] = 255;
    }
  }
  ctx.putImageData(data, 0, 0);
}
