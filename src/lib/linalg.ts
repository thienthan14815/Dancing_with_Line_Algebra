// linalg.ts — thư viện Đại số tuyến tính tự viết cho LinAlgLab
// Quy ước: Vec là mảng số 1 chiều, Mat là mảng 2 chiều row-major (Mat[i] = hàng i).

export type Vec = number[];
export type Mat = number[][];

const EPS = 1e-10;

// ---------------------------------------------------------------------------
// Vector operations
// ---------------------------------------------------------------------------

export function add(a: Vec, b: Vec): Vec {
  return a.map((x, i) => x + b[i]);
}

export function sub(a: Vec, b: Vec): Vec {
  return a.map((x, i) => x - b[i]);
}

export function scale(a: Vec, s: number): Vec {
  return a.map((x) => x * s);
}

export function dot(a: Vec, b: Vec): number {
  return a.reduce((acc, x, i) => acc + x * b[i], 0);
}

export function cross3(a: Vec, b: Vec): Vec {
  return [
    a[1] * b[2] - a[2] * b[1],
    a[2] * b[0] - a[0] * b[2],
    a[0] * b[1] - a[1] * b[0],
  ];
}

export function norm(a: Vec): number {
  return Math.sqrt(dot(a, a));
}

export function normalize(a: Vec): Vec {
  const n = norm(a);
  if (n < EPS) return a.map(() => 0);
  return a.map((x) => x / n);
}

export function angleBetween(a: Vec, b: Vec): number {
  const na = norm(a);
  const nb = norm(b);
  if (na < EPS || nb < EPS) return 0;
  let c = dot(a, b) / (na * nb);
  c = Math.max(-1, Math.min(1, c));
  return Math.acos(c);
}

// Hình chiếu của a lên b
export function project(a: Vec, b: Vec): Vec {
  const bb = dot(b, b);
  if (bb < EPS) return b.map(() => 0);
  const k = dot(a, b) / bb;
  return scale(b, k);
}

// ---------------------------------------------------------------------------
// Matrix operations
// ---------------------------------------------------------------------------

export function matMul(A: Mat, B: Mat): Mat {
  const n = A.length;
  const m = B[0].length;
  const p = B.length;
  const out: Mat = [];
  for (let i = 0; i < n; i++) {
    const row: number[] = new Array(m).fill(0);
    for (let k = 0; k < p; k++) {
      const aik = A[i][k];
      if (aik === 0) continue;
      for (let j = 0; j < m; j++) {
        row[j] += aik * B[k][j];
      }
    }
    out.push(row);
  }
  return out;
}

export function matVec(A: Mat, v: Vec): Vec {
  return A.map((row) => dot(row, v));
}

export function transpose(A: Mat): Mat {
  const rows = A.length;
  const cols = A[0].length;
  const out: Mat = [];
  for (let j = 0; j < cols; j++) {
    const row: number[] = [];
    for (let i = 0; i < rows; i++) row.push(A[i][j]);
    out.push(row);
  }
  return out;
}

export function identity(n: number): Mat {
  const out: Mat = [];
  for (let i = 0; i < n; i++) {
    const row = new Array(n).fill(0);
    row[i] = 1;
    out.push(row);
  }
  return out;
}

function clone(A: Mat): Mat {
  return A.map((row) => row.slice());
}

export function det(m: Mat): number {
  const n = m.length;
  if (n === 0) return 1;
  if (n === 1) return m[0][0];
  if (n === 2) return m[0][0] * m[1][1] - m[0][1] * m[1][0];
  // Loại trừ Gauss với pivot từng phần
  const a = clone(m);
  let d = 1;
  for (let col = 0; col < n; col++) {
    let pivot = col;
    for (let r = col + 1; r < n; r++) {
      if (Math.abs(a[r][col]) > Math.abs(a[pivot][col])) pivot = r;
    }
    if (Math.abs(a[pivot][col]) < EPS) return 0;
    if (pivot !== col) {
      [a[pivot], a[col]] = [a[col], a[pivot]];
      d = -d;
    }
    d *= a[col][col];
    for (let r = col + 1; r < n; r++) {
      const f = a[r][col] / a[col][col];
      for (let c = col; c < n; c++) a[r][c] -= f * a[col][c];
    }
  }
  return d;
}

