// ===========================================================================
// NGÂN HÀNG BÀI TẬP — SECTION 12: HỌC SÂU HIỆN ĐẠI (Modern Deep Learning)
//
// Nội dung GỐC: số liệu & câu chữ tự soạn, KHÔNG sao chép/dịch từ sách. Kỹ thuật
// toán là kiến thức chung. Mọi `skillId` đều tồn tại trong ../skills.ts (Ch12:
// cnn, rnn, attention, transformer, word_embedding). Mọi đáp án đã rà tay —
// đặc biệt convolution và QKᵀ. Trải difficulty 1..4, dùng nhiều dạng bài.
//
// Triết lý: Deep Learning = Đại số tuyến tính áp dụng. Nhiều lời giải nhắc lại
// dot product / matmul / cosine / SVD để bắc cầu về các chương LA.
//
// Export: exercises: Exercise[]
// ===========================================================================

import type { Exercise } from '../../exercises/types';

export const exercises: Exercise[] = [
  // --- cnn -------------------------------------------------------------------
  {
    id: 'eb-ch12-cnn-conv-cell',
    type: 'numeric-input',
    skillId: 'cnn',
    dimension: 'compute',
    difficulty: 2,
    prompt:
      'Cửa sổ ảnh 2×2 là [[3, 1], [2, 0]] và kernel là [[1, −1], [0, 2]]. Tính giá trị ô feature map (tổng tích từng phần tử, dạng cross-correlation).',
    answer: 2,
    tolerance: 0,
    explain:
      'Một ô feature map là DOT PRODUCT cục bộ: 3·1 + 1·(−1) + 2·0 + 0·2 = 3 − 1 + 0 + 0 = 2.',
    hints: [
      { level: 1, text: 'Nhân từng phần tử của cửa sổ với phần tử tương ứng của kernel, rồi cộng lại.' },
      { level: 2, text: '3·1 = 3; 1·(−1) = −1; 2·0 = 0; 0·2 = 0.' },
      { level: 3, text: '3 − 1 + 0 + 0 = ?' },
    ],
  },
  {
    id: 'eb-ch12-cnn-weight-sharing',
    type: 'multiple-choice',
    skillId: 'cnn',
    dimension: 'concept',
    difficulty: 1,
    prompt: 'Trong mạng tích chập (CNN), "chia sẻ trọng số" (weight sharing) nghĩa là gì?',
    options: [
      'Mỗi vị trí trên ảnh dùng một kernel khác nhau',
      'Cùng một kernel được áp ở MỌI vị trí trên ảnh, nên số tham số ít đi',
      'Ảnh và kernel bắt buộc phải cùng kích thước',
      'Toàn bộ trọng số được đặt bằng 0',
    ],
    answerIndex: 1,
    explain:
      'Một kernel duy nhất trượt khắp ảnh: đặc trưng học được (ví dụ bộ dò cạnh) dùng lại ở mọi nơi, giúp giảm mạnh số tham số và tạo tính bất biến tịnh tiến.',
    hints: [
      { level: 1, text: 'Nghĩ xem có bao nhiêu bộ kernel được dùng khi trượt khắp ảnh.' },
      { level: 2, text: 'Chỉ một bộ trọng số kernel, dùng đi dùng lại ở mọi vị trí.' },
    ],
  },
  {
    id: 'eb-ch12-cnn-output-size',
    type: 'numeric-input',
    skillId: 'cnn',
    dimension: 'compute',
    difficulty: 2,
    prompt:
      'Một ảnh 8×8 được chập với kernel 3×3, stride 1, không padding. Feature map có kích thước bao nhiêu theo mỗi chiều?',
    answer: 6,
    tolerance: 0,
    explain:
      'Kích thước đầu ra mỗi chiều = (N − k)/stride + 1 = (8 − 3)/1 + 1 = 6. Vậy feature map là 6×6.',
    hints: [
      { level: 1, text: 'Dùng công thức (N − k)/stride + 1.' },
      { level: 2, text: '(8 − 3)/1 + 1 = 5 + 1.' },
    ],
  },

  // --- rnn -------------------------------------------------------------------
  {
    id: 'eb-ch12-rnn-hidden-role',
    type: 'multiple-choice',
    skillId: 'rnn',
    dimension: 'concept',
    difficulty: 1,
    prompt: 'Trong RNN, trạng thái ẩn (hidden state) h_t đóng vai trò gì?',
    options: [
      'Là ma trận trọng số cố định của mạng',
      'Là "bộ nhớ" tóm tắt thông tin từ các bước trước trong chuỗi',
      'Là nhãn (label) của dữ liệu huấn luyện',
      'Là hằng số bằng 0 ở mọi bước',
    ],
    answerIndex: 1,
    explain:
      'h_t mang thông tin tích lũy từ x_1,…,x_t và được truyền sang bước sau — chính là bộ nhớ ngắn hạn giúp mạng xử lý chuỗi.',
    hints: [
      { level: 1, text: 'Thứ gì được truyền từ bước này sang bước kế tiếp?' },
      { level: 2, text: 'Nó tóm tắt "mọi thứ đã thấy tới hiện tại".' },
    ],
  },
  {
    id: 'eb-ch12-rnn-preactivation',
    type: 'numeric-input',
    skillId: 'rnn',
    dimension: 'compute',
    difficulty: 3,
    prompt:
      'RNN cập nhật h_t = tanh(W·h_{t−1} + U·x_t). Cho W = [[0.5, 0.5], [0, 1]], h_{t−1} = (2, 4) và U·x_t = (1, −1). Tính thành phần THỨ NHẤT của vector TRƯỚC khi lấy tanh.',
    answer: 4,
    tolerance: 0,
    explain:
      'W·h_{t−1} tính theo hàng (matVec): hàng 1 = 0.5·2 + 0.5·4 = 3. Cộng thành phần đầu của U·x_t (= 1): 3 + 1 = 4. (Sau đó mới áp tanh.)',
    hints: [
      { level: 1, text: 'Thành phần đầu của W·h là tích vô hướng HÀNG 1 của W với h_{t−1}.' },
      { level: 2, text: '0.5·2 + 0.5·4 = 3.' },
      { level: 3, text: 'Cộng thêm thành phần đầu của U·x_t = 1: 3 + 1.' },
    ],
  },
  {
    id: 'eb-ch12-rnn-weight-share-time',
    type: 'true-false',
    skillId: 'rnn',
    dimension: 'concept',
    difficulty: 2,
    prompt: 'Đúng hay Sai?',
    statement: 'RNN dùng các bộ trọng số KHÁC NHAU cho từng bước thời gian.',
    answer: false,
    explain:
      'Ngược lại: RNN CHIA SẺ cùng một cặp trọng số (W, U) qua mọi bước thời gian, nhờ đó xử lý được chuỗi dài tùy ý mà số tham số không đổi.',
    hints: [
      { level: 1, text: 'So sánh với weight sharing của CNN, nhưng theo trục thời gian.' },
      { level: 2, text: 'Chỉ một cặp (W, U) được tái sử dụng ở mọi bước.' },
    ],
  },

  // --- attention -------------------------------------------------------------
  {
    id: 'eb-ch12-attn-score',
    type: 'numeric-input',
    skillId: 'attention',
    dimension: 'compute',
    difficulty: 2,
    prompt:
      'Trong attention, một ô của ma trận điểm số QKᵀ là dot product của một query với một key. Cho q = (2, 1) và k = (3, 0), tính điểm số q·k (chưa chia tỉ lệ).',
    answer: 6,
    tolerance: 0,
    explain: 'q·k = 2·3 + 1·0 = 6 + 0 = 6. Mỗi ô của QKᵀ được tính đúng như vậy.',
    hints: [
      { level: 1, text: 'Điểm số là tích vô hướng của query và key.' },
      { level: 2, text: '2·3 + 1·0.' },
    ],
  },
  {
    id: 'eb-ch12-attn-qkt',
    type: 'matrix-input',
    skillId: 'attention',
    dimension: 'compute',
    difficulty: 3,
    prompt:
      'Cho Q = [[1, 0], [1, 1]] và K = [[2, 1], [0, 3]]. Tính ma trận điểm số S = Q·Kᵀ (2×2, chưa chia tỉ lệ). Ô (i, j) = (query hàng i)·(key hàng j).',
    rows: 2,
    cols: 2,
    answer: [
      [2, 0],
      [3, 3],
    ],
    tolerance: 0,
    explain:
      'S(1,1)=(1,0)·(2,1)=2; S(1,2)=(1,0)·(0,3)=0; S(2,1)=(1,1)·(2,1)=3; S(2,2)=(1,1)·(0,3)=3. Vậy S = [[2, 0], [3, 3]].',
    hints: [
      { level: 1, text: 'Mỗi ô là dot product của một hàng Q với một hàng K.' },
      { level: 2, text: 'Ô (2,1) = (1,1)·(2,1) = 1·2 + 1·1.' },
      { level: 3, text: 'Ô (2,1) = 2 + 1 = 3; ô (2,2) = 1·0 + 1·3 = 3.' },
    ],
  },
  {
    id: 'eb-ch12-attn-pipeline',
    type: 'step-ordering',
    skillId: 'attention',
    dimension: 'compute',
    difficulty: 3,
    prompt: 'Sắp xếp đúng thứ tự các bước tính attention(Q, K, V) cho một truy vấn.',
    steps: [
      'Tính điểm số S = Q·Kᵀ (dot product của mỗi cặp query–key)',
      'Chia mỗi điểm số cho √d để giữ thang ổn định',
      'Áp softmax theo từng HÀNG để được trọng số chú ý (cộng lại bằng 1)',
      'Nhân trọng số với V → đầu ra là tổ hợp tuyến tính các hàng của V',
    ],
    explain:
      'attention(Q,K,V) = softmax(QKᵀ/√d)·V: điểm số → chia √d → softmax theo hàng → trộn V.',
    hints: [
      { level: 1, text: 'Bắt đầu từ việc so khớp query với key (QKᵀ).' },
      { level: 2, text: 'softmax phải đứng trước bước nhân với V.' },
      { level: 3, text: 'Bước cuối cùng luôn là trộn các hàng V theo trọng số.' },
    ],
  },

  // --- transformer -----------------------------------------------------------
  {
    id: 'eb-ch12-tf-positional',
    type: 'multiple-choice',
    skillId: 'transformer',
    dimension: 'concept',
    difficulty: 2,
    prompt: 'Positional encoding được thêm vào Transformer nhằm mục đích gì?',
    options: [
      'Chuẩn hóa độ dài của các vector về 1',
      'Bổ sung thông tin VỊ TRÍ/thứ tự, vì phép attention vốn không phân biệt thứ tự token',
      'Giảm số lượng tham số của mô hình',
      'Thay thế hoàn toàn cho phép nhân với V',
    ],
    answerIndex: 1,
    explain:
      'Self-attention đối xử chuỗi như một TẬP HỢP (hoán vị token không đổi kết quả). Positional encoding cộng thêm dấu hiệu vị trí để mô hình biết được thứ tự.',
    hints: [
      { level: 1, text: 'Attention có tự biết token nào đứng trước token nào không?' },
      { level: 2, text: 'Cần bơm thêm thông tin về VỊ TRÍ trong chuỗi.' },
    ],
  },
  {
    id: 'eb-ch12-tf-qkt-gram',
    type: 'multiple-choice',
    skillId: 'transformer',
    dimension: 'concept',
    difficulty: 4,
    prompt:
      'Xét về đại số tuyến tính, phép QKᵀ trong self-attention tạo ra loại ma trận nào?',
    options: [
      'Ma trận nghịch đảo của Q',
      'Một phép NHÂN MA TRẬN cho ra ma trận các dot product từng cặp (ma trận Gram của độ tương tự query–key)',
      'Một ma trận đường chéo',
      'Một tích có hướng trong không gian 3 chiều',
    ],
    answerIndex: 1,
    explain:
      'QKᵀ là tích ma trận (Ch3); ô (i, j) là dot product của query i với key j (Ch1). Tập hợp mọi dot product từng cặp chính là một ma trận Gram — đo độ tương tự giữa các vector.',
    hints: [
      { level: 1, text: 'Mỗi ô là một dot product; cả bảng các dot product từng cặp gọi là gì?' },
      { level: 2, text: 'Ma trận chứa mọi dot product từng cặp của một tập vector là ma trận Gram.' },
    ],
  },

  // --- word_embedding --------------------------------------------------------
  {
    id: 'eb-ch12-emb-cosine',
    type: 'numeric-input',
    skillId: 'word_embedding',
    dimension: 'compute',
    difficulty: 2,
    prompt:
      'Độ tương tự giữa hai embedding là cosine similarity. Cho u = (3, 4) và v = (4, 3), tính cos(u, v). (nhập số thập phân)',
    answer: 0.96,
    tolerance: 0.01,
    explain:
      'cos = (u·v)/(‖u‖‖v‖). u·v = 3·4 + 4·3 = 24; ‖u‖ = ‖v‖ = √25 = 5; nên cos = 24/(5·5) = 24/25 = 0.96 — hai từ rất gần nghĩa.',
    hints: [
      { level: 1, text: 'Cosine = dot product chia cho tích hai độ dài.' },
      { level: 2, text: 'u·v = 24; ‖u‖ = ‖v‖ = 5.' },
      { level: 3, text: '24 / (5·5) = 24/25.' },
    ],
  },
  {
    id: 'eb-ch12-emb-is-vector',
    type: 'multiple-choice',
    skillId: 'word_embedding',
    dimension: 'concept',
    difficulty: 1,
    prompt: 'Một word embedding, về bản chất toán học, là gì?',
    options: [
      'Một số nguyên chỉ số (index) của từ trong từ điển',
      'Một VECTOR trong không gian nhiều chiều ℝⁿ',
      'Một ma trận vuông khả nghịch',
      'Một xác suất trong đoạn [0, 1]',
    ],
    answerIndex: 1,
    explain:
      'Mỗi từ được ánh xạ thành một vector ℝⁿ (thường 100–300 chiều). Ngữ nghĩa được mã hóa bởi vị trí và hướng của vector — nên "gần nghĩa" thành "gần nhau".',
    hints: [
      { level: 1, text: 'Ta đo được "khoảng cách" và "góc" giữa hai từ — vậy chúng là gì?' },
      { level: 2, text: 'Là một điểm/vector trong không gian ℝⁿ.' },
    ],
  },
  {
    id: 'eb-ch12-emb-analogy',
    type: 'multiple-choice',
    skillId: 'word_embedding',
    dimension: 'concept',
    difficulty: 3,
    prompt:
      'Loại suy vector: "Paris − France + Italy" cho kết quả gần nhất với từ nào?',
    options: ['Rome', 'Berlin', 'Cat', 'King'],
    answerIndex: 0,
    explain:
      'Hướng "thủ đô − quốc gia" là một vector nhất quán; áp nó lên Italy cho ra Rome — cùng cơ chế với king − man + woman = queen.',
    hints: [
      { level: 1, text: '(Paris − France) là "vector thủ đô của"; cộng vào Italy.' },
      { level: 2, text: 'Thủ đô của Italy là thành phố nào?' },
    ],
  },
];
