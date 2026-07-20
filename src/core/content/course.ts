import type {
  Course,
  Section,
  Unit,
  MicroLesson,
  FlatMicroLesson,
} from './types';

// ---------------------------------------------------------------------------
// DỮ LIỆU NGUỒN — sao chép TĨNH từ src/chapters/registry.ts (chỉ đọc).
// Cố ý inline (không import registry) để module này KHÔNG phụ thuộc file agent
// khác. Khi registry đổi, cập nhật bảng dưới đây cho khớp.
// `skills` = skill chính mà bài đó rèn (id phải có trong skills.ts).
// ---------------------------------------------------------------------------
interface LessonSeed {
  id: string;
  title: string;
  skills: string[];
}
interface ChapterSeed {
  id: string;
  num: number;
  title: string;
  en: string;
  subtitle: string;
  lessons: LessonSeed[];
}

const CHAPTER_SEED: ChapterSeed[] = [
  {
    id: 'ch0-foundations',
    num: 0,
    title: 'Kiến thức nền',
    en: 'Foundations',
    subtitle: 'Tọa độ, hàm số, lượng giác và ký hiệu toán học',
    lessons: [
      { id: 'coordinates', title: 'Hệ tọa độ 2D & 3D', skills: ['coordinate_systems'] },
      { id: 'functions', title: 'Hàm số & đồ thị', skills: ['functions_graphs'] },
      { id: 'trig', title: 'Đường tròn đơn vị: sin & cos', skills: ['trigonometry'] },
      { id: 'notation', title: 'Ký hiệu toán học', skills: ['math_notation'] },
    ],
  },
  {
    id: 'ch1-vectors',
    num: 1,
    title: 'Vector',
    en: 'Vectors',
    subtitle: 'Khối xây dựng cơ bản của đại số tuyến tính',
    lessons: [
      { id: 'intro', title: 'Vector là gì?', skills: ['vector_basics'] },
      { id: 'addition', title: 'Cộng & trừ vector', skills: ['vector_addition'] },
      { id: 'scaling', title: 'Nhân vô hướng', skills: ['scalar_multiplication'] },
      { id: 'combination', title: 'Linear combination & Span', skills: ['linear_combination', 'span'] },
      { id: 'dot', title: 'Dot product', skills: ['dot_product'] },
      { id: 'cross', title: 'Cross product', skills: ['cross_product'] },
    ],
  },
  {
    id: 'ch2-systems',
    num: 2,
    title: 'Hệ phương trình tuyến tính',
    en: 'Linear Systems',
    subtitle: 'Giải và hình dung hệ phương trình',
    lessons: [
      { id: 'row-column', title: 'Row picture vs Column picture', skills: ['linear_system'] },
      { id: 'gauss', title: 'Gauss elimination từng bước', skills: ['gaussian_elimination'] },
      { id: 'solutions', title: 'Duy nhất, vô số, vô nghiệm', skills: ['solution_types'] },
    ],
  },
  {
    id: 'ch3-matrices',
    num: 3,
    title: 'Ma trận',
    en: 'Matrices',
    subtitle: 'Ma trận như những biến đổi tuyến tính',
    lessons: [
      { id: 'transform', title: 'Ma trận = biến đổi tuyến tính', skills: ['matrix_transformation'] },
      { id: 'composition', title: 'Nhân ma trận = hợp biến đổi', skills: ['matrix_multiplication'] },
      { id: 'determinant', title: 'Determinant', skills: ['determinant'] },
      { id: 'inverse', title: 'Ma trận nghịch đảo', skills: ['matrix_inverse'] },
      { id: 'special', title: 'Các ma trận đặc biệt', skills: ['special_matrices'] },
    ],
  },
  {
    id: 'ch4-spaces',
    num: 4,
    title: 'Không gian vector',
    en: 'Vector Spaces',
    subtitle: 'Subspace, basis, rank và đổi cơ sở',
    lessons: [
      { id: 'subspace', title: 'Subspace', skills: ['subspace'] },
      { id: 'colnull', title: 'Column space & Null space', skills: ['column_null_space'] },
      { id: 'independence', title: 'Linear independence', skills: ['linear_independence'] },
      { id: 'basis', title: 'Basis & Dimension', skills: ['basis_dimension'] },
      { id: 'rank', title: 'Rank', skills: ['rank'] },
      { id: 'change-basis', title: 'Đổi cơ sở', skills: ['change_of_basis'] },
    ],
  },
  {
    id: 'ch5-eigen',
    num: 5,
    title: 'Eigenvalues & Eigenvectors',
    en: 'Eigenvalues & Eigenvectors',
    subtitle: 'Những hướng bất biến của biến đổi',
    lessons: [
      { id: 'discover', title: 'Tìm hướng bất biến', skills: ['eigenvector'] },
      { id: 'characteristic', title: 'Phương trình đặc trưng', skills: ['characteristic_polynomial', 'eigenvalue'] },
      { id: 'eigenspace', title: 'Eigenspace', skills: ['eigenspace'] },
      { id: 'diagonalization', title: 'Diagonalization', skills: ['diagonalization'] },
      { id: 'powers', title: 'Lũy thừa ma trận & Fibonacci', skills: ['matrix_powers'] },
    ],
  },
  {
    id: 'ch6-svd',
    num: 6,
    title: 'SVD',
    en: 'Singular Value Decomposition',
    subtitle: 'Phân tích giá trị kỳ dị',
    lessons: [
      { id: 'rotate-stretch', title: 'Xoay – Co giãn – Xoay', skills: ['svd'] },
      { id: 'singular', title: 'Singular values & vectors', skills: ['singular_values'] },
      { id: 'eigen-link', title: 'Liên hệ AᵀA', skills: ['svd', 'eigenvalue'] },
      { id: 'compression', title: 'Nén ảnh rank-k', skills: ['rank_k_approximation'] },
      { id: 'pca', title: 'PCA sơ lược', skills: ['pca'] },
    ],
  },
  {
    id: 'ch7-code',
    num: 7,
    title: 'Ứng dụng bằng code',
    en: 'Applications in Code',
    subtitle: 'Đồ họa, least squares, PageRank, nén ảnh',
    lessons: [
      { id: 'graphics', title: 'Đồ họa: biến đổi hình', skills: ['matrix_transformation'] },
      { id: 'least-squares', title: 'Least squares fit', skills: ['least_squares'] },
      { id: 'pagerank', title: 'Markov chain & PageRank', skills: ['markov_pagerank'] },
      { id: 'svd-image', title: 'Nén ảnh bằng SVD', skills: ['rank_k_approximation'] },
    ],
  },
  {
    id: 'ch8-orthogonality',
    num: 8,
    title: 'Trực giao & Bình phương tối thiểu',
    en: 'Orthogonality & Least Squares',
    subtitle: 'Orthonormal basis, Gram–Schmidt, QR, projection',
    lessons: [
      { id: 'orthonormal', title: 'Vector trực giao & Orthonormal basis', skills: ['orthogonality'] },
      { id: 'projection', title: 'Phép chiếu lên không gian con', skills: ['projection'] },
      { id: 'gram-schmidt', title: 'Gram–Schmidt', skills: ['gram_schmidt'] },
      { id: 'qr', title: 'QR decomposition', skills: ['qr_decomposition'] },
      { id: 'least-squares', title: 'Least squares & Normal equation', skills: ['least_squares'] },
    ],
  },
  {
    id: 'ch9-quadratic',
    num: 9,
    title: 'Dạng toàn phương',
    en: 'Quadratic Forms',
    subtitle: 'Quadratic forms, định dấu, spectral theorem',
    lessons: [
      { id: 'form', title: 'Dạng toàn phương xᵀAx', skills: ['quadratic_form'] },
      { id: 'definite', title: 'Xác định dấu (Definiteness)', skills: ['definiteness'] },
      { id: 'spectral', title: 'Spectral theorem', skills: ['spectral_theorem'] },
      { id: 'conic', title: 'Đường & mặt bậc hai', skills: ['conic_sections'] },
    ],
  },

  // =========================================================================
  // NHÁNH DEEP LEARNING (ch10–ch13) — nối tiếp tuyến tính sau ch9.
  // Deep Learning = Đại số tuyến tính được áp dụng; prerequisite bắc cầu
  // từ chương LA liền trước để giữ Learning Path liền mạch.
  // =========================================================================
  {
    id: 'ch10-ml',
    num: 10,
    title: 'Học máy & Hồi quy',
    en: 'Machine Learning & Regression',
    subtitle: 'Từ Least Squares đến mô hình học máy',
    lessons: [
      { id: 'linear-regression', title: 'Hồi quy tuyến tính = Least Squares', skills: ['linear_regression_ml'] },
      { id: 'gradient-descent', title: 'Gradient Descent', skills: ['gradient_descent'] },
      { id: 'softmax', title: 'Hồi quy Softmax & phân loại', skills: ['softmax_regression'] },
      { id: 'generalization', title: 'Overfitting & Regularization', skills: ['generalization'] },
    ],
  },
  {
    id: 'ch11-neural-nets',
    num: 11,
    title: 'Mạng nơ-ron',
    en: 'Neural Networks',
    subtitle: 'Neuron, MLP, lan truyền xuôi/ngược',
    lessons: [
      { id: 'neuron', title: 'Neuron = Dot product + Activation', skills: ['neuron'] },
      { id: 'mlp', title: 'Multilayer Perceptron', skills: ['mlp'] },
      { id: 'forward', title: 'Lan truyền xuôi (Forward)', skills: ['forward_prop'] },
      { id: 'backprop', title: 'Lan truyền ngược (Backprop)', skills: ['backprop'] },
      { id: 'activations', title: 'Hàm kích hoạt', skills: ['activation_functions'] },
    ],
  },
  {
    id: 'ch12-modern-dl',
    num: 12,
    title: 'Học sâu hiện đại',
    en: 'Modern Deep Learning',
    subtitle: 'CNN, RNN, Attention/Transformer, Embeddings',
    lessons: [
      { id: 'cnn', title: 'CNN — Tích chập', skills: ['cnn'] },
      { id: 'rnn', title: 'RNN — Chuỗi & trạng thái ẩn', skills: ['rnn'] },
      { id: 'attention', title: 'Attention & Transformer', skills: ['attention', 'transformer'] },
      { id: 'embeddings', title: 'Word Embeddings', skills: ['word_embedding'] },
    ],
  },
  {
    id: 'ch13-optimization-apps',
    num: 13,
    title: 'Tối ưu & Ứng dụng',
    en: 'Optimization & Applications',
    subtitle: 'SGD/Adam, Batch Norm, CV, NLP',
    lessons: [
      { id: 'optimizers', title: 'SGD, Momentum, Adam', skills: ['sgd_optimizers'] },
      { id: 'batchnorm', title: 'Batch Norm & khởi tạo', skills: ['batch_norm'] },
      { id: 'cv', title: 'Thị giác máy tính (tổng quan)', skills: ['computer_vision'] },
      { id: 'nlp', title: 'NLP & mô hình ngôn ngữ (tổng quan)', skills: ['nlp_lm'] },
    ],
  },
];

