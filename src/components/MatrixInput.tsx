import type { Mat } from '../lib/linalg';

export interface MatrixInputProps {
  value: Mat;
  onChange: (m: Mat) => void;
  rows?: number;
  cols?: number;
  presets?: { label: string; m: Mat }[];
}

export default function MatrixInput({
  value,
  onChange,
  rows,
  cols,
  presets,
}: MatrixInputProps) {
  const r = rows ?? value.length;
  const c = cols ?? (value[0]?.length ?? 0);

  const setCell = (i: number, j: number, raw: string) => {
    const num = raw === '' || raw === '-' ? 0 : parseFloat(raw);
    const next = value.map((row) => row.slice());
    if (!next[i]) next[i] = [];
    next[i][j] = Number.isNaN(num) ? 0 : num;
    onChange(next);
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
                type="number"
                step="any"
                value={value[i]?.[j] ?? 0}
                onChange={(e) => setCell(i, j, e.target.value)}
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
