import { useState } from 'react';
import { Lesson, Section } from '../../components/Lesson';
import MathText from '../../components/MathText';
import Canvas2D, { useCanvas2D } from '../../components/Canvas2D';
import Slider from '../../components/Slider';
import StepByStep from '../../components/StepByStep';
import Quiz from '../../components/Quiz';
import { det, eigen2x2, type Mat } from '../../lib/linalg';
import { asM2, f2, shiftedMatrix, UNIT_SQUARE } from './util';

// Ma trận cố định cho bài này — số đẹp, hai eigenvalue thực rõ ràng.
const A: Mat = [
  [2, 1],
  [1, 2],
];

// Đồ thị p(λ) = det(A − λI) vẽ trong toạ độ thế giới của một Canvas2D riêng.
function DetGraph({ M, lambda }: { M: Mat; lambda: number }) {
  const { toScreen, range } = useCanvas2D();
  const tr = M[0][0] + M[1][1];
  const dt = M[0][0] * M[1][1] - M[0][1] * M[1][0];
  const p = (l: number) => l * l - tr * l + dt;

  const pts: string[] = [];
  for (let l = -range; l <= range; l += 0.05) {
    const [sx, sy] = toScreen(l, p(l));
    pts.push(`${pts.length ? 'L' : 'M'}${sx.toFixed(1)},${sy.toFixed(1)}`);
  }

  const eig = eigen2x2(M);
  const roots = eig.complex ? [] : eig.values;

  const pl = p(lambda);
  const [cx, cy] = toScreen(lambda, pl);
  const [lx1, ly1] = toScreen(lambda, -range);
  const [lx2, ly2] = toScreen(lambda, range);
  const near = Math.abs(pl) < 0.12;

  return (
    <g>
      {/* đường parabola p(λ) */}
      <path d={pts.join(' ')} fill="none" stroke="var(--accent)" strokeWidth={2.4} />
      {/* các nghiệm trên trục λ (det = 0) */}
      {roots.map((r, i) => {
        const [rx, ry] = toScreen(r, 0);
        return (
          <g key={i}>
            <circle cx={rx} cy={ry} r={6} fill="var(--vec-3)" />
            <text x={rx + 8} y={ry - 8} fill="var(--vec-3)" fontSize={13} fontWeight={700}>
              λ={f2(r)}
            </text>
          </g>
        );
      })}
      {/* vị trí λ hiện tại */}
      <line x1={lx1} y1={ly1} x2={lx2} y2={ly2} stroke="var(--warn)" strokeWidth={1.2} strokeDasharray="5 5" opacity={0.7} />
      <circle cx={cx} cy={cy} r={5.5} fill={near ? 'var(--vec-3)' : 'var(--warn)'} />
    </g>
  );
}

