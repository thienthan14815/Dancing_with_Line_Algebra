import './wiki.css';
import { useMemo, useState } from 'react';
import MathText from '../components/MathText';
import { SYMBOLS, CATEGORIES, type WikiSymbol } from './symbols';
import { FORMULAS, type Formula } from './formulas';
import { flatMicroLessons } from '../core/content/course';

/** Bỏ dấu tiếng Việt + hạ chữ thường để search "gõ không dấu" vẫn khớp. */
function normalize(s: string): string {
  return s
    .toLowerCase()
    .normalize('NFD')
    .replace(/\p{Diacritic}/gu, '')
    .replace(/đ/g, 'd');
}

const CAT_LABEL: Record<string, string> = Object.fromEntries(
  CATEGORIES.map((c) => [c.id, c.label]),
);

/**
 * Map skillId → id micro-lesson "concept" đầu tiên rèn skill đó.
 * Dùng để link "Học kỹ năng liên quan" của mỗi công thức sang /learn.
 * Nếu skill không có bài concept nào → không có trong map (fallback /luyen).
 */
const SKILL_TO_LESSON: Record<string, string> = (() => {
  const map: Record<string, string> = {};
  for (const f of flatMicroLessons()) {
    if (f.lesson.kind !== 'concept') continue;
    for (const sid of f.lesson.skillIds) {
      if (!(sid in map)) map[sid] = f.lesson.id;
    }
  }
  return map;
})();

function SymbolCard({ sym }: { sym: WikiSymbol }) {
  return (
    <div className="wiki-card">
      <div className="wiki-card-top">
        <div className="wiki-sym">
          <MathText tex={sym.tex} />
        </div>
        <span className="wiki-cat-tag">{CAT_LABEL[sym.category] ?? sym.category}</span>
      </div>

      <div className="wiki-names">
        <span className="wiki-name">{sym.name}</span>
        <span className="wiki-en">{sym.en}</span>
      </div>

      <p className="wiki-meaning">{sym.meaning}</p>

      <div>
        <span className="wiki-usedfor-label">Dùng để</span>
        <ul className="wiki-usedfor">
          {sym.usedFor.map((u, i) => (
            <li key={i}>{u}</li>
          ))}
        </ul>
      </div>

      {sym.example && (
        <div className="wiki-example">
          <MathText block tex={sym.example.tex} />
          {sym.example.note && <p className="wiki-example-note">{sym.example.note}</p>}
        </div>
      )}

      {sym.seeChapter && (
        <div className="wiki-see">
          <a href={`#/ch/${sym.seeChapter.id}/${sym.seeChapter.lessonId}`}>
            {sym.seeChapter.label} <span aria-hidden="true">→</span>
          </a>
        </div>
      )}
    </div>
  );
}

/** Tab "Ký hiệu" — từ điển ký hiệu (UI cũ, giữ nguyên). */
function SymbolLibrary() {
  const [query, setQuery] = useState('');
  const [activeCat, setActiveCat] = useState<string | null>(null);

  const filtered = useMemo(() => {
    const raw = query.trim();
    const q = normalize(raw);
    const rawLower = raw.toLowerCase();
    return SYMBOLS.filter((s) => {
      if (activeCat && s.category !== activeCat) return false;
      if (!q) return true;
      const haystack = normalize(
        `${s.name} ${s.en} ${s.meaning} ${s.tex} ${s.usedFor.join(' ')}`,
      );
      // cho phép so khớp cả chuỗi tex thô (giữ dấu backslash)
      const rawHay = `${s.tex} ${s.name} ${s.en} ${s.meaning}`.toLowerCase();
      return haystack.includes(q) || rawHay.includes(rawLower);
    });
  }, [query, activeCat]);

  return (
    <>
      <div className="wiki-controls">
        <input
          className="wiki-search"
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Tìm theo tên, tiếng Anh, ý nghĩa hoặc ký hiệu (vd: tri rieng, det, norm)…"
          aria-label="Tìm ký hiệu"
        />
        <span className="wiki-count">
          Hiển thị <b>{filtered.length}</b> / tổng {SYMBOLS.length} ký hiệu
        </span>
      </div>

      <div className="wiki-cats">
        <button
          className={`wiki-chip${activeCat === null ? ' active' : ''}`}
          onClick={() => setActiveCat(null)}
        >
          Tất cả
        </button>
        {CATEGORIES.map((c) => (
          <button
            key={c.id}
            className={`wiki-chip${activeCat === c.id ? ' active' : ''}`}
            onClick={() => setActiveCat((prev) => (prev === c.id ? null : c.id))}
          >
            {c.label}
          </button>
        ))}
      </div>

      {filtered.length === 0 ? (
        <div className="wiki-empty">
          Không tìm thấy ký hiệu nào khớp "{query}". Thử từ khóa khác hoặc bỏ bộ lọc
          category.
        </div>
      ) : (
        <div className="wiki-grid">
          {filtered.map((sym) => (
            <SymbolCard key={`${sym.category}-${sym.tex}-${sym.en}`} sym={sym} />
          ))}
        </div>
      )}
    </>
  );
}

