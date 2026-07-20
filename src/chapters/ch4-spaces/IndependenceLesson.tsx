import { useState } from 'react';
import { Lesson, Section } from '../../components/Lesson';
import MathText from '../../components/MathText';
import Canvas2D, { type V2 } from '../../components/Canvas2D';
import Scene3D from '../../components/Scene3D';
import StepByStep from '../../components/StepByStep';
import Quiz from '../../components/Quiz';
import { rrefSteps, type Mat } from '../../lib/linalg';
import { f2, cross2, Stat, StatRow, Hint, Callout, Choice, matTex, HEX } from './_shared';

const WHOLE_PLANE: [number, number][] = [
  [-6, -6],
  [6, -6],
  [6, 6],
  [-6, 6],
];

type Preset = 'indep' | 'coplanar';

export default function IndependenceLesson() {
  const [v, setV] = useState({ x: 2.5, y: 0.5 });
  const [w, setW] = useState({ x: 0.5, y: 2 });
  const [preset, setPreset] = useState<Preset>('indep');

  const vv: [number, number] = [v.x, v.y];
  const ww: [number, number] = [w.x, w.y];
  const det = cross2(vv, ww);
  const dependent = Math.abs(det) < 0.05;

  const onChange = (id: string, x: number, y: number) => {
    if (id === 'v') setV({ x, y });
    else if (id === 'w') setW({ x, y });
  };

  const vectors: V2[] = [
    { id: 'v', x: v.x, y: v.y, color: HEX.v1, label: 'v', draggable: true },
    { id: 'w', x: w.x, y: w.y, color: HEX.v2, label: 'w', draggable: true },
  ];

  // Span mờ: độc lập → cả mặt phẳng; phụ thuộc → một đường.
  const polys = dependent ? [] : [{ points: WHOLE_PLANE, fill: HEX.v3, opacity: 0.14 }];
  const dir = Math.hypot(vv[0], vv[1]) > 1e-6 ? vv : ww;
  const spanLine = dependent ? [{ a: dir[1], b: -dir[0], c: 0, color: HEX.v3 }] : [];

  // ----- Steps: kiểm tra độc lập bằng rref của [v | w] (cột) -----
  const M: Mat = [
    [v.x, w.x],
    [v.y, w.y],
  ];
  const { steps: rSteps, rref } = rrefSteps(M);
  const pivots = rref.filter((row) => row.some((x) => Math.abs(x) > 1e-8)).length;
  const stepItems = rSteps.map((s, i) => ({
    title: i === 0 ? 'Xếp v, w thành các cột' : s.desc,
    content: (
      <div>
        <MathText block tex={matTex(s.matrix)} />
        {i === 0 && (
          <p className="dim" style={{ fontSize: 12.5 }}>
            Ta giải hệ thuần nhất <MathText tex="c_1 \vec{v} + c_2 \vec{w} = \vec{0}" /> bằng cách
            đưa ma trận cột về RREF.
          </p>
        )}
      </div>
    ),
  }));
  stepItems.push({
    title: 'Kết luận',
    content: (
      <div>
        <p>
          RREF có <b>{pivots} pivot</b> trên {2} cột.{' '}
          {pivots === 2 ? (
            <>
              Mỗi cột đều có pivot → chỉ nghiệm tầm thường <MathText tex="c_1 = c_2 = 0" /> →{' '}
              <b style={{ color: 'var(--good)' }}>độc lập</b>.
            </>
          ) : (
            <>
              Có cột thiếu pivot (biến tự do) → tồn tại nghiệm khác 0 →{' '}
              <b style={{ color: 'var(--warn)' }}>phụ thuộc</b>.
            </>
          )}
        </p>
      </div>
    ),
  });

  return (
    <Lesson id="independence" title="Linear independence">
      <Section kind="explore" title="Kéo hai vector — độc lập hay phụ thuộc?">
        <Canvas2D
          height={420}
          range={5}
          vectors={vectors}
          onVectorChange={onChange}
          polygons={polys}
          lines={spanLine}
        />
        <StatRow>
          <Stat label="det(v, w)" value={f2(det)} color={dependent ? 'var(--warn)' : 'var(--good)'} />
          <Stat
            label="Trạng thái"
            value={dependent ? 'PHỤ THUỘC' : 'ĐỘC LẬP'}
            color={dependent ? 'var(--warn)' : 'var(--good)'}
          />
        </StatRow>
        {dependent ? (
          <Callout tone="warn">
            ⚠️ v và w đang <b>thẳng hàng</b> (det ≈ 0): w là một bội của v, nên w{' '}
            <b>không mang hướng mới nào</b> — nó "thừa". Span sập từ cả mặt phẳng xuống chỉ còn
            đường xanh lá. Hãy kéo cho hai mũi tên lệch hướng để chúng độc lập trở lại.
          </Callout>
        ) : (
          <Hint>
            Hãy kéo hai đầu mũi tên. Khi chúng lệch hướng nhau, không cái nào viết được từ cái
            kia — <b>độc lập</b> — và span phủ kín cả mặt phẳng (vùng xanh mờ). Kéo cho w trùng
            phương v để thấy khoảnh khắc det về 0 và span "sụp" thành một đường.
          </Hint>
        )}
      </Section>

      <Section kind="explore" title="Trong ℝ³: khi nào vector thứ ba là 'thừa'?">
        <Choice<Preset>
          value={preset}
          onChange={setPreset}
          options={[
            { id: 'indep', label: '3 vector độc lập' },
            { id: 'coplanar', label: '3 vector đồng phẳng' },
          ]}
        />
        {preset === 'indep' ? (
          <Scene3D
            height={380}
            vectors={[
              { id: 'a', v: [2.2, 0, 0.4], color: HEX.v1, label: 'v₁' },
              { id: 'b', v: [0.3, 2.2, 0.4], color: HEX.v2, label: 'v₂' },
              { id: 'c', v: [0.4, 0.4, 2.2], color: HEX.result, label: 'v₃' },
            ]}
          />
        ) : (
          <Scene3D
            height={380}
            vectors={[
              { id: 'a', v: [2, 0, 1], color: HEX.v1, label: 'v₁' },
              { id: 'b', v: [0, 2, 1], color: HEX.v2, label: 'v₂' },
              { id: 'c', v: [2, 2, 2], color: HEX.result, label: 'v₃ = v₁ + v₂ (thừa!)' },
            ]}
            spanPlanes={[{ u: [2, 0, 1], v: [0, 2, 1], color: HEX.v3, opacity: 0.2 }]}
          />
        )}
        {preset === 'coplanar' ? (
          <Callout tone="warn">
            ⚠️ Cả ba vector <b>cùng nằm trên mặt phẳng xanh lá</b>. Vì v₃ = v₁ + v₂ nên v₃ chẳng
            đưa ta ra khỏi mặt phẳng đó — ba vector chỉ span được một mặt phẳng (chiều 2) chứ
            không phủ kín ℝ³. Vector thứ ba là <b>thừa</b>: đây là phụ thuộc tuyến tính.
          </Callout>
        ) : (
          <Hint>
            Hãy xoay cảnh. Ba vector này <b>không cùng một mặt phẳng</b> — mỗi cái chỉ về một
            hướng thật sự mới, nên chúng span được <b>toàn bộ</b> ℝ³. Đó là ba vector độc lập.
          </Hint>
        )}
      </Section>

      <Section kind="theory" title="Định nghĩa: không vector nào 'thừa'">
        <p>
          Tập <MathText tex="\{\vec{v}_1, \dots, \vec{v}_k\}" /> gọi là <b>độc lập tuyến tính</b>{' '}
          (linear independent) nếu phương trình tổ hợp bằng không
        </p>
        <MathText block tex="c_1 \vec{v}_1 + c_2 \vec{v}_2 + \dots + c_k \vec{v}_k = \vec{0}" />
        <p>
          <b>chỉ có nghiệm tầm thường</b> <MathText tex="c_1 = c_2 = \dots = c_k = 0" />. Nếu tồn
          tại một bộ hệ số <b>khác 0</b> làm tổ hợp bằng <MathText tex="\vec{0}" />, tập là{' '}
          <b>phụ thuộc</b> (dependent).
        </p>
        <p>
          Trực giác: phụ thuộc nghĩa là <b>ít nhất một vector viết được từ các vector còn lại</b> —
          nó không thêm hướng mới, nên "thừa". Bỏ nó đi, span vẫn y nguyên. Độc lập nghĩa là mỗi
          vector đóng góp một chiều thật sự mới cho span.
        </p>
        <p>
          Nối với <b>span</b> (chương 1): thêm một vector <i>độc lập</i> làm span <b>lớn thêm một
          chiều</b>; thêm một vector <i>phụ thuộc</i> không làm span đổi. Vì thế trong ℝ² tối đa
          2 vector độc lập, trong ℝ³ tối đa 3 — quá số đó thì chắc chắn có vector thừa.
        </p>
        <p>
          <b>Cách kiểm tra:</b> xếp các vector thành các cột của ma trận rồi đưa về RREF. Nếu{' '}
          <b>mọi cột đều có pivot</b> → độc lập; nếu có cột thiếu pivot (ứng với biến tự do) →
          phụ thuộc. Ta làm từng bước ngay dưới đây.
        </p>
      </Section>

      <Section kind="steps" title="Kiểm tra độc lập của v, w hiện tại bằng RREF">
        <StepByStep steps={stepItems} />
        <Hint>
          Các bước này cập nhật theo đúng v, w bạn đang kéo ở trên. Kéo cho chúng thẳng hàng rồi
          xem lại — bạn sẽ thấy một cột mất pivot, báo hiệu phụ thuộc.
        </Hint>
      </Section>

      <Section kind="quiz" title="Kiểm tra hiểu">
        <Quiz
          lessonKey="ch4/independence"
          questions={[
            {
              q: <>Tập vector độc lập tuyến tính khi phương trình c₁v₁ + … + cₖvₖ = 0:</>,
              options: [
                'Có ít nhất một nghiệm',
                'Chỉ có nghiệm tầm thường (mọi cᵢ = 0)',
                'Có vô số nghiệm',
                'Không bao giờ có nghiệm',
              ],
              answer: 1,
              explain: (
                <>
                  Bộ hệ số toàn 0 luôn thỏa mãn. Điều làm nên độc lập là <i>không có</i> cách nào
                  khác — nghiệm tầm thường là nghiệm <b>duy nhất</b>.
                </>
              ),
            },
            {
              q: <>Ba vector trong ℝ² thì:</>,
              options: [
                'Luôn độc lập tuyến tính',
                'Luôn phụ thuộc tuyến tính',
                'Có thể độc lập nếu vẽ khéo',
                'Luôn span được ℝ³',
              ],
              answer: 1,
              explain: (
                <>
                  ℝ² chỉ chứa tối đa 2 hướng độc lập. Vector thứ ba bắt buộc là tổ hợp của hai
                  cái kia → luôn có vector thừa → luôn phụ thuộc.
                </>
              ),
            },
            {
              q: (
                <>
                  Xếp các vector thành cột rồi đưa về RREF được 2 pivot trên 3 cột. Kết luận:
                </>
              ),
              options: [
                'Ba vector độc lập',
                'Ba vector phụ thuộc (có 1 biến tự do)',
                'Không kết luận được',
                'Ma trận khả nghịch',
              ],
              answer: 1,
              explain: (
                <>
                  Cột thiếu pivot ứng với một biến tự do, cho nghiệm khác 0 của hệ thuần nhất →
                  phụ thuộc. Số pivot (= 2) chính là số vector độc lập thật sự.
                </>
              ),
            },
            {
              q: (
                <>
                  Hai vector <MathText tex="(1, 3)" /> và <MathText tex="(2, 6)" /> thì:
                </>
              ),
              options: [
                'Độc lập',
                'Phụ thuộc, vì (2,6) = 2·(1,3)',
                'Vuông góc',
                'Span được cả ℝ²',
              ],
              answer: 1,
              explain: (
                <>
                  (2,6) là bội của (1,3) nên det = 1·6 − 3·2 = 0. Một cái viết được từ cái kia →
                  phụ thuộc, span chỉ là một đường.
                </>
              ),
            },
          ]}
        />
      </Section>
    </Lesson>
  );
}
