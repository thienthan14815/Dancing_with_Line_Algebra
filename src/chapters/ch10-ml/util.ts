// Tiện ích TOÁN dùng chung cho CHƯƠNG 10 — Học máy & Hồi quy.
// Mọi thứ ở đây dựng trên src/lib/linalg.ts (least squares = LA áp dụng).
// Nằm gọn trong thư mục ch10-ml, không chạm file bên ngoài.
import { transpose, matMul, matVec, solveSystem, type Mat } from '../../lib/linalg';

// --- Định dạng số ----------------------------------------------------------

/** Làm tròn 2 chữ số, khử -0. */
export function n2(x: number): number {
  const v = Math.round(x * 100) / 100;
  return Object.is(v, -0) ? 0 : v;
}

/** Chuỗi 2 chữ số thập phân, khử -0. */
export function f2(x: number): string {
  return n2(x).toFixed(2);
}

/** Chuỗi 3 chữ số thập phân, khử -0. */
export function f3(x: number): string {
  const v = Math.round(x * 1000) / 1000;
  return (Object.is(v, -0) ? 0 : v).toFixed(3);
}

// --- Hồi quy tuyến tính 1 biến qua NORMAL EQUATION -------------------------

/**
 * Nghiệm least squares của y ≈ w·x + b bằng normal equation XᵀXβ = Xᵀy.
 * Ma trận thiết kế X có mỗi hàng [1, xᵢ] ⇒ β = [b, w] (intercept trước).
 * Đây CHÍNH LÀ máy móc least squares của Chương 7–8.
 */
export function fitLine(xs: number[], ys: number[]): { w: number; b: number } {
  const X: Mat = xs.map((x) => [1, x]);
  const Xt = transpose(X);
  const XtX = matMul(Xt, X); // 2×2
  const Xty = matVec(Xt, ys); // độ dài 2
  const sol = solveSystem(XtX, Xty);
  if (sol.type !== 'unique' || !sol.solution) return { w: 0, b: 0 };
  return { b: sol.solution[0], w: sol.solution[1] };
}

// --- Đường mức (contour) của mặt mất mát MSE(w, b) --------------------------

/**
 * Ma trận dạng toàn phương của phần bậc hai của MSE quanh cực tiểu.
 * MSE(θ) = MSE* + (θ−θ*)ᵀ M (θ−θ*) với θ = (w, b) và
 *   M = (1/n) XᵀX = [[Σxᵢ²/n, Σxᵢ/n], [Σxᵢ/n, 1]].
 * M đối xứng xác định dương ⇒ các đường mức là ELLIPSE, mặt loss là "cái bát"
 * (bridge sang dạng toàn phương lồi — Chương 9). Đây đúng bằng nửa Hessian.
 */
export function lossQuadForm(xs: number[]): Mat {
  const n = xs.length || 1;
  const Sx2 = xs.reduce((s, x) => s + x * x, 0) / n;
  const Sx = xs.reduce((s, x) => s + x, 0) / n;
  return [
    [Sx2, Sx],
    [Sx, 1],
  ];
}

/**
 * Một đường mức ellipse {θ : (θ−c)ᵀ M (θ−c) = L} quanh tâm c = (cw, cb).
 * Viết θ − c = r·u với u = (cosθ, sinθ); (θ−c)ᵀM(θ−c) = r²·g(θ) = L ⇒ r = √(L/g).
 * Vì M xác định dương nên g(θ) > 0 mọi hướng ⇒ luôn là một vòng kín.
 */
export function contourEllipse(
  M: Mat,
  cw: number,
  cb: number,
  L: number,
  N = 160,
): [number, number][] {
  const pts: [number, number][] = [];
  for (let k = 0; k <= N; k++) {
    const th = (2 * Math.PI * k) / N;
    const ux = Math.cos(th);
    const uy = Math.sin(th);
    const g = M[0][0] * ux * ux + 2 * M[0][1] * ux * uy + M[1][1] * uy * uy;
    if (g <= 1e-9) continue;
    const r = Math.sqrt(L / g);
    pts.push([cw + r * ux, cb + r * uy]);
  }
  return pts;
}

// --- Khớp đa thức có điều chuẩn (ridge / weight decay) ----------------------

/**
 * Khớp đa thức bậc `deg`:  y ≈ c₀ + c₁x + … + c_d x^d, giải bằng ridge:
 *   (XᵀX + λI) c = Xᵀy,  X là ma trận Vandermonde (hàng [1, x, x², …, x^d]).
 * Cộng λ vào đường chéo = PHẠT ‖c‖² (weight decay) ⇒ hệ số nhỏ lại, đường mượt
 * hơn. Luôn cộng thêm 1e-7 để XᵀX+λI chắc chắn khả nghịch (tránh suy biến số học).
 */
export function polyRidgeFit(
  xs: number[],
  ys: number[],
  deg: number,
  lambda: number,
): number[] {
  const X: Mat = xs.map((x) => {
    const row: number[] = [];
    let p = 1;
    for (let k = 0; k <= deg; k++) {
      row.push(p);
      p *= x;
    }
    return row;
  });
  const Xt = transpose(X);
  const XtX = matMul(Xt, X);
  const Xty = matVec(Xt, ys);
  for (let i = 0; i <= deg; i++) XtX[i][i] += lambda + 1e-7;
  const sol = solveSystem(XtX, Xty);
  if (sol.type !== 'unique' || !sol.solution) return new Array(deg + 1).fill(0);
  return sol.solution;
}

/** Giá trị đa thức Σ cₖ xᵏ tại x (theo sơ đồ Horner đơn giản). */
export function polyEval(c: number[], x: number): number {
  let y = 0;
  let p = 1;
  for (let k = 0; k < c.length; k++) {
    y += c[k] * p;
    p *= x;
  }
  return y;
}

/** MSE huấn luyện của một bộ hệ số đa thức trên (xs, ys). */
export function polyTrainMSE(
  xs: number[],
  ys: number[],
  c: number[],
): number {
  if (xs.length === 0) return 0;
  let s = 0;
  for (let i = 0; i < xs.length; i++) {
    const e = polyEval(c, xs[i]) - ys[i];
    s += e * e;
  }
  return s / xs.length;
}
