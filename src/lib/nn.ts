// nn.ts — thư viện Deep Learning tối giản cho LinAlgLab.
//
// TRIẾT LÝ: Deep Learning = Đại số tuyến tính được ÁP DỤNG. Mọi hàm ở đây đều
// dựng trên các phép LA đã có ở src/linalg.ts (dot product, matVec, cộng vector).
//   • một neuron   = dot product + hàm kích hoạt
//   • một lớp mạng = phép nhân ma trận – vector (Wx) rồi cộng bias (+b)
//   • huấn luyện   = đi ngược gradient của hàm mất mát (gradient descent)
//
// Hàm THUẦN (pure): không side-effect, không phụ thuộc trạng thái ngoài — dễ test.
// Kiểu dùng lại từ linalg: Vec = number[], Mat = number[][] (row-major).

import { matVec, add, type Vec, type Mat } from './linalg';

// ---------------------------------------------------------------------------
// Hàm kích hoạt (activation functions) — vô hướng
// ---------------------------------------------------------------------------

/** Sigmoid: ép mọi số thực về khoảng (0, 1). σ(0) = 0.5. */
export function sigmoid(x: number): number {
  return 1 / (1 + Math.exp(-x));
}

/** ReLU: giữ phần dương, cắt phần âm về 0. max(0, x). */
export function relu(x: number): number {
  return x > 0 ? x : 0;
}

/** tanh: ép về (−1, 1), đối xứng quanh gốc. tanh(0) = 0. */
export function tanhAct(x: number): number {
  return Math.tanh(x);
}

/** Tên các hàm kích hoạt hỗ trợ trong một lớp mạng. */
export type Activation = 'relu' | 'sigmoid' | 'tanh' | 'none';

/** Áp một hàm kích hoạt lên từng phần tử của vector (element-wise). */
export function applyActivation(v: Vec, act: Activation): Vec {
  switch (act) {
    case 'relu':
      return v.map(relu);
    case 'sigmoid':
      return v.map(sigmoid);
    case 'tanh':
      return v.map(tanhAct);
    case 'none':
      return v.slice();
  }
}

// ---------------------------------------------------------------------------
// Softmax — biến một vector "điểm số" (logits) thành phân phối xác suất
// ---------------------------------------------------------------------------

/**
 * Softmax ỔN ĐỊNH SỐ HỌC: trừ đi max trước khi lấy mũ để tránh tràn số
 * (exp của số lớn). Kết quả là các xác suất dương, TỔNG = 1.
 */
export function softmax(v: Vec): Vec {
  if (v.length === 0) return [];
  const m = Math.max(...v);
  const exps = v.map((x) => Math.exp(x - m));
  const sum = exps.reduce((a, b) => a + b, 0);
  return exps.map((e) => e / sum);
}

// ---------------------------------------------------------------------------
// Hàm mất mát (loss functions)
// ---------------------------------------------------------------------------

/** Sai số bình phương trung bình (Mean Squared Error) giữa dự đoán và mục tiêu. */
export function mse(pred: Vec, target: Vec): number {
  if (pred.length === 0) return 0;
  let s = 0;
  for (let i = 0; i < pred.length; i++) {
    const d = pred[i] - target[i];
    s += d * d;
  }
  return s / pred.length;
}

/**
 * Cross-entropy cho phân loại: −log(xác suất của lớp đúng).
 * `probs` nên là đầu ra của softmax; `labelIndex` là chỉ số lớp thật.
 * Kẹp cận dưới 1e-12 để tránh log(0) = −∞.
 */
export function crossEntropy(probs: Vec, labelIndex: number): number {
  const p = Math.max(probs[labelIndex] ?? 0, 1e-12);
  return -Math.log(p);
}

// ---------------------------------------------------------------------------
// Lan truyền xuôi (forward pass) — mạng nơ-ron là LA xâu chuỗi
// ---------------------------------------------------------------------------

