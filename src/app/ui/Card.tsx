import type { HTMLAttributes, ReactNode } from 'react';

export interface CardProps extends HTMLAttributes<HTMLDivElement> {
  children?: ReactNode;
  /** Thêm hiệu ứng hover nổi lên (dùng cho card bấm được). */
  interactive?: boolean;
}

/** Panel bo tròn nền --panel, viền mềm. */
export default function Card({
  children,
  interactive = false,
  className = '',
  ...rest
}: CardProps) {
  const cls = ['dl-card', interactive ? 'dl-card-interactive' : '', className]
    .filter(Boolean)
    .join(' ');
  return (
    <div className={cls} {...rest}>
      {children}
    </div>
  );
}
