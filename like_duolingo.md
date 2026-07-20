Phân tích Duolingo để xây app học Đại số tuyến tính

Mục tiêu không nên là sao chép nguyên giao diện Duolingo, mà là học theo cơ chế sản phẩm của họ: chia kiến thức khó thành bài học rất ngắn, phản hồi ngay, ôn tập cá nhân hóa và dùng game hóa để duy trì thói quen.

Duolingo hiện tổ chức nội dung theo một learning path có thứ tự, trong đó người học mở khóa dần các bài mới, xen kẽ bài ôn tập cá nhân hóa và bài tổng kết đơn vị. Họ cũng sử dụng XP, streak, bảng xếp hạng, nhiệm vụ bạn bè và Practice Hub để tăng động lực quay lại.

1. Công thức cốt lõi của Duolingo

Có thể khái quát Duolingo bằng vòng lặp:

Học một khái niệm nhỏ → làm bài tương tác → nhận phản hồi ngay → kiếm phần thưởng → ôn lại lỗi sai → mở khóa bài tiếp theo

App Đại số tuyến tính của bạn cũng nên dùng đúng vòng lặp này.

Ví dụ:

Người học xem trực quan khái niệm vector.
Trả lời 5–8 câu hỏi ngắn.
Hệ thống chỉ rõ tại sao đáp án sai.
Nhận XP và hoàn thành mục tiêu ngày.
Câu sai được đưa vào hàng đợi ôn tập.
Hoàn thành đủ bài để mở khóa ma trận.
2. Các chức năng chính cần học từ Duolingo
2.1. Lộ trình học — Learning Path — 學習路徑

Đây là màn hình trung tâm.

Thay vì để người học tự chọn giữa hàng trăm bài, app chỉ đề xuất bài phù hợp tiếp theo. Điều này giảm cảm giác không biết phải bắt đầu từ đâu.

Chuyển sang Đại số tuyến tính

Lộ trình có thể được chia thành:

Nền tảng toán học
    ↓
Vector
    ↓
Tổ hợp tuyến tính
    ↓
Hệ phương trình tuyến tính
    ↓
Ma trận
    ↓
Phép nhân ma trận
    ↓
Khử Gauss
    ↓
Định thức
    ↓
Không gian vector
    ↓
Độc lập tuyến tính
    ↓
Cơ sở và số chiều
    ↓
Biến đổi tuyến tính
    ↓
Trị riêng và vector riêng
    ↓
Trực giao và phép chiếu
    ↓
SVD
    ↓
Ứng dụng thực tế

Mỗi chủ đề lớn là một Section — 章節, bên trong gồm nhiều Unit — 單元, mỗi unit có nhiều Lesson — 課程.

Ví dụ:

Section 2: Vector

Unit 1: Vector là gì?
Unit 2: Cộng và trừ vector
Unit 3: Nhân vector với số
Unit 4: Tổ hợp tuyến tính
Unit 5: Tích vô hướng
Unit 6: Độ dài và khoảng cách
Unit 7: Tổng ôn tập
2.2. Bài học ngắn — Bite-sized Lessons — 微型課程

Duolingo nổi bật nhờ bài học ngắn, thường chỉ cần vài phút. Các bài ngắn giúp người dùng dễ bắt đầu và duy trì thói quen.

Đối với Đại số tuyến tính, một lesson nên kéo dài khoảng 5–10 phút, chỉ tập trung vào một mục tiêu.

Cấu trúc một lesson
1. Mở đầu bằng trực quan
2. Giải thích một khái niệm
3. Ví dụ có hướng dẫn
4. 5–8 câu luyện tập
5. Một câu thử thách
6. Tổng kết
7. Cập nhật XP và tiến độ
Ví dụ lesson

Tên bài: Tổ hợp tuyến tính
English: Linear Combination
中文繁體: 線性組合

Mục tiêu:

Hiểu rằng một vector mới có thể được tạo ra bằng cách nhân các vector với hệ số rồi cộng chúng lại.

w
=a
u
+b
v
u
=(2,1),
v
=(−1,2)
w
=0
u
+1
v
=(−1,2)
a
a
b
b
-8
-6
-4
-2
2
4
6
8
-8
-6
-4
-2
2
4
6
8

Sau phần trực quan, người học làm bài:

Cho:

u = (2, 1)
v = (-1, 2)

Tính:

2u + 3v

Hệ thống không chỉ báo sai mà phải chỉ rõ:

