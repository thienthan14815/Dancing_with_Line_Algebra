---
# ==========================================================================
# METADATA — điền thông tin giáo án ở đây (YAML front-matter).
# Skill /giao-an sẽ đọc khối này để đặt id/num/title/track/subtitle cho module.
# Script fetch-transcript.mjs sẽ TỰ ĐIỀN `source_url` và `title` (nếu đang trống).
# --------------------------------------------------------------------------
id:            # DUY NHẤT, vd 'ext-probability'. Không trùng ch0..ch13. (bắt buộc)
num:           # Số thứ tự, PHẢI ≥ 14. (bắt buộc)
title:         # Tiêu đề tiếng Việt, vd 'Xác suất cho ML'. (bắt buộc)
track: extra   # Nhóm: 'linear-algebra' | 'deep-learning' | 'extra'. (mặc định extra)
subtitle:      # Mô tả ngắn 1 dòng. (bắt buộc)
level:         # (tùy chọn) 'co-ban' | 'trung-cap' | 'nang-cao' — gợi ý độ khó.
source_url:    # (tùy chọn) URL nguồn; script sẽ tự điền khi tải phụ đề/transcript.
---

<!--
  HƯỚNG DẪN NHANH
  1. Điền METADATA phía trên (tối thiểu: id, num ≥ 14, title, subtitle).
  2. (tùy chọn) Viết dàn ý / ghi chú của bạn vào mục "## DÀN Ý / GHI CHÚ".
  3. Lấy transcript: chạy
        node content-pipeline/fetch-transcript.mjs <url> [--lang vi,en]
     script sẽ ghi transcript vào mục "## TRANSCRIPT" và KHÔNG đụng dàn ý của bạn.
     (Hoặc tự dán transcript/nội dung vào mục "## TRANSCRIPT".)
  4. Chạy skill:  /giao-an   → sinh ra content-pipeline/2-output-module.ts.

  ⚠️ CHỈ dùng nội dung bạn CÓ QUYỀN sử dụng (bài giảng của bạn, nội dung mở,
     hoặc đã được phép). Đừng chép nội dung có bản quyền mà chưa được phép.
-->

## DÀN Ý / GHI CHÚ

<!--
  (TÙY CHỌN) Bạn tự viết ở đây: các chủ đề chính, thứ tự dạy, ví dụ muốn dùng,
  điểm cần nhấn mạnh, dạng bài tập mong muốn... Skill sẽ ưu tiên bám theo dàn ý
  này khi chia micro-lesson và soạn bài tập. Để trống cũng được.
-->


## TRANSCRIPT

<!--
  Nội dung dạng văn bản: script fetch-transcript.mjs sẽ tự ghi transcript vào
  ĐÂY (thay thế phần dưới header này). Bạn cũng có thể tự dán vào.
-->


<!--
  ==========================================================================
  VÍ DỤ MINH HỌA (đã điền sẵn — xóa đi khi dùng thật, hoặc để tham khảo):

  ---
  id: ext-probability
  num: 14
  title: Xác suất cho Machine Learning
  track: extra
  subtitle: Biến ngẫu nhiên, kỳ vọng và phương sai
  level: trung-cap
  source_url: https://example.com/bai-giang-xac-suat
  ---

  ## DÀN Ý / GHI CHÚ
  - Bài 1 (khái niệm): biến ngẫu nhiên rời rạc, hàm khối xác suất.
  - Bài 2 (luyện tập): tính kỳ vọng E[X] của xúc xắc, đồng xu.
  - Bài 3 (khái niệm): phương sai & độ lệch chuẩn, ý nghĩa "độ phân tán".
  - Nhấn mạnh: E[X²] ≠ (E[X])². Dùng ví dụ xúc xắc 6 mặt xuyên suốt.

  ## TRANSCRIPT
  Hôm nay chúng ta nói về biến ngẫu nhiên. Một biến ngẫu nhiên gán cho mỗi
  kết cục của phép thử một con số. Kỳ vọng là trung bình có trọng số theo xác
  suất: với xúc xắc công bằng, E[X] = (1+2+3+4+5+6)/6 = 3.5 ...
  ==========================================================================
-->
