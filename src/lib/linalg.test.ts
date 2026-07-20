import { describe, it, expect } from 'vitest';
import {
  add,
  sub,
  scale,
  dot,
  cross3,
  norm,
  normalize,
  angleBetween,
  project,
  matMul,
  matVec,
  transpose,
  identity,
  det,
  inverse,
  rank,
  rrefSteps,
  solveSystem,
  eigen2x2,
  eigenSymmetric,
  svd,
  rotation2D,
  rotation3D,
  scaling2D,
  shear2D,
  lerp,
  lerpMat,
  gramSchmidt,
  qr,
  projectionMatrix,
  projectOnto,
  quadraticForm,
  isSymmetric,
  classifyDefiniteness,
  type Mat,
  type Vec,
} from './linalg';

function matClose(A: Mat, B: Mat, tol = 1e-6) {
  expect(A.length).toBe(B.length);
  for (let i = 0; i < A.length; i++) {
    for (let j = 0; j < A[i].length; j++) {
      expect(Math.abs(A[i][j] - B[i][j])).toBeLessThan(tol);
    }
  }
}

describe('vector ops', () => {
  it('add/sub/scale', () => {
    expect(add([1, 2], [3, 4])).toEqual([4, 6]);
    expect(sub([3, 4], [1, 2])).toEqual([2, 2]);
    expect(scale([1, 2], 3)).toEqual([3, 6]);
  });
  it('dot / cross3', () => {
    expect(dot([1, 2, 3], [4, 5, 6])).toBe(32);
    expect(cross3([1, 0, 0], [0, 1, 0])).toEqual([0, 0, 1]);
  });
  it('norm / normalize', () => {
    expect(norm([3, 4])).toBe(5);
    const n = normalize([3, 4]);
    expect(n[0]).toBeCloseTo(0.6);
    expect(n[1]).toBeCloseTo(0.8);
  });
  it('angleBetween', () => {
    expect(angleBetween([1, 0], [0, 1])).toBeCloseTo(Math.PI / 2);
    expect(angleBetween([1, 0], [1, 0])).toBeCloseTo(0);
  });
  it('project', () => {
    // chiếu [2,3] lên trục x → [2,0]
    expect(project([2, 3], [1, 0])).toEqual([2, 0]);
    const p = project([1, 1], [2, 0]);
    expect(p[0]).toBeCloseTo(1);
    expect(p[1]).toBeCloseTo(0);
  });
});

describe('matrix ops', () => {
  it('matMul', () => {
    const A = [
      [1, 2],
      [3, 4],
    ];
    const B = [
      [5, 6],
      [7, 8],
    ];
    matClose(matMul(A, B), [
      [19, 22],
      [43, 50],
    ]);
  });
  it('matVec', () => {
    expect(matVec([[1, 2], [3, 4]], [1, 1])).toEqual([3, 7]);
  });
  it('transpose', () => {
    matClose(transpose([[1, 2, 3], [4, 5, 6]]), [
      [1, 4],
      [2, 5],
      [3, 6],
    ]);
  });
  it('identity', () => {
    matClose(identity(3), [
      [1, 0, 0],
      [0, 1, 0],
      [0, 0, 1],
    ]);
  });
  it('det', () => {
    expect(det([[1, 2], [3, 4]])).toBeCloseTo(-2);
    expect(det([[2, 0, 0], [0, 3, 0], [0, 0, 4]])).toBeCloseTo(24);
    expect(det([[1, 2], [2, 4]])).toBeCloseTo(0);
  });
  it('inverse', () => {
    const A = [
      [4, 7],
      [2, 6],
    ];
    const inv = inverse(A)!;
    matClose(matMul(A, inv), identity(2));
    expect(inverse([[1, 2], [2, 4]])).toBeNull();
  });
  it('rank', () => {
    expect(rank([[1, 2], [2, 4]])).toBe(1);
    expect(rank([[1, 0], [0, 1]])).toBe(2);
    expect(rank([[1, 2, 3], [4, 5, 6], [7, 8, 9]])).toBe(2);
  });
});

