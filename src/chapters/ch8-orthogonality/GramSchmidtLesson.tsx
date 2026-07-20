import { useState } from 'react';
import { Lesson, Section } from '../../components/Lesson';
import MathText from '../../components/MathText';
import Canvas2D, { type V2 } from '../../components/Canvas2D';
import StepByStep from '../../components/StepByStep';
import Quiz from '../../components/Quiz';
import { dot, norm, normalize, scale, sub } from '../../lib/linalg';
import { f2, Stat, StatRow, Hint, DeepDive } from './_shared';

export default function GramSchmidtLesson() {
  const v1 = [2, 1];
  const v2 = [1, 2];
  const [step, setStep] = useState(0);

  // Các đại lượng của Gram–Schmidt (tính live)
  const u1 = normalize(v1); // q₁
  const c = dot(v2, u1); // hệ số chiếu v₂ lên q₁
  const proj = scale(u1, c); // bóng của v₂ trên q₁
  const w2 = sub(v2, proj); // phần vuông góc
  const u2 = normalize(w2); // q₂

  const V = (id: string, x: number, y: number, color: string, label: string): V2 => ({
    id,
    x,
    y,
    color,
    label,
  });

  const vectors: V2[] = [];
  const segments: { from: [number, number]; to: [number, number]; color?: string; dashed?: boolean; label?: string }[] = [];

  if (step === 0) {
    vectors.push(
      V('v1', v1[0], v1[1], 'var(--vec-1)', 'v₁'),
      V('v2', v2[0], v2[1], 'var(--vec-2)', 'v₂')
    );
  } else if (step === 1) {
    vectors.push(
      V('v2', v2[0], v2[1], 'var(--vec-2)', 'v₂'),
      V('u1', u1[0], u1[1], 'var(--vec-3)', 'q₁')
    );
  } else if (step === 2) {
    vectors.push(
      V('v2', v2[0], v2[1], 'var(--vec-2)', 'v₂'),
      V('u1', u1[0], u1[1], 'var(--vec-3)', 'q₁'),
      V('proj', proj[0], proj[1], 'var(--vec-result)', 'chiếu v₂→q₁')
    );
  } else if (step === 3) {
    vectors.push(
      V('v2', v2[0], v2[1], 'var(--vec-2)', 'v₂'),
      V('proj', proj[0], proj[1], 'var(--vec-result)', 'chiếu'),
      V('w2', w2[0], w2[1], 'var(--accent)', 'w₂ = v₂ − chiếu')
    );
    // cạnh nối đỉnh "chiếu" tới đỉnh v₂ chính là w₂ (bị bẻ vuông)
    segments.push({
      from: [proj[0], proj[1]],
      to: [v2[0], v2[1]],
      color: 'var(--accent)',
      dashed: true,
    });
  } else {
    vectors.push(
      V('u1', u1[0], u1[1], 'var(--vec-3)', 'q₁'),
      V('u2', u2[0], u2[1], 'var(--vec-result)', 'q₂')
    );
  }

  return (
    <Lesson id="gram-schmidt" title="Gram–Schmidt">
      <Section kind="explore" title="Biến hai vector bất kỳ thành orthonormal — từng bước">
        <Canvas2D height={430} range={4} vectors={vectors} segments={segments} />
        <StatRow>
          <Stat label="v₂ · q₁" value={f2(c)} color="var(--vec-result)" />
          <Stat label="|w₂|" value={f2(norm(w2))} color="var(--accent)" />
          <Stat label="q₁ · q₂" value={f2(dot(u1, u2))} color="var(--vec-3)" />
        </StatRow>
        <StepByStep
          onStepChange={setStep}
          steps={[
            {
              title: 'Xuất phát',
              content: (
                <p>
                  Hai vector độc lập <MathText tex="v_1=(2,1)" /> và <MathText tex="v_2=(1,2)" /> —
                  không vuông góc. Ta sẽ nắn chúng thành cặp orthonormal q₁, q₂.
                </p>
              ),
            },
            {
              title: 'Bước 1 — chuẩn hóa v₁ thành q₁',
              content: (
                <p>
                  <MathText tex="q_1 = \dfrac{v_1}{\|v_1\|}" /> — cùng hướng v₁ nhưng dài đúng 1. Đây
                  là "trục" đầu tiên của cơ sở mới.
                </p>
              ),
            },
            {
              title: 'Bước 2 — tìm bóng của v₂ trên q₁',
              content: (
                <p>
                  Hình chiếu của v₂ lên q₁ là <MathText tex="(v_2\cdot q_1)\,q_1" /> (mũi tên hồng).
                  Đây là phần của v₂ "nằm dọc theo" q₁ — phần ta muốn loại bỏ.
                </p>
              ),
            },
            {
              title: 'Bước 3 — trừ đi bóng để bẻ vuông',
              content: (
                <p>
                  <MathText tex="w_2 = v_2 - (v_2\cdot q_1)\,q_1" />. Sau khi trừ bóng đi, phần còn
                  lại <MathText tex="w_2" /> <b>vuông góc</b> với q₁ (kiểm tra: <MathText tex="w_2\cdot q_1 = 0" />).
                </p>
              ),
            },
            {
              title: 'Bước 4 — chuẩn hóa w₂ thành q₂',
              content: (
                <p>
                  <MathText tex="q_2 = \dfrac{w_2}{\|w_2\|}" />. Giờ <MathText tex="\{q_1,q_2\}" />{' '}
                  vừa trực giao vừa đơn vị — một orthonormal basis của cùng mặt phẳng.
                </p>
              ),
            },
          ]}
        />
        <Hint>
          Bấm <b>Sau →</b> để chạy từng bước. Ý tưởng cốt lõi: mỗi vector mới bị <b>trừ đi bóng</b>{' '}
          (hình chiếu) của nó lên các trục đã dựng, phần còn lại chắc chắn vuông góc với chúng.
        </Hint>
      </Section>

      <Section kind="theory" title="Thuật toán & ý nghĩa hình học">
        <p>
          Gram–Schmidt biến một cơ sở bất kỳ <MathText tex="\{v_1,v_2,\dots,v_k\}" /> thành một cơ sở{' '}
          <b>orthonormal</b> <MathText tex="\{q_1,q_2,\dots,q_k\}" /> của cùng không gian con. Với
          mỗi vector, ta lần lượt "trừ đi bóng" lên tất cả các trục đã dựng rồi chuẩn hóa:
        </p>
        <MathText block tex="w_i = v_i - \sum_{j<i} (v_i\cdot q_j)\,q_j, \qquad q_i = \frac{w_i}{\|w_i\|}." />
        <p>
          Trực quan: <MathText tex="(v_i\cdot q_j)\,q_j" /> là phần của{' '}
          <MathText tex="v_i" /> "nằm dọc theo" hướng <MathText tex="q_j" /> — cái bóng của nó. Trừ hết
          các bóng đi, những gì còn lại buộc phải vuông góc với mọi hướng cũ. Chuẩn hóa để độ dài
          bằng 1. Cứ thế, ta dựng dần một hệ trục vuông góc.
        </p>
        <DeepDive>
          <p>
            <b>Bảo toàn span.</b> Vì mỗi <MathText tex="q_i" /> là tổ hợp tuyến tính của{' '}
            <MathText tex="v_1,\dots,v_i" /> (và ngược lại), ta luôn có{' '}
            <MathText tex="\mathrm{span}(q_1,\dots,q_i) = \mathrm{span}(v_1,\dots,v_i)" /> tại mọi
            bước — cơ sở đổi nhưng không gian sinh ra không đổi.
          </p>
          <p>
            <b>Phát hiện phụ thuộc tuyến tính.</b> Nếu <MathText tex="v_i" /> đã nằm trong span của
            các vector trước, thì sau khi trừ hết bóng ta được <MathText tex="w_i = 0" /> (không thể
            chuẩn hóa) — Gram–Schmidt bỏ qua nó. Đó cũng chính là cách hàm{' '}
            <code>gramSchmidt</code> loại các vector suy biến.
          </p>
          <p>
            <b>Liên hệ QR.</b> Xếp các <MathText tex="q_i" /> thành cột của Q và ghi lại các hệ số{' '}
            <MathText tex="r_{ji} = v_i\cdot q_j" /> (cùng <MathText tex="r_{ii}=\|w_i\|" />) vào một
            ma trận tam giác trên R, ta được đúng phân tích <MathText tex="A = QR" /> ở bài sau.
          </p>
        </DeepDive>
      </Section>

      <Section kind="steps" title="Ví dụ số: Gram–Schmidt cho (1,1) và (2,0)">
        <StepByStep
          steps={[
            {
              title: 'Bài toán',
              content: (
                <p>
                  Trực chuẩn hóa <MathText tex="v_1=(1,1)" /> và <MathText tex="v_2=(2,0)" />.
                </p>
              ),
            },
            {
              title: 'Bước 1 — q₁',
              content: (
                <p>
                  <MathText tex="\|v_1\| = \sqrt{1+1} = \sqrt 2" />, nên{' '}
                  <MathText tex="q_1 = \tfrac{1}{\sqrt2}(1,1) \approx (0.71,\,0.71)" />.
                </p>
              ),
            },
            {
              title: 'Bước 2 — bóng của v₂ trên q₁',
              content: (
                <p>
                  <MathText tex="v_2\cdot q_1 = \tfrac{1}{\sqrt2}(2\cdot1 + 0\cdot1) = \tfrac{2}{\sqrt2} = \sqrt2" />
                  , nên bóng là{' '}
                  <MathText tex="(v_2\cdot q_1)q_1 = \sqrt2\cdot\tfrac{1}{\sqrt2}(1,1) = (1,1)" />.
                </p>
              ),
            },
            {
              title: 'Bước 3 — w₂ = v₂ − bóng',
              content: (
                <p>
                  <MathText tex="w_2 = (2,0) - (1,1) = (1,-1)" />. Kiểm tra vuông góc:{' '}
                  <MathText tex="w_2\cdot v_1 = (1)(1)+(-1)(1) = 0" /> ✓.
                </p>
              ),
            },
            {
              title: 'Bước 4 — q₂',
              content: (
                <p>
                  <MathText tex="\|w_2\| = \sqrt2" />, nên{' '}
                  <MathText tex="q_2 = \tfrac{1}{\sqrt2}(1,-1) \approx (0.71,\,-0.71)" />. Vậy{' '}
                  <MathText tex="\{q_1,q_2\}" /> là orthonormal basis cần tìm.
                </p>
              ),
            },
          ]}
        />
      </Section>

      <Section kind="quiz" title="Kiểm tra hiểu">
        <Quiz
          lessonKey="ch8/gram-schmidt"
          questions={[
            {
              q: <>Gram–Schmidt nhận một cơ sở và trả về:</>,
              options: [
                'một orthonormal basis của cùng không gian con',
                'ma trận nghịch đảo',
                'các eigenvalue',
                'một cơ sở có độ dài lớn hơn',
              ],
              answer: 0,
              explain: (
                <>
                  Nó nắn cơ sở đã cho thành hệ vừa vuông góc vừa đơn vị, mà không đổi không gian sinh
                  ra.
                </>
              ),
            },
            {
              q: (
                <>
                  Bước "trừ đi bóng" <MathText tex="w_2 = v_2 - (v_2\cdot q_1)q_1" /> làm{' '}
                  <MathText tex="w_2" /> vuông góc với:
                </>
              ),
              options: [<MathText tex="v_2" />, <MathText tex="q_1" />, 'cả hai trục toạ độ', 'không vector nào'],
              answer: 1,
              explain: (
                <>
                  <MathText tex="w_2\cdot q_1 = v_2\cdot q_1 - (v_2\cdot q_1)(q_1\cdot q_1) = 0" /> vì{' '}
                  <MathText tex="q_1\cdot q_1 = 1" />.
                </>
              ),
            },
            {
              q: (
                <>
                  Nếu <MathText tex="v_i" /> phụ thuộc tuyến tính vào các vector trước, sau khi trừ
                  hết bóng ta được:
                </>
              ),
              options: [
                'một vector đơn vị',
                'vector không (nên bị loại)',
                'chính v_i',
                'một eigenvector',
              ],
              answer: 1,
              explain: (
                <>
                  <MathText tex="v_i" /> nằm trọn trong span cũ nên bóng của nó bằng chính nó; trừ đi
                  còn <MathText tex="0" />, không chuẩn hóa được.
                </>
              ),
            },
            {
              q: <>Không gian sinh bởi <MathText tex="\{q_1,\dots,q_k\}" /> so với <MathText tex="\{v_1,\dots,v_k\}" />:</>,
              options: ['nhỏ hơn', 'lớn hơn', 'bằng nhau', 'không liên quan'],
              answer: 2,
              explain: (
                <>
                  Mỗi q là tổ hợp của các v (và ngược lại), nên span được bảo toàn tại từng bước.
                </>
              ),
            },
          ]}
        />
      </Section>
    </Lesson>
  );
}