export default function Lesson2Characteristic() {
  const [lambda, setLambda] = useState(0);

  const AmlI = shiftedMatrix(A, lambda);
  const d = det(AmlI);
  const near = Math.abs(d) < 0.08;

  return (
    <Lesson id="ch5-characteristic" title="Phương trình đặc trưng">
      <p className="muted">
        Ở bài trước ta tìm eigenvector bằng tay. Nhưng làm sao tìm chúng một cách chắc
        chắn, không phải mò? Bí quyết nằm ở một ý tưởng bạn đã gặp: khi nào một biến đổi
        làm cả không gian <b>bẹp mất chiều</b>? Câu trả lời sẽ dẫn thẳng tới các eigenvalue.
      </p>

      <Section kind="explore" title="Trượt λ: bắt khoảnh khắc lưới bị bẹp">
        <p className="muted" style={{ marginTop: 0 }}>
          <b>Nhiệm vụ:</b> Kéo thanh trượt <MathText tex="\lambda" />. Bên trái là lưới
          của ma trận <MathText tex="A - \lambda I" />; bên phải là đồ thị của{' '}
          <MathText tex="\det(A - \lambda I)" /> theo <MathText tex="\lambda" />. Tìm
          những giá trị <MathText tex="\lambda" /> làm{' '}
          <b>lưới bẹp phẳng thành một đường</b> — đúng lúc đó đồ thị{' '}
          <span style={{ color: 'var(--vec-3)' }}>chạm trục 0</span>. Đó chính là các
          eigenvalue.
        </p>

        <div className="row" style={{ alignItems: 'flex-start', gap: 20 }}>
          <div style={{ flex: '1 1 320px', minWidth: 280 }}>
            <div className="dim" style={{ fontSize: 12, marginBottom: 4 }}>
              Lưới của <b>A − λI</b> (hình vuông đơn vị theo dõi diện tích)
            </div>
            <Canvas2D
              height={340}
              range={4}
              matrix={asM2(AmlI)}
              polygons={[
                {
                  points: UNIT_SQUARE,
                  fill: near ? 'var(--bad)' : 'var(--vec-1)',
                  opacity: 0.35,
                  stroke: near ? 'var(--bad)' : 'var(--vec-1)',
                },
              ]}
              vectors={[
                { id: 'i', x: 1, y: 0, color: 'var(--vec-1)', label: 'î' },
                { id: 'j', x: 0, y: 1, color: 'var(--vec-2)', label: 'ĵ' },
              ]}
            />
          </div>
          <div style={{ flex: '1 1 320px', minWidth: 280 }}>
            <div className="dim" style={{ fontSize: 12, marginBottom: 4 }}>
              Đồ thị <b>p(λ) = det(A − λI)</b> — trục ngang là λ
            </div>
            <Canvas2D height={340} range={5} showGrid={false}>
              <DetGraph M={A} lambda={lambda} />
            </Canvas2D>
          </div>
        </div>

        <div style={{ marginTop: 12 }}>
          <Slider
            label="λ"
            min={-0.5}
            max={4}
            step={0.01}
            value={lambda}
            onChange={setLambda}
            format={(x) => f2(x)}
          />
        </div>
        <div
          className="panel"
          style={{
            marginTop: 8,
            textAlign: 'center',
            color: near ? 'var(--vec-3)' : 'var(--text-muted)',
            fontWeight: near ? 700 : 400,
          }}
        >
          det(A − λI) = <span className="mono">{f2(d)}</span>{' '}
          {near ? '→ ≈ 0! Lưới bẹp — λ này là một eigenvalue.' : '→ lưới vẫn còn "dày", chưa bẹp.'}
        </div>
      </Section>

      <Section kind="theory" title="Từ Av = λv tới det(A − λI) = 0">
        <p>
          Ta bắt đầu từ định nghĩa và biến đổi đại số:
        </p>
        <MathText block tex="A v = \lambda v \;\Longleftrightarrow\; A v - \lambda v = 0 \;\Longleftrightarrow\; (A - \lambda I)\,v = 0" />
        <p>
          (Phải chèn <MathText tex="I" /> vào vì không thể trừ một số <MathText tex="\lambda" /> cho
          một ma trận <MathText tex="A" />; <MathText tex="\lambda I" /> mới là ma trận.)
          Bây giờ để ý: ta cần <MathText tex="v \neq 0" /> thỏa{' '}
          <MathText tex="(A - \lambda I)v = 0" />. Nghĩa là ma trận{' '}
          <MathText tex="A - \lambda I" /> phải nuốt một vector khác 0 về gốc — nó phải
          có <b>null space khác {'{0}'}</b> (nối lại bài null space ở chương 4).
        </p>
        <p>
          Một ma trận 2×2 nuốt được vector khác 0 <b>khi và chỉ khi</b> nó làm không gian
          bẹp mất chiều — tức determinant của nó bằng 0 (đúng như bài determinant chương 3):
        </p>
        <MathText block tex="\boxed{\;\det(A - \lambda I) = 0\;}" />
        <p>
          Đây là <b>phương trình đặc trưng</b> (characteristic equation). Khai triển cho
          ma trận 2×2:
        </p>
        <MathText block tex="\det\begin{bmatrix} a-\lambda & b \\ c & d-\lambda \end{bmatrix} = \lambda^2 - (a+d)\,\lambda + (ad-bc) = 0" />
        <p>
          Đó là một <b>đa thức bậc 2</b> theo <MathText tex="\lambda" /> — chính là
          parabola bạn thấy ở đồ thị bên trên, và hai nghiệm của nó là hai eigenvalue.
          Hai hệ số quen thuộc xuất hiện:
        </p>
        <ul>
          <li>
            <b>trace</b> <MathText tex="a+d = \lambda_1 + \lambda_2" /> (tổng hai eigenvalue).
          </li>
          <li>
            <b>determinant</b> <MathText tex="ad-bc = \lambda_1 \cdot \lambda_2" /> (tích hai eigenvalue).
          </li>
        </ul>
        <p className="muted">
          Hai đẳng thức này là "mẹo kiểm tra" cực nhanh: tính trace và det của A rồi tìm
          hai số có tổng và tích khớp — đó là eigenvalue, khỏi cần giải phương trình.
        </p>
      </Section>

      <Section kind="steps" title="Giải phương trình đặc trưng của [[2,1],[1,2]]">
        <StepByStep
          steps={[
            {
              title: 'Bước 1 — Dựng A − λI',
              content: (
                <MathText
                  block
                  tex="A - \lambda I = \begin{bmatrix} 2-\lambda & 1 \\ 1 & 2-\lambda \end{bmatrix}"
                />
              ),
            },
            {
              title: 'Bước 2 — Lấy determinant cho bằng 0',
              content: (
                <div>
                  <MathText block tex="\det(A-\lambda I) = (2-\lambda)(2-\lambda) - (1)(1) = 0" />
                  <p className="muted">Đường chéo chính trừ đường chéo phụ.</p>
                </div>
              ),
            },
            {
              title: 'Bước 3 — Khai triển thành đa thức bậc 2',
              content: (
                <div>
                  <MathText block tex="(2-\lambda)^2 - 1 = \lambda^2 - 4\lambda + 4 - 1 = \lambda^2 - 4\lambda + 3 = 0" />
                  <p className="muted">
                    Kiểm nhanh: trace = 2+2 = 4 (hệ số của λ), det = 2·2 − 1·1 = 3 (hệ số tự do). Khớp!
                  </p>
                </div>
              ),
            },
            {
              title: 'Bước 4 — Giải ra hai nghiệm',
              content: (
                <div>
                  <MathText block tex="(\lambda - 3)(\lambda - 1) = 0 \;\Longrightarrow\; \lambda_1 = 3,\quad \lambda_2 = 1" />
                  <p className="muted">
                    Đối chiếu: <MathText tex="\lambda_1 + \lambda_2 = 4 = " /> trace,{' '}
                    <MathText tex="\lambda_1 \cdot \lambda_2 = 3 = " /> det. Đúng như lý thuyết đã hứa.
                  </p>
                </div>
              ),
            },
          ]}
        />
      </Section>

      <Section kind="quiz" title="Kiểm tra hiểu">
        <Quiz
          lessonKey="ch5/characteristic"
          questions={[
            {
              q: <>Vì sao eigenvalue phải thỏa <MathText tex="\det(A - \lambda I) = 0" />?</>,
              options: [
                <>Vì cần <MathText tex="(A-\lambda I)v = 0" /> có nghiệm <MathText tex="v \neq 0" />, tức A−λI phải suy biến (det = 0)</>,
                <>Vì determinant của A luôn bằng 0</>,
                <>Vì λ luôn bằng 0</>,
                <>Vì mọi ma trận đều có det = 0</>,
              ],
              answer: 0,
              explain: (
                <>
                  <MathText tex="Av=\lambda v" /> viết lại thành{' '}
                  <MathText tex="(A-\lambda I)v=0" />. Để có nghiệm khác 0, A−λI phải làm
                  bẹp không gian, nghĩa là det = 0.
                </>
              ),
            },
            {
              q: (
                <>
                  Ma trận <MathText tex="\begin{bmatrix}5&0\\0&3\end{bmatrix}" /> có trace = 8, det = 15.
                  Không cần giải, hai eigenvalue là?
                </>
              ),
              options: [
                <>5 và 3 (tổng 8, tích 15)</>,
                <>8 và 15</>,
                <>4 và 4</>,
                <>0 và 8</>,
              ],
              answer: 0,
              explain: (
                <>
                  Cần hai số tổng 8, tích 15 → 5 và 3. Với ma trận đường chéo, eigenvalue
                  chính là các phần tử trên đường chéo.
                </>
              ),
            },
            {
              q: <>Phương trình đặc trưng của một ma trận 2×2 là đa thức bậc mấy theo λ?</>,
              options: [
                <>Bậc 2 (nên có tối đa 2 eigenvalue)</>,
                <>Bậc 1</>,
                <>Bậc 3</>,
                <>Bậc 0 (một hằng số)</>,
              ],
              answer: 0,
              explain: (
                <>
                  <MathText tex="\lambda^2 - (\text{tr})\lambda + \det = 0" /> — bậc 2. Ma
                  trận n×n cho đa thức bậc n.
                </>
              ),
            },
            {
              q: (
                <>
                  Nếu phương trình đặc trưng <MathText tex="\lambda^2 + 1 = 0" /> không có
                  nghiệm thực, điều đó nói gì về ma trận?
                </>
              ),
              options: [
                <>Nó không có eigenvector thực — như phép xoay, mọi hướng đều bị quay</>,
                <>Nó là ma trận identity</>,
                <>Nó có vô số eigenvalue thực</>,
                <>Nó không phải ma trận vuông</>,
              ],
              answer: 0,
              explain: (
                <>
                  Nghiệm <MathText tex="\lambda = \pm i" /> là số phức. Không có hướng
                  thực nào bất biến — đúng đặc trưng của phép xoay.
                </>
              ),
            },
          ]}
        />
      </Section>
    </Lesson>
  );
}