2u = (4, 2)
3v = (-3, 6)

Do đó:

2u + 3v = (1, 8)
2.3. Hệ thống dạng bài tập — Exercise Engine — 題型引擎

Đây là phần quan trọng nhất của app.

Bạn không nên chỉ tạo dạng trắc nghiệm. Đại số tuyến tính cần nhiều kiểu tương tác khác nhau.

Các dạng bài cần có
Dạng bài	Cách hoạt động	Ví dụ
Multiple choice	Chọn đáp án đúng	Ma trận nào có kích thước 2×3?
Numeric input	Nhập số	Tính định thức
Matrix input	Nhập từng ô ma trận	Tính A+B
Drag and drop	Kéo thả biểu thức	Ghép hàng với cột
Vector drawing	Kéo vector trên mặt phẳng	Tạo vector (3,2)
Step ordering	Sắp xếp các bước	Quy trình khử Gauss
Error detection	Tìm bước sai	Phát hiện lỗi nhân ma trận
Matching	Ghép thuật ngữ với định nghĩa	Basis ↔ Cơ sở
Interactive graph	Thay đổi hệ số bằng thanh trượt	Quan sát tổ hợp tuyến tính
Proof completion	Điền phần còn thiếu	Chứng minh độc lập tuyến tính
Real-world challenge	Giải bài ứng dụng	Nén ảnh bằng SVD
Code exercise	Viết Python/NumPy	Tính eigenvalues
Ví dụ trực quan phép nhân ma trận
A
2
1
3
4
0
2
×
B
5
2
1
4
3
7
=
AB
20
29
26
22
(AB)
11
	​

=(2⋅5)+(1⋅1)+(3⋅3)=20
Hàng
1
2
1
2
Cột
1
2
1
2

Đối với dạng bài này, người học nên được yêu cầu:

Chọn một hàng của ma trận A.
Chọn một cột của ma trận B.
Nhân các phần tử tương ứng.
Cộng kết quả.
Điền vào ô tương ứng của AB.
2.4. Phản hồi ngay lập tức — Immediate Feedback — 即時回饋

Duolingo không đợi đến cuối bài mới chấm điểm. Mỗi câu trả lời đều được phản hồi ngay.

Với toán học, phản hồi cần sâu hơn chỉ “đúng” hoặc “sai”.

Cấu trúc phản hồi tốt
Kết quả: Sai

Bạn đã tính:
2 × 3 + 1 × 4 = 11

Nhưng hàng và cột đúng phải là:
2 × 3 + 1 × 5 = 11

Lỗi của bạn:
Đã chọn nhầm phần tử ở cột thứ hai.

Quy tắc:
Phần tử (i, j) của AB được tạo bởi hàng i của A và cột j của B.
Phân loại lỗi

Hệ thống nên lưu error_type, chẳng hạn:

SIGN_ERROR
ARITHMETIC_ERROR
ROW_COLUMN_MISMATCH
INVALID_MATRIX_DIMENSION
WRONG_ELIMINATION_OPERATION
CONFUSED_EIGENVALUE_WITH_EIGENVECTOR
DEPENDENCE_REASONING_ERROR

Điều này giúp hệ thống biết người học không hiểu khái niệm nào, thay vì chỉ biết họ trả lời sai.

2.5. Ôn tập cá nhân hóa — Personalized Practice — 個人化練習

Practice Hub của Duolingo cho phép người học luyện lại lỗi sai hoặc tập trung vào kỹ năng cụ thể.

App của bạn nên có một Practice Center — 練習中心 với các mục:

Ôn lỗi sai.
Ôn khái niệm yếu.
Luyện tính toán.
Luyện trực quan.
Luyện chứng minh.
Luyện đề thi.
Luyện Python/NumPy.
Bài tập trộn nhiều chủ đề.
Mô hình dữ liệu năng lực

Mỗi người học có một điểm mastery cho từng skill:

{
  "vector_addition": 0.92,
  "dot_product": 0.71,
  "matrix_multiplication": 0.54,
  "gaussian_elimination": 0.38,
  "determinant": 0.65
}

Hệ thống ưu tiên:

Kỹ năng yếu
+ kỹ năng sắp quên
+ lỗi vừa xuất hiện
+ kiến thức cần cho bài tiếp theo
2.6. Lặp lại ngắt quãng — Spaced Repetition — 間隔重複

Một bài đã học không có nghĩa là đã nhớ lâu dài.

