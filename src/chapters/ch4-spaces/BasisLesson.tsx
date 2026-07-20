import { useState } from 'react';
import { Lesson, Section } from '../../components/Lesson';
import MathText from '../../components/MathText';
import Canvas2D, { type V2 } from '../../components/Canvas2D';
import Quiz from '../../components/Quiz';
import { inverse, matVec, type Mat } from '../../lib/linalg';
import { f2, vec2Str, cross2, Stat, StatRow, Hint, Callout, basisLattice, HEX } from './_shared';

export default function BasisLesson() {
  const [b1, setB1] = useState({ x: 2, y: 0.5 });
  const [b2, setB2] = useState({ x: -0.5, y: 1.5 });

  // Điểm cố định P (tọa độ theo basis chuẩn).
  const P: [number, number] = [3, 2];

  const b1v: [number, number] = [b1.x, b1.y];
  const b2v: [number, number] = [b2.x, b2.y];
  const det = cross2(b1v, b2v);
  const degenerate = Math.abs(det) < 0.05;

  // B = [b1 | b2] (cột). Tọa độ theo B: [P]_B = B⁻¹ P.
  const B: Mat = [
    [b1.x, b2.x],
    [b1.y, b2.y],
  ];
  const Binv = inverse(B);
  const coordsB = Binv ? (matVec(Binv, P) as [number, number]) : null;

  const onChange = (id: string, x: number, y: number) => {
    if (id === 'b1') setB1({ x, y });
    else if (id === 'b2') setB2({ x, y });
  };

  const vectors: V2[] = [
    { id: 'b1', x: b1.x, y: b1.y, color: HEX.v1, label: 'b₁', draggable: true },
    { id: 'b2', x: b2.x, y: b2.y, color: HEX.v2, label: 'b₂', draggable: true },
  ];

  const lattice = basisLattice(b1v, b2v, degenerate ? 'var(--warn)' : '#3a5178');

  // Đường đi tổ hợp: gốc → a·b1 → P, minh họa [P]_B = (a, b).
  const pathSegs =
    coordsB && !degenerate
      ? [
          {
            from: [0, 0] as [number, number],
            to: [coordsB[0] * b1.x, coordsB[0] * b1.y] as [number, number],
            color: HEX.v1,
            dashed: true,
          },
          {
            from: [coordsB[0] * b1.x, coordsB[0] * b1.y] as [number, number],
            to: P,
            color: HEX.v2,
            dashed: true,
          },
        ]
      : [];

  return (
    <Lesson id="basis" title="Basis & Dimension">
      <Section kind="explore" title="Dựng một 'hệ trục mới' từ hai vector">
        <Canvas2D
          height={440}
          range={6}
          vectors={vectors}
          onVectorChange={onChange}
          segments={[...lattice, ...pathSegs]}
          points={[{ x: P[0], y: P[1], color: HEX.result, label: 'P' }]}
        />
        <StatRow>
          <Stat label="P theo basis chuẩn" value={vec2Str(P[0], P[1])} color={HEX.result} />
          <Stat
            label="[P] theo basis {b₁, b₂}"
            value={coordsB ? vec2Str(coordsB[0], coordsB[1]) : '—'}
            color={degenerate ? 'var(--warn)' : HEX.v1}
          />
          <Stat label="det(b₁, b₂)" value={f2(det)} color={degenerate ? 'var(--warn)' : 'var(--good)'} />
        </StatRow>
        {degenerate ? (
          <Callout tone="warn">
            ⚠️ b₁ và b₂ đang <b>thẳng hàng</b> (det ≈ 0) → chúng chỉ span một đường, không phủ
            được mặt phẳng. Chúng <b>mất tư cách basis</b>: điểm P nằm ngoài đường đó không còn
            tọa độ nào theo {'{'}b₁, b₂{'}'}. Hãy kéo cho hai vector lệch hướng.
          </Callout>
        ) : (
          <Hint>
            Lưới xiên là "hệ trục" của basis {'{'}b₁, b₂{'}'}. Điểm P cố định (hồng) không đổi vị
            trí thật, nhưng <b>tọa độ của nó thì đổi</b> tùy basis: theo chuẩn là [3, 2], còn theo
            basis mới là{' '}
            {coordsB ? <b>{vec2Str(coordsB[0], coordsB[1])}</b> : '—'}. Đường nét đứt cho thấy
            P = {coordsB ? f2(coordsB[0]) : ''}·b₁ + {coordsB ? f2(coordsB[1]) : ''}·b₂. Hãy kéo
            b₁, b₂ để thấy tọa độ chạy theo <i>ngay lập tức</i>.
          </Hint>
        )}
      </Section>

      <Section kind="theory" title="Basis: vừa đủ, không thừa">
        <p>
          Một <b>basis</b> (cơ sở) của một subspace <MathText tex="V" /> là một tập vector thỏa{' '}
          <b>đồng thời hai điều</b>:
        </p>
        <ul>
          <li>
            <b>Span được V</b> — đủ để với tới mọi điểm trong V (không thiếu).
          </li>
          <li>
            <b>Độc lập tuyến tính</b> — không vector nào thừa (không dư).
          </li>
        </ul>
        <p>
          Nói gọn: basis là một tập vector <b>vừa đủ</b> để làm "hệ trục" cho V. Trong ℝ² hai
          vector lệch hướng bất kỳ đều là một basis; basis chuẩn <MathText tex="\{(1,0), (0,1)\}" />{' '}
          chỉ là <i>một</i> lựa chọn tiện lợi trong vô số lựa chọn.
        </p>
        <p>
          <b>Dimension</b> (số chiều) của V là <b>số phần tử của một basis</b> bất kỳ của V. Điều
          kỳ diệu — và là một định lý — là con số này <b>bất biến</b>: mọi basis của cùng một
          không gian luôn có <i>đúng cùng</i> số vector. ℝ² luôn cần đúng 2, ℝ³ luôn cần đúng 3;
          không thể phủ ℝ² bằng 1 vector, cũng không thể giữ độc lập với 3 vector trong ℝ².
        </p>
        <p>
          <b>Tọa độ phụ thuộc basis.</b> Cùng một điểm P trong không gian, nhưng "địa chỉ" của nó —
          bộ số tọa độ — thay đổi khi ta đổi basis, đúng như bạn thấy ở trên. Tọa độ{' '}
          <MathText tex="[P]_B" /> trả lời câu hỏi: "cần pha b₁, b₂ theo tỉ lệ nào để ra P?". Ý
          tưởng này dẫn thẳng tới bài <b>Đổi cơ sở</b> ở cuối chương.
        </p>
      </Section>

      <Section kind="quiz" title="Kiểm tra hiểu">
        <Quiz
          lessonKey="ch4/basis"
          questions={[
            {
              q: <>Một basis của không gian V phải thỏa mãn:</>,
              options: [
                'Chỉ cần span được V',
                'Chỉ cần độc lập tuyến tính',
                'Vừa span được V, vừa độc lập tuyến tính',
                'Gồm các vector đơn vị vuông góc',
              ],
              answer: 2,
              explain: (
                <>
                  Span đảm bảo "đủ" (với tới mọi điểm), độc lập đảm bảo "không thừa". Thiếu một
                  trong hai thì không phải basis. Không bắt buộc vuông góc hay đơn vị.
                </>
              ),
            },
            {
              q: <>Dimension của một không gian được định nghĩa là:</>,
              options: [
                'Số vector nhiều nhất có thể vẽ',
                'Số phần tử của một basis (và mọi basis đều có cùng số này)',
                'Độ dài của vector dài nhất',
                'Số chiều của màn hình',
              ],
              answer: 1,
              explain: (
                <>
                  Mọi basis của cùng một không gian có <i>đúng cùng</i> số vector — số bất biến đó
                  chính là dimension.
                </>
              ),
            },
            {
              q: (
                <>
                  Cùng điểm P, đổi từ basis chuẩn sang basis {'{'}b₁, b₂{'}'} khác. Điều gì thay đổi?
                </>
              ),
              options: [
                'Vị trí thật của P trong không gian',
                'Bộ số tọa độ của P, còn vị trí thật giữ nguyên',
                'Cả vị trí lẫn tọa độ đều đổi',
                'Không gì thay đổi',
              ],
              answer: 1,
              explain: (
                <>
                  P là một điểm cố định trong không gian; chỉ "địa chỉ" (tọa độ) của nó phụ thuộc
                  hệ trục ta chọn. Đổi basis = đổi cách ghi địa chỉ, không dời điểm.
                </>
              ),
            },
            {
              q: <>Hai vector b₁, b₂ trong ℝ² thẳng hàng nhau thì:</>,
              options: [
                'Vẫn là basis của ℝ²',
                'Không phải basis vì chúng phụ thuộc, chỉ span một đường',
                'Là basis của một đường thẳng, và cũng của ℝ²',
                'Có dimension bằng 2',
              ],
              answer: 1,
              explain: (
                <>
                  Thẳng hàng → phụ thuộc → span chỉ là một đường (chiều 1), không phủ được ℝ². Mất
                  điều kiện "span V" nên không phải basis của ℝ².
                </>
              ),
            },
          ]}
        />
      </Section>
    </Lesson>
  );
}
