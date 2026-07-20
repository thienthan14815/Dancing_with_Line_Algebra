import { useMemo, useState } from 'react';
import { Lesson, Section } from '../../components/Lesson';
import MathText from '../../components/MathText';
import Canvas2D from '../../components/Canvas2D';
import Slider from '../../components/Slider';
import Quiz from '../../components/Quiz';
import { eigenSymmetric, type Mat } from '../../lib/linalg';
import { f2, mulberry32 } from './util';

// Sinh đám mây điểm 2D tất định (cùng seed → cùng dữ liệu mỗi lần render).
function genCloud(): [number, number][] {
  const rng = mulberry32(20260720);
  const randn = () => {
    const u = Math.max(1e-9, rng());
    const v = rng();
    return Math.sqrt(-2 * Math.log(u)) * Math.cos(2 * Math.PI * v);
  };
  const ang = (28 * Math.PI) / 180;
  const ca = Math.cos(ang);
  const sa = Math.sin(ang);
  const mx = 0.3;
  const my = -0.2;
  const pts: [number, number][] = [];
  for (let i = 0; i < 60; i++) {
    const a = randn() * 1.7; // phương trải rộng
    const b = randn() * 0.5; // phương hẹp
    const x = a * ca - b * sa + mx;
    const y = a * sa + b * ca + my;
    pts.push([x, y]);
  }
  return pts;
}

