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

// Ma trận → chuỗi TeX bmatrix (đã làm tròn 2 chữ số).
export function matTex(M: number[][]): string {
  const body = M.map((row) => row.map((x) => f2(x)).join(' & ')).join(' \\\\ ');
  return `\\begin{bmatrix} ${body} \\end{bmatrix}`;
}

// Vector cột → chuỗi TeX bmatrix dọc.
export function colTex(v: number[]): string {
  return `\\begin{bmatrix} ${v.map((x) => f2(x)).join(' \\\\ ')} \\end{bmatrix}`;
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

// Lưới hai cột co giãn (tự xuống hàng khi hẹp).
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

// Hộp "Đào sâu": nêu định lý/tính chất chặt chẽ cho chương nâng cao.
export function DeepDive({
  title = 'Đào sâu',
  children,
}: {
  title?: string;
  children: ReactNode;
}) {
  return (
    <div
      style={{
        border: '1px solid var(--border)',
        borderLeft: '3px solid var(--accent)',
        background: 'var(--bg-elevated)',
        borderRadius: 'var(--radius-sm)',
        padding: '12px 16px',
        margin: '16px 0',
      }}
    >
      <div
        style={{
          fontSize: 12,
          fontWeight: 700,
          color: 'var(--accent)',
          letterSpacing: 0.4,
          textTransform: 'uppercase',
          marginBottom: 6,
          display: 'flex',
          gap: 6,
          alignItems: 'center',
        }}
      >
        <span aria-hidden>🔬</span>
        <span>{title}</span>
      </div>
      <div>{children}</div>
    </div>
  );
}
