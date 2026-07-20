import { useState } from 'react';
import { Lesson, Section } from '../../components/Lesson';
import MathText from '../../components/MathText';
import Canvas2D from '../../components/Canvas2D';
import Quiz from '../../components/Quiz';
import { Hint, TwoCol, Bridge } from './_shared';

type M2 = [[number, number], [number, number]];

// Chữ "F" bất đối xứng — để mọi phép lật/xoay đều nhìn thấy rõ.
const F_SHAPE: [number, number][] = [
  [-0.6, 1.5],
  [0.8, 1.5],
  [0.8, 1.1],
  [-0.2, 1.1],
  [-0.2, 0.5],
  [0.5, 0.5],
  [0.5, 0.1],
  [-0.2, 0.1],
  [-0.2, -1.5],
  [-0.6, -1.5],
];

const AUGS: { key: string; label: string; m: M2; tex: string }[] = [
  { key: 'id', label: 'Ảnh gốc', m: [[1, 0], [0, 1]], tex: '\\begin{bmatrix}1&0\\\\0&1\\end{bmatrix}' },
  { key: 'flipH', label: 'Lật ngang', m: [[-1, 0], [0, 1]], tex: '\\begin{bmatrix}-1&0\\\\0&1\\end{bmatrix}' },
  { key: 'flipV', label: 'Lật dọc', m: [[1, 0], [0, -1]], tex: '\\begin{bmatrix}1&0\\\\0&-1\\end{bmatrix}' },
  { key: 'rot', label: 'Xoay 90°', m: [[0, -1], [1, 0]], tex: '\\begin{bmatrix}0&-1\\\\1&0\\end{bmatrix}' },
  { key: 'scale', label: 'Phóng to 1.3×', m: [[1.3, 0], [0, 1.3]], tex: '\\begin{bmatrix}1.3&0\\\\0&1.3\\end{bmatrix}' },
];

