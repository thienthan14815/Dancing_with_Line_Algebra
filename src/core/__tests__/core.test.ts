import { describe, it, expect } from 'vitest';
import type { ReviewItem, SkillMastery, StreakState } from '../db/schema';

import { XP, xpForResult } from '../progress/xp';
import { updateStreak } from '../progress/streak';
import { updateMastery, masteryScore, MASTERY_WEIGHTS } from '../progress/mastery';
import { schedule, isDue, getDue, newReviewItem, INTERVAL_DAYS, MAX_BOX } from '../progress/srs';
import { newDailyGoal, addDailyXp, isGoalMet, rolloverDailyGoal } from '../progress/dailyGoal';
import { evaluateAchievements } from '../progress/achievements';
import { dailyQuests, advanceQuests, rolloverQuests, isQuestComplete } from '../progress/quests';
import { LocalStorageAdapter } from '../persistence/localStorage';
import { RemoteAdapter } from '../persistence/remote';
import { useLearnStore } from '../progress/store';

const NOW = '2026-07-20T10:00:00.000Z';

describe('xpForResult', () => {
  it('rewards a regular correct answer with NO_MISTAKES', () => {
    expect(xpForResult({ isCorrect: true })).toBe(XP.NO_MISTAKES);
  });
  it('rewards challenges and weak reviews accordingly', () => {
    expect(xpForResult({ isCorrect: true, isChallenge: true })).toBe(XP.CHALLENGE);
    expect(xpForResult({ isCorrect: true, isWeakReview: true })).toBe(XP.WEAK_REVIEW);
  });
  it('gives no base XP for a wrong answer', () => {
    expect(xpForResult({ isCorrect: false })).toBe(0);
  });
  it('adds explanation XP even after a wrong answer', () => {
    expect(xpForResult({ isCorrect: false, viewedExplanation: true })).toBe(XP.VIEW_EXPLANATION);
    expect(xpForResult({ isCorrect: true, isChallenge: true, viewedExplanation: true })).toBe(
      XP.CHALLENGE + XP.VIEW_EXPLANATION,
    );
  });
});

describe('updateStreak', () => {
  const base: StreakState = { current: 3, longest: 5, lastActiveDay: '2026-07-19', freezes: 0 };

  it('keeps the streak on the same day', () => {
    expect(updateStreak(base, '2026-07-19').current).toBe(3);
    // accepts an ISO timestamp too
    expect(updateStreak(base, '2026-07-19T23:00:00.000Z').current).toBe(3);
  });

  it('increments on a consecutive day and tracks the longest', () => {
    const next = updateStreak(base, '2026-07-20');
    expect(next.current).toBe(4);
    expect(next.longest).toBe(5);

    const record: StreakState = { current: 5, longest: 5, lastActiveDay: '2026-07-19', freezes: 0 };
    expect(updateStreak(record, '2026-07-20').longest).toBe(6);
  });

  it('resets after a gap', () => {
    expect(updateStreak(base, '2026-07-25').current).toBe(1);
  });

  it('starts at 1 on first ever activity', () => {
    const fresh: StreakState = { current: 0, longest: 0, lastActiveDay: '', freezes: 0 };
    expect(updateStreak(fresh, '2026-07-20').current).toBe(1);
  });

  it('spends freeze tokens to bridge a gap', () => {
    const s: StreakState = { current: 4, longest: 4, lastActiveDay: '2026-07-18', freezes: 2 };
    const next = updateStreak(s, '2026-07-20'); // missed the 19th
    expect(next.current).toBe(5);
    expect(next.freezes).toBe(1);
  });
});

