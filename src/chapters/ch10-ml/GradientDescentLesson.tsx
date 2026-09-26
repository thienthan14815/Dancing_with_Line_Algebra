import { useEffect, useRef, useState } from 'react';
import { Lesson, Section } from '../../components/Lesson';
import MathText from '../../components/MathText';
import Canvas2D, { useCanvas2D } from '../../components/Canvas2D';
import Slider from '../../components/Slider';
import StepByStep from '../../components/StepByStep';
import Quiz from '../../components/Quiz';
import { linRegLossMSE, linRegGradStep } from '../../lib/nn';
import { fitLine, lossQuadForm, contourEllipse, f2, f3 } from './util';
import { Stat, StatRow, Hint, BridgeLA, TwoCol } from './_shared';
import type { Mat } from '../../lib/linalg';
import { useReducedMotion } from '../../components/motion/useReducedMotion';

// Dữ liệu cố định, x đã căn giữa quanh 0 (Σx = 0) cho contour gọn.
const GXS = [-2, -1, 0, 1, 2];
const GYS = [-1.2, -0.4, 0.3, 0.9, 2.0];

const START: [number, number] = [-1.2, 1.6]; // (w, b) khởi đầu
const LEVELS = [0.2, 0.7, 1.6, 3, 5, 7.5]; // các mức đường đồng mức để vẽ
const RANGE = 3.4;
const MAX_STEPS = 60;

// ∇L(w, b) = ((2/n)Σ(ŷ−y)x, (2/n)Σ(ŷ−y)).
function gradMSE(xs: number[], ys: number[], w: number, b: number): [number, number] {
  const n = xs.length;
  let gw = 0;
  let gb = 0;
  for (let i = 0; i < n; i++) {
    const e = w * xs[i] + b - ys[i];
    gw += e * xs[i];
    gb += e;
  }
  return [(2 / n) * gw, (2 / n) * gb];
}

// Vẽ contour ellipse + đường đi của GD trong mặt phẳng tham số (w, b).
function GDPlot({
  M,
  cw,
  cb,
  trail,
}: {
  M: Mat;
  cw: number;
  cb: number;
  trail: [number, number][];
}) {
  const { toScreen } = useCanvas2D();
  const [ow, oh] = toScreen(cw, cb);
  const last = trail[trail.length - 1];
  const [lx, ly] = toScreen(last[0], last[1]);
  const pathPts = trail.map(([x, y]) => toScreen(x, y).join(',')).join(' ');

  return (
    <g>
      {LEVELS.map((L, li) => {
        const poly = contourEllipse(M, cw, cb, L);
        const pts = poly.map(([x, y]) => toScreen(x, y).join(',')).join(' ');
        return (
          <polyline
            key={`c${li}`}
            points={pts}
            fill="none"
            stroke="var(--vec-1)"
            strokeWidth={1.3}
            strokeOpacity={0.5}
          />
        );
      })}

      <polyline points={pathPts} fill="none" stroke="var(--accent)" strokeWidth={2} />
      {trail.map(([x, y], i) => {
        const [sx, sy] = toScreen(x, y);
        return <circle key={`p${i}`} cx={sx} cy={sy} r={2.4} fill="var(--accent-2)" />;
      })}

      {/* Đáy (cực tiểu = nghiệm least squares) */}
      <circle cx={ow} cy={oh} r={6} fill="none" stroke="var(--vec-3)" strokeWidth={2} />
      <text x={ow + 8} y={oh + 4} fill="var(--vec-3)" fontSize={12} fontWeight={600}>
        θ* (đáy)
      </text>

      {/* Vị trí hiện tại */}
      <circle cx={lx} cy={ly} r={5} fill="var(--vec-result)" />
      <text x={lx + 8} y={ly - 8} fill="var(--vec-result)" fontSize={12} fontWeight={600}>
        θ
      </text>
    </g>
  );
}

