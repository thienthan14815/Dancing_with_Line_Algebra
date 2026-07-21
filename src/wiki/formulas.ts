// Thư viện CÔNG THỨC cho tab "Công thức" trong MathWiki.
// Mỗi công thức: id, name (VN), en (EN), tex chính, intuition (trực giác),
// steps (dẫn xuất ngắn), example (ví dụ số cụ thể, đã kiểm bằng tay), skillId
// (nối sang skills.ts để hiện link "Học kỹ năng liên quan"), tags (search nội bộ).
//
// Lưu ý TeX: chuỗi viết trong string literal nên backslash phải nhân đôi
//   '\\dfrac' -> KaTeX nhận '\dfrac'; xuống dòng ma trận '\\\\' -> '\\'.
// Mọi ví dụ số đã được kiểm tra tay để KHỚP kết quả trước khi ghi.

export interface Formula {
  /** id ổn định, dùng cho key + trạng thái mở/đóng. */
  id: string;
  /** tên tiếng Việt. */
  name: string;
  /** tên tiếng Anh. */
  en: string;
  /** danh mục hiển thị (nhãn ngắn). */
  category: string;
  /** công thức chính, render bằng MathText. */
  tex: string;
  /** 1–2 câu trực giác. */
  intuition: string;
  /** 3–5 bước dẫn xuất ngắn gọn. */
  steps: string[];
  /** ví dụ số cụ thể (KaTeX block) + ghi chú tùy chọn. */
  example: { tex: string; note?: string };
  /** skill liên quan (phải tồn tại trong skills.ts). */
  skillId: string;
  /** từ khóa search nội bộ tab (không dấu vẫn khớp qua normalize). */
  tags: string[];
}

