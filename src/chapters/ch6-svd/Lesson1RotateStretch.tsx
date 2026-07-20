import { useMemo, useState } from 'react';
import { Lesson, Section } from '../../components/Lesson';
import MathText from '../../components/MathText';
import Canvas2D, { type V2 } from '../../components/Canvas2D';
import MatrixInput from '../../components/MatrixInput';
import Quiz from '../../components/Quiz';
import { svd, transpose, matMul, type Mat } from '../../lib/linalg';
import { asM2, circlePts, mat2tex, diag2, col, f2, PRESETS_SVD } from './util';

type Stage = 'reset' | 'vt' | 'sigma' | 'u' | 'direct';

export default function Lesson1RotateStretch() {
  const [A, setA] = useState<Mat>([
    [1, 1],
    [0, 1],
  ]);
  const [stage, setStage] = useState<Stage>('reset');

  // SVD của A: A = U Σ Vᵀ
  const { U, S, V, Sigma, Vt } = useMemo(() => {
    const r = svd(A);
    const Sigma = diag2(r.S[0] ?? 0, r.S[1] ?? 0);
    const Vt = transpose(r.V);
    return { U: r.U, S: r.S, V: r.V, Sigma, Vt };
  }, [A]);

  // Ma trận tích lũy tại mỗi nhịp (ánh xạ từ tọa độ gốc)
  const stageMat: Mat = useMemo(() => {
    switch (stage) {
      case 'reset':
        return [
          [1, 0],
          [0, 1],
        ];
      case 'vt':
        return Vt;
      case 'sigma':
        return matMul(Sigma, Vt);
      case 'u':
      case 'direct':
        return matMul(U, matMul(Sigma, Vt)); // = A
      default:
        return A;
    }
  }, [stage, U, Sigma, Vt, A]);

  // v₁, v₂ = cột của V (hai hướng input trực chuẩn) — sẽ được lưới biến đổi cuốn theo.
  const v1 = col(V, 0);
  const v2 = col(V, 1);
  const vectors: V2[] = [
    { id: 'v1', x: v1[0], y: v1[1], color: 'var(--vec-1)', label: 'v₁' },
    { id: 'v2', x: v2[0], y: v2[1], color: 'var(--vec-2)', label: 'v₂' },
  ];

  const caption: Record<Stage, string> = {
    reset: 'Bắt đầu: hình tròn đơn vị, hai hướng v₁ ⟂ v₂.',
    vt: 'Sau Vᵀ: một phép trực giao (xoay hoặc đối xứng) — hình tròn VẪN tròn, độ dài được bảo toàn.',
    sigma: 'Sau Σ: co giãn dọc theo hai trục toạ độ → ellipse có trục nằm thẳng theo Ox, Oy.',
    u: 'Sau U: xoay lần cuối → ellipse nghiêng. Đây chính là ảnh của A.',
    direct: 'Áp thẳng A một phát: kết quả TRÙNG KHÍT với đường đi 3 nhịp ở trên!',
  };

  const btn = (s: Stage, label: string) => (
    <button
      className={`btn ${stage === s ? 'btn-primary' : ''}`}
      onClick={() => setStage(s)}
    >
      {label}
    </button>
  );

  return (
    <Lesson id="ch6-rotate-stretch" title="Xoay – Co giãn – Xoay">
      <p className="muted">
        Có một sự thật đẹp đến khó tin: <b>mọi</b> ma trận — vuông hay không, đối xứng
        hay không, thậm chí suy biến — đều có thể tách thành đúng ba động tác đơn giản:{' '}
        <b>xoay</b>, rồi <b>co giãn theo trục</b>, rồi <b>xoay</b> lần nữa. Đó là{' '}
        <b>Singular Value Decomposition</b> (SVD): <MathText tex="A = U\Sigma V^{T}" />.
      </p>

      <Section kind="explore" title="Trình chiếu ba nhịp của A">
        <p className="muted" style={{ marginTop: 0 }}>
          <b>Gợi ý thao tác:</b> Chọn một ma trận (thử cả <i>Shear</i>, <i>Suy biến</i>,
          hay gõ ma trận bất kỳ). Bấm lần lượt <b>Reset → Áp Vᵀ → Áp Σ → Áp U</b> và
          theo dõi hình tròn đơn vị: nó tròn → vẫn tròn → ellipse trục thẳng → ellipse
          nghiêng. Cuối cùng bấm <b>Áp thẳng A</b> để thấy hai con đường về cùng một
          đích.
        </p>

        <div className="row" style={{ alignItems: 'flex-start', gap: 24 }}>
          <div style={{ flex: '1 1 300px', minWidth: 260 }}>
            <MatrixInput value={A} onChange={(m) => { setA(m); setStage('reset'); }} presets={PRESETS_SVD} />

            <div className="row" style={{ marginTop: 14, gap: 8 }}>
              {btn('reset', '↺ Reset')}
              {btn('vt', '① Áp Vᵀ')}
              {btn('sigma', '② Áp Σ')}
              {btn('u', '③ Áp U')}
            </div>
            <div className="row" style={{ marginTop: 8, gap: 8 }}>
              {btn('direct', 'Áp thẳng A (so sánh)')}
            </div>

            <div className="panel" style={{ marginTop: 14, fontSize: 13.5 }}>
              <div style={{ marginBottom: 6 }}>
                Singular values:{' '}
                <span className="mono" style={{ color: 'var(--accent)' }}>
                  σ₁ = {f2(S[0] ?? 0)}, σ₂ = {f2(S[1] ?? 0)}
                </span>
              </div>
              <div style={{ color: 'var(--text-muted)' }}>{caption[stage]}</div>
            </div>
          </div>

          <div style={{ flex: '2 1 360px', minWidth: 300 }}>
            <Canvas2D
              height={420}
              range={4}
              matrix={asM2(stageMat)}
              vectors={vectors}
              polygons={[
                {
                  points: circlePts(64),
                  fill: 'var(--accent-2)',
                  opacity: 0.14,
                  stroke: 'var(--accent-2)',
                },
              ]}
            />
          </div>
        </div>
      </Section>

      <Section kind="theory" title="A = UΣVᵀ với con số cụ thể">
        <p>
          Với ma trận bạn đang chọn, thư viện tính ra ba mảnh sau (làm tròn 2 chữ số):
        </p>
        <MathText
          block
          tex={`A = ${mat2tex(A)} = \\underbrace{${mat2tex(U)}}_{U\\ (\\text{xoay})}\\; \\underbrace{${mat2tex(Sigma)}}_{\\Sigma\\ (\\text{co giãn})}\\; \\underbrace{${mat2tex(Vt)}}_{V^{T}\\ (\\text{xoay})}`}
        />
        <p>
          Đọc từ phải sang trái đúng theo thứ tự tác động lên một vector:
        </p>
        <ul>
          <li>
            <b><MathText tex="V^{T}" /></b> — ma trận <b>trực giao</b> (orthogonal):
            các cột trực chuẩn, <MathText tex="V^{T}V = I" />. Nó chỉ <b>xoay/đối xứng</b>,
            không làm méo — đường tròn vẫn tròn.
          </li>
          <li>
            <b><MathText tex="\Sigma" /></b> — ma trận <b>đường chéo</b> với các{' '}
            <b>singular value</b> <MathText tex="\sigma_1 \ge \sigma_2 \ge \dots \ge 0" />.
            Đây là bước duy nhất làm <b>co giãn</b>, và chỉ theo các trục toạ độ.
          </li>
          <li>
            <b><MathText tex="U" /></b> — lại một ma trận trực giao, <b>xoay</b> ellipse
            trục-thẳng về đúng vị trí cuối cùng.
          </li>
        </ul>

        <p style={{ marginTop: 16 }}>
          <b>Vì sao điều này lớn lao?</b> Ở chương 5, chỉ những ma trận “đẹp” mới
          diagonalize được thành <MathText tex="A = PDP^{-1}" /> — và <MathText tex="P" />{' '}
          thường <i>không</i> trực giao, eigenvalue có thể là số phức, ma trận không
          vuông thì chịu. SVD thì <b>không kén chọn</b>:
        </p>
        <ul>
          <li>Áp dụng cho <b>mọi</b> ma trận <MathText tex="m\times n" /> (kể cả chữ nhật).</li>
          <li>
            Hai ma trận xoay <MathText tex="U, V" /> luôn <b>trực giao thật sự</b> (nghịch
            đảo = chuyển vị), và các <MathText tex="\sigma_i" /> luôn là số <b>thực không âm</b>.
          </li>
          <li>
            Ma trận suy biến chỉ đơn giản là có <MathText tex="\sigma_i = 0" /> — không có
            gì phải “sợ”.
          </li>
        </ul>
        <p className="muted">
          Nói gọn: <b>diagonalization</b> hỏi “có hướng nào A chỉ kéo giãn không?” và đôi
          khi câu trả lời là không. <b>SVD</b> hỏi “A biến hình tròn thành ellipse như thế
          nào?” — và câu trả lời <i>luôn</i> tồn tại.
        </p>
      </Section>

      <Section kind="quiz" title="Kiểm tra hiểu">
        <Quiz
          lessonKey="ch6/rotate-stretch"
          questions={[
            {
              q: <>Trong <MathText tex="A = U\Sigma V^{T}" />, phần nào chịu trách nhiệm <b>co giãn</b>?</>,
              options: [
                <>Ma trận đường chéo <MathText tex="\Sigma" /></>,
                <>Ma trận <MathText tex="U" /></>,
                <>Ma trận <MathText tex="V^{T}" /></>,
                <>Cả ba đều co giãn như nhau</>,
              ],
              answer: 0,
              explain: (
                <>
                  <MathText tex="U" /> và <MathText tex="V^{T}" /> là các phép trực giao
                  (chỉ xoay/đối xứng, bảo toàn độ dài). Chỉ <MathText tex="\Sigma" /> —
                  ma trận đường chéo chứa các <MathText tex="\sigma_i" /> — mới co giãn.
                </>
              ),
            },
            {
              q: <>Vì sao SVD mạnh hơn diagonalization của chương 5?</>,
              options: [
                <>Vì SVD áp dụng cho MỌI ma trận, kể cả chữ nhật và suy biến</>,
                <>Vì SVD luôn cho eigenvalue phức</>,
                <>Vì SVD chỉ dùng cho ma trận đối xứng</>,
                <>Vì SVD không cần tính toán gì</>,
              ],
              answer: 0,
              explain: (
                <>
                  Diagonalization đòi ma trận vuông và “đủ đẹp”. SVD tồn tại cho mọi ma
                  trận <MathText tex="m\times n" />, với <MathText tex="U,V" /> trực giao
                  và <MathText tex="\sigma_i \ge 0" /> thực.
                </>
              ),
            },
            {
              q: <>Khi áp <MathText tex="V^{T}" /> lên hình tròn đơn vị, hình dạng thu được là gì?</>,
              options: [
                <>Vẫn là hình tròn đơn vị (chỉ bị xoay)</>,
                <>Một ellipse dẹt</>,
                <>Một đoạn thẳng</>,
                <>Một hình vuông</>,
              ],
              answer: 0,
              explain: (
                <>
                  <MathText tex="V^{T}" /> trực giao nên bảo toàn độ dài và góc — đường
                  tròn xoay đi nhưng vẫn tròn. Việc “biến thành ellipse” chỉ xảy ra ở bước{' '}
                  <MathText tex="\Sigma" />.
                </>
              ),
            },
            {
              q: <>Một ma trận suy biến (rank 1) sẽ có các singular value như thế nào?</>,
              options: [
                <>Có ít nhất một <MathText tex="\sigma_i = 0" /></>,
                <>Tất cả <MathText tex="\sigma_i" /> đều âm</>,
                <>Không tồn tại SVD</>,
                <>Tất cả <MathText tex="\sigma_i" /> bằng nhau</>,
              ],
              answer: 0,
              explain: (
                <>
                  Rank = số singular value khác 0. Ma trận 2×2 rank 1 có{' '}
                  <MathText tex="\sigma_1 > 0" /> nhưng <MathText tex="\sigma_2 = 0" /> —
                  ellipse bị bẹp thành một đoạn thẳng.
                </>
              ),
            },
          ]}
        />
      </Section>
    </Lesson>
  );
}
