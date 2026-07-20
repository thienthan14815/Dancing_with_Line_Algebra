// ===========================================================================
// NGÂN HÀNG BÀI TẬP — CHƯƠNG 13: TỐI ƯU & ỨNG DỤNG (Optimization & Applications)
//
// Nội dung GỐC: số liệu & câu chữ tự soạn, KHÔNG sao chép/dịch từ sách. Kỹ thuật
// toán là kiến thức chung. Mọi `skillId` đều tồn tại trong ../skills.ts (nhóm
// ch13); mọi đáp án đã được rà tay. Trải difficulty 1..4, dùng đủ nhiều dạng bài.
//
// Skills phủ: sgd_optimizers, batch_norm, computer_vision, nlp_lm
//
// Triết lý xuyên suốt: Deep Learning = Đại số tuyến tính được ÁP DỤNG.
//   optimizer đi theo GRADIENT; thung lũng hẹp ↔ Hessian điều kiện xấu (eigen);
//   chuẩn hóa = biến đổi affine; ảnh = tensor; token → vector; attention = dot.
//
// Export: exercises: Exercise[]
// ===========================================================================

import type { Exercise } from '../../exercises/types';

export const exercises: Exercise[] = [
  // --- sgd_optimizers -------------------------------------------------------
  {
    id: 'eb-ch13-sgd-step',
    type: 'numeric-input',
    skillId: 'sgd_optimizers',
    dimension: 'compute',
    difficulty: 1,
    prompt:
      'Một bước Gradient Descent: θ ← θ − lr·g. Cho θ = 2.0, learning rate lr = 0.1, gradient g = 0.5. Giá trị θ mới bằng bao nhiêu?',
    answer: 1.95,
    tolerance: 0.001,
    explain: 'θ = 2.0 − 0.1·0.5 = 2.0 − 0.05 = 1.95. Ta bước NGƯỢC hướng gradient một đoạn tỉ lệ lr.',
    hints: [
      { level: 1, text: 'Thay số vào công thức θ − lr·g.' },
      { level: 2, text: 'lr·g = 0.1·0.5 = 0.05.' },
      { level: 3, text: '2.0 − 0.05 = ?' },
    ],
  },
  {
    id: 'eb-ch13-momentum-step',
    type: 'numeric-input',
    skillId: 'sgd_optimizers',
    dimension: 'compute',
    difficulty: 3,
    prompt:
      'Momentum cập nhật theo hai bước: v ← β·v + g, rồi θ ← θ − lr·v. Cho θ = 3.0, v = 1.0, β = 0.9, g = 2.0, lr = 0.1. Tính θ mới.',
    answer: 2.71,
    tolerance: 0.001,
    explain:
      'Trước hết vận tốc mới v = 0.9·1.0 + 2.0 = 2.9. Sau đó θ = 3.0 − 0.1·2.9 = 3.0 − 0.29 = 2.71.',
    hints: [
      { level: 1, text: 'Làm ĐÚNG THỨ TỰ: cập nhật v trước, rồi mới cập nhật θ.' },
      { level: 2, text: 'v = 0.9·1.0 + 2.0 = 2.9.' },
      { level: 3, text: 'θ = 3.0 − 0.1·2.9 = 3.0 − 0.29.' },
    ],
  },
  {
    id: 'eb-ch13-sgd-minibatch',
    type: 'multiple-choice',
    skillId: 'sgd_optimizers',
    dimension: 'concept',
    difficulty: 2,
    prompt: 'Trong SGD (Stochastic Gradient Descent), gradient ở mỗi bước cập nhật được ước lượng từ đâu?',
    options: [
      'Toàn bộ tập dữ liệu (full batch) ở mỗi bước',
      'Một minibatch nhỏ lấy ngẫu nhiên từ dữ liệu',
      'Chỉ đúng một tham số duy nhất',
      'Không dùng gradient, chỉ dùng loss',
    ],
    answerIndex: 1,
    explain:
      '"Stochastic" = ngẫu nhiên: mỗi bước lấy một minibatch nhỏ để ước lượng gradient. Rẻ và cập nhật rất nhiều lần, dù ước lượng nhiễu hơn full-batch.',
    hints: [
      { level: 1, text: 'Chú ý nghĩa của chữ "Stochastic" (ngẫu nhiên).' },
      { level: 2, text: 'Full-batch quá đắt; SGD chia dữ liệu thành các lô nhỏ.' },
    ],
  },
  {
    id: 'eb-ch13-adam-adaptive',
    type: 'true-false',
    skillId: 'sgd_optimizers',
    dimension: 'concept',
    difficulty: 2,
    prompt: 'Đúng hay Sai?',
    statement:
      'Adam dùng learning rate thích nghi RIÊNG cho từng tham số (từng chiều), dựa trên trung bình trượt của bình phương gradient.',
    answer: true,
    explain:
      'Adam ước lượng độ lớn gradient từng tọa độ qua v̂ (EMA của g²) rồi chia bước cho √v̂. Nhờ đó mỗi chiều có một learning rate hiệu dụng riêng.',
    hints: [
      { level: 1, text: 'Chữ "Ada" trong Adam gợi ý "adaptive" (thích nghi).' },
      { level: 2, text: 'Adam theo dõi cả gradient (m) lẫn bình phương gradient (v) cho từng chiều.' },
    ],
  },
  {
    id: 'eb-ch13-adam-mechanism',
    type: 'multiple-choice',
    skillId: 'sgd_optimizers',
    dimension: 'concept',
    difficulty: 4,
    prompt: 'Adam kết hợp hai ý tưởng cốt lõi nào?',
    options: [
      'Momentum (EMA của gradient, m) và scaling thích nghi theo chiều (EMA của bình phương gradient, v)',
      'Chỉ đơn thuần tăng learning rate theo thời gian',
      'Bỏ qua gradient để giảm nhiễu',
      'Nhân hai ma trận đối xứng với nhau',
    ],
    answerIndex: 0,
    explain:
      'Adam = momentum (moment bậc nhất m làm mượt hướng) + scaling kiểu RMSProp (moment bậc hai v chuẩn hóa độ lớn theo từng chiều), kèm hiệu chỉnh thiên lệch (bias correction) cho m và v.',
    hints: [
      { level: 1, text: 'Adam gộp hai kỹ thuật quen thuộc thành một.' },
      { level: 2, text: 'Một phần lo về HƯỚNG (quán tính), một phần lo về ĐỘ LỚN bước theo từng chiều.' },
    ],
  },
  {
    id: 'eb-ch13-training-loop',
    type: 'step-ordering',
    skillId: 'sgd_optimizers',
    dimension: 'concept',
    difficulty: 2,
    prompt: 'Sắp xếp đúng thứ tự MỘT vòng lặp huấn luyện (training loop) của một mạng nơ-ron.',
    steps: [
      'Lấy một minibatch dữ liệu từ tập huấn luyện',
      'Lan truyền xuôi (forward) để tính dự đoán',
      'Tính hàm mất mát (loss) giữa dự đoán và nhãn',
      'Lan truyền ngược (backprop) để tính gradient',
      'Cập nhật tham số bằng optimizer (SGD/Adam)',
    ],
    explain:
      'Mỗi vòng: lấy minibatch → forward tính dự đoán → tính loss → backprop lấy gradient → optimizer cập nhật tham số. Rồi lặp lại với minibatch tiếp theo.',
    hints: [
      { level: 1, text: 'Phải có dự đoán rồi mới tính được loss.' },
      { level: 2, text: 'Gradient (backprop) đến TRƯỚC bước cập nhật tham số.' },
      { level: 3, text: 'Bước cuối cùng của một vòng là optimizer cập nhật trọng số.' },
    ],
  },

  // --- batch_norm -----------------------------------------------------------
  {
    id: 'eb-ch13-zscore',
    type: 'numeric-input',
    skillId: 'batch_norm',
    dimension: 'compute',
    difficulty: 1,
    prompt:
      'Chuẩn hóa z-score: ẑ = (x − μ)/σ. Một giá trị x = 8 nằm trong batch có mean μ = 5 và std σ = 2. Tính ẑ.',
    answer: 1.5,
    tolerance: 0.001,
    explain: 'ẑ = (8 − 5)/2 = 3/2 = 1.5. Trừ mean để tâm về 0, chia std để độ rộng về 1.',
    hints: [
      { level: 1, text: 'Trừ mean trước, rồi chia cho std.' },
      { level: 2, text: '(8 − 5) = 3; 3 / 2 = ?' },
    ],
  },
  {
    id: 'eb-ch13-bn-normalize-tf',
    type: 'true-false',
    skillId: 'batch_norm',
    dimension: 'concept',
    difficulty: 2,
    prompt: 'Đúng hay Sai?',
    statement:
      'Ngay sau bước chuẩn hóa của Batch Norm (TRƯỚC khi nhân γ và cộng β), mỗi feature trong minibatch có mean 0 và std 1.',
    answer: true,
    explain:
      'Đó chính là định nghĩa z-score theo batch: trừ mean của batch ⇒ tâm 0; chia std của batch ⇒ std 1. Sau đó γ, β (học được) mới điều chỉnh lại tâm và độ rộng nếu cần.',
    hints: [
      { level: 1, text: 'Batch Norm chuẩn hóa từng feature dọc theo minibatch.' },
      { level: 2, text: 'z-score luôn cho ra mean 0, std 1 theo định nghĩa.' },
    ],
  },
  {
    id: 'eb-ch13-init-variance',
    type: 'multiple-choice',
    skillId: 'batch_norm',
    dimension: 'concept',
    difficulty: 3,
    prompt: 'Mục đích chính của các sơ đồ khởi tạo trọng số Xavier/Glorot hoặc He là gì?',
    options: [
      'Đặt toàn bộ trọng số ban đầu bằng 0',
      'Giữ phương sai của tín hiệu (và gradient) ổn định khi truyền qua nhiều lớp, tránh bùng nổ/tắt dần',
      'Làm cho mạng nông đi để dễ học',
      'Thay thế hoàn toàn cho hàm kích hoạt',
    ],
    answerIndex: 1,
    explain:
      'Chọn phương sai khởi tạo theo số đầu vào n_in (Xavier ∝ 1/n_in cho tanh/sigmoid; He ∝ 2/n_in cho ReLU) giúp tín hiệu không phình to hay lịm dần qua các lớp sâu.',
    hints: [
      { level: 1, text: 'Nghĩ về điều gì xảy ra với độ lớn tín hiệu sau RẤT NHIỀU lớp.' },
      { level: 2, text: 'Nếu trọng số quá lớn → bùng nổ; quá nhỏ → tắt dần. Ta muốn cân bằng.' },
    ],
  },
  {
    id: 'eb-ch13-bn-affine',
    type: 'multiple-choice',
    skillId: 'batch_norm',
    dimension: 'concept',
    difficulty: 2,
    prompt:
      'Nhìn theo Đại số tuyến tính, phép chuẩn hóa z-score ẑ = (x − μ)/σ là loại biến đổi nào trên trục số?',
    options: [
      'Một phép quay quanh gốc tọa độ',
      'Một biến đổi affine: co giãn (chia σ) ghép với tịnh tiến (trừ μ/σ)',
      'Một phép chiếu trực giao xuống đường thẳng',
      'Một phép nhân với ma trận nghịch đảo',
    ],
    answerIndex: 1,
    explain:
      'ẑ = (1/σ)·x − μ/σ có dạng ax + b — một phép co giãn (nhân 1/σ) rồi tịnh tiến (trừ μ/σ), đúng định nghĩa biến đổi affine 1 chiều (ch3).',
    hints: [
      { level: 1, text: 'Viết lại ẑ dưới dạng ax + b.' },
      { level: 2, text: 'a = 1/σ (co giãn), b = −μ/σ (tịnh tiến).' },
    ],
  },

  // --- computer_vision ------------------------------------------------------
  {
    id: 'eb-ch13-cv-flip',
    type: 'multiple-choice',
    skillId: 'computer_vision',
    dimension: 'concept',
    difficulty: 2,
    prompt:
      'Phép augmentation "lật ngang" ảnh (gương qua trục dọc, đưa (x, y) → (−x, y)) ứng với ma trận biến đổi nào?',
    options: [
      '[[1, 0], [0, 1]]',
      '[[-1, 0], [0, 1]]',
      '[[1, 0], [0, -1]]',
      '[[0, -1], [1, 0]]',
    ],
    answerIndex: 1,
    explain:
      '[[-1, 0], [0, 1]] đưa (x, y) → (−x, y): đảo dấu hoành độ, giữ nguyên tung độ ⇒ lật ngang. Lưu ý [[1,0],[0,-1]] là lật DỌC, còn [[0,-1],[1,0]] là xoay 90°.',
    hints: [
      { level: 1, text: 'Cột 1 là ảnh của (1,0); cột 2 là ảnh của (0,1).' },
      { level: 2, text: 'Lật ngang cần đảo dấu x mà giữ nguyên y.' },
    ],
  },
  {
    id: 'eb-ch13-cv-tasks-match',
    type: 'matching',
    skillId: 'computer_vision',
    dimension: 'concept',
    difficulty: 2,
    prompt: 'Ghép mỗi bài toán thị giác máy tính với mô tả đúng của nó.',
    left: ['Phân loại (classification)', 'Phát hiện (detection)', 'Phân đoạn (segmentation)'],
    right: [
      'Gán MỘT nhãn cho toàn bộ bức ảnh',
      'Vẽ bounding box quanh từng đối tượng kèm nhãn',
      'Gán nhãn cho TỪNG pixel của ảnh',
    ],
    pairs: [
      [0, 0],
      [1, 1],
      [2, 2],
    ],
    explain:
      'Phân loại: một nhãn cho cả ảnh. Phát hiện: hộp bao (bounding box) + nhãn cho từng đối tượng. Phân đoạn: nhãn ở mức từng pixel.',
    hints: [
      { level: 1, text: 'Mức độ chi tiết tăng dần: cả ảnh → từng đối tượng → từng pixel.' },
      { level: 2, text: '"Bounding box" gắn với phát hiện đối tượng.' },
    ],
  },
  {
    id: 'eb-ch13-cv-transfer',
    type: 'step-ordering',
    skillId: 'computer_vision',
    dimension: 'concept',
    difficulty: 3,
    prompt: 'Sắp xếp đúng thứ tự các bước làm transfer learning cho một bài toán ảnh mới.',
    steps: [
      'Lấy một mạng đã pretrained (ví dụ trên ImageNet)',
      'Thay lớp phân loại cuối cho phù hợp số lớp của bài toán mới',
      'Đóng băng (freeze) các lớp đầu đã học đặc trưng tổng quát',
      'Fine-tune trên tập dữ liệu mới (thường nhỏ hơn)',
    ],
    explain:
      'Tận dụng đặc trưng tổng quát đã học sẵn: lấy mạng pretrained → thay lớp cuối → đóng băng phần đầu → fine-tune trên dữ liệu mới. Nhờ vậy cần ít dữ liệu và thời gian hơn nhiều.',
    hints: [
      { level: 1, text: 'Phải CÓ mạng pretrained trước đã.' },
      { level: 2, text: 'Thay lớp cuối rồi mới nói tới chuyện đóng băng / fine-tune.' },
      { level: 3, text: 'Bước cuối là fine-tune trên dữ liệu của bài toán mới.' },
    ],
  },

  // --- nlp_lm ---------------------------------------------------------------
  {
    id: 'eb-ch13-nlp-lm',
    type: 'multiple-choice',
    skillId: 'nlp_lm',
    dimension: 'concept',
    difficulty: 1,
    prompt: 'Một mô hình ngôn ngữ (language model) về cơ bản dự đoán điều gì?',
    options: [
      'Phân phối xác suất của token (từ) KẾ TIẾP cho một ngữ cảnh',
      'Định thức của một ma trận',
      'Màu sắc của một pixel',
      'Nghiệm của một hệ phương trình tuyến tính',
    ],
    answerIndex: 0,
    explain:
      'LM ước lượng P(w_t | ngữ cảnh) — bản chất là bài phân loại "từ kế tiếp" trên toàn bộ từ vựng, thường chuẩn hóa bằng softmax.',
    hints: [
      { level: 1, text: 'Nghĩ về việc gõ điện thoại gợi ý từ tiếp theo.' },
      { level: 2, text: 'Đầu ra là một phân phối xác suất trên từ vựng.' },
    ],
  },
  {
    id: 'eb-ch13-nlp-softmax',
    type: 'numeric-input',
    skillId: 'nlp_lm',
    dimension: 'compute',
    difficulty: 3,
    prompt:
      'Hai từ ứng viên có logit lần lượt là 2 và 0. Dùng softmax, xác suất của từ có logit 2 xấp xỉ bao nhiêu? (cho e² ≈ 7.39, e⁰ = 1). Nhập số thập phân.',
    answer: 0.88,
    tolerance: 0.02,
    explain: 'p = e² / (e² + e⁰) = 7.39 / (7.39 + 1) = 7.39 / 8.39 ≈ 0.88. Softmax biến logit thành xác suất tổng bằng 1.',
    hints: [
      { level: 1, text: 'Softmax: chia e^(logit) cho tổng của tất cả e^(logit).' },
      { level: 2, text: 'Mẫu số = 7.39 + 1 = 8.39.' },
      { level: 3, text: '7.39 / 8.39 ≈ ?' },
    ],
  },
  {
    id: 'eb-ch13-nlp-embed-tf',
    type: 'true-false',
    skillId: 'nlp_lm',
    dimension: 'concept',
    difficulty: 2,
    prompt: 'Đúng hay Sai?',
    statement:
      'Trong không gian word embedding, các từ gần nghĩa thường được ánh xạ tới những vector nằm gần nhau.',
    answer: true,
    explain:
      'Embedding là vector dày (dense) học được sao cho quan hệ ngữ nghĩa trở thành quan hệ hình học: gần nghĩa ⇒ gần nhau, đo bằng cosine/dot product (ch1).',
    hints: [
      { level: 1, text: 'Embedding biến "nghĩa" thành "vị trí" trong không gian vector.' },
      { level: 2, text: 'Độ gần đo bằng dot product / cosine giữa hai vector.' },
    ],
  },
  {
    id: 'eb-ch13-nlp-bert',
    type: 'multiple-choice',
    skillId: 'nlp_lm',
    dimension: 'concept',
    difficulty: 3,
    prompt: 'Nhiệm vụ pretraining đặc trưng của BERT là gì?',
    options: [
      'Masked language modeling: che ngẫu nhiên vài token rồi đoán lại chúng từ ngữ cảnh hai phía',
      'Sắp xếp các ma trận theo định thức',
      'Phân loại ảnh thành mèo/chó',
      'Tính ma trận nghịch đảo',
    ],
    answerIndex: 0,
    explain:
      'BERT học tự giám sát bằng cách che (mask) một số token và dự đoán lại chúng dựa trên ngữ cảnh CẢ hai phía; sau đó fine-tune cho tác vụ cụ thể — chính là transfer learning của NLP.',
    hints: [
      { level: 1, text: 'BERT nhìn được ngữ cảnh ở cả bên trái lẫn bên phải của từ bị che.' },
      { level: 2, text: '"Masked" nghĩa là che đi rồi bắt mô hình đoán lại.' },
    ],
  },
];
