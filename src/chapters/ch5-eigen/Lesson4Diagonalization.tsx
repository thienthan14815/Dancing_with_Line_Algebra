import { useState } from 'react';
import { Lesson, Section } from '../../components/Lesson';
import MathText from '../../components/MathText';
import Canvas2D, { type V2 } from '../../components/Canvas2D';
import StepByStep from '../../components/StepByStep';
import Quiz from '../../components/Quiz';
import { matMul, inverse, type Mat } from '../../lib/linalg';
import { asM2, UNIT_SQUARE } from './util';

// A = [[2,1],[1,2]] có eigenvalue 3, 1 với eigenvector (1,1), (-1,1).
const A: Mat = [
  [2, 1],
  [1, 2],
];
const P: Mat = [
  [1, -1],
  [1, 1],
];
const D: Mat = [
  [3, 0],
  [0, 1],
];
const Pinv = inverse(P) as Mat; // = [[0.5,0.5],[-0.5,0.5]]
const DPinv = matMul(D, Pinv);
const PDPinv = matMul(P, DPinv); // = A

// Ma trận tích lũy theo từng nhịp.
const STAGE_MATS: Mat[] = [
  [[1, 0], [0, 1]], // 0: chưa làm gì
  Pinv, // 1: đổi sang góc nhìn eigen
  DPinv, // 2: co giãn theo trục
  PDPinv, // 3: quay lại góc nhìn cũ = A
];

