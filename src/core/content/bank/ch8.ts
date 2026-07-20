// ===========================================================================
// NGÂN HÀNG BÀI TẬP — SECTION ch8 "Trực giao & Bình phương tối thiểu".
// Dữ liệu thuần, KHÔNG UI, KHÔNG random. Nội dung GỐC (số liệu & câu chữ tự
// soạn, không sao chép/dịch từ sách); kỹ thuật toán là kiến thức chung.
//
// skillId dùng ở đây đều CÓ THẬT và thuộc Section ch8 (xem course.ts / skills.ts):
//   orthogonality, projection, gram_schmidt, qr_decomposition, least_squares.
//
// Đáp án đã rà tay từng bài. Trải difficulty 1..4, nhiều dạng bài, mỗi bài có
// 2–4 gợi ý theo bậc.
//
// Export: `exercises: Exercise[]`.
// ===========================================================================

import type { Exercise } from '../../exercises/types';

export const exercises: Exercise[] = [
  // --- orthogonality --------------------------------------------------------
  {
    id: 'ch8-orth-check-dot',
    type: 'true-false',
    skillId: 'orthogonality',
    dimension: 'concept',
    difficulty: 1,
    prompt: 'Đúng hay Sai?',
    statement: 'Hai vector u = (1, 2, −1) và v = (3, −1, 1) trực giao với nhau.',
    answer: true,
    explain:
      'Hai vector trực giao khi tích vô hướng bằng 0. u · v = 1·3 + 2·(−1) + (−1)·1 = 3 − 2 − 1 = 0, nên chúng trực giao.',
    hints: [
      { level: 1, text: 'Trực giao ⟺ tích vô hướng u · v bằng 0.' },
      { level: 2, text: 'Tính 1·3 + 2·(−1) + (−1)·1.' },
      { level: 3, text: '3 − 2 − 1 = 0.' },
    ],
  },
  {
    id: 'ch8-orth-find-k',
    type: 'numeric-input',
    skillId: 'orthogonality',
    dimension: 'compute',
    difficulty: 2,
    prompt: 'Tìm số k để hai vector u = (2, k, −1) và v = (3, 1, 4) trực giao.',
    answer: -2,
    tolerance: 0,
    explain:
      'Cần u · v = 0: 2·3 + k·1 + (−1)·4 = 6 + k − 4 = k + 2 = 0, suy ra k = −2.',
    hints: [
      { level: 1, text: 'Đặt điều kiện tích vô hướng u · v = 0.' },
      { level: 2, text: 'u · v = 6 + k − 4 = k + 2.' },
      { level: 3, text: 'Giải k + 2 = 0.' },
    ],
  },
  {
    id: 'ch8-orth-orthonormal-cols',
    type: 'multiple-choice',
    skillId: 'orthogonality',
    dimension: 'concept',
    difficulty: 3,
    prompt:
      'Ma trận vuông Q có các cột trực chuẩn (orthonormal). Đẳng thức nào sau đây LUÔN đúng?',
    options: ['QᵀQ = I', 'Q + Qᵀ = I', 'QQ = I', 'det Q = 0'],
    answerIndex: 0,
    explain:
      'Phần tử (i, j) của QᵀQ chính là tích vô hướng cột i với cột j. Trực chuẩn nghĩa là tích đó bằng 1 khi i = j và bằng 0 khi i ≠ j, tức QᵀQ = I. Vì Q vuông nên còn suy ra Q⁻¹ = Qᵀ.',
    hints: [
      { level: 1, text: 'Xét tích QᵀQ và ý nghĩa từng phần tử của nó.' },
      { level: 2, text: 'Phần tử (i, j) của QᵀQ là (cột i) · (cột j).' },
      { level: 3, text: 'Trực chuẩn ⟹ ma trận đó là ma trận đơn vị I.' },
    ],
  },

  // --- projection -----------------------------------------------------------
  {
    id: 'ch8-proj-scalar',
    type: 'numeric-input',
    skillId: 'projection',
    dimension: 'compute',
    difficulty: 2,
    prompt:
      'Chiếu b = (4, 2) lên đường thẳng sinh bởi a = (1, 1). Tính hệ số chiếu c = (a·b)/(a·a).',
    answer: 3,
    tolerance: 0,
    explain: 'a · b = 1·4 + 1·2 = 6; a · a = 1 + 1 = 2; c = 6/2 = 3. Hình chiếu là p = c·a = (3, 3).',
    hints: [
      { level: 1, text: 'Hệ số chiếu lên một đường là c = (a·b)/(a·a).' },
      { level: 2, text: 'a·b = 6 và a·a = 2.' },
      { level: 3, text: '6 chia 2 bằng bao nhiêu?' },
    ],
  },
  {
    id: 'ch8-proj-vector',
    type: 'matrix-input',
    skillId: 'projection',
    dimension: 'compute',
    difficulty: 3,
    prompt:
      'Tính vector hình chiếu p của b = (5, 5) lên đường thẳng sinh bởi a = (1, 3). Viết p dạng cột.',
    rows: 2,
    cols: 1,
    answer: [[2], [6]],
    tolerance: 0.001,
    explain:
      'c = (a·b)/(a·a) = (5 + 15)/(1 + 9) = 20/10 = 2; p = c·a = 2·(1, 3) = (2, 6). Kiểm tra: b − p = (3, −1) trực giao với a vì (3)(1) + (−1)(3) = 0.',
    hints: [
      { level: 1, text: 'Trước hết tìm hệ số c = (a·b)/(a·a).' },
      { level: 2, text: 'a·b = 20, a·a = 10, nên c = 2.' },
      { level: 3, text: 'p = 2·(1, 3).' },
    ],
  },
  {
    id: 'ch8-proj-onto-axis-draw',
    type: 'vector-drawing',
    skillId: 'projection',
    dimension: 'visual',
    difficulty: 2,
    prompt: 'Vẽ hình chiếu vuông góc của b = (2, 3) lên trục hoành (đường sinh bởi (1, 0)).',
    target: [2, 0],
    tolerance: 0.3,
    explain:
      'Chiếu lên trục hoành nghĩa là giữ nguyên thành phần x và bỏ thành phần y: hình chiếu là (2, 0).',
    hints: [
      { level: 1, text: 'Hình chiếu lên trục hoành nằm ngay trên trục x.' },
      { level: 2, text: 'Giữ thành phần x = 2, cho thành phần y về 0.' },
    ],
  },
  {
    id: 'ch8-proj-matrix',
    type: 'matrix-input',
    skillId: 'projection',
    dimension: 'compute',
    difficulty: 3,
    prompt:
      'Lập ma trận chiếu P lên đường thẳng sinh bởi a = (1, 1), theo công thức P = a·aᵀ / (aᵀa). Nhập ma trận 2×2.',
    rows: 2,
    cols: 2,
    answer: [
      [0.5, 0.5],
      [0.5, 0.5],
    ],
    tolerance: 0.001,
    explain:
      'a·aᵀ = [[1, 1], [1, 1]] và aᵀa = 2, nên P = [[0.5, 0.5], [0.5, 0.5]]. Ma trận chiếu thỏa P² = P (chiếu hai lần cũng như chiếu một lần).',
    hints: [
      { level: 1, text: 'Tử số a·aᵀ là ma trận 2×2, mẫu số aᵀa là một số.' },
      { level: 2, text: 'a·aᵀ = [[1, 1], [1, 1]] và aᵀa = 1 + 1 = 2.' },
      { level: 3, text: 'Chia mỗi phần tử của tử số cho 2.' },
    ],
  },
  {
    id: 'ch8-proj-error',
    type: 'error-detection',
    skillId: 'projection',
    dimension: 'compute',
    difficulty: 3,
    prompt: 'Tìm dòng SAI khi chiếu b = (4, 3) lên đường thẳng sinh bởi a = (1, 2).',
    lines: [
      'a · b = 1·4 + 2·3 = 4 + 6 = 10',
      'a · a = 1² + 2² = 1 + 4 = 5',
      'Hệ số chiếu c = (a·b)/(a·a) = 10/5 = 2',
      'Hình chiếu p = c·a = 2·(1, 2) = (2, 2)',
    ],
    wrongLineIndex: 3,
    explain:
      'Nhân vô hướng phải nhân MỌI thành phần của a: 2·(1, 2) = (2, 4), không phải (2, 2). Hình chiếu đúng là p = (2, 4).',
    hints: [
      { level: 1, text: 'Các bước tính c đều đúng; hãy kiểm tra bước nhân c với a.' },
      { level: 2, text: '2·(1, 2) nghĩa là nhân cả hai thành phần với 2.' },
      { level: 3, text: 'Thành phần thứ hai: 2·2 = 4.' },
    ],
  },

  // --- gram_schmidt ---------------------------------------------------------
  {
    id: 'ch8-gs-steps',
    type: 'step-ordering',
    skillId: 'gram_schmidt',
    dimension: 'concept',
    difficulty: 3,
    prompt: 'Sắp xếp đúng thứ tự các bước Gram–Schmidt cho hai vector v₁, v₂.',
    steps: [
      'Đặt u₁ = v₁ (giữ nguyên vector đầu tiên)',
      'Tính hình chiếu của v₂ lên u₁: proj = (v₂·u₁ / u₁·u₁)·u₁',
      'Trừ đi hình chiếu để khử phần cùng phương: u₂ = v₂ − proj',
      'Chuẩn hóa mỗi uᵢ thành eᵢ = uᵢ / ‖uᵢ‖ để có cơ sở trực chuẩn',
    ],
    explain:
      'Gram–Schmidt lần lượt loại bỏ thành phần cùng phương với các vector đã trực giao hóa trước đó, rồi chuẩn hóa để độ dài bằng 1.',
    hints: [
      { level: 1, text: 'Vector đầu tiên được giữ nguyên làm mốc.' },
      { level: 2, text: 'Muốn u₂ ⊥ u₁ thì phải trừ đi hình chiếu của v₂ lên u₁.' },
      { level: 3, text: 'Chuẩn hóa là bước cuối cùng, khi các vector đã trực giao.' },
    ],
  },
  {
    id: 'ch8-gs-u2',
    type: 'matrix-input',
    skillId: 'gram_schmidt',
    dimension: 'compute',
    difficulty: 3,
    prompt:
      'Gram–Schmidt với v₁ = (1, 1, 0) và v₂ = (1, 0, 1). Đặt u₁ = v₁. Tính u₂ = v₂ − (v₂·u₁ / u₁·u₁)·u₁ (viết dạng cột).',
    rows: 3,
    cols: 1,
    answer: [[0.5], [-0.5], [1]],
    tolerance: 0.001,
    explain:
      'v₂·u₁ = 1·1 + 0·1 + 1·0 = 1; u₁·u₁ = 1 + 1 + 0 = 2; hình chiếu = (1/2)(1, 1, 0) = (0.5, 0.5, 0). Vậy u₂ = (1, 0, 1) − (0.5, 0.5, 0) = (0.5, −0.5, 1). Kiểm tra u₁·u₂ = 0.5 − 0.5 + 0 = 0.',
    hints: [
      { level: 1, text: 'Tính v₂·u₁ và u₁·u₁ trước.' },
      { level: 2, text: 'Hình chiếu = (1/2)·(1, 1, 0) = (0.5, 0.5, 0).' },
      { level: 3, text: 'u₂ = (1, 0, 1) − (0.5, 0.5, 0).' },
    ],
  },

  // --- qr_decomposition -----------------------------------------------------
  {
    id: 'ch8-qr-concept',
    type: 'multiple-choice',
    skillId: 'qr_decomposition',
    dimension: 'concept',
    difficulty: 2,
    prompt: 'Trong phân tích A = QR (A đủ hạng cột), Q và R có tính chất gì?',
    options: [
      'Q có các cột trực chuẩn, R là ma trận tam giác trên',
      'Q là ma trận tam giác trên, R trực giao',
      'Q và R đều là ma trận đối xứng',
      'Q là ma trận đường chéo, R tùy ý',
    ],
    answerIndex: 0,
    explain:
      'QR sinh ra từ Gram–Schmidt: Q gom các vector trực chuẩn thành cột, còn R (chứa các hệ số chiếu) là ma trận tam giác trên với đường chéo dương.',
    hints: [
      { level: 1, text: 'Q đến từ việc trực chuẩn hóa các cột của A.' },
      { level: 2, text: 'R lưu các hệ số của Gram–Schmidt nên có dạng tam giác.' },
    ],
  },

  // --- least_squares --------------------------------------------------------
  {
    id: 'ch8-ls-ata',
    type: 'matrix-input',
    skillId: 'least_squares',
    dimension: 'compute',
    difficulty: 3,
    prompt:
      'Cho A = [[1, 1], [1, 2], [1, 3]]. Tính AᵀA (ma trận 2×2) dùng trong phương trình chuẩn tắc AᵀA x̂ = Aᵀb.',
    rows: 2,
    cols: 2,
    answer: [
      [3, 6],
      [6, 14],
    ],
    tolerance: 0,
    explain:
      'Cột 1 = (1, 1, 1), cột 2 = (1, 2, 3). (AᵀA)₁₁ = 1+1+1 = 3; (AᵀA)₁₂ = (AᵀA)₂₁ = 1+2+3 = 6; (AᵀA)₂₂ = 1+4+9 = 14. Vậy AᵀA = [[3, 6], [6, 14]].',
    hints: [
      { level: 1, text: 'Phần tử (i, j) của AᵀA là tích vô hướng cột i với cột j của A.' },
      { level: 2, text: '(1,1): (1,1,1)·(1,1,1) = 3; (2,2): (1,2,3)·(1,2,3) = 14.' },
      { level: 3, text: 'Phần tử ngoài đường chéo: (1,1,1)·(1,2,3) = 6.' },
    ],
  },
  {
    id: 'ch8-ls-steps',
    type: 'step-ordering',
    skillId: 'least_squares',
    dimension: 'concept',
    difficulty: 4,
    prompt: 'Sắp xếp các bước giải bài toán bình phương tối thiểu bằng phương trình chuẩn tắc.',
    steps: [
      'Viết mô hình dưới dạng ma trận: Ax ≈ b (hệ thường vô nghiệm chính xác)',
      'Nhân trái hai vế với Aᵀ để lập phương trình chuẩn tắc: AᵀA x̂ = Aᵀb',
      'Tính hai đại lượng AᵀA và Aᵀb',
      'Giải hệ AᵀA x̂ = Aᵀb để tìm nghiệm xấp xỉ x̂',
    ],
    explain:
      'Nghiệm bình phương tối thiểu làm sai số ‖Ax − b‖ nhỏ nhất; điều kiện đó tương đương phần dư trực giao với các cột của A, dẫn tới phương trình chuẩn tắc AᵀA x̂ = Aᵀb.',
    hints: [
      { level: 1, text: 'Bắt đầu từ hệ gốc Ax ≈ b.' },
      { level: 2, text: 'Nhân với Aᵀ để phần dư trực giao với các cột của A.' },
      { level: 3, text: 'Chỉ giải hệ sau khi đã có AᵀA và Aᵀb.' },
    ],
  },
];
