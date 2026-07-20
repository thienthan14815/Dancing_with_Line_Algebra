import { useState } from 'react';
import { Lesson, Section } from '../../components/Lesson';
import MathText from '../../components/MathText';
import Canvas2D, { type V2 } from '../../components/Canvas2D';
import Scene3D from '../../components/Scene3D';
import MatrixInput from '../../components/MatrixInput';
import StepByStep from '../../components/StepByStep';
import Quiz from '../../components/Quiz';
import { det, type Mat } from '../../lib/linalg';
import { asM2, f2, PRESETS_2D, UNIT_SQUARE } from './util';

// 8 đỉnh khối lập phương đơn vị [0,1]^3 và 12 cạnh nối chúng.
const CUBE: [number, number, number][] = [
  [0, 0, 0],
  [1, 0, 0],
  [1, 1, 0],
  [0, 1, 0],
  [0, 0, 1],
  [1, 0, 1],
  [1, 1, 1],
  [0, 1, 1],
];
const CUBE_EDGES: [number, number][] = [
  [0, 1], [1, 2], [2, 3], [3, 0], // đáy
  [4, 5], [5, 6], [6, 7], [7, 4], // nắp
  [0, 4], [1, 5], [2, 6], [3, 7], // cạnh đứng
];

const PRESETS_3D: { label: string; m: Mat }[] = [
  { label: 'Identity', m: [[1, 0, 0], [0, 1, 0], [0, 0, 1]] },
  { label: 'Co giãn 2×', m: [[2, 0, 0], [0, 1, 0], [0, 0, 1]] },
  { label: 'Phóng to đều', m: [[1.5, 0, 0], [0, 1.5, 0], [0, 0, 1.5]] },
  { label: 'Shear', m: [[1, 0.7, 0], [0, 1, 0], [0, 0, 1]] },
  { label: 'Suy biến (bẹp)', m: [[1, 0, 0], [0, 1, 0], [0, 0, 0]] },
];

