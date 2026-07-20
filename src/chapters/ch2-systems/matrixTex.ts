// Trợ giúp riêng cho Chương 2 — sinh chuỗi TeX cho ma trận (bmatrix / ma trận mở rộng)
// và định dạng số làm tròn 2 chữ số. Đặt trong thư mục chương để không đụng file dùng chung.
import type { Mat } from '../../lib/linalg';

// Làm tròn 2 chữ số, bỏ -0 và phần thập phân thừa.
export function fmt2(x: number): string {
  let v = x;
  if (Math.abs(v) < 1e-9) v = 0;
  const r = Math.round(v * 100) / 100;
  if (Object.is(r, -0)) return '0';
  if (Math.abs(r - Math.round(r)) < 1e-9) return String(Math.round(r));
  return String(r);
}

export interface MatrixTexOpts {
  // Vẽ vạch dọc trước cột cuối (ma trận mở rộng [A|b])
  augment?: boolean;
  // Trả về true nếu ô (i, j) là pivot cần tô đậm
  highlight?: (i: number, j: number) => boolean;
}

// Sinh TeX cho ma trận. Nếu augment => dùng array với vạch dọc; nếu không => bmatrix.
export function matrixTex(m: Mat, opts: MatrixTexOpts = {}): string {
  const { augment = false, highlight } = opts;
  const cols = m.length > 0 ? m[0].length : 0;
  const body = m
    .map((row, i) =>
      row
        .map((x, j) => {
          const s = fmt2(x);
          return highlight && highlight(i, j)
            ? `\\color{#e879f9}{\\mathbf{${s}}}`
            : s;
        })
        .join(' & ')
    )
    .join(' \\\\ ');
  if (augment && cols >= 1) {
    const spec = 'c'.repeat(cols - 1) + '|c';
    return `\\left[\\begin{array}{${spec}} ${body} \\end{array}\\right]`;
  }
  return `\\begin{bmatrix} ${body} \\end{bmatrix}`;
}

// Vector cột dạng bmatrix từ mảng 1 chiều.
export function colVecTex(v: number[]): string {
  return `\\begin{bmatrix} ${v.map(fmt2).join(' \\\\ ')} \\end{bmatrix}`;
}

// Tạo hàm highlight: tô đậm phần tử dẫn đầu (leading, khác 0 đầu tiên) của mỗi hàng.
// Với ma trận mở rộng, chỉ xét trong phần hệ số (bỏ cột cuối).
export function leadingHighlight(m: Mat, augment: boolean): (i: number, j: number) => boolean {
  const cols = m.length > 0 ? m[0].length : 0;
  const lim = augment ? cols - 1 : cols;
  const set = new Set<string>();
  m.forEach((row, i) => {
    for (let j = 0; j < lim; j++) {
      if (Math.abs(row[j]) > 1e-9) {
        set.add(`${i},${j}`);
        break;
      }
    }
  });
  return (i: number, j: number) => set.has(`${i},${j}`);
}
