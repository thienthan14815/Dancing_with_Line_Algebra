// ===========================================================================
// KIỂM CHỨNG ĐỘC LẬP các generator vector.
// ---------------------------------------------------------------------------
// Với MỖI generator: gieo seed 1..40, gọi generator, rồi TỰ TÍNH LẠI đáp án
// bằng cách PARSE các toán hạng ra khỏi `ex.prompt` (KHÔNG tin `explain` hay
// answer của generator), và khẳng định nó deep-equals `ex.answer`. Cũng kiểm
// id/type/skillId, và độ "tươi" (≥ 30 id phân biệt trên 40 seed).
// ===========================================================================

import { describe, it, expect } from 'vitest';
import { VECTOR_GENERATORS } from '../generators.vectors';
import { mulberry32 } from '../../rng';
import type { GenFn } from '../generators';

const SEEDS = Array.from({ length: 40 }, (_, i) => i + 1);

/** Tìm generator theo skillId trong registry export (đảm bảo đúng dây nối). */
function genFor(skillId: string): GenFn {
  const found = VECTOR_GENERATORS.find((g) => g.skillId === skillId);
  if (!found) throw new Error(`Không tìm thấy generator cho ${skillId}`);
  return found.gen;
}

/** Bắt buộc regex khớp; trả về nhóm bắt dưới dạng số nguyên. */
function nums(prompt: string, re: RegExp): number[] {
  const m = prompt.match(re);
  if (!m) throw new Error(`Prompt không khớp regex: ${prompt}`);
  return m.slice(1).map((x) => Number.parseInt(x, 10));
}

/** Kiểm bộ khung chung + trả về tập id để đánh giá độ tươi. */
function assertCommon(
  skillId: string,
  type: 'matrix-input' | 'numeric-input',
): Set<string> {
  const gen = genFor(skillId);
  const ids = new Set<string>();
  for (const seed of SEEDS) {
    const ex = gen(mulberry32(seed));
    expect(ex.skillId).toBe(skillId);
    expect(ex.type).toBe(type);
    expect(ex.id.startsWith(`gen:${skillId}:`)).toBe(true);
    ids.add(ex.id);
  }
  return ids;
}

describe('genScalarMul — scalar_multiplication', () => {
  const gen = genFor('scalar_multiplication');
  it('answer = [[k·a],[k·b]] tính lại từ prompt, mọi seed', () => {
    for (const seed of SEEDS) {
      const ex = gen(mulberry32(seed));
      const [k, a, b] = nums(ex.prompt, /k = (-?\d+).*v = \((-?\d+), (-?\d+)\)/);
      expect(ex.type).toBe('matrix-input');
      if (ex.type !== 'matrix-input') continue;
      expect(ex.rows).toBe(2);
      expect(ex.cols).toBe(1);
      expect(ex.answer).toEqual([[k * a], [k * b]]);
    }
  });
  it('khung chung + độ tươi ≥ 30', () => {
    const ids = assertCommon('scalar_multiplication', 'matrix-input');
    expect(ids.size).toBeGreaterThanOrEqual(30);
  });
});

describe('genLinearComb — linear_combination', () => {
  const gen = genFor('linear_combination');
  it('answer = [[a·u1+b·v1],[a·u2+b·v2]] tính lại từ prompt, mọi seed', () => {
    for (const seed of SEEDS) {
      const ex = gen(mulberry32(seed));
      const [u1, u2, v1, v2, a, b] = nums(
        ex.prompt,
        /u = \((-?\d+), (-?\d+)\).*v = \((-?\d+), (-?\d+)\).*Tính (-?\d+)·u \+ (-?\d+)·v/,
      );
      expect(ex.type).toBe('matrix-input');
      if (ex.type !== 'matrix-input') continue;
      expect(ex.rows).toBe(2);
      expect(ex.cols).toBe(1);
      expect(ex.answer).toEqual([[a * u1 + b * v1], [a * u2 + b * v2]]);
    }
  });
  it('khung chung + độ tươi ≥ 30', () => {
    const ids = assertCommon('linear_combination', 'matrix-input');
    expect(ids.size).toBeGreaterThanOrEqual(30);
  });
});

describe('genCrossProduct — cross_product', () => {
  const gen = genFor('cross_product');
  it('answer = u × v tính lại từ prompt, mọi seed', () => {
    for (const seed of SEEDS) {
      const ex = gen(mulberry32(seed));
      const [u1, u2, u3, v1, v2, v3] = nums(
        ex.prompt,
        /u = \((-?\d+), (-?\d+), (-?\d+)\).*v = \((-?\d+), (-?\d+), (-?\d+)\)/,
      );
      const cx = u2 * v3 - u3 * v2;
      const cy = u3 * v1 - u1 * v3;
      const cz = u1 * v2 - u2 * v1;
      expect(ex.type).toBe('matrix-input');
      if (ex.type !== 'matrix-input') continue;
      expect(ex.rows).toBe(3);
      expect(ex.cols).toBe(1);
      expect(ex.answer).toEqual([[cx], [cy], [cz]]);
    }
  });
  it('khung chung + độ tươi ≥ 30', () => {
    const ids = assertCommon('cross_product', 'matrix-input');
    expect(ids.size).toBeGreaterThanOrEqual(30);
  });
});

describe('genVectorNorm — vector_basics', () => {
  const gen = genFor('vector_basics');
  it('answer² = a² + b² (chuẩn nguyên) tính lại từ prompt, mọi seed', () => {
    for (const seed of SEEDS) {
      const ex = gen(mulberry32(seed));
      const [a, b] = nums(ex.prompt, /v = \((-?\d+), (-?\d+)\)/);
      expect(ex.type).toBe('numeric-input');
      if (ex.type !== 'numeric-input') continue;
      expect(a * a + b * b).toBe(ex.answer * ex.answer);
      expect(ex.answer).toBeGreaterThan(0);
    }
  });
  it('khung chung + độ tươi ≥ 30', () => {
    const ids = assertCommon('vector_basics', 'numeric-input');
    expect(ids.size).toBeGreaterThanOrEqual(30);
  });
});
