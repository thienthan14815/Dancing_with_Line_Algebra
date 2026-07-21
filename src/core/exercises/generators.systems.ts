// ===========================================================================
// HỆ SINH BÀI TẬP THỦ TỤC — HỆ PHƯƠNG TRÌNH & HÀM SỐ (systems generators).
// ---------------------------------------------------------------------------
// Cùng triết lý với `generators.ts`: mỗi generator nhận một RNG tất định và
// sinh MỘT `Exercise` hợp lệ với số liệu ngẫu nhiên nhưng đáp án LUÔN đúng —
// vì bài được SINH TỪ NGHIỆM BIẾT TRƯỚC (không đi giải ngược), nên nghiệm là
// số nguyên và chính xác tuyệt đối.
//
// PHỤ THUỘC: chỉ `./types` (shape Exercise), type-only `./generators`
// (ExerciseGenerator) và `../rng` (RNG thuần) ⇒ đồ thị import một chiều.
// ===========================================================================

import type {
  Exercise,
  NumericInputExercise,
  MatrixInputExercise,
  MultipleChoiceExercise,
} from './types';
import type { ExerciseGenerator } from './generators'; // type-only → no runtime cycle
import { randInt, randNonZeroInt, pick } from '../rng';

/**
 * Hậu tố id DUY NHẤT + tất định: rút từ chính RNG (đang được gieo theo
 * seed+skill+vòng ở genExercisesForSkills). Cùng seed → cùng hậu tố; seed/vòng
 * khác → hậu tố khác ⇒ id không trùng mà vẫn reproducible.
 */
function uid(rng: () => number): string {
  return String(Math.floor(rng() * 0x7fffffff));
}

/**
 * Sinh hệ số 2×2 [[a, b], [c, d]] có ĐỊNH THỨC KHÁC 0 (nghiệm duy nhất).
 * Reject-and-retry: chọn lại a, b, c, d tới khi det = a·d − b·c ≠ 0. Vòng lặp
 * có chặn cứng; nếu (cực hiếm) chưa đạt thì ép b = c = 0 → det = a·d ≠ 0 vì a, d
 * đã là số khác 0.
 */
function pickInvertible2x2(rng: () => number): {
  a: number;
  b: number;
  c: number;
  d: number;
} {
  let a = randNonZeroInt(rng, -4, 4);
  let b = randInt(rng, -4, 4);
  let c = randInt(rng, -4, 4);
  let d = randNonZeroInt(rng, -4, 4);
  let guard = 0;
  while (a * d - b * c === 0 && guard++ < 64) {
    a = randNonZeroInt(rng, -4, 4);
    b = randInt(rng, -4, 4);
    c = randInt(rng, -4, 4);
    d = randNonZeroInt(rng, -4, 4);
  }
  if (a * d - b * c === 0) {
    // Fallback bảo chứng: a, d ≠ 0 ⇒ det = a·d ≠ 0.
    b = 0;
    c = 0;
  }
  return { a, b, c, d };
}

// ---------------------------------------------------------------------------
// 1) linear_system — nghiệm (x; y) của hệ 2×2, matrix-input 2×1.
// ---------------------------------------------------------------------------

/**
 * Sinh TỪ NGHIỆM BIẾT TRƯỚC: chọn (x, y) nguyên và ma trận hệ số khả nghịch,
 * rồi tính vế phải e = a·x + b·y, f = c·x + d·y. Đáp án [[x], [y]] chắc chắn
 * thỏa cả hai phương trình.
 */
