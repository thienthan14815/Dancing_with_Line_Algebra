import { useState } from 'react';
import { Lesson, Section } from '../../components/Lesson';
import MathText from '../../components/MathText';
import Canvas2D, { type V2 } from '../../components/Canvas2D';
import Slider from '../../components/Slider';
import StepByStep from '../../components/StepByStep';
import Quiz from '../../components/Quiz';
import { eigenSymmetric, type Mat } from '../../lib/linalg';
import { Contours, AxisLine, type ContourLevel } from './Contours';
import { f2 } from './util';

const LEVEL1: ContourLevel[] = [
  { L: 1, color: 'var(--vec-result)', width: 3, opacity: 1 },
];

interface ConicClass {
  name: string;
  note: string;
  color: string;
}

function classifyConic(a: number, c: number, det: number): ConicClass {
  const EPS = 1e-6;
  if (det > EPS) {
    if (a > 0 || c > 0) {
      return { name: 'Ellipse', note: 'A xác định dương ⇒ đường mức q=1 là ellipse.', color: 'var(--vec-3)' };
    }
    return {
      name: 'Ellipse ảo (vô nghiệm thực)',
      note: 'A xác định âm ⇒ q=1 không có điểm thực nào; đổi sang q=−1 mới thấy ellipse.',
      color: 'var(--warn)',
    };
  }
  if (det < -EPS) {
    return { name: 'Hyperbola', note: 'A không xác định (indefinite) ⇒ hai nhánh hyperbola.', color: 'var(--vec-result)' };
  }
  return {
    name: 'Suy biến (parabolic)',
    note: 'det = 0 ⇒ một eigenvalue bằng 0; q=1 thành cặp đường thẳng song song.',
    color: 'var(--vec-2)',
  };
}

