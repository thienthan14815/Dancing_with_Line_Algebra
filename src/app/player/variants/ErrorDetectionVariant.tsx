import type { ErrorDetectionExercise } from '../../../core/exercises/types';
import type { VariantProps } from './types';
import RichText from '../../ui/RichText';

export default function ErrorDetectionVariant({
  exercise,
  value,
  onChange,
  disabled,
}: VariantProps<ErrorDetectionExercise, number | null>) {
  return (
    <div className="dl-errlines">
      {exercise.lines.map((line, i) => {
        const selected = value === i;
        return (
          <button
            key={i}
            type="button"
            className={`dl-errline ${selected ? 'selected' : ''}`}
            disabled={disabled}
            onClick={() => onChange(i)}
          >
            <span className="dl-errline-num">{i + 1}</span>
            <span className="dl-errline-body">
              <RichText text={line} />
            </span>
          </button>
        );
      })}
    </div>
  );
}
