// ===========================================================================
// FILE 2 — ĐẦU RA của pipeline soạn giáo án.
// ---------------------------------------------------------------------------
// File này do skill `/giao-an` SINH RA (ghi đè). Đây chỉ là một MẪU hợp lệ để
// bạn hình dung kết quả. Nội dung thật sẽ được tạo từ `1-raw-input.md`.
//
// CÁCH DÙNG:
//   Copy nguyên file này sang `src/content/modules/<id>/module.ts` là CHẠY.
//   (đổi tên file thành `module.ts`, đặt đúng thư mục theo `id`).
//
// LƯU Ý ĐƯỜNG DẪN IMPORT:
//   Import dưới đây là `../../types` — ĐÚNG cho vị trí ĐÍCH
//   `src/content/modules/<id>/module.ts` (đi lên 2 cấp tới `src/content/`), y
//   hệt cách `_template/module.ts` import. Thư mục `content-pipeline/` KHÔNG nằm
//   trong `tsconfig` (chỉ `["src"]`) nên file ở đây không bị type-check tại chỗ;
//   nó chỉ được biên dịch sau khi copy vào một module folder — nơi `../../types`
//   là đường dẫn đúng. Nhờ vậy "copy là chạy", không cần sửa import.
//
// LƯU Ý TeX: backslash trong string literal phải NHÂN ĐÔI ('\\vec{v}').
// ===========================================================================

import type { ContentModule } from '../../types';

