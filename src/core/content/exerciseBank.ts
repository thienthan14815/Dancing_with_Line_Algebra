// ===========================================================================
// NGÂN HÀNG BÀI TẬP (EXERCISE BANK) — dữ liệu thuần, KHÔNG UI, KHÔNG random.
// Phủ các skill của Section 0 (Kiến thức nền), 1 (Vector), 2 (Hệ phương trình).
//
// Nội dung GỐC: số liệu & câu chữ tự soạn, không sao chép/dịch từ sách. Kỹ thuật
// toán là kiến thức chung. Mọi `skillId` đều tồn tại trong ./skills.ts; mọi đáp
// án đã được rà tay. Dùng đủ 8 dạng bài, mỗi dạng ≥ 3 bài, trải difficulty 1..4.
//
// Export:
//   • EXERCISES: Exercise[]
//   • EXERCISES_BY_SKILL: Record<string, Exercise[]>
//   • getExercisesForSkills(skillIds, max=6, seed?): Exercise[]
//   • getExercisesForLesson(lessonId, max=6, seed?): Exercise[]
// Truyền `seed` để LUYỆN KHÔNG LẶP (ưu tiên generator, bù bằng pool tĩnh xáo
// theo seed); KHÔNG truyền seed → hành vi cũ y nguyên (backward-compatible).
// ===========================================================================

import type { Exercise } from '../exercises/types';
import { SAMPLE_EXERCISES } from '../exercises/sampleBank';
import { genExercisesForSkills } from '../exercises/generators';
import { mulberry32, shuffle } from '../rng';
import { getMicroLesson } from './course';
import { exercises as SECTION3 } from './bank/ch3';
import { exercises as SECTION4 } from './bank/ch4';
import { exercises as SECTION5 } from './bank/ch5';
import { exercises as SECTION6 } from './bank/ch6';
import { exercises as SECTION7 } from './bank/ch7';
import { exercises as SECTION8 } from './bank/ch8';
import { exercises as SECTION9 } from './bank/ch9';
import { exercises as SECTION10 } from './bank/ch10';
import { exercises as SECTION11 } from './bank/ch11';
import { exercises as SECTION12 } from './bank/ch12';
import { exercises as SECTION13 } from './bank/ch13';
// Content module (giáo án plugin) — merge additive vào EXERCISES, giữ nguyên bài gốc.
import { moduleExercises } from '../../content/registry';
import { exercises as VIDEO_TENSOR } from './bank/video-tensor';

// ---------------------------------------------------------------------------
// SECTION 0 — KIẾN THỨC NỀN (Foundations)
//   skills: coordinate_systems, functions_graphs, trigonometry, math_notation
// ---------------------------------------------------------------------------

