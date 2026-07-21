import type { ReactNode } from 'react';
import Canvas2D, { useCanvas2D } from '../../components/Canvas2D';
import { useDiagramHeight } from '../lib/useDiagramHeight';
import type { Exercise } from '../../core/exercises/types';
import {
  diagramKind,
  parseVectors,
  only2D,
  parseMatrix2,
  parseAngles,
  parseScalarTimes,
  parseCombo,
  parseEquations,
  intersect,
  eig2,
  det2,
  matVec,
  dot2,
  niceRange,
  deg2rad,
  r2,
  type Mat2,
  type Line,
  type Vec,
} from './diagramSpec';

// ===========================================================================
// TUTOR DIAGRAM — vẽ đồ thị 2D cho THẤY một phép tính / khái niệm NGHĨA LÀ GÌ.
//
// Dùng SỐ LIỆU THẬT của bài khi parse được; nếu không thì vẽ MỘT VÍ DỤ TIÊU
// BIỂU và ghi chú rõ. Mọi nhánh đều chịu được dữ liệu lạ (không crash).
// Tái dùng (chỉ import) <Canvas2D> — không sửa file đó.
// ===========================================================================

const C = {
  v1: 'var(--vec-1)',
  v2: 'var(--vec-2)',
  v3: 'var(--vec-3)',
  res: 'var(--vec-result)',
  muted: 'var(--text-muted)',
  dim: 'var(--text-dim)',
};

/** Chiều cao hình trên PC; mobile co theo viewport (useDiagramHeight). */
const DESKTOP_H = 300;

interface Fig {
  figure: ReactNode;
  caption: string;
  /** Ghi chú khi phải dùng ví dụ tiêu biểu (không parse được số liệu thật). */
  note?: string;
}

const TYPICAL = 'Hình minh họa ý nghĩa (ví dụ tiêu biểu).';

export default function TutorDiagram({ exercise }: { exercise: Exercise }) {
  const h = useDiagramHeight(DESKTOP_H);
  const kind = diagramKind(exercise);
  if (!kind) return null;
  const fig = buildFig(exercise, kind, h);
  return (
    <div className="tt-diagram-body">
      <div className="tt-diagram-figure">{fig.figure}</div>
      <p className="tt-diagram-caption">{fig.caption}</p>
      {fig.note && <p className="tt-diagram-note">📌 {fig.note}</p>}
    </div>
  );
}

/** Chọn & dựng đồ thị theo loại; KHÔNG BAO GIỜ ném lỗi (fallback an toàn). */
function buildFig(
  ex: Exercise,
  kind: NonNullable<ReturnType<typeof diagramKind>>,
  h: number,
): Fig {
  try {
    switch (kind) {
      case 'trig':
        return trigFig(ex, h);
      case 'vectors':
        return vectorsFig(ex, h);
      case 'dot':
        return dotFig(ex, h);
      case 'projection':
        return projectionFig(ex, h);
      case 'determinant':
        return matrixFig(parseMatrix2(gatherText(ex)), 'det', h);
      case 'transform':
        return matrixFig(parseMatrix2(gatherText(ex)), 'transform', h);
      case 'eigen':
        return eigenFig(ex, h);
      case 'system':
        return systemFig(ex, h);
      default: {
        const _never: never = kind;
        return { figure: null, caption: String(_never) };
      }
    }
  } catch {
    // Tuyệt đối không để đồ thị làm sập panel.
    return { figure: null, caption: 'Chưa thể dựng hình minh họa cho bài này.' };
  }
}

// ---------------------------------------------------------------------------
// Tiện ích cục bộ
// ---------------------------------------------------------------------------

function maxAbs(...xs: number[]): number {
  return xs.reduce((m, x) => (Number.isFinite(x) && Math.abs(x) > m ? Math.abs(x) : m), 0);
}

// -- Định dạng số & tọa độ đầu vector (số đo trục nay do Canvas2D lo) ------
function clamp(v: number, lo: number, hi: number): number {
  return Math.max(lo, Math.min(hi, v));
}

