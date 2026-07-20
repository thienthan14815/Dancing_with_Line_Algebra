// ===========================================================================
// NGÂN HÀNG BÀI TẬP — SECTION 3: MA TRẬN (Matrices)
//
// Nội dung GỐC: số liệu & câu chữ tự soạn, KHÔNG sao chép/dịch từ sách. Kỹ thuật
// toán là kiến thức chung. Mọi `skillId` đều tồn tại trong ../skills.ts; mọi đáp
// án đã được rà tay. Trải difficulty 1..4, dùng đủ nhiều dạng bài.
//
// Skills phủ: matrix_transformation, matrix_multiplication, determinant,
//             matrix_inverse, special_matrices
//
// Export: exercises: Exercise[]
// ===========================================================================

import type { Exercise } from '../../exercises/types';

export const exercises: Exercise[] = [
  // --- matrix_transformation ------------------------------------------------
  {
    id: 'eb-ch3-transform-columns',
    type: 'multiple-choice',
    skillId: 'matrix_transformation',
    dimension: 'concept',
    difficulty: 1,
    prompt: 'Với ma trận biến đổi 2×2, cột thứ nhất của ma trận cho biết điều gì?',
    options: [
      'Nơi mà vector cơ sở î = (1, 0) được đưa tới',
      'Nơi mà vector cơ sở ĵ = (0, 1) được đưa tới',
      'Định thức của ma trận',
      'Độ dài của vector đầu vào',
    ],
    answerIndex: 0,
    explain:
      'Một ma trận biến đổi lưu ảnh của các vector cơ sở theo cột: cột 1 là nơi î = (1, 0) hạ cánh, cột 2 là nơi ĵ = (0, 1) hạ cánh.',
    hints: [
      { level: 1, text: 'Nghĩ tới nơi các vector cơ sở î và ĵ được đưa tới sau biến đổi.' },
      { level: 2, text: 'Nhân ma trận với (1, 0) chỉ lấy ra cột đầu tiên.' },
      { level: 3, text: 'Cột 1 ↔ ảnh của î; cột 2 ↔ ảnh của ĵ.' },
    ],
  },
  {
    id: 'eb-ch3-transform-apply',
    type: 'matrix-input',
    skillId: 'matrix_transformation',
    dimension: 'compute',
    difficulty: 2,
    prompt: 'Cho A = [[2, −1], [1, 3]] và v = (2, 1) (dạng cột). Tính ảnh Av (2×1).',
    rows: 2,
    cols: 1,
    answer: [[3], [5]],
    tolerance: 0,
    explain:
      'Av tính theo hàng: hàng 1 = 2·2 + (−1)·1 = 3; hàng 2 = 1·2 + 3·1 = 5. Vậy Av = (3, 5).',
    hints: [
      { level: 1, text: 'Mỗi thành phần của Av là tích vô hướng của một HÀNG của A với v.' },
      { level: 2, text: 'Thành phần đầu: 2·2 + (−1)·1.' },
      { level: 3, text: 'Thành phần sau: 1·2 + 3·1 = 5.' },
    ],
  },
  {
    id: 'eb-ch3-transform-rotate-draw',
    type: 'vector-drawing',
    skillId: 'matrix_transformation',
    dimension: 'visual',
    difficulty: 2,
    prompt:
      'Ma trận xoay 90° ngược chiều kim đồng hồ là A = [[0, −1], [1, 0]]. Hãy vẽ ảnh của vector cơ sở î = (1, 0) sau khi áp dụng A.',
    target: [0, 1],
    tolerance: 0.3,
    explain:
      'Ảnh của î chính là cột thứ nhất của A, tức (0, 1): sau khi xoay 90° ngược chiều kim đồng hồ, î chỉ sang phải trở thành chỉ lên trên.',
    hints: [
      { level: 1, text: 'Ảnh của î = (1, 0) là cột đầu tiên của ma trận.' },
      { level: 2, text: 'Cột đầu của A là (0, 1).' },
    ],
  },

  // --- matrix_multiplication ------------------------------------------------
  {
    id: 'eb-ch3-mult-2x2',
    type: 'matrix-input',
    skillId: 'matrix_multiplication',
    dimension: 'compute',
    difficulty: 2,
    prompt: 'Tính tích AB với A = [[1, 2], [3, 4]] và B = [[2, 0], [1, 2]]. Nhập ma trận kết quả (2×2).',
    rows: 2,
    cols: 2,
    answer: [
      [4, 4],
      [10, 8],
    ],
    tolerance: 0,
    explain:
      'Phần tử (i, j) = (hàng i của A)·(cột j của B). (1,1)=1·2+2·1=4; (1,2)=1·0+2·2=4; (2,1)=3·2+4·1=10; (2,2)=3·0+4·2=8.',
    hints: [
      { level: 1, text: 'Phần tử (i, j) lấy hàng i của A nhân cột j của B.' },
      { level: 2, text: 'Ô (2,1) = 3·2 + 4·1.' },
      { level: 3, text: 'Ô (2,1) = 6 + 4 = 10.' },
    ],
  },
  {
    id: 'eb-ch3-mult-entry',
    type: 'numeric-input',
    skillId: 'matrix_multiplication',
    dimension: 'compute',
    difficulty: 2,
    prompt:
      'Khi nhân hai ma trận, một phần tử của tích là tích vô hướng của một hàng và một cột. Với hàng (2, −1, 3) và cột (4, 0, −2), phần tử đó bằng bao nhiêu?',
    answer: 2,
    tolerance: 0,
    explain: 'Tích vô hướng: 2·4 + (−1)·0 + 3·(−2) = 8 + 0 − 6 = 2.',
    hints: [
      { level: 1, text: 'Nhân từng cặp thành phần tương ứng rồi cộng lại.' },
      { level: 2, text: '2·4 = 8; (−1)·0 = 0; 3·(−2) = −6.' },
      { level: 3, text: '8 + 0 − 6 = ?' },
    ],
  },
  {
    id: 'eb-ch3-mult-noncommutative',
    type: 'true-false',
    skillId: 'matrix_multiplication',
    dimension: 'concept',
    difficulty: 2,
    prompt: 'Đúng hay Sai?',
    statement: 'Với mọi ma trận vuông A và B cùng cỡ, ta luôn có AB = BA.',
    answer: false,
    explain:
      'Phép nhân ma trận nói chung KHÔNG giao hoán: thứ tự áp dụng biến đổi rất quan trọng. Chỉ trong một số trường hợp đặc biệt (ví dụ nhân với I) mới có AB = BA.',
    hints: [
      { level: 1, text: 'Thử A = [[0,1],[0,0]] và B = [[0,0],[1,0]] rồi so sánh AB với BA.' },
      { level: 2, text: 'Nhân ma trận là hợp các biến đổi; đổi thứ tự hợp thường cho kết quả khác.' },
    ],
  },
  {
    id: 'eb-ch3-mult-error',
    type: 'error-detection',
    skillId: 'matrix_multiplication',
    dimension: 'compute',
    difficulty: 3,
    prompt: 'Tìm dòng SAI khi tính AB với A = [[1, 2], [0, 1]] và B = [[3, 1], [2, 4]].',
    lines: [
      'Phần tử (1,1): 1·3 + 2·2 = 7',
      'Phần tử (1,2): 1·1 + 2·4 = 9',
      'Phần tử (2,1): 0·3 + 1·2 = 2',
      'Phần tử (2,2): 0·1 + 1·4 = 5',
    ],
    wrongLineIndex: 3,
    explain: 'Phần tử (2,2) = 0·1 + 1·4 = 4, không phải 5. Vậy AB = [[7, 9], [2, 4]].',
    hints: [
      { level: 1, text: 'Ba phần tử đầu đã đúng; hãy kiểm tra lại phép tính ở phần tử cuối.' },
      { level: 2, text: '0·1 = 0 và 1·4 = 4.' },
      { level: 3, text: '0 + 4 = 4, không phải 5.' },
    ],
  },

  // --- determinant ----------------------------------------------------------
  {
    id: 'eb-ch3-det-2x2',
    type: 'numeric-input',
    skillId: 'determinant',
    dimension: 'compute',
    difficulty: 1,
    prompt: 'Tính định thức của ma trận A = [[3, 1], [2, 4]].',
    answer: 10,
    tolerance: 0,
    explain: 'det = ad − bc = 3·4 − 1·2 = 12 − 2 = 10.',
    hints: [
      { level: 1, text: 'Với ma trận 2×2 [[a,b],[c,d]], det = ad − bc.' },
      { level: 2, text: 'ad = 3·4 = 12; bc = 1·2 = 2.' },
    ],
  },
  {
    id: 'eb-ch3-det-3x3',
    type: 'numeric-input',
    skillId: 'determinant',
    dimension: 'compute',
    difficulty: 3,
    prompt: 'Tính định thức của ma trận A = [[2, 0, 1], [1, 3, 2], [0, 1, 1]].',
    answer: 3,
    tolerance: 0,
    explain:
      'Khai triển theo hàng 1: 2·det([[3,2],[1,1]]) − 0 + 1·det([[1,3],[0,1]]) = 2·(3−2) + 1·(1−0) = 2 + 1 = 3.',
    hints: [
      { level: 1, text: 'Khai triển theo hàng 1; số 0 giúp bỏ bớt một số hạng.' },
      { level: 2, text: 'det([[3,2],[1,1]]) = 3·1 − 2·1 = 1.' },
      { level: 3, text: '2·1 + 1·1 = 3.' },
    ],
  },
  {
    id: 'eb-ch3-det-singular-tf',
    type: 'true-false',
    skillId: 'determinant',
    dimension: 'concept',
    difficulty: 2,
    prompt: 'Đúng hay Sai?',
    statement: 'Một ma trận vuông có định thức bằng 0 thì không khả nghịch (suy biến).',
    answer: true,
    explain:
      'det = 0 nghĩa là biến đổi làm sập không gian (diện tích/thể tích bị bóp về 0), không thể đảo ngược — nên ma trận không khả nghịch.',
    hints: [
      { level: 1, text: 'Định thức đo hệ số co giãn diện tích/thể tích của biến đổi.' },
      { level: 2, text: 'Nếu diện tích bị bóp về 0 thì không có cách nào "phục hồi" ngược lại.' },
    ],
  },
  {
    id: 'eb-ch3-det-product',
    type: 'multiple-choice',
    skillId: 'determinant',
    dimension: 'concept',
    difficulty: 4,
    prompt: 'Với hai ma trận vuông A, B cùng cỡ, định thức của tích det(AB) bằng biểu thức nào?',
    options: [
      'det(A) + det(B)',
      'det(A) · det(B)',
      'det(A) − det(B)',
      'det(A) / det(B)',
    ],
    answerIndex: 1,
    explain:
      'det(AB) = det(A)·det(B): hệ số co giãn diện tích của hợp hai biến đổi bằng tích hai hệ số co giãn. (Suy ra det(BA) cũng bằng đúng như vậy dù AB ≠ BA.)',
    hints: [
      { level: 1, text: 'Định thức là hệ số co giãn diện tích; áp dụng liên tiếp hai biến đổi.' },
      { level: 2, text: 'Co giãn hai lần thì các hệ số được NHÂN với nhau.' },
    ],
  },

  // --- matrix_inverse -------------------------------------------------------
  {
    id: 'eb-ch3-inverse-2x2',
    type: 'matrix-input',
    skillId: 'matrix_inverse',
    dimension: 'compute',
    difficulty: 3,
    prompt: 'Tìm ma trận nghịch đảo của A = [[2, 1], [1, 1]]. Nhập ma trận A⁻¹ (2×2).',
    rows: 2,
    cols: 2,
    answer: [
      [1, -1],
      [-1, 2],
    ],
    tolerance: 0,
    explain:
      'Với [[a,b],[c,d]], A⁻¹ = (1/det)·[[d,−b],[−c,a]]. Ở đây det = 2·1 − 1·1 = 1, nên A⁻¹ = [[1,−1],[−1,2]].',
    hints: [
      { level: 1, text: 'Công thức 2×2: A⁻¹ = (1/det)·[[d, −b], [−c, a]].' },
      { level: 2, text: 'det = 2·1 − 1·1 = 1, nên chỉ cần hoán vị và đổi dấu.' },
      { level: 3, text: 'Đổi chỗ 2 và 1 trên đường chéo, đổi dấu hai phần tử còn lại.' },
    ],
  },
  {
    id: 'eb-ch3-inverse-gaussjordan',
    type: 'step-ordering',
    skillId: 'matrix_inverse',
    dimension: 'compute',
    difficulty: 3,
    prompt: 'Sắp xếp đúng thứ tự các bước tìm ma trận nghịch đảo bằng phương pháp Gauss–Jordan.',
    steps: [
      'Ghép ma trận đơn vị I vào bên phải để lập khối [A | I]',
      'Dùng các phép biến đổi hàng để đưa khối bên trái A về ma trận đơn vị I',
      'Áp dụng CHÍNH các phép biến đổi hàng đó lên khối bên phải',
      'Khi bên trái đã thành I, khối bên phải chính là A⁻¹',
    ],
    explain:
      'Biến đổi [A | I] → [I | A⁻¹]: mọi phép biến đổi hàng đưa A về I, khi áp dụng lên I sẽ dựng nên A⁻¹.',
    hints: [
      { level: 1, text: 'Bắt đầu bằng việc dựng khối tăng cường [A | I].' },
      { level: 2, text: 'Cùng một chuỗi phép biến đổi phải áp cho CẢ hai khối.' },
      { level: 3, text: 'Khi bên trái là I thì đọc kết quả ở bên phải.' },
    ],
  },

  // --- special_matrices -----------------------------------------------------
  {
    id: 'eb-ch3-special-match',
    type: 'matching',
    skillId: 'special_matrices',
    dimension: 'concept',
    difficulty: 2,
    prompt: 'Ghép mỗi loại ma trận đặc biệt với đặc điểm đúng của nó.',
    left: ['Ma trận đơn vị I', 'Ma trận đường chéo', 'Ma trận đối xứng'],
    right: [
      'Thỏa Aᵀ = A (đối xứng qua đường chéo chính)',
      'Chỉ các phần tử trên đường chéo chính mới có thể khác 0',
      'Nhân với vector nào cũng cho lại đúng chính vector đó',
    ],
    pairs: [
      [0, 2],
      [1, 1],
      [2, 0],
    ],
    explain:
      'I giữ nguyên mọi vector (Iv = v); ma trận đường chéo chỉ có phần tử khác 0 trên đường chéo; ma trận đối xứng có Aᵀ = A.',
    hints: [
      { level: 1, text: 'Ma trận đơn vị là phần tử "trung hòa" của phép nhân ma trận.' },
      { level: 2, text: '"Đối xứng" nghĩa là phản chiếu qua đường chéo cho lại chính nó: Aᵀ = A.' },
    ],
  },
  {
    id: 'eb-ch3-special-identity',
    type: 'multiple-choice',
    skillId: 'special_matrices',
    dimension: 'concept',
    difficulty: 1,
    prompt: 'Với ma trận vuông A bất kỳ và ma trận đơn vị I cùng cỡ, tích A·I bằng gì?',
    options: ['Ma trận 0', 'A', 'I', 'A⁻¹'],
    answerIndex: 1,
    explain:
      'Ma trận đơn vị đóng vai trò như số 1 trong phép nhân: A·I = I·A = A (biến đổi "không làm gì cả").',
    hints: [
      { level: 1, text: 'I là biến đổi giữ nguyên mọi vector.' },
      { level: 2, text: 'Áp dụng "không làm gì" sau A thì kết quả vẫn là A.' },
    ],
  },
];
