import { useState } from 'react';
import { Lesson, Section } from '../../components/Lesson';
import MathText from '../../components/MathText';
import Canvas2D, { type V2 } from '../../components/Canvas2D';
import Quiz from '../../components/Quiz';
import { rotation2D, type Mat } from '../../lib/linalg';
import { asM2, circlePts } from './util';

const I2: Mat = [
  [1, 0],
  [0, 1],
];

interface Special {
  key: string;
  label: string;
  m: Mat;
  tex: string;
  algebra: string;
  geo: string;
  isProjection?: boolean;
  isOrthogonal?: boolean;
}

const TYPES: Special[] = [
  {
    key: 'identity',
    label: 'Identity',
    m: I2,
    tex: '\\begin{bmatrix} 1 & 0 \\\\ 0 & 1 \\end{bmatrix}',
    algebra: 'Đường chéo toàn số 1, còn lại là 0.',
    geo: 'Không làm gì cả — mọi điểm đứng yên. Phần tử trung hòa của phép nhân ma trận.',
  },
  {
    key: 'diagonal',
    label: 'Diagonal',
    m: [
      [2, 0],
      [0, 0.5],
    ],
    tex: '\\begin{bmatrix} 2 & 0 \\\\ 0 & 0.5 \\end{bmatrix}',
    algebra: 'Chỉ có phần tử trên đường chéo.',
    geo: 'Co giãn dọc theo từng trục độc lập: trục x ×2, trục y ×0.5. Không xoay, không nghiêng.',
  },
  {
    key: 'symmetric',
    label: 'Symmetric',
    m: [
      [2, 1],
      [1, 2],
    ],
    tex: '\\begin{bmatrix} 2 & 1 \\\\ 1 & 2 \\end{bmatrix}',
    algebra: 'Đối xứng qua đường chéo: Aᵀ = A (a₁₂ = a₂₁).',
    geo: 'Co giãn dọc theo hai trục vuông góc nào đó (không nhất thiết là Ox, Oy). Đây là loại ma trận sẽ tỏa sáng ở chương 5 (eigen) và chương 6 (SVD).',
  },
  {
    key: 'orthogonal',
    label: 'Orthogonal',
    m: rotation2D((40 * Math.PI) / 180),
    tex: '\\begin{bmatrix} \\cos\\theta & -\\sin\\theta \\\\ \\sin\\theta & \\cos\\theta \\end{bmatrix}',
    algebra: 'Các cột trực chuẩn: QᵀQ = I, và |det| = 1.',
    geo: 'Xoay hoặc đối xứng — BẢO TOÀN độ dài và góc. Nhìn đường tròn đơn vị: nó vẫn tròn, không hề méo.',
    isOrthogonal: true,
  },
  {
    key: 'projection',
    label: 'Projection',
    m: [
      [1, 0],
      [0, 0],
    ],
    tex: '\\begin{bmatrix} 1 & 0 \\\\ 0 & 0 \\end{bmatrix}',
    algebra: 'Lũy đẳng: P² = P (bình phương bằng chính nó).',
    geo: 'Bẹp mọi điểm xuống trục Ox. Đã chiếu một lần rồi thì chiếu thêm lần nữa cũng không đổi gì — vì điểm đã nằm sẵn trên trục.',
    isProjection: true,
  },
];

