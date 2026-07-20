import type { ReactNode } from 'react';

export type BadgeTone = 'good' | 'accent' | 'xp' | 'muted' | 'bad' | 'warn';

export interface BadgeProps {
  tone?: BadgeTone;
  icon?: ReactNode;
  children?: ReactNode;
  className?: string;
}

/** Nhãn tròn nhỏ dùng cho trạng thái / XP / streak. */
export default function Badge({
  tone = 'muted',
  icon,
  children,
  className = '',
}: BadgeProps) {
  return (
    <span className={`dl-badge dl-badge-${tone} ${className}`.trim()}>
      {icon != null && <span className="dl-badge-icon">{icon}</span>}
      {children}
    </span>
  );
}
