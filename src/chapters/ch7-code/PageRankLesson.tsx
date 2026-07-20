import { Lesson, Section } from '../../components/Lesson';
import MathText from '../../components/MathText';
import CodePlayground from '../../components/CodePlayground';
import Quiz from '../../components/Quiz';

const CODE = `// === PageRank: thuật toán từng đưa Google lên đỉnh ===
// Ý tưởng: một trang QUAN TRỌNG nếu được nhiều trang quan trọng
// khác trỏ tới. Ta mô hình "người lướt web ngẫu nhiên" bằng một
// ma trận chuyển, rồi tìm phân bố dừng.

const n = 4;
// Vị trí node để vẽ (cố định)
const pos = [[-2.5, 2], [2.5, 2], [2.5, -2], [-2.5, -2]];
// Cạnh có hướng [from, to]:  0->1, 0->2, 1->2, 2->0, 3->0, 3->2
const edges = [[0, 1], [0, 2], [1, 2], [2, 0], [3, 0], [3, 2]];
const out   = [2, 1, 1, 2];   // số liên kết ĐI RA của mỗi trang

// Ma trận chuyển P (cột-stochastic): P[i][j] = 1/out[j] nếu j -> i
const P = [];
for (let i = 0; i < n; i++) P.push(new Array(n).fill(0));
for (let e = 0; e < edges.length; e++) {
  const from = edges[e][0], to = edges[e][1];
  P[to][from] = 1 / out[from];
}

// Google matrix:  M = d·P + (1-d)/n   (d = damping = xác suất đi theo link)
const d = 0.85;
const M = [];
for (let i = 0; i < n; i++) {
  const row = [];
  for (let j = 0; j < n; j++) row.push(d * P[i][j] + (1 - d) / n);
  M.push(row);
}

// Power iteration: x <- M x  (lặp tới khi hội tụ)
let x = new Array(n).fill(1 / n);
for (let iter = 0; iter < 60; iter++) {
  x = la.matVec(M, x);
  const s = x.reduce(function (a, b) { return a + b; }, 0);
  x = x.map(function (v) { return v / s; });   // chuẩn hóa tổng = 1
}

// Vẽ cạnh rồi vẽ node (nhãn kèm % rank)
for (let e = 0; e < edges.length; e++) {
  const a = pos[edges[e][0]], b = pos[edges[e][1]];
  draw.segment(a[0], a[1], b[0], b[1], { color: 'var(--text-dim)' });
}
for (let i = 0; i < n; i++) {
  draw.point(pos[i][0], pos[i][1], {
    color: 'var(--vec-1)',
    label: 'P' + (i + 1) + '  ' + (x[i] * 100).toFixed(1) + '%',
  });
}

// Xếp hạng
const rankOrder = x.map(function (v, i) { return [i, v]; })
                   .sort(function (a, b) { return b[1] - a[1]; });
print('=== Xếp hạng PageRank ===');
for (let r = 0; r < rankOrder.length; r++) {
  print('#' + (r + 1) + '  Trang ' + (rankOrder[r][0] + 1) +
        '  =  ' + (rankOrder[r][1] * 100).toFixed(2) + '%');
}`;

const NUMPY = `import numpy as np

n = 4
edges = [(0, 1), (0, 2), (1, 2), (2, 0), (3, 0), (3, 2)]
out = np.array([2, 1, 1, 2])

P = np.zeros((n, n))
for f, t in edges:
    P[t, f] = 1 / out[f]

d = 0.85
M = d * P + (1 - d) / n * np.ones((n, n))

# Cách 1: power iteration
x = np.full(n, 1 / n)
for _ in range(60):
    x = M @ x
    x = x / x.sum()
print("PageRank:", x)

# Cách 2: PageRank = eigenvector ứng với eigenvalue = 1
vals, vecs = np.linalg.eig(M)
i = np.argmin(np.abs(vals - 1))
r = np.real(vecs[:, i])
print(r / r.sum())`;

