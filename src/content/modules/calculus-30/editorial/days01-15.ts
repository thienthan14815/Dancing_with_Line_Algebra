import type { EditorialLesson } from './types';

const t = String.raw;

/** Original extensions. The imported lessons remain the source-reading layer. */
export const days01to15: Record<string, EditorialLesson> = {
  d01: {
    lead: 'Một công thức chỉ trở thành hàm số hoàn chỉnh khi biết đầu vào nào được chấp nhận. Hãy kiểm tra điều kiện trước khi bấm máy hoặc rút gọn.',
    prerequisites: ['Thứ tự nhân chia trước, cộng trừ sau.', 'Phân tích hiệu hai bình phương thành tích.'],
    intuition: [
      'Miền xác định giống bộ lọc trước cửa một máy tính: đầu vào phải vượt qua tất cả điều kiện cùng lúc. Nếu có cả căn và mẫu, lấy phần giao của các điều kiện, không chọn một trong hai.',
      'Hai biểu thức bằng nhau ở những điểm cùng xác định chưa chắc mô tả cùng một hàm. Việc khử một nhân tử có thể che mất một đầu vào bị cấm; đồ thị vẫn phải giữ lỗ hổng ấy.',
    ],
    method: [
      { title: 'Đọc cấu trúc', detail: 'Đánh dấu căn, mẫu và logarit trước mọi biến đổi.' },
      { title: 'Ghép điều kiện', detail: 'Giải từng bất đẳng thức hoặc điều kiện khác không, rồi lấy giao.' },
      { title: 'Thay số có kiểm soát', detail: 'Chỉ thay đầu vào đã được chấp nhận; ghi điều kiện bên cạnh kết quả rút gọn.' },
    ],
    worked: {
      title: 'Khi căn nằm trên một phân thức', prompt: t`Tìm miền xác định và tính $h(4)$ của $h(x)=\dfrac{\sqrt{x+2}}{x-1}$.`,
      steps: [
        { tex: t`x+2\ge 0\ \Longrightarrow\ x\ge -2`, explanation: 'Căn bậc hai thực đòi hỏi biểu thức dưới căn không âm.' },
        { tex: t`x-1\ne0\ \Longrightarrow\ x\ne1`, explanation: 'Phép chia còn loại riêng điểm 1, dù căn tại đó vẫn có nghĩa.' },
        { tex: t`D=[-2,1)\cup(1,+\infty),\qquad h(4)=\frac{\sqrt6}{3}`, explanation: 'Lấy giao hai điều kiện, sau đó thay 4 vào công thức ban đầu.' },
      ],
      result: t`$D=[-2,1)\cup(1,+\infty)$ và $h(4)=\sqrt6/3$.`,
      check: t`Thử $x=-2$: căn bằng 0, mẫu bằng $-3$, nên hợp lệ. Thử $x=1$: mẫu bằng 0 nên bị loại. Bình phương $h(4)$ cho $6/9=2/3$.`,
    },
    transfer: { prompt: t`Với $p(x)=\sqrt{5-x}/(x+2)$, những đầu vào nào hợp lệ?`, answer: t`$(-\infty,-2)\cup(-2,5]$.`, explanation: 'Căn yêu cầu x không vượt quá 5, mẫu loại −2; đầu mút 5 vẫn được nhận.' },
    connections: ['Lỗ hổng do rút gọn sẽ trở lại ở giới hạn ngày 3–4.', 'Điều kiện đầu vào cũng cần giữ khi giải bài tối ưu.'],
    checkpoint: { prompt: t`Rút gọn $(x^2-4)/(x-2)$ thành $x+2$ cho phép kết luận nào?`, options: ['Hàm ban đầu nhận mọi số thực.', 'Hai biểu thức bằng nhau khi x khác 2.', 'Hàm ban đầu có giá trị 4 tại x = 2.', 'Điều kiện x khác 2 có thể bỏ sau khi khử.'], answerIndex: 1, explain: 'Đẳng thức sau khử chỉ đúng trên miền xác định ban đầu; khử không tạo thêm giá trị hàm.' },
  },
  d02: {
    lead: 'Lũy thừa, logarit và radian đều đổi cách diễn đạt một lượng. Hiểu cách đổi giúp nhận dạng công thức trước khi tính.',
    prerequisites: ['Quy tắc nhân các lũy thừa cùng cơ số.', 'Chu vi đường tròn bằng hai lần bán kính nhân π.'],
    intuition: [
      'Logarit trả lời câu hỏi “cần bao nhiêu lần tăng theo cơ số này?”. Vì thế phương trình mũ và phương trình logarit là hai cách kể cùng một quan hệ; đối số dương không phải điều kiện trang trí.',
      'Radian đo góc bằng độ dài cung chia bán kính. Một góc cố định có cùng số đo radian trên mọi đường tròn vì cung và bán kính tăng cùng tỉ lệ; đây là cầu nối giữa hình học và giải tích.',
    ],
    method: [
      { title: 'Chọn ngôn ngữ', detail: 'Đổi căn thành lũy thừa phân số khi cần dùng quy tắc số mũ; đổi logarit thành phương trình mũ để tìm số.' },
      { title: 'Giữ điều kiện', detail: 'Kiểm tra cơ số dương, khác 1 và đối số logarit dương.' },
      { title: 'Kiểm tra đơn vị', detail: 'Đổi góc về radian trước công thức độ dài cung hoặc công thức giải tích lượng giác.' },
    ],
    worked: {
      title: 'Từ chiều dài cung đến giá trị lượng giác', prompt: t`Một đường tròn bán kính $6$ cm có cung dài $2\pi$ cm. Tính góc ở tâm và sin của góc đó.`,
      steps: [
        { tex: t`\theta=\frac{s}{r}=\frac{2\pi}{6}=\frac\pi3`, explanation: 'Tỉ số hai độ dài cùng đơn vị cho góc đo bằng radian.' },
        { tex: t`\frac{\theta}{2\pi}=\frac16`, explanation: 'Góc này chiếm một phần sáu vòng tròn, tức 60 độ.' },
        { tex: t`\sin\theta=\sin\frac\pi3=\frac{\sqrt3}{2}`, explanation: 'Đọc tung độ điểm tương ứng trên đường tròn đơn vị.' },
      ],
      result: t`Góc bằng $\pi/3$ rad và sin bằng $\sqrt3/2$.`,
      check: t`Chu vi là $12\pi$ cm; lấy một phần sáu được $2\pi$ cm, đúng độ dài đã cho. Đồng thời $\sin^2\theta+\cos^2\theta=3/4+1/4=1$.`,
    },
    transfer: { prompt: t`Giải $\log_3(x-1)=2$.`, answer: '$x=10$.', explanation: 'Điều kiện x > 1. Đổi sang x − 1 = 3² = 9, được x = 10; thay lại đối số 9 cho logarit bằng 2.' },
    connections: ['Ngày 5 dùng radian để giới hạn sin x / x bằng 1.', 'Ngày 11 giải thích tốc độ thay đổi của hàm mũ và logarit.'],
    checkpoint: { prompt: 'Vì sao góc θ = s/r không phụ thuộc kích thước đường tròn?', options: ['Mọi đường tròn có cùng chu vi.', 'Độ dài cung luôn bằng bán kính.', 'Cung và bán kính cùng tăng theo một tỉ lệ.', 'Radian là một đơn vị chiều dài.'], answerIndex: 2, explain: 'Phóng to đường tròn k lần làm s và r đều nhân k; thương s/r không đổi.' },
  },
  d03: {
    lead: 'Giới hạn đọc hành vi quanh một điểm. Giá trị tại chính điểm ấy là một thông tin khác và có thể được thay đổi độc lập.',
    prerequisites: ['Tính giá trị hàm số theo từng trường hợp.', 'Hiểu số tiến gần từ bên trái và bên phải.'],
    intuition: [
      'Hãy tưởng tượng che đúng một chấm trên đồ thị rồi nhìn đường cong hai bên đi về đâu. Nếu cả hai phía cùng hướng tới một độ cao, đó là ứng viên cho giới hạn dù chấm bị che nằm ở nơi khác.',
      'Một bảng số hữu hạn chỉ giúp phỏng đoán. Muốn kết luận, cần biểu thức hoặc lập luận đúng cho mọi đầu vào đủ gần; vài giá trị trên máy tính có thể bỏ sót một bước nhảy hoặc dao động.',
    ],
    method: [
      { title: 'Tách ba câu hỏi', detail: 'Tính giá trị tại điểm, giới hạn trái và giới hạn phải riêng biệt.' },
      { title: 'Đọc công thức lân cận', detail: 'Dùng nhánh áp dụng ở các điểm gần đó, không tự động dùng giá trị được gán tại điểm.' },
      { title: 'Đối chiếu hai phía', detail: 'Giới hạn hai phía tồn tại khi hai giới hạn một phía tồn tại và bằng nhau.' },
    ],
    worked: {
      title: 'Một chấm khác không làm đường cong đổi hướng', prompt: t`Cho $f(x)=x+2$ khi $x\ne1$ và $f(1)=8$. Tìm giới hạn tại 1 và so với giá trị hàm.`,
      steps: [
        { tex: t`f(1)=8`, explanation: 'Giá trị ở đúng điểm 1 lấy theo nhánh riêng trong đề.' },
        { tex: t`\lim_{x\to1^-}f(x)=\lim_{x\to1^-}(x+2)=3`, explanation: 'Với x bên trái và gần 1, nhánh x + 2 được áp dụng.' },
        { tex: t`\lim_{x\to1^+}f(x)=3\ \Longrightarrow\ \lim_{x\to1}f(x)=3`, explanation: 'Phía phải cho cùng độ cao, nên giới hạn hai phía bằng 3.' },
      ],
      result: '$f(1)=8$ nhưng giới hạn tại 1 bằng 3.',
      check: t`Với $x\ne1$, $|f(x)-3|=|x-1|$. Muốn sai lệch đầu ra nhỏ hơn 0,01, chỉ cần $0<|x-1|<0,01$; giá trị 8 không tham gia.`,
    },
    transfer: { prompt: 'Một hàm có giới hạn trái bằng 2, giới hạn phải bằng 5 tại a. Có thể chọn f(a) để giới hạn hai phía tồn tại không?', answer: 'Không thể.', explanation: 'Thay một giá trị tại a không thay đổi hai hành vi lân cận đang khác nhau.' },
    connections: ['Ngày 6 thêm điều kiện giá trị hàm bằng giới hạn để có tính liên tục.', 'Đạo hàm ngày 7 cũng là giới hạn của một đại lượng quanh điểm xét.'],
    checkpoint: { prompt: 'Nếu chỉ thay f(a) mà giữ mọi giá trị khác, đại lượng nào chắc chắn không đổi?', options: ['Giới hạn tại a, nếu nó đã tồn tại.', 'Tính liên tục tại a.', 'Giá trị f(a).', 'Đạo hàm tại a.'], answerIndex: 0, explain: 'Giới hạn bỏ qua đúng điểm a. Liên tục và đạo hàm còn phụ thuộc giá trị tại điểm, nên có thể bị thay đổi.' },
  },
  d04: {
    lead: 'Dạng 0/0 báo rằng thay số quá sớm đã xóa thông tin về tốc độ tiến về không. Biến đổi đại số giúp lấy lại thông tin đó.',
    prerequisites: ['Hiệu hai bình phương và nhân liên hợp.', 'Phân biệt giới hạn với giá trị tại điểm.'],
    intuition: [
      'Hai lượng cùng nhỏ đi không có nghĩa thương của chúng nhỏ. Chẳng hạn 2h/h luôn bằng 2 khi h khác 0. Ta cần so sánh mức độ nhỏ của tử và mẫu thay vì nhìn riêng từng phần.',
      'Nhân liên hợp thay một hiệu chứa căn bằng một hiệu không chứa căn. Đây là phép nhân với 1 trên miền hợp lệ, giúp lộ nhân tử gây 0/0 mà không đổi thương tại các điểm đang xét.',
    ],
    method: [
      { title: 'Thử thay để phân loại', detail: 'Nếu mẫu bằng 0, phân biệt dạng 0/0 với tử khác 0; hai tình huống không cùng cách xử lý.' },
      { title: 'Chọn cấu trúc cần mở', detail: 'Đa thức thường dùng phân tích nhân tử; hiệu chứa căn thường dùng liên hợp.' },
      { title: 'Khử rồi lấy giới hạn', detail: 'Ghi x khác điểm xét khi khử. Chỉ thay số vào biểu thức mới khi mẫu mới không bằng 0.' },
    ],
    worked: {
      title: 'Lộ nhân tử nằm dưới dấu căn', prompt: t`Tính $\lim_{x\to0}\dfrac{\sqrt{4+x}-2}{x}$.`,
      steps: [
        { tex: t`\frac{\sqrt{4+x}-2}{x}\cdot\frac{\sqrt{4+x}+2}{\sqrt{4+x}+2}`, explanation: 'Gần 0, căn xác định và biểu thức liên hợp dương nên phép biến đổi hợp lệ.' },
        { tex: t`\frac{x}{x(\sqrt{4+x}+2)}=\frac1{\sqrt{4+x}+2}\quad(x\ne0)`, explanation: 'Hiệu hai bình phương cho tử x; khử tại các điểm khác 0.' },
        { tex: t`\lim_{x\to0}\frac1{\sqrt{4+x}+2}=\frac14`, explanation: 'Mẫu mới tiến tới 4 nên có thể thay trực tiếp.' },
      ],
      result: '$1/4$.',
      check: 'Với x = 0,04, thương sau biến đổi xấp xỉ 0,24938; với x = −0,04, xấp xỉ 0,25063. Hai phía phù hợp kết quả, còn phép biến đổi trên mới là chứng minh.',
    },
    transfer: { prompt: t`Tính $\lim_{x\to0}(\sqrt{9+x}-3)/x$.`, answer: '$1/6$.', explanation: 'Liên hợp cho 1/(√(9+x)+3); mẫu tiến tới 6.' },
    connections: ['Thương chứa căn này chính là đạo hàm của căn tại một điểm.', 'Khử nhân tử dùng miền xác định đã học ngày 1.'],
    checkpoint: { prompt: 'Trong bài giới hạn, vì sao được khử nhân tử x khi x tiến tới 0?', options: ['Vì 0/0 luôn bằng 1.', 'Vì giới hạn cho phép chia cho 0.', 'Vì x được coi là đúng bằng 0.', 'Vì xét các x gần 0 nhưng khác 0.'], answerIndex: 3, explain: 'Phép khử diễn ra trên lân cận bỏ điểm 0; sau đó mới lấy giới hạn.' },
  },
  d05: {
    lead: 'Ở gần 0, hãy đưa về một tỉ số chuẩn; ở vô cực, hãy so tốc độ tăng. Hai thao tác đều tìm phần quyết định của biểu thức.',
    prerequisites: ['Góc lượng giác tính bằng radian.', 'Chia tử và mẫu cho cùng một lũy thừa khác 0.'],
    intuition: [
      'Khi góc nhỏ, sin của góc gần bằng chính góc đó trong đơn vị radian. Tuy nhiên, góc bên trong sin phải khớp với mẫu; hệ số bị lệch cần đưa ra ngoài rõ ràng.',
      'Ở vô cực, những số hạng bậc thấp vẫn tồn tại nhưng trở nên nhỏ so với số hạng bậc cao. “Bỏ phần nhỏ” chỉ là cách nhớ; thao tác chia cả tử và mẫu mới giải thích được vì sao chúng biến mất trong giới hạn.',
    ],
    method: [
      { title: 'Nhận hướng tiến', detail: 'Phân biệt biến tiến về 0, về một điểm hữu hạn hay về vô cực.' },
      { title: 'Chuẩn hóa', detail: 'Với sin, tạo sin u/u; với phân thức đa thức, chia theo bậc cao nhất ở mẫu.' },
      { title: 'Giữ hệ số và dấu', detail: 'Ghi hệ số còn lại. Nếu kết quả vô hạn, kiểm tra riêng dấu khi tiến tới âm hoặc dương vô cực.' },
    ],
    worked: {
      title: 'Hai góc nhỏ có tốc độ khác nhau', prompt: t`Tính $\lim_{x\to0}\dfrac{\sin(2x)}{\sin(5x)}$, góc đo bằng radian.`,
      steps: [
        { tex: t`\frac{\sin(2x)}{\sin(5x)}=\frac{\sin(2x)}{2x}\cdot\frac{5x}{\sin(5x)}\cdot\frac25`, explanation: 'Tách thành hai tỉ số chuẩn và giữ hệ số 2/5.' },
        { tex: t`\frac{\sin(2x)}{2x}\to1,\qquad\frac{5x}{\sin(5x)}\to1`, explanation: 'Cả 2x và 5x đều tiến về 0; nghịch đảo hợp lệ gần 0, trừ điểm 0.' },
        { tex: t`\lim_{x\to0}\frac{\sin(2x)}{\sin(5x)}=1\cdot1\cdot\frac25=\frac25`, explanation: 'Nhân các giới hạn hữu hạn thu được.' },
      ],
      result: '$2/5$.',
      check: 'Tại x = 0,01 rad, sin(0,02)/sin(0,05) xấp xỉ 0,40014, phù hợp với 0,4; bảng số hỗ trợ trực giác, không thay thế phép biến đổi.',
    },
    transfer: { prompt: t`Tính $\lim_{x\to-\infty}(-2x^3+x)/x^2$.`, answer: '$+\infty$.', explanation: 'Thương bằng −2x + 1/x; khi x âm rất lớn về độ lớn, −2x tiến tới dương vô cực.' },
    connections: ['Giới hạn lượng giác giải thích công thức đạo hàm sin ở ngày 11.', 'So tốc độ tăng còn hữu ích khi phân tích sai số xấp xỉ.'],
    checkpoint: { prompt: 'Nếu bậc tử lớn hơn bậc mẫu ở vô cực, điều gì còn phải kiểm tra?', options: ['Chỉ cần kết luận bằng 0.', 'Dấu của hệ số trội và hướng tiến của x.', 'Tổng tất cả hệ số.', 'Giá trị của phân thức tại x = 0.'], answerIndex: 1, explain: 'Bậc quyết định mức tăng; dấu hệ số và hướng tiến quyết định dương hay âm vô cực.' },
  },
  d06: {
    lead: 'Tính liên tục ghép hành vi lân cận với giá trị tại điểm. Hãy dùng ba điều kiện rõ ràng để phân biệt lỗ hổng có thể vá và bước nhảy không thể vá bằng một chấm.',
    prerequisites: ['Giới hạn trái, phải và giới hạn hai phía.', 'Rút gọn biểu thức có điều kiện.'],
    intuition: [
      'Một lỗ hổng có thể vá nếu hai phía đã gặp nhau ở cùng độ cao. Khi ấy chỉ cần đặt giá trị tại điểm đúng độ cao đó. Nếu hai phía hướng tới hai độ cao khác nhau, không có một giá trị đơn lẻ nào nối được cả hai.',
      'Khi tự kiểm tra chặng, đừng chỉ đếm số câu đúng. Phân loại sai thành điều kiện xác định, biến đổi đại số hoặc kết luận giới hạn; mỗi loại cần một cách sửa khác nhau.',
    ],
    method: [
      { title: 'Xác định điểm cần nối', detail: 'Ghi giá trị hàm tại điểm theo định nghĩa riêng của nó.' },
      { title: 'Tính hành vi quanh điểm', detail: 'Biến đổi nhánh lân cận rồi lấy giới hạn trái và phải.' },
      { title: 'Áp ba điều kiện', detail: 'Hàm phải xác định tại điểm; giới hạn hai phía phải tồn tại; hai giá trị phải bằng nhau.' },
    ],
    worked: {
      title: 'Chọn tham số để vá đúng lỗ hổng', prompt: t`Cho $f(x)=(x^2-9)/(x-3)$ khi $x\ne3$ và $f(3)=k$. Chọn k để liên tục tại 3.`,
      steps: [
        { tex: t`f(x)=\frac{(x-3)(x+3)}{x-3}=x+3\quad(x\ne3)`, explanation: 'Rút gọn nhánh lân cận nhưng giữ điểm bị loại.' },
        { tex: t`\lim_{x\to3^-}f(x)=\lim_{x\to3^+}f(x)=6`, explanation: 'Hai phía có cùng giới hạn, nên đây là lỗ hổng có thể vá.' },
        { tex: t`f(3)=\lim_{x\to3}f(x)\ \Longleftrightarrow\ k=6`, explanation: 'Chọn giá trị tại điểm trùng với độ cao lân cận.' },
      ],
      result: '$k=6$.',
      check: 'Với k = 6, định nghĩa ghép đúng thành f(x) = x + 3 cho mọi số thực. Một hàm bậc nhất liên tục, xác nhận lựa chọn này.',
    },
    transfer: { prompt: 'Cho g(x) = x khi x < 0, g(x) = x + 1 khi x > 0. Có thể gán g(0) để liên tục không?', answer: 'Không.', explanation: 'Giới hạn trái là 0, giới hạn phải là 1. Sai khác nằm ở hai nhánh, không nằm riêng ở giá trị tại 0.' },
    connections: ['Khả vi ở ngày 7 sẽ kéo theo liên tục, nhưng chiều ngược lại không luôn đúng.', 'Dùng kết quả kiểm tra chặng để chọn bài ôn, không bỏ qua lỗi điều kiện.'],
    checkpoint: { prompt: 'Điều nào chưa đủ để một hàm liên tục tại a?', options: ['Giới hạn tồn tại và bằng f(a).', 'Hàm khả vi tại a.', 'Chỉ biết f(a) tồn tại.', 'Hàm bằng một đa thức quanh a, kể cả tại a.'], answerIndex: 2, explain: 'Có giá trị tại điểm mới thỏa một trong ba điều kiện; giới hạn còn phải tồn tại và bằng giá trị đó.' },
  },
  d07: {
    lead: 'Đạo hàm xuất hiện khi khoảng đo tốc độ trung bình co lại. Ta không chia cho khoảng thời gian bằng 0; ta lấy giới hạn của các thương có mẫu khác 0.',
    prerequisites: ['Hệ số góc bằng độ thay đổi đứng chia độ thay đổi ngang.', 'Khai triển bình phương một tổng.'],
    intuition: [
      'Hai điểm trên đồ thị tạo cát tuyến và một tốc độ trung bình. Khi điểm thứ hai tiến về điểm thứ nhất, cát tuyến có thể tiến đến một hướng ổn định: hướng tiếp tuyến, biểu diễn tốc độ tức thời.',
      'Đơn vị của đạo hàm là đơn vị đầu ra chia đơn vị đầu vào. Nếu vị trí đo bằng mét và thời gian bằng giây thì đạo hàm có đơn vị m/s; giữ đơn vị giúp phát hiện việc cộng nhầm đại lượng.',
    ],
    method: [
      { title: 'Viết độ tăng', detail: 'Lấy giá trị ở thời điểm mới trừ giá trị ban đầu, giữ ngoặc khi khai triển.' },
      { title: 'Chia khoảng khác 0', detail: 'Tính thương độ tăng với h khác 0 và rút gọn.' },
      { title: 'Thu hẹp khoảng đo', detail: 'Lấy giới hạn khi h tiến tới 0 từ cả hai phía nếu thời điểm nằm trong miền.' },
    ],
    worked: {
      title: 'Đọc vận tốc từ một phép đo co dần', prompt: 'Vị trí s(t) = t² + t (m), thời gian t tính bằng giây. Tìm vận tốc tại t = 2 bằng định nghĩa.',
      steps: [
        { tex: t`s(2+h)-s(2)=(2+h)^2+(2+h)-6=5h+h^2`, explanation: 'Khai triển rồi trừ giá trị ban đầu; các hằng số triệt tiêu.' },
        { tex: t`\frac{s(2+h)-s(2)}h=5+h\quad(h\ne0)`, explanation: 'Đây là vận tốc trung bình trên khoảng từ 2 đến 2 + h.' },
        { tex: t`v(2)=\lim_{h\to0}(5+h)=5\ \mathrm{m/s}`, explanation: 'Khi khoảng thời gian co về 0, vận tốc trung bình ổn định ở 5.' },
      ],
      result: '$v(2)=5$ m/s.',
      check: 'Khoảng từ 2 đến 2,1 cho vận tốc trung bình 5,1 m/s; khoảng từ 1,9 đến 2 cho 4,9 m/s. Hai phía kẹp quanh 5 và tiến tới cùng giá trị.',
    },
    transfer: { prompt: 'Với s(t) = 3t² (m), hãy tìm vận tốc tại t = 1 bằng thương sai phân.', answer: '$6$ m/s.', explanation: 'Độ tăng là 6h + 3h²; chia h khác 0 được 6 + 3h, rồi cho h tiến tới 0.' },
    connections: ['Ngày 8 xây quy tắc đạo hàm để không khai triển lại mỗi lần.', 'Ngày 21 dùng tích phân để đi ngược từ vận tốc về độ dời.'],
    checkpoint: { prompt: 'Trong định nghĩa đạo hàm, vì sao không thay h = 0 ngay từ đầu?', options: ['Vì hàm luôn không xác định tại điểm xét.', 'Vì h chỉ được dương.', 'Vì mọi giới hạn đều bằng 0.', 'Vì thương sai phân khi đó có mẫu bằng 0.'], answerIndex: 3, explain: 'Tính thương cho h khác 0, biến đổi và xét giá trị mà thương tiến tới; không thực hiện phép chia cho 0.' },
  },
  d08: {
    lead: 'Đổi cách viết trước khi đạo hàm: căn và phân thức đơn giản đều có thể trở thành lũy thừa. Sau đó áp dụng một quy tắc nhất quán.',
    prerequisites: ['Quy tắc số mũ âm và phân số.', 'Đạo hàm hằng số bằng 0.'],
    intuition: [
      'Trong một tổng, từng thành phần đóng góp riêng vào tốc độ thay đổi nên đạo hàm cộng lại được. Một hằng số chỉ nâng toàn bộ đồ thị lên, không làm nó dốc hơn; vì thế đóng góp của hằng số bằng 0.',
      'Số mũ âm làm hàm giảm khi đầu vào dương tăng, nên dấu âm trong đạo hàm của 1/x có ý nghĩa hình học. Căn tăng nhưng càng lúc càng chậm; đạo hàm của căn giảm về độ lớn khi x tăng.',
    ],
    method: [
      { title: 'Chuẩn hóa cách viết', detail: 'Viết căn bằng số mũ 1/2 và nghịch đảo bằng số mũ âm; ghi miền phù hợp.' },
      { title: 'Đạo hàm từng hạng', detail: 'Nhân hệ số với số mũ, giảm số mũ đi 1; loại hằng số.' },
      { title: 'Đọc lại kết quả', detail: 'Đổi về dạng căn hoặc phân thức nếu dễ hiểu hơn; kiểm tra dấu và điểm không khả vi.' },
    ],
    worked: {
      title: 'Một quy tắc cho ba cách viết', prompt: t`Tìm đạo hàm của $f(x)=\sqrt{x}+2/x-3$ với $x>0$, rồi tính tại 4.`,
      steps: [
        { tex: t`f(x)=x^{1/2}+2x^{-1}-3`, explanation: 'Miền x > 0 tránh mẫu bằng 0 và bảo đảm căn khả vi.' },
        { tex: t`f'(x)=\frac12x^{-1/2}-2x^{-2}`, explanation: 'Số mũ −1 tạo dấu âm cho hạng nghịch đảo; hằng số có đạo hàm 0.' },
        { tex: t`f'(4)=\frac1{2\sqrt4}-\frac2{4^2}=\frac14-\frac18=\frac18`, explanation: 'Thay số sau khi tìm được biểu thức đạo hàm.' },
      ],
      result: t`$f'(x)=1/(2\sqrt{x})-2/x^2$; $f'(4)=1/8$.`,
      check: 'Tại x = 4, hai đóng góp độ dốc là 0,25 và −0,125, tổng 0,125. Thương [f(4,01) − f(4)]/0,01 xấp xỉ 0,12516, phù hợp.',
    },
    transfer: { prompt: t`Tính $g'(1)$ với $g(x)=3\sqrt{x}-x^{-2}$ trên $x>0$.`, answer: '$7/2$.', explanation: 'g′(x) = (3/2)x^(−1/2) + 2x^(−3); tại 1 bằng 1,5 + 2 = 3,5.' },
    connections: ['Ngày 9 cho biết vì sao quy tắc cộng không được áp dụng nguyên xi cho tích.', 'Ngày 15 đảo chiều quy tắc lũy thừa để tìm nguyên hàm.'],
    checkpoint: { prompt: 'Cộng 7 vào một hàm khả vi làm đạo hàm thay đổi thế nào?', options: ['Tăng thêm 7.', 'Không thay đổi.', 'Nhân với 7.', 'Trở thành 0.'], answerIndex: 1, explain: 'Dịch đồ thị lên không đổi độ dốc; đạo hàm của số hạng 7 bằng 0.' },
  },
  d09: {
    lead: 'Một tích thay đổi vì cả hai thừa số cùng thay đổi. Hãy giữ rõ đóng góp của từng phần trước khi rút gọn.',
    prerequisites: ['Đạo hàm đa thức và hằng số.', 'Quy đồng phân thức, nhân và khai triển.'],
    intuition: [
      'Với hình chữ nhật có hai cạnh đang tăng, diện tích tăng do một dải theo cạnh thứ nhất và một dải theo cạnh thứ hai. Trong giới hạn, phần góc nhỏ bậc hai không còn đóng góp; hai dải tạo quy tắc đạo hàm tích.',
      'Với một thương, mẫu tăng có thể làm thương giảm ngay cả khi tử giữ nguyên. Dấu trừ trong quy tắc thương ghi lại ảnh hưởng ấy. Viết tử và mẫu thành u, v giúp giữ đúng thứ tự trừ.',
    ],
    method: [
      { title: 'Chọn biểu diễn thuận lợi', detail: 'Có thể khai triển tích đa thức ngắn trước; giữ dạng tích nếu nó giúp thấy cấu trúc.' },
      { title: 'Gắn nhãn các phần', detail: 'Viết u, v, u′, v′ riêng để không bỏ thừa số chưa đạo hàm.' },
      { title: 'Ghép và đối chiếu', detail: 'Với thương dùng u′v − uv′ trên v²; cuối cùng thử rút gọn hoặc tính một điểm.' },
    ],
    worked: {
      title: 'Kiểm tra quy tắc thương bằng cách viết khác', prompt: t`Tìm đạo hàm của $q(x)=(x^2+1)/x$, $x\ne0$.`,
      steps: [
        { tex: t`u=x^2+1,\quad u'=2x,\quad v=x,\quad v'=1`, explanation: 'Mẫu khác 0 là điều kiện phải giữ trong toàn bộ bài.' },
        { tex: t`q'(x)=\frac{2x\cdot x-(x^2+1)\cdot1}{x^2}`, explanation: 'Giữ ngoặc quanh toàn bộ tích bị trừ để không đổi sai dấu.' },
        { tex: t`q'(x)=\frac{x^2-1}{x^2}=1-\frac1{x^2}`, explanation: 'Rút gọn tử và tách thương thành hai hạng dễ đọc.' },
      ],
      result: t`$q'(x)=1-1/x^2$ với $x\ne0$.`,
      check: 'Viết trực tiếp q(x) = x + 1/x rồi dùng quy tắc lũy thừa cũng cho 1 − 1/x². Tại x = 2, cả hai cách cho 3/4.',
    },
    transfer: { prompt: 'Tìm đạo hàm của p(x) = (x + 1)(x − 2) bằng hai cách.', answer: '$p′(x)=2x-1$.', explanation: 'Quy tắc tích cho (x − 2) + (x + 1). Khai triển trước được x² − x − 2 rồi đạo hàm, cùng kết quả.' },
    connections: ['Ngày 10 dùng dây chuyền khi một thừa số còn là hàm hợp.', 'Ngày 17 đảo quy tắc tích để xây công thức tích phân từng phần.'],
    checkpoint: { prompt: 'Vì sao đạo hàm của u(x)v(x) không chỉ là u′(x)v′(x)?', options: ['Vì đạo hàm luôn đổi dấu.', 'Vì một tích không thể đạo hàm.', 'Vì phải cộng đóng góp thay đổi của từng thừa số.', 'Vì u và v bắt buộc bằng nhau.'], answerIndex: 2, explain: 'Mỗi phần thay đổi trong khi phần kia cung cấp hệ số hiện tại; kết quả là u′v + uv′.' },
  },
  d10: {
    lead: 'Hàm hợp là chuỗi các phép biến đổi. Đạo hàm dây chuyền nhân tốc độ truyền qua từng lớp, theo thứ tự từ ngoài vào trong.',
    prerequisites: ['Đạo hàm lũy thừa và tổng.', 'Nhận một biểu thức như đầu vào của biểu thức khác.'],
    intuition: [
      'Đặt tên biến trung gian giúp tách một biểu thức dài thành các máy nhỏ. Nếu u thay đổi nhanh gấp 2 lần x và y thay đổi nhanh gấp 3 lần u tại điểm đang xét, tốc độ của y theo x tại đó gấp 6 lần.',
      'Tốc độ từng lớp thường phụ thuộc đầu vào hiện tại. Vì vậy đạo hàm lớp ngoài phải được tính tại hàm trong còn nguyên; thay phần trong bằng đạo hàm của nó quá sớm sẽ làm mất vị trí cần đánh giá.',
    ],
    method: [
      { title: 'Vẽ đường truyền', detail: 'Viết x → u → y; khi có ba lớp, thêm biến trung gian thay vì nhảy bước.' },
      { title: 'Đạo hàm từng lớp', detail: 'Lấy đạo hàm ngoài theo u, rồi đạo hàm u theo x.' },
      { title: 'Nhân và hoàn nguyên', detail: 'Nhân các tốc độ rồi thay biến trung gian về biểu thức ban đầu; kiểm tra miền.' },
    ],
    worked: {
      title: 'Căn của một hàm bậc hai', prompt: t`Tìm đạo hàm của $y=\sqrt{1+3x^2}$ và tính tại $x=1$.`,
      steps: [
        { tex: t`u=1+3x^2>0,\qquad y=u^{1/2}`, explanation: 'Căn nhận một đầu vào dương với mọi x, nên không vướng điểm biên của căn.' },
        { tex: t`\frac{dy}{du}=\frac1{2\sqrt u},\qquad\frac{du}{dx}=6x`, explanation: 'Mỗi phép đạo hàm chỉ xử lý đúng một lớp.' },
        { tex: t`y'=\frac{6x}{2\sqrt{1+3x^2}}=\frac{3x}{\sqrt{1+3x^2}},\qquad y'(1)=\frac32`, explanation: 'Nhân tốc độ hai lớp, thay lại u rồi đánh giá tại 1.' },
      ],
      result: t`$y'=3x/\sqrt{1+3x^2}$; $y'(1)=3/2$.`,
      check: 'Bình phương quan hệ cho y² = 1 + 3x². Đạo hàm hai vế được 2yy′ = 6x; thế y = √(1+3x²) thu lại cùng công thức.',
    },
    transfer: { prompt: t`Với $z=(1+x^2)^3$, tính $z'(1)$.`, answer: '$24$.', explanation: 'Lớp ngoài cho 3(1+x²)², lớp trong cho 2x; tại 1 được 3 × 4 × 2 = 24.' },
    connections: ['Đạo hàm hàm ẩn ngày 12 chính là dây chuyền với y phụ thuộc x.', 'Đổi biến tích phân ngày 16 tìm lại cặp hàm trong và đạo hàm của nó.'],
    checkpoint: { prompt: t`Trong đạo hàm $(g(x))^4$, số hạng nào biểu diễn tốc độ của lớp trong?`, options: ['$g′(x)$.', '$4$.', '$g(x)^3$.', '$g(x)^4$.'], answerIndex: 0, explain: 'Đạo hàm là 4g(x)³g′(x); g′(x) là tốc độ đầu vào của lớp lũy thừa thay đổi theo x.' },
  },
  d11: {
    lead: 'Bảng đạo hàm chỉ là điểm xuất phát. Khi đối số chứa biểu thức khác x, cần kết hợp bảng với dây chuyền và điều kiện xác định.',
    prerequisites: ['Đạo hàm hàm hợp.', 'Logarit tự nhiên và lượng giác theo radian.'],
    intuition: [
      'Hàm mũ tự nhiên có tốc độ tăng bằng giá trị hiện tại: càng lớn thì tăng càng nhanh. Logarit là phép ngược lại; độ dốc 1/x giảm khi x tăng, nên cùng một mức tăng đầu vào tạo thay đổi đầu ra nhỏ dần.',
      'Đạo hàm lượng giác phản ánh chuyển động trên đường tròn đơn vị. Công thức chuẩn dùng radian vì cung và góc khi ấy có tỉ lệ tự nhiên; dùng số đo độ sẽ xuất hiện hệ số đổi đơn vị.',
    ],
    method: [
      { title: 'Kiểm tra đối số', detail: 'Với logarit, giải điều kiện biểu thức bên trong dương trước khi tính.' },
      { title: 'Chọn đạo hàm ngoài', detail: 'Đọc đúng e mũ, logarit hay lượng giác; giữ nguyên đối số ở bước đầu.' },
      { title: 'Nhân tốc độ bên trong', detail: 'Đạo hàm đối số rồi nhân thêm. Cuối cùng xét dấu hoặc kiểm tra tại một điểm đơn giản.' },
    ],
    worked: {
      title: 'Logarit của một tổng luôn dương', prompt: t`Tính đạo hàm của $f(x)=\ln(1+x^2)$, rồi tìm $f'(1)$.`,
      steps: [
        { tex: t`1+x^2\ge1>0\quad\Longrightarrow\quad D=\mathbb R`, explanation: 'Toàn bộ số thực đều được nhận; không tách logarit của tổng.' },
        { tex: t`u=1+x^2,\qquad (\ln u)'=\frac{u'}u`, explanation: 'Lớp ngoài cho 1/u, còn lớp trong tạo hệ số u′.' },
        { tex: t`f'(x)=\frac{2x}{1+x^2},\qquad f'(1)=\frac22=1`, explanation: 'Nhân đủ đạo hàm trong rồi thay x = 1.' },
      ],
      result: '$f′(x)=2x/(1+x²)$; $f′(1)=1$.',
      check: 'f là hàm chẵn nên độ dốc tại hai điểm đối nhau phải trái dấu; công thức đạo hàm là hàm lẻ, đúng yêu cầu. Tại 0, f đạt nhỏ nhất và đạo hàm bằng 0.',
    },
    transfer: { prompt: t`Tính đạo hàm của $g(x)=e^{3x}-\cos(2x)$, góc tính bằng radian.`, answer: t`$g'(x)=3e^{3x}+2\sin(2x)$.`, explanation: 'Hàm mũ nhân thêm 3; đạo hàm −cos tạo dấu cộng, rồi nhân đạo hàm đối số 2.' },
    connections: ['Các tốc độ này dùng trong mô hình tăng trưởng và dao động.', 'Ngày 15 tìm nguyên hàm bằng cách nhận ngược những dạng đạo hàm quen thuộc.'],
    checkpoint: { prompt: t`Đạo hàm $\ln(g(x))$ bằng $g'(x)/g(x)$ cần điều kiện nào tại các điểm đang xét?`, options: ['Chỉ cần g khác 0.', 'g phải là hằng số.', 'g phải âm.', 'g khả vi và g dương.'], answerIndex: 3, explain: 'Logarit thực ln g yêu cầu g > 0; quy tắc dây chuyền còn cần g khả vi. Với ln|g|, điều kiện miền mới là g khác 0.' },
  },
  d12: {
    lead: 'Đạo hàm cho mô hình đường thẳng gần một điểm. Từ đó có thể viết tiếp tuyến, ước lượng thay đổi nhỏ và xử lý phương trình không tách sẵn y.',
    prerequisites: ['Phương trình đường thẳng qua một điểm với hệ số góc biết trước.', 'Quy tắc dây chuyền.'],
    intuition: [
      'Tiếp tuyến khớp với đồ thị cả giá trị và độ dốc tại điểm chọn. Vì thế nó là mô hình tuyến tính tốt ở gần điểm ấy, nhưng đi xa có thể sai đáng kể do độ cong bị bỏ qua.',
      'Trong phương trình hàm ẩn, y là một hàm của x trên nhánh đang xét. Do đó đạo hàm y² là 2yy′, không phải 2y. Nếu hệ số của y′ bằng 0, cần kiểm tra hình học thay vì chia vội.',
    ],
    method: [
      { title: 'Xác nhận điểm thuộc đường', detail: 'Thế tọa độ vào phương trình trước khi tìm tiếp tuyến.' },
      { title: 'Tìm độ dốc', detail: 'Đạo hàm cả hai vế theo x, ghi y′ ở các hạng chứa y rồi giải nếu hệ số khác 0.' },
      { title: 'Dùng mô hình gần điểm', detail: 'Viết y − y₀ = m(x − x₀). Chỉ dùng xấp xỉ cho bước dịch nhỏ và kiểm tra sai số nếu có thể.' },
    ],
    worked: {
      title: 'Tiếp tuyến trên đường tròn', prompt: 'Với x² + y² = 25, xét nhánh trên tại (3,4). Viết tiếp tuyến và ước lượng y khi x = 3,02.',
      steps: [
        { tex: t`2x+2yy'=0\quad\Longrightarrow\quad y'=-\frac xy\quad(y\ne0)`, explanation: 'Nhân thêm y′ khi đạo hàm y²; tại điểm xét y = 4 khác 0.' },
        { tex: t`m=-\frac34,\qquad y-4=-\frac34(x-3)`, explanation: 'Thế tọa độ vào công thức độ dốc, rồi viết đường thẳng qua điểm.' },
        { tex: t`\Delta x=0.02,\quad dy=-\frac34(0.02)=-0.015,\quad y\approx3.985`, explanation: 'Dùng vi phân làm xấp xỉ độ thay đổi thật.' },
      ],
      result: t`$y-4=-(3/4)(x-3)$ và $y(3{,}02)\approx3{,}985$.`,
      check: 'Tính theo nhánh y = √(25−x²) tại 3,02 được khoảng 3,9849216; xấp xỉ lệch khoảng 0,0000784. Tiếp tuyến cho giá trị hơi cao vì nhánh trên cong xuống.',
    },
    transfer: { prompt: 'Dùng tiếp tuyến của √x tại x = 9 để ước lượng √9,06.', answer: '$3,01$.', explanation: 'Độ dốc tại 9 là 1/6. Mức tăng dự đoán bằng 0,06/6 = 0,01; cộng với giá trị ban đầu 3.' },
    connections: ['Ngày 24 mở rộng vi phân sang nhiều đầu vào.', 'Tiếp tuyến dẫn tới ý tưởng cập nhật gần nghiệm trong phương pháp Newton.'],
    checkpoint: { prompt: 'Trong x² + y(x)² = 25, vì sao đạo hàm của y(x)² chứa y′?', options: ['Vì mọi đạo hàm đều phải có y′.', 'Vì y thay đổi theo x, nên cần quy tắc dây chuyền.', 'Vì x và y luôn bằng nhau.', 'Vì y là hằng số.'], answerIndex: 1, explain: 'Lớp ngoài bình phương cho 2y; lớp trong y(x) cho y′, nên tích là 2yy′.' },
  },
  d13: {
    lead: 'Một điểm có đạo hàm bằng 0 mới chỉ là ứng viên cực trị. Điều quyết định nằm ở cách dấu đạo hàm thay đổi khi đi qua điểm ấy.',
    prerequisites: ['Giải phương trình đạo hàm bằng 0.', 'Xét dấu tích các nhân tử trên từng khoảng.'],
    intuition: [
      'Khi đạo hàm dương, đi sang phải làm đồ thị tăng; khi âm, đồ thị giảm. Từ tăng sang giảm tạo đỉnh, còn giảm sang tăng tạo đáy. Một tiếp tuyến ngang vẫn có thể nằm trên đường đang tiếp tục tăng.',
      'Cực trị địa phương chỉ so với các điểm đủ gần. Giá trị lớn nhất trên cả miền là một yêu cầu mạnh hơn; nếu miền là đoạn đóng, các đầu mút có thể thắng mọi điểm dừng ở bên trong.',
    ],
    method: [
      { title: 'Liệt kê ứng viên', detail: 'Tìm nơi đạo hàm bằng 0 hoặc không tồn tại trong miền; nếu tìm max/min trên đoạn, thêm hai đầu mút.' },
      { title: 'Chia khoảng xét dấu', detail: 'Sắp xếp các điểm tới hạn và chọn điểm thử ở từng khoảng.' },
      { title: 'Kết luận đúng cấp độ', detail: 'Dùng đổi dấu để phân loại cực trị; muốn kết luận toàn cục phải so giá trị hoặc phân tích cả miền.' },
    ],
    worked: {
      title: 'Đạo hàm bằng 0 nhưng không có cực trị', prompt: 'Phân tích tính tăng giảm và điểm dừng của f(x) = x³ trên ℝ.',
      steps: [
        { tex: t`f'(x)=3x^2,\qquad f'(x)=0\Longleftrightarrow x=0`, explanation: 'Điểm duy nhất có tiếp tuyến ngang là 0.' },
        { tex: t`f'(x)>0\quad\text{trên }(-\infty,0)\text{ và }(0,+\infty)`, explanation: 'Bình phương dương ở cả hai phía; dấu đạo hàm không đổi.' },
        { tex: t`f(-h)=-h^3<0=f(0)<h^3=f(h)\quad(h>0)`, explanation: 'Mọi lân cận của 0 đều chứa giá trị nhỏ hơn và lớn hơn f(0), nên không có cực trị tại đó.' },
      ],
      result: 'Hàm tăng nghiêm ngặt trên ℝ; (0,0) là điểm dừng nhưng không phải cực trị.',
      check: 'Có thể kiểm tra độc lập tính tăng: nếu b > a thì b³ − a³ = (b−a)(b²+ab+a²) > 0, vì nhân tử thứ hai dương khi a và b khác nhau.',
    },
    transfer: { prompt: 'Tìm giá trị nhỏ nhất và lớn nhất của x³ trên [−2,1].', answer: 'Nhỏ nhất −8 tại x = −2; lớn nhất 1 tại x = 1.', explanation: 'Hàm tăng trên cả đoạn nên hai đầu mút quyết định; điểm dừng 0 không tạo cực trị.' },
    connections: ['Ngày 14 chuyển bài toán thực tế về việc so các ứng viên.', 'Ngày 25 cho thấy nhiều biến cần thêm thông tin từ Hessian.'],
    checkpoint: { prompt: 'Từ f′(a) = 0, kết luận nào luôn hợp lệ?', options: ['a là điểm cực đại.', 'a là điểm cực tiểu.', 'a là điểm dừng, cần kiểm tra thêm để biết cực trị.', 'f đổi dấu tại a.'], answerIndex: 2, explain: 'Đạo hàm bằng 0 chỉ cho độ dốc ngang. Ví dụ x³ tại 0 cho thấy không nhất thiết có cực trị.' },
  },
  d14: {
    lead: 'Tối ưu bắt đầu từ mô hình, không bắt đầu từ đạo hàm. Đặt biến, ràng buộc và miền hợp lệ đúng thường quyết định phần lớn bài giải.',
    prerequisites: ['Biểu diễn một đại lượng theo một biến.', 'Tìm điểm dừng và so giá trị trên miền.'],
    intuition: [
      'Đề bài thực tế thường có nhiều kích thước nhưng chỉ một mức tự do vì chúng bị ràng buộc. Dùng điều kiện để loại bớt biến giúp thấy rõ ta đang tối đa hóa điều gì và lựa chọn nào thật sự khả thi.',
      'Một công thức đúng về đại số vẫn có thể cho kích thước âm hoặc bằng 0. Vì thế nghiệm đạo hàm phải quay lại miền thực tế. So với một phương án cụ thể còn giúp phát hiện nhầm đơn vị hoặc nhầm đại lượng cần tối ưu.',
    ],
    method: [
      { title: 'Đặt biến có đơn vị', detail: 'Gọi tên kích thước và viết ràng buộc bằng lời thành phương trình.' },
      { title: 'Lập hàm mục tiêu', detail: 'Thế ràng buộc để chỉ còn một biến, kèm khoảng giá trị có ý nghĩa.' },
      { title: 'Tối ưu rồi diễn giải', detail: 'Xét đạo hàm hoặc hoàn thành bình phương; kiểm tra ứng viên, biên và trả lời theo đơn vị của đề.' },
    ],
    worked: {
      title: 'Rào ba cạnh sát một bức tường', prompt: 'Có 20 m hàng rào để quây ba cạnh hình chữ nhật sát tường. Tìm kích thước cho diện tích lớn nhất, coi tường đủ dài.',
      steps: [
        { tex: t`2x+y=20,\quad y=20-2x,\quad0<x<10`, explanation: 'x là mỗi cạnh vuông góc tường; chỉ cần một cạnh y song song tường.' },
        { tex: t`A(x)=x(20-2x),\qquad A'(x)=20-4x`, explanation: 'Lập diện tích theo x, rồi tìm tốc độ thay đổi của diện tích.' },
        { tex: t`A'(x)=0\Longrightarrow x=5,\quad y=10,\quad A=50`, explanation: 'Đạo hàm dương trước 5 và âm sau 5 nên diện tích đạt lớn nhất ở đây.' },
      ],
      result: 'Hai cạnh vuông góc tường dài 5 m, cạnh còn lại dài 10 m; diện tích lớn nhất 50 m².',
      check: 'Hoàn thành bình phương: A = 50 − 2(x−5)² ≤ 50, xác nhận cực đại toàn cục. Tổng hàng rào là 5 + 5 + 10 = 20 m, đúng ràng buộc.',
    },
    transfer: { prompt: 'Nếu có 24 m hàng rào với cùng cách quây, kích thước tối ưu là gì?', answer: '6 m, 6 m và 12 m; diện tích 72 m².', explanation: 'A(x) = x(24−2x) đạt đỉnh tại x = 6. Cạnh song song tường bằng 12; kiểm tra tổng ba cạnh bằng 24.' },
    connections: ['Giới hạn miền dùng lại kiến thức ngày 1.', 'Tối ưu nhiều biến ngày 25 giữ cùng trình tự: miền, ứng viên, phân loại, kiểm tra.'],
    checkpoint: { prompt: 'Vì sao không áp dụng ngay kết luận “hình vuông tối ưu” cho bài rào ba cạnh?', options: ['Vì ràng buộc là 2x + y, khác chu vi bốn cạnh.', 'Vì hình chữ nhật không có diện tích.', 'Vì đạo hàm chỉ dùng được với hình vuông.', 'Vì không cần kiểm tra miền.'], answerIndex: 0, explain: 'Hình tối ưu phụ thuộc ràng buộc; với ba cạnh, hai chiều có chi phí hàng rào khác nhau.' },
  },
  d15: {
    lead: 'Nguyên hàm khôi phục một đại lượng từ tốc độ thay đổi. Tốc độ không cho biết mức ban đầu, vì vậy cần hằng số hoặc một điều kiện bổ sung.',
    prerequisites: ['Đạo hàm lũy thừa và hằng số.', 'Giải phương trình tìm một tham số.'],
    intuition: [
      'Hai xe có cùng vận tốc ở mọi thời điểm vẫn có thể xuất phát ở hai vị trí khác nhau. Tương tự, các hàm nguyên hàm của cùng một hàm trên một khoảng sai khác nhau một hằng số; đạo hàm đã xóa mất thông tin dịch chuyển đứng ấy.',
      'Điều kiện ban đầu chọn đúng một đường trong cả họ. Sau khi tính xong, có hai việc kiểm tra độc lập: đạo hàm phải trả lại hàm ban đầu và giá trị tại điểm cho trước phải khớp dữ kiện.',
    ],
    method: [
      { title: 'Tìm một nguyên hàm', detail: 'Tăng số mũ lên 1 rồi chia cho số mũ mới khi số mũ ban đầu khác −1; dùng ln|x| cho 1/x trên khoảng không chứa 0.' },
      { title: 'Giữ hằng số', detail: 'Thêm C trước khi dùng điều kiện ban đầu; không tự chọn C = 0.' },
      { title: 'Chọn và kiểm tra', detail: 'Thế điểm đã biết để giải C, sau đó đạo hàm ngược và kiểm tra giá trị điểm.' },
    ],
    worked: {
      title: 'Khôi phục vị trí từ vận tốc', prompt: 'Vật có vận tốc v(t) = 6t − 2 m/s và vị trí s(1) = 5 m. Tìm s(t), rồi tính s(3).',
      steps: [
        { tex: t`s(t)=\int(6t-2)\,dt=3t^2-2t+C`, explanation: 'Lấy nguyên hàm vận tốc, giữ hằng số mô tả vị trí ban đầu chưa biết.' },
        { tex: t`s(1)=3-2+C=5\Longrightarrow C=4`, explanation: 'Dữ kiện vị trí ở t = 1 chọn một thành viên của họ nguyên hàm.' },
        { tex: t`s(t)=3t^2-2t+4,\qquad s(3)=27-6+4=25\ \mathrm m`, explanation: 'Thay thời điểm cần tìm vào hàm vị trí đã xác định.' },
      ],
      result: '$s(t)=3t^2-2t+4$ m; $s(3)=25$ m.',
      check: 'Đạo hàm s(t) cho 6t − 2, đúng vận tốc. Thế t = 1 cho 5 m. Trên [1,3], vận tốc tuyến tính tăng từ 4 lên 16 m/s nên độ dời bằng tốc độ trung bình 10 nhân 2 giây = 20 m; 5 + 20 = 25.',
    },
    transfer: { prompt: 'Tìm F(x) biết F′(x) = 4x³ và F(1) = 7.', answer: '$F(x)=x^4+6$.', explanation: 'Nguyên hàm tổng quát là x⁴ + C. Điều kiện 1 + C = 7 cho C = 6; đạo hàm kiểm tra lại bằng 4x³.' },
    connections: ['Ngày 18 dùng hai cận để hằng số tự triệt tiêu trong hiệu nguyên hàm.', 'Mối liên hệ vị trí–vận tốc trở lại trong ứng dụng ngày 21.'],
    checkpoint: { prompt: 'Nếu F và G có cùng đạo hàm trên một khoảng, quan hệ nào đúng?', options: ['F và G bắt buộc bằng nhau.', 'F − G là hằng số trên khoảng đó.', 'F + G bằng 0.', 'F/G luôn là hằng số.'], answerIndex: 1, explain: 'Đạo hàm của F − G bằng 0 trên một khoảng nên hiệu là hằng số; cần thêm một giá trị ban đầu để xác định hằng số này.' },
  },
};