const SECTION0: Exercise[] = [
  // --- coordinate_systems ---------------------------------------------------
  {
    id: 'eb-coord-quadrant',
    type: 'multiple-choice',
    skillId: 'coordinate_systems',
    dimension: 'concept',
    difficulty: 1,
    prompt: 'Điểm P(−3, 2) nằm ở góc phần tư (quadrant) nào của mặt phẳng tọa độ?',
    options: ['Góc phần tư I', 'Góc phần tư II', 'Góc phần tư III', 'Góc phần tư IV'],
    answerIndex: 1,
    explain: 'x < 0 và y > 0 nên điểm nằm ở góc phần tư II (phía trên bên trái).',
    hints: [
      { level: 1, text: 'Xét dấu của hoành độ x và tung độ y.' },
      { level: 2, text: 'x = −3 (âm) → nằm bên trái; y = 2 (dương) → nằm phía trên.' },
      { level: 3, text: 'Bên trái + phía trên là góc phần tư II.' },
    ],
  },
  {
    id: 'eb-coord-distance',
    type: 'numeric-input',
    skillId: 'coordinate_systems',
    dimension: 'compute',
    difficulty: 2,
    prompt: 'Tính khoảng cách giữa hai điểm A(1, 2) và B(4, 6).',
    answer: 5,
    tolerance: 0.001,
    explain: 'd = √[(4−1)² + (6−2)²] = √[9 + 16] = √25 = 5.',
    hints: [
      { level: 1, text: 'Dùng công thức khoảng cách: d = √[(x₂−x₁)² + (y₂−y₁)²].' },
      { level: 2, text: 'Δx = 3, Δy = 4.' },
      { level: 3, text: '√(9 + 16) = √25.' },
    ],
  },
  {
    id: 'eb-coord-draw',
    type: 'vector-drawing',
    skillId: 'coordinate_systems',
    dimension: 'visual',
    difficulty: 1,
    prompt: 'Vẽ vector vị trí từ gốc tọa độ O đến điểm P(−2, 3).',
    target: [-2, 3],
    tolerance: 0.3,
    explain: 'Đi 2 đơn vị sang trái (x = −2) và 3 đơn vị lên trên (y = 3).',
    hints: [
      { level: 1, text: 'Thành phần x cho biết đi ngang bao nhiêu, dấu âm là sang trái.' },
      { level: 2, text: 'Ngọn vector nằm đúng tại điểm (−2, 3).' },
    ],
  },
  {
    id: 'eb-coord-3d-axis',
    type: 'true-false',
    skillId: 'coordinate_systems',
    dimension: 'concept',
    difficulty: 2,
    prompt: 'Đúng hay Sai?',
    statement: 'Trong không gian 3 chiều, điểm (0, 0, 5) nằm trên trục z.',
    answer: true,
    explain: 'Một điểm nằm trên trục z khi hoành độ x và tung độ y đều bằng 0; ở đây x = y = 0.',
    hints: [
      { level: 1, text: 'Điểm nằm trên trục z khi hai tọa độ còn lại bằng 0.' },
      { level: 2, text: 'Kiểm tra x = 0 và y = 0 hay không.' },
    ],
  },

  // --- functions_graphs -----------------------------------------------------
  {
    id: 'eb-func-eval',
    type: 'numeric-input',
    skillId: 'functions_graphs',
    dimension: 'compute',
    difficulty: 1,
    prompt: 'Cho hàm số f(x) = 2x + 1. Tính f(3).',
    answer: 7,
    tolerance: 0,
    explain: 'Thay x = 3: f(3) = 2·3 + 1 = 6 + 1 = 7.',
    hints: [
      { level: 1, text: 'Thay giá trị x = 3 vào biểu thức của f.' },
      { level: 2, text: '2·3 = 6, rồi cộng 1.' },
    ],
  },
  {
    id: 'eb-func-slope',
    type: 'multiple-choice',
    skillId: 'functions_graphs',
    dimension: 'concept',
    difficulty: 1,
    prompt: 'Đường thẳng y = 3x − 5 có hệ số góc (độ dốc) bằng bao nhiêu?',
    options: ['−5', '3', '5', '−3'],
    answerIndex: 1,
    explain: 'Ở dạng y = mx + b, hệ số góc m là hệ số của x, tức m = 3. −5 là tung độ gốc.',
    hints: [
      { level: 1, text: 'Viết theo dạng y = mx + b; m là hệ số góc.' },
      { level: 2, text: 'Hệ số đứng trước x chính là m.' },
    ],
  },
  {
    id: 'eb-func-vertical-line',
    type: 'true-false',
    skillId: 'functions_graphs',
    dimension: 'concept',
    difficulty: 2,
    prompt: 'Đúng hay Sai?',
    statement: 'Một đồ thị biểu diễn một hàm số khi mỗi giá trị x ứng với đúng một giá trị y.',
    answer: true,
    explain: 'Đây là định nghĩa hàm số (và là ý tưởng của "phép thử đường thẳng đứng"): mỗi x cho duy nhất một y.',
    hints: [
      { level: 1, text: 'Nhớ lại định nghĩa hàm số: mỗi đầu vào cho bao nhiêu đầu ra?' },
      { level: 2, text: 'Nghĩ tới phép thử đường thẳng đứng cắt đồ thị.' },
    ],
  },

  // --- trigonometry ---------------------------------------------------------
  {
    id: 'eb-trig-cos60',
    type: 'numeric-input',
    skillId: 'trigonometry',
    dimension: 'compute',
    difficulty: 1,
    prompt: 'Tính cos(60°). (nhập dạng số thập phân)',
    answer: 0.5,
    tolerance: 0.01,
    explain: 'cos(60°) = 1/2 = 0,5 — một giá trị đặc biệt trên đường tròn đơn vị.',
    hints: [
      { level: 1, text: 'Đây là một góc đặc biệt (30°–60°–90°).' },
      { level: 2, text: 'cos(60°) = sin(30°) = 1/2.' },
    ],
  },
  {
    id: 'eb-trig-unit-circle-match',
    type: 'matching',
    skillId: 'trigonometry',
    dimension: 'concept',
    difficulty: 2,
    prompt: 'Ghép mỗi góc với tọa độ (cos θ, sin θ) tương ứng trên đường tròn đơn vị.',
    left: ['0°', '90°', '180°'],
    right: ['(0, 1)', '(1, 0)', '(−1, 0)'],
    pairs: [
      [0, 1],
      [1, 0],
      [2, 2],
    ],
    explain: 'Điểm ứng với góc θ là (cos θ, sin θ): 0° → (1, 0); 90° → (0, 1); 180° → (−1, 0).',
    hints: [
      { level: 1, text: 'Tọa độ điểm là (cos θ, sin θ).' },
      { level: 2, text: 'Ở 90°: cos = 0, sin = 1.' },
    ],
  },
  {
    id: 'eb-trig-sin-meaning',
    type: 'multiple-choice',
    skillId: 'trigonometry',
    dimension: 'concept',
    difficulty: 2,
    prompt: 'Trên đường tròn đơn vị, tọa độ y (tung độ) của điểm ứng với góc θ biểu diễn đại lượng nào?',
    options: ['cos θ', 'sin θ', 'tan θ', 'θ tính bằng radian'],
    answerIndex: 1,
    explain: 'Theo định nghĩa đường tròn đơn vị: điểm là (cos θ, sin θ), nên tung độ y = sin θ.',
    hints: [
      { level: 1, text: 'Điểm trên đường tròn đơn vị viết là (cos θ, sin θ).' },
      { level: 2, text: 'Thành phần thứ hai (y) là gì?' },
    ],
  },

  // --- math_notation --------------------------------------------------------
  {
    id: 'eb-notation-symbols',
    type: 'matching',
    skillId: 'math_notation',
    dimension: 'concept',
    difficulty: 2,
    prompt: 'Ghép mỗi ký hiệu toán học với ý nghĩa đúng của nó.',
    left: ['∈', 'ℝ', 'Σ'],
    right: ['Tập hợp các số thực', 'Tổng theo chỉ số', 'Thuộc về (là phần tử của)'],
    pairs: [
      [0, 2],
      [1, 0],
      [2, 1],
    ],
    explain: '∈ nghĩa là "thuộc về"; ℝ là tập số thực; Σ (sigma) là ký hiệu tổng.',
    hints: [
      { level: 1, text: '∈ thường đọc là "phần tử của".' },
      { level: 2, text: 'Σ (chữ sigma hoa) dùng để viết gọn một tổng.' },
    ],
  },
  {
    id: 'eb-notation-r2',
    type: 'multiple-choice',
    skillId: 'math_notation',
    dimension: 'concept',
    difficulty: 1,
    prompt: 'Ký hiệu ℝ² biểu diễn tập hợp nào?',
    options: [
      'Các số thực dương',
      'Các cặp số thực có thứ tự (x, y)',
      'Các số phức',
      'Các ma trận 2×2',
    ],
    answerIndex: 1,
    explain: 'ℝ² là tập các cặp có thứ tự (x, y) với x, y ∈ ℝ — chính là mặt phẳng tọa độ.',
    hints: [
      { level: 1, text: 'Số mũ 2 cho biết có bao nhiêu thành phần thực.' },
      { level: 2, text: 'Mỗi phần tử là một cặp (x, y).' },
    ],
  },
  {
    id: 'eb-notation-norm',
    type: 'true-false',
    skillId: 'math_notation',
    dimension: 'concept',
    difficulty: 1,
    prompt: 'Đúng hay Sai?',
    statement: 'Ký hiệu ‖v‖ (độ dài / chuẩn của vector v) luôn là một số không âm.',
    answer: true,
    explain: 'Chuẩn là độ dài, được định nghĩa qua căn bậc hai của tổng bình phương, nên luôn ≥ 0.',
    hints: [
      { level: 1, text: 'Độ dài có thể âm được không?' },
      { level: 2, text: '‖v‖ = √(v₁² + v₂² + …) — căn của một số không âm.' },
    ],
  },
];

