import './roadmap.css';
import { Fragment } from 'react';
import MathText from '../components/MathText';
import { useProgress } from '../lib/progress';
import { chapters, flatLessons } from '../chapters/registry';

/* ============================================================
   DỮ LIỆU LỘ TRÌNH
   - href / related dùng key dạng "chapterId/lessonId" — khớp
     đúng format của completedLessons và route #/ch/:chapterId/:lessonId.
   - formula viết bằng String.raw để giữ nguyên MỘT dấu backslash
     cho TeX (KaTeX) khi vào runtime.
   ============================================================ */

interface StepNode {
  badge: string;
  title: string;
  summary: string;
  formula?: string;
  href: string; // "chapterId/lessonId"
  related: string[]; // ["chapterId/lessonId", ...]
}

const STEPS: StepNode[] = [
  {
    badge: '0',
    title: 'Kiến thức nền',
    summary:
      'Tọa độ, hàm số, lượng giác và ký hiệu toán học — đủ để bắt đầu. Bạn không cần giỏi giải tích trước.',
    href: 'ch0-foundations/coordinates',
    related: [
      'ch0-foundations/coordinates',
      'ch0-foundations/functions',
      'ch0-foundations/trig',
      'ch0-foundations/notation',
    ],
  },
  {
    badge: '1',
    title: 'Vector',
    summary:
      'Vector hàng/cột, 2D–3D, cộng trừ, nhân vô hướng, độ dài, vector đơn vị, dot product và góc giữa hai vector.',
    formula: String.raw`\|\vec v\| = \sqrt{3^2 + 4^2} = 5`,
    href: 'ch1-vectors/intro',
    related: ['ch1-vectors/intro', 'ch1-vectors/addition', 'ch1-vectors/scaling', 'ch1-vectors/dot'],
  },
  {
    badge: '2',
    title: 'Tổ hợp tuyến tính',
    summary:
      'Tạo vector mới từ vector có sẵn. Span, phụ thuộc và độc lập tuyến tính — phần cốt lõi để hiểu bản chất.',
    formula: String.raw`\vec w = a\,\vec u + b\,\vec v`,
    href: 'ch1-vectors/combination',
    related: ['ch1-vectors/combination'],
  },
  {
    badge: '3',
    title: 'Hệ phương trình tuyến tính',
    summary:
      'Viết hệ dưới dạng Ax = b. Ma trận mở rộng, Gaussian elimination, RREF; nghiệm duy nhất / vô số / vô nghiệm.',
    formula: String.raw`A\vec x = \vec b`,
    href: 'ch2-systems/row-column',
    related: ['ch2-systems/row-column', 'ch2-systems/gauss', 'ch2-systems/solutions'],
  },
  {
    badge: '4',
    title: 'Ma trận cơ bản',
    summary:
      'Kích thước, ma trận vuông, đơn vị, đường chéo, tam giác, đối xứng và phép chuyển vị.',
    formula: String.raw`A^{T}`,
    href: 'ch3-matrices/special',
    related: ['ch3-matrices/special'],
  },
  {
    badge: '5',
    title: 'Phép nhân ma trận',
    summary:
      'Nhân ma trận chính là hợp các biến đổi. Nhớ: thứ tự rất quan trọng, phép bên phải áp dụng trước.',
    formula: String.raw`AB \neq BA`,
    href: 'ch3-matrices/composition',
    related: ['ch3-matrices/composition'],
  },
  {
    badge: '6',
    title: 'Biến đổi tuyến tính',
    summary:
      'Xem ma trận như một hàm biến đổi không gian: phóng to, thu nhỏ, xoay, lật, kéo nghiêng, chiếu.',
    formula: String.raw`T(\vec x) = A\vec x`,
    href: 'ch3-matrices/transform',
    related: ['ch3-matrices/transform'],
  },
  {
    badge: '7',
    title: 'Định thức',
    summary:
      'det(A) cho biết diện tích co giãn bao nhiêu lần, hướng có bị đảo không và ma trận có khả nghịch không.',
    formula: String.raw`\det(A) = ad - bc`,
    href: 'ch3-matrices/determinant',
    related: ['ch3-matrices/determinant'],
  },
  {
    badge: '8',
    title: 'Ma trận nghịch đảo',
    summary:
      'A⁻¹A = I. Nếu Ax = b thì x = A⁻¹b — nhưng khi lập trình nên dùng solve cho ổn định hơn.',
    formula: String.raw`A^{-1}A = I`,
    href: 'ch3-matrices/inverse',
    related: ['ch3-matrices/inverse'],
  },
  {
    badge: '9',
    title: 'Không gian vector',
    summary:
      'Subspace, column space, null space, basis, dimension, rank và rank–nullity. Rank là chìa khóa cho nén ảnh.',
    formula: String.raw`A\vec x = \vec 0`,
    href: 'ch4-spaces/colnull',
    related: [
      'ch4-spaces/subspace',
      'ch4-spaces/colnull',
      'ch4-spaces/independence',
      'ch4-spaces/basis',
      'ch4-spaces/rank',
    ],
  },
  {
    badge: '10',
    title: 'Trực giao & phép chiếu',
    summary:
      'Hai vector vuông góc khi u·v = 0. Orthonormal basis, phép chiếu, Gram–Schmidt và QR decomposition.',
    formula: String.raw`\vec u \cdot \vec v = 0`,
    href: 'ch1-vectors/dot',
    related: ['ch1-vectors/dot', 'ch4-spaces/change-basis'],
  },
  {
    badge: '11',
    title: 'Least Squares',
    summary:
      'Khi hệ không có nghiệm chính xác, tìm nghiệm gần đúng tốt nhất — nền tảng của hồi quy tuyến tính.',
    formula: String.raw`A^{T}A\,\vec x = A^{T}\vec b`,
    href: 'ch7-code/least-squares',
    related: ['ch7-code/least-squares'],
  },
  {
    badge: '12',
    title: 'Eigenvalue & Eigenvector',
    summary:
      'Hướng không đổi sau biến đổi: Av = λv. Nền tảng của PCA, PageRank và hệ động lực học.',
    formula: String.raw`A\vec v = \lambda\,\vec v`,
    href: 'ch5-eigen/discover',
    related: [
      'ch5-eigen/discover',
      'ch5-eigen/characteristic',
      'ch5-eigen/eigenspace',
      'ch5-eigen/powers',
    ],
  },
  {
    badge: '13',
    title: 'Phân rã ma trận',
    summary:
      'LU, QR, eigendecomposition rồi đến SVD. Diagonalization tách ma trận thành A = PDP⁻¹.',
    formula: String.raw`A = PDP^{-1}`,
    href: 'ch5-eigen/diagonalization',
    related: ['ch5-eigen/diagonalization'],
  },
  {
    badge: '14',
    title: 'SVD',
    summary:
      'A = UΣVᵀ: xoay → co giãn → xoay. Giữ k giá trị kỳ dị lớn nhất để có xấp xỉ rank thấp — nền của nén ảnh.',
    formula: String.raw`A = U\Sigma V^{T}`,
    href: 'ch6-svd/rotate-stretch',
    related: [
      'ch6-svd/rotate-stretch',
      'ch6-svd/singular',
      'ch6-svd/eigen-link',
      'ch6-svd/compression',
      'ch6-svd/pca',
    ],
  },
  {
    badge: '⌘',
    title: 'Ứng dụng bằng code',
    summary:
      'Đồ họa biến đổi hình, least squares, PageRank và nén ảnh bằng SVD — biến lý thuyết thành sản phẩm chạy được.',
    href: 'ch7-code/graphics',
    related: [
      'ch7-code/graphics',
      'ch7-code/least-squares',
      'ch7-code/pagerank',
      'ch7-code/svd-image',
    ],
  },
];

