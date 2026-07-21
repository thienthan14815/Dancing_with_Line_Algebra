// ===========================================================================
// BÀI TẬP MẪU cho giáo án _template.
// Mọi `skillId` PHẢI nằm trong `module.skills` (xem module.ts). Đề & đáp án tự
// soạn. Xem `src/core/exercises/types.ts` để biết đủ 8 dạng bài.
// ===========================================================================

import type { Exercise } from '../../../core/exercises/types';

export const exercises: Exercise[] = [
  // 1) Trắc nghiệm (multiple-choice)
  {
    id: 'tpl-mc-1',
    type: 'multiple-choice',
    skillId: 'tpl_intro', // ← phải khai báo trong module.skills
    dimension: 'concept',
    difficulty: 1,
    prompt: 'Một "content module" được thêm vào app bằng cách nào?',
    options: [
      'Sửa nhiều file trung tâm',
      'Thả một thư mục modules/<id>/ có module.ts',
      'Chạy lại toàn bộ build thủ công',
      'Chỉnh sửa cơ sở dữ liệu',
    ],
    answerIndex: 1,
    explain:
      'Chỉ cần thả thư mục modules/<id>/ chứa module.ts; registry tự nạp và merge vào mọi nơi.',
    hints: [
      { level: 1, text: 'Không cần đụng tới file trung tâm.' },
      { level: 2, text: 'Mọi thứ nằm trong một thư mục module.' },
    ],
  },

  // 2) Nhập số (numeric-input)
  {
    id: 'tpl-num-1',
    type: 'numeric-input',
    skillId: 'tpl_apply',
    dimension: 'compute',
    difficulty: 1,
    prompt: 'num tối thiểu hợp lệ cho một content module mới là bao nhiêu?',
    answer: 14,
    tolerance: 0,
    explain: 'Dải 0..13 dành cho 14 chương gốc, nên module mới nên dùng num ≥ 14.',
    hints: [
      { level: 1, text: '14 chương gốc chiếm num 0..13.' },
      { level: 2, text: 'Chọn số ngay sau dải đó.' },
    ],
  },

  // 3) Đúng/Sai (true-false)
  {
    id: 'tpl-tf-1',
    type: 'true-false',
    skillId: 'tpl_apply',
    dimension: 'concept',
    difficulty: 2,
    prompt: 'Đúng hay Sai?',
    statement:
      'Xóa thư mục modules/<id>/ sẽ gỡ giáo án khỏi Learning Path, Sổ tay và ngân hàng bài tập.',
    answer: true,
    explain:
      'Registry chỉ nạp các thư mục đang tồn tại; xóa thư mục là gỡ toàn bộ dấu vết của giáo án.',
    hints: [{ level: 1, text: 'Nạp nội dung dựa trên các thư mục hiện có.' }],
  },
];