Mỗi kiến thức nên có:

mastery_score
last_reviewed_at
next_review_at
correct_streak
difficulty
forgetting_rate

Lịch ôn cơ bản:

Sau 1 ngày
Sau 3 ngày
Sau 7 ngày
Sau 14 ngày
Sau 30 ngày

Nếu trả lời sai, khoảng cách ôn được rút ngắn. Nếu trả lời đúng nhiều lần, khoảng cách được kéo dài.

MVP có thể dùng thuật toán Leitner System — Hệ thống Leitner — 萊特納系統. Bản nâng cao có thể dùng biến thể của FSRS — Free Spaced Repetition Scheduler.

2.7. Game hóa — Gamification — 遊戲化

Duolingo dùng nhiều lớp động lực cùng lúc: streak, XP, leaderboard, league và nhiệm vụ với bạn bè. Streak biểu thị số ngày liên tục hoàn thành bài; leaderboard so sánh XP theo tuần; Friends Quests tạo mục tiêu chung.

Những chức năng nên sử dụng
XP — Experience Points — 經驗值
Hoàn thành bài: +10 XP
Không sai câu nào: +5 XP
Hoàn thành thử thách: +15 XP
Ôn bài yếu: +10 XP
Giải thích lời giải: +5 XP
Streak — Chuỗi ngày học — 連續學習天數

Chỉ tính streak khi người học hoàn thành một hoạt động có ý nghĩa, ví dụ:

Hoàn thành ít nhất một lesson
hoặc
Đạt tối thiểu 10 XP từ hoạt động học thật

Không nên cho phép mở app hoặc bấm ngẫu nhiên để giữ streak.

Quest — Nhiệm vụ — 任務
Hoàn thành 3 lesson
Trả lời đúng 10 câu ma trận
Ôn lại 5 lỗi sai
Đạt 80% trong Unit Review
Học 15 phút
Achievements — Thành tựu — 成就
Vector Rookie
Matrix Explorer
Gaussian Eliminator
Determinant Master
Eigen Hunter
SVD Engineer
Leaderboard — Bảng xếp hạng — 排行榜

Không nên chỉ xếp theo XP vì người dùng có thể farm bài dễ.

Nên tính:

Weekly Score =
XP học mới
+ XP ôn tập
+ điểm độ khó
+ điểm duy trì chính xác
2.8. Hệ thống năng lượng — Energy/Hearts — 能量系統

Duolingo đã thử nghiệm hệ thống Energy thay cho Hearts ở một số người dùng; mục đích của cơ chế này là kiểm soát nhịp học và tạo giới hạn cho gói miễn phí.

Tuy nhiên, với app toán học, tôi không khuyến nghị phạt người học quá nặng vì trả lời sai.

Sai là một phần cần thiết của quá trình học toán.

Cơ chế phù hợp hơn

Dùng Focus Energy — Năng lượng tập trung — 專注能量:

Làm bài mới tiêu hao năng lượng.
Làm bài ôn lỗi sai phục hồi năng lượng.
Xem giải thích không bị trừ năng lượng.
Người dùng không bị khóa hoàn toàn khỏi việc học.
Gói premium có thể bỏ giới hạn, nhưng bản miễn phí vẫn luôn được ôn tập.

Như vậy, cơ chế kinh doanh không phá hỏng trải nghiệm giáo dục.

2.9. Unit Review và kiểm tra năng lực

Cuối mỗi unit cần có bài tổng kết.

Ba cấp độ đánh giá

Lesson Check

5–8 câu.
Kiểm tra một kỹ năng nhỏ.

Unit Review

15–20 câu.
Trộn nhiều kỹ năng trong unit.
Yêu cầu tối thiểu 70–80%.

Mastery Challenge

Bài khó hơn.
Không cung cấp gợi ý ngay.
Có câu hỏi ứng dụng và giải thích.
Dùng để xác nhận người học thực sự thành thạo.

Không nên chỉ dựa vào số lần hoàn thành. Người học chỉ được mở khóa chủ đề phụ thuộc khi đạt mastery tối thiểu.

2.10. Guidebook — Sổ tay bài học — 學習指南

Mỗi unit nên có một guidebook ngắn, tương tự cách Duolingo cung cấp ghi chú trọng tâm cho từng đơn vị.

Guidebook nên có:

