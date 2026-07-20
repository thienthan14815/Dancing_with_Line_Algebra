import type { MatchingExercise } from '../../../core/exercises/types';
import type { VariantProps } from './types';
import { useState } from 'react';
import RichText from '../../ui/RichText';

const PAIR_COLORS = [
  'var(--vec-1)',
  'var(--vec-2)',
  'var(--vec-3)',
  'var(--vec-result)',
  'var(--accent)',
  'var(--warn)',
];

export default function MatchingVariant({
  exercise,
  value,
  onChange,
  disabled,
}: VariantProps<MatchingExercise, [number, number][]>) {
  const [activeLeft, setActiveLeft] = useState<number | null>(null);

  const leftOf = (l: number) => value.find(([pl]) => pl === l);
  const rightOf = (r: number) => value.find(([, pr]) => pr === r);
  const colorFor = (l: number) => {
    const idx = value.findIndex(([pl]) => pl === l);
    return idx >= 0 ? PAIR_COLORS[idx % PAIR_COLORS.length] : undefined;
  };
  const colorForRight = (r: number) => {
    const idx = value.findIndex(([, pr]) => pr === r);
    return idx >= 0 ? PAIR_COLORS[idx % PAIR_COLORS.length] : undefined;
  };

  const clickLeft = (l: number) => {
    if (disabled) return;
    setActiveLeft((cur) => (cur === l ? null : l));
  };

  const clickRight = (r: number) => {
    if (disabled) return;
    if (activeLeft == null) {
      // Bấm phải trước: bỏ ghép nếu đang có.
      if (rightOf(r)) onChange(value.filter(([, pr]) => pr !== r));
      return;
    }
    // Gỡ mọi cặp trùng trái hoặc trùng phải rồi thêm cặp mới.
    const next = value.filter(([pl, pr]) => pl !== activeLeft && pr !== r);
    next.push([activeLeft, r]);
    onChange(next);
    setActiveLeft(null);
  };

  return (
    <div className="dl-match">
      <div className="dl-match-col">
        {exercise.left.map((t, l) => {
          const c = colorFor(l);
          const matched = !!leftOf(l);
          return (
            <button
              key={l}
              type="button"
              disabled={disabled}
              className={`dl-match-item ${activeLeft === l ? 'active' : ''} ${
                matched ? 'matched' : ''
              }`}
              style={c ? { borderColor: c, boxShadow: `inset 4px 0 0 ${c}` } : undefined}
              onClick={() => clickLeft(l)}
            >
              <RichText text={t} />
            </button>
          );
        })}
      </div>
      <div className="dl-match-col">
        {exercise.right.map((t, r) => {
          const c = colorForRight(r);
          const matched = !!rightOf(r);
          return (
            <button
              key={r}
              type="button"
              disabled={disabled}
              className={`dl-match-item ${matched ? 'matched' : ''}`}
              style={c ? { borderColor: c, boxShadow: `inset -4px 0 0 ${c}` } : undefined}
              onClick={() => clickRight(r)}
            >
              <RichText text={t} />
            </button>
          );
        })}
      </div>
    </div>
  );
}
