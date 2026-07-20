import { useState } from 'react';
import { Lesson, Section } from '../../components/Lesson';
import MathText from '../../components/MathText';
import Canvas2D, { useCanvas2D } from '../../components/Canvas2D';
import Slider from '../../components/Slider';
import StepByStep from '../../components/StepByStep';
import Quiz from '../../components/Quiz';
import { sigmoid, numericGradient } from '../../lib/nn';
import { f3, Stat, StatRow, Hint, BridgeLA, ControlGrid } from './_shared';

export default function BackpropLesson() {
  const [w, setW] = useState(0.5);
  const [x, setX] = useState(2);
  const [b, setB] = useState(0.1);
  const [t, setT] = useState(1);

  // Forward
  const z = w * x + b;
  const a = sigmoid(z);
  const L = (a - t) * (a - t);

  // Backward (chain rule)
  const dLda = 2 * (a - t);
  const dadz = a * (1 - a);
  const dLdz = dLda * dadz;
  const dLdw = dLdz * x; // dz/dw = x
  const dLdb = dLdz * 1; // dz/db = 1

  // Kiểm chứng bằng gradient số: f([w,b]) = (σ(w·x+b) − t)²
  const numGrad = numericGradient(([ww, bb]) => {
    const av = sigmoid(ww * x + bb);
    return (av - t) * (av - t);
  }, [w, b]);

  return (
    <Lesson id="backprop" title="Lan truyền ngược (Backpropagation)">
      <Section kind="explore" title="Một đồ thị tính toán & gradient chảy ngược">
        <p className="muted">
          Mạng bé nhất có thể: một trọng số <MathText tex="w" />, một bias <MathText tex="b" />, đầu vào{' '}
          <MathText tex="x" />, mục tiêu <MathText tex="t" />. Forward tính{' '}
          <MathText tex="z \to a \to L" />; backprop dùng <b>quy tắc dây chuyền</b> để tính{' '}
          <MathText tex="\partial L/\partial w" /> và <MathText tex="\partial L/\partial b" />. So sánh với{' '}
          <b>gradient số</b> (numericGradient) để thấy chúng khớp.
        </p>
        <Canvas2D height={300} range={6} showGrid={false} showAxes={false} transformElements={false}>
          <CompGraph z={z} a={a} L={L} />
        </Canvas2D>
        <ControlGrid>
          <Slider label="w" min={-2} max={2} value={w} onChange={setW} format={(v) => f3(v)} />
          <Slider label="x" min={-3} max={3} value={x} onChange={setX} format={(v) => f3(v)} />
          <Slider label="b" min={-2} max={2} value={b} onChange={setB} format={(v) => f3(v)} />
          <Slider label="t (mục tiêu)" min={0} max={1} step={0.05} value={t} onChange={setT} format={(v) => f3(v)} />
        </ControlGrid>
        <StatRow>
          <Stat label="∂L/∂w (giải tích)" value={f3(dLdw)} color="var(--accent)" />
          <Stat label="∂L/∂w (số)" value={f3(numGrad[0])} color="var(--text-muted)" />
          <Stat label="∂L/∂b (giải tích)" value={f3(dLdb)} color="var(--accent)" />
          <Stat label="∂L/∂b (số)" value={f3(numGrad[1])} color="var(--text-muted)" />
        </StatRow>
        <Hint>
          Hai cột "giải tích" và "số" luôn trùng khớp — đó là <b>gradient checking</b>. Gradient âm cho biết: tăng{' '}
          <MathText tex="w" /> sẽ <b>giảm</b> mất mát, nên gradient descent sẽ đẩy <MathText tex="w" /> lên.
        </Hint>
      </Section>

      <Section kind="theory" title="Backprop = quy tắc dây chuyền trên đồ thị">
        <p>
          Mất mát <MathText tex="L" /> phụ thuộc <MathText tex="w" /> qua một <b>chuỗi</b> trung gian:{' '}
          <MathText tex="w \to z \to a \to L" />. Quy tắc dây chuyền (chain rule) nói: đạo hàm của cả chuỗi là{' '}
          <b>tích</b> các đạo hàm từng mắt xích:
        </p>
        <MathText block tex="\frac{\partial L}{\partial w} = \frac{\partial L}{\partial a}\cdot\frac{\partial a}{\partial z}\cdot\frac{\partial z}{\partial w}" />
        <p>Với <MathText tex="z = wx+b" />, <MathText tex="a=\sigma(z)" />, <MathText tex="L=(a-t)^2" />, từng mắt xích là:</p>
        <MathText block tex="\frac{\partial L}{\partial a} = 2(a-t), \quad \frac{\partial a}{\partial z} = \sigma(z)\big(1-\sigma(z)\big) = a(1-a), \quad \frac{\partial z}{\partial w} = x" />
        <p>
          Backprop tính các đạo hàm này theo <b>thứ tự ngược</b> (từ <MathText tex="L" /> lùi về đầu vào), tái sử dụng
          kết quả trung gian <MathText tex="\partial L/\partial z" /> để không tính lại — đó là lý do nó hiệu quả trên
          mạng hàng triệu tham số.
        </p>
        <BridgeLA>
          Gradient <MathText tex="\nabla L = \big(\partial L/\partial w,\ \partial L/\partial b\big)" /> là một{' '}
          <b>vector</b> — nó chỉ hướng tăng nhanh nhất của <MathText tex="L" /> trong không gian tham số. Với một lớp
          nhiều đầu ra, đạo hàm của vector đầu ra theo vector đầu vào là một <b>ma trận Jacobian</b>; quy tắc dây chuyền
          nhiều biến chính là <b>nhân các ma trận Jacobian</b> — lại là phép nhân ma trận của Chương 3, chỉ chạy theo
          chiều ngược.
        </BridgeLA>
      </Section>

      <Section kind="steps" title="Chain rule từng bước (w=0.5, x=2, b=0.1, t=1)">
        <StepByStep
          steps={[
            {
              title: 'Forward',
              content: (
                <p>
                  <MathText tex="z = 0.5\cdot 2 + 0.1 = 1.1" />;{' '}
                  <MathText tex="a = \sigma(1.1) \approx 0.750" />;{' '}
                  <MathText tex="L = (0.750 - 1)^2 \approx 0.0624" />.
                </p>
              ),
            },
            {
              title: 'Bước ngược 1 — ∂L/∂a',
              content: (
                <p>
                  <MathText tex="\dfrac{\partial L}{\partial a} = 2(a - t) = 2(0.750 - 1) \approx -0.499" />.
                </p>
              ),
            },
            {
              title: 'Bước ngược 2 — ∂a/∂z',
              content: (
                <p>
                  <MathText tex="\dfrac{\partial a}{\partial z} = a(1-a) = 0.750\cdot 0.250 \approx 0.187" />. Đạo hàm
                  sigmoid, tính lại nhanh từ <MathText tex="a" /> đã có.
                </p>
              ),
            },
            {
              title: 'Gộp thành ∂L/∂z',
              content: (
                <p>
                  <MathText tex="\dfrac{\partial L}{\partial z} = (-0.499)(0.187) \approx -0.0936" />. Đây là "tín hiệu
                  lỗi" tại <MathText tex="z" />, dùng chung cho cả <MathText tex="w" /> và <MathText tex="b" />.
                </p>
              ),
            },
            {
              title: 'Bước ngược 3 — tới w và b',
              content: (
                <p>
                  <MathText tex="\dfrac{\partial L}{\partial w} = \dfrac{\partial L}{\partial z}\cdot x = -0.0936\cdot 2 \approx -0.187" />
                  {'  '}và{'  '}
                  <MathText tex="\dfrac{\partial L}{\partial b} = \dfrac{\partial L}{\partial z}\cdot 1 \approx -0.0936" />.
                  Khớp với gradient số ở phần Khám phá.
                </p>
              ),
            },
          ]}
        />
      </Section>

      <Section kind="quiz" title="Kiểm tra hiểu">
        <Quiz
          lessonKey="ch11/backprop"
          questions={[
            {
              q: <>Backprop về cơ bản là việc áp dụng quy tắc nào của giải tích?</>,
              options: [
                'Quy tắc nhân của định thức',
                'Quy tắc dây chuyền (chain rule)',
                'Quy tắc Cramer',
                'Quy tắc hình bình hành',
              ],
              answer: 1,
              explain: (
                <>
                  Nó nhân dồn các đạo hàm dọc theo chuỗi <MathText tex="w\to z\to a\to L" /> — đúng công thức chain rule.
                </>
              ),
            },
            {
              q: (
                <>
                  Với <MathText tex="z = wx + b" />, đạo hàm <MathText tex="\partial z/\partial w" /> bằng?
                </>
              ),
              options: ['w', 'x', 'b', '1'],
              answer: 1,
              explain: <>Coi <MathText tex="x, b" /> là hằng: <MathText tex="\partial(wx+b)/\partial w = x" />.</>,
            },
            {
              q: <>Đạo hàm của sigmoid có thể viết gọn theo chính đầu ra a = σ(z) là:</>,
              options: [
                <MathText tex="a^2" key="a" />,
                <MathText tex="a(1-a)" key="b" />,
                <MathText tex="1 - a" key="c" />,
                <MathText tex="1/a" key="d" />,
              ],
              answer: 1,
              explain: (
                <>
                  <MathText tex="\sigma'(z) = \sigma(z)(1-\sigma(z)) = a(1-a)" /> — nên chỉ cần lưu <MathText tex="a" /> từ
                  forward là tính được ngay.
                </>
              ),
            },
            {
              q: <>Trong đại số tuyến tính, đạo hàm của một vector đầu ra theo một vector đầu vào là:</>,
              options: [
                'Một số vô hướng',
                'Một ma trận Jacobian',
                'Một định thức',
                'Một vector riêng',
              ],
              answer: 1,
              explain: (
                <>
                  Đó là <b>ma trận Jacobian</b>; chain rule nhiều biến = nhân các Jacobian với nhau — vẫn là nhân ma trận.
                </>
              ),
            },
          ]}
        />
      </Section>
    </Lesson>
  );
}

