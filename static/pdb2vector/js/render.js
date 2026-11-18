// Software rasteriser producing a label buffer (which region is visible at each
// pixel) and a depth buffer. Spheres (atoms) and triangles (cartoon mesh) share
// one z-buffer, so occlusion between them is exact.
//
// View convention: rotation matrix R (row-major, 9 numbers). Screen x = row0·p,
// screen y = -(row1·p) (SVG y grows downwards), depth z = row2·p (larger = closer).

export function rotatePoints(scene, R) {
  const out = {};
  const cx = scene.center[0], cy = scene.center[1], cz = scene.center[2];
  const tr = (src) => {
    const n = src.length / 3;
    const dst = new Float32Array(src.length);
    for (let i = 0; i < n; i++) {
      const x = src[3 * i] - cx, y = src[3 * i + 1] - cy, z = src[3 * i + 2] - cz;
      dst[3 * i] = R[0] * x + R[1] * y + R[2] * z;
      dst[3 * i + 1] = -(R[3] * x + R[4] * y + R[5] * z);
      dst[3 * i + 2] = R[6] * x + R[7] * y + R[8] * z;
    }
    return dst;
  };
  if (scene.spheres) out.spheres = tr(scene.spheres.xyz);
  if (scene.mesh) out.mesh = tr(scene.mesh.pos);
  return out;
}

// opts.size: longest side in px. opts.fit: 'tight' crops to the content,
// 'sphere' uses a fixed square frame based on the bounding sphere (stable while rotating).
export function rasterize(scene, R, opts = {}) {
  const size = opts.size || 1000;
  const margin = opts.margin ?? 0.03;
  const rot = rotatePoints(scene, R);
  const S = scene.spheres, M = scene.mesh;

  let minX = Infinity, minY = Infinity, maxX = -Infinity, maxY = -Infinity;
  let minZ = Infinity, maxZ = -Infinity;
  if (S) {
    const p = rot.spheres;
    for (let i = 0, n = S.r.length; i < n; i++) {
      const r = S.r[i];
      const x = p[3 * i], y = p[3 * i + 1], z = p[3 * i + 2];
      if (x - r < minX) minX = x - r; if (x + r > maxX) maxX = x + r;
      if (y - r < minY) minY = y - r; if (y + r > maxY) maxY = y + r;
      if (z - r < minZ) minZ = z - r; if (z + r > maxZ) maxZ = z + r;
    }
  }
  if (M) {
    const p = rot.mesh;
    for (let i = 0, n = p.length / 3; i < n; i++) {
      const x = p[3 * i], y = p[3 * i + 1], z = p[3 * i + 2];
      if (x < minX) minX = x; if (x > maxX) maxX = x;
      if (y < minY) minY = y; if (y > maxY) maxY = y;
      if (z < minZ) minZ = z; if (z > maxZ) maxZ = z;
    }
  }
  if (!Number.isFinite(minX)) { minX = minY = minZ = -1; maxX = maxY = maxZ = 1; }

  let scale, w, h, ox, oy;
  if (opts.fit === 'sphere') {
    const rad = scene.radius * (opts.zoom ? 1 / opts.zoom : 1);
    scale = size / (2 * rad * (1 + margin));
    w = h = size;
    ox = size / 2; oy = size / 2;
  } else {
    const ex = maxX - minX, ey = maxY - minY;
    const m = Math.max(ex, ey) * margin;
    scale = size / (Math.max(ex, ey) + 2 * m);
    w = Math.max(1, Math.ceil((ex + 2 * m) * scale));
    h = Math.max(1, Math.ceil((ey + 2 * m) * scale));
    ox = (m - minX) * scale; oy = (m - minY) * scale;
  }

  const label = new Int32Array(w * h).fill(-1);
  const depth = new Float32Array(w * h).fill(-Infinity);

  if (S) {
    const p = rot.spheres;
    for (let i = 0, n = S.r.length; i < n; i++) {
      const sx = p[3 * i] * scale + ox, sy = p[3 * i + 1] * scale + oy, sz = p[3 * i + 2];
      const r = S.r[i];
      const rp = r * scale;
      const rp2 = rp * rp;
      const lab = S.label[i];
      let x0 = Math.floor(sx - rp), x1 = Math.ceil(sx + rp);
      let y0 = Math.floor(sy - rp), y1 = Math.ceil(sy + rp);
      if (x0 < 0) x0 = 0; if (y0 < 0) y0 = 0; if (x1 > w - 1) x1 = w - 1; if (y1 > h - 1) y1 = h - 1;
      const inv = 1 / scale;
      for (let y = y0; y <= y1; y++) {
        const dy = y + 0.5 - sy;
        const dy2 = dy * dy;
        if (dy2 > rp2) continue;
        let row = y * w;
        for (let x = x0; x <= x1; x++) {
          const dx = x + 0.5 - sx;
          const d2 = dx * dx + dy2;
          if (d2 > rp2) continue;
          const z = sz + Math.sqrt(rp2 - d2) * inv;
          const k = row + x;
          if (z > depth[k]) { depth[k] = z; label[k] = lab; }
        }
      }
    }
  }

  if (M) {
    const p = rot.mesh;
    const nv = p.length / 3;
    const X = new Float32Array(nv), Y = new Float32Array(nv), Z = new Float32Array(nv);
    for (let i = 0; i < nv; i++) {
      X[i] = p[3 * i] * scale + ox; Y[i] = p[3 * i + 1] * scale + oy; Z[i] = p[3 * i + 2];
    }
    const T = M.tri, TL = M.triLabel;
    for (let t = 0, nt = TL.length; t < nt; t++) {
      const a = T[3 * t], b = T[3 * t + 1], c = T[3 * t + 2];
      const ax = X[a], ay = Y[a], bx = X[b], by = Y[b], cx = X[c], cy = Y[c];
      const area = (bx - ax) * (cy - ay) - (by - ay) * (cx - ax);
      if (area === 0 || !Number.isFinite(area)) continue;
      let x0 = Math.max(0, Math.floor(Math.min(ax, bx, cx)));
      let x1 = Math.min(w - 1, Math.ceil(Math.max(ax, bx, cx)));
      let y0 = Math.max(0, Math.floor(Math.min(ay, by, cy)));
      let y1 = Math.min(h - 1, Math.ceil(Math.max(ay, by, cy)));
      if (x0 > x1 || y0 > y1) continue;
      const invA = 1 / area;
      const az = Z[a], bz = Z[b], cz = Z[c];
      const lab = TL[t];
      for (let y = y0; y <= y1; y++) {
        const py = y + 0.5;
        const row = y * w;
        for (let x = x0; x <= x1; x++) {
          const px = x + 0.5;
          // barycentric weights
          const w0 = ((bx - px) * (cy - py) - (by - py) * (cx - px)) * invA;
          if (w0 < 0) continue;
          const w1 = ((cx - px) * (ay - py) - (cy - py) * (ax - px)) * invA;
          if (w1 < 0) continue;
          const w2 = 1 - w0 - w1;
          if (w2 < 0) continue;
          const z = w0 * az + w1 * bz + w2 * cz;
          const k = row + x;
          if (z > depth[k]) { depth[k] = z; label[k] = lab; }
        }
      }
    }
  }

  return { w, h, label, depth, scale, zmin: minZ, zmax: maxZ };
}
