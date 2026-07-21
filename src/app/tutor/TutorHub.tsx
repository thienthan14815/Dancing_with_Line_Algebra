import { useEffect, useMemo, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  MessageCircleQuestionMark,
  PencilLine,
  Target,
  Lightbulb,
  Send,
  Sparkles,
  GraduationCap,
} from 'lucide-react';
import type { CheckResult, Exercise } from '../../core/exercises/types';
import { EXERCISES } from '../../core/content/exerciseBank';
import { SKILL_BY_ID } from '../../core/content/skills';
import { COURSE, flatMicroLessons } from '../../core/content/course';
import { useLearnStore } from '../../core/progress/store';
import { useCompletion } from '../state/completion';
import { lessonDone } from '../lib/progress';
import { recommendNext } from '../path/recommend';
import { getSearchIndex, search, GROUP_LABEL } from '../search';
import type { SearchItem } from '../search';
import { LinalCharacter } from '../ui';
import TutorPanel from './TutorPanel';
import './tutor.css';

// ===========================================================================
// AI TUTOR HUB — màn "Gia sư AI" (screen aiTutor). Nhân vật Linal + 4 quick
// action HÀNH VI THẬT + suggestion chips + composer chạy search THẬT. KHÔNG
// fake chat, KHÔNG voice input. Trợ giảng Socratic (TutorPanel) + khối "Lỗi
// gần đây" giữ nguyên chức năng cũ. Mọi màu/gradient/shadow dùng token var().
// ===========================================================================

interface RecentMistake {
  exercise: Exercise;
  lastResult: CheckResult;
}

/** 3 gợi ý câu hỏi — bấm để đổ vào composer & tìm ngay. */
const SUGGESTIONS = ['Tổ hợp tuyến tính là gì?', 'Ma trận nghịch đảo', 'Trực giao là gì?'];

function snippet(text: string, max = 52): string {
  const t = text.trim();
  return t.length > max ? `${t.slice(0, max)}…` : t;
}

