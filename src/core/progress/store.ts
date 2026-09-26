import { create } from 'zustand';
import { isDeveloperMode } from '../developerMode';
import { storage } from '../persistence/localStorage';
import type {
  Achievement,
  DailyGoalState,
  MasteryDimension,
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
import { schedule, newReviewItem, INTERVAL_DAYS, MAX_BOX } from './srs';
import {
  ACHIEVEMENTS,
  CH1_SKILL_IDS,
  evaluateAchievements,
  reconcileAchievements,
  type AchievementContext,
} from './achievements';
// `Quest` is re-typed here (widened `kind`) so the store can carry the extra
// progress-module quest kinds (flashcards/notes/bookmarks/combo).
import { dailyQuests, advanceQuests, advanceQuestTo, rolloverQuests, type Quest } from './quests';
import { toDayKey, addDaysISO, startOfWeekMs } from './time';

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
  /** Cumulative number of flashcards graded (backs the "flashcards-50" badge). */
  flashcardsGraded: number;
  /**
   * Đánh dấu (bookmark) các mục người học muốn lưu lại. Id có tiền tố loại:
   * `lesson:<id>` | `formula:<id>` | `symbol:<id>`. Thứ tự = thứ tự thêm.
   */
  bookmarks: string[];
  /** Ghi chú tự do theo bài học (markdown thô), key = lessonId. */
  notes: Record<string, string>;
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

/** Đánh giá một thẻ ghi nhớ (Anki-style) → điều khiển lịch Leitner của skill. */
export type FlashcardGrade = 'again' | 'hard' | 'good' | 'easy';

export interface LearnActions {
  /** Record an answered exercise: mastery + SRS + XP + streak + goal + quests + achievements. */
  recordAttempt: (a: Omit<UserAttempt, 'id' | 'createdAt'>, opts?: RecordAttemptOpts) => void;
  /**
   * Chấm một thẻ ghi nhớ cho `skillId` theo thang Anki, ánh xạ về Leitner box:
   *  - `again` → box 1 (ôn lại sớm)   - `hard` → giữ nguyên box
   *  - `good`  → +1 box               - `easy` → +2 box   (cap tại MAX_BOX)
   * Cập nhật `dueAt` theo INTERVAL_DAYS của box mới; đồng thời tính là hoạt động
   * ôn tập trong ngày (streak + quest "reviews" + XP ôn nhẹ khi nhớ được).
   * Additive & persist-safe: chỉ ghi vào `reviewItems` sẵn có.
   */
  gradeFlashcard: (skillId: string, grade: FlashcardGrade) => void;
  /** Grant XP for an arbitrary reason (updates goal, streak, quests, achievements). */
  awardXp: (amount: number, reason: string) => void;
  /** Mark a lesson finished for the given skills. */
  completeLesson: (lessonId: string, skillIds: string[], opts?: CompleteLessonOpts) => void;
  /** Wipe all learning progress (keeps the profile). */
  resetProgress: () => void;
  /** Patch the user profile. */
  setProfile: (patch: Partial<UserProfile>) => void;
  /** Bật/tắt đánh dấu cho một mục (id có tiền tố loại). Additive & persist-safe. */
  toggleBookmark: (id: string) => void;
  /** Mục này có đang được đánh dấu không. */
  isBookmarked: (id: string) => boolean;
  /** Lưu ghi chú cho bài học (text rỗng sau khi trim → xoá key). */
  saveNote: (lessonId: string, text: string) => void;
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
    flashcardsGraded: 0,
    bookmarks: [],
    notes: {},
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
    // Reconcile persisted badges up to the full (possibly newly-extended)
    // catalogue so the grid always shows every achievement; unlock timestamps
    // are preserved, new badges start locked until the next evaluation.
    achievements: reconcileAchievements(saved.achievements ?? def.achievements),
    quests: saved.quests ?? def.quests,
    // Field mới (v3): user cũ trong localStorage KHÔNG có 2 key này → `saved.*`
    // là undefined → nhận default rỗng. Không đổi STATE_KEY/version, forward-compat.
    bookmarks: saved.bookmarks ?? def.bookmarks,
    notes: saved.notes ?? def.notes,
    // Field mới (v4): counter thẻ đã chấm — user cũ nhận 0, forward-compat.
    flashcardsGraded: saved.flashcardsGraded ?? def.flashcardsGraded,
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
function achievementCtx(s: PersistedState, nowISO: string): AchievementContext {
  const maxMastery = Object.values(s.masteryBySkill).reduce((m, x) => Math.max(m, x.score), 0);
  // Lowest mastery across the Chapter-1 vector skills (unpractised → 0).
  const ch1MinMastery = Math.min(
    ...CH1_SKILL_IDS.map((id) => s.masteryBySkill[id]?.score ?? 0),
  );
  // Accuracy over attempts in the current local week (Mon–Sun).
  const weekStart = startOfWeekMs(nowISO);
  let weekAttempts = 0;
  let weekCorrect = 0;
  for (const a of s.attempts) {
    if (new Date(a.createdAt).getTime() >= weekStart) {
      weekAttempts += 1;
      if (a.isCorrect) weekCorrect += 1;
    }
  }
  return {
    xpTotal: s.xpTotal,
    streak: s.streak.current,
    lessonsCompleted: s.lessonsCompleted,
    perfectLessons: s.perfectLessons,
    maxMastery,
    ch1MinMastery,
    weekAttempts,
    weekAccuracy: weekAttempts ? weekCorrect / weekAttempts : 0,
    flashcardsGraded: s.flashcardsGraded,
    notesCount: Object.keys(s.notes).length,
    bookmarkCount: s.bookmarks.length,
  };
}

export const useLearnStore = create<LearnState>()((set, get) => ({
  ...loadInitial(),

  recordAttempt: (a, opts) =>
    set((state) => {
      if (isDeveloperMode()) return state;
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
      // Combo quest: trailing run of correct answers (monotonic → never un-completes).
      let trailingCorrect = 0;
      for (let i = attempts.length - 1; i >= 0 && attempts[i].isCorrect; i--) trailingCorrect += 1;
      quests = advanceQuestTo(quests, 'combo', trailingCorrect);

      const next: PersistedState = {
        ...state,
        ...earned,
        attempts,
        masteryBySkill,
        reviewItems,
        streak,
        quests,
      };
      const achievements = evaluateAchievements(
        state.achievements,
        achievementCtx(next, nowISO),
        nowISO,
      );
      return { ...earned, attempts, masteryBySkill, reviewItems, streak, quests, achievements };
    }),

  gradeFlashcard: (skillId, grade) =>
    set((state) => {
      if (isDeveloperMode()) return state;
      const now = new Date();
      const nowISO = now.toISOString();
      const today = toDayKey(now);

      const prev = state.reviewItems[skillId] ?? newReviewItem(skillId, nowISO);
      // Anki → Leitner box (cap 0..MAX_BOX).
      const rawBox =
        grade === 'again'
          ? 1
          : grade === 'hard'
            ? prev.box
            : grade === 'good'
              ? prev.box + 1
              : prev.box + 2; // easy
      const box = Math.max(0, Math.min(rawBox, MAX_BOX));
      const review: ReviewItem = {
        ...prev,
        box,
        dueAt: addDaysISO(nowISO, INTERVAL_DAYS[box]),
        lastResult: grade !== 'again',
      };
      const reviewItems = { ...state.reviewItems, [skillId]: review };

      // Ôn thẻ vẫn tính là hoạt động: streak + quest "reviews" + XP ôn (khi nhớ được).
      // Luôn gọi earnXp (kể cả gained = 0) để daily goal roll-over sang ngày mới.
      const gained = grade === 'again' ? 0 : XP.WEAK_REVIEW;
      const earned = earnXp(state, gained, today);
      const streak = updateStreak(state.streak, today);
      const flashcardsGraded = state.flashcardsGraded + 1;
      let quests = rolloverQuests(state.quests, today);
      quests = advanceQuests(quests, 'reviews', 1);
      quests = advanceQuests(quests, 'flashcards', 1);
      if (gained > 0) quests = advanceQuests(quests, 'xp', gained);

      const next: PersistedState = {
        ...state,
        ...earned,
        reviewItems,
        streak,
        quests,
        flashcardsGraded,
      };
      const achievements = evaluateAchievements(
        state.achievements,
        achievementCtx(next, nowISO),
        nowISO,
      );
      return { ...earned, reviewItems, streak, quests, flashcardsGraded, achievements };
    }),

  awardXp: (amount, reason) =>
    set((state) => {
      if (isDeveloperMode()) return state;
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
      const achievements = evaluateAchievements(
        state.achievements,
        achievementCtx(next, nowISO),
        nowISO,
      );
      return { ...earned, streak, quests, achievements };
    }),

  completeLesson: (lessonId, skillIds, opts) =>
    set((state) => {
      if (isDeveloperMode()) return state;
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
      const achievements = evaluateAchievements(
        state.achievements,
        achievementCtx(next, nowISO),
        nowISO,
      );
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

  toggleBookmark: (id) =>
    set((state) => {
      if (isDeveloperMode()) return state;
      const nowISO = new Date().toISOString();
      const today = toDayKey(nowISO);
      const has = state.bookmarks.includes(id);
      const bookmarks = has
        ? state.bookmarks.filter((b) => b !== id)
        : [...state.bookmarks, id];
      // Đặt bookmark mới → tiến quest "bookmarks" (không tính khi bỏ lưu).
      const quests = has
        ? state.quests
        : advanceQuests(rolloverQuests(state.quests, today), 'bookmarks', 1);
      const next: PersistedState = { ...state, bookmarks, quests };
      const achievements = evaluateAchievements(
        state.achievements,
        achievementCtx(next, nowISO),
        nowISO,
      );
      return { bookmarks, quests, achievements };
    }),

  isBookmarked: (id) => get().bookmarks.includes(id),

  saveNote: (lessonId, text) =>
    set((state) => {
      if (isDeveloperMode()) return state;
      const nowISO = new Date().toISOString();
      const today = toDayKey(nowISO);
      const hadNote = !!state.notes[lessonId]?.trim();
      const notes = { ...state.notes };
      if (text.trim()) notes[lessonId] = text;
      else delete notes[lessonId];
      // Viết ghi chú MỚI (rỗng → có nội dung) → tiến quest "notes".
      const isNewNote = !hadNote && !!text.trim();
      const quests = isNewNote
        ? advanceQuests(rolloverQuests(state.quests, today), 'notes', 1)
        : state.quests;
      const next: PersistedState = { ...state, notes, quests };
      const achievements = evaluateAchievements(
        state.achievements,
        achievementCtx(next, nowISO),
        nowISO,
      );
      return { notes, quests, achievements };
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
    flashcardsGraded: s.flashcardsGraded,
    bookmarks: s.bookmarks,
    notes: s.notes,
  };
}

// Persist after every state change.
useLearnStore.subscribe((s) => storage.setDoc(STATE_KEY, toPersisted(s)));