/** Số gọn cho nhãn tọa độ: nguyên → bỏ ".0"; còn lại 1 chữ số thập phân. */
function fmtNum(n: number): string {
  if (!Number.isFinite(n)) return '0';
  const r = Math.round(n * 10) / 10;
  const z = Object.is(r, -0) ? 0 : r;
  return Number.isInteger(z) ? String(z) : z.toFixed(1);
}

/** Đường thẳng qua gốc theo hướng d (để làm "trục" / không gian con). */
function lineThroughOrigin(d: number[]): Line {
  return { a: d[1], b: -d[0], c: 0 };
}

const fmtDeg = (d: number) => (Number.isInteger(d) ? `${d}` : `${r2(d)}`);

/** Gom mọi văn bản có ích của bài (prompt + statement + options + nhãn ghép). */
function gatherText(ex: Exercise): string {
  const bits: string[] = [ex.prompt];
  const anyEx = ex as unknown as Record<string, unknown>;
  for (const k of ['statement', 'left', 'right', 'options']) {
    const val = anyEx[k];
    if (Array.isArray(val)) bits.push(...val.map(String));
    else if (typeof val === 'string') bits.push(val);
  }
  return bits.join('  ');
}

// ---------------------------------------------------------------------------
// 1) TRIGONOMETRY — đường tròn đơn vị + (cos θ, sin θ)
// ---------------------------------------------------------------------------

function CircleAndAngles({ angles }: { angles: number[] }) {
  const { toScreen } = useCanvas2D();
  const [ox, oy] = toScreen(0, 0);
  const [rx] = toScreen(1, 0);
  const R = rx - ox; // bán kính 1 đơn vị (px)
  const single = angles.length === 1;

  return (
    <g>
      <circle cx={ox} cy={oy} r={R} fill="none" stroke={C.muted} strokeWidth={1.5} />
      {angles.map((deg, i) => {
        const th = deg2rad(deg);
        const c = Math.cos(th);
        const s = Math.sin(th);
        const [px, py] = toScreen(c, s);
        const [fx, fy] = toScreen(c, 0);
        return (
          <g key={i}>
            {/* cos: đoạn ngang trên trục x */}
            <line x1={ox} y1={oy} x2={fx} y2={fy} stroke={C.v2} strokeWidth={single ? 4 : 2.5} />
            {/* sin: đoạn dọc từ trục x lên tới điểm */}
            <line x1={fx} y1={fy} x2={px} y2={py} stroke={C.v3} strokeWidth={single ? 4 : 2.5} />
            {/* bán kính tới điểm */}
            <line x1={ox} y1={oy} x2={px} y2={py} stroke={C.v1} strokeWidth={2} />
            {/* điểm (cos θ, sin θ) */}
            <circle cx={px} cy={py} r={5} fill={C.res} />
            <text
              x={px + (c >= 0 ? 9 : -9)}
              y={py + (s >= 0 ? -9 : 17)}
              fill={C.dim}
              fontSize={12}
              textAnchor={c >= 0 ? 'start' : 'end'}
            >
              {`${fmtDeg(deg)}° (${r2(c)}, ${r2(s)})`}
            </text>
          </g>
        );
      })}
    </g>
  );
}

function trigFig(ex: Exercise, h: number): Fig {
  let angles = parseAngles(gatherText(ex));
  let note: string | undefined;
  if (angles.length === 0) {
    angles = [0, 45, 90];
    note = TYPICAL;
  }
  // Hạn chế số góc để tránh rối.
  if (angles.length > 6) angles = angles.slice(0, 6);

  return {
    figure: (
      <Canvas2D height={h} range={1.7} showGrid={false} showAxes>
        <CircleAndAngles angles={angles} />
      </Canvas2D>
    ),
    caption:
      'Trên đường tròn đơn vị, mỗi góc θ ứng với điểm (cos θ, sin θ): đoạn cam nằm ngang là cos θ (hoành độ), đoạn lục thẳng đứng là sin θ (tung độ).',
    note,
  };
}

