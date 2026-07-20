import type { StreakState } from '../db/schema';
import { toDayKey, daysBetween } from './time';

/**
 * Advance a streak given activity on `todayISO` (accepts an ISO timestamp or a
 * `YYYY-MM-DD` day key). Pure.
 *
 *  - Same day as last activity          -> unchanged.
 *  - Exactly the next day               -> current + 1.
 *  - A gap, but enough freeze tokens to  -> bridge the gap (spend freezes),
 *    cover every missed day                current + 1.
 *  - A gap with insufficient freezes    -> reset to 1 (today counts).
 *  - First ever activity                -> 1.
 *
 * `longest` is kept in sync as a running maximum.
 */
export function updateStreak(state: StreakState, todayISO: string): StreakState {
  const today = toDayKey(todayISO);
  const last = state.lastActiveDay;

  // First ever activity.
  if (!last) {
    return withCurrent(state, 1, today, state.freezes);
  }

  const gap = daysBetween(last, today);

  // Same day (or a clock that went backwards) — nothing changes.
  if (gap <= 0) return state;

  // Consecutive day.
  if (gap === 1) {
    return withCurrent(state, state.current + 1, today, state.freezes);
  }

  // There was a break. Try to cover the missed days with freeze tokens.
  const missed = gap - 1;
  if (state.current > 0 && state.freezes >= missed) {
    return withCurrent(state, state.current + 1, today, state.freezes - missed);
  }

  // Streak broken — today starts a fresh streak of 1.
  return withCurrent(state, 1, today, state.freezes);
}

function withCurrent(
  state: StreakState,
  current: number,
  lastActiveDay: string,
  freezes: number,
): StreakState {
  return {
    current,
    longest: Math.max(state.longest, current),
    lastActiveDay,
    freezes,
  };
}
