// ===========================================================================
// NGÂN HÀNG BÀI TẬP — Unit "Tensor cơ bản" (nguồn: video bài giảng
// "一口气看懂深度学习的核心", https://youtu.be/Yhp1nK_7lSQ, xử lý bởi skill
// video-to-giao-an ngày 2026-07-21).
//
// Nội dung GỐC: số liệu & câu chữ tự soạn lại từ video, KHÔNG sao chép nguyên
// văn. Mọi `skillId` (tensor_basics, tensor_memory, tensor_ops) đều tồn tại
// trong ../skills.ts; mọi đáp án đã được rà TAY.
//
// Export: exercises: Exercise[]
// ===========================================================================

import type { Exercise } from '../../exercises/types';

export const exercises: Exercise[] = [
  // --- tensor_basics --------------------------------------------------------
  {
    id: 'vt-0d-scalar',
    type: 'multiple-choice',
    skillId: 'tensor_basics',
    dimension: 'concept',
    difficulty: 1,
    prompt: 'Một số đơn lẻ (ví dụ: 7) trong Deep Learning được gọi là tensor mấy chiều?',
    options: ['0 chiều', '1 chiều', '2 chiều', 'Không phải tensor'],
    answerIndex: 0,
    explain: 'Một số vô hướng là tensor 0 chiều — "một điểm", shape rỗng []. Xếp nhiều số thành hàng mới thành tensor 1 chiều.',
    hints: [
      { level: 1, text: 'Hãy nghĩ: một viên sô-cô-la đơn lẻ có "hàng" hay "cột" gì không?' },
      { level: 2, text: 'Số chiều = số lớp ngoặc vuông khi viết ra. Số 7 viết trần, không có ngoặc.' },
      { level: 3, text: 'Không có chiều nào để duyệt → tensor 0 chiều (scalar).' },
    ],
  },
  {
    id: 'vt-2d-matrix',
    type: 'multiple-choice',
    skillId: 'tensor_basics',
    dimension: 'concept',
    difficulty: 1,
    prompt: 'Tensor có shape [3, 3] còn có tên gọi quen thuộc là gì?',
    options: ['Mảng (array)', 'Ma trận (matrix)', 'Chuỗi (string)', 'Danh sách liên kết'],
    answerIndex: 1,
    explain: 'Tensor 2 chiều chính là ma trận: có hàng và cột. Shape [3, 3] nghĩa là 3 hàng × 3 cột.',
    hints: [
      { level: 1, text: 'Shape có 2 con số → tensor 2 chiều.' },
      { level: 2, text: 'Cấu trúc có hàng và cột trong đại số tuyến tính gọi là gì?' },
      { level: 3, text: 'Đó chính là ma trận — khái niệm trung tâm của khóa học này.' },
    ],
  },
  {
    id: 'vt-count-elements',
    type: 'numeric-input',
    skillId: 'tensor_basics',
    dimension: 'compute',
    difficulty: 2,
    prompt: 'Tensor có shape [2, 3, 3] chứa tổng cộng bao nhiêu phần tử?',
    answer: 18,
    tolerance: 0,
    explain: 'Tổng phần tử = tích các chiều: 2 × 3 × 3 = 18.',
    hints: [
      { level: 1, text: 'Tưởng tượng 2 "vỉ", mỗi vỉ có 3 hàng × 3 viên sô-cô-la.' },
      { level: 2, text: 'Nhân tất cả các con số trong shape với nhau.' },
      { level: 3, text: '2 × 3 × 3 = ?' },
    ],
  },
  {
    id: 'vt-image-tensor',
    type: 'numeric-input',
    skillId: 'tensor_basics',
    dimension: 'compute',
    difficulty: 2,
    prompt: 'Một ảnh RGB có 3 kênh màu, mỗi kênh là lưới 4 × 5 điểm ảnh. Tensor chứa ảnh này (shape [3, 4, 5]) có bao nhiêu phần tử?',
    answer: 60,
    tolerance: 0,
    explain: '3 × 4 × 5 = 60. Đây chính là cách ảnh được biểu diễn trong Deep Learning: [kênh màu, cao, rộng].',
    hints: [
      { level: 1, text: 'Ảnh màu = 3 lớp (Đỏ, Lục, Lam) chồng lên nhau.' },
      { level: 2, text: 'Mỗi lớp có 4 × 5 = 20 điểm ảnh.' },
      { level: 3, text: '3 lớp × 20 điểm = ?' },
    ],
  },
  {
    id: 'vt-index-from-zero',
    type: 'true-false',
    skillId: 'tensor_basics',
    dimension: 'concept',
    difficulty: 1,
    prompt: 'Xét câu sau về cách đánh chỉ số phần tử của tensor.',
    statement: 'Trong tensor, chỉ số (index) của phần tử được đếm bắt đầu từ 1, giống cách đếm thông thường.',
    answer: false,
    explain: 'Chỉ số tensor đếm từ 0: phần tử ở hàng thứ hai, cột thứ ba có chỉ số [1][2]. Đây là điểm khác với thói quen đếm hằng ngày.',
    hints: [
      { level: 1, text: 'Nhớ lại video: tìm số 5 ở "hàng thứ hai, cột thứ ba" thì chỉ số là gì?' },
      { level: 2, text: 'Chỉ số trong lập trình (Python, PyTorch) bắt đầu từ đâu?' },
      { level: 3, text: 'Từ 0 — nên hàng thứ hai có chỉ số 1.' },
    ],
  },

  // --- tensor_memory --------------------------------------------------------
  {
    id: 'vt-stride-position',
    type: 'numeric-input',
    skillId: 'tensor_memory',
    dimension: 'compute',
    difficulty: 3,
    prompt:
      'Kệ hàng siêu thị có 3 dãy, mỗi dãy 4 ô, lưu trong bộ nhớ thành dãy 12 ô liên tiếp với stride (4, 1). ' +
      'Món hàng ở dãy 2, ô 3 (chỉ số đếm từ 0) nằm ở vị trí thứ mấy trong bộ nhớ?',
    answer: 11,
    tolerance: 0,
    explain: 'Vị trí = 2 × 4 + 3 × 1 = 11. Stride cho biết "bước nhảy": sang dãy kế tiếp nhảy 4 ô, sang ô kế trong cùng dãy nhảy 1 ô.',
    hints: [
      { level: 1, text: 'Dùng công thức: vị trí = chỉ số dãy × stride dãy + chỉ số ô × stride ô.' },
      { level: 2, text: 'Stride (4, 1): mỗi dãy chiếm 4 ô liên tiếp trong bộ nhớ.' },
      { level: 3, text: '2 × 4 + 3 × 1 = ?' },
    ],
  },
  {
    id: 'vt-stride-order',
    type: 'step-ordering',
    skillId: 'tensor_memory',
    dimension: 'explain',
    difficulty: 2,
    prompt: 'Sắp xếp các bước tính vị trí trong bộ nhớ của phần tử [1][2] thuộc ma trận 3 × 4 (lưu theo hàng).',
    steps: [
      'Xác định stride của ma trận 3 × 4: (4, 1)',
      'Nhân chỉ số hàng với stride hàng: 1 × 4 = 4',
      'Nhân chỉ số cột với stride cột: 2 × 1 = 2',
      'Cộng hai kết quả: 4 + 2 = 6 → phần tử ở ô thứ 6 trong bộ nhớ',
    ],
    explain: 'Tensor nhiều chiều thực chất nằm thành một dãy 1 chiều trong bộ nhớ; stride là "lộ trình" quy đổi chỉ số nhiều chiều về vị trí 1 chiều.',
    hints: [
      { level: 1, text: 'Luôn bắt đầu bằng việc xác định stride.' },
      { level: 2, text: 'Tính đóng góp của từng chiều (hàng trước, cột sau) rồi mới cộng.' },
      { level: 3, text: 'Thứ tự: stride → hàng × stride → cột × stride → cộng.' },
    ],
  },
  {
    id: 'vt-permute-memory',
    type: 'true-false',
    skillId: 'tensor_memory',
    dimension: 'concept',
    difficulty: 2,
    prompt: 'Xét câu sau về phép permute (hoán vị chiều).',
    statement: 'Sau phép permute, các phần tử của tensor bị di chuyển sang vị trí mới trong bộ nhớ.',
    answer: false,
    explain:
      'Permute KHÔNG di chuyển dữ liệu — bộ nhớ giữ nguyên, chỉ stride (cách đọc) thay đổi. ' +
      'Như đổi tiêu chí tìm sách trên kệ: sách vẫn nằm nguyên chỗ cũ, chỉ thứ tự tìm thay đổi.',
    hints: [
      { level: 1, text: 'Nhớ ví dụ kệ sách trong video: sách có bị bê đi chỗ khác không?' },
      { level: 2, text: 'Permute đổi shape (3,4)→(4,3) thì stride đổi (4,1)→(1,4) — còn dữ liệu?' },
      { level: 3, text: 'Dữ liệu đứng yên; chỉ "lộ trình đọc" (stride) đổi. Nhờ vậy permute rất nhanh.' },
    ],
  },

  // --- tensor_ops -----------------------------------------------------------
  {
    id: 'vt-reshape-invalid',
    type: 'multiple-choice',
    skillId: 'tensor_ops',
    dimension: 'concept',
    difficulty: 2,
    prompt: 'Tensor có 9 phần tử KHÔNG thể reshape thành hình dạng nào sau đây?',
    options: ['[1, 9]', '[9, 1]', '[3, 3]', '[2, 4]'],
    answerIndex: 3,
    explain: 'Quy tắc reshape: tổng phần tử không đổi. [2, 4] cần 8 phần tử ≠ 9 nên không hợp lệ; ba phương án còn lại đều đúng 9.',
    hints: [
      { level: 1, text: '9 viên gạch LEGO xếp lại được thành hình nào?' },
      { level: 2, text: 'Nhân các số trong mỗi shape rồi so với 9.' },
      { level: 3, text: '2 × 4 = 8 — thiếu mất một viên!' },
    ],
  },
  {
    id: 'vt-reshape-error-detect',
    type: 'error-detection',
    skillId: 'tensor_ops',
    dimension: 'explain',
    difficulty: 3,
    prompt: 'Lời giải sau kiểm tra xem tensor A shape [3, 3] có reshape được thành [2, 4] không. Tìm dòng SAI.',
    lines: [
      'Tensor A có shape [3, 3], gồm 3 × 3 = 9 phần tử.',
      'Shape đích [2, 4] cần 2 × 4 = 8 phần tử.',
      'Vì 8 ≠ 9 nên phép reshape này vẫn hợp lệ.',
      'Kết luận: A.reshape(2, 4) chạy bình thường.',
    ],
    wrongLineIndex: 2,
    explain: 'Reshape chỉ hợp lệ khi tổng phần tử KHÔNG đổi. 8 ≠ 9 nghĩa là KHÔNG hợp lệ — dòng 3 kết luận ngược quy tắc (kéo theo dòng 4 cũng sai).',
    hints: [
      { level: 1, text: 'Nhắc lại quy tắc vàng của reshape trước đã.' },
      { level: 2, text: 'Hai dòng đầu tính toán đúng. Vấn đề nằm ở suy luận.' },
      { level: 3, text: '"8 ≠ 9 nên hợp lệ" — đúng hay ngược?' },
    ],
  },
  {
    id: 'vt-permute-stride',
    type: 'multiple-choice',
    skillId: 'tensor_ops',
    dimension: 'compute',
    difficulty: 3,
    prompt: 'Ma trận shape (3, 4) có stride (4, 1). Sau phép permute hoán đổi hai chiều, stride mới là gì?',
    options: ['(4, 1)', '(1, 4)', '(3, 1)', '(1, 3)'],
    answerIndex: 1,
    explain: 'Permute đổi thứ tự các chiều nên stride cũng hoán đổi theo: (4, 1) → (1, 4). Dữ liệu trong bộ nhớ không di chuyển.',
    hints: [
      { level: 1, text: 'Shape đổi (3,4) → (4,3). Stride đi theo chiều tương ứng.' },
      { level: 2, text: 'Chiều nào đứng trước thì mang stride của chính nó theo.' },
      { level: 3, text: 'Hoán đổi vị trí hai số trong stride cũ.' },
    ],
  },
  {
    id: 'vt-concepts-matching',
    type: 'matching',
    skillId: 'tensor_ops',
    dimension: 'concept',
    difficulty: 2,
    prompt: 'Ghép mỗi khái niệm với mô tả đúng của nó.',
    left: ['Shape', 'Stride', 'Reshape', 'Permute'],
    right: [
      'Kích thước của từng chiều, ví dụ (2, 3, 3)',
      'Số ô phải "nhảy" trong bộ nhớ khi sang phần tử kế của mỗi chiều',
      'Đổi hình dạng tensor, tổng phần tử phải giữ nguyên',
      'Đổi thứ tự các chiều; dữ liệu đứng yên, chỉ stride đổi',
    ],
    pairs: [
      [0, 0],
      [1, 1],
      [2, 2],
      [3, 3],
    ],
    explain: 'Bốn khái niệm nền tảng khi thao tác tensor trong PyTorch: shape mô tả, stride định vị trong bộ nhớ, reshape/permute biến đổi cách nhìn dữ liệu.',
    hints: [
      { level: 1, text: 'Shape trả lời "to bao nhiêu", stride trả lời "tìm ở đâu trong bộ nhớ".' },
      { level: 2, text: 'Hai phép biến đổi: một phép đổi HÌNH DẠNG, một phép đổi THỨ TỰ CHIỀU.' },
      { level: 3, text: 'Reshape giữ tổng phần tử; permute giữ nguyên dữ liệu trong bộ nhớ.' },
    ],
  },
  {
    id: 'vt-torch-zeros',
    type: 'multiple-choice',
    skillId: 'tensor_ops',
    dimension: 'concept',
    difficulty: 1,
    prompt: 'Trong PyTorch, lệnh nào tạo một tensor toàn số 0?',
    options: ['torch.tensor', 'torch.zeros', 'torch.rand', 'torch.cat'],
    answerIndex: 1,
    explain:
      'torch.zeros tạo tensor toàn 0 (torch.ones → toàn 1, torch.rand → ngẫu nhiên, torch.tensor → từ danh sách có sẵn, torch.cat → ghép tensor). ' +
      'Video dùng torch.zeros(3, 1080, 1920) để tạo "ảnh đen" trước khi tăng sáng.',
    hints: [
      { level: 1, text: '"Zero" nghĩa là gì?' },
      { level: 2, text: 'torch.rand cho số ngẫu nhiên, torch.cat để ghép — loại hai phương án này.' },
      { level: 3, text: 'Tên hàm nói thẳng nội dung: zeros = các số 0.' },
    ],
  },
  {
    id: 'vt-gpu-parallel',
    type: 'multiple-choice',
    skillId: 'tensor_basics',
    dimension: 'explain',
    difficulty: 2,
    prompt: 'Vì sao xử lý ảnh dưới dạng tensor trên GPU nhanh hơn duyệt từng điểm ảnh bằng CPU?',
    options: [
      'GPU có xung nhịp mỗi nhân cao hơn CPU',
      'Tensor nén dữ liệu nên nhỏ hơn',
      'GPU có hàng nghìn nhân tính toán xử lý song song cùng lúc',
      'CPU không đọc được số thực',
    ],
    answerIndex: 2,
    explain:
      'Dữ liệu quy chuẩn thành tensor cho phép hàng nghìn nhân CUDA của GPU tính song song — video nêu nhanh hơn CPU xử lý tuần tự cả nghìn lần. ' +
      'Đây cũng là lý do mô hình ngôn ngữ lớn chạy được: phép nhân ma trận tensor song song trên GPU.',
    hints: [
      { level: 1, text: 'Điểm mạnh của GPU không phải tốc độ MỘT nhân, mà là SỐ LƯỢNG nhân.' },
      { level: 2, text: 'CPU xử lý từng điểm ảnh một; GPU xử lý thế nào?' },
      { level: 3, text: 'Song song: hàng nghìn điểm ảnh được tính cùng một lúc.' },
    ],
  },
];
