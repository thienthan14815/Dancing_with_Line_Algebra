import { describe, it, expect } from 'vitest';
import { SYSTEM_GENERATORS } from '../generators.systems';
import type {
  NumericInputExercise,
  MatrixInputExercise,
  MultipleChoiceExercise,
} from '../types';
import { mulberry32 } from '../../rng';

// ---------------------------------------------------------------------------
// Nguyên tắc kiểm thử: KHÔNG tin đáp án generator. Với mỗi bài, ta PARSE lại
// các con số ra khỏi ex.prompt bằng regex rồi TỰ TÍNH độc lập, sau đó so với
// đáp án. Nếu generator tính sai (dù chỉ một seed) test sẽ bắt được.
// ---------------------------------------------------------------------------

const SEEDS = Array.from({ length: 40 }, (_, i) => i + 1); // 1..40

/** Lấy generator theo skillId từ registry đang xuất. */
function genFor(skillId: string) {
  const entry = SYSTEM_GENERATORS.find((g) => g.skillId === skillId);
  if (!entry) throw new Error(`Không tìm thấy generator cho ${skillId}`);
  return entry.gen;
}

// Bản sao ĐỘC LẬP của bảng lượng giác dùng để đối chiếu (không import từ file gốc).
const TABLE_REF: Record<number, { sin: string; cos: string }> = {
  0: { sin: '0', cos: '1' },
  30: { sin: '1/2', cos: '√3/2' },
  45: { sin: '√2/2', cos: '√2/2' },
  60: { sin: '√3/2', cos: '1/2' },
  90: { sin: '1', cos: '0' },
};

// ---------------------------------------------------------------------------
// 1) linear_system — nghiệm phải thỏa CẢ HAI phương trình; det ≠ 0.
// ---------------------------------------------------------------------------
describe('genLinearSystem (linear_system)', () => {
  const gen = genFor('linear_system');
  const re =
    /(-?\d+)x \+ (-?\d+)y = (-?\d+);\s+(-?\d+)x \+ (-?\d+)y = (-?\d+)\./;

  it('đáp án thỏa cả hai phương trình và det ≠ 0 với mọi seed', () => {
    const ids = new Set<string>();
    for (const seed of SEEDS) {
      const ex = gen(mulberry32(seed)) as MatrixInputExercise;
      expect(ex.type).toBe('matrix-input');
      expect(ex.skillId).toBe('linear_system');
      expect(ex.id.startsWith('gen:linear_system:')).toBe(true);
      ids.add(ex.id);

      const m = re.exec(ex.prompt);
      expect(m, `prompt không parse được: ${ex.prompt}`).not.toBeNull();
      const a = Number(m![1]);
      const b = Number(m![2]);
      const e = Number(m![3]);
      const c = Number(m![4]);
      const d = Number(m![5]);
      const f = Number(m![6]);

      // det ≠ 0 → nghiệm duy nhất.
      expect(a * d - b * c).not.toBe(0);

      // ex.answer dạng [[x],[y]].
      expect(ex.rows).toBe(2);
      expect(ex.cols).toBe(1);
      const x = ex.answer[0][0];
      const y = ex.answer[1][0];

      // Thay nghiệm vào CẢ HAI phương trình (dùng === để coi -0 và +0 là bằng).
      expect(a * x + b * y === e).toBe(true);
      expect(c * x + d * y === f).toBe(true);
    }
    expect(ids.size).toBeGreaterThanOrEqual(25);
  });
});

