import { useState } from 'react';
import { Lesson, Section } from '../../components/Lesson';
import MathText from '../../components/MathText';
import Canvas2D, { type V2 } from '../../components/Canvas2D';
import Scene3D from '../../components/Scene3D';
import MatrixInput from '../../components/MatrixInput';
import Quiz from '../../components/Quiz';
import { matVec, type Mat } from '../../lib/linalg';
import {
  f2,
  vec2Str,
  Stat,
  StatRow,
  Hint,
  Callout,
  TwoCol,
  PanelLabel,
  HEX,
} from './_shared';

// Đường thẳng qua gốc theo hướng (dx, dy): dạng a·x + b·y = 0.
function lineThroughOrigin(dx: number, dy: number, color: string) {
  return { a: dy, b: -dx, c: 0, color };
}

const WHOLE_PLANE: [number, number][] = [
  [-6, -6],
  [6, -6],
  [6, 6],
  [-6, 6],
];

export default function ColNullLesson() {
  const [A, setA] = useState<Mat>([
    [2, 1],
    [1, 2],
  ]);

  const a = A[0][0];
  const b = A[0][1];
  const c = A[1][0];
  const d = A[1][1];
  const det = a * d - b * c;

  const col1: [number, number] = [a, c];
  const col2: [number, number] = [b, d];
  const allZero = [a, b, c, d].every((x) => Math.abs(x) < 1e-9);
  const rank = allZero ? 0 : Math.abs(det) < 1e-9 ? 1 : 2;

  // Hướng của column space (khi rank 1): cột khác 0.
  const colDir: [number, number] =
    Math.hypot(col1[0], col1[1]) > 1e-9 ? col1 : col2;

  // Null space (khi rank 1): lấy hàng khác 0, null dir = [-q, p].
  const row1: [number, number] = [a, b];
  const row2: [number, number] = [c, d];
  const nzRow = Math.hypot(row1[0], row1[1]) > 1e-9 ? row1 : row2;
  const nullDir: [number, number] = [-nzRow[1], nzRow[0]];

  // Điểm demo x trên đường null space và Ax (phải ≈ 0).
  const xDemo: [number, number] = [nullDir[0] * 1.5, nullDir[1] * 1.5];
  const Ax = matVec(A, xDemo) as [number, number];

  // ----- Canvas trái: Column space -----
  const colVectors: V2[] = [
    { id: 'c1', x: col1[0], y: col1[1], color: HEX.v1, label: 'cột 1' },
    { id: 'c2', x: col2[0], y: col2[1], color: HEX.v2, label: 'cột 2' },
  ];
  const colPolys =
    rank === 2 ? [{ points: WHOLE_PLANE, fill: HEX.v3, opacity: 0.16 }] : [];
  const colLines =
    rank === 1 ? [lineThroughOrigin(colDir[0], colDir[1], HEX.v3)] : [];

  // ----- Canvas phải: Null space -----
  const nullLines =
    rank === 1 ? [lineThroughOrigin(nullDir[0], nullDir[1], HEX.result)] : [];
  const nullPolys =
    rank === 0 ? [{ points: WHOLE_PLANE, fill: HEX.result, opacity: 0.16 }] : [];
  const nullPoints =
    rank === 1
      ? [{ x: xDemo[0], y: xDemo[1], color: HEX.result, label: 'x (Ax = 0)' }]
      : [{ x: 0, y: 0, color: HEX.result, label: 'chỉ O' }];

  const colDesc =
    rank === 2
      ? 'cả mặt phẳng ℝ²'
      : rank === 1
        ? 'một đường thẳng qua gốc'
        : 'chỉ điểm gốc {0}';
  const nullDesc =
    rank === 2
      ? 'chỉ điểm gốc {0}'
      : rank === 1
        ? 'một đường thẳng qua gốc'
        : 'cả mặt phẳng ℝ²';

  return (
    <Lesson id="colnull" title="Column space & Null space">
      <Section kind="explore" title="Hai không gian sinh ra từ một ma trận">
        <MatrixInput
          value={A}
          onChange={setA}
          presets={[
            { label: 'Khả nghịch', m: [[2, 1], [1, 2]] },
            { label: 'Suy biến [[1,2],[2,4]]', m: [[1, 2], [2, 4]] },
            { label: 'Ma trận 0', m: [[0, 0], [0, 0]] },
          ]}
        />
        <StatRow>
          <Stat label="det(A)" value={f2(det)} color={rank < 2 ? 'var(--warn)' : 'var(--good)'} />
          <Stat label="rank(A)" value={rank} />
        </StatRow>

        <TwoCol>
          <div>
            <PanelLabel>
              <span style={{ color: HEX.v3 }}>■</span> Column space C(A) — "cái A nhả ra được"
            </PanelLabel>
            <Canvas2D
              height={340}
              range={5}
              vectors={colVectors}
              polygons={colPolys}
              lines={colLines}
            />
            <p className="dim" style={{ fontSize: 12.5, marginTop: 4 }}>
              Span của 2 cột = <b>{colDesc}</b>.
            </p>
          </div>
          <div>
            <PanelLabel>
              <span style={{ color: HEX.result }}>■</span> Null space N(A) — "cái bị nuốt về 0"
            </PanelLabel>
            <Canvas2D
              height={340}
              range={5}
              polygons={nullPolys}
              lines={nullLines}
              points={nullPoints}
            />
            <p className="dim" style={{ fontSize: 12.5, marginTop: 4 }}>
              Tập x với Ax = 0 = <b>{nullDesc}</b>.
            </p>
          </div>
        </TwoCol>

        {rank === 1 && (
          <StatRow>
            <Stat label="x đang chọn" value={vec2Str(xDemo[0], xDemo[1])} color={HEX.result} />
            <Stat label="Ax" value={vec2Str(Ax[0], Ax[1])} color="var(--good)" />
          </StatRow>
        )}

        {rank === 1 ? (
          <Callout tone="warn">
            ⚠️ Ma trận <b>suy biến</b> (det = 0): hai cột thẳng hàng nên C(A) sập từ cả mặt
            phẳng xuống <b>một đường</b>. Bù lại, N(A) "phình" lên thành một đường — mọi x trên
            đường hồng đều bị A nuốt về đúng gốc: Ax = {vec2Str(Ax[0], Ax[1])}. Hãy thử chọn
            preset khác để thấy hai bên "bập bênh" với nhau.
          </Callout>
        ) : (
          <Hint>
            Hãy thử ba preset. Khi A <b>khả nghịch</b> (det ≠ 0): C(A) phủ kín mặt phẳng còn
            N(A) co lại chỉ còn gốc — không gì bị nuốt, mọi thứ nhả ra được. Khi A <b>suy
            biến</b>: hai bên đổi vai. Đây là "định luật bảo toàn" mà ta sẽ đặt tên là{' '}
            <b>rank–nullity</b> ở bài Rank.
          </Hint>
        )}
      </Section>

      <Section kind="explore" title="Ví dụ 3×3: cột căng ra mặt phẳng, null là một đường">
        <Scene3D
          height={380}
          vectors={[
            { id: 'c1', v: [1, 0, 1], color: HEX.v1, label: 'cột 1' },
            { id: 'c2', v: [0, 1, 1], color: HEX.v2, label: 'cột 2' },
            { id: 'c3', v: [1, 1, 2], color: HEX.result, label: 'cột 3 = cột1 + cột2' },
          ]}
          spanPlanes={[{ u: [1, 0, 1], v: [0, 1, 1], color: HEX.v3, opacity: 0.2 }]}
          lines3={[{ from: [-2, -2, 2], to: [2, 2, -2], color: HEX.result, dashed: true }]}
        />
        <Hint>
          Ma trận{' '}
          <MathText tex="A = \begin{bmatrix} 1 & 0 & 1 \\ 0 & 1 & 1 \\ 1 & 1 & 2 \end{bmatrix}" />{' '}
          có cột 3 = cột 1 + cột 2 nên chỉ 2 cột "thật sự mới". <b>C(A)</b> là mặt phẳng xanh
          lá (chiều 2). <b>N(A)</b> là đường nét đứt hồng theo hướng [−1, −1, 1]: đúng là
          A·[−1,−1,1] = 0. Hãy xoay để thấy đường null cắm xuyên qua gốc, vuông góc "cảm giác"
          với mặt cột.
        </Hint>
      </Section>

      <Section kind="theory" title="Định nghĩa & trực giác">
        <p>
          Cho ma trận <MathText tex="A" /> kích thước <MathText tex="m \times n" />. Với vector{' '}
          <MathText tex="\vec{x} \in \mathbb{R}^n" />, tích <MathText tex="A\vec{x}" /> luôn là{' '}
          <b>một tổ hợp tuyến tính của các cột</b> của A (hệ số là các thành phần của x):
        </p>
        <MathText block tex="A\vec{x} = x_1 \vec{a}_1 + x_2 \vec{a}_2 + \dots + x_n \vec{a}_n" />
        <p>
          <b>Column space</b> <MathText tex="C(A)" /> là <b>tập tất cả</b> các <MathText tex="A\vec{x}" /> —
          tức span của các cột. Đây là "mọi nơi A có thể nhả ra được", một subspace của{' '}
          <MathText tex="\mathbb{R}^m" />.
        </p>
        <p>
          <b>Null space</b> <MathText tex="N(A)" /> là tập các <MathText tex="\vec{x}" /> bị A{' '}
          <b>nuốt về vector không</b>:
        </p>
        <MathText block tex="N(A) = \{\, \vec{x} \in \mathbb{R}^n : A\vec{x} = \vec{0} \,\}" />
        <p>
          Đây là một subspace của <MathText tex="\mathbb{R}^n" /> (luôn chứa <MathText tex="\vec{0}" />,
          đóng với cộng và nhân — bạn hãy tự kiểm tra bằng ba điều kiện ở bài Subspace).
        </p>
        <p>
          <b>Nối với hệ phương trình (chương 2):</b> hệ <MathText tex="A\vec{x} = \vec{b}" /> có
          nghiệm <b>khi và chỉ khi</b> <MathText tex="\vec{b} \in C(A)" /> — vì nghiệm chính là
          "công thức pha b từ các cột". Và nếu có một nghiệm <MathText tex="\vec{x}_0" />, thì{' '}
          <i>mọi</i> nghiệm có dạng <MathText tex="\vec{x}_0 + \vec{n}" /> với{' '}
          <MathText tex="\vec{n} \in N(A)" />: null space đo chính xác "độ tự do" của nghiệm.
          N(A) chỉ có gốc ⟺ nghiệm (nếu có) là duy nhất.
        </p>
      </Section>

      <Section kind="quiz" title="Kiểm tra hiểu">
        <Quiz
          lessonKey="ch4/colnull"
          questions={[
            {
              q: (
                <>
                  Hệ <MathText tex="A\vec{x} = \vec{b}" /> có nghiệm khi và chỉ khi:
                </>
              ),
              options: [
                'b nằm trong null space N(A)',
                'b nằm trong column space C(A)',
                'det(A) ≠ 0',
                'b là vector không',
              ],
              answer: 1,
              explain: (
                <>
                  <MathText tex="A\vec{x}" /> luôn là tổ hợp của các cột, nên nó chỉ chạm tới được
                  những b nằm trong <MathText tex="C(A)" />. Nếu b ngoài C(A) thì vô nghiệm.
                </>
              ),
            },
            {
              q: (
                <>
                  Với ma trận suy biến <MathText tex="\begin{bmatrix} 1 & 2 \\ 2 & 4 \end{bmatrix}" />,
                  null space là:
                </>
              ),
              options: [
                'Chỉ điểm gốc',
                'Đường thẳng theo hướng [−2, 1]',
                'Cả mặt phẳng ℝ²',
                'Đường thẳng theo hướng [1, 2]',
              ],
              answer: 1,
              explain: (
                <>
                  Cần <MathText tex="x_1 + 2x_2 = 0" /> nên <MathText tex="\vec{x} = t[-2, 1]" />.
                  Kiểm tra: <MathText tex="A[-2,1] = [1(-2)+2(1),\ 2(-2)+4(1)] = [0,0]" />. ✓
                </>
              ),
            },
            {
              q: <>Ma trận A khả nghịch (2×2, det ≠ 0). Null space N(A) của nó là:</>,
              options: [
                'Một đường thẳng qua gốc',
                'Chỉ chứa vector không {0}',
                'Cả mặt phẳng',
                'Không xác định',
              ],
              answer: 1,
              explain: (
                <>
                  Khả nghịch nghĩa là Ax = 0 chỉ có nghiệm x = 0 (nhân A⁻¹ hai vế). Không gì bị
                  nuốt, N(A) = {'{'}0{'}'} — và đó là lý do nghiệm của Ax = b luôn duy nhất.
                </>
              ),
            },
            {
              q: (
                <>
                  Cột 3 của một ma trận 3×3 bằng cột 1 cộng cột 2. Column space C(A) của nó là:
                </>
              ),
              options: [
                'Cả không gian ℝ³',
                'Một mặt phẳng qua gốc',
                'Một đường thẳng',
                'Chỉ điểm gốc',
              ],
              answer: 1,
              explain: (
                <>
                  Cột 3 không mang thông tin mới (nó là tổ hợp của cột 1, 2), nên span của 3 cột
                  chỉ bằng span của 2 cột độc lập = một mặt phẳng qua gốc (chiều 2).
                </>
              ),
            },
          ]}
        />
      </Section>
    </Lesson>
  );
}
