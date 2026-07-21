import { NavLink } from 'react-router-dom';
import { Home, Map, FlaskConical, PencilLine, CircleUser } from 'lucide-react';

/** Kiểu component icon của lucide-react. */
type IconCmp = typeof Home;

interface Tab {
  to: string;
  icon: IconCmp;
  label: string;
  /** Khớp chính xác (dùng cho "/"). */
  end?: boolean;
  /** Nút hành động nổi ở giữa (Gia sư AI). */
  center?: boolean;
}

// 5 tab (FR-02) — Gia sư AI ở giữa, nổi lên dạng FAB gradient.
const TABS: Tab[] = [
  { to: '/', icon: Home, label: 'Trang chủ', end: true },
  { to: '/lo-trinh', icon: Map, label: 'Lộ trình' },
  { to: '/tutor', icon: FlaskConical, label: 'Gia sư AI', center: true },
  { to: '/luyen', icon: PencilLine, label: 'Bài tập' },
  { to: '/ho-so', icon: CircleUser, label: 'Tài khoản' },
];

/** Bottom tab bar 5 mục — thay sidebar trên MỌI viewport; dock nổi ở desktop. */
export default function BottomNav() {
  return (
    <nav className="la-bottomnav" aria-label="Điều hướng chính">
      {TABS.map((t) => {
        const Icon = t.icon;
        if (t.center) {
          return (
            <NavLink
              key={t.to}
              to={t.to}
              className={({ isActive }) =>
                `la-tab la-tab-center ${isActive ? 'active' : ''}`.trim()
              }
              aria-label={t.label}
            >
              <span className="la-tab-fab">
                <Icon size={26} strokeWidth={2} aria-hidden="true" />
              </span>
              <span className="la-tab-label">{t.label}</span>
            </NavLink>
          );
        }
        return (
          <NavLink
            key={t.to}
            to={t.to}
            end={t.end}
            className={({ isActive }) => `la-tab ${isActive ? 'active' : ''}`.trim()}
          >
            <Icon size={22} strokeWidth={2} aria-hidden="true" />
            <span className="la-tab-label">{t.label}</span>
          </NavLink>
        );
      })}
    </nav>
  );
}
