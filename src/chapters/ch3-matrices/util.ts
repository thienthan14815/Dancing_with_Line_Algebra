// Tiện ích dùng chung cho CHƯƠNG 3 — Ma trận.
// (Nằm trong thư mục ch3-matrices, không đụng tới file ngoài.)
import { rotation2D, type Mat } from '../../lib/linalg';

// Kiểu tuple 2×2 mà prop `matrix` của Canvas2D yêu cầu.
export type M2 = [[number, number], [number, number]];

/** Ép một Mat bất kỳ về tuple 2×2 cho Canvas2D. */
export function asM2(m: Mat): M2 {
  return [
    [m[0][0], m[0][1]],
    [m[1][0], m[1][1]],
  ];
}

/** Làm tròn 2 chữ số, khử số âm-không (-0). */
export function n2(x: number): number {
  const v = Math.round(x * 100) / 100;
  return Object.is(v, -0) ? 0 : v;
}

/** Chuỗi hiển thị đã làm tròn 2 chữ số. */
export function f2(x: number): string {
  return String(n2(x));
}

/** Ma trận xoay 45° (giữ nguyên độ chính xác cho phần vẽ). */
export const R45: Mat = rotation2D(Math.PI / 4);

/** Bộ preset biến đổi 2D dùng lại nhiều lần trong chương. */
export const PRESETS_2D: { label: string; m: Mat }[] = [
  { label: 'Identity', m: [[1, 0], [0, 1]] },
  { label: 'Xoay 90°', m: [[0, -1], [1, 0]] },
  { label: 'Xoay 45°', m: R45 },
  { label: 'Shear', m: [[1, 1], [0, 1]] },
  { label: 'Co giãn', m: [[1.5, 0], [0, 0.5]] },
  { label: 'Đối xứng (y=x)', m: [[0, 1], [1, 0]] },
  { label: 'Chiếu lên Ox', m: [[1, 0], [0, 0]] },
  { label: 'Suy biến', m: [[1, 2], [2, 4]] },
];

/** Các đỉnh của đường tròn đơn vị (đa giác xấp xỉ) — để minh họa méo/không méo. */
export function circlePts(n = 48): [number, number][] {
  return Array.from({ length: n }, (_, k) => {
    const a = (2 * Math.PI * k) / n;
    return [Math.cos(a), Math.sin(a)] as [number, number];
  });
}

/** Hình vuông đơn vị: 4 đỉnh (0,0)→(1,0)→(1,1)→(0,1). */
export const UNIT_SQUARE: [number, number][] = [
  [0, 0],
  [1, 0],
  [1, 1],
  [0, 1],
];
