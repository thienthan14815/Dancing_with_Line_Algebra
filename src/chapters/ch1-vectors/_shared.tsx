import type { ReactNode } from 'react';

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

// Một "chip" số liệu: nhãn + giá trị, tô màu theo vai trò vector.
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
      style={{ gap: 10, marginTop: 12, marginBottom: 4, alignItems: 'stretch' }}
    >
      {children}
    </div>
  );
}

// Gợi ý tương tác ("hãy kéo/thử để thấy...").
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

// Lưới hai cột co giãn (2D + 3D cạnh nhau, tự xuống hàng khi hẹp).
export function TwoCol({ children }: { children: ReactNode }) {
  return (
    <div
      style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
        gap: 16,
      }}
    >
      {children}
    </div>
  );
}
