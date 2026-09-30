import type { EditorialLesson } from './types';

const tex = String.raw;

/** Original explanations: preserve source lessons while making the reasoning explicit. */
export const days16to30: Record<string, EditorialLesson> = {
  d16: {
    lead: 'Đổi biến là đọc ngược quy tắc dây chuyền: tìm một cụm lặp lại và xem vi phân của cụm đó có đi kèm hay không.',
    prerequisites: ['Đạo hàm hàm hợp; nguyên hàm lũy thừa.', 'Đổi cận bằng chính hàm u = g(x).'],
    intuition: [
      'Trong 2x(x² + 1)³, cụm x² + 1 tạo ra độ phức tạp, nhưng đạo hàm của nó là 2x đã đứng ngay bên ngoài. Đặt tên u cho cụm ấy biến cả tích thành u³ du; ta thay cả cấu trúc, không chỉ thay một chữ.',
      'Với tích phân xác định, cận mô tả đầu và cuối của hành trình theo biến đang dùng. Khi x đi từ 0 đến 1, u đi từ 1 đến 2. Viết tích phân theo u mà giữ cận 0 và 1 sẽ tính một lượng khác.',
    ],
    method: [
      { title: 'Nhận ra hàm trong', detail: 'Ưu tiên cụm nằm trong lũy thừa, căn, mũ hoặc lượng giác; thử đạo hàm cụm đó.' },
      { title: 'Ghép vi phân', detail: 'Viết du rõ ràng và bù hệ số còn thiếu; tích phân mới không được còn lẫn x.' },
      { title: 'Đổi cận và tính', detail: 'Đổi cả hai cận rồi lấy nguyên hàm theo u; nếu không có cận, thay u về x và thêm C.' },
    ],
    worked: {
      title: 'Nhận diện một lũy thừa hợp', prompt: 'Tính tích phân của 2x(x² + 1)³ từ 0 đến 1.',
      steps: [
        { tex: tex`u=x^2+1,\quad du=2x\,dx`, explanation: 'Vi phân khớp trọn vẹn thừa số bên ngoài.' },
        { tex: tex`x=0\Rightarrow u=1,\quad x=1\Rightarrow u=2`, explanation: 'Cận mới đi cùng biến mới.' },
        { tex: tex`I=\int_1^2u^3\,du=\left[\frac{u^4}{4}\right]_1^2=\frac{15}{4}`, explanation: 'Lấy giá trị cận trên trừ cận dưới.' },
      ],
      result: 'Tích phân bằng 15/4.', check: 'Đạo hàm (x² + 1)⁴/4 là 2x(x² + 1)³; thay hai cận cũng cho (16 − 1)/4.',
    },
    transfer: { prompt: 'Đổi số mũ 3 thành 2 trong bài mẫu. Kết quả là bao nhiêu?', answer: '7/3.', explanation: 'Giữ cùng phép đổi biến và cận; tích phân u² từ 1 đến 2 bằng (8 − 1)/3.' },
    connections: ['Đổi biến đảo ngược đạo hàm hàm hợp ở ngày 10.'],
    checkpoint: { prompt: 'Sau khi đặt u = x² + 1 trong tích phân từ x = 0 đến x = 2, cận đúng là gì?', options: ['0 đến 2', '1 đến 5', '0 đến 5', '1 đến 3'], answerIndex: 1, explain: 'Thay từng giá trị x vào u: u(0) = 1 và u(2) = 5.' },
  },
  d17: {
    lead: 'Từng phần hữu ích khi đạo hàm một thừa số làm nó đơn giản hơn, còn thừa số kia có nguyên hàm dễ tính.',
    prerequisites: ['Quy tắc đạo hàm tích.', 'Nguyên hàm của hàm mũ và lũy thừa.'],
    intuition: [
      'Từ đạo hàm của uv bằng u′v + uv′, chuyển một hạng sang bên kia rồi lấy nguyên hàm sẽ có công thức từng phần. Dấu trừ có nguồn gốc từ phép chuyển vế, không phải mẹo cần nhớ riêng.',
      'Lựa chọn u và dv quyết định độ khó của bài mới. Với x nhân eˣ, chọn u = x làm đạo hàm còn 1; chọn u = eˣ lại khiến nguyên hàm của x tăng bậc. Mục tiêu là giảm việc phải làm ở lượt tiếp theo.',
    ],
    method: [
      { title: 'Tách hai vai trò', detail: 'Chọn u có đạo hàm đơn giản dần; chọn dv sao cho tìm được v.' },
      { title: 'Viết đủ bốn thành phần', detail: 'Ghi u, du, dv, v trước khi thay để tránh nhầm đạo hàm với nguyên hàm.' },
      { title: 'So sánh bài mới', detail: 'Áp dụng uv − tích phân v du. Nếu bài mới khó hơn, xem lại cách chọn.' },
    ],
    worked: {
      title: 'Giảm bậc đa thức', prompt: 'Tìm nguyên hàm của x eˣ.',
      steps: [
        { tex: tex`u=x,\quad du=dx,\quad dv=e^x\,dx,\quad v=e^x`, explanation: 'Đạo hàm x giảm xuống hằng số, còn nguyên hàm eˣ giữ dạng.' },
        { tex: tex`\int xe^x\,dx=xe^x-\int e^x\,dx`, explanation: 'Thay vào công thức với dấu trừ trước tích phân còn lại.' },
        { tex: tex`\int xe^x\,dx=(x-1)e^x+C`, explanation: 'Tích phân mới đã là dạng cơ bản.' },
      ],
      result: 'Một họ nguyên hàm là (x − 1)eˣ + C.', check: 'Đạo hàm kết quả: eˣ + (x − 1)eˣ = xeˣ, đúng với hàm ban đầu.',
    },
    transfer: { prompt: 'Dùng nguyên hàm vừa tìm để tính tích phân xeˣ từ 0 đến 1.', answer: '1.', explanation: 'Giá trị tại 1 bằng 0; tại 0 bằng −1; hiệu là 0 − (−1) = 1.' },
    connections: ['Đổi biến hợp với cấu trúc hàm hợp; từng phần hợp với tích có thể giảm độ phức tạp.'],
    checkpoint: { prompt: 'Với tích phân x²eˣ, cách chọn nào làm giảm bậc đa thức trong tích phân mới?', options: ['u = eˣ, dv = x² dx', 'u = x²eˣ, dv = dx', 'u = x², dv = eˣ dx', 'u = x, dv = dx'], answerIndex: 2, explain: 'du = 2x dx và v = eˣ, nên tích phân còn lại chứa x thay vì x².' },
  },
  d18: {
    lead: 'Tích phân xác định nối hai cách nhìn: cộng vô số đóng góp nhỏ và đo sự thay đổi của một nguyên hàm.',
    prerequisites: ['Tìm nguyên hàm cơ bản.', 'Phân biệt hàm, nguyên hàm và giá trị tại một cận.'],
    intuition: [
      'Chia đoạn thành những lát hẹp, mỗi lát đóng góp gần bằng chiều cao hàm nhân bề rộng. Khi chia ngày càng mịn, tổng tiến tới tích phân. Phần phía dưới trục hoành đóng góp âm nên kết quả có thể triệt tiêu.',
      'Định lý cơ bản cho phép tính tổng tích lũy ấy bằng F(b) − F(a). Hằng số của nguyên hàm tự mất khi trừ hai đầu, vì vậy kết quả của một tích phân xác định là một số, không phải một họ hàm có C.',
    ],
    method: [
      { title: 'Kiểm tra đoạn', detail: 'Xác nhận hàm liên tục trên đoạn dùng công thức; nếu có điểm không xác định, cần xét riêng.' },
      { title: 'Tìm và kiểm nguyên hàm', detail: 'Chọn F sao cho F′ = f; đạo hàm lại khi có hệ số dễ nhầm.' },
      { title: 'Tính hiệu có ngoặc', detail: 'Viết F(b) − F(a) trước khi rút gọn, đặc biệt khi cận dưới âm.' },
    ],
    worked: {
      title: 'Phần âm và phần dương', prompt: 'Tính tích phân của 2x − 1 trên [0, 2].',
      steps: [
        { tex: tex`F(x)=x^2-x,\quad F'(x)=2x-1`, explanation: 'Đa thức liên tục trên toàn đoạn, và nguyên hàm đã được kiểm.' },
        { tex: tex`I=F(2)-F(0)=(4-2)-(0-0)`, explanation: 'Giữ nguyên thứ tự cận trên trừ cận dưới.' },
        { tex: tex`I=2`, explanation: 'Đây là tích lũy có dấu, không phải tổng mọi diện tích.' },
      ],
      result: 'Giá trị tích phân là 2.', check: 'Diện tích có dấu từ 0 đến 1/2 là −1/4; từ 1/2 đến 2 là 9/4; tổng đúng bằng 2.',
    },
    transfer: { prompt: 'Nếu đảo cận thành từ 2 về 0, kết quả đổi thế nào?', answer: 'Bằng −2.', explanation: 'Đảo chiều tích lũy đổi dấu: F(0) − F(2) = −2.' },
    connections: ['Ngày 19 chuyển từ tích lũy có dấu sang diện tích không âm.'],
    checkpoint: { prompt: 'Vì sao không viết thêm C vào kết quả tích phân xác định?', options: ['Vì mọi nguyên hàm đều có C = 0', 'Vì cận dưới luôn bằng 0', 'Vì hàm luôn dương trên đoạn', 'Vì hằng số triệt tiêu trong hiệu hai giá trị'], answerIndex: 3, explain: '(F(b) + C) − (F(a) + C) = F(b) − F(a), dù chọn C nào.' },
  },
  d19: {
    lead: 'Diện tích giữa hai đường là tổng khoảng cách giữa chúng. Vì khoảng cách không âm, cần biết đường nào ở trên trong từng khoảng.',
    prerequisites: ['Giải phương trình giao điểm.', 'Tích phân xác định và dấu của biểu thức.'],
    intuition: [
      'Một lát thẳng đứng có chiều cao bằng đường trên trừ đường dưới. Nếu hai đường đổi chỗ, thứ tự phép trừ cũng phải đổi. Dùng một phép trừ trên cả miền có thể làm phần dương và âm xóa nhau.',
      'Giá trị tuyệt đối gói quy tắc ấy vào một biểu thức, nhưng khi tính tay ta vẫn cần tìm nơi hiệu bằng không và xét dấu. Vẽ phác hoặc thử một điểm trong mỗi khoảng thường đủ để xác định thứ tự.',
    ],
    method: [
      { title: 'Tìm điểm chia', detail: 'Giải f(x) = g(x), giữ các giao điểm nằm trong khoảng đề bài.' },
      { title: 'Xét trên và dưới', detail: 'Tính dấu f − g tại một điểm thử trong mỗi khoảng giữa hai giao điểm.' },
      { title: 'Cộng diện tích', detail: 'Tích phân đường trên trừ đường dưới trên từng khoảng rồi cộng các kết quả không âm.' },
    ],
    worked: {
      title: 'Hai đồ thị đổi vị trí', prompt: 'Tính diện tích giữa y = x và y = x² trên [−1, 1].',
      steps: [
        { tex: tex`x=x^2\iff x\in\{0,1\}`, explanation: 'Điểm 0 chia đoạn thành hai phần có thứ tự trên dưới khác nhau.' },
        { tex: tex`S=\int_{-1}^{0}(x^2-x)\,dx+\int_0^1(x-x^2)\,dx`, explanation: 'Bên trái 0, x² ở trên; bên phải 0, x ở trên.' },
        { tex: tex`S=\left[\frac{x^3}{3}-\frac{x^2}{2}\right]_{-1}^{0}+\left[\frac{x^2}{2}-\frac{x^3}{3}\right]_0^1=\frac56+\frac16=1`, explanation: 'Hai phần đều dương và được cộng, không trừ.' },
      ],
      result: 'Diện tích bằng 1 đơn vị diện tích.', check: 'Tích phân có dấu của x − x² trên cả đoạn bằng −2/3, nên rõ ràng không thể dùng nó trực tiếp làm diện tích.',
    },
    transfer: { prompt: 'Chỉ giữ đoạn [0, 1], diện tích còn bao nhiêu?', answer: '1/6.', explanation: 'Trên đoạn này x ≥ x²; tích phân x − x² là 1/2 − 1/3.' },
    connections: ['Quãng đường ở ngày 21 cũng dùng giá trị tuyệt đối để tránh triệt tiêu.'],
    checkpoint: { prompt: 'Nếu tích phân của f trên [a, b] bằng 0 thì kết luận nào luôn đúng?', options: ['Diện tích giữa đồ thị và trục bằng 0', 'Các đóng góp có dấu cộng lại bằng 0', 'f bằng 0 ở mọi điểm', 'f không đổi dấu'], answerIndex: 1, explain: 'Phần dương và phần âm có thể triệt tiêu; ví dụ f(x) = x trên [−1, 1].' },
  },
  d20: {
    lead: 'Cùng một tích phân có thể tính thể tích hoặc giá trị trung bình, nhưng phải xác định chính xác đại lượng của mỗi lát trước khi cộng.',
    prerequisites: ['Diện tích hình tròn và vành khăn.', 'Tích phân xác định; đơn vị chiều dài, diện tích, thể tích.'],
    intuition: [
      'Khi quay một miền quanh trục Ox, lát vuông góc với trục trở thành đĩa hoặc vành khăn. Diện tích lát là π lần hiệu hai bình phương bán kính; nhân thêm bề dày dx mới cho thể tích nhỏ.',
      'Giá trị trung bình của hàm lại là chiều cao của một hình chữ nhật có cùng tích phân và cùng đáy. Ta chia tích lũy cho độ dài khoảng. Nó không nhất thiết bằng trung bình hai giá trị ở đầu mút, trừ những trường hợp đặc biệt như hàm tuyến tính.',
    ],
    method: [
      { title: 'Vẽ một lát', detail: 'Ghi trục quay và đo khoảng cách đến trục để nhận diện bán kính ngoài, bán kính trong.' },
      { title: 'Lập đại lượng cần cộng', detail: 'Thể tích dùng diện tích mặt cắt; trung bình dùng f(x) rồi chia cho b − a.' },
      { title: 'Kiểm tra đơn vị', detail: 'Bán kính bình phương nhân dx cho đơn vị khối; giá trị trung bình có cùng đơn vị với f.' },
    ],
    worked: {
      title: 'Quay một dải thành vành khăn', prompt: 'Quay miền 1 ≤ y ≤ x + 1, 0 ≤ x ≤ 1 quanh trục Ox. Tìm thể tích.',
      steps: [
        { tex: tex`R(x)=x+1,\quad r(x)=1`, explanation: 'Cả hai bán kính là khoảng cách không âm tới trục Ox.' },
        { tex: tex`A(x)=\pi\big((x+1)^2-1\big)=\pi(x^2+2x)`, explanation: 'Trừ diện tích lỗ rỗng khỏi diện tích đĩa ngoài.' },
        { tex: tex`V=\pi\int_0^1(x^2+2x)\,dx=\pi\left[\frac{x^3}{3}+x^2\right]_0^1=\frac{4\pi}{3}`, explanation: 'Cộng diện tích mặt cắt theo chiều dài trục.' },
      ],
      result: 'Thể tích bằng 4π/3 đơn vị khối.', check: 'Khối ngoài là nón cụt có thể tích 7π/3; trừ hình trụ bán kính 1, cao 1, còn 4π/3.',
    },
    transfer: { prompt: 'Tìm giá trị trung bình của x² trên [0, 2].', answer: '4/3.', explanation: 'Tích phân bằng 8/3; chia cho độ dài 2. Trung bình hai đầu mút bằng 2 nên không thay thế được công thức.' },
    connections: ['Mặt cắt biến bài toán không gian thành tích lũy một biến.'],
    checkpoint: { prompt: 'Vành khăn có bán kính ngoài 3, trong 2. Diện tích là bao nhiêu?', options: ['π', '25π', '5π', 'π√5'], answerIndex: 2, explain: 'Diện tích là π(3² − 2²) = 5π, không phải π(3 − 2)².' },
  },
  d21: {
    lead: 'Tích phân của một tốc độ thay đổi cho lượng thay đổi tích lũy; ý nghĩa dấu và đơn vị quyết định ta đang tính đại lượng nào.',
    prerequisites: ['Vận tốc là đạo hàm vị trí.', 'Tích phân có dấu; giá trị tuyệt đối.'],
    intuition: [
      'Vận tốc âm nghĩa là vật đi theo chiều ngược với chiều dương đã chọn. Tích phân vận tốc cho độ dời từ điểm đầu đến điểm cuối. Đồng hồ đo quãng đường vẫn tăng khi vật quay lại, nên quãng đường phải cộng độ lớn của vận tốc.',
      'Điện lượng cũng là tích lũy: dòng điện đo bằng coulomb mỗi giây, nhân thời gian cho coulomb. Nếu dòng đổi dấu theo quy ước chiều, tích phân cho điện lượng có dấu; cần đọc đề để biết đang hỏi lượng thuần hay tổng lượng vận chuyển.',
    ],
    method: [
      { title: 'Gọi đúng đại lượng', detail: 'Phân biệt vị trí cuối, độ dời và quãng đường; vị trí cuối còn cần vị trí ban đầu.' },
      { title: 'Tìm lúc đổi chiều', detail: 'Giải v(t) = 0 và xét dấu trong khoảng thời gian đang xét.' },
      { title: 'Cộng và kiểm đơn vị', detail: 'Độ dời tích phân v; quãng đường tích phân |v|; vận tốc m/s nhân giây cho mét.' },
    ],
    worked: {
      title: 'Đi rồi quay lại', prompt: 'Vật có v(t) = 2t − 2 m/s trên 0 ≤ t ≤ 3 s. Tính độ dời và quãng đường.',
      steps: [
        { tex: tex`v(t)=0\iff t=1,\quad v<0\ (0<t<1),\quad v>0\ (1<t<3)`, explanation: 'Vật đổi chiều ở giây thứ nhất.' },
        { tex: tex`\Delta s=\int_0^3(2t-2)\,dt=\left[t^2-2t\right]_0^3=3`, explanation: 'Độ dời cộng vận tốc có dấu.' },
        { tex: tex`L=-\int_0^1(2t-2)\,dt+\int_1^3(2t-2)\,dt=1+4=5`, explanation: 'Đổi dấu phần vận tốc âm để cộng mọi đoạn đường.' },
      ],
      result: 'Độ dời 3 m; quãng đường 5 m.', check: 'Chọn s(0) = 0 thì s(t) = t² − 2t: vật đi từ 0 xuống −1 rồi lên 3, tổng đường 1 + 4.',
    },
    transfer: { prompt: 'Dòng I(t) = 2t ampere chạy từ 0 đến 3 giây. Điện lượng bằng bao nhiêu?', answer: '9 C.', explanation: 'Q = tích phân 2t dt = [t²] từ 0 đến 3 = 9; ampere nhân giây là coulomb.' },
    connections: ['Tích phân |v| dùng cùng logic chia khoảng như diện tích ở ngày 19.'],
    checkpoint: { prompt: 'Khi nào quãng đường bằng độ lớn của độ dời trên một khoảng?', options: ['Khi vật không đổi chiều trên khoảng đó', 'Khi vận tốc đầu và cuối bằng nhau', 'Khi gia tốc bằng 1', 'Khi vị trí đầu bằng 0'], answerIndex: 0, explain: 'Khi vận tốc giữ cùng dấu, tích phân không có sự triệt tiêu giữa hai chiều.' },
  },
  d22: {
    lead: 'Bài ôn tích phân kiểm tra khả năng chọn công cụ. Một dòng nhận dạng đúng thường giúp tiết kiệm nhiều dòng tính toán.',
    prerequisites: ['Nguyên hàm, đổi biến, từng phần.', 'Diện tích, thể tích và tích lũy vật lý.'],
    intuition: [
      'Đừng chọn phương pháp chỉ vì nhìn thấy tích hai biểu thức. Nếu một thừa số là đạo hàm của cụm bên trong, đổi biến thường ngắn. Nếu đạo hàm một thừa số giúp nó giảm bậc, từng phần có thể phù hợp hơn.',
      'Trước phép tính, đọc xem kết quả cần là hàm hay số, lượng có dấu hay không âm. Với nguyên hàm phải có C; với tích phân xác định phải xử lý cận; với diện tích phải kiểm tra vị trí các đường. Đây là ba quyết định khác nhau.',
    ],
    method: [
      { title: 'Gắn nhãn bài toán', detail: 'Viết một câu: đang tìm nguyên hàm, tích lũy, diện tích hay thể tích.' },
      { title: 'So cấu trúc', detail: 'Thử nguyên hàm cơ bản trước; sau đó kiểm tra hàm hợp và phép giảm bậc.' },
      { title: 'Dùng kiểm chứng khác', detail: 'Đạo hàm lại nguyên hàm; so dấu, đơn vị hoặc một ước lượng trước khi chốt.' },
    ],
    worked: {
      title: 'Chọn đúng phép đổi biến', prompt: 'Tính tích phân x/(x² + 1) từ 0 đến 1 và giải thích cách chọn.',
      steps: [
        { tex: tex`u=x^2+1,\quad du=2x\,dx,\quad x\,dx=\frac12du`, explanation: 'Tử số gần bằng đạo hàm mẫu, chỉ thiếu hệ số 2.' },
        { tex: tex`I=\frac12\int_1^2\frac1u\,du`, explanation: 'Biến và cận cùng đổi; bài mới là nguyên hàm logarit.' },
        { tex: tex`I=\frac12[\ln u]_1^2=\frac12\ln2`, explanation: 'u dương trên khoảng nên ln u xác định.' },
      ],
      result: 'Kết quả bằng (ln 2)/2, xấp xỉ 0,347.', check: 'Trên [0, 1], 0 ≤ x/(x² + 1) ≤ 1/2; tích phân phải nằm giữa 0 và 1/2, phù hợp kết quả.',
    },
    transfer: { prompt: 'Nếu tử số đổi thành 2x, kết quả thay đổi thế nào?', answer: 'Bằng ln 2.', explanation: 'Tích phân tuyến tính theo hệ số; nhân đôi hàm dưới dấu tích phân làm kết quả nhân đôi.' },
    connections: ['Lập bảng lỗi theo nhận dạng, biến đổi, cận và dấu giúp ôn đúng phần đang yếu.'],
    checkpoint: { prompt: 'Vì sao đổi biến phù hợp với x/(1 + x²)?', options: ['Mọi phân thức đều phải đổi biến', 'Vì mẫu số luôn bằng 1', 'Vì tử số là một hằng số nhân đạo hàm mẫu', 'Vì tích phân có hai cận'], answerIndex: 2, explain: 'Đạo hàm 1 + x² là 2x, nên x dx được thay bằng du/2.' },
  },
  d23: {
    lead: 'Đạo hàm riêng đo ảnh hưởng của một biến khi khóa các biến còn lại. Đó là phép đo theo một lát cắt của mặt cong.',
    prerequisites: ['Quy tắc đạo hàm một biến.', 'Thay tọa độ vào hàm hai biến theo đúng thứ tự.'],
    intuition: [
      'Với mặt z = f(x, y), giữ y cố định tạo một đường cong theo x. Đạo hàm theo x là độ dốc của đường ấy. Đổi hướng giữ cố định sẽ tạo lát cắt khác, nên hai đạo hàm riêng có thể rất khác nhau tại cùng điểm.',
      'Giữ y là hằng số không có nghĩa xóa y. Trong x²y, y đóng vai trò hệ số nên đạo hàm theo x là 2xy. Chỉ các hạng hoàn toàn không chứa x mới có đạo hàm theo x bằng 0. Tính biểu thức trước rồi thay điểm giúp thấy rõ điều này.',
    ],
    method: [
      { title: 'Đánh dấu biến chuyển động', detail: 'Ghi rõ đang lấy theo x hay y; coi biến khác là tham số cố định.' },
      { title: 'Đạo hàm từng hạng', detail: 'Giữ nguyên hệ số có chứa biến bị khóa; dùng tích và dây chuyền khi cần.' },
      { title: 'Thay điểm và diễn giải', detail: 'Chỉ sau khi có công thức mới thay tọa độ để đọc tốc độ thay đổi theo từng trục.' },
    ],
    worked: {
      title: 'Hai độ dốc tại cùng một điểm', prompt: 'Cho f(x, y) = x²y + 3y². Tính hai đạo hàm riêng tại (2, 1).',
      steps: [
        { tex: tex`f_x=2xy`, explanation: 'y là hệ số của x²; 3y² là hằng số khi x thay đổi.' },
        { tex: tex`f_y=x^2+6y`, explanation: 'x² là hệ số của y; đạo hàm 3y² theo y là 6y.' },
        { tex: tex`f_x(2,1)=4,\quad f_y(2,1)=10`, explanation: 'Hai lát cắt cho hai độ dốc khác nhau.' },
      ],
      result: 'Theo trục x độ dốc là 4; theo trục y độ dốc là 10.', check: 'Lát y = 1 là x² + 3, có đạo hàm 2x; lát x = 2 là 4y + 3y², có đạo hàm 4 + 6y.',
    },
    transfer: { prompt: 'Với g(x, y) = xy², tính gₓ và gᵧ tại (3, 2).', answer: 'gₓ = 4 và gᵧ = 12 tại điểm đã cho.', explanation: 'gₓ = y²; gᵧ = 2xy. Thay (3, 2) sau khi đạo hàm.' },
    connections: ['Gradient ở ngày 24 gom các đạo hàm riêng thành một vectơ.'],
    checkpoint: { prompt: 'Đạo hàm riêng theo x của x²y là biểu thức nào?', options: ['2x', 'x²', '2xy', '2xy + x²'], answerIndex: 2, explain: 'y được giữ cố định nhưng vẫn là hệ số, nên kết quả là y nhân 2x.' },
  },
  d24: {
    lead: 'Gradient kết nối đạo hàm riêng, xấp xỉ thay đổi nhỏ và tốc độ tăng theo một hướng bất kỳ.',
    prerequisites: ['Đạo hàm riêng.', 'Độ dài vectơ và tích vô hướng.'],
    intuition: [
      'Nếu đi đồng thời theo x và y, hai đóng góp bậc nhất cộng lại thành vi phân toàn phần. Mặt phẳng tiếp tuyến là mô hình tuyến tính của mặt cong gần điểm đang xét. Khi bước dịch chuyển lớn, phần sai số do độ cong thường không còn nhỏ.',
      'Đạo hàm theo hướng phải đo trên cùng một đơn vị quãng đường. Vì thế vectơ hướng cần chuẩn hóa; dùng vectơ dài gấp đôi sẽ vô tình đo trên bước dài gấp đôi. Tích vô hướng với gradient chọn phần độ dốc theo hướng ấy.',
    ],
    method: [
      { title: 'Tính gradient tại điểm', detail: 'Lấy các đạo hàm riêng rồi thay tọa độ để có một vectơ số.' },
      { title: 'Phân biệt hai câu hỏi', detail: 'Vi phân dùng độ dịch chuyển thật; đạo hàm theo hướng dùng vectơ đơn vị.' },
      { title: 'Tính tích vô hướng', detail: 'Nhân các thành phần tương ứng rồi cộng; dấu âm nghĩa là hàm giảm theo hướng đi.' },
    ],
    worked: {
      title: 'Một hướng không trùng trục', prompt: 'Với f(x, y) = x² + y², tính đạo hàm tại (1, 2) theo hướng (3, 4).',
      steps: [
        { tex: tex`\nabla f=(2x,2y),\quad \nabla f(1,2)=(2,4)`, explanation: 'Gradient chỉ phụ thuộc điểm đang xét.' },
        { tex: tex`\mathbf u=\frac{(3,4)}{\sqrt{3^2+4^2}}=\left(\frac35,\frac45\right)`, explanation: 'Chuẩn hóa hướng để mỗi bước có độ dài 1.' },
        { tex: tex`D_{\mathbf u}f=(2,4)\cdot\left(\frac35,\frac45\right)=\frac{22}{5}`, explanation: 'Tốc độ tăng theo hướng này là 4,4 trên mỗi đơn vị độ dài.' },
      ],
      result: 'Đạo hàm theo hướng bằng 22/5.', check: 'Thay (x, y) = (1 + 3t/5, 2 + 4t/5) thì f = 5 + 22t/5 + t²; đạo hàm tại t = 0 đúng bằng 22/5.',
    },
    transfer: { prompt: 'Tại (1, 2), dịch dx = 0,03 và dy = 0,04. Tính df.', answer: '0,22.', explanation: 'df = 2 × 0,03 + 4 × 0,04. Thay đổi thật là 0,2225; sai số 0,0025 đến từ bình phương bước dịch.' },
    connections: ['Gradient descent đi ngược gradient để giảm hàm mục tiêu với bước phù hợp.'],
    checkpoint: { prompt: 'Thay hướng (3, 4) bằng (6, 8), đạo hàm theo hướng đơn vị thay đổi thế nào?', options: ['Gấp đôi', 'Giữ nguyên', 'Đổi dấu', 'Gấp bốn'], answerIndex: 1, explain: 'Hai vectơ cùng hướng; sau chuẩn hóa đều bằng (3/5, 4/5).' },
  },
  d25: {
    lead: 'Gradient bằng không chỉ tìm ra ứng viên cực trị. Hessian cho biết mặt cong quanh ứng viên ấy uốn lên, uốn xuống hay theo hai chiều trái ngược.',
    prerequisites: ['Đạo hàm riêng cấp một và cấp hai.', 'Giải hệ phương trình; dấu của biểu thức bậc hai.'],
    intuition: [
      'Ở đáy một chiếc bát, mọi dịch chuyển nhỏ đều làm độ cao tăng. Ở điểm yên ngựa, đi theo một hướng thì tăng nhưng theo hướng khác lại giảm. Hai tình huống đều có thể có gradient bằng không nên cần thông tin về độ cong.',
      'Với hàm có đạo hàm cấp hai liên tục, định thức Hessian kết hợp hai độ cong theo trục và hạng tương tác. D âm báo hiệu yên ngựa. D dương cần thêm dấu fₓₓ để phân biệt bát úp và bát ngửa. D bằng không chỉ nói phép thử chưa đủ.',
    ],
    method: [
      { title: 'Tìm mọi điểm dừng', detail: 'Giải đồng thời fₓ = 0 và fᵧ = 0, không giải từng phương trình riêng lẻ.' },
      { title: 'Tính Hessian', detail: 'Lấy fₓₓ, fᵧᵧ, fₓᵧ rồi tính D tại từng điểm dừng.' },
      { title: 'Phân loại đúng phạm vi', detail: 'Phép thử cho cực trị địa phương; muốn cực trị toàn miền còn phải xét biên và hành vi xa điểm.' },
    ],
    worked: {
      title: 'Bát lệch khỏi gốc', prompt: 'Tìm và phân loại điểm dừng của f = x² + 2y² − 2x + 4y.',
      steps: [
        { tex: tex`f_x=2x-2=0,\quad f_y=4y+4=0\Rightarrow (x,y)=(1,-1)`, explanation: 'Hai phương trình xác định duy nhất một điểm dừng.' },
        { tex: tex`f_{xx}=2,\quad f_{yy}=4,\quad f_{xy}=0,\quad D=8>0`, explanation: 'D dương và fₓₓ dương cho cực tiểu địa phương.' },
        { tex: tex`f=(x-1)^2+2(y+1)^2-3\ge -3`, explanation: 'Hoàn thành bình phương chứng minh thêm đây là cực tiểu toàn cục.' },
      ],
      result: 'Cực tiểu toàn cục tại (1, −1), giá trị −3.', check: 'Hai bình phương cùng bằng 0 đúng tại (1, −1); mọi điểm khác đều cho giá trị lớn hơn −3.',
    },
    transfer: { prompt: 'Phân loại g(x, y) = x² − 2y² tại gốc.', answer: 'Điểm yên ngựa.', explanation: 'D = 2 × (−4) = −8; theo trục x hàm tăng khỏi 0, theo trục y hàm giảm.' },
    connections: ['Hessian mở rộng phép thử đạo hàm bậc hai của bài toán một biến.'],
    checkpoint: { prompt: 'Nếu D = 0 tại điểm dừng, ta được phép kết luận gì?', options: ['Luôn là cực tiểu', 'Luôn là cực đại', 'Luôn là yên ngựa', 'Phép thử Hessian chưa kết luận'], answerIndex: 3, explain: 'Cần công cụ khác; chẳng hạn x⁴ + y⁴ vẫn có cực tiểu tại gốc dù D = 0.' },
  },
  d26: {
    lead: 'Đường cong tham số mô tả vị trí theo thời gian; đạo hàm từng tọa độ cho vận tốc, rồi độ dài vận tốc cho tốc độ.',
    prerequisites: ['Đạo hàm từng thành phần.', 'Độ dài, tích vô hướng và tích có hướng của vectơ.'],
    intuition: [
      'Vectơ vận tốc chứa cả hướng chuyển động lẫn mức nhanh chậm. Tốc độ bỏ phần hướng, chỉ giữ một số không âm. Hai vật có vận tốc đối nhau vẫn có thể chạy nhanh như nhau, nên không thể coi tốc độ và vận tốc là một.',
      'Độ dài quỹ đạo cộng các đoạn đường nhỏ có độ dài gần bằng tốc độ nhân thời gian. Tích vô hướng giúp kiểm tra hai hướng có vuông góc; tích có hướng tạo pháp tuyến vuông góc hai vectơ và có độ dài bằng diện tích hình bình hành chúng căng ra.',
    ],
    method: [
      { title: 'Đạo hàm vị trí', detail: 'Tính từng thành phần của r′(t), giữ đúng thứ tự tọa độ.' },
      { title: 'Lấy chuẩn', detail: 'Tốc độ là căn tổng bình phương các thành phần vận tốc, không phải tổng các thành phần.' },
      { title: 'Tính lượng được hỏi', detail: 'Độ dời dùng r(b) − r(a); độ dài đường dùng tích phân của tốc độ.' },
    ],
    worked: {
      title: 'Đi quanh một đường tròn', prompt: 'Cho r(t) = (3 cos t, 3 sin t, 0), 0 ≤ t ≤ π. Tính tốc độ và độ dài đường đi.',
      steps: [
        { tex: tex`\mathbf r'(t)=(-3\sin t,3\cos t,0)`, explanation: 'Đạo hàm từng tọa độ; giữ dấu trừ của cos.' },
        { tex: tex`\|\mathbf r'(t)\|=\sqrt{9\sin^2t+9\cos^2t}=3`, explanation: 'Hướng vận tốc thay đổi nhưng tốc độ không đổi.' },
        { tex: tex`L=\int_0^\pi3\,dt=3\pi`, explanation: 'Cộng tốc độ trong thời gian dài π.' },
      ],
      result: 'Tốc độ bằng 3; độ dài đường đi bằng 3π.', check: 'Quỹ đạo là nửa đường tròn bán kính 3, nên độ dài bằng nửa chu vi 6π. Độ lớn độ dời chỉ bằng 6.',
    },
    transfer: { prompt: 'Đi đủ khoảng 0 ≤ t ≤ 2π thì độ dời và độ dài là bao nhiêu?', answer: 'Vectơ độ dời bằng (0, 0, 0); độ dài bằng 6π.', explanation: 'Vật trở về điểm đầu nhưng đã đi đủ một vòng tròn.' },
    connections: ['Vị trí và vận tốc của chuyển động nhiều chiều mở rộng ngày 21.'],
    checkpoint: { prompt: 'Vận tốc (−3, 4, 0) có tốc độ bao nhiêu?', options: ['1', '−5', '7', '5'], answerIndex: 3, explain: 'Chuẩn bằng √(9 + 16) = 5; tốc độ luôn không âm.' },
  },
  d27: {
    lead: 'Divergence đo xu hướng chảy ra khỏi một vùng rất nhỏ; curl đo xu hướng quay cục bộ. Chúng trả lời hai câu hỏi khác nhau về trường vectơ.',
    prerequisites: ['Đạo hàm riêng theo đúng biến.', 'Phân biệt trường vô hướng và trường vectơ.'],
    intuition: [
      'Hãy hình dung đặt một hộp rất nhỏ vào dòng chảy. Nếu lượng đi ra nhiều hơn đi vào, divergence dương; nếu dòng bị hút vào, divergence âm. Chỉ cộng ba thành phần của trường không thể đo điều này, vì cần biết chúng thay đổi theo vị trí.',
      'Một guồng quay nhỏ lại cảm nhận sự xoáy. Curl trong không gian là vectơ chỉ trục quay theo quy tắc bàn tay phải. Trường quay quanh gốc có thể không tạo nguồn hoặc hố hút, nên divergence bằng 0 không có nghĩa trường không chuyển động hoặc không xoáy.',
    ],
    method: [
      { title: 'Gắn tên thành phần', detail: 'Viết F = (P, Q, R) trước khi đạo hàm để không đổi chỗ các thành phần.' },
      { title: 'Tính divergence', detail: 'Cộng Pₓ + Qᵧ + R_z, mỗi thành phần lấy theo đúng trục tương ứng.' },
      { title: 'Tính curl có thứ tự', detail: 'Dùng (Rᵧ − Q_z, P_z − Rₓ, Qₓ − Pᵧ); kiểm tra dấu và loại kết quả.' },
    ],
    worked: {
      title: 'Xoáy mà không có nguồn', prompt: 'Tính div và curl của F = (−y, x, 0).',
      steps: [
        { tex: tex`P=-y,\quad Q=x,\quad R=0`, explanation: 'Trường nằm trong mặt phẳng xy và quay quanh gốc.' },
        { tex: tex`\nabla\cdot\mathbf F=P_x+Q_y+R_z=0+0+0=0`, explanation: 'Các thành phần không tăng theo chính trục dòng tương ứng.' },
        { tex: tex`\nabla\times\mathbf F=(0,0,Q_x-P_y)=(0,0,1-(-1))=(0,0,2)`, explanation: 'Hai đạo hàm chéo tạo xu hướng quay theo chiều dương quanh trục z.' },
      ],
      result: 'Divergence bằng 0; curl bằng (0, 0, 2).', check: 'Ở (1, 0), vectơ hướng lên; ở (0, 1), vectơ hướng trái: vòng quay ngược chiều kim đồng hồ phù hợp curl theo +z.',
    },
    transfer: { prompt: 'Với F = (x, y, z), div và curl là gì?', answer: 'div F = 3; curl F = (0, 0, 0).', explanation: 'Ba đạo hàm theo trục đều bằng 1; mọi đạo hàm chéo bằng 0.' },
    connections: ['Gradient biến trường vô hướng thành vectơ; divergence biến trường vectơ thành vô hướng.'],
    checkpoint: { prompt: 'Từ div F = 0, kết luận nào hợp lệ?', options: ['F bằng vectơ 0', 'Curl F bằng 0', 'Thông lượng thuần cục bộ không có nguồn theo phép đo divergence', 'Mọi thành phần F đều hằng'], answerIndex: 2, explain: 'Trường (−y, x, 0) có div bằng 0 nhưng khác 0 và có curl khác 0.' },
  },
  d28: {
    lead: 'Tích phân kép cộng đóng góp trên một miền phẳng. Viết đúng cận là mô tả đúng miền trước khi làm bất kỳ phép tính nào.',
    prerequisites: ['Tích phân một biến.', 'Vẽ bất đẳng thức và đọc miền tam giác, hình chữ nhật.'],
    intuition: [
      'Một ô nhỏ có diện tích dA đóng góp khoảng f(x, y)dA. Khi f là mật độ mặt, tổng là khối lượng; khi f = 1, tổng là diện tích miền. Tích phân lặp tổ chức việc cộng thành các dải rồi cộng những dải đó.',
      'Với thứ tự dy dx, cố định x trước và quét y từ đáy đến đỉnh miền. Cận trong có thể phụ thuộc x. Khi đổi thứ tự, cần quét ngang thay vì quét dọc; không thể chỉ đổi hai ký hiệu dx và dy mà giữ nguyên cận phụ thuộc.',
    ],
    method: [
      { title: 'Phác miền', detail: 'Đánh dấu các đỉnh và đường biên; xác định một dải đi xuyên miền như thế nào.' },
      { title: 'Viết cận trong và ngoài', detail: 'Biến ngoài chạy trên hình chiếu của miền; cận trong mô tả đoạn cắt ứng với mỗi giá trị ngoài.' },
      { title: 'Tích phân từ trong ra', detail: 'Giữ biến ngoài như hằng số khi tính tích phân trong, sau đó mới tính tích phân ngoài.' },
    ],
    worked: {
      title: 'Mật độ trên một tam giác', prompt: 'Tính tích phân kép của x + y trên D: x ≥ 0, y ≥ 0, x + y ≤ 1.',
      steps: [
        { tex: tex`0\le x\le1,\quad 0\le y\le1-x`, explanation: 'Mỗi dải đứng có đáy trên y = 0 và đỉnh trên y = 1 − x.' },
        { tex: tex`\int_0^{1-x}(x+y)\,dy=x(1-x)+\frac{(1-x)^2}{2}=\frac12-\frac{x^2}{2}`, explanation: 'Trong tích phân theo y, x đóng vai trò hằng số.' },
        { tex: tex`I=\int_0^1\left(\frac12-\frac{x^2}{2}\right)dx=\frac12-\frac16=\frac13`, explanation: 'Cộng các dải để thu được toàn bộ tích phân.' },
      ],
      result: 'Tích phân bằng 1/3.', check: 'Đối xứng x và y: mỗi tích phân của x hoặc y bằng 1/6, nên tổng bằng 1/3.',
    },
    transfer: { prompt: 'Viết lại cận khi đổi sang thứ tự dx dy trên cùng tam giác.', answer: '0 ≤ y ≤ 1 và 0 ≤ x ≤ 1 − y.', explanation: 'Dải ngang bắt đầu trên trục y và kết thúc tại đường x = 1 − y.' },
    connections: ['Tích phân 1 trên miền là diện tích, nối trực tiếp với ngày 19.'],
    checkpoint: { prompt: 'Trong tích phân trong theo y của x + y, x được xử lý thế nào?', options: ['Được giữ như hằng số', 'Được thay bằng 0', 'Cũng lấy tích phân cùng lúc', 'Luôn được thay bằng y'], answerIndex: 0, explain: 'Mỗi dải ứng với một x cố định; sau khi tính theo y mới cộng các dải theo x.' },
  },
  d29: {
    lead: 'Chọn tọa độ theo hình dạng miền giúp cận đơn giản hơn, nhưng phần tử diện tích hoặc thể tích cũng phải thay đổi theo phép đổi tọa độ.',
    prerequisites: ['Tọa độ cực; diện tích quạt tròn.', 'Tích phân lặp và cận của khối hộp.'],
    intuition: [
      'Một ô cực có bề dày dr và chiều dài cung gần bằng r dθ. Do đó diện tích gần bằng r dr dθ. Cùng một góc nhỏ tạo cung dài hơn khi ra xa gốc; hệ số r ghi lại chính sự giãn ấy, không phải hệ số trang trí.',
      'Tích phân ba lớp cộng trên các ô thể tích. Trên khối hộp trong tọa độ Descartes, ba cận độc lập và phần tử là dx dy dz. Nếu tiếp tục đổi sang tọa độ trụ thì hệ số r lại xuất hiện; phải phân biệt hệ tọa độ đang dùng.',
    ],
    method: [
      { title: 'Chọn theo đối xứng', detail: 'Miền tròn và biểu thức x² + y² thường phù hợp với tọa độ cực.' },
      { title: 'Đổi đủ ba phần', detail: 'Thay hàm, mô tả lại miền bằng r và θ, rồi thay dA bằng r dr dθ.' },
      { title: 'Kiểm bằng đại lượng quen', detail: 'Thử tích phân 1 để kiểm diện tích hoặc thể tích; kiểm độ phủ góc tránh đếm miền hai lần.' },
    ],
    worked: {
      title: 'Mật độ tăng theo khoảng cách tới tâm', prompt: 'Tính tích phân kép của x² + y² trên đĩa x² + y² ≤ 4.',
      steps: [
        { tex: tex`x^2+y^2=r^2,\quad 0\le r\le2,\quad 0\le\theta\le2\pi`, explanation: 'Toàn đĩa cần một vòng góc và bán kính từ tâm đến 2.' },
        { tex: tex`I=\int_0^{2\pi}\int_0^2 r^2\,r\,dr\,d\theta`, explanation: 'Một r² đến từ hàm; một r khác đến từ phần tử diện tích.' },
        { tex: tex`I=\int_0^{2\pi}\left[\frac{r^4}{4}\right]_0^2d\theta=\int_0^{2\pi}4\,d\theta=8\pi`, explanation: 'Tính theo bán kính trước rồi theo góc.' },
      ],
      result: 'Tích phân bằng 8π.', check: 'Diện tích đĩa là 4π nên giá trị trung bình của r² là 2, nằm giữa giá trị nhỏ nhất 0 và lớn nhất 4.',
    },
    transfer: { prompt: 'Tính tích phân ba lớp của 1 trên hộp [0, 2] × [0, 3] × [0, 4].', answer: '24.', explanation: 'Ba lần tích phân lần lượt nhân các độ dài 4, 3 và 2; đây chính là thể tích khối hộp.' },
    connections: ['Hệ số r là Jacobian; phép đổi biến một chiều ở ngày 16 cũng phải đổi vi phân.'],
    checkpoint: { prompt: 'Sau khi đổi tích phân của x² + y² sang cực, biểu thức nhân dr dθ là gì?', options: ['r²', 'r', 'r⁴', 'r³'], answerIndex: 3, explain: 'Hàm trở thành r² và dA = r dr dθ, nên tích của chúng là r³ dr dθ.' },
  },
  d30: {
    lead: 'Bài tổng kết đo khả năng nối các công cụ: nhận dạng đại lượng, chọn phương pháp, kiểm điều kiện và giải thích vì sao kết quả hợp lý.',
    prerequisites: ['Giới hạn, đạo hàm và tích phân một biến.', 'Đạo hàm riêng, vectơ, tích phân kép và ba lớp.'],
    intuition: [
      'Mỗi câu nên bắt đầu bằng một quyết định: đang xét hành vi gần một điểm, tốc độ thay đổi hay tổng tích lũy? Sau đó xác định bài có một biến hay nhiều biến. Cách phân loại này thu hẹp công cụ trước khi tính.',
      'Điểm số chỉ có ích khi đi cùng nguyên nhân sai. Sai nhận dạng cần ôn ý nghĩa; sai công thức cần dựng lại quy tắc; sai dấu, cận hoặc đơn vị cần một bước kiểm cuối. Làm lại bài bằng trí nhớ sau một khoảng nghỉ giúp nhận ra phần đã hiểu và phần chỉ vừa nhìn lời giải.',
    ],
    method: [
      { title: 'Đọc và phân nhóm', detail: 'Trong đề 12 câu, ghi nhanh công cụ cho từng câu trước khi giải; đánh dấu câu cần quay lại.' },
      { title: 'Trình bày có lý do', detail: 'Mỗi phép đổi biến, chia khoảng hoặc phân loại điểm dừng cần một câu giải thích điều kiện.' },
      { title: 'Chấm theo nhóm lỗi', detail: 'Sau khi làm độc lập, đối chiếu đáp án và chọn ba nhóm yếu để làm lại sau 1, 3 và 7 ngày.' },
    ],
    worked: {
      title: 'Nối tốc độ với tích lũy', prompt: 'Một hệ có lượng tích lũy A(t) = tích phân từ 0 đến t của 2s(s² + 1) ds. Tìm A(1) và A′(1).',
      steps: [
        { tex: tex`A(t)=\left[\frac{s^4}{2}+s^2\right]_0^t=\frac{t^4}{2}+t^2`, explanation: 'Trước hết tính lượng đã tích lũy bằng một nguyên hàm.' },
        { tex: tex`A(1)=\frac12+1=\frac32`, explanation: 'Đây là tổng lượng trên cả khoảng từ 0 đến 1.' },
        { tex: tex`A'(t)=2t^3+2t,\quad A'(1)=4`, explanation: 'Đạo hàm cho tốc độ tại thời điểm cuối, khác với tổng lượng.' },
      ],
      result: 'Lượng tích lũy tại 1 bằng 3/2; tốc độ tức thời bằng 4.', check: 'Định lý cơ bản cho A′(t) = 2t(t² + 1); thay t = 1 cũng được 4.',
    },
    transfer: { prompt: 'Tốc độ trung bình tích lũy trên [0, 1] là bao nhiêu?', answer: '3/2.', explanation: 'Lấy [A(1) − A(0)]/(1 − 0), không dùng A′(1) vì đó chỉ là tốc độ cuối khoảng.' },
    connections: ['Đề cuối gồm giới hạn; dây chuyền; cực trị; tối ưu; nguyên hàm; tích phân; diện tích; đạo hàm riêng; Hessian; vectơ; tích phân kép; tích phân ba lớp.'],
    checkpoint: { prompt: 'Sau khi làm sai một câu, hành động nào giúp xác định chỗ cần ôn rõ nhất?', options: ['Chép đáp án rồi chuyển bài', 'Chỉ ghi điểm tổng', 'Ghi bước sai, giải thích quy tắc rồi tự làm lại không nhìn', 'Đổi ngay sang bài khó hơn'], answerIndex: 2, explain: 'Gắn lỗi với một bước và kiểm lại bằng lần tự giải giúp phân biệt hiểu quy tắc với nhớ đáp án.' },
  },
};
