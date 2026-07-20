// ===========================================================================
// NGÂN HÀNG BÀI TẬP — SECTION ch6-svd (SVD — Singular Value Decomposition)
//
// Dữ liệu thuần, KHÔNG UI, KHÔNG random. Số liệu & câu chữ tự soạn (nội dung
// GỐC, không sao chép/dịch từ sách); kỹ thuật toán là kiến thức chung. Mọi
// `skillId` đều tồn tại trong ../skills.ts và thuộc Section ch6:
//   • svd                  — Phân tích SVD
//   • singular_values      — Giá trị kỳ dị
//   • rank_k_approximation — Xấp xỉ rank-k
//   • pca                  — Phân tích thành phần chính
//
// Mọi đáp án đã được rà tay. Trải đủ dạng bài (multiple-choice, numeric-input,
// matrix-input, step-ordering, error-detection, true-false, matching) và
// difficulty 1..4. Export: `exercises: Exercise[]`.
// ===========================================================================

import type { Exercise } from '../../exercises/types';

export const exercises: Exercise[] = [
  // -------------------------------------------------------------------------
  // svd — khái niệm & dựng phân tích
  // -------------------------------------------------------------------------
  {
    id: 'ch6-svd-form',
    type: 'multiple-choice',
    skillId: 'svd',
    dimension: 'concept',
    difficulty: 1,
    prompt: 'Phân tích SVD viết một ma trận thực A bất kỳ dưới dạng tích của ba ma trận nào?',
    options: [
      'A = U Σ Vᵀ, với U, V trực giao và Σ đường chéo (chứa giá trị kỳ dị)',
      'A = L U (tam giác dưới nhân tam giác trên)',
      'A = Q R (trực giao nhân tam giác trên)',
      'A = P D P⁻¹ (chéo hóa bằng vector riêng)',
    ],
    answerIndex: 0,
    explain:
      'SVD: A = U Σ Vᵀ. U và V là ma trận trực giao (cột trực chuẩn), Σ là ma trận đường chéo (theo nghĩa rộng) chứa các giá trị kỳ dị σ₁ ≥ σ₂ ≥ … ≥ 0. LU, QR, PDP⁻¹ là các phân tích khác.',
    hints: [
      { level: 1, text: 'S trong SVD là "Singular" (kỳ dị); ba ma trận gồm hai ma trận trực giao kẹp một ma trận đường chéo.' },
      { level: 2, text: 'Ma trận đường chéo ở giữa chứa các giá trị kỳ dị.' },
      { level: 3, text: 'Ký hiệu chuẩn là A = U Σ Vᵀ.' },
    ],
  },
  {
    id: 'ch6-sv-diagonal',
    type: 'numeric-input',
    skillId: 'singular_values',
    dimension: 'compute',
    difficulty: 2,
    prompt: 'Cho ma trận đường chéo A = [[6, 0], [0, −8]]. Tính giá trị kỳ dị lớn nhất σ₁.',
    answer: 8,
    tolerance: 0.001,
    explain:
      'Giá trị kỳ dị là căn bậc hai các trị riêng của AᵀA. Với A đường chéo, AᵀA = [[36, 0], [0, 64]] nên trị riêng là 36 và 64, cho σ = 6 và 8. Sắp giảm dần: σ₁ = 8. (Nói cách khác, với ma trận đường chéo, giá trị kỳ dị là TRỊ TUYỆT ĐỐI của các phần tử trên đường chéo.)',
    hints: [
      { level: 1, text: 'Với ma trận đường chéo, giá trị kỳ dị là trị tuyệt đối của các phần tử trên đường chéo.' },
      { level: 2, text: '|6| = 6 và |−8| = 8; σ₁ là số lớn hơn.' },
      { level: 3, text: 'Dấu âm không ảnh hưởng: σ₁ = 8.' },
    ],
  },
  {
    id: 'ch6-sv-symmetric',
    type: 'numeric-input',
    skillId: 'singular_values',
    dimension: 'compute',
    difficulty: 3,
    prompt: 'Cho A = [[2, 1], [1, 2]] (đối xứng). Tính giá trị kỳ dị lớn nhất σ₁.',
    answer: 3,
    tolerance: 0.001,
    explain:
      'Đa thức đặc trưng: (2 − λ)² − 1 = 0 → 2 − λ = ±1 → λ = 3 hoặc λ = 1. Vì A đối xứng và cả hai trị riêng đều dương, giá trị kỳ dị chính là |trị riêng|: σ = 3 và 1. Vậy σ₁ = 3. (Kiểm chứng qua AᵀA = A² có trị riêng 9 và 1, căn bậc hai cho 3 và 1.)',
    hints: [
      { level: 1, text: 'Tìm trị riêng của A trước: giải det(A − λI) = 0.' },
      { level: 2, text: '(2 − λ)² − 1 = 0 cho λ = 3 và λ = 1.' },
      { level: 3, text: 'A đối xứng với trị riêng dương nên σᵢ = |λᵢ|; lấy giá trị lớn nhất.' },
    ],
  },
  {
    id: 'ch6-svd-sigma-matrix',
    type: 'matrix-input',
    skillId: 'svd',
    dimension: 'compute',
    difficulty: 2,
    prompt:
      'Một ma trận A cỡ 2×2 có các giá trị kỳ dị σ₁ = 4 và σ₂ = 2. Hãy viết ma trận Σ trong phân tích A = U Σ Vᵀ (điền ma trận 2×2).',
    rows: 2,
    cols: 2,
    answer: [
      [4, 0],
      [0, 2],
    ],
    tolerance: 0,
    explain:
      'Σ là ma trận đường chéo, đặt các giá trị kỳ dị theo thứ tự GIẢM DẦN trên đường chéo, các ô còn lại bằng 0: Σ = [[4, 0], [0, 2]].',
    hints: [
      { level: 1, text: 'Σ là ma trận đường chéo; ngoài đường chéo đều bằng 0.' },
      { level: 2, text: 'Đặt σ₁ trước (góc trên trái), rồi tới σ₂.' },
    ],
  },
  {
    id: 'ch6-svd-construct-order',
    type: 'step-ordering',
    skillId: 'svd',
    dimension: 'compute',
    difficulty: 3,
    prompt: 'Sắp xếp đúng thứ tự các bước dựng phân tích SVD A = U Σ Vᵀ của một ma trận A.',
    steps: [
      'Tính ma trận đối xứng AᵀA',
      'Tìm trị riêng λᵢ và vector riêng trực chuẩn của AᵀA; các vector riêng là cột của V',
      'Lấy giá trị kỳ dị σᵢ = √λᵢ (sắp giảm dần) để lập ma trận đường chéo Σ',
      'Với mỗi σᵢ > 0, tính vector kỳ dị trái uᵢ = (1/σᵢ)·A·vᵢ; các uᵢ là cột của U',
      'Ghép lại thành A = U Σ Vᵀ',
    ],
    explain:
      'Quy trình chuẩn: từ AᵀA lấy V và các σ, sau đó suy ra U qua uᵢ = A·vᵢ / σᵢ, cuối cùng ghép A = U Σ Vᵀ.',
    hints: [
      { level: 1, text: 'Mọi thứ bắt đầu từ ma trận đối xứng AᵀA.' },
      { level: 2, text: 'Vector riêng của AᵀA cho V; căn của trị riêng cho σ.' },
      { level: 3, text: 'U được tính SAU cùng từ A, V và σ: uᵢ = A·vᵢ / σᵢ.' },
    ],
  },
  {
    id: 'ch6-sv-max-stretch',
    type: 'multiple-choice',
    skillId: 'singular_values',
    dimension: 'concept',
    difficulty: 3,
    prompt: 'Giá trị kỳ dị lớn nhất σ₁ của ma trận A mang ý nghĩa hình học nào đối với biến đổi x ↦ Ax?',
    options: [
      'Hệ số kéo giãn LỚN NHẤT: σ₁ = max‖Ax‖ khi ‖x‖ = 1',
      'Góc quay mà biến đổi thực hiện',
      'Thể tích luôn được bảo toàn khi biến đổi',
      'Số chiều của không gian nghiệm của Ax = 0',
    ],
    answerIndex: 0,
    explain:
      'σ₁ = ‖A‖₂ là hệ số kéo giãn lớn nhất mà A tác động lên một vector đơn vị: max‖Ax‖ với ‖x‖ = 1. Tương tự, σ nhỏ nhất là hệ số kéo giãn nhỏ nhất.',
    hints: [
      { level: 1, text: 'Nghĩ tới việc A "kéo giãn" một hình cầu đơn vị thành một hình ellipse.' },
      { level: 2, text: 'Các bán trục của ellipse đó chính là các giá trị kỳ dị.' },
      { level: 3, text: 'σ₁ là bán trục dài nhất — mức kéo giãn cực đại.' },
    ],
  },
  {
    id: 'ch6-sv-det',
    type: 'numeric-input',
    skillId: 'singular_values',
    dimension: 'compute',
    difficulty: 2,
    prompt: 'Ma trận vuông A cỡ 2×2 có các giá trị kỳ dị σ₁ = 5 và σ₂ = 2. Tính |det(A)| (trị tuyệt đối của định thức).',
    answer: 10,
    tolerance: 0.001,
    explain:
      'Từ A = U Σ Vᵀ: det(A) = det(U)·det(Σ)·det(Vᵀ). Vì U, V trực giao nên |det(U)| = |det(V)| = 1, do đó |det(A)| = det(Σ) = σ₁·σ₂ = 5·2 = 10. (Trị tuyệt đối định thức bằng TÍCH các giá trị kỳ dị.)',
    hints: [
      { level: 1, text: '|det(A)| bằng tích tất cả các giá trị kỳ dị.' },
      { level: 2, text: 'Ma trận trực giao U, V có |det| = 1 nên không đổi độ lớn định thức.' },
      { level: 3, text: '5 · 2 = ?' },
    ],
  },

  // -------------------------------------------------------------------------
  // rank_k_approximation — số tham số & sai số
  // -------------------------------------------------------------------------
  {
    id: 'ch6-rankk-storage',
    type: 'numeric-input',
    skillId: 'rank_k_approximation',
    dimension: 'compute',
    difficulty: 2,
    prompt:
      'Một ảnh xám kích thước 100×100 được xấp xỉ bằng SVD rank-k với k = 5. Mỗi thành phần rank-1 cần lưu một vector u (100 số), một vector v (100 số) và một giá trị σ. Hỏi tổng cộng phải lưu bao nhiêu số thực?',
    answer: 1005,
    tolerance: 0,
    explain:
      'Mỗi thành phần cần 100 + 100 + 1 = 201 số. Với k = 5: 5·201 = 1005 số (so với 100·100 = 10000 số của ảnh đầy đủ). Công thức chung: k·(m + n + 1).',
    hints: [
      { level: 1, text: 'Đếm số cần lưu cho MỘT thành phần rank-1 trước: u + v + σ.' },
      { level: 2, text: 'Một thành phần cần 100 + 100 + 1 = 201 số.' },
      { level: 3, text: 'Nhân với k = 5: 5 · 201.' },
    ],
  },
  {
    id: 'ch6-rankk-frobenius',
    type: 'numeric-input',
    skillId: 'rank_k_approximation',
    dimension: 'compute',
    difficulty: 3,
    prompt:
      'Ma trận A có các giá trị kỳ dị σ₁ = 12, σ₂ = 10, σ₃ = 4, σ₄ = 3. Xấp xỉ rank-2 tốt nhất A₂ (giữ hai giá trị kỳ dị lớn nhất). Tính sai số theo chuẩn Frobenius ‖A − A₂‖_F.',
    answer: 5,
    tolerance: 0.001,
    explain:
      'Theo định lý Eckart–Young: ‖A − A_k‖_F = √(Σ_{i>k} σᵢ²). Với k = 2, phần bị bỏ là σ₃, σ₄: √(4² + 3²) = √(16 + 9) = √25 = 5.',
    hints: [
      { level: 1, text: 'Sai số Frobenius chỉ phụ thuộc các giá trị kỳ dị BỊ BỎ (từ σ₃ trở đi).' },
      { level: 2, text: '‖A − A₂‖_F = √(σ₃² + σ₄²).' },
      { level: 3, text: '√(16 + 9) = √25.' },
    ],
  },
  {
    id: 'ch6-rankk-error-detection',
    type: 'error-detection',
    skillId: 'rank_k_approximation',
    dimension: 'compute',
    difficulty: 4,
    prompt: 'Tìm dòng SAI trong lập luận về dung lượng lưu trữ khi nén ảnh bằng SVD.',
    lines: [
      'Ảnh xám cỡ 200×300, lưu đầy đủ cần 200·300 = 60000 số.',
      'Mỗi thành phần rank-1 gồm vector u (200 số), vector v (300 số) và một giá trị σ.',
      'Do đó mỗi thành phần cần 200 + 300 + 1 = 501 số; với k = 10 cần 10·501 = 5010 số.',
      'Kết luận: rank-10 tốn 10·60000 = 600000 số, nhiều hơn ảnh gốc nên nén vô ích.',
    ],
    wrongLineIndex: 3,
    explain:
      'Dòng cuối sai cả về số học lẫn khái niệm. Dung lượng rank-10 là 5010 số (đã tính đúng ở dòng trên), ÍT hơn nhiều so với 60000 số của ảnh gốc. Công thức đúng là k·(m + n + 1), KHÔNG phải k·m·n.',
    hints: [
      { level: 1, text: 'Ba dòng đầu đã tính đúng số cần lưu cho rank-10 là 5010.' },
      { level: 2, text: 'Kiểm tra xem dòng kết luận có dùng lại con số 5010 đó không.' },
      { level: 3, text: 'Nén SVD lưu k·(m + n + 1) số, không phải k·m·n.' },
    ],
  },

  // -------------------------------------------------------------------------
  // pca — khái niệm
  // -------------------------------------------------------------------------
  {
    id: 'ch6-pca-first-component',
    type: 'multiple-choice',
    skillId: 'pca',
    dimension: 'concept',
    difficulty: 2,
    prompt: 'Trong PCA, "thành phần chính thứ nhất" (first principal component) là hướng nào của dữ liệu?',
    options: [
      'Hướng mà dữ liệu (sau khi trừ trung bình) có PHƯƠNG SAI lớn nhất',
      'Hướng trung bình cộng của tất cả các điểm dữ liệu',
      'Hướng vuông góc với mọi điểm dữ liệu',
      'Hướng mà dữ liệu có phương sai nhỏ nhất',
    ],
    answerIndex: 0,
    explain:
      'Thành phần chính thứ nhất là hướng phương sai lớn nhất của dữ liệu đã trừ trung bình — chính là vector riêng ứng với trị riêng lớn nhất của ma trận hiệp phương sai (hay vector kỳ dị đầu tiên của ma trận dữ liệu đã căn giữa).',
    hints: [
      { level: 1, text: 'PCA đi tìm hướng làm dữ liệu "trải rộng" nhất.' },
      { level: 2, text: '"Trải rộng nhất" nghĩa là phương sai lớn nhất.' },
    ],
  },
  {
    id: 'ch6-pca-orthogonal',
    type: 'true-false',
    skillId: 'pca',
    dimension: 'concept',
    difficulty: 3,
    prompt: 'Đúng hay Sai?',
    statement: 'Các thành phần chính (principal components) trong PCA luôn trực giao (vuông góc) với nhau.',
    answer: true,
    explain:
      'ĐÚNG. Các thành phần chính là vector riêng của ma trận hiệp phương sai — một ma trận đối xứng thực. Theo định lý phổ, ta luôn chọn được hệ vector riêng trực chuẩn, nên các thành phần chính vuông góc với nhau.',
    hints: [
      { level: 1, text: 'Thành phần chính là vector riêng của ma trận hiệp phương sai.' },
      { level: 2, text: 'Ma trận hiệp phương sai đối xứng → vector riêng có thể chọn trực chuẩn (định lý phổ).' },
    ],
  },
  {
    id: 'ch6-svd-match-parts',
    type: 'matching',
    skillId: 'svd',
    dimension: 'concept',
    difficulty: 3,
    prompt: 'Ghép mỗi thành phần trong A = U Σ Vᵀ với mô tả đúng của nó.',
    left: ['Ma trận Σ', 'Cột vᵢ của V', 'Cột uᵢ của U'],
    right: [
      'Vector kỳ dị phải; là vector riêng trực chuẩn của AᵀA',
      'Ma trận đường chéo chứa các giá trị kỳ dị σᵢ ≥ 0',
      'Vector kỳ dị trái; thỏa uᵢ = (1/σᵢ)·A·vᵢ',
    ],
    pairs: [
      [0, 1],
      [1, 0],
      [2, 2],
    ],
    explain:
      'Σ là ma trận đường chéo của các σᵢ; các vᵢ (cột của V) là vector riêng của AᵀA; các uᵢ (cột của U) là vector kỳ dị trái, tính bằng A·vᵢ / σᵢ.',
    hints: [
      { level: 1, text: 'Σ là ma trận đường chéo duy nhất trong ba thành phần.' },
      { level: 2, text: 'V gắn với AᵀA; U gắn với A·vᵢ / σᵢ.' },
    ],
  },
];
