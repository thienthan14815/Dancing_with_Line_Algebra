// BÀI 0 (ch10) — Tensor: cấu trúc dữ liệu của Deep Learning.
// Nguồn nội dung: video bài giảng https://youtu.be/Yhp1nK_7lSQ (xử lý bởi
// skill video-to-giao-an); số liệu & câu chữ tự soạn lại.
// Bắc cầu LA: tensor 2D CHÍNH LÀ ma trận (ch3); mọi lớp mạng về sau đều là
// matMul trên tensor, chạy song song trên GPU.
import { useState } from 'react';
import { Lesson, Section } from '../../components/Lesson';
import MathText from '../../components/MathText';
import Slider from '../../components/Slider';
import Quiz from '../../components/Quiz';
import { Stat, StatRow, Hint, BridgeLA, TwoCol } from './_shared';

// ---------------------------------------------------------------------------
// Khối tương tác 1 — Máy khám phá SHAPE: chọn số khối/hàng/cột, xem shape,
// tổng phần tử và stride tương ứng.
// ---------------------------------------------------------------------------
function ShapeExplorer() {
  const [depth, setDepth] = useState(2);
  const [rows, setRows] = useState(3);
  const [cols, setCols] = useState(3);

  const shape = depth > 1 ? [depth, rows, cols] : [rows, cols];
  const total = shape.reduce((a, b) => a * b, 1);
  const stride = depth > 1 ? [rows * cols, cols, 1] : [cols, 1];

  return (
    <TwoCol>
      <div>
        <Slider label="Số khối (chiều sâu)" min={1} max={4} step={1} value={depth} onChange={setDepth} />
        <Slider label="Số hàng" min={1} max={4} step={1} value={rows} onChange={setRows} />
        <Slider label="Số cột" min={1} max={5} step={1} value={cols} onChange={setCols} />
        <StatRow>
          <Stat label="Shape" value={`[${shape.join(', ')}]`} color="var(--vec-1)" />
          <Stat label="Số chiều" value={shape.length} />
          <Stat label="Tổng phần tử" value={total} color="var(--vec-2)" />
          <Stat label="Stride" value={`(${stride.join(', ')})`} color="var(--vec-3)" />
        </StatRow>
        <Hint>
          Kéo "số khối" về 1 để thấy tensor rơi từ 3 chiều xuống 2 chiều (ma trận).
          Tổng phần tử luôn bằng TÍCH các số trong shape.
        </Hint>
      </div>
      <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap' }}>
        {Array.from({ length: depth }, (_, d) => (
          <div
            key={d}
            style={{
              border: '1px solid var(--border)',
              borderRadius: 8,
              padding: 8,
              background: 'var(--bg-elevated)',
            }}
          >
            <div className="dim" style={{ fontSize: 11, marginBottom: 6 }}>
              khối {d}
            </div>
            <div
              style={{
                display: 'grid',
                gridTemplateColumns: `repeat(${cols}, 26px)`,
                gap: 4,
              }}
            >
              {Array.from({ length: rows * cols }, (_, i) => (
                <div
                  key={i}
                  className="mono"
                  style={{
                    width: 26,
                    height: 26,
                    borderRadius: 5,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: 11,
                    background: 'color-mix(in srgb, var(--vec-1) 18%, transparent)',
                    border: '1px solid var(--border)',
                  }}
                >
                  {d * rows * cols + i}
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </TwoCol>
  );
}

// ---------------------------------------------------------------------------
// Khối tương tác 2 — STRIDE: chọn phần tử [i][j] của ma trận 3×4, xem nó nằm
// ở đâu trong dải bộ nhớ 1 chiều (vị trí = i·4 + j·1).
// ---------------------------------------------------------------------------
const M_ROWS = 3;
const M_COLS = 4;

function StrideExplorer() {
  const [i, setI] = useState(1);
  const [j, setJ] = useState(2);
  const pos = i * M_COLS + j;

  const cell = (active: boolean) => ({
    width: 30,
    height: 30,
    borderRadius: 6,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: 12,
    border: active ? '2px solid var(--accent)' : '1px solid var(--border)',
    background: active
      ? 'color-mix(in srgb, var(--accent) 25%, transparent)'
      : 'var(--bg-elevated)',
    fontWeight: active ? 700 : 400,
  });

  return (
    <TwoCol>
      <div>
        <Slider label="Chỉ số hàng i (đếm từ 0)" min={0} max={M_ROWS - 1} step={1} value={i} onChange={setI} />
        <Slider label="Chỉ số cột j (đếm từ 0)" min={0} max={M_COLS - 1} step={1} value={j} onChange={setJ} />
        <StatRow>
          <Stat label="Stride" value={`(${M_COLS}, 1)`} color="var(--vec-3)" />
          <Stat label="Công thức" value={`${i}·${M_COLS} + ${j}·1`} />
          <Stat label="Vị trí bộ nhớ" value={pos} color="var(--accent)" />
        </StatRow>
        <Hint>
          Ma trận 3×4 nằm trong bộ nhớ thành một hàng 12 ô. Đổi i để thấy "bước
          nhảy 4"; đổi j để thấy "bước nhảy 1".
        </Hint>
      </div>
      <div>
        <div className="dim" style={{ fontSize: 12, marginBottom: 6 }}>
          Ma trận 3 × 4 (chỉ số [i][j])
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: `repeat(${M_COLS}, 30px)`, gap: 4 }}>
          {Array.from({ length: M_ROWS * M_COLS }, (_, k) => (
            <div key={k} className="mono" style={cell(k === pos)}>
              {k}
            </div>
          ))}
        </div>
        <div className="dim" style={{ fontSize: 12, margin: '14px 0 6px' }}>
          Cùng dữ liệu đó trong bộ nhớ (dãy 1 chiều)
        </div>
        <div style={{ display: 'flex', gap: 4, flexWrap: 'wrap' }}>
          {Array.from({ length: M_ROWS * M_COLS }, (_, k) => (
            <div key={k} className="mono" style={cell(k === pos)}>
              {k}
            </div>
          ))}
        </div>
      </div>
    </TwoCol>
  );
}

// ---------------------------------------------------------------------------

export default function TensorLesson() {
  return (
    <Lesson id="ch10/tensor" title="Tensor — dữ liệu của Deep Learning">
      <Section kind="explore" title="Từ một con số đến khối nhiều chiều">
        <p>
          Mọi dữ liệu của Deep Learning — ảnh, văn bản, âm thanh — đều được đóng
          gói vào <b>tensor</b>. Một số đơn lẻ là tensor 0 chiều; một hàng số là
          tensor 1 chiều (mảng); có hàng và cột là tensor 2 chiều (ma trận); chồng
          nhiều "vỉ" lên nhau là tensor 3 chiều… Kéo các thanh trượt để xem shape,
          tổng phần tử và stride thay đổi.
        </p>
        <ShapeExplorer />
      </Section>

      <Section kind="explore" title="Tensor nằm trong bộ nhớ như thế nào? (stride)">
        <p>
          Bộ nhớ máy tính chỉ là <em>một hàng ô liên tiếp</em>. Tensor nhiều chiều
          được trải phẳng lên hàng đó, và <b>stride</b> (bước nhảy) là "bản đồ chỉ
          đường": muốn sang hàng kế tiếp của ma trận 3×4 phải nhảy 4 ô, sang cột kế
          chỉ nhảy 1 ô.
        </p>
        <StrideExplorer />
      </Section>

      <Section kind="theory" title="Shape, reshape và permute">
        <p>
          <b>Shape</b> mô tả kích thước từng chiều; tổng phần tử là tích của
          chúng:
        </p>
        <MathText block tex="n_{\text{phần tử}} = \prod_k d_k \qquad \text{vd. shape } [2,3,3] \Rightarrow 2\cdot 3\cdot 3 = 18" />
        <p>
          <b>Reshape</b> đổi hình dạng nhưng <em>tổng phần tử không đổi</em>: 9
          phần tử xếp được thành 3×3, 1×9, 9×1 — nhưng không thể thành 2×4.{' '}
          <b>Permute</b> đổi thứ tự các chiều: dữ liệu đứng yên trong bộ nhớ, chỉ
          stride hoán đổi, nên gần như tức thời:
        </p>
        <MathText block tex="\text{shape } (3,4),\ \text{stride } (4,1) \ \xrightarrow{\ \text{permute}\ }\ \text{shape } (4,3),\ \text{stride } (1,4)" />
        <p>
          Vị trí trong bộ nhớ của phần tử có chỉ số <MathText tex="(i, j)" /> với
          stride <MathText tex="(s_0, s_1)" />:
        </p>
        <MathText block tex="\text{vị trí} = i\,s_0 + j\,s_1" />
        <BridgeLA>
          Tensor 2 chiều <b>chính là ma trận</b> bạn đã học ở Chương 3 — và mọi
          lớp mạng nơ-ron sắp tới (ch11) chỉ là <MathText tex="W\mathbf{x} + \mathbf{b}" /> — phép
          nhân ma trận trên tensor. Nhờ dữ liệu quy chuẩn thành tensor, GPU với
          hàng nghìn nhân CUDA thực hiện các phép nhân đó song song, nhanh hơn
          duyệt tuần tự bằng CPU cả nghìn lần. Trong PyTorch:{' '}
          <span className="mono">torch.tensor / zeros / ones / rand</span>, biến đổi
          bằng <span className="mono">reshape, permute, view, cat</span>.
        </BridgeLA>
      </Section>

      <Section kind="quiz" title="Kiểm tra hiểu">
        <Quiz
          lessonKey="ch10/tensor"
          questions={[
            {
              q: 'Tensor có shape [2, 3, 3] chứa tổng cộng bao nhiêu phần tử?',
              options: ['8', '9', '18', '233'],
              answer: 2,
              explain: 'Tổng phần tử = tích các chiều: 2 × 3 × 3 = 18.',
            },
            {
              q: 'Tensor 9 phần tử KHÔNG thể reshape thành hình dạng nào?',
              options: ['[1, 9]', '[3, 3]', '[9, 1]', '[2, 4]'],
              answer: 3,
              explain: 'Reshape phải giữ nguyên tổng phần tử; [2, 4] cần 8 ≠ 9.',
            },
            {
              q: 'Ma trận shape (3, 4) có stride (4, 1). Sau permute hoán đổi hai chiều, stride mới là gì?',
              options: ['(4, 1)', '(1, 4)', '(3, 1)', '(1, 3)'],
              answer: 1,
              explain:
                'Permute hoán đổi thứ tự các chiều nên stride đổi theo: (4, 1) → (1, 4). Dữ liệu trong bộ nhớ không di chuyển.',
            },
            {
              q: 'Vì sao xử lý ảnh dưới dạng tensor trên GPU nhanh hơn duyệt từng điểm ảnh bằng CPU?',
              options: [
                'GPU có xung nhịp mỗi nhân cao hơn',
                'Tensor nén dữ liệu nên nhỏ hơn',
                'GPU có hàng nghìn nhân tính song song cùng lúc',
                'CPU không đọc được số thực',
              ],
              answer: 2,
              explain:
                'Dữ liệu quy chuẩn thành tensor cho phép hàng nghìn nhân CUDA tính song song — thay vì CPU xử lý tuần tự từng phần tử.',
            },
          ]}
        />
      </Section>
    </Lesson>
  );
}