// ---------------------------------------------------------------------------
// 2) VECTORS — basics / addition / scalar / linear combination
// ---------------------------------------------------------------------------

function vectorsFig(ex: Exercise, h: number): Fig {
  const vs = only2D(parseVectors(gatherText(ex)));
  const skill = ex.skillId;

  if (skill === 'vector_addition') return additionFig(vs, h);
  if (skill === 'scalar_multiplication') return scalarFig(ex, vs, h);
  if (skill === 'linear_combination') return lincombFig(ex, vs, h);
  return basicsFig(ex, vs, h);
}

function basicsFig(ex: Exercise, vs: Vec[], h: number): Fig {
  let v: number[];
  let note: string | undefined;
  if (ex.type === 'vector-drawing') v = [ex.target[0], ex.target[1]];
  else if (vs.length >= 1) v = vs[0];
  else {
    v = [2, 3];
    note = TYPICAL;
  }
  const range = niceRange(maxAbs(v[0], v[1]));
  return {
    figure: (
      <Canvas2D height={h} range={range}>
        {renderVectors([{ id: 'v', x: v[0], y: v[1], color: C.v1, label: 'v' }])}
      </Canvas2D>
    ),
    caption: `Vector v = (${r2(v[0])}, ${r2(v[1])}) là mũi tên từ gốc tọa độ: đi ngang ${r2(
      v[0],
    )} rồi đi dọc ${r2(v[1])} tới ngọn mũi tên. Độ dài ‖v‖ là khoảng cách từ gốc tới ngọn mũi tên.`,
    note,
  };
}

function additionFig(vs: Vec[], h: number): Fig {
  let a: number[];
  let b: number[];
  let note: string | undefined;
  if (vs.length >= 2) {
    a = vs[0];
    b = vs[1];
  } else {
    a = [2, 1];
    b = [1, 3];
    note = TYPICAL;
  }
  const sum = [a[0] + b[0], a[1] + b[1]];
  const range = niceRange(maxAbs(a[0], a[1], b[0], b[1], sum[0], sum[1]));
  return {
    figure: (
      <Canvas2D
        height={h}
        range={range}
        polygons={[
          {
            points: [
              [0, 0],
              [a[0], a[1]],
              [sum[0], sum[1]],
              [b[0], b[1]],
            ],
            fill: C.res,
            opacity: 0.12,
            stroke: C.res,
          },
        ]}
        segments={[{ from: [a[0], a[1]], to: [sum[0], sum[1]], color: C.v2, dashed: true }]}
      >
        {renderVectors([
          { id: 'a', x: a[0], y: a[1], color: C.v1, label: 'a' },
          { id: 'b', x: b[0], y: b[1], color: C.v2, label: 'b' },
          { id: 'sum', x: sum[0], y: sum[1], color: C.res, label: 'a + b' },
        ])}
      </Canvas2D>
    ),
    caption: `Cộng vector = nối đuôi–đầu: dời b tới ngọn của a (nét đứt). Vector tổng a + b là đường chéo hình bình hành, đi từ gốc tới điểm cuối.`,
    note,
  };
}