Khái niệm cốt lõi
Tên tiếng Việt
Tên tiếng Anh
Tên tiếng Trung phồn thể
Ký hiệu
Công thức
Trực giác hình học
Ví dụ
Lỗi thường gặp
Ứng dụng thực tế

Ví dụ:

Định thức
English: Determinant
中文繁體: 行列式
Ký hiệu: det(A) hoặc |A|

Ý nghĩa:
Định thức mô tả hệ số thay đổi diện tích hoặc thể tích
của một biến đổi tuyến tính.
3. Chức năng riêng cho app học Đại số tuyến tính

Đây là phần Duolingo ngôn ngữ không có, nhưng app của bạn bắt buộc cần.

3.1. Interactive Vector Playground — Sân chơi vector — 向量互動區

Người học có thể:

Kéo đầu vector.
Thay đổi tọa độ.
Cộng hai vector.
Quan sát scalar multiplication.
Quan sát span.
Kiểm tra độc lập tuyến tính.
Xem góc và tích vô hướng.
3.2. Matrix Workspace — Không gian làm việc ma trận — 矩陣工作區

Cần hỗ trợ:

Nhập ma trận bằng bàn phím.
Thêm hoặc xóa hàng, cột.
Highlight hàng và cột.
Thực hiện row operations.
Hiển thị từng bước.
Undo/redo.
So sánh lời giải của người học với lời giải chuẩn.
3.3. Gaussian Elimination Simulator — Trình mô phỏng khử Gauss — 高斯消去法模擬器

Người học tự chọn:

Đổi hai hàng
Nhân một hàng với hằng số
Cộng bội của một hàng vào hàng khác

Hệ thống cần phát hiện:

Phép biến đổi có hợp lệ không.
Bước có tiến gần đến row echelon form không.
Có lựa chọn pivot tốt hơn không.
Người học đang bị mắc kẹt ở đâu.
3.4. Linear Transformation Visualizer — Trực quan biến đổi tuyến tính — 線性變換視覺化

Hiển thị:

Lưới tọa độ trước biến đổi.
Lưới tọa độ sau biến đổi.
Vector cơ sở e
1
	​

,e
2
	​

.
Ảnh của các vector cơ sở.
Xoay, co giãn, shear và reflection.
Liên hệ giữa ma trận và biến đổi hình học.
3.5. Eigenvalue Lab — Phòng thí nghiệm trị riêng — 特徵值實驗室
Av=λv
Hai hướng riêng thực
λ
1
	​

=3,λ
2
	​

=1
a
11
	​

a
11
	​

a
12
	​

a
12
	​

a
21
	​

a
21
	​

a
22
	​

a
22
	​

Đầu vào
Đã ánh xạ
Kéo điểm đầu vào

Người học nên có thể thay đổi các phần tử của ma trận và quan sát:

Vector nào giữ nguyên phương.
Hệ số co giãn λ.
Khi nào không có hướng riêng thực.
Khi nào có một hoặc hai eigendirections.
Mối quan hệ giữa ma trận, vector riêng và trị riêng.
3.6. SVD Image Lab — Phòng thí nghiệm SVD — 奇異值分解實驗室

Người học tải ảnh lên rồi:

Tách ảnh thành ma trận.
Thực hiện SVD.
Thay đổi số singular values giữ lại.
Quan sát chất lượng ảnh.
Xem tỷ lệ nén.
So sánh sai số tái tạo.

Đây có thể là phần thưởng cuối khóa, giúp người học thấy Đại số tuyến tính có ứng dụng thực tế.

3.7. Python/NumPy Mode

Sau khi hiểu bằng tay, người học chuyển sang code:

import numpy as np

A = np.array([
    [2, 1],
    [1, 3]
])

eigenvalues, eigenvectors = np.linalg.eig(A)

Hệ thống nên hỏi:

eigenvalues chứa gì?
Mỗi cột của eigenvectors có ý nghĩa gì?
Làm sao kiểm chứng Av=λv?
Kết quả số có sai số floating-point không?
4. Thiết kế course hoàn chỉnh
Section 0: Chuẩn bị
Số thực.
Phương trình.
Hệ tọa độ.
Hàm số.
Ký hiệu tổng.
Chỉ số hàng và cột.
Section 1: Vector
Vector và scalar.
Cộng vector.
Nhân scalar.
Độ dài.
Khoảng cách.
Tích vô hướng.
Góc giữa hai vector.
Phép chiếu.
proj
b
	​

(a)=
∥b∥
2
a⋅b
	​

