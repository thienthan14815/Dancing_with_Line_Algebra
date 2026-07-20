import { useState } from 'react';
import { Lesson, Section } from '../../components/Lesson';
import MathText from '../../components/MathText';
import Canvas2D, { useCanvas2D } from '../../components/Canvas2D';
import Slider from '../../components/Slider';
import StepByStep from '../../components/StepByStep';
import Quiz from '../../components/Quiz';
import { polyRidgeFit, polyEval, polyTrainMSE, f3 } from './util';
import { Stat, StatRow, Hint, BridgeLA, TwoCol } from './_shared';

// Dữ liệu nhiễu cố định trên [-1, 1] — xu hướng đi lên nhẹ, có nhiễu.
const QXS = [-1, -0.8, -0.6, -0.35, -0.15, 0.05, 0.25, 0.45, 0.65, 0.85, 1];
const QYS = [-0.3, -0.05, -0.22, 0.2, 0.3, 0.55, 0.4, 0.8, 0.62, 1.02, 0.85];

const RANGE = 1.6;

function FitCurve({ coeffs, color }: { coeffs: number[]; color: string }) {
  const { toScreen } = useCanvas2D();
  const pts: string[] = [];
  for (let x = -1; x <= 1.0001; x += 0.01) {
    const y = polyEval(coeffs, x);
    pts.push(toScreen(x, y).join(','));
  }
  return <polyline points={pts.join(' ')} fill="none" stroke={color} strokeWidth={2.5} />;
}

