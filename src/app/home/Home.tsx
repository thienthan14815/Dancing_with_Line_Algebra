import { useEffect, useMemo, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Flame,
  Zap,
  Target,
  Crown,
  Play,
  Check,
  ChevronRight,
  BookOpen,
  Sigma,
  Layers,
  Waypoints,
  CalendarRange,
} from 'lucide-react';
import { COURSE, flatMicroLessons } from '../../core/content/course';
import type { Section } from '../../core/content/types';
import { useLearnStore } from '../../core/progress/store';
import { levelFromXp } from '../../core/progress/level';
import type { XpTransaction } from '../../core/db/schema';
import { storage } from '../../core/persistence/localStorage';
import { toDayKey, startOfWeekMs } from '../../core/progress/time';
import { useCompletion } from '../state/completion';
import { lessonDone, sectionProgress } from '../lib/progress';
import { LinalCharacter } from '../ui';
import './home.css';

const DAY_MS = 86_400_000;
// Tuần bắt đầu Thứ 2 → Chủ nhật (khớp startOfWeekMs).
const WEEK_LABELS = ['T2', 'T3', 'T4', 'T5', 'T6', 'T7', 'CN'] as const;
const WEEK_FULL = ['Thứ 2', 'Thứ 3', 'Thứ 4', 'Thứ 5', 'Thứ 6', 'Thứ 7', 'Chủ nhật'] as const;

/** Công cụ nhanh — nhãn + route thật + icon lucide. */
const QUICK_TOOLS = [
  { label: 'Giải tích 30 ngày', route: '/giai-tich', Icon: CalendarRange },
  { label: 'Lý thuyết', route: '/so-tay', Icon: BookOpen },
  { label: 'Công thức & Ký hiệu', route: '/wiki', Icon: Sigma },
  { label: 'Thẻ ghi nhớ', route: '/luyen?tab=the', Icon: Layers },
  { label: 'Bản đồ tri thức', route: '/chapters', Icon: Waypoints },
  { label: 'Kế hoạch 8 tuần', route: '/ke-hoach', Icon: CalendarRange },
] as const;

/** Định dạng số kiểu Việt (dấu chấm ngăn cách hàng nghìn): 1234 → "1.234". */
function formatVi(n: number): string {
  return Math.round(n)
    .toString()
    .replace(/\B(?=(\d{3})+(?!\d))/g, '.');
}