function scalarFig(ex: Exercise, vs: Vec[], h: number): Fig {
  const text = gatherText(ex);
  let v: number[];
  let note: string | undefined;
  if (vs.length >= 1) v = vs[0];
  else {
    v = [2, 1];
    note = TYPICAL;
  }
  // Không parse được hệ số: nếu bài nói về số ÂM/đảo hướng thì minh họa c<0.
  const c = parseScalarTimes(text, 'v') ?? (/âm|ngược|đảo/i.test(text) ? -1.5 : 2);
  const cv = [c * v[0], c * v[1]];
  const range = niceRange(maxAbs(v[0], v[1], cv[0], cv[1]));
  return {
    figure: (
      <Canvas2D height={h} range={range}>
        {renderVectors([
          { id: 'cv', x: cv[0], y: cv[1], color: C.res, label: `${r2(c)}·v`, dashed: true },
          { id: 'v', x: v[0], y: v[1], color: C.v1, label: 'v' },
        ])}
      </Canvas2D>
    ),
    caption: `Nhân vô hướng ${r2(c)}·v kéo dài/thu ngắn v theo |${r2(c)}| và GIỮ nguyên phương${
      c < 0 ? '; vì hệ số ÂM nên đảo ngược hướng (mũi tên hồng quay ngược v).' : '.'
    }`,
    note,
  };
}

function lincombFig(ex: Exercise, vs: Vec[], h: number): Fig {
  let a: number[];
  let b: number[];
  let ca: number;
  let cb: number;
  let note: string | undefined;
  const combo = parseCombo(ex.prompt);
  if (vs.length >= 2 && combo) {
    a = vs[0];
    b = vs[1];
    ca = combo.ca;
    cb = combo.cb;
  } else {
    a = [2, 1];
    b = [-1, 1];
    ca = 2;
    cb = 1;
    note = TYPICAL;
  }
  const step1 = [ca * a[0], ca * a[1]];
  const res = [step1[0] + cb * b[0], step1[1] + cb * b[1]];
  const range = niceRange(
    maxAbs(a[0], a[1], b[0], b[1], step1[0], step1[1], res[0], res[1]),
  );
  return {
    figure: (
      <Canvas2D
        height={h}
        range={range}
        segments={[
          { from: [0, 0], to: [step1[0], step1[1]], color: C.v1 },
          { from: [step1[0], step1[1]], to: [res[0], res[1]], color: C.v2 },
        ]}
      >
        {renderVectors([
          { id: 'a', x: a[0], y: a[1], color: C.v1, label: 'a', dashed: true },
          { id: 'b', x: b[0], y: b[1], color: C.v2, label: 'b', dashed: true },
          { id: 'res', x: res[0], y: res[1], color: C.res, label: `${r2(ca)}a + ${r2(cb)}b` },
        ])}
      </Canvas2D>
    ),
    caption: `Tổ hợp tuyến tính ${r2(ca)}·a + ${r2(
      cb,
    )}·b: đi ${r2(ca)} lần theo a rồi ${r2(cb)} lần theo b; điểm đến (hồng) là kết quả.`,
    note,
  };
}

// ---------------------------------------------------------------------------
// 3) DOT PRODUCT — 2 vector + hình chiếu + góc
// ---------------------------------------------------------------------------

function AngleArc({ from, to, radius }: { from: number; to: number; radius: number }) {
  const { toScreen } = useCanvas2D();
  let delta = to - from;
  while (delta > Math.PI) delta -= 2 * Math.PI;
  while (delta < -Math.PI) delta += 2 * Math.PI;
  const N = 24;
  const pts: string[] = [];
  for (let i = 0; i <= N; i++) {
    const ang = from + delta * (i / N);
    const [x, y] = toScreen(radius * Math.cos(ang), radius * Math.sin(ang));
    pts.push(`${x},${y}`);
  }
  return <polyline points={pts.join(' ')} fill="none" stroke={C.dim} strokeWidth={1.5} />;
}

