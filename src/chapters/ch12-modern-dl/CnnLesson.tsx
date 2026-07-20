import { useState } from 'react';
import { Lesson, Section } from '../../components/Lesson';
import MathText from '../../components/MathText';
import MatrixInput from '../../components/MatrixInput';
import Slider from '../../components/Slider';
import StepByStep from '../../components/StepByStep';
import Quiz from '../../components/Quiz';
import type { Mat } from '../../lib/linalg';
import {
  f2,
  Stat,
  StatRow,
  Hint,
  Bridge,
  Caption,
  TwoCol,
  MatrixGrid,
  seqCell,
  divCell,
} from './_shared';

// Ảnh xám 6×6 cố định: nửa trái sáng (giá trị 10), nửa phải tối (0) → một CẠNH
// DỌC ở giữa. Kernel dò cạnh dọc sẽ "bật sáng" đúng tại đường biên đó.
const IMG: Mat = [
  [10, 10, 10, 0, 0, 0],
  [10, 10, 10, 0, 0, 0],
  [10, 10, 10, 0, 0, 0],
  [10, 10, 10, 0, 0, 0],
  [10, 10, 10, 0, 0, 0],
  [10, 10, 10, 0, 0, 0],
];

const N = 6; // cạnh ảnh
const K = 3; // cạnh kernel
const OUT = N - K + 1; // 4 — tích chập "valid" (không padding)

// Một ô feature map = tổng tích phần tử của cửa sổ ảnh với kernel (cross-correlation).
function convAt(img: Mat, kernel: Mat, i: number, j: number): number {
  let s = 0;
  for (let a = 0; a < K; a++) {
    for (let b = 0; b < K; b++) {
      s += img[i + a][j + b] * kernel[a][b];
    }
  }
  return s;
}

function featureMap(img: Mat, kernel: Mat): Mat {
  const out: Mat = [];
  for (let i = 0; i < OUT; i++) {
    const row: number[] = [];
    for (let j = 0; j < OUT; j++) row.push(convAt(img, kernel, i, j));
    out.push(row);
  }
  return out;
}