function genLinearSystem(rng: () => number): MatrixInputExercise {
  const tag = uid(rng);
  const x = randInt(rng, -5, 5);
  const y = randInt(rng, -5, 5);
  const { a, b, c, d } = pickInvertible2x2(rng);
  const e = a * x + b * y;
  const f = c * x + d * y;
  const det = a * d - b * c;
  return {
    id: `gen:linear_system:${tag}`,
    type: 'matrix-input',
    skillId: 'linear_system',
    dimension: 'compute',
    difficulty: 2,
    prompt:
      `Giải hệ phương trình:  ${a}x + ${b}y = ${e};  ${c}x + ${d}y = ${f}.  ` +
      `Nhập nghiệm (x; y) dạng cột.`,
    rows: 2,
    cols: 1,
    answer: [[x], [y]],
    tolerance: 0,
    explain:
      `Hệ có định thức det = a·d − b·c = ${a}·${d} − ${b}·${c} = ${det} ≠ 0 nên có ` +
      `nghiệm duy nhất. Theo quy tắc Cramer: x = (e·d − b·f)/det = ` +
      `(${e}·${d} − ${b}·${f})/${det} = ${x}; y = (a·f − c·e)/det = ` +
      `(${a}·${f} − ${c}·${e})/${det} = ${y}.`,
    hints: [
      { level: 1, text: 'Khử một ẩn (thế hoặc cộng đại số) để đưa về phương trình một ẩn.' },
      { level: 2, text: `Định thức hệ số det = ${a}·${d} − ${b}·${c} = ${det} (khác 0).` },
      { level: 3, text: `Cramer: x = (${e}·${d} − ${b}·${f})/${det}, y = (${a}·${f} − ${c}·${e})/${det}.` },
    ],
  };
}

// ---------------------------------------------------------------------------
// 2) gaussian_elimination — giá trị x của nghiệm hệ 2×2, numeric-input.
// ---------------------------------------------------------------------------

/** Cùng cách sinh như #1 (nghiệm biết trước, det ≠ 0) nhưng chỉ hỏi x. */
function genGaussX(rng: () => number): NumericInputExercise {
  const tag = uid(rng);
  const x = randInt(rng, -5, 5);
  const y = randInt(rng, -5, 5);
  const { a, b, c, d } = pickInvertible2x2(rng);
  const e = a * x + b * y;
  const f = c * x + d * y;
  const det = a * d - b * c;
  return {
    id: `gen:gaussian_elimination:${tag}`,
    type: 'numeric-input',
    skillId: 'gaussian_elimination',
    dimension: 'compute',
    difficulty: 2,
    prompt:
      `Dùng khử Gauss giải hệ:  ${a}x + ${b}y = ${e};  ${c}x + ${d}y = ${f}.  ` +
      `Nhập giá trị của x.`,
    answer: x,
    tolerance: 0,
    explain:
      `Khử y để còn một ẩn x. Định thức det = ${a}·${d} − ${b}·${c} = ${det} ≠ 0. ` +
      `Theo Cramer: x = (e·d − b·f)/det = (${e}·${d} − ${b}·${f})/${det} = ${x}.`,
    hints: [
      { level: 1, text: 'Nhân hai phương trình cho hệ số phù hợp rồi trừ để khử y.' },
      { level: 2, text: `Định thức hệ số det = ${a}·${d} − ${b}·${c} = ${det}.` },
      { level: 3, text: `x = (${e}·${d} − ${b}·${f})/${det} = ${x}.` },
    ],
  };
}

// ---------------------------------------------------------------------------
// 3) functions_graphs — tính giá trị hàm bậc hai tại một điểm, numeric-input.
// ---------------------------------------------------------------------------

