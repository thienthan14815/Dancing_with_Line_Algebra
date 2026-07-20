import { useState } from 'react';
import { Lesson, Section } from '../../components/Lesson';
import MathText from '../../components/MathText';
import MatrixInput from '../../components/MatrixInput';
import StepByStep from '../../components/StepByStep';
import Quiz from '../../components/Quiz';
import { qr, matMul, transpose, type Mat } from '../../lib/linalg';
import { matTex, Stat, StatRow, Hint, DeepDive } from './_shared';

const PRESETS: { label: string; m: Mat }[] = [
  { label: 'Cột (1,1),(2,0)', m: [[1, 2], [1, 0]] },
  { label: 'Cột (2,1),(1,3)', m: [[2, 1], [1, 3]] },
  { label: 'Đã trực giao', m: [[1, 1], [1, -1]] },
  { label: 'Shear', m: [[1, 1], [0, 1]] },
];

export default function QRLesson() {
  const [A, setA] = useState<Mat>([[1, 2], [1, 0]]);
  const { Q, R } = qr(A);
  const n = A.length;
  const okCols = Q.length > 0 && (Q[0]?.length ?? 0) === n; // đủ cột trực chuẩn ⇒ cột A độc lập
  const QR = matMul(Q, R);
  const QtQ = matMul(transpose(Q), Q);

  return (
    <Lesson id="qr" title="QR decomposition">
      <Section kind="explore" title="Nhập A, xem Q và R">
        <div style={{ display: 'flex', gap: 20, flexWrap: 'wrap', alignItems: 'flex-start' }}>
          <div>
            <div className="dim" style={{ fontSize: 12, marginBottom: 6 }}>Ma trận A (2×2)</div>
            <MatrixInput value={A} onChange={setA} presets={PRESETS} />
          </div>
        </div>

        {okCols ? (
          <>
            <div style={{ marginTop: 16 }}>
              <MathText block tex={`A = ${matTex(A)} = Q R`} />
              <MathText block tex={`Q = ${matTex(Q)} \\qquad R = ${matTex(R)}`} />
            </div>
            <StatRow>
              <Stat label="Q trực chuẩn?" value="QᵀQ = I" color="var(--vec-3)" />
              <Stat label="R tam giác trên?" value={Math.abs(R[1][0]) < 1e-6 ? 'đúng ✓' : 'không'} color="var(--vec-3)" />
            </StatRow>
            <div style={{ marginTop: 12 }}>
              <div className="dim" style={{ fontSize: 12, marginBottom: 4 }}>Kiểm chứng</div>
              <MathText block tex={`QR = ${matTex(QR)} \\approx A \\qquad Q^\\top Q = ${matTex(QtQ)} \\approx I`} />
            </div>
            <Hint>
              Đổi các số hoặc bấm preset. <b>Q</b> luôn có cột <b>orthonormal</b> (nên{' '}
              <MathText tex="Q^\top Q = I" />), còn <b>R</b> luôn <b>tam giác trên</b> (góc dưới bên
              trái bằng 0). Nhân lại <MathText tex="QR" /> ra đúng A. Preset "Đã trực giao" cho R là
              ma trận đường chéo vì hai cột vốn đã vuông góc.
            </Hint>
          </>
        ) : (
          <p className="panel" style={{ marginTop: 16 }}>
            Hai cột của A đang <b>phụ thuộc tuyến tính</b> (cùng phương) nên không dựng được QR đầy
            đủ. Hãy chọn A có hai cột độc lập — ví dụ bấm một preset ở trên.
          </p>
        )}
      </Section>

      <Section kind="theory" title="QR = đóng gói Gram–Schmidt thành hai ma trận">
        <p>
          Phân tích <b>QR</b> viết một ma trận A (cột độc lập) thành tích của một ma trận có cột
          orthonormal và một ma trận tam giác trên:
        </p>
        <MathText block tex="A = Q R, \qquad Q^\top Q = I,\quad R\ \text{tam giác trên}." />
        <p>
          Đây chính là Gram–Schmidt viết gọn. Chạy Gram–Schmidt trên các <b>cột</b>{' '}
          <MathText tex="a_1,\dots,a_n" /> của A cho ra các cột orthonormal{' '}
          <MathText tex="q_1,\dots,q_n" /> (chính là Q). Còn R ghi lại "công thức dựng lại" mỗi cột{' '}
          <MathText tex="a_i" /> từ các q:
        </p>
        <MathText block tex="a_i = \sum_{j\le i} r_{ji}\,q_j, \qquad r_{ji} = q_j\cdot a_i, \quad r_{ii} = \|w_i\|." />
        <p>
          Vì <MathText tex="a_i" /> chỉ dùng tới <MathText tex="q_1,\dots,q_i" /> (những trục dựng
          xong <em>trước hoặc tại</em> bước i), các hệ số phía dưới đường chéo bằng 0 — nên R tam giác
          trên. <b>Ứng dụng:</b> QR giải hệ và least squares rất ổn định về số học, vì làm việc với
          ma trận trực giao (bảo toàn độ dài, không khuếch đại sai số làm tròn).
        </p>
        <DeepDive>
          <p>
            <b>Vì sao R tam giác trên, nhìn từ đại số.</b> Nhân <MathText tex="A = QR" /> hai vế bên
            trái với <MathText tex="Q^\top" /> và dùng <MathText tex="Q^\top Q = I" />:
          </p>
          <MathText block tex="R = Q^\top A, \qquad r_{ji} = q_j\cdot a_i." />
          <p>
            Với <MathText tex="j > i" />: cột <MathText tex="a_i" /> nằm trong{' '}
            <MathText tex="\mathrm{span}(q_1,\dots,q_i)" />, mà <MathText tex="q_j" /> (với{' '}
            <MathText tex="j>i" />) vuông góc với toàn bộ không gian đó, nên{' '}
            <MathText tex="r_{ji} = q_j\cdot a_i = 0" />. Đó chính là lý do mọi phần tử dưới đường
            chéo triệt tiêu.
          </p>
          <p>
            <b>Giải hệ bằng QR.</b> Từ <MathText tex="Ax=b" /> ta có{' '}
            <MathText tex="QRx = b \Rightarrow Rx = Q^\top b" /> — một hệ tam giác trên, giải bằng thế
            ngược cực nhanh và ổn định.
          </p>
        </DeepDive>
      </Section>

      <Section kind="steps" title="Tính QR bằng tay cho A với cột (1,1) và (2,0)">
        <StepByStep
          steps={[
            {
              title: 'Bài toán',
              content: (
                <p>
                  Phân tích <MathText tex="A = \begin{bmatrix} 1 & 2 \\ 1 & 0 \end{bmatrix}" /> — hai
                  cột là <MathText tex="a_1=(1,1)" /> và <MathText tex="a_2=(2,0)" />.
                </p>
              ),
            },
            {
              title: 'Bước 1 — q₁ và r₁₁',
              content: (
                <p>
                  <MathText tex="r_{11} = \|a_1\| = \sqrt2" />,{' '}
                  <MathText tex="q_1 = \tfrac{1}{\sqrt2}(1,1)" />.
                </p>
              ),
            },
            {
              title: 'Bước 2 — r₁₂ (bóng của a₂ lên q₁)',
              content: (
                <p>
                  <MathText tex="r_{12} = q_1\cdot a_2 = \tfrac{1}{\sqrt2}(2+0) = \sqrt2" />.
                </p>
              ),
            },
            {
              title: 'Bước 3 — w₂, r₂₂ và q₂',
              content: (
                <p>
                  <MathText tex="w_2 = a_2 - r_{12}q_1 = (2,0)-(1,1) = (1,-1)" />,{' '}
                  <MathText tex="r_{22} = \|w_2\| = \sqrt2" />,{' '}
                  <MathText tex="q_2 = \tfrac{1}{\sqrt2}(1,-1)" />.
                </p>
              ),
            },
            {
              title: 'Kết quả',
              content: (
                <>
                  <MathText
                    block
                    tex="Q = \frac{1}{\sqrt2}\begin{bmatrix} 1 & 1 \\ 1 & -1 \end{bmatrix}, \qquad R = \begin{bmatrix} \sqrt2 & \sqrt2 \\ 0 & \sqrt2 \end{bmatrix}"
                  />
                  <p>
                    Nhân thử: <MathText tex="QR = \begin{bmatrix} 1 & 2 \\ 1 & 0 \end{bmatrix} = A" />{' '}
                    ✓, và R đúng là tam giác trên.
                  </p>
                </>
              ),
            },
          ]}
        />
      </Section>

      <Section kind="quiz" title="Kiểm tra hiểu">
        <Quiz
          lessonKey="ch8/qr"
          questions={[
            {
              q: <>Trong phân tích <MathText tex="A = QR" />, ma trận Q có đặc điểm:</>,
              options: [
                'các cột orthonormal (QᵀQ = I)',
                'là ma trận đường chéo',
                'là ma trận tam giác dưới',
                'luôn bằng A',
              ],
              answer: 0,
              explain: <>Q gom các vector orthonormal do Gram–Schmidt sinh ra, nên <MathText tex="Q^\top Q = I" />.</>,
            },
            {
              q: <>Ma trận R trong QR là:</>,
              options: ['tam giác dưới', 'tam giác trên', 'phản đối xứng', 'trực giao'],
              answer: 1,
              explain: (
                <>
                  <MathText tex="r_{ji} = q_j\cdot a_i = 0" /> khi <MathText tex="j>i" /> vì{' '}
                  <MathText tex="a_i" /> chỉ dùng tới <MathText tex="q_1,\dots,q_i" />.
                </>
              ),
            },
            {
              q: <>QR về bản chất là đóng gói thuật toán nào?</>,
              options: ['Gauss elimination', 'Gram–Schmidt', 'phép quay Jacobi', 'khai triển Laplace'],
              answer: 1,
              explain: <>Chạy Gram–Schmidt trên các cột của A cho ra Q; các hệ số chiếu tạo thành R.</>,
            },
            {
              q: <>Vì sao QR được ưa dùng để giải least squares?</>,
              options: [
                'Vì Q trực giao nên bảo toàn độ dài, ít khuếch đại sai số làm tròn',
                'Vì R luôn bằng ma trận đơn vị',
                'Vì nó nhanh hơn mọi phương pháp khác trong mọi trường hợp',
                'Vì nó không cần dùng dot product',
              ],
              answer: 0,
              explain: (
                <>
                  Ma trận trực giao có số điều kiện bằng 1; dùng chúng thay cho{' '}
                  <MathText tex="A^\top A" /> giúp bài toán ổn định hơn nhiều.
                </>
              ),
            },
          ]}
        />
      </Section>
    </Lesson>
  );
}
