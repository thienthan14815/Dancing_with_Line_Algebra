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
</content>
