import { useState } from 'react';
import { Lesson, Section } from '../../components/Lesson';
import MathText from '../../components/MathText';
import Slider from '../../components/Slider';
import StepByStep from '../../components/StepByStep';
import Quiz from '../../components/Quiz';
import { matMul, transpose } from '../../lib/linalg';
import type { Mat } from '../../lib/linalg';
import { softmax } from '../../lib/nn';
import {
  f2,
  Stat,
  StatRow,
  Hint,
  Bridge,
  Caption,
  TwoCol,
  MatrixGrid,
  divCell,
  probCell,
} from './_shared';

const D = 2; // chiều của key/query
const SQRT_D = Math.sqrt(D);

// K và V cố định; Q có thể chỉnh (truy vấn thứ 3).
const K: Mat = [
  [1, 0],
  [0, 1],
  [1, 1],
];
const V: Mat = [
  [1, 0],
  [0, 2],
  [3, 1],
];

export default function AttentionLesson() {
  // Chỉ cho chỉnh thành phần đầu của query #3 (chỉ số 2) để thấy heatmap đổi.
  const [q3x, setQ3x] = useState(1);
  const focus = 2; // hàng truy vấn đang theo dõi

  const Q: Mat = [
    [1, 0],
    [0, 1],
    [q3x, 1],
  ];

  // 1) Điểm tương hợp: S = Q Kᵀ  (mỗi ô = dot product query·key)
  const scoresRaw = matMul(Q, transpose(K)); // 3×3
  // 2) Chia tỉ lệ 1/√d cho ổn định
  const scores = scoresRaw.map((row) => row.map((v) => v / SQRT_D));
  // 3) softmax THEO HÀNG → trọng số chú ý (mỗi hàng cộng lại = 1)
  const weights = scores.map((row) => softmax(row));
  // 4) Đầu ra = trọng số · V (tổ hợp tuyến tính các hàng của V)
  const output = matMul(weights, V); // 3×2

  const maxAbsScore = Math.max(1, ...scores.flat().map((x) => Math.abs(x)));
  const qLabels = ['q1', 'q2', 'q3'];
  const kLabels = ['k1', 'k2', 'k3'];

  return (
    <Lesson id="attention" title="Attention & Transformer">
      <Section kind="explore" title="Từ Q, K, V đến trọng số chú ý">
        <p>
          Attention để mỗi <b>truy vấn</b> (query) "nhìn quanh" và quyết định nên chú ý
          tới những phần nào của đầu vào. Chỉ với ba ma trận{' '}
          <MathText tex="Q, K, V" /> và vài phép <b>nhân ma trận + softmax</b>, ta có
          nguyên khối xây nên Transformer.
        </p>

        <TwoCol>
          <div>
            <Caption>Q — truy vấn (query), mỗi hàng một truy vấn</Caption>
            <MatrixGrid
              data={Q}
              size={40}
              color={(v) => divCell(v, 3)}
              format={f2}
              highlight={(i) => i === focus}
              rowLabels={qLabels}
            />
          </div>
          <div>
            <Caption>K — khóa (key)</Caption>
            <MatrixGrid data={K} size={40} color={(v) => divCell(v, 3)} format={f2} rowLabels={kLabels} />
          </div>
        </TwoCol>

        <div style={{ maxWidth: 360, marginTop: 12 }}>
          <Slider
            label="q3 — thành phần đầu"
            min={-2}
            max={3}
            step={0.25}
            value={q3x}
            onChange={setQ3x}
            format={f2}
          />
        </div>

        <TwoCol>
          <div>
            <Caption>
              Điểm số <MathText tex="S = QK^\top/\sqrt{d}" /> (hàng q3 nổi bật)
            </Caption>
            <MatrixGrid
              data={scores}
              size={46}
              color={(v) => divCell(v, maxAbsScore)}
              format={f2}
              rowLabels={qLabels}
              colLabels={kLabels}
              highlight={(i) => i === focus}
            />
          </div>
          <div>
            <Caption>Trọng số chú ý = softmax theo hàng (mỗi hàng cộng = 1)</Caption>
            <MatrixGrid
              data={weights}
              size={46}
              color={(v) => probCell(v)}
              format={f2}
              rowLabels={qLabels}
              colLabels={kLabels}
              highlight={(i) => i === focus}
            />
          </div>
        </TwoCol>

        <div style={{ marginTop: 10 }}>
          <Caption>
            Đầu ra <MathText tex="= \text{softmax}(QK^\top/\sqrt d)\,V" /> — mỗi hàng là
            tổ hợp có trọng số của các hàng V
          </Caption>
          <MatrixGrid
            data={output}
            size={46}
            color={(v) => divCell(v, 3)}
            format={f2}
            rowLabels={qLabels}
            highlight={(i) => i === focus}
          />
        </div>

        <StatRow>
          <Stat
            label="q3 chú ý k1"
            value={f2(weights[focus][0])}
            color="var(--accent)"
          />
          <Stat label="q3 chú ý k2" value={f2(weights[focus][1])} color="var(--accent)" />
          <Stat
            label="q3 chú ý k3"
            value={f2(weights[focus][2])}
            color="var(--accent-strong)"
          />
          <Stat
            label="đầu ra q3"
            value={`[${f2(output[focus][0])}, ${f2(output[focus][1])}]`}
            color="var(--vec-result)"
          />
        </StatRow>

        <Hint>
          Kéo thanh trượt để đổi truy vấn <MathText tex="q_3" />. Khi{' '}
          <MathText tex="q_3" /> "giống" một key nào hơn (dot product lớn hơn), ô điểm số
          đậm lên và softmax dồn trọng số về đó → đầu ra ngả về <b>hàng V</b> tương ứng.
          Chú ý mỗi hàng trọng số luôn <b>cộng lại bằng 1</b>.
        </Hint>
      </Section>

      <Section kind="theory" title="Công thức attention — thuần đại số tuyến tính">
        <p>Toàn bộ cơ chế gói gọn trong một dòng:</p>
        <MathText
          block
          tex="\text{Attention}(Q,K,V) = \text{softmax}\!\left(\frac{QK^\top}{\sqrt{d}}\right)V"
        />
        <p>Đọc từ trong ra ngoài:</p>
        <ul>
          <li>
            <MathText tex="QK^\top" />: ma trận <b>điểm tương hợp</b>. Ô{' '}
            <MathText tex="(i,j)" /> là dot product của query <MathText tex="i" /> với
            key <MathText tex="j" /> — đo độ "hợp nhau".
          </li>
          <li>
            <MathText tex="/\sqrt{d}" />: chia tỉ lệ để điểm số không quá lớn khi{' '}
            <MathText tex="d" /> lớn (giữ softmax không bão hòa).
          </li>
          <li>
            <b>softmax theo hàng</b>: biến mỗi hàng điểm số thành phân phối xác suất —
            trọng số chú ý dương, cộng lại bằng 1.
          </li>
          <li>
            <MathText tex="\times V" />: đầu ra mỗi truy vấn là <b>trung bình có trọng
            số</b> các hàng của <MathText tex="V" />.
          </li>
        </ul>
        <p>
          <b>Self-attention:</b> <MathText tex="Q, K, V" /> đều sinh ra từ CÙNG một chuỗi
          đầu vào (nhân với ba ma trận trọng số học được) — mỗi token tự nhìn các token
          khác. <b>Positional encoding</b> cộng thêm thông tin vị trí vì phép attention
          vốn không phân biệt thứ tự. Xếp chồng nhiều lớp self-attention + mạng
          feed-forward, thêm <b>multi-head</b> (nhiều attention song song) và residual,
          ta có <b>Transformer</b> — kiến trúc của các mô hình ngôn ngữ lớn hiện nay.
        </p>

        <Bridge>
          Attention gần như <b>toàn bộ là đại số tuyến tính</b>. Ma trận điểm số{' '}
          <MathText tex="QK^\top" /> là một <b>nhân ma trận</b> (Ch3) mà mỗi ô là một{' '}
          <b>dot product</b> query·key (Ch1) — chính là một <b>ma trận Gram</b> đo độ
          tương tự giữa các vector. Bước cuối <MathText tex="(\cdot)V" /> khiến mỗi đầu
          ra là một <b>tổ hợp tuyến tính các hàng của V</b> (Ch1) với hệ số là trọng số
          chú ý. Softmax là mảnh phi tuyến duy nhất; bỏ nó đi thì attention chỉ còn là
          những phép nhân ma trận nối tiếp.
        </Bridge>
      </Section>

      <Section kind="steps" title="Tính attention cho một truy vấn">
        <StepByStep
          steps={[
            {
              title: 'Bài toán',
              content: (
                <p>
                  Xét truy vấn <MathText tex="q_1=[1,0]" /> với các key{' '}
                  <MathText tex="k_1=[1,0],\,k_2=[0,1],\,k_3=[1,1]" /> và{' '}
                  <MathText tex="d=2" />. Tính trọng số chú ý của <MathText tex="q_1" />.
                </p>
              ),
            },
            {
              title: 'Bước 1 — điểm số QKᵀ',
              content: (
                <p>
                  Dot product với từng key:{' '}
                  <MathText tex="q_1\cdot k_1 = 1,\; q_1\cdot k_2 = 0,\; q_1\cdot k_3 = 1" />.
                  Vậy hàng điểm số thô là <MathText tex="[1,\,0,\,1]" />.
                </p>
              ),
            },
            {
              title: 'Bước 2 — chia √d',
              content: (
                <p>
                  <MathText tex="[1,0,1]/\sqrt{2} \approx [0.707,\;0,\;0.707]" />.
                </p>
              ),
            },
            {
              title: 'Bước 3 — softmax theo hàng',
              content: (
                <p>
                  Lấy mũ rồi chuẩn hóa:{' '}
                  <MathText tex="e^{0.707}\approx2.03,\ e^{0}=1,\ e^{0.707}\approx2.03" />,
                  tổng <MathText tex="\approx 5.06" />. Trọng số{' '}
                  <MathText tex="\approx [0.40,\,0.20,\,0.40]" /> (cộng lại = 1).
                </p>
              ),
            },
            {
              title: 'Bước 4 — trộn V',
              content: (
                <p>
                  Với <MathText tex="V=\{[1,0],[0,2],[3,1]\}" />, đầu ra{' '}
                  <MathText tex="\approx 0.40[1,0]+0.20[0,2]+0.40[3,1] = [1.60,\,0.80]" /> —
                  một tổ hợp tuyến tính các hàng V.
                </p>
              ),
            },
          ]}
        />
      </Section>

      <Section kind="quiz" title="Kiểm tra hiểu">
        <Quiz
          lessonKey="ch12/attention"
          questions={[
            {
              q: (
                <>
                  Với <MathText tex="q=[2,1]" /> và <MathText tex="k=[1,3]" />, điểm số
                  chưa chia tỉ lệ <MathText tex="q\cdot k" /> bằng?
                </>
              ),
              options: ['5', '7', '3', '6'],
              answer: 0,
              explain: (
                <>
                  <MathText tex="2\cdot1 + 1\cdot3 = 2 + 3 = 5" />. Mỗi ô của{' '}
                  <MathText tex="QK^\top" /> là một dot product như vậy.
                </>
              ),
            },
            {
              q: <>Trong công thức attention, softmax được áp như thế nào?</>,
              options: [
                'Theo cột của ma trận điểm số',
                'Theo hàng, biến mỗi hàng thành phân phối cộng lại bằng 1',
                'Lên toàn bộ ma trận cùng lúc',
                'Chỉ lên đường chéo',
              ],
              answer: 1,
              explain: (
                <>
                  Mỗi truy vấn (một hàng) phân bổ 100% sự chú ý cho các key, nên softmax
                  chạy theo hàng và mỗi hàng cộng lại bằng 1.
                </>
              ),
            },
            {
              q: (
                <>
                  Đầu ra của attention cho một truy vấn, xét về đại số tuyến tính, là gì
                  của các hàng <MathText tex="V" />?
                </>
              ),
              options: [
                'Tích vô hướng',
                'Tổ hợp tuyến tính (trung bình có trọng số)',
                'Tích có hướng',
                'Định thức',
              ],
              answer: 1,
              explain: (
                <>
                  Nhân vector trọng số với <MathText tex="V" /> cho một tổ hợp tuyến tính
                  các hàng của <MathText tex="V" /> — hệ số chính là trọng số chú ý.
                </>
              ),
            },
            {
              q: <>Vì sao chia cho <MathText tex="\sqrt{d}" /> trước khi softmax?</>,
              options: [
                'Để ma trận trở nên vuông',
                'Để điểm số không quá lớn khi d lớn, tránh softmax bão hòa',
                'Để đầu ra luôn dương',
                'Để bỏ qua bước nhân với V',
              ],
              answer: 1,
              explain: (
                <>
                  Khi <MathText tex="d" /> lớn, dot product có phương sai lớn; chia{' '}
                  <MathText tex="\sqrt{d}" /> giữ điểm số ở thang hợp lý để gradient của
                  softmax không tiêu biến.
                </>
              ),
            },
            {
              q: <>Positional encoding được thêm vào để làm gì?</>,
              options: [
                'Tăng số lượng tham số',
                'Cung cấp thông tin THỨ TỰ vì attention vốn không phân biệt vị trí',
                'Thay thế cho softmax',
                'Chuẩn hóa độ dài vector',
              ],
              answer: 1,
              explain: (
                <>
                  Phép attention đối xử các token như một tập hợp; positional encoding
                  cộng thêm dấu hiệu vị trí để mô hình biết thứ tự của chuỗi.
                </>
              ),
            },
          ]}
        />
      </Section>
    </Lesson>
  );
}