function dotFig(ex: Exercise, h: number): Fig {
  const vs = only2D(parseVectors(gatherText(ex)));
  let u: number[];
  let v: number[];
  let note: string | undefined;
  if (vs.length >= 2) {
    u = vs[0];
    v = vs[1];
  } else {
    u = [4, 1];
    v = [1, 3];
    note = TYPICAL;
  }
  const uu = dot2(u, u);
  const uv = dot2(u, v);
  const t = uu > 1e-9 ? uv / uu : 0;
  const p = [t * u[0], t * u[1]]; // hình chiếu của v lên u
  const range = niceRange(maxAbs(u[0], u[1], v[0], v[1], p[0], p[1]));
  const sign =
    uv > 1e-9 ? 'nhọn (u·v > 0)' : uv < -1e-9 ? 'tù (u·v < 0)' : 'vuông (u·v = 0)';

  return {
    figure: (
      <Canvas2D
        height={h}
        range={range}
        segments={[
          { from: [0, 0], to: [p[0], p[1]], color: C.v3 },
          { from: [v[0], v[1]], to: [p[0], p[1]], color: C.muted, dashed: true },
        ]}
        points={[{ x: p[0], y: p[1], color: C.v3 }]}
      >
        <AngleArc from={Math.atan2(u[1], u[0])} to={Math.atan2(v[1], v[0])} radius={0.7} />
        {renderVectors([
          { id: 'u', x: u[0], y: u[1], color: C.v1, label: 'u' },
          { id: 'v', x: v[0], y: v[1], color: C.v2, label: 'v' },
        ])}
        <CoordLabel x={p[0]} y={p[1]} color={C.v3} />
      </Canvas2D>
    ),
    caption: `u·v = ‖u‖‖v‖cos θ. Đoạn xanh lá là hình chiếu của v lên u; θ là góc ${sign} giữa hai vector.`,
    note,
  };
}

// ---------------------------------------------------------------------------
// 4) PROJECTION (ch8) — b, đường/không gian con, hình chiếu p, b−p vuông góc
// ---------------------------------------------------------------------------

function RightAngleMark({ at, d1, d2, size }: { at: number[]; d1: number[]; d2: number[]; size: number }) {
  const { toScreen } = useCanvas2D();
  const n1 = norm2(d1);
  const n2 = norm2(d2);
  const pA: [number, number] = [at[0] + n1[0] * size, at[1] + n1[1] * size];
  const pC: [number, number] = [at[0] + n2[0] * size, at[1] + n2[1] * size];
  const pB: [number, number] = [pA[0] + n2[0] * size, pA[1] + n2[1] * size];
  const s = (pt: number[]) => {
    const [x, y] = toScreen(pt[0], pt[1]);
    return `${x},${y}`;
  };
  return (
    <polyline points={`${s(pA)} ${s(pB)} ${s(pC)}`} fill="none" stroke={C.dim} strokeWidth={1.5} />
  );
}

function norm2(d: number[]): number[] {
  const L = Math.hypot(d[0], d[1]);
  return L < 1e-12 ? [0, 0] : [d[0] / L, d[1] / L];
}

function projectionFig(ex: Exercise, h: number): Fig {
  const vs = only2D(parseVectors(gatherText(ex)));
  let b: number[];
  let a: number[];
  let note: string | undefined;
  if (vs.length >= 2) {
    b = vs[0];
    a = vs[1];
  } else if (vs.length === 1) {
    a = vs[0];
    b = [1, 3];
    note = TYPICAL;
  } else {
    a = [1, 1];
    b = [4, 1];
    note = TYPICAL;
  }
  const aa = dot2(a, a);
  const t = aa > 1e-9 ? dot2(a, b) / aa : 0;
  const p = [t * a[0], t * a[1]];
  const range = niceRange(maxAbs(a[0], a[1], b[0], b[1], p[0], p[1]));

  return {
    figure: (
      <Canvas2D
        height={h}
        range={range}
        lines={[{ ...lineThroughOrigin(a), color: C.muted, label: 'đường (span a)' }]}
        segments={[{ from: [b[0], b[1]], to: [p[0], p[1]], color: C.v2, dashed: true, label: 'b − p' }]}
      >
        <RightAngleMark at={p} d1={[-a[0], -a[1]]} d2={[b[0] - p[0], b[1] - p[1]]} size={range * 0.06} />
        {renderVectors([
          { id: 'b', x: b[0], y: b[1], color: C.v1, label: 'b' },
          { id: 'p', x: p[0], y: p[1], color: C.v3, label: 'p = chiếu' },
        ])}
      </Canvas2D>
    ),
    caption: `Hình chiếu p = (${r2(p[0])}, ${r2(
      p[1],
    )}) của b lên đường thẳng là điểm TRÊN đường GẦN b nhất; phần dư b − p (nét đứt) vuông góc với đường.`,
    note,
  };
}

