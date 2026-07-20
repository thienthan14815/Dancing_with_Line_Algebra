import { useState } from 'react';
import { Lesson, Section } from '../../components/Lesson';
import MathText from '../../components/MathText';
import Canvas2D, { type V2 } from '../../components/Canvas2D';
import StepByStep from '../../components/StepByStep';
import Quiz from '../../components/Quiz';
import { dot, norm, project, angleBetween } from '../../lib/linalg';
import { f2, Stat, StatRow, Hint } from './_shared';

export default function DotLesson() {
  const [v, setV] = useState({ x: 3, y: 2 });
  const [w, setW] = useState({ x: 4, y: -1 });

  const vv = [v.x, v.y];
  const ww = [w.x, w.y];
  const d = dot(vv, ww);
  const ang = (angleBetween(vv, ww) * 180) / Math.PI;
  const proj = project(vv, ww); // hình chiếu của v lên w

  const onChange = (id: string, x: number, y: number) => {
    if (id === 'v') setV({ x, y });
    else if (id === 'w') setW({ x, y });
  };

  const vectors: V2[] = [
    { id: 'v', x: v.x, y: v.y, color: 'var(--vec-1)', label: 'v', draggable: true },
    { id: 'w', x: w.x, y: w.y, color: 'var(--vec-2)', label: 'w', draggable: true },
  ];

  const lenProj = norm(proj);
  const lenPerp = norm([v.x - proj[0], v.y - proj[1]]);
  const showSquare = lenProj > 0.4 && lenPerp > 0.4;

  // Ô vuông góc nhỏ tại chân hình chiếu
  const square: [number, number][] = [];
  if (showSquare) {
    const s = 0.35;
    const d1 = [-proj[0] / lenProj, -proj[1] / lenProj]; // dọc đường w, hướng về gốc
    const d2 = [(v.x - proj[0]) / lenPerp, (v.y - proj[1]) / lenPerp]; // vuông góc, hướng lên v
    square.push(
      [proj[0], proj[1]],
      [proj[0] + s * d1[0], proj[1] + s * d1[1]],
      [proj[0] + s * d1[0] + s * d2[0], proj[1] + s * d1[1] + s * d2[1]],
      [proj[0] + s * d2[0], proj[1] + s * d2[1]]
    );
  }

  const rel =
    Math.abs(d) < 0.05
      ? { label: 'vuông góc (θ = 90°)', color: 'var(--warn)' }
      : d > 0
      ? { label: 'góc nhọn (θ < 90°)', color: 'var(--vec-3)' }
      : { label: 'góc tù (θ > 90°)', color: 'var(--bad)' };

  return (
    <Lesson id="dot" title="Dot product (tích vô hướng)">
      <Section kind="explore" title="Chiếu v lên w và đọc dấu">
        <Canvas2D
          height={440}
          range={7}
          vectors={vectors}
          onVectorChange={onChange}
          segments={[
            // hình chiếu của v lên w
            { from: [0, 0], to: [proj[0], proj[1]], color: 'var(--vec-3)', label: 'chiếu' },
            // đường gióng vuông góc từ đầu v xuống chân chiếu
            { from: [v.x, v.y], to: [proj[0], proj[1]], color: 'var(--text-dim)', dashed: true },
          ]}
          polygons={showSquare ? [{ points: square, fill: 'none', stroke: 'var(--vec-3)', opacity: 1 }] : []}
        />
        <StatRow>
          <Stat label="v · w" value={f2(d)} color={rel.color} />
          <Stat label="góc θ" value={`${f2(ang)}°`} color="var(--accent)" />
          <Stat label="quan hệ" value={rel.label} color={rel.color} />
        </StatRow>
        <Hint>
          Hãy kéo v và w. Đoạn xanh lá là <b>hình chiếu của v lên w</b>; đường nét đứt hạ vuông
          góc từ đầu v xuống. Kéo cho hai mũi tên gần cùng hướng → <b>v·w &gt; 0</b> (góc nhọn);
          kéo cho vuông góc → <b>v·w = 0</b>; kéo cho ngược hướng → <b>v·w &lt; 0</b> (góc tù).
          Dấu của dot product chính là "chúng có cùng hướng hay không".
        </Hint>
      </Section>

      <Section kind="theory" title="Một phép tính, hai công thức">
        <p>Dot product của hai vector có <b>hai công thức</b> nhìn rất khác nhau:</p>
        <MathText block tex="\vec{v}\cdot\vec{w} = \sum_i v_i w_i = v_1 w_1 + v_2 w_2 + \cdots" />
        <MathText block tex="\vec{v}\cdot\vec{w} = |\vec{v}|\,|\vec{w}|\cos\theta" />
        <p>
          Công thức trên (đại số) dễ tính; công thức dưới (hình học) dễ hiểu. Với v và w hiện
          tại:
        </p>
        <MathText
          block
          tex={`\\vec{v}\\cdot\\vec{w} = ${f2(v.x)}\\cdot${f2(w.x)} + ${f2(v.y)}\\cdot${f2(w.y)} = ${f2(d)} = ${f2(norm(vv))}\\cdot${f2(norm(ww))}\\cdot\\cos(${f2(ang)}^\\circ)`}
        />
        <p>
          Vì sao hai công thức là một? Hãy nhìn lại hình chiếu. Chiếu v lên w, độ dài phần
          chiếu (có dấu) là <MathText tex="|\vec{v}|\cos\theta" />. Dot product chính là độ dài
          chiếu đó nhân với |w|. Nói cách khác, <b>dot product đo "v ngả theo w bao nhiêu"</b>,
          rồi khuếch đại theo độ dài w.
        </p>
        <p>Từ đó đọc ngay được dấu — cực kỳ hữu ích:</p>
        <ul>
          <li><b>v·w &gt; 0</b>: góc nhọn, hai vector cùng phía → "cùng hướng".</li>
          <li><b>v·w = 0</b>: vuông góc (orthogonal), không thành phần nào chung.</li>
          <li><b>v·w &lt; 0</b>: góc tù, ngược phía nhau.</li>
        </ul>
        <p>
          Dot product là công cụ đo độ "cùng hướng", đo độ dài (<MathText tex="|\vec{v}|=\sqrt{\vec{v}\cdot\vec{v}}" />)
          và định nghĩa góc — nền tảng cho chiếu, trực giao, và cả least squares sau này.
        </p>
      </Section>

      <Section kind="steps" title="Tính dot product & góc từng bước">
        <StepByStep
          steps={[
            {
              title: 'Bài toán',
              content: <p>Cho <MathText tex="\vec{v}=(3, 2)" /> và <MathText tex="\vec{w}=(4, -1)" />. Tính v·w và góc giữa.</p>,
            },
            {
              title: 'Bước 1 — nhân từng cặp thành phần',
              content: <p><MathText tex="3\cdot 4 = 12" /> và <MathText tex="2\cdot(-1) = -2" />.</p>,
            },
            {
              title: 'Bước 2 — cộng lại',
              content: <p><MathText tex="\vec{v}\cdot\vec{w} = 12 + (-2) = 10" />. Dương → góc nhọn.</p>,
            },
            {
              title: 'Bước 3 — tính độ dài',
              content: <p><MathText tex="|\vec{v}| = \sqrt{9+4} = \sqrt{13}" />, <MathText tex="|\vec{w}| = \sqrt{16+1} = \sqrt{17}" />.</p>,
            },
            {
              title: 'Bước 4 — suy ra góc',
              content: (
                <p>
                  <MathText tex="\cos\theta = \dfrac{10}{\sqrt{13}\,\sqrt{17}} \approx 0.673" />, nên{' '}
                  <MathText tex="\theta \approx 47.7^\circ" />. Khớp với công thức hình học.
                </p>
              ),
            },
          ]}
        />
      </Section>

      <Section kind="quiz" title="Kiểm tra hiểu">
        <Quiz
          lessonKey="ch1/dot"
          questions={[
            {
              q: <><MathText tex="(1, 2)\cdot(3, -1)" /> bằng?</>,
              options: ['1', '5', '-1', '6'],
              answer: 0,
              explain: <><MathText tex="1\cdot 3 + 2\cdot(-1) = 3 - 2 = 1" />.</>,
            },
            {
              q: <>Hai vector có dot product bằng 0. Điều đó nghĩa là:</>,
              options: [
                'Chúng cùng hướng',
                'Chúng vuông góc với nhau',
                'Ít nhất một trong hai là vector không',
                'Chúng ngược hướng',
              ],
              answer: 1,
              explain: <>Vì <MathText tex="\vec{v}\cdot\vec{w}=|\vec{v}||\vec{w}|\cos\theta" />, dot product = 0 (với hai vector khác không) buộc <MathText tex="\cos\theta = 0" />, tức θ = 90°.</>,
            },
            {
              q: <>Nếu <MathText tex="\vec{v}\cdot\vec{w} < 0" /> thì góc giữa hai vector:</>,
              options: ['Nhọn', 'Vuông', 'Tù (lớn hơn 90°)', 'Bằng 0'],
              answer: 2,
              explain: <>cos θ mang dấu của dot product. Âm nghĩa là <MathText tex="\cos\theta < 0" />, tức θ nằm giữa 90° và 180° — góc tù.</>,
            },
            {
              q: <>Biểu thức nào cho <b>độ dài</b> của v qua dot product?</>,
              options: [
                <MathText tex="\vec{v}\cdot\vec{v}" />,
                <MathText tex="\sqrt{\vec{v}\cdot\vec{v}}" />,
                <MathText tex="2\,\vec{v}\cdot\vec{v}" />,
                <MathText tex="\vec{v}\cdot\vec{v} - 1" />,
              ],
              answer: 1,
              explain: <><MathText tex="\vec{v}\cdot\vec{v} = |\vec{v}|^2\cos 0 = |\vec{v}|^2" />, nên độ dài là căn bậc hai của nó.</>,
            },
          ]}
        />
      </Section>
    </Lesson>
  );
}
