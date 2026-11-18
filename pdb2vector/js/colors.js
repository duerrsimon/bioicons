// Color helpers and palettes.

// Plotly's default qualitative palette (plotly.colors.qualitative.Plotly).
export const CHAIN_PALETTE = [
  '#636EFA', '#EF553B', '#00CC96', '#AB63FA', '#FFA15A', '#19D3F3', '#FF6692', '#B6E880', '#FF97FF', '#FECB52',
];

// Soft pastels in the spirit of David Goodsell's illustrations; they leave
// headroom for lightening towards the viewer and darkening towards the back.
export const GOODSELL_PALETTE = [
  '#8FB4DE', '#F09E94', '#F3D27C', '#A8D49A', '#C6A9DA', '#F4B67A', '#94D0CB', '#E9A1C2',
  '#C9BE85', '#AFC0D8', '#E3B9A0', '#9EC7AE', '#D7B0E0', '#B9D98C', '#F2C6A6', '#9DB6C9',
];

// seaborn's qualitative palettes (seaborn.color_palette(name)).
export const SEABORN = {
  deep: ['#4C72B0', '#DD8452', '#55A868', '#C44E52', '#8172B3', '#937860', '#DA8BC3', '#8C8C8C', '#CCB974', '#64B5CD'],
  muted: ['#4878D0', '#EE854A', '#6ACC64', '#D65F5F', '#956CB4', '#8C613C', '#DC7EC0', '#797979', '#D5BB67', '#82C6E2'],
  pastel: ['#A1C9F4', '#FFB482', '#8DE5A1', '#FF9F9B', '#D0BBFF', '#DEBB9B', '#FAB0E4', '#CFCFCF', '#FFFEA3', '#B9F2F0'],
  bright: ['#023EFF', '#FF7C00', '#1AC938', '#E8000B', '#8B2BE2', '#9F4800', '#F14CC1', '#A3A3A3', '#FFC400', '#00D7FF'],
  colorblind: ['#0173B2', '#DE8F05', '#029E73', '#D55E00', '#CC78BC', '#CA9161', '#FBAFE4', '#949494', '#ECE133', '#56B4E9'],
};

export const PALETTES = { plotly: CHAIN_PALETTE, goodsell: GOODSELL_PALETTE, ...SEABORN };

// Perceptually uniform sequential colormaps (matplotlib anchors at 0, 1/8, ... 1).
// lo/hi trim the ends that would vanish against black outlines or a white page.
export const SEQUENTIAL = {
  viridis: { lo: 0.05, hi: 1, stops: ['#440154', '#472d7b', '#3b528b', '#2c728e', '#21918c', '#28ae80', '#5ec962', '#addc30', '#fde725'] },
  cividis: { lo: 0.05, hi: 1, stops: ['#00224e', '#123570', '#3b496c', '#575d6d', '#707173', '#8a8678', '#a59c74', '#c3b369', '#fee838'] },
  magma: { lo: 0.18, hi: 0.95, stops: ['#000004', '#1c1044', '#4f127b', '#812581', '#b5367a', '#e55964', '#fb8761', '#fec287', '#fcfdbf'] },
};

// Colour at t in [0,1] of a sequential map (t is rescaled into the map's lo..hi).
export function sampleSequential(name, t) {
  const m = SEQUENTIAL[name];
  t = m.lo + (m.hi - m.lo) * Math.max(0, Math.min(1, t));
  const x = t * (m.stops.length - 1);
  const i = Math.min(m.stops.length - 2, Math.floor(x));
  return mix(m.stops[i], m.stops[i + 1], x - i);
}

// n evenly spaced colours from a sequential map (one colour -> the middle).
export function sequentialColors(name, n) {
  if (n <= 1) return [sampleSequential(name, 0.5)];
  return Array.from({ length: n }, (_, i) => sampleSequential(name, i / (n - 1)));
}

// Gradient used for N -> C colouring: the rainbow ramp or a sequential map.
export function gradientColor(name, t) {
  return SEQUENTIAL[name] ? sampleSequential(name, t) : rainbow(t);
}

export const SS_COLORS = { H: '#E8684A', E: '#F6BD16', C: '#B8BFCB' };
export const LIGAND_COLOR = '#8C8C8C';
export const MOLTYPE_COLORS = { protein: '#636EFA', dna: '#FFA15A', rna: '#00CC96', ligand: LIGAND_COLOR };
export const MOLTYPE_NAMES = { protein: 'Protein', dna: 'DNA', rna: 'RNA', ligand: 'Ligand' };
export const NUCLEIC_COLOR = '#F6BD16';

export function hexToRgb(hex) {
  let h = hex.replace('#', '');
  if (h.length === 3) h = h.split('').map((c) => c + c).join('');
  const v = parseInt(h, 16);
  return [(v >> 16) & 255, (v >> 8) & 255, v & 255];
}

export function rgbToHex([r, g, b]) {
  const c = (x) => Math.max(0, Math.min(255, Math.round(x))).toString(16).padStart(2, '0');
  return '#' + c(r) + c(g) + c(b);
}

export function mix(hexA, hexB, t) {
  const a = hexToRgb(hexA), b = hexToRgb(hexB);
  return rgbToHex([a[0] + (b[0] - a[0]) * t, a[1] + (b[1] - a[1]) * t, a[2] + (b[2] - a[2]) * t]);
}