const module: ContentModule = {
  // --- Định danh (lấy từ METADATA của 1-raw-input.md) -----------------------
  id: 'ext-vector-norm', // DUY NHẤT; không trùng ch0..ch13 và module khác.
  num: 14, // ≥ 14.
  track: 'extra',
  trackTitle: 'Giáo án mở rộng',

  // --- Hiển thị -------------------------------------------------------------
  title: 'Chuẩn, khoảng cách & tích vô hướng',
  en: 'Norms, Distance & Dot Product',
  subtitle: 'Đo độ dài vector, khoảng cách Euclid và góc giữa hai vector',

  enabled: true,

  // --- Phụ thuộc (soft-lock) — để [] nếu không cần --------------------------
  prerequisites: [],

  // --- Skill do module tự khai báo (MỌI skillId dùng phải có ở đây) ---------
  skills: [
    { id: 'vec_norm', name: 'Chuẩn (độ dài) vector — Norm' },
    { id: 'vec_distance', name: 'Khoảng cách Euclid — Distance' },
    { id: 'vec_dot', name: 'Tích vô hướng & góc — Dot product' },
    { id: 'vec_unit', name: 'Vector đơn vị & chuẩn hóa — Unit vector' },
  ],

  // --- Bài học (dạng exercise-only: không cần component) --------------------
  lessons: [
    {
      id: 'norm',
      title: 'Chuẩn và độ dài vector',
      kind: 'concept',
      skillIds: ['vec_norm'],
    },
    {
      id: 'distance',
      title: 'Khoảng cách Euclid',
      kind: 'practice',
      skillIds: ['vec_distance'],
    },
    {
      id: 'dot',
      title: 'Tích vô hướng & góc giữa hai vector',
      kind: 'concept',
      skillIds: ['vec_dot'],
    },
    {
      id: 'unit',
      title: 'Chuẩn hóa về vector đơn vị',
      kind: 'practice',
      skillIds: ['vec_unit'],
    },
  ],

  // --- Ngân hàng bài tập (inline, nạp EAGER) --------------------------------
  exercises: [
    // 1) numeric-input — chuẩn của (3,4)
    {
      id: 'vn-norm-34',
      type: 'numeric-input',
      skillId: 'vec_norm',
      dimension: 'compute',
      difficulty: 1,
      prompt: 'Tính chuẩn (độ dài) của vector v = (3, 4). Nhập ‖v‖.',
      answer: 5,
      tolerance: 0.001,
      explain: '‖v‖ = √(3² + 4²) = √(9 + 16) = √25 = 5.',
      hints: [
        { level: 1, text: 'Dùng √(x² + y²).' },
        { level: 2, text: '3² + 4² = 25.' },
      ],
    },

    // 2) multiple-choice — chuẩn của (6,8)
    {
      id: 'vn-norm-68-mc',
      type: 'multiple-choice',
      skillId: 'vec_norm',
      dimension: 'compute',
      difficulty: 1,
      prompt: 'Chuẩn của vector (6, 8) bằng bao nhiêu?',
      options: ['10', '14', '48', '100'],
      answerIndex: 0,
      explain: '‖(6,8)‖ = √(36 + 64) = √100 = 10.',
      hints: [{ level: 1, text: '√(6² + 8²).' }],
    },

    // 3) numeric-input — khoảng cách Euclid
    {
      id: 'vn-dist-euclid',
      type: 'numeric-input',
      skillId: 'vec_distance',
      dimension: 'compute',
      difficulty: 2,
      prompt: 'Khoảng cách Euclid giữa hai điểm A(1, 1) và B(4, 5) là bao nhiêu?',
      answer: 5,
      tolerance: 0.001,
      explain: 'd = √((4−1)² + (5−1)²) = √(9 + 16) = √25 = 5.',
      hints: [
        { level: 1, text: 'd = ‖B − A‖.' },
        { level: 2, text: 'Hiệu tọa độ là (3, 4).' },
      ],
    },

    // 4) numeric-input — tích vô hướng
    {
      id: 'vn-dot-value',
      type: 'numeric-input',
      skillId: 'vec_dot',
      dimension: 'compute',
      difficulty: 1,
      prompt: 'Tính tích vô hướng (3, 4) · (1, 2).',
      answer: 11,
      tolerance: 0.001,
      explain: '(3)(1) + (4)(2) = 3 + 8 = 11.',
      hints: [{ level: 1, text: 'Nhân từng cặp thành phần rồi cộng lại.' }],
    },

    // 5) true-false — vuông góc ⇒ dot = 0
    {
      id: 'vn-dot-perp-tf',
      type: 'true-false',
      skillId: 'vec_dot',
      dimension: 'concept',
      difficulty: 2,
      prompt: 'Đúng hay Sai?',
      statement: 'Tích vô hướng của hai vector khác 0 và vuông góc với nhau luôn bằng 0.',
      answer: true,
      explain: 'u · v = ‖u‖‖v‖cosθ; khi θ = 90° thì cosθ = 0 nên u · v = 0.',
      hints: [{ level: 1, text: 'Nghĩ tới u · v = ‖u‖‖v‖cosθ.' }],
    },

    // 6) numeric-input — cos góc giữa hai trục
    {
      id: 'vn-dot-cos90',
      type: 'numeric-input',
      skillId: 'vec_dot',
      dimension: 'concept',
      difficulty: 2,
      prompt: 'cos của góc giữa (1, 0) và (0, 1) bằng bao nhiêu?',
      answer: 0,
      tolerance: 0.001,
      explain: 'cosθ = (u · v)/(‖u‖‖v‖) = 0/(1·1) = 0 (hai vector vuông góc).',
      hints: [{ level: 1, text: 'Tính u · v trước.' }],
    },

    // 7) vector-drawing — vector đơn vị của (3,4)
    {
      id: 'vn-unit-draw',
      type: 'vector-drawing',
      skillId: 'vec_unit',
      dimension: 'visual',
      difficulty: 2,
      prompt: 'Vẽ vector đơn vị cùng hướng với (3, 4).',
      target: [0.6, 0.8],
      tolerance: 0.08,
      explain: '(3, 4)/‖(3,4)‖ = (3/5, 4/5) = (0.6, 0.8).',
      hints: [
        { level: 1, text: 'Chia mỗi thành phần cho ‖v‖ = 5.' },
        { level: 2, text: '(3/5, 4/5).' },
      ],
    },

    // 8) matrix-input — chuẩn hóa (0,5) thành cột 2×1
    {
      id: 'vn-unit-matrix',
      type: 'matrix-input',
      skillId: 'vec_unit',
      dimension: 'compute',
      difficulty: 2,
      prompt: 'Chuẩn hóa vector cột (0; 5) thành vector đơn vị (điền 2 ô).',
      rows: 2,
      cols: 1,
      answer: [[0], [1]],
      tolerance: 0.001,
      explain: '‖(0,5)‖ = 5, nên (0/5, 5/5) = (0, 1).',
      hints: [{ level: 1, text: 'Chuẩn của (0,5) là 5.' }],
    },

    // 9) matching — ghép vector với chuẩn của nó
    {
      id: 'vn-norm-match',
      type: 'matching',
      skillId: 'vec_norm',
      dimension: 'compute',
      difficulty: 2,
      prompt: 'Ghép mỗi vector với chuẩn (độ dài) tương ứng.',
      left: ['(3, 4)', '(5, 12)', '(8, 15)'],
      right: ['13', '5', '17'],
      pairs: [
        [0, 1],
        [1, 0],
        [2, 2],
      ],
      explain: '‖(3,4)‖=5; ‖(5,12)‖=√169=13; ‖(8,15)‖=√289=17.',
      hints: [{ level: 1, text: 'Tất cả đều là bộ ba Pythagoras.' }],
    },

    // 10) step-ordering — quy trình chuẩn hóa
    {
      id: 'vn-unit-steps',
      type: 'step-ordering',
      skillId: 'vec_unit',
      dimension: 'explain',
      difficulty: 2,
      prompt: 'Sắp xếp các bước để chuẩn hóa một vector về vector đơn vị.',
      steps: [
        'Tính chuẩn ‖v‖ = √(v₁² + v₂²).',
        'Chia từng thành phần của v cho ‖v‖.',
        'Thu được vector đơn vị v̂ có độ dài bằng 1.',
      ],
      explain: 'Chuẩn hóa = tính độ dài rồi chia mỗi thành phần cho độ dài đó.',
      hints: [{ level: 1, text: 'Phải biết độ dài trước khi chia.' }],
    },

    // 11) error-detection — tìm dòng sai khi tính chuẩn
    {
      id: 'vn-norm-error',
      type: 'error-detection',
      skillId: 'vec_norm',
      dimension: 'explain',
      difficulty: 3,
      prompt: 'Tìm DÒNG SAI trong lời giải tính chuẩn của v = (3, 4).',
      lines: [
        'Cần tính ‖v‖ với v = (3, 4).',
        '‖v‖² = 3² + 4² = 9 + 16 = 25.',
        '‖v‖ = 25.',
        'Vậy độ dài của v là 25.',
      ],
      wrongLineIndex: 2,
      explain: 'Sai ở bước lấy căn: ‖v‖ = √25 = 5, không phải 25 (quên căn bậc hai).',
      hints: [{ level: 1, text: 'So sánh ‖v‖² và ‖v‖.' }],
    },
  ],

  // --- Sổ tay (tùy chọn) ----------------------------------------------------
  guide: {
    concepts: [
      'Chuẩn ‖v‖ là độ dài của vector, đo bằng định lý Pythagoras.',
      'Khoảng cách giữa hai điểm là chuẩn của hiệu hai vector: d = ‖B − A‖.',
      'Tích vô hướng u · v = ‖u‖‖v‖cosθ nối độ dài với góc; bằng 0 ⇔ vuông góc.',
      'Vector đơn vị v̂ = v/‖v‖ giữ hướng nhưng có độ dài 1.',
    ],
    symbols: [
      { tex: '\\lVert v \\rVert', desc: 'Chuẩn (độ dài) của vector v' },
      { tex: 'u \\cdot v', desc: 'Tích vô hướng của u và v' },
      { tex: '\\hat{v}', desc: 'Vector đơn vị cùng hướng với v' },
    ],
    formulas: [
      {
        tex: '\\lVert v \\rVert = \\sqrt{v_1^2 + v_2^2}',
        desc: 'Chuẩn Euclid trong mặt phẳng',
      },
      {
        tex: 'u \\cdot v = \\lVert u \\rVert\\, \\lVert v \\rVert \\cos\\theta',
        desc: 'Liên hệ tích vô hướng với góc giữa hai vector',
      },
      {
        tex: '\\hat{v} = \\dfrac{v}{\\lVert v \\rVert}',
        desc: 'Chuẩn hóa vector về độ dài 1',
      },
    ],
    intuition:
      'Chuẩn là "cây thước" đo mũi tên; tích vô hướng cho biết hai mũi tên "cùng chiều" tới mức nào.',
    example: {
      text: 'Với v = (3, 4): ‖v‖ = 5 và vector đơn vị là (0.6, 0.8).',
      tex: '\\hat{v} = \\tfrac{1}{5}(3, 4) = (0.6,\\ 0.8)',
    },
    pitfalls: [
      'Quên lấy căn bậc hai: nhầm ‖v‖² với ‖v‖.',
      'Nhầm tích vô hướng (ra một số) với tổng vector (ra một vector).',
      'Chuẩn hóa nhưng chia cho chuẩn bình phương thay vì chuẩn.',
    ],
    applications: [
      'Chuẩn hóa đặc trưng (feature) trước khi đưa vào mô hình ML.',
      'Cosine similarity dùng tích vô hướng để so độ giống của hai vector.',
    ],
  },
};

export default module;
