import { useState, type ReactNode } from 'react';
import { Lesson, Section } from '../../components/Lesson';
import MathText from '../../components/MathText';
import Canvas2D, { useCanvas2D, type V2 } from '../../components/Canvas2D';
import MatrixInput from '../../components/MatrixInput';
import Quiz from '../../components/Quiz';
import { matVec, norm, normalize, type Mat } from '../../lib/linalg';
import { f2, ROT_50 } from './util';

const PRESETS: { label: string; m: Mat }[] = [
  { label: 'Kéo giãn dọc trục', m: [[3, 1], [0, 2]] },
  { label: 'Đối xứng [[2,1],[1,2]]', m: [[2, 1], [1, 2]] },
  { label: 'Xoay 50° (không có!)', m: ROT_50 },
  { label: 'Shear [[1,1],[0,1]]', m: [[1, 1], [0, 1]] },
];

// |sin| của góc giữa u và Au (với u không cần đơn vị)
function sinAngle(u: number[], Au: number[]): number {
  const nu = norm(u);
  const nA = norm(Au);
  if (nu < 1e-9 || nA < 1e-9) return 1;
  const cross = u[0] * Au[1] - u[1] * Au[0];
  return Math.abs(cross / (nu * nA));
}

// Trường vector trên vòng tròn đơn vị: mỗi hướng u vẽ một mũi nhỏ chỉ về Au.
// Hướng bất biến (Au ∥ u) sẽ sáng vàng lên.
function SweepField({ M }: { M: Mat }) {
  const { toScreen } = useCanvas2D();
  const N = 60;
  const [ox, oy] = toScreen(0, 0);
  const [rx] = toScreen(1, 0);
  const R = rx - ox;
  const items = [] as ReactNode[];
  for (let k = 0; k < N; k++) {
    const ang = (2 * Math.PI * k) / N;
    const u = [Math.cos(ang), Math.sin(ang)];
    const Au = matVec(M, u);
    const s = sinAngle(u, Au);
    const aligned = s < 0.06;
    const dir = normalize(Au);
    const [sx, sy] = toScreen(u[0], u[1]);
    const [ex, ey] = toScreen(u[0] + dir[0] * 0.45, u[1] + dir[1] * 0.45);
    const col = aligned ? 'var(--warn)' : 'var(--accent-2)';
    const op = aligned ? 1 : 0.3;
    items.push(
      <g key={k}>
        <line
          x1={sx}
          y1={sy}
          x2={ex}
          y2={ey}
          stroke={col}
          strokeWidth={aligned ? 2.6 : 1.2}
          opacity={op}
        />
        <circle cx={sx} cy={sy} r={aligned ? 4 : 2} fill={col} opacity={op} />
      </g>
    );
  }
  return (
    <g>
      <circle cx={ox} cy={oy} r={R} fill="none" stroke="var(--text-dim)" strokeWidth={1} opacity={0.5} />
      {items}
    </g>
  );
}

