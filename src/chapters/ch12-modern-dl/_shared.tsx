// Helpers dùng chung cho Chương 12 — Học sâu hiện đại.
// Gồm: định dạng số, chip số liệu, hộp gợi ý, hộp "Nối với LA", và một lưới ma
// trận vẽ bằng SVG (dùng cho ảnh CNN, feature map, và heatmap attention).

import type { ReactNode } from 'react';

// --- Số học hiển thị -------------------------------------------------------

export function r2(n: number): number {
  const v = Math.round(n * 100) / 100;
  return v === 0 ? 0 : v; // khử -0
}
export function f2(n: number): string {
  return r2(n).toFixed(2);
}
export function f1(n: number): string {
  const v = Math.round(n * 10) / 10;
  return (v === 0 ? 0 : v).toFixed(1);
}
function clamp01(x: number): number {
  return Math.max(0, Math.min(1, x));
}

// --- Chip số liệu + bố cục -------------------------------------------------

export function Stat({
  label,
  value,
  color,
}: {
  label: ReactNode;
  value: ReactNode;
  color?: string;
}) {
  return (
    <div
      style={{
        background: 'var(--bg-elevated)',
        border: '1px solid var(--border)',
        borderRadius: 'var(--radius-sm)',
        padding: '8px 12px',
        display: 'flex',
        flexDirection: 'column',
        gap: 2,
        minWidth: 90,
      }}
    >
      <span style={{ fontSize: 11, color: 'var(--text-dim)' }}>{label}</span>
      <span
        className="mono"
        style={{ fontSize: 15, fontWeight: 600, color: color ?? 'var(--text)' }}
      >
        {value}
      </span>
    </div>
  );
}

export function StatRow({ children }: { children: ReactNode }) {
  return (
    <div
      className="row"
      style={{
        gap: 10,
        marginTop: 12,
        marginBottom: 4,
        display: 'flex',
        flexWrap: 'wrap',
        alignItems: 'stretch',
      }}
    >
      {children}
    </div>
  );
}

export function Hint({ children }: { children: ReactNode }) {
  return (
    <p
      className="dim"
      style={{ fontSize: 13, marginTop: 10, display: 'flex', gap: 6 }}
    >
      <span aria-hidden>💡</span>
      <span>{children}</span>
    </p>
  );
}

export function TwoCol({ children }: { children: ReactNode }) {
  return (
    <div
      style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))',
        gap: 16,
        alignItems: 'start',
      }}
    >
      {children}
    </div>
  );
}

// Hộp "Nối với LA" — bắc cầu tường minh từ Deep Learning về Đại số tuyến tính.
export function Bridge({ children }: { children: ReactNode }) {
  return (
    <div
      style={{
        background: 'var(--panel-2)',
        border: '1px solid var(--border)',
        borderLeft: '3px solid var(--accent)',
        borderRadius: 'var(--radius-sm)',
        padding: '12px 14px',
        margin: '14px 0',
      }}
    >
      <div
        style={{
          fontSize: 12,
          fontWeight: 700,
          color: 'var(--accent-strong)',
          marginBottom: 6,
          letterSpacing: 0.3,
        }}
      >
        🔗 NỐI VỚI ĐẠI SỐ TUYẾN TÍNH
      </div>
      <div style={{ fontSize: 14, lineHeight: 1.65 }}>{children}</div>
    </div>
  );
}

// Nhãn nhỏ phía trên một hình.
export function Caption({ children }: { children: ReactNode }) {
  return (
    <div
      style={{
        fontSize: 12,
        color: 'var(--text-muted)',
        fontWeight: 600,
        margin: '2px 0 6px',
      }}
    >
      {children}
    </div>
  );
}

// --- Bảng màu cho ô lưới ---------------------------------------------------

export interface CellStyle {
  bg: string;
  fg: string;
}

