import { useEffect, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Search, ChevronLeft, FlaskConical } from 'lucide-react';
import { useLearnStore } from '../core/progress/store';
import { ProgressRing } from './ui';
import SearchPalette from './search/SearchPalette';
import './search/search.css';

const IS_MAC =
  typeof navigator !== 'undefined' && /mac|iphone|ipad|ipod/i.test(navigator.platform);

/** Các route "gốc" của bottom bar — KHÔNG hiện nút back. */
const ROOT_PATHS = new Set(['/', '/lo-trinh', '/luyen', '/tutor', '/ho-so']);

/**
 * Thanh trên: nút back (theo ngữ cảnh) · brand "Linal Lab" · tìm kiếm
 * (⌘/Ctrl+K, "/", hoặc event 'la:open-search') · vòng mục tiêu ngày.
 * Giữ class gốc `.dl-topbar` để focus-mode (body.dl-focus) vẫn ẩn đúng.
 */
export default function TopBar() {
  const navigate = useNavigate();
  const { pathname } = useLocation();
  const xpToday = useLearnStore((s) => s.xpToday);
  const goalXp = useLearnStore((s) => s.dailyGoal.goalXp);

  const pct = goalXp > 0 ? xpToday / goalXp : 0;

  const [searchOpen, setSearchOpen] = useState(false);

  // Phím tắt toàn cục + event mở search từ bất kỳ đâu (Interfaces #3).
  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      const k = e.key.toLowerCase();
      if ((e.metaKey || e.ctrlKey) && k === 'k') {
        e.preventDefault();
        setSearchOpen((o) => !o);
        return;
      }
      if (searchOpen) return; // palette tự xử lý phím của nó
      const t = e.target as HTMLElement | null;
      const tag = t?.tagName;
      const typing = tag === 'INPUT' || tag === 'TEXTAREA' || t?.isContentEditable === true;
      if (!typing && k === '/' && !e.metaKey && !e.ctrlKey && !e.altKey) {
        e.preventDefault();
        setSearchOpen(true);
      }
    }
    function onOpenSearch() {
      setSearchOpen(true);
    }
    window.addEventListener('keydown', onKey);
    window.addEventListener('la:open-search', onOpenSearch);
    return () => {
      window.removeEventListener('keydown', onKey);
      window.removeEventListener('la:open-search', onOpenSearch);
    };
  }, [searchOpen]);

  const showBack = !ROOT_PATHS.has(pathname);
  const isHome = pathname === '/';

  return (
    <header className="dl-topbar">
      {showBack && (
        <button
          type="button"
          className="la-icon-btn"
          onClick={() => navigate(-1)}
          aria-label="Quay lại"
          title="Quay lại"
        >
          <ChevronLeft size={20} strokeWidth={2} aria-hidden="true" />
        </button>
      )}

      <button
        type="button"
        className="la-brand"
        onClick={() => navigate('/')}
        aria-label="Linal Lab — Trang chủ"
      >
        <span className="la-logo" aria-hidden="true">
          <FlaskConical size={18} strokeWidth={2} />
        </span>
        <span className="la-brand-text">
          <span className="la-brand-name">Linal Lab</span>
          {isHome && <span className="la-brand-sub">Linear Algebra • Made Simple</span>}
        </span>
      </button>

      <div className="dl-topbar-spacer" />

      <button
        type="button"
        className="la-icon-btn"
        onClick={() => setSearchOpen(true)}
        aria-label="Tìm kiếm"
        title={`Tìm kiếm (${IS_MAC ? '⌘' : 'Ctrl'} K)`}
      >
        <Search size={18} strokeWidth={2} aria-hidden="true" />
      </button>

      <button
        type="button"
        className="dl-goal"
        onClick={() => navigate('/tien-do')}
        aria-label={`Mục tiêu ngày: ${xpToday}/${goalXp} XP`}
        title={`Mục tiêu ngày: ${xpToday}/${goalXp} XP`}
      >
        <ProgressRing
          progress={pct}
          size={38}
          stroke={5}
          color="var(--primary)"
          label={<span className="dl-goal-label">{Math.min(xpToday, goalXp)}</span>}
        />
      </button>

      {searchOpen && <SearchPalette onClose={() => setSearchOpen(false)} />}
    </header>
  );
}
