import { describe, it, expect } from 'vitest';
import {
  sigmoid,
  relu,
  tanhAct,
  applyActivation,
  softmax,
  mse,
  crossEntropy,
  linearForward,
  mlpForward,
  numericGradient,
  linRegPredict,
  linRegLossMSE,
  linRegGradStep,
  type Layer,
} from './nn';

describe('activation functions', () => {
  it('sigmoid(0) = 0.5 và bị chặn trong (0,1)', () => {
    expect(sigmoid(0)).toBeCloseTo(0.5, 12);
    expect(sigmoid(100)).toBeGreaterThan(0.999);
    expect(sigmoid(-100)).toBeLessThan(0.001);
    expect(sigmoid(1)).toBeCloseTo(0.7310585786, 8);
  });

  it('relu cắt phần âm về 0, giữ phần dương', () => {
    expect(relu(-3)).toBe(0);
    expect(relu(0)).toBe(0);
    expect(relu(2.5)).toBe(2.5);
  });

  it('tanh(0) = 0, lẻ và bị chặn trong (-1,1)', () => {
    expect(tanhAct(0)).toBeCloseTo(0, 12);
    expect(tanhAct(1)).toBeCloseTo(0.761594155956, 9);
    expect(tanhAct(-1)).toBeCloseTo(-0.761594155956, 9);
  });

  it('applyActivation áp element-wise', () => {
    expect(applyActivation([-1, 0, 2], 'relu')).toEqual([0, 0, 2]);
    expect(applyActivation([-1, 0, 2], 'none')).toEqual([-1, 0, 2]);
    const s = applyActivation([0], 'sigmoid');
    expect(s[0]).toBeCloseTo(0.5, 12);
  });
});

describe('softmax', () => {
  it('tổng các xác suất = 1', () => {
    const p = softmax([1, 2, 3]);
    const sum = p.reduce((a, b) => a + b, 0);
    expect(sum).toBeCloseTo(1, 12);
    expect(p.every((x) => x > 0)).toBe(true);
  });

  it('đầu vào đều nhau → phân phối đều', () => {
    const p = softmax([0, 0, 0]);
    expect(p).toHaveLength(3);
    for (const x of p) expect(x).toBeCloseTo(1 / 3, 12);
  });

  it('logit lớn hơn → xác suất lớn hơn (giữ thứ tự)', () => {
    const p = softmax([1, 2, 3]);
    expect(p[2]).toBeGreaterThan(p[1]);
    expect(p[1]).toBeGreaterThan(p[0]);
  });

  it('ổn định số học với giá trị rất lớn (không NaN/Infinity)', () => {
    const p = softmax([1000, 1000, 1000]);
    expect(p.every((x) => Number.isFinite(x))).toBe(true);
    for (const x of p) expect(x).toBeCloseTo(1 / 3, 12);
  });
});

describe('loss functions', () => {
  it('mse tính đúng giá trị biết trước', () => {
    // diffs = [0,0,3] → squares [0,0,9] → mean = 3
    expect(mse([1, 2, 3], [1, 2, 0])).toBeCloseTo(3, 12);
    expect(mse([1, 2, 3], [1, 2, 3])).toBe(0);
  });

  it('crossEntropy = 0 khi dự đoán hoàn hảo, dương khi sai', () => {
    expect(crossEntropy([1, 0, 0], 0)).toBeCloseTo(0, 6);
    expect(crossEntropy([0.7, 0.2, 0.1], 0)).toBeCloseTo(0.356674943939, 9);
    // Chọn lớp có xác suất thấp → mất mát lớn hơn
    expect(crossEntropy([0.7, 0.2, 0.1], 2)).toBeGreaterThan(
      crossEntropy([0.7, 0.2, 0.1], 0),
    );
  });
});

describe('forward pass (LA áp dụng)', () => {
  it('linearForward = Wx + b', () => {
    const W = [
      [1, 2],
      [3, 4],
    ];
    expect(linearForward(W, [1, 1], [0, 0])).toEqual([3, 7]);
    const I = [
      [1, 0],
      [0, 1],
    ];
    expect(linearForward(I, [2, 3], [1, 1])).toEqual([3, 4]);
  });

  it('mlpForward xâu chuỗi các lớp với activation', () => {
    const I: number[][] = [
      [1, 0],
      [0, 1],
    ];
    const layers: Layer[] = [{ W: I, b: [0, 0], act: 'relu' }];
    // relu áp lên [-1, 2] → [0, 2]
    expect(mlpForward([-1, 2], layers)).toEqual([0, 2]);

    // Hai lớp: lớp 1 (none) rồi lớp 2 (none) với W2 = 2I → nhân đôi
    const twoLayer: Layer[] = [
      { W: I, b: [1, 1], act: 'none' },
      {
        W: [
          [2, 0],
          [0, 2],
        ],
        b: [0, 0],
        act: 'none',
      },
    ];
    // x=[1,2] → [2,3] → [4,6]
    expect(mlpForward([1, 2], twoLayer)).toEqual([4, 6]);
  });
});

describe('numericGradient', () => {
  it('gradient của f(x)=x0²+x1² tại (3,4) ≈ (6,8)', () => {
    const f = (v: number[]) => v[0] * v[0] + v[1] * v[1];
    const g = numericGradient(f, [3, 4]);
    expect(g[0]).toBeCloseTo(6, 4);
    expect(g[1]).toBeCloseTo(8, 4);
  });

  it('khớp gradient giải tích cho hàm tuyến tính', () => {
    // f = 2x0 + 5x1 → grad = (2, 5) khắp nơi
    const f = (v: number[]) => 2 * v[0] + 5 * v[1];
    const g = numericGradient(f, [-1, 7]);
    expect(g[0]).toBeCloseTo(2, 5);
    expect(g[1]).toBeCloseTo(5, 5);
  });
});

describe('linear regression + gradient descent', () => {
  it('linRegPredict = w·x + b', () => {
    expect(linRegPredict(2, 3, 1)).toBe(7);
    expect(linRegPredict(0, 3, 1)).toBe(1);
  });

  it('linRegLossMSE = 0 khi khớp hoàn hảo', () => {
    // y = 2x, w=2 b=0 → loss = 0
    expect(linRegLossMSE([1, 2, 3], [2, 4, 6], 2, 0)).toBeCloseTo(0, 12);
  });

  it('một bước gradient descent làm GIẢM mất mát', () => {
    const xs = [1, 2, 3, 4];
    const ys = [2, 4, 6, 8]; // y = 2x
    const w0 = 0;
    const b0 = 0;
    const lr = 0.01;
    const before = linRegLossMSE(xs, ys, w0, b0);
    const step = linRegGradStep(xs, ys, w0, b0, lr);
    const after = linRegLossMSE(xs, ys, step.w, step.b);
    expect(after).toBeLessThan(before);
  });

  it('nhiều bước GD hội tụ về nghiệm đúng (w→2, b→0)', () => {
    const xs = [1, 2, 3, 4];
    const ys = [2, 4, 6, 8];
    let w = 0;
    let b = 0;
    for (let i = 0; i < 5000; i++) {
      const s = linRegGradStep(xs, ys, w, b, 0.01);
      w = s.w;
      b = s.b;
    }
    expect(w).toBeCloseTo(2, 1);
    expect(b).toBeCloseTo(0, 1);
  });
});
