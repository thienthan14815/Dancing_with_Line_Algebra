import { useMemo, useState } from 'react';
import * as THREE from 'three';
import { Lesson, Section } from '../../components/Lesson';
import MathText from '../../components/MathText';
import Scene3D from '../../components/Scene3D';
import MatrixInput from '../../components/MatrixInput';
import StepByStep from '../../components/StepByStep';
import Quiz from '../../components/Quiz';
import {
  quadraticForm,
  eigenSymmetric,
  classifyDefiniteness,
  det,
  type Mat,
} from '../../lib/linalg';
import { defInfo, f2, symmetrize, type Definiteness } from './util';

const PRESETS: { label: string; m: Mat }[] = [
  { label: 'positive-definite', m: [[2, 1], [1, 2]] },
  { label: 'negative-definite', m: [[-2, 1], [1, -2]] },
  { label: 'indefinite', m: [[1, 0], [0, -1]] },
  { label: 'semidefinite', m: [[1, 0], [0, 0]] },
];

// ---- Mặt lưới z = q(x,y) dựng bằng line segments + vertex colors ----
const RNG = 2.2;
const NSEG = 20;
const HS = 0.26; // hệ số nén chiều cao
const HCLAMP = 3.4;

function clamp(x: number, lo: number, hi: number) {
  return Math.max(lo, Math.min(hi, x));
}
function mix(a: number[], b: number[], t: number): number[] {
  return [a[0] + (b[0] - a[0]) * t, a[1] + (b[1] - a[1]) * t, a[2] + (b[2] - a[2]) * t];
}
const GREEN = [0.133, 0.773, 0.306];
const ORANGE = [0.976, 0.451, 0.086];
const MID = [0.42, 0.47, 0.56];
function colorAt(h: number): number[] {
  const t = clamp(h / HCLAMP, -1, 1);
  return t >= 0 ? mix(MID, GREEN, t) : mix(MID, ORANGE, -t);
}