export function inverse(m: Mat): Mat | null {
  const n = m.length;
  const a = clone(m);
  const inv = identity(n);
  for (let col = 0; col < n; col++) {
    let pivot = col;
    for (let r = col + 1; r < n; r++) {
      if (Math.abs(a[r][col]) > Math.abs(a[pivot][col])) pivot = r;
    }
    if (Math.abs(a[pivot][col]) < EPS) return null;
    if (pivot !== col) {
      [a[pivot], a[col]] = [a[col], a[pivot]];
      [inv[pivot], inv[col]] = [inv[col], inv[pivot]];
    }
    const pv = a[col][col];
    for (let c = 0; c < n; c++) {
      a[col][c] /= pv;
      inv[col][c] /= pv;
    }
    for (let r = 0; r < n; r++) {
      if (r === col) continue;
      const f = a[r][col];
      if (f === 0) continue;
      for (let c = 0; c < n; c++) {
        a[r][c] -= f * a[col][c];
        inv[r][c] -= f * inv[col][c];
      }
    }
  }
  return inv;
}

export function rank(m: Mat): number {
  const { rref } = rrefSteps(m);
  let r = 0;
  for (const row of rref) {
    if (row.some((x) => Math.abs(x) > 1e-8)) r++;
  }
  return r;
}

// ---------------------------------------------------------------------------
// RREF với các bước biến đổi hàng (mô tả tiếng Việt)
// ---------------------------------------------------------------------------

function fmt(x: number): string {
  const r = Math.round(x);
  if (Math.abs(x - r) < 1e-9) return String(r);
  return x.toFixed(3).replace(/0+$/, '').replace(/\.$/, '');
}

export function rrefSteps(m: Mat): { steps: { desc: string; matrix: Mat }[]; rref: Mat } {
  const a = clone(m);
  const rows = a.length;
  const cols = rows > 0 ? a[0].length : 0;
  const steps: { desc: string; matrix: Mat }[] = [
    { desc: 'Ma trận ban đầu', matrix: clone(a) },
  ];
  let pivotRow = 0;
  for (let col = 0; col < cols && pivotRow < rows; col++) {
    // Tìm pivot lớn nhất
    let pivot = pivotRow;
    for (let r = pivotRow + 1; r < rows; r++) {
      if (Math.abs(a[r][col]) > Math.abs(a[pivot][col])) pivot = r;
    }
    if (Math.abs(a[pivot][col]) < EPS) continue;
    // Đổi hàng
    if (pivot !== pivotRow) {
      [a[pivot], a[pivotRow]] = [a[pivotRow], a[pivot]];
      steps.push({
        desc: `Đổi chỗ R${pivotRow + 1} ↔ R${pivot + 1}`,
        matrix: clone(a),
      });
    }
    // Chuẩn hóa pivot về 1
    const pv = a[pivotRow][col];
    if (Math.abs(pv - 1) > EPS) {
      for (let c = 0; c < cols; c++) a[pivotRow][c] /= pv;
      steps.push({
        desc: `R${pivotRow + 1} ← R${pivotRow + 1} ÷ ${fmt(pv)}`,
        matrix: clone(a),
      });
    }
    // Khử các hàng khác
    for (let r = 0; r < rows; r++) {
      if (r === pivotRow) continue;
      const f = a[r][col];
      if (Math.abs(f) < EPS) continue;
      for (let c = 0; c < cols; c++) a[r][c] -= f * a[pivotRow][c];
      const sign = f > 0 ? '−' : '+';
      steps.push({
        desc: `R${r + 1} ← R${r + 1} ${sign} ${fmt(Math.abs(f))}·R${pivotRow + 1}`,
        matrix: clone(a),
      });
    }
    pivotRow++;
  }
  // Làm sạch -0
  for (const row of a) {
    for (let c = 0; c < row.length; c++) {
      if (Math.abs(row[c]) < 1e-12) row[c] = 0;
    }
  }
  return { steps, rref: a };
}

// ---------------------------------------------------------------------------
// Giải hệ phương trình A x = b
// ---------------------------------------------------------------------------

