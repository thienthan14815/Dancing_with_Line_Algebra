import { useState } from 'react';
import { Lesson, Section } from '../../components/Lesson';
import MathText from '../../components/MathText';
import Scene3D from '../../components/Scene3D';
import MatrixInput from '../../components/MatrixInput';
import StepByStep from '../../components/StepByStep';
import Quiz from '../../components/Quiz';
import { rank, rrefSteps, det as detOf, type Mat } from '../../lib/linalg';
import { Stat, StatRow, Hint, Callout, matTex, HEX } from './_shared';

type Vec3 = [number, number, number];

// 12 cạnh của khối lập phương [0, s]³.
function cubeEdges(s: number): { from: Vec3; to: Vec3; color?: string }[] {
  const c: Vec3[] = [];
  for (const x of [0, s]) for (const y of [0, s]) for (const z of [0, s]) c.push([x, y, z]);
  const idx = (x: number, y: number, z: number) => (x ? 4 : 0) + (y ? 2 : 0) + (z ? 1 : 0);
  const edges: [Vec3, Vec3][] = [];
  for (const y of [0, 1]) for (const z of [0, 1]) edges.push([c[idx(0, y, z)], c[idx(1, y, z)]]);
  for (const x of [0, 1]) for (const z of [0, 1]) edges.push([c[idx(x, 0, z)], c[idx(x, 1, z)]]);
  for (const x of [0, 1]) for (const y of [0, 1]) edges.push([c[idx(x, y, 0)], c[idx(x, y, 1)]]);
  return edges.map(([from, to]) => ({ from, to, color: HEX.dim }));
}