// ---------------------------------------------------------------------------
// SECTION 1 — VECTOR (Vectors)
//   skills: vector_basics, vector_addition, scalar_multiplication,
//           linear_combination, span, dot_product, cross_product
// ---------------------------------------------------------------------------

const SECTION1: Exercise[] = [
  // --- vector_basics --------------------------------------------------------
  {
    id: 'eb-vec-draw',
    type: 'vector-drawing',
    skillId: 'vector_basics',
    dimension: 'visual',
    difficulty: 1,
    prompt: 'Vẽ vector v = (1, 3) bắt đầu từ gốc tọa độ.',
    target: [1, 3],
    tolerance: 0.3,
    explain: 'Đi 1 đơn vị sang phải và 3 đơn vị lên trên; ngọn vector ở điểm (1, 3).',
    hints: [
      { level: 1, text: 'Thành phần thứ nhất là hướng ngang (x).' },
      { level: 2, text: 'Thành phần thứ hai là hướng dọc (y).' },
    ],
  },
  {
    id: 'eb-vec-norm',
    type: 'numeric-input',
    skillId: 'vector_basics',
    dimension: 'compute',
    difficulty: 2,
    prompt: 'Tính độ dài (chuẩn) của vector v = (6, 8).',
    answer: 10,
    tolerance: 0.001,
    explain: '‖v‖ = √(6² + 8²) = √(36 + 64) = √100 = 10.',
    hints: [
      { level: 1, text: 'Dùng định lý Pytago: ‖v‖ = √(x² + y²).' },
      { level: 2, text: '6² = 36 và 8² = 64.' },
      { level: 3, text: '√100 = ?' },
    ],
  },
  {
    id: 'eb-vec-concept',
    type: 'multiple-choice',
    skillId: 'vector_basics',
    dimension: 'concept',
    difficulty: 1,
    prompt: 'Đại lượng nào sau đây cần CẢ độ lớn lẫn hướng để mô tả đầy đủ (là một vector)?',
    options: ['Nhiệt độ', 'Khối lượng', 'Vận tốc', 'Thời gian'],
    answerIndex: 2,
    explain: 'Vận tốc có độ lớn (tốc độ) và hướng nên là một vector; các đại lượng còn lại chỉ là số vô hướng.',
    hints: [
      { level: 1, text: 'Vector cần thêm thông tin về "hướng".' },
      { level: 2, text: 'Đại lượng nào có thể chỉ theo một chiều nhất định?' },
    ],
  },

  // --- vector_addition ------------------------------------------------------
  {
    id: 'eb-add-column',
    type: 'matrix-input',
    skillId: 'vector_addition',
    dimension: 'compute',
    difficulty: 1,
    prompt: 'Cho a = (3, −1) và b = (−1, 4) (viết dạng cột). Tính a + b.',
    rows: 2,
    cols: 1,
    answer: [[2], [3]],
    tolerance: 0,
    explain: 'Cộng theo từng thành phần: (3 + (−1), −1 + 4) = (2, 3).',
    hints: [
      { level: 1, text: 'Cộng vector là cộng từng thành phần tương ứng.' },
      { level: 2, text: 'Thành phần đầu: 3 + (−1) = 2.' },
    ],
  },
  {
    id: 'eb-add-component',
    type: 'numeric-input',
    skillId: 'vector_addition',
    dimension: 'compute',
    difficulty: 1,
    prompt: 'Cho a = (5, 2) và b = (−3, 7). Tính thành phần thứ hai (tọa độ y) của a + b.',
    answer: 9,
    tolerance: 0,
    explain: 'Thành phần y của tổng: 2 + 7 = 9.',
    hints: [
      { level: 1, text: 'Chỉ cần cộng các tọa độ y với nhau.' },
      { level: 2, text: '2 + 7 = ?' },
    ],
  },
  {
    id: 'eb-add-resultant-draw',
    type: 'vector-drawing',
    skillId: 'vector_addition',
    dimension: 'visual',
    difficulty: 2,
    prompt: 'Cho a = (2, 1) và b = (1, 3). Vẽ vector tổng a + b (nối đuôi–đầu).',
    target: [3, 4],
    tolerance: 0.35,
    explain: 'Đặt b nối tiếp đuôi vào ngọn của a; ngọn cuối cùng ở (2+1, 1+3) = (3, 4).',
    hints: [
      { level: 1, text: 'Cộng theo thành phần để biết ngọn của vector tổng.' },
      { level: 2, text: 'Tổng là (2+1, 1+3).' },
    ],
  },
  {
    id: 'eb-add-error',
    type: 'error-detection',
    skillId: 'vector_addition',
    dimension: 'compute',
    difficulty: 3,
    prompt: 'Tìm dòng SAI trong phép cộng a = (4, −2) và b = (−1, −3).',
    lines: [
      'a + b = (4 + (−1), (−2) + (−3))',
      'a + b = (4 − 1, −2 − 3)',
      'a + b = (3, −1)',
      'Kết luận: a + b = (3, −1)',
    ],
    wrongLineIndex: 2,
    explain: 'Thành phần y sai: −2 − 3 = −5, không phải −1. Kết quả đúng là (3, −5).',
    hints: [
      { level: 1, text: 'Kiểm tra riêng từng thành phần x và y.' },
      { level: 2, text: 'Cộng hai số âm: −2 và −3 cho bao nhiêu?' },
      { level: 3, text: '−2 − 3 phải là một số âm hơn, không phải −1.' },
    ],
  },

  // --- scalar_multiplication ------------------------------------------------
  {
    id: 'eb-scal-3v',
    type: 'matrix-input',
    skillId: 'scalar_multiplication',
    dimension: 'compute',
    difficulty: 1,
    prompt: 'Cho v = (−2, 1, 4). Tính 3v (viết dạng cột).',
    rows: 3,
    cols: 1,
    answer: [[-6], [3], [12]],
    tolerance: 0,
    explain: 'Nhân vô hướng: nhân MỌI thành phần với 3 → (−6, 3, 12).',
    hints: [
      { level: 1, text: 'Nhân từng thành phần của v với 3.' },
      { level: 2, text: '3·(−2) = −6; 3·4 = 12.' },
    ],
  },
  {
    id: 'eb-scal-neg-component',
    type: 'numeric-input',
    skillId: 'scalar_multiplication',
    dimension: 'compute',
    difficulty: 1,
    prompt: 'Cho v = (7, −5). Tính thành phần thứ nhất (tọa độ x) của −2v.',
    answer: -14,
    tolerance: 0,
    explain: 'Thành phần x: (−2)·7 = −14. Số âm nhân số dương ra số âm.',
    hints: [
      { level: 1, text: 'Nhân thành phần x = 7 với hệ số −2.' },
      { level: 2, text: 'Chú ý dấu: (−2)·7 là dương hay âm?' },
    ],
  },
  {
    id: 'eb-scal-direction-tf',
    type: 'true-false',
    skillId: 'scalar_multiplication',
    dimension: 'concept',
    difficulty: 2,
    prompt: 'Đúng hay Sai?',
    statement: 'Nhân một vector khác 0 với một số âm sẽ đảo ngược hướng của vector đó.',
    answer: true,
    explain: 'Hệ số âm lật vector sang chiều ngược lại; độ dài được nhân với trị tuyệt đối của hệ số.',
    hints: [
      { level: 1, text: 'Hãy thử với v = (1, 0) nhân với −1.' },
      { level: 2, text: '(−1)·(1, 0) = (−1, 0) chỉ theo chiều ngược lại.' },
    ],
  },

  // --- linear_combination ---------------------------------------------------
  {
    id: 'eb-lincomb-component',
    type: 'numeric-input',
    skillId: 'linear_combination',
    dimension: 'compute',
    difficulty: 2,
    prompt: 'Cho a = (1, 2) và b = (3, −1). Tính thành phần thứ nhất (tọa độ x) của 2a + b.',
    answer: 5,
    tolerance: 0,
    explain: 'Thành phần x: 2·1 + 3 = 2 + 3 = 5.',
    hints: [
      { level: 1, text: 'Trước hết nhân a với 2, rồi cộng b — chỉ xét thành phần x.' },
      { level: 2, text: '2·1 = 2; cộng thêm 3.' },
    ],
  },
  {
    id: 'eb-lincomb-matrix',
    type: 'matrix-input',
    skillId: 'linear_combination',
    dimension: 'compute',
    difficulty: 3,
    prompt: 'Cho a = (2, 0) và b = (1, −3). Tính tổ hợp tuyến tính 2a − b (viết dạng cột).',
    rows: 2,
    cols: 1,
    answer: [[3], [3]],
    tolerance: 0,
    explain: '2a = (4, 0); 2a − b = (4 − 1, 0 − (−3)) = (3, 3). Chú ý 0 − (−3) = +3.',
    hints: [
      { level: 1, text: 'Tính 2a trước, sau đó trừ đi b theo từng thành phần.' },
      { level: 2, text: '2a = (4, 0).' },
      { level: 3, text: 'Thành phần y: 0 − (−3) = 0 + 3 = 3.' },
    ],
  },
  {
    id: 'eb-lincomb-concept',
    type: 'multiple-choice',
    skillId: 'linear_combination',
    dimension: 'concept',
    difficulty: 1,
    prompt: 'Một "tổ hợp tuyến tính" của các vector v₁, v₂ là biểu thức nào?',
    options: [
      'v₁ · v₂ (tích vô hướng)',
      'c₁v₁ + c₂v₂ với c₁, c₂ là các số vô hướng',
      '‖v₁‖ + ‖v₂‖',
      'v₁ × v₂ (tích có hướng)',
    ],
    answerIndex: 1,
    explain: 'Tổ hợp tuyến tính là tổng các vector đã được nhân với hệ số vô hướng: c₁v₁ + c₂v₂.',
    hints: [
      { level: 1, text: 'Tổ hợp tuyến tính vẫn cho ra một vector.' },
      { level: 2, text: 'Ta được phép nhân mỗi vector với một số rồi cộng lại.' },
    ],
  },

  // --- span -----------------------------------------------------------------
  {
    id: 'eb-span-parallel-tf',
    type: 'true-false',
    skillId: 'span',
    dimension: 'concept',
    difficulty: 3,
    prompt: 'Đúng hay Sai?',
    statement: 'Span của hai vector khác 0 và cùng phương (song song) trong ℝ² là toàn bộ mặt phẳng ℝ².',
    answer: false,
    explain: 'Hai vector cùng phương chỉ sinh ra một ĐƯỜNG THẲNG qua gốc, không phủ hết mặt phẳng. Cần hai vector không cùng phương mới sinh được cả ℝ².',
    hints: [
      { level: 1, text: 'Nếu b = k·a thì mọi tổ hợp c₁a + c₂b vẫn nằm trên đường của a.' },
      { level: 2, text: 'Để phủ cả mặt phẳng cần hai hướng độc lập.' },
    ],
  },
  {
    id: 'eb-span-concept',
    type: 'multiple-choice',
    skillId: 'span',
    dimension: 'concept',
    difficulty: 2,
    prompt: 'Span của một tập các vector là gì?',
    options: [
      'Tập tất cả các tổ hợp tuyến tính của các vector đó',
      'Vector dài nhất trong tập',
      'Tích vô hướng của các vector',
      'Số lượng vector trong tập',
    ],
    answerIndex: 0,
    explain: 'Span là tập hợp mọi tổ hợp tuyến tính c₁v₁ + c₂v₂ + … của các vector đã cho.',
    hints: [
      { level: 1, text: 'Nghĩ tới "tất cả những gì có thể tạo ra" từ các vector đó.' },
      { level: 2, text: 'Liên hệ với khái niệm tổ hợp tuyến tính.' },
    ],
  },

  // --- dot_product ----------------------------------------------------------
  {
    id: 'eb-dot-3d',
    type: 'numeric-input',
    skillId: 'dot_product',
    dimension: 'compute',
    difficulty: 2,
    prompt: 'Tính tích vô hướng của u = (3, −2, 1) và v = (1, 4, −2).',
    answer: -7,
    tolerance: 0,
    explain: 'u · v = 3·1 + (−2)·4 + 1·(−2) = 3 − 8 − 2 = −7.',
    hints: [
      { level: 1, text: 'Nhân từng cặp thành phần tương ứng rồi cộng lại.' },
      { level: 2, text: '3·1 = 3; (−2)·4 = −8; 1·(−2) = −2.' },
      { level: 3, text: '3 − 8 − 2 = ?' },
    ],
  },
  {
    id: 'eb-dot-sign-angle',
    type: 'multiple-choice',
    skillId: 'dot_product',
    dimension: 'concept',
    difficulty: 2,
    prompt: 'Nếu tích vô hướng u·v < 0 (hai vector khác 0) thì góc giữa u và v là góc gì?',
    options: ['Góc nhọn (< 90°)', 'Góc vuông (= 90°)', 'Góc tù (> 90°)', 'Không xác định được'],
    answerIndex: 2,
    explain: 'u·v = ‖u‖‖v‖cos θ. Vì ‖u‖, ‖v‖ > 0, dấu của u·v chính là dấu của cos θ; cos θ < 0 khi θ > 90° (góc tù).',
    hints: [
      { level: 1, text: 'Nhớ công thức u·v = ‖u‖‖v‖cos θ.' },
      { level: 2, text: 'Độ dài luôn dương, nên dấu âm đến từ cos θ.' },
      { level: 3, text: 'cos θ âm ứng với góc lớn hơn 90°.' },
    ],
  },
  {
    id: 'eb-dot-angle-steps',
    type: 'step-ordering',
    skillId: 'dot_product',
    dimension: 'compute',
    difficulty: 3,
    prompt: 'Sắp xếp đúng thứ tự các bước tính góc θ giữa hai vector u và v.',
    steps: [
      'Tính tích vô hướng u · v',
      'Tính độ dài ‖u‖ và ‖v‖',
      'Lập tỉ số cos θ = (u · v) / (‖u‖ · ‖v‖)',
      'Lấy arccos của tỉ số để tìm góc θ',
    ],
    explain: 'Từ công thức u·v = ‖u‖‖v‖cos θ, ta suy ra cos θ rồi lấy arccos để có θ.',
    hints: [
      { level: 1, text: 'Cần cả tử số (u·v) lẫn mẫu số (tích độ dài) trước khi lập tỉ số.' },
      { level: 2, text: 'arccos là bước cuối để đổi cos θ thành θ.' },
    ],
  },
  {
    id: 'eb-dot-error',
    type: 'error-detection',
    skillId: 'dot_product',
    dimension: 'compute',
    difficulty: 3,
    prompt: 'Tìm dòng SAI khi tính u · v với u = (2, −3) và v = (4, 5).',
    lines: [
      'u · v = 2·4 + (−3)·5',
      'u · v = 8 + (−15)',
      'u · v = −23',
      'Kết luận: u · v = −23',
    ],
    wrongLineIndex: 2,
    explain: '8 + (−15) = −7, không phải −23. Có vẻ đã cộng 8 và 15 rồi mới gán dấu âm.',
    hints: [
      { level: 1, text: 'Phép nhân từng cặp thành phần đã đúng; hãy kiểm tra bước cộng.' },
      { level: 2, text: '8 + (−15) nghĩa là 8 − 15.' },
      { level: 3, text: '8 − 15 = −7.' },
    ],
  },

  // --- cross_product --------------------------------------------------------
  {
    id: 'eb-cross-ij',
    type: 'matrix-input',
    skillId: 'cross_product',
    dimension: 'compute',
    difficulty: 2,
    prompt: 'Tính tích có hướng u × v với u = (1, 0, 0) và v = (0, 1, 0). Viết kết quả dạng cột.',
    rows: 3,
    cols: 1,
    answer: [[0], [0], [1]],
    tolerance: 0,
    explain: 'u × v = (u₂v₃ − u₃v₂, u₃v₁ − u₁v₃, u₁v₂ − u₂v₁) = (0, 0, 1). Đây là x̂ × ŷ = ẑ.',
    hints: [
      { level: 1, text: 'Dùng công thức tích có hướng theo từng thành phần.' },
      { level: 2, text: 'Thành phần z: u₁v₂ − u₂v₁ = 1·1 − 0·0 = 1.' },
    ],
  },
  {
    id: 'eb-cross-direction',
    type: 'multiple-choice',
    skillId: 'cross_product',
    dimension: 'concept',
    difficulty: 2,
    prompt: 'Tích có hướng u × v của hai vector trong không gian 3D cho ra một vector có hướng như thế nào?',
    options: [
      'Cùng hướng với u',
      'Vuông góc với cả u và v',
      'Nằm trong mặt phẳng chứa u và v',
      'Cùng hướng với v',
    ],
    answerIndex: 1,
    explain: 'u × v luôn vuông góc với mặt phẳng chứa u và v (tuân theo quy tắc bàn tay phải).',
    hints: [
      { level: 1, text: 'Kết quả không nằm trong mặt phẳng của u và v.' },
      { level: 2, text: 'Nghĩ tới quy tắc bàn tay phải và pháp tuyến của mặt phẳng.' },
    ],
  },
  {
    id: 'eb-cross-magnitude',
    type: 'numeric-input',
    skillId: 'cross_product',
    dimension: 'compute',
    difficulty: 2,
    prompt: 'Cho u = (3, 0, 0) và v = (0, 4, 0). Tính độ lớn ‖u × v‖ (bằng diện tích hình bình hành dựng trên u, v).',
    answer: 12,
    tolerance: 0.001,
    explain: 'u × v = (0, 0, 12) nên ‖u × v‖ = 12. Cũng bằng ‖u‖‖v‖sin θ = 3·4·sin 90° = 12.',
    hints: [
      { level: 1, text: 'Hai vector vuông góc, nên sin của góc giữa chúng bằng 1.' },
      { level: 2, text: '‖u × v‖ = ‖u‖·‖v‖·sin θ = 3·4·1.' },
    ],
  },
];

