/**
 * Simulated "database tables" for the LinAlgLab learning core.
 *
 * These are the row/document shapes that the client-side persistence layer
 * stores today and that a real backend (REST / Supabase) would mirror
 * tomorrow. They are the shared CONTRACT — UI code should import these types
 * rather than redeclaring them.
 */

/** Classified mistake categories used for analytics + targeted review. */
export type ErrorType =
  | 'SIGN_ERROR'
  | 'ARITHMETIC_ERROR'
  | 'ROW_COLUMN_MISMATCH'
  | 'INVALID_MATRIX_DIMENSION'
  | 'WRONG_ELIMINATION_OPERATION'
  | 'CONFUSED_EIGENVALUE_WITH_EIGENVECTOR'
  | 'DEPENDENCE_REASONING_ERROR'
  | 'CONCEPT_ERROR'
  | 'OTHER';

/** The four mastery dimensions tracked per skill. */
export type MasteryDimension = 'concept' | 'compute' | 'visual' | 'explain';

/** Kinds of daily quests. */
export type QuestKind = 'xp' | 'lessons' | 'reviews' | 'accuracy';

/** The learner. */
export interface UserProfile {
  id: string;
  name?: string;
  goal?: string;
  level?: string;
  /** Target XP per day. */
  dailyGoalXp: number;
  /** ISO timestamp. */
  createdAt: string;
  onboarded: boolean;
  /** Whether the learner opted into the Python-flavoured track. */
  learnWithPython: boolean;
}

/** A single answered exercise. */
export interface UserAttempt {
  id: string;
  exerciseId: string;
  skillId: string;
  lessonId: string;
  isCorrect: boolean;
  errorType?: ErrorType;
  responseTimeMs: number;
  hintsUsed: number;
  /** 1-based attempt count for this exercise within the session. */
  attemptNumber: number;
  /** ISO timestamp. */
  createdAt: string;
}

/** Per-skill mastery model. `id === skillId`. */
export interface SkillMastery {
  id: string;
  skillId: string;
  /** Weighted 0..1 aggregate of the four dims. */
  score: number;
  dims: {
    concept: number;
    compute: number;
    visual: number;
    explain: number;
  };
  /** ISO timestamp. */
  lastReviewedAt: string;
  correctStreak: number;
  /** 0..1, higher = harder for this learner. */
  difficulty: number;
  /** 0..1 estimated daily decay used by SRS. */
  forgettingRate: number;
}

/** Spaced-repetition (Leitner) scheduling row. `id === skillId`. */
export interface ReviewItem {
  id: string;
  skillId: string;
  /** Leitner box 0..5. */
  box: number;
  /** ISO timestamp when this item is next due. */
  dueAt: string;
  /** Result of the most recent review (undefined until first review). */
  lastResult?: boolean;
}

/** An immutable XP ledger entry (kept for backend-readiness / auditing). */
export interface XpTransaction {
  id: string;
  amount: number;
  reason: string;
  /** ISO timestamp. */
  createdAt: string;
}

/** Rolling streak state. */
export interface StreakState {
  current: number;
  longest: number;
  /** `YYYY-MM-DD` of the last active day ('' when never active). */
  lastActiveDay: string;
  /** Number of streak-freeze tokens the learner holds. */
  freezes: number;
}

/** Per-day goal progress. */
export interface DailyGoalState {
  /** `YYYY-MM-DD`. */
  day: string;
  xpEarned: number;
  goalXp: number;
  met: boolean;
}

/** An unlockable badge. */
export interface Achievement {
  id: string;
  title: string;
  desc: string;
  /** ISO timestamp when unlocked; undefined while still locked. */
  unlockedAt?: string;
}

/** A daily quest / objective. */
export interface Quest {
  id: string;
  title: string;
  target: number;
  progress: number;
  kind: QuestKind;
  /** `YYYY-MM-DD` the quest belongs to. */
  day: string;
}
