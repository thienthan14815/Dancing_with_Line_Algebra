// ===========================================================================
// GIÁO ÁN (Content Module) — sinh từ video YouTube qua pipeline vd/yt2lesson.py
// Nguồn: 《漫士科普》"90 phút deep-dive: hiểu rõ Trí tuệ nhân tạo & Mạng nơ-ron"
//   (LF9sd-2jCoY). Nội dung tiếng Việt GỐC (tóm tắt/chuyển thể giáo dục, KHÔNG
//   sao chép transcript), bám đúng mạch bài giảng + cầu nối Đại số tuyến tính.
// ===========================================================================

import type { ContentModule } from '../../types';

const module: ContentModule = {
  id: 'ai-neural-networks',
  num: 14,
  track: 'deep-learning',
  trackTitle: 'Deep Learning',
  title: 'AI & Mạng nơ-ron — Tổng quan',
  en: 'AI & Neural Networks — Overview',
  subtitle: 'Từ perceptron đến deep learning: trí tuệ chính là đi tìm một hàm số',
  enabled: true,
  prerequisites: ['ch1-vectors'],

  skills: [
    { id: 'ai_as_function', name: 'Trí tuệ = một hàm số' },
    { id: 'perceptron', name: 'Perceptron (neuron nhân tạo)' },
    { id: 'xor_mlp', name: 'Giới hạn tuyến tính, XOR & MLP' },
    { id: 'training_gd', name: 'Loss, Gradient Descent & Backprop' },
    { id: 'dl_generalization', name: 'Khái quát hóa & giới hạn của DL' },
  ],

  lessons: [
    { id: 'intelligence-function', title: 'Trí tuệ = đi tìm một hàm số', kind: 'concept', skillIds: ['ai_as_function'] },
    { id: 'perceptron', title: 'Perceptron = neuron nhân tạo', kind: 'concept', skillIds: ['perceptron'] },
    { id: 'perceptron-practice', title: 'Luyện tập: Perceptron', kind: 'practice', skillIds: ['perceptron'] },
    { id: 'xor-mlp', title: 'Giới hạn XOR & Mạng nhiều lớp (MLP)', kind: 'concept', skillIds: ['xor_mlp'] },
    { id: 'training', title: 'Huấn luyện: Loss, Gradient Descent, Backprop', kind: 'concept', skillIds: ['training_gd'] },
    { id: 'training-practice', title: 'Luyện tập: Huấn luyện mạng', kind: 'practice', skillIds: ['training_gd'] },
    { id: 'generalization', title: 'Khái quát hóa & Giới hạn của Deep Learning', kind: 'concept', skillIds: ['dl_generalization'] },
  ],

  exercises: [
    // --- ai_as_function ----------------------------------------------------
    {
      id: 'ai-fn-1', type: 'multiple-choice', skillId: 'ai_as_function',
      dimension: 'concept', difficulty: 1,
      prompt: 'Theo bài giảng, bản chất của "trí tuệ" (intelligence) là gì?',
      options: [
        'Thu thập thông tin và phản ứng phù hợp với từng tình huống',
        'Ghi nhớ thật nhiều dữ liệu',
        'Tính toán số học thật nhanh',
        'Có ý thức như con người',
      ],
      answerIndex: 0,
      explain: 'Trí tuệ = nhìn tình huống mà hành động phù hợp. Vì thế AI được xem là một "hộp đen" ánh xạ thông tin đầu vào → hành vi/dự đoán đầu ra, tức MỘT HÀM SỐ.',
      hints: [
        { level: 1, text: 'Nghĩ tới con chó nghe lệnh: nhận tín hiệu → phản ứng.' },
        { level: 2, text: '"Đầu vào tình huống" → "đầu ra hành vi" chính là quan hệ hàm số.' },
      ],
    },
    {
      id: 'ai-fn-2', type: 'true-false', skillId: 'ai_as_function',
      dimension: 'concept', difficulty: 2,
      prompt: 'Đúng hay Sai?',
      statement: 'Về bản chất, AI là một hàm số ánh xạ từ thông tin đầu vào tới hành vi/dự đoán đầu ra.',
      answer: true,
      explain: 'Đúng. Nhận diện khuôn mặt, AlphaGo, GPT… đều là "hộp đen" input → output. "Everything is described by functions."',
      hints: [{ level: 1, text: 'Hàm số = mỗi đầu vào cho một đầu ra xác định.' }],
    },

    // --- perceptron --------------------------------------------------------
    {
      id: 'perc-1', type: 'numeric-input', skillId: 'perceptron',
      dimension: 'compute', difficulty: 2,
      prompt: 'Một perceptron nhận đầu vào $x=(1,\\,1,\\,0)$ với trọng số $w=(2,\\,-1,\\,3)$. Tính tổng có trọng số $z=w\\cdot x$.',
      answer: 1, tolerance: 0,
      explain: 'z = 2·1 + (−1)·1 + 3·0 = 2 − 1 + 0 = 1. Đây chính là DOT PRODUCT (Chương 1) giữa vector trọng số và vector đầu vào.',
      hints: [
        { level: 1, text: 'Nhân từng cặp thành phần rồi cộng lại.' },
        { level: 2, text: '2·1 + (−1)·1 + 3·0.' },
      ],
    },
    {
      id: 'perc-2', type: 'multiple-choice', skillId: 'perceptron',
      dimension: 'concept', difficulty: 2,
      prompt: 'Trong "máy nhận diện quả táo", một đặc trưng làm TĂNG khả năng "là táo" thì hệ số trọng số w của nó nên là:',
      options: ['Số dương', 'Số âm', 'Bằng 0', 'Không ảnh hưởng'],
      answerIndex: 0,
      explain: 'Đặc trưng ủng hộ "là táo" (đỏ, ngọt, nhỏ…) nhân với hệ số DƯƠNG để cộng điểm; đặc trưng phản đối (to, chua) nhân hệ số âm.',
      hints: [{ level: 1, text: 'Hệ số dương làm điểm số tăng, hệ số âm làm điểm số giảm.' }],
    },
    {
      id: 'perc-3', type: 'multiple-choice', skillId: 'perceptron',
      dimension: 'visual', difficulty: 2,
      prompt: 'Ranh giới quyết định của một perceptron 2 đầu vào, $w_1x + w_2y - b = 0$, là hình gì trên mặt phẳng?',
      options: ['Một đường thẳng', 'Một đường tròn', 'Một parabol', 'Một điểm'],
      answerIndex: 0,
      explain: 'Đó là phương trình đường thẳng $ax+by=c$ (Chương 2). Perceptron chia mặt phẳng làm hai nửa bằng MỘT đường thẳng.',
      hints: [{ level: 1, text: '$w_1x + w_2y = b$ có dạng $ax+by=c$.' }],
    },
    {
      id: 'perc-4', type: 'true-false', skillId: 'perceptron',
      dimension: 'concept', difficulty: 1,
      prompt: 'Đúng hay Sai?',
      statement: 'Perceptron "kích hoạt" (bật) khi tổng có trọng số vượt ngưỡng: $w\\cdot x \\ge b$.',
      answer: true,
      explain: 'Đúng. Neuron cộng dồn mọi kích thích; nếu tổng đủ lớn (vượt ngưỡng b) thì kích hoạt và truyền tín hiệu tiếp.',
      hints: [{ level: 1, text: 'Nhớ ví dụ neuron sinh học: đủ kích thích thì "phóng điện".' }],
    },

    // --- xor_mlp -----------------------------------------------------------
    {
      id: 'xor-1', type: 'true-false', skillId: 'xor_mlp',
      dimension: 'concept', difficulty: 2,
      prompt: 'Đúng hay Sai?',
      statement: 'Một perceptron đơn (một lớp) có thể học được hàm XOR.',
      answer: false,
      explain: 'Sai. XOR không tách được tuyến tính — không đường thẳng nào chia đúng hai nhóm điểm. Đây là phản ví dụ nổi tiếng của Minsky (1969) khiến neural network rơi vào "mùa đông".',
      hints: [
        { level: 1, text: 'Thử vẽ 4 điểm (0,0),(0,1),(1,0),(1,1) với nhãn XOR.' },
        { level: 2, text: 'Có kẻ được một đường thẳng tách hai nhóm không?' },
      ],
    },
    {
      id: 'xor-2', type: 'multiple-choice', skillId: 'xor_mlp',
      dimension: 'concept', difficulty: 3,
      prompt: 'Vì sao một perceptron KHÔNG giải được XOR?',
      options: [
        'Vì XOR không tách được bằng MỘT đường thẳng (không tách tuyến tính)',
        'Vì thiếu dữ liệu huấn luyện',
        'Vì ngưỡng b bị đặt sai',
        'Vì XOR không phải là một hàm',
      ],
      answerIndex: 0,
      explain: 'Perceptron chỉ tạo được ranh giới là một đường thẳng; XOR cần ranh giới phi tuyến nên một lớp là không đủ.',
      hints: [{ level: 1, text: 'Ranh giới của perceptron luôn là một đường thẳng.' }],
    },
    {
      id: 'xor-3', type: 'true-false', skillId: 'xor_mlp',
      dimension: 'concept', difficulty: 2,
      prompt: 'Đúng hay Sai?',
      statement: 'Xếp chồng các perceptron thành nhiều lớp (Multilayer Perceptron) có thể giải được XOR.',
      answer: true,
      explain: 'Đúng. Thêm lớp ẩn tạo ranh giới phi tuyến. Định lý xấp xỉ phổ quát: MLP đủ rộng & sâu có thể xấp xỉ hầu như mọi hàm.',
      hints: [{ level: 1, text: 'Lớp ẩn cho phép "gấp" không gian để tách được XOR.' }],
    },
    {
      id: 'xor-4', type: 'multiple-choice', skillId: 'xor_mlp',
      dimension: 'concept', difficulty: 2,
      prompt: 'Trong mạng nhận diện chữ số, các nơ-ron ở lớp SÂU hơn thường học điều gì?',
      options: [
        'Đặc trưng phức tạp hơn, ghép từ nét/cạnh mà lớp trước phát hiện',
        'Chỉ các pixel thô ban đầu',
        'Ít thông tin hơn lớp đầu',
        'Không học gì cả',
      ],
      answerIndex: 0,
      explain: 'Mạng ghép dần: nét/cạnh → hình cơ bản → khái niệm (chữ số). Mỗi lớp là một phép biến đổi; chồng lớp = HỢP biến đổi (Chương 3).',
      hints: [{ level: 1, text: 'Lớp đầu bắt cạnh; lớp sau ghép cạnh thành hình.' }],
    },

    // --- training_gd -------------------------------------------------------
    {
      id: 'train-1', type: 'numeric-input', skillId: 'training_gd',
      dimension: 'compute', difficulty: 2,
      prompt: 'Mô hình dự đoán $\\hat y=(2,\\,4)$, giá trị thật $y=(3,\\,4)$. Tính $\\text{MSE}=\\frac{1}{n}\\sum_i(\\hat y_i-y_i)^2$.',
      answer: 0.5, tolerance: 0.001,
      explain: 'MSE = ((2−3)² + (4−4)²)/2 = (1 + 0)/2 = 0.5. Loss đo độ lệch giữa dự đoán và thực tế; càng nhỏ càng khớp.',
      hints: [
        { level: 1, text: 'Lấy hiệu từng cặp, bình phương, rồi lấy trung bình.' },
        { level: 2, text: '(1)² và (0)² rồi chia 2.' },
      ],
    },
    {
      id: 'train-2', type: 'multiple-choice', skillId: 'training_gd',
      dimension: 'concept', difficulty: 2,
      prompt: 'Gradient descent cập nhật tham số theo hướng nào để GIẢM loss?',
      options: ['Ngược hướng gradient', 'Cùng hướng gradient', 'Hướng ngẫu nhiên', 'Không đổi'],
      answerIndex: 0,
      explain: 'Gradient chỉ hướng TĂNG nhanh nhất của loss. Muốn giảm loss thì đi NGƯỢC gradient: $\\theta \\leftarrow \\theta - \\eta\\,\\nabla L$ (Chương 9–10).',
      hints: [{ level: 1, text: 'Muốn xuống dốc thì đi ngược hướng lên dốc.' }],
    },
    {
      id: 'train-3', type: 'numeric-input', skillId: 'training_gd',
      dimension: 'compute', difficulty: 2,
      prompt: 'Cho $L=g(f(x))$ với $f\'(x)=2$ và $g\'(f(x))=3$. Theo quy tắc dây chuyền (chain rule), $\\dfrac{dL}{dx}=?$',
      answer: 6, tolerance: 0,
      explain: 'Chain rule: dL/dx = g′(f(x))·f′(x) = 3·2 = 6. Đây là "linh hồn" của backpropagation — nhân các đạo hàm dọc chuỗi.',
      hints: [
        { level: 1, text: 'Nhân đạo hàm ngoài với đạo hàm trong.' },
        { level: 2, text: '3 · 2.' },
      ],
    },
    {
      id: 'train-4', type: 'true-false', skillId: 'training_gd',
      dimension: 'concept', difficulty: 2,
      prompt: 'Đúng hay Sai?',
      statement: 'Backpropagation dùng quy tắc dây chuyền để lan gradient từ lớp cuối về lớp đầu.',
      answer: true,
      explain: 'Đúng. Mạng là hợp của nhiều phép toán đơn giản; backprop nhân dồn đạo hàm ngược từ loss về từng tham số (Chương 3/11).',
      hints: [{ level: 1, text: 'Đạo hàm được truyền "từ sau ra trước".' }],
    },
    {
      id: 'train-5', type: 'step-ordering', skillId: 'training_gd',
      dimension: 'compute', difficulty: 3,
      prompt: 'Sắp xếp đúng thứ tự một vòng huấn luyện mạng nơ-ron.',
      steps: [
        'Đưa dữ liệu vào mạng, tính dự đoán (lan truyền xuôi)',
        'Tính loss = độ lệch giữa dự đoán và nhãn thật',
        'Lan truyền ngược (backprop) để tính gradient của loss theo từng tham số',
        'Cập nhật tham số theo hướng ngược gradient (gradient descent)',
        'Lặp lại đến khi loss đủ nhỏ',
      ],
      explain: 'Xuôi → tính loss → backprop lấy gradient → gradient descent cập nhật → lặp lại.',
      hints: [{ level: 1, text: 'Phải có dự đoán rồi mới tính được loss.' }],
    },

    // --- dl_generalization -------------------------------------------------
    {
      id: 'gen-1', type: 'multiple-choice', skillId: 'dl_generalization',
      dimension: 'concept', difficulty: 2,
      prompt: 'Khả năng "khái quát hóa" (generalization) của mạng nghĩa là gì?',
      options: [
        'Làm tốt trên dữ liệu CHƯA từng thấy khi huấn luyện',
        'Học thuộc lòng dữ liệu huấn luyện',
        'Chạy nhanh hơn',
        'Dùng ít tham số hơn',
      ],
      answerIndex: 0,
      explain: 'Giống học sinh làm được đề MỚI chứ không chỉ đề đã ôn: mạng nắm "xu hướng" ẩn trong dữ liệu và suy ra cho đầu vào mới.',
      hints: [{ level: 1, text: 'Thi tốt trên câu chưa từng gặp mới là hiểu bài.' }],
    },
    {
      id: 'gen-2', type: 'true-false', skillId: 'dl_generalization',
      dimension: 'concept', difficulty: 3,
      prompt: 'Đúng hay Sai?',
      statement: 'Adversarial example: thêm một lượng nhiễu rất nhỏ (mắt người gần như không thấy khác) có thể khiến mạng phân loại sai hoàn toàn.',
      answer: true,
      explain: 'Đúng. Video nêu ví dụ ảnh gấu trúc bị thêm nhiễu tinh vi → mạng nhận nhầm thành "rùa" với độ tự tin 99%.',
      hints: [{ level: 1, text: 'Nhiễu được thiết kế riêng để đánh lừa mạng.' }],
    },
    {
      id: 'gen-3', type: 'multiple-choice', skillId: 'dl_generalization',
      dimension: 'concept', difficulty: 2,
      prompt: 'Ví dụ "chó Shiba vs bánh mì" minh họa hạn chế nào của deep learning?',
      options: [
        'Nhầm TƯƠNG QUAN với NHÂN QUẢ (chỉ học đặc trưng bề mặt)',
        'Thiếu GPU để tính',
        'Loss luôn quá cao',
        'Thiếu số lớp',
      ],
      answerIndex: 0,
      explain: 'Mạng học "vàng + thuôn dài ⇒ bánh mì" (tương quan bề mặt) nên gặp chó Shiba hợp đặc trưng đó là nhận nhầm — nó không hiểu nhân quả.',
      hints: [{ level: 1, text: 'Mạng chỉ thấy đặc trưng chung, không hiểu "vì sao".' }],
    },
  ],

  guide: {
    concepts: [
      'AI = một "hộp đen" ánh xạ thông tin đầu vào → hành vi/dự đoán đầu ra, tức một HÀM SỐ.',
      'Perceptron (neuron nhân tạo): tính tổng có trọng số z = w·x rồi so với ngưỡng b để kích hoạt.',
      'MLP (Multilayer Perceptron): xếp chồng nhiều lớp neuron ⇒ giải được XOR và xấp xỉ hầu như mọi hàm.',
      'Huấn luyện = giảm loss bằng gradient descent; gradient được tính bằng backpropagation (chain rule).',
      'Nối với LA: w·x là DOT PRODUCT (Ch1); ranh giới w·x−b=0 là ĐƯỜNG THẲNG (Ch2); chồng lớp = HỢP biến đổi affine (Ch3); huấn luyện = đi ngược GRADIENT trên mặt loss (Ch9–10); backprop = chuỗi đạo hàm/Jacobian.',
      'Deep learning KHÔNG vạn năng: nhầm tương quan/nhân quả, dễ bị adversarial example, là hộp đen khó diễn giải.',
    ],
    symbols: [
      { tex: 'w\\cdot x', desc: 'tổng có trọng số các đầu vào của một neuron' },
      { tex: 'b', desc: 'ngưỡng kích hoạt (bias)' },
      { tex: '\\nabla L', desc: 'gradient của hàm mất mát' },
      { tex: '\\eta', desc: 'tốc độ học (learning rate)' },
    ],
    formulas: [
      { tex: 'z = w\\cdot x - b', desc: 'tổng có trọng số trừ ngưỡng của perceptron' },
      { tex: '\\text{MSE}=\\frac{1}{n}\\sum_i(\\hat y_i-y_i)^2', desc: 'hàm mất mát bình phương trung bình' },
      { tex: '\\theta \\leftarrow \\theta - \\eta\\,\\nabla L', desc: 'cập nhật gradient descent' },
      { tex: '\\frac{dL}{dx}=g\'(f(x))\\,f\'(x)', desc: 'chain rule — nền của backpropagation' },
    ],
    intuition:
      'Một neuron "chấm điểm có trọng số" các đặc trưng rồi bật đèn nếu điểm vượt ngưỡng — như máy nhận diện quả táo. Xếp chồng nhiều lớp thì mạng ghép các đặc trưng đơn giản (nét, cạnh) thành khái niệm phức tạp (chữ số, khuôn mặt). Huấn luyện giống chỉnh vòi nước tắm: dò xem xoay núm nào làm loss giảm rồi bước một chút theo hướng đó.',
    example: {
      text: 'Perceptron nhận diện táo: đặc trưng nhỏ(+), đỏ(+), ngọt(+), to(−), chua(−). Cộng có trọng số; nếu vượt ngưỡng b thì kết luận "là táo".',
      tex: 'z = w\\cdot x - b,\\quad \\text{kích hoạt nếu } z \\ge 0',
    },
    pitfalls: [
      'Một perceptron đơn KHÔNG học được XOR (không tách tuyến tính) — cần thêm lớp ẩn.',
      'Gradient descent đi NGƯỢC hướng gradient, không phải cùng hướng.',
      'Mạng dễ nhầm TƯƠNG QUAN với NHÂN QUẢ (chó Shiba vs bánh mì).',
      'Deep learning cần nhiều dữ liệu, là hộp đen khó diễn giải và dễ bị adversarial example.',
    ],
    applications: [
      'Thị giác máy tính: nhận diện ảnh, chữ số, khuôn mặt.',
      'Mô hình ngôn ngữ lớn (GPT) dựa trên Transformer/attention.',
      'AlphaGo, dự đoán cấu trúc protein (AlphaFold), sinh ảnh (Midjourney).',
      'Học tiếp nhánh Deep Learning của app: Chương 10–13 (hồi quy, MLP, CNN/attention, tối ưu).',
    ],
  },
};

export default module;
