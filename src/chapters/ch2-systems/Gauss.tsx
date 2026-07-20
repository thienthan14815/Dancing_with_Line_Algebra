import { useState } from 'react';
import { Lesson, Section } from '../../components/Lesson';
import MathText from '../../components/MathText';
import Canvas2D from '../../components/Canvas2D';
import MatrixInput from '../../components/MatrixInput';
import StepByStep from '../../components/StepByStep';
import Quiz from '../../components/Quiz';
import { rrefSteps, solveSystem, type Mat } from '../../lib/linalg';
import { matrixTex, leadingHighlight, fmt2 } from './matrixTex';

// Ma trận mở rộng [A|b], 3 phương trình 3 ẩn.
const PRESETS: { label: string; m: Mat }[] = [
  {
    label: 'Nghiệm duy nhất',
    m: [
      [2, 1, -1, 8],
      [-3, -1, 2, -11],
      [-2, 1, 2, -3],
    ],
  },
  {
    label: 'Vô số nghiệm',
    m: [
      [1, 1, 1, 3],
      [2, 2, 2, 6],
      [1, 2, 3, 6],
    ],
  },
  {
    label: 'Vô nghiệm',
    m: [
      [1, 1, 1, 3],
      [1, 1, 1, 4],
      [2, 3, 1, 5],
    ],
  },
  {
    label: 'Ví dụ đẹp',
    m: [
      [1, 2, 1, 2],
      [3, 8, 1, 12],
      [0, 4, 1, 2],
    ],
  },
];

// Hệ 2×2 cố định dùng cho row picture bên cạnh (giao điểm (1,2) không đổi).
const DEMO2: Mat = [
  [1, 2, 5],
  [3, -1, 1],
];
const DEMO2_STEPS = rrefSteps(DEMO2).steps;
const DEMO2_SOL = solveSystem(
  [
    [DEMO2[0][0], DEMO2[0][1]],
    [DEMO2[1][0], DEMO2[1][1]],
  ],
  [DEMO2[0][2], DEMO2[1][2]]
);