// ---------------------------------------------------------------------------
// SECTION 2 — HỆ PHƯƠNG TRÌNH TUYẾN TÍNH (Linear Systems)
//   skills: linear_system, gaussian_elimination, solution_types
// ---------------------------------------------------------------------------

const SECTION2: Exercise[] = [
  // --- linear_system --------------------------------------------------------
  {
    id: 'eb-sys-column-picture',
    type: 'multiple-choice',
    skillId: 'linear_system',
    dimension: 'concept',
    difficulty: 4,
    prompt: 'Trong "column picture" (hình ảnh theo cột) của hệ Ax = b, ta đang tìm điều gì?',
    options: [
      'Giao điểm của các đường thẳng/mặt phẳng ứng với từng phương trình',
      'Tổ hợp tuyến tính các cột của A để tạo ra vector b',
      'Định thức của ma trận A',
      'Nghịch đảo của vector b',
    ],
    answerIndex: 1,
    explain: 'Column picture xem Ax là tổ hợp tuyến tính các CỘT của A với hệ số là các thành phần của x; ta tìm hệ số để tổ hợp đó bằng b. (Đáp án đầu là "row picture".)',
    hints: [
      { level: 1, text: 'Ax có thể viết là x₁·(cột 1) + x₂·(cột 2) + …' },
      { level: 2, text: '"Row picture" mới là giao của các đường/mặt; còn "column picture" nói về các cột.' },
    ],
  },
  {
    id: 'eb-sys-solve-2x2',
    type: 'numeric-input',
    skillId: 'linear_system',
    dimension: 'compute',
    difficulty: 2,
    prompt: 'Giải hệ: x + y = 5 và x − y = 1. Nhập giá trị của x.',
    answer: 3,
    tolerance: 0,
    explain: 'Cộng hai phương trình: 2x = 6 → x = 3 (và y = 2).',
    hints: [
      { level: 1, text: 'Cộng hai phương trình để khử ẩn y.' },
      { level: 2, text: '(x + y) + (x − y) = 5 + 1 → 2x = 6.' },
    ],
  },
  {
    id: 'eb-sys-terms-match',
    type: 'matching',
    skillId: 'linear_system',
    dimension: 'concept',
    difficulty: 2,
    prompt: 'Ghép mỗi khái niệm về hệ phương trình với mô tả đúng.',
    left: ['Ma trận hệ số', 'Vector nghiệm', 'Ma trận bổ sung (augmented)'],
    right: [
      'Ma trận [A | b] gồm hệ số và vế phải',
      'Bảng các hệ số A của các ẩn',
      'Bộ giá trị (x, y, …) thỏa mãn mọi phương trình',
    ],
    pairs: [
      [0, 1],
      [1, 2],
      [2, 0],
    ],
    explain: 'Ma trận hệ số = bảng A; vector nghiệm = bộ (x, y, …) thỏa hệ; ma trận bổ sung = [A | b].',
    hints: [
      { level: 1, text: 'Ma trận bổ sung có thêm cột vế phải b.' },
      { level: 2, text: 'Vector nghiệm là thứ ta đi tìm.' },
    ],
  },
  {
    id: 'eb-sys-substitution-steps',
    type: 'step-ordering',
    skillId: 'linear_system',
    dimension: 'compute',
    difficulty: 2,
    prompt: 'Sắp xếp các bước giải hệ 2 ẩn bằng phương pháp thế (substitution).',
    steps: [
      'Từ một phương trình, biểu diễn một ẩn theo ẩn còn lại',
      'Thế biểu thức đó vào phương trình kia để được phương trình một ẩn',
      'Giải phương trình một ẩn vừa thu được',
      'Thay giá trị tìm được ngược lại để tính ẩn còn lại',
    ],
    explain: 'Rút một ẩn → thế vào phương trình còn lại → giải một ẩn → thay ngược để tìm ẩn kia.',
    hints: [
      { level: 1, text: 'Mục tiêu đầu tiên là đưa về một phương trình chỉ còn một ẩn.' },
      { level: 2, text: 'Chỉ thay ngược lại sau khi đã có giá trị của một ẩn.' },
    ],
  },

  // --- gaussian_elimination -------------------------------------------------
  {
    id: 'eb-gauss-steps',
    type: 'step-ordering',
    skillId: 'gaussian_elimination',
    dimension: 'compute',
    difficulty: 3,
    prompt: 'Sắp xếp thứ tự các thao tác đưa hệ về dạng bậc thang bằng khử Gauss.',
    steps: [
      'Viết hệ dưới dạng ma trận bổ sung [A | b]',
      'Chọn pivot: phần tử khác 0 đầu tiên ở hàng và cột đang xét',
      'Cộng bội thích hợp của hàng pivot vào các hàng dưới để tạo số 0 dưới pivot',
      'Chuyển sang hàng–cột kế tiếp và lặp lại tới khi có dạng bậc thang',
      'Thế ngược (back-substitution) từ hàng cuối lên để tìm nghiệm',
    ],
    explain: 'Khử từ trên xuống theo từng pivot để tạo bậc thang, sau đó thế ngược để lấy nghiệm.',
    hints: [
      { level: 1, text: 'Bắt đầu bằng việc viết ma trận bổ sung.' },
      { level: 2, text: 'Tạo số 0 dưới pivot trước khi chuyển sang cột mới.' },
      { level: 3, text: 'Thế ngược là bước cuối cùng.' },
    ],
  },
  {
    id: 'eb-gauss-error',
    type: 'error-detection',
    skillId: 'gaussian_elimination',
    dimension: 'compute',
    difficulty: 3,
    prompt: 'Tìm dòng SAI trong bước khử Gauss dưới đây.',
    lines: [
      'Ma trận: hàng 1 = (1, 2 | 3), hàng 2 = (2, 5 | 8)',
      'Biến đổi: R2 → R2 − 2·R1',
      'Cột 1: 2 − 2·1 = 0;  Cột 2: 5 − 2·2 = 1',
      'Vế phải: 8 − 2·3 = 5',
    ],
    wrongLineIndex: 3,
    explain: '8 − 2·3 = 8 − 6 = 2, không phải 5 (có vẻ đã quên nhân 3 với 2). Hàng 2 đúng phải là (0, 1 | 2).',
    hints: [
      { level: 1, text: 'Áp dụng R2 − 2·R1 cho cả cột vế phải.' },
      { level: 2, text: 'Tính 2·3 trước, rồi mới lấy 8 trừ đi.' },
      { level: 3, text: '8 − 6 bằng bao nhiêu?' },
    ],
  },
  {
    id: 'eb-gauss-row-op',
    type: 'matrix-input',
    skillId: 'gaussian_elimination',
    dimension: 'compute',
    difficulty: 3,
    prompt: 'Cho ma trận bổ sung [[1, 3, 5], [2, 8, 14]]. Thực hiện R2 → R2 − 2·R1 và nhập ma trận kết quả (2×3).',
    rows: 2,
    cols: 3,
    answer: [
      [1, 3, 5],
      [0, 2, 4],
    ],
    tolerance: 0,
    explain: 'Hàng 1 giữ nguyên. Hàng 2 mới: (2−2·1, 8−2·3, 14−2·5) = (0, 2, 4).',
    hints: [
      { level: 1, text: 'Chỉ hàng 2 thay đổi; hàng 1 (pivot) giữ nguyên.' },
      { level: 2, text: 'Cột đầu của hàng 2: 2 − 2·1 = 0.' },
      { level: 3, text: 'Cột cuối: 14 − 2·5 = 4.' },
    ],
  },

  // --- solution_types -------------------------------------------------------
  {
    id: 'eb-soltype-inconsistent',
    type: 'multiple-choice',
    skillId: 'solution_types',
    dimension: 'concept',
    difficulty: 2,
    prompt: 'Khi khử Gauss xuất hiện một dòng dạng "0 = 3" (0 bằng một số khác 0), hệ có loại nghiệm nào?',
    options: ['Nghiệm duy nhất', 'Vô số nghiệm', 'Vô nghiệm', 'Đúng một nghiệm bằng 0'],
    answerIndex: 2,
    explain: 'Dòng "0 = số khác 0" là mâu thuẫn (không thể thỏa) nên hệ VÔ NGHIỆM (không nhất quán).',
    hints: [
      { level: 1, text: 'Có giá trị nào của các ẩn làm 0 = 3 đúng không?' },
      { level: 2, text: 'Một mâu thuẫn khiến hệ không có nghiệm nào.' },
    ],
  },
  {
    id: 'eb-soltype-free-var-tf',
    type: 'true-false',
    skillId: 'solution_types',
    dimension: 'concept',
    difficulty: 4,
    prompt: 'Đúng hay Sai?',
    statement: 'Một hệ phương trình tuyến tính NHẤT QUÁN có số ẩn nhiều hơn số phương trình độc lập thì có vô số nghiệm.',
    answer: true,
    explain: 'Khi nhất quán mà có ít nhất một ẩn tự do (thiếu pivot), ẩn tự do nhận vô số giá trị → vô số nghiệm.',
    hints: [
      { level: 1, text: 'Số ẩn nhiều hơn số pivot nghĩa là có "ẩn tự do".' },
      { level: 2, text: 'Ẩn tự do có thể nhận bất kỳ giá trị nào (miễn hệ nhất quán).' },
    ],
  },
  {
    id: 'eb-soltype-match',
    type: 'matching',
    skillId: 'solution_types',
    dimension: 'concept',
    difficulty: 4,
    prompt: 'Ghép mỗi tình huống khi khử Gauss với loại nghiệm tương ứng.',
    left: [
      'Mỗi ẩn đều có pivot, không có dòng mâu thuẫn',
      'Có ẩn tự do (thiếu pivot), không mâu thuẫn',
      'Xuất hiện dòng 0 = số khác 0',
    ],
    right: ['Vô nghiệm', 'Nghiệm duy nhất', 'Vô số nghiệm'],
    pairs: [
      [0, 1],
      [1, 2],
      [2, 0],
    ],
    explain: 'Đủ pivot & nhất quán → nghiệm duy nhất; có ẩn tự do & nhất quán → vô số nghiệm; có mâu thuẫn → vô nghiệm.',
    hints: [
      { level: 1, text: 'Dòng mâu thuẫn luôn dẫn tới vô nghiệm.' },
      { level: 2, text: 'Ẩn tự do là dấu hiệu của vô số nghiệm.' },
    ],
  },
];