describe('rrefSteps', () => {
  it('first step is original, computes rref', () => {
    const A = [
      [2, 1],
      [1, 2],
    ];
    const { steps, rref } = rrefSteps(A);
    expect(steps[0].desc).toBe('Ma trận ban đầu');
    matClose(steps[0].matrix, A);
    matClose(rref, identity(2));
    expect(steps.length).toBeGreaterThan(1);
  });
  it('rref of singular matrix', () => {
    const { rref } = rrefSteps([[1, 2], [2, 4]]);
    matClose(rref, [
      [1, 2],
      [0, 0],
    ]);
  });
});

describe('solveSystem', () => {
  it('unique', () => {
    const r = solveSystem([[2, 1], [1, 3]], [3, 4]);
    expect(r.type).toBe('unique');
    expect(r.solution![0]).toBeCloseTo(1);
    expect(r.solution![1]).toBeCloseTo(1);
  });
  it('infinite', () => {
    const r = solveSystem([[1, 2], [2, 4]], [3, 6]);
    expect(r.type).toBe('infinite');
  });
  it('none', () => {
    const r = solveSystem([[1, 2], [2, 4]], [3, 7]);
    expect(r.type).toBe('none');
  });
});

describe('eigen2x2', () => {
  it('[[2,1],[1,2]] → 3 and 1', () => {
    const { values, complex } = eigen2x2([[2, 1], [1, 2]]);
    expect(complex).toBe(false);
    const sorted = [...values].sort((a, b) => b - a);
    expect(sorted[0]).toBeCloseTo(3);
    expect(sorted[1]).toBeCloseTo(1);
  });
  it('eigenvector satisfies Av = λv', () => {
    const m = [
      [2, 1],
      [1, 2],
    ];
    const { values, vectors } = eigen2x2(m);
    for (let i = 0; i < values.length; i++) {
      const Av = matVec(m, vectors[i]);
      const lv = scale(vectors[i], values[i]);
      expect(Math.abs(Av[0] - lv[0])).toBeLessThan(1e-6);
      expect(Math.abs(Av[1] - lv[1])).toBeLessThan(1e-6);
    }
  });
  it('complex eigenvalues detected', () => {
    const { complex } = eigen2x2([[0, -1], [1, 0]]);
    expect(complex).toBe(true);
  });
});

describe('eigenSymmetric', () => {
  it('diagonal descending', () => {
    const { values, vectors } = eigenSymmetric([[2, 1], [1, 2]]);
    expect(values[0]).toBeCloseTo(3);
    expect(values[1]).toBeCloseTo(1);
    // vectors trực chuẩn
    expect(Math.abs(dot(vectors[0], vectors[1]))).toBeLessThan(1e-6);
  });
  it('3x3 symmetric reconstructs', () => {
    const A = [
      [4, 1, 2],
      [1, 5, 3],
      [2, 3, 6],
    ];
    const { values, vectors } = eigenSymmetric(A);
    for (let i = 0; i < 3; i++) {
      const Av = matVec(A, vectors[i]);
      const lv = scale(vectors[i], values[i]);
      for (let k = 0; k < 3; k++) {
        expect(Math.abs(Av[k] - lv[k])).toBeLessThan(1e-5);
      }
    }
  });
});

