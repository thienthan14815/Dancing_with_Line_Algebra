import { useState } from 'react';
import { Lesson, Section } from '../../components/Lesson';
import MathText from '../../components/MathText';
import Canvas2D, { useCanvas2D } from '../../components/Canvas2D';
import Quiz from '../../components/Quiz';
import { mlpForward, type Layer } from '../../lib/nn';
import { Hint, BridgeLA } from './_shared';

// --- Mạng nhỏ GIẢI ĐƯỢC XOR (2 → 2 ReLU → 1). Trọng số đặt sẵn (không huấn luyện).
//   h = ReLU(W1·x + b1),  y = w2·h + b2.  Đầu ra ≈ hàm "lều": lớn khi x1+x2 ≈ 1.
const XOR_NET: Layer[] = [
  { W: [[1, 1], [1, 1]], b: [0, -1], act: 'relu' },
  { W: [[1, -2]], b: [0], act: 'none' },
];
function xorOutput(x1: number, x2: number): number {
  return mlpForward([x1, x2], XOR_NET)[0];
}

const XOR_POINTS = [
  { x: 0, y: 0, label: 0 },
  { x: 1, y: 1, label: 0 },
  { x: 1, y: 0, label: 1 },
  { x: 0, y: 1, label: 1 },
];

// Tô miền phân loại theo một hàm classifier(x,y): ≥ ngưỡng → lớp 1, ngược lại lớp 0.
function ClassField({
  classify,
  threshold,
}: {
  classify: (x: number, y: number) => number;
  threshold: number;
}) {
  const { toScreen, range } = useCanvas2D();
  const N = 26;
  const span = 2 * range;
  const cell = span / N;
  const rects = [];
  for (let i = 0; i <= N; i++) {
    for (let j = 0; j <= N; j++) {
      const x = -range + (span * i) / N;
      const y = -range + (span * j) / N;
      const cls1 = classify(x, y) >= threshold;
      const [sx, sy] = toScreen(x, y);
      rects.push(
        <rect
          key={`${i}-${j}`}
          x={sx - cell * 6}
          y={sy - cell * 6}
          width={cell * 12}
          height={cell * 12}
          fill={cls1 ? 'var(--vec-1)' : 'var(--vec-3)'}
          opacity={0.18}
        />,
      );
    }
  }
  return <g>{rects}</g>;
}