b
a=p+r,r⊥b
comp
b
	​

(a)=6cos(55
∘
)=3.4
Góc nhọn tạo ra thành phần dương, nên hình chiếu cùng hướng với b
θ
°
θ
θ = 55°
a
b
p
r
Section 2: Hệ phương trình
Phương trình tuyến tính.
Hệ hai phương trình.
Nghiệm duy nhất.
Vô số nghiệm.
Vô nghiệm.
Biểu diễn hình học.
Section 3: Ma trận
Cấu trúc ma trận.
Kích thước.
Ma trận đặc biệt.
Cộng và trừ.
Nhân scalar.
Nhân ma trận.
Chuyển vị.
Ma trận nghịch đảo.
Section 4: Khử Gauss
Elementary row operations.
Row echelon form.
Reduced row echelon form.
Pivot.
Rank.
Giải hệ bằng ma trận mở rộng.
Section 5: Định thức
Định thức 2×2.
Định thức 3×3.
Cofactor expansion.
Tính chất định thức.
Ý nghĩa hình học.
Điều kiện khả nghịch.
Section 6: Không gian vector
Vector space.
Subspace.
Span.
Linear combination.
Linear independence.
Basis.
Dimension.
Column space.
Row space.
Null space.
A=∣det(u,v)∣
det(u,v)=11,A=∣11∣=11
u
x
	​

u
x
	​

u
y
	​

u
y
	​

v
x
	​

v
x
	​

v
y
	​

v
y
	​

-8
-6
-4
-2
2
4
6
8
-4
-2
2
4
u = (4, 1)
v = (1, 3)
Section 7: Biến đổi tuyến tính
Định nghĩa.
Kernel.
Image.
Matrix representation.
Rotation.
Scaling.
Reflection.
Shear.
Composition.
Section 8: Trực giao
Orthogonal vectors.
Orthonormal basis.
Projection.
Gram–Schmidt.
Least squares.
QR decomposition.
Section 9: Trị riêng
Eigenvalue.
Eigenvector.
Characteristic polynomial.
Diagonalization.
Dynamical systems.
Markov chains.
Section 10: SVD và ứng dụng
Singular values.
Singular vectors.
Low-rank approximation.
Image compression.
PCA.
Recommendation systems.
5. Các màn hình chính
5.1. Onboarding

Hỏi người dùng:

Bạn học để làm gì?

- Học đại học
- Ôn thi
- Machine Learning
- Data Science
- Computer Graphics
- Chỉ muốn hiểu toán

Sau đó hỏi:

Trình độ hiện tại?
Mục tiêu mỗi ngày?
Muốn học bằng ngôn ngữ nào?
Có muốn học kèm Python không?

Cuối cùng là placement test.

5.2. Home / Learning Path

Hiển thị:

Section hiện tại.
Unit hiện tại.
Bài tiếp theo.
Streak.
XP hôm nay.
Mục tiêu ngày.
Nút Practice.
5.3. Lesson Player

Bao gồm:

Progress bar.
Nội dung câu hỏi.
Math renderer.
Canvas trực quan.
Bàn phím toán.
Nút kiểm tra.
Feedback panel.
Hint.
Report question.
5.4. Practice Center
Lỗi sai gần đây
Kỹ năng yếu
Bài sắp quên
Luyện ma trận
Luyện trực quan
Luyện chứng minh
Luyện Python
5.5. Progress

Hiển thị:

Phần trăm course.
Mastery theo chủ đề.
Heatmap ngày học.
Tổng thời gian.
Accuracy.
Số lỗi đã sửa.
Chủ đề mạnh/yếu.
Dự đoán thời gian hoàn thành.
5.6. Profile và Social
Thành tựu.
League.
Bạn bè.
Friend Quest.
Chia sẻ kết quả.
Thử thách theo tuần.
6. AI Tutor nên làm gì?

AI không nên trực tiếp đưa đáp án ngay.

Nó nên hoạt động theo 4 cấp gợi ý:

Hint 1: Nhắc lại khái niệm

Để nhân hai ma trận, số cột của ma trận thứ nhất phải bằng số hàng của ma trận thứ hai.

Hint 2: Chỉ ra bước cần làm

Hãy lấy hàng thứ nhất của A nhân vô hướng với cột thứ hai của B.

Hint 3: Điền một phần

Phần đầu tiên là 2×4. Bạn hãy tìm phần còn lại.

Hint 4: Giải thích toàn bộ