/** f(x) = a·x² + b·x + c; hỏi f(x0). Đáp án = a·x0² + b·x0 + c (số nguyên). */
function genEvalQuadratic(rng: () => number): NumericInputExercise {
  const tag = uid(rng);
  const a = randNonZeroInt(rng, -3, 3);
  const b = randInt(rng, -5, 5);
  const c = randInt(rng, -6, 6);
  const x0 = randInt(rng, -4, 4);
  const ans = a * x0 * x0 + b * x0 + c;
  return {
    id: `gen:functions_graphs:${tag}`,
    type: 'numeric-input',
    skillId: 'functions_graphs',
    dimension: 'compute',
    difficulty: 2,
    // Giữ nguyên dấu thô (vd "+ -3x") cho dễ đọc & dễ đối chiếu số liệu.
    prompt: `Cho f(x) = ${a}x² + ${b}x + ${c}. Tính f(${x0}).`,
    answer: ans,
    tolerance: 0,
    explain:
      `Thay x = ${x0}: f(${x0}) = ${a}·(${x0})² + ${b}·(${x0}) + ${c} = ` +
      `${a * x0 * x0} + ${b * x0} + ${c} = ${ans}.`,
    hints: [
      { level: 1, text: 'Thay x = x0 vào biểu thức rồi tính theo thứ tự lũy thừa → nhân → cộng.' },
      { level: 2, text: `Số hạng bậc hai: ${a}·(${x0})² = ${a * x0 * x0}.` },
      { level: 3, text: `Cộng lại: ${a * x0 * x0} + ${b * x0} + ${c} = ${ans}.` },
    ],
  };
}

// ---------------------------------------------------------------------------
// 4) trigonometry — giá trị lượng giác của góc đặc biệt, multiple-choice.
// ---------------------------------------------------------------------------

/** Bảng giá trị ĐÚNG TUYỆT ĐỐI (dạng chuỗi) cho các góc đặc biệt. */
const TRIG_TABLE: ReadonlyArray<{ deg: number; sin: string; cos: string }> = [
  { deg: 0, sin: '0', cos: '1' },
  { deg: 30, sin: '1/2', cos: '√3/2' },
  { deg: 45, sin: '√2/2', cos: '√2/2' },
  { deg: 60, sin: '√3/2', cos: '1/2' },
  { deg: 90, sin: '1', cos: '0' },
];

/** Tập ĐẦY ĐỦ các giá trị đúng phân biệt xuất hiện trong bảng (cố định). */
const TRIG_OPTIONS: readonly string[] = ['0', '1/2', '√2/2', '√3/2', '1'];

/** Hỏi sin/cos của một góc đặc biệt; đáp án tra thẳng từ bảng. */
function genTrigSpecial(rng: () => number): MultipleChoiceExercise {
  const tag = uid(rng);
  const row = pick(rng, TRIG_TABLE);
  const fn = pick(rng, ['sin', 'cos'] as const);
  const correctValue = row[fn];
  const options = TRIG_OPTIONS.slice();
  const answerIndex = options.indexOf(correctValue);
  return {
    id: `gen:trigonometry:${tag}`,
    type: 'multiple-choice',
    skillId: 'trigonometry',
    dimension: 'compute',
    difficulty: 1,
    prompt: `Giá trị của ${fn}(${row.deg}°) bằng bao nhiêu?`,
    options,
    answerIndex,
    explain: `${fn}(${row.deg}°) = ${correctValue}. Đây là giá trị lượng giác của góc đặc biệt.`,
    hints: [
      { level: 1, text: 'Nhớ lại bảng giá trị lượng giác các góc 0°, 30°, 45°, 60°, 90°.' },
      { level: 2, text: 'sin tăng dần 0 → 1 còn cos giảm dần 1 → 0 khi góc đi từ 0° đến 90°.' },
    ],
  };
}

// ---------------------------------------------------------------------------
// REGISTRY EXPORT
// ---------------------------------------------------------------------------

export const SYSTEM_GENERATORS: ExerciseGenerator[] = [
  { skillId: 'linear_system', gen: genLinearSystem },
  { skillId: 'gaussian_elimination', gen: genGaussX },
  { skillId: 'functions_graphs', gen: genEvalQuadratic },
  { skillId: 'trigonometry', gen: genTrigSpecial },
];

// Đảm bảo type Exercise được dùng (union bao trùm mọi nhánh trả về ở trên).
export type { Exercise };
