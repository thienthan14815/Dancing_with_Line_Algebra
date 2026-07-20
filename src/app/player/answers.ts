import type { Exercise } from '../../core/exercises/types';

/** Trộn mảng chỉ số 0..n-1 (Fisher–Yates). */
function shuffledIndices(n: number): number[] {
  const a = Array.from({ length: n }, (_, i) => i);
  for (let i = n - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  // Tránh trường hợp trộn ra đúng thứ tự gốc khi n > 1.
  if (n > 1 && a.every((v, i) => v === i)) return shuffledIndices(n);
  return a;
}

/** Giá trị đáp án khởi tạo cho mỗi dạng bài (đúng shape engine yêu cầu). */
export function initialAnswer(ex: Exercise): unknown {
  switch (ex.type) {
    case 'multiple-choice':
    case 'error-detection':
      return null; // index sẽ chọn
    case 'numeric-input':
      return '';
    case 'true-false':
      return null;
    case 'matrix-input':
      return Array.from({ length: ex.rows }, () =>
        Array.from({ length: ex.cols }, () => 0),
      );
    case 'matching':
      return [] as [number, number][];
    case 'step-ordering':
      return shuffledIndices(ex.steps.length);
    case 'vector-drawing':
      return [0, 0] as [number, number];
    default:
      return null;
  }
}

/** Đã đủ dữ kiện để bấm "Kiểm tra" chưa (mềm — chỉ để bật/tắt nút). */
export function hasAnswer(ex: Exercise, v: unknown): boolean {
  switch (ex.type) {
    case 'multiple-choice':
    case 'error-detection':
      return typeof v === 'number';
    case 'numeric-input':
      return typeof v === 'string' && v.trim() !== '';
    case 'true-false':
      return typeof v === 'boolean';
    case 'matrix-input':
    case 'step-ordering':
    case 'vector-drawing':
      return Array.isArray(v);
    case 'matching':
      return Array.isArray(v) && v.length === ex.left.length;
    default:
      return false;
  }
}
