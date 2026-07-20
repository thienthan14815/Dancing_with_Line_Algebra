import { NavLink } from 'react-router-dom';

export interface SideNavProps {
  collapsed: boolean;
}

interface NavItem {
  to: string;
  icon: string;
  label: string;
  /** Khớp chính xác (dùng cho "/"). */
  end?: boolean;
}

const ITEMS: NavItem[] = [
  { to: '/', icon: '🏠', label: 'Học', end: true },
  { to: '/luyen', icon: '🔁', label: 'Ôn tập' },
  { to: '/luyen-tap', icon: '✍️', label: 'Bài tập' },
  { to: '/so-tay', icon: '📖', label: 'Sổ tay' },
  { to: '/tien-do', icon: '📊', label: 'Tiến độ' },
  { to: '/ho-so', icon: '👤', label: 'Hồ sơ' },
  { to: '/lo-trinh', icon: '🗺️', label: 'Lộ trình' },
  { to: '/wiki', icon: '📚', label: 'Wiki' },
];

/** Điều hướng chính, có thể thu gọn thành icon. */
export default function SideNav({ collapsed }: SideNavProps) {
  return (
    <nav className={`dl-sidenav ${collapsed ? 'collapsed' : ''}`}>
      <div className="dl-sidenav-items">
        {ITEMS.map((it) => (
          <NavLink
            key={it.to}
            to={it.to}
            end={it.end}
            className={({ isActive }) => `dl-nav-item ${isActive ? 'active' : ''}`}
            title={it.label}
          >
            <span className="dl-nav-icon">{it.icon}</span>
            <span className="dl-nav-label">{it.label}</span>
          </NavLink>
        ))}
      </div>

      <div className="dl-sidenav-foot">
        <NavLink
          to="/cai-dat"
          className={({ isActive }) => `dl-nav-item ${isActive ? 'active' : ''}`}
          title="Cài đặt"
        >
          <span className="dl-nav-icon">⚙️</span>
          <span className="dl-nav-label">Cài đặt</span>
        </NavLink>
        <NavLink
          to="/chapters"
          className={({ isActive }) => `dl-nav-item dl-nav-classic ${isActive ? 'active' : ''}`}
          title="Chương (cổ điển)"
        >
          <span className="dl-nav-icon">📚</span>
          <span className="dl-nav-label">Chương (cổ điển)</span>
        </NavLink>
      </div>
    </nav>
  );
}
