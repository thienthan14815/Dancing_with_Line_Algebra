// ===========================================================================
// HỆ SINH BÀI TẬP THỦ TỤC (procedural exercise generators).
// ---------------------------------------------------------------------------
// Mỗi generator nhận một RNG tất định (rng) và sinh MỘT `Exercise` hợp lệ với
// số liệu ngẫu nhiên nhưng đáp án LUÔN đúng (tự tính từ số vừa sinh). Nhờ đó:
//   • mỗi lượt luyện gieo seed mới → đề có số liệu mới → đồ thị đọc số từ đề bài
//     tự đổi theo;
//   • cùng seed → cùng đề (reproducible, kiểm thử lại được).
//
// PHỤ THUỘC: chỉ `./types` (shape Exercise) + `../rng` (RNG thuần). KHÔNG import
// ngược exerciseBank/registry ⇒ đồ thị import một chiều, không tạo cycle.
//
// Backward-compatible: file này CHỈ THÊM khả năng sinh động. Pool bài tĩnh vẫn
// là fallback ở exerciseBank khi skill không có generator.
// ===========================================================================

import type { Exercise, NumericInputExercise, MatrixInputExercise } from './types';
import { mulberry32, randInt, randNonZeroInt, hashStr } from '../rng';
// Generator theo miền (mỗi file tự chứa, chỉ export mảng ExerciseGenerator).
import { VECTOR_GENERATORS } from './generators.vectors';
import { SYSTEM_GENERATORS } from './generators.systems';

/** Sinh MỘT Exercise hợp lệ từ một RNG tất định. */
export type GenFn = (rng: () => number) => Exercise;

/** Một generator gắn với skill mà nó phục vụ. */
export interface ExerciseGenerator {
  skillId: string;
  gen: GenFn;
}

// ---------------------------------------------------------------------------
// TIỆN ÍCH NỘI BỘ
// ---------------------------------------------------------------------------

/**
 * Hậu tố id DUY NHẤT + tất định: rút từ chính RNG (đang được gieo theo
 * seed+skill+vòng ở genExercisesForSkills). Cùng seed → cùng hậu tố; seed/vòng
 * khác → hậu tố khác ⇒ id không trùng mà vẫn reproducible.
 */
function uid(rng: () => number): string {
  return String(Math.floor(rng() * 0x7fffffff));
}

// ---------------------------------------------------------------------------
// GENERATOR MẪU (builtin) — vừa CHỨNG MINH cho QA vừa làm khuôn mẫu.
// ---------------------------------------------------------------------------

/**
 * dot_product — tích vô hướng hai vector 2D nguyên nhỏ. Đề chứa u = (a, b) và
 * v = (c, d) ở dạng (·,·) để đồ thị "dot" đọc được và tự vẽ lại theo số mới.
 */
function genDotProduct(rng: () => number): NumericInputExercise {
  const tag = uid(rng);
  const a = randNonZeroInt(rng, -6, 6);
  const b = randNonZeroInt(rng, -6, 6);
  const c = randNonZeroInt(rng, -6, 6);
  const d = randNonZeroInt(rng, -6, 6);
  const ans = a * c + b * d;
  return {
    id: `gen:dot_product:${tag}`,
    type: 'numeric-input',
    skillId: 'dot_product',
    dimension: 'compute',
    difficulty: 2,
    prompt: `Tính tích vô hướng của u = (${a}, ${b}) và v = (${c}, ${d}).`,
    answer: ans,
    tolerance: 0,
    explain: `u · v = (${a})·(${c}) + (${b})·(${d}) = ${a * c} + ${b * d} = ${ans}.`,
    hints: [
      { level: 1, text: 'Nhân từng cặp thành phần tương ứng rồi cộng lại.' },
      { level: 2, text: `Thành phần thứ nhất: (${a})·(${c}) = ${a * c}.` },
      { level: 3, text: `Cộng lại: ${a * c} + ${b * d}.` },
    ],
  };
}

/**
 * perceptron — tổng có trọng số z = w·x của một neuron. Đầu vào nhị phân x_i ∈
 * {0, 1}, trọng số nguyên nhỏ. Đề chứa số (LaTeX) để phần minh họa đọc được.
 */