// ---------------------------------------------------------------------------
// BỘ SINH SKELETON — mỗi lesson → 1 Unit gồm 2–3 micro-lesson.
//   • concept   : nhúng bài trực quan chương cũ (deepDiveRoute).
//   • practice  : luyện tập (exerciseIds để trống — tác giả nội dung điền sau).
//   • review    : chỉ ở Unit CUỐI của mỗi chương, gộp toàn bộ skill của chương.
// ---------------------------------------------------------------------------
function buildUnit(chapter: ChapterSeed, lesson: LessonSeed, isLast: boolean): Unit {
  const unitId = `${chapter.id}:${lesson.id}`;

  const concept: MicroLesson = {
    id: `${unitId}:concept`,
    title: `${lesson.title} — Khái niệm`,
    skillIds: lesson.skills,
    deepDiveRoute: `#/ch/${chapter.id}/${lesson.id}`,
    exerciseIds: [],
    kind: 'concept',
  };

  const practice: MicroLesson = {
    id: `${unitId}:practice`,
    title: `${lesson.title} — Luyện tập`,
    skillIds: lesson.skills,
    exerciseIds: [],
    kind: 'practice',
  };

  const lessons: MicroLesson[] = [concept, practice];

  if (isLast) {
    const chapterSkills = Array.from(
      new Set(chapter.lessons.flatMap((l) => l.skills)),
    );
    lessons.push({
      id: `${chapter.id}:review`,
      title: `Ôn tập chương: ${chapter.title}`,
      skillIds: chapterSkills,
      exerciseIds: [],
      kind: 'review',
    });
  }

  return { id: unitId, title: lesson.title, lessons };
}