export default function Lesson3Determinant() {
  const [M, setM] = useState<Mat>([
    [2, 0.5],
    [0.5, 1.5],
  ]);
  const [M3, setM3] = useState<Mat>(PRESETS_3D[3].m);

  const d = det(M);
  const d3 = det(M3);

  // Màu hình bình hành theo dấu det
  const nearZero = Math.abs(d) < 0.05;
  const fill = nearZero
    ? 'var(--bad)'
    : d < 0
    ? 'var(--vec-2)'
    : 'var(--vec-3)';

  const vectors: V2[] = [
    { id: 'i', x: 1, y: 0, color: 'var(--vec-1)', label: 'î' },
    { id: 'j', x: 0, y: 1, color: 'var(--vec-2)', label: 'ĵ' },
  ];

  const lines3 = CUBE_EDGES.map(([a, b]) => ({
    from: CUBE[a],
    to: CUBE[b],
    color: Math.abs(d3) < 0.05 ? '#ef4444' : '#38bdf8',
  }));

  return (
    <Lesson id="ch3-determinant" title="Determinant">
      <p className="muted">
        Khi một biến đổi bóp méo mặt phẳng, diện tích các hình cũng thay đổi. Con số đo{' '}
        <b>chính xác</b> mức phóng đại đó — kèm cả <b>hướng</b> — gọi là{' '}
        <b>determinant</b>.
      </p>

      <Section kind="explore" title="Hình vuông đơn vị nở, bẹp, và lật">
        <p className="muted" style={{ marginTop: 0 }}>
          <b>Gợi ý thao tác:</b> Đổi ma trận và quan sát hình vuông đơn vị biến thành
          hình bình hành. Số <b>det(A)</b> chính là diện tích (có dấu) của nó. Thử
          preset <b>Đối xứng</b> để thấy det đổi dấu (hình <span style={{ color: 'var(--vec-2)' }}>lật</span>), và{' '}
          <b>Suy biến</b> để thấy hình <span style={{ color: 'var(--bad)' }}>bẹp thành đường</span> (det = 0).
        </p>
        <div className="row" style={{ alignItems: 'flex-start', gap: 24 }}>
          <div style={{ flex: '1 1 260px', minWidth: 240 }}>
            <MatrixInput value={M} onChange={setM} presets={PRESETS_2D} />
            <div
              className="panel"
              style={{ marginTop: 14, textAlign: 'center', padding: '18px 12px' }}
            >
              <div style={{ fontSize: 13, color: 'var(--text-muted)' }}>
                det(A) = ad − bc
              </div>
              <div
                style={{
                  fontSize: 30,
                  fontWeight: 700,
                  color: fill,
                  fontFamily: 'var(--font-mono)',
                }}
              >
                {f2(d)}
              </div>
              <div style={{ fontSize: 13, color: 'var(--text-muted)' }}>
                {nearZero
                  ? 'Bẹp mất chiều — diện tích = 0'
                  : d < 0
                  ? 'Âm → định hướng bị lật (î, ĵ đổi bên)'
                  : 'Dương → diện tích phóng đại ' + f2(Math.abs(d)) + ' lần'}
              </div>
            </div>
          </div>
          <div style={{ flex: '2 1 340px', minWidth: 300 }}>
            <Canvas2D
              height={420}
              range={5}
              matrix={asM2(M)}
              vectors={vectors}
              polygons={[{ points: UNIT_SQUARE, fill, opacity: 0.35, stroke: fill }]}
            />
          </div>
        </div>
      </Section>

      <Section kind="explore" title="Lên 3 chiều: det = thể tích khối">
        <p className="muted" style={{ marginTop: 0 }}>
          <b>Gợi ý thao tác:</b> Kéo chuột để xoay góc nhìn. Với ma trận 3×3, det chính
          là <b>thể tích</b> của khối lập phương đơn vị sau khi bị biến đổi. Preset{' '}
          <b>Suy biến</b> ép khối bẹp thành một mặt phẳng — thể tích 0.
        </p>
        <div className="presets" style={{ marginBottom: 12 }}>
          {PRESETS_3D.map((p, i) => (
            <button key={i} className="preset-btn" onClick={() => setM3(p.m)}>
              {p.label}
            </button>
          ))}
        </div>
        <Scene3D height={420} matrix={M3} lines3={lines3} />
        <div className="panel" style={{ marginTop: 12, textAlign: 'center' }}>
          <span style={{ color: 'var(--text-muted)' }}>Thể tích khối = </span>
          <span
            style={{
              fontSize: 22,
              fontWeight: 700,
              fontFamily: 'var(--font-mono)',
              color: Math.abs(d3) < 0.05 ? 'var(--bad)' : 'var(--accent)',
            }}
          >
            det = {f2(d3)}
          </span>
        </div>
      </Section>

      <Section kind="theory" title="Ý nghĩa của determinant">
        <p>
          <b>Determinant là hệ số phóng đại diện tích (2D) hay thể tích (3D), có dấu.</b>{' '}
          Nếu det(A) = 3 thì mọi hình sau biến đổi có diện tích gấp 3 lần hình gốc.
        </p>
        <ul>
          <li>
            <b>Dấu = định hướng.</b> det &gt; 0: hệ trục giữ nguyên chiều. det &lt; 0:
            không gian bị “lật mặt” (như soi gương) — thứ tự î, ĵ đảo ngược.
          </li>
          <li>
            <b>det = 0 ⟺ bẹp mất chiều.</b> Biến đổi ép cả mặt phẳng vào một đường
            thẳng (hoặc một điểm). Khi đó vô số điểm dồn về cùng một chỗ, nên{' '}
            <b>không thể đảo ngược</b> — đây là cầu nối sang bài ma trận nghịch đảo.
          </li>
        </ul>
        <p>Công thức 2×2 đến từ diện tích hình bình hành dựng bởi hai cột:</p>
        <MathText
          block
          tex="\det\begin{bmatrix} a & b \\ c & d \end{bmatrix} = ad - bc"
        />
        <p className="muted">
          Hai cột <MathText tex="(a,c)" /> và <MathText tex="(b,d)" /> là hai cạnh của
          hình bình hành; <MathText tex="ad-bc" /> đúng bằng diện tích có dấu của nó
          (dùng công thức tích chéo).
        </p>
      </Section>

      <Section kind="steps" title="Tính determinant từng bước">
        <StepByStep
          steps={[
            {
              title: 'det 2×2 — công thức chéo',
              content: (
                <div>
                  <MathText
                    block
                    tex="\det\begin{bmatrix} 3 & 1 \\ 2 & 4 \end{bmatrix} = (3)(4) - (1)(2)"
                  />
                  <MathText block tex="= 12 - 2 = 10" />
                  <p className="muted">
                    Đường chéo chính trừ đường chéo phụ. Diện tích phóng đại 10 lần.
                  </p>
                </div>
              ),
            },
            {
              title: 'det 3×3 — khai triển theo hàng 1',
              content: (
                <div>
                  <MathText
                    block
                    tex="\det\begin{bmatrix} 1 & 2 & 3 \\ 0 & 1 & 4 \\ 0 & 0 & 2 \end{bmatrix} = 1\cdot M_{11} - 2\cdot M_{12} + 3\cdot M_{13}"
                  />
                  <p className="muted">
                    Mỗi <MathText tex="M_{1j}" /> là det của ma trận 2×2 còn lại khi bỏ
                    hàng 1 và cột <MathText tex="j" />, kèm dấu xen kẽ + − +.
                  </p>
                </div>
              ),
            },
            {
              title: 'Tính từng minor',
              content: (
                <div>
                  <MathText
                    block
                    tex="M_{11}=\det\begin{bmatrix}1&4\\0&2\end{bmatrix}=2,\quad M_{12}=\det\begin{bmatrix}0&4\\0&2\end{bmatrix}=0,\quad M_{13}=\det\begin{bmatrix}0&1\\0&0\end{bmatrix}=0"
                  />
                </div>
              ),
            },
            {
              title: 'Gộp lại',
              content: (
                <div>
                  <MathText block tex="\det = 1\cdot2 - 2\cdot0 + 3\cdot0 = 2" />
                  <p className="muted">
                    Mẹo: ma trận tam giác trên có det = tích các phần tử chéo{' '}
                    <MathText tex="1\cdot1\cdot2 = 2" /> — khớp!
                  </p>
                </div>
              ),
            },
          ]}
        />
      </Section>

      <Section kind="quiz" title="Kiểm tra hiểu">
        <Quiz
          lessonKey="ch3/determinant"
          questions={[
            {
              q: <>det(A) = 0 có nghĩa hình học là gì?</>,
              options: [
                <>Biến đổi ép không gian bẹp mất chiều (diện tích/thể tích = 0)</>,
                <>Biến đổi giữ nguyên diện tích</>,
                <>Biến đổi là phép xoay</>,
                <>Ma trận là identity</>,
              ],
              answer: 0,
              explain: (
                <>
                  det = 0 nghĩa là các cột phụ thuộc tuyến tính, hình bị bẹp — và biến
                  đổi không đảo ngược được.
                </>
              ),
            },
            {
              q: (
                <>
                  Tính <MathText tex="\det\begin{bmatrix}2&1\\1&3\end{bmatrix}" />.
                </>
              ),
              options: [<>5</>, <>6</>, <>7</>, <>1</>],
              answer: 0,
              explain: <><MathText tex="2\cdot3 - 1\cdot1 = 5" />.</>,
            },
            {
              q: <>det(A) &lt; 0 cho biết điều gì về biến đổi?</>,
              options: [
                <>Nó lật định hướng của không gian (như soi gương)</>,
                <>Nó không tồn tại</>,
                <>Diện tích bằng 0</>,
                <>Nó luôn là phép chiếu</>,
              ],
              answer: 0,
              explain: (
                <>
                  Dấu âm nghĩa là thứ tự î, ĵ bị đảo — không gian bị lật mặt. Độ lớn vẫn
                  là hệ số phóng đại diện tích.
                </>
              ),
            },
            {
              q: (
                <>
                  Với ma trận 3×3, |det| bằng đại lượng hình học nào?
                </>
              ),
              options: [
                <>Thể tích khối lập phương đơn vị sau biến đổi</>,
                <>Chu vi của khối</>,
                <>Tổng các phần tử</>,
                <>Số cột của ma trận</>,
              ],
              answer: 0,
              explain: (
                <>
                  det 3×3 là hệ số phóng đại thể tích — |det| chính là thể tích khối đơn
                  vị sau khi biến đổi.
                </>
              ),
            },
          ]}
        />
      </Section>
    </Lesson>
  );
}
