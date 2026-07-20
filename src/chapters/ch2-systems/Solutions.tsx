import { useState } from 'react';
import { Lesson, Section } from '../../components/Lesson';
import MathText from '../../components/MathText';
import Canvas2D from '../../components/Canvas2D';
import Scene3D from '../../components/Scene3D';
import StepByStep from '../../components/StepByStep';
import Quiz from '../../components/Quiz';
import { rrefSteps, solveSystem, type Mat } from '../../lib/linalg';
import { matrixTex, leadingHighlight, fmt2 } from './matrixTex';

type Vec3 = [number, number, number];

// ---- Presets 2×2 (row picture) ----
interface P2D {
  label: string;
  note: string;
  A: Mat;
  b: number[];
}
const P2D_LIST: P2D[] = [
  {
    label: 'Cắt nhau',
    note: 'Hai đường cắt nhau tại đúng một điểm.',
    A: [[2, 1], [1, -1]],
    b: [5, 1],
  },
  {
    label: 'Trùng nhau',
    note: 'Hai phương trình là cùng một đường — mọi điểm trên đường đều là nghiệm.',
    A: [[1, 1], [2, 2]],
    b: [2, 4],
  },
  {
    label: 'Song song',
    note: 'Hai đường song song, không bao giờ gặp nhau.',
    A: [[1, 1], [1, 1]],
    b: [2, 5],
  },
];

// ---- Presets 3 mặt phẳng (3D) ----
interface P3D {
  label: string;
  note: string;
  A: Mat;
  b: number[];
  planes: { normal: Vec3; d: number; color: string; opacity: number }[];
  point?: Vec3;
  line?: { from: Vec3; to: Vec3 };
}
const P3D_LIST: P3D[] = [
  {
    label: 'Giao 1 điểm',
    note: 'Ba mặt phẳng cắt nhau tại đúng một điểm — nghiệm duy nhất.',
    A: [[1, 1, 1], [1, -1, 0], [0, 1, -1]],
    b: [3, 0, 0],
    planes: [
      { normal: [1, 1, 1], d: 3, color: '#4f9cf9', opacity: 0.32 },
      { normal: [1, -1, 0], d: 0, color: '#f97316', opacity: 0.32 },
      { normal: [0, 1, -1], d: 0, color: '#22c55e', opacity: 0.32 },
    ],
    point: [1, 1, 1],
  },
  {
    label: 'Giao 1 đường',
    note: 'Ba mặt phẳng cùng chứa một đường thẳng — vô số nghiệm nằm dọc đường đó.',
    A: [[1, 1, 1], [1, 0, -1], [2, 1, 0]],
    b: [1, 0, 1],
    planes: [
      { normal: [1, 1, 1], d: 1, color: '#4f9cf9', opacity: 0.28 },
      { normal: [1, 0, -1], d: 0, color: '#f97316', opacity: 0.28 },
      { normal: [2, 1, 0], d: 1, color: '#22c55e', opacity: 0.28 },
    ],
    line: { from: [2, -3, 2], to: [-2, 5, -2] },
  },
  {
    label: 'Không giao chung',
    note: 'Từng cặp mặt phẳng cắt nhau theo các giao tuyến song song (hình lăng trụ) — không điểm nào chung cả ba: vô nghiệm.',
    A: [[1, 1, 0], [0, 1, 1], [1, 0, -1]],
    b: [0, 0, 1],
    planes: [
      { normal: [1, 1, 0], d: 0, color: '#4f9cf9', opacity: 0.3 },
      { normal: [0, 1, 1], d: 0, color: '#f97316', opacity: 0.3 },
      { normal: [1, 0, -1], d: 1, color: '#22c55e', opacity: 0.3 },
    ],
  },
];

