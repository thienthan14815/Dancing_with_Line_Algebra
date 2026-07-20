import { useState } from 'react';
import { Lesson, Section } from '../../components/Lesson';
import MathText from '../../components/MathText';
import Canvas2D, { useCanvas2D } from '../../components/Canvas2D';
import Slider from '../../components/Slider';
import Quiz from '../../components/Quiz';

const r2 = (x: number) => Math.round(x * 100) / 100;

// Vẽ đồ thị y = f(x) như một polyline trong tọa độ thế giới của Canvas2D
function FunctionCurve({
  f,
  color = 'var(--vec-1)',
}: {
  f: (x: number) => number;
  color?: string;
}) {
  const { toScreen, range } = useCanvas2D();
  const N = 240;
  const pts: string[] = [];
  for (let i = 0; i <= N; i++) {
    const x = -range + (2 * range * i) / N;
    const y = f(x);
    if (!Number.isFinite(y)) continue;
    // Cắt bớt phần vọt quá xa để polyline không kéo dài vô lý
    const yc = Math.max(-range * 3, Math.min(range * 3, y));
    const [sx, sy] = toScreen(x, yc);
    pts.push(`${sx},${sy}`);
  }
  return <polyline points={pts.join(' ')} fill="none" stroke={color} strokeWidth={2.6} />;
}

