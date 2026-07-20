import {
  createContext,
  useContext,
  useEffect,
  useLayoutEffect,
  useRef,
  useState,
  type ReactNode,
  type PointerEvent as ReactPointerEvent,
} from 'react';
import { lerpMat, type Mat } from '../lib/linalg';

export type V2 = {
  id: string;
  x: number;
  y: number;
  color?: string;
  label?: string;
  draggable?: boolean;
  dashed?: boolean;
};

export interface Canvas2DProps {
  height?: number;
  range?: number;
  matrix?: [[number, number], [number, number]];
  showGrid?: boolean;
  showAxes?: boolean;
  vectors?: V2[];
  onVectorChange?: (id: string, x: number, y: number) => void;
  points?: { x: number; y: number; color?: string; label?: string }[];
  segments?: {
    from: [number, number];
    to: [number, number];
    color?: string;
    dashed?: boolean;
    label?: string;
  }[];
  lines?: { a: number; b: number; c: number; color?: string; label?: string }[];
  polygons?: {
    points: [number, number][];
    fill?: string;
    opacity?: number;
    stroke?: string;
  }[];
  transformElements?: boolean;
  children?: ReactNode;
}

interface Canvas2DContextValue {
  toScreen: (x: number, y: number) => [number, number];
  toWorld: (px: number, py: number) => [number, number];
  range: number;
}

const Canvas2DContext = createContext<Canvas2DContextValue | null>(null);

export function useCanvas2D(): Canvas2DContextValue {
  const ctx = useContext(Canvas2DContext);
  if (!ctx) throw new Error('useCanvas2D must be used inside <Canvas2D>');
  return ctx;
}

const IDENTITY2: Mat = [
  [1, 0],
  [0, 1],
];

function applyMat(m: Mat, x: number, y: number): [number, number] {
  return [m[0][0] * x + m[0][1] * y, m[1][0] * x + m[1][1] * y];
}

// easing
function easeInOut(t: number): number {
  return t < 0.5 ? 2 * t * t : 1 - Math.pow(-2 * t + 2, 2) / 2;
}