export default function MlpLesson() {
  const [mode, setMode] = useState<'line' | 'mlp'>('mlp');

  // Bốn điểm XOR, tô theo NHÃN THẬT (không đổi theo mode).
  const pts = XOR_POINTS.map((p) => ({
    x: p.x,
    y: p.y,
    color: p.label === 1 ? 'var(--vec-1)' : 'var(--vec-3)',
    label: `(${p.x},${p.y})→${p.label}`,
  }));

  // Mode 'line': một đường thẳng đơn (x₁ = 0.5) — cố gắng và THẤT BẠI.
  const singleLine = [{ a: 1, b: 0, c: 0.5, color: 'var(--warn)', label: 'x₁=0.5' }];

  return (
    <Lesson id="mlp" title="Multilayer Perceptron (MLP)">
      <Section kind="explore" title="Sơ đồ mạng & bài toán XOR">
        <p className="muted">
          Bên trái là <b>sơ đồ một MLP nhỏ</b>: 2 đầu vào → 3 neuron ẩn → 1 đầu ra. Mỗi mũi tên mang một{' '}
          trọng số; mỗi nút ẩn là một neuron như ở bài trước. Bên phải là bài toán kinh điển <b>XOR</b>: bốn điểm{' '}
          với nhãn 0/1 mà <b>không đường thẳng nào</b> tách nổi.
        </p>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: 16 }}>
          <div>
            <div className="dim" style={{ fontSize: 12, marginBottom: 4 }}>Kiến trúc 2 → 3 → 1</div>
            <Canvas2D height={340} range={5} showGrid={false} showAxes={false} transformElements={false}>
              <NetworkDiagram />
            </Canvas2D>
          </div>
          <div>
            <div className="row" style={{ gap: 8, marginBottom: 4 }}>
              <button
                className={`btn ${mode === 'line' ? 'btn-primary' : ''}`}
                onClick={() => setMode('line')}
              >
                1 đường thẳng
              </button>
              <button
                className={`btn ${mode === 'mlp' ? 'btn-primary' : ''}`}
                onClick={() => setMode('mlp')}
              >
                MLP (có lớp ẩn)
              </button>
            </div>
            <Canvas2D
              height={340}
              range={2}
              points={pts}
              lines={mode === 'line' ? singleLine : []}
              transformElements={false}
            >
              {mode === 'mlp' && <ClassField classify={xorOutput} threshold={0.5} />}
            </Canvas2D>
          </div>
        </div>

        <Hint>
          {mode === 'line' ? (
            <>
              Bất kỳ đường thẳng nào — kể cả <MathText tex="x_1 = 0.5" /> ở đây — đều để lại <b>cả hai màu ở cùng
              một phía</b>. XOR <b>không tách tuyến tính được</b>: một neuron đơn lẻ bó tay.
            </>
          ) : (
            <>
              Thêm một <b>lớp ẩn</b> (2 neuron ReLU) là đủ: mạng tạo ra một <b>dải nghiêng</b> ôm đúng hai điểm nhãn
              1 và loại hai điểm nhãn 0. Vùng cam ↔ lớp 1, vùng xanh ↔ lớp 0 — khớp hoàn hảo với nhãn thật.
            </>
          )}
        </Hint>
      </Section>

      <Section kind="theory" title="MLP = xếp chồng các lớp affine + phi tuyến">
        <p>
          Một <b>lớp (layer)</b> nhận vector vào <MathText tex="\mathbf{x}" /> và trả vector ra bằng hai bước:
          nhân ma trận trọng số rồi cộng bias (một <b>phép biến đổi affine</b>), sau đó áp hàm kích hoạt lên từng
          thành phần:
        </p>
        <MathText block tex="\mathbf{h} = \phi\!\left(W\mathbf{x} + \mathbf{b}\right)" />
        <p>
          MLP chỉ là nhiều lớp như thế <b>nối đuôi nhau</b> — đầu ra lớp này là đầu vào lớp sau:
        </p>
        <MathText block tex="\mathbf{y} = \phi_2\!\big(W_2\,\phi_1(W_1\mathbf{x} + \mathbf{b}_1) + \mathbf{b}_2\big)" />
        <p>
          Lớp ẩn "bẻ cong" không gian để dữ liệu vốn rối trở nên tách được bằng một siêu phẳng ở lớp cuối. Đó là lý
          do XOR — bất khả thi với một đường — lại dễ dàng với một lớp ẩn.
        </p>
        <BridgeLA>
          Mỗi lớp <MathText tex="W\mathbf{x} + \mathbf{b}" /> là một <b>biến đổi affine</b>: phần{' '}
          <MathText tex="W\mathbf{x}" /> là <b>biến đổi tuyến tính</b> bằng ma trận (Chương 3), phần{' '}
          <MathText tex="+\mathbf{b}" /> là tịnh tiến. Chồng nhiều lớp = <b>hợp (composition)</b> các biến đổi,
          giống như nhân dồn nhiều ma trận ở Chương 3. Điểm mấu chốt: nếu <b>bỏ</b> hàm phi tuyến{' '}
          <MathText tex="\phi" />, thì <MathText tex="W_2(W_1\mathbf{x}) = (W_2 W_1)\mathbf{x}" /> — hai lớp thu về{' '}
          <b>đúng một</b> ma trận, mạng sâu đến mấy cũng chỉ là một biến đổi tuyến tính. Chính{' '}
          <MathText tex="\phi" /> phá vỡ điều đó và cho mạng sức mạnh thật sự.
        </BridgeLA>
      </Section>

      <Section kind="quiz" title="Kiểm tra hiểu">
        <Quiz
          lessonKey="ch11/mlp"
          questions={[
            {
              q: <>Vì sao một neuron (perceptron) đơn lẻ không giải được bài toán XOR?</>,
              options: [
                'Vì XOR có quá nhiều điểm dữ liệu',
                'Vì XOR không tách được bằng một đường thẳng (không tách tuyến tính)',
                'Vì sigmoid không xác định tại 0',
                'Vì cần ít nhất 3 đầu vào',
              ],
              answer: 1,
              explain: (
                <>
                  Một neuron chỉ tạo được một ranh giới thẳng. XOR cần vùng phân loại "không lồi" nên phải có lớp ẩn.
                </>
              ),
            },
            {
              q: <>Một lớp của MLP thực hiện phép biến đổi nào trước khi áp hàm kích hoạt?</>,
              options: [
                'Affine: Wx + b',
                'Chỉ cộng bias: x + b',
                'Tích có hướng của các cột',
                'Nghịch đảo ma trận W⁻¹',
              ],
              answer: 0,
              explain: <>Mỗi lớp tính <MathText tex="W\mathbf{x} + \mathbf{b}" /> rồi mới đưa qua <MathText tex="\phi" />.</>,
            },
            {
              q: (
                <>
                  Nếu <b>bỏ hết</b> hàm kích hoạt phi tuyến, một MLP có <MathText tex="L" /> lớp sẽ tương đương với:
                </>
              ),
              options: [
                'Một mạng mạnh hơn hẳn',
                'Đúng một phép biến đổi tuyến tính (một ma trận duy nhất)',
                'Một cây quyết định',
                'Không tính được gì cả',
              ],
              answer: 1,
              explain: (
                <>
                  Hợp của các ánh xạ tuyến tính vẫn tuyến tính: <MathText tex="W_L\cdots W_1 = W_{\text{eff}}" />. Phi
                  tuyến là thứ khiến chiều sâu có ý nghĩa.
                </>
              ),
            },
            {
              q: <>Chồng nhiều lớp mạng tương ứng với phép toán nào trong đại số tuyến tính?</>,
              options: [
                'Cộng ma trận',
                'Hợp các biến đổi (nhân dồn ma trận), xen kẽ phi tuyến',
                'Lấy định thức',
                'Chuyển vị ma trận',
              ],
              answer: 1,
              explain: (
                <>
                  Đầu ra lớp trước là đầu vào lớp sau — đúng nghĩa <b>composition</b> các biến đổi ở Chương 3, chỉ khác
                  là giữa các lớp có chèn thêm hàm phi tuyến.
                </>
              ),
            },
          ]}
        />
      </Section>
    </Lesson>
  );
}