export default function TutorHub() {
  const navigate = useNavigate();
  const attempts = useLearnStore((s) => s.attempts);
  const mastery = useLearnStore((s) => s.masteryBySkill);
  const done = useCompletion((s) => s.done);

  const flat = useMemo(() => flatMicroLessons(), []);

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

  // Câu mẫu khi chưa có lỗi nào để phân tích (giữ demo TutorPanel).
  const sample = byId.get('eb-vec-norm') ?? EXERCISES[0];

  // Gợi ý bài kế tiếp dựa đồ thị tri thức (chỉ import recommendNext).
  const recommendation = useMemo(
    () => recommendNext({ mastery, flat, isDone: (l) => lessonDone(l, mastery, done) }),
    [mastery, flat, done],
  );
  const reasonName = recommendation?.reasonSkillId
    ? SKILL_BY_ID[recommendation.reasonSkillId]?.name
    : undefined;
  const sectionTitle = (sectionId: string): string =>
    COURSE.sections.find((s) => s.id === sectionId)?.title ?? '';

  // --- Trạng thái UI: card gợi ý + kết quả tìm kiếm + nội dung composer ---
  const [showTip, setShowTip] = useState(false);
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<SearchItem[] | null>(null);

  const tipRef = useRef<HTMLDivElement>(null);
  const mistakesRef = useRef<HTMLElement>(null);
  const resultsRef = useRef<HTMLElement>(null);

  useEffect(() => {
    if (showTip) tipRef.current?.scrollIntoView({ behavior: 'smooth', block: 'center' });
  }, [showTip]);

  useEffect(() => {
    if (results) resultsRef.current?.scrollIntoView({ behavior: 'smooth', block: 'center' });
  }, [results]);

  const runSearch = (raw: string) => {
    const q = raw.trim();
    if (!q) return;
    setResults(search(getSearchIndex(), q, 6));
  };

  // --- Hành vi 4 quick action (THẬT) ---
  const openMistakes = () => {
    if (recent.length === 0) {
      navigate('/luyen');
      return;
    }
    mistakesRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  const quickActions: { id: string; icon: typeof Target; label: string; onClick: () => void }[] = [
    {
      id: 'explain',
      icon: MessageCircleQuestionMark,
      label: 'Giải thích khái niệm',
      onClick: () => window.dispatchEvent(new CustomEvent('la:open-search')),
    },
    { id: 'solve', icon: PencilLine, label: 'Giải bài lỗi sai', onClick: openMistakes },
    { id: 'practice', icon: Target, label: 'Luyện tập', onClick: () => navigate('/luyen') },
    { id: 'tip', icon: Lightbulb, label: 'Gợi ý học tập', onClick: () => setShowTip(true) },
  ];

  return (
    <div className="la-page tt-hub">
      {/* 1) Hero nhân vật Linal */}
      <section className="la-card-xl la-hero-grad tt-hero">
        <LinalCharacter size={120} />
        <h1 className="tt-hero-title">Xin chào! 👋</h1>
        <p className="tt-hero-sub">
          Mình là Linal — trợ giảng của bạn. Mình giải thích khái niệm, mổ xẻ lỗi sai và
          gợi ý bước tiếp theo.
        </p>
      </section>

      {/* 2) 4 quick action grid 2×2 — hành vi thật */}
      <div className="tt-quick">
        {quickActions.map((qa) => {
          const Icon = qa.icon;
          return (
            <button key={qa.id} type="button" className="la-card tt-qa" onClick={qa.onClick}>
              <span className="tt-qa-ico" aria-hidden="true">
                <Icon size={22} strokeWidth={2} />
              </span>
              <span className="tt-qa-label">{qa.label}</span>
            </button>
          );
        })}
      </div>

      {/* 3) Card gợi ý học tập (bật bởi quick action "Gợi ý học tập") */}
      {showTip && (
        <div ref={tipRef} className="la-card tt-tip">
          <div className="tt-tip-head">
            <span className="tt-tip-ico" aria-hidden="true">
              <Lightbulb size={18} strokeWidth={2} />
            </span>
            <span className="tt-tip-label">Gợi ý học tập</span>
          </div>
          {recommendation ? (
            <>
              <p className="tt-tip-title">{recommendation.lesson.lesson.title}</p>
              <p className="tt-tip-sub">
                {reasonName ? `Vì bạn vừa vững: ${reasonName} · ` : ''}
                {sectionTitle(recommendation.lesson.sectionId)}
              </p>
              <button
                type="button"
                className="la-btn la-btn-sm la-btn-primary tt-tip-cta"
                onClick={() => navigate(`/learn/${recommendation.lesson.lesson.id}`)}
              >
                <GraduationCap size={16} strokeWidth={2} />
                Học bài này
              </button>
            </>
          ) : (
            <>
              <p className="tt-tip-title">Bạn đã hoàn thành mọi bài học có sẵn 🎉</p>
              <button
                type="button"
                className="la-btn la-btn-sm la-btn-secondary tt-tip-cta"
                onClick={() => navigate('/lo-trinh')}
              >
                Xem lộ trình
              </button>
            </>
          )}
        </div>
      )}

      {/* 4) Suggestion chips → đổ vào composer & tìm ngay */}
      <div className="tt-suggest">
        <p className="tt-suggest-label">Gợi ý câu hỏi</p>
        <div className="la-chip-row tt-suggest-row">
          {SUGGESTIONS.map((s) => (
            <button
              key={s}
              type="button"
              className="la-chip tt-suggest-chip"
              onClick={() => {
                setQuery(s);
                runSearch(s);
              }}
            >
              {s}
            </button>
          ))}
        </div>
      </div>

      {/* 5) Lỗi gần đây (mistake chips + TutorPanel) — giữ chức năng cũ */}
      <section ref={mistakesRef} className="tt-mistakes">
        <div className="la-sec-head">
          <span className="la-sec-title">Lỗi gần đây</span>
        </div>
        {active ? (
          <>
            <div className="la-chip-row tt-mistake-row">
              {recent.map((m, i) => {
                const name = SKILL_BY_ID[m.exercise.skillId]?.name ?? m.exercise.skillId;
                const isActive = i === Math.min(sel, recent.length - 1);
                return (
                  <button
                    key={m.exercise.id}
                    type="button"
                    className={`tt-mistake-chip${isActive ? ' active' : ''}`}
                    onClick={() => setSel(i)}
                    title={m.exercise.prompt}
                  >
                    <span className="tt-mistake-skill">{name}</span>
                    <span className="tt-mistake-prompt">{snippet(m.exercise.prompt)}</span>
                  </button>
                );
              })}
            </div>
            <TutorPanel
              key={active.exercise.id}
              exercise={active.exercise}
              lastResult={active.lastResult}
            />
          </>
        ) : (
          <>
            <p className="la-empty">
              Chưa có lỗi nào gần đây để phân tích. Xem thử một câu mẫu bên dưới, hoặc bắt đầu
              luyện tập để tích lũy dữ liệu.
            </p>
            {sample && <TutorPanel key={sample.id} exercise={sample} />}
          </>
        )}
      </section>

      {/* 6) Kết quả tìm kiếm của composer */}
      {results && (
        <section ref={resultsRef} className="la-card tt-results">
          <div className="tt-results-head">
            <Sparkles size={18} strokeWidth={2} />
            <span>Linal tìm thấy:</span>
          </div>
          {results.length === 0 ? (
            <p className="la-empty">Chưa tìm thấy nội dung khớp. Thử một từ khoá khác nhé.</p>
          ) : (
            <ul className="tt-results-list">
              {results.map((it) => {
                const Icon = it.icon;
                return (
                  <li key={it.key}>
                    <button
                      type="button"
                      className="tt-result"
                      onClick={() => navigate(it.route)}
                    >
                      <span className="tt-result-ico" aria-hidden="true">
                        <Icon size={18} strokeWidth={2} />
                      </span>
                      <span className="tt-result-main">
                        <span className="tt-result-title">{it.title}</span>
                        {it.subtitle && <span className="tt-result-sub">{it.subtitle}</span>}
                      </span>
                      <span className="la-badge tt-result-badge">{GROUP_LABEL[it.group]}</span>
                    </button>
                  </li>
                );
              })}
            </ul>
          )}
          <p className="tt-api-note">
            Chat AI đầy đủ sẽ mở khi cấu hình API key trong Cài đặt.
          </p>
        </section>
      )}

      {/* 7) Composer — mobile: dính trên bottom bar; desktop: cuối cột */}
      <form
        className="tt-composer"
        onSubmit={(e) => {
          e.preventDefault();
          runSearch(query);
        }}
      >
        <input
          className="tt-composer-input"
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Nhập câu hỏi của bạn..."
          aria-label="Nhập câu hỏi cho gia sư Linal"
          autoComplete="off"
          enterKeyHint="search"
        />
        <button type="submit" className="tt-send" aria-label="Gửi câu hỏi">
          <Send size={18} strokeWidth={2} />
        </button>
      </form>
    </div>
  );
}
