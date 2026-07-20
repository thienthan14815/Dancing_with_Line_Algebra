import { Lesson, Section } from '../../components/Lesson';
import MathText from '../../components/MathText';
import CodePlayground from '../../components/CodePlayground';
import Quiz from '../../components/Quiz';

const CODE = `// === Least squares: tìm đường thẳng khớp nhất với dữ liệu ===
// Có 7 điểm (x, y) không thẳng hàng. Không đường thẳng nào đi
// qua HẾT -> hệ vô nghiệm. Least squares tìm đường sai lệch NHỎ
// NHẤT (tổng bình phương khoảng cách dọc = min).

const xs = [-3, -2, -1, 0, 1, 2, 3];
const ys = [-2.2, -1.1, -0.7, 0.3, 0.9, 1.8, 2.3];

// Ma trận thiết kế X: mỗi hàng [1, x]  ->  mô hình  y = b0 + b1·x
const X = xs.map(function (x) { return [1, x]; });

// Normal equation:  (Xᵀ X) β = Xᵀ y   (Chương 4: chiếu y lên C(X))
const Xt  = la.transpose(X);
const XtX = la.matMul(Xt, X);       // 2x2
const Xty = la.matVec(Xt, ys);      // vector độ dài 2
const sol = la.solveSystem(XtX, Xty);
const b0 = sol.solution[0];
const b1 = sol.solution[1];

// Vẽ điểm dữ liệu
for (let i = 0; i < xs.length; i++) {
  draw.point(xs[i], ys[i], { color: 'var(--vec-1)' });
}

// Đường fit (vẽ như một đoạn dài)
const L = -4, Rr = 4;
draw.segment(L, b0 + b1 * L, Rr, b0 + b1 * Rr, { color: 'var(--vec-2)', label: 'fit' });

// Đoạn residual (nét đứt) + tổng bình phương sai số
let sse = 0;
for (let i = 0; i < xs.length; i++) {
  const yhat = b0 + b1 * xs[i];
  draw.segment(xs[i], ys[i], xs[i], yhat, { color: 'var(--vec-result)', dashed: true });
  sse += (ys[i] - yhat) * (ys[i] - yhat);
}

print('Đường khớp:  y = ' + b0.toFixed(4) + ' + ' + b1.toFixed(4) + ' · x');
print('SSE (tổng bình phương sai số) = ' + sse.toFixed(4));`;

const NUMPY = `import numpy as np

xs = np.array([-3, -2, -1, 0, 1, 2, 3])
ys = np.array([-2.2, -1.1, -0.7, 0.3, 0.9, 1.8, 2.3])

# Ma trận thiết kế: cột 1 = 1, cột 2 = x
X = np.column_stack([np.ones_like(xs), xs])

# np.linalg.lstsq giải least squares thẳng luôn (không cần dựng normal equation)
beta, residuals, rank, sv = np.linalg.lstsq(X, ys, rcond=None)
b0, b1 = beta
print("y =", b0, "+", b1, "* x")

# Cách "tay": normal equation (Xᵀ X) β = Xᵀ y
beta2 = np.linalg.solve(X.T @ X, X.T @ ys)
print(beta2)`;