export const darken = (hex, t) => mix(hex, '#000000', t);
export const lighten = (hex, t) => mix(hex, '#ffffff', t);

// Smooth rainbow (blue -> red), sampled from a turbo-like ramp.
const RAINBOW = ['#3B4CC0', '#3E8FD8', '#2CB5C1', '#4CC38A', '#A3CC4E', '#E9C23B', '#F28C38', '#D8433B'];
export function rainbow(t) {
  t = Math.max(0, Math.min(1, t));
  const x = t * (RAINBOW.length - 1);
  const i = Math.min(RAINBOW.length - 2, Math.floor(x));
  return mix(RAINBOW[i], RAINBOW[i + 1], x - i);
}

export function plddtColor(b) {
  if (b > 90) return '#0053D6';
  if (b > 70) return '#65CBF3';
  if (b > 50) return '#FFDB13';
  return '#FF7D45';
}

// --- HLS lightness shading (same model as cellscape's shade_from_color) ---------

export function rgbToHls([r, g, b]) {
  r /= 255; g /= 255; b /= 255;
  const max = Math.max(r, g, b), min = Math.min(r, g, b);
  const l = (max + min) / 2;
  if (max === min) return [0, l, 0];
  const d = max - min;
  const s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
  let h;
  if (max === r) h = ((g - b) / d + (g < b ? 6 : 0));
  else if (max === g) h = (b - r) / d + 2;
  else h = (r - g) / d + 4;
  return [h / 6, l, s];
}

export function hlsToRgb([h, l, s]) {
  if (s === 0) return [l * 255, l * 255, l * 255];
  const q = l < 0.5 ? l * (1 + s) : l + s - l * s;
  const p = 2 * l - q;
  const f = (t) => {
    if (t < 0) t += 1;
    if (t > 1) t -= 1;
    if (t < 1 / 6) return p + (q - p) * 6 * t;
    if (t < 1 / 2) return q;
    if (t < 2 / 3) return p + (q - p) * (2 / 3 - t) * 6;
    return p;
  };
  return [f(h + 1 / 3) * 255, f(h) * 255, f(h - 1 / 3) * 255];
}

// --- OKLab (perceptual) lightness shading -------------------------------------

const lin = (c) => { c /= 255; return c <= 0.04045 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4; };
const unlin = (c) => 255 * (c <= 0.0031308 ? 12.92 * c : 1.055 * c ** (1 / 2.4) - 0.055);

export function rgbToOklab([r, g, b]) {
  r = lin(r); g = lin(g); b = lin(b);
  const l = Math.cbrt(0.4122214708 * r + 0.5363325363 * g + 0.0514459929 * b);
  const m = Math.cbrt(0.2119034982 * r + 0.6806995451 * g + 0.1073969566 * b);
  const s = Math.cbrt(0.0883024619 * r + 0.2817188376 * g + 0.6299787005 * b);
  return [
    0.2104542553 * l + 0.793617785 * m - 0.0040720468 * s,
    1.9779984951 * l - 2.428592205 * m + 0.4505937099 * s,
    0.0259040371 * l + 0.7827717662 * m - 0.808675766 * s,
  ];
}

function oklabToLinear([L, a, b]) {
  const l = (L + 0.3963377774 * a + 0.2158037573 * b) ** 3;
  const m = (L - 0.1055613458 * a - 0.0638541728 * b) ** 3;
  const s = (L - 0.0894841775 * a - 1.291485548 * b) ** 3;
  return [
    4.0767416621 * l - 3.3077115913 * m + 0.2309699292 * s,
    -1.2684380046 * l + 2.6097574011 * m - 0.3413193965 * s,
    -0.0041960863 * l - 0.7034186147 * m + 1.707614701 * s,
  ];
}

// Convert back to sRGB, reducing chroma (not lightness) until the colour fits.
export function oklabToRgb([L, a, b]) {
  L = Math.max(0, Math.min(1, L));
  let k = 1;
  for (let it = 0; it < 24; it++) {
    const c = oklabToLinear([L, a * k, b * k]);
    if (c.every((v) => v >= -1e-4 && v <= 1 + 1e-4)) return c.map((v) => unlin(Math.max(0, Math.min(1, v))));
    k *= 0.9;
  }
  return oklabToLinear([L, 0, 0]).map((v) => unlin(Math.max(0, Math.min(1, v))));
}

// Depth shading. x in [0,1]: 0 = back (darker), 1 = front (lighter).
// Perceptual lightness moves by `range` across the depth span while hue and
// chroma are kept, so colours stay recognisably "the chain colour" from back
// to front - the soft, even look of Goodsell's illustrations rather than
// washing out to white or turning muddy. The base colour sits slightly in
// front of the middle (x = 0.6), which is where most of the surface is.
export function shadeDepth(hex, x, range) {
  const [L, a, b] = rgbToOklab(hexToRgb(hex));
  let Ln = L + range * (x - 0.6);
  Ln = Math.min(0.97, Math.max(0.2, Ln));
  // a little extra chroma at the back keeps darker tones rich rather than muddy
  const c = 1 + 0.12 * (1 - x);
  return rgbToHex(oklabToRgb([Ln, a * c, b * c]));
}
