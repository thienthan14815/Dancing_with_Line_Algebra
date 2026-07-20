Thiết kế một bộ giao diện mobile app học Linear Algebra có tên “LA App”, phong cách hiện đại, tối giản, cao cấp và thân thiện với sinh viên.

Phong cách tổng thể:

* Kết hợp Apple Human Interface, Material 3 và giao diện học tập kiểu Duolingo.
* Thiết kế sáng, sạch, nhiều khoảng trắng.
* Màu chủ đạo: tím điện, xanh tím, xanh dương neon và trắng.
* Một số màn hình dùng nền xanh navy rất đậm để tạo cảm giác công nghệ và không gian toán học.
* Gradient nhẹ từ tím sang xanh dương.
* Góc bo tròn lớn, khoảng 16–24 px.
* Card trắng nổi nhẹ trên nền sáng.
* Shadow rất mềm, không quá đậm.
* Icon nét mảnh, hiện đại, đồng bộ.
* Typography rõ ràng, dùng font sans-serif hiện đại như SF Pro, Inter hoặc Manrope.
* Giao diện mang cảm giác thông minh, khoa học, tương lai nhưng vẫn dễ sử dụng.
* Không dùng quá nhiều màu.
* Không làm giao diện quá game hóa hoặc trẻ con.
* Tập trung vào trải nghiệm học toán trực quan.

Tạo một bộ mockup gồm 6 màn hình điện thoại đặt cạnh nhau theo dạng presentation board.

Màn hình 1 — Home Dashboard:

* Header chào người dùng: “Welcome back”.
* Tên app: “LA — Linear Algebra”.
* Subtitle: “Master vectors, matrices and linear spaces”.
* Một hình minh họa 3D trừu tượng về vector, mặt phẳng và khối lập phương phát sáng.
* Card tiến độ học tập với progress bar màu tím.
* Hiển thị level, XP và phần trăm hoàn thành.
* Section “Continue Learning”.
* Card bài học đang học: “Vector Spaces — Basis and Dimension”.
* Grid chủ đề:

  * Vectors
  * Matrices
  * Determinants
  * Linear Systems
  * Eigenvalues
  * Inner Product
* Bottom navigation gồm:

  * Home
  * Learn
  * Practice
  * Stats
  * Profile

Màn hình 2 — Course Roadmap:

* Tiêu đề “Vectors”.
* Banner nền xanh navy, có hình vector 3D.
* Tiến độ bài học 85%.
* Danh sách lesson dạng card:

  1. What is a Vector?
  2. Vector Operations
  3. Linear Combination
  4. Span and Subspace
  5. Basis and Dimension
  6. Change of Basis
  7. Coordinate Systems
* Lesson đã hoàn thành có icon check màu xanh.
* Lesson hiện tại có nút play tím.
* Lesson chưa mở khóa có icon lock.

Màn hình 3 — Interactive Lesson:

* Tiêu đề “Basis and Dimension”.
* Progress bài học ở phía trên.
* Hiển thị ví dụ toán học:
  “Determine if the set is a basis for R³”.
* Hiển thị vector và ma trận bằng typography toán học sạch.
* Tab chuyển đổi:

  * Learn
  * Example
  * Practice
* Các bước giải bài:

  * Step 1: Form the matrix with the given vectors as columns.
  * Step 2: Row reduce the matrix.
* Có card riêng cho từng bước.
* Nút chuyển bài ở dưới cùng.
* Một nút play lớn màu tím ở giữa.

Màn hình 4 — Practice Quiz:

* Tiêu đề “Practice”.
* Progress 7/10.
* Câu hỏi trắc nghiệm về linear independence.
* 4 đáp án A, B, C, D.
* Đáp án được chọn có border tím và icon check.
* Card “Explanation” với nền tím rất nhạt.
* Nút “Next Question” màu tím gradient ở cuối màn hình.
* Trạng thái đúng, sai và giải thích phải dễ nhận biết.

Màn hình 5 — Learning Analytics:

* Tiêu đề “Your Progress”.
* Card tổng quan nền navy:

  * Overall Progress 68%
  * Lessons Completed
  * Practice Solved
  * Current Streak
  * XP Earned
* Biểu đồ line chart tiến độ theo tuần.
* Section “Topic Mastery”.
* Danh sách progress bar:

  * Vectors
  * Matrices
  * Determinants
  * Linear Systems
  * Eigenvalues
  * Inner Product
* Mỗi chủ đề hiển thị phần trăm thành thạo.

Màn hình 6 — Linear Algebra Knowledge Map:

* Nền navy hoặc đen xanh.
* Giao diện bản đồ kiến thức 3D.
* Các node hình cầu phát sáng kết nối với nhau.
* Node trung tâm: “Basis & Dimension”.
* Các node xung quanh:

  * Vectors
  * Operations
  * Linear Combination
  * Span & Subspace
  * Matrices
  * Determinants
  * Linear Systems
  * Eigenvalues
  * Inner Product Spaces
* Các đường nối mảnh phát sáng.
* Có switch giữa “2D Map” và “3D View”.
* Khi chọn một node, hiển thị card mô tả ở phía dưới.
* Hiệu ứng không gian toán học, hiện đại nhưng vẫn dễ đọc.

Motion design:

* Các card xuất hiện bằng fade-in kết hợp slide-up nhẹ.
* Progress bar chạy mượt.
* Nút bấm scale từ 1 xuống 0.96 khi nhấn.
* Node trong knowledge map chuyển động floating rất nhẹ.
* Khi mở bài học, dùng shared element transition từ card sang màn hình chi tiết.
* Các lesson trong danh sách xuất hiện stagger lần lượt.
* Không dùng animation quá mạnh.
* Chuyển động phải mang mục đích hướng dẫn người học.

Design system:

* Primary: #6C4CFF
* Secondary: #4F7CFF
* Accent: #9B7BFF
* Dark background: #090B2D
* Surface: #FFFFFF
* Light background: #F6F7FC
* Text primary: #161726
* Text secondary: #7A7D91
* Success: #40C98A
* Warning: #FFB84D
* Error: #FF5D6C
* Border: #E8E9F2

Spacing system:

* 4, 8, 12, 16, 24, 32 px.

Radius:

* Button: 14 px.
* Card: 20 px.
* Modal: 24 px.
* Pills: 999 px.

Typography:

* Heading 1: 32 px, semibold.
* Heading 2: 24 px, semibold.
* Title: 18–20 px, medium.
* Body: 16 px, regular.
* Caption: 13–14 px.

Yêu cầu đầu ra:

* High-fidelity mobile UI mockup.
* iOS-style phone frames.
* Tỷ lệ màn hình 9:19.5.
* 6 màn hình trong cùng một design board.
* Ánh sáng mềm, bố cục cân đối.
* Có chiều sâu nhẹ nhưng không quá nhiều hiệu ứng bóng.
* Hình ảnh phải phù hợp với ứng dụng học Linear Algebra.
* Nội dung toán học phải chính xác, rõ ràng và dễ đọc.
* Không dùng ảnh stock.
* Không dùng nhân vật hoạt hình.
* Không dùng màu quá rực.
* Không tạo giao diện giống game trẻ em.
* Không dùng quá nhiều gradient hoặc glassmorphism.
* Không làm bố cục dày đặc.
