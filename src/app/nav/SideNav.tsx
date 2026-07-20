import { NavLink } from 'react-router-dom';
import {
  Home,
  BookOpen,
  PencilLine,
  Sparkles,
  ChartLine,
  CircleUser,
  Settings,
} from 'lucide-react';

export interface SideNavProps {
  collapsed: boolean;
}

/** Kiểu component icon của lucide-react (mọi icon dùng chung một type). */
type IconCmp = typeof Home;

interface NavItem {
  to: string;
  icon: IconCmp;
  label: string;
  /** Khớp chính xác (dùng cho "/"). */
  end?: boolean;
  /** Ẩn khỏi thanh điều hướng đáy trên mobile (giữ trên sidebar desktop). */
  hideOnBar?: boolean;
}

interface NavSection {
  /** Nhãn nhóm (uppercase nhỏ); bỏ trống = nhóm không nhãn. */
  label?: string;
  items: NavItem[];
}

// IA v2 — đúng 6 mục chính, chia nhóm rõ ràng, tối giản kiểu Linear.app.
const SECTIONS: NavSection[] = [
  {
    items: [{ to: '/', icon: Home, label: 'Trang chủ', end: true }],
  },
  {
    label: 'Học tập',
    items: [
      { to: '/chapters', icon: BookOpen, label: 'Bài học' },
      { to: '/luyen', icon: PencilLine, label: 'Luyện tập', hideOnBar: true },
      { to: '/tutor', icon: Sparkles, label: 'Gia sư AI' },
    ],
  },
  {
    label: 'Cá nhân',
    items: [
      { to: '/tien-do', icon: ChartLine, label: 'Tiến độ' },
      { to: '/ho-so', icon: CircleUser, label: 'Hồ sơ' },
    ],
  },
];

/** Điều hướng chính, có thể thu gọn thành icon; ở mobile thành bottom-nav. */
export default function SideNav({ collapsed }: SideNavProps) {
  return (
    <nav className={`dl-sidenav ${collapsed ? 'collapsed' : ''}`}>
      <div className="dl-sidenav-items">
        {SECTIONS.map((sec, i) => (
          <div className="dl-nav-section" key={sec.label ?? `sec-${i}`}>
            {sec.label && <div className="dl-nav-section-label">{sec.label}</div>}
            {sec.items.map((it) => {
              const Icon = it.icon;
              return (
                <NavLink
                  key={it.to}
                  to={it.to}
                  end={it.end}
                  className={({ isActive }) =>
                    `dl-nav-item ${it.hideOnBar ? 'dl-nav-hide-mobile' : ''} ${
                      isActive ? 'active' : ''
                    }`.replace(/\s+/g, ' ').trim()
                  }
                  title={it.label}
                >
                  <span className="dl-nav-icon">
                    <Icon size={20} strokeWidth={1.75} />
                  </span>
                  <span className="dl-nav-label">{it.label}</span>
                </NavLink>
              );
            })}
          </div>
        ))}
      </div>

      <div className="dl-sidenav-foot">
        <NavLink
          to="/cai-dat"
          className={({ isActive }) => `dl-nav-item ${isActive ? 'active' : ''}`}
          title="Cài đặt"
        >
          <span className="dl-nav-icon">
            <Settings size={20} strokeWidth={1.75} />
          </span>
          <span className="dl-nav-label">Cài đặt</span>
        </NavLink>
      </div>
    </nav>
  );
}
