import { useState } from 'react';
import { Lesson, Section } from '../../components/Lesson';
import MathText from '../../components/MathText';
import Canvas2D, { type V2 } from '../../components/Canvas2D';
import Scene3D from '../../components/Scene3D';
import Slider from '../../components/Slider';
import StepByStep from '../../components/StepByStep';
import Quiz from '../../components/Quiz';

const r2 = (x: number) => Math.round(x * 100) / 100;

export default function Coordinates() {
  const [pts, setPts] = useState<V2[]>([
    { id: 'P', x: 3, y: 2, color: 'var(--vec-result)', label: 'P', draggable: true },
  ]);
  const p = pts[0];
  const distOrigin = Math.sqrt(p.x * p.x + p.y * p.y);

  const [qx, setQx] = useState(2);
  const [qy, setQy] = useState(1);
  const [qz, setQz] = useState(3);
  const dist3 = Math.sqrt(qx * qx + qy * qy + qz * qz);

  return (
    <Lesson id="coordinates" title="Hệ tọa độ 2D & 3D">
      <Section kind="explore" title="Kéo điểm và đọc tọa độ của nó">
        <p className="muted">
          Hãy <b>kéo điểm P</b> đi khắp mặt phẳng. Để ý: mỗi vị trí ứng với đúng
          một cặp số <MathText tex="(x, y)" /> — đó chính là "địa chỉ" của điểm.
          Bên phải là phiên bản 3D: chỉnh ba thanh trượt để đưa điểm Q tới bất kỳ
          đâu trong không gian.
        </p>

        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
            gap: 16,
          }}
        >
          <div>
            <Canvas2D
              height={360}
              range={6}
              vectors={pts}
              onVectorChange={(id, x, y) =>
                setPts((vs) => vs.map((v) => (v.id === id ? { ...v, x, y } : v)))
              }
              points={[
                { x: p.x, y: 0, color: 'var(--vec-2)' },
                { x: 0, y: p.y, color: 'var(--vec-3)' },
              ]}
              segments={[
                { from: [p.x, 0], to: [p.x, p.y], color: 'var(--vec-3)', dashed: true },
                { from: [0, p.y], to: [p.x, p.y], color: 'var(--vec-2)', dashed: true },
              ]}
            />
            <p className="dim" style={{ fontSize: 12 }}>
              P = (<span style={{ color: 'var(--vec-2)' }}>{r2(p.x)}</span>,{' '}
              <span style={{ color: 'var(--vec-3)' }}>{r2(p.y)}</span>) — khoảng cách
              tới gốc O:{' '}
              <span className="mono" style={{ color: 'var(--accent)' }}>
                {r2(distOrigin)}
              </span>
            </p>
          </div>

          <div>
            <Scene3D
              height={300}
              points={[{ p: [qx, qy, qz], color: '#e879f9', label: 'Q' }]}
              lines3={[
                { from: [qx, qy, qz], to: [qx, 0, qz], color: '#e879f9', dashed: true },
                { from: [qx, 0, qz], to: [0, 0, 0], color: '#6b7486', dashed: true },
              ]}
            />
            <Slider label="x của Q" min={-4} max={4} value={qx} onChange={setQx} format={(v) => r2(v).toString()} />
            <Slider label="y của Q" min={-4} max={4} value={qy} onChange={setQy} format={(v) => r2(v).toString()} />
            <Slider label="z của Q" min={-4} max={4} value={qz} onChange={setQz} format={(v) => r2(v).toString()} />
            <p className="dim" style={{ fontSize: 12 }}>
              Q = ({r2(qx)}, {r2(qy)}, {r2(qz)}) — khoảng cách tới O:{' '}
              <span className="mono" style={{ color: 'var(--accent)' }}>
                {r2(dist3)}
              </span>
            </p>
          </div>
        </div>
      </Section>

      <Section kind="theory" title="Tọa độ là địa chỉ của điểm">
        <p>
          Một hệ tọa độ cho ta cách <b>gán số cho vị trí</b>. Trong mặt phẳng, ta
          chọn hai trục vuông góc: trục ngang <MathText tex="Ox" /> và trục dọc{' '}
          <MathText tex="Oy" />. Mọi điểm giờ có một địa chỉ duy nhất{' '}
          <MathText tex="(x, y)" />: đi ngang <MathText tex="x" /> bước, rồi đi dọc{' '}
          <MathText tex="y" /> bước. Không có điểm nào bị trùng địa chỉ, và không địa
          chỉ nào bị bỏ trống — đó là điều làm hệ tọa độ mạnh mẽ.
        </p>
        <p>
          Muốn biết hai điểm cách nhau bao xa? Dùng định lý Pythagoras. Khoảng cách
          Euclid giữa <MathText tex="A(x_1, y_1)" /> và <MathText tex="B(x_2, y_2)" /> là:
        </p>
        <MathText block tex="d(A, B) = \sqrt{(x_2 - x_1)^2 + (y_2 - y_1)^2}" />
        <p>
          Vẻ đẹp nằm ở chỗ công thức này <b>không dừng ở 2 chiều</b>. Thêm một trục{' '}
          <MathText tex="Oz" /> vuông góc với cả hai trục cũ, ta có không gian 3D với
          địa chỉ <MathText tex="(x, y, z)" /> và khoảng cách chỉ việc thêm một số hạng:
        </p>
        <MathText block tex="d = \sqrt{(\Delta x)^2 + (\Delta y)^2 + (\Delta z)^2}" />
        <p>
          Và không có lý do gì để dừng lại! Với <MathText tex="n" /> chiều, một điểm
          là bộ <MathText tex="n" /> số <MathText tex="(x_1, x_2, \ldots, x_n)" /> —
          ta gọi tập tất cả các điểm như vậy là <MathText tex="\mathbb{R}^n" />. Ta
          không vẽ được <MathText tex="\mathbb{R}^4" />, nhưng công thức khoảng cách
          vẫn chạy y hệt. Đại số tuyến tính chính là nghệ thuật làm việc trong{' '}
          <MathText tex="\mathbb{R}^n" /> mà không cần "nhìn thấy" nó.
        </p>
      </Section>

      <Section kind="steps" title="Tính khoảng cách giữa hai điểm, từng bước">
        <p className="muted">
          Ví dụ: <MathText tex="A(1, 2)" /> và <MathText tex="B(4, 6)" />. Ta sẽ ráp
          từng mảnh của công thức Pythagoras.
        </p>
        <StepByStep
          steps={[
            {
              title: 'Bước 1 — Hiệu theo trục x',
              content: (
                <p>
                  Đi từ A sang B, tọa độ x đổi bao nhiêu?{' '}
                  <MathText tex="\Delta x = x_2 - x_1 = 4 - 1 = 3" />.
                </p>
              ),
            },
            {
              title: 'Bước 2 — Hiệu theo trục y',
              content: (
                <p>
                  Tương tự cho trục y:{' '}
                  <MathText tex="\Delta y = y_2 - y_1 = 6 - 2 = 4" />.
                </p>
              ),
            },
            {
              title: 'Bước 3 — Bình phương rồi cộng',
              content: (
                <p>
                  Đây là "cạnh huyền" của một tam giác vuông có hai cạnh góc vuông 3
                  và 4: <MathText tex="\Delta x^2 + \Delta y^2 = 3^2 + 4^2 = 9 + 16 = 25" />.
                </p>
              ),
            },
            {
              title: 'Bước 4 — Lấy căn bậc hai',
              content: (
                <p>
                  <MathText tex="d(A, B) = \sqrt{25} = 5" />. Vậy A và B cách nhau
                  đúng 5 đơn vị. (Bộ ba 3–4–5 quen thuộc là có lý do!)
                </p>
              ),
            },
          ]}
        />
      </Section>

      <Section kind="quiz" title="Kiểm tra hiểu">
        <Quiz
          lessonKey="ch0/coordinates"
          questions={[
            {
              q: (
                <>
                  Điểm <MathText tex="(0, -3)" /> nằm ở đâu?
                </>
              ),
              options: [
                'Trên trục x, bên phải gốc',
                'Trên trục y, phía dưới gốc',
                'Trên trục y, phía trên gốc',
                'Ở gốc tọa độ',
              ],
              answer: 1,
              explain: (
                <>
                  Vì <MathText tex="x = 0" /> nên điểm nằm ngay trên trục y; và{' '}
                  <MathText tex="y = -3 < 0" /> nên nó ở phía dưới gốc.
                </>
              ),
            },
            {
              q: <>Khoảng cách từ gốc O tới điểm <MathText tex="(6, 8)" /> bằng?</>,
              options: ['10', '14', '48', '√14'],
              answer: 0,
              explain: (
                <>
                  <MathText tex="\sqrt{6^2 + 8^2} = \sqrt{36 + 64} = \sqrt{100} = 10" />.
                  Lại một bộ Pythagoras đẹp (6–8–10).
                </>
              ),
            },
            {
              q: (
                <>
                  Để xác định vị trí một điểm trong <MathText tex="\mathbb{R}^3" />,
                  cần ít nhất bao nhiêu con số?
                </>
              ),
              options: ['1', '2', '3', 'Vô hạn'],
              answer: 2,
              explain: (
                <>
                  Mỗi trục cần đúng một tọa độ, và <MathText tex="\mathbb{R}^3" /> có
                  ba trục độc lập — nên cần đúng ba số <MathText tex="(x, y, z)" />.
                </>
              ),
            },
            {
              q: (
                <>
                  Vì sao ta vẫn tính được khoảng cách trong{' '}
                  <MathText tex="\mathbb{R}^{10}" /> dù không vẽ được nó?
                </>
              ),
              options: [
                'Vì máy tính vẽ hộ ta',
                'Vì công thức Pythagoras chỉ là cộng các bình phương hiệu tọa độ, không giới hạn số chiều',
                'Vì mọi không gian trên 3 chiều đều giống hệt nhau',
                'Không tính được, đó là điều bất khả thi',
              ],
              answer: 1,
              explain: (
                <>
                  Khoảng cách chỉ là{' '}
                  <MathText tex="\sqrt{\sum (\Delta x_i)^2}" /> — một phép cộng có
                  bao nhiêu số hạng cũng được. Hình vẽ chỉ là công cụ hỗ trợ, còn công
                  thức mới là bản chất.
                </>
              ),
            },
          ]}
        />
      </Section>
    </Lesson>
  );
}
