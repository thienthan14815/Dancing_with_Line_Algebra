import { useMemo, useState } from 'react';
import { ArrowUp, ArrowDown, Lightbulb, Flame, CalendarCheck } from 'lucide-react';
import { flatMicroLessons } from '../../core/content/course';
import { SKILL_BY_ID } from '../../core/content/skills';
import { useLearnStore } from '../../core/progress/store';
import { storage } from '../../core/persistence/localStorage';
import type { XpTransaction } from '../../core/db/schema';
import { toDayKey } from '../../core/progress/time';
import { useCompletion } from '../state/completion';
import { lessonDone } from '../lib/progress';
import { Card, Badge, Button } from '../ui';
import './analytics.css';

type Tab = 'skills' | 'stats' | 'week' | 'activity';

export default function Dashboard() {
  const mastery = useLearnStore((s) => s.masteryBySkill);
  const attempts = useLearnStore((s) => s.attempts);
  const streak = useLearnStore((s) => s.streak.current);
  const longest = useLearnStore((s) => s.streak.longest);
  const xpTotal = useLearnStore((s) => s.xpTotal);
  const xpToday = useLearnStore((s) => s.xpToday);
  const lessonsCompleted = useLearnStore((s) => s.lessonsCompleted);
  const resetProgress = useLearnStore((s) => s.resetProgress);
  const done = useCompletion((s) => s.done);
  const resetCompletion = useCompletion((s) => s.reset);

  const [tab, setTab] = useState<Tab>('skills');

  const flat = useMemo(() => flatMicroLessons(), []);
  const doneLessons = useMemo(
    () => flat.filter((f) => lessonDone(f.lesson, mastery, done)).length,
    [flat, mastery, done],
  );
  const coursePct = flat.length ? Math.round((doneLessons / flat.length) * 100) : 0;

  const accuracy = attempts.length
    ? Math.round((attempts.filter((a) => a.isCorrect).length / attempts.length) * 100)
    : 0;

  const skills = useMemo(
    () =>
      Object.values(mastery)
        .filter((m) => m.score > 0)
        .sort((a, b) => b.score - a.score),
    [mastery],
  );

  // ---- Báo cáo "Tuần này" (tuần = Thứ 2 → CN, giờ địa phương) ----
  // XP + số bài từ ledger xpTransactions; độ chính xác + chủ đề yếu từ attempts.
  // Đọc lại ledger khi xpTotal đổi (giống LearningPath). CHỈ ĐỌC dữ liệu.
  const weekly = useMemo(() => {
    const now = new Date();
    const thisMon = startOfWeekMonday(now).getTime();
    const nextMon = startOfWeekMonday(now, 1).getTime();
    const lastMon = startOfWeekMonday(now, -1).getTime();

    const txs = storage.list<XpTransaction>('xpTransactions');
    let thisXp = 0;
    let lastXp = 0;
    let thisLessons = 0;
    for (const tx of txs) {
      const t = new Date(tx.createdAt).getTime();
      if (t >= thisMon && t < nextMon) {
        thisXp += tx.amount;
        if (tx.reason.startsWith('lesson:')) thisLessons += 1;
      } else if (t >= lastMon && t < thisMon) {
        lastXp += tx.amount;
      }
    }

    // Độ chính xác + chủ đề yếu nhất trong tuần (từ attempts đã lưu).
    const weekAtt = attempts.filter((a) => {
      const t = new Date(a.createdAt).getTime();
      return t >= thisMon && t < nextMon;
    });
    const correct = weekAtt.filter((a) => a.isCorrect).length;
    const acc = weekAtt.length ? Math.round((correct / weekAtt.length) * 100) : null;

    // Skill có attempt tuần này → chọn skill mastery thấp nhất.
    const touched = new Set(weekAtt.map((a) => a.skillId));
    let weakest: { name: string; pct: number } | null = null;
    for (const sid of touched) {
      const score = mastery[sid]?.score ?? 0;
      if (!weakest || score < weakest.pct) {
        weakest = { name: SKILL_BY_ID[sid]?.name ?? sid, pct: score };
      }
    }
    const weakestOut = weakest
      ? { name: weakest.name, pct: Math.round(weakest.pct * 100) }
      : null;

    // % cải thiện XP so tuần trước (null nếu tuần trước không có dữ liệu).
    const improvement = lastXp > 0 ? Math.round(((thisXp - lastXp) / lastXp) * 100) : null;

    return {
      thisXp,
      lastXp,
      thisLessons,
      accuracy: acc,
      weekAttempts: weekAtt.length,
      weakest: weakestOut,
      improvement,
      note: weeklyNote(thisXp, improvement),
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [attempts, mastery, xpTotal]);

  // ---- Heatmap "Hoạt động": 12 tuần × 7 ngày (cột = tuần, hàng = thứ) ----
  const heatmap = useMemo(() => {
    const txs = storage.list<XpTransaction>('xpTransactions');
    const byDay = new Map<string, number>();
    for (const tx of txs) {
      const k = toDayKey(tx.createdAt);
      byDay.set(k, (byDay.get(k) ?? 0) + tx.amount);
    }

    const WEEKS = 12;
    const now = new Date();
    const start = startOfWeekMonday(now, -(WEEKS - 1)); // Thứ 2 của 11 tuần trước

    type Cell = { key: string; xp: number; level: number; title: string };
    const rawCols: { firstMonth: number; days: { date: Date; key: string; xp: number }[] }[] = [];
    let maxXp = 0;
    for (let w = 0; w < WEEKS; w++) {
      const days: { date: Date; key: string; xp: number }[] = [];
      for (let d = 0; d < 7; d++) {
        const date = new Date(start.getFullYear(), start.getMonth(), start.getDate() + w * 7 + d);
        const key = toDayKey(date);
        const xp = byDay.get(key) ?? 0;
        if (xp > maxXp) maxXp = xp;
        days.push({ date, key, xp });
      }
      rawCols.push({ firstMonth: days[0].date.getMonth(), days });
    }

    const levelOf = (xp: number): number => {
      if (xp <= 0) return 0;
      const t = xp / (maxXp || 1);
      if (t <= 0.25) return 1;
      if (t <= 0.5) return 2;
      if (t <= 0.75) return 3;
      return 4;
    };

    let prevMonth = -1;
    const cols = rawCols.map((c) => {
      const monthLabel = c.firstMonth !== prevMonth ? `Th${c.firstMonth + 1}` : null;
      prevMonth = c.firstMonth;
      const days: Cell[] = c.days.map((d) => ({
        key: d.key,
        xp: d.xp,
        level: levelOf(d.xp),
        title: `${d.date.getDate()}/${d.date.getMonth() + 1}: ${d.xp} XP`,
      }));
      return { monthLabel, days };
    });

    // Tổng ngày hoạt động (mọi ngày từng có XP trong ledger).
    let totalActiveDays = 0;
    for (const v of byDay.values()) if (v > 0) totalActiveDays += 1;

    return { cols, totalActiveDays };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [xpTotal]);

  const onReset = () => {
    if (window.confirm('Xóa toàn bộ tiến độ học? Hồ sơ vẫn được giữ.')) {
      resetProgress();
      resetCompletion();
    }
  };

  return (
    <div className="dl-page dl-dash">
      <h1 className="dl-dash-title">Tiến độ</h1>

      {/* 3 bubble số liệu quan trọng nhất */}
      <div className="dl-bubbles">
        <div className="dl-bubble">
          <div className="dl-bubble-circle">
            <span className="dl-bubble-num">{coursePct}%</span>
          </div>
          <span className="dl-bubble-lbl">Hoàn thành</span>
        </div>
        <div className="dl-bubble">
          <div className="dl-bubble-circle">
            <span className="dl-bubble-num">{streak}</span>
          </div>
          <span className="dl-bubble-lbl">Chuỗi ngày</span>
        </div>
        <div className="dl-bubble">
          <div className="dl-bubble-circle">
            <span className="dl-bubble-num">{xpTotal}</span>
          </div>
          <span className="dl-bubble-lbl">Tổng XP</span>
        </div>
      </div>

      {/* Navi trong trang: 1 khối nội dung một lúc */}
      <div className="dl-tabs" role="tablist" aria-label="Xem chi tiết tiến độ">
        <button
          type="button"
          role="tab"
          aria-selected={tab === 'skills'}
          className={`dl-tab ${tab === 'skills' ? 'active' : ''}`}
          onClick={() => setTab('skills')}
        >
          Kỹ năng
        </button>
        <button
          type="button"
          role="tab"
          aria-selected={tab === 'stats'}
          className={`dl-tab ${tab === 'stats' ? 'active' : ''}`}
          onClick={() => setTab('stats')}
        >
          Thống kê
        </button>
        <button
          type="button"
          role="tab"
          aria-selected={tab === 'week'}
          className={`dl-tab ${tab === 'week' ? 'active' : ''}`}
          onClick={() => setTab('week')}
        >
          Tuần này
        </button>
        <button
          type="button"
          role="tab"
          aria-selected={tab === 'activity'}
          className={`dl-tab ${tab === 'activity' ? 'active' : ''}`}
          onClick={() => setTab('activity')}
        >
          Hoạt động
        </button>
      </div>

      <div className="dl-tab-panel" key={tab}>
        {tab === 'skills' && (
          <Card className="dl-skills">
            <div className="dl-skills-head">
              <h2>Độ thành thạo theo kỹ năng</h2>
              <Badge tone="muted">{skills.length} kỹ năng</Badge>
            </div>
            {skills.length === 0 ? (
              <p className="dl-muted">
                Chưa có dữ liệu. Hãy hoàn thành vài bài để bắt đầu đo mastery.
              </p>
            ) : (
              <div className="dl-skill-list">
                {skills.map((m) => {
                  const name = SKILL_BY_ID[m.skillId]?.name ?? m.skillId;
                  const pct = Math.round(m.score * 100);
                  return (
                    <div key={m.skillId} className="dl-skill-row">
                      <span className="dl-skill-name">{name}</span>
                      <span className="dl-skill-bar">
                        <span
                          className="dl-skill-fill"
                          style={{
                            width: `${pct}%`,
                            background:
                              pct >= 80
                                ? 'var(--good)'
                                : pct >= 40
                                  ? 'var(--accent)'
                                  : 'var(--warn)',
                          }}
                        />
                      </span>
                      <span className="dl-skill-pct">{pct}%</span>
                    </div>
                  );
                })}
              </div>
            )}
          </Card>
        )}

        {tab === 'stats' && (
          <div className="dl-stat-grid">
            <Card className="dl-stat-card">
              <span className="dl-stat-icon">🎯</span>
              <span className="dl-stat-num">{accuracy}%</span>
              <span className="dl-stat-lbl">Độ chính xác ({attempts.length} lượt)</span>
            </Card>
            <Card className="dl-stat-card">
              <span className="dl-stat-icon">✅</span>
              <span className="dl-stat-num">{lessonsCompleted}</span>
              <span className="dl-stat-lbl">Bài đã hoàn thành</span>
            </Card>
            <Card className="dl-stat-card">
              <span className="dl-stat-icon">⚡</span>
              <span className="dl-stat-num">+{xpToday}</span>
              <span className="dl-stat-lbl">XP hôm nay</span>
            </Card>
            <Card className="dl-stat-card">
              <span className="dl-stat-icon">🏅</span>
              <span className="dl-stat-num">{longest}</span>
              <span className="dl-stat-lbl">Kỷ lục chuỗi ngày</span>
            </Card>
          </div>
        )}

        {tab === 'week' && (
          <div className="an-week">
            <div className="an-metric-grid">
              <Card className="dl-card-metric an-metric">
                <div className="an-metric-head">
                  <span className="an-metric-lbl">XP tuần này</span>
                  <DeltaChip improvement={weekly.improvement} />
                </div>
                <span className="dl-card-metric-value">{weekly.thisXp}</span>
                <span className="an-metric-sub">Tuần trước: {weekly.lastXp} XP</span>
              </Card>

              <Card className="dl-card-metric an-metric">
                <div className="an-metric-head">
                  <span className="an-metric-lbl">Bài hoàn thành</span>
                </div>
                <span className="dl-card-metric-value">{weekly.thisLessons}</span>
                <span className="an-metric-sub">trong tuần này</span>
              </Card>

              <Card className="dl-card-metric an-metric">
                <div className="an-metric-head">
                  <span className="an-metric-lbl">Độ chính xác</span>
                </div>
                <span className="dl-card-metric-value">
                  {weekly.accuracy === null ? '—' : `${weekly.accuracy}%`}
                </span>
                <span className="an-metric-sub">{weekly.weekAttempts} lượt trả lời</span>
              </Card>

              <Card className="dl-card-metric an-metric">
                <div className="an-metric-head">
                  <span className="an-metric-lbl">Chủ đề yếu nhất tuần</span>
                </div>
                {weekly.weakest ? (
                  <>
                    <span className="an-metric-topic">{weekly.weakest.name}</span>
                    <span className="an-metric-sub">{weekly.weakest.pct}% thành thạo</span>
                  </>
                ) : (
                  <>
                    <span className="dl-card-metric-value">—</span>
                    <span className="an-metric-sub">Chưa luyện tập tuần này</span>
                  </>
                )}
              </Card>
            </div>

            <div className="an-note">
              <Lightbulb aria-hidden="true" />
              <span>{weekly.note}</span>
            </div>
          </div>
        )}

        {tab === 'activity' && (
          <div className="an-activity">
            <Card className="an-heat-card">
              <div className="an-heat-scroll">
                <div
                  className="an-heat"
                  role="img"
                  aria-label="Bản đồ nhiệt hoạt động 12 tuần gần nhất"
                >
                  {heatmap.cols.map((col, ci) => (
                    <div key={ci} className="an-heat-col">
                      <div className="an-heat-month">{col.monthLabel ?? ''}</div>
                      {col.days.map((cell) => (
                        <div
                          key={cell.key}
                          className="an-heat-cell"
                          data-level={cell.level}
                          title={cell.title}
                        />
                      ))}
                    </div>
                  ))}
                </div>
              </div>
              <div className="an-heat-legend">
                <span>Ít</span>
                <span className="an-heat-legend-swatches">
                  <span className="an-legend-cell" />
                  <span className="an-legend-cell" data-level={1} />
                  <span className="an-legend-cell" data-level={2} />
                  <span className="an-legend-cell" data-level={3} />
                  <span className="an-legend-cell" data-level={4} />
                </span>
                <span>Nhiều</span>
              </div>
            </Card>

            <div className="an-activity-stats">
              <div className="an-stat">
                <span className="an-stat-ico an-ico-streak">
                  <Flame aria-hidden="true" />
                </span>
                <span className="an-stat-body">
                  <span className="an-stat-num">{longest} ngày</span>
                  <span className="an-stat-lbl">Kỷ lục chuỗi</span>
                </span>
              </div>
              <div className="an-stat">
                <span className="an-stat-ico an-ico-days">
                  <CalendarCheck aria-hidden="true" />
                </span>
                <span className="an-stat-body">
                  <span className="an-stat-num">{heatmap.totalActiveDays}</span>
                  <span className="an-stat-lbl">Tổng ngày hoạt động</span>
                </span>
              </div>
            </div>
          </div>
        )}
      </div>

      <div className="dl-dash-foot">
        <Button variant="danger" size="sm" onClick={onReset}>
          Đặt lại tiến độ
        </Button>
      </div>
    </div>
  );
}

/** Chip mũi tên ↑/↓ so sánh XP với tuần trước (null → chưa có dữ liệu). */
function DeltaChip({ improvement }: { improvement: number | null }) {
  if (improvement === null) return <span className="an-delta">—</span>;
  if (improvement > 0)
    return (
      <span className="an-delta an-delta--good">
        <ArrowUp aria-hidden="true" />
        {improvement}%
      </span>
    );
  if (improvement < 0)
    return (
      <span className="an-delta an-delta--bad">
        <ArrowDown aria-hidden="true" />
        {Math.abs(improvement)}%
      </span>
    );
  return <span className="an-delta">0%</span>;
}

/**
 * Thứ 2 (00:00 giờ địa phương) của tuần chứa `d`, dịch thêm `weekOffset` tuần.
 * getDay(): 0=CN..6=T7; đưa về T2 rồi cộng offset — Date tự chuẩn hóa qua
 * tháng/DST vì luôn tạo bằng constructor theo lịch địa phương.
 */
function startOfWeekMonday(d: Date, weekOffset = 0): Date {
  const day = d.getDay();
  const deltaToMonday = day === 0 ? -6 : 1 - day;
  return new Date(d.getFullYear(), d.getMonth(), d.getDate() + deltaToMonday + weekOffset * 7);
}

/** Một dòng nhận xét tự sinh cho tab "Tuần này". */
function weeklyNote(thisXp: number, improvement: number | null): string {
  if (thisXp === 0) return 'Chưa có hoạt động tuần này — hoàn thành một bài để bắt đầu nhé!';
  if (improvement === null) return 'Tuần học đầu tiên của bạn — khởi đầu tốt, cứ duy trì nhé!';
  if (improvement > 0)
    return `Tuần này bạn học chăm hơn tuần trước ${improvement}%. Tiếp tục phát huy!`;
  if (improvement < 0)
    return `Tuần này chậm hơn tuần trước ${Math.abs(improvement)}%. Cố lên tuần tới nhé!`;
  return 'Bạn giữ nhịp học ổn định như tuần trước — rất đều đặn!';
}
