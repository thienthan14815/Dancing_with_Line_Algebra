export interface SliderProps {
  label: string;
  min: number;
  max: number;
  step?: number;
  value: number;
  onChange: (v: number) => void;
  format?: (v: number) => string;
}

export default function Slider({
  label,
  min,
  max,
  step = 0.01,
  value,
  onChange,
  format,
}: SliderProps) {
  const display = format ? format(value) : String(Math.round(value * 1000) / 1000);
  return (
    <div className="slider-row">
      <div className="slider-top">
        <span className="slider-label">{label}</span>
        <span className="slider-value">{display}</span>
      </div>
      <input
        type="range"
        min={min}
        max={max}
        step={step}
        value={value}
        onChange={(e) => onChange(parseFloat(e.target.value))}
      />
    </div>
  );
}