// ---------------------------------------------------------------------------
// 5+6) DETERMINANT & MATRIX TRANSFORMATION — dùng prop `matrix`
// ---------------------------------------------------------------------------

function StaticUnitSquare() {
  const { toScreen } = useCanvas2D();
  const pts = [
    [0, 0],
    [1, 0],
    [1, 1],
    [0, 1],
    [0, 0],
  ]
    .map(([x, y]) => {
      const [sx, sy] = toScreen(x, y);
      return `${sx},${sy}`;
    })
    .join(' ');
  return (
    <polyline
      points={pts}
      fill="none"
      stroke={C.muted}
      strokeWidth={1.5}
      strokeDasharray="4 4"
      opacity={0.7}
    />
  );
}

function matrixFig(parsed: Mat2 | null, focus: 'det' | 'transform', h: number): Fig {
  const note = parsed ? undefined : TYPICAL;
  const M: Mat2 = parsed ?? (focus === 'transform' ? [[0, -1], [1, 0]] : [[2, 1], [1, 2]]);
  const a = M[0][0];
  const b = M[0][1];
  const c = M[1][0];
  const d = M[1][1];
  const det = det2(M);
  const range = niceRange(maxAbs(a, b, c, d, 1));
  const flip = det < 0;

  const figure = (
    <Canvas2D
      height={h}
      range={range}
      matrix={M}
      polygons={[
        {
          points: [
            [0, 0],
            [1, 0],
            [1, 1],
            [0, 1],
          ],
          fill: flip ? C.v2 : C.v1,
          opacity: 0.28,
          stroke: flip ? C.v2 : C.v1,
        },
      ]}
      vectors={[
        { id: 'i', x: 1, y: 0, color: C.v1, label: 'î → cột 1' },
        { id: 'j', x: 0, y: 1, color: C.v2, label: 'ĵ → cột 2' },
      ]}
    >
      <StaticUnitSquare />
    </Canvas2D>
  );

  if (focus === 'transform') {
    return {
      figure,
      caption: `Ma trận là một PHÉP BIẾN ĐỔI: nó chuyển lưới sao cho cột 1 = nơi î=(1,0) hạ cánh = (${r2(
        a,
      )}, ${r2(c)}), cột 2 = nơi ĵ=(0,1) hạ cánh = (${r2(b)}, ${r2(d)}).`,
      note,
    };
  }
  const tail =
    det < 0
      ? ' det < 0: biến đổi LẬT hướng (đảo chiều), nên hình bình hành được tô màu khác.'
      : det === 0
        ? ' det = 0: ô vuông bị bóp về một đoạn thẳng (diện tích 0) — ma trận suy biến.'
        : '';
  return {
    figure,
    caption: `det = ad − bc. Ô vuông đơn vị (diện tích 1) biến thành hình bình hành có diện tích |det| (dấu của det cho biết hướng có bị lật hay không).${tail}`,
    note,
  };
}

// ---------------------------------------------------------------------------
// 7) EIGENVALUE / EIGENVECTOR — v và Av cùng đường (hoặc lệch hướng)
// ---------------------------------------------------------------------------

