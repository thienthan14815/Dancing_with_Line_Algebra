import type { VectorDrawingExercise } from '../../../core/exercises/types';
import type { VariantProps } from './types';
import Canvas2D, { type V2 } from '../../../components/Canvas2D';

export default function VectorDrawingVariant({
  exercise,
  value,
  onChange,
  disabled,
}: VariantProps<VectorDrawingExercise, [number, number]>) {
  const [x, y] = value;
  const vectors: V2[] = [
    {
      id: 'u',
      x,
      y,
      color: 'var(--vec-1)',
      label: `(${x}, ${y})`,
      draggable: !disabled,
    },
  ];
  // Gợi ý phạm vi vẽ dựa trên độ lớn mục tiêu (không lộ đáp án cụ thể).
  const mag = Math.max(Math.abs(exercise.target[0]), Math.abs(exercise.target[1]), 3);
  const range = Math.ceil(mag) + 2;

  return (
    <div className="dl-vecdraw">
      <Canvas2D
        height={320}
        range={range}
        showGrid
        showAxes
        vectors={vectors}
        onVectorChange={(_, nx, ny) => onChange([nx, ny])}
      />
      <p className="dl-vecdraw-hint">
        Kéo đầu mũi tên để vẽ vector. Toạ độ hiện tại:{' '}
        <b>
          ({x}, {y})
        </b>
      </p>
    </div>
  );
}
