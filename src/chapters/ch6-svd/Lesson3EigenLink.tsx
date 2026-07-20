import { useMemo, useState } from 'react';
import { Lesson, Section } from '../../components/Lesson';
import MathText from '../../components/MathText';
import Canvas2D, { type V2 } from '../../components/Canvas2D';
import MatrixInput from '../../components/MatrixInput';
import StepByStep from '../../components/StepByStep';
import Quiz from '../../components/Quiz';
import { svd, transpose, matMul, eigenSymmetric, type Mat } from '../../lib/linalg';
import { asM2, circlePts, mat2tex, f2, PRESETS_SVD } from './util';

export default function Lesson3EigenLink() {
  const [A, setA] = useState<Mat>([
    [1, 1],
    [0, 1],
  ]);

  const { AtA, eigVals, eigVecs, sigmas } = useMemo(() => {
    const AtA = matMul(transpose(A), A);
    const { values, vectors } = eigenSymmetric(AtA);
    const { S } = svd(A);
    return { AtA, eigVals: values, eigVecs: vectors, sigmas: S };
  }, [A]);

  const maxEig = Math.max(eigVals[0] ?? 1, 1);
  const rng = Math.min(9, Math.ceil(maxEig) + 1);

  // Eigenvector của AᵀA (= right singular vectors) — được AᵀA cuốn theo cùng hướng.
  const vv1 = eigVecs[0] ?? [1, 0];
  const vv2 = eigVecs[1] ?? [0, 1];

  const vectors: V2[] = [
    { id: 'v1', x: vv1[0], y: vv1[1], color: 'var(--vec-1)', label: 'v₁' },
    { id: 'v2', x: vv2[0], y: vv2[1], color: 'var(--vec-2)', label: 'v₂' },
  ];

  return (
    <Lesson id="ch6-eigen-link" title="Liên hệ AᵀA">
      <p className="muted">
        Làm sao máy tính thật sự <i>tính ra</i> singular value? Bí mật nằm ở một ma trận
        cực đẹp: <MathText tex="A^{T}A" />. Nó luôn <b>đối xứng</b>, và eigenvalue của nó
        chính là <MathText tex="\sigma^2" />. Bài này nối thẳng SVD (chương 6) về với
        eigen (chương 5).
      </p>

      <Section kind="explore" title="AᵀA đối xứng — so √λ với σ">
        <p className="muted" style={{ marginTop: 0 }}>
          <b>Gợi ý thao tác:</b> Đổi A rồi nhìn bảng đối chiếu cập nhật ngay: căn bậc hai
          của eigenvalue <MathText tex="A^{T}A" /> luôn <b>trùng khít</b> với singular
          value của A. Ở khung hình, để ý AᵀA co giãn dọc theo hai trục vuông góc (vì đối
          xứng) — không hề xoắn lệch, đúng như “ma trận đặc biệt” ở chương 3.
        </p>

        <div className="row" style={{ alignItems: 'flex-start', gap: 24 }}>
          <div style={{ flex: '1 1 320px', minWidth: 280 }}>
            <MatrixInput value={A} onChange={setA} presets={PRESETS_SVD} />

            <div className="panel" style={{ marginTop: 14 }}>
              <MathText block tex={`A^{T}A = ${mat2tex(AtA)}`} />
              <div className="dim" style={{ fontSize: 12, marginBottom: 8 }}>
                Đối xứng: phần tử (1,2) = (2,1) = {f2(AtA[0][1])}.
              </div>
              <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 13.5 }}>
                <thead>
                  <tr style={{ color: 'var(--text-muted)', textAlign: 'left' }}>
                    <th style={{ padding: '4px 6px' }}>i</th>
                    <th style={{ padding: '4px 6px' }}>λᵢ(AᵀA)</th>
                    <th style={{ padding: '4px 6px' }}>√λᵢ</th>
                    <th style={{ padding: '4px 6px' }}>σᵢ(A)</th>
                  </tr>
                </thead>
                <tbody>
                  {[0, 1].map((i) => {
                    const lam = eigVals[i] ?? 0;
                    const sq = Math.sqrt(Math.max(0, lam));
                    const sig = sigmas[i] ?? 0;
                    const match = Math.abs(sq - sig) < 1e-3;
                    return (
                      <tr key={i} style={{ borderTop: '1px solid var(--border-soft)' }}>
                        <td style={{ padding: '4px 6px' }}>{i + 1}</td>
                        <td style={{ padding: '4px 6px' }} className="mono">{f2(lam)}</td>
                        <td style={{ padding: '4px 6px' }} className="mono" >{f2(sq)}</td>
                        <td style={{ padding: '4px 6px', color: match ? 'var(--good)' : 'var(--bad)' }} className="mono">
                          {f2(sig)} {match ? '✓' : '✗'}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>

          <div style={{ flex: '1 1 320px', minWidth: 280 }}>
            <Canvas2D
              height={380}
              range={rng}
              matrix={asM2(AtA)}
              vectors={vectors}
              polygons={[
                { points: circlePts(64), fill: 'var(--vec-3)', opacity: 0.12, stroke: 'var(--vec-3)' },
              ]}
            />
            <p className="dim" style={{ fontSize: 12, textAlign: 'center' }}>
              AᵀA tác động lên hình tròn — co giãn dọc v₁, v₂ (không xoắn).
            </p>
          </div>
        </div>
      </Section>

      <Section kind="theory" title="Vì sao σᵢ = √λᵢ(AᵀA)?">
        <p>
          Nhớ rằng <MathText tex="\sigma_1" /> là độ giãn cực đại của A: ta muốn cực đại
          hoá <MathText tex="\lVert Av\rVert" /> trên các vector đơn vị. Bình phương lên
          cho gọn:
        </p>
        <MathText block tex="\lVert Av\rVert^{2} = (Av)^{T}(Av) = v^{T}A^{T}A\,v" />
        <p>
          Đặt <MathText tex="M = A^{T}A" />. Đây là ma trận <b>đối xứng</b> (vì{' '}
          <MathText tex="M^{T} = (A^{T}A)^{T} = A^{T}A = M" />) và <b>nửa xác định dương</b>{' '}
          (<MathText tex="v^{T}Mv = \lVert Av\rVert^2 \ge 0" />). Theo chương 5, ma trận
          đối xứng có eigenvector <b>trực giao</b> và eigenvalue <b>thực không âm</b>. Nếu{' '}
          <MathText tex="Mv = \lambda v" /> với <MathText tex="\lVert v\rVert = 1" /> thì:
        </p>
        <MathText block tex="\lVert Av\rVert^{2} = v^{T}(\lambda v) = \lambda \;\Rightarrow\; \lVert Av\rVert = \sqrt{\lambda}" />
        <p>
          Vậy độ giãn theo hướng eigenvector <MathText tex="v" /> đúng bằng{' '}
          <MathText tex="\sqrt{\lambda}" />. Suy ra ngay:
        </p>
        <ul>
          <li>
            <b><MathText tex="\sigma_i = \sqrt{\lambda_i(A^{T}A)}" /></b> — singular value.
          </li>
          <li>
            <b><MathText tex="V" /></b> = các eigenvector của{' '}
            <MathText tex="A^{T}A" /> (right singular vectors).
          </li>
          <li>
            <b><MathText tex="U" /></b> = các eigenvector của{' '}
            <MathText tex="A A^{T}" /> (left singular vectors); hoặc tính thẳng{' '}
            <MathText tex="u_i = Av_i/\sigma_i" />.
          </li>
        </ul>
        <p className="muted">
          Đây <b>chính xác</b> là cách máy tính (và cả thư viện <code>linalg.ts</code> của
          app này) dựng SVD: đưa bài toán SVD về bài toán <b>eigen của ma trận đối xứng</b>{' '}
          <MathText tex="A^{T}A" />, giải bằng thuật toán Jacobi, rồi suy ra U. Bạn sẽ mở
          đúng đoạn code đó ở <b>chương 7</b>.
        </p>
      </Section>

      <Section kind="steps" title="Từ AᵀA tính σ từng bước">
        <p className="muted">
          Lấy ma trận đối xứng <MathText tex="A = \begin{bmatrix} 2 & 1 \\ 1 & 2 \end{bmatrix}" />.
        </p>
        <StepByStep
          steps={[
            {
              title: 'Bước 1 — Nhân AᵀA',
              content: (
                <div>
                  <MathText block tex="A^{T}A = \begin{bmatrix} 2 & 1 \\ 1 & 2 \end{bmatrix}\begin{bmatrix} 2 & 1 \\ 1 & 2 \end{bmatrix} = \begin{bmatrix} 5 & 4 \\ 4 & 5 \end{bmatrix}" />
                  <p className="muted">Kết quả đối xứng như dự đoán.</p>
                </div>
              ),
            },
            {
              title: 'Bước 2 — Phương trình đặc trưng',
              content: (
                <div>
                  <MathText block tex="\det\!\begin{bmatrix} 5-\lambda & 4 \\ 4 & 5-\lambda \end{bmatrix} = (5-\lambda)^2 - 16 = 0" />
                  <MathText block tex="(5-\lambda)^2 = 16 \;\Rightarrow\; 5-\lambda = \pm 4" />
                </div>
              ),
            },
            {
              title: 'Bước 3 — Eigenvalue',
              content: (
                <MathText block tex="\lambda_1 = 9, \qquad \lambda_2 = 1" />
              ),
            },
            {
              title: 'Bước 4 — Singular value = √λ',
              content: (
                <div>
                  <MathText block tex="\sigma_1 = \sqrt{9} = 3, \qquad \sigma_2 = \sqrt{1} = 1" />
                  <p className="muted">
                    (Với ma trận đối xứng xác định dương, σ trùng với |eigenvalue của A|:
                    ở đây eigenvalue của A cũng là 3 và 1.)
                  </p>
                </div>
              ),
            },
          ]}
        />
      </Section>

      <Section kind="quiz" title="Kiểm tra hiểu">
        <Quiz
          lessonKey="ch6/eigen-link"
          questions={[
            {
              q: <>Ma trận <MathText tex="A^{T}A" /> luôn có tính chất gì?</>,
              options: [
                <>Đối xứng và nửa xác định dương (eigenvalue thực ≥ 0)</>,
                <>Phản đối xứng</>,
                <>Trực giao</>,
                <>Luôn khả nghịch</>,
              ],
              answer: 0,
              explain: (
                <>
                  <MathText tex="(A^TA)^T = A^TA" /> nên đối xứng; và{' '}
                  <MathText tex="v^TA^TAv=\lVert Av\rVert^2\ge0" /> nên nửa xác định dương.
                </>
              ),
            },
            {
              q: <>Quan hệ giữa singular value σ của A và eigenvalue λ của <MathText tex="A^{T}A" />?</>,
              options: [
                <><MathText tex="\sigma_i = \sqrt{\lambda_i}" /></>,
                <><MathText tex="\sigma_i = \lambda_i" /></>,
                <><MathText tex="\sigma_i = \lambda_i^2" /></>,
                <><MathText tex="\sigma_i = 1/\lambda_i" /></>,
              ],
              answer: 0,
              explain: (
                <>
                  Vì <MathText tex="\lVert Av\rVert^2 = v^TA^TAv = \lambda" /> khi{' '}
                  <MathText tex="v" /> là eigenvector đơn vị, nên{' '}
                  <MathText tex="\sigma=\lVert Av\rVert=\sqrt{\lambda}" />.
                </>
              ),
            },
            {
              q: <>Các cột của V (right singular vectors) là gì?</>,
              options: [
                <>Eigenvector của <MathText tex="A^{T}A" /></>,
                <>Eigenvector của <MathText tex="A" /></>,
                <>Các cột của A</>,
                <>Luôn là <MathText tex="\hat\imath,\hat\jmath" /></>,
              ],
              answer: 0,
              explain: (
                <>
                  V gồm các eigenvector của <MathText tex="A^TA" />; còn U gồm eigenvector
                  của <MathText tex="AA^T" /> (hoặc <MathText tex="u_i=Av_i/\sigma_i" />).
                </>
              ),
            },
            {
              q: <>Với <MathText tex="A=\begin{bmatrix}2&1\\1&2\end{bmatrix}" />, ta có <MathText tex="A^TA=\begin{bmatrix}5&4\\4&5\end{bmatrix}" />. Singular value lớn nhất là?</>,
              options: [
                <MathText tex="3" />,
                <MathText tex="9" />,
                <MathText tex="5" />,
                <MathText tex="\sqrt{5}" />,
              ],
              answer: 0,
              explain: (
                <>
                  Eigenvalue lớn nhất của <MathText tex="A^TA" /> là 9, nên{' '}
                  <MathText tex="\sigma_1=\sqrt9=3" />.
                </>
              ),
            },
          ]}
        />
      </Section>
    </Lesson>
  );
}
