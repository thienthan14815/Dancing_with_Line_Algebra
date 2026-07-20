// ===========================================================================
// NGÂN HÀNG BÀI TẬP — SECTION ch7-code (Ứng dụng bằng code)
//
// Dữ liệu thuần, KHÔNG UI, KHÔNG random. Số liệu & câu chữ tự soạn (nội dung
// GỐC, không sao chép/dịch từ sách); kỹ thuật toán là kiến thức chung. Mọi
// `skillId` đều tồn tại trong ../skills.ts và được các bài học của Section ch7
// tham chiếu:
//   • matrix_transformation — Đồ họa: biến đổi hình (xoay/co giãn)
//   • least_squares         — Bình phương tối thiểu (normal equation)
//   • markov_pagerank       — Markov chain & PageRank (power iteration)
//   • rank_k_approximation  — Nén ảnh bằng SVD (dung lượng lý thuyết)
//
// Mọi đáp án đã được rà tay. Nhiều dạng "đọc kết quả code" dùng numeric/multiple-
// choice, và step-ordering cho các quy trình. Trải difficulty 1..4.
// Export: `exercises: Exercise[]`.
// ===========================================================================

import type { Exercise } from '../../exercises/types';

export const exercises: Exercise[] = [
  // -------------------------------------------------------------------------
  // matrix_transformation — đồ họa: xoay / co giãn / kết hợp
  // -------------------------------------------------------------------------
  {
    id: 'ch7-gfx-origin-fixed',
    type: 'true-false',
    skillId: 'matrix_transformation',
    dimension: 'concept',
    difficulty: 1,
    prompt: 'Đúng hay Sai?',
    statement: 'Một phép biến đổi tuyến tính (quay, co giãn dạng M·p) luôn giữ nguyên gốc tọa độ O(0, 0).',
    answer: true,
    explain:
      'ĐÚNG. Với mọi ma trận M, ta có M·0 = 0, nên điểm gốc luôn được ánh xạ về chính nó. (Muốn dịch chuyển gốc cần thêm phép tịnh tiến — không phải biến đổi tuyến tính thuần.)',
    hints: [
      { level: 1, text: 'Thử tính M nhân với vector (0, 0).' },
      { level: 2, text: 'M·0 = 0 với mọi ma trận M.' },
    ],
  },
  {
    id: 'ch7-gfx-rotate90',
    type: 'numeric-input',
    skillId: 'matrix_transformation',
    dimension: 'compute',
    difficulty: 2,
    prompt:
      'Phép quay 90° ngược chiều kim đồng hồ có ma trận R = [[0, −1], [1, 0]]. Điểm P(3, 1) sau khi quay thành P′ = R·P. Nhập hoành độ x′ của P′.',
    answer: -1,
    tolerance: 0,
    explain:
      'R·(3, 1) = (0·3 + (−1)·1, 1·3 + 0·1) = (−1, 3). Vậy x′ = −1 (và y′ = 3).',
    hints: [
      { level: 1, text: 'Nhân hàng đầu của R với vector cột (3, 1).' },
      { level: 2, text: 'x′ = 0·3 + (−1)·1.' },
    ],
  },
  {
    id: 'ch7-gfx-scale',
    type: 'matrix-input',
    skillId: 'matrix_transformation',
    dimension: 'compute',
    difficulty: 3,
    prompt:
      'Phép co giãn S = [[2, 0], [0, 3]] (giãn trục x gấp 2, trục y gấp 3). Tính ảnh của điểm P(4, −2), tức S·P. Nhập vector cột kết quả (2×1).',
    rows: 2,
    cols: 1,
    answer: [[8], [-6]],
    tolerance: 0,
    explain: 'S·(4, −2) = (2·4, 3·(−2)) = (8, −6). Ma trận đường chéo chỉ nhân từng tọa độ với hệ số tương ứng.',
    hints: [
      { level: 1, text: 'Ma trận đường chéo nhân riêng từng tọa độ.' },
      { level: 2, text: 'x mới = 2·4; y mới = 3·(−2).' },
      { level: 3, text: 'Chú ý dấu: 3·(−2) = −6.' },
    ],
  },
  {
    id: 'ch7-gfx-compose',
    type: 'numeric-input',
    skillId: 'matrix_transformation',
    dimension: 'compute',
    difficulty: 4,
    prompt:
      'Một sprite được biến đổi bằng M = S·R, trong đó R = [[0, −1], [1, 0]] (quay 90° ngược chiều) và S = [[2, 0], [0, 2]] (phóng to gấp đôi). Điểm P(2, 1) qua M thành P′ = M·P (áp R trước, rồi S). Nhập tung độ y′ của P′.',
    answer: 4,
    tolerance: 0,
    explain:
      'M = S·R = [[2, 0], [0, 2]]·[[0, −1], [1, 0]] = [[0, −2], [2, 0]]. Khi đó M·(2, 1) = (0·2 + (−2)·1, 2·2 + 0·1) = (−2, 4). Vậy y′ = 4. (Có thể kiểm tra theo từng bước: R·(2,1) = (−1, 2); rồi S·(−1, 2) = (−2, 4).)',
    hints: [
      { level: 1, text: 'Với vector cột, phép áp TRƯỚC (R) đứng bên phải: M·p = S·(R·p).' },
      { level: 2, text: 'Trước hết R·(2, 1) = (−1, 2).' },
      { level: 3, text: 'Sau đó S nhân đôi mỗi tọa độ: y′ = 2·2 = 4.' },
    ],
  },
  {
    id: 'ch7-gfx-compose-order',
    type: 'multiple-choice',
    skillId: 'matrix_transformation',
    dimension: 'concept',
    difficulty: 3,
    prompt:
      'Muốn "quay R trước, rồi co giãn S sau" một điểm biểu diễn bằng vector cột p, biểu thức biến đổi kết hợp đúng là gì?',
    options: [
      '(S·R)·p — ma trận áp SAU (S) đứng bên TRÁI, ma trận áp trước (R) đứng bên phải',
      '(R·S)·p — ma trận áp trước đứng bên trái',
      'p·(S·R) — nhân vector ở bên trái',
      '(S + R)·p — cộng hai ma trận biến đổi',
    ],
    answerIndex: 0,
    explain:
      'Với vector cột, biến đổi áp trước nằm sát vector nhất (bên phải). "Quay trước rồi giãn" = S·(R·p) = (S·R)·p. Thứ tự nhân ma trận ngược với thứ tự đọc.',
    hints: [
      { level: 1, text: 'Ma trận nào chạm vào vector p đầu tiên thì được áp trước.' },
      { level: 2, text: 'R áp trước nên R sát p (bên phải): S·(R·p).' },
    ],
  },

  // -------------------------------------------------------------------------
  // least_squares — normal equation & đọc kết quả code
  // -------------------------------------------------------------------------
  {
    id: 'ch7-ls-slope',
    type: 'numeric-input',
    skillId: 'least_squares',
    dimension: 'compute',
    difficulty: 3,
    prompt:
      'Dùng phương trình chuẩn (normal equation), tìm hệ số góc b của đường thẳng bình phương tối thiểu y = a + b·x khớp với ba điểm (−1, 1), (0, 2), (1, 6). Nhập b.',
    answer: 2.5,
    tolerance: 0.001,
    explain:
      'Vì các giá trị x đối xứng quanh 0 (Σx = 0), hai phương trình chuẩn tách rời: a = trung bình của y = (1 + 2 + 6)/3 = 3, và b = (Σ xᵢyᵢ)/(Σ xᵢ²) = (−1·1 + 0·2 + 1·6)/((−1)² + 0² + 1²) = 5/2 = 2.5.',
    hints: [
      { level: 1, text: 'Σx = 0 giúp tách rời: b = (Σ xᵢyᵢ)/(Σ xᵢ²).' },
      { level: 2, text: 'Σ xᵢyᵢ = −1·1 + 0·2 + 1·6 = 5; Σ xᵢ² = 1 + 0 + 1 = 2.' },
      { level: 3, text: 'b = 5/2.' },
    ],
  },
  {
    id: 'ch7-ls-read-code',
    type: 'numeric-input',
    skillId: 'least_squares',
    dimension: 'compute',
    difficulty: 2,
    prompt:
      'Một đoạn code least squares in ra AᵀA = [[4, 0], [0, 10]] và Aᵀb = [8, 30]. Nghiệm x̂ = (AᵀA)⁻¹·Aᵀb. Tính thành phần thứ hai x̂₂.',
    answer: 3,
    tolerance: 0.001,
    explain:
      'Vì AᵀA là ma trận đường chéo, hệ tách rời: x̂₁ = 8/4 = 2 và x̂₂ = 30/10 = 3. Vậy x̂₂ = 3.',
    hints: [
      { level: 1, text: 'AᵀA đường chéo nên mỗi ẩn giải độc lập.' },
      { level: 2, text: 'x̂₂ = (thành phần 2 của Aᵀb) / (phần tử (2,2) của AᵀA).' },
      { level: 3, text: 'x̂₂ = 30/10.' },
    ],
  },
  {
    id: 'ch7-ls-order',
    type: 'step-ordering',
    skillId: 'least_squares',
    dimension: 'compute',
    difficulty: 3,
    prompt: 'Sắp xếp đúng thứ tự các bước giải bài toán bình phương tối thiểu Ax ≈ b bằng phương trình chuẩn.',
    steps: [
      'Lập ma trận thiết kế A (mỗi hàng ứng một điểm dữ liệu) và vector quan sát b',
      'Nhân hai vế với Aᵀ để được phương trình chuẩn AᵀA·x = Aᵀb',
      'Tính ma trận AᵀA và vector Aᵀb',
      'Giải hệ AᵀA·x = Aᵀb để tìm vector hệ số x̂',
    ],
    explain:
      'Bình phương tối thiểu quy về giải phương trình chuẩn AᵀA·x = Aᵀb: dựng A và b, nhân Aᵀ, tính hai vế, rồi giải hệ.',
    hints: [
      { level: 1, text: 'Phải có A và b trước khi làm bất cứ điều gì.' },
      { level: 2, text: 'Nhân Aᵀ vào hai vế để tạo phương trình chuẩn.' },
      { level: 3, text: 'Giải hệ là bước cuối cùng.' },
    ],
  },
  {
    id: 'ch7-ls-projection',
    type: 'multiple-choice',
    skillId: 'least_squares',
    dimension: 'concept',
    difficulty: 3,
    prompt: 'Nghiệm bình phương tối thiểu x̂ của bài toán Ax ≈ b (khi Ax = b vô nghiệm) có tính chất hình học nào?',
    options: [
      'A·x̂ là hình chiếu vuông góc của b lên không gian cột của A',
      'A·x̂ = b một cách chính xác',
      'x̂ là vector riêng của A',
      'A·x̂ vuông góc với vector b',
    ],
    answerIndex: 0,
    explain:
      'Least squares cực tiểu ‖b − Ax‖. Sai số r = b − A·x̂ phải TRỰC GIAO với không gian cột của A (điều kiện Aᵀr = 0, tức phương trình chuẩn). Do đó A·x̂ chính là hình chiếu vuông góc của b lên col(A).',
    hints: [
      { level: 1, text: 'Ta chọn điểm trong col(A) GẦN b nhất.' },
      { level: 2, text: 'Điểm gần nhất trong một không gian con là hình chiếu vuông góc.' },
      { level: 3, text: 'Vector sai số b − A·x̂ vuông góc với col(A) — đó là ý nghĩa phương trình chuẩn.' },
    ],
  },

  // -------------------------------------------------------------------------
  // markov_pagerank — power iteration / phân phối dừng
  // -------------------------------------------------------------------------
  {
    id: 'ch7-pr-one-step',
    type: 'numeric-input',
    skillId: 'markov_pagerank',
    dimension: 'compute',
    difficulty: 2,
    prompt:
      'Xích Markov có ma trận chuyển cột-ngẫu nhiên P = [[0.8, 0.3], [0.2, 0.7]] (mỗi cột cộng lại bằng 1). Phân phối hiện tại x = [0.5, 0.5]ᵀ. Tính thành phần thứ nhất của phân phối sau một bước, tức (P·x)₁.',
    answer: 0.55,
    tolerance: 0.001,
    explain:
      '(P·x)₁ = 0.8·0.5 + 0.3·0.5 = 0.40 + 0.15 = 0.55. (Thành phần thứ hai là 0.2·0.5 + 0.7·0.5 = 0.45; tổng vẫn bằng 1.)',
    hints: [
      { level: 1, text: 'Nhân hàng đầu của P với vector x.' },
      { level: 2, text: '(P·x)₁ = 0.8·0.5 + 0.3·0.5.' },
    ],
  },
  {
    id: 'ch7-pr-stationary',
    type: 'numeric-input',
    skillId: 'markov_pagerank',
    dimension: 'compute',
    difficulty: 3,
    prompt:
      'Tìm phân phối dừng π của P = [[0.8, 0.3], [0.2, 0.7]], thỏa P·π = π và π₁ + π₂ = 1. Nhập π₁.',
    answer: 0.6,
    tolerance: 0.001,
    explain:
      'Từ hàng 1: 0.8·π₁ + 0.3·π₂ = π₁. Thay π₂ = 1 − π₁: 0.8π₁ + 0.3(1 − π₁) = π₁ → 0.5π₁ + 0.3 = π₁ → 0.3 = 0.5π₁ → π₁ = 0.6. (Kiểm tra: π = (0.6, 0.4) cho P·π = (0.6, 0.4).)',
    hints: [
      { level: 1, text: 'Viết phương trình P·π = π theo hàng đầu, rồi thế π₂ = 1 − π₁.' },
      { level: 2, text: '0.8π₁ + 0.3(1 − π₁) = π₁.' },
      { level: 3, text: 'Rút gọn: 0.3 = 0.5·π₁.' },
    ],
  },
  {
    id: 'ch7-pr-power-order',
    type: 'step-ordering',
    skillId: 'markov_pagerank',
    dimension: 'compute',
    difficulty: 3,
    prompt: 'Sắp xếp đúng thứ tự các bước của thuật toán lặp lũy thừa (power iteration) để tính PageRank.',
    steps: [
      'Khởi tạo vector rank r đều nhau (mỗi trang bằng 1/N)',
      'Nhân vector rank với ma trận chuyển: r_mới = M·r',
      'Chuẩn hóa r_mới để tổng các thành phần bằng 1',
      'Lặp lại tới khi r hầu như không đổi (hội tụ); r cuối là PageRank',
    ],
    explain:
      'Power iteration: bắt đầu từ phân phối đều, liên tục nhân với M rồi chuẩn hóa, lặp đến khi hội tụ về vector riêng ứng với trị riêng 1 — chính là PageRank.',
    hints: [
      { level: 1, text: 'Cần một giá trị khởi tạo trước khi lặp.' },
      { level: 2, text: 'Mỗi vòng lặp: nhân với M rồi chuẩn hóa.' },
      { level: 3, text: 'Dừng khi vector gần như không đổi giữa hai vòng.' },
    ],
  },
  {
    id: 'ch7-pr-meaning',
    type: 'multiple-choice',
    skillId: 'markov_pagerank',
    dimension: 'concept',
    difficulty: 3,
    prompt:
      'Trong PageRank, phân phối dừng (vector riêng ứng với trị riêng 1 của ma trận chuyển) biểu diễn điều gì?',
    options: [
      'Tầm quan trọng ổn định lâu dài của mỗi trang — tỉ lệ thời gian một người lướt ngẫu nhiên dừng ở trang đó',
      'Số liên kết đi RA của mỗi trang',
      'Khoảng cách ngắn nhất giữa hai trang bất kỳ',
      'Tốc độ tải trang tính bằng mili-giây',
    ],
    answerIndex: 0,
    explain:
      'Phân phối dừng π là trạng thái cân bằng của bước đi ngẫu nhiên trên đồ thị web: πᵢ là tỉ lệ thời gian lâu dài mà người lướt ngẫu nhiên ở trang i — chính là điểm quan trọng PageRank.',
    hints: [
      { level: 1, text: 'Nghĩ tới một người lướt web bấm link ngẫu nhiên mãi mãi.' },
      { level: 2, text: 'Phân phối dừng cho biết tỉ lệ thời gian dừng ở mỗi trang khi hội tụ.' },
    ],
  },

  // -------------------------------------------------------------------------
  // rank_k_approximation — nén ảnh SVD: dung lượng lý thuyết
  // -------------------------------------------------------------------------
  {
    id: 'ch7-svdimg-breakeven',
    type: 'numeric-input',
    skillId: 'rank_k_approximation',
    dimension: 'compute',
    difficulty: 4,
    prompt:
      'Nén ảnh xám cỡ 100×100 bằng SVD rank-k lưu k·(100 + 100 + 1) số. Tìm giá trị k NGUYÊN LỚN NHẤT để việc nén vẫn có lợi (lưu ít hơn 100·100 = 10000 số của ảnh gốc).',
    answer: 49,
    tolerance: 0,
    explain:
      'Mỗi thành phần cần 201 số, cần k·201 < 10000 → k < 49.75. k nguyên lớn nhất là 49 (49·201 = 9849 < 10000, còn 50·201 = 10050 > 10000).',
    hints: [
      { level: 1, text: 'Giải bất phương trình k·201 < 10000.' },
      { level: 2, text: '10000 / 201 ≈ 49.75.' },
      { level: 3, text: 'k phải là số nguyên nhỏ hơn 49.75.' },
    ],
  },
];