/** Một lớp tuyến tính: trọng số W, bias b, và hàm kích hoạt act. */
export interface Layer {
  W: Mat;
  b: Vec;
  act: Activation;
}

/**
 * Lớp tuyến tính (affine): trả về Wx + b.
 * Đây CHÍNH LÀ phép matVec (nhân ma trận–vector) rồi cộng vector bias.
 */
export function linearForward(W: Mat, x: Vec, b: Vec): Vec {
  return add(matVec(W, x), b);
}

/**
 * Lan truyền xuôi qua một MLP (multilayer perceptron):
 * lần lượt áp mỗi lớp  x ← act(W·x + b).
 */
export function mlpForward(x: Vec, layers: Layer[]): Vec {
  let out = x.slice();
  for (const layer of layers) {
    out = applyActivation(linearForward(layer.W, out, layer.b), layer.act);
  }
  return out;
}

// ---------------------------------------------------------------------------
// Gradient bằng số (numeric gradient) — kiểm chứng đạo hàm/backprop
// ---------------------------------------------------------------------------

/**
 * Ước lượng gradient của f: ℝⁿ → ℝ tại x bằng SAI PHÂN TRUNG TÂM
 * (central difference):  ∂f/∂xᵢ ≈ [f(x + h·eᵢ) − f(x − h·eᵢ)] / (2h).
 * Dùng để kiểm tra công thức gradient giải tích (gradient checking).
 */
export function numericGradient(f: (v: Vec) => number, x: Vec, h = 1e-5): Vec {
  const grad: Vec = new Array(x.length).fill(0);
  for (let i = 0; i < x.length; i++) {
    const xp = x.slice();
    const xm = x.slice();
    xp[i] += h;
    xm[i] -= h;
    grad[i] = (f(xp) - f(xm)) / (2 * h);
  }
  return grad;
}

// ---------------------------------------------------------------------------
// Hồi quy tuyến tính 1 biến — cầu nối Least Squares (ch7/ch8) → học máy
// ---------------------------------------------------------------------------

/** Dự đoán của mô hình hồi quy tuyến tính 1 biến: ŷ = w·x + b. */
export function linRegPredict(x: number, w: number, b: number): number {
  return w * x + b;
}

/**
 * Mất mát MSE của hồi quy tuyến tính trên toàn bộ dữ liệu:
 *   L(w, b) = (1/n) Σ (w·xᵢ + b − yᵢ)².
 * Đây là dạng toàn phương theo (w, b) — có ĐÚNG MỘT cực tiểu (chén lồi).
 */
export function linRegLossMSE(
  xs: number[],
  ys: number[],
  w: number,
  b: number,
): number {
  const n = xs.length;
  if (n === 0) return 0;
  let s = 0;
  for (let i = 0; i < n; i++) {
    const e = linRegPredict(xs[i], w, b) - ys[i];
    s += e * e;
  }
  return s / n;
}

/**
 * MỘT bước gradient descent cho hồi quy tuyến tính.
 * Gradient của L theo (w, b):
 *   ∂L/∂w = (2/n) Σ (ŷᵢ − yᵢ)·xᵢ,   ∂L/∂b = (2/n) Σ (ŷᵢ − yᵢ).
 * Cập nhật ngược hướng gradient:  θ ← θ − lr·∇L.
 */
export function linRegGradStep(
  xs: number[],
  ys: number[],
  w: number,
  b: number,
  lr: number,
): { w: number; b: number } {
  const n = xs.length;
  if (n === 0) return { w, b };
  let gw = 0;
  let gb = 0;
  for (let i = 0; i < n; i++) {
    const e = linRegPredict(xs[i], w, b) - ys[i];
    gw += e * xs[i];
    gb += e;
  }
  gw = (2 / n) * gw;
  gb = (2 / n) * gb;
  return { w: w - lr * gw, b: b - lr * gb };
}
