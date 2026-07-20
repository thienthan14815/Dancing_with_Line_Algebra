import { useState } from 'react';
import { Lesson, Section } from '../../components/Lesson';
import MathText from '../../components/MathText';
import Canvas2D, { type V2 } from '../../components/Canvas2D';
import StepByStep from '../../components/StepByStep';
import Quiz from '../../components/Quiz';
import { add, sub } from '../../lib/linalg';
import { f2, vec2Str, Stat, StatRow, Hint } from './_shared';

export default function AdditionLesson() {
  const [v, setV] = useState({ x: 3, y: 1 });
  const [w, setW] = useState({ x: 1, y: 2 });
  const [showSub, setShowSub] = useState(false);

  const sum = add([v.x, v.y], [w.x, w.y]);
  const diff = sub([v.x, v.y], [w.x, w.y]);

  const onChange = (id: string, x: number, y: number) => {
    if (id === 'v') setV({ x, y });
    else if (id === 'w') setW({ x, y });
  };

  const vectors: V2[] = [
    { id: 'v', x: v.x, y: v.y, color: 'var(--vec-1)', label: 'v', draggable: true },
    { id: 'w', x: w.x, y: w.y, color: 'var(--vec-2)', label: 'w', draggable: true },
    { id: 'sum', x: sum[0], y: sum[1], color: 'var(--vec-result)', label: 'v + w' },
  ];
  if (showSub) {
    vectors.push({ id: 'diff', x: diff[0], y: diff[1], color: 'var(--vec-3)', label: 'v − w' });
  }

  return (
    <Lesson id="addition" title="Cộng & trừ vector">
      <Section kind="explore" title="Nối đuôi hai mũi tên">
        <div className="row" style={{ marginBottom: 10 }}>
          <label className="row" style={{ gap: 6, cursor: 'pointer', fontSize: 14 }}>
            <input type="checkbox" checked={showSub} onChange={(e) => setShowSub(e.target.checked)} />
            Hiện thêm hiệu <MathText tex="\vec{v} - \vec{w}" />
          </label>
        </div>
        <Canvas2D
          height={420}
          range={7}
          vectors={vectors}
          onVectorChange={onChange}
          polygons={[
            {
              points: [
                [0, 0],
                [v.x, v.y],
                [sum[0], sum[1]],
                [w.x, w.y],
              ],
              fill: 'var(--vec-result)',
              opacity: 0.12,
              stroke: 'var(--vec-result)',
            },
          ]}
          segments={[
            // nối đuôi: dời w lên đầu v
            { from: [v.x, v.y], to: [sum[0], sum[1]], color: 'var(--vec-2)', dashed: true, label: 'w' },
            // nối đuôi: dời v lên đầu w
            { from: [w.x, w.y], to: [sum[0], sum[1]], color: 'var(--vec-1)', dashed: true, label: 'v' },
            ...(showSub
              ? [{ from: [w.x, w.y] as [number, number], to: [v.x, v.y] as [number, number], color: 'var(--vec-3)', dashed: true, label: 'w → v' }]
              : []),
          ]}
        />
        <StatRow>
          <Stat label="v" value={vec2Str(v.x, v.y)} color="var(--vec-1)" />
          <Stat label="w" value={vec2Str(w.x, w.y)} color="var(--vec-2)" />
          <Stat label="v + w" value={vec2Str(sum[0], sum[1])} color="var(--vec-result)" />
          {showSub && <Stat label="v − w" value={vec2Str(diff[0], diff[1])} color="var(--vec-3)" />}
        </StatRow>
        <Hint>
          Hãy kéo v và w. Để ý mũi tên hồng <b>v + w</b> luôn nằm ở đường chéo của hình bình
          hành. Đường nét đứt màu cam cho thấy: dời w tới <i>đầu</i> mũi tên v (nối đuôi) thì
          nó chạm đúng điểm v + w. Bật ô trên để xem hiệu v − w là "mũi tên đi từ w tới v".
        </Hint>
      </Section>

      <Section kind="theory" title="Cộng theo tọa độ ↔ nối đuôi hình học">
        <p>
          Về mặt <b>đại số</b>, cộng vector đơn giản là cộng từng thành phần tương ứng:
        </p>
        <MathText
          block
          tex={`\\vec{v} + \\vec{w} = (${f2(v.x)},\\ ${f2(v.y)}) + (${f2(w.x)},\\ ${f2(w.y)}) = (${f2(v.x)}+${f2(w.x)},\\ ${f2(v.y)}+${f2(w.y)}) = (${f2(sum[0])},\\ ${f2(sum[1])})`}
        />
        <p>
          Về mặt <b>hình học</b>, đó chính là hình bình hành bạn vừa thấy: đặt w nối đuôi vào
          v (hoặc v nối đuôi vào w) rồi đi tới điểm cuối. Hai con đường khác nhau nhưng tới
          cùng một đích — vì thế <MathText tex="\vec{v} + \vec{w} = \vec{w} + \vec{v}" /> (tính
          giao hoán) hiện ra ngay trên hình.
        </p>
        <p>
          Phép <b>trừ</b> chỉ là cộng với vector ngược dấu:{' '}
          <MathText tex="\vec{v} - \vec{w} = \vec{v} + (-\vec{w})" />. Có một cách nhìn đắt giá
          hơn: <MathText tex="\vec{v} - \vec{w}" /> là <b>"mũi tên đi từ w tới v"</b>. Vì nếu
          xuất phát ở w rồi cộng thêm (v − w), ta đến đúng v:
        </p>
        <MathText block tex="\vec{w} + (\vec{v} - \vec{w}) = \vec{v}" />
        <p>
          Ý tưởng "vector nối hai điểm = điểm cuối trừ điểm đầu" sẽ theo bạn suốt cả môn học.
        </p>
      </Section>

      <Section kind="steps" title="Cộng hai vector từng bước">
        <StepByStep
          steps={[
            {
              title: 'Bài toán',
              content: (
                <p>
                  Cộng <MathText tex="\vec{v} = (3, 1)" /> và <MathText tex="\vec{w} = (1, 2)" />.
                  Ta sẽ cộng từng thành phần một.
                </p>
              ),
            },
            {
              title: 'Bước 1 — cộng thành phần x',
              content: (
                <p>
                  Thành phần đầu: <MathText tex="3 + 1 = 4" />. Đây là quãng đường theo trục
                  ngang của tổng.
                </p>
              ),
            },
            {
              title: 'Bước 2 — cộng thành phần y',
              content: (
                <p>
                  Thành phần thứ hai: <MathText tex="1 + 2 = 3" />. Đây là quãng đường theo trục
                  dọc của tổng.
                </p>
              ),
            },
            {
              title: 'Kết quả',
              content: (
                <p>
                  <MathText tex="\vec{v} + \vec{w} = (4, 3)" />. Trên hình, đó chính là đỉnh đối
                  diện của hình bình hành dựng từ v và w.
                </p>
              ),
            },
          ]}
        />
      </Section>

      <Section kind="quiz" title="Kiểm tra hiểu">
        <Quiz
          lessonKey="ch1/addition"
          questions={[
            {
              q: <><MathText tex="(2, -1) + (-3, 4)" /> bằng?</>,
              options: ['(-1, 3)', '(5, -5)', '(-1, -3)', '(-6, -4)'],
              answer: 0,
              explain: <>Cộng từng thành phần: <MathText tex="(2{+}(-3),\ -1{+}4) = (-1, 3)" />.</>,
            },
            {
              q: <>Trong hình bình hành dựng từ v và w, vector v + w tương ứng với:</>,
              options: [
                'Một cạnh của hình bình hành',
                'Đường chéo nối gốc chung tới đỉnh đối diện',
                'Đường chéo còn lại',
                'Không nằm trong hình',
              ],
              answer: 1,
              explain: <>v + w là đường chéo xuất phát từ gốc chung của v và w. Đường chéo kia ứng với hiệu v − w.</>,
            },
            {
              q: <>Vector <MathText tex="\vec{v} - \vec{w}" /> nên được hình dung là:</>,
              options: [
                'Mũi tên đi từ v tới w',
                'Mũi tên đi từ w tới v',
                'Luôn dài hơn cả v lẫn w',
                'Luôn vuông góc với v',
              ],
              answer: 1,
              explain: <>Vì <MathText tex="\vec{w} + (\vec{v}-\vec{w}) = \vec{v}" />, hiệu v − w chính là mũi tên đưa ta từ điểm w tới điểm v.</>,
            },
            {
              q: <>Vì sao <MathText tex="\vec{v} + \vec{w} = \vec{w} + \vec{v}" /> luôn đúng?</>,
              options: [
                'Vì phép cộng số thực trên từng thành phần có tính giao hoán',
                'Vì v và w luôn cùng độ dài',
                'Chỉ đúng khi hai vector vuông góc',
                'Đó là một quy ước, không chứng minh được',
              ],
              answer: 0,
              explain: <>Mỗi thành phần là một phép cộng số thực, mà <MathText tex="a+b=b+a" />. Về hình học, đi v rồi w hay w rồi v đều tới cùng đỉnh hình bình hành.</>,
            },
          ]}
        />
      </Section>
    </Lesson>
  );
}
