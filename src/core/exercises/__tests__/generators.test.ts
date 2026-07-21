import { describe, it, expect } from 'vitest';
import {
  BUILTIN_GENERATORS,
  SKILL_GENERATORS,
  registerGenerators,
  genExercisesForSkills,
  type GenFn,
} from '../generators';
import { checkExercise } from '../engine';
import type { Exercise } from '../types';
import { mulberry32 } from '../../rng';

// ---------------------------------------------------------------------------
// Đáp án ĐÚNG mà generator TỰ TÍNH (rút thẳng từ chính Exercise). Nếu đưa lại
// vào checkExercise mà chấm sai thì generator đã tính sai — test sẽ bắt được.
// ---------------------------------------------------------------------------
function correctAnswerOf(ex: Exercise): unknown {
  switch (ex.type) {
    case 'numeric-input':
      return ex.answer;
    case 'matrix-input':
      return ex.answer;
    case 'multiple-choice':
      return ex.answerIndex;
    case 'true-false':
      return ex.answer;
    case 'vector-drawing':
      return ex.target;
    case 'error-detection':
      return ex.wrongLineIndex;
    default:
      return null;
  }
}

const SEEDS = [0, 1, 2, 7, 42, 100, 2024, 0xdeadbeef];

describe('rng.mulberry32', () => {
  it('tất định theo seed và nằm trong [0, 1)', () => {
    const a = mulberry32(123);
    const b = mulberry32(123);
    for (let i = 0; i < 50; i++) {
      const x = a();
      expect(x).toBe(b());
      expect(x).toBeGreaterThanOrEqual(0);
      expect(x).toBeLessThan(1);
    }
  });

  it('seed khác → chuỗi khác', () => {
    const a = mulberry32(1);
    const b = mulberry32(2);
    const seqA = Array.from({ length: 10 }, () => a());
    const seqB = Array.from({ length: 10 }, () => b());
    expect(seqA).not.toEqual(seqB);
  });
});

describe('BUILTIN_GENERATORS — đáp án luôn ĐÚNG khi chấm', () => {
  for (const { skillId, gen } of BUILTIN_GENERATORS) {
    it(`${skillId}: checkExercise(ex, đáp_án_generator) = correct với mọi seed`, () => {
      for (const seed of SEEDS) {
        const ex = gen(mulberry32(seed));
        expect(ex.skillId).toBe(skillId);
        expect(ex.id).toMatch(new RegExp(`^gen:${skillId}:`));
        const res = checkExercise(ex, correctAnswerOf(ex));
        expect(res.correct).toBe(true);
      }
    });
  }
});

describe('BUILTIN_GENERATORS — seed khác nhau → bài KHÁC nhau', () => {
  for (const { skillId, gen } of BUILTIN_GENERATORS) {
    it(`${skillId}: nhiều seed cho ra ít nhất 2 đề phân biệt`, () => {
      const prompts = new Set<string>();
      const answers = new Set<string>();
      for (const seed of SEEDS) {
        const ex = gen(mulberry32(seed));
        prompts.add(ex.prompt);
        answers.add(JSON.stringify(correctAnswerOf(ex)));
      }
      // Đề bài phải đa dạng (số liệu mới) — không phải mọi seed ra một đề.
      expect(prompts.size).toBeGreaterThan(1);
      expect(answers.size).toBeGreaterThan(1);
    });

    it(`${skillId}: cùng seed → cùng đề (tất định)`, () => {
      const a = gen(mulberry32(12345));
      const b = gen(mulberry32(12345));
      expect(a).toEqual(b);
    });
  }
});

describe('genExercisesForSkills', () => {
  const genSkills = BUILTIN_GENERATORS.map((g) => g.skillId);

  it('trả đúng số lượng khi có đủ skill có generator', () => {
    const list = genExercisesForSkills(genSkills, 6, 1);
    expect(list.length).toBe(6);
  });

  it('không vượt quá max và id KHÔNG trùng', () => {
    for (const seed of SEEDS) {
      const list = genExercisesForSkills(genSkills, 10, seed);
      expect(list.length).toBeLessThanOrEqual(10);
      const ids = list.map((e) => e.id);
      expect(new Set(ids).size).toBe(ids.length);
    }
  });

  it('tất định theo seed; seed khác → kết quả khác', () => {
    const a1 = genExercisesForSkills(genSkills, 6, 999);
    const a2 = genExercisesForSkills(genSkills, 6, 999);
    expect(a1).toEqual(a2);

    const b = genExercisesForSkills(genSkills, 6, 1000);
    expect(a1).not.toEqual(b);
  });

  it('mọi bài sinh ra đều chấm ĐÚNG bằng đáp án tự tính', () => {
    const list = genExercisesForSkills(genSkills, 12, 55);
    expect(list.length).toBeGreaterThan(0);
    for (const ex of list) {
      expect(checkExercise(ex, correctAnswerOf(ex)).correct).toBe(true);
    }
  });

  it('bỏ qua skill KHÔNG có generator; skill lạ → mảng rỗng', () => {
    expect(genExercisesForSkills(['khong_ton_tai_123'], 6, 1)).toEqual([]);
    const mixed = genExercisesForSkills(['khong_ton_tai_123', 'dot_product'], 6, 3);
    expect(mixed.length).toBeGreaterThan(0);
    expect(mixed.every((e) => e.skillId === 'dot_product')).toBe(true);
  });

  it('max <= 0 → mảng rỗng', () => {
    expect(genExercisesForSkills(genSkills, 0, 1)).toEqual([]);
    expect(genExercisesForSkills(genSkills, -3, 1)).toEqual([]);
  });
});

describe('registerGenerators', () => {
  it('nạp generator mới cho một skill và genExercisesForSkills dùng được', () => {
    const skillId = '__test_skill_reg__';
    const gen: GenFn = (rng) => ({
      id: `gen:${skillId}:${Math.floor(rng() * 1e9)}`,
      type: 'numeric-input',
      skillId,
      dimension: 'compute',
      difficulty: 1,
      prompt: 'Test 1 + 1 = ?',
      answer: 2,
      tolerance: 0,
      explain: '1 + 1 = 2.',
      hints: [],
    });
    registerGenerators([{ skillId, gen }]);
    expect(SKILL_GENERATORS[skillId]).toBeDefined();

    const list = genExercisesForSkills([skillId], 3, 8);
    expect(list.length).toBeGreaterThan(0);
    expect(list[0].skillId).toBe(skillId);
    expect(checkExercise(list[0], 2).correct).toBe(true);
  });

  it('idempotent theo tham chiếu hàm (không đăng ký trùng)', () => {
    const skillId = '__test_skill_idem__';
    const gen: GenFn = (rng) => ({
      id: `gen:${skillId}:${Math.floor(rng() * 1e9)}`,
      type: 'numeric-input',
      skillId,
      dimension: 'compute',
      difficulty: 1,
      prompt: 'x?',
      answer: 0,
      tolerance: 0,
      hints: [],
    });
    registerGenerators([{ skillId, gen }]);
    registerGenerators([{ skillId, gen }]);
    expect(SKILL_GENERATORS[skillId].length).toBe(1);
  });
});
