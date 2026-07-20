import { useMemo, useState } from 'react';
import { Lesson, Section } from '../../components/Lesson';
import MathText from '../../components/MathText';
import Quiz from '../../components/Quiz';
import { softmax } from '../../lib/nn';
import { f2, Hint, TwoCol, Bridge } from './_shared';

// Hash ổn định (FNV-1a) → id "từ vựng" và embedding minh họa, tất định.
function hash(s: string): number {
  let h = 2166136261;
  for (let i = 0; i < s.length; i++) {
    h ^= s.charCodeAt(i);
    h = Math.imul(h, 16777619);
  }
  return h >>> 0;
}
function tokenId(tok: string): number {
  return hash(tok) % 10000;
}
function embed(tok: string): number[] {
  const h = hash(tok);
  return [0, 1, 2, 3].map((i) => {
    const x = Math.sin(h * 0.0013 * (i + 1) + i * 1.7);
    return Math.round(x * 100) / 100;
  });
}

function EmbedBars({ vec }: { vec: number[] }) {
  const W = 74;
  const H = 34;
  const mid = H / 2;
  const bw = W / vec.length;
  return (
    <svg width={W} height={H} style={{ display: 'block' }}>
      <line x1={0} y1={mid} x2={W} y2={mid} stroke="var(--border)" strokeWidth={1} />
      {vec.map((v, i) => {
        const bh = Math.abs(v) * (mid - 2);
        const y = v >= 0 ? mid - bh : mid;
        return (
          <rect
            key={i}
            x={i * bw + 1}
            y={y}
            width={bw - 2}
            height={bh}
            fill={v >= 0 ? 'var(--vec-1)' : 'var(--vec-2)'}
            rx={1}
          />
        );
      })}
    </svg>
  );
}

// Ví dụ minh họa cho mô hình ngôn ngữ: dự đoán từ kế tiếp.
const CONTEXT = 'con mèo ngồi trên tấm';
const CANDIDATES = ['thảm', 'ghế', 'sàn', 'xe', 'bầu trời'];
const LOGITS = [3.1, 2.4, 1.3, 0.1, -0.6];

