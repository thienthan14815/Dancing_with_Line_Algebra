import { useState } from 'react';
import { Lesson, Section } from '../../components/Lesson';
import MathText from '../../components/MathText';
import Canvas2D, { useCanvas2D, type V2 } from '../../components/Canvas2D';
import Slider from '../../components/Slider';
import StepByStep from '../../components/StepByStep';
import Quiz from '../../components/Quiz';
import { sigmoid } from '../../lib/nn';
import { dot } from '../../lib/linalg';
import { f2, f3, Stat, StatRow, Hint, BridgeLA, ControlGrid } from './_shared';

// Trường quyết định: tô mỗi điểm lưới theo a = σ(w·x + b).
// a ≥ 0.5 → lớp 1 (một màu), a < 0.5 → lớp 0 (màu khác); độ đậm theo độ "chắc chắn".
function DecisionField({ w1, w2, b }: { w1: number; w2: number; b: number }) {
  const { toScreen, range } = useCanvas2D();
  const N = 22;
  const cells = [];
  const span = 2 * range;
  const dotStep = span / N;
  for (let i = 0; i <= N; i++) {
    for (let j = 0; j <= N; j++) {
      const x = -range + (span * i) / N;
      const y = -range + (span * j) / N;
      const a = sigmoid(w1 * x + w2 * y + b);
      const [sx, sy] = toScreen(x, y);
      const cls1 = a >= 0.5;
      const op = 0.1 + 0.5 * Math.abs(2 * a - 1);
      cells.push(
        <rect
          key={`${i}-${j}`}
          x={sx - dotStep * 6}
          y={sy - dotStep * 6}
          width={dotStep * 12}
          height={dotStep * 12}
          fill={cls1 ? 'var(--vec-1)' : 'var(--vec-3)'}
          opacity={op}
        />,
      );
    }
  }
  return <g>{cells}</g>;
}

