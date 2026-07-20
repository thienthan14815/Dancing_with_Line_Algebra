import { useState } from 'react';
import { Lesson, Section } from '../../components/Lesson';
import MathText from '../../components/MathText';
import Canvas2D, { type V2 } from '../../components/Canvas2D';
import StepByStep from '../../components/StepByStep';
import Quiz from '../../components/Quiz';
import { dot, norm, gramSchmidt } from '../../lib/linalg';
import { f2, Stat, StatRow, Hint, DeepDive } from './_shared';

export default function OrthonormalLesson() {
  const [u, setU] = useState({ x: 3, y: 1 });
  const [v, setV] = useState({ x: -1, y: 2 });
  const [showON, setShowON] = useState(false);

  const uu = [u.x, u.y];
  const vv = [v.x, v.y];
  const d = dot(uu, vv);
  const perp = Math.abs(d) < 0.06 && norm(uu) > 0.3 && norm(vv) > 0.3;
  const on = gramSchmidt([uu, vv]); // tối đa 2 vector orthonormal
  const canON = on.length === 2;

  const onChange = (id: string, x: number, y: number) => {
    if (id === 'u') setU({ x, y });
    else if (id === 'v') setV({ x, y });
    setShowON(false);
  };

  const vectors: V2[] = [
    { id: 'u', x: u.x, y: u.y, color: 'var(--vec-1)', label: 'u', draggable: true },
    { id: 'v', x: v.x, y: v.y, color: 'var(--vec-2)', label: 'v', draggable: true },
  ];
  if (showON && canON) {
    vectors.push(
      { id: 'q1', x: on[0][0], y: on[0][1], color: 'var(--vec-3)', label: 'q₁' },
      { id: 'q2', x: on[1][0], y: on[1][1], color: 'var(--vec-result)', label: 'q₂' }
    );
  }

  // Ô vuông góc nhỏ tại gốc khi u ⟂ v
  const square: [number, number][] = [];
  if (perp) {
    const nu = norm(uu);
    const nv = norm(vv);
    const du = [u.x / nu, u.y / nu];
    const dv = [v.x / nv, v.y / nv];
    const s = 0.45;
    square.push(
      [s * du[0], s * du[1]],
      [s * du[0] + s * dv[0], s * du[1] + s * dv[1]],
      [s * dv[0], s * dv[1]]
    );
  }

  return (
    <Lesson id="orthonormal" title="Vector trực giao & Orthonormal basis">
      <Section kind="explore" title="Kéo hai vector — khi nào chúng trực giao?">
        <Canvas2D
          height={440}
          range={5}
          vectors={vectors}
          onVectorChange={onChange}
          polygons={
            square.length
              ? [{ points: square, fill: 'none', stroke: 'var(--vec-3)', opacity: 1 }]
              : []
          }
        />
        <StatRow>
          <Stat label="u · v" value={f2(d)} color={perp ? 'var(--vec-3)' : 'var(--accent)'} />
          <Stat label="|u|" value={f2(norm(uu))} color="var(--vec-1)" />
          <Stat label="|v|" value={f2(norm(vv))} color="var(--vec-2)" />
          <Stat
            label="quan hệ"
            value={perp ? 'trực giao ⟂' : 'chưa vuông'}
            color={perp ? 'var(--vec-3)' : 'var(--text-muted)'}
          />
        </StatRow>
        <div className="row" style={{ marginTop: 10, gap: 8 }}>
          <button
            className="preset-btn"
            onClick={() => setShowON((s) => !s)}
            disabled={!canON}
          >
            {showON ? 'Ẩn cặp orthonormal' : 'Trực chuẩn hóa (Gram–Schmidt)'}
          </button>
        </div>
        {showON && canON && (
          <StatRow>
            <Stat label="q₁ · q₂" value={f2(dot(on[0], on[1]))} color="var(--vec-3)" />
            <Stat label="|q₁|" value={f2(norm(on[0]))} color="var(--vec-3)" />
            <Stat label="|q₂|" value={f2(norm(on[1]))} color="var(--vec-result)" />
          </StatRow>
        )}
        <Hint>
          Kéo <b>u</b> và <b>v</b>. Khi <MathText tex="u\cdot v = 0" /> ô vuông nhỏ ở gốc sáng lên —
          hai vector <b>trực giao (orthogonal)</b>. Bấm <b>Trực chuẩn hóa</b>: Gram–Schmidt biến u,
          v thành cặp <b>q₁, q₂</b> vừa vuông góc vừa có độ dài đúng 1 — đó là một hệ{' '}
          <b>orthonormal</b> (nếu u ∥ v thì không dựng được, nút bị khóa).
        </Hint>
      </Section>

      <Section kind="theory" title="Trực giao, Orthonormal, và vì sao ta yêu chúng">
        <p>
          Hai vector <b>trực giao (orthogonal)</b> khi tích vô hướng của chúng bằng 0 — không vector
          nào có "thành phần chung" với vector kia:
        </p>
        <MathText block tex="u \perp v \iff u\cdot v = 0" />
        <p>
          Một hệ vector <MathText tex="q_1,\dots,q_n" /> là <b>orthonormal</b> nếu chúng đôi một trực
          giao <em>và</em> mỗi vector có độ dài đúng bằng 1:
        </p>
        <MathText block tex="q_i\cdot q_j = \begin{cases} 1 & \text{nếu } i=j \\ 0 & \text{nếu } i\neq j \end{cases}" />
        <p>
          "Ortho" = vuông góc, "normal" = chuẩn hóa về độ dài 1. Vì sao một{' '}
          <b>orthonormal basis</b> lại tiện đến vậy? Với một cơ sở bất kỳ{' '}
          <MathText tex="\{a_1,\dots,a_n\}" />, muốn tìm tọa độ của x ta phải <em>giải hệ</em>{' '}
          <MathText tex="A c = x" /> (khử Gauss, nghịch đảo — tốn công). Với orthonormal, tọa độ chỉ
          là <b>dot với từng basis vector</b>:
        </p>
        <MathText block tex="x = c_1 q_1 + \cdots + c_n q_n, \qquad c_i = x\cdot q_i" />
        <p>
          Không nghịch đảo, không khử Gauss — chỉ vài phép nhân vô hướng. Lý do: khi nhân{' '}
          <MathText tex="x = \sum_j c_j q_j" /> với <MathText tex="q_i" />, mọi số hạng{' '}
          <MathText tex="c_j (q_j\cdot q_i)" /> đều triệt tiêu trừ <MathText tex="j=i" />, để lại đúng{' '}
          <MathText tex="c_i" />.
        </p>
        <DeepDive>
          <p>
            Xếp các vector orthonormal thành các <b>cột</b> của một ma trận Q. Khi đó phần tử{' '}
            <MathText tex="(i,j)" /> của <MathText tex="Q^\top Q" /> chính là{' '}
            <MathText tex="q_i\cdot q_j" />, nên:
          </p>
          <MathText block tex="Q^\top Q = I" />
          <p>
            Ma trận vuông thỏa <MathText tex="Q^\top Q = I" /> (tức{' '}
            <MathText tex="Q^{-1}=Q^\top" />) gọi là <b>ma trận trực giao (orthogonal matrix)</b>. Nó{' '}
            <b>bảo toàn độ dài và góc</b>:
          </p>
          <MathText block tex="\|Qx\| = \|x\|, \qquad (Qx)\cdot(Qy) = x\cdot y" />
          <p>
            vì <MathText tex="(Qx)\cdot(Qy) = x^\top Q^\top Q\, y = x^\top y" />. Phép quay và phản
            xạ là các ma trận trực giao điển hình — chúng "xoay/lật" không gian mà không làm biến
            dạng. Đây là nền tảng cho QR và cho tính ổn định số của least squares ở các bài sau.
          </p>
        </DeepDive>
      </Section>

      <Section kind="steps" title="Tìm tọa độ trong một orthonormal basis">
        <StepByStep
          steps={[
            {
              title: 'Bài toán',
              content: (
                <p>
                  Cho cơ sở orthonormal <MathText tex="q_1=(0.6,\,0.8)" /> và{' '}
                  <MathText tex="q_2=(-0.8,\,0.6)" />. Hãy biểu diễn{' '}
                  <MathText tex="x=(2,\,1)" /> theo q₁, q₂.
                </p>
              ),
            },
            {
              title: 'Bước 1 — kiểm tra đúng là orthonormal',
              content: (
                <p>
                  <MathText tex="q_1\cdot q_2 = (0.6)(-0.8)+(0.8)(0.6) = -0.48+0.48 = 0" /> (vuông
                  góc), và <MathText tex="|q_1| = \sqrt{0.36+0.64}=1" />, tương tự{' '}
                  <MathText tex="|q_2|=1" /> ✓.
                </p>
              ),
            },
            {
              title: 'Bước 2 — tọa độ thứ nhất = x · q₁',
              content: (
                <p>
                  <MathText tex="c_1 = x\cdot q_1 = (2)(0.6)+(1)(0.8) = 1.2+0.8 = 2" />.
                </p>
              ),
            },
            {
              title: 'Bước 3 — tọa độ thứ hai = x · q₂',
              content: (
                <p>
                  <MathText tex="c_2 = x\cdot q_2 = (2)(-0.8)+(1)(0.6) = -1.6+0.6 = -1" />.
                </p>
              ),
            },
            {
              title: 'Kết quả & kiểm tra',
              content: (
                <p>
                  <MathText tex="x = 2\,q_1 - 1\,q_2" />. Dựng lại:{' '}
                  <MathText tex="2(0.6,0.8) - (-0.8,0.6) = (1.2,1.6)+(0.8,-0.6) = (2,1)" /> ✓. Không
                  cần giải một hệ nào cả — chỉ hai phép dot.
                </p>
              ),
            },
          ]}
        />
      </Section>

      <Section kind="quiz" title="Kiểm tra hiểu">
        <Quiz
          lessonKey="ch8/orthonormal"
          questions={[
            {
              q: <>Một hệ vector là <b>orthonormal</b> khi:</>,
              options: [
                'Chúng song song và cùng độ dài',
                'Chúng đôi một trực giao và mỗi vector có độ dài 1',
                'Chúng đôi một trực giao (độ dài bất kỳ)',
                'Tổng của chúng bằng vector không',
              ],
              answer: 1,
              explain: (
                <>
                  Orthonormal = orthogonal (<MathText tex="q_i\cdot q_j = 0" /> khi{' '}
                  <MathText tex="i\neq j" />) <em>và</em> normalized (<MathText tex="|q_i|=1" />).
                </>
              ),
            },
            {
              q: (
                <>
                  Với orthonormal basis <MathText tex="\{q_1,q_2\}" />, tọa độ của x dọc theo{' '}
                  <MathText tex="q_1" /> là:
                </>
              ),
              options: [
                <MathText tex="x\cdot q_1" />,
                <MathText tex="x + q_1" />,
                'nghiệm của một hệ 2×2',
                <MathText tex="|x|\,|q_1|" />,
              ],
              answer: 0,
              explain: (
                <>
                  Vì <MathText tex="q_1\cdot q_2 = 0" /> và <MathText tex="q_1\cdot q_1 = 1" />, nhân{' '}
                  <MathText tex="x=c_1q_1+c_2q_2" /> với <MathText tex="q_1" /> cho ngay{' '}
                  <MathText tex="c_1 = x\cdot q_1" />.
                </>
              ),
            },
            {
              q: <>Điều kiện <MathText tex="Q^\top Q = I" /> nói rằng các <b>cột</b> của Q:</>,
              options: [
                'là các vector orthonormal',
                'có tổng bằng 0',
                'đều là vector không',
                'phụ thuộc tuyến tính',
              ],
              answer: 0,
              explain: (
                <>
                  Phần tử <MathText tex="(i,j)" /> của <MathText tex="Q^\top Q" /> là{' '}
                  <MathText tex="q_i\cdot q_j" />; bằng ma trận đơn vị nghĩa là các cột đôi một trực
                  giao và có độ dài 1.
                </>
              ),
            },
            {
              q: <>Một ma trận trực giao Q khi tác dụng lên vector thì:</>,
              options: [
                'luôn phóng to gấp đôi độ dài',
                'bảo toàn độ dài và góc',
                'đưa mọi vector về 0',
                'làm mất tính vuông góc',
              ],
              answer: 1,
              explain: (
                <>
                  <MathText tex="\|Qx\|^2 = x^\top Q^\top Q x = x^\top x = \|x\|^2" />, và tương tự
                  dot product được giữ nguyên — nên góc cũng được bảo toàn.
                </>
              ),
            },
          ]}
        />
      </Section>
    </Lesson>
  );
}
