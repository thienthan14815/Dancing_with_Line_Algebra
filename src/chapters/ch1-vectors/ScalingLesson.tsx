import { useState } from 'react';
import { Lesson, Section } from '../../components/Lesson';
import MathText from '../../components/MathText';
import Canvas2D, { type V2 } from '../../components/Canvas2D';
import Slider from '../../components/Slider';
import Quiz from '../../components/Quiz';
import { scale, norm } from '../../lib/linalg';
import { f2, vec2Str, Stat, StatRow, Hint } from './_shared';

export default function ScalingLesson() {
  const [v, setV] = useState({ x: 2, y: 1 });
  const [c, setC] = useState(1.5);

  const cv = scale([v.x, v.y], c);
  const lenV = norm([v.x, v.y]);
  const lenCV = norm(cv);

  const vectors: V2[] = [
    { id: 'cv', x: cv[0], y: cv[1], color: 'var(--vec-result)', label: 'c·v' },
    { id: 'v', x: v.x, y: v.y, color: 'var(--vec-1)', label: 'v', draggable: true },
  ];

  // Đường thẳng qua gốc theo hướng v: v.y·x − v.x·y = 0
  const spanLine = { a: v.y, b: -v.x, c: 0, color: 'var(--text-dim)', label: 'mọi c·v' };

  return (
    <Lesson id="scaling" title="Nhân vô hướng (scalar multiplication)">
      <Section kind="explore" title="Co giãn một vector">
        <div style={{ marginBottom: 10 }}>
          <Slider
            label="Hệ số c (scalar)"
            min={-3}
            max={3}
            step={0.1}
            value={c}
            onChange={setC}
            format={(n) => `${f2(n)}×`}
          />
        </div>
        <Canvas2D
          height={420}
          range={7}
          vectors={vectors}
          onVectorChange={(_id, x, y) => setV({ x, y })}
          lines={[spanLine]}
        />
        <StatRow>
          <Stat label="c" value={`${f2(c)}`} color="var(--accent)" />
          <Stat label="v" value={vec2Str(v.x, v.y)} color="var(--vec-1)" />
          <Stat label="c·v" value={vec2Str(cv[0], cv[1])} color="var(--vec-result)" />
          <Stat label="|v| → |c·v|" value={`${f2(lenV)} → ${f2(lenCV)}`} color="var(--text)" />
        </StatRow>
        <Hint>
          Hãy kéo thanh trượt c. Khi <b>c &gt; 1</b> mũi tên hồng dài ra, <b>0 &lt; c &lt; 1</b>{' '}
          co ngắn lại, và khi <b>c &lt; 0</b> nó lật ngược sang phía đối diện. Dù c là gì, đầu
          mũi tên c·v luôn trượt trên cùng một <b>đường thẳng</b> mờ đi qua gốc.
        </Hint>
      </Section>

      <Section kind="theory" title="Scalar chỉ làm hai việc: co giãn & lật hướng">
        <p>
          Nhân một vector với một số (gọi là <b>scalar</b>) nghĩa là nhân số đó vào từng thành
          phần:
        </p>
        <MathText
          block
          tex={`c\\,\\vec{v} = ${f2(c)}\\cdot(${f2(v.x)},\\ ${f2(v.y)}) = (${f2(cv[0])},\\ ${f2(cv[1])})`}
        />
        <p>Kết quả tách gọn thành hai hiệu ứng độc lập:</p>
        <ul>
          <li>
            <b>Độ lớn |c|</b> quyết định độ dài co giãn bao nhiêu:{' '}
            <MathText tex="|c\,\vec{v}| = |c|\cdot|\vec{v}|" />. Ở đây{' '}
            <MathText tex={`|${f2(c)}|\\cdot ${f2(lenV)} = ${f2(lenCV)}`} />.
          </li>
          <li>
            <b>Dấu của c</b> quyết định hướng: c dương giữ nguyên hướng, c âm lật ngược 180°,
            còn <MathText tex="c = 0" /> ép về vector không.
          </li>
        </ul>
        <p>
          Điều đáng nhớ nhất cho những bài sau: khi cho c chạy qua <i>mọi</i> số thực, tập hợp
          tất cả các c·v quét thành một <b>đường thẳng đi qua gốc</b> — chính là đường mờ trên
          hình. Đây là ví dụ đầu tiên, đơn giản nhất, của khái niệm <b>span</b> mà ta sẽ gặp ở
          bài kế tiếp.
        </p>
      </Section>

      <Section kind="quiz" title="Kiểm tra hiểu">
        <Quiz
          lessonKey="ch1/scaling"
          questions={[
            {
              q: <>Nhân <MathText tex="(2, -3)" /> với <MathText tex="-2" /> được?</>,
              options: ['(-4, 6)', '(4, -6)', '(0, -5)', '(-4, -6)'],
              answer: 0,
              explain: <><MathText tex="-2\cdot(2,-3) = (-4, 6)" />. Mỗi thành phần nhân với −2; dấu của cả hai đảo lại.</>,
            },
            {
              q: <>Nếu <MathText tex="|\vec{v}| = 5" /> thì <MathText tex="|{-3}\vec{v}|" /> bằng?</>,
              options: ['-15', '15', '5', '2'],
              answer: 1,
              explain: <>Độ dài dùng |c|: <MathText tex="|-3|\cdot 5 = 15" />. Độ dài không bao giờ âm, dù c âm.</>,
            },
            {
              q: <>Khi <MathText tex="c" /> chạy qua mọi số thực, tập các <MathText tex="c\,\vec{v}" /> (với v ≠ 0) tạo thành:</>,
              options: [
                'Một điểm duy nhất',
                'Một đường thẳng đi qua gốc',
                'Cả mặt phẳng',
                'Một hình tròn',
              ],
              answer: 1,
              explain: <>Mọi bội của v nằm trên đúng một đường thẳng qua gốc theo hướng v — đây là span của một vector.</>,
            },
            {
              q: <>Giá trị nào của c làm c·v <b>đảo hướng</b> so với v?</>,
              options: ['c = 2', 'c = 0.5', 'c = -1', 'c = 1'],
              answer: 2,
              explain: <>Chỉ c âm mới lật hướng. c = −1 cho vector ngược chiều, cùng độ dài với v.</>,
            },
          ]}
        />
      </Section>
    </Lesson>
  );
}