export const FORMULAS: Formula[] = [
  // ------------------------------------------------------------------
  // Vector & tích vô hướng
  // ------------------------------------------------------------------
  {
    id: 'distance',
    name: 'Khoảng cách Euclid',
    en: 'Euclidean distance',
    category: 'Vector',
    tex: 'd(a,b) = \\|a - b\\| = \\sqrt{\\sum_{i=1}^{n} (a_i - b_i)^2}',
    intuition:
      'Độ dài đoạn thẳng nối hai điểm — chính là chuẩn của vector hiệu a − b.',
    steps: [
      'Lấy hiệu từng chiều: aᵢ − bᵢ.',
      'Bình phương rồi cộng dồn tất cả các chiều.',
      'Lấy căn bậc hai (định lý Pythagoras mở rộng ra n chiều).',
    ],
    example: {
      tex: 'a=(1,2),\\ b=(4,6):\\quad d = \\sqrt{(-3)^2 + (-4)^2} = \\sqrt{25} = 5',
      note: 'Hiệu (−3, −4) → 9 + 16 = 25 → √25 = 5.',
    },
    skillId: 'dot_product',
    tags: ['khoang cach', 'distance', 'euclid', 'pythagoras', 'do dai'],
  },
  {
    id: 'norm',
    name: 'Chuẩn (độ dài) vector',
    en: 'Vector norm',
    category: 'Vector',
    tex: '\\|v\\| = \\sqrt{v_1^2 + v_2^2 + \\dots + v_n^2} = \\sqrt{v \\cdot v}',
    intuition:
      'Độ dài mũi tên từ gốc tới đầu vector — căn của tổng bình phương các thành phần.',
    steps: [
      'Bình phương từng thành phần vᵢ.',
      'Cộng lại (chính là tích vô hướng v·v).',
      'Lấy căn bậc hai.',
    ],
    example: {
      tex: 'v = (3, 4):\\quad \\|v\\| = \\sqrt{3^2 + 4^2} = \\sqrt{25} = 5',
      note: 'Chuẩn hóa: v̂ = v/‖v‖ = (0.6, 0.8) có độ dài 1.',
    },
    skillId: 'dot_product',
    tags: ['chuan', 'norm', 'do dai', 'magnitude', 'length'],
  },
  {
    id: 'dot-product',
    name: 'Tích vô hướng',
    en: 'Dot product',
    category: 'Vector',
    tex: 'u \\cdot v = \\sum_{i=1}^{n} u_i v_i = \\|u\\|\\,\\|v\\|\\cos\\theta',
    intuition:
      'Nhân từng cặp thành phần rồi cộng lại; đo mức "cùng hướng" của hai vector.',
    steps: [
      'Nhân từng cặp thành phần tương ứng uᵢ·vᵢ.',
      'Cộng dồn tất cả các tích.',
      'Kết quả là một con số (vô hướng), không phải vector.',
    ],
    example: {
      tex: 'u=(1,2,3),\\ v=(4,-5,6):\\quad u \\cdot v = 4 - 10 + 18 = 12',
      note: 'u·v = 0 ⇔ hai vector vuông góc.',
    },
    skillId: 'dot_product',
    tags: ['tich vo huong', 'dot', 'product', 'scalar'],
  },
  {
    id: 'cross-product',
    name: 'Tích có hướng (3D)',
    en: 'Cross product',
    category: 'Vector',
    tex: 'u \\times v = (u_2 v_3 - u_3 v_2,\\ u_3 v_1 - u_1 v_3,\\ u_1 v_2 - u_2 v_1)',
    intuition:
      'Trong không gian 3D, cho ra vector vuông góc với cả u và v; độ dài bằng diện tích hình bình hành.',
    steps: [
      'Thành phần x: u₂v₃ − u₃v₂.',
      'Thành phần y: u₃v₁ − u₁v₃.',
      'Thành phần z: u₁v₂ − u₂v₁ (nhớ quy tắc bàn tay phải).',
    ],
    example: {
      tex: '(1,0,0) \\times (0,1,0) = (0,\\, 0,\\, 1)',
      note: 'i × j = k: hai trục x, y sinh ra pháp tuyến theo trục z.',
    },
    skillId: 'cross_product',
    tags: ['tich co huong', 'cross', 'phap tuyen', 'normal'],
  },
  {
    id: 'cosine-angle',
    name: 'Góc giữa hai vector',
    en: 'Cosine / angle',
    category: 'Vector',
    tex: '\\cos\\theta = \\dfrac{u \\cdot v}{\\|u\\|\\,\\|v\\|}',
    intuition:
      'Chuẩn hóa tích vô hướng về khoảng [−1, 1] để đo độ giống hướng; θ nhỏ ⇒ cùng hướng.',
    steps: [
      'Tính tích vô hướng u·v.',
      'Tính hai độ dài ‖u‖ và ‖v‖.',
      'Chia rồi lấy arccos để ra góc θ.',
    ],
    example: {
      tex: 'u=(1,0),\\ v=(1,1):\\quad \\cos\\theta = \\dfrac{1}{1 \\cdot \\sqrt{2}} = \\dfrac{1}{\\sqrt{2}} \\Rightarrow \\theta = 45^\\circ',
    },
    skillId: 'dot_product',
    tags: ['goc', 'angle', 'cosine', 'cos', 'theta'],
  },
  {
    id: 'cauchy-schwarz',
    name: 'Bất đẳng thức Cauchy–Schwarz',
    en: 'Cauchy–Schwarz inequality',
    category: 'Vector',
    tex: '|u \\cdot v| \\le \\|u\\|\\,\\|v\\|',
    intuition:
      'Tích vô hướng không bao giờ vượt quá tích hai độ dài; dấu "=" chỉ khi u và v cùng phương.',
    steps: [
      'Từ cosθ = (u·v)/(‖u‖‖v‖) và luôn có |cosθ| ≤ 1.',
      'Nhân hai vế với ‖u‖‖v‖ ≥ 0.',
      'Suy ra |u·v| ≤ ‖u‖‖v‖.',
    ],
    example: {
      tex: 'u=(1,2),\\ v=(3,4):\\quad |u \\cdot v| = 11 \\le \\|u\\|\\,\\|v\\| = 5\\sqrt{5} \\approx 11.18',
    },
    skillId: 'dot_product',
    tags: ['cauchy', 'schwarz', 'bat dang thuc', 'inequality'],
  },
  {
    id: 'projection',
    name: 'Hình chiếu vector',
    en: 'Vector projection',
    category: 'Vector',
    tex: '\\text{proj}_{b}(a) = \\dfrac{a \\cdot b}{b \\cdot b}\\, b',
    intuition:
      'Cái bóng của a khi chiếu vuông góc lên đường thẳng chứa b; nền tảng của least squares.',
    steps: [
      'Tính hệ số vô hướng (a·b)/(b·b).',
      'Nhân hệ số đó với vector b.',
      'Kết quả là vector cùng phương b, gần a nhất.',
    ],
    example: {
      tex: 'a=(3,3),\\ b=(1,0):\\quad \\text{proj}_b(a) = \\dfrac{3}{1}(1,0) = (3, 0)',
    },
    skillId: 'projection',
    tags: ['hinh chieu', 'projection', 'proj', 'shadow'],
  },
  {
    id: 'gram-schmidt',
    name: 'Trực giao hóa Gram–Schmidt',
    en: 'Gram–Schmidt',
    category: 'Trực giao',
    tex: 'u_k = v_k - \\sum_{j=1}^{k-1} \\dfrac{v_k \\cdot u_j}{u_j \\cdot u_j}\\, u_j',
    intuition:
      'Trừ đi hình chiếu lên các vector đã trực giao trước đó để tách phần vuông góc còn lại.',
    steps: [
      'Giữ u₁ = v₁.',
      'Với mỗi vₖ, trừ hình chiếu của nó lên tất cả uⱼ đã có.',
      'Phần còn lại uₖ vuông góc với mọi uⱼ; chuẩn hóa nếu cần cơ sở trực chuẩn.',
    ],
    example: {
      tex: 'v_1=(1,0),\\ v_2=(1,1):\\quad u_2 = (1,1) - \\dfrac{1}{1}(1,0) = (0, 1)',
      note: 'u₂ = (0,1) vuông góc với u₁ = (1,0).',
    },
    skillId: 'gram_schmidt',
    tags: ['gram', 'schmidt', 'truc giao', 'orthogonal', 'orthonormal'],
  },

  // ------------------------------------------------------------------
  // Ma trận, định thức, nghịch đảo
  // ------------------------------------------------------------------
  {
    id: 'determinant',
    name: 'Định thức 2×2 & 3×3',
    en: 'Determinant',
    category: 'Ma trận',
    tex: '\\det\\!\\begin{pmatrix} a & b \\\\ c & d \\end{pmatrix} = ad - bc',
    intuition:
      'Con số đo mức phóng đại diện tích (2D) / thể tích (3D) của biến đổi; det = 0 nghĩa là bẹp chiều, không khả nghịch.',
    steps: [
      '2×2: ad − bc.',
      '3×3 khai triển theo hàng 1: a(ei − fh) − b(di − fg) + c(dh − eg).',
      'det = 0 ⇔ ma trận suy biến (cột phụ thuộc tuyến tính).',
    ],
    example: {
      tex: '\\det\\begin{pmatrix} 1 & 2 & 3 \\\\ 0 & 1 & 4 \\\\ 5 & 6 & 0 \\end{pmatrix} = 1(-24) - 2(-20) + 3(-5) = 1',
      note: '= −24 + 40 − 15 = 1.',
    },
    skillId: 'determinant',
    tags: ['dinh thuc', 'determinant', 'det', 'sarrus'],
  },
  {
    id: 'inverse-2x2',
    name: 'Nghịch đảo ma trận 2×2',
    en: 'Inverse of a 2×2 matrix',
    category: 'Ma trận',
    tex: '\\begin{pmatrix} a & b \\\\ c & d \\end{pmatrix}^{-1} = \\dfrac{1}{ad - bc}\\begin{pmatrix} d & -b \\\\ -c & a \\end{pmatrix}',
    intuition:
      'Đổi chỗ hai phần tử đường chéo chính, đổi dấu đường chéo phụ, rồi chia cho định thức.',
    steps: [
      'Tính det = ad − bc (phải khác 0).',
      'Hoán vị a ↔ d, đổi dấu b và c.',
      'Chia toàn bộ ma trận cho det.',
    ],
    example: {
      tex: '\\begin{pmatrix} 1 & 2 \\\\ 3 & 4 \\end{pmatrix}^{-1} = \\dfrac{1}{-2}\\begin{pmatrix} 4 & -2 \\\\ -3 & 1 \\end{pmatrix} = \\begin{pmatrix} -2 & 1 \\\\ 1.5 & -0.5 \\end{pmatrix}',
      note: 'det = 1·4 − 2·3 = −2; kiểm tra A·A⁻¹ = I.',
    },
    skillId: 'matrix_inverse',
    tags: ['nghich dao', 'inverse', 'inverse 2x2', 'kha nghich'],
  },
  {
    id: 'cramer',
    name: 'Quy tắc Cramer',
    en: "Cramer's rule",
    category: 'Ma trận',
    tex: 'x_i = \\dfrac{\\det(A_i)}{\\det(A)}',
    intuition:
      'Giải hệ Ax = b bằng định thức: Aᵢ là A với cột thứ i được thay bằng vector b.',
    steps: [
      'Tính det(A), yêu cầu khác 0 (hệ có nghiệm duy nhất).',
      'Lập Aᵢ bằng cách thay cột i của A bằng b.',
      'xᵢ = det(Aᵢ) / det(A).',
    ],
    example: {
      tex: '\\begin{cases} x + y = 3 \\\\ x - y = 1 \\end{cases}\\ \\Rightarrow\\ x = \\dfrac{-4}{-2} = 2,\\quad y = \\dfrac{-2}{-2} = 1',
      note: 'det A = −2; thay cột cho det A₁ = −4, det A₂ = −2.',
    },
    skillId: 'linear_system',
    tags: ['cramer', 'quy tac cramer', 'he phuong trinh', 'system'],
  },
  {
    id: 'rank-nullity',
    name: 'Định lý hạng – số khuyết',
    en: 'Rank–nullity theorem',
    category: 'Không gian',
    tex: '\\text{rank}(A) + \\dim N(A) = n',
    intuition:
      'Số chiều "giữ lại" (rank) cộng số chiều "bị ép về 0" (nullity) đúng bằng số cột đầu vào n.',
    steps: [
      'rank(A) = số cột trụ (pivot) sau khi khử Gauss.',
      'dim N(A) = số cột tự do (không trụ).',
      'Tổng hai số này luôn bằng số cột n.',
    ],
    example: {
      tex: 'A \\in \\mathbb{R}^{3\\times 3},\\ \\text{rank}(A) = 2\\ \\Rightarrow\\ \\dim N(A) = 3 - 2 = 1',
    },
    skillId: 'rank',
    tags: ['hang', 'rank', 'nullity', 'so khuyet', 'rank nullity'],
  },

  // ------------------------------------------------------------------
  // Trị riêng, chéo hóa, phổ
  // ------------------------------------------------------------------
  {
    id: 'char-poly',
    name: 'Đa thức đặc trưng',
    en: 'Characteristic polynomial',
    category: 'Eigen',
    tex: '\\det(A - \\lambda I) = 0',
    intuition:
      'Nghiệm của phương trình này chính là các trị riêng λ của A; bậc đa thức = kích thước ma trận.',
    steps: [
      'Lập ma trận A − λI.',
      'Tính định thức theo λ (được một đa thức bậc n).',
      'Giải đa thức = 0 để tìm các trị riêng.',
    ],
    example: {
      tex: 'A=\\begin{pmatrix}2&1\\\\1&2\\end{pmatrix}:\\ (2-\\lambda)^2 - 1 = \\lambda^2 - 4\\lambda + 3 = 0 \\Rightarrow \\lambda = 1,\\, 3',
    },
    skillId: 'characteristic_polynomial',
    tags: ['dac trung', 'characteristic', 'poly', 'tri rieng', 'eigenvalue'],
  },
  {
    id: 'diagonalization',
    name: 'Chéo hóa ma trận',
    en: 'Diagonalization',
    category: 'Eigen',
    tex: 'A = P D P^{-1}',
    intuition:
      'P chứa các vector riêng theo cột, D là ma trận chéo trị riêng; đọc là "đổi cơ sở → co giãn → đổi lại".',
    steps: [
      'Tìm các trị riêng λ và vector riêng tương ứng.',
      'Xếp các vector riêng thành cột của P.',
      'D = diag(λ₁, …, λₙ); khi đó A = PDP⁻¹.',
    ],
    example: {
      tex: 'A=\\begin{pmatrix}2&1\\\\1&2\\end{pmatrix}:\\ P=\\begin{pmatrix}1&1\\\\1&-1\\end{pmatrix},\\ D=\\begin{pmatrix}3&0\\\\0&1\\end{pmatrix}',
      note: 'Cột (1,1) ứng λ=3, cột (1,−1) ứng λ=1.',
    },
    skillId: 'diagonalization',
    tags: ['cheo hoa', 'diagonalization', 'pdp', 'eigen'],
  },
  {
    id: 'matrix-powers',
    name: 'Lũy thừa ma trận',
    en: 'Matrix powers',
    category: 'Eigen',
    tex: 'A^n = P D^n P^{-1}',
    intuition:
      'Đã chéo hóa thì lũy thừa cực nhanh: chỉ cần nâng các trị riêng trên đường chéo lên lũy thừa n.',
    steps: [
      'Chéo hóa A = PDP⁻¹.',
      'Dⁿ = diag(λ₁ⁿ, …, λₙⁿ) (chỉ mũ từng phần tử chéo).',
      'Aⁿ = P Dⁿ P⁻¹.',
    ],
    example: {
      tex: 'D=\\begin{pmatrix}3&0\\\\0&1\\end{pmatrix} \\Rightarrow D^5=\\begin{pmatrix}243&0\\\\0&1\\end{pmatrix}',
      note: '3⁵ = 243, 1⁵ = 1.',
    },
    skillId: 'matrix_powers',
    tags: ['luy thua', 'power', 'matrix power', 'fibonacci'],
  },
  {
    id: 'spectral',
    name: 'Định lý phổ (ma trận đối xứng)',
    en: 'Spectral theorem',
    category: 'Eigen',
    tex: 'A = Q \\Lambda Q^T \\quad (A = A^T)',
    intuition:
      'Ma trận đối xứng luôn chéo hóa được bằng một cơ sở TRỰC CHUẨN: Q trực giao (QᵀQ = I), Λ chứa trị riêng thực.',
    steps: [
      'A đối xứng ⇒ mọi trị riêng đều thực, vector riêng trực giao.',
      'Chuẩn hóa vector riêng thành các cột trực chuẩn của Q.',
      'A = QΛQᵀ với Λ = diag(λᵢ); vì Q trực giao nên Q⁻¹ = Qᵀ.',
    ],
    example: {
      tex: 'A=\\begin{pmatrix}2&1\\\\1&2\\end{pmatrix}:\\ Q=\\dfrac{1}{\\sqrt{2}}\\begin{pmatrix}1&1\\\\1&-1\\end{pmatrix},\\ \\Lambda=\\begin{pmatrix}3&0\\\\0&1\\end{pmatrix}',
    },
    skillId: 'spectral_theorem',
    tags: ['pho', 'spectral', 'doi xung', 'symmetric', 'truc giao'],
  },

  // ------------------------------------------------------------------
  // SVD & ứng dụng
  // ------------------------------------------------------------------
  {
    id: 'svd',
    name: 'Phân tích SVD',
    en: 'Singular value decomposition',
    category: 'SVD',
    tex: 'A = U \\Sigma V^T',
    intuition:
      'Mọi ma trận (kể cả không vuông) = xoay (Vᵀ) → co giãn theo trục (Σ) → xoay (U).',
    steps: [
      'Cột của V là vector riêng của AᵀA.',
      'σᵢ = √(trị riêng của AᵀA), xếp vào đường chéo Σ.',
      'Cột của U tính bằng uᵢ = A vᵢ / σᵢ.',
    ],
    example: {
      tex: 'A=\\begin{pmatrix}3&0\\\\0&-2\\end{pmatrix} \\Rightarrow \\Sigma=\\begin{pmatrix}3&0\\\\0&2\\end{pmatrix}',
      note: 'σ = √9 = 3 và √4 = 2 (luôn không âm).',
    },
    skillId: 'svd',
    tags: ['svd', 'singular', 'gia tri ky di', 'usv'],
  },
  {
    id: 'rank-k',
    name: 'Xấp xỉ hạng k',
    en: 'Rank-k approximation',
    category: 'SVD',
    tex: 'A_k = \\sum_{i=1}^{k} \\sigma_i\\, u_i v_i^T',
    intuition:
      'Giữ k giá trị kỳ dị lớn nhất cho xấp xỉ hạng k TỐT NHẤT (định lý Eckart–Young); nền tảng nén ảnh/dữ liệu.',
    steps: [
      'Viết A = Σ σᵢ uᵢ vᵢᵀ theo SVD (đủ hạng r).',
      'Bỏ các σ nhỏ, chỉ giữ k thành phần lớn nhất.',
      'Aₖ là ma trận hạng k gần A nhất theo chuẩn Frobenius.',
    ],
    example: {
      tex: '\\sigma = (10,\\, 6,\\, 1,\\, 0.2),\\ k=2:\\quad A_2 = \\sigma_1 u_1 v_1^T + \\sigma_2 u_2 v_2^T',
      note: 'Bỏ σ₃ = 1 và σ₄ = 0.2 vì đóng góp nhỏ.',
    },
    skillId: 'rank_k_approximation',
    tags: ['rank k', 'xap xi', 'nen anh', 'compression', 'eckart', 'low rank'],
  },
  {
    id: 'least-squares',
    name: 'Bình phương tối thiểu (phương trình chuẩn)',
    en: 'Least squares (normal equation)',
    category: 'SVD',
    tex: 'A^T A\\, \\hat{x} = A^T b \\quad\\Rightarrow\\quad \\hat{x} = (A^T A)^{-1} A^T b',
    intuition:
      'Khi Ax = b vô nghiệm, ta tìm x̂ khiến ‖Ax − b‖ nhỏ nhất — tức chiếu b lên không gian cột của A.',
    steps: [
      'Ax = b vô nghiệm vì b nằm ngoài không gian cột C(A).',
      'Nhân hai vế với Aᵀ → phương trình chuẩn AᵀAx̂ = Aᵀb.',
      'Giải ra x̂ (nghiệm khớp bình phương tối thiểu).',
    ],
    example: {
      tex: 'A^T A = \\begin{pmatrix}3&6\\\\6&14\\end{pmatrix},\\ A^T b = \\begin{pmatrix}8\\\\18\\end{pmatrix} \\Rightarrow \\hat{x} = \\begin{pmatrix}2/3\\\\1\\end{pmatrix}',
      note: 'Khớp đường y = 2/3 + x qua các điểm (1,2), (2,2), (3,4).',
    },
    skillId: 'least_squares',
    tags: ['binh phuong toi thieu', 'least squares', 'normal equation', 'hoi quy'],
  },

  // ------------------------------------------------------------------
  // Dạng toàn phương & Machine Learning
  // ------------------------------------------------------------------
  {
    id: 'quadratic-form',
    name: 'Dạng toàn phương',
    en: 'Quadratic form',
    category: 'Toàn phương',
    tex: 'Q(x) = x^T A x = \\sum_{i,j} a_{ij}\\, x_i x_j',
    intuition:
      'Hàm bậc hai của một vector; ma trận đối xứng A quyết định hình dạng (lòng chảo / đồi / yên ngựa) qua dấu các trị riêng.',
    steps: [
      'Tính vector Ax.',
      'Nhân xᵀ với (Ax) để ra một con số.',
      'Dấu của Q(x) phụ thuộc trị riêng của A (dương ⇒ lòng chảo).',
    ],
    example: {
      tex: 'A=\\begin{pmatrix}2&0\\\\0&3\\end{pmatrix}:\\ Q(x) = 2x_1^2 + 3x_2^2,\\quad Q(1,1) = 5',
    },
    skillId: 'quadratic_form',
    tags: ['toan phuong', 'quadratic form', 'xtax', 'definite'],
  },
  {
    id: 'gradient-descent',
    name: 'Cập nhật Gradient Descent',
    en: 'Gradient descent update',
    category: 'ML',
    tex: '\\theta_{t+1} = \\theta_t - \\eta\\, \\nabla_\\theta L(\\theta_t)',
    intuition:
      'Bước ngược hướng gradient để giảm hàm mất mát; η (learning rate) quyết định độ dài mỗi bước.',
    steps: [
      'Tính gradient ∇L tại tham số θ hiện tại.',
      'Bước ngược hướng gradient, độ dài tỉ lệ với η.',
      'Lặp lại đến khi hội tụ (gradient ≈ 0).',
    ],
    example: {
      tex: 'L(\\theta)=\\theta^2,\\ \\nabla L = 2\\theta,\\ \\eta = 0.1:\\quad \\theta_1 = 1 - 0.1(2) = 0.8',
    },
    skillId: 'gradient_descent',
    tags: ['gradient descent', 'ha gradient', 'learning rate', 'optimizer', 'gd'],
  },
  {
    id: 'mse',
    name: 'Sai số bình phương trung bình',
    en: 'Mean squared error',
    category: 'ML',
    tex: '\\text{MSE} = \\dfrac{1}{n}\\sum_{i=1}^{n} (y_i - \\hat{y}_i)^2',
    intuition:
      'Trung bình bình phương sai số giữa giá trị thật và dự đoán; phạt các lỗi lớn nặng hơn lỗi nhỏ.',
    steps: [
      'Lấy sai số từng điểm: yᵢ − ŷᵢ.',
      'Bình phương rồi cộng dồn.',
      'Chia cho số điểm n.',
    ],
    example: {
      tex: 'y=(1,2,3),\\ \\hat{y}=(1.5,2,4):\\quad \\text{MSE} = \\dfrac{0.25 + 0 + 1}{3} \\approx 0.417',
    },
    skillId: 'linear_regression_ml',
    tags: ['mse', 'mean squared error', 'ham mat mat', 'loss', 'sai so'],
  },
  {
    id: 'softmax',
    name: 'Hàm Softmax',
    en: 'Softmax',
    category: 'ML',
    tex: '\\text{softmax}(z)_i = \\dfrac{e^{z_i}}{\\sum_{j=1}^{K} e^{z_j}}',
    intuition:
      'Biến một vector điểm số thành phân phối xác suất: mọi giá trị dương và cộng lại bằng 1.',
    steps: [
      'Lũy thừa e^{zᵢ} cho từng thành phần.',
      'Cộng tất cả làm mẫu số chung.',
      'Chia từng phần tử → xác suất, tổng bằng 1.',
    ],
    example: {
      tex: '\\text{softmax}(1,2,3) \\approx (0.09,\\, 0.24,\\, 0.67)',
      note: 'e giá trị lớn nhất (z=3) chiếm xác suất cao nhất.',
    },
    skillId: 'softmax_regression',
    tags: ['softmax', 'xac suat', 'probability', 'phan loai', 'classification'],
  },
  {
    id: 'attention',
    name: 'Cơ chế Attention',
    en: 'Scaled dot-product attention',
    category: 'ML',
    tex: '\\text{Attention}(Q,K,V) = \\text{softmax}\\!\\left(\\dfrac{Q K^T}{\\sqrt{d_k}}\\right) V',
    intuition:
      'Tính trọng số theo độ tương đồng query–key (chia √dₖ để ổn định), rồi lấy tổ hợp có trọng số của các value V.',
    steps: [
      'Tính điểm tương đồng QKᵀ (dot product giữa query và key).',
      'Chia cho √dₖ rồi softmax → trọng số chú ý (tổng = 1).',
      'Nhân trọng số với V → vector đầu ra.',
    ],
    example: {
      tex: '\\dfrac{Q K^T}{\\sqrt{d_k}} = \\dfrac{(2, 4)}{\\sqrt{4}} = (1, 2) \\Rightarrow \\text{softmax} \\approx (0.27,\\, 0.73)',
    },
    skillId: 'attention',
    tags: ['attention', 'transformer', 'qkv', 'chu y', 'self attention'],
  },
];
