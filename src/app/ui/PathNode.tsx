import type { ReactNode } from 'react';

export type PathNodeState = 'done' | 'current' | 'available' | 'locked';

export interface PathNodeProps {
  state: PathNodeState;
  label: string;
  sublabel?: string;
  /** Icon tùy dạng bài; nếu bỏ trống dùng icon mặc định theo trạng thái. */
  icon?: ReactNode;
  onClick?: () => void;
  style?: React.CSSProperties;
}

function defaultIcon(state: PathNodeState, icon?: ReactNode): ReactNode {
  if (state === 'done') return '✓';
  if (state === 'locked') return '🔒';
  return icon ?? '●';
}

/** Node tròn "chunky" trên đường path học, có bóng dưới tạo cảm giác 3D. */
export default function PathNode({
  state,
  label,
  sublabel,
  icon,
  onClick,
  style,
}: PathNodeProps) {
  return (
    <div className="dl-node-wrap" style={style}>
      <button
        type="button"
        className={`dl-node dl-node-${state}`}
        onClick={onClick}
        aria-label={label}
      >
        <span className="dl-node-face">{defaultIcon(state, icon)}</span>
        {state === 'current' && <span className="dl-node-pulse" aria-hidden="true" />}
      </button>
      <span className="dl-node-label">{label}</span>
      {sublabel && <span className="dl-node-sub">{sublabel}</span>}
    </div>
  );
}