const LOOP = [
  'Hiểu hình học',
  'Tính tay bài nhỏ',
  'Code không NumPy',
  'Kiểm bằng NumPy',
  'Visualize (Matplotlib)',
  'Áp dụng vào project',
];

interface Week {
  num: number;
  title: string;
  chapterId: string;
  lessonId: string;
  topics: string[];
}

const WEEKS: Week[] = [
  {
    num: 1,
    title: 'Vector',
    chapterId: 'ch1-vectors',
    lessonId: 'intro',
    topics: ['Vector & tọa độ', 'Cộng, trừ, nhân vô hướng', 'Norm (độ dài)', 'Dot product', 'Góc giữa hai vector'],
  },
  {
    num: 2,
    title: 'Hệ phương trình & ma trận',
    chapterId: 'ch2-systems',
    lessonId: 'gauss',
    topics: ['Hệ tuyến tính', 'Ma trận mở rộng', 'Phép biến đổi hàng', 'Gaussian elimination'],
  },
  {
    num: 3,
    title: 'Nhân ma trận & biến đổi',
    chapterId: 'ch3-matrices',
    lessonId: 'composition',
    topics: ['Matrix multiplication', 'Rotation', 'Scaling', 'Shear', 'Composition'],
  },
  {
    num: 4,
    title: 'Determinant, inverse & rank',
    chapterId: 'ch4-spaces',
    lessonId: 'rank',
    topics: ['Determinant', 'Inverse', 'Rank', 'Column space', 'Null space'],
  },
  {
    num: 5,
    title: 'Basis & orthogonality',
    chapterId: 'ch4-spaces',
    lessonId: 'basis',
    topics: ['Basis & dimension', 'Orthogonal vectors', 'Projection', 'Gram–Schmidt'],
  },
  {
    num: 6,
    title: 'Least squares & QR',
    chapterId: 'ch7-code',
    lessonId: 'least-squares',
    topics: ['Overdetermined systems', 'Least squares', 'Linear regression', 'QR decomposition'],
  },
  {
    num: 7,
    title: 'Eigenvalue',
    chapterId: 'ch5-eigen',
    lessonId: 'discover',
    topics: ['Eigenvalue', 'Eigenvector', 'Diagonalization', 'Symmetric matrices'],
  },
  {
    num: 8,
    title: 'SVD & project',
    chapterId: 'ch6-svd',
    lessonId: 'compression',
    topics: ['SVD', 'Low-rank approximation', 'Nén ảnh', 'PCA cơ bản'],
  },
];

