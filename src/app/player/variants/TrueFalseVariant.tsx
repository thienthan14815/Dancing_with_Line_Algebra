import type { TrueFalseExercise } from '../../../core/exercises/types';
import type { VariantProps } from './types';
import RichText from '../../ui/RichText';

export default function TrueFalseVariant({
  exercise,
  value,
  onChange,
  disabled,
}: VariantProps<TrueFalseExercise, boolean | null>) {
  return (
    <div className="dl-tf">
      {exercise.statement && (
        <div className="dl-tf-statement">
          <RichText text={exercise.statement} />
        </div>
      )}
      <div className="dl-tf-btns">
        <button
          type="button"
          className={`dl-tf-btn dl-tf-true ${value === true ? 'selected' : ''}`}
          disabled={disabled}
          onClick={() => onChange(true)}
        >
          ✓ Đúng
        </button>
        <button
          type="button"
          className={`dl-tf-btn dl-tf-false ${value === false ? 'selected' : ''}`}
          disabled={disabled}
          onClick={() => onChange(false)}
        >
          ✕ Sai
        </button>
      </div>
    </div>
  );
}