export function solveSystem(
  A: Mat,
  b: Vec
): { type: 'unique' | 'infinite' | 'none'; solution?: Vec } {
  const rows = A.length;
  const cols = A[0].length;
  const aug: Mat = A.map((row, i) => [...row, b[i]]);
  const { rref } = rrefSteps(aug);

  // Kiểm tra vô nghiệm: hàng [0 ... 0 | c] với c ≠ 0
  for (const row of rref) {
    const coeffs = row.slice(0, cols);
    const rhs = row[cols];
    if (coeffs.every((x) => Math.abs(x) < 1e-8) && Math.abs(rhs) > 1e-8) {
      return { type: 'none' };
    }
  }

  // Đếm pivot
  const pivotCols: number[] = [];
  for (let r = 0; r < rows; r++) {
    for (let c = 0; c < cols; c++) {
      if (Math.abs(rref[r][c]) > 1e-8) {
        pivotCols.push(c);
        break;
      }
    }
  }
  const rankA = pivotCols.length;

  if (rankA < cols) {
    return { type: 'infinite' };
  }

  // Nghiệm duy nhất: đọc trực tiếp từ rref
  const sol = new Array(cols).fill(0);
  for (let r = 0; r < rows; r++) {
    for (let c = 0; c < cols; c++) {
      if (Math.abs(rref[r][c]) > 1e-8) {
        sol[c] = rref[r][cols];
        break;
      }
    }
  }
  return { type: 'unique', solution: sol };
}

// ---------------------------------------------------------------------------
// Eigenvalues / eigenvectors
// ---------------------------------------------------------------------------

export function eigen2x2(m: Mat): { values: number[]; vectors: Vec[]; complex: boolean } {
  const a = m[0][0];
  const b = m[0][1];
  const c = m[1][0];
  const d = m[1][1];
  const tr = a + d;
  const det2 = a * d - b * c;
  const disc = tr * tr - 4 * det2;
  if (disc < -1e-12) {
    return { values: [], vectors: [], complex: true };
  }
  const s = Math.sqrt(Math.max(0, disc));
  const l1 = (tr + s) / 2;
  const l2 = (tr - s) / 2;

  function eigvec(lambda: number): Vec {
    // (A - λI) v = 0
    const a11 = a - lambda;
    const a12 = b;
    const a21 = c;
    const a22 = d - lambda;
    // Chọn hàng có chuẩn lớn hơn để tìm vector null
    if (Math.abs(a11) > EPS || Math.abs(a12) > EPS) {
      const v = normalize([-a12, a11]);
      if (norm(v) > EPS) return v;
    }
    if (Math.abs(a21) > EPS || Math.abs(a22) > EPS) {
      const v = normalize([-a22, a21]);
      if (norm(v) > EPS) return v;
    }
    // Ma trận bội của I → mọi vector là eigenvector
    return [1, 0];
  }

  return { values: [l1, l2], vectors: [eigvec(l1), eigvec(l2)], complex: false };
}

// Jacobi rotation cho ma trận đối xứng n×n
export function eigenSymmetric(m: Mat): { values: number[]; vectors: Vec[] } {
  const n = m.length;
  const a = clone(m);
  const V = identity(n);
  const maxSweeps = 100;

  for (let sweep = 0; sweep < maxSweeps; sweep++) {
    // Tổng bình phương phần tử ngoài đường chéo
    let off = 0;
    for (let p = 0; p < n; p++) {
      for (let q = p + 1; q < n; q++) off += a[p][q] * a[p][q];
    }
    if (off < 1e-24) break;

    for (let p = 0; p < n; p++) {
      for (let q = p + 1; q < n; q++) {
        if (Math.abs(a[p][q]) < 1e-18) continue;
        const app = a[p][p];
        const aqq = a[q][q];
        const apq = a[p][q];
        const phi = 0.5 * Math.atan2(2 * apq, aqq - app);
        const cs = Math.cos(phi);
        const sn = Math.sin(phi);
        // Áp phép quay: A = Jᵀ A J
        for (let i = 0; i < n; i++) {
          const aip = a[i][p];
          const aiq = a[i][q];
          a[i][p] = cs * aip - sn * aiq;
          a[i][q] = sn * aip + cs * aiq;
        }
        for (let i = 0; i < n; i++) {
          const api = a[p][i];
          const aqi = a[q][i];
          a[p][i] = cs * api - sn * aqi;
          a[q][i] = sn * api + cs * aqi;
        }
        // Cập nhật vector riêng
        for (let i = 0; i < n; i++) {
          const vip = V[i][p];
          const viq = V[i][q];
          V[i][p] = cs * vip - sn * viq;
          V[i][q] = sn * vip + cs * viq;
        }
      }
    }
  }

  // Trích eigenvalue trên đường chéo, sắp xếp giảm dần
  const idx = Array.from({ length: n }, (_, i) => i);
  idx.sort((i, j) => a[j][j] - a[i][i]);
  const values = idx.map((i) => a[i][i]);
  const vectors = idx.map((i) => normalize(V.map((row) => row[i])));
  return { values, vectors };
}

