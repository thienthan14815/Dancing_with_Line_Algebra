import { useState } from 'react';
import { Lesson, Section } from '../../components/Lesson';
import MathText from '../../components/MathText';
import Canvas2D, { useCanvas2D } from '../../components/Canvas2D';
import Slider from '../../components/Slider';
import StepByStep from '../../components/StepByStep';
import Quiz from '../../components/Quiz';

const r2 = (x: number) => Math.round(x * 100) / 100;

// Đường tròn đơn vị + điểm chạy + đoạn cos/sin, vẽ trong tọa độ thế giới
function UnitCircle({ theta }: { theta: number }) {
  const { toScreen } = useCanvas2D();
  const [ox, oy] = toScreen(0, 0);
  const [rx] = toScreen(1, 0);
  const R = rx - ox; // bán kính 1 đơn vị tính bằng pixel

  const c = Math.cos(theta);
  const s = Math.sin(theta);
  const [pxs, pys] = toScreen(c, s); // điểm trên đường tròn
  const [fxs, fys] = toScreen(c, 0); // chân đường vuông góc trên trục x

  return (
    <g>
      <circle cx={ox} cy={oy} r={R} fill="none" stroke="var(--text-muted)" strokeWidth={1.5} />
      {/* cos: đoạn ngang trên trục x */}
      <line x1={ox} y1={oy} x2={fxs} y2={fys} stroke="var(--vec-2)" strokeWidth={4} />
      {/* sin: đoạn dọc từ trục x lên tới điểm */}
      <line x1={fxs} y1={fys} x2={pxs} y2={pys} stroke="var(--vec-3)" strokeWidth={4} />
      {/* bán kính tới điểm */}
      <line x1={ox} y1={oy} x2={pxs} y2={pys} stroke="var(--vec-1)" strokeWidth={2} />
      {/* điểm chạy */}
      <circle cx={pxs} cy={pys} r={6} fill="var(--vec-result)" />
    </g>
  );
}