/** Một thẻ công thức — mặc định gọn 1 dòng, bấm để mở 4 phần. */
function FormulaCard({
  fx,
  open,
  onToggle,
}: {
  fx: Formula;
  open: boolean;
  onToggle: () => void;
}) {
  const lessonId = SKILL_TO_LESSON[fx.skillId];
  const href = lessonId ? `#/learn/${lessonId}` : '#/luyen';

  return (
    <div className={`fx-card${open ? ' fx-open' : ''}`}>
      <button
        className="fx-card-head"
        onClick={onToggle}
        aria-expanded={open}
        type="button"
      >
        <span className="fx-head-names">
          <span className="fx-name">{fx.name}</span>
          <span className="fx-en">{fx.en}</span>
        </span>
        <span className="fx-head-tex" aria-hidden="true">
          <MathText tex={fx.tex} />
        </span>
        <span className="fx-toggle" aria-hidden="true">
          {open ? '−' : '+'}
        </span>
      </button>

      {open && (
        <div className="fx-body">
          <section className="fx-section">
            <span className="fx-label">Công thức</span>
            <div className="fx-formula">
              <MathText block tex={fx.tex} />
            </div>
          </section>

          <section className="fx-section">
            <span className="fx-label">Trực giác</span>
            <p className="fx-text">{fx.intuition}</p>
          </section>

          <section className="fx-section">
            <span className="fx-label">Dẫn xuất</span>
            <ol className="fx-steps">
              {fx.steps.map((s, i) => (
                <li key={i}>{s}</li>
              ))}
            </ol>
          </section>

          <section className="fx-section">
            <span className="fx-label">Ví dụ</span>
            <div className="fx-example">
              <MathText block tex={fx.example.tex} />
              {fx.example.note && <p className="fx-example-note">{fx.example.note}</p>}
            </div>
          </section>

          <div className="fx-see">
            <a href={href}>
              Học kỹ năng liên quan <span aria-hidden="true">→</span>
            </a>
          </div>
        </div>
      )}
    </div>
  );
}

/** Tab "Công thức" — thư viện công thức có collapse. */
function FormulaLibrary() {
  const [query, setQuery] = useState('');
  const [openIds, setOpenIds] = useState<Record<string, boolean>>({});

  const toggle = (id: string) =>
    setOpenIds((prev) => ({ ...prev, [id]: !prev[id] }));

  const filtered = useMemo(() => {
    const raw = query.trim();
    const q = normalize(raw);
    const rawLower = raw.toLowerCase();
    return FORMULAS.filter((f) => {
      if (!q) return true;
      const haystack = normalize(
        `${f.name} ${f.en} ${f.category} ${f.intuition} ${f.tags.join(' ')} ${f.steps.join(' ')}`,
      );
      const rawHay = `${f.tex} ${f.name} ${f.en}`.toLowerCase();
      return haystack.includes(q) || rawHay.includes(rawLower);
    });
  }, [query]);

  return (
    <>
      <div className="wiki-controls">
        <input
          className="wiki-search"
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Tìm công thức (vd: chieu, svd, softmax, dinh thuc, least squares)…"
          aria-label="Tìm công thức"
        />
        <span className="wiki-count">
          Hiển thị <b>{filtered.length}</b> / tổng {FORMULAS.length} công thức
        </span>
      </div>

      {filtered.length === 0 ? (
        <div className="wiki-empty">
          Không tìm thấy công thức nào khớp "{query}". Thử từ khóa khác.
        </div>
      ) : (
        <div className="fx-list">
          {filtered.map((fx) => (
            <FormulaCard
              key={fx.id}
              fx={fx}
              open={!!openIds[fx.id]}
              onToggle={() => toggle(fx.id)}
            />
          ))}
        </div>
      )}
    </>
  );
}

export default function MathWiki() {
  const [tab, setTab] = useState<'symbols' | 'formulas'>('symbols');

  return (
    <div className="page">
      <header className="wiki-head">
        <h1 className="wiki-title">Math Wiki</h1>
        <p className="wiki-lede">
          Tra cứu nhanh mọi <b>ký hiệu</b> và <b>công thức</b> đại số tuyến tính — kèm
          trực giác, cách dẫn xuất và ví dụ số cụ thể. Nhấp "Học sâu / Học kỹ năng liên
          quan" để nối thẳng sang bài học tương ứng.
        </p>
      </header>

      <div className="fx-tabs" role="tablist" aria-label="Chế độ tra cứu">
        <button
          className={`fx-tab${tab === 'symbols' ? ' fx-tab-active' : ''}`}
          onClick={() => setTab('symbols')}
          role="tab"
          aria-selected={tab === 'symbols'}
          type="button"
        >
          Ký hiệu
        </button>
        <button
          className={`fx-tab${tab === 'formulas' ? ' fx-tab-active' : ''}`}
          onClick={() => setTab('formulas')}
          role="tab"
          aria-selected={tab === 'formulas'}
          type="button"
        >
          Công thức
        </button>
      </div>

      {tab === 'symbols' ? <SymbolLibrary /> : <FormulaLibrary />}
    </div>
  );
}
