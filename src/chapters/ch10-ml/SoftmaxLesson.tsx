import { useState } from 'react';
import { Lesson, Section } from '../../components/Lesson';
import MathText from '../../components/MathText';
import Slider from '../../components/Slider';
import StepByStep from '../../components/StepByStep';
import Quiz from '../../components/Quiz';
import { softmax, crossEntropy } from '../../lib/nn';
import { f2, f3 } from './util';
import { Stat, StatRow, Hint, BridgeLA, TwoCol } from './_shared';

const CLASS_LABELS = ['Lớp A', 'Lớp B', 'Lớp C'];
const CLASS_COLORS = ['var(--vec-1)', 'var(--vec-2)', 'var(--vec-3)'];

function Bar({
  label,
  z,
  p,
  color,
  isTrue,
}: {
  label: string;
  z: number;
  p: number;
  color: string;
  isTrue: boolean;
}) {
  return (
    <div style={{ marginBottom: 12 }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 13, marginBottom: 4 }}>
        <span style={{ fontWeight: isTrue ? 700 : 400 }}>
          {label} {isTrue && <span style={{ color }}>★ nhãn thật</span>}{' '}
          <span className="dim">(logit z = {f2(z)})</span>
        </span>
        <span className="mono" style={{ color, fontWeight: 600 }}>
          {f3(p)}
        </span>
      </div>
      <div
        style={{
          height: 18,
          background: 'var(--bg-elevated)',
          border: '1px solid var(--border)',
          borderRadius: 6,
          overflow: 'hidden',
        }}
      >
        <div
          style={{
            height: '100%',
            width: `${Math.max(0, Math.min(1, p)) * 100}%`,
            background: color,
            transition: 'width 0.12s linear',
          }}
        />
      </div>
    </div>
  );
}

