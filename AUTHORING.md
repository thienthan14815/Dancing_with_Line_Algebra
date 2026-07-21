# Viết giáo án cho LinAlgLab — Content Module (plugin)

Hệ thống **Content Module** cho phép **thêm/gỡ một giáo án chỉ bằng cách thả/xóa
MỘT thư mục**, KHÔNG cần sửa bất kỳ file trung tâm nào. Một giáo án hợp lệ sẽ tự
xuất hiện trên **Learning Path**, **Roadmap**, **Sổ tay**, **Practice** và **ngân
hàng bài tập**.

- Thả thư mục `src/content/modules/<id>/` (có `module.ts`) → giáo án xuất hiện.
- Xóa thư mục đó → giáo án biến mất.
- Đổi cờ `enabled` → bật/tắt nhanh mà không xóa.

Nếu manifest sai, **validator** báo lỗi rõ ràng ở console (chế độ dev) và **bỏ qua
riêng giáo án lỗi** — app vẫn chạy bình thường.

---

## 1. Thêm một giáo án trong 4 bước

1. **Sao chép** thư mục mẫu:
   ```
   src/content/modules/_template/  →  src/content/modules/<id-của-bạn>/
   ```
   (PowerShell: `Copy-Item -Recurse src/content/modules/_template src/content/modules/xac-suat`)

2. **Mở** `src/content/modules/<id>/module.ts` và sửa các trường:
   `id`, `num` (≥ 14), `title`, `subtitle`, `skills`, `lessons`, `exercises`,
   `guide`.

3. **Đặt** `enabled: true`.

4. **Xong.** Chạy `npm run dev` — giáo án tự xuất hiện. Chạy `npx tsc -b` để chắc
   chắn không có lỗi kiểu.

> Bài tập mẫu nằm ở `exercises.ts`; component deep-dive (tùy chọn) ở
> `lessons/*.tsx`. Cứ sửa theo nhu cầu.

## Gỡ một giáo án

Xóa thư mục `src/content/modules/<id>/` — hoặc đặt `enabled: false` để ẩn tạm.

---

## 2. Cấu trúc thư mục một giáo án

```
src/content/modules/<id>/
├── module.ts          # BẮT BUỘC — manifest, default export ContentModule
├── exercises.ts       # (khuyến nghị) mảng Exercise[], import vào module.ts
└── lessons/
    └── demo.tsx       # (tùy chọn) component deep-dive nhận { lessonId }
```

Chỉ `module.ts` là bắt buộc. `exercises`/`lessons` chỉ là cách tổ chức gợi ý.

---

## 3. Bảng mô tả mọi trường của `ContentModule`

| Trường         | Kiểu                         | Bắt buộc | Ý nghĩa |
|----------------|------------------------------|:--------:|---------|
| `id`           | `string`                     | ✅       | Định danh DUY NHẤT. Không trùng nhau và không trùng chương gốc `ch0..ch13`. |
| `num`          | `number`                     | ✅       | Số thứ tự hiển thị & sắp xếp. **PHẢI ≥ 14** (0..13 dành cho 14 chương gốc). |
| `track`        | `string`                     | ✅       | Nhóm máy đọc, vd `'linear-algebra' | 'deep-learning' | 'extra'`. |
| `trackTitle`   | `string`                     | –        | Tên track hiển thị (tùy chọn). |
| `title`        | `string`                     | ✅       | Tiêu đề tiếng Việt. |
| `en`           | `string`                     | –        | Tên tiếng Anh (mặc định lấy `title`). |
| `subtitle`     | `string`                     | ✅       | Mô tả ngắn 1 dòng. |
| `enabled`      | `boolean`                    | –        | Mặc định `true`. `false` = ẩn giáo án. |
| `prerequisites`| `string[]`                   | –        | id các section cần đạt ≥ 60% để mở khóa (soft-lock). |
| `skills`       | `{ id; name }[]`             | ✅       | Skill do module tự khai báo. **Mọi skillId dùng ở lesson/exercise phải có ở đây.** |
| `lessons`      | `ModuleLesson[]`             | ✅       | Danh sách bài học (xem bảng dưới). |
| `exercises`    | `Exercise[]`                 | ✅       | Ngân hàng bài tập (nạp EAGER — đồng bộ). Có thể để `[]`. |
| `guide`        | `ModuleGuide`                | –        | Nội dung Sổ tay (đúng shape `GuideEntry`). |

