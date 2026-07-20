import type { Exercise } from '../../../core/exercises/types';

/** Props chung cho mọi renderer dạng bài. */
export interface VariantProps<E extends Exercise = Exercise, V = unknown> {
  exercise: E;
  value: V;
  onChange: (v: V) => void;
  disabled: boolean;
}