export default function GradientDescentLesson() {
  const [lr, setLr] = useState(0.15);
  const [trail, setTrail] = useState<[number, number][]>([START]);
  const [running, setRunning] = useState(false);
  const timer = useRef<number | null>(null);
  const reducedMotion = useReducedMotion();

  const opt = fitLine(GXS, GYS); // tâm bát: (w*, b*)
  const M = lossQuadForm(GXS); // dạng toàn phương của mặt loss

  const stop = () => {
    if (timer.current !== null) {
      clearInterval(timer.current);
      timer.current = null;
    }
    setRunning(false);
  };

  const run = () => {
    stop();
    // Resume a paused/manual exploration; only a finished run starts afresh.
    const restart = trail.length - 1 >= MAX_STEPS || diverged;
    const path: [number, number][] = restart
      ? [[...START]]
      : trail.map(([w, b]): [number, number] => [w, b]);
    let [w0, b0] = path[path.length - 1];
    setTrail(path.slice());
    let steps = path.length - 1;
    const curLr = lr;
    const advance = () => {
      const nx = linRegGradStep(GXS, GYS, w0, b0, curLr);
      w0 = nx.w;
      b0 = nx.b;
      steps++;
      path.push([w0, b0]);
      const blew = !isFinite(w0) || !isFinite(b0) || Math.abs(w0) > 200 || Math.abs(b0) > 200;
      return steps >= MAX_STEPS || blew;
    };
    if (reducedMotion) {
      while (!advance()) { /* Compute the same path without timed movement. */ }
      setTrail(path);
      return;
    }
    setRunning(true);
    timer.current = window.setInterval(() => {
      const finished = advance();
      setTrail(path.slice());
      if (finished) stop();
    }, 90);
  };

  const singleStep = () => {
    stop();
    setTrail((path) => {
      const last = path[path.length - 1];
      if (path.length > MAX_STEPS || last.some((n) => !Number.isFinite(n) || Math.abs(n) > 200)) return path;
      const next = linRegGradStep(GXS, GYS, last[0], last[1], lr);
      return [...path, [next.w, next.b]];
    });
  };

  const reset = () => {
    stop();
    setTrail([START]);
  };

  useEffect(() => {
    // A changed speed/preference must never leave the old timer running.
    if (timer.current !== null) clearInterval(timer.current);
    timer.current = null;
    setRunning(false);
    return () => {
      if (timer.current !== null) clearInterval(timer.current);
      timer.current = null;
    };
  }, [lr, reducedMotion]);

  const cur = trail[trail.length - 1];
  const curMSE = linRegLossMSE(GXS, GYS, cur[0], cur[1]);
  const [gw, gb] = gradMSE(GXS, GYS, cur[0], cur[1]);
  const gradNorm = Math.hypot(gw, gb);
  const diverged = !isFinite(curMSE) || Math.abs(cur[0]) > 50 || Math.abs(cur[1]) > 50;

  return (
    <Lesson id="gradient-descent" title="Gradient Descent">
      <p className="muted">
        Không phải hàm mất mát nào cũng có công thức đóng như least squares. Cách <em>vạn năng</em>{' '}
        để tối thiểu hoá là <strong>gradient descent</strong>: đứng trên mặt loss, đo hướng dốc
        nhất, rồi bước ngược lên dốc xuống đáy. Toàn bộ Deep Learning huấn luyện theo ý tưởng này.
      </p>

      <Section kind="explore" title="Thả một viên bi lăn xuống đáy bát">
        <p className="muted" style={{ marginTop: 0 }}>
          Đây là mặt loss <MathText tex={'L(w, b)'} /> nhìn từ trên xuống: mỗi vòng{' '}
          <span style={{ color: 'var(--vec-1)' }}>ellipse</span> là một mức mất mát, tâm{' '}
          <span style={{ color: 'var(--vec-3)' }}>θ*</span> là đáy. Bấm <strong>Chạy GD</strong> để
          điểm <span style={{ color: 'var(--vec-result)' }}>θ</span> lăn xuống. Chỉnh{' '}
          <strong>learning rate</strong> rồi chạy lại — quá lớn thì nó nhảy vọt và{' '}
          <strong>phân kỳ</strong>.
        </p>

        <TwoCol>
          <Canvas2D height={400} range={RANGE} showGrid showAxes>
            <GDPlot M={M} cw={opt.w} cb={opt.b} trail={trail} />
          </Canvas2D>

          <div>
            <div className="panel">
              <Slider
                label="learning rate (lr)"
                min={0.02}
                max={0.7}
                step={0.01}
                value={lr}
                onChange={setLr}
              />
              <div className="row" style={{ gap: 8, marginTop: 10 }}>
                <button className="btn" onClick={run} disabled={running}>
                  {reducedMotion ? 'Xem kết quả GD' : '▶ Chạy GD'}
                </button>
                <button type="button" className="btn" onClick={singleStep} disabled={trail.length > MAX_STEPS || diverged}>
                  Tiến 1 bước
                </button>
                {running && <button type="button" className="btn" onClick={stop}>⏸ Dừng</button>}
                <button className="btn" onClick={reset}>
                  ↺ Reset
                </button>
              </div>
              <p className="dim" style={{ fontSize: 12.5, marginTop: 10, marginBottom: 0 }}>
                Ngưỡng ổn định của dữ liệu này: <MathText tex={'\\text{lr} < 2/\\lambda_{\\max} = 0.5'} />.
                Thử <MathText tex={'\\text{lr} = 0.6'} /> để thấy nó văng khỏi bát.
              </p>
            </div>

            <StatRow>
              <Stat label="θ = (w, b)" value={<>({f2(cur[0])}, {f2(cur[1])})</>} color="var(--vec-result)" />
              <Stat label="MSE" value={diverged ? '∞ 💥' : f3(curMSE)} color="var(--vec-2)" />
              <Stat label="‖∇L‖" value={diverged ? '∞' : f3(gradNorm)} color="var(--accent)" />
            </StatRow>

            {diverged ? (
              <p style={{ color: 'var(--warn)', fontWeight: 600, fontSize: 13.5 }}>
                ⚠ Phân kỳ! Learning rate quá lớn khiến mỗi bước nhảy qua đáy và ngày càng xa. Giảm lr
                rồi Reset.
              </p>
            ) : (
              <Hint>
                Gần đáy, gradient <MathText tex={'\\nabla L'} /> co nhỏ dần (<MathText tex={'\\|\\nabla L\\|\\to 0'} />)
                nên các bước tự động ngắn lại — GD "phanh" một cách tự nhiên.
              </Hint>
            )}
          </div>
        </TwoCol>
      </Section>

      <Section kind="theory" title="Gradient chỉ hướng dốc — ta đi ngược lại">
        <p style={{ marginTop: 0 }}>
          Gradient <MathText tex={'\\nabla L = (\\partial L/\\partial w,\\ \\partial L/\\partial b)'} />{' '}
          là vector chỉ theo hướng <strong>tăng nhanh nhất</strong> của <MathText tex={'L'} />. Muốn{' '}
          <em>giảm</em>, ta bước ngược lại nó, với độ dài bước tỉ lệ learning rate{' '}
          <MathText tex={'\\eta'} />:
        </p>
        <MathText block tex={'\\theta \\leftarrow \\theta - \\eta\\,\\nabla L(\\theta), \\qquad \\theta = (w, b).'} />
        <p>Với MSE của hồi quy tuyến tính, gradient có công thức gọn:</p>
        <MathText block tex={'\\frac{\\partial L}{\\partial w} = \\frac{2}{n}\\sum_i (\\hat{y}_i - y_i)\\,x_i, \\qquad \\frac{\\partial L}{\\partial b} = \\frac{2}{n}\\sum_i (\\hat{y}_i - y_i).'} />
        <p>
          <strong>Learning rate</strong> là con dao hai lưỡi: quá nhỏ ⇒ bò chậm; quá lớn ⇒ nhảy qua
          đáy, dao động rồi phân kỳ. Có một ngưỡng rõ ràng — và nó đến từ đại số tuyến tính.
        </p>

        <BridgeLA>
          <ul style={{ margin: '4px 0 0', paddingLeft: 20 }}>
            <li>
              <strong>Mặt lồi = dạng toàn phương (Ch.9).</strong> <MathText tex={'L'} /> là hàm bậc
              hai theo <MathText tex={'\\theta'} /> nên gradient tuyến tính:{' '}
              <MathText tex={'\\nabla L(\\theta) = H(\\theta - \\theta^*)'} /> với Hessian{' '}
              <MathText tex={'H = \\frac{2}{n}X^{\\top}X'} /> đối xứng xác định dương. Một bát duy
              nhất ⇒ GD không bao giờ kẹt ở cực tiểu địa phương.
            </li>
            <li>
              <strong>Eigenvalue định đoạt bước chạy (Ch.5).</strong> Sai số{' '}
              <MathText tex={'e = \\theta - \\theta^*'} /> tiến hoá theo{' '}
              <MathText tex={'e \\leftarrow (I - \\eta H)\\,e'} />. GD hội tụ khi và chỉ khi{' '}
              <MathText tex={'|1 - \\eta\\lambda_i| < 1'} /> cho mọi eigenvalue{' '}
              <MathText tex={'\\lambda_i'} /> của <MathText tex={'H'} />, tức{' '}
              <MathText tex={'\\eta < 2/\\lambda_{\\max}'} />. Đó chính là con số 0.5 ở phần Khám phá.
            </li>
            <li>
              <strong>Ellipse méo = hội tụ chậm.</strong> Tỉ số{' '}
              <MathText tex={'\\lambda_{\\max}/\\lambda_{\\min}'} /> (số điều kiện) càng lớn, bát càng
              dẹt, GD càng zig-zag — lý do người ta chuẩn hoá dữ liệu.
            </li>
          </ul>
        </BridgeLA>
      </Section>

      <Section kind="steps" title="Một bước gradient descent bằng số">
        <StepByStep
          steps={[
            {
              title: 'Đề bài',
              content: (
                <p className="muted">
                  Hai điểm <MathText tex={'(1,1),\\ (2,2)'} />, khởi đầu{' '}
                  <MathText tex={'w = 0,\\ b = 0'} />, learning rate <MathText tex={'\\eta = 0.1'} />.
                  Thực hiện <strong>một</strong> bước GD.
                </p>
              ),
            },
            {
              title: 'Bước 1 — Dự đoán & sai số',
              content: (
                <div>
                  <MathText block tex={'\\hat{y}_1 = 0,\\ \\hat{y}_2 = 0 \\;\\Rightarrow\\; r_1 = 0 - 1 = -1,\\ r_2 = 0 - 2 = -2.'} />
                </div>
              ),
            },
            {
              title: 'Bước 2 — Gradient',
              content: (
                <div>
                  <MathText block tex={'\\frac{\\partial L}{\\partial w} = \\frac{2}{2}\\big[(-1)(1) + (-2)(2)\\big] = -5,'} />
                  <MathText block tex={'\\frac{\\partial L}{\\partial b} = \\frac{2}{2}\\big[(-1) + (-2)\\big] = -3.'} />
                </div>
              ),
            },
            {
              title: 'Bước 3 — Cập nhật θ ← θ − η∇L',
              content: (
                <div>
                  <MathText block tex={'w \\leftarrow 0 - 0.1\\cdot(-5) = 0.5,'} />
                  <MathText block tex={'b \\leftarrow 0 - 0.1\\cdot(-3) = 0.3.'} />
                  <p className="muted">
                    Gradient âm (đường đang nằm dưới dữ liệu) ⇒ cả <MathText tex={'w'} /> và{' '}
                    <MathText tex={'b'} /> được kéo lên — hợp lý. Lặp lại nhiều lần, θ trườn tới đáy.
                  </p>
                </div>
              ),
            },
          ]}
        />
      </Section>

      <Section kind="quiz" title="Kiểm tra hiểu">
        <Quiz
          lessonKey="ch10/gradient-descent"
          questions={[
            {
              q: <>Vector gradient <MathText tex={'\\nabla L'} /> tại một điểm chỉ theo hướng nào?</>,
              options: [
                <>Hướng <MathText tex={'L'} /> <strong>tăng</strong> nhanh nhất — nên ta đi ngược lại để giảm</>,
                <>Hướng <MathText tex={'L'} /> giảm nhanh nhất</>,
                <>Luôn chỉ về gốc tọa độ</>,
                <>Song song với trục hoành</>,
              ],
              answer: 0,
              explain: (
                <>
                  Gradient chỉ hướng tăng nhanh nhất; gradient <em>descent</em> bước theo{' '}
                  <MathText tex={'-\\nabla L'} /> để hạ mất mát.
                </>
              ),
            },
            {
              q: <>Quy tắc cập nhật của gradient descent là gì?</>,
              options: [
                <><MathText tex={'\\theta \\leftarrow \\theta + \\eta\\,\\nabla L'} /></>,
                <><MathText tex={'\\theta \\leftarrow \\theta - \\eta\\,\\nabla L'} /></>,
                <><MathText tex={'\\theta \\leftarrow \\eta\\,\\theta'} /></>,
                <><MathText tex={'\\theta \\leftarrow \\nabla L - \\eta\\,\\theta'} /></>,
              ],
              answer: 1,
              explain: (
                <>
                  Trừ đi một bội của gradient: <MathText tex={'\\theta \\leftarrow \\theta - \\eta\\nabla L'} />.
                  Dấu cộng sẽ leo <em>lên</em> dốc, làm loss tăng.
                </>
              ),
            },
            {
              q: <>Đặt learning rate quá lớn thường gây ra điều gì?</>,
              options: [
                <>Hội tụ nhanh hơn mà không có nhược điểm</>,
                <>Bước nhảy vọt qua đáy, dao động rồi <strong>phân kỳ</strong> (loss tăng vô hạn)</>,
                <>Gradient trở thành 0</>,
                <>Mặt loss đổi thành yên ngựa</>,
              ],
              answer: 1,
              explain: (
                <>
                  Khi <MathText tex={'\\eta > 2/\\lambda_{\\max}'} /> thì <MathText tex={'|1-\\eta\\lambda|>1'} />,
                  sai số bị KHUẾCH ĐẠI mỗi bước ⇒ văng khỏi bát.
                </>
              ),
            },
            {
              q: <>Vì sao với hồi quy tuyến tính, GD chắc chắn tìm được cực tiểu toàn cục (nếu lr hợp lý)?</>,
              options: [
                <>Vì <MathText tex={'L'} /> lồi (dạng toàn phương, Hessian xác định dương) — chỉ có <strong>một</strong> đáy, không có bẫy cực tiểu địa phương</>,
                <>Vì gradient luôn bằng 0</>,
                <>Vì dữ liệu luôn thẳng hàng</>,
                <>Vì learning rate tự động bằng 0</>,
              ],
              answer: 0,
              explain: (
                <>
                  Hessian <MathText tex={'\\frac{2}{n}X^{\\top}X'} /> xác định dương ⇒ mặt loss là bát
                  lồi với đúng một cực tiểu (Ch.9). Mạng nơ-ron sâu thì mất tính chất này.
                </>
              ),
            },
          ]}
        />
      </Section>
    </Lesson>
  );
}
