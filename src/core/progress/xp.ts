/**
 * XP economy — constants + a pure calculator for a single exercise result.
 */

/** XP rewards for the various learning events. */
export const XP = {
  /** Completing a lesson. */
  LESSON_COMPLETE: 10,
  /** Answering correctly (no mistake on the item). */
  NO_MISTAKES: 5,
  /** Correctly clearing a challenge exercise. */
  CHALLENGE: 15,
  /** Correctly reviewing a weak skill (SRS). */
  WEAK_REVIEW: 10,
  /** Reading the worked explanation. */
  VIEW_EXPLANATION: 5,
} as const;

export interface XpResultInput {
  isCorrect: boolean;
  /** The exercise was a "challenge" item. */
  isChallenge?: boolean;
  /** The exercise was a spaced-repetition review of a weak skill. */
  isWeakReview?: boolean;
  /** The learner opened the worked explanation for this exercise. */
  viewedExplanation?: boolean;
}

/**
 * XP earned from a single exercise attempt.
 *
 *  - Correct challenge        -> CHALLENGE (15)
 *  - Correct weak-skill review-> WEAK_REVIEW (10)
 *  - Correct (regular)        -> NO_MISTAKES (5)
 *  - Incorrect                -> 0 base
 *  - Viewed explanation       -> +VIEW_EXPLANATION (5), even after a wrong
 *                                answer, to reward learning from mistakes.
 *
 * Lesson completion (LESSON_COMPLETE) is awarded separately at the lesson
 * level (see the store's `completeLesson`).
 */
export function xpForResult(input: XpResultInput): number {
  let xp = 0;
  if (input.isCorrect) {
    if (input.isChallenge) xp += XP.CHALLENGE;
    else if (input.isWeakReview) xp += XP.WEAK_REVIEW;
    else xp += XP.NO_MISTAKES;
  }
  if (input.viewedExplanation) xp += XP.VIEW_EXPLANATION;
  return xp;
}
