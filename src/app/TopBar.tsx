import { useNavigate } from 'react-router-dom';
import { useLearnStore } from '../core/progress/store';
import { ProgressRing, Badge } from './ui';

export interface TopBarProps {
  onMenu: () => void;
}

/** Thanh trên: streak, XP hôm nay + tổng, vòng mục tiêu ngày, nút menu. */
export default function TopBar({ onMenu }: TopBarProps) {
  const navigate = useNavigate();
  const streak = useLearnStore((s) => s.streak.current);
  const xpToday = useLearnStore((s) => s.xpToday);
  const xpTotal = useLearnStore((s) => s.xpTotal);
  const goalXp = useLearnStore((s) => s.dailyGoal.goalXp);

  const pct = goalXp > 0 ? xpToday / goalXp : 0;

  return (
    <header className="dl-topbar">
      <button
        type="button"
        className="dl-menu-btn"
        onClick={onMenu}
        title="Thu gọn thanh bên"
        aria-label="Menu"
      >
        ☰
      </button>

      <div className="dl-brand" onClick={() => navigate('/')}>
        LinAlgLab
      </div>

      <div className="dl-topbar-spacer" />

      <Badge tone="bad" icon="🔥" className="dl-topbar-stat">
        {streak}
      </Badge>

      <Badge tone="xp" icon="⚡" className="dl-topbar-stat">
        {xpTotal}
      </Badge>

      <button
        type="button"
        className="dl-goal"
        onClick={() => navigate('/tien-do')}
        title={`Mục tiêu ngày: ${xpToday}/${goalXp} XP`}
      >
        <ProgressRing
          progress={pct}
          size={38}
          stroke={5}
          color="var(--warn)"
          label={<span className="dl-goal-label">{Math.min(xpToday, goalXp)}</span>}
        />
      </button>
    </header>
  );
}
