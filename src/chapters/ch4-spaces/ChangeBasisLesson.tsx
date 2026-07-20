import { useState } from 'react';
import { Lesson, Section } from '../../components/Lesson';
import MathText from '../../components/MathText';
import Canvas2D, { type V2 } from '../../components/Canvas2D';
import StepByStep from '../../components/StepByStep';
import Quiz from '../../components/Quiz';
import { inverse, matVec, type Mat } from '../../lib/linalg';
import { f2, vec2Str, cross2, Stat, StatRow, Hint, Callout, basisLattice, HEX } from './_shared';

export default function ChangeBasisLesson() {
  const [v, setV] = useState({ x: 3, y: 2 });
  const [b1, setB1] = useState({ x: 2, y: 1 });
  const [b2, setB2] = useState({ x: -1, y: 1 });
  const [viewB, setViewB] = useState(false);

  const b1v: [number, number] = [b1.x, b1.y];
  const b2v: [number, number] = [b2.x, b2.y];
  const det = cross2(b1v, b2v);
  const degenerate = Math.abs(det) < 0.05;

  // P = [b1 | b2] (cột). [v]_B = P⁻¹ v.
  const P: Mat = [
    [b1.x, b2.x],
    [b1.y, b2.y],
  ];
  const Pinv = inverse(P);
  const coordsB = Pinv ? (matVec(Pinv, [v.x, v.y]) as [number, number]) : null;

  const onChange = (id: string, x: number, y: number) => {
    if (id === 'v') setV({ x, y });
    else if (id === 'b1') setB1({ x, y });
    else if (id === 'b2') setB2({ x, y });
  };

  const vectors: V2[] = [
    { id: 'v', x: v.x, y: v.y, color: HEX.result, label: 'v', draggable: !viewB },
    { id: 'b1', x: b1.x, y: b1.y, color: HEX.v1, label: 'b₁', draggable: !viewB },
    { id: 'b2', x: b2.x, y: b2.y, color: HEX.v2, label: 'b₂', draggable: !viewB },
  ];

  const lattice = basisLattice(b1v, b2v, degenerate ? 'var(--warn)' : '#3a5178');

  // Khi "nhìn từ hệ B": áp P⁻¹ để lưới B duỗi thành lưới vuông.
  const matrix =
    viewB && Pinv
      ? ([[Pinv[0][0], Pinv[0][1]], [Pinv[1][0], Pinv[1][1]]] as [
          [number, number],
          [number, number],
        ])
      : undefined;

  return (
    <Lesson id="change-basis" title="Đổi cơ sở">
      <Section kind="explore" title="Một vector, hai góc nhìn">
        <div className="row" style={{ marginBottom: 10 }}>
          <button
            className={viewB ? 'btn btn-primary' : 'btn'}
            onClick={() => setViewB((s) => !s)}
            disabled={degenerate}
          >
            {viewB ? '↩ Về hệ chuẩn' : '👁 Nhìn từ hệ B (áp P⁻¹)'}
          </button>
        </div>
        <Canvas2D
          height={440}
          range={6}
          vectors={vectors}
          onVectorChange={onChange}
          segments={lattice}
          matrix={matrix}
        />
        <StatRow>
          <Stat label="[v] theo chuẩn" value={vec2Str(v.x, v.y)} color={HEX.result} />
          <Stat
            label="[v]_B (theo b₁, b₂)"
            value={coordsB ? vec2Str(coordsB[0], coordsB[1]) : '—'}
            color={degenerate ? 'var(--warn)' : HEX.v1}
          />
          <Stat label="det P" value={f2(det)} color={degenerate ? 'var(--warn)' : 'var(--good)'} />
        </StatRow>
        {degenerate ? (
          <Callout tone="warn">
            ⚠️ b₁ và b₂ thẳng hàng → P không khả nghịch (det ≈ 0), không tồn tại P⁻¹ nên không
            có phép đổi cơ sở. Hãy kéo cho hai vector lệch hướng để B là một basis hợp lệ.
          </Callout>
        ) : (
          <Hint>
            {viewB ? (
              <>
                Đang <b>nhìn từ hệ B</b>: ta đã áp P⁻¹ cho toàn cảnh, nên lưới xiên của B{' '}
                <b>duỗi thẳng</b> thành lưới vuông và b₁, b₂ trở thành hai trục đơn vị. Vị trí mới
                của v đọc trực tiếp ra <b>{coordsB ? vec2Str(coordsB[0], coordsB[1]) : '—'}</b> =
                [v]_B. Đổi cơ sở chính là <b>đổi góc nhìn</b>, không dời vector.
              </>
            ) : (
              <>
                Hãy kéo v (hồng) và hai vector cơ sở b₁, b₂. Cùng một v, nhưng tọa độ theo chuẩn
                là [{f2(v.x)}, {f2(v.y)}] còn theo B là{' '}
                <b>{coordsB ? vec2Str(coordsB[0], coordsB[1]) : '—'}</b>. Rồi bấm{' '}
                <b>"Nhìn từ hệ B"</b> để xem lưới xiên duỗi thẳng lại.
              </>
            )}
          </Hint>
        )}
      </Section>

      <Section kind="theory" title="Ma trận chuyển cơ sở P">
        <p>
          Cho basis mới <MathText tex="B = \{\vec{b}_1, \vec{b}_2\}" />. Xếp các vector cơ sở
          thành <b>các cột</b> ta được <b>ma trận chuyển cơ sở</b>:
        </p>
        <MathText block tex="P = \big[\ \vec{b}_1 \ \ \vec{b}_2\ \big]" />
        <p>
          Ma trận này <b>đọc</b> tọa độ theo B <b>ra</b> tọa độ chuẩn: nếu biết{' '}
          <MathText tex="[\vec{v}]_B" /> thì
        </p>
        <MathText block tex="\vec{v} = P\,[\vec{v}]_B" />
        <p>
          vì <MathText tex="P[\vec v]_B" /> chính là "pha b₁, b₂ theo đúng tỉ lệ đó". Muốn đi
          ngược lại — từ tọa độ chuẩn <b>sang</b> tọa độ B — ta nhân với nghịch đảo:
        </p>
        <MathText block tex="[\vec{v}]_B = P^{-1}\,\vec{v}" />
        <p>
          Đó đúng là phép ta áp khi bấm "nhìn từ hệ B": <MathText tex="P^{-1}" /> "duỗi" lưới
          xiên của B thành lưới vuông, và tọa độ mới của v hiện ra ngay. (P⁻¹ tồn tại vì basis
          độc lập ⟺ det P ≠ 0.)
        </p>
        <Callout tone="info">
          🔭 <b>Hé mở chương 5.</b> Nhiều ma trận trông rối vì ta đang nhìn chúng bằng basis chuẩn
          "không hợp gu". <b>Diagonalization</b> chính là đi tìm một basis đặc biệt — basis các{' '}
          <i>eigenvector</i> — mà nhìn qua đó, biến đổi chỉ còn là <b>kéo giãn dọc theo từng
          trục</b>, tức ma trận trở thành <b>đường chéo</b>. Đổi cơ sở là chìa khóa của trò đó:{' '}
          <MathText tex="D = P^{-1} A P" />.
        </Callout>
      </Section>

      <Section kind="steps" title="Đổi tọa độ một vector cụ thể">
        <StepByStep
          steps={[
            {
              title: 'Bài toán',
              content: (
                <p>
                  Cho basis <MathText tex="\vec{b}_1 = (2, 1)" />,{' '}
                  <MathText tex="\vec{b}_2 = (-1, 1)" /> và vector{' '}
                  <MathText tex="\vec{v} = (1, 5)" /> (tọa độ chuẩn). Tìm{' '}
                  <MathText tex="[\vec{v}]_B" />.
                </p>
              ),
            },
            {
              title: 'Bước 1 — Dựng P (cột là b₁, b₂)',
              content: <MathText block tex="P = \begin{bmatrix} 2 & -1 \\ 1 & 1 \end{bmatrix}" />,
            },
            {
              title: 'Bước 2 — Tính P⁻¹',
              content: (
                <div>
                  <MathText block tex="\det P = 2\cdot 1 - (-1)\cdot 1 = 3" />
                  <MathText block tex="P^{-1} = \frac{1}{3}\begin{bmatrix} 1 & 1 \\ -1 & 2 \end{bmatrix}" />
                </div>
              ),
            },
            {
              title: 'Bước 3 — Nhân P⁻¹ v',
              content: (
                <MathText
                  block
                  tex="[\vec{v}]_B = \frac{1}{3}\begin{bmatrix} 1 & 1 \\ -1 & 2 \end{bmatrix}\begin{bmatrix} 1 \\ 5 \end{bmatrix} = \frac{1}{3}\begin{bmatrix} 6 \\ 9 \end{bmatrix} = \begin{bmatrix} 2 \\ 3 \end{bmatrix}"
                />
              ),
            },
            {
              title: 'Bước 4 — Kiểm chứng',
              content: (
                <div>
                  <p>
                    Vậy <MathText tex="[\vec{v}]_B = (2, 3)" />: cần 2 phần b₁ và 3 phần b₂. Thử lại:
                  </p>
                  <MathText block tex="2\vec{b}_1 + 3\vec{b}_2 = 2(2,1) + 3(-1,1) = (4-3,\ 2+3) = (1, 5) = \vec{v}\ \checkmark" />
                </div>
              ),
            },
          ]}
        />
      </Section>

      <Section kind="quiz" title="Kiểm tra hiểu">
        <Quiz
          lessonKey="ch4/change-basis"
          questions={[
            {
              q: <>Ma trận chuyển cơ sở P được dựng bằng cách:</>,
              options: [
                'Xếp các vector basis mới thành các cột',
                'Xếp các vector basis mới thành các hàng',
                'Lấy nghịch đảo của ma trận đơn vị',
                'Nhân các vector basis với nhau',
              ],
              answer: 0,
              explain: (
                <>
                  P = [b₁ | b₂ | …], mỗi cột là một vector của basis mới. Khi đó P·[v]_B trả về
                  đúng tọa độ chuẩn của v.
                </>
              ),
            },
            {
              q: (
                <>
                  Biết P (cột = basis mới) và tọa độ chuẩn của v. Công thức tính{' '}
                  <MathText tex="[\vec v]_B" /> là:
                </>
              ),
              options: [
                <MathText tex="P\,\vec v" key="a" />,
                <MathText tex="P^{-1}\,\vec v" key="b" />,
                <MathText tex="P^{T}\,\vec v" key="c" />,
                <MathText tex="\vec v + P" key="d" />,
              ],
              answer: 1,
              explain: (
                <>
                  P đưa tọa độ B <i>ra</i> chuẩn (<MathText tex="\vec v = P[\vec v]_B" />), nên chiều
                  ngược lại — chuẩn <i>sang</i> B — dùng nghịch đảo: <MathText tex="[\vec v]_B = P^{-1}\vec v" />.
                </>
              ),
            },
            {
              q: <>Khi ta "đổi cơ sở" để nhìn một vector v, điều gì thực sự xảy ra?</>,
              options: [
                'Vector v bị dời sang vị trí khác',
                'Vị trí thật của v không đổi, chỉ tọa độ (cách ghi) của nó đổi',
                'Độ dài của v thay đổi',
                'v biến thành vector không',
              ],
              answer: 1,
              explain: (
                <>
                  Đổi cơ sở là đổi góc nhìn / hệ trục, không đụng đến vector. Cùng một v, hệ trục
                  khác cho bộ tọa độ khác — như đã thấy khi lưới B duỗi thẳng.
                </>
              ),
            },
            {
              q: (
                <>
                  Vì sao ta cần b₁, b₂ độc lập tuyến tính thì mới đổi cơ sở được?
                </>
              ),
              options: [
                'Để P đối xứng',
                'Để det P ≠ 0, khi đó P⁻¹ tồn tại',
                'Để các vector có cùng độ dài',
                'Không cần điều kiện gì',
              ],
              answer: 1,
              explain: (
                <>
                  Độc lập ⟺ det P ≠ 0 ⟺ P khả nghịch. Không có P⁻¹ thì không tính được{' '}
                  <MathText tex="[\vec v]_B = P^{-1}\vec v" />, và B cũng chẳng phải basis.
                </>
              ),
            },
          ]}
        />
      </Section>
    </Lesson>
  );
}