export default function Lesson4Conic() {
  const [a, setA] = useState(1);
  const [b, setB] = useState(1.2);
  const [c, setC] = useState(1);

  // Ma trận đối xứng của conic ax² + bxy + cy² = 1.
  const A: Mat = [
    [a, b / 2],
    [b / 2, c],
  ];
  const det = a * c - (b * b) / 4;
  const disc = b * b - 4 * a * c; // biệt thức conic
  const { values, vectors } = eigenSymmetric(A);
  const [l1, l2] = values;
  const v1 = vectors[0];
  const v2 = vectors[1];
  const conic = classifyConic(a, c, det);

  const eigenVecs: V2[] = [
    { id: 'v1', x: v1[0] * 2.6, y: v1[1] * 2.6, color: 'var(--vec-3)', label: 'trục 1' },
    { id: 'v2', x: v2[0] * 2.6, y: v2[1] * 2.6, color: 'var(--vec-1)', label: 'trục 2' },
  ];

  const semi = (l: number) => (l > 1e-6 ? `1/√${f2(l)} ≈ ${f2(1 / Math.sqrt(l))}` : '—');

  return (
    <Lesson id="ch9-conic" title="Đường & mặt bậc hai">
      <p className="muted">
        Phương trình <MathText tex="ax^2 + bxy + cy^2 = 1" /> vẽ ra ellipse, hyperbola hay
        cặp đường thẳng — chỉ khác nhau ở bộ ba hệ số. Bí mật để đọc ra loại nào và vẽ nó cho
        đúng nằm gọn trong ma trận đối xứng{' '}
        <MathText tex="A=\begin{bmatrix} a & b/2 \\ b/2 & c \end{bmatrix}" /> và hai
        eigenvector của nó.
      </p>

      <Section kind="explore" title="Chỉnh a, b, c — xem conic đổi loại">
        <p className="muted" style={{ marginTop: 0 }}>
          <b>Nhiệm vụ:</b> Kéo ba thanh trượt. Đường <span style={{ color: 'var(--vec-result)' }}>hồng</span>{' '}
          là <MathText tex="q=1" />. Hai đường đứt là <b>trục chính</b> (principal axes) —
          hướng eigenvector của <MathText tex="A" />. Thử tăng <MathText tex="b" /> cho tới khi{' '}
          <MathText tex="\det A = ac - b^2/4" /> đổi dấu: ellipse "mở bung" thành hyperbola.
        </p>

        <div className="row" style={{ alignItems: 'flex-start', gap: 24 }}>
          <div style={{ flex: '1 1 300px', minWidth: 260 }}>
            <Slider label="a (hệ số x²)" min={-3} max={3} step={0.1} value={a} onChange={setA} />
            <Slider label="b (hệ số xy)" min={-4} max={4} step={0.1} value={b} onChange={setB} />
            <Slider label="c (hệ số y²)" min={-3} max={3} step={0.1} value={c} onChange={setC} />

            <div className="panel" style={{ marginTop: 12, fontSize: 13.5 }}>
              <MathText block tex={`${f2(a)}x^2 + ${f2(b)}xy + ${f2(c)}y^2 = 1`} />
              <div
                style={{
                  padding: '8px 12px',
                  borderRadius: 8,
                  border: `1px solid ${conic.color}`,
                  color: conic.color,
                  fontWeight: 700,
                  margin: '8px 0',
                }}
              >
                {conic.name}
                <div style={{ fontSize: 12, fontWeight: 400, marginTop: 3, color: 'var(--text-muted)' }}>
                  {conic.note}
                </div>
              </div>
              <div style={{ color: 'var(--text-muted)', marginBottom: 4 }}>
                det A = <span className="mono">{f2(det)}</span> ; biệt thức b²−4ac ={' '}
                <span className="mono">{f2(disc)}</span>
              </div>
              <div style={{ marginBottom: 4 }}>
                Eigenvalue: <span className="mono" style={{ color: 'var(--vec-3)' }}>λ₁={f2(l1)}</span>,{' '}
                <span className="mono" style={{ color: 'var(--vec-1)' }}>λ₂={f2(l2)}</span>
              </div>
              <div style={{ color: 'var(--text-muted)', fontSize: 12.5 }}>
                Dạng chính tắc: <span className="mono">{f2(l1)}u² + {f2(l2)}v² = 1</span>
                {det > 1e-6 && (a > 0 || c > 0) && (
                  <> ; bán trục {semi(l1)} và {semi(l2)}</>
                )}
              </div>
            </div>
          </div>
          <div style={{ flex: '2 1 340px', minWidth: 300 }}>
            <Canvas2D height={420} range={4} vectors={eigenVecs}>
              <Contours A={A} levels={LEVEL1} />
              <AxisLine d={[v1[0], v1[1]]} color="var(--vec-3)" dashed />
              <AxisLine d={[v2[0], v2[1]]} color="var(--vec-1)" dashed />
            </Canvas2D>
            <p className="dim" style={{ fontSize: 12 }}>
              Trục chính luôn vuông góc và nằm đúng theo hai trục đối xứng của conic — dù
              phương trình có số hạng <MathText tex="xy" /> làm nó nghiêng.
            </p>
          </div>
        </div>
      </Section>

      <Section kind="theory" title="Principal axes theorem — xoay để khử số hạng chéo">
        <p>
          Đường bậc hai (tâm ở gốc) <MathText tex="ax^2+bxy+cy^2=1" /> viết gọn thành{' '}
          <MathText tex="x^{\top}Ax=1" /> với{' '}
          <MathText tex="A=\begin{bmatrix} a & b/2 \\ b/2 & c \end{bmatrix}" />. Số hạng{' '}
          <MathText tex="bxy" /> chính là "kẻ gây nghiêng". Spectral theorem cho phép <b>xoay
          nó đi</b>: đặt <MathText tex="x=Qy" /> với <MathText tex="Q" /> trực giao gồm
          eigenvector, ta được dạng <b>chính tắc</b> (canonical form)
        </p>
        <MathText block tex="\lambda_1 u^2 + \lambda_2 v^2 = 1," />
        <p>
          không còn số hạng chéo. Đây là <b>principal axes theorem</b>: mọi conic tâm gốc đều
          có một hệ trục vuông góc (các eigenvector) mà theo đó nó thẳng thớm. Loại conic đọc
          ngay từ dấu eigenvalue (tức dấu <MathText tex="\det A = \lambda_1\lambda_2" />):
        </p>
        <ul>
          <li>
            <MathText tex="\det A>0" /> (cùng dấu): <b>ellipse</b> — nếu dương thì thực, âm thì
            rỗng. Bán trục <MathText tex="1/\sqrt{\lambda_i}" /> dọc eigenvector.
          </li>
          <li>
            <MathText tex="\det A<0" /> (trái dấu): <b>hyperbola</b>.
          </li>
          <li>
            <MathText tex="\det A=0" /> (một eigenvalue 0): suy biến — <b>cặp đường thẳng
            song song</b> (kiểu parabolic).
          </li>
        </ul>
        <p>
          Góc xoay <MathText tex="\theta" /> khử số hạng chéo thoả{' '}
          <MathText tex="\cot 2\theta = \dfrac{a-c}{b}" /> — chính là góc nghiêng của
          eigenvector mà bạn thấy trên hình.
        </p>

        <h3>Đào sâu — cùng một ý tưởng ở khắp nơi</h3>
        <ul>
          <li>
            <b>PCA (chương 6).</b> Ma trận hiệp phương sai <MathText tex="C=\tfrac1n X^{\top}X" />{' '}
            đối xứng nửa-xác-định-dương. Eigenvector của nó là các <b>trục chính</b> của đám mây
            dữ liệu; eigenvalue là phương sai theo mỗi trục. Ellipse "đám mây" chính là đường
            mức của dạng toàn phương <MathText tex="x^{\top}C x" />.
          </li>
          <li>
            <b>Tối ưu — phân loại điểm dừng.</b> Gần điểm dừng của hàm nhiều biến,{' '}
            <MathText tex="f(x)\approx f_0 + \tfrac12 x^{\top}H x" /> với Hessian{' '}
            <MathText tex="H" /> đối xứng. <MathText tex="H" /> pos-def ⇒ <b>cực tiểu</b>;
            neg-def ⇒ <b>cực đại</b>; indefinite ⇒ <b>điểm yên ngựa</b> — đúng ba loại mặt ở
            bài định dấu.
          </li>
          <li>
            <b>Cơ học.</b> Tensor quán tính (moment of inertia) là ma trận đối xứng; principal
            axes của nó là các trục quay tự nhiên của vật rắn.
          </li>
        </ul>
      </Section>

      <Section kind="steps" title="Đưa một conic nghiêng về dạng chính tắc">
        <StepByStep
          steps={[
            {
              title: 'Đề bài',
              content: (
                <div>
                  <p className="muted">Đưa conic sau về dạng chính tắc và cho biết loại:</p>
                  <MathText block tex="5x^2 + 4xy + 5y^2 = 1." />
                </div>
              ),
            },
            {
              title: 'Bước 1 — Lập ma trận đối xứng',
              content: (
                <div>
                  <MathText block tex="A=\begin{bmatrix} 5 & 2 \\ 2 & 5 \end{bmatrix}\quad(\text{hệ số }xy\text{ là }4\Rightarrow b/2=2)." />
                </div>
              ),
            },
            {
              title: 'Bước 2 — Eigenvalue và eigenvector',
              content: (
                <div>
                  <MathText block tex="(5-\lambda)^2-4=0 \Rightarrow \lambda_1=7,\ \lambda_2=3." />
                  <MathText block tex="q_1=\tfrac{1}{\sqrt2}(1,1),\qquad q_2=\tfrac{1}{\sqrt2}(-1,1)." />
                </div>
              ),
            },
            {
              title: 'Bước 3 — Dạng chính tắc & bán trục',
              content: (
                <div>
                  <MathText block tex="7u^2 + 3v^2 = 1." />
                  <p className="muted">
                    Cả hai eigenvalue dương ⇒ <b>ellipse</b>. Bán trục{' '}
                    <MathText tex="1/\sqrt7\approx0.378" /> dọc <MathText tex="q_1=(1,1)" /> và{' '}
                    <MathText tex="1/\sqrt3\approx0.577" /> dọc <MathText tex="q_2=(-1,1)" />.
                    Trục dài hơn ứng với eigenvalue nhỏ hơn (λ₂=3).
                  </p>
                </div>
              ),
            },
          ]}
        />
      </Section>

      <Section kind="quiz" title="Kiểm tra hiểu">
        <Quiz
          lessonKey="ch9/conic"
          questions={[
            {
              q: <>Conic <MathText tex="ax^2+bxy+cy^2=1" /> là ellipse (thực) khi nào?</>,
              options: [
                <>Khi <MathText tex="\det A=ac-b^2/4>0" /> và A xác định dương (hai eigenvalue dương)</>,
                <>Khi <MathText tex="\det A<0" /></>,
                <>Khi <MathText tex="b=0" /> bất kể a, c</>,
                <>Khi <MathText tex="a=c" /></>,
              ],
              answer: 0,
              explain: (
                <>
                  Hai eigenvalue cùng dấu (det&gt;0) cho ellipse; cả hai dương thì{' '}
                  <MathText tex="q=1" /> có nghiệm thực. Trái dấu (det&lt;0) là hyperbola.
                </>
              ),
            },
            {
              q: <>Mục đích của việc "xoay về trục chính" (principal axes) là gì?</>,
              options: [
                <>Khử số hạng <MathText tex="xy" /> để đưa về dạng chính tắc <MathText tex="\lambda_1 u^2+\lambda_2 v^2=1" /></>,
                <>Làm cho ma trận không còn đối xứng</>,
                <>Đổi ellipse thành đường tròn luôn</>,
                <>Làm eigenvalue bằng nhau</>,
              ],
              answer: 0,
              explain: (
                <>
                  Đổi biến <MathText tex="x=Qy" /> theo eigenvector khử hết số hạng chéo, để
                  đọc trực tiếp loại và bán trục của conic.
                </>
              ),
            },
            {
              q: (
                <>
                  Với conic <MathText tex="4u^2+9v^2=1" /> (đã ở dạng chính tắc), bán trục theo
                  hướng u và v lần lượt là?
                </>
              ),
              options: [
                <><MathText tex="1/2" /> và <MathText tex="1/3" /> (bằng <MathText tex="1/\sqrt{\lambda}" />)</>,
                <><MathText tex="4" /> và <MathText tex="9" /></>,
                <><MathText tex="2" /> và <MathText tex="3" /></>,
                <><MathText tex="1/4" /> và <MathText tex="1/9" /></>,
              ],
              answer: 0,
              explain: (
                <>
                  Đặt <MathText tex="v=0" /> ⇒ <MathText tex="4u^2=1\Rightarrow u=1/2" />; tương
                  tự <MathText tex="v=1/3" />. Tổng quát bán trục là{' '}
                  <MathText tex="1/\sqrt{\lambda}" />.
                </>
              ),
            },
            {
              q: <>Trong tối ưu, nếu Hessian H tại điểm dừng là indefinite thì điểm đó là?</>,
              options: [
                <>Điểm yên ngựa (saddle) — không phải cực trị</>,
                <>Cực tiểu địa phương</>,
                <>Cực đại địa phương</>,
                <>Luôn là điểm uốn</>,
              ],
              answer: 0,
              explain: (
                <>
                  Indefinite ⇒ có hướng đi lên và hướng đi xuống ⇒ mặt yên ngựa, không cực trị.
                  Pos-def ⇒ cực tiểu; neg-def ⇒ cực đại.
                </>
              ),
            },
          ]}
        />
      </Section>
    </Lesson>
  );
}
