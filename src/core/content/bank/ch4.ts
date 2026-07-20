// ===========================================================================
// NGÂN HÀNG BÀI TẬP — SECTION 4: KHÔNG GIAN VECTOR (Vector Spaces)
//
// Nội dung GỐC: số liệu & câu chữ tự soạn, KHÔNG sao chép/dịch từ sách. Kỹ thuật
// toán là kiến thức chung. Mọi `skillId` đều tồn tại trong ../skills.ts; mọi đáp
// án đã được rà tay. Trải difficulty 1..4, dùng đủ nhiều dạng bài.
//
// Skills phủ: subspace, column_null_space, linear_independence,
//             basis_dimension, rank, change_of_basis
//
// Export: exercises: Exercise[]
// ===========================================================================

import type { Exercise } from '../../exercises/types';

export const exercises: Exercise[] = [
  // --- subspace -------------------------------------------------------------
  {
    id: 'eb-ch4-subspace-zero-tf',
    type: 'true-false',
    skillId: 'subspace',
    dimension: 'concept',
    difficulty: 2,
    prompt: 'Đúng hay Sai?',
    statement: 'Mọi không gian con của ℝⁿ đều phải chứa vector 0.',
    answer: true,
    explain:
      'Không gian con phải đóng với phép nhân vô hướng, nên với vector v bất kỳ trong đó, 0·v = 0 cũng phải thuộc không gian con. Vì vậy 0 luôn nằm trong mọi không gian con.',
    hints: [
      { level: 1, text: 'Không gian con đóng với phép nhân vô hướng.' },
      { level: 2, text: 'Nhân một vector bất kỳ với số 0 cho ra vector nào?' },
    ],
  },
  {
    id: 'eb-ch4-subspace-which',
    type: 'multiple-choice',
    skillId: 'subspace',
    dimension: 'concept',
    difficulty: 3,
    prompt: 'Tập hợp nào sau đây là một không gian con của ℝ²?',
    options: [
      'Đường thẳng y = 2x',
      'Đường thẳng y = 2x + 1',
      'Góc phần tư thứ nhất (x ≥ 0 và y ≥ 0)',
      'Đường tròn x² + y² = 1',
    ],
    answerIndex: 0,
    explain:
      'Đường thẳng y = 2x đi qua gốc và đóng với cộng vector lẫn nhân vô hướng → là không gian con. y = 2x + 1 không chứa gốc; góc phần tư I không đóng với nhân số âm; đường tròn không đóng với phép cộng.',
    hints: [
      { level: 1, text: 'Không gian con phải chứa gốc 0 và đóng với cộng, nhân vô hướng.' },
      { level: 2, text: 'Đường thẳng nào ở trên đi qua gốc tọa độ (0, 0)?' },
    ],
  },

  // --- column_null_space ----------------------------------------------------
  {
    id: 'eb-ch4-null-definition',
    type: 'multiple-choice',
    skillId: 'column_null_space',
    dimension: 'concept',
    difficulty: 2,
    prompt: 'Không gian null (null space) của ma trận A là tập tất cả các vector x thỏa phương trình nào?',
    options: ['Ax = 0', 'Ax = b', 'Ax = x', 'xᵀA = A'],
    answerIndex: 0,
    explain:
      'Không gian null gồm mọi nghiệm của hệ thuần nhất Ax = 0 — những vector bị biến đổi A "bóp" về vector 0.',
    hints: [
      { level: 1, text: '"Null" gợi ý kết quả bằng vector 0.' },
      { level: 2, text: 'Ta tìm những x mà A đưa về 0.' },
    ],
  },
  {
    id: 'eb-ch4-null-dimension',
    type: 'numeric-input',
    skillId: 'column_null_space',
    dimension: 'compute',
    difficulty: 3,
    prompt:
      'Cho A = [[1, 2, 3], [2, 4, 6]]. Số chiều của không gian null (nullity) của A bằng bao nhiêu?',
    answer: 2,
    tolerance: 0,
    explain:
      'Hàng 2 = 2·hàng 1 nên rank(A) = 1. Theo định lý hạng–số khuyết: nullity = số cột − rank = 3 − 1 = 2.',
    hints: [
      { level: 1, text: 'Trước hết tìm rank: hai hàng có phụ thuộc nhau không?' },
      { level: 2, text: 'Hàng 2 = 2·hàng 1 nên rank = 1.' },
      { level: 3, text: 'nullity = số cột (3) − rank (1).' },
    ],
  },

  // --- linear_independence --------------------------------------------------
  {
    id: 'eb-ch4-indep-multiple-tf',
    type: 'true-false',
    skillId: 'linear_independence',
    dimension: 'concept',
    difficulty: 2,
    prompt: 'Đúng hay Sai?',
    statement:
      'Hai vector khác 0 trong ℝ² độc lập tuyến tính khi và chỉ khi không vector nào là bội vô hướng của vector kia.',
    answer: true,
    explain:
      'Nếu một vector là bội của vector kia thì chúng cùng phương (phụ thuộc). Ngược lại, hai vector không cùng phương thì độc lập tuyến tính.',
    hints: [
      { level: 1, text: '"Cùng phương" tương ứng với "phụ thuộc tuyến tính".' },
      { level: 2, text: 'b = k·a nghĩa là hai vector nằm trên cùng một đường thẳng.' },
    ],
  },
  {
    id: 'eb-ch4-indep-which-dependent',
    type: 'multiple-choice',
    skillId: 'linear_independence',
    dimension: 'compute',
    difficulty: 3,
    prompt: 'Tập vector nào sau đây PHỤ THUỘC tuyến tính?',
    options: ['{ (1, 2), (2, 4) }', '{ (1, 0), (0, 1) }', '{ (1, 1), (2, 3) }', '{ (3, 1), (6, 3) }'],
    answerIndex: 0,
    explain:
      '(2, 4) = 2·(1, 2) nên tập đầu phụ thuộc. Ba tập còn lại có định thức khác 0 (ví dụ {(3,1),(6,3)}: 3·3 − 1·6 = 3 ≠ 0) nên độc lập.',
    hints: [
      { level: 1, text: 'Tìm cặp mà vector này là bội của vector kia.' },
      { level: 2, text: '(2, 4) có phải 2·(1, 2) không?' },
    ],
  },
  {
    id: 'eb-ch4-indep-error',
    type: 'error-detection',
    skillId: 'linear_independence',
    dimension: 'compute',
    difficulty: 3,
    prompt: 'Tìm dòng SAI khi kiểm tra tính độc lập của hai vector (2, 1) và (4, 3).',
    lines: [
      'Xếp hai vector thành các cột của ma trận: [[2, 4], [1, 3]]',
      'Tính định thức: det = 2·3 − 4·1',
      'det = 6 − 4 = 2',
      'Vì det = 0 nên hai vector phụ thuộc tuyến tính',
    ],
    wrongLineIndex: 3,
    explain:
      'Định thức bằng 2 (khác 0), nên hai vector ĐỘC LẬP tuyến tính. Định thức khác 0 mới là dấu hiệu của độc lập.',
    hints: [
      { level: 1, text: 'Ba dòng đầu tính đúng; hãy xét lại kết luận từ giá trị định thức.' },
      { level: 2, text: 'det = 2, mà 2 có bằng 0 không?' },
      { level: 3, text: 'det ≠ 0 ⟹ độc lập; det = 0 ⟹ phụ thuộc.' },
    ],
  },

  // --- basis_dimension ------------------------------------------------------
  {
    id: 'eb-ch4-basis-definition',
    type: 'multiple-choice',
    skillId: 'basis_dimension',
    dimension: 'concept',
    difficulty: 2,
    prompt: 'Một "cơ sở" (basis) của một không gian vector là gì?',
    options: [
      'Một tập vector độc lập tuyến tính và sinh ra (span) toàn bộ không gian',
      'Bất kỳ tập vector nào sinh ra không gian, kể cả khi phụ thuộc',
      'Tập tất cả các vector trong không gian',
      'Vector dài nhất trong không gian',
    ],
    answerIndex: 0,
    explain:
      'Cơ sở là tập vector vừa ĐỘC LẬP tuyến tính vừa SINH RA toàn bộ không gian — đủ để biểu diễn mọi vector một cách duy nhất, không dư thừa.',
    hints: [
      { level: 1, text: 'Cơ sở cần đủ để phủ (span) nhưng không được dư thừa.' },
      { level: 2, text: 'Hai điều kiện: độc lập tuyến tính và span toàn bộ không gian.' },
    ],
  },
  {
    id: 'eb-ch4-basis-dim-r3',
    type: 'numeric-input',
    skillId: 'basis_dimension',
    dimension: 'concept',
    difficulty: 1,
    prompt: 'Số chiều (dimension) của không gian ℝ³ bằng bao nhiêu?',
    answer: 3,
    tolerance: 0,
    explain:
      'Số chiều là số vector trong một cơ sở. ℝ³ có cơ sở chuẩn { (1,0,0), (0,1,0), (0,0,1) } gồm 3 vector, nên dim = 3.',
    hints: [
      { level: 1, text: 'Số chiều = số vector trong một cơ sở.' },
      { level: 2, text: 'Đếm số vector cơ sở chuẩn của ℝ³.' },
    ],
  },
  {
    id: 'eb-ch4-basis-dim-match',
    type: 'matching',
    skillId: 'basis_dimension',
    dimension: 'concept',
    difficulty: 3,
    prompt: 'Ghép mỗi không gian con với số chiều đúng của nó.',
    left: [
      'Đường thẳng đi qua gốc trong ℝ³',
      'Mặt phẳng đi qua gốc trong ℝ³',
      'Toàn bộ không gian ℝ³',
    ],
    right: ['3', '1', '2'],
    pairs: [
      [0, 1],
      [1, 2],
      [2, 0],
    ],
    explain:
      'Đường thẳng qua gốc là span của 1 vector → dim 1; mặt phẳng qua gốc là span của 2 vector độc lập → dim 2; toàn ℝ³ → dim 3.',
    hints: [
      { level: 1, text: 'Số chiều = số vector độc lập cần để sinh ra không gian đó.' },
      { level: 2, text: 'Một đường thẳng chỉ cần 1 hướng để sinh ra.' },
    ],
  },

  // --- rank -----------------------------------------------------------------
  {
    id: 'eb-ch4-rank-2x2',
    type: 'numeric-input',
    skillId: 'rank',
    dimension: 'compute',
    difficulty: 2,
    prompt: 'Tính hạng (rank) của ma trận A = [[1, 2], [2, 4]].',
    answer: 1,
    tolerance: 0,
    explain:
      'Hàng 2 = 2·hàng 1 nên chỉ có một hàng độc lập. Hạng = số hàng (hoặc cột) độc lập = 1.',
    hints: [
      { level: 1, text: 'Hạng là số hàng độc lập tuyến tính sau khi rút gọn.' },
      { level: 2, text: 'Hàng 2 có phải là bội của hàng 1 không?' },
    ],
  },
  {
    id: 'eb-ch4-rank-3x3',
    type: 'numeric-input',
    skillId: 'rank',
    dimension: 'compute',
    difficulty: 3,
    prompt: 'Tính hạng (rank) của ma trận A = [[1, 2, 3], [0, 1, 1], [1, 3, 4]].',
    answer: 2,
    tolerance: 0,
    explain:
      'Hàng 3 = hàng 1 + hàng 2 = (1, 3, 4), nên phụ thuộc. Hai hàng đầu độc lập (không là bội của nhau), vậy rank = 2.',
    hints: [
      { level: 1, text: 'Thử biểu diễn một hàng qua tổ hợp của hai hàng còn lại.' },
      { level: 2, text: 'Hàng 1 + hàng 2 = (1+0, 2+1, 3+1) = ?' },
      { level: 3, text: 'Hàng 3 = hàng 1 + hàng 2 ⟹ chỉ còn 2 hàng độc lập.' },
    ],
  },
  {
    id: 'eb-ch4-rank-nullity-tf',
    type: 'true-false',
    skillId: 'rank',
    dimension: 'concept',
    difficulty: 4,
    prompt: 'Đúng hay Sai?',
    statement: 'Với mọi ma trận A, ta luôn có rank(A) + nullity(A) = số CỘT của A.',
    answer: true,
    explain:
      'Đây là định lý hạng–số khuyết (rank–nullity theorem): mỗi cột hoặc ứng với một pivot (đóng góp vào rank) hoặc ứng với một ẩn tự do (đóng góp vào nullity), nên tổng bằng số cột.',
    hints: [
      { level: 1, text: 'Mỗi cột hoặc là cột pivot, hoặc ứng với một ẩn tự do.' },
      { level: 2, text: 'Số cột pivot = rank; số ẩn tự do = nullity.' },
    ],
  },

  // --- change_of_basis ------------------------------------------------------
  {
    id: 'eb-ch4-changebasis-steps',
    type: 'step-ordering',
    skillId: 'change_of_basis',
    dimension: 'compute',
    difficulty: 3,
    prompt:
      'Sắp xếp các bước để đổi tọa độ của một vector từ hệ chuẩn sang một cơ sở mới B.',
    steps: [
      'Xếp các vector của cơ sở B thành các cột của ma trận P',
      'Tính ma trận nghịch đảo P⁻¹',
      'Nhân P⁻¹ với vector tọa độ chuẩn x',
      'Kết quả P⁻¹x chính là tọa độ của vector trong cơ sở B',
    ],
    explain:
      'P (các cột là vector cơ sở B) đổi từ tọa độ-B sang tọa độ chuẩn; do đó P⁻¹ đi theo chiều ngược lại: từ tọa độ chuẩn về tọa độ-B.',
    hints: [
      { level: 1, text: 'Ma trận P dựng từ các vector cơ sở mới đi từ B ra hệ chuẩn.' },
      { level: 2, text: 'Muốn đi ngược chiều (chuẩn → B) thì cần P⁻¹.' },
    ],
  },
  {
    id: 'eb-ch4-changebasis-tostandard',
    type: 'matrix-input',
    skillId: 'change_of_basis',
    dimension: 'compute',
    difficulty: 3,
    prompt:
      'Cho cơ sở B = { (1, 0), (1, 1) }. Một vector có tọa độ [x]_B = (2, 3) trong cơ sở B. Tìm tọa độ của vector đó trong hệ chuẩn (2×1).',
    rows: 2,
    cols: 1,
    answer: [[5], [3]],
    tolerance: 0,
    explain:
      'Tọa độ chuẩn = 2·(1, 0) + 3·(1, 1) = (2 + 3, 0 + 3) = (5, 3). Đây là phép nhân P·[x]_B với P = [[1,1],[0,1]].',
    hints: [
      { level: 1, text: 'Vector = 2·(vector cơ sở thứ nhất) + 3·(vector cơ sở thứ hai).' },
      { level: 2, text: '2·(1, 0) = (2, 0) và 3·(1, 1) = (3, 3).' },
      { level: 3, text: 'Cộng lại: (2+3, 0+3).' },
    ],
  },
];
