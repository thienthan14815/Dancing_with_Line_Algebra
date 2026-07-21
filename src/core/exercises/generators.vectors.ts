// ===========================================================================
// HỆ SINH BÀI TẬP THỦ TỤC — CHỦ ĐỀ VECTOR.
// ---------------------------------------------------------------------------
// Bốn generator bổ sung cho nhóm kỹ năng vector: nhân vô hướng, tổ hợp tuyến
// tính, tích có hướng và độ dài (chuẩn) vector. Cùng phong cách với
// `./generators`: mỗi generator nhận một RNG tất định và sinh MỘT `Exercise`
// hợp lệ với đáp án LUÔN đúng (tự tính từ số vừa sinh).
//
// PHỤ THUỘC: chỉ `./types` (shape Exercise), kiểu `ExerciseGenerator` (type-only
// nên KHÔNG tạo runtime cycle) và `../rng` (RNG thuần). Parent sẽ tự nối
// `VECTOR_GENERATORS` vào registry.
//
// Vector được nhúng trong đề dạng `(a, b)` / `(a, b, c)` để bộ đọc đồ thị nhận
// ra và vẽ lại theo số liệu mới mỗi lượt luyện.
// ===========================================================================

import type { NumericInputExercise, MatrixInputExercise } from './types';
import type { ExerciseGenerator } from './generators'; // type-only → no runtime cycle
import { randInt, randNonZeroInt, pick } from '../rng';

/**
 * Hậu tố id DUY NHẤT + tất định: rút từ chính RNG (đang được gieo theo seed).
 * PHẢI gọi ĐẦU TIÊN trong mỗi generator để tag ổn định theo seed.
 */
function uid(rng: () => number): string {
  return String(Math.floor(rng() * 0x7fffffff));
}

// ---------------------------------------------------------------------------
// 1) scalar_multiplication — nhân vector với một vô hướng. matrix-input 2×1.
// ---------------------------------------------------------------------------

/**
 * k·v với k nguyên khác 0 và v = (a, b) nguyên nhỏ. Đề chứa v = (·,·) để đồ thị
 * "vectors" đọc số và minh họa phép co giãn/đổi chiều theo số mới.
 */
function genScalarMul(rng: () => number): MatrixInputExercise {
  const tag = uid(rng);
  const k = randNonZeroInt(rng, -5, 5);
  const a = randNonZeroInt(rng, -6, 6);
  const b = randNonZeroInt(rng, -6, 6);
  return {
    id: `gen:scalar_multiplication:${tag}`,
    type: 'matrix-input',
    skillId: 'scalar_multiplication',
    dimension: 'compute',
    difficulty: 1,
    prompt: `Cho k = ${k} và v = (${a}, ${b}). Tính k·v (viết dạng cột).`,
    rows: 2,
    cols: 1,
    answer: [[k * a], [k * b]],
    tolerance: 0,
    explain:
      `Nhân vô hướng: k·v = (k·${a}, k·${b}) = (${k}·${a}, ${k}·${b}) = ` +
      `(${k * a}, ${k * b}), viết dạng cột.`,
    hints: [
      { level: 1, text: 'Nhân vô hướng là nhân k vào TỪNG thành phần của vector.' },
      { level: 2, text: `Thành phần đầu: ${k}·${a} = ${k * a}.` },
      { level: 3, text: `Thành phần sau: ${k}·${b} = ${k * b}.` },
    ],
  };
}

// ---------------------------------------------------------------------------
// 2) linear_combination — tổ hợp tuyến tính a·u + b·v. matrix-input 2×1.
// ---------------------------------------------------------------------------

/**
 * a·u + b·v với a, b nguyên khác 0 và u, v nguyên nhỏ (cho phép thành phần 0).
 * Đề chứa u = (·,·) và v = (·,·) để đồ thị vẽ lại tổ hợp theo số mới.
 */
function genLinearComb(rng: () => number): MatrixInputExercise {
  const tag = uid(rng);
  const a = randNonZeroInt(rng, -4, 4);
  const b = randNonZeroInt(rng, -4, 4);
  const u1 = randInt(rng, -5, 5);
  const u2 = randInt(rng, -5, 5);
  const v1 = randInt(rng, -5, 5);
  const v2 = randInt(rng, -5, 5);
  const r1 = a * u1 + b * v1;
  const r2 = a * u2 + b * v2;
  return {
    id: `gen:linear_combination:${tag}`,
    type: 'matrix-input',
    skillId: 'linear_combination',
    dimension: 'compute',
    difficulty: 2,
    prompt:
      `Cho u = (${u1}, ${u2}) và v = (${v1}, ${v2}). ` +
      `Tính ${a}·u + ${b}·v (viết dạng cột).`,
    rows: 2,
    cols: 1,
    answer: [[r1], [r2]],
    tolerance: 0,
    explain:
      `Tổ hợp tuyến tính theo từng thành phần: ` +
      `hàng 1 = ${a}·${u1} + ${b}·${v1} = ${r1}; ` +
      `hàng 2 = ${a}·${u2} + ${b}·${v2} = ${r2}.`,
    hints: [
      { level: 1, text: 'Nhân mỗi vector với vô hướng của nó rồi cộng theo thành phần.' },
      { level: 2, text: `Hàng 1: ${a}·${u1} + ${b}·${v1} = ${r1}.` },
      { level: 3, text: `Hàng 2: ${a}·${u2} + ${b}·${v2} = ${r2}.` },
    ],
  };
}

