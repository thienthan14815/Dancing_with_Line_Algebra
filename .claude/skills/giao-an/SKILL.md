---
name: giao-an
description: >-
  Chuyển nội dung thô ở content-pipeline/1-raw-input.md (METADATA + DÀN Ý +
  TRANSCRIPT) thành một ContentModule hợp lệ cho app LinAlgLab, ghi ra
  content-pipeline/2-output-module.ts. Kích hoạt bằng /giao-an, hoặc khi người
  dùng nói "tạo giáo án từ raw", "biến transcript thành giáo án/module",
  "soạn giáo án từ 1-raw-input", "generate ContentModule từ transcript".
---

# Skill: giao-an — soạn ContentModule từ raw input

Mục tiêu: đọc `content-pipeline/1-raw-input.md`, sinh MỘT `ContentModule` GỐC,
đúng định dạng plugin của LinAlgLab, rồi GHI ĐÈ `content-pipeline/2-output-module.ts`.
Người dùng chỉ cần copy file đầu ra sang `src/content/modules/<id>/module.ts` là chạy.

## Bối cảnh bắt buộc đọc trước khi sinh

1. `content-pipeline/1-raw-input.md` — nguồn nội dung (METADATA front-matter,
   mục `## DÀN Ý / GHI CHÚ`, mục `## TRANSCRIPT`).
2. `AUTHORING.md` (gốc dự án) — bảng mọi trường + quy tắc validator.
3. `src/content/types.ts` — interface `ContentModule` / `ModuleLesson` / `ModuleGuide`.
4. `src/core/exercises/types.ts` — 8 dạng Exercise và shape chính xác.
5. `content-pipeline/2-output-module.ts` (mẫu hiện có) — bám sát cấu trúc & phong cách.

Đọc cả 5 file này TRƯỚC khi viết bất cứ dòng nào.

## Quy trình

### Bước 1 — Đọc & trích METADATA
Từ front-matter của `1-raw-input.md` lấy: `id`, `num`, `title`, `track`
(mặc định `extra`), `subtitle`, `level` (nếu có), `source_url` (nếu có).

- **Nếu thiếu `id`**: đề xuất một id `kebab-case` có tiền tố `ext-` suy từ title
  (vd `ext-vector-norm`), rồi HỎI người dùng xác nhận hoặc tự dùng nếu người dùng
  bảo cứ tự quyết.
- **Nếu thiếu/không hợp lệ `num`** (phải là số **≥ 14**): CẢNH BÁO, đề xuất `14`
  (hoặc số trống kế tiếp) và hỏi/tự quyết.
- **Nếu thiếu `subtitle`/`title`**: tự soạn ngắn gọn từ nội dung, báo cho người dùng biết.
- Không bịa `source_url`; để trống nếu raw không có.

### Bước 2 — Thiết kế nội dung học (bám DÀN Ý > TRANSCRIPT)
- Ưu tiên bám `## DÀN Ý / GHI CHÚ` nếu người dùng đã viết; dùng `## TRANSCRIPT`
  để bổ sung chi tiết/ví dụ. Nếu DÀN Ý trống, tự rút bố cục từ TRANSCRIPT.
- Chia thành **3–6 micro-lesson** (mỗi phần là một `ModuleLesson`), xen kẽ
  `concept` và `practice` (có thể thêm `review`/`challenge`). Mỗi lesson có
  `id` ngắn duy nhất trong module, `title`, `kind` hợp lệ, `skillIds`.
- Lessons dạng **exercise-only** (không cần `component`) là HỢP LỆ — mặc định
  không tạo component trừ khi người dùng yêu cầu bài trực quan.

### Bước 3 — Khai báo skills rồi khớp mọi tham chiếu
- Tạo `skills: { id, name }[]` với `id` **snake_case** ổn định (vd `vec_norm`).
- MỌI `skillIds` ở lesson và MỌI `skillId` ở exercise **phải** nằm trong
  `module.skills` — nếu không validator bỏ qua module. Rà lại một lượt cuối.

### Bước 4 — Soạn 6–12 Exercise GỐC
- Dùng **vài dạng khác nhau** trong 8 dạng: `multiple-choice`, `numeric-input`,
  `matrix-input`, `matching`, `step-ordering`, `vector-drawing`,
  `error-detection`, `true-false`.