function genPerceptron(rng: () => number): NumericInputExercise {
  const tag = uid(rng);
  const x = [randInt(rng, 0, 1), randInt(rng, 0, 1), randInt(rng, 0, 1)];
  const w = [
    randNonZeroInt(rng, -3, 3),
    randNonZeroInt(rng, -3, 3),
    randNonZeroInt(rng, -3, 3),
  ];
  const ans = w[0] * x[0] + w[1] * x[1] + w[2] * x[2];
  return {
    id: `gen:perceptron:${tag}`,
    type: 'numeric-input',
    skillId: 'perceptron',
    dimension: 'compute',
    difficulty: 2,
    prompt:
      `Một perceptron nhận đầu vào $x=(${x[0]},\\,${x[1]},\\,${x[2]})$ với trọng số ` +
      `$w=(${w[0]},\\,${w[1]},\\,${w[2]})$. Tính tổng có trọng số $z=w\\cdot x$.`,
    answer: ans,
    tolerance: 0,
    explain:
      `z = ${w[0]}·${x[0]} + ${w[1]}·${x[1]} + ${w[2]}·${x[2]} = ${ans}. ` +
      'Đây chính là tích vô hướng (dot product) giữa vector trọng số và vector đầu vào.',
    hints: [
      { level: 1, text: 'Nhân từng trọng số với đầu vào tương ứng rồi cộng lại.' },
      { level: 2, text: `Các số hạng: ${w[0]}·${x[0]}, ${w[1]}·${x[1]}, ${w[2]}·${x[2]}.` },
    ],
  };
}

/**
 * matrix_multiplication — tích AB của hai ma trận 2×2 nguyên. matrix-input, hợp
 * với danh mục "Luyện ma trận". Đề chứa [[..],[..]] để bộ đọc ma trận nhận ra.
 */
function genMatrixMultiply(rng: () => number): MatrixInputExercise {
  const tag = uid(rng);
  const a = randInt(rng, -3, 4);
  const b = randInt(rng, -3, 4);
  const c = randInt(rng, -3, 4);
  const d = randInt(rng, -3, 4);
  const e = randInt(rng, -3, 4);
  const f = randInt(rng, -3, 4);
  const g = randInt(rng, -3, 4);
  const h = randInt(rng, -3, 4);
  const p = a * e + b * g;
  const q = a * f + b * h;
  const r = c * e + d * g;
  const s = c * f + d * h;
  return {
    id: `gen:matrix_multiplication:${tag}`,
    type: 'matrix-input',
    skillId: 'matrix_multiplication',
    dimension: 'compute',
    difficulty: 2,
    prompt:
      `Tính tích AB với A = [[${a}, ${b}], [${c}, ${d}]] và ` +
      `B = [[${e}, ${f}], [${g}, ${h}]]. Nhập ma trận kết quả (2×2).`,
    rows: 2,
    cols: 2,
    answer: [
      [p, q],
      [r, s],
    ],
    tolerance: 0,
    explain:
      `Phần tử (i, j) = (hàng i của A)·(cột j của B). ` +
      `(1,1)=${a}·${e}+${b}·${g}=${p}; (1,2)=${a}·${f}+${b}·${h}=${q}; ` +
      `(2,1)=${c}·${e}+${d}·${g}=${r}; (2,2)=${c}·${f}+${d}·${h}=${s}.`,
    hints: [
      { level: 1, text: 'Phần tử (i, j) lấy hàng i của A nhân cột j của B rồi cộng.' },
      { level: 2, text: `Ô (1,1) = ${a}·${e} + ${b}·${g}.` },
      { level: 3, text: `Ô (2,2) = ${c}·${f} + ${d}·${h} = ${s}.` },
    ],
  };
}

/**
 * determinant — định thức ma trận 2×2. numeric. Đề chứa [[a, b], [c, d]] để đồ
 * thị "determinant" đọc ma trận và minh họa diện tích tương ứng theo số mới.
 */
function genDeterminant(rng: () => number): NumericInputExercise {
  const tag = uid(rng);
  const a = randInt(rng, -5, 5);
  const b = randInt(rng, -5, 5);
  const c = randInt(rng, -5, 5);
  const d = randInt(rng, -5, 5);
  const ans = a * d - b * c;
  return {
    id: `gen:determinant:${tag}`,
    type: 'numeric-input',
    skillId: 'determinant',
    dimension: 'compute',
    difficulty: 2,
    prompt: `Tính định thức của ma trận A = [[${a}, ${b}], [${c}, ${d}]].`,
    answer: ans,
    tolerance: 0,
    explain: `Với 2×2 [[a, b], [c, d]]: det = ad − bc = ${a}·${d} − ${b}·${c} = ${a * d} − ${b * c} = ${ans}.`,
    hints: [
      { level: 1, text: 'Với ma trận 2×2 [[a, b], [c, d]], det = ad − bc.' },
      { level: 2, text: `ad = ${a}·${d} = ${a * d}; bc = ${b}·${c} = ${b * c}.` },
    ],
  };
}

