// Tiện ích dùng chung cho CHƯƠNG 6 — SVD.
// (Nằm trong thư mục ch6-svd, không đụng tới file ngoài.)
import { type Mat } from '../../lib/linalg';

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

/** Các đỉnh của đường tròn đơn vị (đa giác xấp xỉ). */
export function circlePts(n = 64): [number, number][] {
  return Array.from({ length: n }, (_, k) => {
    const a = (2 * Math.PI * k) / n;
    return [Math.cos(a), Math.sin(a)] as [number, number];
  });
}

/** Xuất một ma trận 2×2 ra chuỗi TeX \begin{bmatrix}…\end{bmatrix} (làm tròn 2 số). */
export function mat2tex(m: Mat, digits = 2): string {
  const g = (x: number) => {
    const v = Math.round(x * Math.pow(10, digits)) / Math.pow(10, digits);
    return String(Object.is(v, -0) ? 0 : v);
  };
  const rows = m.map((r) => r.map(g).join(' & ')).join(' \\\\ ');
  return `\\begin{bmatrix} ${rows} \\end{bmatrix}`;
}

/** Ma trận đường chéo 2×2 từ hai singular value. */
export function diag2(a: number, b: number): Mat {
  return [
    [a, 0],
    [0, b],
  ];
}

/** Nhân ma trận 2×2 với vector [x,y]. */
export function apply2(m: Mat, x: number, y: number): [number, number] {
  return [m[0][0] * x + m[0][1] * y, m[1][0] * x + m[1][1] * y];
}

/** Lấy cột thứ j của ma trận. */
export function col(m: Mat, j: number): number[] {
  return m.map((r) => r[j]);
}

/**
 * Sinh số giả ngẫu nhiên tất định (mulberry32) — cùng seed luôn cho cùng dãy,
 * để render ổn định giữa các lần dựng lại component.
 */
export function mulberry32(seed: number): () => number {
  let a = seed >>> 0;
  return function () {
    a |= 0;
    a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

/** Bộ preset ma trận 2×2 dùng lại trong chương SVD. */
export const PRESETS_SVD: { label: string; m: Mat }[] = [
  { label: 'Shear', m: [[1, 1], [0, 1]] },
  { label: 'Ma trận bất kỳ', m: [[1.5, -0.5], [0.6, 1.4]] },
  { label: 'Co giãn lệch', m: [[2, 0], [0, 0.6]] },
  { label: 'Đối xứng', m: [[2, 1], [1, 2]] },
  { label: 'Xoay 30°', m: [[Math.cos(Math.PI / 6), -Math.sin(Math.PI / 6)], [Math.sin(Math.PI / 6), Math.cos(Math.PI / 6)]] },
  { label: 'Suy biến (rank 1)', m: [[1, 2], [2, 4]] },
];
