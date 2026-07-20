import { useEffect, useRef, useState } from 'react';
import { Lesson, Section } from '../../components/Lesson';
import MathText from '../../components/MathText';
import Canvas2D, { type V2 } from '../../components/Canvas2D';
import MatrixInput from '../../components/MatrixInput';
import StepByStep from '../../components/StepByStep';
import Quiz from '../../components/Quiz';
import { eigen2x2, inverse, matVec, lerp, type Mat } from '../../lib/linalg';
import { f2 } from './util';

const PRESETS: { label: string; m: Mat }[] = [
  { label: 'Đối xứng [[2,1],[1,2]]', m: [[2, 1], [1, 2]] },
  { label: 'Kéo dọc trục [[3,0],[0,1]]', m: [[3, 0], [0, 1]] },
  { label: 'λ trùng: 2·I', m: [[2, 0], [0, 2]] },
  { label: 'Shear (defective)', m: [[1, 1], [0, 1]] },
];

type EigCase = 'normal' | 'scalar' | 'defective' | 'complex';

function classify(M: Mat): EigCase {
  const b = M[0][1];
  const c = M[1][0];
  const a = M[0][0];
  const d = M[1][1];
  const eig = eigen2x2(M);
  if (eig.complex) return 'complex';
  if (Math.abs(b) < 1e-9 && Math.abs(c) < 1e-9 && Math.abs(a - d) < 1e-9) return 'scalar';
  const [v1, v2] = eig.vectors;
  const cross = v1[0] * v2[1] - v1[1] * v2[0];
  if (Math.abs(cross) < 1e-6) return 'defective';
  return 'normal';
}