describe('svd', () => {
  it('reconstructs square matrix A ≈ U S Vᵀ', () => {
    const A = [
      [3, 1],
      [0, 2],
    ];
    const { U, S, V } = svd(A);
    const Smat = [
      [S[0], 0],
      [0, S[1]],
    ];
    const recon = matMul(matMul(U, Smat), transpose(V));
    matClose(recon, A, 1e-5);
  });
  it('reconstructs rectangular matrix', () => {
    const A = [
      [1, 2, 3],
      [4, 5, 6],
    ];
    const { U, S, V } = svd(A);
    // build S as rows×cols
    const rows = 2;
    const cols = 3;
    const Smat: Mat = Array.from({ length: rows }, () => new Array(cols).fill(0));
    for (let i = 0; i < Math.min(rows, cols); i++) Smat[i][i] = S[i];
    const recon = matMul(matMul(U, Smat), transpose(V));
    matClose(recon, A, 1e-4);
  });
  it('singular values non-negative descending', () => {
    const A = [
      [2, 0],
      [0, 5],
    ];
    const { S } = svd(A);
    expect(S[0]).toBeGreaterThanOrEqual(S[1]);
    expect(S[0]).toBeCloseTo(5);
    expect(S[1]).toBeCloseTo(2);
  });
});

describe('transform helpers', () => {
  it('rotation2D', () => {
    const R = rotation2D(Math.PI / 2);
    const v = matVec(R, [1, 0]);
    expect(v[0]).toBeCloseTo(0);
    expect(v[1]).toBeCloseTo(1);
  });
  it('rotation3D', () => {
    const R = rotation3D('z', Math.PI / 2);
    const v = matVec(R, [1, 0, 0]);
    expect(v[0]).toBeCloseTo(0);
    expect(v[1]).toBeCloseTo(1);
    expect(v[2]).toBeCloseTo(0);
  });
  it('scaling2D / shear2D', () => {
    matClose(scaling2D(2, 3), [[2, 0], [0, 3]]);
    expect(matVec(shear2D(1), [0, 1])).toEqual([1, 1]);
  });
  it('lerp / lerpMat', () => {
    expect(lerp(0, 10, 0.5)).toBe(5);
    matClose(lerpMat(identity(2), [[3, 0], [0, 3]], 0.5), [
      [2, 0],
      [0, 2],
    ]);
  });
});

function isOrthonormal(vs: Vec[], tol = 1e-6) {
  for (let i = 0; i < vs.length; i++) {
    expect(Math.abs(norm(vs[i]) - 1)).toBeLessThan(tol);
    for (let j = i + 1; j < vs.length; j++) {
      expect(Math.abs(dot(vs[i], vs[j]))).toBeLessThan(tol);
    }
  }
}

describe('gramSchmidt', () => {
  it('[[1,0],[1,1]] → hệ trực chuẩn', () => {
    const q = gramSchmidt([
      [1, 0],
      [1, 1],
    ]);
    expect(q.length).toBe(2);
    isOrthonormal(q);
    // vector đầu = [1,0] chuẩn hóa
    expect(q[0][0]).toBeCloseTo(1);
    expect(q[0][1]).toBeCloseTo(0);
  });
  it('loại vector phụ thuộc (suy biến gần 0)', () => {
    const q = gramSchmidt([
      [1, 0, 0],
      [2, 0, 0], // phụ thuộc vào vector đầu → bị loại
      [0, 3, 0],
    ]);
    expect(q.length).toBe(2);
    isOrthonormal(q);
  });
  it('span của kết quả bằng span đầu vào (3 vector độc lập)', () => {
    const q = gramSchmidt([
      [1, 1, 0],
      [1, 0, 1],
      [0, 1, 1],
    ]);
    expect(q.length).toBe(3);
    isOrthonormal(q);
  });
});

describe('qr', () => {
  it('tái tạo A ≈ QR, Q trực chuẩn, R tam giác trên', () => {
    const A = [
      [1, 1, 0],
      [1, 0, 1],
      [0, 1, 1],
    ];
    const { Q, R } = qr(A);
    matClose(matMul(Q, R), A, 1e-6);
    // Q có cột trực chuẩn ⇒ QᵀQ = I
    matClose(matMul(transpose(Q), Q), identity(3), 1e-6);
    // R tam giác trên
    for (let i = 0; i < R.length; i++) {
      for (let j = 0; j < i; j++) {
        expect(Math.abs(R[i][j])).toBeLessThan(1e-6);
      }
    }
  });
  it('ma trận chữ nhật m×n (m>n)', () => {
    const A = [
      [1, 2],
      [3, 4],
      [5, 6],
    ];
    const { Q, R } = qr(A);
    matClose(matMul(Q, R), A, 1e-6);
    matClose(matMul(transpose(Q), Q), identity(2), 1e-6);
  });
});

