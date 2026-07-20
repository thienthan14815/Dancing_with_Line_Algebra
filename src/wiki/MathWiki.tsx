import './wiki.css';
import { useMemo, useState } from 'react';
import MathText from '../components/MathText';
import { SYMBOLS, CATEGORIES, type WikiSymbol } from './symbols';

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

export default function MathWiki() {
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
    <div className="page">
      <header className="wiki-head">
        <h1 className="wiki-title">Math Wiki</h1>
        <p className="wiki-lede">
          Tra cứu nhanh mọi ký hiệu toán học dùng trong đại số tuyến tính — tên, ý
          nghĩa, và quan trọng nhất: <b>dùng để tính/làm gì</b>. Nhấp vào "Học sâu →" ở
          mỗi thẻ để xem ký hiệu đó được dùng ở đâu trong app.
        </p>
      </header>

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
    </div>
  );
}