export default function Functions() {
  const [a, setA] = useState(0.5);
  const [b, setB] = useState(0);
  const [c, setC] = useState(-1);

  const f = (x: number) => a * x * x + b * x + c;

  // Đỉnh parabol (khi a ≠ 0): x = -b/2a
  const vertexX = Math.abs(a) > 1e-9 ? -b / (2 * a) : 0;
  const vertexY = f(vertexX);

  const fmt = (n: number) => (n >= 0 ? `+ ${r2(n)}` : `- ${r2(-n)}`);

  return (
    <Lesson id="functions" title="Hàm số & đồ thị">
      <Section kind="explore" title="Chỉnh tham số, xem đồ thị biến hình">
        <p className="muted">
          Đây là một parabol <MathText tex="y = ax^2 + bx + c" />. Hãy{' '}
          <b>kéo ba thanh trượt</b> và quan sát: <MathText tex="a" /> làm đường cong
          "mở rộng / thu hẹp" và lật lên xuống, <MathText tex="b" /> trượt đỉnh sang
          ngang, còn <MathText tex="c" /> nâng cả đồ thị lên hay hạ xuống.
        </p>

        <div className="row" style={{ marginBottom: 8 }}>
          <span className="mono" style={{ color: 'var(--accent)' }}>
            y = {r2(a)}x² {fmt(b)}x {fmt(c)}
          </span>
        </div>

        <Canvas2D height={380} range={6} points={[{ x: vertexX, y: vertexY, color: 'var(--vec-result)', label: 'đỉnh' }]}>
          <FunctionCurve f={f} color="var(--vec-1)" />
        </Canvas2D>

        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
            gap: '0 20px',
          }}
        >
          <Slider label="a (độ cong)" min={-2} max={2} value={a} onChange={setA} format={(v) => r2(v).toString()} />
          <Slider label="b (trượt ngang)" min={-4} max={4} value={b} onChange={setB} format={(v) => r2(v).toString()} />
          <Slider label="c (nâng lên/xuống)" min={-4} max={4} value={c} onChange={setC} format={(v) => r2(v).toString()} />
        </div>
        <p className="dim" style={{ fontSize: 12 }}>
          Đỉnh parabol hiện ở ({r2(vertexX)}, {r2(vertexY)}). Thử đặt{' '}
          <MathText tex="a = 0" /> xem — đường cong biến thành đường thẳng, vì lúc đó
          chẳng còn số hạng <MathText tex="x^2" /> nữa.
        </p>
      </Section>

      <Section kind="theory" title="Hàm số là một cái máy">
        <p>
          Cách trực quan nhất để hiểu hàm số: nó là một <b>cái máy</b>. Bỏ một số vào
          (input <MathText tex="x" />), máy nhả ra một số khác (output{' '}
          <MathText tex="y" />). Quy tắc bên trong máy là công thức, ví dụ{' '}
          <MathText tex="f(x) = x^2 - 1" />. Ký hiệu:
        </p>
        <MathText block tex="f : \mathbb{R} \longrightarrow \mathbb{R}, \qquad x \longmapsto f(x)" />
        <p>
          Đồ thị chỉ là cách <b>chụp ảnh</b> cái máy đó: với mỗi input <MathText tex="x" /> trên
          trục ngang, ta chấm một điểm cao đúng bằng output <MathText tex="f(x)" />.
          Nối tất cả các chấm lại, ta thấy "tính cách" của hàm hiện ra thành một đường.
        </p>
        <p>
          Điều then chốt của một hàm số: mỗi input cho ra <b>đúng một</b> output. Đó là
          lý do mọi đường thẳng dọc chỉ cắt đồ thị tại tối đa một điểm.
        </p>
        <div
          className="panel"
          style={{ borderColor: 'var(--vec-result)', background: 'rgba(232,121,249,0.06)' }}
        >
          <b style={{ color: 'var(--vec-result)' }}>Nhìn xa một chút.</b> Ở đây máy ăn
          một <i>số</i> và trả một <i>số</i>. Nhưng chẳng có gì bắt input phải là số!
          Sắp tới, ta sẽ gặp những cái máy ăn cả một <b>vector</b> và nhả ra một
          vector khác. Khi cái máy đó "hiền" theo một nghĩa rất cụ thể, ta gọi nó là{' '}
          <b>biến đổi tuyến tính (linear transformation)</b> — và bất ngờ thay, nó được
          mô tả gọn gàng bằng một <b>ma trận</b>. Toàn bộ đại số tuyến tính, hiểu theo
          cách này, là môn học về một họ hàm rất đặc biệt.
        </div>
      </Section>

      <Section kind="quiz" title="Kiểm tra hiểu">
        <Quiz
          lessonKey="ch0/functions"
          questions={[
            {
              q: (
                <>
                  Với hàm <MathText tex="f(x) = x^2 - 1" />, giá trị{' '}
                  <MathText tex="f(3)" /> bằng bao nhiêu?
                </>
              ),
              options: ['5', '8', '9', '-1'],
              answer: 1,
              explain: (
                <>
                  Bỏ <MathText tex="x = 3" /> vào máy:{' '}
                  <MathText tex="3^2 - 1 = 9 - 1 = 8" />.
                </>
              ),
            },
            {
              q: <>Trong <MathText tex="y = ax^2 + bx + c" />, tham số nào chỉ nâng hay hạ toàn bộ đồ thị theo chiều dọc mà không đổi hình dạng?</>,
              options: ['a', 'b', 'c', 'Cả ba'],
              answer: 2,
              explain: (
                <>
                  <MathText tex="c" /> cộng thêm cùng một lượng vào mọi output, nên đồ
                  thị chỉ tịnh tiến lên/xuống. Bạn có thể kiểm chứng bằng thanh trượt ở trên.
                </>
              ),
            },
            {
              q: <>Vì sao một đường thẳng đứng không thể là đồ thị của một hàm số theo <MathText tex="x" />?</>,
              options: [
                'Vì đường thẳng đứng không có công thức',
                'Vì một input x sẽ ứng với vô số output y, phá vỡ quy tắc "mỗi input một output"',
                'Vì nó không đi qua gốc tọa độ',
                'Thực ra nó vẫn là một hàm số',
              ],
              answer: 1,
              explain: (
                <>
                  Trên đường thẳng đứng <MathText tex="x = 2" />, một giá trị{' '}
                  <MathText tex="x" /> duy nhất lại đi kèm mọi <MathText tex="y" /> —
                  trái với định nghĩa hàm số.
                </>
              ),
            },
            {
              q: (
                <>
                  Ý tưởng "hàm là cái máy input → output" chuẩn bị cho ta hiểu khái
                  niệm nào sắp tới?
                </>
              ),
              options: [
                'Số nguyên tố',
                'Biến đổi tuyến tính: cái máy ăn vector, nhả vector, mô tả bằng ma trận',
                'Phép chia có dư',
                'Xác suất thống kê',
              ],
              answer: 1,
              explain: (
                <>
                  Đúng vậy — ma trận sẽ đóng vai một cái máy, nhưng input và output của
                  nó là các vector chứ không phải số đơn lẻ.
                </>
              ),
            },
          ]}
        />
      </Section>
    </Lesson>
  );
}
