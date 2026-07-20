Để học Linear Algebra – Đại số tuyến tính hiệu quả, bạn không nên bắt đầu ngay bằng SVD hay eigenvalue. Hãy học theo chuỗi:

số → vector → hệ phương trình → ma trận → không gian vector → eigenvalue → SVD → ứng dụng bằng code.

Giai đoạn 0: Kiến thức nền

Trước khi học đại số tuyến tính, cần biết:

Phương trình bậc nhất
Hệ phương trình hai, ba ẩn
Hàm số và đồ thị tọa độ
Căn bậc hai, lũy thừa
Tổng sigma cơ bản
Một ít lượng giác: sin, cos, góc và độ dài

Ví dụ phải giải được:

{
2x+y=5
x−y=1
	​


Không cần giỏi giải tích trước khi bắt đầu đại số tuyến tính.

Lộ trình học từng bước
Bước 1: Vector

Học vector trước ma trận.

Cần hiểu:

Vector là gì
Vector hàng và vector cột
Vector 2D, 3D và vector nhiều chiều
Cộng, trừ vector
Nhân vector với một số
Độ dài vector
Vector đơn vị
Tích vô hướng — dot product
Góc giữa hai vector

Ví dụ:

v=[
3
4
	​

]

Độ dài:

∥v∥=
3
2
+4
2
	​

=5

Python:

import numpy as np

v = np.array([3, 4])

length = np.linalg.norm(v)
unit_vector = v / length

print("Độ dài:", length)
print("Vector đơn vị:", unit_vector)
Phải hiểu được ý nghĩa hình học

Vector không chỉ là một danh sách số. Nó có thể biểu diễn:

Vị trí
Hướng di chuyển
Tốc độ
Màu sắc RGB
Đặc trưng của dữ liệu
Một từ trong mô hình AI
Trạng thái của nhân vật trong game
Bước 2: Tổ hợp tuyến tính

Học cách tạo một vector mới từ các vector có sẵn:

w=au+bv

Ví dụ:

u=[
1
0
	​

],v=[
0
1
	​

]

Thì mọi vector 2D đều có thể viết thành:

[
x
y
	​

]=xu+yv

Các khái niệm cần học:

Linear combination — tổ hợp tuyến tính
Span — không gian sinh
Linear dependence — phụ thuộc tuyến tính
Linear independence — độc lập tuyến tính
Basis — cơ sở
Dimension — số chiều

Đây là phần quan trọng nhất để hiểu bản chất đại số tuyến tính.

Bước 3: Hệ phương trình tuyến tính

Hiểu hệ phương trình dưới dạng ma trận:

{
2x+y=5
x−y=1
	​


Viết thành:

Ax=b

Trong đó:

A=[
2
1
	​

1
−1
	​

],x=[
x
y
	​

],b=[
5
1
	​

]

Cần học:

Ma trận mở rộng
Phép biến đổi sơ cấp trên hàng
Gaussian elimination
Gauss–Jordan elimination
Row echelon form
Reduced row echelon form
Hệ có một nghiệm, vô số nghiệm hoặc vô nghiệm

Python:

import numpy as np

A = np.array([
    [2, 1],
    [1, -1]
], dtype=float)

b = np.array([5, 1], dtype=float)

x = np.linalg.solve(A, b)

print(x)

Kết quả:

[2. 1.]
Bước 4: Ma trận cơ bản

Sau khi hiểu vector và hệ phương trình, học ma trận.

Cần biết:

Kích thước ma trận
Ma trận hàng, cột
Ma trận vuông
Ma trận không
Ma trận đơn vị
Ma trận đường chéo
Ma trận tam giác
Ma trận đối xứng
Chuyển vị

Ví dụ:

A=[
1
3
	​

2
4
	​

]

Chuyển vị:

A
T
=[
1
2
	​

3
4
	​

]

Python:

import numpy as np

A = np.array([
    [1, 2],
    [3, 4]
])

print(A.shape)
print(A.T)
Bước 5: Phép nhân ma trận

Đây là kiến thức trực tiếp liên quan đến việc biến đổi hình ảnh.

Điều kiện:

A
m×n
	​

B
n×p
	​


Kết quả:

AB=C
m×p
	​


Ví dụ:

[
1
3
	​

2
4
	​

][
5
6
	​

]=[
17
39
	​

]

Python:

import numpy as np

A = np.array([
    [1, 2],
    [3, 4]
])

v = np.array([5, 6])

result = A @ v

print(result)

Cần đặc biệt hiểu:

AB

=BA

Thứ tự phép nhân rất quan trọng.

Ví dụ khi xử lý ảnh:

combined = translation @ rotation @ shear @ scale

Phép biến đổi ở bên phải được áp dụng trước.

Bước 6: Biến đổi tuyến tính

Hãy xem ma trận như một hàm biến đổi không gian:

T(x)=Ax

Một ma trận có thể:

Phóng to, thu nhỏ
Xoay
Lật
Kéo nghiêng
Chiếu vector
Làm thay đổi hệ tọa độ
Scaling
S=[
s
x
	​

0
	​

0
s
y
	​

	​

]
Rotation
R=[
cosθ
sinθ
	​

−sinθ
cosθ
	​

]
Shear
H=[
1
0
	​

k
1
	​

]

Python:

import numpy as np
import math

angle = math.radians(30)

rotation = np.array([
    [math.cos(angle), -math.sin(angle)],
    [math.sin(angle),  math.cos(angle)]
])

point = np.array([100, 50])

new_point = rotation @ point

print(new_point)

Đây là giai đoạn nên thực hành bằng:

Biến đổi một điểm
Biến đổi hình vuông
Vẽ trước và sau biến đổi
Sau đó mới biến đổi toàn bộ ảnh
Bước 7: Định thức

Định thức:

det(A)

Nó giúp trả lời:

Ma trận có nghịch đảo hay không
Biến đổi làm diện tích tăng hay giảm
Không gian có bị ép xuống chiều thấp hơn không
Hướng của hệ tọa độ có bị đảo không

Với ma trận:

A=[
a
c
	​

b
d
	​

]

Ta có:

det(A)=ad−bc

Ý nghĩa:

det(A) = 0: ma trận không khả nghịch
|det(A)| > 1: diện tích bị phóng đại
0 < |det(A)| < 1: diện tích bị thu nhỏ
det(A) < 0: hướng không gian bị đảo

Python:

import numpy as np

A = np.array([
    [2, 1],
    [1, 3]
])

determinant = np.linalg.det(A)

print(determinant)
Bước 8: Ma trận nghịch đảo

Ma trận nghịch đảo thỏa mãn:

A
−1
A=I

Nếu:

Ax=b

Thì về lý thuyết:

x=A
−1
b

Python:

import numpy as np

A = np.array([
    [2, 1],
    [1, 3]
], dtype=float)

inverse = np.linalg.inv(A)

print(inverse)
print(inverse @ A)

Tuy nhiên trong lập trình số, thường nên dùng:

x = np.linalg.solve(A, b)

thay vì tự tính:

x = np.linalg.inv(A) @ b

Vì solve thường ổn định và hiệu quả hơn.

Bước 9: Không gian vector

Đây là phần chuyển từ “biết tính toán” sang “hiểu đại số tuyến tính”.

Cần học:

Vector space
Subspace
Column space
Row space
Null space
Basis
Dimension
Rank
Rank–nullity theorem

Đặc biệt phải hiểu:

Column space

Tập hợp mọi đầu ra có thể có của:

Ax
Null space

Tập hợp mọi vector thỏa mãn:

Ax=0
Rank

Số chiều thông tin độc lập mà ma trận giữ lại.

Trong nén ảnh bằng SVD, rank chính là khái niệm rất quan trọng.

Bước 10: Tích vô hướng, trực giao và phép chiếu

Cần học:

Orthogonal vectors
Orthonormal basis
Projection
Gram–Schmidt
QR decomposition

Hai vector vuông góc khi:

u⋅v=0

Phép chiếu vector a lên vector b:

proj
b
	​

(a)=
∥b∥
2
a⋅b
	​

b

Ứng dụng:

Tìm đường gần nhất
Computer graphics
Camera 3D
Least squares
Machine learning
Khử thành phần không cần thiết
Bước 11: Least Squares

Không phải hệ phương trình nào cũng có nghiệm chính xác.

Khi dữ liệu có nhiễu, ta tìm nghiệm gần đúng tốt nhất:

x
min
	​

∥Ax−b∥
2

Phương trình chuẩn:

A
T
Ax=A
T
b

Ứng dụng:

Hồi quy tuyến tính
Dự đoán dữ liệu
Khớp đường thẳng
Phân tích dữ liệu
Computer vision

Python:

import numpy as np

A = np.array([
    [1, 1],
    [1, 2],
    [1, 3],
    [1, 4]
], dtype=float)

b = np.array([2, 2.8, 4.1, 5.2])

solution, residuals, rank, singular_values = np.linalg.lstsq(
    A,
    b,
    rcond=None
)

intercept, slope = solution

print("Intercept:", intercept)
print("Slope:", slope)
Bước 12: Eigenvalue và Eigenvector

Eigenvector là vector không đổi hướng sau khi qua phép biến đổi:

Av=λv

Trong đó:

v: eigenvector
λ: eigenvalue

Ma trận có thể làm eigenvector:

Dài ra
Ngắn lại
Đảo hướng

Nhưng vẫn nằm trên cùng một đường thẳng.

Cần học:

Characteristic polynomial
Eigenvalue
Eigenvector
Eigenspace
Diagonalization
Symmetric matrices

Python:

import numpy as np

A = np.array([
    [2, 1],
    [1, 2]
], dtype=float)

eigenvalues, eigenvectors = np.linalg.eig(A)

print("Eigenvalues:")
print(eigenvalues)

print("Eigenvectors:")
print(eigenvectors)

Ứng dụng:

PCA
PageRank
Hệ động lực
Phân tích rung động
Quantum computing
Machine learning
Bước 13: Phân rã ma trận

Sau khi hiểu eigenvalue, học các cách phân rã ma trận:

LU decomposition
A=LU

Dùng để giải hệ phương trình.

QR decomposition
A=QR

Trong đó Q trực chuẩn và R tam giác trên.

Eigendecomposition
A=PDP
−1
SVD
A=UΣV
T

Không cần học tất cả cùng lúc. Thứ tự hợp lý:

LU
QR
Eigendecomposition
SVD
Bước 14: SVD

SVD là một trong những nội dung quan trọng nhất trong đại số tuyến tính ứng dụng.

A=UΣV
T

Ý nghĩa hình học:

Vᵀ: xoay hoặc đổi hệ trục đầu vào
Σ: kéo giãn hoặc thu nhỏ theo từng hướng
U: xoay sang đầu ra

Giữ lại k singular values lớn nhất:

A
k
	​

=U
k
	​

Σ
k
	​

V
k
T
	​


Ta có một ma trận gần đúng rank thấp.

Ứng dụng:

Nén ảnh
Khử nhiễu
PCA
Recommendation system
Xử lý văn bản
Giảm chiều dữ liệu

Python:

import numpy as np

A = np.array([
    [3, 2, 2],
    [2, 3, -2]
], dtype=float)

U, singular_values, Vt = np.linalg.svd(
    A,
    full_matrices=False
)

Sigma = np.diag(singular_values)

reconstructed = U @ Sigma @ Vt

print("U:")
print(U)

print("Singular values:")
print(singular_values)

print("Vᵀ:")
print(Vt)

print("Reconstructed:")
print(reconstructed)
Lộ trình thực hành bằng code

Mỗi chủ đề nên học theo vòng lặp:

Hiểu hình học
Tính tay một bài nhỏ
Viết code không dùng NumPy
Kiểm tra lại bằng NumPy
Trực quan hóa bằng Matplotlib
Áp dụng vào một bài toán thật
Project 1: Vector playground

Viết chương trình:

Nhập hai vector
Tính độ dài
Tính dot product
Tính góc
Vẽ hai vector
Tính projection
Project 2: Giải hệ phương trình

Tự viết:

Gaussian elimination
Back substitution
Kiểm tra nghiệm bằng NumPy
Project 3: Matrix transformation

Tạo một hình vuông và áp dụng:

Scaling
Rotation
Shear
Reflection
Nhiều phép biến đổi liên tiếp
Project 4: Image transformation

Dùng ma trận để:

Xoay ảnh
Kéo nghiêng ảnh
Lật ảnh
Thay đổi tỷ lệ
Perspective transformation
Project 5: Least squares
Tạo dữ liệu có nhiễu
Khớp đường thẳng
So sánh đường dự đoán với dữ liệu thật
Project 6: Eigenvector visualization
Vẽ nhiều vector
Nhân với cùng một ma trận
Quan sát vector nào không đổi hướng
Project 7: SVD image compression
Tách ảnh thành RGB
SVD từng channel
Thử rank = 5, 20, 50, 100, 200
So sánh chất lượng và dung lượng lý thuyết
Kế hoạch học trong 8 tuần
Tuần 1: Vector
Vector và tọa độ
Cộng, trừ, nhân vô hướng
Norm
Dot product
Góc giữa vector
Tuần 2: Hệ phương trình và ma trận
Hệ tuyến tính
Ma trận
Phép biến đổi hàng
Gaussian elimination
Tuần 3: Nhân ma trận và biến đổi tuyến tính
Matrix multiplication
Rotation
Scaling
Shear
Composition
Tuần 4: Determinant, inverse và rank
Determinant
Inverse
Rank
Column space
Null space
Tuần 5: Basis và orthogonality
Basis
Dimension
Orthogonal
Projection
Gram–Schmidt
Tuần 6: Least squares và QR
Overdetermined systems
Least squares
Linear regression
QR decomposition
Tuần 7: Eigenvalue
Eigenvalue
Eigenvector
Diagonalization
Symmetric matrices
Tuần 8: SVD và project
SVD
Low-rank approximation
Nén ảnh
PCA cơ bản
Cách học mỗi ngày

Mỗi ngày khoảng 60–90 phút:

20 phút: học khái niệm
20 phút: tính tay
20 phút: code Python
10–30 phút: trực quan hóa hoặc làm project

Không nên chỉ xem video. Đại số tuyến tính cần đồng thời:

Nhìn hình
Tính tay
Viết code
Giải thích lại bằng lời của mình
Công cụ nên dùng
pip install numpy matplotlib scipy pillow opencv-python

Vai trò:

NumPy: vector, matrix, SVD, eigenvalue
Matplotlib: trực quan hóa
SciPy: thuật toán tuyến tính nâng cao
Pillow: đọc và xử lý ảnh
OpenCV: affine và perspective transformation
Thứ tự tối ưu cho mục tiêu xử lý ảnh của bạn

Vì bạn đang muốn dùng ma trận để làm méo ảnh và dùng SVD để nén ảnh, hãy ưu tiên:

Vector
↓
Matrix
↓
Matrix multiplication
↓
Coordinate systems
↓
Linear transformation
↓
Homogeneous coordinates
↓
Affine transformation
↓
Determinant và rank
↓
Orthogonality
↓
Eigenvalue
↓
SVD
↓
Image compression

Bạn chưa cần học toàn bộ lý thuyết trừu tượng trước khi code. Có thể vừa học đến matrix transformation là bắt đầu xử lý ảnh, sau đó quay lại học rank, eigenvalue và SVD sâu hơn.