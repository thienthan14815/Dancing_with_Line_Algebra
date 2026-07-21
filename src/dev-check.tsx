import { useState } from 'react';
import { Lesson, Section, LessonViewProvider } from './components/Lesson';
import MathText from './components/MathText';
import Canvas2D, { type V2 } from './components/Canvas2D';
import Scene3D from './components/Scene3D';
import Slider from './components/Slider';
import MatrixInput from './components/MatrixInput';
import StepByStep from './components/StepByStep';
import Quiz from './components/Quiz';
import CodePlayground from './components/CodePlayground';
import { rotation2D, type Mat } from './lib/linalg';

export default function DevCheck() {
  const [vec, setVec] = useState<V2[]>([
    { id: 'a', x: 2, y: 1, color: 'var(--vec-1)', label: 'a', draggable: true },
    { id: 'b', x: -1, y: 2, color: 'var(--vec-2)', label: 'b', draggable: true },
  ]);
  const [angle, setAngle] = useState(0);
  const [applyMatrix, setApplyMatrix] = useState(false);
  const [mat, setMat] = useState<Mat>([
    [1, 0],
    [0, 1],
  ]);
  const [stepIdx, setStepIdx] = useState(0);

  const rot = rotation2D(angle) as [[number, number], [number, number]];

  return (
    <div className="page">
      {/* Trang QA: hiển thị đủ MỌI loại section (kể cả quiz) */}
      <LessonViewProvider view="all">
      <Lesson id="dev-check" title="🧪 Dev Check — Bảng kiểm mọi component">
        <p className="muted">
          Trang QA: mọi component nền móng với dữ liệu mẫu. Kiểm tra bằng mắt trước khi bàn giao.
        </p>

        <Section kind="theory" title="MathText (KaTeX)">
          <p>
            Inline: <MathText tex="A\vec{v} = \lambda \vec{v}" /> — và eigenvalue phương trình.
          </p>
          <MathText
            block
            tex="\det(A - \lambda I) = 0 \quad\Longrightarrow\quad \lambda_{1,2} = \frac{\text{tr} \pm \sqrt{\text{tr}^2 - 4\det}}{2}"
          />
        </Section>

        <Section kind="explore" title="Canvas2D — kéo vector + animate matrix">
          <div className="row" style={{ marginBottom: 10 }}>
            <button
              className="btn btn-primary"
              onClick={() => setApplyMatrix((v) => !v)}
            >
              {applyMatrix ? 'Bỏ biến đổi' : 'Áp phép quay 45°'}
            </button>
            <Slider
              label="Góc quay θ (rad)"
              min={0}
              max={Math.PI * 2}
              value={angle}
              onChange={setAngle}
              format={(v) => `${v.toFixed(2)} rad`}
            />
          </div>
          <Canvas2D
            height={420}
            range={5}
            vectors={vec}
            onVectorChange={(id, x, y) =>
              setVec((vs) => vs.map((v) => (v.id === id ? { ...v, x, y } : v)))
            }
            matrix={applyMatrix ? rot : undefined}
            polygons={[
              {
                points: [
                  [0, 0],
                  [2, 0],
                  [2, 2],
                  [0, 2],
                ],
                fill: 'var(--vec-3)',
                opacity: 0.18,
              },
            ]}
            points={[{ x: -3, y: -2, color: 'var(--vec-result)', label: 'P' }]}
            lines={[{ a: 1, b: 1, c: 3, color: 'var(--vec-result)', label: 'x+y=3' }]}
          />
          <p className="dim" style={{ fontSize: 12 }}>
            Kéo đầu vector a/b (snap 0.25). Bấm nút để lưới + phần tử animate sang phép quay.
          </p>
        </Section>

        <Section kind="explore" title="Scene3D — vectors + plane + span">
          <Scene3D
            height={420}
            vectors={[
              { id: 'i', v: [2, 0, 0], color: '#f97316', label: 'u' },
              { id: 'j', v: [0, 2, 1], color: '#22c55e', label: 'v' },
              { id: 'k', v: [1, 1, 2], color: '#e879f9', label: 'w' },
            ]}
            points={[{ p: [2, 2, 2], color: '#4f9cf9', label: 'Q' }]}
            planes={[{ normal: [0, 0, 1], d: 0, color: '#38bdf8', opacity: 0.15 }]}
            spanPlanes={[
              { u: [2, 0, 0], v: [0, 2, 1], color: '#22c55e', opacity: 0.2 },
            ]}
          />
          <p className="dim" style={{ fontSize: 12 }}>
            Kéo chuột để orbit. Có mặt phẳng z=0, mặt span(u,v) và các vector 3D.
          </p>
        </Section>

        <Section kind="explore" title="MatrixInput">
          <MatrixInput
            value={mat}
            onChange={setMat}
            presets={[
              { label: 'Identity', m: [[1, 0], [0, 1]] },
              { label: 'Xoay 90°', m: [[0, -1], [1, 0]] },
              { label: 'Co giãn 2×', m: [[2, 0], [0, 2]] },
              { label: 'Shear', m: [[1, 1], [0, 1]] },
            ]}
          />
          <p className="dim mono" style={{ fontSize: 12 }}>
            value = {JSON.stringify(mat)}
          </p>
        </Section>

        <Section kind="steps" title="StepByStep">
          <StepByStep
            onStepChange={setStepIdx}
            steps={[
              { title: 'Bước 1', content: <p>Bắt đầu với ma trận gốc.</p> },
              { title: 'Bước 2', content: <p>Khử phần tử dưới pivot đầu tiên.</p> },
              { title: 'Bước 3', content: <p>Chuẩn hóa pivot về 1.</p> },
              { title: 'Bước 4', content: <p>Ma trận đã ở dạng RREF.</p> },
            ]}
          />
          <p className="dim" style={{ fontSize: 12 }}>Step hiện tại (từ callback): {stepIdx}</p>
        </Section>

        <Section kind="quiz" title="Quiz">
          <Quiz
            lessonKey="dev-check/demo"
            questions={[
              {
                q: <>Dot product của <MathText tex="[1,0]" /> và <MathText tex="[0,1]" /> bằng?</>,
                options: ['0', '1', '2', '-1'],
                answer: 0,
                explain: <>Hai vector vuông góc nên dot product = 0.</>,
              },
              {
                q: <>Determinant của ma trận identity 2×2?</>,
                options: ['0', '1', '2', '4'],
                answer: 1,
                explain: <>det(I) = 1 luôn đúng với mọi kích thước.</>,
              },
            ]}
          />
        </Section>

        <Section kind="explore" title="CodePlayground (2D)">
          <CodePlayground
            scene="2d"
            height={420}
            initialCode={`// draw API + thư viện la
const v = [2, 1];
const w = la.scale(v, 1.5);
draw.vector(v[0], v[1], { color: 'var(--vec-1)', label: 'v' });
draw.vector(w[0], w[1], { color: 'var(--vec-2)', label: '1.5v' });
draw.point(-2, 2, { color: 'var(--vec-result)', label: 'P' });
draw.polygon([[0,0],[3,0],[3,1]], { fill: 'var(--vec-3)', opacity: 0.2 });
print('norm(v) =', la.norm(v));`}
            numpyCode={`import numpy as np
v = np.array([2, 1])
w = 1.5 * v
print('norm(v) =', np.linalg.norm(v))`}
          />
        </Section>
      </Lesson>
      </LessonViewProvider>
    </div>
  );
}