// --- Đồ thị tính toán: x, w, b → z → a → L (children của Canvas2D). -----------
function CompGraph({ z, a, L }: { z: number; a: number; L: number }) {
  const { toScreen } = useCanvas2D();

  const nodes: { key: string; wx: number; wy: number; sym: string; val?: string; fill: string }[] = [
    { key: 'x', wx: -5, wy: 2.6, sym: 'x', fill: 'var(--vec-result)' },
    { key: 'w', wx: -5, wy: 0, sym: 'w', fill: 'var(--vec-result)' },
    { key: 'b', wx: -5, wy: -2.6, sym: 'b', fill: 'var(--vec-result)' },
    { key: 'z', wx: -1.4, wy: 0, sym: 'z', val: f3(z), fill: 'var(--vec-1)' },
    { key: 'a', wx: 1.8, wy: 0, sym: 'a', val: f3(a), fill: 'var(--vec-1)' },
    { key: 'L', wx: 5, wy: 0, sym: 'L', val: f3(L), fill: 'var(--warn)' },
  ];
  const pos: Record<string, [number, number]> = {};
  for (const n of nodes) pos[n.key] = [n.wx, n.wy];

  const edgeList: [string, string][] = [
    ['x', 'z'],
    ['w', 'z'],
    ['b', 'z'],
    ['z', 'a'],
    ['a', 'L'],
  ];

  return (
    <g>
      {edgeList.map(([from, to]) => {
        const [fx, fy] = toScreen(pos[from][0], pos[from][1]);
        const [tx, ty] = toScreen(pos[to][0], pos[to][1]);
        return <line key={`${from}-${to}`} x1={fx} y1={fy} x2={tx} y2={ty} stroke="var(--accent)" strokeWidth={1.6} opacity={0.55} />;
      })}
      {nodes.map((n) => {
        const [sx, sy] = toScreen(n.wx, n.wy);
        return (
          <g key={n.key}>
            <circle cx={sx} cy={sy} r={20} fill={n.fill} opacity={0.92} stroke="var(--text)" strokeWidth={1} />
            <text x={sx} y={sy + 5} textAnchor="middle" fill="var(--bg)" fontSize={14} fontWeight={700}>
              {n.sym}
            </text>
            {n.val !== undefined && (
              <text x={sx} y={sy + 36} textAnchor="middle" fill="var(--text)" fontSize={12} className="mono">
                {n.val}
              </text>
            )}
          </g>
        );
      })}
      <text x={toScreen(-1.4, 0)[0]} y={toScreen(-1.4, 1.4)[1]} textAnchor="middle" fill="var(--text-dim)" fontSize={11}>
        z = wx+b
      </text>
      <text x={toScreen(1.8, 0)[0]} y={toScreen(1.8, 1.4)[1]} textAnchor="middle" fill="var(--text-dim)" fontSize={11}>
        a = σ(z)
      </text>
      <text x={toScreen(5, 0)[0]} y={toScreen(5, 1.4)[1]} textAnchor="middle" fill="var(--text-dim)" fontSize={11}>
        L = (a−t)²
      </text>
    </g>
  );
}
