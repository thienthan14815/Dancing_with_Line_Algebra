# LinAlgLab — App học Đại số tuyến tính trực quan

**LinAlgLab** là một ứng dụng học tập interactif, được xây dựng bằng **React + TypeScript + Vite**, giúp bạn khám phá **Đại số tuyến tính** thông qua hình ảnh động 2D/3D. Triết lý: **Thực hành trước, lý thuyết sau** — trực giác hình học trước, rồi công thức toán học sẽ tự hiện ra.

## Yêu cầu

- **Node.js** ≥ 18
- npm (đi kèm với Node)

## Cài đặt & Chạy

```bash
# Cài các gói phụ thuộc
npm install

# Chạy server dev (localhost:5173)
npm run dev

# Build cho production
npm run build

# Chạy kiểm tra lỗi TypeScript
npx tsc -b

# Chạy test
npx vitest run
```

## 8 Chương — Từ Kiến thức nền đến SVD & Ứng dụng

| # | Chương | Nội dung |
|---|--------|---------|
| **0** | **Kiến thức nền** | Tọa độ 2D/3D, hàm số & đồ thị, đường tròn đơn vị (sin & cos), ký hiệu toán học |
| **1** | **Vector** | Vector là mũi tên & danh sách số; cộng/trừ; nhân vô hướng; linear combination & span; dot & cross product |
| **2** | **Hệ phương trình tuyến tính** | Row picture vs Column picture; Gauss elimination từng bước; nghiệm duy nhất/vô số/vô nghiệm |
| **3** | **Ma trận** | Ma trận = biến đổi tuyến tính; nhân ma trận = hợp biến đổi; determinant; ma trận nghịch đảo; các ma trận đặc biệt |
| **4** | **Không gian vector** | Subspace, column space & null space; linear independence; basis & dimension; rank; đổi cơ sở |
| **5** | **Eigenvalues & Eigenvectors** | Tìm hướng bất biến; phương trình đặc trưng; eigenspace; diagonalization; lũy thừa ma trận & Fibonacci |
| **6** | **SVD** | Xoay – Co giãn – Xoay; singular values & vectors; liên hệ với AᵀA; nén ảnh rank-k; PCA sơ lược |
| **7** | **Ứng dụng bằng code** | Đồ họa: biến đổi hình; least squares fit; Markov chain & PageRank; nén ảnh bằng SVD |

## Hai công cụ tra cứu & định hướng

Ngoài 8 chương học, app có hai trang truy cập nhanh từ sidebar và trang chủ:

- **🗺️ Lộ trình học** (`#/lo-trinh`) — lộ trình 14 bước từ số → vector → … → SVD → code, kèm vòng lặp thực hành 6 bước, kế hoạch 8 tuần (bám tiến độ thật của bạn), cách học mỗi ngày, 7 project và flowchart thứ tự tối ưu cho xử lý ảnh. Mỗi bước có nút "Vào học" nhảy thẳng vào bài tương ứng.
- **📖 Math Wiki** (`#/wiki`) — từ điển 71 ký hiệu toán học chia 6 nhóm (số & tập hợp, vector, ma trận, không gian vector, eigen & SVD, chữ Hy Lạp). Mỗi ký hiệu ghi rõ tên Việt–Anh, ý nghĩa, **dùng để tính/làm gì trong trường hợp cụ thể**, ví dụ, và link "Học sâu" vào bài. Có ô tìm kiếm (gõ không dấu vẫn khớp) và lọc theo nhóm.

## Cấu trúc thư mục

```
LINEAR-ALGEBRA/
├── src/
│   ├── chapters/              # 8 chương, mỗi chương = thư mục ch*-*
│   │   ├── ch0-foundations/   # Kiến thức nền
│   │   ├── ch1-vectors/       # Vector
│   │   ├── ch2-systems/       # Hệ phương trình
│   │   ├── ch3-matrices/      # Ma trận
│   │   ├── ch4-spaces/        # Không gian vector
│   │   ├── ch5-eigen/         # Eigenvalues & Eigenvectors
│   │   ├── ch6-svd/           # SVD
│   │   ├── ch7-code/          # Ứng dụng bằng code
│   │   └── registry.ts        # Metadata toàn bộ chương & lesson
│   ├── components/            # React components (Canvas2D, Scene3D, Quiz, ...)
│   ├── lib/                   # Thư viện toán học (linalg.ts, ...)
│   ├── wiki/                  # Trang Math Wiki (từ điển ký hiệu)
│   ├── roadmap/               # Trang Lộ trình học
│   ├── pages/                 # Trang chính, menu chương
│   ├── styles/                # CSS toàn cục
│   ├── App.tsx
│   └── main.tsx
├── package.json
├── tsconfig.json
├── vite.config.ts
└── README.md
```

## Lưu ý về Tiến độ Học

App sử dụng **localStorage** để ghi nhớ:
- Bài học nào đã xem
- Progress từng quiz

Để xoá progress cũ (reset app):
```javascript
localStorage.clear();
```

## Công nghệ sử dụng

- **React 18** — Thư viện UI
- **TypeScript** — Type-safe development
- **Vite** — Build tool siêu nhanh
- **Three.js + React Three Fiber** — Đồ họa 3D
- **KaTeX** — Render công thức LaTeX
- **Zustand** — State management đơn giản
- **Vitest** — Testing framework

## Giấy phép & Đóng góp

Dự án này được xây dựng nhằm mục đích giáo dục. Hoan nghênh bất kỳ đóng góp nào!
