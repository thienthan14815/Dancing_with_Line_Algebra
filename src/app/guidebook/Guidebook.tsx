import { useParams, Link } from 'react-router-dom';
import { COURSE, getSection } from '../../core/content/course';
import type { Section } from '../../core/content/types';
import { getGuideEntry } from './content';
import MathText from '../../components/MathText';
import { Card, Button } from '../ui';
import './guidebook.css';

/**
 * SỔ TAY (Guidebook) — một component phục vụ cả hai route:
 *   #/so-tay            → danh sách Section
 *   #/so-tay/:sectionId → trang chi tiết
 */
export default function Guidebook() {
  const { sectionId } = useParams();
  if (sectionId) return <GuidebookDetail sectionId={sectionId} />;
  return <GuidebookList />;
}

// ---------------------------------------------------------------------------
// DANH SÁCH SECTION
// ---------------------------------------------------------------------------
function GuidebookList() {
  return (
    <div className="dl-page gb-page">
      <header className="gb-hero">
        <h1 className="gb-hero-title">Sổ tay</h1>
      </header>

      <div className="gb-index">
        {getGuideEntry('dl-map') && (
          <Link to="/so-tay/dl-map" className="gb-row">
            <span className="gb-row-num" aria-hidden>
              🗺️
            </span>
            <span className="gb-row-title">Bản đồ Deep Learning</span>
            <span className="gb-row-arrow" aria-hidden>
              →
            </span>
          </Link>
        )}
        {COURSE.sections.map((section) => (
          <Link key={section.id} to={`/so-tay/${section.id}`} className="gb-row">
            <span className="gb-row-num">{section.num}</span>
            <span className="gb-row-title">{section.title}</span>
            <span className="gb-row-arrow" aria-hidden>
              →
            </span>
          </Link>
        ))}
      </div>
    </div>
  );
}

// ---------------------------------------------------------------------------
// CHI TIẾT MỘT SECTION
// ---------------------------------------------------------------------------
function GuidebookDetail({ sectionId }: { sectionId: string }) {
  const entry = getGuideEntry(sectionId);
  const section = getSection(sectionId);

  if (!entry) {
    return (
      <div className="dl-page gb-page">
        <Card className="gb-notfound">
          <h2>Không tìm thấy mục sổ tay</h2>
          <p className="dl-muted">
            Section “{sectionId}” không tồn tại hoặc chưa có nội dung sổ tay.
          </p>
          <Link to="/so-tay" className="gb-back-link">
            ← Về danh sách Sổ tay
          </Link>
        </Card>
      </div>
    );
  }

  const lessonId = section ? firstLessonId(section) : undefined;

  return (
    <div className="dl-page gb-page gb-detail">
      <Link to="/so-tay" className="gb-back-link">
        ← Sổ tay
      </Link>

      <header className="gb-detail-head">
        {section && <span className="gb-detail-num">{section.num}</span>}
        <div>
          <h1 className="gb-detail-title">{entry.nameVi}</h1>
          <p className="gb-detail-en">{entry.nameEn}</p>
          {section && <p className="dl-muted gb-detail-sub">{section.subtitle}</p>}
        </div>
      </header>

      {/* Khái niệm cốt lõi */}
      <Card className="gb-sec">
        <h2 className="gb-sec-title">🧭 Khái niệm cốt lõi</h2>
        <ul className="gb-list">
          {entry.concepts.map((c, i) => (
            <li key={i}>{c}</li>
          ))}
        </ul>
      </Card>

      {/* Ký hiệu */}
      <Card className="gb-sec">
        <h2 className="gb-sec-title">✍️ Ký hiệu</h2>
        <div className="gb-symbols">
          {entry.symbols.map((s, i) => (
            <div key={i} className="gb-symbol">
              <span className="gb-symbol-tex">
                <MathText tex={s.tex} />
              </span>
              <span className="gb-symbol-desc">{s.desc}</span>
            </div>
          ))}
        </div>
      </Card>

      {/* Công thức chính */}
      <Card className="gb-sec">
        <h2 className="gb-sec-title">📐 Công thức chính</h2>
        <div className="gb-formulas">
          {entry.formulas.map((f, i) => (
            <div key={i} className="gb-formula">
              <div className="gb-formula-tex">
                <MathText block tex={f.tex} />
              </div>
              <p className="gb-formula-desc">{f.desc}</p>
            </div>
          ))}
        </div>
      </Card>

      {/* Trực giác + Ví dụ */}
      <div className="gb-two">
        <Card className="gb-sec gb-intuition">
          <h2 className="gb-sec-title">🌀 Trực giác hình học</h2>
          <p className="gb-intuition-text">{entry.intuition}</p>
        </Card>
        <Card className="gb-sec gb-example">
          <h2 className="gb-sec-title">💡 Ví dụ ngắn</h2>
          <p>{entry.example.text}</p>
          {entry.example.tex && (
            <div className="gb-example-tex">
              <MathText block tex={entry.example.tex} />
            </div>
          )}
        </Card>
      </div>

      {/* Lỗi thường gặp */}
      <Card className="gb-sec gb-pitfalls">
        <h2 className="gb-sec-title">⚠️ Lỗi thường gặp</h2>
        <ul className="gb-list gb-list-warn">
          {entry.pitfalls.map((p, i) => (
            <li key={i}>{p}</li>
          ))}
        </ul>
      </Card>

      {/* Ứng dụng thực tế */}
      <Card className="gb-sec">
        <h2 className="gb-sec-title">🚀 Ứng dụng thực tế</h2>
        <ul className="gb-list gb-list-good">
          {entry.applications.map((a, i) => (
            <li key={i}>{a}</li>
          ))}
        </ul>
      </Card>

      {/* Hành động */}
      <div className="gb-actions">
        {section && lessonId && (
          <Link
            to={`/ch/${section.id}/${lessonId}`}
            className="gb-action-link"
          >
            <Button size="lg" block>
              📚 Vào học Section này
            </Button>
          </Link>
        )}
        <Link to="/wiki" className="gb-action-link">
          <Button size="lg" variant="ghost" block>
            🔤 Mở Math Wiki
          </Button>
        </Link>
      </div>
    </div>
  );
}

// ---------------------------------------------------------------------------
// HELPERS
// ---------------------------------------------------------------------------

/**
 * Id micro-lesson đầu tiên để học Section (khớp route cũ #/ch/:chapterId/:lessonId).
 * Unit.id có dạng "<sectionId>:<lessonId>" nên tách phần sau dấu ':'.
 */
function firstLessonId(section: Section): string | undefined {
  const firstUnit = section.units[0];
  if (!firstUnit) return undefined;
  const parts = firstUnit.id.split(':');
  return parts.length > 1 ? parts[1] : firstUnit.id;
}
