import { useEffect, useMemo, useState, type ReactNode } from 'react';
import { Lesson, Section } from '../../components/Lesson';
import MathText from '../../components/MathText';
import Canvas2D, { useCanvas2D } from '../../components/Canvas2D';
import Slider from '../../components/Slider';
import StepByStep from '../../components/StepByStep';
import Quiz from '../../components/Quiz';
import { f2, Stat, StatRow, Hint, TwoCol, Bridge, LegendDot } from './_shared';

// ---------------------------------------------------------------------------
// Mặt loss dạng "thung lũng hẹp": L(x,y) = ½(A·x² + B·y²)
// A ≫ B ⇒ dốc đứng theo x (thành thung lũng), thoải theo y (đáy thung lũng).
// Đây là một dạng TOÀN PHƯƠNG (ch9) với Hessian = diag(A, B): eigenvalue A và B
// chênh lệch lớn ⇒ ma trận ĐIỀU KIỆN XẤU (ill-conditioned).
// ---------------------------------------------------------------------------
const A = 6;
const B = 0.4;
const START: [number, number] = [2.4, 3.6];
const STEPS = 48;
const RANGE = 4.5;

const COL_GD = '#f97316'; // cam
const COL_MOM = '#4f9cf9'; // xanh
const COL_ADAM = '#22c55e'; // lục

type P = [number, number];

function grad(p: P): P {
  return [A * p[0], B * p[1]];
}
function lossAt(p: P): number {
  return 0.5 * (A * p[0] * p[0] + B * p[1] * p[1]);
}
function diverged(p: P): boolean {
  return !Number.isFinite(p[0]) || !Number.isFinite(p[1]) || Math.abs(p[0]) > 60 || Math.abs(p[1]) > 60;
}

/** Gradient Descent thuần: θ ← θ − lr·∇L. */
function gdTraj(lr: number): P[] {
  const pts: P[] = [[...START]];
  let p: P = [...START];
  for (let i = 0; i < STEPS; i++) {
    const g = grad(p);
    p = [p[0] - lr * g[0], p[1] - lr * g[1]];
    pts.push([p[0], p[1]]);
    if (diverged(p)) break;
  }
  return pts;
}

/** Momentum: v ← β·v + ∇L ; θ ← θ − lr·v (quán tính tích lũy theo hướng bền). */
function momentumTraj(lr: number, beta = 0.9): P[] {
  const pts: P[] = [[...START]];
  let p: P = [...START];
  let v: P = [0, 0];
  for (let i = 0; i < STEPS; i++) {
    const g = grad(p);
    v = [beta * v[0] + g[0], beta * v[1] + g[1]];
    p = [p[0] - lr * v[0], p[1] - lr * v[1]];
    pts.push([p[0], p[1]]);
    if (diverged(p)) break;
  }
  return pts;
}

/** Adam: EMA của gradient (m) và của bình phương gradient (v) ⇒ lr thích nghi TỪNG chiều. */
function adamTraj(lr: number, b1 = 0.9, b2 = 0.999, eps = 1e-8): P[] {
  const pts: P[] = [[...START]];
  let p: P = [...START];
  let m: P = [0, 0];
  let v: P = [0, 0];
  for (let t = 1; t <= STEPS; t++) {
    const g = grad(p);
    m = [b1 * m[0] + (1 - b1) * g[0], b1 * m[1] + (1 - b1) * g[1]];
    v = [b2 * v[0] + (1 - b2) * g[0] * g[0], b2 * v[1] + (1 - b2) * g[1] * g[1]];
    const bc1 = 1 - Math.pow(b1, t);
    const bc2 = 1 - Math.pow(b2, t);
    const mh: P = [m[0] / bc1, m[1] / bc1];
    const vh: P = [v[0] / bc2, v[1] / bc2];
    p = [p[0] - (lr * mh[0]) / (Math.sqrt(vh[0]) + eps), p[1] - (lr * mh[1]) / (Math.sqrt(vh[1]) + eps)];
    pts.push([p[0], p[1]]);
    if (diverged(p)) break;
  }
  return pts;
}

