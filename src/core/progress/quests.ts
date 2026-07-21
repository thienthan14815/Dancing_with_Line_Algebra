import type { Quest as BaseQuest, QuestKind as BaseQuestKind } from '../db/schema';

/**
 * Quest kinds beyond the schema's core four. These extra kinds are owned by the
 * progress module (additive — the schema `Quest.kind` stays a superset via the
 * widened {@link Quest} below), so no shared contract type has to change.
 *  - `flashcards` — ôn thẻ ghi nhớ (chấm 1 thẻ = +1)
 *  - `notes`      — viết ghi chú mới
 *  - `bookmarks`  — đánh dấu (lưu) một mục
 *  - `combo`      — số câu đúng liên tiếp trong ngày
 */
export type ExtraQuestKind = 'flashcards' | 'notes' | 'bookmarks' | 'combo';

/** All quest kinds the daily pool can produce (schema core + progress extras). */
export type QuestKind = BaseQuestKind | ExtraQuestKind;

/** A daily quest whose `kind` is widened to include the progress-module extras. */
export interface Quest extends Omit<BaseQuest, 'kind'> {
  kind: QuestKind;
}

/** The three quests present every day. Order matters: the home mini-view shows the first 3. */
function coreQuests(day: string): Quest[] {
  return [
    { id: `xp-${day}`, title: 'Kiếm 30 XP hôm nay', target: 30, progress: 0, kind: 'xp', day },
    { id: `lessons-${day}`, title: 'Hoàn thành 2 bài học', target: 2, progress: 0, kind: 'lessons', day },
    { id: `reviews-${day}`, title: 'Ôn 3 lượt kỹ năng', target: 3, progress: 0, kind: 'reviews', day },
  ];
}

/**
 * Rotating extra-quest pool. Two of these are surfaced each day (deterministic
 * by date), so the daily set feels varied without breaking persistence/tests.
 */
const EXTRA_POOL: ReadonlyArray<(day: string) => Quest> = [
  (day) => ({ id: `flashcards-${day}`, title: 'Ôn 5 thẻ ghi nhớ', target: 5, progress: 0, kind: 'flashcards', day }),
  (day) => ({ id: `notes-${day}`, title: 'Viết 1 ghi chú', target: 1, progress: 0, kind: 'notes', day }),
  (day) => ({ id: `bookmarks-${day}`, title: 'Lưu 1 mục yêu thích', target: 1, progress: 0, kind: 'bookmarks', day }),
  (day) => ({ id: `combo-${day}`, title: 'Trả lời đúng 5 câu liên tiếp', target: 5, progress: 0, kind: 'combo', day }),
];

/** Whole-day number for `YYYY-MM-DD` (UTC epoch days) — a stable per-day seed. */
function dayIndex(day: string): number {
  const [y, m, d] = day.split('-').map(Number);
  return Math.floor(Date.UTC(y, (m || 1) - 1, d || 1) / 86_400_000);
}

/**
 * The daily quests for a given `YYYY-MM-DD` day: the three core quests plus two
 * rotating extras chosen deterministically from {@link EXTRA_POOL}. Pure.
 */
export function dailyQuests(day: string): Quest[] {
  const L = EXTRA_POOL.length;
  const n = dayIndex(day);
  const i1 = ((n % L) + L) % L;
  const i2 = (i1 + 1) % L; // adjacent → distinct, cycles through the whole pool
  return [...coreQuests(day), EXTRA_POOL[i1](day), EXTRA_POOL[i2](day)];
}

/** Advance a single quest of matching `kind` by `amount` (capped at target). Pure. */
export function advanceQuest(q: Quest, kind: QuestKind, amount = 1): Quest {
  if (q.kind !== kind) return q;
  return { ...q, progress: Math.min(q.target, q.progress + amount) };
}

/** Advance every quest of the matching `kind`. Pure. */
export function advanceQuests(quests: Quest[], kind: QuestKind, amount = 1): Quest[] {
  return quests.map((q) => advanceQuest(q, kind, amount));
}

/**
 * Set every quest of `kind` to `value` (monotonic: never lowers existing
 * progress, capped at target). Used for "best run" style quests such as a
 * consecutive-correct combo, so a completed quest never un-completes. Pure.
 */
export function advanceQuestTo(quests: Quest[], kind: QuestKind, value: number): Quest[] {
  return quests.map((q) =>
    q.kind === kind ? { ...q, progress: Math.max(q.progress, Math.min(q.target, value)) } : q,
  );
}

/** Whether a quest has reached its target. */
export function isQuestComplete(q: Quest): boolean {
  return q.progress >= q.target;
}

/**
 * Roll quests over to `day`: returns a fresh daily set when the current quests
 * belong to another day (or are empty), otherwise the existing list. Pure.
 */
export function rolloverQuests(quests: Quest[], day: string): Quest[] {
  const stale = quests.length === 0 || quests[0].day !== day;
  return stale ? dailyQuests(day) : quests;
}
