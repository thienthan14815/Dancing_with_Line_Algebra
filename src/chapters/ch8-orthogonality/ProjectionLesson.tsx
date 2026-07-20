import { useState } from 'react';
import { Lesson, Section } from '../../components/Lesson';
import MathText from '../../components/MathText';
import Scene3D from '../../components/Scene3D';
import Canvas2D, { type V2 } from '../../components/Canvas2D';
import Slider from '../../components/Slider';
import StepByStep from '../../components/StepByStep';
import Quiz from '../../components/Quiz';
import { dot, norm, project, projectOnto, projectionMatrix, matVec } from '../../lib/linalg';
import { f2, matTex, Stat, StatRow, Hint, DeepDive } from './_shared';

type V3 = [number, number, number];

export default function ProjectionLesson() {
  // --- 3D: chiếu lên một mặt phẳng qua gốc ---
  const a1: V3 = [1, 0, 0];
  const a2: V3 = [0, 1, 1];
  const [b, setB] = useState<V3>([1.5, 2, 0.5]);
  const p = projectOnto(b, [a1, a2]) as V3;
  const resid: V3 = [b[0] - p[0], b[1] - p[1], b[2] - p[2]];
  const setBi = (i: number, n: number) =>
    setB((prev) => prev.map((x, k) => (k === i ? n : x)) as V3);

  // --- 2D: chiếu lên một đường thẳng qua gốc ---
  const dir = [2, 1];
  const [bb, setBB] = useState({ x: 1, y: 3 });
  const b2 = [bb.x, bb.y];
  const p2 = project(b2, dir); // hình chiếu của b2 lên đường span(dir)
  const P2 = projectionMatrix([[2], [1]]); // ma trận chiếu 2×2 lên đường đó
  const Pb = matVec(P2, b2);

  const onChange2 = (id: string, x: number, y: number) => {
    if (id === 'b') setBB({ x, y });
  };
  const vectors2: V2[] = [
    { id: 'b', x: bb.x, y: bb.y, color: 'var(--vec-1)', label: 'b', draggable: true },
  ];

  return (
    <Lesson id="projection" title="Phép chiếu lên không gian con">
      <Section kind="explore" title="Chiếu b lên một mặt phẳng (3D)">
        <Scene3D
          height={420}
          spanPlanes={[{ u: a1, v: a2, color: '#f97316', opacity: 0.16 }]}
          vectors={[
            { id: 'b', v: b, color: '#4f9cf9', label: 'b' },
            { id: 'p', v: p, color: '#22c55e', label: 'p = chiếu' },
          ]}
          lines3={[{ from: p, to: b, color: '#e879f9', dashed: true }]}
        />
        <div className="row" style={{ gap: 16, marginTop: 12, flexWrap: 'wrap' }}>
          <div style={{ flex: 1, minWidth: 220 }}>
            <div className="dim" style={{ fontSize: 12 }}>Vector b</div>
            <Slider label="bₓ" min={-3} max={3} value={b[0]} onChange={(n) => setBi(0, n)} format={f2} />
            <Slider label="bᵧ" min={-3} max={3} value={b[1]} onChange={(n) => setBi(1, n)} format={f2} />
            <Slider label="b_z" min={-3} max={3} value={b[2]} onChange={(n) => setBi(2, n)} format={f2} />
          </div>
        </div>
        <StatRow>
          <Stat label="|b − p| (khoảng cách)" value={f2(norm(resid))} color="var(--vec-result)" />
          <Stat label="(b − p) · a₁" value={f2(dot(resid, a1))} color="var(--accent)" />
          <Stat label="(b − p) · a₂" value={f2(dot(resid, a2))} color="var(--accent)" />
        </StatRow>
        <Hint>
          Mặt phẳng cam là không gian con (span của <MathText tex="a_1,a_2" />). Mũi tên xanh lá{' '}
          <b>p</b> là <b>hình chiếu (projection)</b> của b xuống mặt phẳng; đoạn hồng nét đứt{' '}
          <MathText tex="b-p" /> luôn <b>vuông góc</b> với mặt phẳng — hãy để ý hai chỉ số{' '}
          <MathText tex="(b-p)\cdot a_1" /> và <MathText tex="(b-p)\cdot a_2" /> luôn ≈ 0. Trong mọi
          điểm của mặt phẳng, p là điểm <b>gần b nhất</b>.
        </Hint>
      </Section>

      <Section kind="explore" title="Chiếu lên một đường thẳng (2D) & ma trận chiếu">
        <Canvas2D
          height={400}
          range={5}
          vectors={vectors2}
          onVectorChange={onChange2}
          lines={[{ a: 1, b: -2, c: 0, color: 'var(--text-dim)', label: 'span(a)' }]}
          segments={[
            { from: [0, 0], to: [p2[0], p2[1]], color: 'var(--vec-3)', label: 'p' },
            { from: [bb.x, bb.y], to: [p2[0], p2[1]], color: 'var(--vec-result)', dashed: true },
          ]}
        />
        <StatRow>
          <Stat label="p = chiếu b" value={`(${f2(p2[0])}, ${f2(p2[1])})`} color="var(--vec-3)" />
          <Stat label="Pb" value={`(${f2(Pb[0])}, ${f2(Pb[1])})`} color="var(--vec-3)" />
          <Stat label="(b − p) · a" value={f2(dot([b2[0] - p2[0], b2[1] - p2[1]], dir))} color="var(--accent)" />
        </StatRow>
        <p style={{ marginTop: 10 }}>
          Đường xám là <MathText tex="\mathrm{span}(a)" /> với <MathText tex="a=(2,1)" />. Ma trận
          chiếu lên đường này là{' '}
          <MathText
            tex={`P = \\frac{a\\,a^\\top}{a^\\top a} = ${matTex(P2)}`}
          />
          , và <MathText tex="p = Pb" /> đúng bằng hình chiếu — hãy kéo b để thấy p trượt dọc đường,
          còn đoạn nét đứt luôn vuông góc.
        </p>
      </Section>

      <Section kind="theory" title="Công thức chiếu & ma trận chiếu">
        <p>
          Cho không gian con là <b>column space</b> của ma trận A (các cột của A là một cơ sở). Hình
          chiếu vuông góc của b lên không gian đó là:
        </p>
        <MathText block tex="p = A\,(A^\top A)^{-1} A^\top\, b = P b, \qquad P = A\,(A^\top A)^{-1} A^\top" />
        <p>
          P gọi là <b>ma trận chiếu (projection matrix)</b>. Với một đường thẳng (A chỉ có 1 cột{' '}
          <MathText tex="a" />) nó rút gọn thành <MathText tex="P = \dfrac{a\,a^\top}{a^\top a}" />.
          Hai tính chất đặc trưng:
        </p>
        <ul>
          <li>
            <b>Lũy đẳng (idempotent):</b> <MathText tex="P^2 = P" /> — chiếu một lần rồi chiếu lại thì
            không thay đổi gì nữa, vì p đã nằm sẵn trong không gian con.
          </li>
          <li>
            <b>Đối xứng:</b> <MathText tex="P^\top = P" />.
          </li>
        </ul>
        <p>
          Ngược lại, mọi ma trận thỏa <MathText tex="P^2=P" /> và <MathText tex="P^\top=P" /> đều là
          một phép chiếu trực giao lên chính không gian cột của nó.
        </p>
        <DeepDive>
          <p>
            Vì sao p là điểm <b>gần b nhất</b>? Theo cách dựng, phần dư{' '}
            <MathText tex="e = b - p" /> vuông góc với <em>toàn bộ</em> không gian con, tức{' '}
            <MathText tex="A^\top e = 0" />. Lấy một điểm tùy ý <MathText tex="q" /> khác trong không
            gian con; khi đó <MathText tex="p-q" /> nằm trong không gian con nên vuông góc với{' '}
            <MathText tex="e" />, và theo Pythagoras:
          </p>
          <MathText block tex="\|b-q\|^2 = \|b-p\|^2 + \|p-q\|^2 \ge \|b-p\|^2." />
          <p>
            Dấu bằng chỉ khi <MathText tex="q=p" />. Vậy hình chiếu chính là nghiệm của bài toán{' '}
            <b>khoảng cách ngắn nhất</b> tới không gian con — ý tưởng cốt lõi dẫn tới least squares.
          </p>
        </DeepDive>
      </Section>

      <Section kind="steps" title="Dựng ma trận chiếu lên một đường & chiếu b">
        <StepByStep
          steps={[
            {
              title: 'Bài toán',
              content: (
                <p>
                  Chiếu <MathText tex="b=(1,\,3)" /> lên đường thẳng span của{' '}
                  <MathText tex="a=(2,\,1)" />. Dựng ma trận chiếu P rồi tính{' '}
                  <MathText tex="p=Pb" />.
                </p>
              ),
            },
            {
              title: 'Bước 1 — tính aᵀa',
              content: <p><MathText tex="a^\top a = 2^2 + 1^2 = 5" />.</p>,
            },
            {
              title: 'Bước 2 — dựng a aᵀ',
              content: (
                <MathText
                  block
                  tex="a\,a^\top = \begin{bmatrix} 2 \\ 1 \end{bmatrix}\begin{bmatrix} 2 & 1 \end{bmatrix} = \begin{bmatrix} 4 & 2 \\ 2 & 1 \end{bmatrix}"
                />
              ),
            },
            {
              title: 'Bước 3 — ma trận chiếu P',
              content: (
                <MathText
                  block
                  tex="P = \frac{a\,a^\top}{a^\top a} = \frac{1}{5}\begin{bmatrix} 4 & 2 \\ 2 & 1 \end{bmatrix} = \begin{bmatrix} 0.8 & 0.4 \\ 0.4 & 0.2 \end{bmatrix}"
                />
              ),
            },
            {
              title: 'Bước 4 — chiếu b',
              content: (
                <p>
                  <MathText tex="p = Pb = \tfrac{1}{5}(4\cdot 1 + 2\cdot 3,\ 2\cdot 1 + 1\cdot 3) = \tfrac{1}{5}(10,5) = (2,\,1)" />.
                </p>
              ),
            },
            {
              title: 'Kiểm tra phần dư vuông góc',
              content: (
                <p>
                  <MathText tex="e = b - p = (1,3)-(2,1) = (-1,\,2)" />, và{' '}
                  <MathText tex="e\cdot a = (-1)(2)+(2)(1) = 0" /> ✓ — phần dư vuông góc với đường,
                  đúng như kỳ vọng.
                </p>
              ),
            },
          ]}
        />
      </Section>

      <Section kind="quiz" title="Kiểm tra hiểu">
        <Quiz
          lessonKey="ch8/projection"
          questions={[
            {
              q: <>Ma trận chiếu lên column space của A là:</>,
              options: [
                <MathText tex="A^\top A" />,
                <MathText tex="A\,(A^\top A)^{-1} A^\top" />,
                <MathText tex="A^{-1}" />,
                <MathText tex="A A^\top - I" />,
              ],
              answer: 1,
              explain: (
                <>
                  <MathText tex="P = A(A^\top A)^{-1}A^\top" /> lấy b, đưa về tọa độ trong cơ sở cột,
                  rồi dựng lại điểm gần nhất trong <MathText tex="C(A)" />.
                </>
              ),
            },
            {
              q: <>Tính chất <MathText tex="P^2 = P" /> của ma trận chiếu nghĩa là:</>,
              options: [
                'Chiếu hai lần cho kết quả khác nhau',
                'Chiếu lại một điểm đã nằm trong không gian con thì giữ nguyên nó',
                'P luôn khả nghịch',
                'P là ma trận đơn vị',
              ],
              answer: 1,
              explain: (
                <>
                  Sau lần chiếu đầu, p đã ở trong không gian con; chiếu tiếp không đổi gì nữa, nên{' '}
                  <MathText tex="P(Pb) = Pb" />.
                </>
              ),
            },
            {
              q: <>Phần dư <MathText tex="b-p" /> có quan hệ gì với không gian con?</>,
              options: [
                'Nằm trong không gian con',
                'Vuông góc với toàn bộ không gian con',
                'Song song với b',
                'Luôn bằng vector không',
              ],
              answer: 1,
              explain: (
                <>
                  Đúng theo định nghĩa chiếu trực giao: <MathText tex="A^\top(b-p)=0" />, tức{' '}
                  <MathText tex="b-p" /> vuông góc với mọi cột của A.
                </>
              ),
            },
            {
              q: <>Vì sao hình chiếu p là điểm gần b nhất trong không gian con?</>,
              options: [
                'Vì p có độ dài nhỏ nhất',
                'Vì phần dư vuông góc, theo Pythagoras mọi điểm khác đều xa hơn',
                'Vì P khả nghịch',
                'Vì p luôn bằng b',
              ],
              answer: 1,
              explain: (
                <>
                  Với q bất kỳ trong không gian con,{' '}
                  <MathText tex="\|b-q\|^2 = \|b-p\|^2 + \|p-q\|^2 \ge \|b-p\|^2" />.
                </>
              ),
            },
          ]}
        />
      </Section>
    </Lesson>
  );
}