describe('mastery', () => {
  it('increases the touched dimension on a correct answer', () => {
    const m = updateMastery(undefined, {
      correct: true,
      dimension: 'concept',
      skillId: 's1',
      nowISO: NOW,
    });
    expect(m.skillId).toBe('s1');
    expect(m.dims.concept).toBeGreaterThan(0);
    expect(m.score).toBeGreaterThan(0);
    expect(m.correctStreak).toBe(1);
  });

  it('decreases the touched dimension on a wrong answer and resets the streak', () => {
    const seed: SkillMastery = {
      id: 's1',
      skillId: 's1',
      score: masteryScore({ concept: 0.5, compute: 0.5, visual: 0.5, explain: 0.5 }),
      dims: { concept: 0.5, compute: 0.5, visual: 0.5, explain: 0.5 },
      lastReviewedAt: NOW,
      correctStreak: 3,
      difficulty: 0.5,
      forgettingRate: 0.2,
    };
    const m = updateMastery(seed, { correct: false, dimension: 'concept', nowISO: NOW });
    expect(m.dims.concept).toBeLessThan(0.5);
    expect(m.score).toBeLessThan(seed.score);
    expect(m.correctStreak).toBe(0);
  });

  it('aggregates the score with 30/30/20/20 weights', () => {
    expect(MASTERY_WEIGHTS).toEqual({ concept: 0.3, compute: 0.3, visual: 0.2, explain: 0.2 });
    expect(masteryScore({ concept: 1, compute: 0, visual: 0, explain: 0 })).toBeCloseTo(0.3);
    expect(masteryScore({ concept: 1, compute: 1, visual: 0, explain: 0 })).toBeCloseTo(0.6);
    expect(masteryScore({ concept: 0, compute: 0, visual: 1, explain: 1 })).toBeCloseTo(0.4);
    expect(masteryScore({ concept: 1, compute: 1, visual: 1, explain: 1 })).toBeCloseTo(1);
  });
});

describe('srs (Leitner)', () => {
  it('exposes the expected interval table', () => {
    expect([...INTERVAL_DAYS]).toEqual([0, 1, 3, 7, 14, 30]);
    expect(MAX_BOX).toBe(5);
  });

  it('promotes a box on a correct review and sets the next due date', () => {
    const item = newReviewItem('s1', NOW);
    expect(item.box).toBe(0);
    const up = schedule(item, true, NOW);
    expect(up.box).toBe(1);
    expect(up.lastResult).toBe(true);
    expect(new Date(up.dueAt).getTime()).toBe(new Date(NOW).getTime() + 86_400_000);
  });

  it('caps at the max box', () => {
    let it = newReviewItem('s1', NOW);
    for (let i = 0; i < 10; i++) it = schedule(it, true, NOW);
    expect(it.box).toBe(MAX_BOX);
  });

  it('demotes to box 0 on a wrong review', () => {
    const item: ReviewItem = { id: 's1', skillId: 's1', box: 4, dueAt: NOW, lastResult: true };
    const down = schedule(item, false, NOW);
    expect(down.box).toBe(0);
    expect(down.lastResult).toBe(false);
  });

  it('detects and filters due items', () => {
    const past: ReviewItem = {
      id: 'a',
      skillId: 'a',
      box: 1,
      dueAt: '2000-01-01T00:00:00.000Z',
      lastResult: true,
    };
    const future: ReviewItem = {
      id: 'b',
      skillId: 'b',
      box: 1,
      dueAt: '2999-01-01T00:00:00.000Z',
      lastResult: true,
    };
    expect(isDue(past, NOW)).toBe(true);
    expect(isDue(future, NOW)).toBe(false);
    expect(getDue([past, future], NOW).map((x) => x.id)).toEqual(['a']);
  });
});

describe('dailyGoal', () => {
  it('accumulates XP and flags when the goal is met', () => {
    let g = newDailyGoal('2026-07-20', 30);
    expect(g.met).toBe(false);
    g = addDailyXp(g, 10);
    expect(isGoalMet(g)).toBe(false);
    g = addDailyXp(g, 25);
    expect(g.xpEarned).toBe(35);
    expect(g.met).toBe(true);
  });

  it('rolls over to a new day', () => {
    const g = addDailyXp(newDailyGoal('2026-07-20', 30), 20);
    const same = rolloverDailyGoal(g, '2026-07-20', 30);
    expect(same.xpEarned).toBe(20);
    const next = rolloverDailyGoal(g, '2026-07-21', 30);
    expect(next.xpEarned).toBe(0);
    expect(next.day).toBe('2026-07-21');
  });
});