// Thang tuần tự (0..max) — mặc định xanh dương (accent-2).
export function seqCell(
  v: number,
  max: number,
  rgb: [number, number, number] = [79, 124, 255]
): CellStyle {
  const a = max <= 0 ? 0 : clamp01(v / max);
  return {
    bg: `rgba(${rgb[0]},${rgb[1]},${rgb[2]},${0.08 + 0.84 * a})`,
    fg: a > 0.5 ? '#fff' : 'var(--text)',
  };
}

// Thang phân kỳ (âm↔dương): dương xanh dương, âm đỏ, 0 nhạt.
export function divCell(v: number, maxAbs: number): CellStyle {
  const a = maxAbs <= 0 ? 0 : clamp01(Math.abs(v) / maxAbs);
  const rgb = v >= 0 ? [79, 124, 255] : [255, 93, 108];
  return {
    bg: `rgba(${rgb[0]},${rgb[1]},${rgb[2]},${0.08 + 0.82 * a})`,
    fg: a > 0.55 ? '#fff' : 'var(--text)',
  };
}

// Thang xác suất (0..1) cho trọng số attention — tím accent.
export function probCell(w: number): CellStyle {
  const a = clamp01(w);
  return {
    bg: `rgba(155,123,255,${0.06 + 0.9 * a})`,
    fg: a > 0.5 ? '#fff' : 'var(--text)',
  };
}

// --- Lưới ma trận vẽ bằng SVG ---------------------------------------------

export interface MatrixGridProps {
  data: number[][];
  size?: number; // cạnh mỗi ô (px)
  color: (v: number, i: number, j: number) => CellStyle;
  highlight?: (i: number, j: number) => boolean; // viền nổi bật
  format?: (v: number) => string;
  rowLabels?: string[];
  colLabels?: string[];
  fontSize?: number;
}

export function MatrixGrid({
  data,
  size = 42,
  color,
  highlight,
  format = (v) => String(r2(v)),
  rowLabels,
  colLabels,
  fontSize = 13,
}: MatrixGridProps) {
  const rows = data.length;
  const cols = rows > 0 ? data[0].length : 0;
  const padL = rowLabels ? 30 : 6;
  const padT = colLabels ? 22 : 6;
  const width = padL + cols * size + 6;
  const height = padT + rows * size + 6;

  return (
    <svg
      width={width}
      height={height}
      viewBox={`0 0 ${width} ${height}`}
      style={{ maxWidth: '100%', height: 'auto', display: 'block' }}
      role="img"
    >
      {colLabels &&
        colLabels.map((lb, j) => (
          <text
            key={`cl${j}`}
            x={padL + j * size + size / 2}
            y={padT - 8}
            textAnchor="middle"
            fontSize={11}
            fill="var(--text-muted)"
          >
            {lb}
          </text>
        ))}
      {rowLabels &&
        rowLabels.map((lb, i) => (
          <text
            key={`rl${i}`}
            x={padL - 8}
            y={padT + i * size + size / 2}
            textAnchor="end"
            dominantBaseline="central"
            fontSize={11}
            fill="var(--text-muted)"
          >
            {lb}
          </text>
        ))}
      {data.map((row, i) =>
        row.map((v, j) => {
          const st = color(v, i, j);
          const hot = highlight?.(i, j) ?? false;
          return (
            <g key={`${i}-${j}`}>
              <rect
                x={padL + j * size + 1.5}
                y={padT + i * size + 1.5}
                width={size - 3}
                height={size - 3}
                rx={5}
                fill={st.bg}
                stroke={hot ? 'var(--accent-strong)' : 'var(--border)'}
                strokeWidth={hot ? 3 : 1}
              />
              <text
                x={padL + j * size + size / 2}
                y={padT + i * size + size / 2}
                textAnchor="middle"
                dominantBaseline="central"
                fontSize={fontSize}
                fontWeight={hot ? 700 : 500}
                fill={st.fg}
              >
                {format(v)}
              </text>
            </g>
          );
        })
      )}
    </svg>
  );
}
