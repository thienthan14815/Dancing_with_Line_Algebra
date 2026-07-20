import { useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import type { CheckResult, Exercise } from '../../core/exercises/types';
import { EXERCISES } from '../../core/content/exerciseBank';
import { SKILL_BY_ID } from '../../core/content/skills';
import { useLearnStore } from '../../core/progress/store';
import { Card } from '../ui';
import TutorPanel from './TutorPanel';

// ===========================================================================
// TUTOR HUB — trang host mỏng cho TutorPanel có sẵn.
// KHÔNG viết logic tutor mới: chỉ compose component + chọn 1 exercise để phân
// tích. Ưu tiên các lỗi gần đây (từ store.attempts) map được về exerciseBank;
// nếu không có, fallback một câu mẫu + lời nhắc "AI hoạt động trong từng bài".
// Style riêng ở shell.css với prefix `dl-tutorhub-` (KHÔNG đụng tutor.css).
// ===========================================================================

interface RecentMistake {
  exercise: Exercise;
  lastResult: CheckResult;
}

function snippet(text: string, max = 52): string {
  const t = text.trim();
  return t.length > max ? `${t.slice(0, max)}…` : t;
}

export default function TutorHub() {
  const attempts = useLearnStore((s) => s.attempts);

  const byId = useMemo(() => {
    const m = new Map<string, Exercise>();
    for (const ex of EXERCISES) m.set(ex.id, ex);
    return m;
  }, []);

  // Lỗi gần đây, mới nhất trước, tối đa 6, không trùng exercise.
  const recent = useMemo<RecentMistake[]>(() => {
    const seen = new Set<string>();
    const out: RecentMistake[] = [];
    for (let i = attempts.length - 1; i >= 0 && out.length < 6; i--) {
      const a = attempts[i];
      if (a.isCorrect || seen.has(a.exerciseId)) continue;
      const ex = byId.get(a.exerciseId);
      if (!ex) continue;
      seen.add(a.exerciseId);
      out.push({
        exercise: ex,
        lastResult: {
          correct: false,
          feedback:
            'Bạn từng trả lời chưa đúng câu này. Cùng phân tích lại rồi luyện gợi ý theo 4 cấp nhé.',
          ...(a.errorType ? { errorType: a.errorType } : {}),
        },
      });
    }
    return out;
  }, [attempts, byId]);

  const [sel, setSel] = useState(0);
  const active = recent.length > 0 ? recent[Math.min(sel, recent.length - 1)] : null;

  // Câu mẫu khi chưa có lỗi nào để phân tích.
  const sample = byId.get('eb-vec-norm') ?? EXERCISES[0];

  return (
    <div className="dl-page dl-tutorhub">
      <div className="dl-tutorhub-head">
        <h1 className="dl-tutorhub-title">Gia sư AI</h1>
        <p className="dl-muted">
          Gia sư AI hoạt động ngay trong từng bài học. Tại đây bạn có thể xem lại lỗi
          gần đây và luyện gợi ý Socratic theo 4 cấp — không đưa đáp án quá sớm.
        </p>
      </div>

      {active ? (
        <>
          <div className="dl-tutorhub-mistakes">
            <span className="dl-tutorhub-label">Lỗi gần đây</span>
            <div className="dl-tutorhub-chips">
              {recent.map((m, i) => {
                const name = SKILL_BY_ID[m.exercise.skillId]?.name ?? m.exercise.skillId;
                const isActive = i === Math.min(sel, recent.length - 1);
                return (
                  <button
                    key={m.exercise.id}
                    type="button"
                    className={`dl-tutorhub-chip ${isActive ? 'active' : ''}`}
                    onClick={() => setSel(i)}
                    title={m.exercise.prompt}
                  >
                    <span className="dl-tutorhub-chip-skill">{name}</span>
                    <span className="dl-tutorhub-chip-prompt">{snippet(m.exercise.prompt)}</span>
                  </button>
                );
              })}
            </div>
          </div>

          <TutorPanel
            key={active.exercise.id}
            exercise={active.exercise}
            lastResult={active.lastResult}
          />
        </>
      ) : (
        <>
          <Card className="dl-tutorhub-empty">
            <p className="dl-tutorhub-empty-text">
              Chưa có lỗi nào gần đây để phân tích. Hãy thử một câu mẫu bên dưới để xem
              gia sư gợi ý thế nào, hoặc bắt đầu học để tích lũy dữ liệu.
            </p>
            <Link className="dl-btn dl-btn-primary dl-btn-md" to="/">
              Bắt đầu học
            </Link>
          </Card>

          {sample && <TutorPanel key={sample.id} exercise={sample} />}
        </>
      )}
    </div>
  );
}
