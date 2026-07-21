/* ============================================================
   LỘ TRÌNH THEO MỤC TIÊU — dữ liệu thuần (không React/CSS).
   3 mục tiêu chuyên biệt: For AI/ML · For Graphics · For Data
   Science. "Chuẩn" KHÔNG nằm ở đây — nó giữ nguyên UI roadmap cũ.

   Mỗi bước trỏ tới MỘT bài học THẬT trong COURSE:
     micro-lesson id = `${chapterId}:${lessonId}:concept`
   (đúng định dạng buildUnit() sinh trong core/content/course.ts).
   → route học: #/learn/<microLessonId>. Mọi id ở dưới đã được đối
   chiếu với CHAPTER_SEED (registry.ts / course.ts) — xem goals.test.ts.
   ============================================================ */

export type GoalId = 'standard' | 'aiml' | 'graphics' | 'data';

export interface GoalStep {
  /** Chương chứa bài (khớp id trong course.ts). */
  chapterId: string;
  /** Bài trong chương (khớp id trong course.ts). */
  lessonId: string;
  /** Tên bước hiển thị. */
  title: string;
  /** Vì sao bước này quan trọng cho mục tiêu — 1 câu. */
  desc: string;
  /** Nhãn giai đoạn để gom nhóm các bước. */
  phase: string;
}

export interface GoalPath {
  id: Exclude<GoalId, 'standard'>;
  /** Nhãn chip. */
  label: string;
  /** Câu mô tả đích đến (1–2 câu). */
  lead: string;
  steps: GoalStep[];
  /** Ghi chú "ngoài phạm vi" (optional). */
  note?: string;
}

/** micro-lesson id (concept) tương ứng một bước — dùng cho #/learn/<id> + tra tiến độ. */
export function stepMicroLessonId(step: GoalStep): string {
  return `${step.chapterId}:${step.lessonId}:concept`;
}

