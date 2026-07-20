import { create } from 'zustand';
import { storage } from '../persistence/localStorage';
import type {
  Achievement,
  DailyGoalState,
  MasteryDimension,
  Quest,
  SkillMastery,
  ReviewItem,
  StreakState,
  UserAttempt,
  UserProfile,
  XpTransaction,
} from '../db/schema';
import { XP, xpForResult } from './xp';
import { updateStreak } from './streak';
import { newDailyGoal, addDailyXp, rolloverDailyGoal } from './dailyGoal';
import { updateMastery } from './mastery';
import { schedule, newReviewItem } from './srs';
import { ACHIEVEMENTS, evaluateAchievements, type AchievementContext } from './achievements';
import { dailyQuests, advanceQuests, rolloverQuests } from './quests';
import { toDayKey } from './time';

/** Storage key for the persisted learn-state snapshot. */
const STATE_KEY = 'learn-state';
/** Collection where the append-only XP ledger is mirrored (backend-ready). */
const XP_COLLECTION = 'xpTransactions';

/** The serializable data half of the store. */
export interface PersistedState {
  profile: UserProfile;
  xpTotal: number;
  xpToday: number;
  dailyGoal: DailyGoalState;
  streak: StreakState;
  masteryBySkill: Record<string, SkillMastery>;
  reviewItems: Record<string, ReviewItem>;
  /** Most recent attempts (capped, newest last). */
  attempts: UserAttempt[];
  achievements: Achievement[];
  quests: Quest[];
  /** Extra counters (beyond the core spec) that back stats + achievements. */
  lessonsCompleted: number;
  perfectLessons: number;
}

/** Optional extras for {@link LearnActions.recordAttempt}. */
export interface RecordAttemptOpts {
  /** Which mastery dimension this exercise trains (default `compute`). */
  dimension?: MasteryDimension;
  isChallenge?: boolean;
  isWeakReview?: boolean;
  viewedExplanation?: boolean;
}

/** Optional extras for {@link LearnActions.completeLesson}. */
export interface CompleteLessonOpts {
  /** No mistakes across the whole lesson. */
  perfect?: boolean;
  /** Override the XP awarded (defaults to XP.LESSON_COMPLETE). */
  xp?: number;
}

export interface LearnActions {
  /** Record an answered exercise: mastery + SRS + XP + streak + goal + quests + achievements. */
  recordAttempt: (a: Omit<UserAttempt, 'id' | 'createdAt'>, opts?: RecordAttemptOpts) => void;
  /** Grant XP for an arbitrary reason (updates goal, streak, quests, achievements). */
  awardXp: (amount: number, reason: string) => void;
  /** Mark a lesson finished for the given skills. */
  completeLesson: (lessonId: string, skillIds: string[], opts?: CompleteLessonOpts) => void;
  /** Wipe all learning progress (keeps the profile). */
  resetProgress: () => void;
  /** Patch the user profile. */
  setProfile: (patch: Partial<UserProfile>) => void;
}

export type LearnState = PersistedState & LearnActions;

const DEFAULT_DAILY_GOAL_XP = 30;
const MAX_ATTEMPTS = 200;

/** Best-effort unique id, works in browser and Node. */
function genId(prefix: string): string {
  const c = (globalThis as { crypto?: { randomUUID?: () => string } }).crypto;
  const rand = c?.randomUUID
    ? c.randomUUID()
    : `${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 10)}`;
  return `${prefix}_${rand}`;
}

/** Fresh, empty progress data. */
function defaultData(): PersistedState {
  const now = new Date();
  const today = toDayKey(now);
  const profile: UserProfile = {
    id: genId('user'),
    dailyGoalXp: DEFAULT_DAILY_GOAL_XP,
    createdAt: now.toISOString(),
    onboarded: false,
    learnWithPython: false,
  };
  return {
    profile,
    xpTotal: 0,
    xpToday: 0,
    dailyGoal: newDailyGoal(today, profile.dailyGoalXp),
    streak: { current: 0, longest: 0, lastActiveDay: '', freezes: 0 },
    masteryBySkill: {},
    reviewItems: {},
    attempts: [],
    achievements: ACHIEVEMENTS.map((a) => ({ ...a })),
    quests: dailyQuests(today),
    lessonsCompleted: 0,
    perfectLessons: 0,
  };
}

