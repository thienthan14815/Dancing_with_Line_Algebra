// ===========================================================================
// NGÂN HÀNG BÀI TẬP — SECTION ch9 "Dạng toàn phương".
// Dữ liệu thuần, KHÔNG UI, KHÔNG random. Nội dung GỐC (số liệu & câu chữ tự
// soạn, không sao chép/dịch từ sách); kỹ thuật toán là kiến thức chung.
//
// skillId dùng ở đây đều CÓ THẬT và thuộc Section ch9 (xem course.ts / skills.ts):
//   quadratic_form, definiteness, spectral_theorem, conic_sections.
//
// Đáp án đã rà tay từng bài. Trải difficulty 1..4, nhiều dạng bài, mỗi bài có
// 2–4 gợi ý theo bậc.
//
// Quy ước: dạng toàn phương q = a·x² + b·y² + c·xy ứng với ma trận đối xứng
// A = [[a, c/2], [c/2, b]] (phần tử ngoài đường chéo = MỘT NỬA hệ số số hạng chéo).
//
// Export: `exercises: Exercise[]`.
// ===========================================================================

import type { Exercise } from '../../exercises/types';

export const exercises: Exercise[] = [
  // --- quadratic_form -------------------------------------------------------
  {
    id: 'ch9-qf-to-matrix',
    type: 'matrix-input',
    skillId: 'quadratic_form',
    dimension: 'compute',
    difficulty: 2,
    prompt:
      'Viết ma trận đối xứng A của dạng toàn phương q(x, y) = 2x² + 6xy + 5y² (sao cho q = [x y] A [x y]ᵀ). Nhập ma trận 2×2.',
    rows: 2,
    cols: 2,
    answer: [
      [2, 3],
      [3, 5],
    ],
    tolerance: 0,
    explain:
      'Đường chéo lấy hệ số bình phương: a₁₁ = 2, a₂₂ = 5. Phần tử ngoài đường chéo bằng MỘT NỬA hệ số xy: a₁₂ = a₂₁ = 6/2 = 3. Vậy A = [[2, 3], [3, 5]].',
    hints: [
      { level: 1, text: 'Hệ số của x² và y² nằm trên đường chéo.' },
      { level: 2, text: 'Hệ số của xy phải CHIA ĐÔI rồi đặt vào hai vị trí ngoài đường chéo.' },
      { level: 3, text: 'a₁₂ = a₂₁ = 6/2 = 3.' },
    ],
  },
  {
    id: 'ch9-qf-from-matrix',
    type: 'multiple-choice',
    skillId: 'quadratic_form',
    dimension: 'concept',
    difficulty: 2,
    prompt: 'Cho ma trận đối xứng A = [[1, −2], [−2, 3]]. Dạng toàn phương q(x, y) = [x y] A [x y]ᵀ là biểu thức nào?',
    options: ['x² − 4xy + 3y²', 'x² − 2xy + 3y²', 'x² + 4xy + 3y²', 'x² − 4xy − 3y²'],
    answerIndex: 0,
    explain:
      'q = a₁₁x² + a₂₂y² + 2·a₁₂·xy = 1·x² + 3·y² + 2·(−2)·xy = x² − 4xy + 3y². Hệ số của xy gấp ĐÔI phần tử ngoài đường chéo.',
    hints: [
      { level: 1, text: 'q = a₁₁x² + 2a₁₂xy + a₂₂y².' },
      { level: 2, text: 'Hệ số của xy là 2·a₁₂, không phải a₁₂.' },
      { level: 3, text: '2·(−2) = −4.' },
    ],
  },
  {
    id: 'ch9-qf-evaluate',
    type: 'numeric-input',
    skillId: 'quadratic_form',
    dimension: 'compute',
    difficulty: 1,
    prompt: 'Cho q(x, y) = 2x² + 6xy + 5y². Tính giá trị q(1, −1).',
    answer: 1,
    tolerance: 0,
    explain: 'q(1, −1) = 2·1² + 6·(1)(−1) + 5·(−1)² = 2 − 6 + 5 = 1.',
    hints: [
      { level: 1, text: 'Thay x = 1, y = −1 vào từng số hạng.' },
      { level: 2, text: 'Số hạng chéo: 6·(1)(−1) = −6.' },
      { level: 3, text: '2 − 6 + 5 = ?' },
    ],
  },
  {
    id: 'ch9-qf-3var-matrix',
    type: 'matrix-input',
    skillId: 'quadratic_form',
    dimension: 'compute',
    difficulty: 3,
    prompt:
      'Viết ma trận đối xứng A (3×3) của q(x, y, z) = x² + 2y² + 3z² + 4xy − 6yz. (Không có số hạng xz.)',
    rows: 3,
    cols: 3,
    answer: [
      [1, 2, 0],
      [2, 2, -3],
      [0, -3, 3],
    ],
    tolerance: 0,
    explain:
      'Đường chéo: 1, 2, 3. Mỗi phần tử ngoài đường chéo bằng nửa hệ số số hạng chéo tương ứng: xy = 4 → a₁₂ = a₂₁ = 2; yz = −6 → a₂₃ = a₃₂ = −3; xz = 0 → a₁₃ = a₃₁ = 0.',
    hints: [
      { level: 1, text: 'Ba hệ số bình phương đặt lên đường chéo.' },
      { level: 2, text: 'Phần tử ngoài đường chéo = một nửa hệ số của số hạng chéo tương ứng.' },
      { level: 3, text: 'xy = 4 → 2; yz = −6 → −3; xz = 0 → 0.' },
    ],
  },

  // --- definiteness ---------------------------------------------------------
  {
    id: 'ch9-def-eigen-classify',
    type: 'multiple-choice',
    skillId: 'definiteness',
    dimension: 'concept',
    difficulty: 2,
    prompt:
      'Một ma trận đối xứng có các giá trị riêng λ₁ = 4 và λ₂ = −1. Dạng toàn phương tương ứng thuộc loại nào?',
    options: [
      'Xác định dương (positive definite)',
      'Xác định âm (negative definite)',
      'Không xác định dấu (indefinite)',
      'Nửa xác định dương (positive semidefinite)',
    ],
    answerIndex: 2,
    explain:
      'Có một giá trị riêng dương (4) và một âm (−1), nên dạng toàn phương nhận cả giá trị dương lẫn âm ⟹ không xác định dấu (indefinite).',
    hints: [
      { level: 1, text: 'Dấu của dạng toàn phương do dấu các giá trị riêng quyết định.' },
      { level: 2, text: 'Vừa có λ dương vừa có λ âm thì dạng nhận cả hai dấu.' },
    ],
  },
  {
    id: 'ch9-def-sylvester',
    type: 'multiple-choice',
    skillId: 'definiteness',
    dimension: 'compute',
    difficulty: 3,
    prompt:
      'Dùng tiêu chuẩn Sylvester (các định thức con chính) để phân loại A = [[2, 1], [1, 2]].',
    options: [
      'Xác định dương',
      'Xác định âm',
      'Không xác định dấu',
      'Suy biến (định thức bằng 0)',
    ],
    answerIndex: 0,
    explain:
      'Định thức con chính cấp 1: D₁ = 2 > 0. Cấp 2: D₂ = det A = 2·2 − 1·1 = 3 > 0. Cả hai đều dương nên A xác định dương (khớp với giá trị riêng 3 và 1 đều dương).',
    hints: [
      { level: 1, text: 'Xác định dương ⟺ MỌI định thức con chính đầu (leading minors) đều dương.' },
      { level: 2, text: 'D₁ = 2; D₂ = det A = 4 − 1 = 3.' },
      { level: 3, text: 'Cả hai định thức con đều dương.' },
    ],
  },
  {
    id: 'ch9-def-tf',
    type: 'true-false',
    skillId: 'definiteness',
    dimension: 'concept',
    difficulty: 2,
    prompt: 'Đúng hay Sai?',
    statement:
      'Một ma trận đối xứng xác định dương khi và chỉ khi mọi giá trị riêng của nó đều dương.',
    answer: true,
    explain:
      'Theo định lý phổ, A = QΛQᵀ nên xᵀAx = yᵀΛy = Σ λᵢ yᵢ² với y = Qᵀx. Biểu thức này dương với mọi x ≠ 0 khi và chỉ khi mọi λᵢ > 0.',
    hints: [
      { level: 1, text: 'Chéo hóa trực giao đưa xᵀAx về tổng λᵢ·yᵢ².' },
      { level: 2, text: 'Tổng đó dương với mọi y ≠ 0 khi các λᵢ đều dương.' },
    ],
  },
  {
    id: 'ch9-def-find-k',
    type: 'numeric-input',
    skillId: 'definiteness',
    dimension: 'compute',
    difficulty: 3,
    prompt:
      'Cho A = [[4, 2], [2, k]]. Tìm giá trị NGUYÊN NHỎ NHẤT của k để A xác định dương.',
    answer: 2,
    tolerance: 0,
    explain:
      'Sylvester: D₁ = 4 > 0 (luôn đúng); D₂ = det A = 4k − 4 > 0 ⟺ k > 1. Số nguyên nhỏ nhất thỏa k > 1 là k = 2.',
    hints: [
      { level: 1, text: 'Cần cả hai định thức con chính đều dương.' },
      { level: 2, text: 'det A = 4k − 2·2 = 4k − 4, đòi hỏi > 0 nên k > 1.' },
      { level: 3, text: 'Số nguyên nhỏ nhất lớn hơn 1.' },
    ],
  },

  // --- spectral_theorem -----------------------------------------------------
  {
    id: 'ch9-spectral-tf',
    type: 'true-false',
    skillId: 'spectral_theorem',
    dimension: 'concept',
    difficulty: 2,
    prompt: 'Đúng hay Sai?',
    statement:
      'Mọi ma trận đối xứng thực đều chéo hóa được bằng một ma trận trực giao, tức A = QΛQᵀ với Q trực giao và Λ đường chéo.',
    answer: true,
    explain:
      'Đây chính là định lý phổ cho ma trận đối xứng thực: các giá trị riêng đều thực và tồn tại một cơ sở trực chuẩn gồm các vector riêng, gom thành các cột của Q.',
    hints: [
      { level: 1, text: 'Đây là phát biểu của định lý phổ (spectral theorem).' },
      { level: 2, text: 'Ma trận đối xứng thực luôn có cơ sở trực chuẩn gồm vector riêng.' },
    ],
  },
  {
    id: 'ch9-spectral-steps',
    type: 'step-ordering',
    skillId: 'spectral_theorem',
    dimension: 'concept',
    difficulty: 3,
    prompt: 'Sắp xếp các bước chéo hóa trực giao một ma trận đối xứng A.',
    steps: [
      'Tìm các giá trị riêng λ bằng cách giải det(A − λI) = 0',
      'Với mỗi λ, giải (A − λI)v = 0 để tìm các vector riêng',
      'Chuẩn hóa (và trực giao hóa nếu cùng một λ) các vector riêng thành các cột trực chuẩn của Q',
      'Viết A = QΛQᵀ với Λ là ma trận đường chéo chứa các giá trị riêng',
    ],
    explain:
      'Các vector riêng ứng với giá trị riêng KHÁC nhau của ma trận đối xứng tự động trực giao; chỉ cần chuẩn hóa (và trực giao hóa trong cùng một không gian riêng) là thu được Q trực giao.',
    hints: [
      { level: 1, text: 'Luôn tìm giá trị riêng trước vector riêng.' },
      { level: 2, text: 'Q phải có các cột trực chuẩn nên bước chuẩn hóa đứng trước khi ghép A = QΛQᵀ.' },
    ],
  },

  // --- conic_sections -------------------------------------------------------
  {
    id: 'ch9-conic-classify',
    type: 'multiple-choice',
    skillId: 'conic_sections',
    dimension: 'concept',
    difficulty: 3,
    prompt:
      'Sau khi khử số hạng chéo bằng phép quay, một conic (không suy biến, dạng λ₁x′² + λ₂y′² = c với c > 0) có hai giá trị riêng TRÁI DẤU. Đó là đường bậc hai loại nào?',
    options: ['Elip', 'Hyperbol', 'Parabol', 'Đường tròn'],
    answerIndex: 1,
    explain:
      'Hai giá trị riêng trái dấu cho phương trình dạng λ₁x′² − |λ₂|y′² = c, chính là dạng chính tắc của hyperbol. (Cùng dấu ⟹ elip; nếu bằng nhau ⟹ đường tròn.)',
    hints: [
      { level: 1, text: 'Dấu của hai giá trị riêng quyết định loại conic.' },
      { level: 2, text: 'Cùng dấu ⟹ elip; trái dấu ⟹ ?' },
    ],
  },
  {
    id: 'ch9-conic-eigen',
    type: 'numeric-input',
    skillId: 'conic_sections',
    dimension: 'compute',
    difficulty: 3,
    prompt:
      'Dạng toàn phương q = 2x² + 2xy + 2y² có ma trận A = [[2, 1], [1, 2]]. Sau khi chéo hóa trực giao, q = λ₁x′² + λ₂y′². Nhập giá trị riêng LỚN HƠN (λ₁).',
    answer: 3,
    tolerance: 0,
    explain:
      'det(A − λI) = (2 − λ)² − 1 = 0 ⟹ 2 − λ = ±1 ⟹ λ = 3 hoặc λ = 1. Giá trị riêng lớn hơn là 3. Cả hai đều dương nên conic 2x² + 2xy + 2y² = c (c > 0) là một elip.',
    hints: [
      { level: 1, text: 'Giải phương trình đặc trưng det(A − λI) = 0.' },
      { level: 2, text: '(2 − λ)² − 1 = 0 nên 2 − λ = ±1.' },
      { level: 3, text: 'Hai nghiệm là 1 và 3; chọn nghiệm lớn hơn.' },
    ],
  },
  {
    id: 'ch9-qf-halfcoef-error',
    type: 'error-detection',
    skillId: 'quadratic_form',
    dimension: 'compute',
    difficulty: 3,
    prompt: 'Tìm dòng SAI khi lập ma trận đối xứng của q(x, y) = 4x² + 10xy + 3y².',
    lines: [
      'Hệ số x² và y²: a₁₁ = 4, a₂₂ = 3',
      'Hệ số của số hạng chéo xy là 10',
      'Phần tử ngoài đường chéo: a₁₂ = a₂₁ = 10',
      'Kết luận: A = [[4, 10], [10, 3]]',
    ],
    wrongLineIndex: 2,
    explain:
      'Phần tử ngoài đường chéo phải là MỘT NỬA hệ số xy: a₁₂ = a₂₁ = 10/2 = 5. Ma trận đúng là A = [[4, 5], [5, 3]] (kiểm tra: 2·5 = 10 đúng bằng hệ số xy).',
    hints: [
      { level: 1, text: 'Nhớ rằng hệ số xy = 2·a₁₂, nên a₁₂ = (hệ số xy)/2.' },
      { level: 2, text: 'Dòng nào đặt a₁₂ bằng nguyên hệ số 10?' },
      { level: 3, text: 'a₁₂ đúng phải là 10/2 = 5.' },
    ],
  },
];
