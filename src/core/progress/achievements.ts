import type { Achievement } from '../db/schema';

/** Catalogue of unlockable achievements. */
export const ACHIEVEMENTS: readonly Achievement[] = [
  { id: 'first-lesson', title: 'Bước đầu tiên', desc: 'Hoàn thành bài học đầu tiên' },
  { id: 'streak-7', title: 'Chuỗi 7 ngày', desc: 'Duy trì chuỗi học 7 ngày' },
  { id: 'streak-30', title: 'Chuỗi 30 ngày', desc: 'Duy trì chuỗi học 30 ngày' },
  { id: 'xp-100', title: 'Trăm điểm', desc: 'Tích lũy 100 XP' },
  { id: 'xp-1000', title: 'Ngàn điểm', desc: 'Tích lũy 1000 XP' },
  { id: 'perfect-lesson', title: 'Hoàn hảo', desc: 'Hoàn thành một bài học không sai câu nào' },
  { id: 'skill-master', title: 'Bậc thầy', desc: 'Đạt mastery ≥ 0.9 ở một kỹ năng' },
];

/** Signals used to evaluate achievement unlock conditions. */
export interface AchievementContext {
  xpTotal: number;
  streak: number;
  lessonsCompleted: number;
  perfectLessons: number;
  /** Highest `score` across all skills. */
  maxMastery: number;
}

/** Unlock predicate per achievement id. */
const RULES: Record<string, (c: AchievementContext) => boolean> = {
  'first-lesson': (c) => c.lessonsCompleted >= 1,
  'streak-7': (c) => c.streak >= 7,
  'streak-30': (c) => c.streak >= 30,
  'xp-100': (c) => c.xpTotal >= 100,
  'xp-1000': (c) => c.xpTotal >= 1000,
  'perfect-lesson': (c) => c.perfectLessons >= 1,
  'skill-master': (c) => c.maxMastery >= 0.9,
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