// --- Sơ đồ MLP 2 → 3 → 1 vẽ bằng children của Canvas2D (nút + cạnh trọng số). --
function NetworkDiagram() {
  const { toScreen } = useCanvas2D();
  const inputY = [1.6, -1.6];
  const hiddenY = [2.6, 0, -2.6];
  const cols = { input: -3.6, hidden: 0, output: 3.6 };

  const nodePos = (col: number, y: number) => toScreen(col, y);
  const edges = [];
  // input → hidden
  for (const iy of inputY) {
    for (const hy of hiddenY) {
      const [x1, y1] = nodePos(cols.input, iy);
      const [x2, y2] = nodePos(cols.hidden, hy);
      edges.push(
        <line key={`ih-${iy}-${hy}`} x1={x1} y1={y1} x2={x2} y2={y2} stroke="var(--border)" strokeWidth={1.4} opacity={0.7} />,
      );
    }
  }
  // hidden → output
  for (const hy of hiddenY) {
    const [x1, y1] = nodePos(cols.hidden, hy);
    const [x2, y2] = nodePos(cols.output, 0);
    edges.push(
      <line key={`ho-${hy}`} x1={x1} y1={y1} x2={x2} y2={y2} stroke="var(--accent)" strokeWidth={1.6} opacity={0.6} />,
    );
  }

  const node = (col: number, y: number, fill: string, label: string, key: string) => {
    const [sx, sy] = nodePos(col, y);
    return (
      <g key={key}>
        <circle cx={sx} cy={sy} r={18} fill={fill} opacity={0.9} stroke="var(--text)" strokeWidth={1} />
        <text x={sx} y={sy + 4} textAnchor="middle" fill="var(--bg)" fontSize={12} fontWeight={700}>
          {label}
        </text>
      </g>
    );
  };

  return (
    <g>
      {edges}
      {inputY.map((y, i) => node(cols.input, y, 'var(--vec-result)', `x${i + 1}`, `in${i}`))}
      {hiddenY.map((y, i) => node(cols.hidden, y, 'var(--vec-1)', `h${i + 1}`, `hid${i}`))}
      {node(cols.output, 0, 'var(--good)', 'y', 'out')}
    </g>
  );
}