// ---------------------------------------------------------------------------
// 3) cross_product — tích có hướng u × v trong R³. matrix-input 3×1.
// ---------------------------------------------------------------------------

/**
 * u × v = (u2·v3 − u3·v2, u3·v1 − u1·v3, u1·v2 − u2·v1) với u, v nguyên nhỏ.
 * Đề chứa u = (·,·,·) và v = (·,·,·) để đồ thị 3D dựng lại theo số mới.
 */
function genCrossProduct(rng: () => number): MatrixInputExercise {
  const tag = uid(rng);
  const u1 = randInt(rng, -4, 4);
  const u2 = randInt(rng, -4, 4);
  const u3 = randInt(rng, -4, 4);
  const v1 = randInt(rng, -4, 4);
  const v2 = randInt(rng, -4, 4);
  const v3 = randInt(rng, -4, 4);
  const cx = u2 * v3 - u3 * v2;
  const cy = u3 * v1 - u1 * v3;
  const cz = u1 * v2 - u2 * v1;
  return {
    id: `gen:cross_product:${tag}`,
    type: 'matrix-input',
    skillId: 'cross_product',
    dimension: 'compute',
    difficulty: 3,
    prompt:
      `Cho u = (${u1}, ${u2}, ${u3}) và v = (${v1}, ${v2}, ${v3}). ` +
      `Tính tích có hướng u × v (viết dạng cột).`,
    rows: 3,
    cols: 1,
    answer: [[cx], [cy], [cz]],
    tolerance: 0,
    explain:
      `u × v = (u₂v₃ − u₃v₂, u₃v₁ − u₁v₃, u₁v₂ − u₂v₁) = ` +
      `(${u2}·${v3} − ${u3}·${v2}, ${u3}·${v1} − ${u1}·${v3}, ${u1}·${v2} − ${u2}·${v1}) = ` +
      `(${cx}, ${cy}, ${cz}).`,
    hints: [
      { level: 1, text: 'Dùng công thức u × v = (u₂v₃ − u₃v₂, u₃v₁ − u₁v₃, u₁v₂ − u₂v₁).' },
      { level: 2, text: `Thành phần x: ${u2}·${v3} − ${u3}·${v2} = ${cx}.` },
      { level: 3, text: `Thành phần z: ${u1}·${v2} − ${u2}·${v1} = ${cz}.` },
    ],
  };
}

// ---------------------------------------------------------------------------
// 4) vector_basics — độ dài (chuẩn) vector 2D. numeric-input.
// ---------------------------------------------------------------------------

/** Bộ ba Pythagoras (p, q, r) với p² + q² = r² ⇒ chuẩn NGUYÊN. */
const PYTHAGOREAN_TRIPLES: ReadonlyArray<readonly [number, number, number]> = [
  [3, 4, 5],
  [6, 8, 10],
  [5, 12, 13],
  [8, 15, 17],
  [9, 12, 15],
  [7, 24, 25],
  [20, 21, 29],
];

/**
 * |v| = √(a² + b²) với v = (a, b). Chọn một bộ ba Pythagoras rồi gán dấu ngẫu
 * nhiên cho hai cạnh góc vuông ⇒ đáp án là cạnh huyền r (LUÔN dương, nguyên).
 * Đề chứa v = (·,·) để đồ thị vẽ vector và minh họa độ dài theo số mới.
 */
function genVectorNorm(rng: () => number): NumericInputExercise {
  const tag = uid(rng);
  const [p, q, r] = pick(rng, PYTHAGOREAN_TRIPLES);
  const a = p * pick(rng, [-1, 1]);
  const b = q * pick(rng, [-1, 1]);
  return {
    id: `gen:vector_basics:${tag}`,
    type: 'numeric-input',
    skillId: 'vector_basics',
    dimension: 'compute',
    difficulty: 2,
    prompt: `Tính độ dài (chuẩn) của vector v = (${a}, ${b}).`,
    answer: r,
    tolerance: 0,
    explain:
      `|v| = √(a² + b²) = √((${a})² + (${b})²) = √(${a * a} + ${b * b}) = ` +
      `√${a * a + b * b} = ${r}.`,
    hints: [
      { level: 1, text: 'Chuẩn của (a, b) là |v| = √(a² + b²).' },
      { level: 2, text: `a² + b² = ${a * a} + ${b * b} = ${a * a + b * b}.` },
      { level: 3, text: `|v| = √${a * a + b * b} = ${r}.` },
    ],
  };
}

// ---------------------------------------------------------------------------
// REGISTRY EXPORT
// ---------------------------------------------------------------------------

export const VECTOR_GENERATORS: ExerciseGenerator[] = [
  { skillId: 'scalar_multiplication', gen: genScalarMul },
  { skillId: 'linear_combination', gen: genLinearComb },
  { skillId: 'cross_product', gen: genCrossProduct },
  { skillId: 'vector_basics', gen: genVectorNorm },
];
