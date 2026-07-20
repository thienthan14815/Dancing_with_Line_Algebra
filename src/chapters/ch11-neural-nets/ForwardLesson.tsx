import { useState } from 'react';
import { Lesson, Section } from '../../components/Lesson';
import MathText from '../../components/MathText';
import Slider from '../../components/Slider';
import StepByStep from '../../components/StepByStep';
import Quiz from '../../components/Quiz';
import { linearForward, applyActivation } from '../../lib/nn';
import type { Mat, Vec } from '../../lib/linalg';
import { f2, vecTex, matTex, Bars, BridgeLA, ControlGrid, Hint } from './_shared';

// Mạng cố định 2 → 3 → 2. Trọng số đặt sẵn để minh họa lan truyền xuôi.
const W1: Mat = [
  [1, -1],
  [0.5, 1],
  [-1, 0.5],
];
const b1: Vec = [0.5, -0.5, 1];
const W2: Mat = [
  [1, 0.5, -1],
  [-0.5, 1, 0.5],
];
const b2: Vec = [0, 0.5];

export default function ForwardLesson() {
  const [x1, setX1] = useState(1);
  const [x2, setX2] = useState(2);

  const x: Vec = [x1, x2];
  const z1 = linearForward(W1, x, b1);
  const a1 = applyActivation(z1, 'relu');
  const z2 = linearForward(W2, a1, b2);
  const a2 = applyActivation(z2, 'sigmoid');

  return (
    <Lesson id="forward" title="Lan truyền xuôi (Forward pass)">
      <Section kind="explore" title="Đẩy một vector đầu vào chạy qua mạng">
        <p className="muted">
          Mạng cố định <b>2 → 3 → 1 lớp ẩn → 2 đầu ra</b>. Kéo <MathText tex="x_1, x_2" /> và xem tín hiệu lan qua
          từng lớp: mỗi lớp tính <MathText tex="\mathbf{z} = W\mathbf{x} + \mathbf{b}" /> rồi áp hàm kích hoạt. Các
          thanh bên dưới là <b>vector kích hoạt</b> của từng lớp.
        </p>
        <ControlGrid>
          <Slider label="x₁" min={-3} max={3} value={x1} onChange={setX1} format={(v) => f2(v)} />
          <Slider label="x₂" min={-3} max={3} value={x2} onChange={setX2} format={(v) => f2(v)} />
        </ControlGrid>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: 16, marginTop: 12 }}>
          <div className="panel">
            <div className="dim" style={{ fontSize: 12, marginBottom: 6 }}>Lớp 1 — ReLU (3 neuron)</div>
            <MathText block tex={`\\mathbf{z}^{(1)} = ${vecTex(z1)}`} />
            <div className="dim" style={{ fontSize: 12, margin: '6px 0 0' }}>a⁽¹⁾ = ReLU(z⁽¹⁾)</div>
            <Bars values={a1} labels={['h₁', 'h₂', 'h₃']} color="var(--vec-1)" />
          </div>
          <div className="panel">
            <div className="dim" style={{ fontSize: 12, marginBottom: 6 }}>Lớp 2 — Sigmoid (2 đầu ra)</div>
            <MathText block tex={`\\mathbf{z}^{(2)} = ${vecTex(z2)}`} />
            <div className="dim" style={{ fontSize: 12, margin: '6px 0 0' }}>a⁽²⁾ = σ(z⁽²⁾)</div>
            <Bars values={a2} labels={['y₁', 'y₂']} color="var(--good)" max={1} />
          </div>
        </div>
        <Hint>
          Đầu ra của lớp 1 (<MathText tex="\mathbf{a}^{(1)}" />) trở thành đầu vào của lớp 2. Cả mạng chỉ là chuỗi{' '}
          "nhân ma trận → cộng bias → bẻ phi tuyến" lặp lại.
        </Hint>
      </Section>

      <Section kind="theory" title="Forward = chuỗi nhân ma trận + phi tuyến">
        <p>
          Lan truyền xuôi (forward propagation) là quá trình tính đầu ra của mạng từ đầu vào, lớp này nối lớp kia.
          Với mạng hai lớp ở trên:
        </p>
        <MathText block tex="\mathbf{a}^{(1)} = \text{ReLU}\!\big(W_1\mathbf{x} + \mathbf{b}_1\big), \qquad \mathbf{y} = \sigma\!\big(W_2\mathbf{a}^{(1)} + \mathbf{b}_2\big)" />
        <p>
          Trong đó <MathText tex="W_1" /> cỡ <MathText tex="3\times 2" /> (3 neuron ẩn, 2 đầu vào) và{' '}
          <MathText tex="W_2" /> cỡ <MathText tex="2\times 3" />. Mỗi <b>hàng</b> của <MathText tex="W" /> là vector
          trọng số của một neuron; phép <MathText tex="W\mathbf{x}" /> tính đồng thời dot product của mọi neuron
          trong lớp — chỉ bằng một phép nhân ma trận–vector.
        </p>
        <MathText block tex={`W_1 = ${matTex(W1)}, \\quad \\mathbf{b}_1 = ${vecTex(b1)}`} />
        <BridgeLA>
          Xương sống của forward là <b>matVec</b> và <b>matMul</b> ở Chương 3: mỗi lớp là một phép nhân ma
          trận–vector <MathText tex="W\mathbf{x}" />. Nếu đẩy cả một <i>batch</i> nhiều mẫu cùng lúc, các
          vector đầu vào xếp thành cột của một ma trận <MathText tex="X" /> và cả lớp trở thành một{' '}
          <b>phép nhân ma trận–ma trận</b> <MathText tex="W X" /> — cũng chính là <b>hợp các biến đổi tuyến
          tính</b>, xen kẽ với hàm phi tuyến.
        </BridgeLA>
      </Section>

      <Section kind="steps" title="Lan truyền từng lớp (với x = (1, 2))">
        <StepByStep
          steps={[
            {
              title: 'Đầu vào',
              content: (
                <p>
                  Lấy <MathText tex="\mathbf{x} = (1, 2)" />. Ta đẩy nó qua lớp 1 rồi lớp 2.
                </p>
              ),
            },
            {
              title: 'Lớp 1 — tính z⁽¹⁾ = W₁x + b₁',
              content: (
                <>
                  <p>Mỗi hàng của <MathText tex="W_1" /> nhân với <MathText tex="\mathbf{x}" /> rồi cộng bias tương ứng:</p>
                  <MathText block tex="z^{(1)}_1 = (1)(1) + (-1)(2) + 0.5 = -0.5" />
                  <MathText block tex="z^{(1)}_2 = (0.5)(1) + (1)(2) - 0.5 = 2.0" />
                  <MathText block tex="z^{(1)}_3 = (-1)(1) + (0.5)(2) + 1 = 1.0" />
                </>
              ),
            },
            {
              title: 'Lớp 1 — áp ReLU',
              content: (
                <p>
                  <MathText tex="\mathbf{a}^{(1)} = \text{ReLU}(-0.5,\, 2.0,\, 1.0) = (0,\, 2.0,\, 1.0)" />. ReLU cắt
                  thành phần âm về 0.
                </p>
              ),
            },
            {
              title: 'Lớp 2 — tính z⁽²⁾ = W₂a⁽¹⁾ + b₂',
              content: (
                <>
                  <MathText block tex="z^{(2)}_1 = (1)(0) + (0.5)(2) + (-1)(1) + 0 = 0" />
                  <MathText block tex="z^{(2)}_2 = (-0.5)(0) + (1)(2) + (0.5)(1) + 0.5 = 3.0" />
                </>
              ),
            },
            {
              title: 'Lớp 2 — áp sigmoid → đầu ra',
              content: (
                <p>
                  <MathText tex="\mathbf{y} = \sigma(0,\, 3.0) \approx (0.500,\, 0.953)" />. Đó là đầu ra cuối cùng của
                  mạng cho đầu vào <MathText tex="(1,2)" />.
                </p>
              ),
            },
          ]}
        />
      </Section>

      <Section kind="quiz" title="Kiểm tra hiểu">
        <Quiz
          lessonKey="ch11/forward"
          questions={[
            {
              q: (
                <>
                  Một lớp có 4 neuron nhận đầu vào 3 chiều. Ma trận trọng số <MathText tex="W" /> của lớp đó có kích thước?
                </>
              ),
              options: ['3 × 4', '4 × 3', '4 × 4', '3 × 3'],
              answer: 1,
              explain: (
                <>
                  Để <MathText tex="W\mathbf{x}" /> hợp lệ với <MathText tex="\mathbf{x}\in\mathbb{R}^3" /> và cho ra 4
                  giá trị, <MathText tex="W" /> phải là <MathText tex="4\times 3" /> (số hàng = số neuron).
                </>
              ),
            },
            {
              q: <>Trong lan truyền xuôi, đầu vào của lớp thứ hai là gì?</>,
              options: [
                'Vector đầu vào gốc x',
                'Vector kích hoạt a⁽¹⁾ của lớp thứ nhất',
                'Ma trận trọng số W₁',
                'Gradient của hàm mất mát',
              ],
              answer: 1,
              explain: <>Các lớp nối tiếp: đầu ra <MathText tex="\mathbf{a}^{(1)}" /> của lớp 1 chính là đầu vào lớp 2.</>,
            },
            {
              q: (
                <>
                  Với <MathText tex="W = \begin{bmatrix}1 & 2\\ 0 & -1\end{bmatrix}" />,{' '}
                  <MathText tex="\mathbf{x} = (3, 1)" />, <MathText tex="\mathbf{b} = (0, 1)" />, giá trị{' '}
                  <MathText tex="\mathbf{z} = W\mathbf{x}+\mathbf{b}" /> bằng?
                </>
              ),
              options: ['(5, 0)', '(5, -1)', '(3, 1)', '(6, 0)'],
              answer: 0,
              explain: (
                <>
                  Hàng 1: <MathText tex="1\cdot3 + 2\cdot1 + 0 = 5" />. Hàng 2:{' '}
                  <MathText tex="0\cdot3 + (-1)\cdot1 + 1 = 0" />. Vậy <MathText tex="\mathbf{z} = (5, 0)" />.
                </>
              ),
            },
            {
              q: <>Phép toán đại số tuyến tính nào là "xương sống" của một lớp trong forward pass?</>,
              options: [
                'Phép nhân ma trận–vector (matVec)',
                'Phép lấy định thức',
                'Phép chéo hóa',
                'Phép chuẩn hóa Gram–Schmidt',
              ],
              answer: 0,
              explain: (
                <>
                  Mỗi lớp tính <MathText tex="W\mathbf{x}" /> — một phép nhân ma trận–vector; với cả batch thì thành nhân
                  ma trận–ma trận.
                </>
              ),
            },
          ]}
        />
      </Section>
    </Lesson>
  );
}
