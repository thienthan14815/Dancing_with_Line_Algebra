import { useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { Sparkles, GraduationCap, ArrowRight } from 'lucide-react';
import { flatMicroLessons } from '../../core/content/course';
import { SKILL_BY_ID } from '../../core/content/skills';
import { Card } from '../ui';
import TutorDiagram from './TutorDiagram';
import {
  WHITEBOARD_FIGURES,
  matchWhiteboard,
  whiteboardExercise,
  type WhiteboardFigure,
} from './diagramSpec';
import './whiteboard.css';

// ===========================================================================
// BẢNG VẼ AI (Whiteboard) — "hỏi khái niệm, AI vẽ thay vì trả lời bằng chữ".
// Pipeline HEURISTIC, KHÔNG gọi mạng: normalize (bỏ dấu) → matchWhiteboard →
// TutorDiagram vẽ figure + 2–3 câu trực giác + link "Học bài liên quan".
// Không match / chưa hỏi → danh sách chip khái niệm vẽ được (bấm = hỏi luôn),
// nên không bao giờ dead-end. Toàn bộ spec ở diagramSpec.ts (thuần dữ liệu).
// ===========================================================================

export default function Whiteboard() {
  const [query, setQuery] = useState('');
  const [active, setActive] = useState<WhiteboardFigure | null>(null);
  const [noMatch, setNoMatch] = useState(false);

  // skill → micro-lesson KHÁI NIỆM (ưu tiên concept, rồi practice/review) —
  // cùng cách map như KnowledgeMap để link "Học bài liên quan" trỏ đúng bài.
  const lessonForSkill = useMemo(() => {
    const flat = flatMicroLessons();
    const map = new Map<string, string>();
    for (const kind of ['concept', 'practice', 'review'] as const) {
      for (const f of flat) {
        if (f.lesson.kind !== kind) continue;
        for (const sid of f.lesson.skillIds) if (!map.has(sid)) map.set(sid, f.lesson.id);
      }
    }
    return map;
  }, []);

  const learnHref = (fig: WhiteboardFigure): string => {
    const id = lessonForSkill.get(fig.relatedSkill) ?? lessonForSkill.get(fig.skillId);
    return id ? `/learn/${id}` : '/luyen';
  };

  const ask = (raw: string) => {
    const fig = matchWhiteboard(raw);
    setActive(fig);
    setNoMatch(!fig && raw.trim().length > 0);
  };

  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    ask(query);
  };

  const pick = (fig: WhiteboardFigure) => {
    setQuery(fig.label);
    setActive(fig);
    setNoMatch(false);
  };

  const chipLabel = active
    ? 'Vẽ khái niệm khác:'
    : noMatch
      ? 'Chưa vẽ được khái niệm đó. Thử một trong các khái niệm sau:'
      : 'Gợi ý — bấm để AI vẽ ngay:';

  return (
    <Card className="dl-card-ai wb-card">
      <div className="wb-head">
        <span className="wb-head-icon dl-card-ai-icon" aria-hidden="true">
          <Sparkles size={20} strokeWidth={2} />
        </span>
        <div className="wb-head-text">
          <h2 className="wb-title">Bảng vẽ AI</h2>
          <p className="wb-sub">
            Hỏi một khái niệm, AI sẽ vẽ hình minh hoạ thay vì trả lời bằng chữ.
          </p>
        </div>
      </div>

      <form className="wb-form" onSubmit={onSubmit}>
        <input
          className="wb-input"
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Hỏi một khái niệm để AI vẽ (vd: chiếu vector, span, eigenvector…)"
          aria-label="Hỏi một khái niệm để AI vẽ"
        />
        <button className="wb-submit" type="submit">
          <Sparkles size={17} strokeWidth={2} />
          Vẽ
        </button>
      </form>

      <p className="wb-caption">Bản heuristic — kết nối LLM ở Cài đặt (sắp có)</p>

      {active && (
        <div className="wb-result">
          <TutorDiagram key={active.key} exercise={whiteboardExercise(active)} />
          <p className="wb-intuition">{active.intuition}</p>
          <div className="wb-related">
            <Link className="wb-learn" to={learnHref(active)}>
              <GraduationCap size={17} strokeWidth={2} />
              <span className="wb-learn-text">
                Học bài liên quan
                <span className="wb-learn-skill">
                  {SKILL_BY_ID[active.relatedSkill]?.name ?? active.label}
                </span>
              </span>
              <ArrowRight size={16} strokeWidth={2} className="wb-learn-go" />
            </Link>
          </div>
        </div>
      )}

      <div className="wb-suggest">
        <p className="wb-suggest-label">{chipLabel}</p>
        <div className="wb-chips">
          {WHITEBOARD_FIGURES.map((f) => (
            <button
              key={f.key}
              type="button"
              className={`wb-chip${active?.key === f.key ? ' is-active' : ''}`}
              onClick={() => pick(f)}
            >
              {f.label}
            </button>
          ))}
        </div>
      </div>
    </Card>
  );
}
