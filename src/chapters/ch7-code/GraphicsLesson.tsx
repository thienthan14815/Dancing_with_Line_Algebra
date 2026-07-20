import { Lesson, Section } from '../../components/Lesson';
import MathText from '../../components/MathText';
import CodePlayground from '../../components/CodePlayground';
import Quiz from '../../components/Quiz';

const CODE = `// === Đồ họa 2D: biến đổi một hình bằng ma trận ===
// Một "hình" chỉ là danh sách các đỉnh. Biến đổi hình = nhân
// từng đỉnh với một ma trận 2x2. Đây chính là cách game & phần
// mềm đồ họa xoay/co giãn mọi vật.

// Ngôi nhà (đa giác kín): mỗi phần tử là một đỉnh [x, y]
const house = [
  [-1.5, -1.5],
  [ 1.5, -1.5],
  [ 1.5,  0.5],
  [ 0,    1.5],   // đỉnh nóc
  [-1.5,  0.5],
  [-1.5, -1.5],
];

// Áp ma trận M cho MỌI đỉnh của một hình -> hình mới
function applyMat(M, shape) {
  return shape.map(function (p) { return la.matVec(M, p); });
}

// Ma trận xoay 30 độ (dùng đúng hàm của thư viện app)
const deg = 30;
const R = la.rotation2D(deg * Math.PI / 180);

const moved = applyMat(R, house);

// Vẽ hình gốc (mờ) rồi hình sau khi xoay (đậm)
draw.polygon(house, { fill: 'var(--vec-3)', opacity: 0.15 });
draw.polygon(moved, { fill: 'var(--vec-1)', opacity: 0.40 });

print('Ma trận xoay ' + deg + ' độ:');
print(R[0]);
print(R[1]);
print('Đỉnh nóc: gốc = ' + JSON.stringify(house[3]));
print('           sau xoay = ' + JSON.stringify(moved[3].map(function (x) { return +x.toFixed(3); })));`;

const NUMPY = `import numpy as np

# Ngôi nhà: mỗi HÀNG là một đỉnh (x, y)
house = np.array([
    [-1.5, -1.5],
    [ 1.5, -1.5],
    [ 1.5,  0.5],
    [ 0.0,  1.5],
    [-1.5,  0.5],
    [-1.5, -1.5],
])

theta = np.deg2rad(30)
R = np.array([[np.cos(theta), -np.sin(theta)],
              [np.sin(theta),  np.cos(theta)]])

# Vì mỗi đỉnh là một HÀNG, ta nhân với R chuyển vị: (R @ v) cho mỗi hàng
moved = house @ R.T

print(R)
print("nóc:", house[3], "->", moved[3])`;