const DAILY = [
  { min: '20′', title: 'Học khái niệm', desc: 'Đọc lý thuyết, xem hình động, nắm ý nghĩa hình học.', w: 66 },
  { min: '20′', title: 'Tính tay', desc: 'Giải vài bài nhỏ bằng bút giấy cho chắc tay.', w: 66 },
  { min: '20′', title: 'Code Python', desc: 'Tự viết trước, rồi kiểm lại bằng NumPy.', w: 66 },
  { min: '10–30′', title: 'Visualize / Project', desc: 'Vẽ bằng Matplotlib hoặc làm một mẩu project.', w: 100 },
];

interface Project {
  name: string;
  desc: string;
  href: string;
}

const PROJECTS: Project[] = [
  { name: 'Vector playground', desc: 'Nhập hai vector: tính độ dài, dot product, góc và vẽ cả projection.', href: 'ch1-vectors/dot' },
  { name: 'Giải hệ phương trình', desc: 'Tự viết Gaussian elimination + back substitution, kiểm nghiệm bằng NumPy.', href: 'ch2-systems/gauss' },
  { name: 'Matrix transformation', desc: 'Áp scaling, rotation, shear, reflection lên một hình vuông.', href: 'ch3-matrices/transform' },
  { name: 'Image transformation', desc: 'Dùng ma trận để xoay, kéo nghiêng, lật và đổi tỷ lệ một tấm ảnh.', href: 'ch7-code/graphics' },
  { name: 'Least squares', desc: 'Tạo dữ liệu có nhiễu, khớp đường thẳng, so đường dự đoán với dữ liệu thật.', href: 'ch7-code/least-squares' },
  { name: 'Eigenvector visualization', desc: 'Nhân nhiều vector với cùng một ma trận, xem vector nào không đổi hướng.', href: 'ch5-eigen/discover' },
  { name: 'SVD image compression', desc: 'SVD từng channel RGB, thử rank 5 / 20 / 50 / 100 / 200, so chất lượng và dung lượng.', href: 'ch7-code/svd-image' },
];

