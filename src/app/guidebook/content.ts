// ---------------------------------------------------------------------------
// SỔ TAY (Guidebook) — nội dung tra cứu cho từng Section của khóa LinAlgLab.
//
// Đây là dữ liệu GỐC (tự viết, không chép sách), ngắn gọn & chính xác. Mỗi
// Section ↦ một GuideEntry. `id` khớp Section.id trong core/content/course.ts
// (vd 'ch1-vectors'), nhờ đó trang chi tiết tra cứu được theo :sectionId.
//
// LƯU Ý TeX: chuỗi `tex` nằm trong string literal nên backslash phải nhân đôi
//   '\\vec{v}'  -> KaTeX nhận '\vec{v}'
//   '\\\\'      -> KaTeX nhận '\\' (xuống dòng trong matrix/cases)
// ---------------------------------------------------------------------------

/** Ký hiệu kèm giải nghĩa ngắn. */
export interface GuideSymbol {
  /** TeX render bằng MathText (inline). */
  tex: string;
  /** Ý nghĩa 1 dòng. */
  desc: string;
}

/** Công thức chính kèm mô tả. */
export interface GuideFormula {
  /** TeX render bằng MathText (block). */
  tex: string;
  /** Công thức này nói gì / dùng khi nào. */
  desc: string;
}

/** Một mục sổ tay cho đúng một Section. */
export interface GuideEntry {
  /** = Section.id (chapterId), vd 'ch1-vectors'. */
  id: string;
  /** Tên tiếng Việt. */
  nameVi: string;
  /** Tên tiếng Anh. */
  nameEn: string;
  /** Khái niệm cốt lõi — vài ý gạch đầu dòng. */
  concepts: string[];
  /** Ký hiệu thường gặp. */
  symbols: GuideSymbol[];
  /** Công thức chính. */
  formulas: GuideFormula[];
  /** Trực giác hình học (1–2 câu). */
  intuition: string;
  /** Ví dụ ngắn: lời dẫn + (tuỳ chọn) TeX minh hoạ. */
  example: { text: string; tex?: string };
  /** Lỗi thường gặp. */
  pitfalls: string[];
  /** Ứng dụng thực tế. */
  applications: string[];
}

