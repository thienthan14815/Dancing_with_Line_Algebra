# Triển khai Linal Lab lên mạng (deploy) & dùng trên điện thoại

Linal Lab là **web app tĩnh** (Vite build ra thư mục `dist/`), dùng **HashRouter**
(đường dẫn dạng `#/...`) nên **deploy ở đâu cũng chạy — KHÔNG cần cấu hình
rewrite/redirect phía server**. Đã bật **PWA**: sau khi deploy qua HTTPS, mở trên
điện thoại có thể **"Thêm vào màn hình chính"** để chạy như app thật, có icon,
toàn màn hình, và **dùng được offline**.

---

## 0. Xem thử trên điện thoại NGAY (không cần deploy)

Máy tính và điện thoại cùng WiFi:

```bash
npm run dev          # dev server đã bật server.host → mở ra mạng LAN
```

Vite in ra dòng **`Network: http://192.168.x.x:5173`** → mở đúng URL đó trên
trình duyệt điện thoại. (Windows Firewall hỏi lần đầu → chọn **Allow**.)

> Lưu ý: qua LAN (http) thì **chỉ xem được**, KHÔNG "cài" PWA được — cài PWA cần
> HTTPS thật (xem mục deploy bên dưới).

Muốn thử **bản production + service worker** ở máy:

```bash
npm run build
npx vite preview --host      # mở URL Network trên điện thoại
```

---

## 1. Build

```bash
npm run build                # kết quả nằm trong thư mục dist/
```

`dist/` đã gồm: app, `manifest.webmanifest`, `sw.js` (service worker), icon PWA.

---

## 2. Chọn một nơi host miễn phí (đều có HTTPS sẵn)

