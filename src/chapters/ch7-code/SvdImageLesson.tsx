import { Lesson, Section } from '../../components/Lesson';
import MathText from '../../components/MathText';
import CodePlayground from '../../components/CodePlayground';
import Quiz from '../../components/Quiz';

const CODE = `// === Nén ảnh bằng SVD ===
// Một ảnh xám = ma trận số. SVD tách nó thành tổng các "lớp"
// xếp theo mức quan trọng (singular value). Giữ vài lớp đầu ->
// nén ảnh mà vẫn nhận ra hình. Ta in "ảnh ASCII" để thấy tận mắt.

const N = 16;

// Tạo ảnh 16x16 bằng công thức: một khuôn mặt cười
function pixel(r, c) {
  const x = (c - (N - 1) / 2) / (N / 2);   // toạ độ chuẩn hoá [-1,1]
  const y = ((N - 1) / 2 - r) / (N / 2);
  const rad = Math.sqrt(x * x + y * y);
  let v = 0.1;                             // nền
  if (rad > 0.72 && rad < 0.98) v = 1;     // viền mặt
  if (Math.abs(Math.abs(x) - 0.35) < 0.13 && Math.abs(y - 0.3) < 0.16) v = 1; // hai mắt
  if (rad > 0.35 && rad < 0.6 && y < -0.05) v = 1;                            // miệng cười
  return v;
}
const A = [];
for (let r = 0; r < N; r++) {
  const row = [];
  for (let c = 0; c < N; c++) row.push(pixel(r, c));
  A.push(row);
}

// Phân tích SVD:  A = U · diag(S) · Vᵀ
const svd = la.svd(A);
const U = svd.U, S = svd.S, V = svd.V;

// Tái tạo rank-k:  Aₖ = Σ_{i<k}  S[i] · U[:,i] · V[:,i]ᵀ
function reconstruct(k) {
  const B = [];
  for (let r = 0; r < N; r++) {
    const row = [];
    for (let c = 0; c < N; c++) {
      let s = 0;
      for (let i = 0; i < k; i++) s += S[i] * U[r][i] * V[c][i];
      row.push(s);
    }
    B.push(row);
  }
  return B;
}

// Vẽ ma trận thành ASCII (mỗi ô nhân đôi ký tự cho vuông)
const RAMP = ' .:-=+*#%@';
function render(M) {
  let lo = Infinity, hi = -Infinity;
  for (let r = 0; r < N; r++) for (let c = 0; c < N; c++) {
    if (M[r][c] < lo) lo = M[r][c];
    if (M[r][c] > hi) hi = M[r][c];
  }
  const lines = [];
  for (let r = 0; r < N; r++) {
    let line = '';
    for (let c = 0; c < N; c++) {
      let t = (M[r][c] - lo) / (hi - lo + 1e-9);
      t = Math.max(0, Math.min(1, t));
      const ch = RAMP[Math.round(t * (RAMP.length - 1))];
      line += ch + ch;
    }
    lines.push(line);
  }
  return lines.join('\\n');
}

const k = 3;
print('=== Ảnh gốc (rank đầy đủ) ===');
print(render(A));
print('');
print('=== Nén rank-' + k + ' ===');
print(render(reconstruct(k)));
print('');
const full = N * N;
const stored = k * (N + N + 1);
print('Lưu gốc:      ' + full + ' số');
print('Lưu rank-' + k + ':   ' + stored + ' số  (' +
      (100 * stored / full).toFixed(1) + '% dữ liệu)');
print('Singular values: ' +
      JSON.stringify(S.slice(0, 8).map(function (s) { return +s.toFixed(2); })));`;

const NUMPY = `import numpy as np

N = 16
r, c = np.mgrid[0:N, 0:N]
x = (c - (N - 1) / 2) / (N / 2)
y = ((N - 1) / 2 - r) / (N / 2)
rad = np.hypot(x, y)

A = np.full((N, N), 0.1)
A[(rad > 0.72) & (rad < 0.98)] = 1                                  # viền mặt
A[(np.abs(np.abs(x) - 0.35) < 0.13) & (np.abs(y - 0.3) < 0.16)] = 1 # mắt
A[(rad > 0.35) & (rad < 0.6) & (y < -0.05)] = 1                     # miệng

# SVD:  A = U @ diag(S) @ Vt
U, S, Vt = np.linalg.svd(A)

k = 3
A_k = U[:, :k] @ np.diag(S[:k]) @ Vt[:k, :]   # tái tạo rank-k

print("singular values:", S[:8].round(2))
print("nén còn", 100 * k * (2 * N + 1) / (N * N), "% dữ liệu")`;