// --- Con: các đường mức (ellipse) của L, vẽ trong toạ độ world ---------------
function Contours({ levels }: { levels: number[] }) {
  const { toScreen } = useCanvas2D();
  const out: ReactNode[] = [];
  levels.forEach((L, li) => {
    const ax = Math.sqrt((2 * L) / A);
    const ay = Math.sqrt((2 * L) / B);
    const pts: string[] = [];
    for (let k = 0; k <= 72; k++) {
      const t = (k / 72) * 2 * Math.PI;
      const [sx, sy] = toScreen(ax * Math.cos(t), ay * Math.sin(t));
      pts.push(`${sx},${sy}`);
    }
    out.push(
      <polyline
        key={li}
        points={pts.join(' ')}
        fill="none"
        stroke="var(--accent-2)"
        strokeWidth={1}
        strokeOpacity={0.45}
      />
    );
  });
  return <g>{out}</g>;
}

// --- Con: một quỹ đạo optimizer (đường mờ toàn bộ + phần đã đi + đầu quỹ đạo) -
function Trajectory({
  pts,
  upto,
  color,
  label,
}: {
  pts: P[];
  upto: number;
  color: string;
  label: string;
}) {
  const { toScreen } = useCanvas2D();
  const n = Math.min(upto, pts.length - 1);
  const shown = pts.slice(0, n + 1);
  const polyShown = shown.map(([x, y]) => toScreen(x, y).join(',')).join(' ');
  const polyFull = pts.map(([x, y]) => toScreen(x, y).join(',')).join(' ');
  const head = shown[shown.length - 1];
  const [hx, hy] = toScreen(head[0], head[1]);
  return (
    <g>
      <polyline points={polyFull} fill="none" stroke={color} strokeWidth={1} strokeOpacity={0.18} />
      <polyline points={polyShown} fill="none" stroke={color} strokeWidth={2.4} strokeOpacity={0.95} />
      <circle cx={hx} cy={hy} r={5} fill={color} />
      <text x={hx + 7} y={hy - 7} fill={color} fontSize={12} fontWeight={700}>
        {label}
      </text>
    </g>
  );
}

