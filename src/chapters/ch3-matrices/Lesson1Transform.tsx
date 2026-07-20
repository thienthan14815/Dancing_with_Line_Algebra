import { useState } from 'react';
import { Lesson, Section } from '../../components/Lesson';
import MathText from '../../components/MathText';
import Canvas2D, { type V2 } from '../../components/Canvas2D';
import MatrixInput from '../../components/MatrixInput';
import StepByStep from '../../components/StepByStep';
import Quiz from '../../components/Quiz';
import { inverse, matVec, type Mat } from '../../lib/linalg';
import { asM2, f2, PRESETS_2D } from './util';

export default function Lesson1Transform() {
  // Ma trận biến đổi hiện tại
  const [M, setM] = useState<Mat>([
    [1, 1],
    [0, 1],
  ]);
  // Vector mẫu — LƯU theo tọa độ GỐC, hiển thị sau khi bị biến đổi.
  const [vOrig, setVOrig] = useState({ x: 1, y: 1 });

  const col1 = [M[0][0], M[1][0]];
  const col2 = [M[0][1], M[1][1]];
  const Mv = matVec(M, [vOrig.x, vOrig.y]);

  // î, ĵ và v đều được Canvas2D biến đổi (transformElements mặc định = true),
  // nên chúng tự "trượt" mượt về vị trí mới khi M đổi.
  const vectors: V2[] = [
    { id: 'i', x: 1, y: 0, color: 'var(--vec-1)', label: 'î' },
    { id: 'j', x: 0, y: 1, color: 'var(--vec-2)', label: 'ĵ' },
    {
      id: 'v',
      x: vOrig.x,
      y: vOrig.y,
      color: 'var(--vec-result)',
      label: 'v',
      draggable: true,
    },
  ];

  // Kéo v: Canvas2D trả về tọa độ màn hình (đã bị biến đổi). Đưa ngược qua M⁻¹
  // để lưu lại tọa độ gốc, nhờ đó v "cưỡi" đúng trên lưới đã biến đổi.
  const onVectorChange = (id: string, x: number, y: number) => {
    if (id !== 'v') return;
    const inv = inverse(M);
    if (!inv) return; // Ma trận suy biến → không kéo được (đã bẹp).
    const o = matVec(inv, [x, y]);
    setVOrig({ x: o[0], y: o[1] });
  };

  return (
    <Lesson id="ch3-transform" title="Ma trận = biến đổi tuyến tính">
      <p className="muted">
        Đây là ý tưởng nền tảng nhất của cả môn học. Một ma trận không phải là “bảng
        số” khô khan — nó là <b>một phép biến đổi</b> kéo giãn, xoay, bẻ nghiêng cả
        mặt phẳng. Và toàn bộ phép biến đổi đó được mã hóa gọn trong hai cột.
      </p>

      <Section kind="explore" title="Kéo lưới, xem î và ĵ đáp xuống đâu">
        <p className="muted" style={{ marginTop: 0 }}>
          <b>Gợi ý thao tác:</b> Bấm lần lượt các preset và nhìn cả lưới trượt sang
          vị trí mới. Chú ý hai vector <span style={{ color: 'var(--vec-1)' }}>î</span>{' '}
          và <span style={{ color: 'var(--vec-2)' }}>ĵ</span>: chúng luôn đáp xuống
          đúng hai cột của ma trận. Kéo đầu vector{' '}
          <span style={{ color: 'var(--vec-result)' }}>v</span> để thấy nó bị “cuốn”
          theo lưới.
        </p>
        <div className="row" style={{ alignItems: 'flex-start', gap: 24 }}>
          <div style={{ flex: '1 1 300px', minWidth: 260 }}>
            <MatrixInput value={M} onChange={setM} presets={PRESETS_2D} />
            <div className="panel" style={{ marginTop: 14, fontSize: 13.5 }}>
              <div style={{ marginBottom: 6 }}>
                <span style={{ color: 'var(--vec-1)', fontWeight: 600 }}>Cột 1</span> ={' '}
                <span className="mono">
                  ({f2(col1[0])}, {f2(col1[1])})
                </span>{' '}
                = nơi <span style={{ color: 'var(--vec-1)' }}>î</span> đáp xuống
              </div>
              <div style={{ marginBottom: 10 }}>
                <span style={{ color: 'var(--vec-2)', fontWeight: 600 }}>Cột 2</span> ={' '}
                <span className="mono">
                  ({f2(col2[0])}, {f2(col2[1])})
                </span>{' '}
                = nơi <span style={{ color: 'var(--vec-2)' }}>ĵ</span> đáp xuống
              </div>
              <div style={{ color: 'var(--text-muted)' }}>
                v gốc ={' '}
                <span className="mono">
                  ({f2(vOrig.x)}, {f2(vOrig.y)})
                </span>{' '}
                →{' '}
                <span style={{ color: 'var(--vec-result)', fontWeight: 600 }}>
                  M·v = ({f2(Mv[0])}, {f2(Mv[1])})
                </span>
              </div>
            </div>
          </div>
          <div style={{ flex: '2 1 360px', minWidth: 300 }}>
            <Canvas2D
              height={420}
              range={5}
              matrix={asM2(M)}
              vectors={vectors}
              onVectorChange={onVectorChange}
            />
          </div>
        </div>
      </Section>

      <Section kind="theory" title="Biến đổi tuyến tính là gì?">
        <p>
          Một <b>biến đổi tuyến tính</b> (linear transformation) là một cách “di
          chuyển” mọi điểm của mặt phẳng, thỏa ba tính chất hình học rất dễ kiểm tra:
        </p>
        <ul>
          <li>
            <b>Gốc tọa độ đứng yên</b> — điểm O luôn ánh xạ về chính nó.
          </li>
          <li>
            <b>Đường thẳng vẫn thẳng</b> — không có đường nào bị bẻ cong.
          </li>
          <li>
            <b>Lưới vẫn đều và song song</b> — các đường song song vẫn song song,
            khoảng cách đều nhau vẫn đều nhau (dù có thể bị nghiêng hay giãn).
          </li>
        </ul>
        <p>
          Chìa khóa: vì lưới vẫn đều, mỗi vector <MathText tex="v" /> luôn viết được
          bằng chính hai vector cơ sở{' '}
          <MathText tex="\hat{\imath}=(1,0)" /> và{' '}
          <MathText tex="\hat{\jmath}=(0,1)" />:
        </p>
        <MathText block tex="v = x\,\hat{\imath} + y\,\hat{\jmath}" />
        <p>
          Tính <b>tuyến tính</b> nghĩa là phép biến đổi <MathText tex="T" /> giao hoán
          được với phép cộng và phép nhân vô hướng, nên:
        </p>
        <MathText
          block
          tex="T(v) = T(x\,\hat{\imath} + y\,\hat{\jmath}) = x\,T(\hat{\imath}) + y\,T(\hat{\jmath})"
        />
        <p>
          Đây là điều <b>kỳ diệu</b>: chỉ cần biết{' '}
          <MathText tex="\hat{\imath}" /> và <MathText tex="\hat{\jmath}" /> đáp xuống
          đâu là ta biết <b>mọi</b> vector đi về đâu. Ta cất hai ảnh đó thành hai{' '}
          <b>cột</b> của ma trận:
        </p>
        <MathText
          block
          tex="A = \left[\,T(\hat{\imath})\;\; T(\hat{\jmath})\,\right] = \begin{bmatrix} a & b \\ c & d \end{bmatrix}"
        />
        <p>Khai triển ra chính là công thức nhân ma trận với vector:</p>
        <MathText
          block
          tex="A v = x\begin{bmatrix} a \\ c \end{bmatrix} + y\begin{bmatrix} b \\ d \end{bmatrix} = \begin{bmatrix} a x + b y \\ c x + d y \end{bmatrix}"
        />
        <p className="muted">
          Đọc lại công thức này theo kiểu hình học: <MathText tex="Av" /> là “đi{' '}
          <MathText tex="x" /> bước theo cột 1, rồi <MathText tex="y" /> bước theo cột
          2”. Nhân ma trận với vector chỉ là <b>tổ hợp tuyến tính của các cột</b>.
        </p>
      </Section>

      <Section kind="steps" title="Tính A·v từng bước theo cột">
        <p className="muted">
          Lấy <MathText tex="A = \begin{bmatrix} 2 & 1 \\ 0 & 3 \end{bmatrix}" /> và{' '}
          <MathText tex="v = \begin{bmatrix} 2 \\ 1 \end{bmatrix}" />.
        </p>
        <StepByStep
          steps={[
            {
              title: 'Bước 1 — Tách v theo î và ĵ',
              content: (
                <div>
                  <MathText block tex="v = 2\,\hat{\imath} + 1\,\hat{\jmath}" />
                  <p className="muted">
                    Mọi vector đều là tổ hợp của î và ĵ. Ở đây hệ số là 2 và 1.
                  </p>
                </div>
              ),
            },
            {
              title: 'Bước 2 — Xem î, ĵ đáp xuống đâu',
              content: (
                <div>
                  <MathText
                    block
                    tex="\hat{\imath} \to \begin{bmatrix} 2 \\ 0 \end{bmatrix}\ (\text{cột 1}), \qquad \hat{\jmath} \to \begin{bmatrix} 1 \\ 3 \end{bmatrix}\ (\text{cột 2})"
                  />
                  <p className="muted">Hai cột của A chính là hai đích đến.</p>
                </div>
              ),
            },
            {
              title: 'Bước 3 — Thay vào, giữ nguyên hệ số',
              content: (
                <MathText
                  block
                  tex="A v = 2\begin{bmatrix} 2 \\ 0 \end{bmatrix} + 1\begin{bmatrix} 1 \\ 3 \end{bmatrix}"
                />
              ),
            },
            {
              title: 'Bước 4 — Cộng lại',
              content: (
                <div>
                  <MathText
                    block
                    tex="A v = \begin{bmatrix} 4 \\ 0 \end{bmatrix} + \begin{bmatrix} 1 \\ 3 \end{bmatrix} = \begin{bmatrix} 5 \\ 3 \end{bmatrix}"
                  />
                  <p className="muted">
                    Vector v đã đáp xuống điểm (5, 3). Thử đối chiếu bằng công thức{' '}
                    <MathText tex="(ax+by,\;cx+dy)" />: <MathText tex="(2\cdot2+1\cdot1,\;0\cdot2+3\cdot1)=(5,3)" /> — khớp!
                  </p>
                </div>
              ),
            },
          ]}
        />
      </Section>

      <Section kind="quiz" title="Kiểm tra hiểu">
        <Quiz
          lessonKey="ch3/transform"
          questions={[
            {
              q: (
                <>
                  Cột thứ nhất của ma trận <MathText tex="A" /> cho ta biết điều gì?
                </>
              ),
              options: [
                <>Nơi <MathText tex="\hat{\imath}=(1,0)" /> đáp xuống sau biến đổi</>,
                <>Nơi <MathText tex="\hat{\jmath}=(0,1)" /> đáp xuống</>,
                <>Diện tích của hình sau biến đổi</>,
                <>Góc quay của phép biến đổi</>,
              ],
              answer: 0,
              explain: (
                <>
                  Cột 1 là ảnh của <MathText tex="\hat{\imath}" />, cột 2 là ảnh của{' '}
                  <MathText tex="\hat{\jmath}" />. Đó là toàn bộ thông tin của biến đổi.
                </>
              ),
            },
            {
              q: (
                <>
                  Với <MathText tex="A=\begin{bmatrix}0&-1\\1&0\end{bmatrix}" />, vector{' '}
                  <MathText tex="\hat{\imath}=(1,0)" /> đáp xuống đâu?
                </>
              ),
              options: [
                <MathText tex="(0,1)" />,
                <MathText tex="(1,0)" />,
                <MathText tex="(-1,0)" />,
                <MathText tex="(0,-1)" />,
              ],
              answer: 0,
              explain: (
                <>
                  Cột 1 là <MathText tex="(0,1)" /> — đây chính là phép xoay 90° ngược
                  chiều kim đồng hồ.
                </>
              ),
            },
            {
              q: (
                <>
                  Tại sao chỉ cần biết ảnh của <MathText tex="\hat{\imath}" /> và{' '}
                  <MathText tex="\hat{\jmath}" /> là đủ để biết ảnh của mọi vector?
                </>
              ),
              options: [
                <>Vì mọi vector là tổ hợp tuyến tính của î, ĵ và biến đổi giữ tính tuyến tính</>,
                <>Vì î và ĵ luôn đứng yên</>,
                <>Vì determinant luôn bằng 1</>,
                <>Đó chỉ là quy ước, không có lý do</>,
              ],
              answer: 0,
              explain: (
                <>
                  <MathText tex="v=x\hat{\imath}+y\hat{\jmath}" /> nên{' '}
                  <MathText tex="T(v)=xT(\hat{\imath})+yT(\hat{\jmath})" />. Biết hai
                  ảnh là suy ra tất cả.
                </>
              ),
            },
            {
              q: (
                <>
                  Tính <MathText tex="\begin{bmatrix}1&2\\3&4\end{bmatrix}\begin{bmatrix}1\\1\end{bmatrix}" />.
                </>
              ),
              options: [
                <MathText tex="(3,7)" />,
                <MathText tex="(2,4)" />,
                <MathText tex="(1,3)" />,
                <MathText tex="(4,6)" />,
              ],
              answer: 0,
              explain: (
                <>
                  Cộng hai cột: <MathText tex="1\cdot(1,3)+1\cdot(2,4)=(3,7)" />.
                </>
              ),
            },
          ]}
        />
      </Section>
    </Lesson>
  );
}