export default function Canvas2D({
  height = 420,
  range = 5,
  matrix,
  showGrid = true,
  showAxes = true,
  vectors = [],
  onVectorChange,
  points = [],
  segments = [],
  lines = [],
  polygons = [],
  transformElements = true,
  children,
}: Canvas2DProps) {
  const wrapRef = useRef<HTMLDivElement>(null);
  const [width, setWidth] = useState(600);

  // ---- Đo bề rộng container ----
  useLayoutEffect(() => {
    const el = wrapRef.current;
    if (!el) return;
    const ro = new ResizeObserver((entries) => {
      const w = entries[0].contentRect.width;
      if (w > 0) setWidth(w);
    });
    ro.observe(el);
    setWidth(el.clientWidth || 600);
    return () => ro.disconnect();
  }, []);

  // ---- Animation ma trận ----
  const target: Mat = matrix ? [matrix[0].slice(), matrix[1].slice()] : IDENTITY2;
  const [animMat, setAnimMat] = useState<Mat>(target);
  const fromRef = useRef<Mat>(target);
  const rafRef = useRef<number | null>(null);

  useEffect(() => {
    const to = matrix ? [matrix[0].slice(), matrix[1].slice()] : IDENTITY2;
    const from = fromRef.current;
    // Nếu không đổi, bỏ qua
    const same =
      from[0][0] === to[0][0] &&
      from[0][1] === to[0][1] &&
      from[1][0] === to[1][0] &&
      from[1][1] === to[1][1];
    if (same) return;

    const duration = 600;
    const start = performance.now();
    if (rafRef.current) cancelAnimationFrame(rafRef.current);

    const tick = (now: number) => {
      const t = Math.min(1, (now - start) / duration);
      const e = easeInOut(t);
      const cur = lerpMat(from, to, e);
      setAnimMat(cur);
      if (t < 1) {
        rafRef.current = requestAnimationFrame(tick);
      } else {
        fromRef.current = to;
        setAnimMat(to);
      }
    };
    rafRef.current = requestAnimationFrame(tick);
    return () => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [matrix ? JSON.stringify(matrix) : 'id']);

  // ---- Chuyển đổi tọa độ ----
  const cx = width / 2;
  const cy = height / 2;
  const scale = Math.min(width, height) / (2 * range);

  const toScreen = (x: number, y: number): [number, number] => [
    cx + x * scale,
    cy - y * scale,
  ];
  const toWorld = (px: number, py: number): [number, number] => [
    (px - cx) / scale,
    (cy - py) / scale,
  ];

  // ---- Kéo vector ----
  const draggingRef = useRef<string | null>(null);

  const getSvgPoint = (e: ReactPointerEvent | PointerEvent): [number, number] => {
    const svg = wrapRef.current?.querySelector('svg');
    if (!svg) return [0, 0];
    const rect = svg.getBoundingClientRect();
    const px = ((e.clientX - rect.left) / rect.width) * width;
    const py = ((e.clientY - rect.top) / rect.height) * height;
    return [px, py];
  };

  const onPointerDownVec = (e: ReactPointerEvent, id: string) => {
    draggingRef.current = id;
    (e.target as Element).setPointerCapture?.(e.pointerId);
    e.stopPropagation();
  };
  const onPointerMove = (e: ReactPointerEvent) => {
    if (!draggingRef.current) return;
    const [px, py] = getSvgPoint(e);
    let [wx, wy] = toWorld(px, py);
    // snap 0.25
    wx = Math.round(wx / 0.25) * 0.25;
    wy = Math.round(wy / 0.25) * 0.25;
    onVectorChange?.(draggingRef.current, wx, wy);
  };
  const onPointerUp = (e: ReactPointerEvent) => {
    if (draggingRef.current) {
      (e.target as Element).releasePointerCapture?.(e.pointerId);
    }
    draggingRef.current = null;
  };

  // ---- Vẽ lưới ----
  const gridLines: ReactNode[] = [];
  const step = 1;
  const nLines = Math.ceil(range) + 1;

  // Lưới gốc mờ (không biến đổi)
  if (showGrid) {
    for (let i = -nLines; i <= nLines; i++) {
      const [x1, y1] = toScreen(i, -range - 1);
      const [x2, y2] = toScreen(i, range + 1);
      gridLines.push(
        <line
          key={`bgv${i}`}
          x1={x1}
          y1={y1}
          x2={x2}
          y2={y2}
          stroke="var(--border-soft)"
          strokeWidth={1}
          opacity={0.35}
        />
      );
      const [hx1, hy1] = toScreen(-range - 1, i);
      const [hx2, hy2] = toScreen(range + 1, i);
      gridLines.push(
        <line
          key={`bgh${i}`}
          x1={hx1}
          y1={hy1}
          x2={hx2}
          y2={hy2}
          stroke="var(--border-soft)"
          strokeWidth={1}
          opacity={0.35}
        />
      );
    }
  }

  // Lưới biến đổi (theo animMat)
  const tgrid: ReactNode[] = [];
  if (showGrid) {
    const bound = nLines;
    for (let i = -bound; i <= bound; i += step) {
      // đường dọc x=i (biến đổi)
      const pa = applyMat(animMat, i, -bound);
      const pb = applyMat(animMat, i, bound);
      const [x1, y1] = toScreen(pa[0], pa[1]);
      const [x2, y2] = toScreen(pb[0], pb[1]);
      const isAxis = i === 0;
      tgrid.push(
        <line
          key={`tv${i}`}
          x1={x1}
          y1={y1}
          x2={x2}
          y2={y2}
          stroke={isAxis ? 'var(--vec-3)' : 'var(--accent-2)'}
          strokeWidth={isAxis ? 1.6 : 1}
          opacity={isAxis ? 0.55 : 0.28}
        />
      );
      const pc = applyMat(animMat, -bound, i);
      const pd = applyMat(animMat, bound, i);
      const [x3, y3] = toScreen(pc[0], pc[1]);
      const [x4, y4] = toScreen(pd[0], pd[1]);
      tgrid.push(
        <line
          key={`th${i}`}
          x1={x3}
          y1={y3}
          x2={x4}
          y2={y4}
          stroke={isAxis ? 'var(--vec-2)' : 'var(--accent-2)'}
          strokeWidth={isAxis ? 1.6 : 1}
          opacity={isAxis ? 0.55 : 0.28}
        />
      );
    }
  }

  // ---- Trục ----
  const axes: ReactNode[] = [];
  if (showAxes) {
    const [ax1, ay1] = toScreen(-range - 1, 0);
    const [ax2, ay2] = toScreen(range + 1, 0);
    const [ay3, ay4] = toScreen(0, -range - 1);
    const [ay5, ay6] = toScreen(0, range + 1);
    axes.push(
      <line key="ax" x1={ax1} y1={ay1} x2={ax2} y2={ay2} stroke="var(--text-dim)" strokeWidth={1.5} />,
      <line key="ay" x1={ay3} y1={ay4} x2={ay5} y2={ay6} stroke="var(--text-dim)" strokeWidth={1.5} />
    );
  }

  // helper để biến đổi phần tử nếu transformElements
  const tf = (x: number, y: number): [number, number] =>
    transformElements ? applyMat(animMat, x, y) : [x, y];

  const arrowId = useRef(`arrow-${Math.random().toString(36).slice(2, 8)}`).current;

  // ---- Vẽ đường ax+by=c trong khung nhìn ----
  const renderLine = (
    ln: { a: number; b: number; c: number; color?: string; label?: string },
    key: number
  ): ReactNode => {
    const { a, b, c } = ln;
    const R = range + 1;
    const pts: [number, number][] = [];
    if (Math.abs(b) > 1e-9) {
      pts.push([-R, (c - a * -R) / b]);
      pts.push([R, (c - a * R) / b]);
    } else if (Math.abs(a) > 1e-9) {
      pts.push([c / a, -R]);
      pts.push([c / a, R]);
    } else {
      return null;
    }
    const [x1, y1] = toScreen(pts[0][0], pts[0][1]);
    const [x2, y2] = toScreen(pts[1][0], pts[1][1]);
    return (
      <line
        key={`line${key}`}
        x1={x1}
        y1={y1}
        x2={x2}
        y2={y2}
        stroke={ln.color ?? 'var(--vec-result)'}
        strokeWidth={2}
      />
    );
  };

  const ctxValue: Canvas2DContextValue = { toScreen, toWorld, range };

  return (
    <div className="canvas2d-wrap" ref={wrapRef} style={{ height }}>
      <svg
        width={width}
        height={height}
        viewBox={`0 0 ${width} ${height}`}
        onPointerMove={onPointerMove}
        onPointerUp={onPointerUp}
        onPointerLeave={onPointerUp}
      >
        <defs>
          <marker
            id={arrowId}
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

        {gridLines}
        {tgrid}
        {axes}

        {/* polygons */}
        {polygons.map((poly, i) => {
          const pts = poly.points
            .map((p) => {
              const [tx, ty] = tf(p[0], p[1]);
              const [sx, sy] = toScreen(tx, ty);
              return `${sx},${sy}`;
            })
            .join(' ');
          return (
            <polygon
              key={`poly${i}`}
              points={pts}
              fill={poly.fill ?? 'var(--accent-2)'}
              opacity={poly.opacity ?? 0.25}
              stroke={poly.stroke ?? poly.fill ?? 'var(--accent)'}
              strokeWidth={1.5}
            />
          );
        })}

        {/* lines */}
        {lines.map(renderLine)}

        {/* segments */}
        {segments.map((seg, i) => {
          const [fx, fy] = tf(seg.from[0], seg.from[1]);
          const [tx, ty] = tf(seg.to[0], seg.to[1]);
          const [x1, y1] = toScreen(fx, fy);
          const [x2, y2] = toScreen(tx, ty);
          return (
            <g key={`seg${i}`}>
              <line
                x1={x1}
                y1={y1}
                x2={x2}
                y2={y2}
                stroke={seg.color ?? 'var(--text-muted)'}
                strokeWidth={2}
                strokeDasharray={seg.dashed ? '5 5' : undefined}
              />
              {seg.label && (
                <text x={(x1 + x2) / 2 + 6} y={(y1 + y2) / 2 - 6} fill={seg.color ?? 'var(--text-muted)'} fontSize={12}>
                  {seg.label}
                </text>
              )}
            </g>
          );
        })}

        {/* points */}
        {points.map((pt, i) => {
          const [tx, ty] = tf(pt.x, pt.y);
          const [sx, sy] = toScreen(tx, ty);
          return (
            <g key={`pt${i}`}>
              <circle cx={sx} cy={sy} r={4.5} fill={pt.color ?? 'var(--vec-result)'} />
              {pt.label && (
                <text x={sx + 8} y={sy - 8} fill={pt.color ?? 'var(--text)'} fontSize={12}>
                  {pt.label}
                </text>
              )}
            </g>
          );
        })}

        {/* children in world coords */}
        <Canvas2DContext.Provider value={ctxValue}>{children}</Canvas2DContext.Provider>

        {/* vectors */}
        {vectors.map((v) => {
          const [tx, ty] = tf(v.x, v.y);
          const [ox, oy] = toScreen(0, 0);
          const [ex, ey] = toScreen(tx, ty);
          const color = v.color ?? 'var(--vec-1)';
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
                markerEnd={`url(#${arrowId})`}
              />
              {v.label && (
                <text x={ex + 8} y={ey - 8} fill={color} fontSize={13} fontWeight={600}>
                  {v.label}
                </text>
              )}
              {v.draggable && (
                <circle
                  cx={ex}
                  cy={ey}
                  r={10}
                  fill={color}
                  fillOpacity={0.001}
                  stroke={color}
                  strokeOpacity={0.5}
                  strokeWidth={1.5}
                  style={{ cursor: 'grab' }}
                  onPointerDown={(e) => onPointerDownVec(e, v.id)}
                />
              )}
            </g>
          );
        })}
      </svg>
    </div>
  );
}