export default function SvdImageLesson() {
  return (
    <Lesson id="svd-image" title="Nén ảnh bằng SVD">
      <p className="muted">
        JPEG, mạng nơ-ron, hệ gợi ý phim… tất cả đều dựa trên một ý tưởng: hầu hết dữ liệu thật có
        thể xấp xỉ bằng vài “thành phần chính”. <strong>SVD</strong> (Chương 6) cho ta cách chọn ra
        đúng những thành phần đó.
      </p>

      <Section kind="theory" title="Bài toán: giữ ít số mà vẫn giống ảnh gốc">
        <p style={{ marginTop: 0 }}>
          Một ảnh xám <MathText tex={'N \\times N'} /> là một ma trận <MathText tex={'A'} /> với{' '}
          <MathText tex={'N^2'} /> con số. SVD viết nó thành tổng các lớp rank-1, xếp theo{' '}
          <em>singular value</em> giảm dần:
        </p>
        <MathText
          block
          tex={
            'A = \\sum_{i=1}^{r} \\sigma_i\\, u_i v_i^{\\top}, \\qquad \\sigma_1 \\ge \\sigma_2 \\ge \\cdots \\ge 0'
          }
        />
        <p>
          Những lớp đầu (σ lớn) mang phần lớn “nội dung”; các lớp sau chỉ là chi tiết vụn. Giữ lại{' '}
          <MathText tex={'k'} /> lớp đầu cho <strong>xấp xỉ rank-k tốt nhất</strong> (định lý
          Eckart–Young, Chương 6). Thay vì <MathText tex={'N^2'} /> số, ta chỉ lưu{' '}
          <MathText tex={'k(2N+1)'} /> số — đó là <em>nén</em>.
        </p>
      </Section>

      <Section kind="explore" title="Chạy thử & nghịch code">
        <CodePlayground scene="none" height={520} initialCode={CODE} numpyCode={NUMPY} />
        <p className="dim" style={{ fontSize: 12.5 }}>
          Kết quả in ra dạng “ảnh ASCII” trong khung output — dùng dãy ký tự{' '}
          <code style={{ letterSpacing: 1 }}>{' .:-=+*#%@'}</code> từ nhạt tới đậm. Cuộn khung output
          để so sánh ảnh gốc và ảnh nén rank-3.
        </p>

        <div className="panel" style={{ marginTop: 12 }}>
          <strong>🎯 Thử thách</strong>:
          <ol style={{ marginBottom: 0 }}>
            <li>
              <strong>Đổi k.</strong> Thử <code>const k = 1;</code> rồi 2, 5, 10. Xem chất lượng
              tăng dần thế nào — và từ k bao nhiêu thì mắt hết phân biệt được với ảnh gốc?
            </li>
            <li>
              <strong>Ảnh rank thấp tự nhiên: sọc chéo.</strong> Đổi hàm <code>pixel</code> để tạo
              sọc chéo — loại ảnh này chỉ cần rank rất nhỏ đã tái tạo gần hoàn hảo.
              <details>
                <summary>Gợi ý đáp án</summary>
                <pre style={{ whiteSpace: 'pre-wrap' }}>{`function pixel(r, c) {
  return 0.5 + 0.5 * Math.sin((r + c) * 0.9);  // sọc chéo
}
// Thử k = 1 hoặc 2 -> đã gần như y hệt gốc!`}</pre>
              </details>
            </li>
            <li>
              <strong>Ảnh nhiễu: rank cao.</strong> Dùng nhiễu ngẫu nhiên tất định — không nén được
              vì mọi singular value đều đáng kể.
              <details>
                <summary>Gợi ý đáp án</summary>
                <pre style={{ whiteSpace: 'pre-wrap' }}>{`function pixel(r, c) {
  const h = Math.sin(r * 12.9898 + c * 78.233) * 43758.5453;
  return h - Math.floor(h);   // nhiễu "băm" tất định trong [0,1)
}
// In S: các singular value giảm rất chậm -> khó nén.`}</pre>
              </details>
            </li>
            <li>
              <strong>Xem singular values giảm nhanh cỡ nào.</strong> In cả <code>S</code>. Với ảnh
              có cấu trúc, vài giá trị đầu lớn vượt trội rồi tụt nhanh về gần 0 — đó là “vì sao nén
              được”.
            </li>
          </ol>
        </div>
      </Section>

      <Section kind="quiz" title="Kiểm tra hiểu">
        <Quiz
          lessonKey="ch7/svd-image"
          questions={[
            {
              q: <>Vì sao giữ lại vài lớp SVD đầu tiên đã đủ tái tạo ảnh có cấu trúc?</>,
              options: [
                'Vì singular value giảm nhanh: vài lớp đầu chứa gần hết "năng lượng" của ảnh',
                'Vì các lớp sau bằng đúng 0',
                'Vì SVD chỉ có tối đa 3 lớp',
                'Vì ma trận ảnh luôn khả nghịch',
              ],
              answer: 0,
              explain: (
                <>
                  Ảnh có cấu trúc ⇒ <MathText tex={'\\sigma_i'} /> tụt nhanh; giữ k lớp đầu là xấp
                  xỉ rank-k tốt nhất (Eckart–Young).
                </>
              ),
            },
            {
              q: (
                <>
                  Ảnh <MathText tex={'N \\times N'} /> gốc có <MathText tex={'N^2'} /> số. Xấp xỉ
                  rank-k lưu bao nhiêu số?
                </>
              ),
              options: [
                <MathText tex={'k(2N+1)'} />,
                <MathText tex={'N^2'} />,
                <MathText tex={'k^2'} />,
                <MathText tex={'2N'} />,
              ],
              answer: 0,
              explain: (
                <>
                  Mỗi lớp cần một vector <MathText tex={'u_i'} /> (N số), một{' '}
                  <MathText tex={'v_i'} /> (N số) và một <MathText tex={'\\sigma_i'} /> ⇒{' '}
                  <MathText tex={'k(2N+1)'} /> số cho k lớp.
                </>
              ),
            },
            {
              q: <>Ảnh nhiễu ngẫu nhiên khó nén bằng SVD vì sao?</>,
              options: [
                'Không có cấu trúc nên các singular value gần bằng nhau, không lớp nào trội',
                'Vì nhiễu làm SVD báo lỗi',
                'Vì nhiễu khiến ma trận không vuông',
                'Vì mọi singular value đều bằng 0',
              ],
              answer: 0,
              explain: (
                <>
                  Nhiễu trải đều “năng lượng” ra mọi hướng ⇒ <MathText tex={'\\sigma_i'} /> giảm rất
                  chậm, phải giữ gần hết lớp mới đủ giống — tức không nén được.
                </>
              ),
            },
          ]}
        />
      </Section>

      <Section kind="theory" title="Đi tiếp đâu?">
        <p style={{ marginTop: 0 }}>
          Bạn vừa dùng đại số tuyến tính để xoay hình, khớp dữ liệu, xếp hạng web và nén ảnh — bốn
          bài toán tưởng chừng chẳng liên quan, hóa ra cùng một bộ công cụ. Nếu muốn đi sâu hơn:
        </p>
        <ul>
          <li>
            <strong>3Blue1Brown — “Essence of Linear Algebra”.</strong> Loạt video hình dung tuyệt
            đẹp về vector, ma trận, determinant, eigenvector. Xem lại sau chương này bạn sẽ thấy “à,
            hóa ra là thế”.
          </li>
          <li>
            <strong>Gilbert Strang — MIT 18.06 “Linear Algebra”.</strong> Khóa học kinh điển (video
            + sách) đi từ four subspaces tới SVD một cách chặt chẽ mà vẫn trực giác.
          </li>
          <li>
            <strong>Đọc chính source của app này.</strong> Mở{' '}
            <code>src/lib/linalg.ts</code> — toàn bộ toán con bạn vừa gọi (<code>rotation2D</code>,{' '}
            <code>solveSystem</code>, <code>matMul</code>, <code>svd</code>,{' '}
            <code>eigenSymmetric</code>…) đều nằm trong <em>một file</em> mà giờ bạn đã đủ sức đọc
            hiểu. Không có phép màu nào cả — chỉ là những vòng lặp trên các con số, đúng như bạn vừa
            tự viết.
          </li>
        </ul>
      </Section>
    </Lesson>
  );
}
