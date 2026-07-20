import { useState } from 'react';
import { Lesson, Section } from '../../components/Lesson';
import MathText from '../../components/MathText';
import Canvas2D, { type V2 } from '../../components/Canvas2D';
import Scene3D from '../../components/Scene3D';
import Slider from '../../components/Slider';
import Quiz from '../../components/Quiz';
import { add, scale } from '../../lib/linalg';
import { f2, vec2Str, cross2, Stat, StatRow, Hint } from './_shared';

type Seg = { from: [number, number]; to: [number, number]; color?: string; dashed?: boolean; label?: string };

export default function CombinationLesson() {
  const [v, setV] = useState({ x: 3, y: 0.5 });
  const [w, setW] = useState({ x: 0.5, y: 2.5 });
  const [a, setA] = useState(1);
  const [b, setB] = useState(1);
  const [showSpan, setShowSpan] = useState(false);

  const vv: [number, number] = [v.x, v.y];
  const ww: [number, number] = [w.x, w.y];
  const av = scale(vv, a);
  const bw = scale(ww, b);
  const combo = add(av, bw);

  const det = cross2(vv, ww);
  const collinear = Math.abs(det) < 0.05;

  const onChange = (id: string, x: number, y: number) => {
    if (id === 'v') setV({ x, y });
    else if (id === 'w') setW({ x, y });
  };

  const vectors: V2[] = [
    { id: 'v', x: v.x, y: v.y, color: 'var(--vec-1)', label: 'v', draggable: true },
    { id: 'w', x: w.x, y: w.y, color: 'var(--vec-2)', label: 'w', draggable: true },
    { id: 'combo', x: combo[0], y: combo[1], color: 'var(--vec-result)', label: 'a·v + b·w' },
  ];

  // Đường đi từng khúc: gốc → a·v → a·v + b·w
  const pathSegs: Seg[] = [
    { from: [0, 0], to: [av[0], av[1]], color: 'var(--vec-1)', dashed: true, label: 'a·v' },
    { from: [av[0], av[1]], to: [combo[0], combo[1]], color: 'var(--vec-2)', dashed: true, label: 'b·w' },
  ];

  // Lưới span: hai họ đường thẳng của lattice { a·v + b·w }
  const meshColor = collinear ? 'var(--warn)' : '#3a5178';
  const spanSegs: Seg[] = [];
  if (showSpan) {
    const N = 4;
    const M = 5;
    for (let k = -N; k <= N; k++) {
      const kw = scale(ww, k);
      const kv = scale(vv, k);
      // song song với v
      spanSegs.push({
        from: [kw[0] - M * v.x, kw[1] - M * v.y],
        to: [kw[0] + M * v.x, kw[1] + M * v.y],
        color: meshColor,
      });
      // song song với w
      spanSegs.push({
        from: [kv[0] - M * w.x, kv[1] - M * w.y],
        to: [kv[0] + M * w.x, kv[1] + M * w.y],
        color: meshColor,
      });
    }
  }

  return (
    <Lesson id="combination" title="Linear combination & Span">
      <Section kind="explore" title="Trộn hai vector theo mọi tỉ lệ">
        <div className="row" style={{ marginBottom: 6, gap: 20 }}>
          <div style={{ flex: 1, minWidth: 180 }}>
            <Slider label="a (hệ số của v)" min={-3} max={3} step={0.1} value={a} onChange={setA} format={(n) => f2(n)} />
          </div>
          <div style={{ flex: 1, minWidth: 180 }}>
            <Slider label="b (hệ số của w)" min={-3} max={3} step={0.1} value={b} onChange={setB} format={(n) => f2(n)} />
          </div>
        </div>
        <div className="row" style={{ marginBottom: 10 }}>
          <button className={showSpan ? 'btn btn-primary' : 'btn'} onClick={() => setShowSpan((s) => !s)}>
            {showSpan ? 'Ẩn span' : 'Quét span (mọi a, b)'}
          </button>
        </div>
        <Canvas2D
          height={440}
          range={7}
          vectors={vectors}
          onVectorChange={onChange}
          segments={[...spanSegs, ...pathSegs]}
          points={[{ x: av[0], y: av[1], color: 'var(--vec-1)', label: 'a·v' }]}
        />
        <StatRow>
          <Stat label="a·v + b·w" value={vec2Str(combo[0], combo[1])} color="var(--vec-result)" />
          <Stat label="det(v, w)" value={f2(det)} color={collinear ? 'var(--warn)' : 'var(--text)'} />
        </StatRow>
        {collinear ? (
          <div
            style={{
              marginTop: 10,
              padding: '10px 14px',
              borderRadius: 'var(--radius-sm)',
              background: 'rgba(245, 158, 11, 0.12)',
              border: '1px solid var(--warn)',
              color: 'var(--warn)',
              fontSize: 13.5,
            }}
          >
            ⚠️ <b>v và w đang thẳng hàng</b> (det ≈ 0). Lúc này mọi tổ hợp a·v + b·w đều rơi
            trên <b>một đường thẳng</b> — span co lại từ cả mặt phẳng xuống chỉ còn một đường.
            Hãy kéo cho hai mũi tên lệch hướng nhau để span "phình" ra phủ kín mặt phẳng.
          </div>
        ) : (
          <Hint>
            Hãy chỉnh a, b để thấy đường đi hai khúc: trước tiên đi <b>a·v</b> (nét đứt xanh),
            rồi từ đó đi tiếp <b>b·w</b> (nét đứt cam) là tới điểm hồng. Bấm <b>"Quét span"</b>:
            vì v và w lệch hướng nhau, lưới các tổ hợp phủ kín <i>toàn bộ</i> mặt phẳng.
          </Hint>
        )}
      </Section>

      <Section kind="theory" title="Khái niệm xương sống: linear combination & span">
        <p>
          Một <b>linear combination</b> (tổ hợp tuyến tính) của v và w là bất kỳ vector nào
          viết được dưới dạng
        </p>
        <MathText block tex="a\,\vec{v} + b\,\vec{w}" />
        <p>
          với a, b là hai scalar tùy ý. Ta chỉ dùng đúng hai phép đã học: <b>scale</b> mỗi
          vector rồi <b>cộng</b> lại. Điều bạn vừa làm bằng tay chính là điều này.
        </p>
        <p>
          <b>Span</b> của một tập vector là <b>tập hợp tất cả</b> các linear combination của
          chúng — mọi nơi bạn có thể "với tới" được:
        </p>
        <MathText block tex="\operatorname{span}\{\vec{v}, \vec{w}\} = \{\, a\,\vec{v} + b\,\vec{w} : a, b \in \mathbb{R} \,\}" />
        <p>Trong ℝ², span của hai vector chỉ có thể là một trong ba trường hợp:</p>
        <ul>
          <li>
            <b>Cả mặt phẳng</b> — khi v, w lệch hướng nhau (độc lập). Hai "trục xiên" v và w
            đủ để đi tới mọi điểm.
          </li>
          <li>
            <b>Một đường thẳng</b> — khi v, w thẳng hàng (một cái là bội của cái kia). Ta bị
            kẹt trên một đường, như bạn đã thấy khi det ≈ 0.
          </li>
          <li>
            <b>Chỉ điểm gốc</b> — khi cả hai đều là vector không.
          </li>
        </ul>
        <p>
          Đại lượng <MathText tex="\det(\vec{v}, \vec{w}) = v_x w_y - v_y w_x" /> chính là "máy
          dò": bằng 0 nghĩa là thẳng hàng, khác 0 nghĩa là phủ cả mặt phẳng. Ý tưởng span là{' '}
          <b>xương sống</b> của toàn bộ môn học — basis, dimension, rank, nghiệm của hệ phương
          trình... tất cả đều là những câu hỏi về span.
        </p>
      </Section>

      <Section kind="explore" title="Span của hai vector trong ℝ³ = một mặt phẳng">
        <Scene3D
          height={380}
          vectors={[
            { id: 'u', v: [2, 1, 0], color: '#4f9cf9', label: 'v' },
            { id: 'w', v: [1, 1.5, 1.5], color: '#f97316', label: 'w' },
            { id: 'c', v: [3, 2.5, 1.5], color: '#e879f9', label: 'v + w' },
          ]}
          spanPlanes={[{ u: [2, 1, 0], v: [1, 1.5, 1.5], color: '#22c55e', opacity: 0.22 }]}
          points={[{ p: [3, 2.5, 1.5], color: '#e879f9', label: 'v + w' }]}
        />
        <Hint>
          Hãy xoay cảnh (kéo chuột). Hai vector v, w không thẳng hàng "căng" ra một{' '}
          <b>mặt phẳng</b> đi qua gốc — đó là span của chúng trong ℝ³. Mọi tổ hợp a·v + b·w,
          ví dụ v + w (điểm hồng), đều nằm gọn trên mặt phẳng xanh lá này.
        </Hint>
      </Section>

      <Section kind="quiz" title="Kiểm tra hiểu">
        <Quiz
          lessonKey="ch1/combination"
          questions={[
            {
              q: <>Vector nào <b>không</b> phải là linear combination của <MathText tex="\vec{v}=(1,0)" /> và <MathText tex="\vec{w}=(0,1)" />?</>,
              options: ['(3, 5)', '(-2, 7)', 'Mọi vector trong ℝ² đều là', '(0, 0)'],
              answer: 2,
              explain: <>(1,0) và (0,1) lệch hướng nên span của chúng là <i>cả</i> ℝ². Vì thế mọi vector 2D đều viết được thành a·v + b·w — không có ngoại lệ.</>,
            },
            {
              q: <>Span của <MathText tex="(2, 1)" /> và <MathText tex="(4, 2)" /> là gì?</>,
              options: [
                'Cả mặt phẳng ℝ²',
                'Một đường thẳng qua gốc',
                'Chỉ điểm gốc',
                'Một hình bình hành',
              ],
              answer: 1,
              explain: <>(4,2) = 2·(2,1) nên hai vector thẳng hàng, det = 2·2 − 1·4 = 0. Span co lại thành một đường thẳng.</>,
            },
            {
              q: <>Trong ℝ³, span của hai vector <b>không thẳng hàng</b> là:</>,
              options: [
                'Cả không gian ℝ³',
                'Một mặt phẳng đi qua gốc',
                'Một đường thẳng',
                'Một quả cầu',
              ],
              answer: 1,
              explain: <>Hai vector độc lập căng ra một mặt phẳng qua gốc. Muốn phủ kín cả ℝ³ cần tới ba vector không đồng phẳng.</>,
            },
            {
              q: <>Đại lượng <MathText tex="\det(\vec{v}, \vec{w})" /> trong ℝ² cho biết điều gì?</>,
              options: [
                'Độ dài của v cộng w',
                'Bằng 0 khi và chỉ khi v, w thẳng hàng (span sập xuống một đường)',
                'Luôn bằng góc giữa hai vector',
                'Bằng 0 khi hai vector vuông góc',
              ],
              answer: 1,
              explain: <>det = vₓwᵧ − vᵧwₓ đo "diện tích hình bình hành" của v và w. Bằng 0 nghĩa là hình bẹp — hai vector thẳng hàng, span chỉ còn một đường.</>,
            },
          ]}
        />
      </Section>
    </Lesson>
  );
}
