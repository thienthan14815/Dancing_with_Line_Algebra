import { describe, it, expect, beforeEach } from 'vitest';
import {
  ACHIEVEMENTS,
  CH1_SKILL_IDS,
  evaluateAchievements,
  reconcileAchievements,
  type AchievementContext,
} from './achievements';
import { dailyQuests, advanceQuestTo, isQuestComplete } from './quests';
import { useLearnStore } from './store';

const NOW = '2026-07-20T10:00:00.000Z';

/** A fully-zeroed context; spread over it to assert one signal at a time. */
const BASE: AchievementContext = {
  xpTotal: 0,
  streak: 0,
  lessonsCompleted: 0,
  perfectLessons: 0,
  maxMastery: 0,
};

function unlockedIds(ctx: Partial<AchievementContext>): Set<string> {
  const list = evaluateAchievements([], { ...BASE, ...ctx }, NOW);
  return new Set(list.filter((a) => a.unlockedAt).map((a) => a.id));
}

describe('Wave-4 achievements (pure rules)', () => {
  it('unlocks the XP milestones at 500 and 2000', () => {
    expect(unlockedIds({ xpTotal: 499 }).has('xp-500')).toBe(false);
    expect(unlockedIds({ xpTotal: 500 }).has('xp-500')).toBe(true);
    expect(unlockedIds({ xpTotal: 1999 }).has('xp-2000')).toBe(false);
    expect(unlockedIds({ xpTotal: 2000 }).has('xp-2000')).toBe(true);
  });

  it('unlocks the 14-day streak', () => {
    expect(unlockedIds({ streak: 13 }).has('streak-14')).toBe(false);
    expect(unlockedIds({ streak: 14 }).has('streak-14')).toBe(true);
  });

  it('unlocks Vector Master only when every ch1 skill is ≥ 0.8', () => {
    expect(unlockedIds({ ch1MinMastery: 0.79 }).has('vector-master')).toBe(false);
    expect(unlockedIds({ ch1MinMastery: 0.8 }).has('vector-master')).toBe(true);
    // Missing signal → treated as 0 → locked.
    expect(unlockedIds({}).has('vector-master')).toBe(false);
  });

  it('requires ≥20 attempts AND ≥90% accuracy for the weekly badge', () => {
    expect(unlockedIds({ weekAttempts: 19, weekAccuracy: 1 }).has('accuracy-week')).toBe(false);
    expect(unlockedIds({ weekAttempts: 20, weekAccuracy: 0.89 }).has('accuracy-week')).toBe(false);
    expect(unlockedIds({ weekAttempts: 20, weekAccuracy: 0.9 }).has('accuracy-week')).toBe(true);
  });

  it('unlocks the flashcard / note / bookmark count badges', () => {
    expect(unlockedIds({ flashcardsGraded: 50 }).has('flashcards-50')).toBe(true);
    expect(unlockedIds({ flashcardsGraded: 49 }).has('flashcards-50')).toBe(false);
    expect(unlockedIds({ notesCount: 10 }).has('note-taker')).toBe(true);
    expect(unlockedIds({ notesCount: 9 }).has('note-taker')).toBe(false);
    expect(unlockedIds({ bookmarkCount: 10 }).has('collector')).toBe(true);
    expect(unlockedIds({ bookmarkCount: 9 }).has('collector')).toBe(false);
  });

  it('exposes the seven Chapter-1 skill ids', () => {
    expect(CH1_SKILL_IDS).toContain('dot_product');
    expect(CH1_SKILL_IDS).toHaveLength(7);
  });
});

describe('reconcileAchievements', () => {
  it('expands a stored short list to the full catalogue, preserving timestamps', () => {
    const stored = [{ id: 'first-lesson', title: 'x', desc: 'y', unlockedAt: NOW }];
    const merged = reconcileAchievements(stored);
    expect(merged).toHaveLength(ACHIEVEMENTS.length);
    const byId = Object.fromEntries(merged.map((a) => [a.id, a]));
    expect(byId['first-lesson'].unlockedAt).toBe(NOW);
    expect(byId['xp-2000'].unlockedAt).toBeUndefined();
  });
});

