import { useState } from 'react';
import { Lesson, Section } from '../../components/Lesson';
import MathText from '../../components/MathText';
import Slider from '../../components/Slider';
import StepByStep from '../../components/StepByStep';
import Quiz from '../../components/Quiz';
import { matVec, add } from '../../lib/linalg';
import type { Mat, Vec } from '../../lib/linalg';
import { tanhAct } from '../../lib/nn';
import { f2, Stat, StatRow, Hint, Bridge, Caption } from './_shared';

// Trọng số cố định, nhỏ để dễ tính tay.
const W: Mat = [
  [0.5, 0],
  [0, 0.5],
]; // trộn trạng thái ẩn cũ
const U: Mat = [
  [1, 0],
  [0, 1],
]; // đưa đầu vào vào trạng thái (đơn vị cho gọn)

const applyTanh = (v: Vec): Vec => v.map(tanhAct);

// Một bước RNN: h_t = tanh(W·h_{t-1} + U·x_t) — chỉ gồm matVec + cộng vector + tanh.
function step(hPrev: Vec, x: Vec): Vec {
  return applyTanh(add(matVec(W, hPrev), matVec(U, x)));
}

export default function RnnLesson() {
  // Chỉ cho chỉnh thành phần đầu của x₁ để thấy thông tin "chảy" xuôi thời gian.
  const [a, setA] = useState(1);

  const x1: Vec = [a, 0];
  const x2: Vec = [0, 1];
  const x3: Vec = [1, 1];
  const h0: Vec = [0, 0];
  const h1 = step(h0, x1);
  const h2 = step(h1, x2);
  const h3 = step(h2, x3);

  const steps = [
    { t: 1, x: x1, h: h1 },
    { t: 2, x: x2, h: h2 },
    { t: 3, x: x3, h: h3 },
  ];

  // --- Sơ đồ trải theo thời gian (SVG) ---
  const W_ = 660;
  const H_ = 250;
  const xs = [130, 330, 530];
  const hY = 70;
  const xY = 185;
  const vecStr = (v: Vec) => `[${f2(v[0])}, ${f2(v[1])}]`;

  return (
    <Lesson id="rnn" title="RNN — Chuỗi & trạng thái ẩn (Hidden state)">
      <Section kind="explore" title="Trải mạng theo thời gian">
        <p>
          Recurrent Neural Network xử lý một <b>chuỗi</b> (câu chữ, chuỗi thời gian).
          Tại mỗi bước <MathText tex="t" /> nó trộn <b>đầu vào mới</b>{' '}
          <MathText tex="x_t" /> với <b>trạng thái ẩn</b> <MathText tex="h_{t-1}" /> —
          "bộ nhớ" tóm tắt mọi thứ đã thấy trước đó:
        </p>
        <MathText block tex="h_t = \tanh\!\big(W\,h_{t-1} + U\,x_t\big)" />

        <Caption>
          Cùng một cặp trọng số <MathText tex="W, U" /> được tái sử dụng ở mọi bước
        </Caption>
        <div style={{ overflowX: 'auto' }}>
          <svg
            width={W_}
            height={H_}
            viewBox={`0 0 ${W_} ${H_}`}
            style={{ maxWidth: '100%', height: 'auto', display: 'block' }}
            role="img"
          >
            <defs>
              <marker
                id="rnn-arrow"
                markerWidth="9"
                markerHeight="9"
                refX="6"
                refY="3"
                orient="auto"
                markerUnits="strokeWidth"
              >
                <path d="M0,0 L6,3 L0,6 Z" fill="var(--text-muted)" />
              </marker>
            </defs>

            {/* mũi tên trạng thái ẩn h_{t-1} -> h_t */}
            {[0, 1, 2].map((k) => {
              const x1p = k === 0 ? 40 : xs[k - 1] + 46;
              const x2p = xs[k] - 46;
              return (
                <g key={`ha${k}`}>
                  <line
                    x1={x1p}
                    y1={hY}
                    x2={x2p}
                    y2={hY}
                    stroke="var(--text-muted)"
                    strokeWidth={2}
                    markerEnd="url(#rnn-arrow)"
                  />
                  {k > 0 && (
                    <text
                      x={(x1p + x2p) / 2}
                      y={hY - 8}
                      textAnchor="middle"
                      fontSize={11}
                      fill="var(--accent-strong)"
                    >
                      W·h
                    </text>
                  )}
                </g>
              );
            })}
            {/* mũi tên trạng thái cuối đi ra (dự đoán) */}
            <line
              x1={xs[2] + 46}
              y1={hY}
              x2={xs[2] + 110}
              y2={hY}
              stroke="var(--text-muted)"
              strokeWidth={2}
              markerEnd="url(#rnn-arrow)"
            />
            <text x={xs[2] + 116} y={hY + 4} fontSize={12} fill="var(--text-muted)">
              ŷ
            </text>
            <text x={20} y={hY - 12} fontSize={11} fill="var(--text-dim)">
              h₀=[0,0]
            </text>

            {steps.map((s, k) => (
              <g key={`st${k}`}>
                {/* đầu vào x_t đi lên vào h_t */}
                <line
                  x1={xs[k]}
                  y1={xY - 22}
                  x2={xs[k]}
                  y2={hY + 26}
                  stroke="var(--vec-2)"
                  strokeWidth={2}
                  markerEnd="url(#rnn-arrow)"
                />
                <text
                  x={xs[k] + 8}
                  y={(xY + hY) / 2}
                  fontSize={11}
                  fill="var(--vec-2)"
                >
                  U·x
                </text>

                {/* ô trạng thái ẩn h_t */}
                <rect
                  x={xs[k] - 46}
                  y={hY - 26}
                  width={92}
                  height={52}
                  rx={10}
                  fill="var(--panel-2)"
                  stroke="var(--accent)"
                  strokeWidth={2}
                />
                <text
                  x={xs[k]}
                  y={hY - 8}
                  textAnchor="middle"
                  fontSize={12}
                  fontWeight={700}
                  fill="var(--accent-strong)"
                >
                  h{s.t}
                </text>
                <text
                  x={xs[k]}
                  y={hY + 12}
                  textAnchor="middle"
                  fontSize={11}
                  className="mono"
                  fill="var(--text)"
                >
                  {vecStr(s.h)}
                </text>

                {/* ô đầu vào x_t */}
                <rect
                  x={xs[k] - 46}
                  y={xY - 20}
                  width={92}
                  height={40}
                  rx={10}
                  fill="var(--bg-elevated)"
                  stroke="var(--vec-2)"
                  strokeWidth={1.5}
                />
                <text
                  x={xs[k]}
                  y={xY + 4}
                  textAnchor="middle"
                  fontSize={11}
                  className="mono"
                  fill="var(--text)"
                >
                  x{s.t}={vecStr(s.x)}
                </text>
              </g>
            ))}
          </svg>
        </div>

        <div style={{ marginTop: 8, maxWidth: 360 }}>
          <Slider
            label="Thành phần đầu của x₁"
            min={-2}
            max={2}
            step={0.25}
            value={a}
            onChange={setA}
            format={(v) => f2(v)}
          />
        </div>

        <StatRow>
          <Stat label="h₁" value={vecStr(h1)} color="var(--accent)" />
          <Stat label="h₂" value={vecStr(h2)} color="var(--accent)" />
          <Stat label="h₃" value={vecStr(h3)} color="var(--accent-strong)" />
        </StatRow>

        <Hint>
          Kéo thanh trượt để đổi <MathText tex="x_1" />. Chú ý: nó không chỉ làm đổi{' '}
          <MathText tex="h_1" /> mà còn <b>lan tới</b> <MathText tex="h_2, h_3" /> —
          vì mỗi trạng thái được đưa vào bước sau qua <MathText tex="W" />. Trạng thái
          ẩn chính là "bộ nhớ" mang thông tin xuôi theo thời gian.
        </Hint>
      </Section>

      <Section kind="theory" title="Trạng thái ẩn = bộ nhớ, trọng số dùng chung">
        <p>
          RNN chỉ có <b>một</b> ô tính toán, nhưng được áp <b>lặp lại</b> qua từng bước
          thời gian. Nhìn "trải ra", nó giống một mạng rất sâu mà mọi tầng{' '}
          <b>dùng chung</b> cặp trọng số <MathText tex="(W, U)" />:
        </p>
        <ul>
          <li>
            <b>Trạng thái ẩn</b> <MathText tex="h_t" /> là một vector tóm tắt cả quá
            khứ — bộ nhớ ngắn hạn của mạng.
          </li>
          <li>
            <b>Chia sẻ trọng số qua thời gian:</b> cùng <MathText tex="W, U" /> ở mọi
            bước, nên RNN xử lý được chuỗi dài <b>tùy ý</b> với số tham số cố định.
          </li>
          <li>
            <b>BPTT</b> (Backpropagation Through Time): huấn luyện bằng cách lan gradient
            ngược qua toàn bộ chuỗi đã trải. Chuỗi dài dễ gây{' '}
            <b>vanishing / exploding gradient</b>.
          </li>
          <li>
            <b>GRU / LSTM</b> thêm các "cổng" (gate) để giữ hoặc quên thông tin, giúp
            nhớ được phụ thuộc xa hơn nhiều so với RNN thuần.
          </li>
        </ul>

        <Bridge>
          Trái tim của mỗi bước là <MathText tex="W\,h_{t-1} + U\,x_t" /> — hai phép{' '}
          <b>matVec</b> (nhân ma trận–vector, Ch3) rồi <b>cộng vector</b> (Ch1), sau đó
          mới bọc hàm phi tuyến <MathText tex="\tanh" />. Bỏ phi tuyến đi thì cả chuỗi
          RNN chỉ là những phép biến đổi tuyến tính nối tiếp — và tích liên tiếp{' '}
          <MathText tex="W^t" /> giải thích luôn vì sao gradient dễ bùng nổ hay tiêu
          biến: nó phụ thuộc lũy thừa các <b>eigenvalue</b> của <MathText tex="W" />{' '}
          (Ch5).
        </Bridge>
      </Section>

      <Section kind="steps" title="Cập nhật trạng thái ẩn từng bước">
        <StepByStep
          steps={[
            {
              title: 'Thiết lập',
              content: (
                <p>
                  Lấy <MathText tex="W=\begin{bmatrix}0.5&0\\0&0.5\end{bmatrix}" />,{' '}
                  <MathText tex="U=I" />, <MathText tex="h_0=[0,0]" />,{' '}
                  <MathText tex="x_1=[1,0]" />. Tính <MathText tex="h_1" />.
                </p>
              ),
            },
            {
              title: 'Bước 1 — matVec',
              content: (
                <p>
                  <MathText tex="W h_0 = [0,0]" /> và <MathText tex="U x_1 = [1,0]" />.
                  Cộng lại: <MathText tex="[0,0] + [1,0] = [1,0]" />.
                </p>
              ),
            },
            {
              title: 'Bước 2 — hàm kích hoạt',
              content: (
                <p>
                  <MathText tex="h_1 = \tanh([1,0]) = [\tanh 1,\, 0] \approx [0.76,\, 0]" />.
                  Trạng thái đầu tiên đã hình thành từ đầu vào.
                </p>
              ),
            },
            {
              title: 'Bước 3 — mang bộ nhớ sang bước 2',
              content: (
                <p>
                  Với <MathText tex="x_2=[0,1]" />:{' '}
                  <MathText tex="W h_1 \approx [0.38, 0]" />,{' '}
                  <MathText tex="U x_2 = [0,1]" />, tổng{' '}
                  <MathText tex="\approx [0.38, 1]" />, rồi{' '}
                  <MathText tex="h_2 = \tanh([0.38,1]) \approx [0.36, 0.76]" />. Dấu vết
                  của <MathText tex="x_1" /> vẫn còn trong thành phần đầu — đó là bộ nhớ.
                </p>
              ),
            },
          ]}
        />
      </Section>

      <Section kind="quiz" title="Kiểm tra hiểu">
        <Quiz
          lessonKey="ch12/rnn"
          questions={[
            {
              q: <>Vai trò của trạng thái ẩn (hidden state) trong RNN là gì?</>,
              options: [
                'Lưu nhãn của dữ liệu',
                'Là "bộ nhớ" tóm tắt thông tin từ các bước trước',
                'Là ma trận trọng số cố định',
                'Là đầu ra cuối cùng của mạng',
              ],
              answer: 1,
              explain: (
                <>
                  <MathText tex="h_t" /> mang thông tin tích lũy từ{' '}
                  <MathText tex="x_1,\dots,x_t" /> sang bước sau — chính là bộ nhớ của
                  mạng.
                </>
              ),
            },
            {
              q: (
                <>
                  Cho <MathText tex="h_{t-1}=[2,0]" />,{' '}
                  <MathText tex="W=\begin{bmatrix}0.5&0\\0&0.5\end{bmatrix}" /> và{' '}
                  <MathText tex="U x_t = [0,1]" />. Giá trị <b>trước tanh</b> của{' '}
                  <MathText tex="h_t" /> là?
                </>
              ),
              options: ['[1, 1]', '[2, 1]', '[1, 0]', '[0.5, 1]'],
              answer: 0,
              explain: (
                <>
                  <MathText tex="W h_{t-1} = [1,0]" />, cộng{' '}
                  <MathText tex="U x_t=[0,1]" /> ra <MathText tex="[1,1]" /> (rồi mới lấy
                  tanh).
                </>
              ),
            },
            {
              q: <>Vì sao RNN dùng CHUNG trọng số ở mọi bước thời gian?</>,
              options: [
                'Để mỗi bước có trọng số riêng',
                'Để xử lý được chuỗi dài tùy ý với số tham số cố định',
                'Để loại bỏ hàm kích hoạt',
                'Vì bắt buộc bởi định lý Pytago',
              ],
              answer: 1,
              explain: (
                <>
                  Một cặp <MathText tex="(W,U)" /> áp cho mọi bước, nên độ dài chuỗi
                  không làm tăng số tham số — tương tự weight sharing của CNN nhưng theo
                  trục thời gian.
                </>
              ),
            },
            {
              q: (
                <>
                  Hiện tượng gradient tiêu biến / bùng nổ khi huấn luyện chuỗi dài liên
                  quan chặt tới đại lượng nào của <MathText tex="W" />?
                </>
              ),
              options: [
                'Định thức bằng 0',
                'Các eigenvalue (trị riêng), vì gradient phụ thuộc lũy thừa của W',
                'Số cột của ảnh',
                'Số lớp fully-connected',
              ],
              answer: 1,
              explain: (
                <>
                  Lan ngược qua nhiều bước nhân lặp <MathText tex="W" />; độ lớn gradient
                  co giãn theo lũy thừa các eigenvalue — &gt;1 thì bùng nổ, &lt;1 thì tiêu
                  biến.
                </>
              ),
            },
          ]}
        />
      </Section>
    </Lesson>
  );
}