export default function Lesson5PCA() {
  const cloud = useMemo(() => genCloud(), []);
  const [showAxes, setShowAxes] = useState(false);
  const [t, setT] = useState(0); // mức chiếu xuống PC1

  // Trung bình, ma trận hiệp phương sai (symmetric!), trục chính
  const { mean, cov, vals, vecs } = useMemo(() => {
    const N = cloud.length;
    let mx = 0;
    let my = 0;
    for (const [x, y] of cloud) {
      mx += x;
      my += y;
    }
    mx /= N;
    my /= N;
    let sxx = 0;
    let syy = 0;
    let sxy = 0;
    for (const [x, y] of cloud) {
      const dx = x - mx;
      const dy = y - my;
      sxx += dx * dx;
      syy += dy * dy;
      sxy += dx * dy;
    }
    const cov: Mat = [
      [sxx / N, sxy / N],
      [sxy / N, syy / N],
    ];
    const { values, vectors } = eigenSymmetric(cov);
    return { mean: [mx, my] as [number, number], cov, vals: values, vecs: vectors };
  }, [cloud]);

  const pc1 = vecs[0] ?? [1, 0];
  const pc2 = vecs[1] ?? [0, 1];
  const l1 = Math.max(0, vals[0] ?? 0);
  const l2 = Math.max(0, vals[1] ?? 0);
  const varExplained = l1 + l2 > 1e-9 ? (l1 / (l1 + l2)) * 100 : 0;

  // Điểm hiển thị: nội suy từ vị trí gốc về hình chiếu lên trục PC1
  const dispPoints = cloud.map(([x, y]) => {
    const dx = x - mean[0];
    const dy = y - mean[1];
    const proj = dx * pc1[0] + dy * pc1[1];
    const px = mean[0] + proj * pc1[0];
    const py = mean[1] + proj * pc1[1];
    return {
      x: x + (px - x) * t,
      y: y + (py - y) * t,
      color: 'var(--vec-result)',
    };
  });

  // Đoạn trục chính (dài theo 2·√λ để dễ nhìn), và đường PC1 kéo dài
  const axLen1 = 2.2 * Math.sqrt(l1);
  const axLen2 = 2.2 * Math.sqrt(l2);
  const segAxes = showAxes
    ? [
        {
          from: [mean[0] - pc1[0] * axLen1, mean[1] - pc1[1] * axLen1] as [number, number],
          to: [mean[0] + pc1[0] * axLen1, mean[1] + pc1[1] * axLen1] as [number, number],
          color: 'var(--vec-1)',
          label: 'PC1',
        },
        {
          from: [mean[0] - pc2[0] * axLen2, mean[1] - pc2[1] * axLen2] as [number, number],
          to: [mean[0] + pc2[0] * axLen2, mean[1] + pc2[1] * axLen2] as [number, number],
          color: 'var(--vec-2)',
          label: 'PC2',
        },
      ]
    : [];

  // Đường PC1 mờ kéo dài để điểm "đáp" vào khi chiếu
  const line = t > 0.01
    ? [
        {
          from: [mean[0] - pc1[0] * 8, mean[1] - pc1[1] * 8] as [number, number],
          to: [mean[0] + pc1[0] * 8, mean[1] + pc1[1] * 8] as [number, number],
          color: 'var(--vec-1)',
          dashed: true,
        },
      ]
    : [];

  return (
    <Lesson id="ch6-pca" title="PCA sơ lược">
      <p className="muted">
        <b>Principal Component Analysis</b> (PCA) là ứng dụng “đắt giá” nhất của những ý
        tưởng ta vừa học. Cho một đám mây dữ liệu, PCA tìm ra các <b>trục tự nhiên</b> của
        nó — hướng dữ liệu trải rộng nhất — rồi cho phép ta <b>giảm chiều</b> mà giữ lại
        nhiều thông tin nhất. Chìa khóa lại là ma trận đối xứng và eigenvector.
      </p>

      <Section kind="explore" title="Tìm trục chính & chiếu dữ liệu">
        <p className="muted" style={{ marginTop: 0 }}>
          <b>Gợi ý thao tác:</b> Bấm <b>Tìm trục chính</b> để lộ hai trục PCA (dài theo độ
          trải <MathText tex="\sqrt{\lambda}" />). Rồi kéo Slider để <b>chiếu</b> mọi điểm
          xuống trục chính thứ nhất — dữ liệu 2D sụp về 1 chiều nhưng vẫn giữ được phần lớn
          “hình dáng”.
        </p>

        <div className="row" style={{ alignItems: 'flex-start', gap: 24 }}>
          <div style={{ flex: '1 1 280px', minWidth: 250 }}>
            <div className="row" style={{ gap: 8 }}>
              <button
                className={`btn ${showAxes ? 'btn-primary' : ''}`}
                onClick={() => setShowAxes((s) => !s)}
              >
                🧭 {showAxes ? 'Ẩn trục chính' : 'Tìm trục chính'}
              </button>
            </div>
            <div style={{ marginTop: 12 }}>
              <Slider
                label="Mức chiếu xuống PC1"
                min={0}
                max={1}
                value={t}
                onChange={(v) => { setT(v); if (v > 0) setShowAxes(true); }}
                format={(v) => `${Math.round(v * 100)}%`}
              />
            </div>

            <div className="panel" style={{ marginTop: 12, fontSize: 13.5 }}>
              <div style={{ marginBottom: 6 }}>Ma trận hiệp phương sai (đối xứng):</div>
              <MathText
                block
                tex={`C = \\begin{bmatrix} ${f2(cov[0][0])} & ${f2(cov[0][1])} \\\\ ${f2(cov[1][0])} & ${f2(cov[1][1])} \\end{bmatrix}`}
              />
              <div style={{ color: 'var(--text-muted)' }}>
                λ₁ = <span className="mono">{f2(l1)}</span>, λ₂ ={' '}
                <span className="mono">{f2(l2)}</span>
              </div>
              <div style={{ marginTop: 6, color: 'var(--vec-1)', fontWeight: 600 }}>
                PC1 giữ {f2(varExplained)}% phương sai
              </div>
              <div className="dim" style={{ fontSize: 12, marginTop: 4 }}>
                Chỉ giữ 1 chiều mà vẫn giữ được {f2(varExplained)}% biến thiên của dữ liệu.
              </div>
            </div>
          </div>

          <div style={{ flex: '2 1 340px', minWidth: 300 }}>
            <Canvas2D
              height={420}
              range={5}
              points={dispPoints}
              segments={[...line, ...segAxes]}
            />
            <p className="dim" style={{ fontSize: 12, textAlign: 'center' }}>
              {t > 0.99
                ? 'Dữ liệu đã nằm gọn trên PC1 — giảm từ 2D xuống 1D.'
                : 'Đám mây dữ liệu 2D (tương quan, elip nghiêng).'}
            </p>
          </div>
        </div>
      </Section>

      <Section kind="theory" title="Covariance matrix, eigenvector & đổi cơ sở">
        <p>
          Với dữ liệu đã trừ trung bình, <b>ma trận hiệp phương sai</b> đo mức độ dữ liệu
          trải và tương quan giữa các chiều:
        </p>
        <MathText block tex="C = \frac{1}{N} X^{T} X = \begin{bmatrix} \operatorname{var}(x) & \operatorname{cov}(x,y) \\ \operatorname{cov}(x,y) & \operatorname{var}(y) \end{bmatrix}" />
        <p>
          Để ý <MathText tex="C" /> có dạng <MathText tex="X^{T}X" /> nên nó{' '}
          <b>đối xứng</b> — đúng dạng đã gặp ở bài AᵀA! Theo chương 5, ma trận đối xứng có
          hệ eigenvector <b>trực giao</b>. Các eigenvector này chính là các{' '}
          <b>principal component</b>:
        </p>
        <ul>
          <li>
            Eigenvector ứng với <MathText tex="\lambda" /> <b>lớn nhất</b> = hướng dữ liệu
            trải rộng nhất = <b>PC1</b>.
          </li>
          <li>
            Eigenvalue <MathText tex="\lambda_i" /> = <b>phương sai</b> của dữ liệu dọc theo
            trục đó. Tỉ lệ <MathText tex="\lambda_1/(\lambda_1+\lambda_2)" /> là phần thông
            tin PC1 giữ được.
          </li>
        </ul>
        <p>
          PCA thực chất là <b>đổi sang cơ sở tự nhiên</b> của dữ liệu (chương 4): xoay hệ
          trục về đúng các hướng principal component, nơi các chiều <b>không còn tương
          quan</b>. Muốn giảm chiều, ta chỉ việc bỏ bớt các trục có <MathText tex="\lambda" />{' '}
          nhỏ — y hệt tinh thần <b>rank-k</b> ở bài nén ảnh.
        </p>
        <p className="muted">
          <b>Nối cả chương 4–5–6.</b> PCA = eigen của covariance (chương 5) = đổi cơ sở
          (chương 4) = giữ thành phần lớn nhất, bỏ thành phần nhỏ (SVD/Eckart–Young, chương
          6). Thực tế, PCA thường được tính <i>trực tiếp</i> bằng SVD của ma trận dữ liệu.
          Ứng dụng: nén dữ liệu, khử nhiễu, trực quan hóa dữ liệu nhiều chiều, nhận dạng
          khuôn mặt (eigenfaces)…
        </p>
      </Section>

      <Section kind="quiz" title="Kiểm tra hiểu">
        <Quiz
          lessonKey="ch6/pca"
          questions={[
            {
              q: <>Ma trận hiệp phương sai <MathText tex="C" /> có dạng đặc biệt nào?</>,
              options: [
                <>Đối xứng (nên có eigenvector trực giao)</>,
                <>Phản đối xứng</>,
                <>Tam giác trên</>,
                <>Không có gì đặc biệt</>,
              ],
              answer: 0,
              explain: (
                <>
                  <MathText tex="C=\frac1N X^TX" /> nên <MathText tex="C^T=C" />. Ma trận
                  đối xứng ⇒ eigenvector trực giao, eigenvalue thực — nền tảng của PCA.
                </>
              ),
            },
            {
              q: <>PC1 (principal component thứ nhất) là gì?</>,
              options: [
                <>Eigenvector ứng với eigenvalue LỚN nhất của <MathText tex="C" /></>,
                <>Eigenvector ứng với eigenvalue nhỏ nhất</>,
                <>Trục Ox</>,
                <>Trung bình của dữ liệu</>,
              ],
              answer: 0,
              explain: (
                <>
                  Hướng phương sai lớn nhất = eigenvector của <MathText tex="C" /> ứng với{' '}
                  <MathText tex="\lambda" /> lớn nhất.
                </>
              ),
            },
            {
              q: <>Eigenvalue <MathText tex="\lambda_i" /> của <MathText tex="C" /> cho biết điều gì?</>,
              options: [
                <>Phương sai của dữ liệu dọc theo trục PCᵢ</>,
                <>Số điểm dữ liệu</>,
                <>Góc nghiêng của trục</>,
                <>Trung bình dữ liệu</>,
              ],
              answer: 0,
              explain: (
                <>
                  <MathText tex="\lambda_i" /> = phương sai theo hướng đó; tỉ lệ của nó cho
                  biết PC đó giữ bao nhiêu phần thông tin.
                </>
              ),
            },
            {
              q: <>PCA liên hệ thế nào với những chương trước?</>,
              options: [
                <>Là đổi cơ sở (ch4) sang eigenvector của covariance (ch5), giữ thành phần lớn (SVD, ch6)</>,
                <>Không liên quan gì</>,
                <>Chỉ là phép cộng vector</>,
                <>Chỉ dùng cho ma trận 2×2</>,
              ],
              answer: 0,
              explain: (
                <>
                  PCA gói gọn cả ba ý: đổi cơ sở, eigen của ma trận đối xứng, và giữ thành
                  phần quan trọng nhất — chính là mạch xuyên suốt chương 4–5–6.
                </>
              ),
            },
          ]}
        />
      </Section>
    </Lesson>
  );
}