export default function Home() {
  const navigate = useNavigate();

  // ----- Store (CHỈ ĐỌC, không sửa core) -----
  const streak = useLearnStore((s) => s.streak);
  const xpTotal = useLearnStore((s) => s.xpTotal);
  const mastery = useLearnStore((s) => s.masteryBySkill);
  const profileName = useLearnStore((s) => s.profile.name);
  const lessonsCompleted = useLearnStore((s) => s.lessonsCompleted);
  const attempts = useLearnStore((s) => s.attempts);
  const done = useCompletion((s) => s.done);

  const flat = useMemo(() => flatMicroLessons(), []);
  const totalLessons = flat.length;

  // ----- "Học tiếp": bài chưa hoàn thành đầu tiên (cùng logic "Tiếp tục" cũ) -----
  const currentIdx = useMemo(
    () => flat.findIndex((f) => !lessonDone(f.lesson, mastery, done)),
    [flat, mastery, done],
  );
  const current = currentIdx >= 0 ? flat[currentIdx] : undefined;
  // Stat "Bài hoàn thành": đếm theo completion set (bounded, khớp Profile).
  const doneCount = useMemo(
    () => flat.filter((f) => lessonDone(f.lesson, mastery, done)).length,
    [flat, mastery, done],
  );
  const currentSection = current
    ? COURSE.sections.find((s) => s.id === current.sectionId)
    : undefined;
  const currentProg = currentSection ? sectionProgress(currentSection, mastery, done) : null;
  const hasProgress =
    lessonsCompleted > 0 || Object.keys(done).length > 0 || xpTotal > 0;

  const level = levelFromXp(xpTotal).level;

  // ----- Thống kê 7 ngày (tuần hiện tại, T2→CN) từ ledger xpTransactions -----
  // Tái dùng đúng cách LearningPath cũ đọc ledger (storage.list + toDayKey),
  // làm mới khi xpTotal/attempts đổi (storage không reactive).
  const weekly = useMemo(() => {
    const txs = storage.list<XpTransaction>('xpTransactions');
    const weekStart = startOfWeekMs(new Date());
    const weekEnd = weekStart + 7 * DAY_MS;

    const xpByDay = new Map<string, number>();
    const activeDays = new Set<string>();
    let weekXp = 0;
    let weekLessons = 0;

    for (const tx of txs) {
      const t = new Date(tx.createdAt).getTime();
      if (t < weekStart || t >= weekEnd) continue;
      const k = toDayKey(tx.createdAt);
      xpByDay.set(k, (xpByDay.get(k) ?? 0) + tx.amount);
      activeDays.add(k);
      weekXp += tx.amount;
      if (tx.reason.startsWith('lesson:')) weekLessons += 1;
    }
    // Fallback nguồn hoạt động: attempts[].createdAt (recordAttempt không ghi ledger).
    for (const a of attempts) {
      const t = new Date(a.createdAt).getTime();
      if (t >= weekStart && t < weekEnd) activeDays.add(toDayKey(a.createdAt));
    }

    const bars = WEEK_LABELS.map((label, i) => {
      const key = toDayKey(new Date(weekStart + i * DAY_MS));
      return { key, label, full: WEEK_FULL[i], xp: xpByDay.get(key) ?? 0 };
    });
    const maxXp = bars.reduce((m, b) => Math.max(m, b.xp), 0) || 1;
    const todayIdx = (new Date().getDay() + 6) % 7; // 0 = Thứ 2 … 6 = CN

    return {
      bars,
      maxXp,
      todayIdx,
      weekXp,
      weekLessons,
      activeDays: activeDays.size,
      hasActivity: activeDays.size > 0,
    };
  }, [xpTotal, attempts]);

  // ----- Auto-center chip "current" của dải Lộ trình khi mount -----
  const rowRef = useRef<HTMLDivElement>(null);
  const curChipRef = useRef<HTMLButtonElement>(null);
  useEffect(() => {
    const row = rowRef.current;
    const chip = curChipRef.current;
    if (!row || !chip) return;
    const target = chip.offsetLeft - (row.clientWidth - chip.offsetWidth) / 2;
    row.scrollLeft = Math.max(0, target);
  }, []);

  const sectionStatus = (section: Section): 'done' | 'current' | 'other' => {
    if (sectionProgress(section, mastery, done).pct >= 1) return 'done';
    if (current && section.id === current.sectionId) return 'current';
    return 'other';
  };

  const pct = currentProg ? Math.round(currentProg.pct * 100) : 0;

  return (
    <div className="la-page ho-home">
      {/* (1) Hero chào */}
      <section className="la-card-xl la-hero-grad ho-hero">
        <div className="ho-hero-text">
          <p className="ho-hero-eyebrow">Chào mừng trở lại,</p>
          <h1 className="ho-hero-name">{profileName || 'bạn'} 👋</h1>
          <p className="ho-hero-sub">Học một chút mỗi ngày, tiến bộ mỗi ngày.</p>
        </div>
        <div className="ho-hero-char">
          <LinalCharacter size={96} />
        </div>
      </section>

      <section className="la-card-xl" style={{ padding: 24 }} aria-label="Giáo án Giải tích">
        <span className="la-badge">GIÁO ÁN MỚI</span>
        <h2>Giải tích trong 30 ngày</h2>
        <p>6 chặng từ giới hạn, đạo hàm đến tích phân nhiều biến. Có bài giảng, ví dụ, bài tập và lời giải.</p>
        <button type="button" className="dl-btn dl-btn-primary" onClick={() => navigate('/giai-tich')}>Mở giáo án →</button>
      </section>

      {/* (2) 4 StatCard */}
      <div className="la-stat-grid ho-stats-grid">
        <div className="la-stat">
          <Flame className="la-stat-ico" size={24} color="var(--review)" aria-hidden="true" />
          <span className="la-stat-val">{streak.current}</span>
          <span className="la-stat-lab">Ngày liên tiếp</span>
        </div>
        <div className="la-stat">
          <Zap className="la-stat-ico" size={24} color="var(--warn)" aria-hidden="true" />
          <span className="la-stat-val">{formatVi(xpTotal)}</span>
          <span className="la-stat-lab">Tổng điểm</span>
        </div>
        <div className="la-stat">
          <Target className="la-stat-ico" size={24} color="var(--secondary)" aria-hidden="true" />
          <span className="la-stat-val">
            {doneCount}/{totalLessons}
          </span>
          <span className="la-stat-lab">Bài hoàn thành</span>
        </div>
        <div className="la-stat">
          <Crown className="la-stat-ico" size={24} color="var(--primary)" aria-hidden="true" />
          <span className="la-stat-val">Lv. {level}</span>
          <span className="la-stat-lab">Cấp độ</span>
        </div>
      </div>

      {/* (3) Học tiếp */}
      <div className="la-sec-head">
        <h2 className="la-sec-title">Học tiếp</h2>
        <button type="button" className="la-sec-action" onClick={() => navigate('/lo-trinh')}>
          Xem lộ trình <ChevronRight size={16} aria-hidden="true" />
        </button>
      </div>
      {current && currentSection && currentProg ? (
        <div className="la-card-xl ho-cont">
          <div className="ho-cont-body">
            <span className="la-badge">Chương {currentSection.num}</span>
            <h3 className="ho-cont-title">{current.lesson.title}</h3>
            <div className="ho-cont-prog">
              <div className="la-progress">
                <i style={{ width: `${pct}%` }} />
              </div>
              <span className="ho-cont-pct">{pct}%</span>
            </div>
          </div>
          {hasProgress ? (
            <button
              type="button"
              className="ho-play"
              aria-label={`Tiếp tục học: ${current.lesson.title}`}
              onClick={() => navigate(`/learn/${current.lesson.id}`)}
            >
              <Play size={24} color="var(--on-primary)" fill="var(--on-primary)" aria-hidden="true" />
            </button>
          ) : (
            <button
              type="button"
              className="la-btn la-btn-sm la-btn-primary ho-cont-cta"
              onClick={() => navigate(`/learn/${current.lesson.id}`)}
            >
              Bắt đầu học
            </button>
          )}
        </div>
      ) : (
        <div className="la-card-xl ho-cont ho-cont--done">
          <div className="ho-cont-body">
            <h3 className="ho-cont-title">Đã hoàn thành toàn bộ lộ trình 🎉</h3>
            <p className="ho-cont-sub">Ôn lại để giữ vững kiến thức nhé.</p>
          </div>
          <button
            type="button"
            className="la-btn la-btn-sm la-btn-secondary ho-cont-cta"
            onClick={() => navigate('/lo-trinh')}
          >
            Xem lộ trình
          </button>
        </div>
      )}

      {/* (4) Lộ trình của bạn */}
      <div className="la-sec-head">
        <h2 className="la-sec-title">Lộ trình của bạn</h2>
        <button type="button" className="la-sec-action" onClick={() => navigate('/lo-trinh')}>
          Xem tất cả <ChevronRight size={16} aria-hidden="true" />
        </button>
      </div>
      <div className="la-chip-row ho-rm-row" ref={rowRef}>
        {COURSE.sections.map((section) => {
          const st = sectionStatus(section);
          return (
            <button
              key={section.id}
              type="button"
              ref={st === 'current' ? curChipRef : undefined}
              className={`ho-rm-item ho-rm-item--${st}`}
              onClick={() => navigate('/lo-trinh')}
              title={`Chương ${section.num}: ${section.title}`}
            >
              <span className={`ho-rm-ico ho-rm-ico--${st}`} aria-hidden="true">
                {st === 'done' ? <Check size={16} color="var(--good)" /> : null}
              </span>
              <span className="ho-rm-num">Chương {section.num}</span>
              <span className="ho-rm-title">{section.title}</span>
            </button>
          );
        })}
      </div>

      {/* (5) Thống kê 7 ngày */}
      <div className="la-sec-head">
        <h2 className="la-sec-title">Thống kê</h2>
        <span className="ho-sec-note">7 ngày qua</span>
      </div>
      <div className="la-card ho-week">
        {weekly.hasActivity ? (
          <>
            <div className="ho-metrics">
              <div className="ho-metric">
                <span className="ho-metric-val">{formatVi(weekly.weekXp)}</span>
                <span className="ho-metric-lab">XP tuần này</span>
              </div>
              <div className="ho-metric">
                <span className="ho-metric-val">{weekly.weekLessons}</span>
                <span className="ho-metric-lab">Bài hoàn thành</span>
              </div>
              <div className="ho-metric">
                <span className="ho-metric-val">{weekly.activeDays}</span>
                <span className="ho-metric-lab">Ngày hoạt động</span>
              </div>
            </div>
            <div className="ho-chart" role="img" aria-label="Biểu đồ XP 7 ngày qua">
              {weekly.bars.map((b, i) => {
                const h = Math.round((b.xp / weekly.maxXp) * 100);
                const isToday = i === weekly.todayIdx;
                return (
                  <div key={b.key} className={`ho-bar-col${isToday ? ' ho-bar-col--today' : ''}`}>
                    <div className="ho-bar-track" title={`${b.full}: ${b.xp} XP`}>
                      <div className="ho-bar-fill" style={{ height: `${h}%` }} />
                    </div>
                    <span className="ho-bar-lab">{b.label}</span>
                  </div>
                );
              })}
            </div>
          </>
        ) : (
          <p className="la-empty">
            Chưa có hoạt động nào trong tuần này. Học một bài để bắt đầu nhé!
          </p>
        )}
      </div>

      {/* (6) Công cụ nhanh */}
      <div className="la-sec-head">
        <h2 className="la-sec-title">Công cụ nhanh</h2>
      </div>
      <div className="ho-tools">
        {QUICK_TOOLS.map(({ label, route, Icon }) => (
          <button
            key={label}
            type="button"
            className="la-card ho-tool"
            onClick={() => navigate(route)}
          >
            <span className="ho-tool-ico" aria-hidden="true">
              <Icon size={24} color="var(--primary)" />
            </span>
            <span className="ho-tool-label">{label}</span>
          </button>
        ))}
      </div>
    </div>
  );
}