// ---------------------------------------------------------------------------
// SVD qua eigenSymmetric của AᵀA
// ---------------------------------------------------------------------------

export function svd(m: Mat): { U: Mat; S: number[]; V: Mat } {
  const rows = m.length;
  const cols = m[0].length;
  const At = transpose(m);
  const AtA = matMul(At, m); // cols × cols
  const { values, vectors } = eigenSymmetric(AtA);

  // Singular values
  const S = values.map((v) => Math.sqrt(Math.max(0, v)));
  // V: các cột là eigenvector của AᵀA
  const Vcols = vectors; // mỗi vector độ dài cols

  // U: u_i = A v_i / sigma_i
  const Ucols: Vec[] = [];
  const k = Math.min(rows, cols);
  for (let i = 0; i < Vcols.length; i++) {
    const av = matVec(m, Vcols[i]); // độ dài rows
    if (S[i] > 1e-10) {
      Ucols.push(scale(av, 1 / S[i]));
    } else {
      Ucols.push(new Array(rows).fill(0));
    }
  }

  // Bổ sung U thành cơ sở trực chuẩn rows×rows nếu cần (Gram-Schmidt)
  while (Ucols.length < rows) Ucols.push(new Array(rows).fill(0));
  // Trực giao hóa các cột U bằng Gram-Schmidt (giữ những cột hợp lệ)
  const Uortho: Vec[] = [];
  for (let i = 0; i < rows; i++) {
    let u = i < Ucols.length ? Ucols[i].slice() : new Array(rows).fill(0);
    if (norm(u) < 1e-10) {
      // sinh vector cơ sở chính tắc rồi trực giao hóa
      u = new Array(rows).fill(0);
      u[i] = 1;
    }
    for (const prev of Uortho) {
      u = sub(u, project(u, prev));
    }
    if (norm(u) > 1e-8) {
      Uortho.push(normalize(u));
    } else {
      Uortho.push(new Array(rows).fill(0));
    }
  }

  const U = transpose(Uortho.slice(0, rows)); // rows × rows, cột i = Uortho[i]
  const V = transpose(Vcols); // cols × cols, cột i = Vcols[i]
  const Strim = S.slice(0, Math.max(k, S.length));
  return { U, S: Strim, V };
}

// ---------------------------------------------------------------------------
// Helpers biến đổi
// ---------------------------------------------------------------------------

export function rotation2D(theta: number): Mat {
  const c = Math.cos(theta);
  const s = Math.sin(theta);
  return [
    [c, -s],
    [s, c],
  ];
}

export function rotation3D(axis: 'x' | 'y' | 'z', theta: number): Mat {
  const c = Math.cos(theta);
  const s = Math.sin(theta);
  if (axis === 'x') {
    return [
      [1, 0, 0],
      [0, c, -s],
      [0, s, c],
    ];
  }
  if (axis === 'y') {
    return [
      [c, 0, s],
      [0, 1, 0],
      [-s, 0, c],
    ];
  }
  return [
    [c, -s, 0],
    [s, c, 0],
    [0, 0, 1],
  ];
}

export function scaling2D(sx: number, sy: number): Mat {
  return [
    [sx, 0],
    [0, sy],
  ];
}

export function shear2D(k: number): Mat {
  return [
    [1, k],
    [0, 1],
  ];
}

export function lerp(a: number, b: number, t: number): number {
  return a + (b - a) * t;
}