export default function Lesson5Special() {
  const [idx, setIdx] = useState(0);
  const [projStage, setProjStage] = useState(0); // 0 = identity, 1 = áp P, 2 = áp P lần 2
  const t = TYPES[idx];

  const select = (i: number) => {
    setIdx(i);
    setProjStage(0);
  };

  // Ma trận đưa vào Canvas2D
  let display: Mat = t.m;
  if (t.isProjection) {
    display = projStage === 0 ? I2 : t.m; // lần 2 vẫn = P (P²=P) nên không đổi
  }

  const vectors: V2[] = [
    { id: 'i', x: 1, y: 0, color: 'var(--vec-1)', label: 'î' },
    { id: 'j', x: 0, y: 1, color: 'var(--vec-2)', label: 'ĵ' },
  ];

  return (
    <Lesson id="ch3-special" title="Các ma trận đặc biệt">
      <p className="muted">
        Một số dạng ma trận xuất hiện đi xuất hiện lại vì chúng ứng với những biến đổi
        hình học “sạch đẹp”. Nhận ra chúng qua <b>đặc điểm đại số</b> và đọc ngay được{' '}
        <b>ý nghĩa hình học</b>.
      </p>

      <Section kind="explore" title="Gallery: bấm để xem từng loại">
        <p className="muted" style={{ marginTop: 0 }}>
          <b>Gợi ý thao tác:</b> Bấm từng loại và xem lưới cùng đường tròn đơn vị biến
          đổi. Chú ý đặc biệt <b>Orthogonal</b> — đường tròn không méo (bảo toàn độ
          dài) — và <b>Projection</b> — thử áp hai lần để thấy lần thứ hai không thay
          đổi gì.
        </p>
        <div className="presets" style={{ marginBottom: 14 }}>
          {TYPES.map((ty, i) => (
            <button
              key={ty.key}
              className="preset-btn"
              style={
                i === idx
                  ? { borderColor: 'var(--accent)', color: 'var(--accent)' }
                  : undefined
              }
              onClick={() => select(i)}
            >
              {ty.label}
            </button>
          ))}
        </div>

        <div className="row" style={{ alignItems: 'flex-start', gap: 24 }}>
          <div style={{ flex: '1 1 260px', minWidth: 240 }}>
            <div className="panel">
              <div style={{ fontWeight: 700, fontSize: 16, marginBottom: 8 }}>
                {t.label}
              </div>
              <MathText block tex={'A = ' + t.tex} />
              <div style={{ fontSize: 13.5, marginTop: 8 }}>
                <div style={{ marginBottom: 6 }}>
                  <span style={{ color: 'var(--accent)', fontWeight: 600 }}>
                    Đại số:
                  </span>{' '}
                  {t.algebra}
                </div>
                <div>
                  <span style={{ color: 'var(--vec-3)', fontWeight: 600 }}>
                    Hình học:
                  </span>{' '}
                  {t.geo}
                </div>
              </div>
            </div>

            {t.isProjection && (
              <div className="row" style={{ marginTop: 14 }}>
                <button className="btn" onClick={() => setProjStage(0)}>
                  ↺ Reset
                </button>
                <button
                  className="btn btn-primary"
                  onClick={() => setProjStage(1)}
                  disabled={projStage >= 1}
                >
                  Áp P
                </button>
                <button
                  className="btn"
                  onClick={() => setProjStage(2)}
                  disabled={projStage < 1}
                >
                  Áp P lần 2
                </button>
                {projStage === 2 && (
                  <span className="dim" style={{ fontSize: 12 }}>
                    Không đổi gì — vì P² = P.
                  </span>
                )}
              </div>
            )}
          </div>

          <div style={{ flex: '2 1 340px', minWidth: 300 }}>
            <Canvas2D
              height={420}
              range={4}
              matrix={asM2(display)}
              vectors={vectors}
              polygons={[
                {
                  points: circlePts(48),
                  fill: t.isOrthogonal ? 'var(--vec-3)' : 'var(--accent-2)',
                  opacity: 0.15,
                  stroke: t.isOrthogonal ? 'var(--vec-3)' : 'var(--accent-2)',
                },
              ]}
            />
            <p className="dim" style={{ fontSize: 12, marginTop: 8 }}>
              {t.isOrthogonal
                ? 'Đường tròn đơn vị vẫn tròn → độ dài được bảo toàn.'
                : t.isProjection
                ? 'Đường tròn bị bẹp xuống trục Ox → thông tin chiều dọc mất đi.'
                : 'Đường tròn biến thành ellipse → độ dài bị co giãn theo hướng.'}
            </p>
          </div>
        </div>
      </Section>

      <Section kind="theory" title="Điểm mặt từng loại">
        <p>
          <b>Identity <MathText tex="I" />.</b> Biến đổi “không làm gì”. Đóng vai trò số
          1 trong phép nhân: <MathText tex="AI = IA = A" />.
        </p>
        <p>
          <b>Diagonal.</b> Chỉ co giãn theo các trục tọa độ. Nhân/lũy thừa cực dễ: chỉ
          việc nhân/lũy thừa từng phần tử chéo. Đây là “dạng đơn giản nhất” mà ta luôn
          muốn đưa ma trận về (chương 5).
        </p>
        <p>
          <b>Symmetric <MathText tex="A^{T}=A" />.</b> Luôn co giãn dọc theo một bộ trục{' '}
          <b>vuông góc</b>. Nhờ tính chất đẹp này, ma trận symmetric có eigenvector trực
          giao và eigenvalue thực — <i>hé mở</i>: nó là ngôi sao của{' '}
          <b>chương 5 (eigen)</b> và <b>chương 6 (SVD)</b>.
        </p>
        <p>
          <b>Orthogonal <MathText tex="Q^{T}Q=I" />.</b> Xoay hoặc đối xứng, bảo toàn độ
          dài và góc (<MathText tex="\lVert Qx\rVert = \lVert x\rVert" />). Nghịch đảo
          bằng đúng chuyển vị: <MathText tex="Q^{-1}=Q^{T}" /> — cực rẻ để tính.
        </p>
        <p>
          <b>Projection <MathText tex="P^{2}=P" />.</b> Chiếu (bẹp) không gian xuống một
          không gian con. Chiếu lần hai không thêm gì vì điểm đã nằm sẵn ở đó. Luôn có{' '}
          <MathText tex="\det = 0" /> nếu chiếu xuống chiều thấp hơn → không nghịch đảo
          được.
        </p>
      </Section>

      <Section kind="quiz" title="Kiểm tra hiểu">
        <Quiz
          lessonKey="ch3/special"
          questions={[
            {
              q: <>Ma trận orthogonal <MathText tex="Q" /> có tính chất hình học nào?</>,
              options: [
                <>Bảo toàn độ dài và góc (xoay hoặc đối xứng)</>,
                <>Luôn làm bẹp không gian</>,
                <>Luôn phóng to gấp đôi</>,
                <>Luôn có det = 0</>,
              ],
              answer: 0,
              explain: (
                <>
                  <MathText tex="Q^TQ=I" /> ⇒ <MathText tex="\lVert Qx\rVert=\lVert x\rVert" />.
                  Đường tròn đơn vị vẫn tròn.
                </>
              ),
            },
            {
              q: <>Điều kiện đại số của ma trận projection là gì?</>,
              options: [
                <><MathText tex="P^2 = P" /> (lũy đẳng)</>,
                <><MathText tex="P^T = P^{-1}" /></>,
                <><MathText tex="\det P = 1" /></>,
                <><MathText tex="P = I" /></>,
              ],
              answer: 0,
              explain: (
                <>
                  Chiếu hai lần bằng chiếu một lần: <MathText tex="P^2=P" />.
                </>
              ),
            },
            {
              q: <>Ma trận symmetric thỏa mãn:</>,
              options: [
                <><MathText tex="A^T = A" /></>,
                <><MathText tex="A^T = -A" /></>,
                <><MathText tex="A^2 = I" /></>,
                <><MathText tex="\det A = 0" /></>,
              ],
              answer: 0,
              explain: (
                <>
                  Đối xứng qua đường chéo chính: <MathText tex="a_{ij}=a_{ji}" />, tức{' '}
                  <MathText tex="A^T=A" />.
                </>
              ),
            },
            {
              q: <>Ma trận diagonal <MathText tex="\begin{bmatrix}3&0\\0&2\end{bmatrix}" /> làm gì với mặt phẳng?</>,
              options: [
                <>Kéo giãn trục x ×3 và trục y ×2, không xoay</>,
                <>Xoay 90°</>,
                <>Chiếu xuống trục Ox</>,
                <>Giữ nguyên mọi thứ</>,
              ],
              answer: 0,
              explain: (
                <>
                  Ma trận chéo co giãn độc lập theo từng trục tọa độ — không nghiêng,
                  không xoay.
                </>
              ),
            },
          ]}
        />
      </Section>
    </Lesson>
  );
}
