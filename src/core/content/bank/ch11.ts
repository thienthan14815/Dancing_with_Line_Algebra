// ===========================================================================
// NGÂN HÀNG BÀI TẬP — CHƯƠNG 11: MẠNG NƠ-RON (Neural networks)
//
// Nội dung GỐC: số liệu & câu chữ tự soạn, KHÔNG sao chép/dịch từ sách. Triết lý
// Deep Learning = Đại số tuyến tính áp dụng — nhiều bài bắc cầu về LA (dot product,
// nhân ma trận, hợp biến đổi, gradient/Jacobian). Mọi `skillId` đều tồn tại trong
// ../skills.ts; mọi đáp án đã rà tay (và đối chiếu bằng máy). Trải difficulty 1..4.
//
// Skills phủ: neuron, mlp, forward_prop, backprop, activation_functions
//
// Export: exercises: Exercise[]
// ===========================================================================

import type { Exercise } from '../../exercises/types';

export const exercises: Exercise[] = [
  // --- neuron ----------------------------------------------------------------
  {
    id: 'eb-ch11-neuron-z',
    type: 'numeric-input',
    skillId: 'neuron',
    dimension: 'compute',
    difficulty: 1,
    prompt:
      'Một neuron có trọng số w = (2, 3), bias b = −1 và nhận đầu vào x = (1, 2). Tính z = w·x + b.',
    answer: 7,
    tolerance: 0,
    explain: 'z = w·x + b = (2·1 + 3·2) + (−1) = (2 + 6) − 1 = 7. Phần w·x chính là dot product.',
    hints: [
      { level: 1, text: 'Trước tiên tính dot product w·x = 2·1 + 3·2.' },
      { level: 2, text: 'w·x = 2 + 6 = 8; sau đó cộng bias b = −1.' },
      { level: 3, text: '8 + (−1) = 7.' },
    ],
  },
  {
    id: 'eb-ch11-neuron-boundary',
    type: 'multiple-choice',
    skillId: 'neuron',
    dimension: 'concept',
    difficulty: 2,
    prompt: 'Trong mặt phẳng 2D, tập các điểm x thỏa w·x + b = 0 của một neuron là hình gì?',
    options: [
      'Một đường thẳng (ranh giới quyết định)',
      'Một đường parabol',
      'Một đường tròn tâm gốc',
      'Một điểm duy nhất',
    ],
    answerIndex: 0,
    explain:
      'w·x + b = 0 tức w₁x₁ + w₂x₂ = −b, đúng dạng ax + by = c — một đường thẳng chia mặt phẳng thành hai nửa (miền quyết định).',
    hints: [
      { level: 1, text: 'Viết w·x + b = 0 ra dạng w₁x₁ + w₂x₂ = −b.' },
      { level: 2, text: 'So sánh với dạng phương trình đường thẳng ax + by = c ở Chương 2.' },
    ],
  },
  {
    id: 'eb-ch11-neuron-linear-tf',
    type: 'true-false',
    skillId: 'neuron',
    dimension: 'concept',
    difficulty: 3,
    prompt: 'Đúng hay Sai?',
    statement:
      'Một neuron đơn lẻ chỉ có thể tạo ra một ranh giới quyết định thẳng (một nửa mặt phẳng).',
    answer: true,
    explain:
      'Ranh giới của một neuron là w·x + b = 0 — luôn là một siêu phẳng (đường thẳng trong 2D). Muốn có ranh giới cong/phức tạp phải kết hợp nhiều neuron qua các lớp.',
    hints: [
      { level: 1, text: 'Xét hình dạng của tập nghiệm w·x + b = 0.' },
      { level: 2, text: 'Đó là một phương trình bậc nhất theo các thành phần của x.' },
    ],
  },

  // --- mlp -------------------------------------------------------------------
  {
    id: 'eb-ch11-mlp-xor',
    type: 'multiple-choice',
    skillId: 'mlp',
    dimension: 'concept',
    difficulty: 2,
    prompt: 'Vì sao một perceptron (neuron) đơn lẻ KHÔNG giải được bài toán XOR?',
    options: [
      'Vì XOR có quá nhiều mẫu dữ liệu để học',
      'Vì bốn điểm XOR không tách được bằng một đường thẳng (không tách tuyến tính)',
      'Vì hàm sigmoid không xác định tại điểm 0',
      'Vì XOR cần đầu vào là số thực chứ không phải 0/1',
    ],
    answerIndex: 1,
    explain:
      'XOR không tách tuyến tính: không đường thẳng nào để hai điểm nhãn 1 về một phía và hai điểm nhãn 0 về phía kia. Thêm một lớp ẩn (MLP) mới tạo được vùng phân loại phù hợp.',
    hints: [
      { level: 1, text: 'Thử vẽ 4 điểm (0,0),(1,1) nhãn 0 và (1,0),(0,1) nhãn 1 rồi tìm một đường tách chúng.' },
      { level: 2, text: 'Không đường thẳng nào tách được — đó gọi là "không tách tuyến tính".' },
    ],
  },
  {
    id: 'eb-ch11-mlp-linear-collapse-tf',
    type: 'true-false',
    skillId: 'mlp',
    dimension: 'concept',
    difficulty: 3,
    prompt: 'Đúng hay Sai?',
    statement:
      'Nếu bỏ hết hàm kích hoạt phi tuyến, một MLP gồm nhiều lớp tuyến tính tương đương với đúng một biến đổi tuyến tính duy nhất.',
    answer: true,
    explain:
      'Hợp của các ánh xạ tuyến tính vẫn tuyến tính: W₂(W₁x) = (W₂W₁)x. Do đó chồng bao nhiêu lớp tuyến tính cũng chỉ mạnh bằng một ma trận W_eff. Chính phi tuyến làm cho chiều sâu có ý nghĩa.',
    hints: [
      { level: 1, text: 'Áp W₁ rồi W₂ lên x; nhóm lại các ma trận.' },
      { level: 2, text: 'W₂(W₁x) = (W₂W₁)x — một ma trận duy nhất W_eff = W₂W₁.' },
    ],
  },
  {
    id: 'eb-ch11-mlp-compose-matmul',
    type: 'matrix-input',
    skillId: 'mlp',
    dimension: 'compute',
    difficulty: 4,
    prompt:
      'Hai lớp tuyến tính (không phi tuyến) với W₁ = [[1, 2], [0, 1]] rồi W₂ = [[1, 0], [3, 1]] gộp thành một lớp W_eff = W₂·W₁. Tính ma trận W_eff (2×2).',
    rows: 2,
    cols: 2,
    answer: [
      [1, 2],
      [3, 7],
    ],
    tolerance: 0,
    explain:
      'Áp W₁ trước rồi W₂ nghĩa là W_eff = W₂W₁. (1,1)=1·1+0·0=1; (1,2)=1·2+0·1=2; (2,1)=3·1+1·0=3; (2,2)=3·2+1·1=7. Vậy W_eff = [[1,2],[3,7]] — hai lớp thu về một.',
    hints: [
      { level: 1, text: 'Áp W₁ trước rồi W₂ tương ứng với tích W₂·W₁ (chú ý thứ tự).' },
      { level: 2, text: 'Phần tử (i,j) = (hàng i của W₂)·(cột j của W₁).' },
      { level: 3, text: 'Ô (2,2) = 3·2 + 1·1 = 7.' },
    ],
  },

  // --- forward_prop ----------------------------------------------------------
  {
    id: 'eb-ch11-forward-layer',
    type: 'matrix-input',
    skillId: 'forward_prop',
    dimension: 'compute',
    difficulty: 2,
    prompt:
      'Một lớp có W = [[1, 2], [0, −1]], bias b = (0, 1) nhận đầu vào x = (3, 1). Tính z = Wx + b (dạng cột 2×1).',
    rows: 2,
    cols: 1,
    answer: [[5], [0]],
    tolerance: 0,
    explain:
      'Wx theo hàng: hàng 1 = 1·3 + 2·1 = 5; hàng 2 = 0·3 + (−1)·1 = −1. Cộng bias (0, 1): z = (5, 0).',
    hints: [
      { level: 1, text: 'Mỗi thành phần của Wx là dot product của một HÀNG của W với x.' },
      { level: 2, text: 'Hàng 2: 0·3 + (−1)·1 = −1, sau đó cộng b₂ = 1.' },
      { level: 3, text: '−1 + 1 = 0, nên z₂ = 0.' },
    ],
  },
  {
    id: 'eb-ch11-forward-wdims',
    type: 'numeric-input',
    skillId: 'forward_prop',
    dimension: 'compute',
    difficulty: 2,
    prompt:
      'Một lớp có 5 neuron nhận vector đầu vào 3 chiều. Ma trận trọng số W của lớp đó có bao nhiêu phần tử?',
    answer: 15,
    tolerance: 0,
    explain:
      'Số hàng = số neuron = 5, số cột = số chiều đầu vào = 3, nên W là 5×3 và có 5·3 = 15 phần tử.',
    hints: [
      { level: 1, text: 'Số hàng của W = số neuron; số cột = số chiều đầu vào.' },
      { level: 2, text: 'W có kích thước 5×3.' },
    ],
  },
  {
    id: 'eb-ch11-forward-order',
    type: 'step-ordering',
    skillId: 'forward_prop',
    dimension: 'concept',
    difficulty: 2,
    prompt: 'Sắp xếp đúng thứ tự các bước lan truyền xuôi (forward pass) qua một mạng nhiều lớp.',
    steps: [
      'Nhận vector đầu vào x',
      'Tính z = Wx + b cho lớp hiện tại (nhân ma trận rồi cộng bias)',
      'Áp hàm kích hoạt phi tuyến: a = φ(z)',
      'Dùng a làm đầu vào cho lớp kế tiếp và lặp lại đến lớp cuối',
      'Đọc kết quả ở đầu ra của lớp cuối cùng',
    ],
    explain:
      'Forward đi từ đầu vào tới đầu ra: mỗi lớp làm phép affine Wx+b rồi phi tuyến, đầu ra lớp này là đầu vào lớp sau.',
    hints: [
      { level: 1, text: 'Bắt đầu từ đầu vào, kết thúc ở đầu ra cuối cùng.' },
      { level: 2, text: 'Trong mỗi lớp: nhân ma trận & cộng bias TRƯỚC, áp phi tuyến SAU.' },
    ],
  },

  // --- backprop --------------------------------------------------------------
  {
    id: 'eb-ch11-backprop-chainrule',
    type: 'multiple-choice',
    skillId: 'backprop',
    dimension: 'concept',
    difficulty: 1,
    prompt: 'Lan truyền ngược (backpropagation) về bản chất là việc áp dụng quy tắc nào của giải tích?',
    options: [
      'Quy tắc Cramer',
      'Quy tắc dây chuyền (chain rule)',
      'Quy tắc nhân của định thức',
      'Quy tắc hình bình hành',
    ],
    answerIndex: 1,
    explain:
      'Backprop nhân dồn các đạo hàm dọc theo chuỗi phụ thuộc w → z → a → L, đúng công thức quy tắc dây chuyền, và tính theo thứ tự ngược để tái sử dụng kết quả trung gian.',
    hints: [
      { level: 1, text: 'L phụ thuộc w gián tiếp qua nhiều biến trung gian.' },
      { level: 2, text: 'Đạo hàm của một chuỗi hàm hợp là TÍCH các đạo hàm từng mắt xích.' },
    ],
  },
  {
    id: 'eb-ch11-backprop-dw',
    type: 'numeric-input',
    skillId: 'backprop',
    dimension: 'compute',
    difficulty: 3,
    prompt:
      'Trong một neuron, đã biết ∂L/∂a = −0.5, ∂a/∂z = 0.25 và ∂z/∂w = x = 2. Dùng quy tắc dây chuyền, tính ∂L/∂w.',
    answer: -0.25,
    tolerance: 0.001,
    explain: '∂L/∂w = ∂L/∂a · ∂a/∂z · ∂z/∂w = (−0.5)·(0.25)·(2) = −0.25.',
    hints: [
      { level: 1, text: 'Nhân ba đạo hàm cục bộ lại với nhau theo chuỗi.' },
      { level: 2, text: '(−0.5)·(0.25) = −0.125.' },
      { level: 3, text: '−0.125 · 2 = −0.25.' },
    ],
  },
  {
    id: 'eb-ch11-backprop-order',
    type: 'step-ordering',
    skillId: 'backprop',
    dimension: 'concept',
    difficulty: 3,
    prompt:
      'Sắp xếp đúng thứ tự các bước tính gradient ∂L/∂w cho một neuron a = σ(wx + b), L = (a − t)².',
    steps: [
      'Lan truyền xuôi để tính và lưu lại z, a và mất mát L',
      'Tính đạo hàm ở đầu ra: ∂L/∂a = 2(a − t)',
      'Nhân với đạo hàm sigmoid: ∂L/∂z = ∂L/∂a · a(1 − a)',
      'Truyền tiếp về trọng số: ∂L/∂w = ∂L/∂z · x',
      'Cập nhật trọng số ngược hướng gradient: w ← w − lr·∂L/∂w',
    ],
    explain:
      'Backprop chạy ngược: từ mất mát lùi dần qua a, z rồi tới w; ∂L/∂z được tái dùng cho cả w và b. Cuối cùng gradient descent cập nhật trọng số.',
    hints: [
      { level: 1, text: 'Phải có giá trị forward (z, a, L) trước khi tính gradient.' },
      { level: 2, text: 'Đi ngược: ∂L/∂a → ∂L/∂z → ∂L/∂w, rồi mới cập nhật.' },
    ],
  },

  // --- activation_functions --------------------------------------------------
  {
    id: 'eb-ch11-act-relu',
    type: 'numeric-input',
    skillId: 'activation_functions',
    dimension: 'compute',
    difficulty: 1,
    prompt: 'Tính ReLU(−4).',
    answer: 0,
    tolerance: 0,
    explain: 'ReLU(x) = max(0, x). Vì −4 < 0 nên ReLU(−4) = max(0, −4) = 0.',
    hints: [
      { level: 1, text: 'ReLU giữ phần dương, cắt phần âm về 0.' },
      { level: 2, text: 'max(0, −4) = 0.' },
    ],
  },
  {
    id: 'eb-ch11-act-sigmoid-deriv',
    type: 'multiple-choice',
    skillId: 'activation_functions',
    dimension: 'concept',
    difficulty: 2,
    prompt: 'Đạo hàm của sigmoid, viết gọn theo chính đầu ra a = σ(z), bằng biểu thức nào?',
    options: ['a²', 'a(1 − a)', '1 − a', '1/a'],
    answerIndex: 1,
    explain:
      "σ'(z) = σ(z)(1 − σ(z)) = a(1 − a). Nhờ vậy backprop chỉ cần lưu a từ forward là tính được đạo hàm ngay, không phải tính lại từ z.",
    hints: [
      { level: 1, text: 'Đạo hàm sigmoid viết được hoàn toàn theo giá trị đầu ra của nó.' },
      { level: 2, text: 'Kết quả có dạng tích của a với (1 − a).' },
    ],
  },
];
