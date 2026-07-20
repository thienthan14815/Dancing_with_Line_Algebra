// Thành phần UI dùng chung cho CHƯƠNG 10 — Học máy & Hồi quy.
import type { ReactNode } from 'react';

/** Một "chip" số liệu: nhãn nhỏ + giá trị mono, tô màu theo vai trò. */
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
        minWidth: 96,
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

/** Hàng chứa các chip số liệu, tự xuống dòng khi hẹp. */
export function StatRow({ children }: { children: ReactNode }) {
  return (
    <div
      className="row"
      style={{ gap: 10, marginTop: 12, marginBottom: 4, flexWrap: 'wrap', alignItems: 'stretch' }}
    >
      {children}
    </div>
  );
}

/** Gợi ý tương tác nhỏ ("hãy kéo/thử để thấy…"). */
export function Hint({ children }: { children: ReactNode }) {
  return (
    <p className="dim" style={{ fontSize: 13, marginTop: 10, display: 'flex', gap: 6 }}>
      <span aria-hidden>💡</span>
      <span>{children}</span>
    </p>
  );
}

/**
 * Khung nhấn mạnh "Nối với Đại số tuyến tính" — bắc cầu DL ↔ LA.
 * Đây là linh hồn của cả nhánh Deep Learning: mọi thứ đều là LA áp dụng.
 */
export function BridgeLA({
  title = 'Nối với Đại số tuyến tính',
  children,
}: {
  title?: string;
  children: ReactNode;
}) {
  return (
    <div
      className="panel"
      style={{
        marginTop: 14,
        borderLeft: '4px solid var(--accent)',
        background: 'color-mix(in srgb, var(--accent) 8%, transparent)',
      }}
    >
      <div style={{ fontWeight: 700, color: 'var(--accent)', marginBottom: 6 }}>
        🔗 {title}
      </div>
      <div style={{ fontSize: 14.5, lineHeight: 1.6 }}>{children}</div>
    </div>
  );
}

/** Hai cột co giãn (đồ hoạ + bảng điều khiển cạnh nhau, tự xuống hàng). */
export function TwoCol({ children }: { children: ReactNode }) {
  return (
    <div
      style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
        gap: 16,
        alignItems: 'start',
      }}
    >
      {children}
    </div>
  );
}