export const GUIDEBOOK: GuideEntry[] = [
  // ---------------------------------------------------------------- ch0
  {
    id: 'ch0-foundations',
    nameVi: 'Kiến thức nền',
    nameEn: 'Foundations',
    concepts: [
      'Hệ trục tọa độ định vị mỗi điểm bằng một bộ số; các trục vuông góc và độc lập.',
      'Hàm số gán mỗi đầu vào đúng một đầu ra; đồ thị là hình ảnh của hàm.',
      'Đường tròn đơn vị: sin và cos chính là tọa độ của điểm quay quanh gốc.',
      'Ký hiệu toán (∈, ∑, vector, ma trận) là ngôn ngữ nén thông tin cho các chương sau.',
    ],
    symbols: [
      { tex: '\\mathbb{R}^{n}', desc: 'Không gian n chiều các bộ số thực' },
      { tex: '(x,\\ y)', desc: 'Tọa độ một điểm trong mặt phẳng' },
      { tex: '\\sin\\theta,\\ \\cos\\theta', desc: 'Hàm lượng giác của góc θ' },
      { tex: '\\sum_{i=1}^{n} a_i', desc: 'Tổng các số hạng a_1..a_n' },
    ],
    formulas: [
      { tex: 'x = \\cos\\theta,\\quad y = \\sin\\theta', desc: 'Tọa độ điểm trên đường tròn đơn vị theo góc θ' },
      { tex: '\\sin^{2}\\theta + \\cos^{2}\\theta = 1', desc: 'Hệ thức lượng giác cơ bản (Pythagoras)' },
      { tex: 'd = \\sqrt{(x_2-x_1)^{2} + (y_2-y_1)^{2}}', desc: 'Khoảng cách giữa hai điểm' },
    ],
    intuition:
      'Mỗi điểm trong mặt phẳng là một mũi tên xuất phát từ gốc tọa độ; đường tròn đơn vị biến một góc thành cặp (cos, sin).',
    example: {
      text: 'Điểm ở góc 90° trên đường tròn đơn vị có tọa độ (cos 90°, sin 90°) = (0, 1).',
      tex: '(\\cos 90^{\\circ},\\ \\sin 90^{\\circ}) = (0,\\ 1)',
    },
    pitfalls: [
      'Nhầm thứ tự tọa độ (x, y) với (hàng, cột).',
      'Dùng lẫn lộn độ và radian khi tính sin/cos.',
      'Quên đồ thị hàm số phải qua kiểm tra “đường thẳng đứng”: mỗi x chỉ một y.',
    ],
    applications: [
      'Đặt nền cho vector và ma trận (mọi thứ về sau là bộ số có tọa độ).',
      'Đồ họa máy tính, bản đồ, định vị GPS.',
      'Mô tả dao động và sóng bằng sin/cos.',
    ],
  },

  // ---------------------------------------------------------------- ch1
  {
    id: 'ch1-vectors',
    nameVi: 'Vector',
    nameEn: 'Vectors',
    concepts: [
      'Vector là đại lượng có hướng và độ lớn, biểu diễn bằng một bộ số theo tọa độ.',
      'Cộng vector = nối đuôi nhau; nhân vô hướng = kéo dài, co lại hoặc đảo chiều.',
      'Tổ hợp tuyến tính và span: tập mọi điểm tạo được bằng cách cộng và co giãn.',
      'Dot product đo mức “cùng hướng”; cross product cho vector vuông góc (trong 3D).',
    ],
    symbols: [
      { tex: '\\vec{v},\\ \\mathbf{v}', desc: 'Ký hiệu một vector' },
      { tex: '\\lVert \\vec{v} \\rVert', desc: 'Độ dài (chuẩn) của vector' },
      { tex: '\\vec{u}\\cdot\\vec{v}', desc: 'Tích vô hướng — ra một số' },
      { tex: '\\vec{u}\\times\\vec{v}', desc: 'Tích có hướng — ra một vector (3D)' },
    ],
    formulas: [
      { tex: '\\vec{u}\\cdot\\vec{v} = \\sum_i u_i v_i = \\lVert\\vec{u}\\rVert\\,\\lVert\\vec{v}\\rVert\\cos\\theta', desc: 'Tích vô hướng: dạng tọa độ và dạng hình học' },
      { tex: '\\lVert \\vec{v} \\rVert = \\sqrt{v_1^{2} + v_2^{2} + \\dots + v_n^{2}}', desc: 'Độ dài vector' },
      { tex: '\\lVert \\vec{u}\\times\\vec{v} \\rVert = \\lVert\\vec{u}\\rVert\\,\\lVert\\vec{v}\\rVert\\sin\\theta', desc: 'Độ lớn tích có hướng = diện tích hình bình hành' },
    ],
    intuition:
      'Vector là một mũi tên. Cộng là nối đuôi hai mũi tên, nhân vô hướng là kéo dài mũi tên. Span của hai vector không cùng phương là cả một mặt phẳng.',
    example: {
      text: 'Với u = (1, 2) và v = (3, 0): u·v = 1·3 + 2·0 = 3.',
      tex: '(1,2)\\cdot(3,0) = 1\\cdot 3 + 2\\cdot 0 = 3',
    },
    pitfalls: [
      'Nhầm dot product (ra một số) với cross product (ra một vector).',
      'Cố cộng hai vector khác số chiều.',
      'Quên rằng dot product bằng 0 nghĩa là vuông góc, không phải “bằng nhau”.',
    ],
    applications: [
      'Vật lý: lực, vận tốc, gia tốc.',
      'Đồ họa và game: vị trí, hướng nhìn, độ sáng (dùng dot product).',
      'Machine learning: mỗi mẫu dữ liệu là một vector đặc trưng.',
    ],
  },

  // ---------------------------------------------------------------- ch2
  {
    id: 'ch2-systems',
    nameVi: 'Hệ phương trình tuyến tính',
    nameEn: 'Linear Systems',
    concepts: [
      'Hệ tuyến tính Ax = b là nhiều phương trình bậc nhất phải thỏa cùng lúc.',
      'Row picture: giao của các đường/mặt. Column picture: b là tổ hợp của các cột A.',
      'Khử Gauss dùng phép biến đổi hàng để đưa hệ về dạng bậc thang rồi giải ngược.',
      'Một hệ có đúng ba khả năng: nghiệm duy nhất, vô số nghiệm, hoặc vô nghiệm.',
    ],
    symbols: [
      { tex: 'A\\vec{x} = \\vec{b}', desc: 'Dạng ma trận của hệ phương trình' },
      { tex: '[\\,A \\mid \\vec{b}\\,]', desc: 'Ma trận bổ sung (augmented)' },
      { tex: '\\sim', desc: 'Tương đương hàng (row-equivalent)' },
    ],
    formulas: [
      { tex: 'A\\vec{x} = \\vec{b}', desc: 'Dạng tổng quát của mọi hệ tuyến tính' },
      { tex: '\\begin{cases} a_{11}x_1 + \\dots + a_{1n}x_n = b_1 \\\\ \\quad\\vdots \\\\ a_{m1}x_1 + \\dots + a_{mn}x_n = b_m \\end{cases}', desc: 'Hệ viết khai triển theo từng phương trình' },
      { tex: 'R_i \\leftarrow R_i - m\\,R_j', desc: 'Phép khử một hàng bằng bội của hàng khác' },
    ],
    intuition:
      'Mỗi phương trình là một đường thẳng (2D) hay mặt phẳng (3D); nghiệm là điểm giao chung. Nhìn theo cột: câu hỏi là b có nằm trong span các cột của A không.',
    example: {
      text: 'Từ x + y = 3 và x − y = 1, cộng lại được 2x = 4, suy ra x = 2, y = 1.',
      tex: '\\begin{cases} x + y = 3 \\\\ x - y = 1 \\end{cases} \\Rightarrow x = 2,\\ y = 1',
    },
    pitfalls: [
      'Quên áp phép biến đổi hàng lên cả cột b (nên dùng ma trận bổ sung).',
      'Chia cho một pivot bằng 0.',
      'Đọc sai hàng 0 = 0 (vô số nghiệm) và 0 = c ≠ 0 (vô nghiệm).',
    ],
    applications: [
      'Kỹ thuật: cân bằng mạch điện, cân bằng phản ứng hóa học.',
      'Kinh tế: mô hình cân bằng cung – cầu nhiều biến.',
      'Là nền cho hầu hết thuật toán tính toán số.',
    ],
  },

  // ---------------------------------------------------------------- ch3
  {
    id: 'ch3-matrices',
    nameVi: 'Ma trận',
    nameEn: 'Matrices',
    concepts: [
      'Ma trận là một bảng số và đồng thời là một biến đổi tuyến tính.',
      'Nhân ma trận = hợp hai biến đổi; thứ tự nhân có ý nghĩa.',
      'Định thức đo hệ số co giãn diện tích/thể tích và cho biết ma trận có khả nghịch không.',
      'Ma trận nghịch đảo “hoàn tác” lại biến đổi ban đầu.',
    ],
    symbols: [
      { tex: 'A \\in \\mathbb{R}^{m\\times n}', desc: 'Ma trận m hàng, n cột' },
      { tex: 'A^{T}', desc: 'Ma trận chuyển vị' },
      { tex: 'A^{-1}', desc: 'Ma trận nghịch đảo' },
      { tex: '\\det(A),\\ |A|', desc: 'Định thức của A' },
    ],
    formulas: [
      { tex: '(AB)_{ij} = \\sum_{k} a_{ik} b_{kj}', desc: 'Phần tử (i, j) của tích hai ma trận' },
      { tex: '\\det\\begin{pmatrix} a & b \\\\ c & d \\end{pmatrix} = ad - bc', desc: 'Định thức của ma trận 2×2' },
      { tex: 'A^{-1} = \\dfrac{1}{\\det A}\\begin{pmatrix} d & -b \\\\ -c & a \\end{pmatrix}', desc: 'Nghịch đảo ma trận 2×2 (khi det ≠ 0)' },
    ],
    intuition:
      'Ma trận nhận một vector và biến nó thành vector khác — xoay, co giãn hoặc phản chiếu. Các cột của ma trận cho biết những vector cơ sở đi về đâu.',
    example: {
      text: 'Ma trận xoay 90° đưa (1, 0) thành (0, 1).',
      tex: '\\begin{pmatrix} 0 & -1 \\\\ 1 & 0 \\end{pmatrix}\\begin{pmatrix} 1 \\\\ 0 \\end{pmatrix} = \\begin{pmatrix} 0 \\\\ 1 \\end{pmatrix}',
    },
    pitfalls: [
      'Tưởng AB = BA — nhân ma trận không giao hoán.',
      'Nhân sai kích thước: số cột của A phải bằng số hàng của B.',
      'Cho rằng mọi ma trận đều khả nghịch — det = 0 thì không có nghịch đảo.',
    ],
    applications: [
      'Đồ họa 3D: xoay, thu phóng, dịch chuyển vật thể.',
      'Xử lý ảnh: bộ lọc và các phép biến đổi.',
      'Mạng nơ-ron: mỗi lớp về bản chất là một phép nhân ma trận.',
    ],
  },

  // ---------------------------------------------------------------- ch4
  {
    id: 'ch4-spaces',
    nameVi: 'Không gian vector',
    nameEn: 'Vector Spaces',
    concepts: [
      'Subspace là tập con đóng với phép cộng và nhân vô hướng, luôn chứa vector 0.',
      'Column space là ảnh của ma trận; null space là tập nghiệm của Ax = 0.',
      'Độc lập tuyến tính: không vector nào là tổ hợp của các vector còn lại.',
      'Basis là bộ khung tối thiểu; số phần tử của nó là số chiều (dimension), rank là số chiều của column space.',
    ],
    symbols: [
      { tex: '\\operatorname{span}\\{\\vec{v}_1,\\dots,\\vec{v}_k\\}', desc: 'Không gian sinh bởi các vector' },
      { tex: '\\dim(V)', desc: 'Số chiều của không gian V' },
      { tex: '\\operatorname{rank}(A)', desc: 'Hạng của ma trận A' },
      { tex: '\\mathcal{N}(A),\\ C(A)', desc: 'Null space và column space của A' },
    ],
    formulas: [
      { tex: '\\operatorname{rank}(A) + \\dim \\mathcal{N}(A) = n', desc: 'Định lý rank – nullity (n = số cột)' },
      { tex: 'c_1\\vec{v}_1 + \\dots + c_k\\vec{v}_k = \\vec{0} \\Rightarrow c_i = 0', desc: 'Điều kiện độc lập tuyến tính' },
      { tex: '[\\vec{x}]_B = B^{-1}\\vec{x}', desc: 'Tọa độ của x trong cơ sở B (đổi cơ sở)' },
    ],
    intuition:
      'Một không gian con là một đường thẳng hoặc mặt phẳng đi qua gốc. Basis là số mũi tên ít nhất đủ để “với tới” mọi điểm trong không gian đó.',
    example: {
      text: 'Trong ℝ³, hai vector độc lập tuyến tính sinh ra một mặt phẳng, nên số chiều là 2.',
      tex: '\\dim \\operatorname{span}\\{\\vec{v}_1, \\vec{v}_2\\} = 2',
    },
    pitfalls: [
      'Quên subspace bắt buộc phải chứa vector 0.',
      'Nhầm “sinh ra không gian” (span) với “độc lập” — basis cần cả hai.',
      'Đếm sai rank khi ma trận chưa khử về bậc thang xong.',
    ],
    applications: [
      'Nén dữ liệu: tìm số chiều thực sự (ẩn) của dữ liệu.',
      'Giải hệ: null space mô tả toàn bộ tập nghiệm.',
      'Đồ họa: đổi cơ sở giữa các hệ tọa độ khác nhau.',
    ],
  },

  // ---------------------------------------------------------------- ch5
  {
    id: 'ch5-eigen',
    nameVi: 'Giá trị riêng & Vector riêng',
    nameEn: 'Eigenvalues & Eigenvectors',
    concepts: [
      'Eigenvector là hướng không đổi khi qua biến đổi, chỉ bị co giãn.',
      'Eigenvalue λ là hệ số co giãn theo hướng eigenvector đó.',
      'Phương trình đặc trưng det(A − λI) = 0 cho ra các giá trị riêng.',
      'Chéo hóa A = PDP⁻¹ giúp tính lũy thừa ma trận cực nhanh.',
    ],
    symbols: [
      { tex: 'A\\vec{v} = \\lambda\\vec{v}', desc: 'Quan hệ eigen cốt lõi' },
      { tex: '\\lambda', desc: 'Giá trị riêng (eigenvalue)' },
      { tex: 'I', desc: 'Ma trận đơn vị' },
      { tex: 'A = PDP^{-1}', desc: 'Chéo hóa: D là ma trận đường chéo các λ' },
    ],
    formulas: [
      { tex: 'A\\vec{v} = \\lambda\\vec{v},\\quad \\vec{v}\\neq\\vec{0}', desc: 'Định nghĩa eigenvalue – eigenvector' },
      { tex: '\\det(A - \\lambda I) = 0', desc: 'Phương trình đặc trưng để tìm λ' },
      { tex: 'A^{k} = P D^{k} P^{-1}', desc: 'Lũy thừa ma trận qua chéo hóa' },
    ],
    intuition:
      'Đa số vector bị đổi hướng khi qua một ma trận; eigenvector là những hướng đặc biệt chỉ bị kéo dài hoặc co lại mà không quay.',
    example: {
      text: 'Với A = diag(2, 3), vector (1, 0) là eigenvector ứng với λ = 2.',
      tex: '\\begin{pmatrix} 2 & 0 \\\\ 0 & 3 \\end{pmatrix}\\begin{pmatrix} 1 \\\\ 0 \\end{pmatrix} = 2\\begin{pmatrix} 1 \\\\ 0 \\end{pmatrix}',
    },
    pitfalls: [
      'Nhầm eigenvalue (một số) với eigenvector (một hướng).',
      'Quên eigenvector phải khác 0 (nhưng λ được phép bằng 0).',
      'Tưởng ma trận nào cũng chéo hóa được — không, nếu thiếu eigenvector độc lập.',
    ],
    applications: [
      'Thuật toán PageRank của Google (eigenvector của ma trận liên kết).',
      'Phân tích rung động và độ ổn định của hệ động lực.',
      'PCA và giảm chiều dữ liệu.',
    ],
  },

  // ---------------------------------------------------------------- ch6
  {
    id: 'ch6-svd',
    nameVi: 'Phân tích giá trị kỳ dị (SVD)',
    nameEn: 'Singular Value Decomposition',
    concepts: [
      'SVD phân tích MỌI ma trận thành ba bước: xoay – co giãn – xoay, A = UΣVᵀ.',
      'Các giá trị kỳ dị σ đo “độ mạnh” của từng hướng chính (luôn ≥ 0).',
      'SVD liên hệ chặt với eigen của AᵀA: các σ² chính là eigenvalue của AᵀA.',
      'Xấp xỉ rank-k giữ lại vài σ lớn nhất để nén dữ liệu.',
    ],
    symbols: [
      { tex: 'A = U\\Sigma V^{T}', desc: 'Phân tích SVD của ma trận A' },
      { tex: '\\sigma_i', desc: 'Giá trị kỳ dị thứ i (singular value)' },
      { tex: '\\Sigma', desc: 'Ma trận đường chéo chứa các σ' },
    ],
    formulas: [
      { tex: 'A = U\\Sigma V^{T}', desc: 'U, V trực chuẩn; Σ đường chéo các σ ≥ 0' },
      { tex: 'A^{T}A = V\\Sigma^{2}V^{T}', desc: 'Liên hệ SVD với eigen của AᵀA' },
      { tex: 'A_k = \\sum_{i=1}^{k} \\sigma_i\\,\\vec{u}_i \\vec{v}_i^{T}', desc: 'Xấp xỉ rank-k tốt nhất của A' },
    ],
    intuition:
      'Bất kỳ biến đổi tuyến tính nào cũng gồm: xoay không gian, kéo giãn theo các trục vuông góc, rồi xoay tiếp. Các σ lớn nhất giữ phần lớn nội dung của dữ liệu.',
    example: {
      text: 'Giữ lại k giá trị kỳ dị lớn nhất của một ảnh sẽ nén ảnh mà vẫn giữ được nét chính.',
      tex: 'A \\approx A_k = \\sum_{i=1}^{k} \\sigma_i \\vec{u}_i \\vec{v}_i^{T}',
    },
    pitfalls: [
      'Nhầm giá trị kỳ dị (luôn ≥ 0) với eigenvalue (có thể âm hoặc phức).',
      'Quên sắp xếp các σ theo thứ tự giảm dần.',
      'Nhầm vai trò của U và V, hoặc quên chuyển vị Vᵀ.',
    ],
    applications: [
      'Nén ảnh và khử nhiễu.',
      'Hệ gợi ý (Netflix, các nhân tố ẩn — latent factors).',
      'PCA và phân tích ngữ nghĩa văn bản (LSA).',
    ],
  },

  // ---------------------------------------------------------------- ch7
  {
    id: 'ch7-code',
    nameVi: 'Ứng dụng bằng code',
    nameEn: 'Applications in Code',
    concepts: [
      'Biến đổi hình học trong đồ họa được thực hiện bằng phép nhân ma trận.',
      'Least squares tìm đường/mặt khớp tốt nhất khi dữ liệu có nhiễu.',
      'Markov chain & PageRank: phân phối dừng chính là một eigenvector.',
      'Nén ảnh bằng SVD là ví dụ thực tế của xấp xỉ rank-k.',
    ],
    symbols: [
      { tex: '\\hat{\\vec{x}} = (A^{T}A)^{-1}A^{T}\\vec{b}', desc: 'Nghiệm bình phương tối thiểu' },
      { tex: 'P', desc: 'Ma trận chuyển trạng thái (Markov)' },
      { tex: '\\pi', desc: 'Phân phối dừng (stationary distribution)' },
    ],
    formulas: [
      { tex: '\\min_{\\vec{x}} \\lVert A\\vec{x} - \\vec{b} \\rVert^{2}', desc: 'Bài toán bình phương tối thiểu' },
      { tex: '\\hat{\\vec{x}} = (A^{T}A)^{-1}A^{T}\\vec{b}', desc: 'Phương trình chuẩn (normal equation)' },
      { tex: '\\pi P = \\pi,\\quad \\textstyle\\sum_i \\pi_i = 1', desc: 'Phân phối dừng của xích Markov / PageRank' },
    ],
    intuition:
      'Khi hệ không có nghiệm chính xác, least squares tìm điểm “gần nhất” bằng cách chiếu vuông góc b lên column space của A.',
    example: {
      text: 'Khớp đường thẳng y = ax + b qua một đám điểm nhiễu bằng phương trình chuẩn.',
      tex: '\\hat{\\vec{x}} = (A^{T}A)^{-1}A^{T}\\vec{b}',
    },
    pitfalls: [
      'Dùng least squares nhưng quên chuẩn hóa/cân tỷ lệ dữ liệu.',
      'Quên PageRank cần ma trận cột-ngẫu nhiên (mỗi cột cộng lại bằng 1).',
      'Đảo sai thứ tự nhân các ma trận biến đổi hình học.',
    ],
    applications: [
      'Đồ họa và game engine.',
      'Hồi quy và dự báo (least squares).',
      'Xếp hạng trang web và phân tích mạng xã hội (PageRank).',
    ],
  },

  // ---------------------------------------------------------------- ch8
  {
    id: 'ch8-orthogonality',
    nameVi: 'Trực giao & Bình phương tối thiểu',
    nameEn: 'Orthogonality & Least Squares',
    concepts: [
      'Trực giao nghĩa là dot product bằng 0; orthonormal là vừa vuông góc vừa có độ dài 1.',
      'Phép chiếu đưa một vector về điểm gần nhất nằm trong không gian con.',
      'Gram–Schmidt biến một cơ sở bất kỳ thành cơ sở trực chuẩn.',
      'Phân tích QR: A = QR, là nền cho least squares ổn định về số học.',
    ],
    symbols: [
      { tex: '\\vec{u}\\cdot\\vec{v} = 0', desc: 'Điều kiện hai vector trực giao' },
      { tex: '\\operatorname{proj}_{\\vec{u}}\\vec{v}', desc: 'Hình chiếu của v lên u' },
      { tex: 'Q^{T}Q = I', desc: 'Các cột của Q trực chuẩn' },
      { tex: 'A = QR', desc: 'Phân tích QR' },
    ],
    formulas: [
      { tex: '\\operatorname{proj}_{\\vec{u}}\\vec{v} = \\dfrac{\\vec{u}\\cdot\\vec{v}}{\\vec{u}\\cdot\\vec{u}}\\,\\vec{u}', desc: 'Hình chiếu của v lên đường thẳng theo u' },
      { tex: '\\vec{v}_k\' = \\vec{v}_k - \\sum_{i<k} \\operatorname{proj}_{\\vec{q}_i}\\vec{v}_k', desc: 'Một bước trực giao hóa Gram–Schmidt' },
      { tex: 'A = QR', desc: 'Q trực chuẩn, R tam giác trên' },
    ],
    intuition:
      'Chiếu một vector lên một đường thẳng hay mặt phẳng chính là tìm “cái bóng” vuông góc của nó — điểm gần nhất nằm trên không gian con đó.',
    example: {
      text: 'Chiếu v = (2, 2) lên trục x (u = (1, 0)) được (2, 0).',
      tex: '\\operatorname{proj}_{(1,0)}(2,2) = (2,\\ 0)',
    },
    pitfalls: [
      'Quên chuẩn hóa sau khi trực giao hóa — orthonormal cần độ dài bằng 1.',
      'Chia cho u·u = 0 (vector không).',
      'Nhầm chiếu lên một vector với chiếu lên không gian con nhiều chiều.',
    ],
    applications: [
      'Least squares ổn định về số học (dùng phân tích QR).',
      'Nén và khử nhiễu tín hiệu.',
      'Đồ họa: dựng hệ tọa độ trực chuẩn cho camera.',
    ],
  },

  // ---------------------------------------------------------------- ch9
  {
    id: 'ch9-quadratic',
    nameVi: 'Dạng toàn phương',
    nameEn: 'Quadratic Forms',
    concepts: [
      'Dạng toàn phương xᵀAx là một hàm bậc hai của nhiều biến.',
      'Định dấu (xác định dương/âm) quyết định điểm cực tiểu hay cực đại.',
      'Spectral theorem: ma trận đối xứng luôn chéo hóa được bằng cơ sở trực chuẩn.',
      'Đường và mặt bậc hai (ellipse, hyperbola) là tập mức của một dạng toàn phương.',
    ],
    symbols: [
      { tex: 'Q(\\vec{x}) = \\vec{x}^{T}A\\vec{x}', desc: 'Dạng toàn phương sinh bởi A' },
      { tex: 'A = A^{T}', desc: 'Ma trận đối xứng' },
      { tex: 'A = Q\\Lambda Q^{T}', desc: 'Phân tích phổ (spectral)' },
    ],
    formulas: [
      { tex: 'Q(\\vec{x}) = \\vec{x}^{T}A\\vec{x} = \\sum_{i,j} a_{ij}\\,x_i x_j', desc: 'Dạng toàn phương viết theo tọa độ' },
      { tex: 'A = Q\\Lambda Q^{T}', desc: 'Spectral theorem cho ma trận đối xứng' },
      { tex: '\\vec{x}^{T}A\\vec{x} > 0 \\quad \\forall\\, \\vec{x}\\neq \\vec{0}', desc: 'Điều kiện A xác định dương' },
    ],
    intuition:
      'Dạng toàn phương là một “cái bát” hoặc “yên ngựa” trong không gian: xác định dương nghĩa là bát mở lên, có đáy cực tiểu. Các eigenvalue cho biết độ cong theo từng trục chính.',
    example: {
      text: 'Q(x, y) = x² + y² xác định dương vì mọi eigenvalue đều bằng 1 > 0.',
      tex: 'Q(x,y) = x^{2} + y^{2} > 0',
    },
    pitfalls: [
      'Quên đưa A về dạng đối xứng trước khi xét định dấu.',
      'Nhầm dấu của một eigenvalue với định dấu — cần TẤT CẢ λ > 0.',
      'Lẫn xác định dương (> 0) với nửa xác định dương (≥ 0).',
    ],
    applications: [
      'Tối ưu hóa: điều kiện cực trị qua ma trận Hessian.',
      'Thống kê: ma trận hiệp phương sai và ellipse tin cậy.',
      'Cơ học: năng lượng và phân tích độ ổn định.',
    ],
  },
];

/** Tra cứu nhanh mục sổ tay theo Section id. */
export const GUIDE_BY_ID: Record<string, GuideEntry> = Object.fromEntries(
  GUIDEBOOK.map((g) => [g.id, g]),
);

/** Lấy một mục sổ tay (undefined nếu không có). */
export function getGuideEntry(id: string): GuideEntry | undefined {
  return GUIDE_BY_ID[id];
}