Chỉ hiển thị khi người học đã thử nhiều lần hoặc chủ động yêu cầu.

AI Tutor còn có thể:

Phân tích lỗi.
Tạo bài tương tự.
Điều chỉnh độ khó.
Giải thích bằng tiếng Việt, tiếng Anh hoặc tiếng Trung phồn thể.
Chuyển đổi giữa giải thích đại số và hình học.
Kiểm tra lời giải tự do.
Socratic tutoring: hỏi từng bước thay vì đưa đáp án.
7. Kiến trúc nội dung

Không nên hard-code toàn bộ lesson vào giao diện.

Mỗi bài học nên được mô tả bằng JSON:

{
  "lessonId": "matrix-multiplication-01",
  "title": {
    "vi": "Nhân ma trận",
    "en": "Matrix Multiplication",
    "zh-Hant": "矩陣乘法"
  },
  "prerequisites": [
    "dot-product",
    "matrix-dimensions"
  ],
  "objectives": [
    "Kiểm tra hai ma trận có thể nhân hay không",
    "Tính một phần tử của ma trận tích",
    "Tính toàn bộ ma trận tích"
  ],
  "exercises": [
    {
      "type": "matrix_dimension_check",
      "difficulty": 1
    },
    {
      "type": "row_column_interaction",
      "difficulty": 2
    },
    {
      "type": "matrix_input",
      "difficulty": 3
    }
  ],
  "masteryThreshold": 0.8
}

Nhờ đó, bạn có thể tạo một Course Authoring System — Hệ thống soạn khóa học — 課程編輯系統 để thêm nội dung mà không sửa code app.

8. Kiến trúc hệ thống đề xuất
Loại phần mềm

Adaptive Learning Platform — Nền tảng học thích ứng — 適性學習平台

Nền tảng mục tiêu
Web app trước.
Mobile app sau.
Responsive cho điện thoại, tablet và desktop.
Có thể hỗ trợ PWA để học offline một phần.
9. Hai phương án công nghệ
Phương án A: MVP nhanh
Công nghệ
Thành phần	Lựa chọn
Frontend	Next.js + TypeScript
UI	Tailwind CSS + shadcn/ui
Math	KaTeX
Biểu đồ	JSXGraph hoặc D3.js
Animation	Framer Motion
Backend	Supabase
Database	PostgreSQL
Authentication	Supabase Auth
Storage	Supabase Storage
AI Tutor	OpenAI API hoặc model tương thích
Hosting	Vercel + Supabase
Mobile	PWA
Ưu điểm
Phát triển nhanh.
Ít DevOps.
Chi phí khởi đầu thấp.
Một người hoặc nhóm nhỏ có thể xây dựng.
Thích hợp để kiểm nghiệm course và UX.
Hạn chế
Các tương tác canvas phức tạp cần viết riêng.
Khả năng chạy code Python an toàn chưa tốt.
Hệ thống adaptive learning ban đầu còn đơn giản.
Phụ thuộc nhiều vào dịch vụ bên ngoài.
Phương án B: Dài hạn và mở rộng
Công nghệ
Thành phần	Lựa chọn
Web	Next.js + TypeScript
Mobile	React Native + Expo
Interactive engine	React + PixiJS hoặc Konva
Backend	NestJS
AI service	Python + FastAPI
Database	PostgreSQL
Cache	Redis
Queue	BullMQ hoặc Kafka
Analytics	ClickHouse
Object storage	S3-compatible storage
Code execution	Sandbox container riêng
Infrastructure	Docker + Kubernetes
Monitoring	OpenTelemetry + Grafana
Hosting	AWS, GCP hoặc Cloudflare
Ưu điểm
Dễ mở rộng nhiều môn học.
Phù hợp lượng người dùng lớn.
Có thể tách recommendation engine.
Quản lý analytics và A/B testing tốt.
Hỗ trợ mobile native.
Có thể triển khai code runner an toàn.
Hạn chế
Chi phí và độ phức tạp cao.
Cần đội backend, frontend, AI và DevOps.
Không phù hợp làm bản thử nghiệm đầu tiên.
10. Stack tôi khuyến nghị

Nên bắt đầu bằng:

Next.js
TypeScript
Tailwind CSS
shadcn/ui
Framer Motion
KaTeX
JSXGraph hoặc Konva
Supabase
PostgreSQL
Vercel
OpenAI API

Khi có người dùng thực tế, mới tách dần:

