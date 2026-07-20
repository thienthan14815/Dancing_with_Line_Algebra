import type { Quest, QuestKind } from '../db/schema';

/** The default set of daily quests for a given `YYYY-MM-DD` day. */
export function dailyQuests(day: string): Quest[] {
  return [
    { id: `xp-${day}`, title: 'Kiếm 30 XP hôm nay', target: 30, progress: 0, kind: 'xp', day },
    { id: `lessons-${day}`, title: 'Hoàn thành 2 bài học', target: 2, progress: 0, kind: 'lessons', day },
    { id: `reviews-${day}`, title: 'Ôn 3 lượt kỹ năng', target: 3, progress: 0, kind: 'reviews', day },
  ];
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
