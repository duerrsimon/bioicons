// Rotation helpers. Matrices are row-major arrays of 9 numbers.

export const IDENTITY = [1, 0, 0, 0, 1, 0, 0, 0, 1];

export function mul(A, B) {
  const C = new Array(9);
  for (let i = 0; i < 3; i++) for (let j = 0; j < 3; j++) {
    C[3 * i + j] = A[3 * i] * B[j] + A[3 * i + 1] * B[3 + j] + A[3 * i + 2] * B[6 + j];
  }
  return C;
}

export function axisAngle(ax, ay, az, angle) {
  const l = Math.hypot(ax, ay, az) || 1;
  const x = ax / l, y = ay / l, z = az / l;
  const c = Math.cos(angle), s = Math.sin(angle), t = 1 - c;
  return [
    t * x * x + c, t * x * y - s * z, t * x * z + s * y,
    t * x * y + s * z, t * y * y + c, t * y * z - s * x,
    t * x * z - s * y, t * y * z + s * x, t * z * z + c,
  ];
}

// Re-orthonormalise to avoid drift after many incremental rotations.
export function orthonormalize(R) {
  const n = (v) => { const l = Math.hypot(...v) || 1; return v.map((x) => x / l); };
  const a = n([R[0], R[1], R[2]]);
  let b = [R[3], R[4], R[5]];
  const d = a[0] * b[0] + a[1] * b[1] + a[2] * b[2];
  b = n([b[0] - d * a[0], b[1] - d * a[1], b[2] - d * a[2]]);
  const c = [a[1] * b[2] - a[2] * b[1], a[2] * b[0] - a[0] * b[2], a[0] * b[1] - a[1] * b[0]];
  return [...a, ...b, ...c];
}

// Jacobi eigen-decomposition of a symmetric 3x3 matrix.
function eigSym3(m) {
  const a = [[m[0], m[1], m[2]], [m[3], m[4], m[5]], [m[6], m[7], m[8]]];
  const v = [[1, 0, 0], [0, 1, 0], [0, 0, 1]];
  for (let sweep = 0; sweep < 50; sweep++) {
    let off = Math.abs(a[0][1]) + Math.abs(a[0][2]) + Math.abs(a[1][2]);
    if (off < 1e-10) break;
    for (let p = 0; p < 2; p++) for (let q = p + 1; q < 3; q++) {
      if (Math.abs(a[p][q]) < 1e-12) continue;
      const theta = (a[q][q] - a[p][p]) / (2 * a[p][q]);
      const t = Math.sign(theta || 1) / (Math.abs(theta) + Math.sqrt(theta * theta + 1));
      const c = 1 / Math.sqrt(t * t + 1), s = t * c;
      for (let k = 0; k < 3; k++) {
        const akp = a[k][p], akq = a[k][q];
        a[k][p] = c * akp - s * akq; a[k][q] = s * akp + c * akq;
      }
      for (let k = 0; k < 3; k++) {
        const apk = a[p][k], aqk = a[q][k];
        a[p][k] = c * apk - s * aqk; a[q][k] = s * apk + c * aqk;
      }
      for (let k = 0; k < 3; k++) {
        const vkp = v[k][p], vkq = v[k][q];
        v[k][p] = c * vkp - s * vkq; v[k][q] = s * vkp + c * vkq;
      }
    }
  }
  const vals = [a[0][0], a[1][1], a[2][2]];
  const vecs = [0, 1, 2].map((j) => [v[0][j], v[1][j], v[2][j]]);
  const idx = [0, 1, 2].sort((i, j) => vals[j] - vals[i]);
  return { values: idx.map((i) => vals[i]), vectors: idx.map((i) => vecs[i]) };
}

// Principal-axes view: longest axis horizontal, second vertical.
export function pcaRotation(points) {
  const n = points.length / 3;
  if (n < 3) return IDENTITY.slice();
  let cx = 0, cy = 0, cz = 0;
  for (let i = 0; i < n; i++) { cx += points[3 * i]; cy += points[3 * i + 1]; cz += points[3 * i + 2]; }
  cx /= n; cy /= n; cz /= n;
  const C = new Array(9).fill(0);
  for (let i = 0; i < n; i++) {
    const x = points[3 * i] - cx, y = points[3 * i + 1] - cy, z = points[3 * i + 2] - cz;
    C[0] += x * x; C[1] += x * y; C[2] += x * z; C[4] += y * y; C[5] += y * z; C[8] += z * z;
  }
  C[3] = C[1]; C[6] = C[2]; C[7] = C[5];
  const { vectors } = eigSym3(C);
  const a = vectors[0], b = vectors[1];
  const c = [a[1] * b[2] - a[2] * b[1], a[2] * b[0] - a[0] * b[2], a[0] * b[1] - a[1] * b[0]];
  return [...a, ...b, ...c];
}
