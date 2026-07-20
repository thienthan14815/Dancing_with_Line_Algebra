import type { Exercise } from '../../../core/exercises/types';
import MultipleChoiceVariant from './MultipleChoiceVariant';
import NumericInputVariant from './NumericInputVariant';
import MatrixInputVariant from './MatrixInputVariant';
import MatchingVariant from './MatchingVariant';
import StepOrderingVariant from './StepOrderingVariant';
import VectorDrawingVariant from './VectorDrawingVariant';
import ErrorDetectionVariant from './ErrorDetectionVariant';
import TrueFalseVariant from './TrueFalseVariant';

export interface ExerciseViewProps {
  exercise: Exercise;
  value: unknown;
  onChange: (v: unknown) => void;
  disabled: boolean;
}

/** Dispatcher: chọn renderer đúng theo `exercise.type` (union được thu hẹp). */
export default function ExerciseView({
  exercise,
  value,
  onChange,
  disabled,
}: ExerciseViewProps) {
  switch (exercise.type) {
    case 'multiple-choice':
      return (
        <MultipleChoiceVariant
          exercise={exercise}
          value={value as number | null}
          onChange={onChange}
          disabled={disabled}
        />
      );
    case 'numeric-input':
      return (
        <NumericInputVariant
          exercise={exercise}
          value={value as string}
          onChange={onChange}
          disabled={disabled}
        />
      );
    case 'matrix-input':
      return (
        <MatrixInputVariant
          exercise={exercise}
          value={value as number[][]}
          onChange={onChange}
          disabled={disabled}
        />
      );
    case 'matching':
      return (
        <MatchingVariant
          exercise={exercise}
          value={value as [number, number][]}
          onChange={onChange}
          disabled={disabled}
        />
      );
    case 'step-ordering':
      return (
        <StepOrderingVariant
          exercise={exercise}
          value={value as number[]}
          onChange={onChange}
          disabled={disabled}
        />
      );
    case 'vector-drawing':
      return (
        <VectorDrawingVariant
          exercise={exercise}
          value={value as [number, number]}
          onChange={onChange}
          disabled={disabled}
        />
      );
    case 'error-detection':
      return (
        <ErrorDetectionVariant
          exercise={exercise}
          value={value as number | null}
          onChange={onChange}
          disabled={disabled}
        />
      );
    case 'true-false':
      return (
        <TrueFalseVariant
          exercise={exercise}
          value={value as boolean | null}
          onChange={onChange}
          disabled={disabled}
        />
      );
    default: {
      const _exhaustive: never = exercise;
      return <div className="dl-muted">Dạng bài không hỗ trợ: {String(_exhaustive)}</div>;
    }
  }
}