function QuadSurface({ S }: { S: Mat }) {
  const key = JSON.stringify(S);
  const geo = useMemo(() => {
    const pos: number[] = [];
    const col: number[] = [];
    const step = (2 * RNG) / NSEG;
    const H = (u: number, v: number) =>
      clamp(quadraticForm(S, [u, v]) * HS, -HCLAMP, HCLAMP);
    const push = (u: number, v: number) => {
      const h = H(u, v);
      pos.push(u, h, v);
      const c = colorAt(h);
      col.push(c[0], c[1], c[2]);
    };
    for (let i = 0; i <= NSEG; i++) {
      for (let j = 0; j <= NSEG; j++) {
        const u = -RNG + i * step;
        const v = -RNG + j * step;
        if (i < NSEG) {
          push(u, v);
          push(u + step, v);
        }
        if (j < NSEG) {
          push(u, v);
          push(u, v + step);
        }
      }
    }
    const g = new THREE.BufferGeometry();
    g.setAttribute('position', new THREE.Float32BufferAttribute(pos, 3));
    g.setAttribute('color', new THREE.Float32BufferAttribute(col, 3));
    return g;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [key]);

  return (
    <lineSegments geometry={geo}>
      <lineBasicMaterial vertexColors transparent opacity={0.92} />
    </lineSegments>
  );
}

export default function Lesson2Definite() {
  const [A, setA] = useState<Mat>([
    [2, 1],
    [1, 2],
  ]);
  const S = symmetrize(A);
  const kind = classifyDefiniteness(A) as Definiteness;
  const info = defInfo(kind);
  const { values } = eigenSymmetric(S);
  const d1 = S[0][0];
  const d2 = det(S);

  return (
    <Lesson id="ch9-definite" title="Xác định dấu (Definiteness)">
      <p className="muted">
        Một dạng toàn phương gán cho mỗi vector một con số. Câu hỏi lớn:{' '}
        <b>con số đó có luôn dương không?</b> Nếu <MathText tex="q(x)>0" /> với mọi{' '}
        <MathText tex="x\neq 0" />, mặt <MathText tex="z=q(x,y)" /> là một cái{' '}
        <b>bát mở lên</b> có đáy duy nhất tại gốc — đúng thứ ta cần cho một điểm cực tiểu.
        Việc phân loại theo dấu này gọi là <b>definiteness</b>.
      </p>

      <Section kind="explore" title="Xoay cái mặt z = q(x,y) và đọc kết luận">
        <p className="muted" style={{ marginTop: 0 }}>
          <b>Nhiệm vụ:</b> Chọn preset hoặc chỉnh <MathText tex="A" /> (giữ đối xứng), rồi{' '}
          <b>kéo chuột để xoay</b> mặt cong. Vùng <span style={{ color: '#22c55e' }}>xanh</span>{' '}
          là <MathText tex="q>0" /> (đi lên), vùng <span style={{ color: '#f97316' }}>cam</span>{' '}
          là <MathText tex="q<0" /> (đi xuống). Đối chiếu hình dạng với kết luận và các
          eigenvalue bên trái.
        </p>

        <div className="row" style={{ alignItems: 'flex-start', gap: 24 }}>
          <div style={{ flex: '1 1 300px', minWidth: 260 }}>
            <MatrixInput value={A} onChange={setA} presets={PRESETS} />
            <div className="panel" style={{ marginTop: 14, fontSize: 13.5 }}>
              <div
                style={{
                  padding: '10px 12px',
                  borderRadius: 8,
                  background: 'color-mix(in srgb, var(--panel) 40%, transparent)',
                  border: `1px solid ${info.color}`,
                  color: info.color,
                  fontWeight: 700,
                  marginBottom: 10,
                }}
              >
                {info.labelVi} <span style={{ fontWeight: 400 }}>({info.tag})</span>
                <div style={{ fontSize: 12.5, fontWeight: 400, marginTop: 4, color: 'var(--text-muted)' }}>
                  Mặt cong: {info.surface}.
                </div>
              </div>
              <div style={{ marginBottom: 6 }}>
                Eigenvalue của A:{' '}
                <span className="mono" style={{ color: 'var(--vec-1)' }}>
                  λ₁ = {f2(values[0])}
                </span>
                ,{' '}
                <span className="mono" style={{ color: 'var(--vec-2)' }}>
                  λ₂ = {f2(values[1])}
                </span>
              </div>
              <div style={{ color: 'var(--text-muted)', fontSize: 12.5 }}>
                Sylvester: <span className="mono">a = {f2(d1)}</span>,{' '}
                <span className="mono">det A = {f2(d2)}</span>
              </div>
            </div>
          </div>
          <div style={{ flex: '2 1 340px', minWidth: 300 }}>
            <Scene3D height={420}>
              <QuadSurface S={S} />
            </Scene3D>
            <p className="dim" style={{ fontSize: 12 }}>
              Trục đứng (xanh dương) là <MathText tex="z=q" />; mặt phẳng lưới là{' '}
              <MathText tex="z=0" />. Chiều cao đã được nén lại cho vừa khung.
            </p>
          </div>
        </div>
      </Section>

      <Section kind="theory" title="Dấu của eigenvalue quyết định tất cả">
        <p>
          Cho <MathText tex="A" /> đối xứng. Dạng toàn phương <MathText tex="q(x)=x^{\top}Ax" />{' '}
          được gọi là:
        </p>
        <ul>
          <li>
            <b>positive-definite</b> (xác định dương) nếu <MathText tex="q(x)>0" /> với mọi{' '}
            <MathText tex="x\neq 0" />;
          </li>
          <li>
            <b>negative-definite</b> nếu <MathText tex="q(x)<0" /> với mọi{' '}
            <MathText tex="x\neq 0" />;
          </li>
          <li>
            <b>positive/negative-semidefinite</b> nếu <MathText tex="q(x)\ge 0" /> (t.ư.{' '}
            <MathText tex="\le 0" />) và có <MathText tex="x\neq0" /> làm <MathText tex="q=0" />;
          </li>
          <li>
            <b>indefinite</b> nếu <MathText tex="q" /> nhận cả giá trị dương lẫn âm.
          </li>
        </ul>
        <p>
          <b>Định lý (dấu eigenvalue).</b> Với <MathText tex="A" /> đối xứng có các eigenvalue
          thực <MathText tex="\lambda_1,\dots,\lambda_n" />, dạng toàn phương định dấu theo
          đúng dấu của tập eigenvalue:
        </p>
        <MathText
          block
          tex="\text{pos-def} \Leftrightarrow \text{mọi } \lambda_i>0,\quad \text{neg-def} \Leftrightarrow \text{mọi } \lambda_i<0,\quad \text{indef} \Leftrightarrow \text{có } \lambda_i>0 \text{ và } \lambda_j<0."
        />
        <p>
          <b>Vì sao?</b> Bài spectral theorem tiếp theo sẽ cho phép đổi biến trực giao{' '}
          <MathText tex="y=Q^{\top}x" /> để mọi số hạng chéo biến mất:
        </p>
        <MathText block tex="q(x)=\lambda_1 y_1^2 + \lambda_2 y_2^2 + \dots + \lambda_n y_n^2." />
        <p>
          Đây là <b>tổng các bình phương có trọng số là eigenvalue</b>. Tổng này dương với
          mọi <MathText tex="y\neq 0" /> khi và chỉ khi mọi trọng số dương — nên dấu của
          eigenvalue chi phối toàn bộ. Một eigenvalue bằng 0 tạo ra một hướng phẳng (semidefinite);
          hai eigenvalue trái dấu tạo ra yên ngựa (indefinite).
        </p>

        <h3>Đào sâu — tiêu chí định thức con chính (Sylvester)</h3>
        <p>
          Không cần tính eigenvalue, ta có thể xét các <b>định thức con chính dẫn đầu</b>{' '}
          (leading principal minors) <MathText tex="D_1,D_2,\dots,D_n" /> — định thức của
          khối góc trên-trái cỡ <MathText tex="k\times k" />.
        </p>
        <ul>
          <li>
            <b>Positive-definite</b> <MathText tex="\Leftrightarrow D_1>0,\ D_2>0,\dots,\ D_n>0" />{' '}
            (mọi minor dương).
          </li>
          <li>
            <b>Negative-definite</b> <MathText tex="\Leftrightarrow" /> dấu đan xen bắt đầu bằng
            âm: <MathText tex="D_1<0,\ D_2>0,\ D_3<0,\dots" /> (nghĩa là{' '}
            <MathText tex="(-1)^k D_k>0" />).
          </li>
        </ul>
        <p>
          Với <MathText tex="2\times2" />, <MathText tex="A=\begin{bmatrix}a&b\\b&c\end{bmatrix}" />:
          pos-def <MathText tex="\Leftrightarrow a>0 \text{ và } \det A = ac-b^2>0" />; còn{' '}
          <MathText tex="\det A<0" /> luôn cho indefinite (hai eigenvalue trái dấu vì tích của
          chúng bằng <MathText tex="\det A<0" />).
        </p>
      </Section>

      <Section kind="steps" title="Xét định dấu qua eigenvalue">
        <StepByStep
          steps={[
            {
              title: 'Đề bài',
              content: (
                <div>
                  <p className="muted">Xét định dấu của dạng toàn phương ứng với</p>
                  <MathText block tex="A=\begin{bmatrix} 3 & 1 \\ 1 & 3 \end{bmatrix}." />
                </div>
              ),
            },
            {
              title: 'Bước 1 — Trace và determinant',
              content: (
                <MathText block tex="\operatorname{tr}A = 3+3 = 6,\qquad \det A = 3\cdot3 - 1\cdot1 = 8." />
              ),
            },
            {
              title: 'Bước 2 — Giải phương trình đặc trưng',
              content: (
                <div>
                  <MathText block tex="\lambda^2 - 6\lambda + 8 = 0 \;\Rightarrow\; \lambda = \frac{6\pm\sqrt{36-32}}{2} = \frac{6\pm2}{2}." />
                  <MathText block tex="\lambda_1 = 4,\qquad \lambda_2 = 2." />
                </div>
              ),
            },
            {
              title: 'Bước 3 — Kết luận',
              content: (
                <div>
                  <p className="muted">
                    Cả hai eigenvalue đều dương ⇒ <b>positive-definite</b>.
                  </p>
                  <p className="muted">
                    Kiểm tra chéo bằng Sylvester: <MathText tex="D_1=3>0" /> và{' '}
                    <MathText tex="D_2=\det A=8>0" /> — cùng kết luận. Mặt{' '}
                    <MathText tex="z=q" /> là một cái bát mở lên.
                  </p>
                </div>
              ),
            },
          ]}
        />
      </Section>

      <Section kind="quiz" title="Kiểm tra hiểu">
        <Quiz
          lessonKey="ch9/definite"
          questions={[
            {
              q: <>Một ma trận đối xứng có eigenvalue <MathText tex="\lambda_1=5,\ \lambda_2=-1" />. Dạng toàn phương của nó thuộc loại nào?</>,
              options: [
                <>Indefinite — có eigenvalue dương và eigenvalue âm (mặt yên ngựa)</>,
                <>Positive-definite</>,
                <>Negative-definite</>,
                <>Positive-semidefinite</>,
              ],
              answer: 0,
              explain: (
                <>
                  Có cả <MathText tex="\lambda>0" /> lẫn <MathText tex="\lambda<0" /> nên q nhận
                  cả giá trị dương và âm ⇒ indefinite, mặt cong là yên ngựa.
                </>
              ),
            },
            {
              q: (
                <>
                  Theo tiêu chí Sylvester, <MathText tex="A=\begin{bmatrix}a&b\\b&c\end{bmatrix}" />{' '}
                  positive-definite khi và chỉ khi?
                </>
              ),
              options: [
                <><MathText tex="a>0" /> và <MathText tex="\det A = ac-b^2>0" /></>,
                <><MathText tex="a>0" /> và <MathText tex="c>0" /> (chỉ cần đường chéo dương)</>,
                <><MathText tex="\det A>0" /> là đủ</>,
                <><MathText tex="\operatorname{tr}A>0" /> là đủ</>,
              ],
              answer: 0,
              explain: (
                <>
                  Cần cả hai minor dẫn đầu dương: <MathText tex="D_1=a>0" /> và{' '}
                  <MathText tex="D_2=\det A>0" />. Chỉ <MathText tex="a>0" /> hay chỉ{' '}
                  <MathText tex="\det>0" /> đều chưa đủ.
                </>
              ),
            },
            {
              q: <>Nếu <MathText tex="\det A<0" /> với A đối xứng 2×2 thì kết luận gì chắc chắn?</>,
              options: [
                <>Indefinite — vì <MathText tex="\lambda_1\lambda_2=\det A<0" /> nên hai eigenvalue trái dấu</>,
                <>Positive-definite</>,
                <>Positive-semidefinite</>,
                <>Không kết luận được gì</>,
              ],
              answer: 0,
              explain: (
                <>
                  Tích hai eigenvalue bằng <MathText tex="\det A" />. Âm ⇒ một dương một âm ⇒
                  indefinite, bất kể đường chéo.
                </>
              ),
            },
            {
              q: <>Mặt <MathText tex="z=q(x,y)" /> hình "bát úp xuống" (mọi hướng đi xuống từ gốc) ứng với loại nào?</>,
              options: [
                <>Negative-definite — mọi eigenvalue âm</>,
                <>Positive-definite</>,
                <>Indefinite</>,
                <>Semidefinite dương</>,
              ],
              answer: 0,
              explain: (
                <>
                  Bát úp xuống ⇔ <MathText tex="q(x)<0" /> mọi <MathText tex="x\neq0" /> ⇔ mọi
                  eigenvalue âm ⇔ negative-definite. Gốc là điểm cực đại.
                </>
              ),
            },
          ]}
        />
      </Section>
    </Lesson>
  );
}
