import { useState } from 'react';
import { Lesson, Section } from '../../components/Lesson';
import MathText from '../../components/MathText';
import Canvas2D from '../../components/Canvas2D';
import Slider from '../../components/Slider';
import StepByStep from '../../components/StepByStep';
import Quiz from '../../components/Quiz';
import { linRegLossMSE } from '../../lib/nn';
import { fitLine, f2, f3 } from './util';
import { Stat, StatRow, Hint, BridgeLA, TwoCol } from './_shared';

// Dữ liệu cố định (không random) — hơi lệch khỏi một đường thẳng hoàn hảo.
const XS = [-2, -1, 0, 1, 2, 3];
const YS = [-1.4, -0.8, 0.4, 0.9, 2.1, 2.6];

const DATA_COLOR = 'var(--vec-1)';
const LINE_COLOR = 'var(--vec-2)';
const RES_COLOR = 'var(--vec-result)';

export default function LinearRegressionLesson() {
  const [w, setW] = useState(0.4);
  const [b, setB] = useState(0);

  const mse = linRegLossMSE(XS, YS, w, b);

  // Đoạn residual thẳng đứng: từ điểm dữ liệu tới đường dự đoán.
  const residuals = XS.map((x, i) => ({
    from: [x, YS[i]] as [number, number],
    to: [x, w * x + b] as [number, number],
    color: RES_COLOR,
    dashed: true,
  }));

  const points = XS.map((x, i) => ({ x, y: YS[i], color: DATA_COLOR }));

  const solve = () => {
    const opt = fitLine(XS, YS);
    setW(Math.round(opt.w * 100) / 100);
    setB(Math.round(opt.b * 100) / 100);
  };

  return (
    <Lesson id="linear-regression" title="Hồi quy tuyến tính = Least Squares">
      <p className="muted">
        Bài toán học máy đơn giản nhất: cho một đám điểm <MathText tex={'(x_i, y_i)'} />, tìm
        đường thẳng <MathText tex={'\\hat{y} = w x + b'} /> khớp nhất. "Khớp nhất" nghĩa là tổng
        bình phương sai lệch nhỏ nhất — và đó chính xác là bài toán{' '}
        <strong>least squares</strong> bạn đã gặp ở Chương 7–8, nay khoác áo "học máy".
      </p>

      <Section kind="explore" title="Chỉnh đường thẳng — rồi để LA giải giúp">
        <p className="muted" style={{ marginTop: 0 }}>
          Kéo hai thanh trượt <MathText tex={'w'} /> (độ dốc) và <MathText tex={'b'} /> (điểm chệch)
          để đường xanh len qua đám điểm. Mỗi đoạn <span style={{ color: RES_COLOR }}>nét đứt</span>{' '}
          là một <strong>residual</strong> — khoảng cách dọc từ điểm tới đường. Chỉ số{' '}
          <strong>MSE</strong> bên dưới là trung bình bình phương các đoạn đó.
        </p>

        <TwoCol>
          <Canvas2D
            height={380}
            range={4}
            showGrid
            showAxes
            points={points}
            segments={residuals}
            lines={[{ a: w, b: -1, c: -b, color: LINE_COLOR }]}
          />

          <div>
            <div className="panel">
              <Slider label="w — độ dốc (slope)" min={-2} max={3} step={0.05} value={w} onChange={setW} />
              <Slider label="b — điểm chệch (bias/intercept)" min={-3} max={3} step={0.05} value={b} onChange={setB} />
              <button className="btn" style={{ marginTop: 10 }} onClick={solve}>
                ⚙️ Giải Least Squares (normal equation)
              </button>
            </div>

            <StatRow>
              <Stat label="Đường khớp" value={<>ŷ = {f2(w)}·x + {f2(b)}</>} color={LINE_COLOR} />
              <Stat label="MSE hiện tại" value={f3(mse)} color={RES_COLOR} />
            </StatRow>

            <Hint>
              Bấm <em>Giải Least Squares</em>: máy tính dựng ma trận thiết kế{' '}
              <MathText tex={'X'} /> rồi giải <MathText tex={'X^{\\top}X\\,\\beta = X^{\\top}y'} /> —
              MSE nhảy xuống giá trị nhỏ nhất có thể. Không thanh trượt nào bạn kéo tay thắng được nó.
            </Hint>
          </div>
        </TwoCol>
      </Section>

      <Section kind="theory" title="Mô hình, hàm mất mát, và nghiệm">
        <p style={{ marginTop: 0 }}>
          <strong>Mô hình.</strong> Mỗi dự đoán là một hàm tuyến tính của đầu vào:
        </p>
        <MathText block tex={'\\hat{y}_i = w\\,x_i + b.'} />
        <p>
          <strong>Hàm mất mát.</strong> Ta đo độ sai bằng <em>Mean Squared Error</em> — trung bình
          bình phương residual <MathText tex={'r_i = \\hat{y}_i - y_i'} />:
        </p>
        <MathText block tex={'L(w, b) = \\frac{1}{n}\\sum_{i=1}^{n} (w x_i + b - y_i)^2.'} />
        <p>
          Vì sao bình phương chứ không phải trị tuyệt đối? Bình phương làm <MathText tex={'L'} />{' '}
          <strong>trơn và lồi</strong> (khả vi mọi nơi), nên có đúng một điểm thấp nhất và ta có công
          thức đóng để tìm nó.
        </p>

        <h3>Viết lại bằng ma trận</h3>
        <p>
          Gộp mọi phương trình <MathText tex={'w x_i + b = y_i'} /> thành một hệ. Đặt vector tham số{' '}
          <MathText tex={'\\beta = (b, w)'} /> và <strong>ma trận thiết kế</strong>{' '}
          <MathText tex={'X'} /> với mỗi hàng <MathText tex={'[1,\\; x_i]'} />:
        </p>
        <MathText block tex={'X\\beta = y, \\qquad X = \\begin{bmatrix} 1 & x_1 \\\\ 1 & x_2 \\\\ \\vdots & \\vdots \\\\ 1 & x_n \\end{bmatrix}.'} />
        <p>
          Nhiều điểm hơn tham số ⇒ hệ này <strong>vô nghiệm</strong> (điểm không thẳng hàng, nên{' '}
          <MathText tex={'y \\notin C(X)'} />). Least squares tìm <MathText tex={'\\beta'} /> làm{' '}
          <MathText tex={'\\lVert X\\beta - y\\rVert^2'} /> nhỏ nhất — chính là hàm{' '}
          <MathText tex={'nL(w,b)'} /> ở trên.
        </p>

        <BridgeLA>
          <ul style={{ margin: '4px 0 0', paddingLeft: 20 }}>
            <li>
              <strong>Least squares & normal equation (Ch.7–8).</strong> Nghiệm tối ưu thoả{' '}
              <MathText tex={'X^{\\top}X\\,\\beta = X^{\\top}y'} /> — đúng phương trình bạn đã giải
              để khớp đường thẳng. Nút "Giải Least Squares" chỉ gọi lại{' '}
              <code>solveSystem</code> cho hệ 2×2 này.
            </li>
            <li>
              <strong>Phép chiếu trực giao (Ch.8).</strong> Residual tối ưu{' '}
              <MathText tex={'y - X\\beta'} /> vuông góc với mọi cột của <MathText tex={'X'} />:{' '}
              <MathText tex={'\\hat{y}'} /> là hình chiếu của <MathText tex={'y'} /> lên{' '}
              <MathText tex={'C(X)'} />. Đó là lý do sâu xa của normal equation.
            </li>
            <li>
              <strong>Dạng toàn phương lồi (Ch.9).</strong> <MathText tex={'L(\\beta)'} /> là một dạng
              toàn phương với Hessian <MathText tex={'\\frac{2}{n}X^{\\top}X'} /> — ma trận đối xứng
              nửa/ xác định dương. Vì thế mặt loss là một <strong>cái bát</strong> có đáy duy nhất.
            </li>
          </ul>
        </BridgeLA>
      </Section>

      <Section kind="steps" title="Giải tay bằng normal equation">
        <StepByStep
          steps={[
            {
              title: 'Đề bài',
              content: (
                <div>
                  <p className="muted">
                    Khớp đường <MathText tex={'\\hat{y} = w x + b'} /> với ba điểm{' '}
                    <MathText tex={'(1,2),\\ (2,2),\\ (3,4)'} />.
                  </p>
                </div>
              ),
            },
            {
              title: 'Bước 1 — Các tổng cần dùng',
              content: (
                <div>
                  <MathText block tex={'n = 3,\\quad \\textstyle\\sum x = 6,\\quad \\sum y = 8,\\quad \\sum x^2 = 14,\\quad \\sum xy = 18.'} />
                  <p className="dim" style={{ fontSize: 13 }}>
                    (<MathText tex={'\\sum xy = 1\\cdot2 + 2\\cdot2 + 3\\cdot4 = 18'} />.)
                  </p>
                </div>
              ),
            },
            {
              title: 'Bước 2 — Normal equation XᵀXβ = Xᵀy',
              content: (
                <div>
                  <MathText block tex={'\\begin{bmatrix} n & \\sum x \\\\ \\sum x & \\sum x^2 \\end{bmatrix}\\!\\begin{bmatrix} b \\\\ w \\end{bmatrix} = \\begin{bmatrix} \\sum y \\\\ \\sum xy \\end{bmatrix}'} />
                  <MathText block tex={'\\begin{bmatrix} 3 & 6 \\\\ 6 & 14 \\end{bmatrix}\\!\\begin{bmatrix} b \\\\ w \\end{bmatrix} = \\begin{bmatrix} 8 \\\\ 18 \\end{bmatrix}.'} />
                </div>
              ),
            },
            {
              title: 'Bước 3 — Giải hệ 2×2',
              content: (
                <div>
                  <MathText block tex={'3b + 6w = 8,\\qquad 6b + 14w = 18.'} />
                  <p className="muted">
                    Khử <MathText tex={'b'} /> (lấy pt hai trừ 2× pt một):{' '}
                    <MathText tex={'2w = 2 \\Rightarrow w = 1'} />, rồi{' '}
                    <MathText tex={'b = (8 - 6)/3 = 2/3'} />.
                  </p>
                  <MathText block tex={'\\boxed{\\,w = 1,\\quad b = \\tfrac{2}{3} \\approx 0.67\\,}'} />
                </div>
              ),
            },
            {
              title: 'Bước 4 — Kiểm tra & MSE',
              content: (
                <div>
                  <p className="muted">
                    Residual: <MathText tex={'\\tfrac13, -\\tfrac23, \\tfrac13'} /> — tổng bằng 0
                    (đặc trưng của nghiệm least squares: residual vuông góc với cột{' '}
                    <MathText tex={'\\mathbf{1}'} />).
                  </p>
                  <MathText block tex={'L = \\tfrac13\\left(\\tfrac19 + \\tfrac49 + \\tfrac19\\right) = \\tfrac{2}{9} \\approx 0.222.'} />
                </div>
              ),
            },
          ]}
        />
      </Section>

      <Section kind="quiz" title="Kiểm tra hiểu">
        <Quiz
          lessonKey="ch10/linear-regression"
          questions={[
            {
              q: <>Hàm mất mát MSE của hồi quy tuyến tính đo cái gì?</>,
              options: [
                <>Trung bình <strong>bình phương</strong> khoảng cách dọc (residual) từ điểm tới đường</>,
                <>Độ dốc của đường thẳng</>,
                <>Tổng các tọa độ <MathText tex={'y_i'} /></>,
                <>Góc giữa đường thẳng và trục hoành</>,
              ],
              answer: 0,
              explain: (
                <>
                  <MathText tex={'L = \\tfrac1n\\sum (w x_i + b - y_i)^2'} /> — trung bình của các
                  residual bình phương. Nhỏ nghĩa là đường bám sát dữ liệu.
                </>
              ),
            },
            {
              q: <>Nghiệm least squares <MathText tex={'\\beta'} /> thoả phương trình nào?</>,
              options: [
                <><MathText tex={'X\\beta = y'} /> (giải trực tiếp)</>,
                <><MathText tex={'X^{\\top}X\\,\\beta = X^{\\top}y'} /> (normal equation)</>,
                <><MathText tex={'\\det(X) = 0'} /></>,
                <><MathText tex={'X\\beta = 0'} /></>,
              ],
              answer: 1,
              explain: (
                <>
                  Hệ <MathText tex={'X\\beta = y'} /> thường vô nghiệm; nhân hai vế với{' '}
                  <MathText tex={'X^{\\top}'} /> cho normal equation — một hệ vuông luôn giải được.
                </>
              ),
            },
            {
              q: <>Vì sao tại nghiệm tối ưu, residual <MathText tex={'y - X\\beta'} /> lại vuông góc với các cột của <MathText tex={'X'} />?</>,
              options: [
                <>Vì <MathText tex={'\\hat{y}'} /> là hình chiếu trực giao của <MathText tex={'y'} /> lên column space <MathText tex={'C(X)'} /></>,
                <>Vì mọi vector đều vuông góc với nhau</>,
                <>Vì <MathText tex={'X'} /> là ma trận vuông khả nghịch</>,
                <>Đó chỉ là trùng hợp ngẫu nhiên</>,
              ],
              answer: 0,
              explain: (
                <>
                  Điểm gần <MathText tex={'y'} /> nhất trong <MathText tex={'C(X)'} /> là hình chiếu
                  vuông góc, nên sai số phải vuông góc với không gian đó:{' '}
                  <MathText tex={'X^{\\top}(y - X\\beta) = 0'} /> — chính là normal equation.
                </>
              ),
            },
            {
              q: <>Mặt mất mát <MathText tex={'L(w, b)'} /> có hình dạng gì, và điều đó nói lên điều gì?</>,
              options: [
                <>Một <strong>cái bát lồi</strong> (dạng toàn phương xác định dương) ⇒ có đúng một cực tiểu toàn cục</>,
                <>Một mặt yên ngựa ⇒ có nhiều cực tiểu</>,
                <>Một mặt phẳng ⇒ vô số nghiệm bằng nhau</>,
                <>Một mặt gồ ghề nhiều hố ⇒ dễ kẹt cực tiểu địa phương</>,
              ],
              answer: 0,
              explain: (
                <>
                  Hessian của <MathText tex={'L'} /> là <MathText tex={'\\frac{2}{n}X^{\\top}X'} /> —
                  đối xứng nửa xác định dương (Ch.9), nên <MathText tex={'L'} /> lồi, mặt là cái bát
                  với một đáy duy nhất.
                </>
              ),
            },
          ]}
        />
      </Section>
    </Lesson>
  );
}