export const GOAL_PATHS: GoalPath[] = [
  {
    id: 'aiml',
    label: 'For AI/ML',
    lead: 'Đi thẳng từ nền đại số tuyến tính tới mạng nơ-ron và Transformer: tensor → gradient → backprop → attention.',
    steps: [
      // Nền đại số
      {
        chapterId: 'ch1-vectors',
        lessonId: 'dot',
        title: 'Dot product',
        desc: 'Tích vô hướng là phép tính lõi bên trong mỗi neuron.',
        phase: 'Nền đại số',
      },
      {
        chapterId: 'ch3-matrices',
        lessonId: 'composition',
        title: 'Nhân ma trận = hợp biến đổi',
        desc: 'Một lớp mạng nơ-ron chính là một phép nhân ma trận.',
        phase: 'Nền đại số',
      },
      // Học máy
      {
        chapterId: 'ch10-ml',
        lessonId: 'tensor',
        title: 'Tensor',
        desc: 'Tensor là cấu trúc dữ liệu chứa mọi thứ trong deep learning.',
        phase: 'Học máy',
      },
      {
        chapterId: 'ch10-ml',
        lessonId: 'linear-regression',
        title: 'Hồi quy tuyến tính',
        desc: 'Mô hình học máy đầu tiên, dựng thẳng trên bình phương tối thiểu.',
        phase: 'Học máy',
      },
      {
        chapterId: 'ch10-ml',
        lessonId: 'gradient-descent',
        title: 'Gradient Descent',
        desc: 'Thuật toán tối ưu đưa mô hình đi xuống dốc theo gradient.',
        phase: 'Học máy',
      },
      {
        chapterId: 'ch10-ml',
        lessonId: 'softmax',
        title: 'Softmax & phân loại',
        desc: 'Biến điểm số thô thành xác suất cho bài toán phân loại.',
        phase: 'Học máy',
      },
      // Mạng nơ-ron
      {
        chapterId: 'ch11-neural-nets',
        lessonId: 'neuron',
        title: 'Neuron',
        desc: 'Neuron = dot product cộng bias rồi qua hàm kích hoạt.',
        phase: 'Mạng nơ-ron',
      },
      {
        chapterId: 'ch11-neural-nets',
        lessonId: 'forward',
        title: 'Lan truyền xuôi',
        desc: 'Forward pass đẩy dữ liệu qua từng lớp để cho ra dự đoán.',
        phase: 'Mạng nơ-ron',
      },
      {
        chapterId: 'ch11-neural-nets',
        lessonId: 'backprop',
        title: 'Lan truyền ngược',
        desc: 'Backprop dùng chain rule để tính gradient và cập nhật trọng số.',
        phase: 'Mạng nơ-ron',
      },
      // Học sâu hiện đại
      {
        chapterId: 'ch12-modern-dl',
        lessonId: 'attention',
        title: 'Attention & Transformer',
        desc: 'Attention QKᵀ/√d là trái tim của Transformer và các LLM.',
        phase: 'Học sâu hiện đại',
      },
      {
        chapterId: 'ch13-optimization-apps',
        lessonId: 'optimizers',
        title: 'SGD, Momentum, Adam',
        desc: 'Các bộ tối ưu hiện đại giúp huấn luyện nhanh và ổn định.',
        phase: 'Học sâu hiện đại',
      },
    ],
  },

  {
    id: 'graphics',
    label: 'For Graphics',
    lead: 'Toán cho đồ họa & game: hệ tọa độ, ma trận biến đổi, đổi cơ sở và phép chiếu 3D → 2D.',
    steps: [
      // Toạ độ & vector
      {
        chapterId: 'ch0-foundations',
        lessonId: 'coordinates',
        title: 'Hệ tọa độ 2D & 3D',
        desc: 'Mọi hình ảnh đều sống trong một hệ tọa độ 2D/3D.',
        phase: 'Toạ độ & vector',
      },
      {
        chapterId: 'ch1-vectors',
        lessonId: 'addition',
        title: 'Cộng & trừ vector',
        desc: 'Điểm, hướng và phép tịnh tiến đều biểu diễn bằng vector.',
        phase: 'Toạ độ & vector',
      },
      // Biến đổi
      {
        chapterId: 'ch3-matrices',
        lessonId: 'transform',
        title: 'Ma trận = biến đổi',
        desc: 'Ma trận xoay, co giãn và phản chiếu hình — lõi của đồ họa.',
        phase: 'Biến đổi',
      },
      {
        chapterId: 'ch3-matrices',
        lessonId: 'composition',
        title: 'Hợp biến đổi',
        desc: 'Gộp nhiều phép biến đổi thành một phép nhân ma trận duy nhất.',
        phase: 'Biến đổi',
      },
      {
        chapterId: 'ch3-matrices',
        lessonId: 'determinant',
        title: 'Determinant',
        desc: 'Định thức cho biết diện tích/thể tích bị co giãn bao nhiêu lần.',
        phase: 'Biến đổi',
      },
      // Không gian & chiếu
      {
        chapterId: 'ch4-spaces',
        lessonId: 'change-basis',
        title: 'Đổi cơ sở',
        desc: 'Chuyển qua lại giữa hệ tọa độ thế giới, camera và vật thể.',
        phase: 'Không gian & chiếu',
      },
      {
        chapterId: 'ch8-orthogonality',
        lessonId: 'orthonormal',
        title: 'Cơ sở trực chuẩn',
        desc: 'Cơ sở trực chuẩn giữ nguyên góc và khoảng cách khi quay.',
        phase: 'Không gian & chiếu',
      },
      {
        chapterId: 'ch8-orthogonality',
        lessonId: 'projection',
        title: 'Phép chiếu',
        desc: 'Chiếu cảnh 3D xuống mặt phẳng 2D — bản chất của render.',
        phase: 'Không gian & chiếu',
      },
      // Ứng dụng
      {
        chapterId: 'ch7-code',
        lessonId: 'graphics',
        title: 'Đồ họa bằng code',
        desc: 'Dựng và animate hình bằng ma trận biến đổi trong code.',
        phase: 'Ứng dụng',
      },
    ],
    note: 'Quaternion (quay 3D mượt, tránh gimbal lock) nằm ngoài phạm vi khóa này — nên tìm hiểu thêm sau khi đã vững phần đổi cơ sở & phép quay trực giao.',
  },

  {
    id: 'data',
    label: 'For Data Science',
    lead: 'Toán cho khoa học dữ liệu: bình phương tối thiểu, hồi quy, SVD và PCA để hiểu và nén dữ liệu.',
    steps: [
      // Nền đại số
      {
        chapterId: 'ch1-vectors',
        lessonId: 'dot',
        title: 'Dot product',
        desc: 'Tích vô hướng đo mức tương quan giữa hai vector dữ liệu.',
        phase: 'Nền đại số',
      },
      {
        chapterId: 'ch4-spaces',
        lessonId: 'rank',
        title: 'Rank',
        desc: 'Rank tiết lộ dữ liệu thực sự có bao nhiêu chiều độc lập.',
        phase: 'Nền đại số',
      },
      // Hồi quy & bình phương tối thiểu
      {
        chapterId: 'ch8-orthogonality',
        lessonId: 'projection',
        title: 'Phép chiếu',
        desc: 'Hồi quy chính là chiếu vector mục tiêu lên không gian cột.',
        phase: 'Hồi quy & bình phương tối thiểu',
      },
      {
        chapterId: 'ch8-orthogonality',
        lessonId: 'least-squares',
        title: 'Least squares & Normal equation',
        desc: 'Nghiệm AᵀAx̂=Aᵀb cho đường khớp dữ liệu tốt nhất.',
        phase: 'Hồi quy & bình phương tối thiểu',
      },
      {
        chapterId: 'ch10-ml',
        lessonId: 'linear-regression',
        title: 'Hồi quy tuyến tính',
        desc: 'Đưa bình phương tối thiểu thành mô hình dự đoán trên dữ liệu mới.',
        phase: 'Hồi quy & bình phương tối thiểu',
      },
      // Giảm chiều
      {
        chapterId: 'ch5-eigen',
        lessonId: 'discover',
        title: 'Eigenvector',
        desc: 'Trục chính của dữ liệu là eigenvector của ma trận hiệp phương sai.',
        phase: 'Giảm chiều',
      },
      {
        chapterId: 'ch6-svd',
        lessonId: 'rotate-stretch',
        title: 'SVD',
        desc: 'SVD A=UΣVᵀ phân rã mọi ma trận dữ liệu thành xoay–giãn–xoay.',
        phase: 'Giảm chiều',
      },
      {
        chapterId: 'ch6-svd',
        lessonId: 'pca',
        title: 'PCA',
        desc: 'PCA giảm chiều, giữ lại các hướng biến thiên lớn nhất.',
        phase: 'Giảm chiều',
      },
      {
        chapterId: 'ch6-svd',
        lessonId: 'compression',
        title: 'Nén rank-k',
        desc: 'Xấp xỉ rank-k nén dữ liệu bằng vài giá trị kỳ dị đầu tiên.',
        phase: 'Giảm chiều',
      },
      // Ứng dụng
      {
        chapterId: 'ch7-code',
        lessonId: 'pagerank',
        title: 'Markov chain & PageRank',
        desc: 'Eigenvector ứng dụng thực tế: xếp hạng nút trong mạng dữ liệu.',
        phase: 'Ứng dụng',
      },
    ],
  },
];