export default function GraphicsLesson() {
  return (
    <Lesson id="graphics" title="Đồ họa: biến đổi hình">
      <p className="muted">
        Chương này ta không học khái niệm mới nữa — ta <strong>viết code</strong> dùng chính thư
        viện toán của app (biến <code>la</code>) để giải những bài toán thật. Bấm{' '}
        <strong>▶ Chạy</strong>, sửa code, chạy lại. Mọi thứ chạy ngay trong trình duyệt.
      </p>

      <Section kind="theory" title="Bài toán: xoay một vật trên màn hình">
        <p style={{ marginTop: 0 }}>
          Mọi phần mềm đồ họa — game, Photoshop, CAD — đều lưu một hình dưới dạng{' '}
          <strong>danh sách đỉnh</strong>. Muốn xoay, co giãn hay lật hình, chúng nhân{' '}
          <em>từng đỉnh</em> với một ma trận biến đổi. Đó đúng là{' '}
          <MathText tex={'\\vec{v}\\, \\mapsto\\, M\\vec{v}'} /> mà ta đã gặp ở{' '}
          <strong>Chương 3</strong> (ma trận = biến đổi tuyến tính).
        </p>
        <p>
          Ma trận xoay một góc <MathText tex={'\\theta'} /> là{' '}
          <MathText
            tex={
              'R(\\theta) = \\begin{bmatrix} \\cos\\theta & -\\sin\\theta \\\\ \\sin\\theta & \\cos\\theta \\end{bmatrix}'
            }
          />
          . Thư viện app đã có sẵn nó: <code>la.rotation2D(theta)</code> (theta tính bằng radian).
        </p>
      </Section>

      <Section kind="explore" title="Chạy thử & nghịch code">
        <CodePlayground scene="2d" height={460} initialCode={CODE} numpyCode={NUMPY} />

        <div className="panel" style={{ marginTop: 12 }}>
          <strong>🎯 Thử thách</strong> — sửa code ở trên rồi bấm ▶ Chạy lại:
          <ol style={{ marginBottom: 0 }}>
            <li>
              <strong>Đổi góc xoay.</strong> Thay <code>const deg = 30;</code> thành 60, 90, 180.
              Hình gốc (mờ) đứng yên, hình xoay (đậm) quay theo.
            </li>
            <li>
              <strong>Scale rồi xoay ≠ xoay rồi scale.</strong> Dựng hai ma trận hợp và so sánh —
              đây là tính <em>không giao hoán</em> của phép nhân ma trận (Chương 3).
              <details>
                <summary>Gợi ý đáp án</summary>
                <pre style={{ whiteSpace: 'pre-wrap' }}>{`const S = la.scaling2D(1.8, 0.6);   // dẹt theo trục y
const RS = la.matMul(R, S);         // S trước, R sau
const SR = la.matMul(S, R);         // R trước, S sau
draw.polygon(applyMat(RS, house), { fill: 'var(--vec-1)', opacity: 0.4 });
draw.polygon(applyMat(SR, house), { fill: 'var(--vec-2)', opacity: 0.4 });
// Hai hình KHÁC nhau -> M·N ≠ N·M`}</pre>
              </details>
            </li>
            <li>
              <strong>Tự viết ma trận đối xứng (reflection).</strong> Lật hình qua trục x.
              <details>
                <summary>Gợi ý đáp án</summary>
                <pre style={{ whiteSpace: 'pre-wrap' }}>{`const F = [[1, 0], [0, -1]];   // lật qua trục hoành
draw.polygon(applyMat(F, house), { fill: 'var(--vec-2)', opacity: 0.4 });`}</pre>
              </details>
            </li>
            <li>
              <strong>“Vệt chuyển động”.</strong> Vẽ hình ở nhiều góc, alpha tăng dần để tạo cảm
              giác quay.
              <details>
                <summary>Gợi ý đáp án</summary>
                <pre style={{ whiteSpace: 'pre-wrap' }}>{`for (let k = 0; k <= 8; k++) {
  const ang = (k / 8) * (Math.PI / 2);   // từ 0 tới 90 độ
  const Rk = la.rotation2D(ang);
  draw.polygon(applyMat(Rk, house), {
    fill: 'var(--vec-1)',
    opacity: 0.06 + k * 0.05,
  });
}`}</pre>
              </details>
            </li>
            <li>
              <strong>Xoay cả không gian.</strong> Thay vì tự nhân từng đỉnh, giao ma trận cho
              canvas bằng <code>draw.matrix(R)</code> — lưới và hình cùng quay (kiểu Chương 3). Lưu
              ý: khi bật <code>draw.matrix</code> thì <em>mọi</em> hình vẽ đều bị biến đổi, nên chỉ
              vẽ một hình gốc.
              <details>
                <summary>Gợi ý đáp án</summary>
                <pre style={{ whiteSpace: 'pre-wrap' }}>{`draw.polygon(house, { fill: 'var(--vec-1)', opacity: 0.4 });
draw.matrix([[R[0][0], R[0][1]], [R[1][0], R[1][1]]]);
// Cả lưới lẫn ngôi nhà xoay 30 độ`}</pre>
              </details>
            </li>
          </ol>
        </div>
      </Section>

      <Section kind="theory" title="Còn phép tịnh tiến (translate) thì sao?">
        <p style={{ marginTop: 0 }}>
          Xoay, co giãn, lật, shear — tất cả đều là <MathText tex={'\\vec{v} \\mapsto M\\vec{v}'} />{' '}
          với ma trận 2×2, và <strong>giữ nguyên gốc tọa độ</strong> (điểm 0 luôn về 0). Nhưng{' '}
          <em>dời cả hình đi một đoạn</em> (translate) thì ma trận 2×2 không làm được. Mẹo của đồ
          họa máy tính: thêm một chiều — <strong>tọa độ đồng nhất</strong> (homogeneous
          coordinates). Viết điểm <MathText tex={'(x, y)'} /> thành{' '}
          <MathText tex={'(x, y, 1)'} /> và dùng ma trận 3×3:
        </p>
        <MathText
          block
          tex={
            '\\begin{bmatrix} 1 & 0 & t_x \\\\ 0 & 1 & t_y \\\\ 0 & 0 & 1 \\end{bmatrix} \\begin{bmatrix} x \\\\ y \\\\ 1 \\end{bmatrix} = \\begin{bmatrix} x + t_x \\\\ y + t_y \\\\ 1 \\end{bmatrix}'
          }
        />
        <p>
          Nhờ vậy xoay, co giãn <em>và</em> tịnh tiến gộp chung thành một phép nhân ma trận duy
          nhất — đó là lý do GPU chỉ cần một phép toán để đặt mọi vật vào đúng chỗ.
        </p>
      </Section>

      <Section kind="quiz" title="Kiểm tra hiểu">
        <Quiz
          lessonKey="ch7/graphics"
          questions={[
            {
              q: <>Để xoay một hình 2D, ta làm gì với các đỉnh của nó?</>,
              options: [
                'Cộng cùng một vector vào mỗi đỉnh',
                'Nhân mỗi đỉnh với ma trận xoay 2×2',
                'Lấy dot product của các đỉnh',
                'Đảo dấu tọa độ y của mỗi đỉnh',
              ],
              answer: 1,
              explain: (
                <>
                  Biến đổi tuyến tính là <MathText tex={'\\vec{v} \\mapsto M\\vec{v}'} />: ta nhân
                  <em> từng đỉnh</em> với ma trận xoay <MathText tex={'R(\\theta)'} />.
                </>
              ),
            },
            {
              q: (
                <>
                  Bạn thấy “scale rồi xoay” cho kết quả khác “xoay rồi scale”. Điều này minh họa
                  tính chất nào?
                </>
              ),
              options: [
                'Phép nhân ma trận không giao hoán: M·N ≠ N·M',
                'Ma trận xoay không khả nghịch',
                'Determinant luôn bằng 0',
                'Phép nhân ma trận không kết hợp',
              ],
              answer: 0,
              explain: (
                <>
                  Thứ tự áp biến đổi = thứ tự nhân ma trận, và <MathText tex={'MN \\neq NM'} /> nói
                  chung — đúng như Chương 3.
                </>
              ),
            },
            {
              q: <>Vì sao đồ họa dùng tọa độ đồng nhất (thêm một chiều, ma trận 3×3)?</>,
              options: [
                'Để tính nhanh hơn',
                'Để biểu diễn cả phép tịnh tiến (translate) bằng một phép nhân ma trận',
                'Vì ma trận 2×2 không có nghịch đảo',
                'Để giảm sai số làm tròn',
              ],
              answer: 1,
              explain: (
                <>
                  Ma trận 2×2 luôn giữ gốc tọa độ cố định nên không tịnh tiến được. Thêm chiều thứ
                  ba cho phép gộp xoay/co giãn/tịnh tiến vào một ma trận 3×3.
                </>
              ),
            },
          ]}
        />
      </Section>
    </Lesson>
  );
}
