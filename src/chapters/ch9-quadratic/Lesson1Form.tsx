import { useState } from 'react';
import { Lesson, Section } from '../../components/Lesson';
import MathText from '../../components/MathText';
import Canvas2D, { type V2 } from '../../components/Canvas2D';
import MatrixInput from '../../components/MatrixInput';
import StepByStep from '../../components/StepByStep';
import Quiz from '../../components/Quiz';
import { quadraticForm, isSymmetric, type Mat } from '../../lib/linalg';
import { Contours, type ContourLevel } from './Contours';
import { f2, fSigned, n2, symmetrize } from './util';

const PRESETS: { label: string; m: Mat }[] = [
  { label: 'Ellipse', m: [[2, 1], [1, 2]] },
  { label: 'Hyperbola', m: [[1, 0], [0, -1]] },
  { label: 'Cặp đường thẳng', m: [[1, 0], [0, 0]] },
  { label: 'Lệch (không đối xứng)', m: [[1, 3], [-1, 2]] },
];

const POS_LEVELS: ContourLevel[] = [0.5, 1, 2, 4].map((L, i) => ({
  L,
  color: 'var(--vec-1)',
  opacity: 0.9 - i * 0.12,
  width: 1.6,
}));
const NEG_LEVELS: ContourLevel[] = [-0.5, -1, -2, -4].map((L, i) => ({
  L,
  color: 'var(--vec-2)',
  opacity: 0.9 - i * 0.12,
  width: 1.6,
}));

