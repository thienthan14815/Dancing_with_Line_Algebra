import type { NumericInputExercise } from '../../../core/exercises/types';
import type { VariantProps } from './types';

const KEYS = ['7', '8', '9', '4', '5', '6', '1', '2', '3', '-', '0', '.'];

export default function NumericInputVariant({
  exercise,
  value,
  onChange,
  disabled,
}: VariantProps<NumericInputExercise, string>) {
  const append = (k: string) => {
    if (disabled) return;
    if (k === '-') {
      // Toggle dấu âm ở đầu.
      onChange(value.startsWith('-') ? value.slice(1) : '-' + value);
      return;
    }
    if (k === '.' && value.includes('.')) return;
    onChange(value + k);
  };

  return (
    <div className="dl-num">
      <div className="dl-num-field">
        <input
          className="dl-num-input"
          inputMode="decimal"
          type="text"
          value={value}
          disabled={disabled}
          placeholder="Nhập đáp án…"
          onChange={(e) => onChange(e.target.value)}
        />
        {exercise.unit && <span className="dl-num-unit">{exercise.unit}</span>}
      </div>
      <div className="dl-keypad" aria-hidden={disabled}>
        {KEYS.map((k) => (
          <button
            key={k}
            type="button"
            className="dl-key"
            disabled={disabled}
            onClick={() => append(k)}
          >
            {k}
          </button>
        ))}
        <button
          type="button"
          className="dl-key dl-key-wide"
          disabled={disabled}
          onClick={() => !disabled && onChange(value.slice(0, -1))}
        >
          ⌫
        </button>
        <button
          type="button"
          className="dl-key dl-key-wide"
          disabled={disabled}
          onClick={() => !disabled && onChange('')}
        >
          C
        </button>
      </div>
    </div>
  );
}
