import { describe, it, expect } from 'vitest';
import { checkExercise, pickHint } from '../engine';
import { SAMPLE_EXERCISES } from '../sampleBank';
import type {
  MultipleChoiceExercise,
  NumericInputExercise,
  MatrixInputExercise,
  MatchingExercise,
  StepOrderingExercise,
  VectorDrawingExercise,
  ErrorDetectionExercise,
  TrueFalseExercise,
} from '../types';

// --- Fixtures thuần (độc lập với sampleBank) -------------------------------
const mc: MultipleChoiceExercise = {
  id: 't-mc', type: 'multiple-choice', skillId: 'dot_product',
  dimension: 'concept', difficulty: 1, prompt: 'Q?',
  options: ['A', 'B', 'C'], answerIndex: 1, explain: 'Vì B đúng.',
  hints: [{ level: 1, text: 'gợi ý 1' }, { level: 3, text: 'gợi ý 3' }],
};

const num: NumericInputExercise = {
  id: 't-num', type: 'numeric-input', skillId: 'determinant',
  dimension: 'compute', difficulty: 1, prompt: 'det?',
  answer: 5, tolerance: 0, explain: '2·3−1·1=5.', hints: [],
};

const numTol: NumericInputExercise = {
  id: 't-num-tol', type: 'numeric-input', skillId: 'dot_product',
  dimension: 'compute', difficulty: 1, prompt: 'x?',
  answer: 3.14, tolerance: 0.05, hints: [],
};

const mat: MatrixInputExercise = {
  id: 't-mat', type: 'matrix-input', skillId: 'scalar_multiplication',
  dimension: 'compute', difficulty: 1, prompt: '2A?',
  rows: 2, cols: 2, answer: [[2, -4], [0, 6]], tolerance: 0, hints: [],
};

const match: MatchingExercise = {
  id: 't-match', type: 'matching', skillId: 'basis_dimension',
  dimension: 'concept', difficulty: 2, prompt: 'ghép',
  left: ['a', 'b'], right: ['X', 'Y'], pairs: [[0, 1], [1, 0]], hints: [],
};

const step: StepOrderingExercise = {
  id: 't-step', type: 'step-ordering', skillId: 'gaussian_elimination',
  dimension: 'compute', difficulty: 2, prompt: 'khử Gauss',
  steps: ['s1', 's2', 's3'], hints: [],
};

const draw: VectorDrawingExercise = {
  id: 't-draw', type: 'vector-drawing', skillId: 'vector_basics',
  dimension: 'visual', difficulty: 1, prompt: 'vẽ (3,2)',
  target: [3, 2], tolerance: 0.3, hints: [],
};

const errDet: ErrorDetectionExercise = {
  id: 't-err', type: 'error-detection', skillId: 'matrix_multiplication',
  dimension: 'compute', difficulty: 2, prompt: 'tìm dòng sai',
  lines: ['l0', 'l1', 'l2'], wrongLineIndex: 2, explain: 'l2 sai.', hints: [],
};

const tf: TrueFalseExercise = {
  id: 't-tf', type: 'true-false', skillId: 'determinant',
  dimension: 'concept', difficulty: 1, prompt: 'Đ/S',
  statement: 'Hàng 0 ⇒ det = 0', answer: true, explain: 'Đúng.', hints: [],
};

describe('checkExercise — multiple-choice', () => {
  it('đúng khi chọn đúng index', () => {
    const r = checkExercise(mc, 1);
    expect(r.correct).toBe(true);
    expect(r.feedback).toContain('Vì B đúng');
  });
  it('sai + errorType CONCEPTUAL_ERROR', () => {
    const r = checkExercise(mc, 0);
    expect(r.correct).toBe(false);
    expect(r.errorType).toBe('CONCEPTUAL_ERROR');
    expect(r.feedback).toContain('B');
  });
  it('input không hợp lệ → INVALID_INPUT', () => {
    const r = checkExercise(mc, 'B');
    expect(r.correct).toBe(false);
    expect(r.errorType).toBe('INVALID_INPUT');
  });
});

describe('checkExercise — numeric-input', () => {
  it('đúng', () => {
    expect(checkExercise(num, 5).correct).toBe(true);
  });
  it('đúng khi nhập chuỗi số', () => {
    expect(checkExercise(num, '5').correct).toBe(true);
  });
  it('sai dấu → SIGN_ERROR', () => {
    const r = checkExercise(num, -5);
    expect(r.correct).toBe(false);
    expect(r.errorType).toBe('SIGN_ERROR');
  });
  it('sai số học → ARITHMETIC_ERROR', () => {
    const r = checkExercise(num, 7);
    expect(r.correct).toBe(false);
    expect(r.errorType).toBe('ARITHMETIC_ERROR');
  });
  it('trong dung sai → đúng', () => {
    expect(checkExercise(numTol, 3.13).correct).toBe(true);
    expect(checkExercise(numTol, 3.5).correct).toBe(false);
  });
});

