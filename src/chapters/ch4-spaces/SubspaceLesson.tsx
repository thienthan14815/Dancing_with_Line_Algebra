import { useState } from 'react';
import { Lesson, Section } from '../../components/Lesson';
import MathText from '../../components/MathText';
import Scene3D from '../../components/Scene3D';
import Quiz from '../../components/Quiz';
import { Hint, Callout, Choice, HEX } from './_shared';

type View = 'origin' | 'line' | 'plane' | 'counter';

export default function SubspaceLesson() {
  const [view, setView] = useState<View>('plane');

  // Đường thẳng qua gốc: hướng d
  const lineDir: [number, number, number] = [2, 1, 0.6];
  // Mặt phẳng qua gốc: span của u, v
  const planeU: [number, number, number] = [2, 0, 0.5];
  const planeV: [number, number, number] = [0, 2, 0.5];

  // Phản ví dụ: đường thẳng KHÔNG qua gốc (x = 1, z = 0, y tự do)
  // v nằm trên đường; 2v bay ra khỏi đường.
  const vOnLine: [number, number, number] = [1, 1.5, 0];
  const twoV: [number, number, number] = [2, 3, 0];

  return (
    <Lesson id="subspace" title="Subspace">
      <Section kind="explore" title="Bảo tàng các subspace của ℝ³">
        <Choice<View>
          value={view}
          onChange={setView}
          options={[
            { id: 'origin', label: 'Chỉ gốc O' },
            { id: 'line', label: 'Đường qua gốc' },
            { id: 'plane', label: 'Mặt phẳng qua gốc' },
            { id: 'counter', label: '⚠️ Đường KHÔNG qua gốc' },
          ]}
        />

        {view === 'origin' && (
          <Scene3D
            height={400}
            points={[{ p: [0, 0, 0], color: HEX.result, label: 'O' }]}
          />
        )}

        {view === 'line' && (
          <Scene3D
            height={400}
            lines3={[
              {
                from: [-3 * lineDir[0], -3 * lineDir[1], -3 * lineDir[2]],
                to: [3 * lineDir[0], 3 * lineDir[1], 3 * lineDir[2]],
                color: HEX.v1,
              },
            ]}
            vectors={[{ id: 'd', v: lineDir, color: HEX.v1, label: 'd' }]}
            points={[{ p: [0, 0, 0], color: HEX.result, label: 'O' }]}
          />
        )}

        {view === 'plane' && (
          <Scene3D
            height={400}
            spanPlanes={[{ u: planeU, v: planeV, color: HEX.v3, opacity: 0.22 }]}
            vectors={[
              { id: 'u', v: planeU, color: HEX.v1, label: 'u' },
              { id: 'v', v: planeV, color: HEX.v2, label: 'v' },
            ]}
            points={[{ p: [0, 0, 0], color: HEX.result, label: 'O' }]}
          />
        )}

        {view === 'counter' && (
          <Scene3D
            height={400}
            lines3={[
              // đường thẳng x = 1, z = 0 (y tự do) — KHÔNG đi qua gốc
              { from: [1, -3, 0], to: [1, 3, 0], color: HEX.v2 },
            ]}
            vectors={[
              { id: 'v', v: vOnLine, color: HEX.v1, label: 'v (trên đường)' },
              { id: '2v', v: twoV, color: HEX.result, label: '2v (bay ra ngoài!)' },
            ]}
            points={[{ p: [0, 0, 0], color: HEX.v3, label: 'O (không thuộc đường)' }]}
          />
        )}

        {view === 'counter' ? (
          <Callout tone="warn">
            ⚠️ Đường cam này <b>không đi qua gốc O</b>. Lấy một điểm v = [1, 1.5, 0] nằm trên
            đường — hợp lệ. Nhưng nhân đôi: 2v = [2, 3, 0] đã <b>văng ra khỏi đường</b> (điểm
            hồng). Một tập "đóng kín" phải giữ 2v ở lại; tập này không giữ được, nên nó{' '}
            <b>không phải subspace</b>. Chỉ cần một phản ví dụ là đủ để loại.
          </Callout>
        ) : (
          <Hint>
            Hãy xoay cảnh (kéo chuột) và bấm chuyển giữa bốn nút. Ba trường hợp đầu — điểm gốc,
            đường qua gốc, mặt phẳng qua gốc — đều <b>đi qua O</b> và "đóng kín": cộng hay
            nhân vô hướng bao nhiêu tùy ý vẫn không thoát ra. Đó chính là các subspace.
          </Hint>
        )}
      </Section>

      <Section kind="theory" title="Subspace là gì?">
        <p>
          Một <b>subspace</b> (không gian con) của <MathText tex="\mathbb{R}^n" /> là một tập
          con <MathText tex="W" /> thỏa <b>đủ ba điều kiện</b> — nói ngắn gọn là "đóng kín với
          các phép của đại số tuyến tính":
        </p>
        <ul>
          <li>
            <b>Chứa vector không:</b> <MathText tex="\vec{0} \in W" />. (Mọi subspace luôn đi
            qua gốc.)
          </li>
          <li>
            <b>Đóng với phép cộng:</b> nếu <MathText tex="\vec{u}, \vec{w} \in W" /> thì{' '}
            <MathText tex="\vec{u} + \vec{w} \in W" />.
          </li>
          <li>
            <b>Đóng với nhân vô hướng:</b> nếu <MathText tex="\vec{w} \in W" /> và{' '}
            <MathText tex="c" /> là scalar bất kỳ thì <MathText tex="c\,\vec{w} \in W" />.
          </li>
        </ul>
        <p>
          Trực giác: đứng ở bất kỳ đâu trong <MathText tex="W" />, bạn <b>không thể đi ra
          ngoài</b> bằng cách cộng hai vector hay kéo giãn một vector. Đường thẳng không qua
          gốc ở trên hỏng đúng ở điểm này: kéo giãn v đã văng ra khỏi đường.
        </p>
        <p>
          Vì sao đường thẳng phải <b>qua gốc</b>? Vì điều kiện nhân vô hướng cho phép chọn{' '}
          <MathText tex="c = 0" />, ép <MathText tex="0 \cdot \vec{w} = \vec{0}" /> phải nằm
          trong <MathText tex="W" />. Không chứa gốc là loại ngay.
        </p>
        <p>
          <b>Tại sao mọi subspace của ℝ³ chỉ có đúng 4 "cỡ"?</b> Vì một subspace được "căng ra"
          bởi span của các vector độc lập bên trong nó, và trong ℝ³ ta chỉ nhét được nhiều
          nhất 3 vector độc lập:
        </p>
        <ul>
          <li>
            <b>0 vector</b> → chỉ điểm gốc <MathText tex="\{\vec{0}\}" /> (chiều 0).
          </li>
          <li>
            <b>1 vector</b> → một <b>đường thẳng</b> qua gốc (chiều 1).
          </li>
          <li>
            <b>2 vector độc lập</b> → một <b>mặt phẳng</b> qua gốc (chiều 2).
          </li>
          <li>
            <b>3 vector độc lập</b> → <b>cả không gian</b> <MathText tex="\mathbb{R}^3" /> (chiều 3).
          </li>
        </ul>
        <p>
          Không có "cỡ" nào ở giữa — đó là vẻ đẹp gọn gàng của subspace mà ta sẽ đo bằng khái
          niệm <b>dimension</b> ở các bài sau.
        </p>
      </Section>

      <Section kind="quiz" title="Kiểm tra hiểu">
        <Quiz
          lessonKey="ch4/subspace"
          questions={[
            {
              q: (
                <>
                  Tập nào sau đây <b>không</b> phải là subspace của <MathText tex="\mathbb{R}^2" />?
                </>
              ),
              options: [
                'Đường thẳng y = 2x',
                'Đường thẳng y = 2x + 1',
                'Chỉ điểm gốc {(0,0)}',
                'Cả mặt phẳng ℝ²',
              ],
              answer: 1,
              explain: (
                <>
                  y = 2x + 1 <b>không đi qua gốc</b> (thay x = 0 được y = 1 ≠ 0), nên không chứa
                  vector 0 → hỏng ngay điều kiện đầu tiên. Ba tập còn lại đều đi qua gốc và đóng kín.
                </>
              ),
            },
            {
              q: (
                <>
                  Vì sao mọi subspace <b>bắt buộc</b> phải chứa vector <MathText tex="\vec{0}" />?
                </>
              ),
              options: [
                'Vì gốc tọa độ luôn được vẽ trên đồ thị',
                'Vì chọn scalar c = 0 buộc 0·w = 0 phải nằm trong tập',
                'Đó chỉ là quy ước, không bắt buộc',
                'Vì vector 0 có độ dài bằng 0',
              ],
              answer: 1,
              explain: (
                <>
                  Điều kiện đóng với nhân vô hướng đúng với <i>mọi</i> scalar, kể cả c = 0. Lấy bất
                  kỳ <MathText tex="\vec{w}" /> trong tập rồi nhân 0 ta được <MathText tex="\vec{0}" />,
                  buộc nó phải thuộc tập.
                </>
              ),
            },
            {
              q: <>Một subspace của ℝ³ có chiều 2 trông như thế nào?</>,
              options: [
                'Một mặt phẳng đi qua gốc',
                'Một mặt phẳng bất kỳ (kể cả không qua gốc)',
                'Một hình tròn',
                'Một đường thẳng qua gốc',
              ],
              answer: 0,
              explain: (
                <>
                  Chiều 2 = span của 2 vector độc lập = một mặt phẳng, và mọi subspace phải qua
                  gốc. Mặt phẳng không qua gốc không đóng kín nên bị loại.
                </>
              ),
            },
            {
              q: (
                <>
                  Tập <MathText tex="W" /> đóng với phép cộng và nhân vô hướng, nhưng ai đó nói
                  "W có thể không chứa 0". Nhận định đúng là:
                </>
              ),
              options: [
                'Đúng, cộng và nhân là đủ',
                'Nếu W khác rỗng thì tự động chứa 0, nên W vẫn là subspace',
                'W chắc chắn là mặt phẳng',
                'W không thể đóng với phép cộng',
              ],
              answer: 1,
              explain: (
                <>
                  Nếu <MathText tex="W" /> có ít nhất một phần tử <MathText tex="\vec{w}" />, thì
                  đóng với nhân vô hướng cho <MathText tex="0 \cdot \vec{w} = \vec{0} \in W" />. Vậy
                  hai điều kiện kia đã <i>kéo theo</i> việc chứa 0 (miễn W khác rỗng).
                </>
              ),
            },
          ]}
        />
      </Section>
    </Lesson>
  );
}