/** Load persisted data, merged over defaults (forward/backward compatible). */
function loadInitial(): PersistedState {
  const def = defaultData();
  const saved = storage.getDoc<Partial<PersistedState>>(STATE_KEY);
  if (!saved) return def;
  return {
    ...def,
    ...saved,
    profile: { ...def.profile, ...(saved.profile ?? {}) },
    dailyGoal: saved.dailyGoal ?? def.dailyGoal,
    streak: saved.streak ?? def.streak,
    masteryBySkill: saved.masteryBySkill ?? def.masteryBySkill,
    reviewItems: saved.reviewItems ?? def.reviewItems,
    attempts: saved.attempts ?? def.attempts,
    achievements: saved.achievements ?? def.achievements,
    quests: saved.quests ?? def.quests,
  };
}

/** Apply an XP gain to the totals + (possibly rolled-over) daily goal. */
function earnXp(
  s: Pick<PersistedState, 'xpTotal' | 'xpToday' | 'dailyGoal' | 'profile'>,
  amount: number,
  today: string,
): Pick<PersistedState, 'xpTotal' | 'xpToday' | 'dailyGoal'> {
  const sameDay = s.dailyGoal.day === today;
  const rolled = rolloverDailyGoal(s.dailyGoal, today, s.profile.dailyGoalXp);
  const dailyGoal = addDailyXp(rolled, amount);
  const xpToday = (sameDay ? s.xpToday : 0) + amount;
  return { xpTotal: s.xpTotal + amount, xpToday, dailyGoal };
}

/** Build the achievement-evaluation context from a data snapshot. */
function achievementCtx(s: PersistedState): AchievementContext {
  const maxMastery = Object.values(s.masteryBySkill).reduce((m, x) => Math.max(m, x.score), 0);
  return {
    xpTotal: s.xpTotal,
    streak: s.streak.current,
    lessonsCompleted: s.lessonsCompleted,
    perfectLessons: s.perfectLessons,
    maxMastery,
  };
}