### `ModuleLesson`

| Trường      | Kiểu                                                   | Bắt buộc | Ý nghĩa |
|-------------|--------------------------------------------------------|:--------:|---------|
| `id`        | `string`                                               | ✅       | id ngắn, duy nhất trong module. vd `'intro'`. |
| `title`     | `string`                                               | ✅       | Tiêu đề hiển thị. |
| `kind`      | `'concept' | 'practice' | 'review' | 'challenge'`       | ✅       | Loại bài (quyết định icon/nhãn). |
| `skillIds`  | `string[]`                                             | ✅       | Skill bài rèn — phải nằm trong `skills` của module. |
| `component` | `() => Promise<{ default: React.FC<{lessonId}> }>`     | –        | Bài trực quan tương tác cho route `#/ch/<id>/<lessonId>`. Dùng dynamic import. |

> Mỗi `ModuleLesson` được bung thành **1 Unit** gồm 2 micro-lesson:
> **Khái niệm** (có nút deep-dive nếu khai báo `component`) và **Luyện tập** (tự
> rút bài từ ngân hàng theo `skillIds`).

### `guide` (ModuleGuide)

Dùng đúng shape `GuideEntry` của Sổ tay nhưng **được phép bỏ** `id`, `nameVi`,
`nameEn` (loader tự điền từ manifest: `id = module.id`, `nameVi = title`,
`nameEn = en ?? title`). Các trường: `concepts[]`, `symbols[]`, `formulas[]`,
`intuition`, `example`, `pitfalls[]`, `applications[]`.

---

## 4. Quy tắc BẮT BUỘC (nếu vi phạm → validator bỏ qua giáo án)

1. **`id` duy nhất** — không trùng module khác, không trùng chương gốc
   (`ch0-foundations` … `ch13-optimization-apps`, và dải id `ch0..ch13`).
2. **`num` duy nhất** giữa các module. **Nên ≥ 14** (num < 14 chỉ là *cảnh báo*
   nhưng lấn dải chương gốc — tránh dùng).
3. **Khai báo skill trước khi dùng** — mọi `skillIds` (ở lesson) và `skillId`
   (ở exercise) phải xuất hiện trong `module.skills`.
4. **`kind` hợp lệ** — chỉ `concept | practice | review | challenge`.
5. **`component` phải là function** (nếu có) — kiểu
   `() => import('./lessons/xxx')`.
6. **TeX một backslash → nhân đôi trong string literal.** Vì chuỗi TeX nằm trong
   string JS: viết `'\\vec{v}'` để KaTeX nhận `\vec{v}`; viết `'\\\\'` để nhận
   `\\` (xuống dòng trong matrix/cases).

---

## 5. Ví dụ đầy đủ (rút gọn)

```ts
// src/content/modules/xac-suat/module.ts
import type { ContentModule } from '../../types';
import { exercises } from './exercises';

const module: ContentModule = {
  id: 'ext-probability',
  num: 14,
  track: 'extra',
  trackTitle: 'Giáo án mở rộng',
  title: 'Xác suất cho ML',
  en: 'Probability for ML',
  subtitle: 'Biến ngẫu nhiên, kỳ vọng, hiệp phương sai',
  enabled: true,
  prerequisites: ['ch9-quadratic'],
  skills: [
    { id: 'prob_random_var', name: 'Biến ngẫu nhiên (Random variable)' },
    { id: 'prob_expectation', name: 'Kỳ vọng & phương sai (Expectation)' },
  ],
  lessons: [
    {
      id: 'random-var',
      title: 'Biến ngẫu nhiên',
      kind: 'concept',
      skillIds: ['prob_random_var'],
      component: () => import('./lessons/randomVar'), // deep-dive (tùy chọn)
    },
    {
      id: 'expectation',
      title: 'Kỳ vọng & phương sai',
      kind: 'practice',
      skillIds: ['prob_expectation'],
    },
  ],
  exercises,
  guide: {
    concepts: ['Biến ngẫu nhiên gán số cho mỗi kết cục.'],
    symbols: [{ tex: 'E[X]', desc: 'Kỳ vọng của X' }],
    formulas: [{ tex: 'E[X] = \\sum_i x_i p_i', desc: 'Kỳ vọng rời rạc' }],
    intuition: 'Kỳ vọng là "trung bình có trọng số theo xác suất".',
    example: { text: 'Xúc xắc công bằng: E[X] = 3.5.' },
    pitfalls: ['Nhầm E[X²] với (E[X])².'],
    applications: ['Hàm mất mát kỳ vọng trong ML.'],
  },
};

export default module;
```