// ---------------------------------------------------------------------------
// 2) gaussian_elimination — giải độc lập bằng Cramer, so với ex.answer.
// ---------------------------------------------------------------------------
describe('genGaussX (gaussian_elimination)', () => {
  const gen = genFor('gaussian_elimination');
  const re =
    /(-?\d+)x \+ (-?\d+)y = (-?\d+);\s+(-?\d+)x \+ (-?\d+)y = (-?\d+)\./;

  it('x tính độc lập (Cramer) khớp ex.answer và là số nguyên với mọi seed', () => {
    const ids = new Set<string>();
    for (const seed of SEEDS) {
      const ex = gen(mulberry32(seed)) as NumericInputExercise;
      expect(ex.type).toBe('numeric-input');
      expect(ex.skillId).toBe('gaussian_elimination');
      expect(ex.id.startsWith('gen:gaussian_elimination:')).toBe(true);
      ids.add(ex.id);

      const m = re.exec(ex.prompt);
      expect(m, `prompt không parse được: ${ex.prompt}`).not.toBeNull();
      const a = Number(m![1]);
      const b = Number(m![2]);
      const e = Number(m![3]);
      const c = Number(m![4]);
      const d = Number(m![5]);
      const f = Number(m![6]);

      const det = a * d - b * c;
      expect(det).not.toBe(0);
      const x = (e * d - b * f) / det;

      expect(Number.isInteger(x)).toBe(true);
      // === để -0 (do 0/det khi det<0) và +0 được coi là bằng.
      expect(ex.answer === x).toBe(true);
    }
    expect(ids.size).toBeGreaterThanOrEqual(25);
  });
});

// ---------------------------------------------------------------------------
// 3) functions_graphs — f(x0) tính lại từ hệ số parse được.
// ---------------------------------------------------------------------------
describe('genEvalQuadratic (functions_graphs)', () => {
  const gen = genFor('functions_graphs');
  const re = /f\(x\) = (-?\d+)x² \+ (-?\d+)x \+ (-?\d+)\. Tính f\((-?\d+)\)/;

  it('ex.answer === a·x0² + b·x0 + c với mọi seed', () => {
    const ids = new Set<string>();
    for (const seed of SEEDS) {
      const ex = gen(mulberry32(seed)) as NumericInputExercise;
      expect(ex.type).toBe('numeric-input');
      expect(ex.skillId).toBe('functions_graphs');
      expect(ex.id.startsWith('gen:functions_graphs:')).toBe(true);
      ids.add(ex.id);

      const m = re.exec(ex.prompt);
      expect(m, `prompt không parse được: ${ex.prompt}`).not.toBeNull();
      const a = Number(m![1]);
      const b = Number(m![2]);
      const c = Number(m![3]);
      const x0 = Number(m![4]);

      // === để -0 (vd hệ số âm nhân 0) và +0 được coi là bằng.
      expect(ex.answer === a * x0 * x0 + b * x0 + c).toBe(true);
    }
    expect(ids.size).toBeGreaterThanOrEqual(25);
  });
});

// ---------------------------------------------------------------------------
// 4) trigonometry — đáp án được chọn khớp bảng giá trị đúng độc lập.
// ---------------------------------------------------------------------------
describe('genTrigSpecial (trigonometry)', () => {
  const gen = genFor('trigonometry');
  const re = /Giá trị của (sin|cos)\((\d+)°\)/;

  it('ex.options[ex.answerIndex] khớp bảng lượng giác với mọi seed', () => {
    const ids = new Set<string>();
    for (const seed of SEEDS) {
      const ex = gen(mulberry32(seed)) as MultipleChoiceExercise;
      expect(ex.type).toBe('multiple-choice');
      expect(ex.skillId).toBe('trigonometry');
      expect(ex.id.startsWith('gen:trigonometry:')).toBe(true);
      ids.add(ex.id);

      // Options phải là tập cố định đúng.
      expect(ex.options).toEqual(['0', '1/2', '√2/2', '√3/2', '1']);

      const m = re.exec(ex.prompt);
      expect(m, `prompt không parse được: ${ex.prompt}`).not.toBeNull();
      const fn = m![1] as 'sin' | 'cos';
      const deg = Number(m![2]);

      const expected = TABLE_REF[deg][fn];
      expect(ex.answerIndex).toBeGreaterThanOrEqual(0);
      expect(ex.options[ex.answerIndex]).toBe(expected);
    }
    // Trig có ít tổ hợp hơn → ngưỡng freshness thấp hơn.
    expect(ids.size).toBeGreaterThanOrEqual(8);
  });
});
