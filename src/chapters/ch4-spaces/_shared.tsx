import type { ReactNode } from 'react';
import type { Mat, Vec } from '../../lib/linalg';

// Làm tròn 2 chữ số, khử -0 cho gọn mắt.
export function r2(n: number): number {
  const v = Math.round(n * 100) / 100;
  return v === 0 ? 0 : v;
}

// Chuỗi hiển thị một số đã làm tròn 2 chữ số.
export function f2(n: number): string {
  return r2(n).toFixed(2);
}

// Hiển thị vector 2D dạng [x, y]
export function vec2Str(x: number, y: number): string {
  return `[${f2(x)}, ${f2(y)}]`;
}

// Hiển thị vector 3D dạng [x, y, z]
export function vec3Str(v: number[]): string {
  return `[${f2(v[0])}, ${f2(v[1])}, ${f2(v[2])}]`;
}

// Cross product 2D (giá trị vô hướng) — dùng để phát hiện thẳng hàng.
export function cross2(a: [number, number], b: [number, number]): number {
  return a[0] * b[1] - a[1] * b[0];
}

// Một số cho LaTeX: bỏ đuôi .00 nếu là số nguyên.
function texNum(n: number): string {
  const v = r2(n);
  return Number.isInteger(v) ? String(v) : v.toFixed(2);
}

// Dựng chuỗi LaTeX cho một ma trận (bmatrix).
export function matTex(m: Mat): string {
  const body = m.map((row) => row.map(texNum).join(' & ')).join(' \\\\ ');
  return `\\begin{bmatrix} ${body} \\end{bmatrix}`;
}

// Dựng chuỗi LaTeX cho một vector cột.
export function colTex(v: Vec): string {
  const body = v.map((x) => texNum(x)).join(' \\\\ ');
  return `\\begin{bmatrix} ${body} \\end{bmatrix}`;
}

// Một "chip" số liệu: nhãn + giá trị, tô màu theo vai trò.
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

// Hàng chứa các chip số liệu.
export function StatRow({ children }: { children: ReactNode }) {
  return (
    <div
      className="row"
      style={{ gap: 10, marginTop: 12, marginBottom: 4, alignItems: 'stretch', flexWrap: 'wrap' }}
    >
      {children}
    </div>
  );
}

// Gợi ý tương tác ("hãy kéo/thử để thấy...").
export function Hint({ children }: { children: ReactNode }) {
  return (
    <p className="dim" style={{ fontSize: 13, marginTop: 10, display: 'flex', gap: 6 }}>
      <span aria-hidden>💡</span>
      <span>{children}</span>
    </p>
  );
}

// Hộp cảnh báo / thông tin nổi bật.
export function Callout({
  tone = 'warn',
  children,
}: {
  tone?: 'warn' | 'good' | 'info';
  children: ReactNode;
}) {
  const map = {
    warn: { bg: 'rgba(245, 158, 11, 0.12)', bd: 'var(--warn)', fg: 'var(--warn)' },
    good: { bg: 'rgba(34, 197, 94, 0.12)', bd: 'var(--good)', fg: 'var(--good)' },
    info: { bg: 'rgba(79, 156, 249, 0.12)', bd: 'var(--vec-1)', fg: 'var(--vec-1)' },
  }[tone];
  return (
    <div
      style={{
        marginTop: 10,
        padding: '10px 14px',
        borderRadius: 'var(--radius-sm)',
        background: map.bg,
        border: `1px solid ${map.bd}`,
        color: map.fg,
        fontSize: 13.5,
        lineHeight: 1.55,
      }}
    >
      {children}
    </div>
  );
}

// Lưới hai cột co giãn (tự xuống hàng khi hẹp).
export function TwoCol({ children }: { children: ReactNode }) {
  return (
    <div
      style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))',
        gap: 16,
      }}
    >
      {children}
    </div>
  );
}

// Nhãn nhỏ phía trên một canvas trong lưới hai cột.
export function PanelLabel({ children }: { children: ReactNode }) {
  return (
    <div
      style={{
        fontSize: 13,
        fontWeight: 600,
        marginBottom: 6,
        color: 'var(--text-muted)',
      }}
    >
      {children}
    </div>
  );
}

// Nút chọn chế độ (segmented control đơn giản).
export function Choice<T extends string>({
  options,
  value,
  onChange,
}: {
  options: { id: T; label: ReactNode }[];
  value: T;
  onChange: (v: T) => void;
}) {
  return (
    <div className="row" style={{ gap: 8, marginBottom: 10, flexWrap: 'wrap' }}>
      {options.map((o) => (
        <button
          key={o.id}
          className={value === o.id ? 'btn btn-primary' : 'btn'}
          onClick={() => onChange(o.id)}
        >
          {o.label}
        </button>
      ))}
    </div>
  );
}

// Màu HEX cho Scene3D (three.js không đọc được CSS var).
export const HEX = {
  v1: '#4f9cf9',
  v2: '#f97316',
  v3: '#22c55e',
  result: '#e879f9',
  plane: '#38bdf8',
  dim: '#9aa4b6',
} as const;

// Lưới lattice 2D (các đường song song với b1 và b2) làm "hệ trục" của một basis.
export function basisLattice(
  b1: [number, number],
  b2: [number, number],
  color: string,
  N = 5,
  M = 8
) {
  const segs: {
    from: [number, number];
    to: [number, number];
    color?: string;
    dashed?: boolean;
  }[] = [];
  for (let k = -N; k <= N; k++) {
    // đường song song với b1, đi qua k·b2
    segs.push({
      from: [k * b2[0] - M * b1[0], k * b2[1] - M * b1[1]],
      to: [k * b2[0] + M * b1[0], k * b2[1] + M * b1[1]],
      color,
    });
    // đường song song với b2, đi qua k·b1
    segs.push({
      from: [k * b1[0] - M * b2[0], k * b1[1] - M * b2[1]],
      to: [k * b1[0] + M * b2[0], k * b1[1] + M * b2[1]],
      color,
    });
  }
  return segs;
}
