import type { Exercise } from './types';

// SAMPLE_EXERCISES — bộ bài MẪU đủ 8 dạng để agent UI test renderer + engine.
// Nội dung GỐC (số liệu tự nghĩ, không chép sách). Mọi skillId đều có trong skills.ts.
export const SAMPLE_EXERCISES: Exercise[] = [
  // 1) multiple-choice — khái niệm dot product
  {
    id: 'sample-mc-dot',
    type: 'multiple-choice',
    skillId: 'dot_product',
    dimension: 'concept',
    difficulty: 2,
    prompt: 'Tích vô hướng của hai vector khác 0 bằng 0 nói lên điều gì?',
    options: [
      'Hai vector song song',
      'Hai vector vuông góc',
      'Hai vector cùng độ dài',
      'Hai vector ngược hướng',
    ],
    answerIndex: 1,
    explain: 'a·b = |a||b|cosθ; bằng 0 khi cosθ = 0, tức θ = 90° (vuông góc).',
    hints: [
      { level: 1, text: 'Nhớ công thức a·b = |a||b|cosθ.' },
      { level: 2, text: 'Cả hai vector đều khác 0, vậy độ dài khác 0.' },
      { level: 3, text: 'Chỉ còn cosθ có thể bằng 0.' },
    ],
  },

  // 2) numeric-input — tính dot product
  {
    id: 'sample-num-dot',
    type: 'numeric-input',
    skillId: 'dot_product',
    dimension: 'compute',
    difficulty: 1,
    prompt: 'Tính tích vô hướng của a = (2, 3) và b = (4, −1).',
    answer: 5,
    tolerance: 0,
    explain: '2·4 + 3·(−1) = 8 − 3 = 5.',
    hints: [
      { level: 1, text: 'Nhân từng cặp thành phần tương ứng rồi cộng lại.' },
      { level: 2, text: '2·4 = 8 và 3·(−1) = −3.' },
    ],
  },

  // 3) numeric-input — determinant 2x2
  {
    id: 'sample-num-det',
    type: 'numeric-input',
    skillId: 'determinant',
    dimension: 'compute',
    difficulty: 2,
    prompt: 'Tính định thức của ma trận [[2, 1], [1, 3]].',
    answer: 5,
    tolerance: 0,
    explain: 'det = ad − bc = 2·3 − 1·1 = 5.',
    hints: [
      { level: 1, text: 'Định thức 2×2: ad − bc.' },
      { level: 2, text: 'a=2, d=3, b=1, c=1.' },
    ],
  },

  // 4) matrix-input — nhân vô hướng 2A
  {
    id: 'sample-mat-scale',
    type: 'matrix-input',
    skillId: 'scalar_multiplication',
    dimension: 'compute',
    difficulty: 1,
    prompt: 'Cho A = [[1, −2], [0, 3]]. Tính 2A.',
    rows: 2,
    cols: 2,
    answer: [
      [2, -4],
      [0, 6],
    ],
    tolerance: 0,
    explain: 'Nhân vô hướng nhân mọi phần tử với 2.',
    hints: [
      { level: 1, text: 'Nhân từng ô của A với 2.' },
      { level: 2, text: '2·(−2) = −4; 2·3 = 6.' },
    ],
  },

  // 5) matching — thuật ngữ ↔ định nghĩa
  {
    id: 'sample-match-basis',
    type: 'matching',
    skillId: 'basis_dimension',
    dimension: 'concept',
    difficulty: 3,
    prompt: 'Ghép mỗi thuật ngữ với định nghĩa đúng.',
    left: ['Basis', 'Rank', 'Span'],
    right: [
      'Số vector độc lập tuyến tính tối đa',
      'Tập vector độc lập tuyến tính sinh ra toàn không gian',
      'Tập mọi tổ hợp tuyến tính của các vector',
    ],
    pairs: [
      [0, 1],
      [1, 0],
      [2, 2],
    ],
    explain: 'Basis: sinh + độc lập; Rank: số chiều; Span: tập tổ hợp tuyến tính.',
    hints: [
      { level: 1, text: 'Basis vừa độc lập vừa sinh ra không gian.' },
      { level: 2, text: 'Rank đo "số chiều" của không gian cột.' },
    ],
  },

  // 6) step-ordering — quy trình khử Gauss
  {
    id: 'sample-step-gauss',
    type: 'step-ordering',
    skillId: 'gaussian_elimination',
    dimension: 'compute',
    difficulty: 3,
    prompt: 'Sắp xếp đúng thứ tự các bước khử Gauss để đưa về dạng bậc thang.',
    steps: [
      'Chọn phần tử trụ (pivot) ở cột ngoài cùng bên trái',
      'Dùng phép hàng để tạo số 0 bên dưới pivot',
      'Chuyển sang cột kế tiếp và lặp lại với các hàng còn lại',
      'Thu được ma trận bậc thang rồi thế ngược để tìm nghiệm',
    ],
    explain: 'Khử từ trên xuống theo từng pivot, sau đó thế ngược.',
    hints: [
      { level: 1, text: 'Bắt đầu từ cột trái nhất.' },
      { level: 2, text: 'Tạo số 0 dưới pivot trước khi sang cột mới.' },
    ],
  },

  // 7) vector-drawing — vẽ vector (3, 2)
  {
    id: 'sample-draw-vec',
    type: 'vector-drawing',
    skillId: 'vector_basics',
    dimension: 'visual',
    difficulty: 1,
    prompt: 'Vẽ vector (3, 2) bắt đầu từ gốc tọa độ.',
    target: [3, 2],
    tolerance: 0.3,
    explain: 'Đi 3 đơn vị theo trục x và 2 đơn vị theo trục y.',
    hints: [
      { level: 1, text: 'Thành phần đầu là hướng ngang (x).' },
      { level: 2, text: 'Ngọn vector nằm ở điểm (3, 2).' },
    ],
  },

  // 8) error-detection — tìm dòng sai khi nhân ma trận
  {
    id: 'sample-err-matmul',
    type: 'error-detection',
    skillId: 'matrix_multiplication',
    dimension: 'compute',
    difficulty: 3,
    prompt: 'Tìm dòng SAI trong phép tính phần tử (1,1) của AB với A=[[2,1]], B=[[3],[4]].',
    lines: [
      '(AB)₁₁ = hàng 1 của A · cột 1 của B',
      '(AB)₁₁ = 2·3 + 1·4',
      '(AB)₁₁ = 6 + 5',
      '(AB)₁₁ = 11',
    ],
    wrongLineIndex: 2,
    explain: '1·4 = 4, không phải 5. Dòng "6 + 5" sai; đúng phải là "6 + 4".',
    hints: [
      { level: 1, text: 'Kiểm tra lại từng phép nhân trước khi cộng.' },
      { level: 2, text: '1·4 bằng bao nhiêu?' },
    ],
  },

  // 9) true-false — tính chất định thức
  {
    id: 'sample-tf-det',
    type: 'true-false',
    skillId: 'determinant',
    dimension: 'concept',
    difficulty: 2,
    prompt: 'Đúng hay Sai?',
    statement: 'Nếu một ma trận vuông có một hàng toàn số 0 thì định thức của nó bằng 0.',
    answer: true,
    explain: 'Khai triển theo hàng 0 cho mọi số hạng bằng 0 → det = 0 (ma trận suy biến).',
    hints: [
      { level: 1, text: 'Thử khai triển định thức theo chính hàng số 0 đó.' },
    ],
  },

  // 10) multiple-choice — phân biệt eigenvalue vs eigenvector
  {
    id: 'sample-mc-eigen',
    type: 'multiple-choice',
    skillId: 'eigenvector',
    dimension: 'concept',
    difficulty: 2,
    prompt: 'Với Av = λv (v ≠ 0), đại lượng nào là "hướng bất biến" của biến đổi?',
    options: [
      'Giá trị riêng λ',
      'Vector riêng v',
      'Định thức của A',
      'Vết (trace) của A',
    ],
    answerIndex: 1,
    explain: 'v giữ nguyên hướng sau biến đổi (chỉ bị co giãn bởi λ) nên là hướng bất biến.',
    hints: [
      { level: 1, text: 'λ là một con số (hệ số co giãn), không phải một hướng.' },
      { level: 2, text: '"Hướng" phải là một vector.' },
    ],
  },
];

/** Tra cứu nhanh sample theo id. */
export const SAMPLE_BY_ID: Record<string, Exercise> = Object.fromEntries(
  SAMPLE_EXERCISES.map((e) => [e.id, e]),
);