export default function GeneralizationLesson() {
  const [deg, setDeg] = useState(9);
  const [lambda, setLambda] = useState(0);

  const coeffs = polyRidgeFit(QXS, QYS, deg, lambda);
  const trainMSE = polyTrainMSE(QXS, QYS, coeffs);
  // "Độ lớn" của mô hình: chuẩn của vector hệ số (bỏ qua hệ số chệch c0).
  const weightNorm = Math.sqrt(coeffs.slice(1).reduce((s, c) => s + c * c, 0));

  const points = QXS.map((x, i) => ({ x, y: QYS[i], color: 'var(--vec-1)' }));
  const overfitRisk = deg >= 6 && lambda < 0.02;
  const curveColor = overfitRisk ? 'var(--vec-result)' : 'var(--vec-2)';

  return (
    <Lesson id="generalization" title="Overfitting & Regularization">
      <p className="muted">
        Một mô hình khớp <em>hoàn hảo</em> dữ liệu huấn luyện chưa chắc đã tốt — nó có thể đang học
        thuộc cả nhiễu. Mục tiêu thật sự của học máy là <strong>tổng quát hóa</strong>: dự đoán đúng
        trên dữ liệu <em>chưa từng thấy</em>. Bài này về sự đánh đổi đó và cách kìm nó bằng{' '}
        <strong>regularization</strong>.
      </p>

      <Section kind="explore" title="Bậc đa thức càng cao, càng dễ 'học vẹt'">
        <p className="muted" style={{ marginTop: 0 }}>
          Khớp đa thức bậc <MathText tex={'d'} /> cho 11 điểm nhiễu. Tăng <MathText tex={'d'} /> →
          đường uốn lượn qua gần như mọi điểm nhưng <strong>lệch xu hướng</strong> (overfit). Tăng{' '}
          <strong>weight decay</strong> <MathText tex={'\\lambda'} /> → phạt hệ số lớn, đường{' '}
          <strong>mượt</strong> trở lại.
        </p>

        <TwoCol>
          <Canvas2D height={400} range={RANGE} showGrid showAxes points={points}>
            <FitCurve coeffs={coeffs} color={curveColor} />
          </Canvas2D>

          <div>
            <div className="panel">
              <Slider
                label="d — bậc đa thức (độ phức tạp mô hình)"
                min={1}
                max={9}
                step={1}
                value={deg}
                onChange={(v) => setDeg(Math.round(v))}
              />
              <Slider
                label="λ — weight decay (điều chuẩn)"
                min={0}
                max={1}
                step={0.01}
                value={lambda}
                onChange={setLambda}
                format={(v) => v.toFixed(2)}
              />
            </div>

            <StatRow>
              <Stat label="Số tham số" value={deg + 1} color="var(--accent)" />
              <Stat label="MSE huấn luyện" value={f3(trainMSE)} color="var(--vec-2)" />
              <Stat label="‖w‖ (chuẩn hệ số)" value={f3(weightNorm)} color="var(--vec-result)" />
            </StatRow>

            {overfitRisk ? (
              <p style={{ color: 'var(--warn)', fontWeight: 600, fontSize: 13.5 }}>
                ⚠ Nguy cơ overfit: bậc cao, <MathText tex={'\\lambda \\approx 0'} />. MSE huấn luyện
                rất nhỏ nhưng đường ngoằn ngoèo bám cả nhiễu — sẽ dự đoán tệ giữa các điểm.
              </p>
            ) : (
              <Hint>
                Để ý: tăng <MathText tex={'d'} /> luôn làm MSE huấn luyện <em>giảm</em> (mô hình linh
                hoạt hơn), nhưng tăng <MathText tex={'\\lambda'} /> làm nó <em>tăng nhẹ</em> — đó là
                cái giá phải trả để đổi lấy đường mượt, tổng quát hơn.
              </Hint>
            )}
          </div>
        </TwoCol>
      </Section>

      <Section kind="theory" title="Bias–variance và cách điều chuẩn">
        <p style={{ marginTop: 0 }}>
          Sai số dự đoán tách thành hai nguồn đối nghịch:
        </p>
        <ul>
          <li>
            <strong>Bias (thiên lệch) — underfitting.</strong> Mô hình quá đơn giản (bậc thấp) không
            nắm được xu hướng; sai cả trên train lẫn test.
          </li>
          <li>
            <strong>Variance (phương sai) — overfitting.</strong> Mô hình quá phức tạp (bậc cao) bám
            theo cả nhiễu; gần như hoàn hảo trên train nhưng đổi bộ dữ liệu là lệch hẳn.
          </li>
        </ul>
        <p>
          Điểm ngọt nằm ở giữa. Một cách kéo về giữa là <strong>regularization</strong>: thêm vào hàm
          mất mát một khoản phạt độ lớn của trọng số. Với <strong>weight decay</strong> (ridge / L2):
        </p>
        <MathText block tex={'\\mathcal{L}_{\\text{reg}}(w) = \\underbrace{\\frac{1}{n}\\lVert Xw - y\\rVert^2}_{\\text{khớp dữ liệu}} + \\underbrace{\\lambda\\,\\lVert w\\rVert^2}_{\\text{phạt độ lớn}}.'} />
        <p>
          Hệ số càng lớn thì bị phạt càng nặng, nên bộ tối ưu <em>ưa</em> nghiệm có trọng số nhỏ ⇒ hàm
          mượt hơn, ít nhạy với nhiễu. <MathText tex={'\\lambda'} /> điều tiết sự đánh đổi: 0 = mặc kệ,
          lớn = ép về gần 0.
        </p>

        <BridgeLA>
          <ul style={{ margin: '4px 0 0', paddingLeft: 20 }}>
            <li>
              <strong>Phạt <MathText tex={'\\lVert w\\rVert^2'} /> là chuẩn Euclid (Ch.1).</strong>{' '}
              <MathText tex={'\\lVert w\\rVert^2 = w\\cdot w = \\sum_k w_k^2'} /> — đúng tích vô hướng
              của <MathText tex={'w'} /> với chính nó. "Giữ trọng số nhỏ" nghĩa là giữ vector tham số
              ngắn.
            </li>
            <li>
              <strong>Ridge đổi normal equation (Ch.7–8).</strong> Cực tiểu của{' '}
              <MathText tex={'\\mathcal{L}_{\\text{reg}}'} /> thoả{' '}
              <MathText tex={'(X^{\\top}X + \\lambda I)\\,w = X^{\\top}y'} /> — chỉ thêm{' '}
              <MathText tex={'\\lambda I'} /> vào đường chéo.
            </li>
            <li>
              <strong>λI nâng mọi eigenvalue lên λ (Ch.5).</strong> Nếu{' '}
              <MathText tex={'X^{\\top}X'} /> có eigenvalue <MathText tex={'\\mu_i'} /> thì{' '}
              <MathText tex={'X^{\\top}X + \\lambda I'} /> có <MathText tex={'\\mu_i + \\lambda'} />.
              Vậy dù <MathText tex={'X^{\\top}X'} /> suy biến/gần suy biến (bậc cao, cột phụ thuộc),
              cộng <MathText tex={'\\lambda I'} /> làm nó <strong>luôn khả nghịch và ổn định số</strong> —
              regularization vừa chống overfit vừa chữa bệnh điều kiện xấu.
            </li>
          </ul>
        </BridgeLA>
      </Section>

      <Section kind="steps" title="Vì sao ridge thêm λI vào normal equation">
        <StepByStep
          steps={[
            {
              title: 'Bài toán least squares thường',
              content: (
                <div>
                  <p className="muted">Tối thiểu sai số khớp dữ liệu:</p>
                  <MathText block tex={'\\min_w \\lVert Xw - y\\rVert^2 \\;\\Rightarrow\\; X^{\\top}X\\,w = X^{\\top}y.'} />
                </div>
              ),
            },
            {
              title: 'Bước 1 — Thêm khoản phạt',
              content: (
                <MathText block tex={'\\min_w \\; \\lVert Xw - y\\rVert^2 + \\lambda\\,\\lVert w\\rVert^2.'} />
              ),
            },
            {
              title: 'Bước 2 — Cho gradient bằng 0',
              content: (
                <div>
                  <MathText block tex={'2X^{\\top}(Xw - y) + 2\\lambda w = 0.'} />
                  <p className="dim" style={{ fontSize: 13 }}>
                    (Đạo hàm của <MathText tex={'\\lVert w\\rVert^2'} /> theo <MathText tex={'w'} /> là{' '}
                    <MathText tex={'2w'} />.)
                  </p>
                </div>
              ),
            },
            {
              title: 'Bước 3 — Gom lại',
              content: (
                <div>
                  <MathText block tex={'(X^{\\top}X + \\lambda I)\\,w = X^{\\top}y.'} />
                  <p className="muted">
                    So với bản gốc chỉ khác đúng một khoản <MathText tex={'\\lambda I'} /> trên đường
                    chéo — nhưng nó bảo đảm ma trận khả nghịch và kéo <MathText tex={'w'} /> nhỏ lại.
                  </p>
                </div>
              ),
            },
            {
              title: 'Bước 4 — Trực giác hình học',
              content: (
                <p className="muted">
                  <MathText tex={'\\lambda = 0'} />: bám dữ liệu tối đa (có thể overfit).{' '}
                  <MathText tex={'\\lambda \\to \\infty'} />: ép <MathText tex={'w \\to 0'} /> (đường
                  gần như phẳng, underfit). Chọn <MathText tex={'\\lambda'} /> vừa phải bằng validation
                  để tổng quát hóa tốt nhất.
                </p>
              ),
            },
          ]}
        />
      </Section>

      <Section kind="quiz" title="Kiểm tra hiểu">
        <Quiz
          lessonKey="ch10/generalization"
          questions={[
            {
              q: <>"Overfitting" mô tả tình huống nào?</>,
              options: [
                <>Mô hình khớp rất tốt dữ liệu train (kể cả nhiễu) nhưng dự đoán <strong>tệ</strong> trên dữ liệu mới</>,
                <>Mô hình sai trên cả train lẫn test vì quá đơn giản</>,
                <>Mô hình có ít tham số hơn dữ liệu</>,
                <>Mô hình huấn luyện quá nhanh</>,
              ],
              answer: 0,
              explain: (
                <>
                  Overfit = học thuộc cả nhiễu ⇒ train error nhỏ nhưng <em>generalization</em> kém. Sai
                  trên cả hai (đáp án 2) là <em>underfitting</em> — do bias cao.
                </>
              ),
            },
            {
              q: <>Khi tăng bậc đa thức <MathText tex={'d'} /> (giữ nguyên dữ liệu, không phạt), MSE trên tập <em>huấn luyện</em> thường thay đổi thế nào?</>,
              options: [
                <>Giảm dần (mô hình linh hoạt hơn luôn khớp train tốt hơn hoặc bằng)</>,
                <>Tăng dần</>,
                <>Không đổi</>,
                <>Luôn bằng 0</>,
              ],
              answer: 0,
              explain: (
                <>
                  Thêm bậc = mở rộng không gian hàm ⇒ train error không thể tăng. Nhưng test error thì
                  hình chữ U: giảm rồi tăng khi bắt đầu overfit.
                </>
              ),
            },
            {
              q: <>Weight decay (điều chuẩn L2) thêm số hạng nào vào hàm mất mát, và nó "phạt" cái gì?</>,
              options: [
                <><MathText tex={'\\lambda\\lVert w\\rVert^2'} /> — phạt <strong>độ lớn (chuẩn) của vector trọng số</strong></>,
                <><MathText tex={'\\lambda\\det(W)'} /> — phạt định thức</>,
                <><MathText tex={'\\lambda\\,\\mathrm{tr}(W)'} /> — phạt vết ma trận</>,
                <>Không thêm gì, chỉ giảm learning rate</>,
              ],
              answer: 0,
              explain: (
                <>
                  Phạt <MathText tex={'\\lVert w\\rVert^2 = w\\cdot w'} /> (chuẩn Euclid, Ch.1) ⇒ ưu tiên
                  trọng số nhỏ ⇒ hàm mượt, ít nhạy nhiễu.
                </>
              ),
            },
            {
              q: <>Nghiệm ridge regression thoả phương trình nào, và <MathText tex={'\\lambda I'} /> giúp gì về mặt LA?</>,
              options: [
                <><MathText tex={'(X^{\\top}X + \\lambda I)w = X^{\\top}y'} />; <MathText tex={'\\lambda I'} /> nâng mọi eigenvalue lên <MathText tex={'\\lambda'} /> nên ma trận <strong>luôn khả nghịch, ổn định số</strong></>,
                <><MathText tex={'X^{\\top}X\\,w = 0'} />; làm nghiệm bằng 0</>,
                <><MathText tex={'Xw = \\lambda y'} />; phóng đại dữ liệu</>,
                <><MathText tex={'\\lambda I'} /> không ảnh hưởng gì tới nghiệm</>,
              ],
              answer: 0,
              explain: (
                <>
                  Cho gradient của <MathText tex={'\\lVert Xw-y\\rVert^2 + \\lambda\\lVert w\\rVert^2'} /> bằng 0 ra
                  <MathText tex={'(X^{\\top}X+\\lambda I)w = X^{\\top}y'} />. Eigenvalue{' '}
                  <MathText tex={'\\mu_i \\to \\mu_i + \\lambda > 0'} /> ⇒ khả nghịch dù cột phụ thuộc.
                </>
              ),
            },
          ]}
        />
      </Section>
    </Lesson>
  );
}
