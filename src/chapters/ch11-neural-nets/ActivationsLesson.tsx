import { useState } from 'react';
import { Lesson, Section } from '../../components/Lesson';
import MathText from '../../components/MathText';
import Canvas2D, { useCanvas2D } from '../../components/Canvas2D';
import Slider from '../../components/Slider';
import Quiz from '../../components/Quiz';
import { sigmoid, relu, tanhAct } from '../../lib/nn';
import { f3, Stat, StatRow, Hint, BridgeLA } from './_shared';

type ActKey = 'sigmoid' | 'relu' | 'tanh';

const ACTS: Record<
  ActKey,
  { name: string; f: (x: number) => number; df: (x: number) => number; tex: string; dtex: string }
> = {
  sigmoid: {
    name: 'Sigmoid',
    f: sigmoid,
    df: (x) => {
      const a = sigmoid(x);
      return a * (1 - a);
    },
    tex: '\\sigma(x) = \\dfrac{1}{1+e^{-x}}',
    dtex: "\\sigma'(x) = \\sigma(x)\\,(1-\\sigma(x))",
  },
  relu: {
    name: 'ReLU',
    f: relu,
    df: (x) => (x > 0 ? 1 : 0),
    tex: '\\mathrm{ReLU}(x) = \\max(0, x)',
    dtex: "\\mathrm{ReLU}'(x) = \\begin{cases}1 & x>0\\\\ 0 & x<0\\end{cases}",
  },
  tanh: {
    name: 'tanh',
    f: tanhAct,
    df: (x) => 1 - tanhAct(x) * tanhAct(x),
    tex: '\\tanh(x)',
    dtex: "\\tanh'(x) = 1 - \\tanh^2(x)",
  },
};

// Vẽ y = f(x) như một polyline trong tọa độ thế giới của Canvas2D.
function Curve({ f, color, dashed }: { f: (x: number) => number; color: string; dashed?: boolean }) {
  const { toScreen, range } = useCanvas2D();
  const N = 240;
  const pts: string[] = [];
  for (let i = 0; i <= N; i++) {
    const x = -range + (2 * range * i) / N;
    const y = f(x);
    if (!Number.isFinite(y)) continue;
    const yc = Math.max(-range * 2, Math.min(range * 2, y));
    const [sx, sy] = toScreen(x, yc);
    pts.push(`${sx},${sy}`);
  }
  return (
    <polyline
      points={pts.join(' ')}
      fill="none"
      stroke={color}
      strokeWidth={2.6}
      strokeDasharray={dashed ? '6 5' : undefined}
    />
  );
}

