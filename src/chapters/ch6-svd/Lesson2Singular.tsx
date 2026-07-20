import { useMemo, useState } from 'react';
import { Lesson, Section } from '../../components/Lesson';
import MathText from '../../components/MathText';
import Canvas2D, { type V2 } from '../../components/Canvas2D';
import MatrixInput from '../../components/MatrixInput';
import StepByStep from '../../components/StepByStep';
import Slider from '../../components/Slider';
import Quiz from '../../components/Quiz';
import { svd, angleBetween, type Mat } from '../../lib/linalg';
import { asM2, circlePts, col, f2, apply2, PRESETS_SVD } from './util';

export default function Lesson2Singular() {
  const [A, setA] = useState<Mat>([
    [1.5, -0.5],
    [0.6, 1.4],
  ]);
  const [theta, setTheta] = useState(0.6);

  const { S, V } = useMemo(() => svd(A), [A]);
  const s1 = S[0] ?? 0;
  const s2 = S[1] ?? 0;
  const v1 = col(V, 0);
  const v2 = col(V, 1);

  // Cặp trực chuẩn tùy ý do người dùng quét
  const w1: [number, number] = [Math.cos(theta), Math.sin(theta)];
  const w2: [number, number] = [-Math.sin(theta), Math.cos(theta)];
  const Aw1 = apply2(A, w1[0], w1[1]);
  const Aw2 = apply2(A, w2[0], w2[1]);
  const angAfter = (angleBetween(Aw1, Aw2) * 180) / Math.PI;

  // Góc của v₁ để nút "về đúng cặp V"
  const thetaV = Math.atan2(v1[1], v1[0]);

  // ---- Canvas TRƯỚC (identity): hai cặp hướng + đường tròn ----
  const beforeVecs: V2[] = [
    { id: 'v1', x: v1[0], y: v1[1], color: 'var(--vec-1)', label: 'v₁' },
    { id: 'v2', x: v2[0], y: v2[1], color: 'var(--vec-2)', label: 'v₂' },
    { id: 'w1', x: w1[0], y: w1[1], color: 'var(--vec-3)', label: 'w₁', dashed: true },
    { id: 'w2', x: w2[0], y: w2[1], color: 'var(--vec-result)', label: 'w₂', dashed: true },
  ];

  // ---- Canvas SAU (matrix = A): mọi vector bị A cuốn theo ----
  // v_i → A v_i = σ_i u_i (bán trục ellipse); w_i → A w_i.
  const afterVecs: V2[] = [
    { id: 'v1', x: v1[0], y: v1[1], color: 'var(--vec-1)', label: 'σ₁u₁' },
    { id: 'v2', x: v2[0], y: v2[1], color: 'var(--vec-2)', label: 'σ₂u₂' },
    { id: 'w1', x: w1[0], y: w1[1], color: 'var(--vec-3)', label: 'Aw₁', dashed: true },
    { id: 'w2', x: w2[0], y: w2[1], color: 'var(--vec-result)', label: 'Aw₂', dashed: true },
  ];

  const aligned = Math.abs(angAfter - 90) < 1.5;

  return (
    <Lesson id="ch6-singular" title="Singular values & vectors">
      <p className="muted">
        Khi A biến đường tròn đơn vị thành một <b>ellipse</b>, hai bán trục của ellipse
        đó kể cho ta toàn bộ câu chuyện. Độ dài của chúng là các{' '}
        <b>singular value</b> <MathText tex="\sigma_1 \ge \sigma_2" />; hướng của chúng
        là các <b>left singular vector</b> <MathText tex="u_1, u_2" />; và hai hướng
        trong <i>input</i> đẻ ra chúng là các <b>right singular vector</b>{' '}
        <MathText tex="v_1, v_2" />.
      </p>

      <Section kind="explore" title="Quét một cặp vuông góc và xem điều gì xảy ra">
        <p className="muted" style={{ marginTop: 0 }}>
          <b>Gợi ý thao tác:</b> Kéo Slider để quay cặp trực chuẩn{' '}
          <span style={{ color: 'var(--vec-3)' }}>w₁</span> ⟂{' '}
          <span style={{ color: 'var(--vec-result)' }}>w₂</span> ở khung trái. Nhìn khung
          phải: sau khi qua A, chúng <b>thường KHÔNG còn vuông góc</b>. Chỉ khi w trùng
          với <span style={{ color: 'var(--vec-1)' }}>v₁</span>,{' '}
          <span style={{ color: 'var(--vec-2)' }}>v₂</span> thì ảnh mới vuông góc trở lại —
          đó là điều đặc biệt của cặp V!
        </p>

        <div className="row" style={{ alignItems: 'flex-start', gap: 18 }}>
          <div style={{ flex: '1 1 260px', minWidth: 240 }}>
            <MatrixInput value={A} onChange={setA} presets={PRESETS_SVD} />
            <div style={{ marginTop: 12 }}>
              <Slider
                label="Góc quét cặp w (rad)"
                min={0}
                max={Math.PI}
                value={theta}
                onChange={setTheta}
                format={(v) => `${v.toFixed(2)}`}
              />
              <button className="btn" onClick={() => setTheta(((thetaV % Math.PI) + Math.PI) % Math.PI)}>
                🎯 Về đúng cặp V
              </button>
            </div>
            <div className="panel" style={{ marginTop: 14, fontSize: 13.5 }}>
              <div style={{ marginBottom: 6 }}>
                <span style={{ color: 'var(--accent)', fontWeight: 600 }}>σ₁ = {f2(s1)}</span>{' '}
                ≥{' '}
                <span style={{ color: 'var(--accent)', fontWeight: 600 }}>σ₂ = {f2(s2)}</span>
              </div>
              <div style={{ marginBottom: 6, color: 'var(--text-muted)' }}>
                Góc giữa Aw₁ và Aw₂:{' '}
                <span className="mono" style={{ color: aligned ? 'var(--good)' : 'var(--warn)' }}>
                  {f2(angAfter)}°
                </span>{' '}
                {aligned ? '→ vuông góc! (w trùng V)' : '→ lệch khỏi 90°'}
              </div>
              <div style={{ color: s2 < 0.15 ? 'var(--bad)' : 'var(--text-dim)' }}>
                {s2 < 0.15
                  ? '⚠ σ₂ ≈ 0 → A gần suy biến (điều kiện xấu, khó nghịch đảo).'
                  : 'σ₂ càng nhỏ, ellipse càng dẹt.'}
              </div>
            </div>
          </div>

          <div style={{ flex: '1 1 260px', minWidth: 240 }}>
            <Canvas2D
              height={340}
              range={2.5}
              vectors={beforeVecs}
              polygons={[
                { points: circlePts(64), fill: 'var(--accent-2)', opacity: 0.12, stroke: 'var(--accent-2)' },
              ]}
            />
            <p className="dim" style={{ fontSize: 12, textAlign: 'center' }}>Trước biến đổi (input)</p>
          </div>

          <div style={{ flex: '1 1 260px', minWidth: 240 }}>
            <Canvas2D
              height={340}
              range={Math.max(2.5, Math.ceil(s1) + 0.5)}
              matrix={asM2(A)}
              vectors={afterVecs}
              polygons={[
                { points: circlePts(64), fill: 'var(--vec-result)', opacity: 0.1, stroke: 'var(--vec-result)' },
              ]}
            />
            <p className="dim" style={{ fontSize: 12, textAlign: 'center' }}>Sau biến đổi = A·(input)</p>
          </div>
        </div>
      </Section>

      <Section kind="theory" title="σ, u, v nói lên điều gì?">
        <p>
          Hãy hình dung ta thả một vector đơn vị <MathText tex="x" /> chạy quanh đường
          tròn và đo độ dài <MathText tex="\lVert Ax \rVert" />. Độ dài này{' '}
          <b>lớn nhất</b> đúng bằng <MathText tex="\sigma_1" /> (đạt tại{' '}
          <MathText tex="x = v_1" />) và <b>nhỏ nhất</b> đúng bằng{' '}
          <MathText tex="\sigma_2" /> (đạt tại <MathText tex="x = v_2" />):
        </p>
        <MathText block tex="\sigma_1 = \max_{\lVert x\rVert=1} \lVert Ax\rVert, \qquad \sigma_2 = \min_{\lVert x\rVert=1} \lVert Ax\rVert" />
        <p>
          Hai bộ hướng <MathText tex="\{v_1, v_2\}" /> và <MathText tex="\{u_1, u_2\}" />{' '}
          đều là các <b>hệ trực chuẩn</b> (orthonormal): một bộ nằm ở phía input, một bộ
          ở phía output. SVD nói rằng A “khớp” chúng lại với nhau một cách gọn gàng:
        </p>
        <MathText block tex="A v_1 = \sigma_1 u_1, \qquad A v_2 = \sigma_2 u_2" />
        <p>
          Đây là lý do vì sao <b>chỉ riêng</b> cặp <MathText tex="v_1, v_2" /> mới cho ảnh
          vuông góc: A đẩy chúng thành <MathText tex="\sigma_1 u_1 \perp \sigma_2 u_2" />,
          đúng hai bán trục của ellipse. Mọi cặp vuông góc khác sẽ bị bẻ lệch.
        </p>
        <p className="muted">
          <b>Điều kiện của ma trận.</b> Tỉ số <MathText tex="\kappa = \sigma_1/\sigma_2" />{' '}
          gọi là <i>số điều kiện</i>. Khi <MathText tex="\sigma_2" /> tiến về 0, ellipse
          dẹt lại, ma trận “gần suy biến”: nghịch đảo của nó phóng đại sai số khủng khiếp.
          SVD là công cụ chuẩn để phát hiện điều này.
        </p>
      </Section>

      <Section kind="steps" title="Tính SVD của một ma trận 2×2 đơn giản">
        <p className="muted">
          Lấy <MathText tex="A = \begin{bmatrix} 0 & 2 \\ 1 & 0 \end{bmatrix}" /> — một
          ma trận “đổi trục và co giãn”.
        </p>
        <StepByStep
          steps={[
            {
              title: 'Bước 1 — Lập AᵀA',
              content: (
                <div>
                  <MathText block tex="A^{T}A = \begin{bmatrix} 0 & 1 \\ 2 & 0 \end{bmatrix}\begin{bmatrix} 0 & 2 \\ 1 & 0 \end{bmatrix} = \begin{bmatrix} 1 & 0 \\ 0 & 4 \end{bmatrix}" />
                  <p className="muted">AᵀA luôn đối xứng — ta sẽ khai thác điều này ở bài sau.</p>
                </div>
              ),
            },
            {
              title: 'Bước 2 — Eigenvalue của AᵀA',
              content: (
                <div>
                  <MathText block tex="\lambda_1 = 4,\quad \lambda_2 = 1 \;\Rightarrow\; \sigma_1 = \sqrt{4} = 2,\quad \sigma_2 = \sqrt{1} = 1" />
                  <p className="muted">Ma trận đã đường chéo nên đọc eigenvalue ngay trên đường chéo.</p>
                </div>
              ),
            },
            {
              title: 'Bước 3 — Right singular vectors v',
              content: (
                <div>
                  <MathText block tex="v_1 = \begin{bmatrix} 0 \\ 1 \end{bmatrix}\ (\lambda=4), \qquad v_2 = \begin{bmatrix} 1 \\ 0 \end{bmatrix}\ (\lambda=1)" />
                  <p className="muted">Là các eigenvector của AᵀA, xếp theo σ giảm dần.</p>
                </div>
              ),
            },
            {
              title: 'Bước 4 — Left singular vectors u = Av/σ',
              content: (
                <div>
                  <MathText block tex="u_1 = \frac{A v_1}{\sigma_1} = \frac{1}{2}\begin{bmatrix} 2 \\ 0 \end{bmatrix} = \begin{bmatrix} 1 \\ 0 \end{bmatrix}, \quad u_2 = \frac{A v_2}{\sigma_2} = \begin{bmatrix} 0 \\ 1 \end{bmatrix}" />
                </div>
              ),
            },
            {
              title: 'Bước 5 — Ghép lại A = UΣVᵀ',
              content: (
                <div>
                  <MathText block tex="A = \begin{bmatrix} 1 & 0 \\ 0 & 1 \end{bmatrix}\begin{bmatrix} 2 & 0 \\ 0 & 1 \end{bmatrix}\begin{bmatrix} 0 & 1 \\ 1 & 0 \end{bmatrix} = \begin{bmatrix} 0 & 2 \\ 1 & 0 \end{bmatrix}" />
                  <p className="muted">Nhân thử lại đúng bằng A ban đầu — xong!</p>
                </div>
              ),
            },
          ]}
        />
      </Section>

      <Section kind="quiz" title="Kiểm tra hiểu">
        <Quiz
          lessonKey="ch6/singular"
          questions={[
            {
              q: <>Singular value <MathText tex="\sigma_1" /> bằng giá trị nào?</>,
              options: [
                <>Độ giãn LỚN NHẤT: <MathText tex="\max_{\lVert x\rVert=1}\lVert Ax\rVert" /></>,
                <>Determinant của A</>,
                <>Vết (trace) của A</>,
                <>Độ giãn nhỏ nhất</>,
              ],
              answer: 0,
              explain: (
                <>
                  <MathText tex="\sigma_1" /> là độ dài bán trục lớn của ellipse — chính là
                  độ giãn cực đại, đạt tại <MathText tex="x=v_1" />.
                </>
              ),
            },
            {
              q: <>Vì sao chỉ cặp <MathText tex="v_1, v_2" /> cho ảnh vẫn vuông góc sau khi qua A?</>,
              options: [
                <>Vì <MathText tex="Av_1=\sigma_1u_1" />, <MathText tex="Av_2=\sigma_2u_2" /> mà <MathText tex="u_1\perp u_2" /></>,
                <>Vì mọi cặp vuông góc đều giữ vuông góc</>,
                <>Vì <MathText tex="v_1,v_2" /> song song</>,
                <>Đó là chuyện ngẫu nhiên</>,
              ],
              answer: 0,
              explain: (
                <>
                  A ánh xạ cặp trực chuẩn V thành cặp trực chuẩn U (nhân với σ). Các cặp
                  vuông góc khác nói chung bị bẻ lệch.
                </>
              ),
            },
            {
              q: <>Nếu <MathText tex="\sigma_2" /> rất gần 0 thì điều gì đúng?</>,
              options: [
                <>A gần suy biến, số điều kiện <MathText tex="\sigma_1/\sigma_2" /> rất lớn</>,
                <>A là ma trận trực giao</>,
                <>A xoay 90°</>,
                <>A bảo toàn diện tích</>,
              ],
              answer: 0,
              explain: (
                <>
                  Ellipse dẹt gần thành đoạn thẳng. Nghịch đảo phóng đại sai số theo{' '}
                  <MathText tex="1/\sigma_2" /> — điều kiện xấu.
                </>
              ),
            },
            {
              q: <>Bộ hướng <MathText tex="u_1, u_2" /> có tính chất gì?</>,
              options: [
                <>Là hệ trực chuẩn ở phía output (các hướng bán trục ellipse)</>,
                <>Luôn bằng <MathText tex="v_1, v_2" /></>,
                <>Là eigenvector của A</>,
                <>Có độ dài bằng <MathText tex="\sigma_i" /></>,
              ],
              answer: 0,
              explain: (
                <>
                  <MathText tex="u_i" /> là vector đơn vị (độ dài 1) trực chuẩn, chỉ hướng
                  bán trục; độ dài bán trục là <MathText tex="\sigma_i" /> nằm ở{' '}
                  <MathText tex="\sigma_i u_i" />.
                </>
              ),
            },
          ]}
        />
      </Section>
    </Lesson>
  );
}