const TOOLS = [
  { name: 'NumPy', role: 'vector, matrix, SVD, eigenvalue — trái tim của mọi phép tính.' },
  { name: 'Matplotlib', role: 'trực quan hóa: vẽ vector, lưới, ảnh trước/sau biến đổi.' },
  { name: 'SciPy', role: 'thuật toán đại số tuyến tính nâng cao.' },
  { name: 'Pillow', role: 'đọc và xử lý ảnh.' },
  { name: 'OpenCV', role: 'affine và perspective transformation cho ảnh.' },
];

interface FlowPill {
  label: string;
  href?: string;
  hi?: boolean;
}

const FLOW: FlowPill[] = [
  { label: 'Vector', href: 'ch1-vectors/intro' },
  { label: 'Matrix', href: 'ch3-matrices/special' },
  { label: 'Matrix multiplication', href: 'ch3-matrices/composition' },
  { label: 'Coordinate systems', href: 'ch0-foundations/coordinates' },
  { label: 'Linear transformation', href: 'ch3-matrices/transform', hi: true },
  { label: 'Homogeneous coordinates' },
  { label: 'Affine transformation', href: 'ch7-code/graphics' },
  { label: 'Determinant & rank', href: 'ch4-spaces/rank' },
  { label: 'Orthogonality', href: 'ch1-vectors/dot' },
  { label: 'Eigenvalue', href: 'ch5-eigen/discover' },
  { label: 'SVD', href: 'ch6-svd/rotate-stretch' },
  { label: 'Image compression', href: 'ch7-code/svd-image', hi: true },
];

function Head({ kicker, title, lead }: { kicker: string; title: string; lead?: string }) {
  return (
    <div className="rm-head">
      <span className="rm-kicker">{kicker}</span>
      <h2 className="rm-title">{title}</h2>
      {lead && <p className="rm-lead">{lead}</p>}
    </div>
  );
}