export default function RankLesson() {
  const [A, setA] = useState<Mat>([
    [1, 0, 1],
    [0, 1, 1],
    [1, 1, 2],
  ]);

  const r = rank(A);
  const n = 3;
  const nullity = n - r;
  const det = detOf(A);
  const { rref } = rrefSteps(A);

  const imageDesc =
    r === 3
      ? 'cả không gian ℝ³ (khối giữ nguyên thể tích)'
      : r === 2
        ? 'một mặt phẳng (khối bị bẹp dẹp)'
        : r === 1
          ? 'một đường thẳng (khối bị bẹp thành que)'
          : 'chỉ điểm gốc';

  // Steps: tìm rank qua RREF.
  const { steps: rSteps } = rrefSteps(A);
  const stepItems = rSteps.map((s, i) => ({
    title: i === 0 ? 'Ma trận ban đầu' : s.desc,
    content: <MathText block tex={matTex(s.matrix)} />,
  }));
  stepItems.push({
    title: 'Đếm pivot = rank',
    content: (
      <div>
        <MathText block tex={matTex(rref)} />
        <p>
          Số hàng khác 0 (số pivot) là <b>{r}</b>, vậy <MathText tex={`\\operatorname{rank}(A) = ${r}`} />.
          Suy ra <MathText tex={`\\dim N(A) = n - \\operatorname{rank} = 3 - ${r} = ${nullity}`} />.
        </p>
      </div>
    ),
  });

  return (
    <Lesson id="rank" title="Rank">
      <Section kind="explore" title="Rank = số chiều mà biến đổi giữ lại được">
        <MatrixInput
          value={A}
          onChange={setA}
          presets={[
            { label: 'rank 3 (đầy đủ)', m: [[2, 0, 1], [0, 1, 0], [1, 0, 1]] },
            { label: 'rank 2 (bẹp thành mặt)', m: [[1, 0, 1], [0, 1, 1], [1, 1, 2]] },
            { label: 'rank 1 (bẹp thành đường)', m: [[1, 2, 3], [2, 4, 6], [3, 6, 9]] },
          ]}
        />
        <StatRow>
          <Stat label="rank(A)" value={r} color={r === 3 ? 'var(--good)' : 'var(--warn)'} />
          <Stat label="dim N(A) = 3 − rank" value={nullity} color={HEX.result} />
          <Stat label="det(A)" value={det.toFixed(2)} color={Math.abs(det) < 1e-9 ? 'var(--warn)' : 'var(--good)'} />
        </StatRow>

        <Scene3D
          height={400}
          matrix={A}
          lines3={cubeEdges(1.6)}
          vectors={[
            { id: 'c1', v: [1, 0, 0], color: HEX.v1, label: 'cột 1' },
            { id: 'c2', v: [0, 1, 0], color: HEX.v2, label: 'cột 2' },
            { id: 'c3', v: [0, 0, 1], color: HEX.result, label: 'cột 3' },
          ]}
        />
        <p className="dim" style={{ fontSize: 12.5, marginTop: 4 }}>
          Ảnh của khối qua A: <b>{imageDesc}</b>.
        </p>

        {r < 3 ? (
          <Callout tone="warn">
            ⚠️ rank {r} &lt; 3: biến đổi <b>làm sụp chiều</b>. Khối lập phương bị nén xuống{' '}
            {r === 2 ? 'một mặt phẳng' : 'một đường'} — thể tích về 0, nên det = 0 và A không khả
            nghịch. Đúng {nullity} chiều "biến mất" chính là số chiều của null space.
          </Callout>
        ) : (
          <Hint>
            Hãy đổi qua ba preset và xoay cảnh. <b>rank</b> là số chiều của ảnh — của khối sau khi
            đi qua A. rank 3: khối vẫn là khối đặc (đầy đủ chiều, det ≠ 0). rank 2: bẹp thành mặt.
            rank 1: bẹp thành que. Ba mũi tên cột chính là ảnh của ba trục đơn vị.
          </Hint>
        )}
      </Section>

      <Section kind="theory" title="Rank, và định lý rank–nullity">
        <p>
          <b>Rank</b> của A là số chiều của column space: <MathText tex="\operatorname{rank}(A) = \dim C(A)" />.
          Đó là "số hướng độc lập thật sự" trong các cột — cũng đúng bằng <b>số pivot</b> khi đưa
          A về RREF (mỗi pivot đánh dấu một cột mang chiều mới).
        </p>
        <p>Ba cách nói cùng một điều:</p>
        <ul>
          <li>rank = số cột độc lập tuyến tính = số chiều column space;</li>
          <li>rank = số pivot trong RREF;</li>
          <li>rank = số chiều của ảnh (khối bị biến đổi "còn lại" mấy chiều).</li>
        </ul>
        <p>
          <b>Định lý rank–nullity.</b> Với A kích thước <MathText tex="m \times n" />:
        </p>
        <MathText block tex="\operatorname{rank}(A) + \dim N(A) = n" />
        <p>
          Trực giác "bảo toàn số chiều": <MathText tex="n" /> chiều đầu vào được chia làm hai phần
          — số chiều <b>"đi ra được"</b> (rank, thành column space) cộng số chiều{' '}
          <b>"bị nuốt về 0"</b> (nullity, thành null space) — luôn bằng đúng <MathText tex="n" />.
          Ở ví dụ rank 2 phía trên: 2 chiều đi ra thành mặt phẳng, 1 chiều bị nuốt thành đường
          null; 2 + 1 = 3. ✓
        </p>
        <p>
          <b>Liên hệ determinant.</b> Với ma trận vuông <MathText tex="n \times n" />:{' '}
          <MathText tex="\det(A) \neq 0 \iff \operatorname{rank}(A) = n" /> (full rank) ⟺ khả
          nghịch ⟺ <MathText tex="N(A) = \{\vec 0\}" />. Chỉ cần rank tụt xuống dưới n là det = 0
          và mọi thứ "khả nghịch" sụp đổ cùng lúc.
        </p>
      </Section>

      <Section kind="steps" title="Tìm rank của A hiện tại qua RREF">
        <StepByStep steps={stepItems} />
        <Hint>
          Các bước cập nhật theo ma trận bạn đang nhập ở trên. Đổi preset rồi xem lại: preset
          "rank 1" sẽ để lộ chỉ một hàng pivot, hai hàng còn lại tan thành số 0.
        </Hint>
      </Section>

      <Section kind="quiz" title="Kiểm tra hiểu">
        <Quiz
          lessonKey="ch4/rank"
          questions={[
            {
              q: <>Rank của một ma trận bằng:</>,
              options: [
                'Số hàng của ma trận',
                'Số chiều của column space (số pivot trong RREF)',
                'Giá trị determinant',
                'Số phần tử khác 0',
              ],
              answer: 1,
              explain: (
                <>
                  rank = dim C(A) = số cột độc lập = số pivot khi đưa về RREF. Đó là "số hướng
                  thật sự" mà biến đổi giữ lại được.
                </>
              ),
            },
            {
              q: (
                <>
                  Ma trận 3×3 có rank 2. Theo định lý rank–nullity, dim N(A) bằng:
                </>
              ),
              options: ['0', '1', '2', '3'],
              answer: 1,
              explain: (
                <>
                  rank + nullity = n = 3, nên nullity = 3 − 2 = 1. Một chiều bị nuốt về 0 → null
                  space là một đường thẳng.
                </>
              ),
            },
            {
              q: <>Ma trận vuông n×n có det ≠ 0. Rank của nó là:</>,
              options: [
                'Bằng n (full rank)',
                'Nhỏ hơn n',
                'Bằng 0',
                'Không xác định được',
              ],
              answer: 0,
              explain: (
                <>
                  det ≠ 0 ⟺ full rank (rank = n) ⟺ khả nghịch ⟺ N(A) chỉ có vector 0. Biến đổi
                  không làm sụp chiều nào.
                </>
              ),
            },
            {
              q: (
                <>
                  Cả ba hàng của A tỉ lệ với nhau (ví dụ hàng 2 = 2·hàng 1, hàng 3 = 3·hàng 1).
                  Ảnh của khối lập phương qua A là:
                </>
              ),
              options: [
                'Cả không gian ℝ³',
                'Một mặt phẳng',
                'Một đường thẳng (rank 1)',
                'Một điểm khác gốc',
              ],
              answer: 2,
              explain: (
                <>
                  Chỉ 1 hàng độc lập → rank 1 → ảnh sụp xuống một đường thẳng qua gốc. Hai chiều
                  bị nuốt (nullity = 2).
                </>
              ),
            },
          ]}
        />
      </Section>
    </Lesson>
  );
}
