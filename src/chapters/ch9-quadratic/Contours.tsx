// Vẽ đường mức (level sets) của dạng toàn phương và các trục chính (principal axes)
// bằng SVG trong hệ toạ độ world, thông qua context useCanvas2D.
import { type ReactNode } from 'react';
import { useCanvas2D } from '../../components/Canvas2D';
import { levelSetPolylines, type M2 } from './util';
import type { Mat } from '../../lib/linalg';

export interface ContourLevel {
  L: number;
  color?: string;
  width?: number;
  opacity?: number;
  dashed?: boolean;
}

/**
 * Vẽ nhiều đường mức q(x)=L cho ma trận A.
 * Dương/âm để màu khác nhau giúp phân biệt ellipse (chỉ 1 dấu) với hyperbola (cả 2 dấu).
 */
export function Contours({
  A,
  levels,
}: {
  A: Mat | M2;
  levels: ContourLevel[];
}) {
  const { toScreen, range } = useCanvas2D();
  const out: ReactNode[] = [];
  levels.forEach((lv, li) => {
    const polys = levelSetPolylines(A as Mat, lv.L, range);
    polys.forEach((poly, pi) => {
      const pts = poly.map(([x, y]) => toScreen(x, y).join(',')).join(' ');
      out.push(
        <polyline
          key={`c${li}-${pi}`}
          points={pts}
          fill="none"
          stroke={lv.color ?? 'var(--vec-1)'}
          strokeWidth={lv.width ?? 2}
          strokeOpacity={lv.opacity ?? 1}
          strokeDasharray={lv.dashed ? '5 5' : undefined}
        />
      );
    });
  });
  return <g>{out}</g>;
}

/** Vẽ một đường thẳng qua gốc theo hướng d=(dx,dy), kéo dài hết khung nhìn. */
export function AxisLine({
  d,
  color = 'var(--warn)',
  width = 2,
  dashed = false,
  label,
}: {
  d: [number, number];
  color?: string;
  width?: number;
  dashed?: boolean;
  label?: string;
}) {
  const { toScreen, range } = useCanvas2D();
  const len = Math.hypot(d[0], d[1]) || 1;
  const ux = d[0] / len;
  const uy = d[1] / len;
  const R = range + 1;
  const [x1, y1] = toScreen(-ux * R, -uy * R);
  const [x2, y2] = toScreen(ux * R, uy * R);
  const [lx, ly] = toScreen(ux * (range - 0.6), uy * (range - 0.6));
  return (
    <g>
      <line
        x1={x1}
        y1={y1}
        x2={x2}
        y2={y2}
        stroke={color}
        strokeWidth={width}
        strokeDasharray={dashed ? '6 5' : undefined}
        opacity={0.9}
      />
      {label && (
        <text x={lx + 6} y={ly - 6} fill={color} fontSize={12} fontWeight={600}>
          {label}
        </text>
      )}
    </g>
  );
}