describe('projectionMatrix', () => {
  it('P idempotent (P² ≈ P) và đối xứng', () => {
    const A = [
      [1, 0],
      [1, 1],
      [0, 1],
    ];
    const P = projectionMatrix(A);
    matClose(matMul(P, P), P, 1e-6);
    matClose(transpose(P), P, 1e-6);
  });
  it('chiếu lên trục x trong R³: P·[a,b,c] = [a,0,0]', () => {
    const P = projectionMatrix([[1], [0], [0]]);
    const p = matVec(P, [4, 5, 6]);
    expect(p[0]).toBeCloseTo(4);
    expect(p[1]).toBeCloseTo(0);
    expect(p[2]).toBeCloseTo(0);
  });
});

describe('projectOnto', () => {
  it('chiếu [1,2,3] lên mặt phẳng xy → [1,2,0]', () => {
    const p = projectOnto([1, 2, 3], [
      [1, 0, 0],
      [0, 1, 0],
    ]);
    expect(p[0]).toBeCloseTo(1);
    expect(p[1]).toBeCloseTo(2);
    expect(p[2]).toBeCloseTo(0);
  });
  it('chiếu lên đường thẳng span([1,1]) của [3,1] → [2,2]', () => {
    const p = projectOnto([3, 1], [[1, 1]]);
    expect(p[0]).toBeCloseTo(2);
    expect(p[1]).toBeCloseTo(2);
  });
});

describe('quadraticForm', () => {
  it('xᵀAx cho ví dụ biết trước', () => {
    // A = [[2,0],[0,3]], x=[1,1] → 2·1 + 3·1 = 5
    expect(quadraticForm([[2, 0], [0, 3]], [1, 1])).toBeCloseTo(5);
    // A = [[1,2],[2,1]], x=[1,1] → xᵀAx = 1+2+2+1 = 6
    expect(quadraticForm([[1, 2], [2, 1]], [1, 1])).toBeCloseTo(6);
  });
});

describe('isSymmetric', () => {
  it('nhận diện đối xứng / bất đối xứng', () => {
    expect(isSymmetric([[1, 2], [2, 1]])).toBe(true);
    expect(isSymmetric([[1, 2], [3, 1]])).toBe(false);
    expect(isSymmetric(identity(3))).toBe(true);
  });
});

describe('classifyDefiniteness', () => {
  it('positive-definite', () => {
    expect(classifyDefiniteness([[2, 0], [0, 3]])).toBe('positive-definite');
  });
  it('indefinite', () => {
    expect(classifyDefiniteness([[1, 0], [0, -1]])).toBe('indefinite');
  });
  it('negative-definite', () => {
    expect(classifyDefiniteness([[-2, 0], [0, -3]])).toBe('negative-definite');
  });
  it('positive-semidefinite', () => {
    expect(classifyDefiniteness([[1, 0], [0, 0]])).toBe('positive-semidefinite');
  });
  it('negative-semidefinite', () => {
    expect(classifyDefiniteness([[0, 0], [0, -5]])).toBe('negative-semidefinite');
  });
  it('dùng phần đối xứng cho ma trận không đối xứng', () => {
    // phần đối xứng của [[2,4],[0,2]] là [[2,2],[2,2]] → eig {4,0} ⇒ semidef dương
    expect(classifyDefiniteness([[2, 4], [0, 2]])).toBe('positive-semidefinite');
  });
});
