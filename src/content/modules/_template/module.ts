// ===========================================================================
// GIÁO ÁN MẪU (_template) — SAO CHÉP thư mục này để tạo giáo án mới.
// ---------------------------------------------------------------------------
// CÁCH DÙNG NHANH:
//   1. Copy thư mục `_template` → `modules/<id-của-bạn>/`.
//   2. Sửa `id`, `num` (≥ 14), `title`, `subtitle`, `skills`, `lessons`, ...
//   3. Đặt `enabled: true`.
//   4. Xong — giáo án tự xuất hiện ở Learning Path, Roadmap, Sổ tay, Practice.
//
// Giữ `enabled: false` để giáo án MẪU này KHÔNG hiển thị trong app thật.
// Xem AUTHORING.md ở gốc dự án để biết chi tiết mọi trường & quy tắc.
// ===========================================================================

import type { ContentModule } from '../../types';
import { exercises } from './exercises';

const module: ContentModule = {
  // --- Định danh ------------------------------------------------------------
  id: '_template', // DUY NHẤT; không trùng ch0..ch13 và các module khác.
  num: 90, // ≥ 14. Quyết định thứ tự trên Learning Path/Roadmap.
  track: 'extra', // Nhóm máy đọc: 'linear-algebra' | 'deep-learning' | 'extra' | ...
  trackTitle: 'Giáo án mở rộng', // (tùy chọn) tên track hiển thị.

  // --- Hiển thị -------------------------------------------------------------
  title: 'Giáo án mẫu', // Tên tiếng Việt.
  en: 'Template Module', // (tùy chọn) tên tiếng Anh.
  subtitle: 'Khung mẫu để tạo giáo án plugin chỉ bằng một thư mục', // 1 dòng.

  enabled: false, // false = ẩn. Đặt true cho giáo án thật.

  // --- Phụ thuộc (soft-lock) ------------------------------------------------
  // Mở khóa khi các section này đạt ≥ 60%. Để [] nếu không cần.
  prerequisites: [],

  // --- Skill do module tự khai báo -----------------------------------------
  // Mọi skillId dùng ở lessons/exercises PHẢI có mặt ở đây (nếu không validator
  // sẽ báo "skill lạ" và BỎ QUA module).
  skills: [
    { id: 'tpl_intro', name: 'Nhập môn giáo án mẫu (Template intro)' },
    { id: 'tpl_apply', name: 'Áp dụng giáo án mẫu (Template apply)' },
  ],

  // --- Bài học --------------------------------------------------------------
  // Mỗi lesson → 1 Unit gồm micro-lesson "Khái niệm" (+ deep-dive nếu có
  // `component`) và micro-lesson "Luyện tập" (tự rút bài theo skillIds).
  lessons: [
    {
      id: 'intro',
      title: 'Giới thiệu module',
      kind: 'concept', // concept | practice | review | challenge
      skillIds: ['tpl_intro'], // phải nằm trong skills ở trên
      // Deep-dive tương tác (tùy chọn) — dynamic import để tách bundle.
      component: () => import('./lessons/demo'),
    },
    {
      id: 'apply',
      title: 'Áp dụng & luyện tập',
      kind: 'practice',
      skillIds: ['tpl_apply'],
      // Không có `component` → micro-lesson khái niệm hiển thị placeholder gọn.
    },
  ],

  // --- Ngân hàng bài tập (nạp EAGER) ---------------------------------------
  exercises,

  // --- Sổ tay (tùy chọn) ----------------------------------------------------
  // Dùng ĐÚNG shape GuideEntry; có thể bỏ id/nameVi/nameEn (loader tự điền).
  // LƯU Ý TeX: trong string literal, backslash phải NHÂN ĐÔI ('\\vec{v}').
  guide: {
    concepts: [
      'Content module là giáo án dạng plugin: một thư mục = một giáo án.',
      'Registry tự nạp, validator tự kiểm, 5 điểm tổng hợp tự merge.',
      'Xóa thư mục = gỡ giáo án; đổi enabled = bật/tắt nhanh.',
    ],
    symbols: [
      { tex: '\\text{module.ts}', desc: 'Manifest (default export ContentModule)' },
      { tex: '\\ge 14', desc: 'Miền num hợp lệ cho giáo án mới' },
    ],
    formulas: [
      {
        tex: '\\text{1 thư mục} \\;\\Rightarrow\\; \\text{Path + Roadmap + Sổ tay + Practice}',
        desc: 'Thả thư mục là nội dung tự lan tỏa khắp app',
      },
    ],
    intuition:
      'Coi mỗi giáo án như một "hộp" khép kín: tự khai báo skill, bài học, bài tập và sổ tay của riêng nó.',
    example: {
      text: 'Đặt num = 14, khai báo 2 skill, 2 lesson là đã có một giáo án chạy được.',
    },
    pitfalls: [
      'Quên khai báo skill trong module.skills nhưng lại dùng ở lesson/exercise.',
      'Đặt num < 14 (đè lên dải chương gốc) — chỉ là cảnh báo nhưng nên tránh.',
      'Viết TeX với một backslash trong string literal (phải nhân đôi).',
    ],
    applications: [
      'Thêm chuyên đề mở rộng (xác suất, tối ưu, đồ họa…) không đụng lõi.',
      'Bật/tắt giáo án theo mùa học chỉ bằng cờ enabled.',
    ],
  },
};

export default module;