export default function NeuronLesson() {
  const [x1, setX1] = useState(1);
  const [x2, setX2] = useState(1.5);
  const [w1, setW1] = useState(1.5);
  const [w2, setW2] = useState(-1);
  const [b, setB] = useState(0.5);

  const z = dot([w1, w2], [x1, x2]) + b;
  const a = sigmoid(z);
  const fired = a >= 0.5;

  // Điểm đầu vào hiện tại.
  const inputPt = [{ x: x1, y: x2, color: 'var(--vec-result)', label: 'x' }];
  // Vector trọng số w (vuông góc với đường quyết định).
  const wVec: V2[] = [{ id: 'w', x: w1, y: w2, color: 'var(--accent-strong)', label: 'w' }];
  // Đường quyết định w1·x + w2·y + b = 0  ⇔  w1·x + w2·y = −b.
  const boundary = [{ a: w1, b: w2, c: -b, color: 'var(--warn)', label: 'w·x+b=0' }];

  return (
    <Lesson id="neuron" title="Neuron = Dot product + Activation">
      <Section kind="explore" title="Một neuron chia mặt phẳng làm đôi">
        <p className="muted">
          Kéo các thanh trượt trọng số <MathText tex="w_1, w_2" /> và độ chệch{' '}
          <MathText tex="b" />. Vùng cam là nơi neuron <b>kích hoạt</b> (
          <MathText tex="a \ge 0.5" />), vùng xanh là nơi nó "im lặng". Ranh giới vàng chính là{' '}
          đường <MathText tex="w\cdot x + b = 0" />. Kéo <MathText tex="x_1, x_2" /> để dời điểm đầu vào{' '}
          <span style={{ color: 'var(--vec-result)' }}>x</span> qua lại hai miền.
        </p>
        <Canvas2D height={420} range={5} points={inputPt} vectors={wVec} lines={boundary} transformElements={false}>
          <DecisionField w1={w1} w2={w2} b={b} />
        </Canvas2D>
        <StatRow>
          <Stat label="z = w·x + b" value={f2(z)} color="var(--accent)" />
          <Stat label="a = σ(z)" value={f3(a)} color={fired ? 'var(--vec-1)' : 'var(--vec-3)'} />
          <Stat label="Neuron" value={fired ? 'kích hoạt (1)' : 'im lặng (0)'} color={fired ? 'var(--good)' : 'var(--text-muted)'} />
        </StatRow>
        <ControlGrid>
          <Slider label="x₁" min={-4} max={4} value={x1} onChange={setX1} format={(v) => f2(v)} />
          <Slider label="x₂" min={-4} max={4} value={x2} onChange={setX2} format={(v) => f2(v)} />
          <Slider label="w₁" min={-3} max={3} value={w1} onChange={setW1} format={(v) => f2(v)} />
          <Slider label="w₂" min={-3} max={3} value={w2} onChange={setW2} format={(v) => f2(v)} />
          <Slider label="b (bias)" min={-4} max={4} value={b} onChange={setB} format={(v) => f2(v)} />
        </ControlGrid>
        <Hint>
          Để ý: vector <span style={{ color: 'var(--accent-strong)' }}>w</span> luôn <b>vuông góc</b> với đường
          quyết định và chỉ về phía miền "kích hoạt". Đó không phải trùng hợp — đó là hình học của dot product.
        </Hint>
      </Section>

      <Section kind="theory" title="Hai mảnh ghép: tổ hợp tuyến tính + hàm kích hoạt">
        <p>
          Một nơ-ron nhân tạo (artificial neuron) chỉ làm đúng <b>hai việc</b>. Trước tiên nó trộn các đầu vào
          bằng một <b>tổ hợp tuyến tính có trọng số</b>, cộng thêm bias:
        </p>
        <MathText block tex="z = w_1 x_1 + w_2 x_2 + \cdots + w_n x_n + b = \mathbf{w}\cdot\mathbf{x} + b" />
        <p>
          Sau đó nó ép <MathText tex="z" /> qua một <b>hàm kích hoạt (activation)</b> phi tuyến, ở đây là sigmoid{' '}
          <MathText tex="\sigma" />, để cho ra tín hiệu đầu ra:
        </p>
        <MathText block tex="a = \sigma(z) = \frac{1}{1 + e^{-z}} \in (0, 1)" />
        <p>
          Toàn bộ neuron là hàm hợp <MathText tex="a = \sigma(\mathbf{w}\cdot\mathbf{x} + b)" />. Phần{' '}
          <MathText tex="\mathbf{w}\cdot\mathbf{x} + b" /> quyết định <i>đường ranh giới</i>; phần{' '}
          <MathText tex="\sigma" /> biến khoảng cách tới ranh giới đó thành một con số mượt trong{' '}
          <MathText tex="(0,1)" /> — có thể đọc như "độ tự tin".
        </p>
        <BridgeLA>
          Trái tim của neuron là <b>dot product</b> <MathText tex="\mathbf{w}\cdot\mathbf{x}" /> — đúng phép tính
          bạn đã học ở <b>Chương 1 (Vector)</b>. Dấu của <MathText tex="\mathbf{w}\cdot\mathbf{x}+b" /> cho biết
          điểm <MathText tex="\mathbf{x}" /> nằm phía nào của ranh giới, vì dot product đo mức độ "cùng hướng" với{' '}
          <MathText tex="\mathbf{w}" />. Còn phương trình <MathText tex="w_1 x_1 + w_2 x_2 = -b" /> chính là một{' '}
          <b>đường thẳng</b> dạng <MathText tex="ax + by = c" /> của <b>Chương 2</b>. Một neuron = một{' '}
          <b>nửa mặt phẳng</b>; vector <MathText tex="\mathbf{w}" /> là pháp tuyến của đường đó.
        </BridgeLA>
      </Section>

      <Section kind="steps" title="Tính đầu ra của một neuron, từng bước">
        <StepByStep
          steps={[
            {
              title: 'Bài toán',
              content: (
                <p>
                  Cho trọng số <MathText tex="\mathbf{w} = (2, -1)" />, bias <MathText tex="b = 0.5" />, và đầu vào{' '}
                  <MathText tex="\mathbf{x} = (1, 3)" />. Tính <MathText tex="z" /> rồi <MathText tex="a = \sigma(z)" />.
                </p>
              ),
            },
            {
              title: 'Bước 1 — dot product w·x',
              content: (
                <p>
                  <MathText tex="\mathbf{w}\cdot\mathbf{x} = 2\cdot 1 + (-1)\cdot 3 = 2 - 3 = -1" />. Nhân từng cặp
                  thành phần rồi cộng lại — y hệt tích vô hướng ở Chương 1.
                </p>
              ),
            },
            {
              title: 'Bước 2 — cộng bias',
              content: (
                <p>
                  <MathText tex="z = \mathbf{w}\cdot\mathbf{x} + b = -1 + 0.5 = -0.5" />.
                </p>
              ),
            },
            {
              title: 'Bước 3 — qua hàm kích hoạt',
              content: (
                <p>
                  <MathText tex="a = \sigma(-0.5) = \dfrac{1}{1 + e^{0.5}} \approx 0.378" />. Vì{' '}
                  <MathText tex="a < 0.5" /> nên với ranh giới 0.5, neuron này <b>không kích hoạt</b> tại điểm x.
                </p>
              ),
            },
            {
              title: 'Đọc theo hình học',
              content: (
                <p>
                  <MathText tex="z < 0" /> nghĩa là <MathText tex="\mathbf{x}" /> nằm ở nửa mặt phẳng "âm" — phía{' '}
                  <i>ngược</i> hướng <MathText tex="\mathbf{w}" />. Càng xa ranh giới về phía dương, <MathText tex="z" />{' '}
                  càng lớn và <MathText tex="a" /> càng tiến sát 1.
                </p>
              ),
            },
          ]}
        />
      </Section>

      <Section kind="quiz" title="Kiểm tra hiểu">
        <Quiz
          lessonKey="ch11/neuron"
          questions={[
            {
              q: (
                <>
                  Với <MathText tex="\mathbf{w} = (3, -2)" />, <MathText tex="b = 1" />,{' '}
                  <MathText tex="\mathbf{x} = (2, 2)" />, giá trị <MathText tex="z = \mathbf{w}\cdot\mathbf{x}+b" /> bằng?
                </>
              ),
              options: ['3', '5', '2', '11'],
              answer: 0,
              explain: (
                <>
                  <MathText tex="3\cdot 2 + (-2)\cdot 2 + 1 = 6 - 4 + 1 = 3" />.
                </>
              ),
            },
            {
              q: <>Phép tính cốt lõi biến đầu vào của một neuron thành số <MathText tex="z" /> (trước bias) là gì?</>,
              options: [
                'Tích có hướng (cross product) của w và x',
                'Tích vô hướng (dot product) của w và x',
                'Định thức của một ma trận',
                'Chuẩn (độ dài) của x',
              ],
              answer: 1,
              explain: (
                <>
                  <MathText tex="z = \mathbf{w}\cdot\mathbf{x} + b" />: phần <MathText tex="\mathbf{w}\cdot\mathbf{x}" />{' '}
                  là dot product — trộn các đầu vào theo trọng số.
                </>
              ),
            },
            {
              q: <>Tập các điểm thỏa <MathText tex="\mathbf{w}\cdot\mathbf{x} + b = 0" /> trong mặt phẳng là:</>,
              options: [
                'Một điểm duy nhất',
                'Một đường thẳng (ranh giới quyết định)',
                'Một đường tròn',
                'Toàn bộ mặt phẳng',
              ],
              answer: 1,
              explain: (
                <>
                  Đó là phương trình <MathText tex="w_1 x_1 + w_2 x_2 = -b" />, dạng <MathText tex="ax+by=c" /> — một
                  đường thẳng chia mặt phẳng thành hai nửa.
                </>
              ),
            },
            {
              q: <>Vai trò của hàm kích hoạt sigmoid trong một neuron là gì?</>,
              options: [
                'Làm cho đầu ra luôn là số nguyên',
                'Ép z về khoảng (0, 1) một cách phi tuyến, cho ra "độ tự tin"',
                'Đảo ngược dot product',
                'Chuẩn hóa vector trọng số về độ dài 1',
              ],
              answer: 1,
              explain: (
                <>
                  <MathText tex="\sigma(z) = 1/(1+e^{-z})" /> nén mọi số thực về <MathText tex="(0,1)" /> và thêm tính{' '}
                  <b>phi tuyến</b> — chìa khóa để chồng nhiều neuron trở nên mạnh hơn một biến đổi tuyến tính.
                </>
              ),
            },
          ]}
        />
      </Section>
    </Lesson>
  );
}