export default function Trig() {
  const [theta, setTheta] = useState(0.9);
  const c = Math.cos(theta);
  const s = Math.sin(theta);

  return (
    <Lesson id="trig" title="Đường tròn đơn vị: sin & cos">
      <Section kind="explore" title="Quay quanh vòng tròn, đọc cos và sin">
        <p className="muted">
          Hãy <b>kéo thanh trượt góc <MathText tex="\theta" /></b> từ 0 đến{' '}
          <MathText tex="2\pi" />. Điểm hồng chạy quanh đường tròn bán kính 1. Đoạn{' '}
          <span style={{ color: 'var(--vec-2)' }}>cam nằm ngang</span> là{' '}
          <MathText tex="\cos\theta" />, đoạn{' '}
          <span style={{ color: 'var(--vec-3)' }}>lục thẳng đứng</span> là{' '}
          <MathText tex="\sin\theta" />. Để ý chúng lớn/nhỏ, dương/âm thế nào khi
          điểm đi qua từng góc phần tư.
        </p>

        <Canvas2D height={400} range={1.6} showGrid={false}>
          <UnitCircle theta={theta} />
        </Canvas2D>

        <Slider
          label="Góc θ"
          min={0}
          max={Math.PI * 2}
          value={theta}
          onChange={setTheta}
          format={(v) => `${r2(v)} rad = ${Math.round((v * 180) / Math.PI)}°`}
        />

        <div className="row" style={{ fontSize: 14, marginTop: 4 }}>
          <span className="mono" style={{ color: 'var(--vec-2)' }}>cos θ = {r2(c)}</span>
          <span className="mono" style={{ color: 'var(--vec-3)' }}>sin θ = {r2(s)}</span>
          <span className="mono" style={{ color: 'var(--accent)' }}>
            cos²θ + sin²θ = {r2(c * c + s * s)}
          </span>
        </div>
        <p className="dim" style={{ fontSize: 12 }}>
          Kéo tới đâu cũng vậy: <MathText tex="\cos^2\theta + \sin^2\theta" /> luôn
          đúng bằng 1. Đó không phải trùng hợp — xem phần lý thuyết.
        </p>
      </Section>

      <Section kind="theory" title="Định nghĩa gọn nhất của sin và cos">
        <p>
          Quên các "tam giác đối / kề / huyền" đi một chút. Định nghĩa hiện đại và
          sạch nhất là qua đường tròn đơn vị: cho điểm chạy quanh đường tròn bán kính
          1, xuất phát từ <MathText tex="(1, 0)" /> và quay ngược chiều kim đồng hồ
          một góc <MathText tex="\theta" />. Khi đó, theo <b>đúng định nghĩa</b>, tọa
          độ của điểm là:
        </p>
        <MathText block tex="(\cos\theta,\ \sin\theta)" />
        <p>
          Vậy <MathText tex="\cos\theta" /> chính là hoành độ (đi ngang bao nhiêu),
          còn <MathText tex="\sin\theta" /> là tung độ (đi dọc bao nhiêu). Thế là đủ
          hiểu vì sao cả hai luôn nằm trong đoạn <MathText tex="[-1, 1]" />: điểm không
          bao giờ ra khỏi đường tròn.
        </p>
        <p>
          <b>Tại sao <MathText tex="\cos^2\theta + \sin^2\theta = 1" />?</b> Vì điểm
          nằm trên đường tròn bán kính 1! Khoảng cách từ nó tới gốc luôn bằng 1. Áp
          định lý Pythagoras cho tam giác vuông có hai cạnh góc vuông{' '}
          <MathText tex="\cos\theta" /> và <MathText tex="\sin\theta" />, cạnh
          huyền là bán kính = 1:
        </p>
        <MathText block tex="\cos^2\theta + \sin^2\theta = 1^2 = 1" />
        <p>
          Đây chính là hai đoạn cam và lục trong hình trên — bạn đang <i>nhìn thấy</i>{' '}
          định lý Pythagoras chạy live.
        </p>
        <p>
          <b>Radian là gì?</b> Thay vì đo góc bằng độ (một vòng = 360°, con số tuỳ ý
          của người Babylon), ta đo bằng <b>độ dài cung</b> mà điểm đã đi trên đường
          tròn đơn vị. Đi hết một vòng, quãng đường là chu vi{' '}
          <MathText tex="2\pi" />, nên một vòng = <MathText tex="2\pi" /> radian.
          Suy ra <MathText tex="180° = \pi" /> và <MathText tex="90° = \tfrac{\pi}{2}" />.
          Radian là "đơn vị tự nhiên" mà toán cao cấp luôn dùng.
        </p>
        <div
          className="panel"
          style={{ borderColor: 'var(--vec-result)', background: 'rgba(232,121,249,0.06)' }}
        >
          <b style={{ color: 'var(--vec-result)' }}>Nhìn xa một chút.</b> Hãy nhớ hai
          số <MathText tex="\cos\theta" /> và <MathText tex="\sin\theta" /> này. Ma
          trận xoay (rotation matrix) — thứ làm nền cho đồ hoạ, robot và cả SVD sau
          này — được xây <i>trực tiếp</i> từ đúng hai số đó:{' '}
          <MathText tex="\begin{bmatrix} \cos\theta & -\sin\theta \\ \sin\theta & \cos\theta \end{bmatrix}" />.
        </div>
      </Section>

      <Section kind="steps" title="Giá trị tại các góc đặc biệt">
        <p className="muted">
          Không cần học vẹt: chỉ cần tưởng tượng điểm nằm ở đâu trên đường tròn, rồi
          đọc tọa độ.
        </p>
        <StepByStep
          steps={[
            {
              title: 'θ = 0',
              content: (
                <p>
                  Điểm ở ngay <MathText tex="(1, 0)" />. Vậy{' '}
                  <MathText tex="\cos 0 = 1" />, <MathText tex="\sin 0 = 0" />.
                </p>
              ),
            },
            {
              title: 'θ = π/6 (30°)',
              content: (
                <p>
                  Điểm hơi nhích lên:{' '}
                  <MathText tex="\cos\tfrac{\pi}{6} = \tfrac{\sqrt{3}}{2} \approx 0.87" />,{' '}
                  <MathText tex="\sin\tfrac{\pi}{6} = \tfrac{1}{2} = 0.5" />.
                </p>
              ),
            },
            {
              title: 'θ = π/4 (45°)',
              content: (
                <p>
                  Đường chéo cân đối, hoành và tung bằng nhau:{' '}
                  <MathText tex="\cos\tfrac{\pi}{4} = \sin\tfrac{\pi}{4} = \tfrac{\sqrt{2}}{2} \approx 0.71" />.
                </p>
              ),
            },
            {
              title: 'θ = π/2 (90°)',
              content: (
                <p>
                  Điểm lên đỉnh <MathText tex="(0, 1)" />. Hoành độ về 0, tung độ đạt
                  cực đại: <MathText tex="\cos\tfrac{\pi}{2} = 0" />,{' '}
                  <MathText tex="\sin\tfrac{\pi}{2} = 1" />.
                </p>
              ),
            },
            {
              title: 'θ = π (180°)',
              content: (
                <p>
                  Điểm sang trái tận cùng <MathText tex="(-1, 0)" />:{' '}
                  <MathText tex="\cos\pi = -1" />, <MathText tex="\sin\pi = 0" />.
                  Thấy chưa — cos có thể âm khi điểm ở nửa trái.
                </p>
              ),
            },
          ]}
        />
      </Section>

      <Section kind="quiz" title="Kiểm tra hiểu">
        <Quiz
          lessonKey="ch0/trig"
          questions={[
            {
              q: <>Trên đường tròn đơn vị, <MathText tex="\cos\theta" /> tương ứng với đại lượng nào của điểm?</>,
              options: [
                'Tung độ (đi dọc)',
                'Hoành độ (đi ngang)',
                'Bán kính',
                'Độ dài cung',
              ],
              answer: 1,
              explain: (
                <>
                  Tọa độ điểm là <MathText tex="(\cos\theta, \sin\theta)" />, nên
                  cos là thành phần ngang (hoành độ), sin là thành phần dọc.
                </>
              ),
            },
            {
              q: <>Vì sao <MathText tex="\cos^2\theta + \sin^2\theta = 1" /> với mọi <MathText tex="\theta" />?</>,
              options: [
                'Vì đó là một quy ước không cần lý do',
                'Vì điểm luôn nằm trên đường tròn bán kính 1, nên theo Pythagoras tổng hai bình phương tọa độ bằng bán kính bình phương = 1',
                'Vì cos và sin luôn bằng nhau',
                'Chỉ đúng khi θ nhỏ',
              ],
              answer: 1,
              explain: (
                <>
                  Khoảng cách từ điểm tới gốc luôn là 1;{' '}
                  <MathText tex="\cos^2\theta + \sin^2\theta" /> chính là bình
                  phương khoảng cách đó.
                </>
              ),
            },
            {
              q: <>Một vòng tròn đầy đủ ứng với bao nhiêu radian?</>,
              options: ['π', '2π', '360', '180'],
              answer: 1,
              explain: (
                <>
                  Radian đo bằng độ dài cung trên đường tròn đơn vị; đi hết một vòng là
                  chu vi <MathText tex="2\pi" />.
                </>
              ),
            },
            {
              q: <>Khi <MathText tex="\theta" /> đi từ 0 tới <MathText tex="\pi/2" />, giá trị <MathText tex="\sin\theta" /> thay đổi ra sao?</>,
              options: [
                'Tăng từ 0 lên 1',
                'Giảm từ 1 xuống 0',
                'Luôn bằng 0',
                'Tăng từ 0 lên vô hạn',
              ],
              answer: 0,
              explain: (
                <>
                  Điểm leo từ <MathText tex="(1,0)" /> lên <MathText tex="(0,1)" />,
                  nên tung độ (sin) tăng dần từ 0 tới cực đại 1. Bạn có thể kiểm chứng
                  bằng thanh trượt.
                </>
              ),
            },
          ]}
        />
      </Section>
    </Lesson>
  );
}
