import { useState } from 'react';
import { Lesson, Section } from '../../components/Lesson';
import MathText from '../../components/MathText';
import Canvas2D, { type V2 } from '../../components/Canvas2D';
import Scene3D from '../../components/Scene3D';
import Slider from '../../components/Slider';
import Quiz from '../../components/Quiz';
import { norm } from '../../lib/linalg';
import { f2, vec2Str, vec3Str, Stat, StatRow, Hint, TwoCol } from './_shared';

export default function IntroLesson() {
  const [v, setV] = useState({ x: 3, y: 2 });
  const [v3, setV3] = useState<[number, number, number]>([2, 1, 2]);

  const len2 = norm([v.x, v.y]);
  const len3 = norm(v3);

  const vectors: V2[] = [
    { id: 'v', x: v.x, y: v.y, color: 'var(--vec-1)', label: 'v', draggable: true },
  ];

  return (
    <Lesson id="intro" title="Vector là gì?">
      <Section kind="explore" title="Kéo thử một vector">
        <TwoCol>
          <div>
            <div className="dim" style={{ fontSize: 12, marginBottom: 6 }}>
              Vector trong mặt phẳng ℝ²
            </div>
            <Canvas2D height={360} range={6} vectors={vectors}
              onVectorChange={(_id, x, y) => setV({ x, y })}
            />
            <StatRow>
              <Stat label="Tọa độ [x, y]" value={vec2Str(v.x, v.y)} color="var(--vec-1)" />
              <Stat label="Độ dài |v|" value={f2(len2)} color="var(--vec-result)" />
            </StatRow>
          </div>

          <div>
            <div className="dim" style={{ fontSize: 12, marginBottom: 6 }}>
              Vector trong không gian ℝ³
            </div>
            <Scene3D height={300}
              vectors={[{ id: 'v3', v: v3, color: '#4f9cf9', label: 'v' }]}
            />
            <div style={{ marginTop: 8 }}>
              <Slider label="x" min={-3} max={3} value={v3[0]}
                onChange={(n) => setV3([n, v3[1], v3[2]])} format={(n) => f2(n)} />
              <Slider label="y" min={-3} max={3} value={v3[1]}
                onChange={(n) => setV3([v3[0], n, v3[2]])} format={(n) => f2(n)} />
              <Slider label="z" min={-3} max={3} value={v3[2]}
                onChange={(n) => setV3([v3[0], v3[1], n])} format={(n) => f2(n)} />
            </div>
            <StatRow>
              <Stat label="Tọa độ" value={vec3Str(v3)} color="var(--vec-1)" />
              <Stat label="Độ dài |v|" value={f2(len3)} color="var(--vec-result)" />
            </StatRow>
          </div>
        </TwoCol>
        <Hint>
          Hãy kéo đầu mũi tên bên trái. Để ý: khi mũi tên đổi chỗ thì cặp số [x, y] và
          độ dài |v| cũng đổi theo. Bên phải, hãy chỉnh ba thanh trượt để cảm nhận một
          vector "sống" trong không gian ba chiều — vẫn chỉ là một danh sách số [x, y, z].
        </Hint>
      </Section>

      <Section kind="theory" title="Hai cách nhìn của cùng một thứ">
        <p>
          Vừa nãy bạn đã thấy tận mắt điều cốt lõi nhất: một vector có <b>hai gương mặt</b>,
          và chúng luôn khớp nhau.
        </p>
        <ul>
          <li>
            <b>Gương mặt hình học:</b> vector là một <b>mũi tên</b> — có <b>hướng</b> và có
            <b> độ dài</b>. Vị trí gốc không quan trọng; điều quan trọng là "đi bao xa, về
            phía nào".
          </li>
          <li>
            <b>Gương mặt đại số:</b> vector là một <b>danh sách số</b> có thứ tự. Mũi tên bạn
            vừa kéo tới điểm [{f2(v.x)}, {f2(v.y)}] chính là vector{' '}
            <MathText tex={`\\vec{v} = (${f2(v.x)},\\ ${f2(v.y)})`} />.
          </li>
        </ul>
        <p>
          Cả môn Đại số tuyến tính là nghệ thuật <b>đi qua đi lại</b> giữa hai gương mặt này:
          khi cần trực giác thì nhìn mũi tên, khi cần tính toán thì nhìn danh sách số.
        </p>
        <p>
          Độ dài của mũi tên tính bằng định lý Pythagoras — trong ℝ² là:
        </p>
        <MathText block tex={`|\\vec{v}| = \\sqrt{x^2 + y^2}, \\qquad |\\vec{v}| = \\sqrt{${f2(v.x)}^2 + ${f2(v.y)}^2} = ${f2(len2)}`} />
        <p>
          Ta đặt tên các không gian theo số thành phần: mặt phẳng là{' '}
          <MathText tex="\mathbb{R}^2" /> (mỗi vector 2 số), không gian là{' '}
          <MathText tex="\mathbb{R}^3" /> (3 số). Không có gì ngăn ta đi xa hơn:{' '}
          <MathText tex="\mathbb{R}^n" /> là những vector có <i>n</i> số. Ta không vẽ nổi
          ℝ⁴ hay ℝ¹⁰⁰, nhưng <b>đại số vẫn chạy y hệt</b> — đó là sức mạnh của gương mặt
          danh sách số.
        </p>
      </Section>

      <Section kind="quiz" title="Kiểm tra hiểu">
        <Quiz
          lessonKey="ch1/intro"
          questions={[
            {
              q: <>Hai vector cùng độ dài và cùng hướng nhưng được vẽ ở hai vị trí gốc khác nhau. Chúng là:</>,
              options: [
                'Hai vector khác nhau vì gốc khác nhau',
                'Cùng một vector, vì vector chỉ quan tâm hướng và độ dài',
                'Không so sánh được',
                'Chỉ bằng nhau nếu cùng nằm trên trục Ox',
              ],
              answer: 1,
              explain: <>Vector không gắn với một điểm gốc cố định. Cùng hướng và cùng độ dài nghĩa là cùng một vector, dù ta vẽ nó ở đâu.</>,
            },
            {
              q: <>Vector <MathText tex="\vec{v} = (3, 4)" /> có độ dài bằng bao nhiêu?</>,
              options: ['7', '5', '12', '25'],
              answer: 1,
              explain: <><MathText tex="\sqrt{3^2 + 4^2} = \sqrt{25} = 5" />. Độ dài là đường chéo, không phải tổng các thành phần.</>,
            },
            {
              q: <>Một vector trong <MathText tex="\mathbb{R}^5" /> là:</>,
              options: [
                'Một mũi tên ta vẽ được trên giấy',
                'Một danh sách gồm 5 số có thứ tự',
                'Một con số duy nhất',
                'Không tồn tại vì ta không hình dung được',
              ],
              answer: 1,
              explain: <>Gương mặt "danh sách số" vẫn dùng tốt ở mọi số chiều: ℝ⁵ gồm các vector có đúng 5 thành phần, dù ta không vẽ nổi chúng.</>,
            },
            {
              q: <>Vì sao ta nói vector có "hai cách nhìn"?</>,
              options: [
                'Vì nó có hai đầu mút',
                'Vì nó vừa là mũi tên (hình học) vừa là danh sách số (đại số) của cùng một đối tượng',
                'Vì nó luôn nằm trong ℝ²',
                'Vì mỗi vector có đúng hai thành phần',
              ],
              answer: 1,
              explain: <>Mũi tên và danh sách số là hai mô tả tương đương của cùng một vector — chuyển qua lại giữa chúng chính là ý tưởng nền của cả môn học.</>,
            },
          ]}
        />
      </Section>
    </Lesson>
  );
}