export default function Lesson4Diagonalization() {
  const [stage, setStage] = useState(0);
  const [direct, setDirect] = useState(false);

  const matrix = direct ? A : STAGE_MATS[stage];

  const vectors: V2[] = [
    { id: 'i', x: 1, y: 0, color: 'var(--vec-1)', label: 'î' },
    { id: 'j', x: 0, y: 1, color: 'var(--vec-2)', label: 'ĵ' },
    { id: 'v', x: 1.5, y: 0.5, color: 'var(--vec-result)', label: 'v' },
  ];

  return (
    <Lesson id="ch5-diagonalization" title="Diagonalization">
      <p className="muted">
        Nếu một biến đổi <MathText tex="A" /> rối rắm trở nên đơn giản khi nhìn theo cơ sở
        eigenvector, tại sao không <b>đổi hẳn sang cơ sở đó</b>, làm phần dễ, rồi đổi
        ngược lại? Đó chính xác là ý tưởng của <b>diagonalization</b> (chéo hóa).
      </p>

      <Section kind="explore" title="Ba nhịp thay cho một phép biến đổi rối">
        <p className="muted" style={{ marginTop: 0 }}>
          <b>Nhiệm vụ:</b> Bấm từng bước và xem lưới biến hình. Ta thay việc áp thẳng{' '}
          <MathText tex="A" /> bằng <b>ba nhịp</b>: đổi sang góc nhìn eigen{' '}
          (<MathText tex="P^{-1}" />) → co giãn theo trục (<MathText tex="D" />) → đổi về
          góc nhìn cũ (<MathText tex="P" />). Rồi bật <b>"Áp thẳng A"</b> để so sánh —{' '}
          <b>kết quả cuối trùng khít</b>.
        </p>

        <div className="row" style={{ alignItems: 'flex-start', gap: 24 }}>
          <div style={{ flex: '1 1 300px', minWidth: 260 }}>
            <StepByStep
              onStepChange={setStage}
              steps={[
                {
                  title: 'Nhịp 0 — Xuất phát',
                  content: <p className="muted">Lưới chuẩn, chưa biến đổi. Nhìn î, ĵ và v ở vị trí gốc.</p>,
                },
                {
                  title: 'Nhịp 1 — Áp P⁻¹ (đổi sang góc nhìn eigen)',
                  content: (
                    <p className="muted">
                      Ta "duỗi thẳng" hệ trục về theo hai eigenvector. Trong khung nhìn mới
                      này, A sẽ chỉ còn là co giãn theo trục.
                    </p>
                  ),
                },
                {
                  title: 'Nhịp 2 — Áp D (co giãn theo trục)',
                  content: (
                    <p className="muted">
                      Phần <b>dễ nhất</b>: chỉ nhân trục thứ nhất với 3, trục thứ hai với 1.
                      Không xoay, không bẻ nghiêng — vì D là ma trận đường chéo.
                    </p>
                  ),
                },
                {
                  title: 'Nhịp 3 — Áp P (quay về góc nhìn cũ)',
                  content: (
                    <p className="muted">
                      Đưa kết quả trở lại hệ tọa độ ban đầu. Giờ lưới trùng khít với khi ta
                      áp thẳng A. Thử nút bên dưới!
                    </p>
                  ),
                },
              ]}
            />
            <div style={{ marginTop: 12 }}>
              <button className={`btn ${direct ? 'btn-primary' : ''}`} onClick={() => setDirect((d) => !d)}>
                {direct ? '↩ Xem lại 3 nhịp' : 'Áp thẳng A để so sánh'}
              </button>
            </div>
            <div className="panel" style={{ marginTop: 14, fontSize: 13 }}>
              <div style={{ marginBottom: 6, color: 'var(--text-muted)' }}>Đang áp ma trận tích lũy:</div>
              <MathText
                block
                tex={
                  direct
                    ? 'A = \\begin{bmatrix} 2 & 1 \\\\ 1 & 2 \\end{bmatrix}'
                    : ['I', 'P^{-1}', 'D\\,P^{-1}', 'P\\,D\\,P^{-1} = A'][stage]
                }
              />
            </div>
          </div>
          <div style={{ flex: '2 1 340px', minWidth: 300 }}>
            <Canvas2D
              height={420}
              range={6}
              matrix={asM2(matrix)}
              vectors={vectors}
              polygons={[{ points: UNIT_SQUARE, fill: 'var(--vec-3)', opacity: 0.16 }]}
            />
          </div>
        </div>
      </Section>

      <Section kind="theory" title="A = PDP⁻¹ — biến đổi trong bộ áo mới">
        <p>
          Gom các eigenvector thành các <b>cột</b> của ma trận <MathText tex="P" /> và các
          eigenvalue lên <b>đường chéo</b> của <MathText tex="D" />:
        </p>
        <MathText
          block
          tex="P = \big[\,v_1\ \ v_2\,\big] = \begin{bmatrix} 1 & -1 \\ 1 & 1 \end{bmatrix},\qquad D = \begin{bmatrix} 3 & 0 \\ 0 & 1 \end{bmatrix}"
        />
        <p>Khi đó A tách được thành:</p>
        <MathText block tex="A = P\,D\,P^{-1}" />
        <p>
          Đọc từ phải sang trái đúng như ba nhịp: <MathText tex="P^{-1}" /> đổi tọa độ một
          vector sang <b>hệ cơ sở eigenvector</b> (nối lại bài đổi cơ sở chương 4); rồi{' '}
          <MathText tex="D" /> chỉ co giãn từng trục — biến đổi "trong mơ" vì đường chéo;
          rồi <MathText tex="P" /> dịch kết quả trở về hệ tọa độ gốc. Ba bước tầm thường
          ghép lại thành đúng A.
        </p>
        <p>
          <b>Điều kiện đủ để chéo hóa:</b> ma trận <MathText tex="n\times n" /> phải có đủ{' '}
          <MathText tex="n" /> eigenvector <b>độc lập tuyến tính</b> (để P khả nghịch). Ma
          trận <b>defective</b> như shear thì không đủ, nên không chéo hóa được.
        </p>
        <p className="muted">
          Tin vui: mọi ma trận <b>đối xứng</b> (<MathText tex="A = A^\top" />) luôn chéo hóa
          được, và còn hơn thế — bằng một P <b>trực giao</b> (các eigenvector vuông góc
          nhau, như hai đường vuông góc bạn thấy ở bài eigenspace). Đây là cửa ngõ sang
          chương 6 (SVD).
        </p>
      </Section>

      <Section kind="steps" title="Dựng P, D và kiểm chứng PDP⁻¹ = A">
        <StepByStep
          steps={[
            {
              title: 'Bước 1 — Thu thập eigenvalue & eigenvector',
              content: (
                <div>
                  <MathText block tex="\lambda_1 = 3,\ v_1 = (1,1); \qquad \lambda_2 = 1,\ v_2 = (-1,1)" />
                  <p className="muted">Lấy từ bài trước.</p>
                </div>
              ),
            },
            {
              title: 'Bước 2 — Dựng P (cột = eigenvector) và D (chéo = eigenvalue)',
              content: (
                <MathText
                  block
                  tex="P = \begin{bmatrix} 1 & -1 \\ 1 & 1 \end{bmatrix}, \quad D = \begin{bmatrix} 3 & 0 \\ 0 & 1 \end{bmatrix}"
                />
              ),
            },
            {
              title: 'Bước 3 — Tính P⁻¹',
              content: (
                <div>
                  <MathText block tex="\det P = 1\cdot 1 - (-1)\cdot 1 = 2 \Rightarrow P^{-1} = \tfrac{1}{2}\begin{bmatrix} 1 & 1 \\ -1 & 1 \end{bmatrix}" />
                  <p className="muted">Thứ tự cột trong P phải khớp thứ tự eigenvalue trong D.</p>
                </div>
              ),
            },
            {
              title: 'Bước 4 — Nhân PDP⁻¹ và kiểm chứng',
              content: (
                <div>
                  <MathText block tex="PD = \begin{bmatrix} 3 & -1 \\ 3 & 1 \end{bmatrix}" />
                  <MathText block tex="PD\,P^{-1} = \begin{bmatrix} 3 & -1 \\ 3 & 1 \end{bmatrix}\cdot \tfrac{1}{2}\begin{bmatrix} 1 & 1 \\ -1 & 1 \end{bmatrix} = \begin{bmatrix} 2 & 1 \\ 1 & 2 \end{bmatrix} = A" />
                  <p className="muted">Trùng khít với A ban đầu — chéo hóa thành công.</p>
                </div>
              ),
            },
          ]}
        />
      </Section>

      <Section kind="quiz" title="Kiểm tra hiểu">
        <Quiz
          lessonKey="ch5/diagonalization"
          questions={[
            {
              q: <>Trong <MathText tex="A = PDP^{-1}" />, các cột của P và đường chéo của D là gì?</>,
              options: [
                <>Cột của P là eigenvector, chéo của D là eigenvalue tương ứng</>,
                <>Cột của P là eigenvalue, chéo của D là eigenvector</>,
                <>P và D đều là ma trận identity</>,
                <>P là nghịch đảo của D</>,
              ],
              answer: 0,
              explain: (
                <>
                  Cột thứ i của P là eigenvector <MathText tex="v_i" />, phần tử{' '}
                  <MathText tex="D_{ii}" /> là eigenvalue <MathText tex="\lambda_i" /> của nó.
                  Thứ tự phải khớp nhau.
                </>
              ),
            },
            {
              q: <>Vì sao làm việc với D dễ hơn nhiều so với A?</>,
              options: [
                <>D là ma trận đường chéo — chỉ co giãn từng trục, không xoay/bẻ nghiêng</>,
                <>D luôn là ma trận identity</>,
                <>D không có nghịch đảo nên khỏi tính</>,
                <>D luôn nhỏ hơn A</>,
              ],
              answer: 0,
              explain: (
                <>
                  Nhân với ma trận đường chéo chỉ là scale từng tọa độ độc lập; lũy thừa,
                  nghịch đảo… đều tầm thường. Đó là toàn bộ lợi ích của chéo hóa.
                </>
              ),
            },
            {
              q: <>Ma trận nào chắc chắn KHÔNG chéo hóa được (trên số thực)?</>,
              options: [
                <>Ma trận defective — thiếu eigenvector độc lập (như shear [[1,1],[0,1]])</>,
                <>Mọi ma trận đối xứng</>,
                <>Ma trận đường chéo</>,
                <>Ma trận có 2 eigenvalue khác nhau</>,
              ],
              answer: 0,
              explain: (
                <>
                  Cần đủ n eigenvector độc lập để P khả nghịch. Defective thiếu điều đó nên
                  không dựng được P⁻¹.
                </>
              ),
            },
            {
              q: <>Nhìn theo trình tự phải→trái của <MathText tex="PDP^{-1}v" />, bước đầu tiên <MathText tex="P^{-1}" /> làm gì?</>,
              options: [
                <>Đổi tọa độ của v sang hệ cơ sở eigenvector</>,
                <>Co giãn v theo các eigenvalue</>,
                <>Xoay v đúng 90°</>,
                <>Biến v thành vector 0</>,
              ],
              answer: 0,
              explain: (
                <>
                  <MathText tex="P^{-1}" /> chuyển v sang tọa độ trong cơ sở eigenvector; sau
                  đó D scale, rồi P đưa về hệ gốc. Đúng như "đổi cơ sở" ở chương 4.
                </>
              ),
            },
          ]}
        />
      </Section>
    </Lesson>
  );
}
