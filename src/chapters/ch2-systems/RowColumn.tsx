import { useState } from 'react';
import { Lesson, Section } from '../../components/Lesson';
import MathText from '../../components/MathText';
import Canvas2D from '../../components/Canvas2D';
import Slider from '../../components/Slider';
import MatrixInput from '../../components/MatrixInput';
import Quiz from '../../components/Quiz';
import { solveSystem, type Mat } from '../../lib/linalg';
import { fmt2 } from './matrixTex';

// aug = [[a, b, e], [c, d, f]] biểu diễn hệ:
//   a·x + b·y = e
//   c·x + d·y = f
const PRESETS: { label: string; m: Mat }[] = [
  { label: '2x + y = 5 ; x − y = 1', m: [[2, 1, 5], [1, -1, 1]] },
  { label: 'x + 2y = 4 ; 3x − 2y = 4', m: [[1, 2, 4], [3, -2, 4]] },
  { label: 'x + y = 3 ; 2x − y = 0', m: [[1, 1, 3], [2, -1, 0]] },
];

export default function RowColumn() {
  const [aug, setAug] = useState<Mat>([
    [2, 1, 5],
    [1, -1, 1],
  ]);
  const [x, setX] = useState(0);
  const [y, setY] = useState(0);

  const a = aug[0][0];
  const b = aug[0][1];
  const e = aug[0][2];
  const c = aug[1][0];
  const d = aug[1][1];
  const f = aug[1][2];

  const A: Mat = [
    [a, b],
    [c, d],
  ];
  const bVec = [e, f];
  const sol = solveSystem(A, bVec);

  // Cột của A: col1 = hệ số của x, col2 = hệ số của y
  const col1 = [a, c];
  const col2 = [b, d];

  // Tổ hợp x·col1 + y·col2
  const combo = [x * col1[0] + y * col2[0], x * col1[1] + y * col2[1]];
  const dist = Math.hypot(combo[0] - e, combo[1] - f);
  const success = dist < 0.05;

  const range = 6;

  // ---- Row picture: hai đường thẳng + giao điểm ----
  const rowLines = [
    { a, b, c: e, color: 'var(--vec-1)' },
    { a: c, b: d, c: f, color: 'var(--vec-2)' },
  ];
  const rowPoints =
    sol.type === 'unique' && sol.solution
      ? [
          {
            x: sol.solution[0],
            y: sol.solution[1],
            color: 'var(--vec-result)',
            label: `(${fmt2(sol.solution[0])}, ${fmt2(sol.solution[1])})`,
          },
        ]
      : [];

  // ---- Column picture ----
  const colVectors = [
    { id: 'c1', x: col1[0], y: col1[1], color: 'var(--vec-1)', label: 'c₁', dashed: true },
    { id: 'c2', x: col2[0], y: col2[1], color: 'var(--vec-2)', label: 'c₂', dashed: true },
  ];
  const xc1: [number, number] = [x * col1[0], x * col1[1]];
  const colSegments = [
    {
      from: [0, 0] as [number, number],
      to: xc1,
      color: 'var(--vec-1)',
      label: 'x·c₁',
    },
    {
      from: xc1,
      to: combo as [number, number],
      color: 'var(--vec-2)',
      dashed: true,
      label: 'y·c₂',
    },
  ];
  const colPoints = [
    { x: e, y: f, color: 'var(--vec-3)', label: 'b (đích)' },
    {
      x: combo[0],
      y: combo[1],
      color: 'var(--vec-result)',
      label: success ? '✓ = b' : 'tổ hợp',
    },
  ];

  return (
    <Lesson id="row-column" title="Row picture vs Column picture">
      <p className="muted">
        Một hệ phương trình có thể nhìn theo <strong>hai cách</strong>. Cùng một hệ{' '}
        <MathText tex={'A\\vec{x} = \\vec{b}'} />, nhưng row picture và column picture cho ta
        hai bức tranh hình học khác hẳn nhau — và bức tranh thứ hai mới chính là “linh hồn” của
        đại số tuyến tính.
      </p>

      <Section kind="explore" title="Hai bức tranh của cùng một hệ 2×2">
        <p style={{ marginTop: 0 }}>
          Chỉnh hệ số bên dưới — mỗi hàng là <MathText tex={'a\\;\\; b \\mid c'} /> ứng với
          phương trình <MathText tex={'a x + b y = c'} />. Quan sát <em>cả hai</em> canvas đổi
          theo.
        </p>
        <MatrixInput
          value={aug}
          onChange={(m) => setAug(m)}
          presets={PRESETS}
        />
        <p className="dim" style={{ fontSize: 13, marginTop: 6 }}>
          Hệ hiện tại: <MathText tex={`${fmt2(a)}x ${b < 0 ? '−' : '+'} ${fmt2(Math.abs(b))}y = ${fmt2(e)}`} />{' '}
          &nbsp;và&nbsp;{' '}
          <MathText tex={`${fmt2(c)}x ${d < 0 ? '−' : '+'} ${fmt2(Math.abs(d))}y = ${fmt2(f)}`} />
        </p>

        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
            gap: 16,
            marginTop: 12,
          }}
        >
          {/* ROW PICTURE */}
          <div>
            <div style={{ fontWeight: 650, marginBottom: 6, color: 'var(--accent)' }}>
              🟦 Row picture — mỗi phương trình là một đường
            </div>
            <Canvas2D height={340} range={range} lines={rowLines} points={rowPoints} />
            <p className="dim" style={{ fontSize: 12.5 }}>
              Đường{' '}
              <span style={{ color: 'var(--vec-1)' }}>xanh</span> = pt 1, đường{' '}
              <span style={{ color: 'var(--vec-2)' }}>cam</span> = pt 2.{' '}
              <strong>Giao điểm</strong> (hồng) là nghiệm: nơi cả hai phương trình cùng đúng.
            </p>
          </div>

          {/* COLUMN PICTURE */}
          <div>
            <div style={{ fontWeight: 650, marginBottom: 6, color: 'var(--accent)' }}>
              🟧 Column picture — tìm tổ hợp của hai vector cột
            </div>
            <Canvas2D
              height={340}
              range={range}
              vectors={colVectors}
              segments={colSegments}
              points={colPoints}
            />
            <p className="dim" style={{ fontSize: 12.5 }}>
              Kéo hai Slider để dựng <MathText tex={'x\\,\\vec{c_1} + y\\,\\vec{c_2}'} />. Mục
              tiêu: đưa điểm <span style={{ color: 'var(--vec-result)' }}>hồng</span> (tổ hợp)
              trùng đúng điểm <span style={{ color: 'var(--vec-3)' }}>lục</span> (vector đích b).
            </p>
          </div>
        </div>

        <div style={{ marginTop: 4 }}>
          <Slider label="Hệ số x" min={-5} max={5} step={0.25} value={x} onChange={setX} format={(v) => fmt2(v)} />
          <Slider label="Hệ số y" min={-5} max={5} step={0.25} value={y} onChange={setY} format={(v) => fmt2(v)} />
        </div>

        <div
          className="panel"
          style={{
            marginTop: 10,
            borderColor: success ? 'var(--good)' : 'var(--border)',
            background: success ? 'rgba(34,197,94,0.10)' : undefined,
          }}
        >
          <MathText
            tex={`${fmt2(x)}\\begin{bmatrix}${fmt2(col1[0])}\\\\${fmt2(col1[1])}\\end{bmatrix} + ${fmt2(
              y
            )}\\begin{bmatrix}${fmt2(col2[0])}\\\\${fmt2(col2[1])}\\end{bmatrix} = \\begin{bmatrix}${fmt2(
              combo[0]
            )}\\\\${fmt2(combo[1])}\\end{bmatrix}`}
            block
          />
          <p style={{ margin: '4px 0 0', textAlign: 'center', fontSize: 13.5 }}>
            {success ? (
              <span style={{ color: 'var(--good)', fontWeight: 650 }}>
                ✓ Tổ hợp chạm đúng vector đích b — bạn vừa “giải” hệ bằng column picture!
              </span>
            ) : (
              <span className="muted">
                Còn cách đích {fmt2(dist)} đơn vị. Đích cần là{' '}
                <MathText tex={`\\begin{bmatrix}${fmt2(e)}\\\\${fmt2(f)}\\end{bmatrix}`} />.
              </span>
            )}
          </p>
        </div>

        <p className="dim" style={{ fontSize: 12.5, marginTop: 8 }}>
          💡 Gợi ý: với hệ mặc định, thử đặt x = 2 và y = 1. Để ý rằng bộ (x, y) làm tổ hợp chạm
          đích <em>chính là</em> giao điểm ở row picture bên trái — hai bức tranh cho cùng một
          nghiệm.
        </p>
      </Section>

      <Section kind="theory" title="Cùng một hệ, hai cách nhìn">
        <p>
          Viết hệ dưới dạng ma trận <MathText tex={'A\\vec{x} = \\vec{b}'} />. Với hệ mẫu:
        </p>
        <MathText
          block
          tex={
            '\\begin{bmatrix} 2 & 1 \\\\ 1 & -1 \\end{bmatrix} \\begin{bmatrix} x \\\\ y \\end{bmatrix} = \\begin{bmatrix} 5 \\\\ 1 \\end{bmatrix}'
          }
        />
        <p>
          <strong>Row picture (nhìn theo hàng).</strong> Mỗi <em>hàng</em> của{' '}
          <MathText tex={'A\\vec{x} = \\vec{b}'} /> là một phương trình{' '}
          <MathText tex={'a x + b y = c'} /> — một đường thẳng trong mặt phẳng. Nghiệm là điểm mà
          tất cả các đường cùng đi qua: <strong>giao điểm</strong>. Đây là cách nhìn quen thuộc từ
          phổ thông.
        </p>
        <p>
          <strong>Column picture (nhìn theo cột).</strong> Nhóm lại theo <em>cột</em>:
        </p>
        <MathText
          block
          tex={
            'x \\begin{bmatrix} 2 \\\\ 1 \\end{bmatrix} + y \\begin{bmatrix} 1 \\\\ -1 \\end{bmatrix} = \\begin{bmatrix} 5 \\\\ 1 \\end{bmatrix}'
          }
        />
        <p>
          Bây giờ câu hỏi đổi thành: <em>“Cần lấy bao nhiêu phần vector cột thứ nhất và bao nhiêu
          phần vector cột thứ hai để cộng lại đúng bằng b?”</em> Đó chính là một{' '}
          <strong>linear combination</strong> — đúng khái niệm ta đã học ở Chương 1. Giải hệ{' '}
          <MathText tex={'A\\vec{x} = \\vec{b}'} /> tương đương với: <em>b có nằm trong span của
          các vector cột không, và với hệ số nào?</em>
        </p>
        <p className="muted">
          Vì sao column picture quan trọng hơn? Vì nó biến “giải phương trình” thành “tổ hợp các
          vector”. Cách nhìn này mở đường cho toàn bộ những chương sau: ma trận nhân vector, column
          space, rank, biến đổi tuyến tính… Row picture giúp hình dung nhanh với hệ nhỏ; column
          picture mới là cách tư duy của đại số tuyến tính.
        </p>
      </Section>

      <Section kind="quiz" title="Kiểm tra hiểu">
        <Quiz
          lessonKey="ch2/row-column"
          questions={[
            {
              q: <>Trong <strong>row picture</strong> của một hệ 2×2, nghiệm của hệ tương ứng với điều gì?</>,
              options: [
                'Độ dài của mỗi vector cột',
                'Giao điểm của hai đường thẳng',
                'Diện tích tam giác tạo bởi hai đường',
                'Trung điểm của hai đường thẳng',
              ],
              answer: 1,
              explain: (
                <>
                  Mỗi phương trình là một đường thẳng; nghiệm là điểm thỏa mãn <em>tất cả</em> các
                  phương trình, tức là giao điểm của các đường.
                </>
              ),
            },
            {
              q: (
                <>
                  Column picture của hệ <MathText tex={'A\\vec{x}=\\vec{b}'} /> đặt ra câu hỏi nào?
                </>
              ),
              options: [
                'Hai đường thẳng có song song không?',
                'Ma trận A có vuông không?',
                'Tổ hợp tuyến tính nào của các cột A cho ra b?',
                'Định thức của A bằng bao nhiêu?',
              ],
              answer: 2,
              explain: (
                <>
                  Column picture viết <MathText tex={'x\\,\\vec{c_1}+y\\,\\vec{c_2}=\\vec{b}'} /> — ta
                  đi tìm hệ số của một linear combination các cột sao cho bằng b.
                </>
              ),
            },
            {
              q: <>Khái niệm nào ở Chương 1 chính là bản chất của column picture?</>,
              options: ['Dot product', 'Linear combination & span', 'Cross product', 'Chuẩn (norm) của vector'],
              answer: 1,
              explain: (
                <>
                  Column picture là một linear combination của các vector cột; giải được hệ nghĩa là
                  b nằm trong span của các cột.
                </>
              ),
            },
            {
              q: (
                <>
                  Với hệ mẫu <MathText tex={'2x+y=5,\\; x-y=1'} />, nghiệm là <MathText tex={'(x,y)=(2,1)'} />.
                  Điều này nói gì về hai bức tranh?
                </>
              ),
              options: [
                'Hai đường cắt tại (2,1) và tổ hợp 2·c₁ + 1·c₂ = b',
                'Chỉ row picture mới có nghiệm, column picture thì không',
                'Hai bức tranh cho hai nghiệm khác nhau',
                'Nghiệm chỉ tồn tại nếu A là ma trận đơn vị',
              ],
              answer: 0,
              explain: (
                <>
                  Cùng một nghiệm: (2,1) là giao điểm ở row picture, và cũng là bộ hệ số để{' '}
                  <MathText tex={'2\\vec{c_1}+1\\vec{c_2}=\\vec{b}'} /> ở column picture.
                </>
              ),
            },
          ]}
        />
      </Section>
    </Lesson>
  );
}