export default function CVLesson() {
  const [augKey, setAugKey] = useState('id');
  const aug = AUGS.find((a) => a.key === augKey) ?? AUGS[0];

  return (
    <Lesson id="cv" title="Thị giác máy tính (tổng quan)">
      <Section kind="explore" title="Data augmentation = biến đổi ma trận trên ảnh">
        <TwoCol>
          <div>
            <Canvas2D
              height={340}
              range={3}
              showGrid
              showAxes
              matrix={aug.m}
              polygons={[{ points: F_SHAPE, fill: 'var(--vec-1)', opacity: 0.45, stroke: 'var(--vec-1)' }]}
            />
          </div>
          <div>
            <div className="dim" style={{ fontSize: 13, marginBottom: 8 }}>
              Chọn một phép <b>augmentation</b> (làm giàu dữ liệu) — mỗi phép là một{' '}
              <b>ma trận biến đổi</b> áp lên tọa độ điểm ảnh:
            </div>
            <div className="row" style={{ gap: 8, flexWrap: 'wrap' }}>
              {AUGS.map((a) => (
                <button
                  key={a.key}
                  className={`btn ${a.key === augKey ? 'btn-primary' : ''}`}
                  onClick={() => setAugKey(a.key)}
                >
                  {a.label}
                </button>
              ))}
            </div>
            <div style={{ marginTop: 16 }}>
              <div className="dim" style={{ fontSize: 12, marginBottom: 4 }}>
                Ma trận đang áp dụng:
              </div>
              <MathText block tex={`A = ${aug.tex}`} />
            </div>
          </div>
        </TwoCol>
        <Hint>
          Lật, xoay, phóng to đều chỉ là <b>nhân ảnh với một ma trận</b> (ch3). Trong huấn luyện, ta tạo ra
          NHIỀU biến thể của mỗi ảnh như vậy để mô hình học được đặc trưng <i>bất biến</i> với các phép đó —
          một con mèo bị lật ngang vẫn là con mèo.
        </Hint>
      </Section>

      <Section kind="explore" title="Máy 'nhìn' ra cái gì? Bounding box & phân đoạn">
        <svg width={520} height={200} viewBox="0 0 520 200" style={{ maxWidth: '100%', display: 'block' }}>
          {/* khung ảnh */}
          <rect x={8} y={8} width={240} height={184} rx={10} fill="var(--panel-2)" stroke="var(--border)" />
          <text x={16} y={26} fontSize={12} fill="var(--text-muted)">
            Phát hiện (detection)
          </text>
          {/* "đối tượng" */}
          <circle cx={110} cy={120} r={34} fill="var(--vec-3)" opacity={0.55} />
          <rect x={150} y={95} width={60} height={55} rx={6} fill="var(--vec-2)" opacity={0.55} />
          {/* bounding boxes */}
          <rect x={72} y={82} width={78} height={78} fill="none" stroke="var(--vec-3)" strokeWidth={2} />
          <text x={72} y={78} fontSize={11} fill="var(--vec-3)" fontWeight={700}>
            mèo 0.94
          </text>
          <rect x={146} y={90} width={70} height={66} fill="none" stroke="var(--vec-2)" strokeWidth={2} />
          <text x={146} y={86} fontSize={11} fill="var(--vec-2)" fontWeight={700}>
            hộp 0.88
          </text>

          {/* khung ảnh 2 — segmentation */}
          <rect x={272} y={8} width={240} height={184} rx={10} fill="var(--panel-2)" stroke="var(--border)" />
          <text x={280} y={26} fontSize={12} fill="var(--text-muted)">
            Phân đoạn (segmentation) — nhãn từng pixel
          </text>
          <circle cx={374} cy={120} r={34} fill="var(--vec-3)" opacity={0.85} />
          <rect x={414} y={95} width={60} height={55} rx={4} fill="var(--vec-2)" opacity={0.85} />
          <rect x={280} y={150} width={224} height={34} fill="var(--accent-2)" opacity={0.35} />
          <text x={286} y={172} fontSize={11} fill="var(--text-muted)">
            nền
          </text>
        </svg>
        <Hint>
          <b>Phân loại</b> gán một nhãn cho cả ảnh; <b>phát hiện</b> vẽ bounding box quanh từng đối tượng kèm
          nhãn; <b>phân đoạn</b> đi xa nhất — gán nhãn cho <i>từng pixel</i>. Cả ba đều là ánh xạ từ lưới pixel
          sang nhãn.
        </Hint>
      </Section>

      <Section kind="theory" title="Bức tranh lớn của Thị giác máy tính">
        <p>
          Một bức ảnh với máy tính chỉ là một <b>lưới số</b>: ảnh xám là ma trận{' '}
          <MathText tex="H\times W" />, ảnh màu là tensor <MathText tex="H\times W\times 3" /> (ba kênh
          R, G, B). Mọi bài toán CV là học một ánh xạ từ lưới số đó sang thứ ta cần:
        </p>
        <ul>
          <li>
            <b>Phân loại (image classification):</b> ảnh → một nhãn (mèo/chó/…). Xương sống là <b>CNN</b> (ch12).
          </li>
          <li>
            <b>Phát hiện đối tượng (object detection):</b> ảnh → danh sách <i>bounding box</i> + nhãn + độ tự
            tin (ví dụ họ YOLO, Faster R-CNN).
          </li>
          <li>
            <b>Phân đoạn (segmentation):</b> gán nhãn cho từng pixel — semantic (theo lớp) hoặc instance (tách
            từng cá thể).
          </li>
          <li>
            <b>Transfer learning:</b> lấy mạng đã <i>pretrained</i> trên tập lớn (ImageNet), thay lớp cuối và{' '}
            <i>fine-tune</i> cho bài toán mới với ít dữ liệu — tiết kiệm rất nhiều công.
          </li>
          <li>
            <b>Style transfer:</b> tách "nội dung" và "phong cách" từ đặc trưng của CNN rồi trộn lại — biến
            ảnh chụp thành tranh theo phong cách một họa sĩ.
          </li>
        </ul>
        <p>
          Đây mới là bản đồ rút gọn.{' '}
          <a href="#/so-tay/dl-map" style={{ color: 'var(--accent-strong)', fontWeight: 600 }}>
            Đọc bản đồ Deep Learning đầy đủ ở Sổ tay →
          </a>
        </p>
        <Bridge>
          <p style={{ marginTop: 0 }}>
            Ảnh = <b>ma trận/tensor</b> pixel; các phép <b>augmentation</b> (lật, xoay, co giãn, cắt) là{' '}
            <b>nhân ma trận</b> lên tọa độ điểm ảnh (ch3). Phép <b>convolution</b> lõi của CNN là trượt một
            kernel và lấy <b>tích vô hướng</b> tại mỗi vị trí (ch1, ch12).
          </p>
          <p style={{ marginBottom: 0 }}>
            "Đặc trưng" mà mạng trích ra cũng là những <b>vector</b>; so khớp/nhận dạng thường quy về{' '}
            <b>dot product</b> và khoảng cách trong không gian đặc trưng — vẫn là Đại số tuyến tính.
          </p>
        </Bridge>
      </Section>

      <Section kind="quiz" title="Kiểm tra hiểu">
        <Quiz
          lessonKey="ch13/cv"
          questions={[
            {
              q: (
                <>
                  Ma trận nào thực hiện phép <b>lật ngang</b> (gương qua trục dọc, <MathText tex="x\mapsto -x" />)?
                </>
              ),
              options: [
                '[[1, 0], [0, 1]]',
                '[[-1, 0], [0, 1]]',
                '[[1, 0], [0, -1]]',
                '[[0, 1], [1, 0]]',
              ],
              answer: 1,
              explain: (
                <>
                  <MathText tex="[[-1,0],[0,1]]" /> đưa <MathText tex="(x,y)\to(-x,y)" /> — đảo dấu hoành độ,
                  giữ nguyên tung độ ⇒ lật ngang.
                </>
              ),
            },
            {
              q: <>Bài toán nào gán nhãn cho TỪNG pixel của ảnh?</>,
              options: ['Phân loại ảnh', 'Phát hiện đối tượng', 'Phân đoạn (segmentation)', 'Transfer learning'],
              answer: 2,
              explain: (
                <>
                  Segmentation gán nhãn ở mức pixel; phát hiện chỉ cho bounding box; phân loại cho một nhãn cả
                  ảnh.
                </>
              ),
            },
            {
              q: <>Ý tưởng cốt lõi của transfer learning là gì?</>,
              options: [
                'Huấn luyện lại toàn bộ mạng từ số 0 cho mỗi bài toán',
                'Tận dụng mạng đã pretrained trên tập lớn, rồi fine-tune lớp cuối cho bài toán mới',
                'Chỉ dùng dữ liệu tăng cường (augmentation)',
                'Xóa các lớp convolution',
              ],
              answer: 1,
              explain: (
                <>
                  Các đặc trưng tổng quát (cạnh, texture…) học từ tập lớn dùng lại được; ta chỉ chỉnh phần cuối
                  cho nhiệm vụ mới ⇒ cần ít dữ liệu và thời gian hơn nhiều.
                </>
              ),
            },
            {
              q: <>Với máy tính, một ảnh màu được biểu diễn là gì?</>,
              options: [
                'Một con số duy nhất',
                'Một tensor H×W×3 (ba kênh màu R, G, B)',
                'Một danh sách các câu chữ',
                'Một ma trận vuông luôn khả nghịch',
              ],
              answer: 1,
              explain: (
                <>
                  Ảnh màu là lưới pixel với 3 kênh — một tensor <MathText tex="H\times W\times 3" />. Mọi phép
                  xử lý ảnh là đại số trên tensor đó.
                </>
              ),
            },
          ]}
        />
      </Section>
    </Lesson>
  );
}
