import { useEffect, useId, useState, type ReactNode } from 'react';

export interface StepByStepProps {
  steps: { title?: string; content: ReactNode }[];
  onStepChange?: (i: number) => void;
}

export default function StepByStep({ steps, onStepChange }: StepByStepProps) {
  const [selected, setI] = useState(0);
  const i = Math.max(0, Math.min(steps.length - 1, selected));
  const contentId = useId();

  // A shorter replacement list must not leave the current step out of bounds.
  useEffect(() => {
    if (selected === i) return;
    setI(i);
    if (steps.length) onStepChange?.(i);
  }, [selected, i, steps.length, onStepChange]);

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
        <button type="button" className="btn" onClick={() => go(i - 1)} disabled={i === 0} aria-controls={contentId}>
          ← Trước
        </button>
        <div className="step-dots" role="group" aria-label="Chọn bước học">
          {steps.map((step, idx) => (
            <button
              type="button"
              key={idx}
              className={`step-dot ${idx === i ? 'active' : ''} ${
                idx < i ? 'done' : ''
              }`}
              onClick={() => go(idx)}
              title={step.title ?? `Bước ${idx + 1}`}
              aria-label={`Bước ${idx + 1}${step.title ? `: ${step.title}` : ''}`}
              aria-current={idx === i ? 'step' : undefined}
              aria-controls={contentId}
              style={{ width: 28, height: 28, minWidth: 28, padding: 0, color: 'var(--text)', fontSize: 12 }}
            >{idx + 1}</button>
          ))}
        </div>
        <button
          type="button"
          className="btn"
          onClick={() => go(i + 1)}
          disabled={i === steps.length - 1}
          aria-controls={contentId}
        >
          Sau →
        </button>
      </div>
      <div className="step-body" id={contentId}>
        {current.title && <div className="step-title">{current.title}</div>}
        <div>{current.content}</div>
      </div>
      <div className="dim" role="status" style={{ fontSize: 12, marginTop: 8 }}>
        Bước {i + 1} / {steps.length}
      </div>
    </div>
  );
}
