import type { MultipleChoiceExercise } from '../../../core/exercises/types';
import type { VariantProps } from './types';
import RichText from '../../ui/RichText';

export default function MultipleChoiceVariant({
  exercise,
  value,
  onChange,
  disabled,
}: VariantProps<MultipleChoiceExercise, number | null>) {
  return (
    <div className="dl-choices">
      {exercise.options.map((opt, i) => {
        const selected = value === i;
        return (
          <button
            key={i}
            type="button"
            className={`dl-choice ${selected ? 'selected' : ''}`}
            disabled={disabled}
            onClick={() => onChange(i)}
          >
            <span className="dl-choice-key">{String.fromCharCode(65 + i)}</span>
            <span className="dl-choice-body">
              <RichText text={opt} />
            </span>
          </button>
        );
      })}
    </div>
  );
}
