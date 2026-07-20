// ===========================================================================
// NGÂN HÀNG BÀI TẬP — SECTION 5: EIGENVALUES & EIGENVECTORS
//
// Nội dung GỐC: số liệu & câu chữ tự soạn, KHÔNG sao chép/dịch từ sách. Kỹ thuật
// toán là kiến thức chung. Mọi `skillId` đều tồn tại trong ../skills.ts; mọi đáp
// án đã được rà tay. Trải difficulty 1..4, dùng đủ nhiều dạng bài.
//
// Skills phủ: characteristic_polynomial, eigenvalue, eigenvector, eigenspace,
//             diagonalization, matrix_powers
//
// Export: exercises: Exercise[]
// ===========================================================================

import type { Exercise } from '../../exercises/types';

export const exercises: Exercise[] = [
  // --- characteristic_polynomial --------------------------------------------
  {
    id: 'eb-ch5-charpoly-steps',
    type: 'step-ordering',
    skillId: 'characteristic_polynomial',
    dimension: 'compute',
    difficulty: 2,
    prompt: 'Sắp xếp đúng thứ tự các bước tìm giá trị riêng của một ma trận vuông A.',
    steps: [
      'Lập ma trận A − λI (trừ λ trên đường chéo chính)',
      'Tính định thức det(A − λI) để được đa thức đặc trưng theo λ',
      'Cho đa thức đặc trưng bằng 0',
      'Giải phương trình để tìm các giá trị riêng λ',
    ],
    explain:
      'Giá trị riêng là các λ làm A − λI suy biến, tức det(A − λI) = 0. Lập ma trận → lấy định thức → cho bằng 0 → giải λ.',
    hints: [
      { level: 1, text: 'Bắt đầu bằng việc trừ λ trên đường chéo để tạo A − λI.' },
      { level: 2, text: 'Đa thức đặc trưng đến từ định thức của A − λI.' },
      { level: 3, text: 'Nghiệm của phương trình đặc trưng chính là các giá trị riêng.' },
    ],
  },
  {
    id: 'eb-ch5-charpoly-trace',
    type: 'numeric-input',
    skillId: 'characteristic_polynomial',
    dimension: 'compute',
    difficulty: 2,
    prompt:
      'Cho A = [[4, 1], [2, 3]]. Tổng các giá trị riêng của A (bằng vết — tổng đường chéo chính) bằng bao nhiêu?',
    answer: 7,
    tolerance: 0,
    explain:
      'Tổng các giá trị riêng luôn bằng vết của ma trận: trace = 4 + 3 = 7. (Kiểm tra: đa thức đặc trưng λ² − 7λ + 10 có nghiệm 2 và 5, tổng bằng 7.)',
    hints: [
      { level: 1, text: 'Tổng các giá trị riêng bằng vết (trace) — tổng các phần tử trên đường chéo.' },
      { level: 2, text: 'Cộng 4 và 3.' },
    ],
  },

  // --- eigenvalue -----------------------------------------------------------
  {
    id: 'eb-ch5-eigenvalue-2x2',
    type: 'numeric-input',
    skillId: 'eigenvalue',
    dimension: 'compute',
    difficulty: 3,
    prompt: 'Cho A = [[2, 1], [1, 2]]. Giá trị riêng LỚN NHẤT của A bằng bao nhiêu?',
    answer: 3,
    tolerance: 0,
    explain:
      'det(A − λI) = (2 − λ)² − 1 = λ² − 4λ + 3 = (λ − 1)(λ − 3). Các giá trị riêng là 1 và 3; lớn nhất là 3.',
    hints: [
      { level: 1, text: 'Lập det(A − λI) = (2 − λ)(2 − λ) − 1·1.' },
      { level: 2, text: 'Rút gọn thành λ² − 4λ + 3.' },
      { level: 3, text: 'Phân tích (λ − 1)(λ − 3) = 0.' },
    ],
  },
  {
    id: 'eb-ch5-eigenvalue-triangular',
    type: 'multiple-choice',
    skillId: 'eigenvalue',
    dimension: 'concept',
    difficulty: 2,
    prompt: 'Các giá trị riêng của ma trận tam giác trên A = [[5, 7], [0, 2]] là gì?',
    options: ['5 và 2', '7 và 0', '5 và 7', '2 và 7'],
    answerIndex: 0,
    explain:
      'Với ma trận tam giác (trên hoặc dưới), các giá trị riêng chính là các phần tử trên đường chéo chính: ở đây là 5 và 2.',
    hints: [
      { level: 1, text: 'Với ma trận tam giác, định thức là tích các phần tử đường chéo.' },
      { level: 2, text: 'det(A − λI) = (5 − λ)(2 − λ), cho nghiệm là các phần tử đường chéo.' },
    ],
  },
  {
    id: 'eb-ch5-eigenvalue-rotation-tf',
    type: 'true-false',
    skillId: 'eigenvalue',
    dimension: 'concept',
    difficulty: 4,
    prompt: 'Đúng hay Sai?',
    statement:
      'Ma trận xoay 90° trong mặt phẳng, A = [[0, −1], [1, 0]], không có giá trị riêng thực nào.',
    answer: true,
    explain:
      'det(A − λI) = λ² + 1 = 0 không có nghiệm thực (chỉ có λ = ±i). Về mặt hình học, phép xoay 90° không giữ bất kỳ hướng thực nào bất biến, nên không có giá trị riêng thực.',
    hints: [
      { level: 1, text: 'Lập phương trình đặc trưng: (−λ)(−λ) − (−1)(1) = 0.' },
      { level: 2, text: 'λ² + 1 = 0 có nghiệm thực không?' },
      { level: 3, text: 'Hình học: có hướng nào không đổi khi xoay 90° không?' },
    ],
  },

  // --- eigenvector ----------------------------------------------------------
  {
    id: 'eb-ch5-eigenvector-definition',
    type: 'multiple-choice',
    skillId: 'eigenvector',
    dimension: 'concept',
    difficulty: 1,
    prompt: 'Một vector riêng v (với v ≠ 0) của ma trận A thỏa mãn điều kiện nào?',
    options: [
      'Av = λv với λ là một số vô hướng',
      'Av = 0',
      'Av = v + λ',
      'A + v = λ',
    ],
    answerIndex: 0,
    explain:
      'Vector riêng là hướng KHÔNG đổi qua biến đổi: A chỉ kéo giãn/co v theo hệ số λ (giá trị riêng), tức Av = λv.',
    hints: [
      { level: 1, text: 'Vector riêng giữ nguyên HƯỚNG sau biến đổi, chỉ đổi độ dài.' },
      { level: 2, text: 'Điều đó viết thành Av = λv.' },
    ],
  },
  {
    id: 'eb-ch5-eigenvector-find',
    type: 'matrix-input',
    skillId: 'eigenvector',
    dimension: 'compute',
    difficulty: 3,
    prompt:
      'Cho A = [[2, 1], [1, 2]] với giá trị riêng λ = 3. Tìm vector riêng tương ứng, chuẩn hóa sao cho thành phần đầu bằng 1 (nhập dạng cột 2×1).',
    rows: 2,
    cols: 1,
    answer: [[1], [1]],
    tolerance: 0,
    explain:
      '(A − 3I) = [[−1, 1], [1, −1]]. Phương trình −v₁ + v₂ = 0 cho v₂ = v₁. Với v₁ = 1 ta được vector riêng (1, 1). Kiểm tra: A·(1,1) = (3, 3) = 3·(1, 1).',
    hints: [
      { level: 1, text: 'Giải (A − 3I)v = 0.' },
      { level: 2, text: 'A − 3I = [[−1, 1], [1, −1]]; hàng đầu cho −v₁ + v₂ = 0.' },
      { level: 3, text: 'v₂ = v₁; đặt v₁ = 1.' },
    ],
  },
  {
    id: 'eb-ch5-eigenvector-scaling-tf',
    type: 'true-false',
    skillId: 'eigenvector',
    dimension: 'concept',
    difficulty: 2,
    prompt: 'Đúng hay Sai?',
    statement:
      'Nếu v là vector riêng của A ứng với giá trị riêng λ, thì 2v cũng là vector riêng của A ứng với cùng λ đó.',
    answer: true,
    explain:
      'A(2v) = 2·(Av) = 2·(λv) = λ·(2v). Mọi bội khác 0 của một vector riêng vẫn là vector riêng ứng với cùng giá trị riêng — vì thế eigenspace là một không gian con.',
    hints: [
      { level: 1, text: 'Áp dụng A vào 2v và dùng tính chất tuyến tính.' },
      { level: 2, text: 'A(2v) = 2·Av = 2·λv = λ·(2v).' },
    ],
  },
  {
    id: 'eb-ch5-eigenvector-error',
    type: 'error-detection',
    skillId: 'eigenvector',
    dimension: 'compute',
    difficulty: 3,
    prompt: 'Tìm dòng SAI trong lời giải kiểm tra vector riêng dưới đây.',
    lines: [
      'Tính Av với A = [[3, 1], [1, 3]] và v = (1, 1)',
      'Av = (3·1 + 1·1, 1·1 + 3·1) = (4, 4)',
      'Vì (4, 4) = 4·(1, 1) nên v là vector riêng của A',
      'Do đó giá trị riêng tương ứng là λ = (4, 4)',
    ],
    wrongLineIndex: 3,
    explain:
      'Giá trị riêng là một SỐ VÔ HƯỚNG, không phải vector. Từ (4, 4) = 4·(1, 1) ta đọc ra λ = 4, chứ không phải λ = (4, 4).',
    hints: [
      { level: 1, text: 'Các bước tính Av đều đúng; hãy xét lại bản chất của λ.' },
      { level: 2, text: 'Trong Av = λv, λ là một số hay một vector?' },
      { level: 3, text: 'Hệ số kéo giãn ở đây là 4, nên λ = 4.' },
    ],
  },

  // --- eigenspace -----------------------------------------------------------
  {
    id: 'eb-ch5-eigenspace-definition',
    type: 'multiple-choice',
    skillId: 'eigenspace',
    dimension: 'concept',
    difficulty: 3,
    prompt: 'Không gian riêng (eigenspace) ứng với giá trị riêng λ của A là tập nghiệm của phương trình nào?',
    options: [
      '(A − λI)x = 0',
      'Ax = λ',
      '(A + λI)x = 0',
      'det(A − λI) = 0',
    ],
    answerIndex: 0,
    explain:
      'Eigenspace của λ là tập mọi vector x thỏa Ax = λx, tức (A − λI)x = 0 — chính là không gian null của (A − λI). Nó gồm cả vector 0 nên là một không gian con.',
    hints: [
      { level: 1, text: 'Viết Av = λv về dạng có vế phải bằng 0.' },
      { level: 2, text: 'Av − λv = 0 ⟹ (A − λI)v = 0.' },
    ],
  },

  // --- diagonalization ------------------------------------------------------
  {
    id: 'eb-ch5-diag-steps',
    type: 'step-ordering',
    skillId: 'diagonalization',
    dimension: 'compute',
    difficulty: 3,
    prompt: 'Sắp xếp đúng thứ tự các bước chéo hóa một ma trận A = P·D·P⁻¹.',
    steps: [
      'Tìm tất cả giá trị riêng λ từ phương trình det(A − λI) = 0',
      'Với mỗi giá trị riêng, tìm các vector riêng độc lập tuyến tính',
      'Xếp các vector riêng thành các cột của ma trận P',
      'Lập ma trận đường chéo D gồm các giá trị riêng theo đúng thứ tự cột của P',
      'Viết A = P·D·P⁻¹',
    ],
    explain:
      'Chéo hóa: tìm λ → tìm vector riêng → P là ma trận các vector riêng, D là ma trận đường chéo các giá trị riêng tương ứng → A = P·D·P⁻¹.',
    hints: [
      { level: 1, text: 'Phải có giá trị riêng trước khi tìm được vector riêng.' },
      { level: 2, text: 'Cột thứ k của P và phần tử (k, k) của D phải ứng với cùng một giá trị riêng.' },
      { level: 3, text: 'Bước cuối là ghép lại thành A = P·D·P⁻¹.' },
    ],
  },
  {
    id: 'eb-ch5-diag-condition-tf',
    type: 'true-false',
    skillId: 'diagonalization',
    dimension: 'concept',
    difficulty: 3,
    prompt: 'Đúng hay Sai?',
    statement:
      'Một ma trận A cỡ n×n chéo hóa được khi và chỉ khi nó có đủ n vector riêng độc lập tuyến tính.',
    answer: true,
    explain:
      'Cần n vector riêng độc lập để dựng ma trận P khả nghịch (các cột độc lập). Nếu thiếu (bội hình học nhỏ hơn bội đại số ở đâu đó), A không chéo hóa được.',
    hints: [
      { level: 1, text: 'P được dựng từ các vector riêng làm cột.' },
      { level: 2, text: 'P khả nghịch đòi hỏi n cột độc lập tuyến tính.' },
    ],
  },
  {
    id: 'eb-ch5-diag-buildD',
    type: 'matrix-input',
    skillId: 'diagonalization',
    dimension: 'compute',
    difficulty: 2,
    prompt:
      'Một ma trận A cỡ 2×2 có các giá trị riêng λ₁ = 4 và λ₂ = −1. Viết ma trận đường chéo D (đặt λ₁ ở vị trí (1,1)) dùng trong A = P·D·P⁻¹.',
    rows: 2,
    cols: 2,
    answer: [
      [4, 0],
      [0, -1],
    ],
    tolerance: 0,
    explain:
      'D là ma trận đường chéo với các giá trị riêng trên đường chéo, còn lại bằng 0: D = [[4, 0], [0, −1]].',
    hints: [
      { level: 1, text: 'D chỉ có giá trị riêng trên đường chéo chính; ngoài đường chéo đều là 0.' },
      { level: 2, text: 'Đặt 4 ở (1,1) và −1 ở (2,2).' },
    ],
  },

  // --- matrix_powers --------------------------------------------------------
  {
    id: 'eb-ch5-powers-eigenvalue',
    type: 'numeric-input',
    skillId: 'matrix_powers',
    dimension: 'compute',
    difficulty: 3,
    prompt:
      'Nếu A có một giá trị riêng λ = 2 (với vector riêng v), thì A⁵ có giá trị riêng tương ứng (cùng vector riêng v) bằng bao nhiêu?',
    answer: 32,
    tolerance: 0,
    explain:
      'Aⁿv = λⁿv, nên A⁵v = 2⁵·v = 32·v. Lũy thừa ma trận nâng mỗi giá trị riêng lên cùng số mũ, giữ nguyên vector riêng.',
    hints: [
      { level: 1, text: 'Áp dụng A năm lần lên v: mỗi lần nhân thêm hệ số λ.' },
      { level: 2, text: 'A⁵v = λ⁵ v = 2⁵ v.' },
      { level: 3, text: '2⁵ = 32.' },
    ],
  },
  {
    id: 'eb-ch5-powers-formula',
    type: 'multiple-choice',
    skillId: 'matrix_powers',
    dimension: 'concept',
    difficulty: 2,
    prompt: 'Nếu A = P·D·P⁻¹ (D là ma trận đường chéo), thì Aⁿ bằng biểu thức nào?',
    options: [
      'P·Dⁿ·P⁻¹',
      'Pⁿ·D·P⁻¹',
      'P·D·P⁻ⁿ',
      'Pⁿ·Dⁿ·P⁻ⁿ',
    ],
    answerIndex: 0,
    explain:
      'Aⁿ = (P D P⁻¹)(P D P⁻¹)…: các cặp P⁻¹P ở giữa triệt tiêu thành I, chỉ còn P·Dⁿ·P⁻¹. Lũy thừa Dⁿ rất dễ vì D là đường chéo.',
    hints: [
      { level: 1, text: 'Viết A² = P D P⁻¹ · P D P⁻¹ và để ý P⁻¹P ở giữa.' },
      { level: 2, text: 'P⁻¹P = I nên phần giữa gộp lại thành D·D = D².' },
    ],
  },
];
