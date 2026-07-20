import { useState } from 'react';
import { Lesson, Section } from '../../components/Lesson';
import MathText from '../../components/MathText';
import Canvas2D from '../../components/Canvas2D';
import Slider from '../../components/Slider';
import StepByStep from '../../components/StepByStep';
import Quiz from '../../components/Quiz';
import { transpose, matMul, matVec, solveSystem } from '../../lib/linalg';
import { f2, Stat, StatRow, Hint, DeepDive } from './_shared';

const FIXED: [number, number][] = [
  [-3, -2.2],
  [-2, -1.1],
  [-1, -0.3],
  [1, 1.2],
  [3, 2.4],
];

export default function LeastSquaresLesson() {
  const [ay, setAy] = useState(0.2); // điểm A tại x = 0
  const [by, setBy] = useState(1.9); // điểm B tại x = 2

  const pts: [number, number][] = [...FIXED, [0, ay], [2, by]];
  const X = pts.map((p) => [1, p[0]]); // ma trận thiết kế: hàng [1, x]
  const y = pts.map((p) => p[1]);
  const Xt = transpose(X);
  const XtX = matMul(Xt, X); // 2×2
  const Xty = matVec(Xt, y); // độ dài 2
  const sol = solveSystem(XtX, Xty);
  const beta = sol.solution ?? [0, 0];
  const b0 = beta[0];
  const b1 = beta[1];
  const fit = (x: number) => b0 + b1 * x;

  let sse = 0;
  for (const p of pts) {
    const r = p[1] - fit(p[0]);
    sse += r * r;
  }

  const points = pts.map((p, i) => ({
    x: p[0],
    y: p[1],
    color: i >= FIXED.length ? 'var(--vec-2)' : 'var(--vec-1)',
    label: i === FIXED.length ? 'A' : i === FIXED.length + 1 ? 'B' : undefined,
  }));

  const residSegs = pts.map((p) => ({
    from: [p[0], p[1]] as [number, number],
    to: [p[0], fit(p[0])] as [number, number],
    color: 'var(--vec-result)',
    dashed: true,
  }));
  const fitSeg = {
    from: [-4, fit(-4)] as [number, number],
    to: [4, fit(4)] as [number, number],
    color: 'var(--vec-3)',
    label: 'fit',
  };

  return (
    <Lesson id="least-squares" title="Least squares & Normal equation">
      <Section kind="explore" title="Khớp đường thẳng qua đám điểm">
        <Canvas2D
          height={440}
          range={4}
          points={points}
          segments={[fitSeg, ...residSegs]}
        />
        <div className="row" style={{ gap: 16, marginTop: 12, flexWrap: 'wrap' }}>
          <div style={{ flex: 1, minWidth: 220 }}>
            <Slider label="điểm A (x=0): y" min={-3} max={3} value={ay} onChange={setAy} format={f2} />
            <Slider label="điểm B (x=2): y" min={-1} max={4} value={by} onChange={setBy} format={f2} />
          </div>
        </div>
        <StatRow>
          <Stat label="hệ số chặn b₀" value={f2(b0)} color="var(--vec-3)" />
          <Stat label="hệ số góc b₁" value={f2(b1)} color="var(--vec-3)" />
          <Stat label="SSE (tổng bình phương sai)" value={f2(sse)} color="var(--vec-result)" />
        </StatRow>
        <Hint>
          7 điểm, đường thẳng chỉ có 2 tham số — không đường nào đi qua hết, hệ{' '}
          <MathText tex="X\beta = y" /> <b>vô nghiệm</b>. Đường xanh lá là nghiệm least squares; các
          đoạn hồng nét đứt là <b>residual</b> (sai số dọc). Kéo hai thanh trượt để dời điểm A, B: vì
          sai số bị phạt theo <em>bình phương</em>, một điểm lệch mạnh sẽ "kéo" đường về phía nó và
          làm SSE tăng vọt.
        </Hint>
      </Section>

      <Section kind="theory" title="Hệ vô nghiệm → chiếu b lên C(A)">
        <p>
          Muốn đường <MathText tex="y = b_0 + b_1 x" /> đi qua mọi điểm, ta cần{' '}
          <MathText tex="X\beta = y" /> với X là ma trận thiết kế (mỗi hàng{' '}
          <MathText tex="[1,\ x_i]" />). Nhưng nhiều phương trình, ít ẩn ⇒ nói chung{' '}
          <b>vô nghiệm</b> (đúng như Chương 2): vector <MathText tex="y" /> không nằm trong column
          space <MathText tex="C(X)" /> (Chương 4).
        </p>
        <p>
          Ý tưởng cứu vãn (chính là bài <b>Phép chiếu</b> vừa học): nếu không chạm được{' '}
          <MathText tex="y" />, hãy lấy điểm <em>gần nhất</em> trong <MathText tex="C(X)" /> — tức{' '}
          <b>hình chiếu vuông góc</b> <MathText tex="\hat y = X\hat\beta" /> của y. Điều kiện phần dư{' '}
          <MathText tex="y - X\hat\beta" /> vuông góc với mọi cột của X cho ta{' '}
          <b>normal equation</b>:
        </p>
        <MathText block tex="X^\top X\,\hat\beta = X^\top y." />
        <p>
          Đây là một hệ <em>vuông và có nghiệm</em> — giải bằng <code>solveSystem</code> (hoặc nghịch
          đảo <MathText tex="X^\top X" />). Nghiệm <MathText tex="\hat\beta" /> làm tổng bình phương
          các residual nhỏ nhất. Ở{' '}
          <b>Chương 7 · Least squares fit</b> bạn đã <em>chạy code</em> đúng công thức này; giờ ta
          thấy rõ <em>vì sao</em> nó đúng.
        </p>
        <DeepDive>
          <p>
            <b>Suy ra normal equation từ điều kiện vuông góc.</b> Điểm gần y nhất trong{' '}
            <MathText tex="C(X)" /> là hình chiếu; phần dư <MathText tex="e = y - X\hat\beta" /> phải
            vuông góc với <em>mọi</em> cột của X, tức từng cột dot với e bằng 0:
          </p>
          <MathText block tex="X^\top e = 0 \;\Longleftrightarrow\; X^\top (y - X\hat\beta) = 0 \;\Longleftrightarrow\; X^\top X\,\hat\beta = X^\top y." />
          <p>
            Khi các cột của X độc lập, <MathText tex="X^\top X" /> khả nghịch và nghiệm là duy nhất:
          </p>
          <MathText block tex="\hat\beta = (X^\top X)^{-1} X^\top y, \qquad \hat y = X\hat\beta = \underbrace{X(X^\top X)^{-1}X^\top}_{P}\,y." />
          <p>
            Đúng bằng ma trận chiếu P của bài trước — least squares <b>chính là</b> một phép chiếu
            trực giao. (Về số học, người ta thường giải qua QR: <MathText tex="R\hat\beta = Q^\top y" />
            , ổn định hơn dựng <MathText tex="X^\top X" />.)
          </p>
        </DeepDive>
      </Section>

      <Section kind="steps" title="Giải normal equation cho 3 điểm">
        <StepByStep
          steps={[
            {
              title: 'Bài toán',
              content: (
                <p>
                  Khớp <MathText tex="y = b_0 + b_1 x" /> qua ba điểm{' '}
                  <MathText tex="(0,1),\ (1,2),\ (2,2)" />.
                </p>
              ),
            },
            {
              title: 'Bước 1 — dựng X và y',
              content: (
                <MathText
                  block
                  tex="X = \begin{bmatrix} 1 & 0 \\ 1 & 1 \\ 1 & 2 \end{bmatrix}, \qquad y = \begin{bmatrix} 1 \\ 2 \\ 2 \end{bmatrix}"
                />
              ),
            },
            {
              title: 'Bước 2 — XᵀX và Xᵀy',
              content: (
                <MathText
                  block
                  tex="X^\top X = \begin{bmatrix} 3 & 3 \\ 3 & 5 \end{bmatrix}, \qquad X^\top y = \begin{bmatrix} 5 \\ 6 \end{bmatrix}"
                />
              ),
            },
            {
              title: 'Bước 3 — giải hệ 2×2',
              content: (
                <p>
                  <MathText tex="\det(X^\top X) = 15-9 = 6" />, nên{' '}
                  <MathText tex="(X^\top X)^{-1} = \tfrac{1}{6}\begin{bmatrix} 5 & -3 \\ -3 & 3 \end{bmatrix}" />
                  . Suy ra{' '}
                  <MathText tex="\hat\beta = \tfrac{1}{6}\begin{bmatrix} 5\cdot5 - 3\cdot6 \\ -3\cdot5 + 3\cdot6 \end{bmatrix} = \tfrac{1}{6}\begin{bmatrix} 7 \\ 3 \end{bmatrix}" />.
                </p>
              ),
            },
            {
              title: 'Kết quả',
              content: (
                <p>
                  <MathText tex="b_0 = \tfrac{7}{6} \approx 1.17,\quad b_1 = \tfrac{1}{2} = 0.5" />, tức
                  đường khớp <MathText tex="y \approx 1.17 + 0.5\,x" />. Không đường thẳng nào qua cả
                  ba điểm, nhưng đây là đường có tổng bình phương sai số nhỏ nhất.
                </p>
              ),
            },
          ]}
        />
      </Section>

      <Section kind="quiz" title="Kiểm tra hiểu">
        <Quiz
          lessonKey="ch8/least-squares"
          questions={[
            {
              q: <>Khi <MathText tex="X\beta = y" /> vô nghiệm, least squares tìm:</>,
              options: [
                'nghiệm chính xác bằng cách thêm ẩn',
                'hình chiếu của y lên C(X) — điểm gần nhất trong không gian cột',
                'giá trị riêng của X',
                'nghịch đảo của y',
              ],
              answer: 1,
              explain: (
                <>
                  Không chạm được y thì lấy điểm gần nhất trong <MathText tex="C(X)" />; đó là hình
                  chiếu vuông góc.
                </>
              ),
            },
            {
              q: <>Normal equation của least squares là:</>,
              options: [
                <MathText tex="X\beta = y" />,
                <MathText tex="X^\top X\,\hat\beta = X^\top y" />,
                <MathText tex="X X^\top \hat\beta = y" />,
                <MathText tex="\hat\beta = Xy" />,
              ],
              answer: 1,
              explain: <>Nhân hai vế <MathText tex="X\hat\beta = \hat y" /> với <MathText tex="X^\top" /> và dùng điều kiện phần dư vuông góc.</>,
            },
            {
              q: <>Phần dư <MathText tex="e = y - X\hat\beta" /> vuông góc với:</>,
              options: [
                'trục hoành',
                'mọi cột của X (tức C(X))',
                'chính vector y',
                'đường fit',
              ],
              answer: 1,
              explain: <>Đúng theo điều kiện chiếu: <MathText tex="X^\top e = 0" />, nghĩa là e ⟂ mọi cột của X.</>,
            },
            {
              q: <>Least squares nối liền với ý tưởng nào ở đầu chương?</>,
              options: [
                'Determinant',
                'Phép chiếu trực giao lên không gian con',
                'Eigenvalue',
                'Cross product',
              ],
              answer: 1,
              explain: (
                <>
                  <MathText tex="\hat y = X(X^\top X)^{-1}X^\top y = Py" /> — chính ma trận chiếu P.
                  Least squares là một phép chiếu.
                </>
              ),
            },
          ]}
        />
      </Section>
    </Lesson>
  );
}
