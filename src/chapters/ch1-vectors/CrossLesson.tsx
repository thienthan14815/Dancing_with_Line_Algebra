import { useState } from 'react';
import { Lesson, Section } from '../../components/Lesson';
import MathText from '../../components/MathText';
import Scene3D from '../../components/Scene3D';
import Slider from '../../components/Slider';
import StepByStep from '../../components/StepByStep';
import Quiz from '../../components/Quiz';
import { cross3, norm, dot } from '../../lib/linalg';
import { f2, vec3Str, Stat, StatRow, Hint } from './_shared';

type V3 = [number, number, number];

const PRESETS: { label: string; u: V3; v: V3 }[] = [
  { label: 'x × y', u: [2, 0, 0], v: [0, 2, 0] },
  { label: 'Chéo nhau', u: [2, 1, 0], v: [0, 1, 2] },
  { label: 'Gần thẳng hàng', u: [2, 1, 0], v: [2, 1, 0.4] },
];

export default function CrossLesson() {
  const [u, setU] = useState<V3>([2, 1, 0]);
  const [v, setV] = useState<V3>([0, 1, 2]);

  const c = cross3(u, v) as V3;
  const area = norm(c);
  const perpU = dot(c, u);
  const perpV = dot(c, v);

  const setUi = (i: number, n: number) => setU((p) => p.map((x, k) => (k === i ? n : x)) as V3);
  const setVi = (i: number, n: number) => setV((p) => p.map((x, k) => (k === i ? n : x)) as V3);

  return (
    <Lesson id="cross" title="Cross product (tích có hướng)">
      <Section kind="explore" title="Vector vuông góc với cả mặt phẳng span">
        <div className="row" style={{ marginBottom: 10 }}>
          {PRESETS.map((p) => (
            <button key={p.label} className="preset-btn" onClick={() => { setU(p.u); setV(p.v); }}>
              {p.label}
            </button>
          ))}
        </div>
        <Scene3D
          height={400}
          vectors={[
            { id: 'u', v: u, color: '#4f9cf9', label: 'u' },
            { id: 'v', v: v, color: '#f97316', label: 'v' },
            { id: 'c', v: c, color: '#e879f9', label: 'u × v' },
          ]}
          spanPlanes={[{ u, v, color: '#22c55e', opacity: 0.2 }]}
        />
        <div className="row" style={{ gap: 24, marginTop: 12, alignItems: 'flex-start' }}>
          <div style={{ flex: 1, minWidth: 200 }}>
            <div className="dim" style={{ fontSize: 12 }}>Vector u</div>
            <Slider label="uₓ" min={-3} max={3} value={u[0]} onChange={(n) => setUi(0, n)} format={f2} />
            <Slider label="uᵧ" min={-3} max={3} value={u[1]} onChange={(n) => setUi(1, n)} format={f2} />
            <Slider label="u_z" min={-3} max={3} value={u[2]} onChange={(n) => setUi(2, n)} format={f2} />
          </div>
          <div style={{ flex: 1, minWidth: 200 }}>
            <div className="dim" style={{ fontSize: 12 }}>Vector v</div>
            <Slider label="vₓ" min={-3} max={3} value={v[0]} onChange={(n) => setVi(0, n)} format={f2} />
            <Slider label="vᵧ" min={-3} max={3} value={v[1]} onChange={(n) => setVi(1, n)} format={f2} />
            <Slider label="v_z" min={-3} max={3} value={v[2]} onChange={(n) => setVi(2, n)} format={f2} />
          </div>
        </div>
        <StatRow>
          <Stat label="u × v" value={vec3Str(c)} color="var(--vec-result)" />
          <Stat label="|u × v| (diện tích)" value={f2(area)} color="var(--vec-3)" />
          <Stat label="(u×v)·u" value={f2(perpU)} color="var(--accent)" />
          <Stat label="(u×v)·v" value={f2(perpV)} color="var(--accent)" />
        </StatRow>
        <Hint>
          Hãy xoay cảnh và chỉnh các thanh trượt. Mũi tên hồng <b>u × v</b> luôn <b>vuông góc</b>
          {' '}với mặt phẳng xanh lá (span của u, v) — hãy để ý (u×v)·u và (u×v)·v luôn ≈ 0. Độ dài
          của nó bằng <b>diện tích hình bình hành</b> dựng từ u, v. Thử preset "Gần thẳng hàng":
          mặt phẳng bẹp lại, diện tích → 0, nên u × v ngắn dần về vector không.
        </Hint>
      </Section>

      <Section kind="theory" title="Định nghĩa & quy tắc bàn tay phải">
        <p>
          Cross product nhận hai vector trong <MathText tex="\mathbb{R}^3" /> và trả về một{' '}
          <b>vector mới</b> (khác dot product vốn trả về một số). Công thức:
        </p>
        <MathText
          block
          tex="\vec{u}\times\vec{v} = (u_y v_z - u_z v_y,\ \ u_z v_x - u_x v_z,\ \ u_x v_y - u_y v_x)"
        />
        <p>Kết quả có ba tính chất bạn vừa quan sát:</p>
        <ul>
          <li>
            <b>Vuông góc</b> với cả u và v — tức vuông góc với toàn bộ mặt phẳng span của chúng.
            Đó là lý do <MathText tex="(\vec{u}\times\vec{v})\cdot\vec{u} = 0" /> và{' '}
            <MathText tex="(\vec{u}\times\vec{v})\cdot\vec{v} = 0" />.
          </li>
          <li>
            <b>Độ dài</b> <MathText tex="|\vec{u}\times\vec{v}| = |\vec{u}||\vec{v}|\sin\theta" />{' '}
            bằng diện tích hình bình hành dựng từ u và v. Khi u, v thẳng hàng thì{' '}
            <MathText tex="\sin\theta = 0" /> → cross product bằng vector không.
          </li>
          <li>
            <b>Hướng</b> xác định bởi <b>quy tắc bàn tay phải</b>: xòe tay phải cho các ngón đi
            từ u sang v, ngón cái chỉ theo <MathText tex="\vec{u}\times\vec{v}" />.
          </li>
        </ul>
        <p>
          Vì thứ tự quan trọng nên cross product <b>phản giao hoán</b>:{' '}
          <MathText tex="\vec{u}\times\vec{v} = -\,\vec{v}\times\vec{u}" /> (đảo thứ tự thì đảo
          hướng). Và một điều then chốt: cross product <b>chỉ tồn tại trong ℝ³</b> — nó dựa vào
          việc "có đúng một hướng vuông góc còn lại", điều chỉ đúng ở ba chiều.
        </p>
      </Section>

      <Section kind="steps" title="Tính cross product bằng định thức">
        <StepByStep
          steps={[
            {
              title: 'Bài toán',
              content: <p>Tính <MathText tex="\vec{u}\times\vec{v}" /> với <MathText tex="\vec{u}=(2,1,0)" /> và <MathText tex="\vec{v}=(0,1,2)" />.</p>,
            },
            {
              title: 'Bước 1 — dựng định thức ký hiệu',
              content: (
                <MathText
                  block
                  tex="\vec{u}\times\vec{v} = \begin{vmatrix} \vec{i} & \vec{j} & \vec{k} \\ 2 & 1 & 0 \\ 0 & 1 & 2 \end{vmatrix}"
                />
              ),
            },
            {
              title: 'Bước 2 — thành phần i',
              content: <p><MathText tex="i:\ u_y v_z - u_z v_y = 1\cdot 2 - 0\cdot 1 = 2" />.</p>,
            },
            {
              title: 'Bước 3 — thành phần j',
              content: <p><MathText tex="j:\ u_z v_x - u_x v_z = 0\cdot 0 - 2\cdot 2 = -4" />.</p>,
            },
            {
              title: 'Bước 4 — thành phần k',
              content: <p><MathText tex="k:\ u_x v_y - u_y v_x = 2\cdot 1 - 1\cdot 0 = 2" />.</p>,
            },
            {
              title: 'Kết quả & kiểm tra',
              content: (
                <p>
                  <MathText tex="\vec{u}\times\vec{v} = (2, -4, 2)" />. Kiểm tra vuông góc:{' '}
                  <MathText tex="(2,-4,2)\cdot(2,1,0) = 4 - 4 + 0 = 0" /> ✓.
                </p>
              ),
            },
          ]}
        />
      </Section>

      <Section kind="quiz" title="Kiểm tra hiểu">
        <Quiz
          lessonKey="ch1/cross"
          questions={[
            {
              q: <>Kết quả của <MathText tex="\vec{u}\times\vec{v}" /> là:</>,
              options: ['Một số vô hướng', 'Một vector vuông góc với u và v', 'Góc giữa u và v', 'Một ma trận'],
              answer: 1,
              explain: <>Khác dot product (cho một số), cross product cho ra một vector, và vector đó vuông góc với cả u lẫn v.</>,
            },
            {
              q: <>Nếu u và v thẳng hàng (cùng phương) thì <MathText tex="\vec{u}\times\vec{v}" /> bằng:</>,
              options: ['Vector không', 'Một vector đơn vị', 'u + v', 'Không xác định'],
              answer: 0,
              explain: <>Thẳng hàng nghĩa θ = 0 hoặc 180°, nên <MathText tex="\sin\theta = 0" /> và độ dài cross product bằng 0 — kết quả là vector không.</>,
            },
            {
              q: <><MathText tex="|\vec{u}\times\vec{v}|" /> bằng về mặt hình học là:</>,
              options: [
                'Chu vi hình bình hành u, v',
                'Diện tích hình bình hành dựng từ u và v',
                'Tổng độ dài u và v',
                'Thể tích khối hộp',
              ],
              answer: 1,
              explain: <><MathText tex="|\vec{u}\times\vec{v}| = |\vec{u}||\vec{v}|\sin\theta" /> đúng bằng diện tích hình bình hành hai cạnh u, v.</>,
            },
            {
              q: <>So sánh <MathText tex="\vec{v}\times\vec{u}" /> với <MathText tex="\vec{u}\times\vec{v}" />:</>,
              options: [
                'Bằng nhau',
                'Ngược dấu (ngược hướng)',
                'Vuông góc với nhau',
                'Luôn bằng vector không',
              ],
              answer: 1,
              explain: <>Cross product phản giao hoán: đổi thứ tự thì đổi hướng, <MathText tex="\vec{v}\times\vec{u} = -\,\vec{u}\times\vec{v}" />. Quy tắc bàn tay phải giải thích điều này.</>,
            },
          ]}
        />
      </Section>
    </Lesson>
  );
}
