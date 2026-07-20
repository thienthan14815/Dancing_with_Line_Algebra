import type { StepOrderingExercise } from '../../../core/exercises/types';
import type { VariantProps } from './types';
import RichText from '../../ui/RichText';

/** value = mảng chỉ số gốc theo thứ tự người học đang sắp. */
export default function StepOrderingVariant({
  exercise,
  value,
  onChange,
  disabled,
}: VariantProps<StepOrderingExercise, number[]>) {
  const move = (pos: number, dir: -1 | 1) => {
    if (disabled) return;
    const to = pos + dir;
    if (to < 0 || to >= value.length) return;
    const next = value.slice();
    [next[pos], next[to]] = [next[to], next[pos]];
    onChange(next);
  };

  return (
    <ol className="dl-steps">
      {value.map((origIdx, pos) => (
        <li key={origIdx} className="dl-step-item">
          <span className="dl-step-num">{pos + 1}</span>
          <span className="dl-step-text">
            <RichText text={exercise.steps[origIdx]} />
          </span>
          <span className="dl-step-ctrls">
            <button
              type="button"
              className="dl-step-btn"
              disabled={disabled || pos === 0}
              onClick={() => move(pos, -1)}
              aria-label="Lên"
            >
              ↑
            </button>
            <button
              type="button"
              className="dl-step-btn"
              disabled={disabled || pos === value.length - 1}
              onClick={() => move(pos, 1)}
              aria-label="Xuống"
            >
              ↓
            </button>
          </span>
        </li>
      ))}
    </ol>
  );
}
