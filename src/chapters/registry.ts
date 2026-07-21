export interface LessonMeta {
  id: string;
  title: string;
}

export interface ChapterMeta {
  id: string;
  num: number;
  title: string;
  subtitle: string;
  lessons: LessonMeta[];
  load: () => Promise<{ default: React.ComponentType<{ lessonId: string }> }>;
}

// Content module (giáo án plugin) — merge additive, KHÔNG đổi 14 chương gốc.
import { moduleChapters } from '../content/registry';

const baseChapters: ChapterMeta[] = [
  {
    id: 'ch0-foundations',
    num: 0,
    title: 'Kiến thức nền',
    subtitle: 'Tọa độ, hàm số, lượng giác và ký hiệu toán học',
    lessons: [
      { id: 'coordinates', title: 'Hệ tọa độ 2D & 3D' },
      { id: 'functions', title: 'Hàm số & đồ thị' },
      { id: 'trig', title: 'Đường tròn đơn vị: sin & cos' },
      { id: 'notation', title: 'Ký hiệu toán học' },
    ],
    load: () => import('./ch0-foundations/index'),
  },
  {
    id: 'ch1-vectors',
    num: 1,
    title: 'Vector',
    subtitle: 'Khối xây dựng cơ bản của đại số tuyến tính',
    lessons: [
      { id: 'intro', title: 'Vector là gì?' },
      { id: 'addition', title: 'Cộng & trừ vector' },
      { id: 'scaling', title: 'Nhân vô hướng' },
      { id: 'combination', title: 'Linear combination & Span' },
      { id: 'dot', title: 'Dot product' },
      { id: 'cross', title: 'Cross product' },
    ],
    load: () => import('./ch1-vectors/index'),
  },
  {
    id: 'ch2-systems',
    num: 2,
    title: 'Hệ phương trình tuyến tính',
    subtitle: 'Giải và hình dung hệ phương trình',
    lessons: [
      { id: 'row-column', title: 'Row picture vs Column picture' },
      { id: 'gauss', title: 'Gauss elimination từng bước' },
      { id: 'solutions', title: 'Duy nhất, vô số, vô nghiệm' },
    ],
    load: () => import('./ch2-systems/index'),
  },
  {
    id: 'ch3-matrices',
    num: 3,
    title: 'Ma trận',
    subtitle: 'Ma trận như những biến đổi tuyến tính',
    lessons: [
      { id: 'transform', title: 'Ma trận = biến đổi tuyến tính' },
      { id: 'composition', title: 'Nhân ma trận = hợp biến đổi' },
      { id: 'determinant', title: 'Determinant' },
      { id: 'inverse', title: 'Ma trận nghịch đảo' },
      { id: 'special', title: 'Các ma trận đặc biệt' },
    ],
    load: () => import('./ch3-matrices/index'),
  },
  {
    id: 'ch4-spaces',
    num: 4,
    title: 'Không gian vector',
    subtitle: 'Subspace, basis, rank và đổi cơ sở',
    lessons: [
      { id: 'subspace', title: 'Subspace' },
      { id: 'colnull', title: 'Column space & Null space' },
      { id: 'independence', title: 'Linear independence' },
      { id: 'basis', title: 'Basis & Dimension' },
      { id: 'rank', title: 'Rank' },
      { id: 'change-basis', title: 'Đổi cơ sở' },
    ],
    load: () => import('./ch4-spaces/index'),
  },
  {
    id: 'ch5-eigen',
    num: 5,
    title: 'Eigenvalues & Eigenvectors',
    subtitle: 'Những hướng bất biến của biến đổi',
    lessons: [
      { id: 'discover', title: 'Tìm hướng bất biến' },
      { id: 'characteristic', title: 'Phương trình đặc trưng' },
      { id: 'eigenspace', title: 'Eigenspace' },
      { id: 'diagonalization', title: 'Diagonalization' },
      { id: 'powers', title: 'Lũy thừa ma trận & Fibonacci' },
    ],
    load: () => import('./ch5-eigen/index'),
  },
  {
    id: 'ch6-svd',
    num: 6,
    title: 'SVD',
    subtitle: 'Phân tích giá trị kỳ dị',
    lessons: [
      { id: 'rotate-stretch', title: 'Xoay – Co giãn – Xoay' },
      { id: 'singular', title: 'Singular values & vectors' },
      { id: 'eigen-link', title: 'Liên hệ AᵀA' },
      { id: 'compression', title: 'Nén ảnh rank-k' },
      { id: 'pca', title: 'PCA sơ lược' },
    ],
    load: () => import('./ch6-svd/index'),
  },
  {
    id: 'ch7-code',
    num: 7,
    title: 'Ứng dụng bằng code',
    subtitle: 'Đồ họa, least squares, PageRank, nén ảnh',
    lessons: [
      { id: 'graphics', title: 'Đồ họa: biến đổi hình' },
      { id: 'least-squares', title: 'Least squares fit' },
      { id: 'pagerank', title: 'Markov chain & PageRank' },
      { id: 'svd-image', title: 'Nén ảnh bằng SVD' },
    ],
    load: () => import('./ch7-code/index'),
  },
  {
    id: 'ch8-orthogonality',
    num: 8,
    title: 'Trực giao & Bình phương tối thiểu',
    subtitle: 'Orthonormal basis, Gram–Schmidt, QR, projection',
    lessons: [
      { id: 'orthonormal', title: 'Vector trực giao & Orthonormal basis' },
      { id: 'projection', title: 'Phép chiếu lên không gian con' },
      { id: 'gram-schmidt', title: 'Gram–Schmidt' },
      { id: 'qr', title: 'QR decomposition' },
      { id: 'least-squares', title: 'Least squares & Normal equation' },
    ],
    load: () => import('./ch8-orthogonality/index'),
  },
  {
    id: 'ch9-quadratic',
    num: 9,
    title: 'Dạng toàn phương',
    subtitle: 'Quadratic forms, định dấu, spectral theorem',
    lessons: [
      { id: 'form', title: 'Dạng toàn phương xᵀAx' },
      { id: 'definite', title: 'Xác định dấu (Definiteness)' },
      { id: 'spectral', title: 'Spectral theorem' },
      { id: 'conic', title: 'Đường & mặt bậc hai' },
    ],
    load: () => import('./ch9-quadratic/index'),
  },

  // =========================================================================
  // NHÁNH DEEP LEARNING — nối tiếp và bắc cầu từ Đại số tuyến tính (ch0–ch9).
  // Deep Learning = LA được áp dụng: neuron ↔ dot product, lớp mạng ↔ matMul,
  // hồi quy ↔ least squares, GD ↔ gradient của dạng toàn phương.
  // =========================================================================
  {
    id: 'ch10-ml',
    num: 10,
    title: 'Học máy & Hồi quy',
    subtitle: 'Từ Least Squares đến mô hình học máy',
    lessons: [
      { id: 'tensor', title: 'Tensor — dữ liệu của Deep Learning' },
      { id: 'linear-regression', title: 'Hồi quy tuyến tính = Least Squares' },
      { id: 'gradient-descent', title: 'Gradient Descent' },
      { id: 'softmax', title: 'Hồi quy Softmax & phân loại' },
      { id: 'generalization', title: 'Overfitting & Regularization' },
    ],
    load: () => import('./ch10-ml/index'),
  },
  {
    id: 'ch11-neural-nets',
    num: 11,
    title: 'Mạng nơ-ron',
    subtitle: 'Neuron, MLP, lan truyền xuôi/ngược',
    lessons: [
      { id: 'neuron', title: 'Neuron = Dot product + Activation' },
      { id: 'mlp', title: 'Multilayer Perceptron' },
      { id: 'forward', title: 'Lan truyền xuôi (Forward)' },
      { id: 'backprop', title: 'Lan truyền ngược (Backprop)' },
      { id: 'activations', title: 'Hàm kích hoạt' },
    ],
    load: () => import('./ch11-neural-nets/index'),
  },
  {
    id: 'ch12-modern-dl',
    num: 12,
    title: 'Học sâu hiện đại',
    subtitle: 'CNN, RNN, Attention/Transformer, Embeddings',
    lessons: [
      { id: 'cnn', title: 'CNN — Tích chập' },
      { id: 'rnn', title: 'RNN — Chuỗi & trạng thái ẩn' },
      { id: 'attention', title: 'Attention & Transformer' },
      { id: 'embeddings', title: 'Word Embeddings' },
    ],
    load: () => import('./ch12-modern-dl/index'),
  },
  {
    id: 'ch13-optimization-apps',
    num: 13,
    title: 'Tối ưu & Ứng dụng',
    subtitle: 'SGD/Adam, Batch Norm, CV, NLP',
    lessons: [
      { id: 'optimizers', title: 'SGD, Momentum, Adam' },
      { id: 'batchnorm', title: 'Batch Norm & khởi tạo' },
      { id: 'cv', title: 'Thị giác máy tính (tổng quan)' },
      { id: 'nlp', title: 'NLP & mô hình ngôn ngữ (tổng quan)' },
    ],
    load: () => import('./ch13-optimization-apps/index'),
  },
];

// Merge: 14 chương gốc + các chương từ content module (giữ nguyên export `chapters`).
export const chapters: ChapterMeta[] = [...baseChapters, ...moduleChapters];

export function findChapter(chapterId: string): ChapterMeta | undefined {
  return chapters.find((c) => c.id === chapterId);
}

// Danh sách lesson toàn cục (phẳng) theo thứ tự — dùng cho prev/next
export interface FlatLesson {
  chapterId: string;
  lessonId: string;
  chapterTitle: string;
  lessonTitle: string;
}

export const flatLessons: FlatLesson[] = chapters.flatMap((c) =>
  c.lessons.map((l) => ({
    chapterId: c.id,
    lessonId: l.id,
    chapterTitle: c.title,
    lessonTitle: l.title,
  }))
);