export default function NLPLesson() {
  const [text, setText] = useState('Học sâu là đại số tuyến tính');

  const tokens = useMemo(
    () =>
      text
        .toLowerCase()
        .split(/[^\p{L}\p{N}]+/u)
        .filter(Boolean),
    [text]
  );

  const probs = useMemo(() => softmax(LOGITS), []);
  const order = probs
    .map((p, i) => ({ p, i }))
    .sort((a, b) => b.p - a.p);

  return (
    <Lesson id="nlp" title="NLP & mô hình ngôn ngữ (tổng quan)">
      <Section kind="explore" title="Từ chữ đến số: tokenization → chỉ số → embedding">
        <input
          type="text"
          value={text}
          onChange={(e) => setText(e.target.value)}
          spellCheck={false}
          style={{
            width: '100%',
            padding: '10px 12px',
            borderRadius: 'var(--radius-sm)',
            border: '1px solid var(--border)',
            background: 'var(--bg-elevated)',
            color: 'var(--text)',
            fontSize: 15,
          }}
        />
        <div className="row" style={{ gap: 10, flexWrap: 'wrap', marginTop: 14 }}>
          {tokens.length === 0 && <span className="dim">Gõ một câu để xem nó được tách token…</span>}
          {tokens.map((tok, i) => (
            <div
              key={i}
              style={{
                border: '1px solid var(--border)',
                borderRadius: 'var(--radius-sm)',
                padding: '8px 10px',
                background: 'var(--panel-2)',
                display: 'flex',
                flexDirection: 'column',
                gap: 4,
                alignItems: 'center',
                minWidth: 78,
              }}
            >
              <span style={{ fontWeight: 700, fontSize: 14 }}>{tok}</span>
              <span className="mono" style={{ fontSize: 11, color: 'var(--text-dim)' }}>
                #{tokenId(tok)}
              </span>
              <EmbedBars vec={embed(tok)} />
            </div>
          ))}
        </div>
        <Hint>
          Máy không đọc chữ — nó <b>tách câu thành token</b>, tra mỗi token ra một <b>chỉ số</b> trong từ vựng,
          rồi ánh xạ chỉ số đó thành một <b>vector embedding</b> (mấy thanh màu bên dưới, ở đây rút gọn 4 chiều;
          thực tế hàng trăm chiều — ch12). Từ giờ mọi phép tính là <b>đại số trên vector</b>.
        </Hint>
      </Section>

      <Section kind="explore" title="Mô hình ngôn ngữ: đoán từ kế tiếp">
        <TwoCol>
          <div>
            <div className="dim" style={{ fontSize: 13, marginBottom: 8 }}>
              Ngữ cảnh:
            </div>
            <div
              style={{
                fontSize: 16,
                padding: '10px 12px',
                border: '1px dashed var(--border)',
                borderRadius: 'var(--radius-sm)',
                background: 'var(--panel-2)',
              }}
            >
              "{CONTEXT} <span style={{ color: 'var(--accent-strong)', fontWeight: 700 }}>___</span> ?"
            </div>
            <p className="dim" style={{ fontSize: 13, marginTop: 10 }}>
              Mô hình cho điểm (logit) mỗi từ ứng viên, rồi <b>softmax</b> biến điểm thành xác suất tổng bằng 1.
            </p>
          </div>
          <div>
            {order.map(({ p, i }) => (
              <div key={i} style={{ marginBottom: 8 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 13 }}>
                  <span style={{ fontWeight: i === order[0].i ? 700 : 400 }}>{CANDIDATES[i]}</span>
                  <span className="mono" style={{ color: 'var(--text-dim)' }}>
                    {f2(p * 100)}%
                  </span>
                </div>
                <div style={{ background: 'var(--panel-2)', borderRadius: 6, height: 12, overflow: 'hidden' }}>
                  <div
                    style={{
                      width: `${p * 100}%`,
                      height: '100%',
                      background: 'var(--vec-1)',
                      borderRadius: 6,
                    }}
                  />
                </div>
              </div>
            ))}
          </div>
        </TwoCol>
        <Hint>
          Đây chính là một <b>bài phân loại</b>: lớp cần chọn là "từ kế tiếp" trong toàn bộ từ vựng. Huấn luyện
          bằng cross-entropy trên hàng tỉ câu, mô hình học được rằng sau "…ngồi trên tấm" thì "thảm" khả dĩ hơn
          "bầu trời".
        </Hint>
      </Section>

      <Section kind="theory" title="Bức tranh lớn của NLP & mô hình ngôn ngữ">
        <ul>
          <li>
            <b>Mô hình ngôn ngữ (language model):</b> ước lượng xác suất của từ kế tiếp cho một ngữ cảnh,{' '}
            <MathText tex="P(w_t \mid w_1,\dots,w_{t-1})" />.
          </li>
          <li>
            <b>n-gram cổ điển:</b> chỉ nhìn <MathText tex="n-1" /> từ ngay trước và đếm tần suất. Đơn giản
            nhưng bùng nổ tổ hợp và không hiểu ngữ nghĩa.
          </li>
          <li>
            <b>Neural LM:</b> nhúng token thành vector rồi để mạng (RNN, rồi Transformer — ch12) học ngữ cảnh
            dài. Từ gần nghĩa nằm gần nhau trong không gian embedding.
          </li>
          <li>
            <b>Seq2seq:</b> một encoder đọc câu nguồn thành biểu diễn, một decoder sinh câu đích — nền của{' '}
            <b>dịch máy</b> (machine translation) và tóm tắt.
          </li>
          <li>
            <b>BERT & pretraining:</b> huấn luyện trước trên văn bản khổng lồ bằng nhiệm vụ tự giám sát (BERT:{' '}
            <i>masked language modeling</i> — che vài từ rồi đoán lại), sau đó <b>fine-tune</b> cho bài toán cụ
            thể. Đây là "transfer learning" của NLP.
          </li>
        </ul>
        <p>
          Còn nhiều nhánh nữa (GPT sinh văn bản, attention, RLHF…).{' '}
          <a href="#/so-tay/dl-map" style={{ color: 'var(--accent-strong)', fontWeight: 600 }}>
            Đọc bản đồ Deep Learning đầy đủ ở Sổ tay →
          </a>
        </p>
        <Bridge>
          <p style={{ marginTop: 0 }}>
            Mỗi token trở thành một <b>vector</b> (ch1) — và cả câu là một chuỗi vector, tức một{' '}
            <b>ma trận</b>. "Gần nghĩa" đo bằng <b>dot product / cosine</b> giữa các embedding.
          </p>
          <p style={{ marginBottom: 0 }}>
            <b>Attention</b> (ch12) là trái tim của Transformer: nó tính điểm tương hợp giữa các token bằng{' '}
            tích vô hướng <MathText tex="q\cdot k" />, chuẩn hóa bằng <b>softmax</b>, rồi lấy tổ hợp tuyến tính
            các vector <MathText tex="v" /> — toàn bộ là Đại số tuyến tính.
          </p>
        </Bridge>
      </Section>

      <Section kind="quiz" title="Kiểm tra hiểu">
        <Quiz
          lessonKey="ch13/nlp"
          questions={[
            {
              q: <>Một mô hình ngôn ngữ (language model) về cơ bản dự đoán điều gì?</>,
              options: [
                'Màu sắc của một bức ảnh',
                'Phân phối xác suất của từ (token) KẾ TIẾP cho một ngữ cảnh',
                'Định thức của một ma trận',
                'Nhiệt độ ngày mai',
              ],
              answer: 1,
              explain: (
                <>
                  LM cho <MathText tex="P(w_t\mid \text{ngữ cảnh})" /> — về bản chất là bài phân loại "từ kế
                  tiếp" trên toàn từ vựng, thường chuẩn hóa bằng softmax.
                </>
              ),
            },
            {
              q: (
                <>
                  Hai từ ứng viên có logit <MathText tex="[2, 0]" />. Xác suất softmax của từ thứ nhất xấp xỉ?
                  (<MathText tex="e^2\approx 7.39" />)
                </>
              ),
              options: ['0.50', '0.73', '0.88', '1.00'],
              answer: 2,
              explain: (
                <>
                  <MathText tex="\dfrac{e^2}{e^2+e^0}=\dfrac{7.39}{7.39+1}=\dfrac{7.39}{8.39}\approx 0.88" />.
                </>
              ),
            },
            {
              q: <>Word embedding có tính chất đặc trưng nào?</>,
              options: [
                'Mỗi từ là một con số nguyên duy nhất, không có cấu trúc',
                'Từ gần nghĩa được ánh xạ tới các vector NẰM GẦN nhau trong không gian',
                'Mọi từ đều có cùng một vector',
                'Embedding chỉ dùng cho ảnh',
              ],
              answer: 1,
              explain: (
                <>
                  Embedding là vector dày (dense) học được sao cho quan hệ ngữ nghĩa thành quan hệ hình học —
                  gần nghĩa ⇒ gần nhau (đo bằng cosine/dot product, ch1).
                </>
              ),
            },
            {
              q: <>Nhiệm vụ pretraining đặc trưng của BERT là gì?</>,
              options: [
                'Đoán màu pixel bị che',
                'Masked language modeling — che ngẫu nhiên vài token rồi đoán lại chúng từ ngữ cảnh hai phía',
                'Sắp xếp các ma trận theo định thức',
                'Dịch trực tiếp không cần dữ liệu',
              ],
              answer: 1,
              explain: (
                <>
                  BERT học tự giám sát bằng cách che (mask) một số token và dự đoán chúng dựa trên ngữ cảnh cả
                  hai phía; sau đó fine-tune cho tác vụ cụ thể — kiểu transfer learning của NLP.
                </>
              ),
            },
          ]}
        />
      </Section>
    </Lesson>
  );
}
