import { useState } from 'react';
import { Lesson, Section } from '../../components/Lesson';
import MathText from '../../components/MathText';
import Canvas2D from '../../components/Canvas2D';
import Slider from '../../components/Slider';
import StepByStep from '../../components/StepByStep';
import Quiz from '../../components/Quiz';
import { dot, norm } from '../../lib/linalg';
import type { Vec } from '../../lib/linalg';
import { f2, Stat, StatRow, Hint, Bridge, Caption } from './_shared';

// Nhúng 2D "đồ chơi": bố trí sao cho king − man + woman = queen đúng bằng phép cộng
// trừ vector, và các từ gần nghĩa nằm gần nhau.
const WORDS: Record<string, [number, number]> = {
  man: [1, 1],
  woman: [1, 3],
  king: [4, 1],
  queen: [4, 3],
  cat: [-3, -2],
  dog: [-3.6, -2.7],
  kitten: [-2.4, -1.3],
};

function cosine(a: Vec, b: Vec): number {
  const na = norm(a);
  const nb = norm(b);
  if (na === 0 || nb === 0) return 0;
  return dot(a, b) / (na * nb);
}

export default function EmbeddingsLesson() {
  const [t, setT] = useState(1); // trượt king → queen dọc hướng (woman − man)

  const { man, woman, king, queen, cat } = WORDS;
  // king + t·(woman − man): tại t=1 rơi đúng vào queen.
  const gx = woman[0] - man[0];
  const gy = woman[1] - man[1];
  const result: [number, number] = [king[0] + t * gx, king[1] + t * gy];

  const cosKQ = cosine(king, queen);
  const cosKC = cosine(king, cat);
  const cosMW = cosine(man, woman);

  const wordColor: Record<string, string> = {
    man: 'var(--vec-1)',
    woman: 'var(--vec-2)',
    king: 'var(--accent)',
    queen: 'var(--accent-strong)',
    cat: 'var(--vec-3)',
    dog: 'var(--vec-3)',
    kitten: 'var(--vec-3)',
  };

  const points = Object.entries(WORDS).map(([name, v]) => ({
    x: v[0],
    y: v[1],
    color: wordColor[name],
    label: name,
  }));
  // điểm kết quả của phép số học vector
  points.push({
    x: result[0],
    y: result[1],
    color: 'var(--vec-result)',
    label: t > 0.98 ? 'king−man+woman ≈ queen' : 'king−man+woman',
  });

  return (
    <Lesson id="embeddings" title="Word Embeddings (Nhúng từ)">
      <Section kind="explore" title="Bản đồ nghĩa & số học vector">
        <p>
          Word embedding biến mỗi <b>từ</b> thành một <b>vector</b> trong không gian
          nhiều chiều. Điều kỳ diệu: <b>quan hệ ngữ nghĩa trở thành quan hệ hình học</b>
          {' '}— từ gần nghĩa nằm gần nhau, và các phép <b>cộng/trừ vector</b> nắm bắt được
          loại suy (analogy).
        </p>

        <Caption>
          Bản đồ nhúng 2D — hướng "giới tính" (woman − man) song song với (queen − king)
        </Caption>
        <Canvas2D
          height={460}
          range={6}
          showGrid
          showAxes
          points={points}
          segments={[
            // hướng "giới tính": từ man tới woman
            { from: man, to: woman, color: 'var(--vec-2)', label: 'woman − man' },
            // sao chép hướng đó, đặt tại king → trượt tới queen
            {
              from: king,
              to: result,
              color: 'var(--vec-result)',
              dashed: true,
              label: '+ (woman − man)',
            },
          ]}
        />

        <div style={{ maxWidth: 360, marginTop: 10 }}>
          <Slider
            label="Cộng dần (woman − man) vào king"
            min={0}
            max={1}
            step={0.05}
            value={t}
            onChange={setT}
            format={(v) => `${Math.round(v * 100)}%`}
          />
        </div>

        <StatRow>
          <Stat
            label="king − man + woman"
            value={`[${f2(result[0])}, ${f2(result[1])}]`}
            color="var(--vec-result)"
          />
          <Stat label="queen thật" value={`[${f2(queen[0])}, ${f2(queen[1])}]`} color="var(--accent-strong)" />
        </StatRow>
        <StatRow>
          <Stat label="cos(king, queen)" value={f2(cosKQ)} color="var(--good)" />
          <Stat label="cos(man, woman)" value={f2(cosMW)} color="var(--good)" />
          <Stat label="cos(king, cat)" value={f2(cosKC)} color="var(--bad)" />
        </StatRow>

        <Hint>
          Cùng một mũi tên "woman − man" (màu cam), khi đặt tại <b>king</b> sẽ chỉ thẳng
          tới <b>queen</b>. Đó là lý do <MathText tex="\text{king} - \text{man} + \text{woman} \approx \text{queen}" />.
          Còn cosine similarity: king rất gần queen (≈ {f2(cosKQ)}) nhưng gần như ngược
          hướng với cat ({f2(cosKC)}) — từ khác nghĩa thì vector cũng "lệch hướng".
        </Hint>
      </Section>

      <Section kind="theory" title="Từ thành vector: word2vec, GloVe, cosine">
        <p>
          Các mô hình như <b>word2vec</b> và <b>GloVe</b> học một vector{' '}
          <MathText tex="\mathbb{R}^n" /> (thường <MathText tex="n" /> = 100–300 chiều)
          cho mỗi từ, dựa trên nguyên tắc phân bố: <i>"từ được biết qua những từ đi cùng
          nó"</i>. Kết quả là một không gian nơi hình học phản ánh ngữ nghĩa.
        </p>
        <ul>
          <li>
            <b>Độ tương tự = cosine similarity:</b>{' '}
            <MathText tex="\cos\theta = \dfrac{u\cdot v}{\lVert u\rVert\,\lVert v\rVert}" />.
            Gần 1 → cùng nghĩa; gần 0 → không liên quan; âm → trái nghĩa/khác hướng.
          </li>
          <li>
            <b>Loại suy (analogy):</b> các quan hệ như giống đực–giống cái, số ít–số
            nhiều trở thành những <b>hướng vector</b> nhất quán, nên giải được bằng cộng
            trừ vector.
          </li>
          <li>
            <b>Embedding là lớp đầu tiên</b> của hầu hết mô hình NLP: một bảng tra cứu
            biến chỉ số token thành vector, rồi đưa vào RNN hay Transformer.
          </li>
        </ul>

        <Bridge>
          Một embedding <b>chính là một vector</b> (Ch1); độ tương tự giữa hai từ là{' '}
          <b>cosine</b> — dot product của hai vector đã chuẩn hóa (Ch1: dot product &
          chuẩn hóa). Loại suy là <b>phép cộng/trừ vector</b>. Sâu hơn, <b>GloVe</b> huấn
          luyện bằng cách <b>phân rã ma trận đồng xuất hiện</b> (co-occurrence) của các
          từ — đúng tinh thần <b>SVD / phân rã ma trận cấp thấp</b> (Ch6): nén một ma
          trận từ × ngữ cảnh khổng lồ thành các vector đặc trưng ít chiều.
        </Bridge>
      </Section>

      <Section kind="steps" title="Giải loại suy bằng vector">
        <StepByStep
          steps={[
            {
              title: 'Bài toán',
              content: (
                <p>
                  Cho <MathText tex="\text{man}=[1,1]" />,{' '}
                  <MathText tex="\text{woman}=[1,3]" />,{' '}
                  <MathText tex="\text{king}=[4,1]" />. "king giống man như ? giống
                  woman" — tìm từ còn thiếu.
                </p>
              ),
            },
            {
              title: 'Bước 1 — trích hướng quan hệ',
              content: (
                <p>
                  Hướng "man → woman":{' '}
                  <MathText tex="\text{woman}-\text{man} = [1,3]-[1,1] = [0,2]" />. Đây là
                  "vector giới tính".
                </p>
              ),
            },
            {
              title: 'Bước 2 — áp hướng đó lên king',
              content: (
                <p>
                  <MathText tex="\text{king} + [0,2] = [4,1]+[0,2] = [4,3]" />.
                </p>
              ),
            },
            {
              title: 'Bước 3 — tra từ gần nhất',
              content: (
                <p>
                  Vector <MathText tex="[4,3]" /> trùng đúng với{' '}
                  <MathText tex="\text{queen}" />. Vậy{' '}
                  <MathText tex="\text{king}-\text{man}+\text{woman} = \text{queen}" />.
                </p>
              ),
            },
            {
              title: 'Bước 4 — kiểm bằng cosine',
              content: (
                <p>
                  <MathText tex="\cos(\text{king},\text{queen}) \approx 0.92" /> (rất gần
                  nghĩa) trong khi{' '}
                  <MathText tex="\cos(\text{king},\text{cat}) < 0" /> (khác hướng) — hình
                  học khớp với ngữ nghĩa.
                </p>
              ),
            },
          ]}
        />
      </Section>

      <Section kind="quiz" title="Kiểm tra hiểu">
        <Quiz
          lessonKey="ch12/embeddings"
          questions={[
            {
              q: <>Một word embedding, về bản chất toán học, là gì?</>,
              options: [
                'Một số nguyên chỉ số của từ',
                'Một vector trong không gian nhiều chiều ℝⁿ',
                'Một ma trận vuông khả nghịch',
                'Một xác suất trong [0, 1]',
              ],
              answer: 1,
              explain: (
                <>
                  Mỗi từ được ánh xạ thành một vector <MathText tex="\mathbb{R}^n" />; ngữ
                  nghĩa được mã hóa bởi vị trí/hướng của vector đó.
                </>
              ),
            },
            {
              q: <>Độ tương tự giữa hai embedding thường được đo bằng đại lượng nào?</>,
              options: [
                'Định thức',
                'Cosine similarity (dot product đã chuẩn hóa)',
                'Tích có hướng',
                'Hạng của ma trận',
              ],
              answer: 1,
              explain: (
                <>
                  <MathText tex="\cos\theta = \frac{u\cdot v}{\lVert u\rVert\lVert v\rVert}" /> —
                  gần 1 là cùng nghĩa. Đây là dot product của hai vector đã chuẩn hóa.
                </>
              ),
            },
            {
              q: (
                <>
                  Với <MathText tex="\text{Paris}-\text{France}+\text{Italy}" />, kết quả
                  mong đợi gần với từ nào?
                </>
              ),
              options: ['Rome', 'Berlin', 'Cat', 'King'],
              answer: 0,
              explain: (
                <>
                  Hướng "thủ đô − quốc gia" là nhất quán; áp lên Italy cho Rome — cùng
                  loại suy như king − man + woman = queen.
                </>
              ),
            },
            {
              q: <>GloVe liên hệ với đại số tuyến tính ở điểm nào?</>,
              options: [
                'Nó tính định thức của câu',
                'Nó phân rã ma trận đồng xuất hiện của từ thành các vector ít chiều (giống SVD)',
                'Nó đảo ngược ma trận từ điển',
                'Nó dùng tích có hướng để ghép từ',
              ],
              answer: 1,
              explain: (
                <>
                  GloVe khớp vector từ với thống kê đồng xuất hiện — thực chất là phân rã
                  ma trận cấp thấp, cùng tinh thần SVD (Ch6).
                </>
              ),
            },
          ]}
        />
      </Section>
    </Lesson>
  );
}