function typeLabel(t: 'unique' | 'infinite' | 'none'): { text: string; color: string } {
  if (t === 'unique') return { text: 'Nghiệm duy nhất', color: 'var(--good)' };
  if (t === 'infinite') return { text: 'Vô số nghiệm', color: 'var(--warn)' };
  return { text: 'Vô nghiệm', color: 'var(--bad)' };
}

// Hệ vô số nghiệm dùng cho phần Steps
const INF_AUG: Mat = [
  [1, 1, 1, 3],
  [1, 2, 3, 6],
];

export default function Solutions() {
  const [i2, setI2] = useState(0);
  const [i3, setI3] = useState(0);

  const p2 = P2D_LIST[i2];
  const sol2 = solveSystem(p2.A, p2.b);
  const lbl2 = typeLabel(sol2.type);
  const lines2 = [
    { a: p2.A[0][0], b: p2.A[0][1], c: p2.b[0], color: 'var(--vec-1)' },
    { a: p2.A[1][0], b: p2.A[1][1], c: p2.b[1], color: 'var(--vec-2)' },
  ];
  const pts2 =
    sol2.type === 'unique' && sol2.solution
      ? [
          {
            x: sol2.solution[0],
            y: sol2.solution[1],
            color: 'var(--vec-result)',
            label: `(${fmt2(sol2.solution[0])}, ${fmt2(sol2.solution[1])})`,
          },
        ]
      : [];

  const p3 = P3D_LIST[i3];
  const sol3 = solveSystem(p3.A, p3.b);
  const lbl3 = typeLabel(sol3.type);

  // ---- Phần Steps: hệ vô số nghiệm, viết nghiệm tổng quát ----
  const { steps: infSteps } = rrefSteps(INF_AUG);
  const infNodes = infSteps.map((s) => ({
    title: s.desc,
    content: (
      <MathText
        block
        tex={matrixTex(s.matrix, { augment: true, highlight: leadingHighlight(s.matrix, true) })}
      />
    ),
  }));

  return (
    <Lesson id="solutions" title="Duy nhất, vô số, vô nghiệm">
      <p className="muted">
        Không phải hệ nào cũng có đúng một nghiệm. Một hệ tuyến tính luôn rơi vào <strong>đúng ba
        trường hợp</strong>: nghiệm duy nhất, vô số nghiệm, hoặc vô nghiệm. Hình học cho ta thấy vì
        sao — cả trong row picture lẫn column picture.
      </p>

      <Section kind="explore" title="Hệ 2×2 — ba khả năng qua row picture">
        <div className="row" style={{ marginBottom: 10 }}>
          {P2D_LIST.map((p, idx) => (
            <button
              key={p.label}
              className={idx === i2 ? 'btn btn-primary' : 'btn'}
              onClick={() => setI2(idx)}
            >
              {p.label}
            </button>
          ))}
        </div>
        <Canvas2D height={360} range={6} lines={lines2} points={pts2} />
        <div className="panel" style={{ marginTop: 10 }}>
          <div>
            Kết luận (từ <code>solveSystem</code>):{' '}
            <strong style={{ color: lbl2.color }}>{lbl2.text}</strong>
            {sol2.type === 'unique' && sol2.solution && (
              <>
                {' '}
                tại <MathText tex={`(x,y)=(${fmt2(sol2.solution[0])},\\,${fmt2(sol2.solution[1])})`} />
              </>
            )}
          </div>
          <p className="muted" style={{ margin: '6px 0 0', fontSize: 13.5 }}>
            {p2.note}
          </p>
        </div>
        <p className="dim" style={{ fontSize: 12.5, marginTop: 8 }}>
          💡 Gợi ý: bấm lần lượt ba nút và để ý số giao điểm — 1 điểm, cả một đường, hay không có
          điểm nào.
        </p>
      </Section>

      <Section kind="explore" title="Hệ 3×3 — ba mặt phẳng trong không gian">
        <div className="row" style={{ marginBottom: 10 }}>
          {P3D_LIST.map((p, idx) => (
            <button
              key={p.label}
              className={idx === i3 ? 'btn btn-primary' : 'btn'}
              onClick={() => setI3(idx)}
            >
              {p.label}
            </button>
          ))}
        </div>
        <Scene3D
          height={420}
          planes={p3.planes}
          points={p3.point ? [{ p: p3.point, color: '#e879f9', label: 'nghiệm' }] : []}
          lines3={p3.line ? [{ from: p3.line.from, to: p3.line.to, color: '#e879f9' }] : []}
        />
        <div className="panel" style={{ marginTop: 10 }}>
          <div>
            Kết luận (từ <code>solveSystem</code>):{' '}
            <strong style={{ color: lbl3.color }}>{lbl3.text}</strong>
            {sol3.type === 'unique' && sol3.solution && (
              <>
                {' '}
                tại{' '}
                <MathText
                  tex={`(x,y,z)=(${fmt2(sol3.solution[0])},\\,${fmt2(sol3.solution[1])},\\,${fmt2(
                    sol3.solution[2]
                  )})`}
                />
              </>
            )}
          </div>
          <p className="muted" style={{ margin: '6px 0 0', fontSize: 13.5 }}>
            {p3.note}
          </p>
        </div>
        <p className="dim" style={{ fontSize: 12.5, marginTop: 8 }}>
          💡 Gợi ý: kéo chuột để xoay cảnh. Mỗi phương trình 3 ẩn là một <em>mặt phẳng</em>; nghiệm
          là phần giao chung của cả ba mặt.
        </p>
      </Section>

      <Section kind="theory" title="Khi nào có nghiệm? Nhìn hai cách">
        <p>
          <strong>Qua row picture.</strong> Số nghiệm chính là “kích thước” phần giao của các đường
          / mặt:
        </p>
        <ul>
          <li>
            Giao là <strong>một điểm</strong> → nghiệm duy nhất.
          </li>
          <li>
            Giao là <strong>cả một đường (hoặc mặt)</strong> → vô số nghiệm.
          </li>
          <li>
            <strong>Không có phần giao chung</strong> (song song / lăng trụ) → vô nghiệm.
          </li>
        </ul>
        <p>
          <strong>Qua column picture.</strong> Nhớ lại bài 1: giải <MathText tex={'A\\vec{x}=\\vec{b}'} />{' '}
          là hỏi <em>“b có phải là một linear combination của các cột của A không?”</em>
        </p>
        <ul>
          <li>
            Nếu <strong>b nằm trong span các cột</strong> và các cột <em>độc lập</em> → đúng một
            cách tổ hợp → nghiệm duy nhất.
          </li>
          <li>
            Nếu <strong>b nằm trong span</strong> nhưng các cột <em>phụ thuộc</em> (dư thừa) → nhiều
            cách tổ hợp → vô số nghiệm.
          </li>
          <li>
            Nếu <strong>b nằm ngoài span các cột</strong> → không có tổ hợp nào → vô nghiệm.
          </li>
        </ul>
        <p className="muted">
          Con số đo “các cột độc lập tới đâu” gọi là <strong>rank</strong> — số pivot sau khi khử.
          Ta sẽ học kỹ ở Chương 4, nhưng ngay bây giờ hãy nhớ: nếu số pivot bằng số ẩn thì nghiệm
          (nếu có) là duy nhất; nếu ít hơn số ẩn thì có biến tự do → vô số nghiệm.
        </p>
      </Section>

      <Section kind="steps" title="Viết nghiệm tổng quát cho hệ vô số nghiệm">
        <p style={{ marginTop: 0 }}>
          Xét hệ hai phương trình ba ẩn (nhiều ẩn hơn phương trình nên chắc chắn có biến tự do):
        </p>
        <MathText
          block
          tex={'\\begin{cases} x + y + z = 3 \\\\ x + 2y + 3z = 6 \\end{cases}'}
        />
        <StepByStep steps={infNodes} />
        <div className="panel" style={{ marginTop: 12 }}>
          <p style={{ marginTop: 0 }}>
            RREF cho <MathText tex={'x - z = 0'} /> và <MathText tex={'y + 2z = 3'} />. Cột thứ ba
            (z) <strong>không có pivot</strong> → z là <strong>biến tự do</strong>. Đặt{' '}
            <MathText tex={'z = t'} />:
          </p>
          <MathText block tex={'x = t, \\qquad y = 3 - 2t, \\qquad z = t'} />
          <p>Viết gọn thành nghiệm tổng quát dạng “điểm + hướng”:</p>
          <MathText
            block
            tex={
              '\\begin{bmatrix} x \\\\ y \\\\ z \\end{bmatrix} = \\begin{bmatrix} 0 \\\\ 3 \\\\ 0 \\end{bmatrix} + t \\begin{bmatrix} 1 \\\\ -2 \\\\ 1 \\end{bmatrix}, \\quad t \\in \\mathbb{R}'
            }
          />
          <p className="muted" style={{ marginBottom: 0 }}>
            Đây chính là một <strong>đường thẳng</strong> trong không gian: một nghiệm riêng{' '}
            <MathText tex={'(0,3,0)'} /> cộng với mọi bội của vector hướng <MathText tex={'(1,-2,1)'} />.
            Mỗi giá trị của t cho một nghiệm — nên có vô số.
          </p>
        </div>
      </Section>

      <Section kind="quiz" title="Kiểm tra hiểu">
        <Quiz
          lessonKey="ch2/solutions"
          questions={[
            {
              q: <>Một hệ phương trình tuyến tính có thể có bao nhiêu trường hợp về số nghiệm?</>,
              options: [
                'Chỉ 0 hoặc 1 nghiệm',
                'Đúng ba: duy nhất, vô số, hoặc vô nghiệm',
                'Bất kỳ số nguyên nào',
                'Luôn có đúng một nghiệm',
              ],
              answer: 1,
              explain: (
                <>
                  Hệ tuyến tính luôn rơi vào đúng một trong ba: nghiệm duy nhất, vô số nghiệm, hoặc
                  vô nghiệm — không bao giờ có, ví dụ, đúng 2 nghiệm.
                </>
              ),
            },
            {
              q: <>Hai đường thẳng của một hệ 2×2 song song và không trùng nhau. Hệ đó:</>,
              options: ['Nghiệm duy nhất', 'Vô số nghiệm', 'Vô nghiệm', 'Không xác định'],
              answer: 2,
              explain: <>Không có giao điểm → không điểm nào thỏa cả hai phương trình → vô nghiệm.</>,
            },
            {
              q: (
                <>
                  Theo column picture, hệ <MathText tex={'A\\vec{x}=\\vec{b}'} /> vô nghiệm khi nào?
                </>
              ),
              options: [
                'Khi b nằm trong span các cột của A',
                'Khi b nằm ngoài span các cột của A',
                'Khi A là ma trận vuông',
                'Khi b là vector không',
              ],
              answer: 1,
              explain: (
                <>
                  Nếu b không phải là bất kỳ linear combination nào của các cột (nằm ngoài span của
                  chúng) thì không có nghiệm.
                </>
              ),
            },
            {
              q: (
                <>
                  Sau khi khử, số pivot <em>nhỏ hơn</em> số ẩn và hệ vẫn tương thích (không mâu
                  thuẫn). Kết luận?
                </>
              ),
              options: [
                'Nghiệm duy nhất',
                'Vô nghiệm',
                'Vô số nghiệm (có biến tự do)',
                'Không đủ dữ kiện',
              ],
              answer: 2,
              explain: (
                <>
                  Ít pivot hơn số ẩn nghĩa là có cột không pivot → biến tự do → vô số nghiệm dọc
                  theo tham số tự do.
                </>
              ),
            },
          ]}
        />
      </Section>
    </Lesson>
  );
}
