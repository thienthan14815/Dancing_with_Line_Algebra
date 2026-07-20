import type { MasteryDimension, SkillMastery } from '../db/schema';

/** Weights used to aggregate the four dims into a single 0..1 `score`. */
export const MASTERY_WEIGHTS = {
  concept: 0.3,
  compute: 0.3,
  visual: 0.2,
  explain: 0.2,
} as const;

/** How fast a dimension moves toward 1 on success / toward 0 on failure. */
const UP_RATE = 0.3;
const DOWN_RATE = 0.3;

function clamp(x: number, lo: number, hi: number): number {
  return Math.min(hi, Math.max(lo, x));
}
function clamp01(x: number): number {
  return clamp(x, 0, 1);
}

/** Weighted (30/30/20/20) aggregate of the four dimension scores. */
export function masteryScore(dims: SkillMastery['dims']): number {
  return clamp01(
    dims.concept * MASTERY_WEIGHTS.concept +
      dims.compute * MASTERY_WEIGHTS.compute +
      dims.visual * MASTERY_WEIGHTS.visual +
      dims.explain * MASTERY_WEIGHTS.explain,
  );
}

export interface MasteryUpdate {
  correct: boolean;
  dimension: MasteryDimension;
  /** Required when `prev` is undefined (to seed `id`/`skillId`). */
  skillId?: string;
  /** ISO timestamp; defaults to now. Pass it to keep the call pure. */
  nowISO?: string;
}

/**
 * Update a skill's mastery after answering along one dimension. Pure.
 *
 *  - The touched dimension moves up on a correct answer (toward 1) and down on
 *    an incorrect one (toward 0), by a proportional step.
 *  - `score` is the weighted aggregate of all four dims.
 *  - `correctStreak` increments on success, resets to 0 on failure.
 *  - `difficulty` eases slightly on success and rises on failure.
 *  - `forgettingRate` shrinks as mastery grows.
 */
export function updateMastery(
  prev: SkillMastery | undefined,
  u: MasteryUpdate,
): SkillMastery {
  const skillId = prev?.skillId ?? u.skillId ?? '';
  const nowISO = u.nowISO ?? new Date().toISOString();

  const base: SkillMastery = prev ?? {
    id: skillId,
    skillId,
    score: 0,
    dims: { concept: 0, compute: 0, visual: 0, explain: 0 },
    lastReviewedAt: nowISO,
    correctStreak: 0,
    difficulty: 0.5,
    forgettingRate: 0.3,
  };

  const cur = base.dims[u.dimension];
  const nextDim = u.correct ? cur + UP_RATE * (1 - cur) : cur - DOWN_RATE * cur;
  const dims = { ...base.dims, [u.dimension]: clamp01(nextDim) };

  const score = masteryScore(dims);
  const correctStreak = u.correct ? base.correctStreak + 1 : 0;
  const difficulty = clamp01(u.correct ? base.difficulty - 0.05 : base.difficulty + 0.1);
  const forgettingRate = clamp(0.05 + 0.3 * (1 - score), 0.02, 0.5);

  return {
    id: skillId,
    skillId,
    score,
    dims,
    lastReviewedAt: nowISO,
    correctStreak,
    difficulty,
    forgettingRate,
  };
}
