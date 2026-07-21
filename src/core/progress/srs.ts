import type { ReviewItem } from '../db/schema';
import { addDaysISO } from './time';

/** Leitner intervals (in days) indexed by box. */
export const INTERVAL_DAYS = [0, 1, 3, 7, 14, 30] as const;
/** Highest reachable Leitner box (5). */
export const MAX_BOX = INTERVAL_DAYS.length - 1;

/** A brand-new review item for a skill, due immediately (box 0). */
export function newReviewItem(skillId: string, nowISO: string): ReviewItem {
  return { id: skillId, skillId, box: 0, dueAt: nowISO, lastResult: undefined };
}

/**
 * Reschedule a review item. Pure.
 *  - Correct -> promote one box (capped at MAX_BOX).
 *  - Wrong   -> demote to box 0.
 * `dueAt` = `nowISO` + INTERVAL_DAYS[newBox] days.
 */
export function schedule(item: ReviewItem, correct: boolean, nowISO: string): ReviewItem {
  const box = correct ? Math.min(item.box + 1, MAX_BOX) : 0;
  const dueAt = addDaysISO(nowISO, INTERVAL_DAYS[box]);
  return { ...item, box, dueAt, lastResult: correct };
}

/** Whether an item is due at `nowISO`. */
export function isDue(item: ReviewItem, nowISO: string): boolean {
  return new Date(item.dueAt).getTime() <= new Date(nowISO).getTime();
}

/** All due items at `nowISO`. */
export function getDue(items: ReviewItem[], nowISO: string): ReviewItem[] {
  return items.filter((it) => isDue(it, nowISO));
}

/**
 * Skill ids đang tới hạn ôn tại `nowISO`, sắp SỚM-HẠN trước. Nhận vào một map
 * (như `reviewItems` trong store) hoặc mảng. Tiện dùng cho flashcard / thống kê.
 */
export function getDueSkills(
  items: Record<string, ReviewItem> | ReviewItem[],
  nowISO: string,
): string[] {
  const arr = Array.isArray(items) ? items : Object.values(items);
  return arr
    .filter((it) => isDue(it, nowISO))
    .sort((a, b) => new Date(a.dueAt).getTime() - new Date(b.dueAt).getTime())
    .map((it) => it.skillId);
}
