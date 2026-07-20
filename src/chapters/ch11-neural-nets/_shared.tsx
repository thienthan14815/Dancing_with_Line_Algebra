// Tiện ích dùng chung cho CHƯƠNG 11 — Mạng nơ-ron.
// Giữ riêng trong thư mục ch11 để không phụ thuộc file của chương khác.
import type { ReactNode } from 'react';
import type { Mat, Vec } from '../../lib/linalg';

// Làm tròn 2 chữ số, khử -0 cho gọn mắt.
export function r2(n: number): number {
  const v = Math.round(n * 100) / 100;
  return v === 0 ? 0 : v;
}
export function f2(n: number): string {
  return r2(n).toFixed(2);
}
export function f3(n: number): string {
  const v = Math.round(n * 1000) / 1000;
  return (v === 0 ? 0 : v).toFixed(3);
}

// --- Ký hiệu LaTeX cho vector cột & ma trận (dùng với <MathText>) ------------
export function vecTex(v: Vec, digits = 2): string {
  const body = v.map((x) => (digits === 0 ? String(Math.round(x)) : r2(x).toFixed(digits))).join(' \\\\ ');
  return `\\begin{bmatrix} ${body} \\end{bmatrix}`;
}
export function matTex(M: Mat, digits = 2): string {
  const rows = M.map((row) =>
    row.map((x) => (digits === 0 ? String(Math.round(x)) : r2(x).toFixed(digits))).join(' & '),
  ).join(' \\\\ ');
  return `\\begin{bmatrix} ${rows} \\end{bmatrix}`;
}

// --- "Chip" số liệu: nhãn + giá trị ----------------------------------------
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
      <span className="mono" style={{ fontSize: 15, fontWeight: 600, color: color ?? 'var(--text)' }}>
        {value}
      </span>
    </div>
  );
}

export function StatRow({ children }: { children: ReactNode }) {
  return (
    <div className="row" style={{ gap: 10, marginTop: 12, marginBottom: 4, alignItems: 'stretch', flexWrap: 'wrap' }}>
      {children}
    </div>
  );
}

export function Hint({ children }: { children: ReactNode }) {
  return (
    <p className="dim" style={{ fontSize: 13, marginTop: 10, display: 'flex', gap: 6 }}>
      <span aria-hidden>💡</span>
      <span>{children}</span>
    </p>
  );
}

// Khung "Nối với Đại số tuyến tính" — cầu nối chủ đạo của cả chương DL.
export function BridgeLA({ children }: { children: ReactNode }) {
  return (
    <div
      className="panel"
      style={{
        borderColor: 'var(--accent)',
        background: 'rgba(56,189,248,0.06)',
        marginTop: 12,
      }}
    >
      <b style={{ color: 'var(--accent)' }}>🔗 Nối với Đại số tuyến tính. </b>
      {children}
    </div>
  );
}

export function ControlGrid({ children }: { children: ReactNode }) {
  return (
    <div
      style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
        gap: '0 20px',
        marginTop: 8,
      }}
    >
      {children}
    </div>
  );
}

// --- Biểu đồ cột ngang cho vector kích hoạt (activation vector) -------------
// Vẽ mỗi thành phần thành một thanh, dài theo |giá trị|, có nhãn.
export function Bars({
  values,
  labels,
  color = 'var(--vec-1)',
  max,
}: {
  values: Vec;
  labels?: string[];
  color?: string;
  max?: number;
}) {
  const m = max ?? Math.max(1e-6, ...values.map((v) => Math.abs(v)));
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 6, marginTop: 8 }}>
      {values.map((v, i) => {
        const pct = Math.min(100, (Math.abs(v) / m) * 100);
        const neg = v < 0;
        return (
          <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <span className="mono" style={{ width: 34, fontSize: 12, color: 'var(--text-dim)', textAlign: 'right' }}>
              {labels?.[i] ?? `#${i + 1}`}
            </span>
            <div
              style={{
                position: 'relative',
                flex: 1,
                height: 18,
                background: 'var(--bg-elevated)',
                borderRadius: 4,
                overflow: 'hidden',
              }}
            >
              <div
                style={{
                  position: 'absolute',
                  left: 0,
                  top: 0,
                  height: '100%',
                  width: `${pct}%`,
                  background: neg ? 'var(--bad)' : color,
                  opacity: 0.85,
                }}
              />
            </div>
            <span className="mono" style={{ width: 52, fontSize: 12, color: 'var(--text)', textAlign: 'right' }}>
              {f2(v)}
            </span>
          </div>
        );
      })}
    </div>
  );
}
