import type { DailyGoalState } from '../db/schema';

/** A fresh daily-goal for `day` with the given target. Pure. */
export function newDailyGoal(day: string, goalXp: number): DailyGoalState {
  return { day, xpEarned: 0, goalXp, met: goalXp <= 0 };
}

/** Add earned XP to the day and recompute `met`. Pure. */
export function addDailyXp(state: DailyGoalState, amount: number): DailyGoalState {
  const xpEarned = state.xpEarned + amount;
  return { ...state, xpEarned, met: xpEarned >= state.goalXp };
}

/** Whether the day's goal is reached. */
export function isGoalMet(state: DailyGoalState): boolean {
  return state.xpEarned >= state.goalXp;
}

/**
 * Roll the daily goal over to `day`: returns a fresh goal when the day changed,
 * otherwise the existing state untouched. Pure.
 */
export function rolloverDailyGoal(
  state: DailyGoalState,
  day: string,
  goalXp: number,
): DailyGoalState {
  return state.day === day ? state : newDailyGoal(day, goalXp);
}
