import { useState } from 'react';
import { Lesson, Section } from '../../components/Lesson';
import MathText from '../../components/MathText';
import Canvas2D, { type V2 } from '../../components/Canvas2D';
import MatrixInput from '../../components/MatrixInput';
import StepByStep from '../../components/StepByStep';
import Quiz from '../../components/Quiz';
import { matMul, type Mat } from '../../lib/linalg';
import { asM2, f2, PRESETS_2D } from './util';

const I2: Mat = [
  [1, 0],
  [0, 1],
];

export default function Lesson2Composition() {
  const [A, setA] = useState<Mat>([
    [1, 1],
    [0, 1],
  ]); // Shear
  const [B, setB] = useState<Mat>([
    [0, -1],
    [1, 0],
  ]); // Xoay 90°
  const [order, setOrder] = useState<'AB' | 'BA'>('AB');
  // stage 0 = identity, 1 = biến đổi thứ nhất, 2 = tích cuối
  const [stage, setStage] = useState(0);

  // Với thứ tự AB (A·B): áp B trước rồi A. Biến đổi "thứ nhất" là B, tích là A·B.
  const first = order === 'AB' ? B : A;
  const product = order === 'AB' ? matMul(A, B) : matMul(B, A);
  const firstLabel = order === 'AB' ? 'B' : 'A';
  const secondLabel = order === 'AB' ? 'A' : 'B';
  const productLabel = order === 'AB' ? 'A·B' : 'B·A';

  const display: Mat = stage === 0 ? I2 : stage === 1 ? first : product;

  const AB = matMul(A, B);
  const BA = matMul(B, A);

  const vectors: V2[] = [
    { id: 'i', x: 1, y: 0, color: 'var(--vec-1)', label: 'î' },
    { id: 'j', x: 0, y: 1, color: 'var(--vec-2)', label: 'ĵ' },
  ];

  return (
    <Lesson id="ch3-composition" title="Nhân ma trận = hợp biến đổi">
      <p className="muted">
        Nhân hai ma trận <b>không phải</b> là một quy tắc kỳ quặc cần học thuộc. Nó có
        một ý nghĩa duy nhất, tự nhiên: <b>làm biến đổi này rồi làm biến đổi kia</b> —
        đúng như hợp hai hàm số.
      </p>

      <Section kind="explore" title="Áp từng bước: một biến đổi rồi biến đổi nữa">
        <p className="muted" style={{ marginTop: 0 }}>
          <b>Gợi ý thao tác:</b> Chọn hai biến đổi A và B, rồi bấm nút để áp{' '}
          <b>từng nhịp</b>: lưới về identity → áp biến đổi thứ nhất → áp biến đổi thứ
          hai. Kết quả trùng khớp với việc áp thẳng ma trận tích. Bấm{' '}
          <b>Đổi thứ tự</b> để thấy <MathText tex="AB \neq BA" />.
        </p>

        <div className="row" style={{ alignItems: 'flex-start', gap: 24 }}>
          <div style={{ flex: '1 1 260px', minWidth: 240 }}>
            <div style={{ marginBottom: 6, fontWeight: 600, color: 'var(--vec-1)' }}>
              Biến đổi A
            </div>
            <MatrixInput value={A} onChange={(m) => { setA(m); setStage(0); }} presets={PRESETS_2D} />
            <div style={{ margin: '14px 0 6px', fontWeight: 600, color: 'var(--vec-2)' }}>
              Biến đổi B
            </div>
            <MatrixInput value={B} onChange={(m) => { setB(m); setStage(0); }} presets={PRESETS_2D} />

            <div className="row" style={{ marginTop: 16 }}>
              <button className="btn" onClick={() => setStage(0)}>
                ↺ Reset
              </button>
              <button
                className="btn"
                onClick={() => setStage(1)}
                disabled={stage >= 1}
              >
                1. Áp {firstLabel}
              </button>
              <button
                className="btn btn-primary"
                onClick={() => setStage(2)}
                disabled={stage < 1}
              >
                2. Áp {secondLabel} (ra {productLabel})
              </button>
            </div>
            <div className="row" style={{ marginTop: 10 }}>
              <button
                className="btn"
                onClick={() => setOrder((o) => (o === 'AB' ? 'BA' : 'AB'))}
              >
                ⇄ Đổi thứ tự (đang xem {productLabel})
              </button>
            </div>

            <div className="panel" style={{ marginTop: 14, fontSize: 13.5 }}>
              <div className="mono" style={{ marginBottom: 6 }}>
                A·B = ({f2(AB[0][0])}, {f2(AB[0][1])}; {f2(AB[1][0])}, {f2(AB[1][1])})
              </div>
              <div className="mono">
                B·A = ({f2(BA[0][0])}, {f2(BA[0][1])}; {f2(BA[1][0])}, {f2(BA[1][1])})
              </div>
              <div className="muted" style={{ marginTop: 8 }}>
                Với preset mặc định (Shear và Xoay 90°): hai tích khác nhau — thứ tự
                thực sự quan trọng.
              </div>
            </div>
          </div>

          <div style={{ flex: '2 1 340px', minWidth: 300 }}>
            <Canvas2D height={420} range={5} matrix={asM2(display)} vectors={vectors} />
            <p className="dim" style={{ fontSize: 12, marginTop: 8 }}>
              Nhịp hiện tại:{' '}
              {stage === 0
                ? 'Identity (chưa biến đổi)'
                : stage === 1
                ? `Vừa áp ${firstLabel}`
                : `Đã áp ${secondLabel} → tổng cộng = ${productLabel}`}
            </p>
          </div>
        </div>
      </Section>

      <Section kind="theory" title="Vì sao nhân ma trận lại như thế?">
        <p>
          Định nghĩa gốc: <b>tích của hai ma trận là hợp của hai biến đổi</b>. Áp{' '}
          <MathText tex="B" /> trước, rồi áp <MathText tex="A" /> lên kết quả, chính là
          áp một biến đổi duy nhất ký hiệu <MathText tex="AB" />:
        </p>
        <MathText block tex="(AB)\,v = A\,(B\,v)" />
        <p>
          Chú ý thứ tự đọc: <b>từ phải sang trái</b> — <MathText tex="B" /> đứng cạnh{' '}
          <MathText tex="v" /> nên tác dụng trước. Từ ý này, mọi tính chất “rơi ra” tự
          nhiên:
        </p>
        <ul>
          <li>
            <b>Công thức hàng nhân cột</b>: cột thứ <MathText tex="j" /> của{' '}
            <MathText tex="AB" /> chính là <MathText tex="A" /> tác dụng lên cột thứ{' '}
            <MathText tex="j" /> của <MathText tex="B" /> (vì cột <MathText tex="j" />{' '}
            của <MathText tex="B" /> là nơi vector cơ sở đáp xuống sau <MathText tex="B" />,
            rồi <MathText tex="A" /> đưa nó đi tiếp). Viết ra thành phần:
            <MathText block tex="(AB)_{ij} = \sum_k A_{ik}\,B_{kj}" />
          </li>
          <li>
            <b>Không giao hoán</b>: “xoay rồi kéo nghiêng” khác “kéo nghiêng rồi xoay”,
            nên nói chung <MathText tex="AB \neq BA" />.
          </li>
          <li>
            <b>Kết hợp</b>: <MathText tex="(AB)C = A(BC)" /> là <i>hiển nhiên</i> — cả
            hai đều nghĩa là “làm C, rồi B, rồi A”. Hợp hàm luôn kết hợp.
          </li>
        </ul>
      </Section>

      <Section kind="steps" title="Nhân hai ma trận cụ thể từng bước">
        <p className="muted">
          Tính <MathText tex="AB" /> với{' '}
          <MathText tex="A=\begin{bmatrix}2&0\\1&3\end{bmatrix}" /> và{' '}
          <MathText tex="B=\begin{bmatrix}1&-1\\2&1\end{bmatrix}" />. Mỗi ô là “hàng của
          A · cột của B”.
        </p>
        <StepByStep
          steps={[
            {
              title: 'Bước 1 — Ô (1,1): hàng 1 của A · cột 1 của B',
              content: (
                <MathText
                  block
                  tex="(2,\,0)\cdot(1,\,2) = 2\cdot1 + 0\cdot2 = 2"
                />
              ),
            },
            {
              title: 'Bước 2 — Ô (1,2): hàng 1 của A · cột 2 của B',
              content: (
                <MathText
                  block
                  tex="(2,\,0)\cdot(-1,\,1) = 2\cdot(-1) + 0\cdot1 = -2"
                />
              ),
            },
            {
              title: 'Bước 3 — Ô (2,1): hàng 2 của A · cột 1 của B',
              content: (
                <MathText block tex="(1,\,3)\cdot(1,\,2) = 1\cdot1 + 3\cdot2 = 7" />
              ),
            },
            {
              title: 'Bước 4 — Ô (2,2): hàng 2 của A · cột 2 của B',
              content: (
                <MathText
                  block
                  tex="(1,\,3)\cdot(-1,\,1) = 1\cdot(-1) + 3\cdot1 = 2"
                />
              ),
            },
            {
              title: 'Kết quả',
              content: (
                <div>
                  <MathText
                    block
                    tex="AB = \begin{bmatrix} 2 & -2 \\ 7 & 2 \end{bmatrix}"
                  />
                  <p className="muted">
                    Thử tính <MathText tex="BA" /> để tự thấy nó ra khác —{' '}
                    <MathText tex="BA=\begin{bmatrix}1&-3\\5&3\end{bmatrix}" />.
                  </p>
                </div>
              ),
            },
          ]}
        />
      </Section>

      <Section kind="quiz" title="Kiểm tra hiểu">
        <Quiz
          lessonKey="ch3/composition"
          questions={[
            {
              q: <>Trong biểu thức <MathText tex="AB\,v" />, biến đổi nào tác dụng lên v trước?</>,
              options: [
                <><MathText tex="B" /> (ma trận sát v nhất)</>,
                <><MathText tex="A" /> (ma trận bên trái)</>,
                <>Cả hai cùng lúc</>,
                <>Tùy dấu của determinant</>,
              ],
              answer: 0,
              explain: (
                <>
                  <MathText tex="(AB)v = A(Bv)" />: đọc từ phải sang trái,{' '}
                  <MathText tex="B" /> làm trước.
                </>
              ),
            },
            {
              q: <>Nói chung, <MathText tex="AB" /> và <MathText tex="BA" />:</>,
              options: [
                <>Có thể khác nhau — nhân ma trận không giao hoán</>,
                <>Luôn bằng nhau</>,
                <>Luôn là ma trận không</>,
                <>Chỉ bằng nhau khi cùng kích thước</>,
              ],
              answer: 0,
              explain: (
                <>
                  “Xoay rồi shear” khác “shear rồi xoay”. Thứ tự đổi thì kết quả đổi.
                </>
              ),
            },
            {
              q: <>Cột thứ 2 của tích <MathText tex="AB" /> bằng:</>,
              options: [
                <><MathText tex="A" /> nhân với cột thứ 2 của <MathText tex="B" /></>,
                <><MathText tex="B" /> nhân với cột thứ 2 của <MathText tex="A" /></>,
                <>Cột 2 của A cộng cột 2 của B</>,
                <>Luôn là <MathText tex="(0,1)" /></>,
              ],
              answer: 0,
              explain: (
                <>
                  Cột <MathText tex="j" /> của <MathText tex="AB" /> là{' '}
                  <MathText tex="A" /> tác dụng lên cột <MathText tex="j" /> của{' '}
                  <MathText tex="B" />.
                </>
              ),
            },
            {
              q: <>Vì sao <MathText tex="(AB)C = A(BC)" /> luôn đúng?</>,
              options: [
                <>Vì hợp hàm luôn kết hợp — cả hai nghĩa là “làm C, rồi B, rồi A”</>,
                <>Vì determinant bằng nhau</>,
                <>Vì ma trận luôn khả nghịch</>,
                <>Nó không phải lúc nào cũng đúng</>,
              ],
              answer: 0,
              explain: (
                <>
                  Nhân ma trận là hợp biến đổi, mà hợp hàm luôn kết hợp, nên tính kết
                  hợp là hiển nhiên.
                </>
              ),
            },
          ]}
        />
      </Section>
    </Lesson>
  );
}
