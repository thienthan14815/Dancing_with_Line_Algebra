export interface DigitalLessonContent {
  id: string;
  skillId: string;
  title: string;
  objective: string;
  paragraphs: string[];
  formula?: string;
  steps: string[];
  table?: { caption: string; headers: string[]; rows: string[][] };
  takeaway: string;
}

export const lessons: DigitalLessonContent[] = [
  {
    id: 'binary-decimal', skillId: 'digital_binary_decimal',
    title: 'Nhị phân → thập phân (二進位 → 十進位)',
    objective: 'Đọc trọng số từng bit và tính giá trị thập phân của một số nhị phân.',
    paragraphs: [
      'Hệ nhị phân chỉ dùng chữ số 0 và 1. Từ phải sang trái, các vị trí có trọng số 2⁰, 2¹, 2², 2³,… tương ứng 1, 2, 4, 8,… Bit ngoài cùng bên phải là bit thấp nhất (LSB); bit ngoài cùng bên trái là bit cao nhất (MSB).',
      'Giống 253₁₀ = 2×100 + 5×10 + 3×1, số nhị phân là tổng các chữ số nhân trọng số vị trí. Chương này dùng số không dấu: 4 bit biểu diễn từ 0 đến 15.',
    ],
    formula: '(1011)_2=1\\cdot2^3+0\\cdot2^2+1\\cdot2^1+1\\cdot2^0=11_{10}',
    steps: ['Viết trọng số dưới 11010₂: 16, 8, 4, 2, 1.', 'Chỉ lấy vị trí có bit 1: 16 + 8 + 2.', 'Kết quả: 11010₂ = 26₁₀. Các số 0 ở đầu không đổi giá trị.'],
    takeaway: 'Đừng đọc 1011₂ thành một nghìn không trăm mười một; cơ số quyết định trọng số vị trí.',
  },
  {
    id: 'base-conversion', skillId: 'digital_base_conversion',
    title: 'Đổi cơ số n → m (n進位 → m進位)',
    objective: 'Đổi số nguyên không âm giữa các cơ số bằng khai triển và chia lấy dư.',
    paragraphs: [
      'Với cơ số nguyên b ≥ 2, mỗi chữ số phải nằm từ 0 đến b−1. Hệ 16 dùng A, B, C, D, E, F cho các giá trị 10 đến 15. Giá trị của số giữ nguyên khi đổi cách viết.',
      'Để đổi n → m: khai triển theo lũy thừa n để lấy giá trị thập phân, rồi chia liên tiếp cho m. Mỗi số dư là một chữ số; đọc số dư ngược thứ tự tìm được. Riêng số 0 luôn viết là 0.',
      'Mẹo: một chữ số hệ 16 tương ứng 4 bit, một chữ số hệ 8 tương ứng 3 bit. Nhóm bit từ phải sang trái và thêm 0 bên trái khi cần.',
      'Phần lẻ dùng trọng số b⁻¹, b⁻²,… Ví dụ 0.101₂ = 1/2 + 1/8 = 0.625₁₀. Khi đổi phần lẻ thập phân sang cơ số m, nhân liên tiếp với m và đọc phần nguyên theo thứ tự; quá trình có thể không kết thúc. Phần luyện tập dưới đây tập trung số nguyên.',
    ],
    formula: '(d_k\\ldots d_0)_n=\\sum_{i=0}^{k}d_i n^i',
    steps: ['Đổi 132₄ → cơ số 3: 1×4² + 3×4 + 2 = 30₁₀.', '30 ÷ 3 = 10 dư 0; 10 ÷ 3 = 3 dư 1.', '3 ÷ 3 = 1 dư 0; 1 ÷ 3 = 0 dư 1.', 'Đọc ngược các số dư: 1010₃. Kiểm tra: 27 + 3 = 30.'],
    takeaway: 'Cơ số không phải số chữ số của một số. 102₂ sai vì hệ 2 không có chữ số 2.',
  },
  {
    id: 'function', skillId: 'digital_function', title: 'Đầu vào → đầu ra: Y = f(x)',
    objective: 'Diễn giải mạch tổ hợp như một hàm của các bit đầu vào.',
    paragraphs: [
      'Hàm số gán cho mỗi đầu vào hợp lệ đúng một đầu ra. Trong mạch số, x thường là một bộ bit: x = (A, B, C). Đầu ra Y có thể là một bit hoặc nhiều bit.',
      'Ví dụ đèn chỉ sáng khi công tắc cho phép E = 1 và cảm biến D = 1: Y = f(E,D) = E AND D. Với hai bit đầu vào có 2² = 4 tổ hợp cần đặc tả.',
      'Trong mô hình logic ổn định của mạch tổ hợp, cùng một bộ đầu vào luôn cho cùng đầu ra. Mạch thật cần thời gian lan truyền để ổn định. Mạch tuần tự còn cần biết trạng thái đang lưu.',
    ],
    formula: 'f:\\{0,1\\}^k\\longrightarrow\\{0,1\\}^r,\\qquad Y=f(x)',
    steps: ['Xác định ý nghĩa 0/1 của mỗi đầu vào và đầu ra.', 'Liệt kê các tổ hợp đầu vào hợp lệ.', 'Gán đầu ra mong muốn cho từng tổ hợp, rồi tìm biểu thức/cổng thực hiện hàm đó.'],
    takeaway: 'Y = f(x) là cách mô tả hành vi; chưa quy định mạch được xây bằng transistor hay loại cổng nào.',
  },
  {
    id: 'transistors-gates', skillId: 'digital_gates', title: 'Transistor → cổng logic (電晶體 → logic gate)',
    objective: 'Nối mô hình công tắc transistor với các phép NOT, AND, OR, NAND, NOR và XOR.',
    paragraphs: [
      'Trong mô hình đơn giản của mạch số, transistor là công tắc điều khiển bằng điện. Các khoảng điện áp được quy ước thành mức logic 0 và 1; bit không phải một điện áp cố định cho mọi công nghệ.',
      'Ví dụ bộ đảo CMOS có một pMOS kéo đầu ra lên nguồn và một nMOS kéo xuống đất. Khi đầu vào thấp: pMOS dẫn, nMOS tắt → Y = 1. Khi đầu vào cao: pMOS tắt, nMOS dẫn → Y = 0. Đó là cổng NOT trong trạng thái ổn định lý tưởng.',
      'Kết nối transistor tạo cổng logic; kết nối cổng tạo mạch; đại số Boolean mô tả mạch bằng ký hiệu. Hệ đếm diễn giải nhiều bit thành số, không phải một loại cổng.',
      'AND cho 1 khi cả hai đầu vào là 1; OR cho 1 khi ít nhất một đầu vào là 1; XOR cho 1 khi hai đầu vào khác nhau. NAND = NOT(AND), NOR = NOT(OR), XNOR = NOT(XOR). Chỉ dùng NAND hoặc chỉ dùng NOR cũng có thể xây mọi hàm Boolean.',
    ],
    formula: '\\mathrm{NOT}(A)=\\overline A,\\quad \\mathrm{AND}(A,B)=AB,\\quad \\mathrm{OR}(A,B)=A+B',
    steps: ['Xét A = 1, B = 1: AND = 1, OR = 1, XOR = 0.', 'Đảo kết quả: NAND = 0, NOR = 0, XNOR = 1.', 'Thử thay các bit ở bảng tương tác để kiểm tra quy tắc.'],
    takeaway: 'Mô hình công tắc giúp hiểu logic; thiết kế điện thực tế còn xét điện áp, thời gian và tải.',
  },
  {
    id: 'truth-table', skillId: 'digital_truth_table', title: 'Bảng chân trị = đặc tả (真值表 / spec)',
    objective: 'Chuyển yêu cầu bằng lời thành bảng chân trị đầy đủ.',
    paragraphs: [
      'Đặc tả (specification, spec) nói mạch cần làm gì. Với k bit đầu vào độc lập, bảng chân trị đầy đủ có 2ᵏ hàng. Thường sắp hàng theo thứ tự đếm nhị phân để không bỏ sót hoặc lặp.',
      'Ví dụ hệ thống báo động: E là bật bảo vệ, D là cửa mở, W là cửa sổ mở. Đầu ra Y bật khi bảo vệ được bật và ít nhất một cửa mở. Vì vậy Y = E(D + W), trong đó + là OR.',
      'Bảng dưới chỉ mô tả quan hệ đầu vào/đầu ra, chưa chọn cách nối cổng. Chỉ dùng “don’t care” cho tổ hợp được đặc tả cho phép bỏ qua; không tùy ý bỏ hàng khó.',
    ],
    table: {
      caption: 'Đặc tả báo động Y = E AND (D OR W)',
      headers: ['E', 'D', 'W', 'Y'],
      rows: [['0','0','0','0'],['0','0','1','0'],['0','1','0','0'],['0','1','1','0'],['1','0','0','0'],['1','0','1','1'],['1','1','0','1'],['1','1','1','1']],
    },
    steps: ['Đặt tên và định nghĩa ý nghĩa từng tín hiệu.', 'Liệt kê từ 000 đến 111 cho ba đầu vào.', 'Áp dụng câu yêu cầu để điền Y ở từng hàng.', 'Dùng bảng làm chuẩn kiểm tra biểu thức và mạch sau khi thiết kế.'],
    takeaway: 'Bảng chân trị là hợp đồng hành vi của mạch tổ hợp, không phải bảng chuyển trạng thái của mạch tuần tự.',
  },
  {
    id: 'boolean-algebra', skillId: 'digital_boolean', title: 'Đại số Boolean (布林代數)',
    objective: 'Đọc ký hiệu và rút gọn biểu thức logic bằng các luật cơ bản.',
    paragraphs: [
      'Biến Boolean chỉ nhận 0 hoặc 1. Ký hiệu AB hay A·B là AND, A+B là OR, dấu gạch trên A là NOT. Thứ tự ưu tiên thông thường: NOT, rồi AND, rồi OR; dùng ngoặc khi dễ nhầm.',
      'Các luật: A+0=A, A·1=A, A+1=1, A·0=0, A+A=A, AA=A. Với phần bù: A+NOT A=1 và A·NOT A=0. Luật hấp thụ: A+AB=A.',
      'De Morgan: phủ định một AND thành OR các phần bù; phủ định một OR thành AND các phần bù. Đây là cầu nối giữa biểu thức và mạch NAND/NOR.',
    ],
    formula: '\\overline{AB}=\\overline A+\\overline B,\\qquad \\overline{A+B}=\\overline A\\,\\overline B',
    steps: ['Rút gọn AB + A NOT B: đặt A làm nhân tử chung.', 'A(B + NOT B) = A·1 = A.', 'Kiểm tra cả bốn tổ hợp A,B: hai biểu thức luôn cho cùng đầu ra.'],
    takeaway: 'Dấu + trong Boolean là OR: 1+1=1. Nó khác phép cộng số học tạo bit nhớ trong bộ cộng.',
  },
  {
    id: 'sum-of-products', skillId: 'digital_sop', title: 'Tổng các tích (sum of product terms / SOP)',
    objective: 'Từ các hàng Y = 1 viết SOP chính tắc rồi dựng mạch AND–OR.',
    paragraphs: [
      'Literal là một biến hoặc phần bù của biến. Product term (tích) là AND của các literal; sum of products (SOP) là OR của các tích. Ví dụ AB + NOT A·C là SOP.',
      'Một minterm chứa đủ mỗi biến đúng một lần, ở dạng thường hoặc phủ định, nên chỉ bằng 1 tại một hàng. SOP chính tắc là OR các minterm ứng với những hàng đầu ra bằng 1.',
      'Quy tắc lấy minterm: bit của biến là 1 → dùng biến thường; bit là 0 → dùng biến phủ định. Ví dụ hàng ABC = 101 tạo A·NOT B·C. SOP đã rút gọn có thể không còn đủ biến trong mỗi tích.',
    ],
    formula: 'Y(A,B)=\\overline A B+A\\overline B=\\Sigma m(1,2)=A\\oplus B',
    table: { caption: 'Từ bảng XOR sang SOP (thứ tự bit A, B; A là bit cao)', headers: ['A','B','Y','Minterm lấy vào SOP'], rows: [['0','0','0','—'],['0','1','1','NOT A · B'],['1','0','1','A · NOT B'],['1','1','0','—']] },
    steps: ['Đánh dấu các hàng có Y = 1: 01 và 10.', 'Viết hai minterm: NOT A·B và A·NOT B.', 'OR hai minterm để có Y; dựng hai cổng AND, cổng NOT cần thiết và một cổng OR.', 'Đối chiếu lại tất cả các hàng. Nếu không có hàng 1 thì Y = 0; nếu tất cả hàng là 1 thì Y = 1.'],
    takeaway: 'SOP dùng các hàng có đầu ra 1. Chỉ số Σm phụ thuộc thứ tự biến đã công bố.',
  },
  {
    id: 'adder', skillId: 'digital_adder', title: 'Module 1 bit → bộ cộng 4 bit (adder)',
    objective: 'Tính tổng/nhớ của full adder và ghép bốn module thành ripple-carry adder.',
    paragraphs: [
      'Half adder (bộ cộng bán phần) nhận A,B: S = A XOR B, C = AB. Full adder (bộ cộng toàn phần) nhận thêm nhớ vào Cᵢₙ, phù hợp để ghép nhiều bit.',
      'Full adder tạo S = A XOR B XOR Cᵢₙ; Cₒᵤₜ = AB + ACᵢₙ + BCᵢₙ. Tổng số học A+B+Cᵢₙ bằng S + 2Cₒᵤₜ. Có thể dựng bằng hai half adder và một cổng OR cho hai tín hiệu nhớ.',
      'Bộ cộng 4 bit gồm FA₀, FA₁, FA₂, FA₃. FAᵢ nhận Aᵢ,Bᵢ,Cᵢ và xuất Sᵢ,Cᵢ₊₁. Nối C₁ → FA₁, C₂ → FA₂, C₃ → FA₃. Khi cộng hai số thông thường đặt C₀ = 0; kết quả đầy đủ là C₄S₃S₂S₁S₀.',
      'Đây là mạch tổ hợp dù carry đi qua nhiều tầng và gây trễ lan truyền. C₄ báo vượt miền 4 bit không dấu; tràn có dấu là khái niệm khác.',
    ],
    table: { caption: 'Bảng chân trị full adder 1 bit', headers: ['A','B','Cᵢₙ','S','Cₒᵤₜ'], rows: [['0','0','0','0','0'],['0','0','1','1','0'],['0','1','0','1','0'],['0','1','1','0','1'],['1','0','0','1','0'],['1','0','1','0','1'],['1','1','0','0','1'],['1','1','1','1','1']] },
    steps: ['Ví dụ A=1011₂, B=0110₂, C₀=0. Bắt đầu từ bit 0 bên phải.', 'Bit 0: 1+0+0=1 → S₀=1, C₁=0.', 'Bit 1: 1+1+0=2 → S₁=0, C₂=1.', 'Bit 2: 0+1+1=2 → S₂=0, C₃=1.', 'Bit 3: 1+0+1=2 → S₃=0, C₄=1. Kết quả 10001₂ = 17₁₀.'],
    takeaway: 'Bốn module xử lý song song về cấu trúc, nhưng kết quả ổn định phải chờ chuỗi carry lan truyền.',
  },
  {
    id: 'circuit-types', skillId: 'digital_circuit_types', title: 'Mạch tổ hợp & tuần tự (組合、循序／序向)',
    objective: 'Phân biệt mạch không nhớ và mạch có trạng thái; đọc ví dụ flip-flop D.',
    paragraphs: [
      'Mạch tổ hợp (combinational, 組合電路): đầu ra ổn định chỉ phụ thuộc đầu vào hiện tại. Ví dụ cổng logic, bộ cộng, bộ chọn kênh (multiplexer), bộ giải mã. Mô hình là Y = f(X).',
      'Mạch tuần tự (sequential, 循序電路; cũng gọi 序向電路): có phần tử lưu trạng thái, nên cùng đầu vào hiện tại có thể cho đầu ra khác tùy lịch sử. Ví dụ thanh ghi, bộ đếm, máy trạng thái.',
      'Ví dụ flip-flop D kích cạnh lên, không xét reset/enable: tại cạnh lên clock, Q nhận giá trị D; giữa hai cạnh, Q giữ nguyên. Nếu D đổi từ 0 sang 1 khi chưa có cạnh lên, Q chưa đổi. Mô hình này giả sử dữ liệu đáp ứng yêu cầu thời gian của phần tử.',
      'Nhiều mạch tuần tự dùng clock, nhưng cũng có mạch tuần tự bất đồng bộ. Điểm phân biệt cốt lõi là trạng thái lưu, không chỉ sự có mặt của clock. Mạch tuần tự cần bảng chuyển trạng thái (Q, X → Q kế tiếp, Y).',
    ],
    formula: 'Q_{t+1}=g(Q_t,X_t),\\qquad Y_t=h(Q_t,X_t)',
    table: { caption: 'Flip-flop D lý tưởng (không reset/enable)', headers: ['Sự kiện','D','Q sau sự kiện'], rows: [['Không có cạnh lên','0 hoặc 1','Giữ Q cũ'],['Có cạnh lên','0','0'],['Có cạnh lên','1','1']] },
    steps: ['Hỏi: có cần nhớ dữ liệu trước đó không?', 'Nếu không: lập bảng chân trị và thiết kế mạch tổ hợp.', 'Nếu có: xác định trạng thái, quy tắc cập nhật và đầu ra; thiết kế mạch tuần tự.', 'Tổng kết: hệ đếm biểu diễn dữ liệu; Boolean mô tả xử lý; cổng và transistor thực hiện xử lý; phần tử nhớ lưu trạng thái.'],
    takeaway: 'Bộ cộng 4 bit là tổ hợp; thanh ghi lưu kết quả của nó là tuần tự.',
  },
];
