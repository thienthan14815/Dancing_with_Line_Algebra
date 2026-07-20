import { useState } from 'react';
import { Lesson, Section } from '../../components/Lesson';
import MathText from '../../components/MathText';
import Canvas2D, { type V2 } from '../../components/Canvas2D';
import MatrixInput from '../../components/MatrixInput';
import StepByStep from '../../components/StepByStep';
import Quiz from '../../components/Quiz';
import { eigen2x2, matVec, norm, type Mat } from '../../lib/linalg';
import { f2 } from './util';

const FIB: Mat = [
  [1, 1],
  [1, 0],
];

const PRESETS: { label: string; m: Mat }[] = [
  { label: 'Fibonacci [[1,1],[1,0]]', m: FIB },
  { label: 'Đối xứng [[2,1],[1,2]]', m: [[2, 1], [1, 2]] },
  { label: 'Co giãn [[1.5,0],[0,0.8]]', m: [[1.5, 0], [0, 0.8]] },
];

function isFib(M: Mat): boolean {
  return M[0][0] === 1 && M[0][1] === 1 && M[1][0] === 1 && M[1][1] === 0;
}

export default function Lesson5Powers() {
  const [M, setM] = useState<Mat>(FIB);
  const [x0, setX0] = useState({ x: 1, y: 0 });
  const [steps, setSteps] = useState(5);

  // Sinh quỹ đạo x0, Ax0, A²x0, …
  const traj: number[][] = [[x0.x, x0.y]];
  for (let i = 0; i < steps; i++) {
    traj.push(matVec(M, traj[traj.length - 1]));
  }

  const maxAbs = Math.max(1, ...traj.flatMap((p) => [Math.abs(p[0]), Math.abs(p[1])]));
  const range = Math.max(2, Math.ceil(maxAbs * 1.15));

  const eig = eigen2x2(M);
  const l1 = eig.complex ? 0 : eig.values[0];
  const l2 = eig.complex ? 0 : eig.values[1];
  const e1 = eig.complex ? [1, 0] : eig.vectors[0];

  const points = traj.map((p, i) => ({
    x: p[0],
    y: p[1],
    color: 'var(--vec-result)',
    label: i === traj.length - 1 && steps > 0 ? `A${steps === 1 ? '' : superscript(steps)}x₀` : '',
  }));

  const segments = traj.slice(0, -1).map((p, i) => ({
    from: [p[0], p[1]] as [number, number],
    to: [traj[i + 1][0], traj[i + 1][1]] as [number, number],
    color: 'var(--accent)',
  }));

  const vectors: V2[] = [
    { id: 'x0', x: x0.x, y: x0.y, color: 'var(--vec-1)', label: 'x₀', draggable: true },
  ];

  const lines = eig.complex
    ? []
    : [{ a: -e1[1], b: e1[0], c: 0, color: 'var(--vec-3)' as const, label: `hướng λ₁=${f2(l1)}` }];

  // Bảng số: thành phần & tỉ số chuẩn liên tiếp
  const ratios = traj.slice(1).map((p, i) => {
    const prev = norm(traj[i]);
    return prev > 1e-9 ? norm(p) / prev : 0;
  });
  return (
    <Lesson id="ch5-powers" title="Lũy thừa ma trận & Fibonacci">
      <p className="muted">
        Điều gì xảy ra khi ta áp cùng một ma trận <b>lặp đi lặp lại</b>:{' '}
        <MathText tex="x_0,\ Ax_0,\ A^2x_0,\ \dots" />? Với eigenvector, câu trả lời trở
        nên đẹp đến bất ngờ — và nó giải thích cả dãy Fibonacci lẫn tỉ lệ vàng.
      </p>

      <Section kind="explore" title="Bấm áp A nhiều lần, xem quỹ đạo bám về hướng riêng">
        <p className="muted" style={{ marginTop: 0 }}>
          <b>Nhiệm vụ:</b> Kéo điểm xuất phát{' '}
          <span style={{ color: 'var(--vec-1)' }}>x₀</span> rồi bấm <b>"Áp A"</b> nhiều
          lần. Quan sát chuỗi điểm <span style={{ color: 'var(--vec-result)' }}>hồng</span>{' '}
          càng lúc càng <b>bám sát đường</b>{' '}
          <span style={{ color: 'var(--vec-3)' }}>hướng eigenvector λ lớn nhất</span> — dù
          bạn xuất phát từ đâu (miễn không nằm đúng hướng λ nhỏ).
        </p>

        <div className="row" style={{ alignItems: 'flex-start', gap: 24 }}>
          <div style={{ flex: '1 1 300px', minWidth: 260 }}>
            <MatrixInput value={M} onChange={setM} presets={PRESETS} />
            <div className="row" style={{ marginTop: 12, gap: 8 }}>
              <button className="btn btn-primary" onClick={() => setSteps((s) => Math.min(12, s + 1))} disabled={steps >= 12}>
                Áp A ▶
              </button>
              <button className="btn" onClick={() => setSteps(0)}>⟲ Reset</button>
            </div>

            <div className="panel" style={{ marginTop: 14, fontSize: 13 }}>
              <div style={{ color: 'var(--text-muted)', marginBottom: 6 }}>
                λ₁ = <b style={{ color: 'var(--vec-3)' }}>{eig.complex ? 'phức' : f2(l1)}</b>
                {!eig.complex && (
                  <>
                    {'  '}λ₂ = <b>{f2(l2)}</b>
                  </>
                )}
              </div>
              <div style={{ maxHeight: 150, overflowY: 'auto', fontFamily: 'var(--font-mono)', fontSize: 12.5 }}>
                {traj.map((p, i) => (
                  <div key={i} style={{ opacity: 0.55 + (0.45 * i) / Math.max(1, traj.length - 1) }}>
                    A{superscript(i)}x₀ = ({f2(p[0])}, {f2(p[1])})
                    {i > 0 && (
                      <span style={{ color: 'var(--accent)' }}>
                        {'  '}·|·|/trước = {f2(ratios[i - 1])}
                      </span>
                    )}
                  </div>
                ))}
              </div>
              {isFib(M) && (
                <div style={{ marginTop: 8, color: 'var(--warn)', fontSize: 12.5 }}>
                  💡 Với x₀ = (1,0), thành phần đầu chạy đúng dãy Fibonacci{' '}
                  <b>1, 1, 2, 3, 5, 8, 13…</b> Tỉ số hai số liên tiếp hội tụ về{' '}
                  <MathText tex="\varphi \approx 1.618" /> = λ₁.
                </div>
              )}
            </div>
          </div>
          <div style={{ flex: '2 1 340px', minWidth: 300 }}>
            <Canvas2D
              height={420}
              range={range}
              vectors={vectors}
              points={points}
              segments={segments}
              lines={lines}
              onVectorChange={(id, x, y) => id === 'x0' && setX0({ x, y })}
            />
            <p className="dim" style={{ fontSize: 12 }}>
              Khung nhìn tự co giãn theo quỹ đạo (range = {range}). Tỉ số |·|/trước tiến dần
              về |λ₁| = {eig.complex ? '—' : f2(Math.abs(l1))}.
            </p>
          </div>
        </div>
      </Section>

      <Section kind="theory" title="Vì sao λ lớn nhất thống trị">
        <p>
          Tách <MathText tex="x_0" /> theo cơ sở eigenvector:{' '}
          <MathText tex="x_0 = c_1 v_1 + c_2 v_2" />. Vì mỗi lần áp A chỉ nhân từng thành
          phần với eigenvalue của nó, sau <MathText tex="n" /> lần:
        </p>
        <MathText block tex="A^n x_0 = c_1\,\lambda_1^{\,n}\,v_1 + c_2\,\lambda_2^{\,n}\,v_2" />
        <p>
          Đây là lợi ích khổng lồ của chéo hóa: <b>lũy thừa ma trận biến thành lũy thừa
          các con số</b> <MathText tex="\lambda^n" /> — khỏi nhân ma trận n lần. Nếu{' '}
          <MathText tex="|\lambda_1| > |\lambda_2|" /> thì khi <MathText tex="n" /> lớn,{' '}
          <MathText tex="\lambda_1^n" /> vượt trội hẳn <MathText tex="\lambda_2^n" />, nên:
        </p>
        <MathText block tex="A^n x_0 \approx c_1\,\lambda_1^{\,n}\,v_1 \quad (n \text{ lớn})" />
        <p>
          Quỹ đạo vì thế <b>duỗi thẳng về hướng</b> <MathText tex="v_1" /> — đúng như bạn
          thấy. Tỉ số độ dài giữa hai bước liên tiếp tiến về{' '}
          <MathText tex="|\lambda_1|" />.
        </p>
        <p>
          <b>Fibonacci.</b> Đặt <MathText tex="x_n = (F_{n+1}, F_n)" />. Vì{' '}
          <MathText tex="F_{n+1} = F_n + F_{n-1}" />, ta có{' '}
          <MathText tex="x_{n} = \begin{bmatrix}1&1\\1&0\end{bmatrix} x_{n-1}" />. Ma trận
          này có <MathText tex="\lambda_1 = \varphi = \tfrac{1+\sqrt5}{2}" /> và{' '}
          <MathText tex="\lambda_2 = \tfrac{1-\sqrt5}{2}" />. Từ đó ra <b>công thức Binet</b>:
        </p>
        <MathText block tex="F_n = \frac{\varphi^{\,n} - (1-\varphi)^{\,n}}{\sqrt5}" />
        <p className="muted">
          Vì <MathText tex="|1-\varphi| < 1" /> nên số hạng thứ hai tắt dần; tỉ số{' '}
          <MathText tex="F_{n+1}/F_n \to \varphi" />. Ý tưởng "áp một ma trận lặp lại" còn
          là trái tim của <b>hệ động lực</b> và <b>Markov chain</b> — nơi <MathText tex="\lambda_1" />
          quyết định trạng thái ổn định lâu dài (chính là PageRank ở chương 7).
        </p>
      </Section>

      <Section kind="steps" title="Tính A²x₀ bằng phân rã eigen thay vì nhân trực tiếp">
        <p className="muted">
          Lấy <MathText tex="A=\begin{bmatrix}2&1\\1&2\end{bmatrix}" /> (λ₁=3, v₁=(1,1); λ₂=1, v₂=(−1,1)) và{' '}
          <MathText tex="x_0=(1,0)" />.
        </p>
        <StepByStep
          steps={[
            {
              title: 'Bước 1 — Phân rã x₀ theo eigenvector',
              content: (
                <div>
                  <MathText block tex="x_0 = (1,0) = \tfrac12 v_1 - \tfrac12 v_2 = \tfrac12(1,1) - \tfrac12(-1,1)" />
                  <p className="muted">Giải hệ để tìm c₁ = ½, c₂ = −½.</p>
                </div>
              ),
            },
            {
              title: 'Bước 2 — Mỗi thành phần nhân λ²',
              content: (
                <MathText block tex="A^2 x_0 = c_1\lambda_1^2 v_1 + c_2\lambda_2^2 v_2 = \tfrac12\cdot 3^2\, v_1 - \tfrac12\cdot 1^2\, v_2" />
              ),
            },
            {
              title: 'Bước 3 — Thay số',
              content: (
                <MathText block tex="= \tfrac{9}{2}(1,1) - \tfrac12(-1,1) = (4.5, 4.5) - (-0.5, 0.5)" />
              ),
            },
            {
              title: 'Bước 4 — Cộng lại và đối chiếu',
              content: (
                <div>
                  <MathText block tex="A^2 x_0 = (5, 4)" />
                  <p className="muted">
                    Kiểm tra trực tiếp: <MathText tex="A x_0 = (2,1)" />, rồi{' '}
                    <MathText tex="A(2,1) = (5,4)" /> — khớp! Với n lớn, cách phân rã này rẻ hơn
                    nhiều so với nhân ma trận n lần.
                  </p>
                </div>
              ),
            },
          ]}
        />
      </Section>

      <Section kind="quiz" title="Kiểm tra hiểu">
        <Quiz
          lessonKey="ch5/powers"
          questions={[
            {
              q: <>Công thức <MathText tex="A^n x_0 = c_1\lambda_1^n v_1 + c_2\lambda_2^n v_2" /> có được nhờ đâu?</>,
              options: [
                <>Phân rã x₀ theo eigenvector; mỗi lần áp A nhân thành phần với λ của nó</>,
                <>Nhờ định lý Pythagoras</>,
                <>Vì mọi eigenvalue đều bằng nhau</>,
                <>Vì A luôn là ma trận identity</>,
              ],
              answer: 0,
              explain: (
                <>
                  <MathText tex="A^n v_i = \lambda_i^n v_i" />. Áp cho từng thành phần của
                  <MathText tex="x_0 = c_1 v_1 + c_2 v_2" /> rồi cộng lại.
                </>
              ),
            },
            {
              q: <>Khi n lớn, quỹ đạo <MathText tex="A^n x_0" /> tiến về hướng nào?</>,
              options: [
                <>Hướng eigenvector ứng với |λ| lớn nhất</>,
                <>Hướng eigenvector ứng với |λ| nhỏ nhất</>,
                <>Luôn về gốc tọa độ</>,
                <>Xoay tròn mãi mãi</>,
              ],
              answer: 0,
              explain: (
                <>
                  <MathText tex="\lambda_1^n" /> lớn hơn hẳn các số hạng khác, nên thành phần{' '}
                  <MathText tex="v_1" /> chi phối và quỹ đạo bám về hướng đó.
                </>
              ),
            },
            {
              q: <>Tỉ số Fibonacci <MathText tex="F_{n+1}/F_n" /> hội tụ về số nào, và vì sao?</>,
              options: [
                <><MathText tex="\varphi \approx 1.618" /> — chính là λ₁ của ma trận [[1,1],[1,0]]</>,
                <>Số 1, vì dãy dừng lại</>,
                <>Số 2, vì mỗi số gấp đôi</>,
                <>Số 0, vì dãy tắt dần</>,
              ],
              answer: 0,
              explain: (
                <>
                  Ma trận Fibonacci có eigenvalue lớn nhất là <MathText tex="\varphi" />, và tỉ
                  số hai bước liên tiếp của một quỹ đạo lũy thừa tiến về |λ₁|.
                </>
              ),
            },
            {
              q: <>Vì sao dùng eigen để tính <MathText tex="A^{100}x_0" /> nhanh hơn nhân trực tiếp?</>,
              options: [
                <>Chỉ cần lũy thừa các số λ¹⁰⁰ rồi tổ hợp lại, thay vì nhân ma trận 100 lần</>,
                <>Vì A¹⁰⁰ luôn bằng A</>,
                <>Vì eigenvalue luôn bằng 1</>,
                <>Không nhanh hơn, chỉ khác cách viết</>,
              ],
              answer: 0,
              explain: (
                <>
                  <MathText tex="A^{100} = P D^{100} P^{-1}" /> với{' '}
                  <MathText tex="D^{100}" /> chỉ là lũy thừa các số trên đường chéo — cực rẻ.
                </>
              ),
            },
          ]}
        />
      </Section>
    </Lesson>
  );
}

// Chỉ số mũ dạng ký tự Unicode nhỏ cho nhãn (0–12).
function superscript(n: number): string {
  const map = '⁰¹²³⁴⁵⁶⁷⁸⁹';
  return String(n)
    .split('')
    .map((d) => map[Number(d)])
    .join('');
}