export default function Lesson1Discover() {
  const [M, setM] = useState<Mat>([
    [3, 1],
    [0, 2],
  ]);
  const [v, setV] = useState({ x: 2, y: 1 });
  const [sweep, setSweep] = useState(false);

  const vv = [v.x, v.y];
  const Av = matVec(M, vv);
  const s = sinAngle(vv, Av);
  const aligned = s < 0.03 && norm(vv) > 0.2;
  // λ có dấu = chiếu Av lên v / |v|²  (khi thẳng hàng, đây đúng là |Av|/|v| có dấu)
  const vLen2 = vv[0] * vv[0] + vv[1] * vv[1];
  const lambda = vLen2 > 1e-9 ? (Av[0] * vv[0] + Av[1] * vv[1]) / vLen2 : 0;

  const vColor = aligned ? 'var(--warn)' : 'var(--vec-1)';
  const avColor = aligned ? 'var(--warn)' : 'var(--vec-2)';

  const vectors: V2[] = [
    { id: 'v', x: v.x, y: v.y, color: vColor, label: 'v', draggable: true },
    { id: 'Av', x: Av[0], y: Av[1], color: avColor, label: 'Av' },
  ];

  // Khi thẳng hàng: kẻ đường thẳng qua gốc theo hướng v để nhấn "trục bất biến"
  const lines = aligned
    ? [{ a: -v.y, b: v.x, c: 0, color: 'var(--warn)' as const, label: 'trục bất biến' }]
    : [];

  return (
    <Lesson id="ch5-discover" title="Tìm hướng bất biến">
      <p className="muted">
        Trước khi học bất kỳ định nghĩa nào, hãy tự tay đi tìm một điều đặc biệt. Một
        ma trận <MathText tex="A" /> làm cả mặt phẳng vừa xoay vừa co giãn. Nhưng luôn
        có (hoặc gần như luôn có) <b>vài hướng rất bướng bỉnh</b>: đi vào biến đổi mà
        <b> không hề bị xoay đi</b>, chỉ dài ra hay ngắn lại. Nhiệm vụ của bạn: tìm ra
        chúng.
      </p>

      <Section kind="explore" title="Kéo v tới khi Av nằm cùng đường thẳng với v">
        <p className="muted" style={{ marginTop: 0 }}>
          <b>Nhiệm vụ:</b> Kéo đầu vector{' '}
          <span style={{ color: 'var(--vec-1)' }}>v</span>. Ma trận biến nó thành{' '}
          <span style={{ color: 'var(--vec-2)' }}>Av</span> (màu cam). Thông thường Av
          lệch hướng so với v. Hãy xoay v cho tới khi{' '}
          <b>Av nằm ĐÚNG trên cùng một đường thẳng với v</b> (cùng hướng hoặc ngược
          hướng). Khi đó cả hai <span style={{ color: 'var(--warn)' }}>sáng vàng</span>{' '}
          và ta đọc được con số <MathText tex="\lambda = |Av|/|v|" /> có dấu — hệ số
          co giãn dọc theo hướng đó.
        </p>

        <div className="row" style={{ alignItems: 'flex-start', gap: 24 }}>
          <div style={{ flex: '1 1 280px', minWidth: 250 }}>
            <MatrixInput value={M} onChange={setM} presets={PRESETS} />
            <div style={{ marginTop: 12 }}>
              <button className="btn" onClick={() => setSweep((s) => !s)}>
                {sweep ? 'Tắt chế độ quét' : '🔦 Bật chế độ quét (xem mọi hướng)'}
              </button>
            </div>
            <div className="panel" style={{ marginTop: 14, fontSize: 13.5 }}>
              <div style={{ marginBottom: 6 }}>
                v = <span className="mono">({f2(v.x)}, {f2(v.y)})</span>
              </div>
              <div style={{ marginBottom: 6, color: 'var(--vec-2)' }}>
                Av = <span className="mono">({f2(Av[0])}, {f2(Av[1])})</span>
              </div>
              <div style={{ marginBottom: 10, color: 'var(--text-muted)' }}>
                Độ lệch hướng |sin| = <span className="mono">{f2(s)}</span>
              </div>
              {aligned ? (
                <div
                  style={{
                    padding: '10px 12px',
                    borderRadius: 8,
                    background: 'rgba(245,158,11,0.14)',
                    color: 'var(--warn)',
                    fontWeight: 600,
                  }}
                >
                  ✨ Thẳng hàng! Av = λ·v với{' '}
                  <span className="mono" style={{ fontSize: 18 }}>
                    λ = {f2(lambda)}
                  </span>
                  <div style={{ fontSize: 12.5, fontWeight: 400, marginTop: 4 }}>
                    {lambda < 0
                      ? 'λ âm → Av chỉ ngược hướng v (lật 180°) nhưng vẫn cùng đường thẳng.'
                      : 'Trên hướng này A chỉ co giãn, không xoay chút nào.'}
                  </div>
                </div>
              ) : (
                <div style={{ color: 'var(--text-dim)', fontSize: 12.5 }}>
                  Chưa thẳng hàng. Xoay v thêm chút nữa cho |sin| tiến về 0…
                </div>
              )}
            </div>
          </div>
          <div style={{ flex: '2 1 340px', minWidth: 300 }}>
            <Canvas2D
              height={420}
              range={5}
              vectors={sweep ? [] : vectors}
              lines={sweep ? [] : lines}
              onVectorChange={(id, x, y) => id === 'v' && setV({ x, y })}
            >
              {sweep && <SweepField M={M} />}
            </Canvas2D>
            {sweep && (
              <p className="dim" style={{ fontSize: 12 }}>
                Mỗi chấm là một hướng đơn vị; mũi nhỏ chỉ về nơi A gửi nó tới. Những chỗ{' '}
                <span style={{ color: 'var(--warn)' }}>vàng</span> là hướng mà mũi tên
                nằm ngay trên đường bán kính — <b>hướng bất biến</b>. Preset{' '}
                <b>Xoay 50°</b> không có chỗ nào vàng cả!
              </p>
            )}
          </div>
        </div>
      </Section>

      <Section kind="theory" title="Bây giờ mới đặt tên: eigenvector & eigenvalue">
        <p>
          Cái hướng bướng bỉnh bạn vừa tìm ra có một cái tên trang trọng. Một vector{' '}
          <MathText tex="v \neq 0" /> mà khi biến đổi vẫn nằm <b>trên chính đường thẳng
          cũ của nó</b> được gọi là <b>eigenvector</b> (vector riêng) của{' '}
          <MathText tex="A" />. Hệ số co giãn dọc theo hướng đó là{' '}
          <b>eigenvalue</b> (giá trị riêng), ký hiệu <MathText tex="\lambda" />. Quan
          hệ giữa chúng gói gọn trong một phương trình đẹp:
        </p>
        <MathText block tex="A\,v = \lambda\,v" />
        <p>
          Đọc bằng lời: <i>"Áp A vào v cho ra đúng bằng nhân v với một con số"</i>. Cả
          một biến đổi ma trận rắc rối, trên hướng đặc biệt này, thu lại chỉ còn một
          phép nhân vô hướng.
        </p>
        <ul>
          <li>
            <MathText tex="\lambda > 1" />: hướng đó bị <b>kéo dài</b> ra.
          </li>
          <li>
            <MathText tex="0 < \lambda < 1" />: bị <b>co ngắn</b> lại.
          </li>
          <li>
            <MathText tex="\lambda < 0" />: bị <b>lật ngược</b> (quay 180°) rồi co giãn.
          </li>
          <li>
            <MathText tex="\lambda = 1" />: đứng yên hoàn toàn; <MathText tex="\lambda = 0" />: bị ép về gốc.
          </li>
        </ul>
        <p className="muted">
          <b>Vì sao ta quan tâm?</b> Eigenvector là bộ khung xương của một biến đổi.
          Nếu ta nhìn thế giới theo đúng các hướng eigenvector, thì A không còn xoay hay
          bẻ nghiêng gì nữa — nó chỉ đơn thuần co giãn theo từng trục. Toàn bộ chương này
          là để khai thác sự đơn giản đó. Và như preset <b>Xoay 50°</b> cho thấy: có
          những ma trận <b>không có hướng bất biến thực nào</b> — mọi vector đều bị xoay.
          Ta sẽ gặp lại chúng ở bài phương trình đặc trưng (nghiệm phức).
        </p>
      </Section>

      <Section kind="quiz" title="Kiểm tra hiểu">
        <Quiz
          lessonKey="ch5/discover"
          questions={[
            {
              q: (
                <>
                  Một vector <MathText tex="v \neq 0" /> là eigenvector của{' '}
                  <MathText tex="A" /> khi nào?
                </>
              ),
              options: [
                <>Khi <MathText tex="Av" /> nằm trên cùng đường thẳng với <MathText tex="v" /> (chỉ co giãn, không xoay)</>,
                <>Khi <MathText tex="Av" /> vuông góc với <MathText tex="v" /></>,
                <>Khi <MathText tex="v" /> có độ dài bằng 1</>,
                <>Khi <MathText tex="Av = 0" /> với mọi ma trận</>,
              ],
              answer: 0,
              explain: (
                <>
                  Định nghĩa: <MathText tex="Av = \lambda v" />. Nghĩa là ảnh của v giữ
                  nguyên hướng (hoặc lật ngược), chỉ khác về độ dài.
                </>
              ),
            },
            {
              q: (
                <>
                  Nếu <MathText tex="Av = -2v" /> thì <MathText tex="v" /> là eigenvector
                  với eigenvalue bằng bao nhiêu, và hình học xảy ra gì?
                </>
              ),
              options: [
                <><MathText tex="\lambda = -2" />: v bị lật ngược hướng rồi dài gấp đôi</>,
                <><MathText tex="\lambda = 2" />: v dài gấp đôi, giữ hướng</>,
                <><MathText tex="\lambda = -2" />: v vuông góc với chính nó</>,
                <>Không phải eigenvector vì λ âm</>,
              ],
              answer: 0,
              explain: (
                <>
                  λ = −2. Dấu âm lật v sang phía đối diện; độ lớn 2 kéo dài gấp đôi. Vẫn
                  cùng một đường thẳng nên vẫn là eigenvector.
                </>
              ),
            },
            {
              q: <>Vì sao ma trận xoay 50° không có eigenvector thực?</>,
              options: [
                <>Vì phép xoay làm MỌI vector đổi hướng — không hướng nào giữ nguyên đường thẳng của nó</>,
                <>Vì determinant của nó bằng 0</>,
                <>Vì nó không phải ma trận vuông</>,
                <>Vì nó có quá nhiều eigenvector</>,
              ],
              answer: 0,
              explain: (
                <>
                  Xoay một góc khác 0° và 180° đẩy mọi hướng lệch đi, nên không tồn tại v
                  thực nào thỏa <MathText tex="Av = \lambda v" />. (Eigenvalue của nó là số phức.)
                </>
              ),
            },
            {
              q: (
                <>
                  Với <MathText tex="A=\begin{bmatrix}3&0\\0&2\end{bmatrix}" />, vector nào
                  chắc chắn là eigenvector?
                </>
              ),
              options: [
                <><MathText tex="(1,0)" /> và <MathText tex="(0,1)" /> — các trục tọa độ</>,
                <>Chỉ <MathText tex="(1,1)" /></>,
                <>Mọi vector đều bị xoay nên không có</>,
                <>Chỉ vector <MathText tex="(0,0)" /></>,
              ],
              answer: 0,
              explain: (
                <>
                  A đường chéo: <MathText tex="A(1,0)=(3,0)=3(1,0)" /> và{' '}
                  <MathText tex="A(0,1)=(0,2)=2(0,1)" />. Hai trục là eigenvector với λ = 3 và 2.
                </>
              ),
            },
          ]}
        />
      </Section>
    </Lesson>
  );
}
