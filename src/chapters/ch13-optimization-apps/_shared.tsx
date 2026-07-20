import type { ReactNode } from 'react';

// ---------------------------------------------------------------------------
// Tiện ích số & hiển thị (dùng chung cho 4 bài của chương 13).
// ---------------------------------------------------------------------------

/** Làm tròn 2 chữ số, khử -0 cho gọn mắt. */
export function r2(n: number): number {
  const v = Math.round(n * 100) / 100;
  return v === 0 ? 0 : v;
}

/** Chuỗi hiển thị một số đã làm tròn 2 chữ số. */
export function f2(n: number): string {
  if (!Number.isFinite(n)) return '∞';
  return r2(n).toFixed(2);
}

/** Chuỗi hiển thị một số làm tròn 3 chữ số. */
export function f3(n: number): string {
  if (!Number.isFinite(n)) return '∞';
  const v = Math.round(n * 1000) / 1000;
  return (v === 0 ? 0 : v).toFixed(3);
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
      style={{
        gap: 10,
        marginTop: 12,
        marginBottom: 4,
        alignItems: 'stretch',
        flexWrap: 'wrap',
      }}
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

// Lưới hai cột co giãn (trực quan + điều khiển cạnh nhau, tự xuống hàng khi hẹp).
export function TwoCol({ children }: { children: ReactNode }) {
  return (
    <div
      style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
        gap: 16,
      }}
    >
      {children}
    </div>
  );
}

// Khung "Nối với Đại số tuyến tính" — nhấn mạnh triết lý DL = LA áp dụng.
export function Bridge({
  title = 'Nối với Đại số tuyến tính',
  children,
}: {
  title?: string;
  children: ReactNode;
}) {
  return (
    <div
      style={{
        marginTop: 16,
        padding: '14px 16px',
        borderRadius: 'var(--radius-sm)',
        border: '1px solid var(--border)',
        borderLeft: '4px solid var(--accent)',
        background: 'var(--panel-2)',
      }}
    >
      <div
        style={{
          fontSize: 12,
          fontWeight: 700,
          letterSpacing: 0.3,
          color: 'var(--accent-strong)',
          marginBottom: 6,
          display: 'flex',
          alignItems: 'center',
          gap: 6,
        }}
      >
        <span aria-hidden>🔗</span> {title}
      </div>
      <div style={{ fontSize: 14 }}>{children}</div>
    </div>
  );
}

// Nhãn màu nhỏ (chú giải cho các đường/quỹ đạo).
export function LegendDot({ color, children }: { color: string; children: ReactNode }) {
  return (
    <span
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        gap: 6,
        fontSize: 12,
        color: 'var(--text-muted)',
        marginRight: 14,
      }}
    >
      <span
        style={{
          width: 12,
          height: 12,
          borderRadius: 3,
          background: color,
          display: 'inline-block',
        }}
      />
      {children}
    </span>
  );
}
