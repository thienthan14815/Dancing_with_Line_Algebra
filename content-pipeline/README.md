# PIPELINE SOẠN GIÁO ÁN — LinAlgLab

Biến một **URL video** (hoặc dàn ý/transcript bạn tự viết) thành một
**ContentModule** hợp lệ, thả vào `src/content/modules/<id>/` là app tự hiển thị
giáo án trên Learning Path, Roadmap, Sổ tay và Practice.

Có **2 đường**:

- **Đường chính (khuyên dùng)** — chạy công cụ Python `yt2lesson.py` ở dự án `vd`.
  Nó tự tải video + lấy transcript + gọi Claude và **sinh thẳng `module.ts`**.
- **Đường thủ công (fallback)** — tự dán transcript vào `1-raw-input.md` rồi chạy
  skill `/giao-an` trong Claude Code để sinh `2-output-module.ts`.

Cả hai đều cho ra một ContentModule tự chứa; chỉ việc copy vào
`src/content/modules/<id>/module.ts` là chạy.

```
ĐƯỜNG CHÍNH:
  URL ──▶ vd/yt2lesson.py --format module ──▶ output/module_<...>.ts ──▶ src/content/modules/<id>/module.ts
        (tải video + transcript + Claude → ContentModule)                        (copy vào là chạy)

ĐƯỜNG THỦ CÔNG (fallback):
  transcript ──▶ 1-raw-input.md ──▶ /giao-an ──▶ 2-output-module.ts ──▶ src/content/modules/<id>/module.ts
    (tự dán)     (METADATA+DÀN Ý)   (skill Claude)  (ContentModule)
```

## Các file trong thư mục này
| File | Vai trò |
|------|---------|
| `1-raw-input.md`     | **File 1** (đường thủ công) — nơi bạn điền METADATA, DÀN Ý, TRANSCRIPT. |
| `2-output-module.ts` | **File 2** (đường thủ công) — ContentModule do `/giao-an` sinh ra. |
| `README.md`          | File này. |

Skill nằm ở `.claude/skills/giao-an/SKILL.md` (gọi bằng `/giao-an`).

> Việc tải video + lấy transcript giờ do công cụ `vd/yt2lesson.py` lo (đường
> chính). Thư mục này không còn script tải riêng.

---

## Đường chính — `yt2lesson.py --format module`

Công cụ nằm ở dự án riêng `C:\Users\User\Desktop\vd\yt2lesson.py`.

```powershell
# một lần: cài phụ thuộc cho công cụ
pip install yt-dlp anthropic imageio-ffmpeg
# tùy chọn (khi video không có phụ đề): pip install faster-whisper
# API key: đặt biến môi trường ANTHROPIC_API_KEY (hoặc `ant auth login`)
```

Sinh `module.ts`:

```powershell
cd C:\Users\User\Desktop\vd
python yt2lesson.py "<url>" --format module --mod-id ext-xyz --num 14 --track extra
```

- `--format module` bật chế độ ContentModule (mặc định là giáo án CV 5512).
- `--mod-id` id kebab-case (không có → Claude tự đề xuất).
- `--num` số thứ tự ≥ 14 (không có → Claude tự chọn).
- `--track` mặc định `extra`.
- `--no-api` chỉ ghi transcript + `prompt_module_<...>.md` (không gọi Claude).

Công cụ tự tải video, lấy phụ đề (hoặc phiên âm bằng faster-whisper nếu cần), gọi
Claude, rồi ghi `output/module_<...>.ts` — một ContentModule tự chứa (3–6 lesson,
6–12 bài tập, đáp án đã rà, TeX đúng, mọi skillId khớp). Đặc tả định dạng cô đọng
để tham chiếu tại chỗ ở `vd/content-module-spec.md`.

Copy sang app (đổi tên thành `module.ts`):

```powershell
New-Item -ItemType Directory -Force src\content\modules\ext-xyz
Copy-Item C:\Users\User\Desktop\vd\output\module_<...>.ts src\content\modules\ext-xyz\module.ts
```

Import trong file đã là `../../types` — đúng cho vị trí
`src/content/modules/<id>/`, nên **copy là chạy**.

---

## Đường thủ công (fallback) — dán transcript + `/giao-an`

Dùng khi bạn đã có sẵn transcript/dàn ý, hoặc không muốn chạy công cụ Python.

**Bước 1 — điền `1-raw-input.md`.** Mở `content-pipeline/1-raw-input.md`, điền
khối METADATA (tối thiểu `id`, `num` ≥ 14, `title`, `subtitle`) và dán dàn ý +
transcript vào các mục `## DÀN Ý / GHI CHÚ` và `## TRANSCRIPT`.

**Bước 2 — sinh ContentModule.** Trong Claude Code, chạy:

```
/giao-an
```

Skill đọc `1-raw-input.md` + `AUTHORING.md` + `src/content/types.ts`, rồi **ghi
đè** `content-pipeline/2-output-module.ts` bằng một ContentModule tự chứa.

**Bước 3 — cắm vào app.**

```powershell
New-Item -ItemType Directory -Force src\content\modules\<id>
Copy-Item content-pipeline\2-output-module.ts src\content\modules\<id>\module.ts
```

---

## Xem kết quả (chung cho cả hai đường)

```powershell
npm run dev
```

Giáo án tự xuất hiện. Nếu manifest sai, validator in lỗi rõ ràng ở console (dev)
và chỉ bỏ qua riêng giáo án đó — xem `AUTHORING.md §6` để đọc lỗi. Kiểm kiểu nhanh:

```powershell
npx tsc -b
```

---

## ⚠️ Quyền sử dụng nội dung nguồn

Chỉ dùng nội dung bạn **có quyền**: bài giảng của chính bạn, tài liệu giấy phép mở,
hoặc nội dung đã được phép. Tôn trọng bản quyền và Điều khoản dịch vụ của nguồn.
Bài tập/giải thích do skill/công cụ soạn là **nội dung gốc**, không sao chép nguyên
văn nguồn.
