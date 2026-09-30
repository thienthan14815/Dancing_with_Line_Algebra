import type { Exercise } from '../../../../core/exercises/types';
import { days01to15 } from './days01-15';
import { days16to30 } from './days16-30';

export const editorial = { ...days01to15, ...days16to30 };

export const conceptualExercises: Exercise[] = Object.entries(editorial).map(([id, lesson]) => ({
  id: `calculus-${id}-concept`, skillId: `calculus_${id}`,
  type: 'multiple-choice', dimension: 'concept', difficulty: 2,
  ...lesson.checkpoint,
  hints: [{ level: 1, text: lesson.method[0].detail }],
}));
