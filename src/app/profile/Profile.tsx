import { useMemo, useState } from 'react';
import type { FormEvent } from 'react';
import type { LucideIcon } from 'lucide-react';
import {
  Settings,
  Flame,
  Zap,
  Target,
  Crown,
  ChartLine,
  BookOpen,
  Sigma,
  CalendarRange,
  ChevronRight,
  Pencil,
  Check,
  X,
} from 'lucide-react';
import { useLearnStore } from '../../core/progress/store';
import { levelFromXp } from '../../core/progress/level';
import { isQuestComplete } from '../../core/progress/quests';
import { getMicroLesson, flatMicroLessons } from '../../core/content/course';
import { useCompletion } from '../state/completion';
import { lessonDone } from '../lib/progress';
import { ProgressRing, RichText } from '../ui';
import './profile.css';

// Ánh xạ id → nhãn hiển thị (khớp lựa chọn trong onboarding).
const GOAL_LABELS: Record<string, string> = {
  exam: '🎓 Ôn thi đại số tuyến tính',
  ml: '🤖 Nền tảng cho Machine Learning',
  curious: '✨ Học vì tò mò, cho vui',
  work: '💼 Phục vụ công việc / kỹ thuật',
};

// Biểu tượng cho từng thành tựu (id khớp core/progress/achievements.ts).
const ACHIEVEMENT_ICONS: Record<string, string> = {
  'first-lesson': '🌱',
  'streak-7': '🔥',
  'streak-14': '📅',
  'streak-30': '🏆',
  'xp-100': '⚡',
  'xp-500': '⭐',
  'xp-1000': '💎',
  'xp-2000': '👑',
  'perfect-lesson': '🌟',
  'skill-master': '🧠',
  'vector-master': '📐',
  'accuracy-week': '🎯',
  'flashcards-50': '🃏',
  'note-taker': '📝',
  'collector': '🔖',
};

/** Tab nội dung trong trang — mỗi lúc chỉ hiện MỘT khối. */
type ProfileTab = 'stats' | 'achievements' | 'quests' | 'saved';
const PROFILE_TABS: { id: ProfileTab; label: string }[] = [
  { id: 'stats', label: 'Chỉ số' },
  { id: 'achievements', label: 'Thành tựu' },
  { id: 'quests', label: 'Nhiệm vụ' },
  { id: 'saved', label: 'Đã lưu' },
];

/** Menu điều hướng thật (HashRouter → href `#/...`). */
const MENU: { label: string; href: string; Icon: LucideIcon }[] = [
  { label: 'Thống kê học tập', href: '#/tien-do', Icon: ChartLine },
  { label: 'Sổ tay lý thuyết', href: '#/so-tay', Icon: BookOpen },
  { label: 'Công thức & Ký hiệu', href: '#/wiki', Icon: Sigma },
  { label: 'Kế hoạch 8 tuần', href: '#/ke-hoach', Icon: CalendarRange },
  { label: 'Cài đặt', href: '#/cai-dat', Icon: Settings },
];

function formatDate(iso: string | undefined): string {
  if (!iso) return '';
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return '';
  return d.toLocaleDateString('vi-VN', { day: '2-digit', month: '2-digit', year: 'numeric' });
}