export default function CnnLesson() {
  // Kernel dò cạnh dọc mặc định (Sobel rút gọn).
  const [kernel, setKernel] = useState<Mat>([
    [1, 0, -1],
    [1, 0, -1],
    [1, 0, -1],
  ]);
  const [pos, setPos] = useState({ i: 0, j: 1 }); // vị trí góc trên–trái cửa sổ

  const fmap = featureMap(IMG, kernel);
  const maxAbsMap = Math.max(1, ...fmap.flat().map((x) => Math.abs(x)));

  // Cửa sổ ảnh đang xét & các tích phần tử.
  const win: Mat = [];
  const prods: Mat = [];
  for (let a = 0; a < K; a++) {
    const wr: number[] = [];
    const pr: number[] = [];
    for (let b = 0; b < K; b++) {
      const iv = IMG[pos.i + a][pos.j + b];
      wr.push(iv);
      pr.push(iv * kernel[a][b]);
    }
    win.push(wr);
    prods.push(pr);
  }
  const cellValue = convAt(IMG, kernel, pos.i, pos.j);

  // Biểu thức dot product cục bộ để hiện dưới dạng chuỗi.
  const flatImg = win.flat();
  const flatKer = kernel.flat();
  const terms = flatImg
    .map((v, idx) => `${v}\\cdot${flatKer[idx]}`)
    .join(' + ');

  return (
    <Lesson id="cnn" title="CNN — Tích chập (Convolution)">
      <Section kind="explore" title="Trượt cửa sổ, tính một ô feature map">
        <p>
          Một ảnh chỉ là một <b>ma trận số</b> (độ sáng từng điểm ảnh). Convolution
          trượt một <b>kernel</b> (bộ lọc) nhỏ khắp ảnh; tại mỗi vị trí, nó tính{' '}
          <b>tổng tích từng phần tử</b> giữa kernel và vùng ảnh nằm dưới nó — đúng là
          một <b>dot product cục bộ</b>.
        </p>

        <TwoCol>
          <div>
            <Caption>Ảnh 6×6 — ô viền tím là cửa sổ 3×3 đang xét</Caption>
            <MatrixGrid
              data={IMG}
              size={40}
              color={(v) => seqCell(v, 10)}
              highlight={(i, j) =>
                i >= pos.i && i < pos.i + K && j >= pos.j && j < pos.j + K
              }
            />
          </div>
          <div>
            <Caption>Kernel 3×3 (chỉnh được — thử đổi số)</Caption>
            <MatrixInput value={kernel} onChange={setKernel} rows={3} cols={3} />
            <div style={{ marginTop: 14 }}>
              <Slider
                label="Cửa sổ — hàng i"
                min={0}
                max={OUT - 1}
                step={1}
                value={pos.i}
                onChange={(v) => setPos((p) => ({ ...p, i: Math.round(v) }))}
                format={(v) => String(Math.round(v))}
              />
              <Slider
                label="Cửa sổ — cột j"
                min={0}
                max={OUT - 1}
                step={1}
                value={pos.j}
                onChange={(v) => setPos((p) => ({ ...p, j: Math.round(v) }))}
                format={(v) => String(Math.round(v))}
              />
            </div>
          </div>
        </TwoCol>

        <StatRow>
          <Stat label="vị trí (i, j)" value={`(${pos.i}, ${pos.j})`} color="var(--accent)" />
          <Stat label="feature map[i][j]" value={f2(cellValue)} color="var(--vec-result)" />
        </StatRow>

        <div style={{ marginTop: 6 }}>
          <MathText
            block
            tex={`\\text{ô}(${pos.i},${pos.j}) = \\sum I_{\\text{cửa sổ}}\\odot K = ${terms} = ${cellValue}`}
          />
        </div>

        <TwoCol>
          <div>
            <Caption>Tích từng phần tử (cửa sổ ⊙ kernel)</Caption>
            <MatrixGrid
              data={prods}
              size={40}
              color={(v) => divCell(v, Math.max(1, ...prods.flat().map(Math.abs)))}
            />
          </div>
          <div>
            <Caption>Feature map 4×4 — ô viền tím là ô vừa tính</Caption>
            <MatrixGrid
              data={fmap}
              size={40}
              color={(v) => divCell(v, maxAbsMap)}
              highlight={(i, j) => i === pos.i && j === pos.j}
            />
          </div>
        </TwoCol>

        <Hint>
          Ảnh có một cạnh dọc ở giữa (sáng ↔ tối). Kernel mặc định là bộ{' '}
          <b>dò cạnh dọc</b>: feature map bằng 0 ở vùng phẳng và <b>bật lên 30</b> ngay
          tại đường biên — mạng đã "nhìn thấy" cạnh. Thử đổi kernel thành toàn số{' '}
          <MathText tex="1/9" /> để được bộ <b>làm mờ</b> (trung bình).
        </Hint>
      </Section>

      <Section kind="theory" title="Convolution = dot product cục bộ + chia sẻ trọng số">
        <p>
          Với ảnh <MathText tex="I" /> và kernel <MathText tex="K" /> cỡ{' '}
          <MathText tex="k\times k" />, giá trị feature map tại vị trí{' '}
          <MathText tex="(i,j)" /> là:
        </p>
        <MathText
          block
          tex="S(i,j) = \sum_{a}\sum_{b} I(i+a,\,j+b)\,K(a,b)"
        />
        <p>
          Đây chính xác là <b>tích vô hướng</b> giữa mảnh ảnh cỡ{' '}
          <MathText tex="k\times k" /> và kernel, sau khi trải phẳng cả hai thành
          vector <MathText tex="k^2" /> chiều.
        </p>
        <p>Hai ý tưởng cốt lõi khiến CNN mạnh:</p>
        <ul>
          <li>
            <b>Chia sẻ trọng số (weight sharing):</b> CÙNG một kernel trượt khắp ảnh.
            Một bộ dò cạnh học được ở góc trên vẫn dùng lại ở góc dưới — ít tham số
            hơn hẳn một lớp fully-connected, và có tính <b>bất biến tịnh tiến</b>.
          </li>
          <li>
            <b>Tính cục bộ (locality):</b> mỗi ô đầu ra chỉ nhìn một vùng nhỏ lân cận,
            phù hợp với ảnh (cạnh, góc, kết cấu đều là đặc trưng cục bộ).
          </li>
        </ul>
        <p>Một vài khái niệm đi kèm:</p>
        <ul>
          <li>
            <b>Padding:</b> viền thêm số 0 quanh ảnh để đầu ra không bị co lại.
          </li>
          <li>
            <b>Stride:</b> bước nhảy của cửa sổ; stride 2 làm feature map nhỏ đi một
            nửa.
          </li>
          <li>
            <b>Pooling:</b> gộp vùng lân cận (ví dụ max-pool lấy giá trị lớn nhất) để
            thu nhỏ và tăng bền vững với dịch chuyển.
          </li>
        </ul>

        <Bridge>
          Mỗi ô feature map là một <b>dot product</b> (Ch1) giữa vector kernel và
          vector mảnh ảnh. Toàn bộ phép convolution có thể viết thành{' '}
          <b>một phép nhân ma trận</b> <MathText tex="S = C\,\mathbf{x}" />, trong đó
          ảnh được trải phẳng thành vector <MathText tex="\mathbf{x}" /> còn{' '}
          <MathText tex="C" /> là một <b>ma trận thưa dạng Toeplitz</b> (Ch3): mỗi hàng
          chứa các trọng số kernel đặt lệch dần, hầu hết phần tử là 0. Weight sharing
          chính là việc các hàng của <MathText tex="C" /> dùng chung một bộ số.
        </Bridge>
      </Section>

      <Section kind="steps" title="Tính một ô feature map từng bước">
        <StepByStep
          steps={[
            {
              title: 'Bài toán',
              content: (
                <p>
                  Cửa sổ ảnh 3×3 là <MathText tex="\begin{bmatrix}10&10&0\\10&10&0\\10&10&0\end{bmatrix}" />{' '}
                  và kernel dò cạnh dọc{' '}
                  <MathText tex="\begin{bmatrix}1&0&-1\\1&0&-1\\1&0&-1\end{bmatrix}" />. Tính ô
                  feature map tương ứng.
                </p>
              ),
            },
            {
              title: 'Bước 1 — nhân từng cặp phần tử',
              content: (
                <p>
                  Nhân phần tử đối phần tử: hàng 1 cho{' '}
                  <MathText tex="10\cdot 1 + 10\cdot 0 + 0\cdot(-1) = 10" />. Hai hàng còn
                  lại giống hệt, mỗi hàng cũng ra <MathText tex="10" />.
                </p>
              ),
            },
            {
              title: 'Bước 2 — cộng tất cả lại',
              content: (
                <p>
                  <MathText tex="S = 10 + 10 + 10 = 30" />. Cột trái (sáng) và cột phải
                  (tối) lệch nhau lớn nên kernel cho giá trị cao — đó là một cạnh.
                </p>
              ),
            },
            {
              title: 'Bước 3 — vùng phẳng cho 0',
              content: (
                <p>
                  Đặt cửa sổ hẳn vào vùng trái đồng đều{' '}
                  <MathText tex="\begin{bmatrix}10&10&10\\ \cdots\end{bmatrix}" />: mỗi hàng
                  cho <MathText tex="10\cdot1 + 10\cdot0 + 10\cdot(-1) = 0" />, tổng{' '}
                  <MathText tex="= 0" />. Không có cạnh → không phản hồi. Đó là lý do
                  feature map chỉ "sáng" ở đúng đường biên.
                </p>
              ),
            },
          ]}
        />
      </Section>

      <Section kind="quiz" title="Kiểm tra hiểu">
        <Quiz
          lessonKey="ch12/cnn"
          questions={[
            {
              q: (
                <>
                  Cửa sổ ảnh <MathText tex="\begin{bmatrix}1&2\\3&4\end{bmatrix}" /> và kernel{' '}
                  <MathText tex="\begin{bmatrix}0&1\\1&0\end{bmatrix}" />. Giá trị feature
                  map (cross-correlation) bằng?
                </>
              ),
              options: ['5', '10', '4', '7'],
              answer: 0,
              explain: (
                <>
                  <MathText tex="1\cdot0 + 2\cdot1 + 3\cdot1 + 4\cdot0 = 0 + 2 + 3 + 0 = 5" />.
                </>
              ),
            },
            {
              q: <>"Chia sẻ trọng số" (weight sharing) trong CNN nghĩa là gì?</>,
              options: [
                'Mỗi vị trí trên ảnh có một kernel riêng',
                'Cùng một kernel được dùng ở mọi vị trí trên ảnh',
                'Các ảnh khác nhau dùng chung nhãn',
                'Trọng số luôn bằng 0',
              ],
              answer: 1,
              explain: (
                <>
                  Một kernel duy nhất trượt khắp ảnh, nên số tham số ít và đặc trưng học
                  được (như bộ dò cạnh) áp dụng ở mọi nơi — tính bất biến tịnh tiến.
                </>
              ),
            },
            {
              q: (
                <>
                  Ảnh 7×7 chập với kernel 3×3, stride 1, không padding. Feature map có
                  kích thước bao nhiêu?
                </>
              ),
              options: ['7×7', '5×5', '3×3', '6×6'],
              answer: 1,
              explain: (
                <>
                  <MathText tex="7 - 3 + 1 = 5" /> theo mỗi chiều, nên feature map là 5×5.
                </>
              ),
            },
            {
              q: <>Vì sao convolution được xem là "đại số tuyến tính áp dụng"?</>,
              options: [
                'Vì nó dùng phép chia đa thức',
                'Vì mỗi ô đầu ra là một dot product, và cả phép chập là một nhân ma trận thưa (Toeplitz)',
                'Vì nó cần tính định thức',
                'Vì kernel phải là ma trận nghịch đảo của ảnh',
              ],
              answer: 1,
              explain: (
                <>
                  Mỗi ô = dot product cục bộ; gộp lại,{' '}
                  <MathText tex="S = C\mathbf{x}" /> với <MathText tex="C" /> là ma trận
                  Toeplitz thưa — convolution chính là một biến đổi tuyến tính.
                </>
              ),
            },
          ]}
        />
      </Section>
    </Lesson>
  );
}
