import { describe, it, expect } from 'vitest';
import type { FlatMicroLesson } from '../../core/content/types';
import type { SkillMastery } from '../../core/db/schema';
import { recommendNext } from './recommend';

// --- factories -------------------------------------------------------------
function lesson(id: string, skillIds: string[]): FlatMicroLesson {
  return {
    sectionId: 'sec',
    unitId: 'unit',
    lesson: { id, title: id, skillIds, kind: 'concept' },
  };
}

function mm(skillId: string, score: number, when = '2026-01-01T00:00:00.000Z'): SkillMastery {
  return {
    id: skillId,
    skillId,
    score,
    dims: { concept: 0, compute: 0, visual: 0, explain: 0 },
    lastReviewedAt: when,
    correctStreak: 0,
    difficulty: 0.5,
    forgettingRate: 0.3,
  };
}

function masteryMap(...items: SkillMastery[]): Record<string, SkillMastery> {
  return Object.fromEntries(items.map((m) => [m.skillId, m]));
}

const doneOf = (ids: string[]) => (l: { id: string }) => ids.includes(l.id);

describe('recommendNext', () => {
  it('đề xuất skill phụ thuộc khi đã vững prereq, kèm lý do', () => {
    // Vững vector_basics → gợi ý một skill kế cận (vd scalar_multiplication /
    // vector_addition) mà prereq duy nhất là vector_basics.
    const rec = recommendNext({
      mastery: masteryMap(mm('vector_basics', 0.6)),
      flat: [lesson('L_add', ['vector_addition']), lesson('L_scale', ['scalar_multiplication'])],
      isDone: doneOf([]),
    });
    expect(rec).toBeDefined();
    expect(rec!.reasonSkillId).toBe('vector_basics');
    expect(['vector_addition', 'scalar_multiplication']).toContain(rec!.lesson.lesson.skillIds[0]);
  });

  it('ưu tiên candidate có NHIỀU prereq đã đạt hơn', () => {
    // matrix_multiplication + dot_product đã vững.
    //  - quadratic_form: prereq [matrix_multiplication, dot_product] → 2 đạt.
    //  - special_matrices: prereq [matrix_multiplication] → 1 đạt.
    // Cả hai đủ nền; phải chọn quadratic_form (2 > 1).
    const rec = recommendNext({
      mastery: masteryMap(
        mm('matrix_multiplication', 0.8, '2026-02-02T00:00:00.000Z'),
        mm('dot_product', 0.8, '2026-02-01T00:00:00.000Z'),
        mm('vector_basics', 0.8, '2026-01-01T00:00:00.000Z'),
      ),
      flat: [
        lesson('L_special', ['special_matrices']),
        lesson('L_quad', ['quadratic_form']),
      ],
      isDone: doneOf([]),
    });
    expect(rec!.lesson.lesson.id).toBe('L_quad');
    // Lý do = prereq đã vững & gần đây nhất (matrix_multiplication mới hơn).
    expect(rec!.reasonSkillId).toBe('matrix_multiplication');
  });

  it('bỏ qua candidate chưa đủ nền (prereq còn thiếu)', () => {
    // Chỉ vững dot_product. cross_product cần thêm trigonometry (chưa có) →
    // không đủ nền → không được đề xuất; không map được → fallback tuần tự.
    const rec = recommendNext({
      mastery: masteryMap(mm('dot_product', 0.7)),
      flat: [lesson('L_cross', ['cross_product']), lesson('L_x', ['transformer'])],
      isDone: doneOf([]),
    });
    // Không có candidate map được → fallback = bài chưa xong đầu tiên.
    expect(rec!.lesson.lesson.id).toBe('L_cross');
    expect(rec!.reasonSkillId).toBeUndefined();
  });

  it('fallback tuần tự khi chưa có dữ liệu mastery, tôn trọng excludeId', () => {
    const rec = recommendNext({
      mastery: {},
      flat: [lesson('A', ['vector_basics']), lesson('B', ['vector_addition'])],
      isDone: doneOf([]),
      excludeId: 'A',
    });
    expect(rec!.lesson.lesson.id).toBe('B');
    expect(rec!.reasonSkillId).toBeUndefined();
  });

  it('không đề xuất skill đã học (mastery ≥ ngưỡng)', () => {
    // vector_basics vững, nhưng vector_addition CŨNG đã học → không gợi ý lại.
    const rec = recommendNext({
      mastery: masteryMap(mm('vector_basics', 0.6), mm('vector_addition', 0.6)),
      flat: [lesson('L_add', ['vector_addition']), lesson('L_scale', ['scalar_multiplication'])],
      isDone: doneOf([]),
    });
    expect(rec!.lesson.lesson.skillIds).not.toContain('vector_addition');
    expect(rec!.lesson.lesson.id).toBe('L_scale');
  });
});