describe('achievements & quests', () => {
  it('unlocks achievements when conditions are met and preserves timestamps', () => {
    const list = evaluateAchievements(
      [],
      { xpTotal: 150, streak: 8, lessonsCompleted: 1, perfectLessons: 0, maxMastery: 0.5 },
      NOW,
    );
    const byId = Object.fromEntries(list.map((a) => [a.id, a]));
    expect(byId['first-lesson'].unlockedAt).toBe(NOW);
    expect(byId['xp-100'].unlockedAt).toBe(NOW);
    expect(byId['streak-7'].unlockedAt).toBe(NOW);
    expect(byId['xp-1000'].unlockedAt).toBeUndefined();

    // A later evaluation preserves the original unlock time.
    const later = evaluateAchievements(
      list,
      { xpTotal: 2000, streak: 8, lessonsCompleted: 1, perfectLessons: 0, maxMastery: 0.5 },
      '2026-08-01T00:00:00.000Z',
    );
    const laterById = Object.fromEntries(later.map((a) => [a.id, a]));
    expect(laterById['first-lesson'].unlockedAt).toBe(NOW);
    expect(laterById['xp-1000'].unlockedAt).toBe('2026-08-01T00:00:00.000Z');
  });

  it('advances quest progress and rolls over between days', () => {
    const quests = dailyQuests('2026-07-20');
    const advanced = advanceQuests(quests, 'xp', 30);
    const xpQuest = advanced.find((q) => q.kind === 'xp')!;
    expect(xpQuest.progress).toBe(30);
    expect(isQuestComplete(xpQuest)).toBe(true);

    const rolled = rolloverQuests(advanced, '2026-07-21');
    expect(rolled.find((q) => q.kind === 'xp')!.progress).toBe(0);
  });
});

describe('LocalStorageAdapter (in-memory fallback in Node)', () => {
  it('stores documents and collections safely', () => {
    const a = new LocalStorageAdapter();
    a.clearAll();

    expect(a.getDoc('missing')).toBeNull();
    a.setDoc('greeting', { hello: 'world' });
    expect(a.getDoc<{ hello: string }>('greeting')).toEqual({ hello: 'world' });

    a.put('demo', { id: 'x', v: 1 });
    a.put('demo', { id: 'y', v: 2 });
    expect(a.list('demo')).toHaveLength(2);
    a.put('demo', { id: 'x', v: 9 }); // upsert
    expect(a.list<{ id: string; v: number }>('demo').find((r) => r.id === 'x')!.v).toBe(9);
    a.remove('demo', 'x');
    expect(a.list('demo')).toHaveLength(1);

    a.clearAll();
    expect(a.list('demo')).toHaveLength(0);
  });
});

describe('RemoteAdapter (cache-backed, no network)', () => {
  it('reads from an in-memory cache without hitting the network', () => {
    const r = new RemoteAdapter({ baseUrl: 'https://example.test', token: 't' });
    // Cache starts empty: sync reads never throw, they return null / [].
    expect(r.getDoc('x')).toBeNull();
    expect(r.list('c')).toEqual([]);
    // Sync writes update the cache immediately (network call is fire-and-forget).
    r.setDoc('x', { v: 1 });
    expect(r.getDoc<{ v: number }>('x')).toEqual({ v: 1 });
    r.put('c', { id: '1' });
    expect(r.list<{ id: string }>('c')).toHaveLength(1);
    r.clearAll();
    expect(r.getDoc('x')).toBeNull();
    expect(r.list('c')).toEqual([]);
  });
});

describe('useLearnStore (smoke)', () => {
  it('records an attempt end-to-end', () => {
    useLearnStore.getState().resetProgress();
    const before = useLearnStore.getState().xpTotal;

    useLearnStore.getState().recordAttempt({
      exerciseId: 'e1',
      skillId: 'skill-a',
      lessonId: 'l1',
      isCorrect: true,
      responseTimeMs: 1200,
      hintsUsed: 0,
      attemptNumber: 1,
    });

    const st = useLearnStore.getState();
    expect(st.xpTotal).toBe(before + XP.NO_MISTAKES);
    expect(st.masteryBySkill['skill-a']).toBeDefined();
    expect(st.masteryBySkill['skill-a'].score).toBeGreaterThan(0);
    expect(st.reviewItems['skill-a']).toBeDefined();
    expect(st.attempts).toHaveLength(1);
    expect(st.streak.current).toBeGreaterThanOrEqual(1);
    expect(st.xpToday).toBe(XP.NO_MISTAKES);
  });

  it('completes a lesson and awards XP + seeds SRS items', () => {
    useLearnStore.getState().resetProgress();
    useLearnStore.getState().completeLesson('l1', ['s1', 's2'], { perfect: true });

    const st = useLearnStore.getState();
    expect(st.xpTotal).toBe(XP.LESSON_COMPLETE);
    expect(st.lessonsCompleted).toBe(1);
    expect(st.perfectLessons).toBe(1);
    expect(st.reviewItems['s1']).toBeDefined();
    expect(st.reviewItems['s2']).toBeDefined();
  });
});