function eigenFig(ex: Exercise, h: number): Fig {
  const parsed = parseMatrix2(gatherText(ex));
  const note = parsed ? undefined : TYPICAL;
  const M: Mat2 = parsed ?? [[2, 1], [1, 2]];
  const e = eig2(M);

  if (e.real && e.values.length >= 1) {
    // Chọn giá trị riêng có |λ| lớn nhất để thấy rõ nhất phép co giãn.
    let idx = 0;
    for (let i = 1; i < e.values.length; i++) {
      if (Math.abs(e.values[i]) > Math.abs(e.values[idx])) idx = i;
    }
    const lam = e.values[idx];
    const v = e.vectors[idx];
    const L = 1.8;
    const vD = [v[0] * L, v[1] * L];
    const Av = matVec(M, vD); // = λ·vD (cùng phương)
    const range = niceRange(maxAbs(vD[0], vD[1], Av[0], Av[1]));
    return {
      figure: (
        <Canvas2D
          height={h}
          range={range}
          lines={[{ ...lineThroughOrigin(v), color: C.muted, label: 'đường của v' }]}
        >
          {renderVectors([
            { id: 'Av', x: Av[0], y: Av[1], color: C.res, label: 'Av = λv', dashed: true },
            { id: 'v', x: vD[0], y: vD[1], color: C.v1, label: 'v' },
          ])}
        </Canvas2D>
      ),
      caption: `v là VECTOR RIÊNG: phép biến đổi A chỉ kéo giãn v theo hệ số λ = ${r2(
        lam,
      )} mà KHÔNG đổi phương — Av nằm ĐÚNG trên đường thẳng của v${
        lam < 0 ? ' (λ < 0 nên Av ngược hướng v, vẫn cùng đường).' : '.'
      }`,
      note,
    };
  }

  // Không có giá trị riêng thực (vd phép xoay): mọi hướng đều bị đổi phương.
  const w = [1.6, 0.5];
  const Aw = matVec(M, w);
  const range = niceRange(maxAbs(w[0], w[1], Aw[0], Aw[1]));
  return {
    figure: (
      <Canvas2D
        height={h}
        range={range}
        lines={[{ ...lineThroughOrigin(w), color: C.muted, label: 'đường của v' }]}
      >
        {renderVectors([
          { id: 'Av', x: Aw[0], y: Aw[1], color: C.res, label: 'Av', dashed: true },
          { id: 'v', x: w[0], y: w[1], color: C.v1, label: 'v' },
        ])}
      </Canvas2D>
    ),
    caption:
      'Ma trận này KHÔNG có vector riêng thực (điển hình là phép xoay): Av LỆCH khỏi đường thẳng của v — không hướng nào được giữ nguyên phương.',
    note,
  };
}

// ---------------------------------------------------------------------------
// 8) LINEAR SYSTEM / SOLUTION TYPES — 2 đường thẳng (row picture) + giao điểm
// ---------------------------------------------------------------------------

function systemFig(ex: Exercise, h: number): Fig {
  const eqs = parseEquations(ex.prompt);
  let l1: Line;
  let l2: Line;
  let note: string | undefined;
  if (eqs.length >= 2) {
    l1 = eqs[0];
    l2 = eqs[1];
  } else {
    l1 = { a: 1, b: 1, c: 3 };
    l2 = { a: 1, b: -1, c: 1 };
    note = TYPICAL;
  }
  const pt = intersect(l1, l2);
  const range = niceRange(pt ? maxAbs(pt[0], pt[1], 3) : 5);
  const solTypes = ex.skillId === 'solution_types';

  return {
    figure: (
      <Canvas2D
        height={h}
        range={range}
        lines={[
          { ...l1, color: C.v1, label: 'PT 1' },
          { ...l2, color: C.v2, label: 'PT 2' },
        ]}
        points={pt ? [{ x: pt[0], y: pt[1], color: C.res, label: `(${r2(pt[0])}, ${r2(pt[1])})` }] : []}
      />
    ),
    caption: pt
      ? `Mỗi phương trình là một đường thẳng; NGHIỆM của hệ là GIAO ĐIỂM của chúng ≈ (${r2(
          pt[0],
        )}, ${r2(pt[1])}).`
      : 'Mỗi phương trình là một đường thẳng; ở đây hai đường SONG SONG nên hệ VÔ NGHIỆM.',
    note: solTypes
      ? 'Hai đường cắt nhau → 1 nghiệm; song song → vô nghiệm; trùng nhau → vô số nghiệm.' +
        (note ? ' ' + note : '')
      : note,
  };
}