export default function Lesson3Eigenspace() {
  const [M, setM] = useState<Mat>([
    [2, 1],
    [1, 2],
  ]);
  const [v, setV] = useState({ x: 3, y: 0.5 });
  const [t, setT] = useState(0); // 0 = chưa áp A, 1 = đã áp A
  const rafRef = useRef<number | null>(null);

  const kind = classify(M);
  const eig = eigen2x2(M);
  const [l1, l2] = eig.complex ? [0, 0] : eig.values;
  const [e1, e2] = eig.complex ? [[1, 0], [0, 1]] : eig.vectors;

  // Animation áp A: t chạy 0 → 1
  const animate = (dir: 1 | -1) => {
    if (rafRef.current) cancelAnimationFrame(rafRef.current);
    const start = performance.now();
    const from = dir === 1 ? 0 : 1;
    const to = dir === 1 ? 1 : 0;
    const tick = (now: number) => {
      const p = Math.min(1, (now - start) / 700);
      const e = p < 0.5 ? 2 * p * p : 1 - Math.pow(-2 * p + 2, 2) / 2;
      setT(lerp(from, to, e));
      if (p < 1) rafRef.current = requestAnimationFrame(tick);
    };
    rafRef.current = requestAnimationFrame(tick);
  };
  useEffect(() => () => {
    if (rafRef.current) cancelAnimationFrame(rafRef.current);
  }, []);
  // Đổi ma trận / kéo v thì đưa về trạng thái chưa áp
  useEffect(() => {
    setT(0);
  }, [M, v.x, v.y]);

  // Phân rã v = c1 e1 + c2 e2 (chỉ khi hai eigenvector độc lập)
  let c1 = 0;
  let c2 = 0;
  const decomposable = kind === 'normal';
  if (decomposable) {
    const P: Mat = [
      [e1[0], e2[0]],
      [e1[1], e2[1]],
    ];
    const Pinv = inverse(P);
    if (Pinv) {
      const cc = matVec(Pinv, [v.x, v.y]);
      c1 = cc[0];
      c2 = cc[1];
    }
  }

  // Hệ số co giãn hiện tại theo t (1 → λ)
  const f1 = lerp(1, l1, t);
  const f2v = lerp(1, l2, t);
  const comp1 = [c1 * f1 * e1[0], c1 * f1 * e1[1]];
  const comp2 = [c2 * f2v * e2[0], c2 * f2v * e2[1]];
  const tip = [comp1[0] + comp2[0], comp1[1] + comp2[1]];

  // Đường eigenspace (qua gốc theo eigenvector): dạng −ey·x + ex·y = 0
  const eigenLines =
    kind === 'complex'
      ? []
      : kind === 'scalar'
      ? [] // cả mặt phẳng — không vẽ đường riêng lẻ
      : kind === 'defective'
      ? [{ a: -e1[1], b: e1[0], c: 0, color: 'var(--vec-3)' as const, label: `eigenspace λ=${f2(l1)}` }]
      : [
          { a: -e1[1], b: e1[0], c: 0, color: 'var(--vec-1)' as const, label: `λ₁=${f2(l1)}` },
          { a: -e2[1], b: e2[0], c: 0, color: 'var(--vec-2)' as const, label: `λ₂=${f2(l2)}` },
        ];

  // Vẽ vector: v gốc (mờ) + vector hiện tại (theo t)
  const vectors: V2[] = [
    { id: 'v', x: v.x, y: v.y, color: 'var(--text-dim)', label: t < 0.02 ? 'v' : '', draggable: true },
    { id: 'tip', x: tip[0], y: tip[1], color: 'var(--vec-result)', label: t > 0.02 ? 'Av' : '' },
  ];

  // Hai đoạn phân rã (dashed) tạo hình bình hành từ gốc → comp1 → tip
  const segments = decomposable
    ? [
        { from: [0, 0] as [number, number], to: comp1 as [number, number], color: 'var(--vec-1)', dashed: true, label: 'c₁v₁' },
        { from: comp1 as [number, number], to: tip as [number, number], color: 'var(--vec-2)', dashed: true, label: 'c₂v₂' },
      ]
    : [];

  return (
    <Lesson id="ch5-eigenspace" title="Eigenspace">
      <p className="muted">
        Mỗi eigenvalue không chỉ đi kèm một eigenvector duy nhất, mà cả một{' '}
        <b>đường thẳng</b> (thậm chí cả mặt phẳng) toàn eigenvector. Tập hợp đó gọi là
        <b> eigenspace</b>. Và eigenspace cho ta một cách nhìn mới, cực mạnh: phân rã
        mọi vector theo các hướng riêng.
      </p>

      <Section kind="explore" title="Phân rã v theo hai hướng riêng, rồi áp A">
        <p className="muted" style={{ marginTop: 0 }}>
          <b>Nhiệm vụ:</b> Kéo <span style={{ color: 'var(--vec-result)' }}>v</span> bất
          kỳ. Ta tách nó thành hai mảnh dọc theo{' '}
          <span style={{ color: 'var(--vec-1)' }}>eigenspace λ₁</span> và{' '}
          <span style={{ color: 'var(--vec-2)' }}>eigenspace λ₂</span> (hai đoạn nét
          đứt). Bấm <b>"Áp A"</b>: mỗi mảnh chỉ bị <b>giãn theo đúng λ của nó</b>, không
          xoay. Thử preset đối xứng (λ₁=3 &gt; λ₂=1) để thấy vì sao Av luôn{' '}
          <b>ngả về phía eigenvector có λ lớn hơn</b>.
        </p>

        <div className="row" style={{ alignItems: 'flex-start', gap: 24 }}>
          <div style={{ flex: '1 1 300px', minWidth: 260 }}>
            <MatrixInput value={M} onChange={setM} presets={PRESETS} />
            <div className="row" style={{ marginTop: 12, gap: 8 }}>
              <button className="btn btn-primary" onClick={() => animate(1)} disabled={!decomposable || t > 0.98}>
                Áp A ▶
              </button>
              <button className="btn" onClick={() => animate(-1)} disabled={t < 0.02}>
                ⟲ Về v
              </button>
            </div>

            <div className="panel" style={{ marginTop: 14, fontSize: 13.5 }}>
              {kind === 'normal' && (
                <>
                  <div style={{ color: 'var(--vec-1)' }}>
                    v₁ = ({f2(e1[0])}, {f2(e1[1])}), λ₁ = <b>{f2(l1)}</b>
                  </div>
                  <div style={{ color: 'var(--vec-2)', marginBottom: 8 }}>
                    v₂ = ({f2(e2[0])}, {f2(e2[1])}), λ₂ = <b>{f2(l2)}</b>
                  </div>
                  <div style={{ color: 'var(--text-muted)' }}>
                    v = <span className="mono">{f2(c1)}·v₁ {c2 >= 0 ? '+' : '−'} {f2(Math.abs(c2))}·v₂</span>
                  </div>
                  <div style={{ color: 'var(--vec-result)', marginTop: 4 }}>
                    Av = <span className="mono">{f2(c1 * l1)}·v₁ {c2 * l2 >= 0 ? '+' : '−'} {f2(Math.abs(c2 * l2))}·v₂</span>
                  </div>
                </>
              )}
              {kind === 'scalar' && (
                <div style={{ color: 'var(--warn)' }}>
                  λ trùng nhau ({f2(l1)}) và A = λI: <b>MỌI</b> vector đều là eigenvector.
                  Cả mặt phẳng là một eigenspace duy nhất — không có hai hướng phân biệt để tách.
                </div>
              )}
              {kind === 'defective' && (
                <div style={{ color: 'var(--warn)' }}>
                  λ trùng ({f2(l1)}) nhưng <b>chỉ có một đường eigenspace</b> (ma trận
                  <b> defective</b>). Không đủ hai hướng riêng độc lập để phân rã mọi vector.
                </div>
              )}
              {kind === 'complex' && (
                <div style={{ color: 'var(--bad)' }}>
                  Ma trận này có eigenvalue phức — không có eigenspace thực. Hãy chọn một preset khác.
                </div>
              )}
            </div>
          </div>
          <div style={{ flex: '2 1 340px', minWidth: 300 }}>
            <Canvas2D
              height={420}
              range={6}
              vectors={vectors}
              segments={segments}
              lines={eigenLines}
              onVectorChange={(id, x, y) => id === 'v' && setV({ x, y })}
            />
          </div>
        </div>
      </Section>

      <Section kind="theory" title="Eigenspace = null space của A − λI">
        <p>
          Cố định một eigenvalue <MathText tex="\lambda" />. Tập hợp tất cả các vector{' '}
          <MathText tex="v" /> thỏa <MathText tex="Av = \lambda v" />, cộng thêm vector 0,
          chính là:
        </p>
        <MathText block tex="E_\lambda = \{\,v : (A - \lambda I)v = 0\,\} = \text{Null}(A - \lambda I)" />
        <p>
          Đây <b>chính là null space</b> của <MathText tex="A - \lambda I" /> (chương 4)!
          Và null space luôn là một <b>subspace</b>: chứa gốc 0, đóng kín với phép cộng và
          nhân vô hướng. Nên nếu <MathText tex="v" /> là eigenvector thì{' '}
          <MathText tex="2v,\ -v,\ 0{,}5v" /> cũng vậy — cả đường thẳng qua gốc đều là
          eigenvector. Đó là lý do ta vẽ <b>đường</b> chứ không phải một mũi tên.
        </p>
        <ul>
          <li>
            <b>Algebraic multiplicity</b>: số lần <MathText tex="\lambda" /> xuất hiện làm
            nghiệm của phương trình đặc trưng.
          </li>
          <li>
            <b>Geometric multiplicity</b>: số chiều của eigenspace{' '}
            <MathText tex="E_\lambda" /> (số eigenvector độc lập).
          </li>
        </ul>
        <p className="muted">
          Thường hai số này bằng nhau. Nhưng preset <b>Shear [[1,1],[0,1]]</b> là ngoại lệ:
          λ = 1 bội đại số 2, nhưng eigenspace chỉ 1 chiều (bội hình học 1). Ma trận thiếu
          eigenvector như vậy gọi là <b>defective</b> — nó sẽ không chéo hóa được ở bài sau.
          Còn <MathText tex="2I" /> thì λ = 2 bội 2 và cả mặt phẳng là eigenspace (bội hình học 2).
        </p>
      </Section>

      <Section kind="steps" title="Tìm eigenvector khi đã biết λ = 3 của [[2,1],[1,2]]">
        <StepByStep
          steps={[
            {
              title: 'Bước 1 — Lập (A − 3I)',
              content: (
                <MathText
                  block
                  tex="A - 3I = \begin{bmatrix} 2-3 & 1 \\ 1 & 2-3 \end{bmatrix} = \begin{bmatrix} -1 & 1 \\ 1 & -1 \end{bmatrix}"
                />
              ),
            },
            {
              title: 'Bước 2 — Giải (A − 3I)v = 0',
              content: (
                <div>
                  <MathText block tex="\begin{bmatrix} -1 & 1 \\ 1 & -1 \end{bmatrix}\begin{bmatrix} x \\ y \end{bmatrix} = 0 \;\Longrightarrow\; -x + y = 0" />
                  <p className="muted">
                    Hai hàng cho cùng một phương trình <MathText tex="x = y" /> — đúng như
                    kỳ vọng: A−3I suy biến nên có vô số nghiệm.
                  </p>
                </div>
              ),
            },
            {
              title: 'Bước 3 — Đọc ra eigenspace',
              content: (
                <div>
                  <MathText block tex="v = t\begin{bmatrix} 1 \\ 1 \end{bmatrix},\quad t \in \mathbb{R}" />
                  <p className="muted">
                    Eigenspace <MathText tex="E_3" /> là đường thẳng <MathText tex="y = x" />.
                    Chọn đại diện <MathText tex="v_1 = (1,1)" />.
                  </p>
                </div>
              ),
            },
            {
              title: 'Bước 4 — Làm tương tự cho λ = 1',
              content: (
                <div>
                  <MathText block tex="A - I = \begin{bmatrix} 1 & 1 \\ 1 & 1 \end{bmatrix} \Rightarrow x + y = 0 \Rightarrow v_2 = (-1, 1)" />
                  <p className="muted">
                    Eigenspace <MathText tex="E_1" /> là đường <MathText tex="y = -x" />. Hai
                    đường vuông góc — dấu hiệu của ma trận đối xứng (hé lộ chương 6).
                  </p>
                </div>
              ),
            },
          ]}
        />
      </Section>

      <Section kind="quiz" title="Kiểm tra hiểu">
        <Quiz
          lessonKey="ch5/eigenspace"
          questions={[
            {
              q: <>Eigenspace <MathText tex="E_\lambda" /> thực chất là không gian con nào?</>,
              options: [
                <>Null space của <MathText tex="A - \lambda I" /></>,
                <>Column space của <MathText tex="A" /></>,
                <>Null space của <MathText tex="A" /></>,
                <>Toàn bộ <MathText tex="\mathbb{R}^2" /> luôn luôn</>,
              ],
              answer: 0,
              explain: (
                <>
                  <MathText tex="Av=\lambda v \Leftrightarrow (A-\lambda I)v = 0" />, nên tập
                  nghiệm chính là null space của <MathText tex="A-\lambda I" />.
                </>
              ),
            },
            {
              q: <>Nếu <MathText tex="v" /> là eigenvector với eigenvalue λ, thì <MathText tex="5v" /> thì sao?</>,
              options: [
                <>Cũng là eigenvector với cùng λ (eigenspace là subspace)</>,
                <>Là eigenvector nhưng với eigenvalue 5λ</>,
                <>Không còn là eigenvector nữa</>,
                <>Trở thành vector 0</>,
              ],
              answer: 0,
              explain: (
                <>
                  <MathText tex="A(5v) = 5Av = 5\lambda v = \lambda(5v)" />. Cả đường thẳng
                  qua gốc theo v đều là eigenvector — đó là bản chất subspace.
                </>
              ),
            },
            {
              q: <>Với preset đối xứng (λ₁=3, λ₂=1), vì sao Av "ngả về" phía v₁?</>,
              options: [
                <>Vì thành phần theo v₁ được nhân 3, còn theo v₂ chỉ nhân 1 — mảnh v₁ lớn vượt lên</>,
                <>Vì v₂ biến mất hoàn toàn</>,
                <>Vì A xoay v về phía v₁</>,
                <>Vì v₁ luôn dài hơn v₂</>,
              ],
              answer: 0,
              explain: (
                <>
                  <MathText tex="Av = c_1\cdot 3\, v_1 + c_2 \cdot 1\, v_2" />. Hướng có λ lớn
                  bị kéo mạnh hơn nên chi phối kết quả — ý tưởng cốt lõi cho bài lũy thừa ma trận.
                </>
              ),
            },
            {
              q: <>Ma trận shear [[1,1],[0,1]] được gọi là "defective" vì?</>,
              options: [
                <>λ = 1 bội 2 nhưng eigenspace chỉ 1 chiều — thiếu eigenvector độc lập</>,
                <>Nó không có eigenvalue nào</>,
                <>Determinant của nó bằng 0</>,
                <>Nó có 3 eigenvalue khác nhau</>,
              ],
              answer: 0,
              explain: (
                <>
                  Bội đại số (2) &gt; bội hình học (1). Chỉ tìm được một hướng riêng{' '}
                  <MathText tex="(1,0)" />, không đủ để tạo cơ sở — nên không chéo hóa được.
                </>
              ),
            },
          ]}
        />
      </Section>
    </Lesson>
  );
}