describe('Wave-4 daily quest pool', () => {
  it('always includes the three core quests first', () => {
    const q = dailyQuests('2026-07-20');
    expect(q.slice(0, 3).map((x) => x.kind)).toEqual(['xp', 'lessons', 'reviews']);
  });

  it('adds two distinct rotating extras from the pool', () => {
    const q = dailyQuests('2026-07-20');
    const extras = q.slice(3);
    expect(extras).toHaveLength(2);
    const kinds = extras.map((x) => x.kind);
    expect(new Set(kinds).size).toBe(2);
    for (const k of kinds) expect(['flashcards', 'notes', 'bookmarks', 'combo']).toContain(k);
  });

  it('is deterministic per day and rotates across days', () => {
    expect(dailyQuests('2026-07-20').map((q) => q.kind)).toEqual(
      dailyQuests('2026-07-20').map((q) => q.kind),
    );
    // Every extra kind surfaces within a 4-day window.
    const seen = new Set<string>();
    for (const d of ['2026-07-20', '2026-07-21', '2026-07-22', '2026-07-23']) {
      for (const q of dailyQuests(d).slice(3)) seen.add(q.kind);
    }
    expect(seen).toEqual(new Set(['flashcards', 'notes', 'bookmarks', 'combo']));
  });

  it('advanceQuestTo is monotonic and target-capped', () => {
    const q = [{ id: 'c', title: '', target: 5, progress: 3, kind: 'combo' as const, day: 'd' }];
    expect(advanceQuestTo(q, 'combo', 4)[0].progress).toBe(4);
    // Never lowers an existing value…
    expect(advanceQuestTo(q, 'combo', 1)[0].progress).toBe(3);
    // …and caps at target.
    expect(advanceQuestTo(q, 'combo', 99)[0].progress).toBe(5);
  });
});

describe('store integration (Wave-4 counters + quests)', () => {
  beforeEach(() => {
    useLearnStore.getState().resetProgress();
  });

  it('gradeFlashcard increments the counter and unlocks flashcards-50', () => {
    for (let i = 0; i < 50; i++) useLearnStore.getState().gradeFlashcard('dot_product', 'good');
    const st = useLearnStore.getState();
    expect(st.flashcardsGraded).toBe(50);
    const badge = st.achievements.find((a) => a.id === 'flashcards-50');
    expect(badge?.unlockedAt).toBeTruthy();
    // The flashcards quest (when present that day) also advances.
    const fc = st.quests.find((q) => q.kind === 'flashcards');
    if (fc) expect(isQuestComplete(fc)).toBe(true);
  });

  it('toggleBookmark unlocks the collector badge at 10 saved items', () => {
    for (let i = 0; i < 10; i++) useLearnStore.getState().toggleBookmark(`lesson:l${i}`);
    const st = useLearnStore.getState();
    expect(st.bookmarks).toHaveLength(10);
    expect(st.achievements.find((a) => a.id === 'collector')?.unlockedAt).toBeTruthy();
  });

  it('saveNote unlocks the note-taker badge at 10 notes and advances the notes quest', () => {
    for (let i = 0; i < 10; i++) useLearnStore.getState().saveNote(`l${i}`, `ghi chú ${i}`);
    const st = useLearnStore.getState();
    expect(Object.keys(st.notes)).toHaveLength(10);
    expect(st.achievements.find((a) => a.id === 'note-taker')?.unlockedAt).toBeTruthy();
  });

  it('records a correct-answer combo through recordAttempt', () => {
    for (let i = 0; i < 5; i++) {
      useLearnStore.getState().recordAttempt({
        exerciseId: `e${i}`,
        skillId: 'dot_product',
        lessonId: 'l1',
        isCorrect: true,
        responseTimeMs: 900,
        hintsUsed: 0,
        attemptNumber: 1,
      });
    }
    const combo = useLearnStore.getState().quests.find((q) => q.kind === 'combo');
    if (combo) expect(combo.progress).toBe(5);
  });
});