```ts
// src/content/modules/xac-suat/exercises.ts
import type { Exercise } from '../../../core/exercises/types';

export const exercises: Exercise[] = [
  {
    id: 'prob-ev-dice',
    type: 'numeric-input',
    skillId: 'prob_expectation', // phải có trong module.skills
    dimension: 'compute',
    difficulty: 1,
    prompt: 'Kỳ vọng khi tung một xúc xắc 6 mặt công bằng?',
    answer: 3.5,
    tolerance: 0.01,
    explain: 'E[X] = (1+2+3+4+5+6)/6 = 3.5.',
    hints: [{ level: 1, text: 'Trung bình cộng của 1..6.' }],
  },
];
```

Xem đủ 8 dạng bài (multiple-choice, numeric-input, matrix-input, matching,
step-ordering, vector-drawing, error-detection, true-false) trong
`src/core/exercises/types.ts`.

---

## 6. Đọc lỗi từ validator

Ở chế độ dev (`npm run dev`), lỗi in ra console theo dạng:

```
[content-module] <id>: <mô tả lỗi>
```

Ví dụ thực tế:

```
[content-module] ext-probability: lesson "expectation" tham chiếu skill lạ
  "prob_expectatoin" (chưa khai báo trong module.skills)
```

→ Sửa lỗi chính tả `prob_expectatoin` thành `prob_expectation` (hoặc khai báo
skill đó trong `skills`).

Các loại lỗi (module BỊ BỎ QUA cho tới khi sửa):

| Thông báo chứa…                         | Nguyên nhân |
|-----------------------------------------|-------------|
| `thiếu trường "…"`                      | Thiếu field bắt buộc. |
| `id "…" trùng với một module khác`      | Hai module trùng `id`. |
| `id "…" trùng id chương gốc`            | `id` trùng `ch0..ch13`. |
| `num … trùng với một module khác`       | Hai module trùng `num`. |
| `num … < 14`  *(cảnh báo)*              | Lấn dải chương gốc — vẫn nạp nhưng nên đổi. |
| `kind không hợp lệ`                     | `kind` không thuộc 4 giá trị cho phép. |
| `… tham chiếu skill lạ "…"`             | `skillIds` của lesson chưa khai báo trong `skills`. |
| `… có skillId lạ "…"`                   | `skillId` của exercise chưa khai báo trong `skills`. |
| `… "component" không phải function`     | `component` không phải hàm trả về `import()`. |

Muốn kiểm nhanh bằng code (không cần chạy app), gọi:

```ts
import { validateModules } from './src/content/registry';
console.log(validateModules([myModule])); // → mảng chuỗi lỗi/cảnh báo
```

---

## 7. Ghi chú kỹ thuật

- **Không tạo vòng lặp import.** `src/content/registry.ts` chỉ phụ thuộc `types`,
  `ModuleChapter` và các import *type-only*. Các file lõi import **TỪ** nó, không
  ngược lại. Vì vậy validator kiểm skill theo **skills khai báo trong module** —
  hãy khai báo đủ skill trong `module.skills`.
- **Nạp EAGER:** `exercises` được nạp đồng bộ (bundle chung). Chỉ `component`
  deep-dive mới nên dùng dynamic `import()` để tách chunk.
- 5 điểm tổng hợp mà module tự merge vào (chỉ để tham khảo, **không cần sửa**):
  `src/chapters/registry.ts`, `src/core/content/course.ts`,
  `src/core/content/skills.ts`, `src/core/content/exerciseBank.ts`,
  `src/app/guidebook/content.ts`.
