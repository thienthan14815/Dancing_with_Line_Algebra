import type { MatrixInputExercise } from '../../../core/exercises/types';
import type { VariantProps } from './types';
import MatrixInput from '../../../components/MatrixInput';

export default function MatrixInputVariant({
  exercise,
  value,
  onChange,
  disabled,
}: VariantProps<MatrixInputExercise, number[][]>) {
  return (
    <div
      className="dl-matrix"
      style={disabled ? { opacity: 0.6, pointerEvents: 'none' } : undefined}
    >
      <MatrixInput
        value={value}
        onChange={onChange}
        rows={exercise.rows}
        cols={exercise.cols}
      />
    </div>
  );
}