export const useLearnStore = create<LearnState>()((set) => ({
  ...loadInitial(),

  recordAttempt: (a, opts) =>
    set((state) => {
      const now = new Date();
      const nowISO = now.toISOString();
      const today = toDayKey(now);

      const attempt: UserAttempt = { ...a, id: genId('att'), createdAt: nowISO };
      const attempts = [...state.attempts, attempt].slice(-MAX_ATTEMPTS);

      const dimension = opts?.dimension ?? 'compute';
      const mastery = updateMastery(state.masteryBySkill[a.skillId], {
        correct: a.isCorrect,
        dimension,
        skillId: a.skillId,
        nowISO,
      });
      const masteryBySkill = { ...state.masteryBySkill, [a.skillId]: mastery };

      const prevReview = state.reviewItems[a.skillId] ?? newReviewItem(a.skillId, nowISO);
      const review = schedule(prevReview, a.isCorrect, nowISO);
      const reviewItems = { ...state.reviewItems, [a.skillId]: review };

      const gained = xpForResult({
        isCorrect: a.isCorrect,
        isChallenge: opts?.isChallenge,
        isWeakReview: opts?.isWeakReview,
        viewedExplanation: opts?.viewedExplanation,
      });
      const earned = earnXp(state, gained, today);
      const streak = updateStreak(state.streak, today);

      let quests = rolloverQuests(state.quests, today);
      quests = advanceQuests(quests, 'reviews', 1);
      if (gained > 0) quests = advanceQuests(quests, 'xp', gained);

      const next: PersistedState = {
        ...state,
        ...earned,
        attempts,
        masteryBySkill,
        reviewItems,
        streak,
        quests,
      };
      const achievements = evaluateAchievements(state.achievements, achievementCtx(next), nowISO);
      return { ...earned, attempts, masteryBySkill, reviewItems, streak, quests, achievements };
    }),

  awardXp: (amount, reason) =>
    set((state) => {
      const now = new Date();
      const nowISO = now.toISOString();
      const today = toDayKey(now);

      const earned = earnXp(state, amount, today);
      const tx: XpTransaction = { id: genId('xp'), amount, reason, createdAt: nowISO };
      storage.put(XP_COLLECTION, tx);

      const streak = updateStreak(state.streak, today);
      let quests = rolloverQuests(state.quests, today);
      if (amount > 0) quests = advanceQuests(quests, 'xp', amount);

      const next: PersistedState = { ...state, ...earned, streak, quests };
      const achievements = evaluateAchievements(state.achievements, achievementCtx(next), nowISO);
      return { ...earned, streak, quests, achievements };
    }),

  completeLesson: (lessonId, skillIds, opts) =>
    set((state) => {
      const now = new Date();
      const nowISO = now.toISOString();
      const today = toDayKey(now);

      const xp = opts?.xp ?? XP.LESSON_COMPLETE;
      const earned = earnXp(state, xp, today);
      const tx: XpTransaction = {
        id: genId('xp'),
        amount: xp,
        reason: `lesson:${lessonId}`,
        createdAt: nowISO,
      };
      storage.put(XP_COLLECTION, tx);

      // Ensure every practiced skill enters the SRS queue.
      const reviewItems = { ...state.reviewItems };
      for (const sid of skillIds) {
        if (!reviewItems[sid]) reviewItems[sid] = newReviewItem(sid, nowISO);
      }

      const streak = updateStreak(state.streak, today);
      const lessonsCompleted = state.lessonsCompleted + 1;
      const perfectLessons = state.perfectLessons + (opts?.perfect ? 1 : 0);

      let quests = rolloverQuests(state.quests, today);
      quests = advanceQuests(quests, 'lessons', 1);
      if (xp > 0) quests = advanceQuests(quests, 'xp', xp);

      const next: PersistedState = {
        ...state,
        ...earned,
        reviewItems,
        streak,
        lessonsCompleted,
        perfectLessons,
        quests,
      };
      const achievements = evaluateAchievements(state.achievements, achievementCtx(next), nowISO);
      return {
        ...earned,
        reviewItems,
        streak,
        lessonsCompleted,
        perfectLessons,
        quests,
        achievements,
      };
    }),

  resetProgress: () =>
    set((state) => {
      const fresh = defaultData();
      const profile = state.profile;
      const today = toDayKey(new Date());
      return { ...fresh, profile, dailyGoal: newDailyGoal(today, profile.dailyGoalXp) };
    }),

  setProfile: (patch) =>
    set((state) => {
      const profile = { ...state.profile, ...patch };
      let dailyGoal = state.dailyGoal;
      if (patch.dailyGoalXp != null && patch.dailyGoalXp !== state.profile.dailyGoalXp) {
        dailyGoal = {
          ...dailyGoal,
          goalXp: patch.dailyGoalXp,
          met: dailyGoal.xpEarned >= patch.dailyGoalXp,
        };
      }
      return { profile, dailyGoal };
    }),
}));

/** Serialize just the data half of the store. */
function toPersisted(s: LearnState): PersistedState {
  return {
    profile: s.profile,
    xpTotal: s.xpTotal,
    xpToday: s.xpToday,
    dailyGoal: s.dailyGoal,
    streak: s.streak,
    masteryBySkill: s.masteryBySkill,
    reviewItems: s.reviewItems,
    attempts: s.attempts,
    achievements: s.achievements,
    quests: s.quests,
    lessonsCompleted: s.lessonsCompleted,
    perfectLessons: s.perfectLessons,
  };
}

// Persist after every state change.
useLearnStore.subscribe((s) => storage.setDoc(STATE_KEY, toPersisted(s)));
