import { useState } from 'react';
import type { Mat } from '../lib/linalg';

export interface MatrixInputProps {
  value: Mat;
  onChange: (m: Mat) => void;
  rows?: number;
  cols?: number;
  presets?: { label: string; m: Mat }[];
}

/** Chuỗi đang gõ dở hợp lệ: rỗng, "-", "1.", "-0.5", "3"... */
const PARTIAL_RE = /^-?\d*\.?\d*$/;

export default function MatrixInput({
  value,
  onChange,
  rows,
  cols,
  presets,
}: MatrixInputProps) {
  const r = rows ?? value.length;
  const c = cols ?? (value[0]?.length ?? 0);

  // Draft giữ nguyên văn chuỗi user đang gõ ("-", "1.", "07"…) để controlled
  // input không "nuốt" phím; xóa khi blur hoặc khi giá trị ngoài đè lệch đi.
  const [draft, setDraft] = useState<Record<string, string>>({});

  const setCell = (i: number, j: number, raw: string) => {
    const num = parseFloat(raw);
    const next = value.map((row) => row.slice());
    if (!next[i]) next[i] = [];
    next[i][j] = Number.isNaN(num) ? 0 : num;
    onChange(next);
  };

  const handleChange = (i: number, j: number, raw: string) => {
    if (!PARTIAL_RE.test(raw)) return; // chặn ký tự không phải số
    setDraft((d) => ({ ...d, [`${i}-${j}`]: raw }));
    setCell(i, j, raw);
  };

  const handleBlur = (i: number, j: number) => {
    setDraft((d) => {
      const nd = { ...d };
      delete nd[`${i}-${j}`];
      return nd;
    });
  };

  /** Chuỗi hiển thị: ưu tiên draft nếu còn khớp với giá trị số hiện tại. */
  const cellText = (i: number, j: number): string => {
    const num = value[i]?.[j] ?? 0;
    const d = draft[`${i}-${j}`];
    if (d !== undefined) {
      const parsed = parseFloat(d);
      const parsedNum = Number.isNaN(parsed) ? 0 : parsed;
      if (parsedNum === num) return d; // draft vẫn "ăn khớp" — giữ nguyên văn
    }
    return String(num);
  };

  return (
    <div>
      <div className="matrix-input">
        <div className="matrix-bracket" />
        <div
          className="matrix-cells"
          style={{ gridTemplateColumns: `repeat(${c}, auto)` }}
        >
          {Array.from({ length: r }).map((_, i) =>
            Array.from({ length: c }).map((__, j) => (
              <input
                key={`${i}-${j}`}
                type="text"
                inputMode="decimal"
                autoComplete="off"
                value={cellText(i, j)}
                onChange={(e) => handleChange(i, j, e.target.value)}
                onFocus={(e) => e.target.select()}
                onBlur={() => handleBlur(i, j)}
              />
            ))
          )}
        </div>
        <div className="matrix-bracket right" />
      </div>
      {presets && presets.length > 0 && (
        <div className="presets">
          {presets.map((p, idx) => (
            <button
              key={idx}
              className="preset-btn"
              onClick={() => onChange(p.m.map((row) => row.slice()))}
            >
              {p.label}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