export default function ActivationsLesson() {
  const [act, setAct] = useState<ActKey>('sigmoid');
  const [x, setX] = useState(0.8);
  const A = ACTS[act];
  const y = A.f(x);
  const dy = A.df(x);

  return (
    <Lesson id="activations" title="Hàm kích hoạt (Activation functions)">
      <Section kind="explore" title="Đồ thị hàm & đạo hàm của nó">
        <div className="row" style={{ gap: 8, marginBottom: 8 }}>
          {(Object.keys(ACTS) as ActKey[]).map((k) => (
            <button key={k} className={`btn ${act === k ? 'btn-primary' : ''}`} onClick={() => setAct(k)}>
              {ACTS[k].name}
            </button>
          ))}
        </div>
        <Canvas2D
          height={400}
          range={4}
          transformElements={false}
          points={[{ x, y: Math.max(-8, Math.min(8, y)), color: 'var(--vec-result)', label: 'f(x)' }]}
          segments={[{ from: [x, -4], to: [x, 4], color: 'var(--text-dim)', dashed: true }]}
        >
          <Curve f={A.f} color="var(--vec-1)" />
          <Curve f={A.df} color="var(--warn)" dashed />
        </Canvas2D>
        <div className="dim" style={{ fontSize: 12, marginTop: 4 }}>
          <span style={{ color: 'var(--vec-1)' }}>■ đường liền</span> = <MathText tex={A.tex} />;{' '}
          <span style={{ color: 'var(--warn)' }}>■ đường đứt</span> = đạo hàm <MathText tex={A.dtex} />.
        </div>
        <Slider label="x (đầu vào)" min={-4} max={4} value={x} onChange={setX} format={(v) => f3(v)} />
        <StatRow>
          <Stat label={`${A.name}(x)`} value={f3(y)} color="var(--vec-1)" />
          <Stat label="đạo hàm f′(x)" value={f3(dy)} color="var(--warn)" />
          <Stat
            label="gradient"
            value={Math.abs(dy) < 0.05 ? 'gần như tắt' : 'còn sống'}
            color={Math.abs(dy) < 0.05 ? 'var(--bad)' : 'var(--good)'}
          />
        </StatRow>
        <Hint>
          Kéo <MathText tex="x" /> ra xa 0 với <b>sigmoid</b> hoặc <b>tanh</b>: đường đứt (đạo hàm) tụt gần 0 — vùng{' '}
          <b>bão hòa</b>. Gradient ~0 nghĩa là backprop gần như không cập nhật được trọng số: đó là{' '}
          <b>vanishing gradient</b>. Với <b>ReLU</b>, đạo hàm luôn là 1 ở phía dương nên gradient không teo.
        </Hint>
      </Section>

      <Section kind="theory" title="Vì sao BẮT BUỘC phải phi tuyến?">
        <p>
          Giả sử ta bỏ hết hàm kích hoạt (hoặc dùng hàm "tuyến tính" <MathText tex="\phi(z)=z" />). Khi đó hai lớp
          liên tiếp là:
        </p>
        <MathText block tex="W_2\big(W_1\mathbf{x} + \mathbf{b}_1\big) + \mathbf{b}_2 = \underbrace{(W_2 W_1)}_{W_{\text{eff}}}\mathbf{x} + \underbrace{(W_2\mathbf{b}_1 + \mathbf{b}_2)}_{\mathbf{b}_{\text{eff}}}" />
        <p>
          Kết quả vẫn là một biến đổi affine <MathText tex="W_{\text{eff}}\mathbf{x} + \mathbf{b}_{\text{eff}}" /> —{' '}
          <b>một lớp duy nhất</b>! Chồng 100 lớp tuyến tính cũng chỉ mạnh bằng 1. Hàm kích hoạt phi tuyến "bẻ cong"
          không gian giữa các lớp, giúp mạng biểu diễn được những ranh giới phức tạp (như XOR).
        </p>
        <p><b>So sánh nhanh ba hàm phổ biến:</b></p>
        <ul>
          <li>
            <b>Sigmoid</b> <MathText tex="\to (0,1)" />: đọc như xác suất, nhưng <b>bão hòa</b> hai đầu → gradient
            tiêu biến; đầu ra không đối xứng quanh 0.
          </li>
          <li>
            <b>tanh</b> <MathText tex="\to (-1,1)" />: đối xứng quanh 0 (thường hội tụ tốt hơn sigmoid), nhưng vẫn{' '}
            <b>bão hòa</b> khi <MathText tex="|x|" /> lớn.
          </li>
          <li>
            <b>ReLU</b> <MathText tex="=\max(0,x)" />: rẻ, không bão hòa phía dương → giảm mạnh vanishing gradient,
            tạo biểu diễn thưa; nhược điểm là <b>dying ReLU</b> (neuron kẹt ở 0 khi luôn nhận đầu vào âm).
          </li>
        </ul>
        <BridgeLA>
          Đây là lý do sâu xa để dùng phi tuyến, phát biểu bằng ngôn ngữ Chương 3: <b>hợp của các biến đổi tuyến
          tính vẫn là một biến đổi tuyến tính</b> (nhân dồn ma trận cho ra <i>một</i> ma trận). Muốn vượt khỏi lớp
          hàm tuyến tính, phải chèn một bước phi tuyến giữa các phép nhân ma trận — hàm kích hoạt chính là bước đó.
        </BridgeLA>
      </Section>

      <Section kind="quiz" title="Kiểm tra hiểu">
        <Quiz
          lessonKey="ch11/activations"
          questions={[
            {
              q: <>Điều gì xảy ra nếu một mạng nhiều lớp <b>không</b> dùng hàm kích hoạt phi tuyến?</>,
              options: [
                'Mạng học nhanh hơn hẳn',
                'Toàn mạng thu về đúng một biến đổi tuyến tính (một lớp)',
                'Mạng không thể lan truyền xuôi',
                'Gradient luôn bằng 0',
              ],
              answer: 1,
              explain: (
                <>
                  <MathText tex="W_2(W_1\mathbf{x}) = (W_2W_1)\mathbf{x}" />: hợp các ánh xạ tuyến tính vẫn tuyến tính,
                  nên chiều sâu trở nên vô nghĩa.
                </>
              ),
            },
            {
              q: <>Giá trị <MathText tex="\mathrm{ReLU}(-3)" /> bằng bao nhiêu?</>,
              options: ['-3', '0', '3', '1'],
              answer: 1,
              explain: <><MathText tex="\mathrm{ReLU}(x)=\max(0,x)" />, mà <MathText tex="\max(0,-3)=0" />.</>,
            },
            {
              q: <>"Vanishing gradient" ở sigmoid/tanh xảy ra khi nào?</>,
              options: [
                'Khi đầu vào x ở gần 0',
                'Khi |x| lớn, hàm bão hòa và đạo hàm tiến về 0',
                'Khi trọng số bằng 1',
                'Khi dùng batch nhỏ',
              ],
              answer: 1,
              explain: (
                <>
                  Ở hai đuôi, đường cong gần như nằm ngang → <MathText tex="f'(x)\approx 0" />, làm tín hiệu gradient teo
                  dần khi backprop qua nhiều lớp.
                </>
              ),
            },
            {
              q: <>Đạo hàm của ReLU với đầu vào dương bằng bao nhiêu?</>,
              options: ['0', '1', 'x', 'không xác định'],
              answer: 1,
              explain: (
                <>
                  Với <MathText tex="x>0" />, <MathText tex="\mathrm{ReLU}(x)=x" /> nên đạo hàm là 1 — gradient truyền qua
                  nguyên vẹn, không bị teo.
                </>
              ),
            },
          ]}
        />
      </Section>
    </Lesson>
  );
}