function buildSection(chapter: ChapterSeed, index: number): Section {
  const units = chapter.lessons.map((lesson, i) =>
    buildUnit(chapter, lesson, i === chapter.lessons.length - 1),
  );
  const prev = CHAPTER_SEED[index - 1];
  return {
    id: chapter.id,
    num: chapter.num,
    title: chapter.title,
    en: chapter.en,
    subtitle: chapter.subtitle,
    prerequisiteSectionIds: prev ? [prev.id] : [],
    units,
  };
}

export const COURSE: Course = {
  id: 'linalglab',
  title: 'LinAlgLab — Đại số tuyến tính',
  sections: CHAPTER_SEED.map(buildSection),
};

// ---------------------------------------------------------------------------
// HELPERS
// ---------------------------------------------------------------------------

/** Lấy Section theo id. */
export function getSection(id: string): Section | undefined {
  return COURSE.sections.find((s) => s.id === id);
}

/** Lấy Unit trong 1 Section. */
export function getUnit(sectionId: string, unitId: string): Unit | undefined {
  return getSection(sectionId)?.units.find((u) => u.id === unitId);
}

/** Lấy 1 micro-lesson theo id toàn cục. */
export function getMicroLesson(lessonId: string): MicroLesson | undefined {
  return flatMicroLessons().find((f) => f.lesson.id === lessonId)?.lesson;
}