### Cách A — Vercel (dễ nhất, khuyên dùng)
- **Web:** [vercel.com](https://vercel.com) → *New Project* → import repo (hoặc kéo-thả).
  Framework preset **Vite**, Build command `npm run build`, Output `dist` → *Deploy*.
- **CLI:** `npm i -g vercel` → chạy `vercel` trong thư mục project → làm theo hỏi đáp.
- Kết quả: domain `*.vercel.app` có HTTPS, mỗi lần push là tự deploy lại.

### Cách B — Netlify
- Nhanh nhất: kéo-thả thư mục **`dist/`** vào [app.netlify.com/drop](https://app.netlify.com/drop) → có URL ngay.
- Hoặc nối git: Build `npm run build`, Publish directory `dist`.

### Cách C — Cloudflare Pages
- [dash.cloudflare.com](https://dash.cloudflare.com) → *Pages* → *Connect to Git* →
  Build `npm run build`, Output `dist`.

### Cách D — GitHub Pages (⚠ cần chỉnh base path)
Nếu địa chỉ là `username.github.io/<tên-repo>/` (không phải domain gốc), asset nằm
dưới subpath nên phải khai báo `base` **trước khi build**, trong `vite.config.ts`:

```ts
export default defineConfig({
  base: '/<tên-repo>/',   // ví dụ: '/linear-algebra/'
  plugins: [ /* ... */ ],
})
```

Rồi:
```bash
npm i -D gh-pages
npm run build && npx gh-pages -d dist
```
Routing vẫn chạy nhờ HashRouter; PWA vẫn chạy vì `start_url`/`scope` đã để `'./'`
(tương đối). Nếu deploy ở domain gốc thì **không cần** `base`.

---

## 3. Sau khi deploy — cài lên điện thoại

- **Android (Chrome):** mở URL → menu ⋮ → *Cài đặt ứng dụng / Add to Home screen*.
- **iOS (Safari):** mở URL → nút Share → *Thêm vào MH chính (Add to Home Screen)*.
- App mở toàn màn hình (standalone), có icon 🧪, chạy offline sau lần mở đầu.

---

## Ghi chú kỹ thuật

- **Tự cập nhật:** cấu hình `registerType: 'autoUpdate'` → mỗi lần deploy bản mới,
  người dùng mở lại app là service worker tự cập nhật.
- **Dữ liệu học** (XP, streak, tiến độ, ghi chú) lưu ở **localStorage trên máy người
  dùng** — chưa có backend đồng bộ, nên **đổi thiết bị sẽ không mang theo tiến độ**.
  Muốn đồng bộ đa thiết bị / đăng nhập cần dựng backend (đã có `RemoteAdapter` stub
  làm điểm cắm sẵn trong `src/core/persistence/`).
- **PWA cần HTTPS** (mọi host ở mục 2 đều có) hoặc `localhost`. Không chạy qua
  `file://` hay `http://` LAN.
## cPanel: cập nhật bản app có giáo án Giải tích 30 ngày

Hosting hiện tại: `https://www.buy902.com`, Document Root: `public_html`.
Bản Giải tích được triển khai ngày 2026-09-30; bản sao trước cập nhật được lưu
ngoài Document Root với tên `linal-lab-before-calculus-20260930.zip`.

Giáo án mới ở `#/giai-tich`, đồng thời có trong Lộ trình, Sổ tay và Luyện tập.
Nội dung HTML được nhập bằng `python scripts/import-calculus.py` (cần
`beautifulsoup4`); dữ liệu JSON đã được lưu trong source nên build thông thường
không cần Python hoặc tải MathJax từ CDN.

```powershell
npm test
npm run build
python scripts/package-cpanel.py
```

Gói trong `releases/` chứa **nội dung** `dist/` ngay ở gốc ZIP, với quyền file
Linux `0644` được đặt rõ ràng kể cả khi đóng gói trên Windows. Trong cPanel,
xác nhận Document Root của đúng tên miền, sao lưu bản hiện tại rồi tải ZIP vào
thư mục đó và giải nén. Không xóa các thư mục ứng dụng khác, `.htaccess` hoặc
các asset cũ trong lúc cập nhật: tab đang mở có thể vẫn dùng asset bản trước.
Nếu triển khai qua SFTP, tải asset trước, sau đó mới thay `index.html`,
`manifest.webmanifest`, `registerSW.js` và `sw.js`.

Sau triển khai, mở `https://<ten-mien>/#/giai-tich`, kiểm tra ngày 1, ngày 30,
thẻ công thức và bài luyện tập. Tải lại app để service worker nhận bản mới.
Không xóa localStorage: tiến độ học vẫn được lưu trên thiết bị của người học.

### Bản mở rộng giáo trình 2026-09-30

Toàn bộ 30 ngày Giải tích có lớp biên soạn bổ sung tại
`src/content/modules/calculus-30/editorial/`: giải thích, phương pháp, ví dụ có
kiểm chứng, bài chuyển dạng và câu hỏi khái niệm. Import lại HTML không ghi đè
lớp này. Giữ 134 lời giải gốc; ngân hàng chấm điểm có 102 câu. Đề ngày 30 dùng
`practiceExerciseIds` để luôn đưa đủ 12 câu theo thứ tự, không lấy mẫu 6 câu.
Các giáo trình còn lại mặc định mở toàn bộ nội dung sẵn có và có chế độ học từng bước.

Gói triển khai: `releases/linal-lab-cpanel-20260930-154516.zip` (158 file).
SHA256: `2ae2d284398513365d7f342a5ac1dcaff7ff2e27af18f71b2c035fd04c3db964`.
Gói phiên bản trước để khôi phục: `linal-lab-cpanel-20260930-151546.zip`
trong thư mục home của cPanel, ngoài `public_html`.

Validation: 260 kiểm thử đạt; TypeScript/Vite/PWA build đạt. Đã kiểm tra desktop,
390px, mục lục, ẩn/hiện đáp án, cát tuyến tương tác và phiên đề tổng kết 12 câu.
Chi tiết phạm vi và review nằm trong `EDITORIAL_UPGRADE.md`.
Đã xác nhận file trên cPanel trỏ tới `assets/index-D0k7MBvD.js` và quyền 0644.
Ở lượt kiểm tra này, trình duyệt public còn trả bản PWA cũ, còn yêu cầu HTTP(S)
trực tiếp bị reset; việc client HTTPS nhận bản mới chưa được xác minh.
