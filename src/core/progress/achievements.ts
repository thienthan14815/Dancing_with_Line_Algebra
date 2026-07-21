import type { Achievement } from '../db/schema';

/**
 * Chapter-1 (Vector) skill ids — mirror of the ch1 block in
 * `src/core/content/skills.ts`. Kept as a local constant so the achievement
 * layer stays decoupled from the content catalogue.
 */
export const CH1_SKILL_IDS = [
  'vector_basics',
  'vector_addition',
  'scalar_multiplication',
  'linear_combination',
  'span',
  'dot_product',
  'cross_product',
] as const;

/** Catalogue of unlockable achievements. */
export const ACHIEVEMENTS: readonly Achievement[] = [
  { id: 'first-lesson', title: 'Bước đầu tiên', desc: 'Hoàn thành bài học đầu tiên' },
  { id: 'streak-7', title: 'Chuỗi 7 ngày', desc: 'Duy trì chuỗi học 7 ngày' },
  { id: 'streak-14', title: 'Chuỗi 14 ngày', desc: 'Duy trì chuỗi học 14 ngày' },
  { id: 'streak-30', title: 'Chuỗi 30 ngày', desc: 'Duy trì chuỗi học 30 ngày' },
  { id: 'xp-100', title: 'Trăm điểm', desc: 'Tích lũy 100 XP' },
  { id: 'xp-500', title: 'Năm trăm điểm', desc: 'Tích lũy 500 XP' },
  { id: 'xp-1000', title: 'Ngàn điểm', desc: 'Tích lũy 1000 XP' },
  { id: 'xp-2000', title: 'Hai ngàn điểm', desc: 'Tích lũy 2000 XP' },
  { id: 'perfect-lesson', title: 'Hoàn hảo', desc: 'Hoàn thành một bài học không sai câu nào' },
  { id: 'skill-master', title: 'Bậc thầy', desc: 'Đạt mastery ≥ 0.9 ở một kỹ năng' },
  { id: 'vector-master', title: 'Chuyên gia Vector', desc: 'Đạt mastery ≥ 0.8 ở mọi kỹ năng chương Vector' },
  { id: 'accuracy-week', title: 'Tuần chính xác', desc: 'Chính xác ≥ 90% trong tuần (ít nhất 20 câu)' },
  { id: 'flashcards-50', title: 'Chăm ôn tập', desc: 'Chấm 50 thẻ ghi nhớ' },
  { id: 'note-taker', title: 'Người ghi chép', desc: 'Viết 10 ghi chú' },
  { id: 'collector', title: 'Nhà sưu tầm', desc: 'Lưu 10 mục yêu thích' },
];

/** Signals used to evaluate achievement unlock conditions. */
export interface AchievementContext {
  xpTotal: number;
  streak: number;
  lessonsCompleted: number;
  perfectLessons: number;
  /** Highest `score` across all skills. */
  maxMastery: number;
  /** Lowest mastery `score` across the Chapter-1 skills (0 if any is unpractised). */
  ch1MinMastery?: number;
  /** Attempts answered in the current local week (Mon–Sun). */
  weekAttempts?: number;
  /** Accuracy (0..1) across the current week's attempts. */
  weekAccuracy?: number;
  /** Cumulative count of graded flashcards. */
  flashcardsGraded?: number;
  /** Number of notes currently saved. */
  notesCount?: number;
  /** Number of bookmarks currently saved. */
  bookmarkCount?: number;
}

/** Unlock predicate per achievement id. New signals are optional → guard undefined. */
const RULES: Record<string, (c: AchievementContext) => boolean> = {
  'first-lesson': (c) => c.lessonsCompleted >= 1,
  'streak-7': (c) => c.streak >= 7,
  'streak-14': (c) => c.streak >= 14,
  'streak-30': (c) => c.streak >= 30,
  'xp-100': (c) => c.xpTotal >= 100,
  'xp-500': (c) => c.xpTotal >= 500,
  'xp-1000': (c) => c.xpTotal >= 1000,
  'xp-2000': (c) => c.xpTotal >= 2000,
  'perfect-lesson': (c) => c.perfectLessons >= 1,
  'skill-master': (c) => c.maxMastery >= 0.9,
  'vector-master': (c) => (c.ch1MinMastery ?? 0) >= 0.8,
  'accuracy-week': (c) => (c.weekAttempts ?? 0) >= 20 && (c.weekAccuracy ?? 0) >= 0.9,
  'flashcards-50': (c) => (c.flashcardsGraded ?? 0) >= 50,
  'note-taker': (c) => (c.notesCount ?? 0) >= 10,
  'collector': (c) => (c.bookmarkCount ?? 0) >= 10,
};

/**
 * Re-evaluate the full achievement list against `ctx`. Pure.
 *
 * Already-unlocked timestamps in `current` are preserved; newly-satisfied
 * achievements get `unlockedAt = nowISO`. Returns the complete list.
 */
export function evaluateAchievements(
  current: readonly Achievement[],
  ctx: AchievementContext,
  nowISO: string,
): Achievement[] {
  const byId = new Map(current.map((a) => [a.id, a]));
  return ACHIEVEMENTS.map((base) => {
    const already = byId.get(base.id)?.unlockedAt;
    const meets = RULES[base.id]?.(ctx) ?? false;
    const unlockedAt = already ?? (meets ? nowISO : undefined);
    return { ...base, unlockedAt };
  });
}

/**
 * Expand a stored (possibly older / shorter) achievement list to the full
 * catalogue, preserving unlock timestamps. Newly-added achievements come back
 * locked until the next {@link evaluateAchievements} pass. Pure.
 *
 * Used at load so returning users immediately see every badge in the grid.
 */
export function reconcileAchievements(stored: readonly Achievement[]): Achievement[] {
  const byId = new Map(stored.map((a) => [a.id, a]));
  return ACHIEVEMENTS.map((base) => ({ ...base, unlockedAt: byId.get(base.id)?.unlockedAt }));
}