export default function LeastSquaresLesson() {
  return (
    <Lesson id="least-squares" title="Least squares fit">
      <p className="muted">
        Dữ liệu thật không bao giờ thẳng hàng hoàn hảo. Làm sao vẽ đường “hợp lý nhất” qua một đám
        điểm? Câu trả lời — <strong>least squares</strong> — là một trong những ứng dụng đẹp nhất
        của đại số tuyến tính.
      </p>

      <Section kind="theory" title="Bài toán: hệ vô nghiệm, ta vẫn muốn một lời giải">
        <p style={{ marginTop: 0 }}>
          Muốn đường <MathText tex={'y = b_0 + b_1 x'} /> đi qua cả 7 điểm, ta cần{' '}
          <MathText tex={'X\\beta = y'} /> với <MathText tex={'X'} /> là ma trận thiết kế (mỗi hàng{' '}
          <MathText tex={'[1,\\; x_i]'} />). Nhưng 7 phương trình, 2 ẩn — nói chung{' '}
          <strong>vô nghiệm</strong> (Chương 2). Vector <MathText tex={'y'} /> không nằm trong{' '}
          <MathText tex={'C(X)'} /> (column space, Chương 4).
        </p>
        <p>
          Ý tưởng: nếu không chạm được <MathText tex={'y'} />, hãy tìm điểm{' '}
          <em>gần nhất</em> trong <MathText tex={'C(X)'} /> — tức{' '}
          <strong>hình chiếu vuông góc</strong> của <MathText tex={'y'} /> lên column space. Điều
          kiện vuông góc dẫn thẳng tới <strong>normal equation</strong>:
        </p>
        <MathText block tex={'X^{\\top} X\\, \\beta = X^{\\top} y'} />
        <p>
          Đây là một hệ <em>vuông, có nghiệm</em> — giải bằng <code>la.solveSystem</code>. Nghiệm{' '}
          <MathText tex={'\\beta'} /> làm tổng bình phương các khoảng cách dọc (residual) nhỏ nhất.
        </p>
      </Section>

      <Section kind="explore" title="Chạy thử & nghịch code">
        <CodePlayground scene="2d" height={460} initialCode={CODE} numpyCode={NUMPY} />

        <div className="panel" style={{ marginTop: 12 }}>
          <strong>🎯 Thử thách</strong>:
          <ol style={{ marginBottom: 0 }}>
            <li>
              <strong>Fit parabol.</strong> Thêm cột <MathText tex={'x^2'} /> vào ma trận thiết kế —
              mô hình thành <MathText tex={'y = b_0 + b_1 x + b_2 x^2'} />. Toàn bộ máy móc y hệt,
              chỉ đổi <code>X</code>.
              <details>
                <summary>Gợi ý đáp án</summary>
                <pre style={{ whiteSpace: 'pre-wrap' }}>{`const X = xs.map(function (x) { return [1, x, x * x]; });
// ... sol.solution giờ có 3 hệ số [b0, b1, b2]
// vẽ đường cong bằng nhiều đoạn nhỏ:
const b = sol.solution;
let px = -4, py = b[0] + b[1]*px + b[2]*px*px;
for (let t = -4; t <= 4; t += 0.5) {
  const qy = b[0] + b[1]*t + b[2]*t*t;
  draw.segment(px, py, t, qy, { color: 'var(--vec-2)' });
  px = t; py = qy;
}`}</pre>
              </details>
            </li>
            <li>
              <strong>Thêm điểm ngoại lai (outlier).</strong> Nhét một điểm lạc lõng và xem đường
              fit bị “kéo” lệch thế nào.
              <details>
                <summary>Gợi ý đáp án</summary>
                <pre style={{ whiteSpace: 'pre-wrap' }}>{`xs.push(0);   ys.push(4.5);   // điểm ngoại lai ở giữa
// (đặt NGAY sau khi khai báo xs, ys rồi chạy lại)
// Least squares phạt BÌNH PHƯƠNG sai số nên rất nhạy với outlier.`}</pre>
              </details>
            </li>
            <li>
              <strong>So sánh sai số.</strong> In SSE của đường thẳng và của parabol trên cùng bộ
              điểm — parabol linh hoạt hơn nên SSE nhỏ hơn (hoặc bằng). Vì sao thêm cột không bao
              giờ làm SSE tăng?
              <details>
                <summary>Gợi ý</summary>
                <p style={{ margin: '6px 0 0' }}>
                  Thêm cột = mở rộng <MathText tex={'C(X)'} />. Không gian con lớn hơn thì hình
                  chiếu chỉ có thể gần <MathText tex={'y'} /> hơn (hoặc bằng), nên SSE không tăng.
                </p>
              </details>
            </li>
          </ol>
        </div>
      </Section>

      <Section kind="quiz" title="Kiểm tra hiểu">
        <Quiz
          lessonKey="ch7/least-squares"
          questions={[
            {
              q: <>Vì sao ta cần least squares thay vì giải trực tiếp <MathText tex={'X\\beta = y'} />?</>,
              options: [
                'Vì X không vuông nên không tính được nghịch đảo, và hệ thường vô nghiệm',
                'Vì y luôn bằng 0',
                'Vì máy tính không giải được hệ tuyến tính',
                'Vì least squares nhanh hơn Gauss elimination',
              ],
              answer: 0,
              explain: (
                <>
                  Nhiều điểm, ít tham số ⇒ <MathText tex={'y \\notin C(X)'} /> nên hệ vô nghiệm. Ta
                  tìm nghiệm <em>gần nhất</em> thay vì nghiệm chính xác.
                </>
              ),
            },
            {
              q: <>Normal equation <MathText tex={'X^{\\top}X\\beta = X^{\\top}y'} /> đến từ đâu?</>,
              options: [
                'Từ điều kiện residual vuông góc với column space C(X)',
                'Từ định lý Pythagoras cho tam giác vuông',
                'Từ việc lấy đạo hàm của determinant',
                'Từ phép nhân chéo hai vector',
              ],
              answer: 0,
              explain: (
                <>
                  Điểm gần <MathText tex={'y'} /> nhất trong <MathText tex={'C(X)'} /> là hình chiếu
                  vuông góc; sai số <MathText tex={'y - X\\beta'} /> phải vuông góc với mọi cột của{' '}
                  <MathText tex={'X'} />, tức <MathText tex={'X^{\\top}(y - X\\beta) = 0'} />.
                </>
              ),
            },
            {
              q: <>Thêm một điểm ngoại lai xa thường làm gì với đường fit?</>,
              options: [
                'Không ảnh hưởng gì',
                'Kéo đường lệch mạnh, vì sai số bị phạt theo bình phương',
                'Làm đường fit biến mất',
                'Làm SSE bằng 0',
              ],
              answer: 1,
              explain: (
                <>
                  Least squares tối thiểu <em>tổng bình phương</em> sai số, nên một điểm xa (sai số
                  lớn) bị phạt rất nặng và kéo đường về phía nó.
                </>
              ),
            },
          ]}
        />
      </Section>
    </Lesson>
  );
}