export default function Profile() {
  const profile = useLearnStore((s) => s.profile);
  const xpTotal = useLearnStore((s) => s.xpTotal);
  const xpToday = useLearnStore((s) => s.xpToday);
  const streak = useLearnStore((s) => s.streak.current);
  const longest = useLearnStore((s) => s.streak.longest);
  const attempts = useLearnStore((s) => s.attempts);
  const mastery = useLearnStore((s) => s.masteryBySkill);
  const done = useCompletion((s) => s.done);
  const achievements = useLearnStore((s) => s.achievements);
  const quests = useLearnStore((s) => s.quests);
  const resetProgress = useLearnStore((s) => s.resetProgress);
  const setProfile = useLearnStore((s) => s.setProfile);
  const bookmarks = useLearnStore((s) => s.bookmarks);
  const notes = useLearnStore((s) => s.notes);
  const toggleBookmark = useLearnStore((s) => s.toggleBookmark);
  const saveNote = useLearnStore((s) => s.saveNote);

  const [tab, setTab] = useState<ProfileTab>('stats');
  const [editingName, setEditingName] = useState(false);
  const [nameDraft, setNameDraft] = useState('');

  // Stat "Bài hoàn thành": đếm theo completion set (bounded, khớp Home),
  // không dùng counter lessonsCompleted vì học lại có thể vượt tổng.
  const flat = useMemo(() => flatMicroLessons(), []);
  const totalLessons = flat.length;
  const doneCount = useMemo(
    () => flat.filter((f) => lessonDone(f.lesson, mastery, done)).length,
    [flat, mastery, done],
  );

  // Gom bookmark theo loại + tách ghi chú (bài có/không được đánh dấu).
  const saved = useMemo(() => {
    const lessons = bookmarks.filter((id) => id.startsWith('lesson:'));
    const formulas = bookmarks.filter((id) => id.startsWith('formula:'));
    const symbols = bookmarks.filter((id) => id.startsWith('symbol:'));
    const bookmarkedLessons = new Set(lessons.map((id) => id.slice('lesson:'.length)));
    // Ghi chú của bài KHÔNG nằm trong danh sách bookmark → hiện riêng để không bị ẩn.
    const looseNotes = Object.entries(notes).filter(
      ([lid, text]) => text.trim() && !bookmarkedLessons.has(lid),
    );
    return { lessons, formulas, symbols, looseNotes };
  }, [bookmarks, notes]);
  const savedCount = bookmarks.length + saved.looseNotes.length;

  const accuracy = attempts.length
    ? attempts.filter((a) => a.isCorrect).length / attempts.length
    : 0;

  const unlockedCount = useMemo(
    () => achievements.filter((a) => a.unlockedAt).length,
    [achievements],
  );

  const displayName = profile.name?.trim() || 'Học viên';
  const initial = displayName.charAt(0).toUpperCase();
  const goalLabel = profile.goal ? GOAL_LABELS[profile.goal] ?? profile.goal : undefined;
  const tagline = goalLabel ?? 'Học mỗi ngày, tiến bộ mỗi ngày.';

  const { level, intoLevel, toNext, progress } = levelFromXp(xpTotal);

  const startEditName = () => {
    setNameDraft(profile.name ?? '');
    setEditingName(true);
  };
  const submitName = (e: FormEvent) => {
    e.preventDefault();
    const v = nameDraft.trim();
    setProfile({ name: v || undefined });
    setEditingName(false);
  };

  const onReset = () => {
    if (
      window.confirm(
        'Đặt lại toàn bộ tiến độ học (XP, chuỗi ngày, thành tựu, nhiệm vụ)? Hồ sơ của bạn vẫn được giữ. Hành động này không thể hoàn tác.',
      )
    ) {
      resetProgress();
    }
  };

  return (
    <div className="la-page pf-page">
      {/* ---------- Hàng đầu: tiêu đề + Cài đặt ---------- */}
      <div className="pf-top">
        <h1 className="pf-title">Tài khoản</h1>
        <a className="la-icon-btn" href="#/cai-dat" aria-label="Cài đặt">
          <Settings size={20} aria-hidden="true" />
        </a>
      </div>

      {/* ---------- Hero: avatar + tên + level/XP ---------- */}
      <section className="la-card-xl la-hero-grad pf-hero">
        <div className="pf-hero-top">
          <div className="pf-avatar" aria-hidden="true">
            {initial}
          </div>
          <div className="pf-hero-id">
            {editingName ? (
              <form className="pf-name-form" onSubmit={submitName}>
                <input
                  className="pf-name-input"
                  value={nameDraft}
                  onChange={(e) => setNameDraft(e.target.value)}
                  placeholder="Tên của bạn"
                  aria-label="Tên hiển thị"
                  maxLength={40}
                  autoFocus
                  onKeyDown={(e) => {
                    if (e.key === 'Escape') setEditingName(false);
                  }}
                />
                <button type="submit" className="pf-name-btn pf-name-btn--save" aria-label="Lưu tên">
                  <Check size={18} aria-hidden="true" />
                </button>
                <button
                  type="button"
                  className="pf-name-btn"
                  aria-label="Hủy"
                  onClick={() => setEditingName(false)}
                >
                  <X size={18} aria-hidden="true" />
                </button>
              </form>
            ) : (
              <div className="pf-name-row">
                <h2 className="pf-name">{displayName}</h2>
                <button
                  type="button"
                  className="pf-name-edit"
                  aria-label="Sửa tên"
                  onClick={startEditName}
                >
                  <Pencil size={16} aria-hidden="true" />
                </button>
              </div>
            )}
            <p className="pf-tagline">{tagline}</p>
          </div>
        </div>

        <div className="pf-level">
          <div className="pf-level-head">
            <span className="pf-level-name">Lv. {level}</span>
            <span className="pf-level-xp">
              {intoLevel}/{toNext} XP đến Lv. {level + 1}
            </span>
          </div>
          <div className="la-progress" aria-hidden="true">
            <i style={{ width: `${Math.round(progress * 100)}%` }} />
          </div>
        </div>
      </section>

      {/* ---------- 4 StatCard (cùng công thức Home) ---------- */}
      <div className="la-stat-grid pf-stats">
        <div className="la-card la-stat">
          <Flame className="la-stat-ico" size={22} style={{ color: 'var(--review)' }} aria-hidden="true" />
          <span className="la-stat-val">{streak}</span>
          <span className="la-stat-lab">Ngày liên tiếp</span>
        </div>
        <div className="la-card la-stat">
          <Zap className="la-stat-ico" size={22} style={{ color: 'var(--warn)' }} aria-hidden="true" />
          <span className="la-stat-val">{xpTotal.toLocaleString('vi-VN')}</span>
          <span className="la-stat-lab">Tổng điểm</span>
        </div>
        <div className="la-card la-stat">
          <Target className="la-stat-ico" size={22} style={{ color: 'var(--secondary)' }} aria-hidden="true" />
          <span className="la-stat-val">
            {doneCount}/{totalLessons}
          </span>
          <span className="la-stat-lab">Bài hoàn thành</span>
        </div>
        <div className="la-card la-stat">
          <Crown className="la-stat-ico" size={22} style={{ color: 'var(--primary)' }} aria-hidden="true" />
          <span className="la-stat-val">Lv. {level}</span>
          <span className="la-stat-lab">Cấp độ</span>
        </div>
      </div>

      {/* ---------- Tab điều hướng nội bộ ---------- */}
      <div className="la-chip-row pf-tabs" role="tablist" aria-label="Mục hồ sơ">
        {PROFILE_TABS.map((t) => (
          <button
            key={t.id}
            type="button"
            role="tab"
            aria-selected={tab === t.id}
            className={`la-chip${tab === t.id ? ' active' : ''}`}
            onClick={() => setTab(t.id)}
          >
            {t.label}
          </button>
        ))}
      </div>

      {/* ---------- Tab: Chỉ số ---------- */}
      {tab === 'stats' && (
        <div className="pf-tab" key="stats">
          <div className="la-card pf-detail">
            <div className="pf-detail-row">
              <span className="pf-detail-lbl">Độ chính xác</span>
              <span className="pf-detail-val">
                {Math.round(accuracy * 100)}% · {attempts.length} lượt
              </span>
            </div>
            <div className="pf-detail-row">
              <span className="pf-detail-lbl">Kỷ lục chuỗi ngày</span>
              <span className="pf-detail-val">{longest} ngày</span>
            </div>
            <div className="pf-detail-row">
              <span className="pf-detail-lbl">XP hôm nay</span>
              <span className="pf-detail-val">+{xpToday}</span>
            </div>
            {profile.createdAt && (
              <div className="pf-detail-row">
                <span className="pf-detail-lbl">Thành viên từ</span>
                <span className="pf-detail-val">{formatDate(profile.createdAt)}</span>
              </div>
            )}
          </div>
          <p className="pf-social-note">
            Bảng xếp hạng &amp; bạn bè cần máy chủ backend — sắp có. Hiện mọi tiến độ lưu riêng
            trên thiết bị của bạn.
          </p>
          <div className="pf-foot">
            <button type="button" className="pf-reset" onClick={onReset}>
              Đặt lại tiến độ
            </button>
          </div>
        </div>
      )}

      {/* ---------- Tab: Thành tựu ---------- */}
      {tab === 'achievements' && (
        <div className="pf-tab" key="achievements">
          <div className="la-card pf-sec">
            <div className="pf-sec-head">
              <h2 className="pf-sec-title">Thành tựu</h2>
              <span className="la-badge">
                {unlockedCount}/{achievements.length} mở khóa
              </span>
            </div>
            <div className="pf-ach-grid">
              {achievements.map((a) => {
                const unlocked = !!a.unlockedAt;
                return (
                  <div
                    key={a.id}
                    className={`pf-ach ${unlocked ? 'unlocked' : 'locked'}`}
                    title={a.desc}
                  >
                    <span className="pf-ach-icon">
                      {unlocked ? ACHIEVEMENT_ICONS[a.id] ?? '🏅' : '🔒'}
                    </span>
                    <span className="pf-ach-title">{a.title}</span>
                    <span className="pf-ach-desc">{a.desc}</span>
                    {unlocked && (
                      <span className="pf-ach-date">Mở khóa {formatDate(a.unlockedAt)}</span>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {/* ---------- Tab: Nhiệm vụ ---------- */}
      {tab === 'quests' && (
        <div className="pf-tab" key="quests">
          <div className="la-card pf-sec">
            <div className="pf-sec-head">
              <h2 className="pf-sec-title">Nhiệm vụ hôm nay</h2>
              <span className="la-badge">
                {quests.filter(isQuestComplete).length}/{quests.length} xong
              </span>
            </div>
            <div className="pf-quests">
              {quests.map((q) => {
                const pct = q.target > 0 ? Math.min(1, q.progress / q.target) : 0;
                const done = isQuestComplete(q);
                return (
                  <div key={q.id} className="pf-quest">
                    <ProgressRing
                      progress={pct}
                      size={46}
                      stroke={6}
                      color={done ? 'var(--good)' : 'var(--primary)'}
                      label={
                        <span className="pf-quest-ring">
                          {done ? '✓' : `${Math.round(pct * 100)}%`}
                        </span>
                      }
                    />
                    <div className="pf-quest-body">
                      <span className="pf-quest-title">{q.title}</span>
                      <span className="pf-quest-prog">
                        {q.progress}/{q.target}
                      </span>
                    </div>
                    {done && <span className="pf-quest-done">Hoàn thành</span>}
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {/* ---------- Tab: Đã lưu ---------- */}
      {tab === 'saved' && (
        <div className="pf-tab" key="saved">
          {savedCount === 0 ? (
            <div className="la-card">
              <p className="la-empty pf-saved-empty">
                Chưa có mục nào được lưu. Bấm ⭐ trong bài học để đánh dấu, hoặc ghi chú khi
                đang làm bài.
              </p>
            </div>
          ) : (
            <div className="la-card pf-sec">
              <div className="pf-sec-head">
                <h2 className="pf-sec-title">Đã lưu</h2>
                <span className="la-badge">{savedCount} mục</span>
              </div>

              {/* Bài học đã đánh dấu — ghi chú (nếu có) hiện expandable ngay dưới */}
              {saved.lessons.length > 0 && (
                <section className="pf-saved-group">
                  <div className="pf-saved-group-head">
                    <BookOpen size={15} strokeWidth={2.2} aria-hidden="true" />
                    <span>Bài học</span>
                  </div>
                  <ul className="pf-saved-list">
                    {saved.lessons.map((id) => {
                      const ref = id.slice('lesson:'.length);
                      const title = getMicroLesson(ref)?.title ?? ref;
                      const note = notes[ref]?.trim() ? notes[ref] : '';
                      return (
                        <li key={id} className="pf-saved-item">
                          <div className="pf-saved-row">
                            <a className="pf-saved-link" href={`#/learn/${ref}`}>
                              {title}
                            </a>
                            <button
                              type="button"
                              className="pf-saved-remove"
                              onClick={() => toggleBookmark(id)}
                              title="Bỏ lưu"
                              aria-label={`Bỏ lưu ${title}`}
                            >
                              <X size={15} strokeWidth={2.2} />
                            </button>
                          </div>
                          {note && (
                            <details className="pf-saved-note">
                              <summary className="pf-saved-note-sum">Ghi chú</summary>
                              <div className="pf-saved-note-text">
                                <RichText text={note} />
                              </div>
                              <button
                                type="button"
                                className="pf-saved-note-del"
                                onClick={() => saveNote(ref, '')}
                              >
                                Xóa ghi chú
                              </button>
                            </details>
                          )}
                        </li>
                      );
                    })}
                  </ul>
                </section>
              )}

              {/* Công thức + Ký hiệu → mở /wiki */}
              {(saved.formulas.length > 0 || saved.symbols.length > 0) && (
                <section className="pf-saved-group">
                  <div className="pf-saved-group-head">
                    <Sigma size={15} strokeWidth={2.2} aria-hidden="true" />
                    <span>Công thức &amp; ký hiệu</span>
                  </div>
                  <ul className="pf-saved-list">
                    {[...saved.formulas, ...saved.symbols].map((id) => {
                      const ci = id.indexOf(':');
                      const ref = ci > 0 ? id.slice(ci + 1) : id;
                      const kind = id.startsWith('formula:') ? 'Công thức' : 'Ký hiệu';
                      return (
                        <li key={id} className="pf-saved-item">
                          <div className="pf-saved-row">
                            <a className="pf-saved-link" href="#/wiki">
                              <span className="pf-saved-kind">{kind}</span>
                              {ref}
                            </a>
                            <button
                              type="button"
                              className="pf-saved-remove"
                              onClick={() => toggleBookmark(id)}
                              title="Bỏ lưu"
                              aria-label={`Bỏ lưu ${ref}`}
                            >
                              <X size={15} strokeWidth={2.2} />
                            </button>
                          </div>
                        </li>
                      );
                    })}
                  </ul>
                </section>
              )}

              {/* Ghi chú của bài chưa được đánh dấu — vẫn cho xem & xóa */}
              {saved.looseNotes.length > 0 && (
                <section className="pf-saved-group">
                  <div className="pf-saved-group-head">
                    <span aria-hidden="true">📝</span>
                    <span>Ghi chú khác</span>
                  </div>
                  <ul className="pf-saved-list">
                    {saved.looseNotes.map(([lid, text]) => {
                      const title = getMicroLesson(lid)?.title ?? lid;
                      return (
                        <li key={lid} className="pf-saved-item">
                          <div className="pf-saved-row">
                            <a className="pf-saved-link" href={`#/learn/${lid}`}>
                              {title}
                            </a>
                            <button
                              type="button"
                              className="pf-saved-remove"
                              onClick={() => saveNote(lid, '')}
                              title="Xóa ghi chú"
                              aria-label={`Xóa ghi chú ${title}`}
                            >
                              <X size={15} strokeWidth={2.2} />
                            </button>
                          </div>
                          <details className="pf-saved-note" open>
                            <summary className="pf-saved-note-sum">Ghi chú</summary>
                            <div className="pf-saved-note-text">
                              <RichText text={text} />
                            </div>
                          </details>
                        </li>
                      );
                    })}
                  </ul>
                </section>
              )}
            </div>
          )}
        </div>
      )}

      {/* ---------- Menu điều hướng ---------- */}
      <nav className="la-card pf-menu" aria-label="Điều hướng nhanh">
        {MENU.map(({ label, href, Icon }) => (
          <a key={href} className="la-row pf-menu-row" href={href}>
            <span className="la-row-ico" aria-hidden="true">
              <Icon size={20} />
            </span>
            <span className="la-row-label">{label}</span>
            <ChevronRight className="pf-menu-chev" size={20} aria-hidden="true" />
          </a>
        ))}
      </nav>
    </div>
  );
}
