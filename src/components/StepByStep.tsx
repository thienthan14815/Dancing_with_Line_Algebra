import { useState, type ReactNode } from 'react';

export interface StepByStepProps {
  steps: { title?: string; content: ReactNode }[];
  onStepChange?: (i: number) => void;
}

export default function StepByStep({ steps, onStepChange }: StepByStepProps) {
  const [i, setI] = useState(0);

  const go = (next: number) => {
    const clamped = Math.max(0, Math.min(steps.length - 1, next));
    setI(clamped);
    onStepChange?.(clamped);
  };

  if (steps.length === 0) return null;
  const current = steps[i];

  return (
    <div>
      <div className="steps-controls">
        <button className="btn" onClick={() => go(i - 1)} disabled={i === 0}>
          ← Trước
        </button>
        <div className="step-dots">
          {steps.map((_, idx) => (
            <span
              key={idx}
              className={`step-dot ${idx === i ? 'active' : ''} ${
                idx < i ? 'done' : ''
              }`}
              onClick={() => go(idx)}
              title={`Bước ${idx + 1}`}
            />
          ))}
        </div>
        <button
          className="btn"
          onClick={() => go(i + 1)}
          disabled={i === steps.length - 1}
        >
          Sau →
        </button>
      </div>
      <div className="step-body">
        {current.title && <div className="step-title">{current.title}</div>}
        <div>{current.content}</div>
      </div>
      <div className="dim" style={{ fontSize: 12, marginTop: 8 }}>
        Bước {i + 1} / {steps.length}
      </div>
    </div>
  );
}