/**
 * vector_addition — tổng hai vector 2D (viết dạng cột). matrix-input 2×1 (hợp cả
 * danh mục "Luyện ma trận"). Đề chứa a = (·,·) và b = (·,·) để đồ thị "vectors"
 * vẽ lại theo số mới.
 */
function genVectorAddition(rng: () => number): MatrixInputExercise {
  const tag = uid(rng);
  const a1 = randNonZeroInt(rng, -6, 6);
  const a2 = randNonZeroInt(rng, -6, 6);
  const b1 = randNonZeroInt(rng, -6, 6);
  const b2 = randNonZeroInt(rng, -6, 6);
  return {
    id: `gen:vector_addition:${tag}`,
    type: 'matrix-input',
    skillId: 'vector_addition',
    dimension: 'compute',
    difficulty: 1,
    prompt: `Cho a = (${a1}, ${a2}) và b = (${b1}, ${b2}) (viết dạng cột). Tính a + b.`,
    rows: 2,
    cols: 1,
    answer: [[a1 + b1], [a2 + b2]],
    tolerance: 0,
    explain: `Cộng theo từng thành phần: (${a1} + ${b1}, ${a2} + ${b2}) = (${a1 + b1}, ${a2 + b2}).`,
    hints: [
      { level: 1, text: 'Cộng vector là cộng từng thành phần tương ứng.' },
      { level: 2, text: `Thành phần đầu: ${a1} + ${b1} = ${a1 + b1}.` },
    ],
  };
}

// ---------------------------------------------------------------------------
// REGISTRY
// ---------------------------------------------------------------------------

/** Các generator viết sẵn (mẫu chứng minh + khuôn mẫu cho QA). */
export const BUILTIN_GENERATORS: ExerciseGenerator[] = [
  { skillId: 'dot_product', gen: genDotProduct },
  { skillId: 'perceptron', gen: genPerceptron },
  { skillId: 'matrix_multiplication', gen: genMatrixMultiply },
  { skillId: 'determinant', gen: genDeterminant },
  { skillId: 'vector_addition', gen: genVectorAddition },
];

/** Gom generator theo skillId (nhiều generator/skill được phép). */
export const SKILL_GENERATORS: Record<string, GenFn[]> = {};

/**
 * Đăng ký thêm generator vào registry (idempotent theo tham chiếu hàm). Content
 * registry gọi hàm này để nạp generators do module tự khai báo.
 */
export function registerGenerators(gens: ExerciseGenerator[]): void {
  if (!Array.isArray(gens)) return;
  for (const g of gens) {
    if (!g || typeof g.skillId !== 'string' || !g.skillId || typeof g.gen !== 'function') {
      continue;
    }
    const list = (SKILL_GENERATORS[g.skillId] ??= []);
    if (!list.includes(g.gen)) list.push(g.gen);
  }
}

// Nạp sẵn các generator builtin + theo miền ngay khi module được import.
registerGenerators(BUILTIN_GENERATORS);
registerGenerators(VECTOR_GENERATORS);
registerGenerators(SYSTEM_GENERATORS);

/**
 * Sinh bài MỚI cho các skill CÓ generator, trộn đều kiểu round-robin, tối đa
 * `max` bài, id không trùng. Skill không có generator bị bỏ qua ở đây (pool
 * tĩnh của exerciseBank lo phần fallback). Tất định theo `seed`:
 * mỗi (skill, vòng i) gieo `mulberry32(seed ^ hashStr(skillId) + i)`.
 */
export function genExercisesForSkills(
  skillIds: string[],
  max: number,
  seed: number,
): Exercise[] {
  if (max <= 0) return [];
  const skills = skillIds.filter((id) => (SKILL_GENERATORS[id]?.length ?? 0) > 0);
  if (skills.length === 0) return [];

  const base = seed >>> 0;
  const out: Exercise[] = [];
  const seen = new Set<string>();

  const hardCap = max + skills.length + 8; // chặn cứng, tránh lặp vô hạn
  for (let round = 0; out.length < max && round < hardCap; round++) {
    let progressed = false;
    for (const id of skills) {
      if (out.length >= max) break;
      const gens = SKILL_GENERATORS[id];
      if (!gens || gens.length === 0) continue;
      const rng = mulberry32((base ^ (hashStr(id) + round)) >>> 0);
      const ex = gens[round % gens.length](rng);
      if (seen.has(ex.id)) continue;
      out.push(ex);
      seen.add(ex.id);
      progressed = true;
    }
    if (!progressed) break;
  }
  return out.slice(0, max);
}