export default function Lesson1Form() {
  const [A, setA] = useState<Mat>([
    [2, 1],
    [1, 2],
  ]);
  const [x, setX] = useState({ x: 1.5, y: 0.5 });

  const S = symmetrize(A);
  const q = quadraticForm(A, [x.x, x.y]);
  const sym = isSymmetric(A);

  // Hệ số khai triển: a x² + (A01+A10) xy + c y²
  const a = A[0][0];
  const c = A[1][1];
  const mixed = A[0][1] + A[1][0];

  const highlight: ContourLevel[] =
    Math.abs(q) > 0.05
      ? [{ L: q, color: 'var(--vec-result)', width: 3, opacity: 1 }]
      : [];

  const vectors: V2[] = [
    { id: 'x', x: x.x, y: x.y, color: 'var(--vec-result)', label: 'x', draggable: true },
  ];

  return (
    <Lesson id="ch9-form" title="Dạng toàn phương xᵀAx">
      <p className="muted">
        Đến giờ ta luôn nhân ma trận với vector để được một <b>vector</b> khác:{' '}
        <MathText tex="A x" />. Bây giờ ta ghép thêm một tích vô hướng nữa để thu về một{' '}
        <b>con số</b>: <MathText tex="q(x) = x^{\top} A x" />. Hàm số bậc hai này —{' '}
        <b>dạng toàn phương</b> (quadratic form) — chính là ngôn ngữ của elip, hyperbol,
        năng lượng, và bài toán tối ưu.
      </p>

      <Section kind="explore" title="Kéo x, đọc q(x), và ngắm đường mức">
        <p className="muted" style={{ marginTop: 0 }}>
          <b>Nhiệm vụ:</b> Chỉnh ma trận <MathText tex="A" /> rồi kéo điểm{' '}
          <span style={{ color: 'var(--vec-result)' }}>x</span>. Con số{' '}
          <MathText tex="q(x)=x^{\top}Ax" /> đổi liên tục. Các đường{' '}
          <span style={{ color: 'var(--vec-1)' }}>xanh</span> là đường mức{' '}
          <MathText tex="q=c>0" />, các đường <span style={{ color: 'var(--vec-2)' }}>cam</span>{' '}
          là <MathText tex="q=c<0" />. Đường <span style={{ color: 'var(--vec-result)' }}>hồng</span>{' '}
          đậm là đường mức <b>đi qua đúng điểm x</b>. Thử từng preset: ellipse (chỉ có
          đường xanh), hyperbola (có cả xanh lẫn cam), cặp đường thẳng.
        </p>

        <div className="row" style={{ alignItems: 'flex-start', gap: 24 }}>
          <div style={{ flex: '1 1 280px', minWidth: 250 }}>
            <MatrixInput value={A} onChange={setA} presets={PRESETS} />
            <div className="panel" style={{ marginTop: 14, fontSize: 13.5 }}>
              <div style={{ marginBottom: 6 }}>
                x = <span className="mono">({f2(x.x)}, {f2(x.y)})</span>
              </div>
              <div
                style={{
                  padding: '10px 12px',
                  borderRadius: 8,
                  background: 'rgba(232,121,249,0.14)',
                  color: 'var(--vec-result)',
                  fontWeight: 600,
                  marginBottom: 10,
                }}
              >
                q(x) = xᵀAx ={' '}
                <span className="mono" style={{ fontSize: 18 }}>
                  {f2(q)}
                </span>
              </div>
              <div style={{ color: 'var(--text-muted)', marginBottom: 6 }}>Khai triển:</div>
              <MathText
                block
                tex={`q = ${n2(a)}x^2 ${fSigned(mixed)}xy ${fSigned(c)}y^2`}
              />
              <div
                style={{
                  marginTop: 8,
                  fontSize: 12.5,
                  color: sym ? 'var(--good)' : 'var(--warn)',
                }}
              >
                {sym ? (
                  <>✓ A đối xứng — chuẩn tắc cho dạng toàn phương.</>
                ) : (
                  <>
                    ⚠ A <b>không</b> đối xứng, nhưng q vẫn chỉ phụ thuộc phần đối xứng{' '}
                    <MathText tex="\tfrac{1}{2}(A+A^{\top})" />: hệ số của xy là{' '}
                    <span className="mono">{f2(mixed)}</span> (= tổng hai ô lệch).
                  </>
                )}
              </div>
            </div>
          </div>
          <div style={{ flex: '2 1 340px', minWidth: 300 }}>
            <Canvas2D
              height={420}
              range={5}
              vectors={vectors}
              onVectorChange={(id, nx, ny) => id === 'x' && setX({ x: nx, y: ny })}
            >
              <Contours A={S} levels={[...POS_LEVELS, ...NEG_LEVELS, ...highlight]} />
            </Canvas2D>
          </div>
        </div>
      </Section>

      <Section kind="theory" title="Định nghĩa: một hàm bậc hai gói trong một ma trận">
        <p>
          Cho ma trận vuông <MathText tex="A" /> cỡ <MathText tex="n\times n" /> và vector{' '}
          <MathText tex="x\in\mathbb{R}^n" />, <b>dạng toàn phương</b> ứng với{' '}
          <MathText tex="A" /> là hàm vô hướng
        </p>
        <MathText block tex="q(x) = x^{\top} A x = \sum_{i=1}^{n}\sum_{j=1}^{n} a_{ij}\,x_i x_j." />
        <p>
          Đây là đa thức <b>thuần bậc hai</b>: mỗi số hạng có đúng hai thừa số toạ độ. Trong
          hai chiều, viết tường minh với <MathText tex="A=\begin{bmatrix} a & b \\ b & c \end{bmatrix}" />:
        </p>
        <MathText
          block
          tex="q(x,y)=\begin{bmatrix} x & y \end{bmatrix}\begin{bmatrix} a & b \\ b & c \end{bmatrix}\begin{bmatrix} x \\ y \end{bmatrix} = a x^2 + 2b\,xy + c y^2."
        />
        <p>
          Ô đường chéo cho hệ số của <MathText tex="x^2, y^2" />; hai ô lệch{' '}
          <b>cộng lại</b> thành hệ số của <MathText tex="xy" />. Vì thế hệ số chéo{' '}
          <MathText tex="b" /> luôn là <b>một nửa</b> hệ số của <MathText tex="xy" /> — chi
          tiết dễ sai nhất khi lập ma trận.
        </p>

        <h3>Đào sâu — vì sao chỉ cần ma trận đối xứng?</h3>
        <p>
          Tách bất kỳ ma trận nào thành phần đối xứng và phần phản đối xứng:
        </p>
        <MathText
          block
          tex="A = \underbrace{\tfrac{1}{2}(A+A^{\top})}_{S=S^{\top}} + \underbrace{\tfrac{1}{2}(A-A^{\top})}_{K=-K^{\top}}."
        />
        <p>
          Phần phản đối xứng <MathText tex="K" /> đóng góp <b>0</b> vào dạng toàn phương. Thật
          vậy, <MathText tex="x^{\top}Kx" /> là một số nên bằng chuyển vị của chính nó:
        </p>
        <MathText
          block
          tex="x^{\top}Kx = (x^{\top}Kx)^{\top} = x^{\top}K^{\top}x = -\,x^{\top}Kx \;\Rightarrow\; x^{\top}Kx = 0."
        />
        <p>
          Do đó <MathText tex="q(x)=x^{\top}Ax = x^{\top}Sx" /> với mọi <MathText tex="x" />:
          hai ma trận khác nhau nhưng cùng phần đối xứng sinh ra <b>đúng cùng một</b> dạng
          toàn phương. Nên ta luôn quy ước chọn <MathText tex="A" /> đối xứng — không mất mát
          gì, mà lại mở khoá được cả kho định lý đẹp (spectral theorem ở bài sau) chỉ đúng
          cho ma trận đối xứng.
        </p>
      </Section>

      <Section kind="steps" title="Lập ma trận đối xứng từ một đa thức bậc hai">
        <StepByStep
          steps={[
            {
              title: 'Đề bài',
              content: (
                <div>
                  <p className="muted">Viết dạng toàn phương sau dưới dạng xᵀAx với A đối xứng:</p>
                  <MathText block tex="q(x,y) = 3x^2 - 4xy + 5y^2." />
                </div>
              ),
            },
            {
              title: 'Bước 1 — Đọc hệ số chéo chính',
              content: (
                <div>
                  <p className="muted">
                    Hệ số của <MathText tex="x^2" /> vào ô <MathText tex="a_{11}" />, của{' '}
                    <MathText tex="y^2" /> vào ô <MathText tex="a_{22}" />.
                  </p>
                  <MathText block tex="a_{11}=3,\qquad a_{22}=5." />
                </div>
              ),
            },
            {
              title: 'Bước 2 — Chia đôi hệ số của xy',
              content: (
                <div>
                  <p className="muted">
                    Hệ số của <MathText tex="xy" /> là <MathText tex="-4" />; ô lệch bằng một
                    nửa: <MathText tex="a_{12}=a_{21}=-2" />.
                  </p>
                  <MathText block tex="A = \begin{bmatrix} 3 & -2 \\ -2 & 5 \end{bmatrix}." />
                </div>
              ),
            },
            {
              title: 'Bước 3 — Kiểm chứng bằng cách khai triển ngược',
              content: (
                <MathText
                  block
                  tex="x^{\top}Ax = 3x^2 + 2(-2)xy + 5y^2 = 3x^2 - 4xy + 5y^2.\ \checkmark"
                />
              ),
            },
          ]}
        />
      </Section>

      <Section kind="quiz" title="Kiểm tra hiểu">
        <Quiz
          lessonKey="ch9/form"
          questions={[
            {
              q: (
                <>
                  Dạng toàn phương <MathText tex="q(x,y)=x^2 + 6xy + 2y^2" /> ứng với ma trận
                  đối xứng nào?
                </>
              ),
              options: [
                <MathText tex="\begin{bmatrix} 1 & 3 \\ 3 & 2 \end{bmatrix}" />,
                <MathText tex="\begin{bmatrix} 1 & 6 \\ 6 & 2 \end{bmatrix}" />,
                <MathText tex="\begin{bmatrix} 1 & 3 \\ 3 & 4 \end{bmatrix}" />,
                <MathText tex="\begin{bmatrix} 2 & 3 \\ 3 & 1 \end{bmatrix}" />,
              ],
              answer: 0,
              explain: (
                <>
                  Ô chéo là hệ số của <MathText tex="x^2,y^2" /> (1 và 2). Ô lệch là{' '}
                  <b>một nửa</b> hệ số <MathText tex="xy" />: <MathText tex="6/2=3" />.
                </>
              ),
            },
            {
              q: <>Vì sao ta luôn có thể chọn A đối xứng khi viết một dạng toàn phương?</>,
              options: [
                <>
                  Vì phần phản đối xứng của A thoả <MathText tex="x^{\top}Kx=0" /> nên không
                  ảnh hưởng q
                </>,
                <>Vì ma trận không đối xứng thì không nhân được với vector</>,
                <>Vì mọi ma trận đều đối xứng</>,
                <>Vì determinant khi đó luôn dương</>,
              ],
              answer: 0,
              explain: (
                <>
                  <MathText tex="x^{\top}Kx=(x^{\top}Kx)^{\top}=-x^{\top}Kx=0" />, nên q chỉ
                  phụ thuộc phần đối xứng <MathText tex="S=\tfrac12(A+A^{\top})" />.
                </>
              ),
            },
            {
              q: (
                <>
                  Với <MathText tex="A=\begin{bmatrix}2&0\\0&-1\end{bmatrix}" />, giá trị{' '}
                  <MathText tex="q(1,2)" /> bằng bao nhiêu?
                </>
              ),
              options: [
                <><MathText tex="2\cdot1^2 -1\cdot2^2 = -2" /></>,
                <><MathText tex="2\cdot1 + (-1)\cdot2 = 0" /></>,
                <><MathText tex="2+(-1)=1" /></>,
                <><MathText tex="6" /></>,
              ],
              answer: 0,
              explain: (
                <>
                  <MathText tex="q=2x^2-y^2=2(1)-1(4)=-2" />. Đây là ma trận đường chéo nên
                  không có số hạng <MathText tex="xy" />.
                </>
              ),
            },
            {
              q: <>Đường mức (level set) <MathText tex="q(x)=c" /> của một dạng toàn phương là gì?</>,
              options: [
                <>Một conic (ellipse, hyperbola hoặc cặp đường) — tuỳ dấu của A</>,
                <>Luôn luôn là một đường tròn</>,
                <>Luôn là một đường thẳng qua gốc</>,
                <>Một mặt phẳng trong không gian</>,
              ],
              answer: 0,
              explain: (
                <>
                  <MathText tex="q(x,y)=c" /> là phương trình bậc hai hai ẩn: pos-def cho
                  ellipse, indefinite cho hyperbola, suy biến cho cặp đường thẳng — đúng như
                  các preset bạn vừa thử.
                </>
              ),
            },
          ]}
        />
      </Section>
    </Lesson>
  );
}