export function lerpMat(A: Mat, B: Mat, t: number): Mat {
  return A.map((row, i) => row.map((x, j) => lerp(x, B[i][j], t)));
}

// ---------------------------------------------------------------------------
// Trực giao — Gram–Schmidt, QR, phép chiếu
// ---------------------------------------------------------------------------

// Gram–Schmidt: từ hệ vector (có thể phụ thuộc) trả về hệ ORTHONORMAL.
// Vector nào suy biến gần 0 (phụ thuộc tuyến tính vào các vector trước) bị loại.
export function gramSchmidt(vs: Vec[]): Vec[] {
  const out: Vec[] = [];
  for (const v of vs) {
    let u = v.slice();
    // Trừ đi hình chiếu lên từng vector trực chuẩn đã có (q đơn vị ⇒ hệ số = u·q)
    for (const q of out) {
      u = sub(u, scale(q, dot(u, q)));
    }
    if (norm(u) > 1e-10) {
      out.push(normalize(u));
    }
  }
  return out;
}

// QR qua Gram–Schmidt trên các CỘT của m (m×n, n cột độc lập).
// Q trực chuẩn (m×k), R tam giác trên (k×n) với R = QᵀA.
export function qr(m: Mat): { Q: Mat; R: Mat } {
  const columns = transpose(m); // mỗi hàng = một cột của m
  const qCols = gramSchmidt(columns); // hệ cột trực chuẩn
  const Q = transpose(qCols); // m×k, cột i = qCols[i]
  const R = matMul(qCols, m); // (k×m)·(m×n) = k×n, R[i][j] = qCols[i]·cột_j
  return { Q, R };
}

// Ma trận chiếu trực giao lên column space của A: P = A (AᵀA)⁻¹ Aᵀ.
// Giả định các cột của A độc lập tuyến tính (AᵀA khả nghịch).
export function projectionMatrix(A: Mat): Mat {
  const At = transpose(A);
  const AtA = matMul(At, A);
  const inv = inverse(AtA);
  if (!inv) {
    throw new Error('projectionMatrix: AᵀA suy biến — các cột của A không độc lập.');
  }
  return matMul(matMul(A, inv), At);
}

// Hình chiếu của b lên không gian con sinh bởi `basis`.
export function projectOnto(b: Vec, basis: Vec[]): Vec {
  const ortho = gramSchmidt(basis);
  let p: Vec = b.map(() => 0);
  for (const q of ortho) {
    p = add(p, scale(q, dot(b, q)));
  }
  return p;
}

// ---------------------------------------------------------------------------
// Dạng toàn phương & định dấu
// ---------------------------------------------------------------------------

// Dạng toàn phương xᵀAx.
export function quadraticForm(A: Mat, x: Vec): number {
  return dot(x, matVec(A, x));
}

// Kiểm tra ma trận vuông đối xứng (m ≈ mᵀ).
export function isSymmetric(m: Mat, tol = 1e-9): boolean {
  const n = m.length;
  for (let i = 0; i < n; i++) {
    if (m[i].length !== n) return false;
    for (let j = i + 1; j < n; j++) {
      if (Math.abs(m[i][j] - m[j][i]) > tol) return false;
    }
  }
  return true;
}

// Phân loại định dấu dựa trên dấu các eigenvalue của PHẦN ĐỐI XỨNG (A + Aᵀ)/2.
export function classifyDefiniteness(
  A: Mat
): 'positive-definite' | 'positive-semidefinite' | 'negative-definite' | 'negative-semidefinite' | 'indefinite' {
  const At = transpose(A);
  const sym = A.map((row, i) => row.map((x, j) => (x + At[i][j]) / 2));
  const { values } = eigenSymmetric(sym);
  const tol = 1e-8;
  const hasPos = values.some((v) => v > tol);
  const hasNeg = values.some((v) => v < -tol);
  const hasZero = values.some((v) => Math.abs(v) <= tol);

  if (hasPos && hasNeg) return 'indefinite';
  if (hasPos) return hasZero ? 'positive-semidefinite' : 'positive-definite';
  if (hasNeg) return hasZero ? 'negative-semidefinite' : 'negative-definite';
  // Tất cả eigenvalue ≈ 0 (vd ma trận 0): coi là nửa xác định dương.
  return 'positive-semidefinite';
}
