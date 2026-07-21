import { useMemo } from 'react';
import { NavLink } from 'react-router-dom';
import { Home, Sparkles, Play, PencilLine, CircleUser } from 'lucide-react';
import { flatMicroLessons } from '../../core/content/course';
import { useLearnStore } from '../../core/progress/store';
import { useCompletion } from '../state/completion';
import { lessonDone } from '../lib/progress';

/** Kiểu component icon của lucide-react. */
type IconCmp = typeof Home;

interface Tab {
  to: string;
  icon: IconCmp;
  label: string;
  /** Khớp chính xác (dùng cho "/"). */
  end?: boolean;
  /** Nút hành động nổi ở giữa. */
  center?: boolean;
}

/** Bottom tab bar 5 mục — thay sidebar trên MỌI viewport; dock nổi ở desktop. */
export default function BottomNav() {
  const mastery = useLearnStore((s) => s.masteryBySkill);
  const done = useCompletion((s) => s.done);
  const flat = useMemo(() => flatMicroLessons(), []);

  // "Học ngay" = nhảy thẳng vào micro-lesson chưa xong đầu tiên (cùng logic
  // với card Tiếp tục ở LearningPath); học hết lộ trình → về Trang chủ.
  const next = useMemo(
    () => flat.find((f) => !lessonDone(f.lesson, mastery, done)),
    [flat, mastery, done],
  );
  const learnTo = next ? `/learn/${next.lesson.id}` : '/';

  // 5 tab (FR-02) — trung tâm là FAB "Học ngay"; Gia sư AI đứng slot thường.
  const tabs: Tab[] = [
    { to: '/', icon: Home, label: 'Trang chủ', end: true },
    { to: '/tutor', icon: Sparkles, label: 'Gia sư AI' },
    { to: learnTo, icon: Play, label: 'Học ngay', center: true },
    { to: '/luyen', icon: PencilLine, label: 'Bài tập' },
    { to: '/ho-so', icon: CircleUser, label: 'Tài khoản' },
  ];

  return (
    <nav className="la-bottomnav" aria-label="Điều hướng chính">
      {tabs.map((t) => {
        const Icon = t.icon;
        if (t.center) {
          return (
            <NavLink
              key="hoc-ngay"
              to={t.to}
              className={({ isActive }) =>
                `la-tab la-tab-center ${isActive ? 'active' : ''}`.trim()
              }
              aria-label={t.label}
            >
              <span className="la-tab-fab">
                <Icon size={26} strokeWidth={2} fill="currentColor" aria-hidden="true" />
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