export default function OptimizersLesson() {
  const [lr, setLr] = useState(0.15);
  const [step, setStep] = useState(STEPS);
  const [running, setRunning] = useState(false);

  const traj = useMemo(
    () => ({ gd: gdTraj(lr), mom: momentumTraj(lr), adam: adamTraj(lr) }),
    [lr]
  );
  const maxLen = Math.max(traj.gd.length, traj.mom.length, traj.adam.length);

  // Đổi learning rate ⇒ tính lại quỹ đạo, đưa về đầu.
  useEffect(() => {
    setStep(0);
    setRunning(false);
  }, [lr]);

  // Chạy hoạt ảnh: mỗi nhịp tiến 1 bước.
  useEffect(() => {
    if (!running) return;
    const id = window.setInterval(() => {
      setStep((s) => (s >= maxLen - 1 ? s : s + 1));
    }, 130);
    return () => window.clearInterval(id);
  }, [running, maxLen]);

  useEffect(() => {
    if (step >= maxLen - 1) setRunning(false);
  }, [step, maxLen]);

  const at = (pts: P[]): P => pts[Math.min(step, pts.length - 1)];
  const gdNow = at(traj.gd);
  const momNow = at(traj.mom);
  const adamNow = at(traj.adam);

  const points = [
    { x: 0, y: 0, color: 'var(--vec-result)', label: 'min' },
    { x: START[0], y: START[1], color: 'var(--text-muted)', label: 'start' },
  ];

  // ---- Ví dụ số cho phần "Từng bước": momentum trên L = ½x², g = x ----------
  const momentumSteps = [
    {
      title: 'Điểm xuất phát',
      content: (
        <p>
          Xét bài toán 1 chiều <MathText tex="L(\theta)=\tfrac12\theta^2" />, nên gradient{' '}
          <MathText tex="g=\theta" />. Bắt đầu tại <MathText tex="\theta_0=5" />, vận tốc{' '}
          <MathText tex="v_0=0" />, với <MathText tex="\beta=0.9" /> và{' '}
          <MathText tex="\text{lr}=0.1" />.
        </p>
      ),
    },
    {
      title: 'Bước 1 — tích vận tốc',
      content: (
        <>
          <p>
            Gradient tại đó: <MathText tex="g_0=\theta_0=5" />. Cập nhật vận tốc rồi cập nhật tham số:
          </p>
          <MathText block tex="v_1=\beta v_0 + g_0 = 0.9\cdot 0 + 5 = 5" />
          <MathText block tex="\theta_1=\theta_0 - \text{lr}\cdot v_1 = 5 - 0.1\cdot 5 = 4.5" />
        </>
      ),
    },
    {
      title: 'Bước 2 — quán tính lớn dần',
      content: (
        <>
          <p>
            Gradient <MathText tex="g_1=4.5" />. Dù gradient NHỎ đi, vận tốc vẫn TĂNG vì cộng dồn hướng cũ:
          </p>
          <MathText block tex="v_2=0.9\cdot 5 + 4.5 = 9.0" />
          <MathText block tex="\theta_2=4.5 - 0.1\cdot 9.0 = 3.6" />
        </>
      ),
    },
    {
      title: 'Bước 3 — vượt nhanh hơn GD',
      content: (
        <>
          <p>
            <MathText tex="g_2=3.6" /> ⇒ <MathText tex="v_3=0.9\cdot 9 + 3.6 = 11.7" />,{' '}
            <MathText tex="\theta_3 = 3.6 - 1.17 = 2.43" />.
          </p>
          <p className="dim" style={{ fontSize: 13 }}>
            So sánh: GD thuần sau 3 bước mới tới <MathText tex="0.9^3\cdot 5 = 3.645" />. Vận tốc dồn
            (5 → 9 → 11.7) giúp momentum ĐI XA HƠN mỗi bước — chính là "quán tính".
          </p>
        </>
      ),
    },
  ];

  return (
    <Lesson id="optimizers" title="SGD, Momentum, Adam">
      <Section kind="explore" title="Ba optimizer đua nhau xuống thung lũng">
        <TwoCol>
          <div>
            <Canvas2D height={380} range={RANGE} showGrid={false} showAxes points={points}>
              <Contours levels={[0.25, 0.8, 1.8, 3.2, 4.2]} />
              <Trajectory pts={traj.gd} upto={step} color={COL_GD} label="GD" />
              <Trajectory pts={traj.mom} upto={step} color={COL_MOM} label="Momentum" />
              <Trajectory pts={traj.adam} upto={step} color={COL_ADAM} label="Adam" />
            </Canvas2D>
            <div style={{ marginTop: 6 }}>
              <LegendDot color={COL_GD}>GD (θ ← θ − lr·∇)</LegendDot>
              <LegendDot color={COL_MOM}>Momentum (β = 0.9)</LegendDot>
              <LegendDot color={COL_ADAM}>Adam</LegendDot>
            </div>
          </div>

          <div>
            <div className="dim" style={{ fontSize: 12, marginBottom: 6 }}>
              Mặt loss <MathText tex="L(x,y)=\tfrac12(6x^2 + 0.4\,y^2)" /> — một{' '}
              <b>thung lũng hẹp</b>: dốc đứng theo <MathText tex="x" />, thoải theo{' '}
              <MathText tex="y" />.
            </div>
            <Slider
              label="learning rate (lr)"
              min={0.02}
              max={0.36}
              step={0.01}
              value={lr}
              onChange={setLr}
              format={(n) => f2(n)}
            />
            <Slider
              label="bước (step)"
              min={0}
              max={maxLen - 1}
              step={1}
              value={step}
              onChange={(n) => {
                setRunning(false);
                setStep(Math.round(n));
              }}
              format={(n) => `${Math.round(n)} / ${maxLen - 1}`}
            />
            <div className="row" style={{ gap: 8, marginTop: 8 }}>
              <button className="btn btn-primary" onClick={() => setRunning((r) => !r)}>
                {running ? '⏸ Dừng' : '▶ Chạy'}
              </button>
              <button
                className="btn"
                onClick={() => {
                  setRunning(false);
                  setStep(0);
                }}
              >
                ↺ Lại từ đầu
              </button>
            </div>
            <StatRow>
              <Stat label="loss GD" value={f2(lossAt(gdNow))} color={COL_GD} />
              <Stat label="loss Momentum" value={f2(lossAt(momNow))} color={COL_MOM} />
              <Stat label="loss Adam" value={f2(lossAt(adamNow))} color={COL_ADAM} />
            </StatRow>
          </div>
        </TwoCol>
        <Hint>
          Ở <b>lr nhỏ</b>, GD lao nhanh xuống đáy theo phương dốc <MathText tex="x" /> rồi{' '}
          <b>bò rất chậm</b> dọc đáy thoải <MathText tex="y" />; Momentum tích quán tính nên{' '}
          <b>lướt dọc đáy nhanh hơn hẳn</b>; Adam co giãn bước theo từng chiều nên đi khá thẳng.
          Kéo lr lớn dần (≥ 0.30) sẽ thấy GD/Momentum <b>nảy qua nảy lại rồi phân kỳ</b> — bay khỏi màn hình.
        </Hint>
      </Section>

      <Section kind="theory" title="SGD, Momentum, Adam — ba cách bước xuống dốc">
        <p>
          Mọi optimizer đều lặp một việc: đứng tại <MathText tex="\theta" />, tính gradient của hàm mất mát
          rồi <b>bước ngược hướng gradient</b> để giảm loss. Chúng khác nhau ở <i>cách quyết định bước</i>.
        </p>
        <ul>
          <li>
            <b>SGD (Stochastic Gradient Descent):</b> mỗi bước chỉ ước lượng gradient trên MỘT{' '}
            <i>minibatch</i> nhỏ thay vì toàn bộ dữ liệu. Ước lượng "nhiễu" nhưng rẻ và cập nhật rất nhiều lần:
            <MathText tex="\;\theta \leftarrow \theta - \text{lr}\cdot g" />.
          </li>
          <li>
            <b>Momentum:</b> giữ một "vận tốc" <MathText tex="v" /> là trung bình trượt của các gradient,
            rồi bước theo <MathText tex="v" />: <MathText tex="\,v \leftarrow \beta v + g,\ \theta \leftarrow \theta - \text{lr}\cdot v" />.
            Quán tính này DẬP dao động ngang và TĂNG tốc theo hướng bền vững (đáy thung lũng).
          </li>
          <li>
            <b>Adam:</b> giữ thêm trung bình trượt của <i>bình phương</i> gradient để ước lượng độ lớn
            gradient TỪNG chiều, rồi chia bước cho căn của nó ⇒ mỗi tọa độ có{' '}
            <b>learning rate thích nghi riêng</b>. Chiều dốc bị "hãm" lại, chiều thoải được "đẩy" mạnh hơn.
          </li>
        </ul>
        <MathText
          block
          tex="m \leftarrow \beta_1 m + (1-\beta_1)g,\quad v \leftarrow \beta_2 v + (1-\beta_2)g^2,\quad \theta \leftarrow \theta - \text{lr}\,\frac{\hat m}{\sqrt{\hat v}+\epsilon}"
        />
        <p>
          <b>Learning rate schedule:</b> lr không nhất thiết cố định. Thường ta <i>giảm dần</i> lr theo thời
          gian (ví dụ giảm theo bậc thang, hoặc cosine) — bước lớn lúc đầu để đi nhanh, bước nhỏ về sau để
          "đậu" êm vào cực tiểu mà không nảy.
        </p>
        <Bridge>
          <p style={{ marginTop: 0 }}>
            Hướng đi mỗi bước chính là <b>gradient</b> — vector chỉ hướng <i>dốc nhất</i> của mặt loss. Với
            hàm mất mát bình phương, mặt loss là một <b>dạng toàn phương</b>{' '}
            <MathText tex="L=\tfrac12\,\theta^\top H\theta" /> (ch9), và độ cong của nó là ma trận{' '}
            <b>Hessian</b> <MathText tex="H" />.
          </p>
          <p style={{ marginBottom: 0 }}>
            "Thung lũng hẹp" chính là <b>Hessian điều kiện xấu</b>: các <b>eigenvalue</b> của{' '}
            <MathText tex="H" /> chênh lệch rất lớn (ở đây 6 so với 0.4 — ch5). Eigenvector ứng với
            eigenvalue lớn là hướng dốc đứng; ứng với eigenvalue nhỏ là đáy thoải. GD bị kẹt vì một lr
            phải phục vụ cả hai; Momentum và Adam ra đời để <b>bù cho điều kiện xấu</b> đó.
          </p>
        </Bridge>
      </Section>

      <Section kind="steps" title="Một bước Momentum, tính bằng tay">
        <StepByStep steps={momentumSteps} />
        <p className="dim" style={{ fontSize: 13, marginTop: 10 }}>
          Vận tốc <MathText tex="v" /> là bộ nhớ của quá khứ: <MathText tex="v=\sum \beta^{k} g_{t-k}" /> —
          một tổng có trọng số mũ của các gradient trước đó (giống trung bình trượt EMA).
        </p>
      </Section>

      <Section kind="quiz" title="Kiểm tra hiểu">
        <Quiz
          lessonKey="ch13/optimizers"
          questions={[
            {
              q: (
                <>
                  Với momentum <MathText tex="v \leftarrow \beta v + g" />, cho{' '}
                  <MathText tex="v=1.0,\ \beta=0.9,\ g=0.5" />. Vận tốc mới <MathText tex="v" /> bằng?
                </>
              ),
              options: ['0.5', '1.4', '1.5', '0.95'],
              answer: 1,
              explain: (
                <>
                  <MathText tex="v = 0.9\cdot 1.0 + 0.5 = 0.9 + 0.5 = 1.4" />. Vận tốc cộng dồn hướng cũ nên
                  lớn hơn gradient hiện tại.
                </>
              ),
            },
            {
              q: <>Chữ "S" trong SGD (Stochastic) chỉ điều gì?</>,
              options: [
                'Gradient được tính trên TOÀN BỘ tập dữ liệu mỗi bước',
                'Gradient được ước lượng trên một minibatch ngẫu nhiên nhỏ',
                'Learning rate luôn cố định',
                'Chỉ dùng cho bài toán phân loại',
              ],
              answer: 1,
              explain: (
                <>
                  "Stochastic" = ngẫu nhiên: mỗi bước lấy một minibatch nhỏ để ước lượng gradient — rẻ và cập
                  nhật rất nhiều lần, dù nhiễu hơn full-batch.
                </>
              ),
            },
            {
              q: <>Trong "thung lũng hẹp", vì sao GD thuần thường chậm?</>,
              options: [
                'Vì gradient bằng 0 ở khắp nơi',
                'Vì một learning rate phải phục vụ cả hướng dốc đứng lẫn hướng đáy thoải — nhỏ thì đáy bò chậm, lớn thì thành dốc nảy/phân kỳ',
                'Vì GD không dùng gradient',
                'Vì thung lũng không có cực tiểu',
              ],
              answer: 1,
              explain: (
                <>
                  Thung lũng hẹp ⇔ Hessian điều kiện xấu (eigenvalue chênh lệch lớn). Một lr chung khó tối ưu
                  cho cả hai hướng; đó là lý do Momentum và Adam hữu ích.
                </>
              ),
            },
            {
              q: <>Điểm mấu chốt khiến Adam khác Momentum là gì?</>,
              options: [
                'Adam không dùng gradient',
                'Adam dùng learning rate thích nghi RIÊNG cho từng chiều, dựa trên trung bình trượt của bình phương gradient',
                'Adam luôn hội tụ sau đúng 1 bước',
                'Adam chỉ chạy trên CPU',
              ],
              answer: 1,
              explain: (
                <>
                  Adam ước lượng độ lớn gradient từng tọa độ (qua <MathText tex="\hat v" />) rồi chia bước cho{' '}
                  <MathText tex="\sqrt{\hat v}" /> ⇒ mỗi chiều một lr hiệu dụng riêng. Momentum chỉ có vận tốc
                  chung, không co giãn theo chiều.
                </>
              ),
            },
          ]}
        />
      </Section>
    </Lesson>
  );
}
