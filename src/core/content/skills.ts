import type { Skill } from './types';

// Danh sách kỹ năng cốt lõi của khóa Đại số tuyến tính.
// id snake_case, ổn định — dùng làm khóa mastery và để exercise trỏ tới.
// Bao phủ toàn bộ 10 chương (ch0..ch9) trong src/chapters/registry.ts.
export const SKILLS: Skill[] = [
  // Ch0 — Nền tảng
  { id: 'coordinate_systems', name: 'Hệ tọa độ (Coordinate systems)' },
  { id: 'functions_graphs', name: 'Hàm số & đồ thị (Functions & graphs)' },
  { id: 'trigonometry', name: 'Lượng giác (Trigonometry)' },
  { id: 'math_notation', name: 'Ký hiệu toán học (Notation)' },

  // Ch1 — Vector
  { id: 'vector_basics', name: 'Khái niệm vector (Vector basics)' },
  { id: 'vector_addition', name: 'Cộng/trừ vector (Vector addition)' },
  { id: 'scalar_multiplication', name: 'Nhân vô hướng (Scalar multiplication)' },
  { id: 'linear_combination', name: 'Tổ hợp tuyến tính (Linear combination)' },
  { id: 'span', name: 'Span (Không gian sinh)' },
  { id: 'dot_product', name: 'Tích vô hướng (Dot product)' },
  { id: 'cross_product', name: 'Tích có hướng (Cross product)' },

  // Ch2 — Hệ phương trình
  { id: 'linear_system', name: 'Hệ phương trình tuyến tính (Linear system)' },
  { id: 'gaussian_elimination', name: 'Khử Gauss (Gaussian elimination)' },
  { id: 'solution_types', name: 'Loại nghiệm (Solution types)' },

  // Ch3 — Ma trận
  { id: 'matrix_transformation', name: 'Ma trận = biến đổi tuyến tính (Matrix as transform)' },
  { id: 'matrix_multiplication', name: 'Nhân ma trận (Matrix multiplication)' },
  { id: 'determinant', name: 'Định thức (Determinant)' },
  { id: 'matrix_inverse', name: 'Ma trận nghịch đảo (Matrix inverse)' },
  { id: 'special_matrices', name: 'Ma trận đặc biệt (Special matrices)' },

  // Ch4 — Không gian vector
  { id: 'subspace', name: 'Không gian con (Subspace)' },
  { id: 'column_null_space', name: 'Column space & Null space' },
  { id: 'linear_independence', name: 'Độc lập tuyến tính (Linear independence)' },
  { id: 'basis_dimension', name: 'Cơ sở & số chiều (Basis & dimension)' },
  { id: 'rank', name: 'Hạng ma trận (Rank)' },
  { id: 'change_of_basis', name: 'Đổi cơ sở (Change of basis)' },

  // Ch5 — Eigen
  { id: 'eigenvalue', name: 'Giá trị riêng (Eigenvalue)' },
  { id: 'eigenvector', name: 'Vector riêng (Eigenvector)' },
  { id: 'characteristic_polynomial', name: 'Đa thức đặc trưng (Characteristic polynomial)' },
  { id: 'eigenspace', name: 'Không gian riêng (Eigenspace)' },
  { id: 'diagonalization', name: 'Chéo hóa (Diagonalization)' },
  { id: 'matrix_powers', name: 'Lũy thừa ma trận (Matrix powers)' },

  // Ch6 — SVD
  { id: 'svd', name: 'Phân tích SVD (Singular value decomposition)' },
  { id: 'singular_values', name: 'Giá trị kỳ dị (Singular values)' },
  { id: 'rank_k_approximation', name: 'Xấp xỉ rank-k (Rank-k approximation)' },
  { id: 'pca', name: 'Phân tích thành phần chính (PCA)' },

  // Ch7 — Ứng dụng bằng code
  { id: 'least_squares', name: 'Bình phương tối thiểu (Least squares)' },
  { id: 'markov_pagerank', name: 'Markov chain & PageRank' },

  // Ch8 — Trực giao
  { id: 'orthogonality', name: 'Trực giao (Orthogonality)' },
  { id: 'projection', name: 'Phép chiếu (Projection)' },
  { id: 'gram_schmidt', name: 'Gram–Schmidt' },
  { id: 'qr_decomposition', name: 'Phân tích QR (QR decomposition)' },

  // Ch9 — Dạng toàn phương
  { id: 'quadratic_form', name: 'Dạng toàn phương (Quadratic form)' },
  { id: 'definiteness', name: 'Xác định dấu (Definiteness)' },
  { id: 'spectral_theorem', name: 'Định lý phổ (Spectral theorem)' },
  { id: 'conic_sections', name: 'Đường & mặt bậc hai (Conics & quadrics)' },
];

/** Tra cứu nhanh skill theo id. */
export const SKILL_BY_ID: Record<string, Skill> = Object.fromEntries(
  SKILLS.map((s) => [s.id, s]),
);

/** Lấy 1 skill theo id (undefined nếu không tồn tại). */
export function getSkill(id: string): Skill | undefined {
  return SKILL_BY_ID[id];
}

/** Tập hợp id skill hợp lệ — tiện cho việc kiểm tra tính đúng đắn. */
export const SKILL_IDS: string[] = SKILLS.map((s) => s.id);
