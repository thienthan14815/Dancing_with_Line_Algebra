// Tiện ích dùng chung cho CHƯƠNG 9 — Dạng toàn phương (Quadratic forms).
// Nằm gọn trong thư mục ch9-quadratic, không chạm file bên ngoài.
import { quadraticForm, transpose, type Mat } from '../../lib/linalg';

/** Kiểu tuple 2×2 mà prop `matrix` của Canvas2D yêu cầu. */
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

/** Chuỗi có dấu rõ ràng (+/−), làm tròn 2 chữ số. */
export function fSigned(x: number): string {
  const v = n2(x);
  return v >= 0 ? `+ ${v}` : `− ${Math.abs(v)}`;
}

/** Dựng ma trận đối xứng 2×2 từ hệ số a x² + 2b xy + c y². */
export function sym2(a: number, b: number, c: number): Mat {
  return [
    [a, b],
    [b, c],
  ];
}

/** Phần đối xứng (A + Aᵀ)/2 — dạng toàn phương chỉ phụ thuộc phần này. */
export function symmetrize(A: Mat): Mat {
  const At = transpose(A);
  return A.map((row, i) => row.map((x, j) => (x + At[i][j]) / 2));
}

/**
 * Đường mức (level set) q(x)=L của dạng toàn phương xᵀAx trong mặt phẳng.
 * Ý tưởng: viết x = r·u với u=(cosθ,sinθ) đơn vị ⇒ q(x)=r²·g(θ), g(θ)=uᵀAu.
 * Với mỗi hướng θ, nếu L/g(θ) > 0 thì r=√(L/g(θ)) là điểm nằm trên đường mức.
 * Ellipse: g>0 mọi θ ⇒ một vòng kín. Hyperbola: g đổi dấu ⇒ tách thành các nhánh.
 * Trả về danh sách các polyline (toạ độ world) để vẽ.
 */
export function levelSetPolylines(A: Mat, L: number, maxR = 6): [number, number][][] {
  const N = 240;
  const polylines: [number, number][][] = [];
  let cur: [number, number][] = [];
  for (let k = 0; k <= N; k++) {
    const th = (2 * Math.PI * k) / N;
    const u = [Math.cos(th), Math.sin(th)];
    const g = quadraticForm(A, u); // uᵀAu
    let ok = false;
    if (Math.abs(g) > 1e-7 && L / g > 0) {
      const r = Math.sqrt(L / g);
      if (r <= maxR * 1.02) {
        cur.push([u[0] * r, u[1] * r]);
        ok = true;
      }
    }
    if (!ok) {
      if (cur.length > 1) polylines.push(cur);
      cur = [];
    }
  }
  if (cur.length > 1) polylines.push(cur);
  return polylines;
}

export type Definiteness =
  | 'positive-definite'
  | 'positive-semidefinite'
  | 'negative-definite'
  | 'negative-semidefinite'
  | 'indefinite';

export interface DefInfo {
  labelVi: string;
  tag: string; // nhãn tiếng Anh giữ nguyên
  surface: string; // hình dạng mặt z = q
  color: string; // token màu CSS
}

/** Diễn giải tiếng Việt + màu cho từng loại định dấu. */
export function defInfo(d: Definiteness): DefInfo {
  switch (d) {
    case 'positive-definite':
      return {
        labelVi: 'Xác định dương',
        tag: 'positive-definite',
        surface: 'bát mở lên — mọi hướng đều đi lên',
        color: 'var(--vec-3)',
      };
    case 'negative-definite':
      return {
        labelVi: 'Xác định âm',
        tag: 'negative-definite',
        surface: 'bát úp xuống — mọi hướng đều đi xuống',
        color: 'var(--vec-2)',
      };
    case 'indefinite':
      return {
        labelVi: 'Không xác định',
        tag: 'indefinite',
        surface: 'yên ngựa (saddle) — có hướng lên, có hướng xuống',
        color: 'var(--vec-result)',
      };
    case 'positive-semidefinite':
      return {
        labelVi: 'Nửa xác định dương',
        tag: 'positive-semidefinite',
        surface: 'máng lõm — có một đáy phẳng dọc theo một hướng',
        color: 'var(--vec-1)',
      };
    case 'negative-semidefinite':
      return {
        labelVi: 'Nửa xác định âm',
        tag: 'negative-semidefinite',
        surface: 'máng lồi — có một sống phẳng dọc theo một hướng',
        color: 'var(--warn)',
      };
  }
}

/** Hình vuông đơn vị cho minh hoạ. */
export const UNIT_SQUARE: [number, number][] = [
  [0, 0],
  [1, 0],
  [1, 1],
  [0, 1],
];