// ---------------------------------------------------------------------------
// TỔNG HỢP
// ---------------------------------------------------------------------------

/** Toàn bộ ngân hàng bài tập cho Section 0–9. */
export const EXERCISES: Exercise[] = [
  ...SECTION0,
  ...SECTION1,
  ...SECTION2,
  ...SECTION3,
  ...SECTION4,
  ...SECTION5,
  ...SECTION6,
  ...SECTION7,
  ...SECTION8,
  ...SECTION9,
  ...VIDEO_TENSOR,
  ...SECTION10,
  ...SECTION11,
  ...SECTION12,
  ...SECTION13,
  ...moduleExercises,
];

/** Gom bài tập theo skillId (ổn định theo thứ tự khai báo trong EXERCISES). */
export const EXERCISES_BY_SKILL: Record<string, Exercise[]> = (() => {
  const map: Record<string, Exercise[]> = {};
  for (const ex of EXERCISES) {
    (map[ex.skillId] ??= []).push(ex);
  }
  return map;
})();

/**
 * Trộn bài TĨNH của nhiều skill theo kiểu round-robin (ổn định, KHÔNG random) để
 * mỗi skill được góp bài đều nhau. Trả về tối đa `max` bài, không trùng id.
 */
function pickStaticForSkills(skillIds: string[], max: number): Exercise[] {
  if (max <= 0) return [];
  const buckets = skillIds
    .map((id) => EXERCISES_BY_SKILL[id])
    .filter((b): b is Exercise[] => Array.isArray(b) && b.length > 0);
  if (buckets.length === 0) return [];

  const out: Exercise[] = [];
  const seen = new Set<string>();
  const maxLen = Math.max(...buckets.map((b) => b.length));

  for (let round = 0; round < maxLen && out.length < max; round++) {
    for (const bucket of buckets) {
      if (round >= bucket.length) continue;
      const ex = bucket[round];
      if (seen.has(ex.id)) continue;
      out.push(ex);
      seen.add(ex.id);
      if (out.length >= max) break;
    }
  }
  return out;
}

