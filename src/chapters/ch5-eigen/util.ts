// Tiện ích dùng chung cho CHƯƠNG 5 — Eigenvalues & Eigenvectors.
// (Nằm gọn trong thư mục ch5-eigen, không chạm tới file bên ngoài.)
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

/** Chuỗi có dấu rõ ràng (+/−), làm tròn 2 chữ số — tiện cho hệ số. */
export function fSigned(x: number): string {
  const v = n2(x);
  return v >= 0 ? `+${v}` : `−${Math.abs(v)}`;
}

/** A − λI cho ma trận 2×2. */
export function shiftedMatrix(m: Mat, lambda: number): Mat {
  return [
    [m[0][0] - lambda, m[0][1]],
    [m[1][0], m[1][1] - lambda],
  ];
}

/** Ma trận xoay dùng cho preset "không có eigenvector thực". */
export const ROT_50: Mat = rotation2D((50 * Math.PI) / 180);

/** Hình vuông đơn vị: 4 đỉnh (0,0)→(1,0)→(1,1)→(0,1). */
export const UNIT_SQUARE: [number, number][] = [
  [0, 0],
  [1, 0],
  [1, 1],
  [0, 1],
];

/** Các preset ma trận chủ đạo của chương. */
export const PRESET_SHEAR: Mat = [
  [1, 1],
  [0, 1],
];
export const PRESET_SYMMETRIC: Mat = [
  [2, 1],
  [1, 2],
];
export const PRESET_DIAG: Mat = [
  [3, 1],
  [0, 2],
];