NestJS backend
Python adaptive-learning service
Redis
Analytics warehouse
React Native mobile app
Sandboxed Python runner

Không nên bắt đầu bằng microservices hoặc Kubernetes. Rủi ro lớn nhất của dự án này không phải server không đủ mạnh, mà là bài học không đủ hay và exercise engine không đủ trực quan.

11. Database cốt lõi

Các bảng chính:

users
courses
sections
units
lessons
skills
lesson_skills
exercises
exercise_variants
user_attempts
user_skill_mastery
review_schedule
daily_goals
streaks
xp_transactions
achievements
user_achievements
quests
quest_progress
leaderboards
subscriptions
ai_tutor_sessions
Bảng quan trọng nhất: user_attempts
id
user_id
exercise_id
answer
is_correct
error_type
response_time_ms
hints_used
attempt_number
created_at

Dữ liệu này là nền tảng cho:

Ôn tập cá nhân hóa.
Phát hiện kiến thức yếu.
Điều chỉnh độ khó.
Đánh giá chất lượng câu hỏi.
Huấn luyện recommendation engine.
12. MVP không nên làm quá nhiều

Bản MVP chỉ cần:

Đăng ký và đăng nhập.
Placement test đơn giản.
Learning path.
Ba section đầu: vector, hệ phương trình và ma trận.
Khoảng 40–60 lesson.
Sáu loại exercise.
Feedback từng bước.
XP và streak.
Practice lỗi sai.
Dashboard tiến độ.
CMS cơ bản để tạo lesson.
AI Tutor giới hạn trong nội dung bài học.

Tạm thời chưa cần:

League phức tạp.
Friend Quest.
Marketplace.
Nhiều khóa học.
SVD image lab đầy đủ.
Chạy Python trực tiếp.
Microservices.
Mobile native.
AI tự động tạo toàn bộ course.
13. Thứ tự triển khai
Giai đoạn 1: Thiết kế giáo dục
Xác định learner persona.
Xây knowledge graph.
Xác định prerequisite giữa các skill.
Viết mục tiêu cho từng lesson.
Thiết kế error taxonomy.
Xây 20 lesson mẫu.
Giai đoạn 2: Prototype UX
Learning path.
Lesson player.
Matrix input.
Vector canvas.
Feedback panel.
Progress dashboard.
Giai đoạn 3: MVP
Authentication.
Course engine.
Exercise engine.
Mastery tracking.
Practice queue.
XP và streak.
Content CMS.
Giai đoạn 4: Adaptive learning
Spaced repetition.
Skill mastery model.
Difficulty estimation.
Recommendation bài tiếp theo.
Phát hiện câu hỏi quá dễ hoặc quá khó.
Giai đoạn 5: Mở rộng
AI Tutor.
Python mode.
Linear transformation lab.
Eigenvalue lab.
SVD image compression.
Social và leaderboard.
React Native app.
14. Điểm khác biệt giúp app tốt hơn một bản “Duolingo clone”

Duolingo tối ưu cho việc hình thành thói quen. App của bạn cần kết hợp điều đó với tư duy toán học thực sự.

Sản phẩm nên có ba lớp:

Lớp 1: Trực giác
Nhìn, kéo, thử và quan sát

Lớp 2: Tính toán
Thực hiện phép toán từng bước

Lớp 3: Lập luận
Giải thích tại sao kết quả đúng

Một người chỉ hoàn thành các câu trắc nghiệm không nên được xem là đã thành thạo. Mastery cần dựa trên:

30% nhận biết khái niệm
30% tính toán chính xác
20% trực quan hình học
20% giải thích và vận dụng
Kết luận

Phiên bản phù hợp nhất không phải là “Duolingo nhưng thay từ vựng bằng công thức”, mà là:

Một nền tảng học Đại số tuyến tính thích ứng, có lộ trình như Duolingo, bài học ngắn, exercise tương tác, mô phỏng vector–ma trận, phản hồi lỗi từng bước và hệ thống ôn tập cá nhân hóa.

Ưu tiên phát triển theo thứ tự:

Course structure
→ Exercise engine
→ Visual mathematics
→ Error feedback
→ Mastery tracking
→ Spaced repetition
→ Gamification
→ AI Tutor
→ Social features

Trong đó, Exercise Engine + hệ thống phản hồi lỗi là lõi sản phẩm; streak, XP và mascot chỉ là lớp hỗ trợ động lực.