export default function Gauss() {
  const [aug, setAug] = useState<Mat>(PRESETS[0].m.map((r) => r.slice()));
  const [stepIdx, setStepIdx] = useState(0);

  const { steps, rref } = rrefSteps(aug);

  // Kết luận nghiệm
  const A3: Mat = aug.map((r) => r.slice(0, 3));
  const b3 = aug.map((r) => r[3]);
  const sol = solveSystem(A3, b3);
  const conclusion =
    sol.type === 'unique'
      ? `Nghiệm duy nhất: (x, y, z) = (${sol.solution!.map(fmt2).join(', ')}).`
      : sol.type === 'infinite'
        ? 'Vô số nghiệm — xuất hiện biến tự do (một cột không có pivot).'
        : 'Vô nghiệm — có hàng dạng [0 0 0 | c] với c ≠ 0 (mâu thuẫn).';

  const stepNodes = steps.map((s) => ({
    title: s.desc,
    content: (
      <MathText
        block
        tex={matrixTex(s.matrix, { augment: true, highlight: leadingHighlight(s.matrix, true) })}
      />
    ),
  }));

  // Row picture 2D đồng bộ: clamp về số bước của hệ demo 2×2
  const idx2 = Math.min(stepIdx, DEMO2_STEPS.length - 1);
  const demoMat = DEMO2_STEPS[idx2].matrix;
  const demoLines = [
    { a: demoMat[0][0], b: demoMat[0][1], c: demoMat[0][2], color: 'var(--vec-1)' },
    { a: demoMat[1][0], b: demoMat[1][1], c: demoMat[1][2], color: 'var(--vec-2)' },
  ];
  const demoPoint =
    DEMO2_SOL.type === 'unique' && DEMO2_SOL.solution
      ? [
          {
            x: DEMO2_SOL.solution[0],
            y: DEMO2_SOL.solution[1],
            color: 'var(--vec-result)',
            label: `(${fmt2(DEMO2_SOL.solution[0])}, ${fmt2(DEMO2_SOL.solution[1])})`,
          },
        ]
      : [];

  return (
    <Lesson id="gauss" title="Gauss elimination từng bước">
      <p className="muted">
        Đây là <strong>trái tim của chương</strong>: một quy trình máy móc, luôn chạy được, để đưa
        hệ về dạng đơn giản nhất rồi <em>đọc ra nghiệm</em>. Ý tưởng cốt lõi: dùng các{' '}
        <strong>phép biến đổi hàng</strong> để tạo số 0, mà <em>không hề làm đổi nghiệm</em>.
      </p>

      <Section kind="steps" title="Khử Gauss trên ma trận mở rộng [A | b]">
        <p style={{ marginTop: 0 }}>
          Chọn một hệ mẫu hoặc tự nhập ma trận mở rộng 3×4 (ba hệ số + vế phải). Bấm{' '}
          <em>Sau →</em> để chạy từng phép biến đổi hàng; pivot được{' '}
          <span style={{ color: 'var(--vec-result)', fontWeight: 700 }}>tô hồng</span>.
        </p>
        <MatrixInput
          value={aug}
          onChange={(m) => {
            setAug(m);
            setStepIdx(0);
          }}
          presets={PRESETS}
        />

        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
            gap: 18,
            marginTop: 16,
            alignItems: 'start',
          }}
        >
          <div>
            <StepByStep
              key={JSON.stringify(aug)}
              steps={stepNodes}
              onStepChange={setStepIdx}
            />
            <div className="panel" style={{ marginTop: 12 }}>
              <div className="dim" style={{ fontSize: 12, marginBottom: 4 }}>
                Dạng rút gọn cuối cùng (RREF):
              </div>
              <MathText block tex={matrixTex(rref, { augment: true })} />
              <p style={{ margin: '6px 0 0', fontSize: 13.5 }}>
                <strong>Kết luận:</strong> {conclusion}
              </p>
            </div>
          </div>

          <div>
            <div style={{ fontWeight: 650, marginBottom: 6, color: 'var(--accent)' }}>
              Row picture đồng bộ (hệ 2×2 minh họa)
            </div>
            <Canvas2D height={330} range={5} lines={demoLines} points={demoPoint} />
            <div className="panel" style={{ marginTop: 8 }}>
              <MathText block tex={matrixTex(demoMat, { augment: true, highlight: leadingHighlight(demoMat, true) })} />
            </div>
            <p className="dim" style={{ fontSize: 12.5 }}>
              👀 Insight then chốt: khi bấm từng bước, hai đường thẳng <strong>xoay dần</strong> (cuối
              cùng thành thẳng đứng và nằm ngang), <strong>nhưng giao điểm luôn đứng yên</strong> tại{' '}
              <span style={{ color: 'var(--vec-result)' }}>
                ({DEMO2_SOL.solution ? fmt2(DEMO2_SOL.solution[0]) : ''},{' '}
                {DEMO2_SOL.solution ? fmt2(DEMO2_SOL.solution[1]) : ''})
              </span>
              . Phép biến đổi hàng thay đổi phương trình nhưng <em>không đổi nghiệm</em>.
            </p>
          </div>
        </div>

        <p className="dim" style={{ fontSize: 12.5, marginTop: 8 }}>
          💡 Gợi ý: thử preset <em>“Vô số nghiệm”</em> và <em>“Vô nghiệm”</em> để thấy RREF xuất hiện
          hàng toàn 0, hoặc hàng mâu thuẫn [0 0 0 | c].
        </p>
      </Section>

      <Section kind="theory" title="Ba phép biến đổi hàng & dạng bậc thang">
        <p>Toàn bộ khử Gauss chỉ dùng ba phép biến đổi hàng, và cả ba đều bảo toàn tập nghiệm:</p>
        <ol>
          <li>
            <strong>Đổi chỗ</strong> hai hàng (<MathText tex={'R_i \\leftrightarrow R_j'} />) — chỉ
            viết lại thứ tự phương trình.
          </li>
          <li>
            <strong>Nhân một hàng với hằng số khác 0</strong> (<MathText tex={'R_i \\leftarrow k R_i'} />)
            — nhân hai vế của một phương trình.
          </li>
          <li>
            <strong>Cộng vào một hàng một bội của hàng khác</strong> (
            <MathText tex={'R_i \\leftarrow R_i - k R_j'} />) — phép tạo số 0 quan trọng nhất.
          </li>
        </ol>
        <p>
          <strong>Pivot</strong> là phần tử khác 0 dẫn đầu của một hàng sau khi khử. Đưa ma trận về{' '}
          <strong>dạng bậc thang</strong> (echelon form): mỗi pivot nằm bên phải pivot của hàng
          trên, phía dưới mỗi pivot toàn số 0. Tiếp tục khử cả phía trên pivot và chuẩn hóa pivot về
          1 ta được <strong>RREF</strong> (reduced row echelon form) — từ đó đọc nghiệm trực tiếp.
        </p>
        <p>
          <strong>Back-substitution.</strong> Nếu chỉ khử xuống (dạng bậc thang tam giác trên), ta
          giải ẩn cuối trước rồi <em>thế ngược</em> lên: từ hàng cuối tìm z, thay vào hàng trên tìm
          y, rồi x. RREF chính là “đẩy” việc thế ngược đó vào luôn trong ma trận.
        </p>
        <p className="muted">
          Vì mỗi phép biến đổi hàng tương ứng với một thao tác hợp lệ trên phương trình, hệ mới{' '}
          <em>tương đương</em> hệ cũ — cùng tập nghiệm. Đó là lý do đường thẳng ở row picture xoay
          nhưng giao điểm không đổi.
        </p>
      </Section>

      <Section kind="quiz" title="Kiểm tra hiểu">
        <Quiz
          lessonKey="ch2/gauss"
          questions={[
            {
              q: <>Mục đích chính của các phép biến đổi hàng trong khử Gauss là gì?</>,
              options: [
                'Làm đổi nghiệm của hệ cho dễ tính',
                'Tạo các số 0 để đưa về dạng bậc thang mà vẫn giữ nguyên nghiệm',
                'Tăng số phương trình lên',
                'Tính định thức nhanh hơn',
              ],
              answer: 1,
              explain: (
                <>
                  Ba phép biến đổi hàng đều bảo toàn tập nghiệm; ta dùng chúng để tạo số 0 và đưa về
                  dạng bậc thang / RREF.
                </>
              ),
            },
            {
              q: <>“Pivot” là gì?</>,
              options: [
                'Phần tử ở góc trên bên trái của ma trận',
                'Phần tử khác 0 dẫn đầu của một hàng ở dạng bậc thang',
                'Phần tử lớn nhất của ma trận',
                'Vế phải của phương trình',
              ],
              answer: 1,
              explain: <>Pivot là phần tử khác 0 đầu tiên của mỗi hàng sau khi khử — nó “neo” một ẩn.</>,
            },
            {
              q: (
                <>
                  Trong row picture đồng bộ, khi chạy từng bước, giao điểm hai đường thẳng thay đổi
                  thế nào?
                </>
              ),
              options: [
                'Di chuyển dần về gốc tọa độ',
                'Đứng yên — vì biến đổi hàng không đổi nghiệm',
                'Biến mất sau bước đầu tiên',
                'Nhân đôi lên thành hai giao điểm',
              ],
              answer: 1,
              explain: (
                <>
                  Các đường xoay đi nhưng luôn đi qua cùng một điểm: nghiệm không đổi qua mọi phép
                  biến đổi hàng.
                </>
              ),
            },
            {
              q: <>Nếu RREF xuất hiện một hàng dạng [0 0 0 | 5], hệ có tính chất gì?</>,
              options: [
                'Nghiệm duy nhất',
                'Vô số nghiệm',
                'Vô nghiệm (mâu thuẫn 0 = 5)',
                'Không xác định được',
              ],
              answer: 2,
              explain: <>Hàng đó nghĩa là 0 = 5 — vô lý, nên hệ vô nghiệm.</>,
            },
          ]}
        />
      </Section>
    </Lesson>
  );
}
