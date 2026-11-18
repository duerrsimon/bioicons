// Off-main-thread vectorisation so the UI stays responsive.
import { rasterize } from './render.js';
import { vectorize } from './vectorize.js';

let scene = null;

self.onmessage = (ev) => {
  const msg = ev.data;
  if (msg.type === 'scene') {
    scene = msg.scene;
    return;
  }
  if (msg.type === 'vectorize') {
    try {
      const t0 = performance.now();
      const img = rasterize(scene, msg.R, { size: msg.size, fit: 'sphere' });
      const res = vectorize(img, scene, msg.style);
      res.ms = Math.round(performance.now() - t0);
      self.postMessage({ type: 'result', id: msg.id, ...res });
    } catch (err) {
      self.postMessage({ type: 'error', id: msg.id, message: String(err && err.message || err) });
    }
  }
};