/** Nhãn tọa độ "(x, y)" cho một điểm world (vd chấm chiếu xanh lá ở dot product). */
function CoordLabel({ x, y, color, dx = 6, dy = 14 }: { x: number; y: number; color: string; dx?: number; dy?: number }) {
  const { toScreen } = useCanvas2D();
  const [ox, oy] = toScreen(0, 0);
  const [sx, sy] = toScreen(x, y);
  const width = ox * 2;
  const height = oy * 2;
  return (
    <text
      x={clamp(sx + dx, 6, width - 6)}
      y={clamp(sy + dy, 12, height - 6)}
      fill={color}
      fillOpacity={0.85}
      fontSize={10}
      textAnchor="start"
      style={{ fontVariantNumeric: 'tabular-nums' }}
    >
      {`(${fmtNum(x)}, ${fmtNum(y)})`}
    </text>
  );
}

// ---------------------------------------------------------------------------
// Helper vẽ vector qua children (không bị prop `matrix` biến đổi).
// Dùng useCanvas2D để vẽ mũi tên trong hệ tọa độ world.
// ---------------------------------------------------------------------------

interface ArrowSpec {
  id: string;
  x: number;
  y: number;
  color?: string;
  label?: string;
  dashed?: boolean;
}

function renderVectors(arrows: ArrowSpec[]): ReactNode {
  return <ArrowsLayer arrows={arrows} />;
}

function ArrowsLayer({ arrows }: { arrows: ArrowSpec[] }) {
  const { toScreen } = useCanvas2D();
  const [ox, oy] = toScreen(0, 0);
  const width = ox * 2;
  const height = oy * 2;
  return (
    <g>
      <defs>
        <marker
          id="tt-arrow"
          markerWidth="10"
          markerHeight="10"
          refX="7"
          refY="3"
          orient="auto"
          markerUnits="strokeWidth"
        >
          <path d="M0,0 L7,3 L0,6 Z" fill="context-stroke" />
        </marker>
      </defs>
      {arrows.map((v) => {
        const [ex, ey] = toScreen(v.x, v.y);
        const color = v.color ?? C.v1;
        // Đặt nhãn lệch RA NGOÀI đầu mũi tên theo hướng vector: tên ở trong,
        // tọa độ ở lớp ngoài hơn (không đè lên tên, không quặt lại thân vector).
        const dlen = Math.hypot(ex - ox, ey - oy) || 1;
        const ux = (ex - ox) / dlen;
        const uy = (ey - oy) / dlen;
        const anchor = ux >= 0 ? 'start' : 'end';
        const nameX = clamp(ex + (ux >= 0 ? 8 : -8), 6, width - 6);
        const nameY = clamp(ey + (uy >= 0 ? 15 : -7), 12, height - 6);
        const coordY = clamp(uy >= 0 ? nameY + 12 : nameY - 12, 12, height - 6);
        return (
          <g key={v.id}>
            <line
              x1={ox}
              y1={oy}
              x2={ex}
              y2={ey}
              stroke={color}
              strokeWidth={3}
              strokeDasharray={v.dashed ? '6 5' : undefined}
              markerEnd="url(#tt-arrow)"
            />
            {v.label && (
              <text x={nameX} y={nameY} fill={color} fontSize={13} fontWeight={600} textAnchor={anchor}>
                {v.label}
              </text>
            )}
            <text
              x={nameX}
              y={coordY}
              fill={color}
              fillOpacity={0.85}
              fontSize={10}
              textAnchor={anchor}
              style={{ fontVariantNumeric: 'tabular-nums' }}
            >
              {`(${fmtNum(v.x)}, ${fmtNum(v.y)})`}
            </text>
          </g>
        );
      })}
    </g>
  );
}