export default function Roadmap() {
  const completed = useProgress((s) => s.completedLessons);

  const totalLessons = flatLessons.length;
  const doneLessons = flatLessons.filter(
    (fl) => completed[`${fl.chapterId}/${fl.lessonId}`]
  ).length;
  const totalPct = totalLessons ? Math.round((doneLessons / totalLessons) * 100) : 0;

  const chapterProgress = (chapterId: string) => {
    const ch = chapters.find((c) => c.id === chapterId);
    if (!ch) return { done: 0, total: 0, pct: 0 };
    const total = ch.lessons.length;
    const done = ch.lessons.filter((l) => completed[`${chapterId}/${l.id}`]).length;
    return { done, total, pct: total ? Math.round((done / total) * 100) : 0 };
  };

  const nodeDone = (n: StepNode) => n.related.every((k) => !!completed[k]);

  return (
    <div className="page rm-page">
      {/* ---------- 1. HERO ---------- */}
      <div className="rm-hero">
        <h1 className="rm-hero-title">
          Lộ trình học <span className="rm-hero-grad">Đại số tuyến tính</span>
        </h1>
        <p>
          Đừng bắt đầu bằng SVD hay eigenvalue. Hãy đi theo chuỗi tự nhiên:{' '}
          <strong>số → vector → hệ phương trình → ma trận → không gian vector → eigenvalue → SVD → ứng dụng bằng code</strong>.
          Triết lý ở đây là <em>thực hành trước, lý thuyết theo sau</em> — nhìn hình, tính tay, viết code, rồi mới trừu tượng hóa.
        </p>
        <div className="rm-hero-tags">
          <span className="rm-tag">14 bước có thứ tự</span>
          <span className="rm-tag">Kế hoạch 8 tuần</span>
          <span className="rm-tag">7 project thực hành</span>
          <span className="rm-tag">Mục tiêu: xử lý & nén ảnh</span>
        </div>
        <div className="rm-total">
          <div className="rm-total-top">
            <span className="rm-total-label">Tiến độ tổng của bạn</span>
            <span className="rm-total-num">
              Đã hoàn thành {doneLessons}/{totalLessons} bài · {totalPct}%
            </span>
          </div>
          <div className="rm-bar">
            <span style={{ width: `${totalPct}%` }} />
          </div>
        </div>
      </div>

      {/* ---------- 2. TIMELINE 14 BƯỚC ---------- */}
      <section className="rm-section">
        <Head
          kicker="Lộ trình chính"
          title="14 bước từ số đến SVD"
          lead="Mỗi node là một chặng. Học đúng thứ tự này để không bị hụt nền. Node xanh ✓ là bạn đã hoàn thành mọi bài liên quan trong app."
        />
        <div className="rm-timeline">
          {STEPS.map((n) => {
            const done = nodeDone(n);
            return (
              <div key={n.badge + n.title} className={`rm-node ${done ? 'done' : ''}`}>
                <div className="rm-node-num">{done ? '✓' : n.badge}</div>
                <div className="rm-node-body">
                  <div className="rm-node-titlerow">
                    <h3 className="rm-node-title">
                      {n.badge === '⌘' ? 'Ứng dụng' : `Bước ${n.badge}`}: {n.title}
                    </h3>
                    {done && <span className="rm-node-check">✓ Đã xong</span>}
                  </div>
                  <p className="rm-node-summary">{n.summary}</p>
                  <div className="rm-node-foot">
                    {n.formula && (
                      <span className="rm-node-formula">
                        <MathText tex={n.formula} />
                      </span>
                    )}
                    <a className="rm-cta" href={`#/ch/${n.href}`}>
                      Vào học →
                    </a>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* ---------- 3. VÒNG LẶP THỰC HÀNH ---------- */}
      <section className="rm-section">
        <div className="panel">
          <Head
            kicker="Cách chinh phục mỗi chủ đề"
            title="Vòng lặp thực hành 6 bước"
            lead="Áp dụng đúng vòng lặp này cho từng chủ đề bên trên — đó là khác biệt giữa 'biết tính' và 'thật sự hiểu'."
          />
          <div className="rm-loop">
            {LOOP.map((s, i) => (
              <Fragment key={s}>
                <div className="rm-loop-step">
                  <span className="rm-loop-idx">{i + 1}</span>
                  <span className="rm-loop-label">{s}</span>
                </div>
                {i < LOOP.length - 1 && (
                  <div className="rm-loop-arrow" aria-hidden="true">
                    →
                  </div>
                )}
              </Fragment>
            ))}
          </div>
          <p className="rm-loop-note">
            Tự code trước khi gọi NumPy giúp bạn hiểu thuật toán; kiểm bằng NumPy giúp bạn tin kết quả.
          </p>
        </div>
      </section>

      {/* ---------- 4. KẾ HOẠCH 8 TUẦN ---------- */}
      <section className="rm-section">
        <Head
          kicker="Lịch học"
          title="Kế hoạch 8 tuần"
          lead="Mỗi tuần một cụm chủ đề, gắn thẳng với một chương trong app kèm tiến độ thực của bạn."
        />
        <div className="rm-weeks">
          {WEEKS.map((w) => {
            const p = chapterProgress(w.chapterId);
            return (
              <a className="rm-week" key={w.num} href={`#/ch/${w.chapterId}/${w.lessonId}`}>
                <div className="rm-week-top">
                  <span className="rm-week-num">TUẦN {w.num}</span>
                </div>
                <h3 className="rm-week-title">{w.title}</h3>
                <ul className="rm-week-topics">
                  {w.topics.map((t) => (
                    <li key={t}>{t}</li>
                  ))}
                </ul>
                <div className="rm-week-foot">
                  <div className="rm-mini-top">
                    <span>
                      {p.done}/{p.total} bài
                    </span>
                    <span>{p.pct}%</span>
                  </div>
                  <div className="rm-bar">
                    <span style={{ width: `${p.pct}%` }} />
                  </div>
                </div>
                <span className="rm-week-link">Mở chương →</span>
              </a>
            );
          })}
        </div>
      </section>

      {/* ---------- 5. CÁCH HỌC MỖI NGÀY ---------- */}
      <section className="rm-section">
        <div className="panel">
          <Head
            kicker="Nhịp học bền vững"
            title="Mỗi ngày 60–90 phút"
            lead="Chia nhỏ theo tỉ lệ 20 / 20 / 20 / 10–30 phút. Đều đặn mỗi ngày hơn là dồn một buổi dài."
          />
          <div className="rm-daily-cards">
            {DAILY.map((d) => (
              <div className="rm-daily-card" key={d.title}>
                <div className="rm-daily-min">{d.min}</div>
                <div className="rm-daily-title">{d.title}</div>
                <p className="rm-daily-desc">{d.desc}</p>
                <div className="rm-daily-bar">
                  <span style={{ width: `${d.w}%` }} />
                </div>
              </div>
            ))}
          </div>
          <p className="rm-quote">
            Không chỉ xem video — phải: <b>nhìn hình</b>, <b>tính tay</b>, <b>viết code</b>, và{' '}
            <b>giải thích lại bằng lời của mình</b>.
          </p>
        </div>
      </section>

      {/* ---------- 6. 7 PROJECT ---------- */}
      <section className="rm-section">
        <Head
          kicker="Học qua sản phẩm"
          title="7 project thực hành"
          lead="Mỗi chủ đề nên kết thúc bằng một project nhỏ. Những project có sẵn bản tương tác trong app được gắn liên kết bên phải."
        />
        <div className="rm-projects">
          {PROJECTS.map((p, i) => (
            <div className="rm-project" key={p.name}>
              <div className="rm-project-idx">{i + 1}</div>
              <div className="rm-project-body">
                <div className="rm-project-name">{p.name}</div>
                <div className="rm-project-desc">{p.desc}</div>
              </div>
              <a className="rm-project-link" href={`#/ch/${p.href}`}>
                Thử trong app →
              </a>
            </div>
          ))}
        </div>
      </section>

      {/* ---------- 7. CÔNG CỤ ---------- */}
      <section className="rm-section">
        <div className="panel">
          <Head
            kicker="Khi tự code ngoài Python"
            title="Bộ công cụ nên dùng"
            lead="Năm thư viện đủ cho toàn bộ lộ trình, từ tính vector tới nén ảnh."
          />
          <div className="rm-tools">
            {TOOLS.map((t) => (
              <div className="rm-tool" key={t.name}>
                <span className="rm-tool-name">{t.name}</span>
                <span className="rm-tool-role">{t.role}</span>
              </div>
            ))}
          </div>
          <div className="rm-install">
            <span className="rm-prompt">$ </span>pip install numpy matplotlib scipy pillow opencv-python
          </div>
        </div>
      </section>

      {/* ---------- 8. THỨ TỰ TỐI ƯU CHO XỬ LÝ ẢNH ---------- */}
      <section className="rm-section">
        <div className="panel">
          <Head
            kicker="Mục tiêu: làm méo & nén ảnh"
            title="Thứ tự tối ưu cho xử lý ảnh"
            lead="Nếu đích của bạn là dùng ma trận để biến đổi ảnh và SVD để nén ảnh, hãy ưu tiên đi theo mạch này."
          />
          <div className="rm-flow">
            {FLOW.map((f, i) => (
              <Fragment key={f.label}>
                {f.href ? (
                  <a className={`rm-flow-pill ${f.hi ? 'rm-flow-hi' : ''}`} href={`#/ch/${f.href}`}>
                    {f.label}
                  </a>
                ) : (
                  <span className={`rm-flow-pill ${f.hi ? 'rm-flow-hi' : ''}`}>{f.label}</span>
                )}
                {i < FLOW.length - 1 && (
                  <span className="rm-flow-arrow" aria-hidden="true">
                    ↓
                  </span>
                )}
              </Fragment>
            ))}
          </div>
          <p className="rm-flow-note">
            Chưa cần học hết lý thuyết trừu tượng trước khi code. Học tới{' '}
            <strong>Linear transformation</strong> là đã bắt đầu xử lý ảnh được ngay — rồi quay lại đào sâu{' '}
            <strong>rank</strong>, <strong>eigenvalue</strong> và <strong>SVD</strong> sau.
          </p>
        </div>
      </section>
    </div>
  );
}