export default function PageRankLesson() {
  return (
    <Lesson id="pagerank" title="Markov chain & PageRank">
      <p className="muted">
        Năm 1998, hai nghiên cứu sinh xếp hạng toàn bộ web bằng một phép nhân ma trận lặp đi lặp
        lại. Thuật toán đó — <strong>PageRank</strong> — thực chất là đi tìm một{' '}
        <strong>eigenvector</strong>. Ta sẽ tự cài nó trong vài dòng.
      </p>

      <Section kind="theory" title="Bài toán: trang nào quan trọng nhất?">
        <p style={{ marginTop: 0 }}>
          Hình dung một người <em>lướt web ngẫu nhiên</em>: đang ở một trang, họ bấm ngẫu nhiên một
          link đi ra. Cột <MathText tex={'j'} /> của ma trận chuyển <MathText tex={'P'} /> là phân
          bố xác suất nhảy từ trang <MathText tex={'j'} /> sang các trang khác (nên{' '}
          <MathText tex={'P'} /> <strong>cột-stochastic</strong>: mỗi cột cộng lại bằng 1).
        </p>
        <p>
          Để tránh kẹt ở trang cụt và bảo đảm hội tụ, ta pha thêm xác suất{' '}
          <MathText tex={'1-d'} /> “nhảy đại” tới một trang bất kỳ:{' '}
          <MathText tex={'M = dP + \\tfrac{1-d}{n}\\mathbf{1}'} /> (thường{' '}
          <MathText tex={'d = 0.85'} />). Lặp <MathText tex={'x \\leftarrow M x'} /> nhiều lần, phân
          bố hội tụ về <strong>trạng thái dừng</strong> — đó chính là điểm quan trọng của mỗi trang.
        </p>
        <p>
          <strong>Đây chính là eigenvector của <MathText tex={'\\lambda = 1'} /></strong>: trạng
          thái dừng thỏa <MathText tex={'Mx = x'} />. Việc lặp <MathText tex={'M^k x_0'} /> chính là{' '}
          <em>lũy thừa ma trận</em> ở Chương 5 — quỹ đạo hội tụ về hướng của eigenvector trội.
        </p>
      </Section>

      <Section kind="explore" title="Chạy thử & nghịch code">
        <CodePlayground scene="2d" height={460} initialCode={CODE} numpyCode={NUMPY} />
        <p className="dim" style={{ fontSize: 12.5 }}>
          Nhãn mỗi node hiện phần trăm rank. (Điểm vẽ có kích thước cố định nên ta thể hiện thứ hạng
          qua nhãn và bảng xếp hạng ở khung output.)
        </p>

        <div className="panel" style={{ marginTop: 12 }}>
          <strong>🎯 Thử thách</strong>:
          <ol style={{ marginBottom: 0 }}>
            <li>
              <strong>Thêm một trang mới trỏ về Trang 1.</strong> Nâng <code>n</code> lên 5, thêm
              tọa độ, cạnh và cập nhật <code>out</code>. Rank của Trang 1 tăng lên chứ?
              <details>
                <summary>Gợi ý đáp án</summary>
                <pre style={{ whiteSpace: 'pre-wrap' }}>{`const n = 5;
const pos = [[-2.5,2],[2.5,2],[2.5,-2],[-2.5,-2],[0,0]];
const edges = [[0,1],[0,2],[1,2],[2,0],[3,0],[3,2],[4,0]]; // 4 -> 0
const out = [2, 1, 1, 2, 1];`}</pre>
              </details>
            </li>
            <li>
              <strong>Bỏ damping.</strong> Đặt <code>d = 1</code>. Với đồ thị có chu trình hút, rank
              dồn hết vào một cụm — đó là lý do Google cần damping.
              <details>
                <summary>Gợi ý</summary>
                <p style={{ margin: '6px 0 0' }}>
                  Không có “nhảy đại”, người lướt có thể bị kẹt vĩnh viễn trong một nhóm trang, làm
                  các trang còn lại rank ≈ 0 và nghiệm dừng có thể không duy nhất.
                </p>
              </details>
            </li>
            <li>
              <strong>Đổi cấu trúc link.</strong> Thêm/bớt vài cạnh trong <code>edges</code> (nhớ
              chỉnh <code>out</code> cho khớp) và xem thứ hạng đảo lộn ra sao.
            </li>
            <li>
              <strong>Đối chiếu với eigenvector.</strong> In <code>x</code> sau khi lặp, rồi so với
              eigenvector <MathText tex={'\\lambda = 1'} /> (tab NumPy). Chúng phải trùng nhau.
            </li>
          </ol>
        </div>
      </Section>

      <Section kind="quiz" title="Kiểm tra hiểu">
        <Quiz
          lessonKey="ch7/pagerank"
          questions={[
            {
              q: <>Trạng thái dừng của PageRank, về bản chất toán học, là gì?</>,
              options: [
                'Eigenvector của ma trận Google M ứng với eigenvalue = 1',
                'Determinant của ma trận chuyển',
                'Nghiệm của một hệ vô nghiệm',
                'Vector riêng ứng với eigenvalue lớn nhất về giá trị tuyệt đối nhưng khác 1',
              ],
              answer: 0,
              explain: (
                <>
                  Trạng thái dừng thỏa <MathText tex={'Mx = x'} />, tức eigenvector của{' '}
                  <MathText tex={'\\lambda = 1'} />. Ma trận stochastic luôn có eigenvalue 1.
                </>
              ),
            },
            {
              q: <>Lặp <MathText tex={'x \\leftarrow M x'} /> nhiều lần liên hệ với chương nào?</>,
              options: [
                'Lũy thừa ma trận (Chương 5): M^k x hội tụ về eigenvector trội',
                'Cross product (Chương 1)',
                'Gauss elimination (Chương 2)',
                'Determinant (Chương 3)',
              ],
              answer: 0,
              explain: (
                <>
                  Lặp chính là nhân lũy thừa <MathText tex={'M^k x_0'} />; thành phần theo hướng
                  eigenvector trội (ở đây <MathText tex={'\\lambda = 1'} />) sống sót, các hướng còn
                  lại tắt dần.
                </>
              ),
            },
            {
              q: <>Vì sao cần hệ số damping <MathText tex={'d = 0.85'} /> thay vì <MathText tex={'d = 1'} />?</>,
              options: [
                'Để bảo đảm hội tụ về một nghiệm duy nhất và tránh kẹt ở trang cụt/chu trình',
                'Để rank cộng lại bằng 100 cho đẹp',
                'Để ma trận trở nên đối xứng',
                'Để tăng tốc phép nhân ma trận',
              ],
              answer: 0,
              explain: (
                <>
                  Xác suất “nhảy đại” <MathText tex={'1-d'} /> làm ma trận dương ngặt, bảo đảm có
                  eigenvector dừng duy nhất, dương, và power iteration hội tụ.
                </>
              ),
            },
          ]}
        />
      </Section>
    </Lesson>
  );
}