/** Danh sách phẳng toàn bộ micro-lesson theo đúng thứ tự học. */
export function flatMicroLessons(): FlatMicroLesson[] {
  const out: FlatMicroLesson[] = [];
  for (const section of COURSE.sections) {
    for (const unit of section.units) {
      for (const lesson of unit.lessons) {
        out.push({ sectionId: section.id, unitId: unit.id, lesson });
      }
    }
  }
  return out;
}

/**
 * Micro-lesson kế tiếp theo trình tự học phẳng.
 * @param lessonId id của micro-lesson hiện tại.
 * @returns micro-lesson kế tiếp, hoặc undefined nếu đã là bài cuối / không tìm thấy.
 */
export function nextLesson(lessonId: string): FlatMicroLesson | undefined {
  const flat = flatMicroLessons();
  const idx = flat.findIndex((f) => f.lesson.id === lessonId);
  if (idx === -1 || idx === flat.length - 1) return undefined;
  return flat[idx + 1];
}

/** Section kế tiếp (theo num). */
export function nextSection(sectionId: string): Section | undefined {
  const idx = COURSE.sections.findIndex((s) => s.id === sectionId);
  if (idx === -1 || idx === COURSE.sections.length - 1) return undefined;
  return COURSE.sections[idx + 1];
}
