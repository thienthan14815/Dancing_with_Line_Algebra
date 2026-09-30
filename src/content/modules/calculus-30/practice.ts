import type { Exercise } from '../../../core/exercises/types';
import type { TeachingRule } from '../../../app/teaching/rules';

const tex = String.raw;
type Question = [prompt: string, answer: number, explain: string];
type Day = [formula: string, rule: string, condition: string, pitfall: string, questions: [Question, Question]];

// Short checks supplement the 134 original worked answers in content.json.
const days: Day[] = [
  [tex`f(a)=f(x)\big|_{x=a}`, 'Thay toàn bộ biến bằng giá trị đầu vào và giữ điều kiện xác định.', 'Đầu vào thuộc miền xác định; mẫu số phải khác không.', 'Rút gọn không làm mất điều kiện của biểu thức ban đầu.', [
    ['Cho f(x) = 3x − 2. Tính f(2).', 4, 'Thay x = 2: f(2) = 3 × 2 − 2 = 4.'],
    ['Cho f(x) = 3x − 2. Tính f(−1).', -5, 'f(−1) = 3 × (−1) − 2 = −5.']]],
  [tex`\log_a(a^x)=x`, 'Logarit là phép toán ngược của lũy thừa cùng cơ số.', 'Cơ số a > 0, a ≠ 1; đối số của logarit phải dương.', 'Không tách logarit của một tổng thành tổng logarit.', [
    ['Tính log₂(8).', 3, 'Vì 2³ = 8 nên log₂(8) = 3.'],
    ['Tính sin(π/2), với góc đo bằng radian.', 1, 'Góc π/2 ứng với điểm (0, 1) trên đường tròn đơn vị; sin bằng 1.']]],
  [tex`\lim_{x\to a}f(x)=f(a)`, 'Với hàm liên tục tại điểm xét, giới hạn bằng giá trị hàm tại điểm đó.', 'Chỉ thay trực tiếp khi hàm liên tục tại điểm đang xét.', 'Giới hạn mô tả tiến gần; hàm có thể không xác định ngay tại điểm đó.', [
    ['Tính giới hạn của 2x + 1 khi x tiến đến 3.', 7, 'Hàm đa thức liên tục: thay x = 3 được 2 × 3 + 1 = 7.'],
    ['Tính giới hạn của x² khi x tiến đến −2.', 4, 'Đa thức liên tục nên giới hạn là (−2)² = 4.']]],
  [tex`\frac{x^2-a^2}{x-a}=x+a\quad(x\ne a)`, 'Dạng 0/0 cần biến đổi trước khi tính giới hạn, chẳng hạn phân tích nhân tử.', 'Khử nhân tử chỉ với x ≠ a; sau đó xét giới hạn khi x tiến đến a.', '0/0 là dạng vô định, không phải kết quả bằng không.', [
    ['Tính giới hạn của (x² − 4)/(x − 2) khi x tiến đến 2.', 4, 'Với x ≠ 2, thương bằng x + 2. Giới hạn bằng 4.'],
    ['Tính giới hạn của (x² − 9)/(x − 3) khi x tiến đến 3.', 6, 'Khử nhân tử x − 3 với x ≠ 3, còn x + 3. Giới hạn là 6.']]],
  [tex`\lim_{x\to0}\frac{\sin x}{x}=1`, 'Giới hạn lượng giác cơ bản giúp xử lý tỉ số có sin của một góc nhỏ.', 'Góc tính bằng radian; biến tiến đến 0.', 'Ở vô cực phải so bậc và xét dấu của các hạng trội.', [
    ['Tính giới hạn sin(3x)/x khi x tiến đến 0 (radian).', 3, 'Viết thành 3 × sin(3x)/(3x); giới hạn bằng 3.'],
    ['Tính giới hạn (2x² + 1)/(x² + 3) khi x tiến đến +∞.', 2, 'Chia cả tử và mẫu cho x², các hạng 1/x² tiến về 0; kết quả là 2.']]],
  [tex`\lim_{x\to a}f(x)=f(a)`, 'Liên tục đòi hỏi giá trị hàm và giới hạn hai phía cùng tồn tại và bằng nhau.', 'Xét điểm trong miền xác định; tại đầu mút dùng giới hạn một phía.', 'Có giá trị hàm chưa đủ để kết luận liên tục.', [
    ['f(x) = (x² − 1)/(x − 1) với x ≠ 1, f(1) = k. Tìm k để f liên tục tại 1.', 2, 'Giới hạn của x + 1 tại 1 là 2, nên k = 2.'],
    ['f(x) = (x² − 4)/(x − 2) với x ≠ 2, f(2) = k. Tìm k để f liên tục tại 2.', 4, 'Giới hạn của x + 2 tại 2 là 4, nên k = 4.']]],
  [tex`f'(a)=\lim_{h\to0}\frac{f(a+h)-f(a)}h`, 'Đạo hàm là giới hạn của tốc độ thay đổi trung bình trên một khoảng co lại.', 'Giới hạn trong định nghĩa phải tồn tại và hữu hạn.', 'Tốc độ trung bình trên khoảng khác tốc độ tức thời tại một điểm.', [
    ['Vị trí s(t) = t². Tính vận tốc tức thời tại t = 3.', 6, 's′(t) = 2t nên s′(3) = 6.'],
    ['Cho f(x) = x². Tính tốc độ thay đổi trung bình từ x = 1 đến x = 3.', 4, '(f(3) − f(1))/(3 − 1) = (9 − 1)/2 = 4.']]],
  [tex`(x^n)'=nx^{n-1}`, 'Đạo hàm lũy thừa: nhân số mũ rồi giảm số mũ đi một.', 'Áp dụng tại các điểm mà hàm lũy thừa khả vi.', 'Đạo hàm của hằng số bằng 0, không giữ nguyên hằng số.', [
    ['Cho f(x) = x³ + 2x. Tính f′(2).', 14, 'f′(x) = 3x² + 2 nên f′(2) = 14.'],
    ['Cho f(x) = 5x² − 7. Tính f′(3).', 30, 'f′(x) = 10x; hằng số −7 có đạo hàm 0. Kết quả là 30.']]],
  [tex`(uv)'=u'v+uv',\quad (u/v)'=\frac{u'v-uv'}{v^2}`, 'Đạo hàm tích và thương phải tính đóng góp từ cả hai hàm thành phần.', 'u, v khả vi; quy tắc thương còn yêu cầu v ≠ 0.', 'Đạo hàm một tích không bằng tích hai đạo hàm.', [
    ['Cho f(x) = x²(x + 1). Tính f′(1).', 5, 'f′ = 2x(x + 1) + x²; tại 1 được 4 + 1 = 5.'],
    ['Cho f(x) = x/(x + 1). Tính f′(0).', 1, 'f′(x) = ((x + 1) − x)/(x + 1)² = 1/(x + 1)², nên f′(0) = 1.']]],
  [tex`(f\circ g)'(x)=f'(g(x))g'(x)`, 'Đạo hàm hàm hợp: lấy đạo hàm lớp ngoài rồi nhân đạo hàm lớp trong.', 'Hàm trong và hàm ngoài khả vi tại các điểm tương ứng.', 'Quên nhân đạo hàm bên trong là lỗi thường gặp.', [
    ['Cho y = (2x + 1)³. Tính y′ tại x = 0.', 6, 'y′ = 3(2x + 1)² × 2; tại 0 được 6.'],
    ['Cho y = (x² + 1)². Tính y′ tại x = 1.', 8, 'y′ = 2(x² + 1) × 2x; tại 1 được 8.']]],
  [tex`(e^x)'=e^x,\quad(\ln x)'=1/x,\quad(\sin x)'=\cos x`, 'Hàm mũ, logarit và lượng giác có quy tắc đạo hàm riêng, kết hợp với dây chuyền.', 'ln x yêu cầu x > 0; công thức lượng giác dùng radian.', 'Đạo hàm cos x là −sin x, cần giữ dấu trừ.', [
    ['Cho f(x) = e^(2x). Tính f′(0).', 2, 'f′(x) = 2e^(2x), nên f′(0) = 2.'],
    ['Cho f(x) = ln x. Tính f′(2).', 0.5, 'f′(x) = 1/x với x > 0, nên f′(2) = 1/2.']]],
  [tex`y=f(a)+f'(a)(x-a),\quad dy=f'(x)\,dx`, 'Đạo hàm xác định hệ số góc tiếp tuyến và xấp xỉ thay đổi nhỏ bằng vi phân.', 'Hàm khả vi tại điểm xét; xấp xỉ vi phân dùng cho thay đổi nhỏ.', 'Với hàm ẩn phải nhân y′ khi đạo hàm biểu thức chứa y.', [
    ['Tiếp tuyến của y = x² tại x = 2 có hệ số góc bao nhiêu?', 4, 'Hệ số góc là f′(2) = 2 × 2 = 4.'],
    ['Với y = x², x = 3 và dx = 0.1, tính vi phân dy.', 0.6, 'dy = 2x dx = 2 × 3 × 0.1 = 0.6.']]],
  [tex`f'>0\Rightarrow f\nearrow,\quad f'<0\Rightarrow f\searrow`, 'Dấu đạo hàm cho biết chiều biến thiên; đổi dấu giúp nhận diện cực trị.', 'Xét trên khoảng có đạo hàm; kiểm tra các điểm tới hạn và biên miền.', 'f′ = 0 chưa đủ để khẳng định có cực trị.', [
    ['Hàm f(x) = x² − 4x + 5 đạt giá trị nhỏ nhất tại x bằng bao nhiêu?', 2, 'f′ = 2x − 4 đổi dấu từ âm sang dương tại x = 2.'],
    ['Tính giá trị nhỏ nhất của f(x) = x² − 4x + 5 trên ℝ.', 1, 'f(x) = (x − 2)² + 1 ≥ 1, bằng 1 tại x = 2.']]],
  [tex`A(x)=x(p/2-x)`, 'Bài toán tối ưu cần lập hàm mục tiêu, xác định miền rồi so sánh các ứng viên.', 'Với hình chữ nhật chu vi p > 0, cạnh x thỏa 0 < x < p/2.', 'Trên đoạn đóng phải xét cả hai đầu mút khi tìm max hoặc min.', [
    ['Hình chữ nhật chu vi 24 có diện tích lớn nhất bao nhiêu?', 36, 'Hai cạnh tổng 12. A = x(12 − x) đạt lớn nhất tại x = 6, A = 36.'],
    ['Tìm giá trị lớn nhất của f(x) = x² trên đoạn [−1, 3].', 9, 'So sánh f(−1) = 1, f(0) = 0 và f(3) = 9; giá trị lớn nhất là 9.']]],
  [tex`\int x^n\,dx=\frac{x^{n+1}}{n+1}+C\quad(n\ne-1)`, 'Nguyên hàm đảo ngược phép đạo hàm và luôn có hằng số tùy ý.', 'Công thức lũy thừa yêu cầu n ≠ −1, trên khoảng hàm xác định.', 'Nguyên hàm của 1/x là ln|x| + C, không dùng mẫu n + 1 = 0.', [
    ['F′(x) = 2x và F(0) = 3. Tính F(2).', 7, 'F(x) = x² + C; F(0) = 3 cho C = 3. F(2) = 7.'],
    ['F′(x) = 3x² và F(0) = −1. Tính F(1).', 0, 'F(x) = x³ − 1 nên F(1) = 0.']]],
  [tex`u=g(x),\quad du=g'(x)\,dx`, 'Đổi biến ghép hàm bên trong và đạo hàm của nó thành một biến mới.', 'Biến đổi cả vi phân; với tích phân xác định phải đổi cả cận.', 'Không trộn cận theo x với biểu thức tích phân theo u.', [
    ['Tính tích phân từ 0 đến 1 của 2x(x² + 1) dx.', 1.5, 'Đặt u = x² + 1, cận 1 đến 2: tích phân u du = (4 − 1)/2 = 1.5.'],
    ['Tính tích phân từ 0 đến 1 của 3x²(x³ + 1) dx.', 1.5, 'Đặt u = x³ + 1; tích phân từ 1 đến 2 của u du bằng 1.5.']]],
  [tex`\int u\,dv=uv-\int v\,du`, 'Tích phân từng phần chuyển đạo hàm sang thừa số giúp bài toán đơn giản hơn.', 'Chọn u và dv sao cho tính được v và tích phân mới thuận lợi.', 'Giữ dấu trừ và đánh giá cả hai cận nếu là tích phân xác định.', [
    ['Tính tích phân từ 1 đến e của ln x dx.', 1, 'Chọn u = ln x, dv = dx. Nguyên hàm x ln x − x; tại e trừ tại 1 được 1.'],
    ['Tính tích phân từ 0 đến 1 của x ln(1 + x) dx.', 0.25, 'Từng phần cho ln 2 / 2 − (ln 2 − 1/2)/2 = 1/4.']]],
  [tex`\int_a^b f(x)\,dx=F(b)-F(a)`, 'Tích phân xác định bằng hiệu giá trị của nguyên hàm tại hai cận.', 'f liên tục trên [a,b] và F′ = f trên khoảng xét.', 'Lấy cận trên trừ cận dưới; không thêm C vào kết quả cuối.', [
    ['Tính tích phân từ 0 đến 2 của (x + 1) dx.', 4, 'Nguyên hàm x²/2 + x; tại 2 là 4, tại 0 là 0, hiệu bằng 4.'],
    ['Tính tích phân từ 1 đến 3 của 2x dx.', 8, 'Nguyên hàm x²; kết quả 3² − 1² = 8.']]],
  [tex`S=\int_a^b|f(x)-g(x)|\,dx`, 'Diện tích giữa hai đồ thị là tích phân của khoảng cách thẳng đứng giữa chúng.', 'Tìm giao điểm và chia khoảng tại nơi hai đồ thị đổi vị trí trên dưới.', 'Tích phân có dấu có thể triệt tiêu nhưng diện tích luôn không âm.', [
    ['Tính diện tích giữa y = x và trục Ox trên [−1, 1].', 1, 'Hai tam giác mỗi tam giác diện tích 1/2; tổng bằng 1.'],
    ['Tính diện tích giữa y = x và y = x² trên [0, 1].', 1/6, 'x ≥ x² nên diện tích là tích phân (x − x²), bằng 1/2 − 1/3 = 1/6.']]],
  [tex`V=\pi\int_a^b(R^2-r^2)\,dx,\quad f_{tb}=\frac1{b-a}\int_a^bf(x)\,dx`, 'Thể tích quay cộng các lát cắt; giá trị trung bình chia tích lũy cho độ dài khoảng.', 'Bán kính ngoài R ≥ r ≥ 0; giá trị trung bình cần b > a.', 'Bình phương từng bán kính, không bình phương hiệu R − r.', [
    ['Tính giá trị trung bình của f(x) = x² trên [0, 3].', 3, 'Tích phân x² từ 0 đến 3 bằng 9; chia độ dài 3 được 3.'],
    ['Quay miền 0 ≤ y ≤ 2, 0 ≤ x ≤ 3 quanh Ox. Nhập V/π.', 12, 'Đĩa bán kính 2: V = π × 2² × 3 = 12π; V/π = 12.']]],
  [tex`\Delta s=\int_a^bv(t)\,dt,\quad L=\int_a^b|v(t)|\,dt`, 'Tích phân vận tốc cho độ dời; tích phân tốc độ cho quãng đường đi được.', 'Vận tốc liên tục từng đoạn; thống nhất đơn vị thời gian và vận tốc.', 'Khi vận tốc đổi dấu, quãng đường khác độ lớn của độ dời.', [
    ['Vận tốc v(t) = 2t trên 0 ≤ t ≤ 3. Tính độ dời.', 9, 'Tích phân 2t từ 0 đến 3 bằng 3² − 0² = 9.'],
    ['Dòng điện không đổi 3 A chạy trong 4 s. Tính điện lượng (C).', 12, 'Điện lượng Q = tích phân I dt = 3 × 4 = 12 C.']]],
  [tex`\int_a^bf(x)\,dx=F(b)-F(a)`, 'Kiểm tra tích phân bằng cách chọn phương pháp và phân biệt tích lũy với diện tích.', 'Kiểm tra miền, cận, dấu và đơn vị trước khi kết luận.', 'Chỉ chọn đổi biến hoặc từng phần sau khi nhận diện cấu trúc hàm.', [
    ['Tính tích phân từ 0 đến 1 của (3x² + 2x) dx.', 2, 'Nguyên hàm x³ + x²; hiệu tại hai cận bằng 2.'],
    ['Tính diện tích giữa y = 2x và Ox trên [−1, 1].', 2, 'Hai tam giác có đáy 1, cao 2, mỗi tam giác diện tích 1; tổng 2.']]],
  [tex`f_x=\frac{\partial f}{\partial x},\quad f_y=\frac{\partial f}{\partial y}`, 'Đạo hàm riêng theo một biến giữ các biến còn lại cố định.', 'Xét tại điểm mà đạo hàm riêng tương ứng tồn tại.', 'Khi lấy đạo hàm theo x, y là hằng số nhưng không nhất thiết bằng 0.', [
    ['Cho f(x,y) = x²y + y². Tính fₓ tại (1,2).', 4, 'fₓ = 2xy; tại (1,2) được 2 × 1 × 2 = 4.'],
    ['Cho f(x,y) = x²y + y². Tính fᵧ tại (1,2).', 5, 'fᵧ = x² + 2y; tại (1,2) được 1 + 4 = 5.']]],
  [tex`df=f_xdx+f_ydy,\quad D_{\mathbf u}f=\nabla f\cdot\mathbf u`, 'Gradient gom các đạo hàm riêng; tích vô hướng với hướng đơn vị cho đạo hàm theo hướng.', 'f khả vi tại điểm xét; vector hướng u phải có độ dài 1.', 'Phải chuẩn hóa hướng trước khi tính đạo hàm theo hướng.', [
    ['f(x,y) = x² + y². Tại (1,2), dx = 0.1, dy = 0.2. Tính df.', 1, 'df = 2x dx + 2y dy = 2 × 0.1 + 4 × 0.2 = 1.'],
    ['f(x,y) = x² + y². Tính đạo hàm theo hướng đơn vị (1,0) tại (1,2).', 2, 'Gradient là (2,4); tích vô hướng với (1,0) bằng 2.']]],
  [tex`D=f_{xx}f_{yy}-f_{xy}^2`, 'Tại điểm dừng, định thức Hessian và dấu fₓₓ giúp phân loại cực trị hai biến.', 'Đạo hàm riêng cấp hai liên tục gần điểm dừng; D = 0 chưa kết luận.', 'D < 0 cho điểm yên ngựa, không phải cực đại.', [
    ['Với f(x,y) = x² + 2y², tính D = fₓₓfᵧᵧ − fₓᵧ² tại (0,0).', 8, 'fₓₓ = 2, fᵧᵧ = 4, fₓᵧ = 0 nên D = 8.'],
    ['Với f(x,y) = x² − y², tính định thức Hessian tại (0,0).', -4, 'fₓₓ = 2, fᵧᵧ = −2, fₓᵧ = 0 nên D = −4: điểm yên ngựa.']]],
  [tex`\mathbf v(t)=\mathbf r'(t),\quad v(t)=\|\mathbf r'(t)\|`, 'Đạo hàm đường cong tham số là vận tốc; độ dài vector vận tốc là tốc độ.', 'Đường cong khả vi tại thời điểm xét; tốc độ luôn không âm.', 'Vận tốc là vector còn tốc độ là một số.', [
    ['Với r(t) = (3t, 4t, 0), tính tốc độ.', 5, 'r′(t) = (3,4,0), độ dài √(9 + 16) = 5.'],
    ['Với r(t) = (3t, 4t, 0), tính độ dài đường đi từ t = 0 đến t = 2.', 10, 'Tốc độ không đổi bằng 5, độ dài là 5 × 2 = 10.']]],
  [tex`\nabla\cdot\mathbf F=P_x+Q_y+R_z`, 'Divergence cộng các đạo hàm theo trục tương ứng của một trường vector.', 'Các thành phần của trường có đạo hàm riêng tại điểm xét.', 'Divergence là số; curl trong không gian ba chiều là vector.', [
    ['Cho F = (x,y,z). Tính div F.', 3, 'div F = 1 + 1 + 1 = 3.'],
    ['Cho F = (−y,x,0). Tính thành phần z của curl F.', 2, 'Thành phần z là ∂Q/∂x − ∂P/∂y = 1 − (−1) = 2.']]],
  [tex`\iint_D f\,dA=\int_a^b\int_c^d f(x,y)\,dy\,dx`, 'Tích phân kép trên hình chữ nhật tính lần lượt từ biến ở trong ra ngoài.', 'D = [a,b] × [c,d], hàm liên tục; miền khác cần cận phụ thuộc biến.', 'Đổi thứ tự tích phân phải mô tả lại đúng miền.', [
    ['Tính tích phân kép của x + y trên 0 ≤ x ≤ 1, 0 ≤ y ≤ 2.', 3, 'Tích phân theo y cho 2x + 2; tích phân theo x từ 0 đến 1 bằng 3.'],
    ['Tính tích phân kép của 1 trên 0 ≤ x ≤ 2, 0 ≤ y ≤ 3.', 6, 'Tích phân của 1 bằng diện tích hình chữ nhật: 2 × 3 = 6.']]],
  [tex`x=r\cos\theta,\quad y=r\sin\theta,\quad dA=r\,dr\,d\theta`, 'Đổi sang tọa độ cực phải thêm hệ số r vào phần tử diện tích.', 'r ≥ 0; chọn cận r và θ phủ đúng miền cần tính.', 'Quên hệ số Jacobian r làm sai tích phân trong tọa độ cực.', [
    ['Tính diện tích hình tròn bán kính 2. Nhập kết quả chia cho π.', 4, 'Tích phân r dr dθ với r từ 0 đến 2, θ từ 0 đến 2π cho 4π; chia π được 4.'],
    ['Tính tích phân ba lớp của 1 trên hộp [0,1] × [0,2] × [0,3].', 6, 'Tích phân bằng thể tích khối hộp: 1 × 2 × 3 = 6.']]],
  [tex`f'(a)=\lim_{h\to0}\frac{f(a+h)-f(a)}h,\quad\int_a^bf=F(b)-F(a)`, 'Bài tổng kết yêu cầu nhận dạng bài và chọn công cụ từ giới hạn đến tích phân nhiều biến.', 'Luôn kiểm tra điều kiện xác định, cận, hướng và đơn vị của từng bài.', 'Không dùng một công thức cho mọi dạng; ghi lại nhóm câu sai để ôn.', [
    ['Tính giới hạn (x² − 4)/(x − 2) khi x tiến đến 2.', 4, 'Khử x − 2 với x ≠ 2, còn x + 2; giới hạn bằng 4.'],
    ['Tính tích phân ba lớp của 1 trên hộp [0,1] × [0,2] × [0,3].', 6, 'Tích phân bằng thể tích 1 × 2 × 3 = 6.']]],
];

export const calculusRules: Record<string, TeachingRule> = Object.fromEntries(days.map((day, index) => {
  const [formula, rule, condition, pitfall, questions] = day;
  return [`calculus_d${String(index + 1).padStart(2, '0')}`, {
    formula, rule, condition, pitfall,
    example: [questions[0][0], 'Chọn công thức, kiểm tra điều kiện rồi thay dữ kiện của đề.', questions[0][2]],
    visual: ['Dữ kiện và miền', 'Áp dụng quy tắc', 'Kiểm tra kết quả'],
  }];
}));

export const exercises: Exercise[] = days.flatMap((day, index) => day[4].map(([prompt, answer, explain], question) => ({
  id: `calculus-d${String(index + 1).padStart(2, '0')}-${question + 1}`,
  skillId: `calculus_d${String(index + 1).padStart(2, '0')}`,
  type: 'numeric-input' as const, dimension: 'compute' as const,
  difficulty: 1 as const, prompt, answer, tolerance: 0.001, explain,
  hints: [{ level: 1 as const, text: day[1] }, { level: 2 as const, text: day[2] }],
})));