describe('checkExercise — matrix-input', () => {
  it('đúng', () => {
    expect(checkExercise(mat, [[2, -4], [0, 6]]).correct).toBe(true);
  });
  it('sai kích thước → INVALID_MATRIX_DIMENSION', () => {
    const r = checkExercise(mat, [[2, -4]]);
    expect(r.correct).toBe(false);
    expect(r.errorType).toBe('INVALID_MATRIX_DIMENSION');
  });
  it('toàn bộ ngược dấu → SIGN_ERROR', () => {
    const r = checkExercise(mat, [[-2, 4], [0, -6]]);
    expect(r.correct).toBe(false);
    expect(r.errorType).toBe('SIGN_ERROR');
    expect(r.detailSteps && r.detailSteps.length).toBeGreaterThan(0);
  });
  it('sai một ô → ARITHMETIC_ERROR + detailSteps', () => {
    const r = checkExercise(mat, [[2, -4], [0, 7]]);
    expect(r.correct).toBe(false);
    expect(r.errorType).toBe('ARITHMETIC_ERROR');
    expect(r.detailSteps).toBeDefined();
  });
});

describe('checkExercise — matching', () => {
  it('đúng', () => {
    expect(checkExercise(match, [[0, 1], [1, 0]]).correct).toBe(true);
  });
  it('sai → MATCHING_ERROR', () => {
    const r = checkExercise(match, [[0, 0], [1, 1]]);
    expect(r.correct).toBe(false);
    expect(r.errorType).toBe('MATCHING_ERROR');
    expect(r.detailSteps && r.detailSteps.length).toBeGreaterThan(0);
  });
});

describe('checkExercise — step-ordering', () => {
  it('đúng bằng string[]', () => {
    expect(checkExercise(step, ['s1', 's2', 's3']).correct).toBe(true);
  });
  it('đúng bằng number[] (hoán vị identity)', () => {
    expect(checkExercise(step, [0, 1, 2]).correct).toBe(true);
  });
  it('sai thứ tự (skill Gauss) → WRONG_ELIMINATION_OPERATION', () => {
    const r = checkExercise(step, ['s2', 's1', 's3']);
    expect(r.correct).toBe(false);
    expect(r.errorType).toBe('WRONG_ELIMINATION_OPERATION');
  });
  it('skill không phải Gauss → ORDERING_ERROR', () => {
    const other: StepOrderingExercise = { ...step, skillId: 'projection', prompt: 'xếp' };
    const r = checkExercise(other, ['s3', 's2', 's1']);
    expect(r.errorType).toBe('ORDERING_ERROR');
  });
});

describe('checkExercise — vector-drawing', () => {
  it('đúng trong dung sai', () => {
    expect(checkExercise(draw, [3.1, 1.9]).correct).toBe(true);
  });
  it('ngược hướng → SIGN_ERROR', () => {
    const r = checkExercise(draw, [-3, -2]);
    expect(r.correct).toBe(false);
    expect(r.errorType).toBe('SIGN_ERROR');
  });
  it('lệch hướng → DIRECTION_ERROR', () => {
    const r = checkExercise(draw, [1, 3]);
    expect(r.correct).toBe(false);
    expect(r.errorType).toBe('DIRECTION_ERROR');
  });
});

describe('checkExercise — error-detection', () => {
  it('đúng chỉ ra dòng sai', () => {
    const r = checkExercise(errDet, 2);
    expect(r.correct).toBe(true);
    expect(r.detailSteps).toBeDefined();
  });
  it('chọn nhầm dòng → DETECTION_MISS', () => {
    const r = checkExercise(errDet, 0);
    expect(r.correct).toBe(false);
    expect(r.errorType).toBe('DETECTION_MISS');
    expect(r.feedback).toContain('dòng 3');
  });
});

describe('checkExercise — true-false', () => {
  it('đúng', () => {
    expect(checkExercise(tf, true).correct).toBe(true);
  });
  it('sai → CONCEPTUAL_ERROR', () => {
    const r = checkExercise(tf, false);
    expect(r.correct).toBe(false);
    expect(r.errorType).toBe('CONCEPTUAL_ERROR');
  });
});

describe('pickHint', () => {
  it('lấy đúng bậc', () => {
    expect(pickHint(mc, 1)?.text).toBe('gợi ý 1');
    expect(pickHint(mc, 3)?.text).toBe('gợi ý 3');
  });
  it('không có đúng bậc → lấy bậc thấp hơn gần nhất', () => {
    expect(pickHint(mc, 2)?.text).toBe('gợi ý 1');
  });
  it('không có gợi ý → undefined', () => {
    expect(pickHint(num, 1)).toBeUndefined();
  });
});

describe('SAMPLE_EXERCISES phủ đủ 8 dạng và chấm được', () => {
  it('có đủ 8 loại type', () => {
    const types = new Set(SAMPLE_EXERCISES.map((e) => e.type));
    expect(types.size).toBe(8);
  });
  it('mọi sample đều trả CheckResult hợp lệ với input rỗng', () => {
    for (const ex of SAMPLE_EXERCISES) {
      const r = checkExercise(ex, undefined);
      expect(typeof r.correct).toBe('boolean');
      expect(typeof r.feedback).toBe('string');
      expect(r.feedback.length).toBeGreaterThan(0);
    }
  });
});
