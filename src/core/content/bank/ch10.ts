// ===========================================================================
// NGÂN HÀNG BÀI TẬP — CHƯƠNG 10: HỌC MÁY & HỒI QUY (nhánh Deep Learning)
//
// Nội dung GỐC: số liệu & câu chữ tự soạn, KHÔNG sao chép/dịch từ sách. Kỹ thuật
// toán là kiến thức chung. Mọi `skillId` đều tồn tại trong ../skills.ts; mọi đáp
// án đã được rà TAY. Trải difficulty 1..4, dùng đủ nhiều dạng bài.
//
// Triết lý: Deep Learning = LA áp dụng — mỗi bài bắc cầu về một chương LA.
// Skills phủ: linear_regression_ml, gradient_descent, softmax_regression,
//             generalization
//
// Export: exercises: Exercise[]
// ===========================================================================

import type { Exercise } from '../../exercises/types';

export const exercises: Exercise[] = [
  // --- linear_regression_ml -------------------------------------------------
  {
    id: 'eb-ch10-mse-compute',
    type: 'numeric-input',
    skillId: 'linear_regression_ml',
    dimension: 'compute',
    difficulty: 2,
    prompt:
      'Mô hình hồi quy dự đoán ŷ = 2x. Trên hai điểm dữ liệu (x, y) = (1, 3) và (2, 3), hãy tính MSE (mean squared error).',
    answer: 1,
    tolerance: 0.001,
    explain:
      'Dự đoán: ŷ(1) = 2, ŷ(2) = 4. Residual: 2 − 3 = −1 và 4 − 3 = 1. MSE = ((−1)² + 1²)/2 = (1 + 1)/2 = 1.',
    hints: [
      { level: 1, text: 'Trước hết tính dự đoán ŷ tại x = 1 và x = 2.' },
      { level: 2, text: 'Residual = ŷ − y cho từng điểm: (2−3) và (4−3).' },
      { level: 3, text: 'MSE = trung bình của các residual BÌNH PHƯƠNG = (1 + 1)/2.' },
    ],
  },
  {
    id: 'eb-ch10-design-XtX',
    type: 'matrix-input',
    skillId: 'linear_regression_ml',
    dimension: 'compute',
    difficulty: 3,
    prompt:
      'Để khớp ŷ = b + w·x cho ba điểm có x = 1, 2, 3, ma trận thiết kế là X = [[1,1],[1,2],[1,3]] (mỗi hàng [1, xᵢ]). Tính XᵀX (2×2) — vế trái của normal equation.',
    rows: 2,
    cols: 2,
    answer: [
      [3, 6],
      [6, 14],
    ],
    tolerance: 0,
    explain:
      'XᵀX gồm: (1,1) = Σ1·1 = 3; (1,2) = (2,1) = Σ1·xᵢ = 1+2+3 = 6; (2,2) = Σxᵢ² = 1+4+9 = 14. Vậy XᵀX = [[3, 6], [6, 14]].',
    hints: [
      { level: 1, text: 'Phần tử (i, j) của XᵀX là tích vô hướng của cột i và cột j của X.' },
      { level: 2, text: 'Cột 1 của X toàn số 1; cột 2 là (1, 2, 3).' },
      { level: 3, text: 'Ô (2,2) = 1² + 2² + 3² = 14; ô (1,2) = 1+2+3 = 6.' },
    ],
  },
  {
    id: 'eb-ch10-normal-equation',
    type: 'multiple-choice',
    skillId: 'linear_regression_ml',
    dimension: 'concept',
    difficulty: 2,
    prompt:
      'Hệ Xβ = y (khớp mọi điểm) thường vô nghiệm vì có nhiều điểm hơn tham số. Nghiệm least squares β được tìm bằng cách giải phương trình nào?',
    options: [
      'XᵀX β = Xᵀy  (normal equation)',
      'Xβ = 0',
      'det(X) = 0',
      'X⁻¹ y = β  (nghịch đảo trực tiếp X)',
    ],
    answerIndex: 0,
    explain:
      'Nhân hai vế Xβ = y với Xᵀ cho normal equation XᵀX β = Xᵀy — một hệ vuông luôn giải được. Nó tương đương chiếu y lên column space C(X) (Chương 8). X nói chung không vuông nên không có X⁻¹.',
    hints: [
      { level: 1, text: 'X không vuông nên không thể lấy nghịch đảo trực tiếp.' },
      { level: 2, text: 'Nhân cả hai vế với Xᵀ để có một hệ vuông theo β.' },
    ],
  },

  // --- gradient_descent -----------------------------------------------------
  {
    id: 'eb-ch10-gd-step',
    type: 'numeric-input',
    skillId: 'gradient_descent',
    dimension: 'compute',
    difficulty: 2,
    prompt:
      'Trong một bước gradient descent, tham số hiện tại w = 0 và đạo hàm ∂L/∂w = −5. Với learning rate η = 0.1, giá trị w mới sau cập nhật θ ← θ − η·∇L là bao nhiêu?',
    answer: 0.5,
    tolerance: 0.001,
    explain:
      'w mới = w − η·(∂L/∂w) = 0 − 0.1·(−5) = 0 + 0.5 = 0.5. Gradient âm ⇒ w được kéo lên.',
    hints: [
      { level: 1, text: 'Áp dụng công thức w ← w − η·(∂L/∂w).' },
      { level: 2, text: 'Chú ý dấu: trừ đi một số âm là cộng.' },
      { level: 3, text: '0 − 0.1·(−5) = 0 + 0.5.' },
    ],
  },
  {
    id: 'eb-ch10-gd-update-rule',
    type: 'multiple-choice',
    skillId: 'gradient_descent',
    dimension: 'concept',
    difficulty: 1,
    prompt: 'Quy tắc cập nhật của gradient descent để TỐI THIỂU hóa hàm mất mát L là gì?',
    options: [
      'θ ← θ − η·∇L  (đi ngược hướng gradient)',
      'θ ← θ + η·∇L  (đi cùng hướng gradient)',
      'θ ← η·θ',
      'θ ← ∇L',
    ],
    answerIndex: 0,
    explain:
      'Gradient chỉ hướng TĂNG nhanh nhất; muốn giảm L ta bước ngược lại: θ ← θ − η·∇L. Dấu cộng sẽ leo lên dốc làm L tăng.',
    hints: [
      { level: 1, text: 'Gradient chỉ hướng đi LÊN dốc.' },
      { level: 2, text: 'Muốn xuống đáy thì đi ngược gradient (dấu trừ).' },
    ],
  },
  {
    id: 'eb-ch10-gd-loop-order',
    type: 'step-ordering',
    skillId: 'gradient_descent',
    dimension: 'compute',
    difficulty: 2,
    prompt: 'Sắp xếp đúng thứ tự một vòng lặp huấn luyện bằng gradient descent.',
    steps: [
      'Tính dự đoán ŷ = wx + b cho dữ liệu hiện tại',
      'Tính hàm mất mát L và gradient ∇L theo các tham số',
      'Cập nhật tham số: θ ← θ − η·∇L',
      'Lặp lại cho tới khi gradient ≈ 0 (hội tụ)',
    ],
    explain:
      'Mỗi vòng: dự đoán → đo sai số & tính gradient → bước ngược gradient để cập nhật → lặp cho tới khi hội tụ (gradient triệt tiêu ở đáy).',
    hints: [
      { level: 1, text: 'Phải có dự đoán trước thì mới tính được sai số và gradient.' },
      { level: 2, text: 'Cập nhật tham số dựa trên gradient vừa tính, rồi mới lặp lại.' },
    ],
  },

  // --- softmax_regression ---------------------------------------------------
  {
    id: 'eb-ch10-softmax-sum',
    type: 'true-false',
    skillId: 'softmax_regression',
    dimension: 'concept',
    difficulty: 1,
    prompt: 'Đúng hay Sai?',
    statement: 'Các thành phần đầu ra của hàm softmax luôn dương và cộng lại đúng bằng 1.',
    answer: true,
    explain:
      'softmax(z)ⱼ = e^{zⱼ} / Σₘ e^{zₘ}. Tử số e^{zⱼ} > 0 và mẫu số là tổng của chúng, nên mỗi thành phần thuộc (0, 1) và tổng = 1 — một phân phối xác suất hợp lệ.',
    hints: [
      { level: 1, text: 'Hàm mũ eˣ luôn dương.' },
      { level: 2, text: 'Mỗi thành phần được chia cho TỔNG của tất cả các e^{zₘ}.' },
    ],
  },
  {
    id: 'eb-ch10-softmax-normalize',
    type: 'numeric-input',
    skillId: 'softmax_regression',
    dimension: 'compute',
    difficulty: 2,
    prompt:
      'Cho ba lớp có các giá trị mũ đã tính sẵn e^{z} = (3, 1, 1). Xác suất softmax của lớp thứ nhất bằng bao nhiêu?',
    answer: 0.6,
    tolerance: 0.001,
    explain:
      'Chuẩn hóa: chia cho tổng. Tổng = 3 + 1 + 1 = 5. p₁ = 3/5 = 0.6.',
    hints: [
      { level: 1, text: 'Softmax = (mỗi e^{z}) chia cho TỔNG các e^{z}.' },
      { level: 2, text: 'Tổng = 3 + 1 + 1 = 5.' },
      { level: 3, text: 'p₁ = 3/5.' },
    ],
  },
  {
    id: 'eb-ch10-softmax-Wx-matvec',
    type: 'multiple-choice',
    skillId: 'softmax_regression',
    dimension: 'concept',
    difficulty: 3,
    prompt:
      'Trong bộ phân loại softmax, logits được tính bằng z = Wx + b. Phép Wx là phép toán đại số tuyến tính nào?',
    options: [
      'Nhân ma trận–vector (matVec): mỗi logit zⱼ = Wⱼ · x là một tích vô hướng',
      'Tích có hướng (cross product) của W và x',
      'Định thức của ma trận W',
      'Phép chuẩn hóa để tổng bằng 1',
    ],
    answerIndex: 0,
    explain:
      'Wx là nhân ma trận–vector (Chương 3): logit thứ j là tích vô hướng của hàng Wⱼ với x (Chương 1). Softmax chỉ CHUẨN HÓA các logits này thành xác suất — sức mạnh học nằm ở phần tuyến tính Wx + b.',
    hints: [
      { level: 1, text: 'Nhân một ma trận với một vector cho ra một vector các tích vô hướng.' },
      { level: 2, text: 'Hàng thứ j của W dot với x cho logit zⱼ.' },
    ],
  },

  // --- generalization -------------------------------------------------------
  {
    id: 'eb-ch10-overfit-def',
    type: 'multiple-choice',
    skillId: 'generalization',
    dimension: 'concept',
    difficulty: 2,
    prompt: 'Hiện tượng "overfitting" (quá khớp) được mô tả đúng nhất bởi phát biểu nào?',
    options: [
      'Mô hình khớp rất tốt dữ liệu huấn luyện (kể cả nhiễu) nhưng dự đoán KÉM trên dữ liệu mới',
      'Mô hình sai trên cả tập huấn luyện lẫn tập kiểm tra vì quá đơn giản',
      'Mô hình có số tham số ít hơn số điểm dữ liệu',
      'Mô hình hội tụ quá chậm khi huấn luyện',
    ],
    answerIndex: 0,
    explain:
      'Overfit = học thuộc cả nhiễu ⇒ mất mát huấn luyện nhỏ nhưng TỔNG QUÁT HÓA kém (test error cao). Trường hợp sai trên cả hai (đáp án 2) là underfitting — do bias cao.',
    hints: [
      { level: 1, text: 'Phân biệt kết quả trên tập train và trên dữ liệu chưa từng thấy.' },
      { level: 2, text: 'Overfit: train tốt bất thường nhưng test tệ.' },
    ],
  },
  {
    id: 'eb-ch10-weight-decay',
    type: 'multiple-choice',
    skillId: 'generalization',
    dimension: 'concept',
    difficulty: 2,
    prompt:
      'Weight decay (điều chuẩn L2) thêm vào hàm mất mát số hạng λ·‖w‖². Số hạng này "phạt" điều gì và có tác dụng gì?',
    options: [
      'Phạt độ lớn (chuẩn Euclid) của vector trọng số ⇒ ưu tiên trọng số nhỏ ⇒ hàm mượt hơn',
      'Phạt định thức của ma trận trọng số ⇒ làm nó suy biến',
      'Phạt số lượng tham số ⇒ tự động xóa bớt lớp',
      'Phạt learning rate ⇒ tăng tốc hội tụ',
    ],
    answerIndex: 0,
    explain:
      '‖w‖² = w·w = Σ wₖ² là bình phương chuẩn Euclid (Chương 1). Phạt nó khiến bộ tối ưu ưa nghiệm có trọng số nhỏ, giảm dao động ⇒ mô hình mượt, ít nhạy nhiễu, tổng quát hóa tốt hơn.',
    hints: [
      { level: 1, text: '‖w‖² là tích vô hướng của w với chính nó.' },
      { level: 2, text: 'Trọng số nhỏ ⇒ đường dự đoán ít uốn lượn.' },
    ],
  },
  {
    id: 'eb-ch10-ridge-eigenvalue',
    type: 'multiple-choice',
    skillId: 'generalization',
    dimension: 'concept',
    difficulty: 4,
    prompt:
      'Nghiệm ridge regression thoả (XᵀX + λI) w = Xᵀy với λ > 0. Vì sao việc thêm λI luôn khiến hệ này giải được, kể cả khi các cột của X phụ thuộc tuyến tính?',
    options: [
      'Vì λI nâng mọi eigenvalue μᵢ của XᵀX lên μᵢ + λ > 0, nên XᵀX + λI xác định dương ⇒ khả nghịch',
      'Vì λI làm định thức bằng 0',
      'Vì λI biến XᵀX thành ma trận phản đối xứng',
      'Vì λI xóa toàn bộ dữ liệu Xᵀy',
    ],
    answerIndex: 0,
    explain:
      'XᵀX đối xứng nửa xác định dương nên eigenvalue μᵢ ≥ 0 (có thể bằng 0 khi cột phụ thuộc ⇒ suy biến). Cộng λI dịch mọi eigenvalue thành μᵢ + λ > 0 (Chương 5), nên ma trận trở thành xác định dương và luôn khả nghịch — regularization vừa chống overfit vừa chữa điều kiện số xấu.',
    hints: [
      { level: 1, text: 'Nhớ: cộng λI vào một ma trận dịch chuyển mọi eigenvalue thêm λ.' },
      { level: 2, text: 'Eigenvalue của XᵀX là ≥ 0; cộng λ > 0 làm chúng > 0.' },
      { level: 3, text: 'Ma trận đối xứng có mọi eigenvalue dương thì xác định dương ⇒ khả nghịch.' },
    ],
  },
];