export default function SoftmaxLesson() {
  const [z, setZ] = useState<number[]>([2, 1, 0]);
  const [T, setT] = useState(1);
  const [trueClass, setTrueClass] = useState(0);

  const scaled = z.map((v) => v / T);
  const probs = softmax(scaled);
  const sum = probs.reduce((a, b) => a + b, 0);
  const ce = crossEntropy(probs, trueClass);

  const setZi = (i: number, v: number) => {
    const next = z.slice();
    next[i] = v;
    setZ(next);
  };

  return (
    <Lesson id="softmax" title="Hồi quy Softmax & phân loại">
      <p className="muted">
        Hồi quy tuyến tính trả về một số thực. Nhưng để <strong>phân loại</strong> (ảnh này là chó,
        mèo hay chim?) ta cần <em>xác suất</em> cho từng lớp. <strong>Softmax</strong> là chiếc cầu:
        nó biến một vector "điểm số" (logits) thô thành một phân phối xác suất hợp lệ — dương và cộng
        lại bằng 1.
      </p>

      <Section kind="explore" title="Từ logits tới xác suất">
        <p className="muted" style={{ marginTop: 0 }}>
          Kéo ba logit <MathText tex={'z_A, z_B, z_C'} /> và quan sát softmax chia xác suất. Thanh{' '}
          <strong>nhiệt độ</strong> <MathText tex={'T'} /> điều chỉnh độ "gắt": <MathText tex={'T'} />{' '}
          nhỏ ⇒ dồn hết vào lớp mạnh nhất (gần một-nóng); <MathText tex={'T'} /> lớn ⇒ san bằng về
          đều. Dù chỉnh thế nào, tổng luôn bằng 1.
        </p>

        <TwoCol>
          <div className="panel">
            {probs.map((p, i) => (
              <Bar
                key={i}
                label={CLASS_LABELS[i]}
                z={z[i]}
                p={p}
                color={CLASS_COLORS[i]}
                isTrue={i === trueClass}
              />
            ))}
            <div
              className="mono"
              style={{ textAlign: 'right', fontSize: 13, marginTop: 6, color: 'var(--text-muted)' }}
            >
              Tổng xác suất = {f3(sum)}
            </div>
          </div>

          <div>
            <div className="panel">
              <Slider label="z_A (logit lớp A)" min={-4} max={4} step={0.1} value={z[0]} onChange={(v) => setZi(0, v)} />
              <Slider label="z_B (logit lớp B)" min={-4} max={4} step={0.1} value={z[1]} onChange={(v) => setZi(1, v)} />
              <Slider label="z_C (logit lớp C)" min={-4} max={4} step={0.1} value={z[2]} onChange={(v) => setZi(2, v)} />
              <Slider label="T — nhiệt độ (temperature)" min={0.2} max={4} step={0.1} value={T} onChange={setT} />
            </div>

            <div className="panel" style={{ marginTop: 12 }}>
              <div style={{ fontSize: 13, marginBottom: 6 }}>Nhãn thật (để tính cross-entropy):</div>
              <div className="row" style={{ gap: 8 }}>
                {CLASS_LABELS.map((lb, i) => (
                  <button
                    key={i}
                    className="btn"
                    style={{
                      borderColor: i === trueClass ? CLASS_COLORS[i] : undefined,
                      color: i === trueClass ? CLASS_COLORS[i] : undefined,
                    }}
                    onClick={() => setTrueClass(i)}
                  >
                    {lb}
                  </button>
                ))}
              </div>
            </div>

            <StatRow>
              <Stat label="p(nhãn thật)" value={f3(probs[trueClass])} color={CLASS_COLORS[trueClass]} />
              <Stat label="Cross-entropy" value={f3(ce)} color="var(--vec-result)" />
            </StatRow>

            <Hint>
              Cross-entropy <MathText tex={'= -\\ln p_{\\text{thật}}'} />. Muốn loss nhỏ, mô hình phải
              dồn xác suất vào đúng lớp thật. Đặt <MathText tex={'T'} /> nhỏ và tăng logit của nhãn
              thật để thấy loss lao về 0.
            </Hint>
          </div>
        </TwoCol>
      </Section>

      <Section kind="theory" title="Softmax, cross-entropy, và bộ phân loại tuyến tính">
        <p style={{ marginTop: 0 }}>
          <strong>Softmax.</strong> Cho vector logits <MathText tex={'z \\in \\mathbb{R}^k'} />, softmax
          lấy mũ rồi chuẩn hoá cho tổng bằng 1:
        </p>
        <MathText block tex={'\\operatorname{softmax}(z)_j = \\frac{e^{z_j}}{\\sum_{m=1}^{k} e^{z_m}}.'} />
        <p>
          Kết quả luôn <strong>dương</strong> và <strong>cộng lại bằng 1</strong> — một phân phối xác
          suất hợp lệ (một điểm trên "simplex"). Lấy mũ giữ nguyên thứ tự, nên logit lớn nhất luôn
          nhận xác suất cao nhất.
        </p>
        <p>
          <strong>Cross-entropy loss.</strong> Nếu lớp đúng là <MathText tex={'c'} />, mất mát là
        </p>
        <MathText block tex={'\\mathcal{L} = -\\ln\\big(\\operatorname{softmax}(z)_c\\big) = -\\ln p_c.'} />
        <p>
          Dự đoán chắc chắn đúng (<MathText tex={'p_c \\to 1'} />) ⇒ loss <MathText tex={'\\to 0'} />;
          dự đoán sai bét (<MathText tex={'p_c \\to 0'} />) ⇒ loss <MathText tex={'\\to \\infty'} />.
        </p>

        <h3>Bộ phân loại tuyến tính</h3>
        <p>
          Từ đặc trưng đầu vào <MathText tex={'x'} />, logits được sinh bằng một phép{' '}
          <strong>affine</strong> rồi mới đưa qua softmax:
        </p>
        <MathText block tex={'z = W x + b, \\qquad \\hat{p} = \\operatorname{softmax}(z).'} />
        <p>
          Hàng thứ <MathText tex={'j'} /> của <MathText tex={'W'} /> là một "vector mẫu" của lớp{' '}
          <MathText tex={'j'} />; logit <MathText tex={'z_j = W_j \\cdot x + b_j'} /> đo độ khớp giữa{' '}
          <MathText tex={'x'} /> và mẫu đó bằng một tích vô hướng.
        </p>

        <BridgeLA>
          <ul style={{ margin: '4px 0 0', paddingLeft: 20 }}>
            <li>
              <strong>Wx là matVec (Ch.3).</strong> Toàn bộ tầng logits chỉ là một phép nhân
              ma trận–vector <MathText tex={'Wx'} /> cộng bias — đúng phép biến đổi tuyến tính bạn học
              ở chương ma trận. Mỗi logit là một <strong>dot product</strong> (Ch.1).
            </li>
            <li>
              <strong>Ranh giới quyết định là siêu phẳng.</strong> Hai lớp <MathText tex={'i, j'} /> có
              xác suất bằng nhau khi <MathText tex={'z_i = z_j'} />, tức{' '}
              <MathText tex={'(W_i - W_j)\\cdot x + (b_i - b_j) = 0'} /> — một siêu phẳng (Ch.4). Vì
              thế "hồi quy softmax" phân loại bằng các mặt phẳng tuyến tính.
            </li>
            <li>
              <strong>Softmax = chuẩn hoá.</strong> Nó chỉ đổi thang đo về simplex xác suất; sức mạnh
              "học" nằm ở phần LA <MathText tex={'Wx + b'} />.
            </li>
          </ul>
        </BridgeLA>
      </Section>

      <Section kind="steps" title="Tính softmax bằng tay">
        <StepByStep
          steps={[
            {
              title: 'Đề bài',
              content: (
                <p className="muted">
                  Cho logits <MathText tex={'z = (2,\\ 0,\\ -1)'} /> với{' '}
                  <MathText tex={'T = 1'} />. Tính softmax và cross-entropy nếu lớp đúng là A.
                </p>
              ),
            },
            {
              title: 'Bước 1 — Lấy mũ từng thành phần',
              content: (
                <MathText block tex={'e^{2} \\approx 7.389,\\quad e^{0} = 1,\\quad e^{-1} \\approx 0.368.'} />
              ),
            },
            {
              title: 'Bước 2 — Tổng để chuẩn hoá',
              content: (
                <MathText block tex={'S = 7.389 + 1 + 0.368 \\approx 8.757.'} />
              ),
            },
            {
              title: 'Bước 3 — Chia cho tổng',
              content: (
                <div>
                  <MathText block tex={'p = \\left(\\tfrac{7.389}{8.757},\\ \\tfrac{1}{8.757},\\ \\tfrac{0.368}{8.757}\\right) \\approx (0.844,\\ 0.114,\\ 0.042).'} />
                  <p className="dim" style={{ fontSize: 13 }}>
                    Kiểm tra: <MathText tex={'0.844 + 0.114 + 0.042 = 1'} /> ✓
                  </p>
                </div>
              ),
            },
            {
              title: 'Bước 4 — Cross-entropy (lớp đúng = A)',
              content: (
                <MathText block tex={'\\mathcal{L} = -\\ln(0.844) \\approx 0.170.'} />
              ),
            },
          ]}
        />
      </Section>

      <Section kind="quiz" title="Kiểm tra hiểu">
        <Quiz
          lessonKey="ch10/softmax"
          questions={[
            {
              q: <>Tính chất đặc trưng của đầu ra softmax là gì?</>,
              options: [
                <>Mọi thành phần dương và <strong>cộng lại bằng 1</strong> (một phân phối xác suất)</>,
                <>Mọi thành phần nằm giữa −1 và 1</>,
                <>Đúng một thành phần bằng 1, còn lại bằng 0</>,
                <>Tổng các thành phần bằng số lớp</>,
              ],
              answer: 0,
              explain: (
                <>
                  <MathText tex={'e^{z_j} > 0'} /> và phép chia cho tổng ép{' '}
                  <MathText tex={'\\sum_j p_j = 1'} /> — đúng định nghĩa phân phối xác suất.
                </>
              ),
            },
            {
              q: <>Với <MathText tex={'z = (2, 0, -1)'} />, lớp nào có xác suất cao nhất?</>,
              options: [
                <>Lớp ứng với <MathText tex={'z = 2'} /> (logit lớn nhất)</>,
                <>Lớp ứng với <MathText tex={'z = -1'} /></>,
                <>Cả ba bằng nhau</>,
                <>Không xác định được nếu chưa biết <MathText tex={'W'} /></>,
              ],
              answer: 0,
              explain: (
                <>
                  <MathText tex={'e^{z}'} /> tăng nghiêm ngặt, nên softmax giữ nguyên thứ tự: logit lớn
                  nhất ⇒ xác suất lớn nhất.
                </>
              ),
            },
            {
              q: <>Tăng nhiệt độ <MathText tex={'T'} /> rất lớn trong <MathText tex={'\\operatorname{softmax}(z/T)'} /> làm gì với phân phối?</>,
              options: [
                <>San bằng về gần <strong>đều</strong> (mọi lớp xấp xỉ <MathText tex={'1/k'} />)</>,
                <>Dồn toàn bộ về một lớp</>,
                <>Làm tổng khác 1</>,
                <>Không thay đổi gì</>,
              ],
              answer: 0,
              explain: (
                <>
                  Chia logits cho <MathText tex={'T'} /> lớn ⇒ mọi <MathText tex={'z_j/T \\to 0'} /> ⇒
                  các <MathText tex={'e^{z_j/T}'} /> gần bằng nhau ⇒ phân phối gần đều. <MathText tex={'T'} />
                  nhỏ thì ngược lại: gắt, gần one-hot.
                </>
              ),
            },
            {
              q: <>Trong bộ phân loại softmax, các logits <MathText tex={'z = Wx + b'} /> được tính bằng phép toán LA nào?</>,
              options: [
                <>Nhân ma trận–vector <MathText tex={'Wx'} /> (matVec) rồi cộng bias — mỗi logit là một dot product</>,
                <>Định thức của <MathText tex={'W'} /></>,
                <>Tích có hướng của <MathText tex={'x'} /> với <MathText tex={'b'} /></>,
                <>Nghịch đảo ma trận <MathText tex={'W^{-1}'} /></>,
              ],
              answer: 0,
              explain: (
                <>
                  <MathText tex={'z_j = W_j \\cdot x + b_j'} />: hàng <MathText tex={'j'} /> của{' '}
                  <MathText tex={'W'} /> dot với <MathText tex={'x'} />. Toàn tầng là matVec (Ch.3) —
                  softmax chỉ chuẩn hoá kết quả.
                </>
              ),
            },
          ]}
        />
      </Section>
    </Lesson>
  );
}