- Mỗi bài đủ trường theo `src/core/exercises/types.ts`:
  - chung: `id` (duy nhất), `type`, `skillId`, `dimension`
    (`concept|compute|visual|explain`), `difficulty` (1–4), `hints: {level,text}[]`
    (ít nhất 1 hint), `prompt`.
  - riêng theo type: `multiple-choice` {options, answerIndex, explain};
    `numeric-input` {answer, tolerance?, explain?}; `matrix-input`
    {rows, cols, answer:number[][], tolerance?}; `matching`
    {left, right, pairs:[number,number][]}; `step-ordering` {steps đúng thứ tự};
    `vector-drawing` {target:[x,y], tolerance?}; `error-detection`
    {lines, wrongLineIndex, explain}; `true-false` {statement, answer:boolean, explain}.
- **Đáp án phải ĐÚNG** — TỰ TÍNH LẠI BẰNG TAY từng bài (chuẩn, tích vô hướng,
  định thức, nghiệm hệ, trị riêng...). Giữ nội dung TOÁN CHÍNH XÁC; nếu transcript
  sai/thiếu chặt chẽ, sửa cho đúng, đừng chép cái sai.
- `explain` nêu bước giải, không chỉ đáp số.

### Bước 5 — Guide (tùy chọn nhưng khuyến khích)
Dùng shape `ModuleGuide` (bỏ được `id/nameVi/nameEn`): `concepts[]`, `symbols[]`
({tex,desc}), `formulas[]` ({tex,desc}), `intuition`, `example` ({text, tex?}),
`pitfalls[]`, `applications[]`.

### Bước 6 — Ghi ĐÈ File 2 và tự kiểm
Ghi toàn bộ module vào `content-pipeline/2-output-module.ts`:
- `import type { ContentModule } from '../../types';` (đường dẫn ĐÚNG cho vị trí
  đích `src/content/modules/<id>/module.ts`).
- `const module: ContentModule = { ... }; export default module;`
- `enabled: true`, exercises **inline** trong manifest (tự chứa).
- Giữ comment đầu file nhắc "copy sang `src/content/modules/<id>/module.ts` để chạy".

## Checklist tự kiểm (đối chiếu validator trong AUTHORING.md §4) trước khi báo xong
- [ ] `id` DUY NHẤT, không trùng `ch0..ch13` / `ch0-foundations`..`ch13-optimization-apps`.
- [ ] `num` là số **≥ 14**.
- [ ] `track`, `title`, `subtitle` có mặt; `track` mặc định `extra` nếu raw không nêu.
- [ ] `skills` khai báo đủ; **mọi** `skillIds` (lesson) và `skillId` (exercise) đều có trong `skills`.
- [ ] `kind` ∈ {concept, practice, review, challenge}; `id` lesson & `id` exercise không trùng nhau.
- [ ] Mỗi exercise đúng shape theo `type`; `answer` đúng KIỂU (number / number[][] /
      boolean / index...) và **ĐÚNG GIÁ TRỊ** (đã rà tay).
- [ ] TeX trong string literal: backslash **NHÂN ĐÔI** (`'\\vec{v}'`, `'\\\\'` để xuống dòng).
- [ ] Không dùng `component` trừ khi có tạo file lesson tương ứng (mặc định bỏ qua).
- [ ] Nếu có thể, kiểm kiểu: tạm copy File 2 vào `src/content/modules/_check/module.ts`,
      chạy `npx tsc -b`, rồi XÓA `src/content/modules/_check/` (không để lại rác trong `src/`).

## Báo cáo cho người dùng khi xong
- Tóm tắt: id, num, số lesson, số & các dạng exercise đã tạo.
- Hướng dẫn 1 dòng: "Copy `content-pipeline/2-output-module.ts` →
  `src/content/modules/<id>/module.ts` rồi `npm run dev` là giáo án xuất hiện."
- Nếu đã tự đề xuất id/num do raw thiếu, NÓI RÕ để người dùng đổi nếu muốn.

## Ràng buộc quyền sở hữu file
Skill này CHỈ ghi `content-pipeline/2-output-module.ts` (và tạm dùng
`src/content/modules/_check/` để type-check rồi xóa). KHÔNG sửa file khác trong `src/`.
