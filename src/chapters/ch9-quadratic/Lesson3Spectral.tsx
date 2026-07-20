import { useState } from 'react';
import { Lesson, Section } from '../../components/Lesson';
import MathText from '../../components/MathText';
import Canvas2D, { type V2 } from '../../components/Canvas2D';
import MatrixInput from '../../components/MatrixInput';
import StepByStep from '../../components/StepByStep';
import Quiz from '../../components/Quiz';
import { eigenSymmetric, type Mat } from '../../lib/linalg';
import { Contours, AxisLine, type ContourLevel } from './Contours';
import { f2, symmetrize } from './util';

const PRESETS: { label: string; m: Mat }[] = [
  { label: 'Ellipse nghiêng 45°', m: [[3, 1], [1, 3]] },
  { label: 'Nghiêng mạnh', m: [[2, 1.5], [1.5, 2]] },
  { label: 'Gần suy biến', m: [[2, 1.9], [1.9, 2]] },
  { label: 'Indefinite (hyperbola)', m: [[0, 1], [1, 0]] },
];

const LEVELS: ContourLevel[] = [
  { L: 1, color: 'var(--vec-1)', width: 1.7, opacity: 0.85 },
  { L: 3, color: 'var(--vec-1)', width: 1.7, opacity: 0.6 },
  { L: 6, color: 'var(--vec-1)', width: 1.7, opacity: 0.4 },
  { L: -1, color: 'var(--vec-2)', width: 1.7, opacity: 0.85 },
  { L: -3, color: 'var(--vec-2)', width: 1.7, opacity: 0.6 },
  { L: -6, color: 'var(--vec-2)', width: 1.7, opacity: 0.4 },
];

