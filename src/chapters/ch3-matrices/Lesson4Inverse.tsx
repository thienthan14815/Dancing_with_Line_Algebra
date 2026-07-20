import { useState } from 'react';
import { Lesson, Section } from '../../components/Lesson';
import MathText from '../../components/MathText';
import Canvas2D, { type V2 } from '../../components/Canvas2D';
import MatrixInput from '../../components/MatrixInput';
import StepByStep from '../../components/StepByStep';
import Quiz from '../../components/Quiz';
import { det, inverse, type Mat } from '../../lib/linalg';
import { asM2, f2, UNIT_SQUARE } from './util';

const I2: Mat = [
  [1, 0],
  [0, 1],
];

const PRESETS: { label: string; m: Mat }[] = [
  { label: 'Shear', m: [[1, 1], [0, 1]] },
  { label: 'Co giãn', m: [[2, 0], [0, 0.5]] },
  { label: 'Xoay 90°', m: [[0, -1], [1, 0]] },
  { label: 'Nghiêng', m: [[2, 1], [1, 1]] },
  { label: 'Suy biến (det=0)', m: [[1, 2], [2, 4]] },
];

export default function Lesson4Inverse() {
  const [A, setA] = useState<Mat>(PRESETS[3].m);
  // stage 0 = identity, 1 = đã áp A, 2 = đã áp A⁻¹ (quay về identity)
  const [stage, setStage] = useState(0);

  const d = det(A);
  const inv = inverse(A);
  const singular = inv === null;

  // stage 2: tổng biến đổi = A⁻¹·A = I → lưới quay về như cũ.
  const display: Mat = stage === 0 ? I2 : stage === 1 ? A : I2;

  const vectors: V2[] = [
    { id: 'i', x: 1, y: 0, color: 'var(--vec-1)', label: 'î' },
    { id: 'j', x: 0, y: 1, color: 'var(--vec-2)', label: 'ĵ' },
  ];

  return (
    <Lesson id="ch3-inverse" title="Ma trận nghịch đảo">
      <p className="muted">
        Nếu <MathText tex="A" /> là một phép biến đổi, thì <MathText tex="A^{-1}" /> là
        phép <b>hoàn tác</b> nó — đưa mọi thứ về đúng chỗ cũ. Nhưng có một điều kiện:
        biến đổi phải không làm mất thông tin.
      </p>

      <Section kind="explore" title="Áp A rồi hoàn tác bằng A⁻¹">
        <p className="muted" style={{ marginTop: 0 }}>
          <b>Gợi ý thao tác:</b> Chọn một biến đổi, bấm <b>Áp A</b> để bóp méo lưới,
          rồi bấm <b>Áp A⁻¹</b> để thấy nó <b>quay về hệt như cũ</b>. Sau đó thử preset{' '}
          <b>Suy biến</b>: lưới bẹp lại và không còn cách nào quay về.
        </p>
        <div className="row" style={{ alignItems: 'flex-start', gap: 24 }}>
          <div style={{ flex: '1 1 260px', minWidth: 240 }}>
            <MatrixInput value={A} onChange={(m) => { setA(m); setStage(0); }} presets={PRESETS} />

            <div className="row" style={{ marginTop: 16 }}>
              <button className="btn" onClick={() => setStage(0)}>
                ↺ Reset
              </button>
              <button
                className="btn btn-primary"
                onClick={() => setStage(1)}
                disabled={stage >= 1}
              >
                1. Áp A
              </button>
              <button
                className="btn"
                onClick={() => setStage(2)}
                disabled={stage !== 1 || singular}
              >
                2. Áp A⁻¹ (hoàn tác)
              </button>
            </div>

            {singular ? (
              <div
                className="panel"
                style={{
                  marginTop: 14,
                  borderColor: 'var(--bad)',
                  background: 'rgba(239,68,68,0.08)',
                }}
              >
                <div style={{ color: 'var(--bad)', fontWeight: 700, marginBottom: 4 }}>
                  ⚠ det(A) = 0 — không có nghịch đảo
                </div>
                <div style={{ fontSize: 13.5, color: 'var(--text-muted)' }}>
                  Biến đổi này ép cả mặt phẳng vào một đường thẳng. Vô số điểm khác nhau
                  đáp xuống <b>cùng một chỗ</b> — thông tin đã mất, không cách nào biết
                  đường quay về. Bẹp rồi thì không hoàn tác được.
                </div>
              </div>
            ) : (
              <div className="panel" style={{ marginTop: 14, fontSize: 13.5 }}>
                <div className="muted">det(A) = {f2(d)} ≠ 0 → tồn tại A⁻¹</div>
                <div className="mono" style={{ marginTop: 8 }}>
                  A⁻¹ = ({f2(inv![0][0])}, {f2(inv![0][1])}; {f2(inv![1][0])},{' '}
                  {f2(inv![1][1])})
                </div>
              </div>
            )}
          </div>
          <div style={{ flex: '2 1 340px', minWidth: 300 }}>
            <Canvas2D
              height={420}
              range={5}
              matrix={asM2(display)}
              vectors={vectors}
              polygons={[
                {
                  points: UNIT_SQUARE,
                  fill: 'var(--vec-result)',
                  opacity: 0.28,
                  stroke: 'var(--vec-result)',
                },
              ]}
            />
            <p className="dim" style={{ fontSize: 12, marginTop: 8 }}>
              {stage === 0
                ? 'Trạng thái ban đầu (identity)'
                : stage === 1
                ? 'Đã áp A — lưới bị biến đổi'
                : 'Đã áp A⁻¹ — mọi thứ trở về đúng chỗ cũ (A⁻¹A = I)'}
            </p>
          </div>
        </div>
      </Section>

      <Section kind="theory" title="Nghịch đảo là phép hoàn tác">
        <p>
          <MathText tex="A^{-1}" /> được định nghĩa là ma trận sao cho làm{' '}
          <MathText tex="A" /> rồi làm <MathText tex="A^{-1}" /> thì như chưa làm gì:
        </p>
        <MathText block tex="A^{-1} A = A A^{-1} = I" />
        <p>
          <b>Điều kiện tồn tại:</b> <MathText tex="A^{-1}" /> tồn tại{' '}
          <b>khi và chỉ khi</b> <MathText tex="\det(A) \neq 0" />. Lý do rất trực quan:
          nếu det = 0 thì biến đổi bẹp không gian và làm mất thông tin — không có phép
          nào “khôi phục” được.
        </p>
        <p>Công thức cho ma trận 2×2:</p>
        <MathText
          block
          tex="A^{-1} = \frac{1}{\det A}\begin{bmatrix} d & -b \\ -c & a \end{bmatrix}, \qquad A = \begin{bmatrix} a & b \\ c & d \end{bmatrix}"
        />
        <p>
          <b>Ứng dụng — giải hệ phương trình.</b> Ở chương 2 ta giải{' '}
          <MathText tex="Ax = b" /> bằng khử Gauss. Nếu <MathText tex="A" /> khả nghịch,
          có ngay công thức gọn:
        </p>
        <MathText block tex="Ax = b \;\Longrightarrow\; x = A^{-1} b" />
        <p className="muted">
          Nhân cả hai vế với <MathText tex="A^{-1}" /> bên trái:{' '}
          <MathText tex="A^{-1}Ax = A^{-1}b" />, mà <MathText tex="A^{-1}A = I" /> nên{' '}
          <MathText tex="x = A^{-1}b" />. Đúng một nghiệm duy nhất — khớp với trường hợp
          det ≠ 0.
        </p>
      </Section>

      <Section kind="steps" title="Tìm A⁻¹ của ma trận 2×2 từng bước">
        <p className="muted">
          Lấy <MathText tex="A = \begin{bmatrix} 2 & 1 \\ 1 & 1 \end{bmatrix}" />.
        </p>
        <StepByStep
          steps={[
            {
              title: 'Bước 1 — Tính determinant',
              content: (
                <MathText block tex="\det A = 2\cdot1 - 1\cdot1 = 1" />
              ),
            },
            {
              title: 'Bước 2 — Hoán vị chéo chính, đổi dấu chéo phụ',
              content: (
                <div>
                  <MathText
                    block
                    tex="\begin{bmatrix} d & -b \\ -c & a \end{bmatrix} = \begin{bmatrix} 1 & -1 \\ -1 & 2 \end{bmatrix}"
                  />
                  <p className="muted">Đổi chỗ a↔d, đổi dấu b và c.</p>
                </div>
              ),
            },
            {
              title: 'Bước 3 — Chia cho det',
              content: (
                <MathText
                  block
                  tex="A^{-1} = \frac{1}{1}\begin{bmatrix} 1 & -1 \\ -1 & 2 \end{bmatrix} = \begin{bmatrix} 1 & -1 \\ -1 & 2 \end{bmatrix}"
                />
              ),
            },
            {
              title: 'Bước 4 — Kiểm tra A·A⁻¹ = I',
              content: (
                <div>
                  <MathText
                    block
                    tex="\begin{bmatrix} 2 & 1 \\ 1 & 1 \end{bmatrix}\begin{bmatrix} 1 & -1 \\ -1 & 2 \end{bmatrix} = \begin{bmatrix} 1 & 0 \\ 0 & 1 \end{bmatrix}"
                  />
                  <p className="muted">
                    Ô (1,1): <MathText tex="2\cdot1 + 1\cdot(-1) = 1" />; ô (1,2):{' '}
                    <MathText tex="2\cdot(-1)+1\cdot2 = 0" />… đúng bằng identity.
                  </p>
                </div>
              ),
            },
          ]}
        />
      </Section>

      <Section kind="quiz" title="Kiểm tra hiểu">
        <Quiz
          lessonKey="ch3/inverse"
          questions={[
            {
              q: <>Ma trận <MathText tex="A" /> có nghịch đảo khi nào?</>,
              options: [
                <>Khi <MathText tex="\det(A) \neq 0" /></>,
                <>Khi <MathText tex="\det(A) = 0" /></>,
                <>Khi A là ma trận vuông, luôn luôn</>,
                <>Khi mọi phần tử của A khác 0</>,
              ],
              answer: 0,
              explain: (
                <>
                  det ≠ 0 nghĩa là biến đổi không làm bẹp không gian, nên hoàn tác được.
                </>
              ),
            },
            {
              q: <>Tích <MathText tex="A^{-1}A" /> bằng gì?</>,
              options: [
                <>Ma trận identity <MathText tex="I" /></>,
                <>Ma trận không</>,
                <><MathText tex="2A" /></>,
                <>Chính <MathText tex="A" /></>,
              ],
              answer: 0,
              explain: <>Áp A rồi hoàn tác bằng A⁻¹ = không đổi = <MathText tex="I" />.</>,
            },
            {
              q: (
                <>
                  Nghịch đảo của <MathText tex="\begin{bmatrix}3&0\\0&2\end{bmatrix}" /> là:
                </>
              ),
              options: [
                <MathText tex="\begin{bmatrix}1/3&0\\0&1/2\end{bmatrix}" />,
                <MathText tex="\begin{bmatrix}2&0\\0&3\end{bmatrix}" />,
                <MathText tex="\begin{bmatrix}3&0\\0&2\end{bmatrix}" />,
                <>Không tồn tại</>,
              ],
              answer: 0,
              explain: (
                <>
                  Ma trận chéo nghịch đảo bằng cách nghịch đảo từng phần tử chéo:{' '}
                  <MathText tex="1/3,\,1/2" />.
                </>
              ),
            },
            {
              q: <>Vì sao biến đổi có det = 0 không hoàn tác được?</>,
              options: [
                <>Vì nó ép nhiều điểm khác nhau về cùng một chỗ — thông tin đã mất</>,
                <>Vì nó xoay quá nhiều</>,
                <>Vì det âm</>,
                <>Thực ra vẫn hoàn tác được</>,
              ],
              answer: 0,
              explain: (
                <>
                  Bẹp không gian nghĩa là ánh xạ không còn 1–1; không biết đường nào để
                  quay lại.
                </>
              ),
            },
          ]}
        />
      </Section>
    </Lesson>
  );
}