/**
 * Trộn bài của nhiều skill, tối đa `max` bài, không trùng id.
 *
 * • KHÔNG truyền `seed` → hành vi CŨ y nguyên: round-robin ổn định trên pool
 *   tĩnh (backward-compatible cho mọi chỗ gọi cũ).
 * • CÓ `seed` → LUYỆN KHÔNG LẶP: ưu tiên bài do generator sinh ra (số liệu mới
 *   theo seed) cho các skill có generator; còn thiếu thì bù bằng pool tĩnh đã
 *   `shuffle` theo cùng seed cho đỡ lặp giữa các phiên.
 */
export function getExercisesForSkills(
  skillIds: string[],
  max = 6,
  seed?: number,
): Exercise[] {
  if (max <= 0) return [];
  if (seed === undefined) return pickStaticForSkills(skillIds, max);

  const s = seed >>> 0;
  const out: Exercise[] = [];
  const seen = new Set<string>();

  // 1) Bài sinh động (nếu skill có generator).
  for (const ex of genExercisesForSkills(skillIds, max, s)) {
    if (seen.has(ex.id)) continue;
    out.push(ex);
    seen.add(ex.id);
    if (out.length >= max) return out.slice(0, max);
  }

  // 2) Bù bằng pool tĩnh, xáo theo seed cho đỡ lặp.
  const pool = shuffle(mulberry32(s), pickStaticForSkills(skillIds, max * 3));
  for (const ex of pool) {
    if (seen.has(ex.id)) continue;
    out.push(ex);
    seen.add(ex.id);
    if (out.length >= max) break;
  }
  return out.slice(0, max);
}

/**
 * Lấy bài tập cho một micro-lesson: map lesson → skillIds → bài (qua
 * getExercisesForSkills). Nếu không tìm được bài nào, fallback vài bài mẫu để
 * KHÔNG BAO GIỜ trả mảng rỗng khi còn cách tránh.
 */
export function getExercisesForLesson(
  lessonId: string,
  max = 6,
  seed?: number,
): Exercise[] {
  const skillIds = getMicroLesson(lessonId)?.skillIds ?? [];
  const picked = getExercisesForSkills(skillIds, max, seed);
  if (picked.length > 0) return picked;
  return SAMPLE_EXERCISES.slice(0, Math.max(0, Math.min(max, SAMPLE_EXERCISES.length)));
}