export default function Lesson3Spectral() {
  const [A, setA] = useState<Mat>([
    [3, 1],
    [1, 3],
  ]);
  const [aligned, setAligned] = useState(false);

  const S = symmetrize(A);
  const { values, vectors } = eigenSymmetric(S);
  const [l1, l2] = values;
  const v1 = vectors[0];
  const v2 = vectors[1];

  // Ma trận đường chéo Λ (khi đã xoay về hệ eigen).
  const Lambda: Mat = [
    [l1, 0],
    [0, l2],
  ];

  const contourMat = aligned ? Lambda : S;
  // Hướng trục chính: eigenvector; khi aligned thì trùng trục toạ độ.
  const ax1: [number, number] = aligned ? [1, 0] : [v1[0], v1[1]];
  const ax2: [number, number] = aligned ? [0, 1] : [v2[0], v2[1]];

  const angleDeg = (Math.atan2(v1[1], v1[0]) * 180) / Math.PI;

  const eigenVecs: V2[] = [
    { id: 'v1', x: ax1[0] * 2.4, y: ax1[1] * 2.4, color: 'var(--vec-3)', label: 'q₁' },
    { id: 'v2', x: ax2[0] * 2.4, y: ax2[1] * 2.4, color: 'var(--vec-result)', label: 'q₂' },
  ];

  return (
    <Lesson id="ch9-spectral" title="Spectral theorem">
      <p className="muted">
        Ở bài đường mức, ellipse thường <b>nghiêng</b> — trục dài của nó không nằm theo trục
        toạ độ. Nhưng nó luôn có <b>hai trục vuông góc</b> riêng. Spectral theorem nói: hai
        trục đó chính là <b>eigenvector</b> của <MathText tex="A" />, và nếu ta xoay hệ toạ
        độ về đúng chúng thì dạng toàn phương trở nên thẳng thớm, không còn số hạng chéo.
      </p>

      <Section kind="explore" title="Trục chính = eigenvector. Bấm để xoay về hệ eigen">
        <p className="muted" style={{ marginTop: 0 }}>
          <b>Nhiệm vụ:</b> Ngắm hai trục{' '}
          <span style={{ color: 'var(--vec-3)' }}>q₁</span> và{' '}
          <span style={{ color: 'var(--vec-result)' }}>q₂</span> (eigenvector) — chúng luôn{' '}
          <b>vuông góc</b> và nằm đúng theo trục của conic. Bấm{' '}
          <b>"Xoay về hệ eigen"</b>: đổi biến <MathText tex="y=Q^{\top}x" /> biến ellipse
          nghiêng thành ellipse thẳng trục — vì trong hệ mới ma trận là đường chéo{' '}
          <MathText tex="\Lambda" />.
        </p>

        <div className="row" style={{ alignItems: 'flex-start', gap: 24 }}>
          <div style={{ flex: '1 1 300px', minWidth: 260 }}>
            <MatrixInput value={A} onChange={setA} presets={PRESETS} />
            <div style={{ marginTop: 12 }}>
              <button
                className={`btn ${aligned ? 'btn-primary' : ''}`}
                onClick={() => setAligned((a) => !a)}
              >
                {aligned ? '↩ Về hệ gốc (nghiêng)' : '↻ Xoay về hệ eigen (thẳng trục)'}
              </button>
            </div>
            <div className="panel" style={{ marginTop: 14, fontSize: 13.5 }}>
              <div style={{ marginBottom: 6 }}>
                <span className="mono" style={{ color: 'var(--vec-3)' }}>
                  λ₁ = {f2(l1)}
                </span>
                , eigenvector q₁ ≈{' '}
                <span className="mono">({f2(v1[0])}, {f2(v1[1])})</span>
              </div>
              <div style={{ marginBottom: 6 }}>
                <span className="mono" style={{ color: 'var(--vec-result)' }}>
                  λ₂ = {f2(l2)}
                </span>
                , eigenvector q₂ ≈{' '}
                <span className="mono">({f2(v2[0])}, {f2(v2[1])})</span>
              </div>
              <div style={{ color: 'var(--text-muted)', marginBottom: 6 }}>
                q₁·q₂ = <span className="mono">{f2(v1[0] * v2[0] + v1[1] * v2[1])}</span>{' '}
                (luôn ≈ 0 — trực giao!)
              </div>
              <div style={{ color: 'var(--text-muted)' }}>
                Góc nghiêng của trục chính ≈{' '}
                <span className="mono">{f2(angleDeg)}°</span>
              </div>
            </div>
          </div>
          <div style={{ flex: '2 1 340px', minWidth: 300 }}>
            <Canvas2D height={420} range={5} vectors={eigenVecs}>
              <Contours A={contourMat} levels={LEVELS} />
              <AxisLine d={ax1} color="var(--vec-3)" dashed label="trục chính 1" />
              <AxisLine d={ax2} color="var(--vec-result)" dashed label="trục chính 2" />
            </Canvas2D>
            <p className="dim" style={{ fontSize: 12 }}>
              {aligned
                ? 'Trong hệ eigen: ma trận là Λ đường chéo — conic thẳng trục, không còn xy.'
                : 'Trong hệ gốc: conic nghiêng, nhưng hai trục chính vẫn vuông góc.'}
            </p>
          </div>
        </div>
      </Section>

      <Section kind="theory" title="Spectral theorem: A = QΛQᵀ với Q trực giao">
        <p>
          <b>Spectral theorem (định lý phổ).</b> Mọi ma trận thực <b>đối xứng</b>{' '}
          <MathText tex="A=A^{\top}" /> đều <b>chéo hoá được bằng một ma trận trực giao</b>:
          tồn tại ma trận trực giao <MathText tex="Q" /> (các cột là eigenvector{' '}
          <b>trực chuẩn</b>) và ma trận đường chéo thực <MathText tex="\Lambda" /> sao cho
        </p>
        <MathText block tex="A = Q\,\Lambda\,Q^{\top},\qquad Q^{\top}Q = I,\qquad \Lambda=\operatorname{diag}(\lambda_1,\dots,\lambda_n)." />
        <p>
          So với bài chéo hoá ở <b>chương 5</b> (<MathText tex="A=PDP^{-1}" />): ở đây điều
          kỳ diệu là <MathText tex="P" /> có thể chọn <b>trực giao</b>, nên{' '}
          <MathText tex="P^{-1}=P^{\top}" /> — nghịch đảo chỉ là chuyển vị, khỏi phải tính
          gì. Đó chính là các ma trận trực giao (orthogonal) của <b>chương 8</b>: bảo toàn độ
          dài và góc, tức là một phép <b>xoay</b> (có thể kèm phản chiếu). Ellipse nghiêng
          quay về ellipse thẳng trục đúng bằng phép xoay đó.
        </p>
        <p>Thay vào dạng toàn phương và đặt <MathText tex="y=Q^{\top}x" />:</p>
        <MathText
          block
          tex="q(x)=x^{\top}Ax = x^{\top}Q\Lambda Q^{\top}x = (Q^{\top}x)^{\top}\Lambda (Q^{\top}x) = y^{\top}\Lambda y = \sum_i \lambda_i y_i^2."
        />
        <p>
          Vế phải không còn số hạng chéo — đó là lý do "xoay về hệ eigen" làm conic thẳng
          trục, và cũng là nền tảng cho việc xét định dấu ở bài trước.
        </p>

        <h3>Đào sâu — hai bổ đề nền cho định lý</h3>
        <p>
          <b>Bổ đề 1 (eigenvalue thực).</b> Nếu <MathText tex="Av=\lambda v" /> với{' '}
          <MathText tex="A" /> thực đối xứng, xét{' '}
          <MathText tex="\bar v^{\top}Av" />. Một mặt bằng{' '}
          <MathText tex="\lambda\,\bar v^{\top}v" />; mặt khác bằng liên hợp của chính nó nên
          là số thực, mà <MathText tex="\bar v^{\top}v>0" /> ⇒ <MathText tex="\lambda" /> thực.
        </p>
        <p>
          <b>Bổ đề 2 (eigenvector trực giao).</b> Lấy hai eigenvalue khác nhau{' '}
          <MathText tex="\lambda_i\neq\lambda_j" /> với eigenvector{' '}
          <MathText tex="v_i,v_j" />. Dùng tính đối xứng <MathText tex="A^{\top}=A" />:
        </p>
        <MathText
          block
          tex="\lambda_i\,(v_i\!\cdot v_j) = (Av_i)^{\top}v_j = v_i^{\top}A^{\top}v_j = v_i^{\top}Av_j = \lambda_j\,(v_i\!\cdot v_j)."
        />
        <p>
          Suy ra <MathText tex="(\lambda_i-\lambda_j)(v_i\!\cdot v_j)=0" />. Vì{' '}
          <MathText tex="\lambda_i\neq\lambda_j" /> nên <MathText tex="v_i\!\cdot v_j=0" /> —
          các eigenvector vuông góc. (Trường hợp eigenvalue bội có thể chọn cơ sở trực chuẩn
          trong từng eigenspace.) Chuẩn hoá về độ dài 1 là ta có ngay các cột trực chuẩn của{' '}
          <MathText tex="Q" />.
        </p>
      </Section>

      <Section kind="steps" title="Chéo hoá trực giao một ma trận 2×2">
        <StepByStep
          steps={[
            {
              title: 'Đề bài',
              content: (
                <div>
                  <p className="muted">Tìm Q trực giao và Λ đường chéo sao cho A = QΛQᵀ:</p>
                  <MathText block tex="A=\begin{bmatrix} 4 & 1 \\ 1 & 4 \end{bmatrix}." />
                </div>
              ),
            },
            {
              title: 'Bước 1 — Eigenvalue',
              content: (
                <MathText block tex="\det(A-\lambda I)=(4-\lambda)^2-1=0 \Rightarrow 4-\lambda=\pm1 \Rightarrow \lambda_1=5,\ \lambda_2=3." />
              ),
            },
            {
              title: 'Bước 2 — Eigenvector và chuẩn hoá',
              content: (
                <div>
                  <MathText block tex="\lambda_1=5:\ (A-5I)v=0 \Rightarrow v_1=(1,1);\qquad \lambda_2=3:\ v_2=(-1,1)." />
                  <p className="muted">
                    Hai vector này vuông góc (<MathText tex="v_1\!\cdot v_2 = -1+1=0" />). Chia
                    cho độ dài <MathText tex="\sqrt2" />:
                  </p>
                  <MathText block tex="q_1=\tfrac{1}{\sqrt2}(1,1),\qquad q_2=\tfrac{1}{\sqrt2}(-1,1)." />
                </div>
              ),
            },
            {
              title: 'Bước 3 — Lắp Q, Λ và kiểm chứng',
              content: (
                <div>
                  <MathText block tex="Q=\frac{1}{\sqrt2}\begin{bmatrix} 1 & -1 \\ 1 & 1 \end{bmatrix},\qquad \Lambda=\begin{bmatrix} 5 & 0 \\ 0 & 3 \end{bmatrix}." />
                  <p className="muted">
                    Vì <MathText tex="Q^{\top}Q=I" />, ta có{' '}
                    <MathText tex="Q^{-1}=Q^{\top}" /> và <MathText tex="Q\Lambda Q^{\top}=A" />.
                    Trong hệ eigen, dạng toàn phương là{' '}
                    <MathText tex="q=5y_1^2+3y_2^2" /> — thẳng trục.
                  </p>
                </div>
              ),
            },
          ]}
        />
      </Section>

      <Section kind="quiz" title="Kiểm tra hiểu">
        <Quiz
          lessonKey="ch9/spectral"
          questions={[
            {
              q: <>Spectral theorem đảm bảo điều gì cho MỌI ma trận thực đối xứng?</>,
              options: [
                <>Chéo hoá được bằng ma trận trực giao: <MathText tex="A=Q\Lambda Q^{\top}" />, eigenvector trực chuẩn</>,
                <>Luôn khả nghịch</>,
                <>Mọi eigenvalue đều dương</>,
                <>Không bao giờ chéo hoá được</>,
              ],
              answer: 0,
              explain: (
                <>
                  Đối xứng ⇒ eigenvalue thực và tồn tại một cơ sở{' '}
                  <b>trực chuẩn</b> gồm eigenvector, gom thành Q trực giao với{' '}
                  <MathText tex="A=Q\Lambda Q^{\top}" />.
                </>
              ),
            },
            {
              q: <>Điểm khác biệt then chốt giữa <MathText tex="A=Q\Lambda Q^{\top}" /> (đối xứng) và <MathText tex="A=PDP^{-1}" /> (tổng quát)?</>,
              options: [
                <>Q trực giao nên <MathText tex="Q^{-1}=Q^{\top}" />; eigenvector vuông góc nhau</>,
                <>Λ không phải ma trận đường chéo</>,
                <>Q không khả nghịch</>,
                <>Không có khác biệt nào</>,
              ],
              answer: 0,
              explain: (
                <>
                  Với ma trận đối xứng, eigenvector chọn được trực chuẩn nên{' '}
                  <MathText tex="P=Q" /> trực giao và nghịch đảo bằng chuyển vị — gọn hơn hẳn
                  trường hợp tổng quát.
                </>
              ),
            },
            {
              q: <>Vì sao eigenvector ứng với hai eigenvalue KHÁC nhau của ma trận đối xứng thì vuông góc?</>,
              options: [
                <>Vì <MathText tex="(\lambda_i-\lambda_j)(v_i\!\cdot v_j)=0" /> mà <MathText tex="\lambda_i\neq\lambda_j" /></>,
                <>Vì mọi vector trong không gian đều vuông góc</>,
                <>Vì eigenvalue luôn bằng nhau</>,
                <>Đó chỉ là trùng hợp, không phải luôn đúng</>,
              ],
              answer: 0,
              explain: (
                <>
                  Dùng <MathText tex="A^{\top}=A" /> ta suy ra{' '}
                  <MathText tex="\lambda_i(v_i\!\cdot v_j)=\lambda_j(v_i\!\cdot v_j)" />, nên khi
                  hai eigenvalue khác nhau thì tích vô hướng phải bằng 0.
                </>
              ),
            },
            {
              q: <>Sau khi đổi biến <MathText tex="y=Q^{\top}x" />, dạng toàn phương trở thành gì?</>,
              options: [
                <><MathText tex="q=\lambda_1 y_1^2+\lambda_2 y_2^2" /> — tổng bình phương, không còn số hạng chéo</>,
                <><MathText tex="q=y_1 y_2" /></>,
                <><MathText tex="q=0" /> với mọi y</>,
                <>Vẫn còn nguyên số hạng <MathText tex="xy" /></>,
              ],
              answer: 0,
              explain: (
                <>
                  <MathText tex="q=y^{\top}\Lambda y=\sum_i\lambda_i y_i^2" />. Λ đường chéo nên
                  không còn tích chéo — đây là "trục chính" của conic.
                </>
              ),
            },
          ]}
        />
      </Section>
    </Lesson>
  );
}
