/**
 * Cấp độ gamification suy trực tiếp từ XP tích lũy — KHÔNG lưu state riêng.
 * Chi phí lên cấp tăng dần: Lv1→2 cần 100 XP, mỗi cấp sau thêm 50 XP.
 */
export interface LevelInfo {
  /** Cấp hiện tại, bắt đầu từ 1. */
  level: number;
  /** XP đã tích trong cấp hiện tại. */
  intoLevel: number;
  /** XP cần để lên cấp kế tiếp. */
  toNext: number;
  /** intoLevel / toNext, 0..1. */
  progress: number;
}

/** XP cần để đi từ `level` lên `level + 1`. */
export function xpToNext(level: number): number {
  return 100 + (level - 1) * 50;
}

export function levelFromXp(xpTotal: number): LevelInfo {
  let level = 1;
  let rest = Math.max(0, Math.floor(xpTotal));
  while (rest >= xpToNext(level)) {
    rest -= xpToNext(level);
    level += 1;
  }
  const toNext = xpToNext(level);
  return { level, intoLevel: rest, toNext, progress: Math.min(1, rest / toNext) };
}
