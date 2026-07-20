// Bài tập chương 8 (ch8-orthogonality).
// File .ts nên KHÔNG dùng JSX; dựng ReactNode bằng createElement.
import { createElement as h, Fragment, type ReactNode } from 'react';
import type { Problem } from '../types';
import MathText from '../../components/MathText';

// Helper gọn: toán inline / block, đoạn văn, ghép mảnh.
const M = (tex: string): ReactNode => h(MathText, { tex });
const MB = (tex: string): ReactNode => h(MathText, { tex, block: true });
const P = (...kids: ReactNode[]): ReactNode => h('p', null, ...kids);
const F = (...kids: ReactNode[]): ReactNode => h(Fragment, null, ...kids);

export const problems: Problem[] = [
  // -------------------------------------------------------------------------
  {
    id: 'ortho-1',
    chapterId: 'ch8-orthogonality',
    difficulty: 'basic',
    topic: 'Trực giao',
    statement: P(
      'Cho ',
      M('u=(1,2,2)'),
      ' và ',
      M('v=(2,1,-2)'),
      '. (a) Hai vector có trực giao không? (b) Nếu có, hãy dựng một cặp orthonormal từ chúng.'
    ),
    steps: [
      {
        title: 'Tính tích vô hướng',
        content: P(
          M('u\\cdot v = 1\\cdot 2 + 2\\cdot 1 + 2\\cdot(-2) = 2+2-4 = 0'),
          ' — bằng 0 nên u ⟂ v (trực giao).'
        ),
      },
      {
        title: 'Tính độ dài',
        content: P(
          M('|u| = \\sqrt{1+4+4} = 3'),
          ' và ',
          M('|v| = \\sqrt{4+1+4} = 3'),
          '.'
        ),
      },
      {
        title: 'Chuẩn hóa để có orthonormal',
        content: P(
          'Chia mỗi vector cho độ dài của nó: ',
          M('q_1 = \\tfrac{1}{3}(1,2,2)'),
          ', ',
          M('q_2 = \\tfrac{1}{3}(2,1,-2)'),
          '. Chúng vẫn trực giao và giờ có độ dài 1, nên ',
          M('\\{q_1,q_2\\}'),
          ' là orthonormal.'
        ),
      },
    ],
    answer: P(
      'Có, u ⟂ v. Orthonormal: ',
      M('q_1 = (\\tfrac13,\\tfrac23,\\tfrac23)'),
      ', ',
      M('q_2 = (\\tfrac23,\\tfrac13,-\\tfrac23)'),
      '.'
    ),
  },

  // -------------------------------------------------------------------------
  {
    id: 'proj-1',
    chapterId: 'ch8-orthogonality',
    difficulty: 'basic',
    topic: 'Projection',
    statement: P(
      'Chiếu ',
      M('b=(3,4)'),
      ' lên đường thẳng span của ',
      M('a=(2,1)'),
      '. Tìm hình chiếu p và phần dư ',
      M('e=b-p'),
      ', rồi kiểm tra ',
      M('e\\perp a'),
      '.'
    ),
    steps: [
      {
        title: 'Công thức chiếu lên một đường',
        content: P(M('p = \\dfrac{b\\cdot a}{a\\cdot a}\\,a'), '.'),
      },
      {
        title: 'Tính các tích vô hướng',
        content: P(
          M('b\\cdot a = 3\\cdot 2 + 4\\cdot 1 = 10'),
          ', ',
          M('a\\cdot a = 4+1 = 5'),
          ', nên hệ số ',
          M('k = 10/5 = 2'),
          '.'
        ),
      },
      {
        title: 'Hình chiếu',
        content: P(M('p = 2\\,(2,1) = (4,2)'), '.'),
      },
      {
        title: 'Phần dư & kiểm tra vuông góc',
        content: P(
          M('e = b - p = (3,4)-(4,2) = (-1,2)'),
          ', và ',
          M('e\\cdot a = (-1)(2)+(2)(1) = 0'),
          ' ✓.'
        ),
      },
    ],
    answer: P(M('p=(4,2)'), ', ', M('e=(-1,2)'), ', và ', M('e\\perp a'), '.'),
  },

  // -------------------------------------------------------------------------
  {
    id: 'projmat-1',
    chapterId: 'ch8-orthogonality',
    difficulty: 'medium',
    topic: 'Ma trận chiếu',
    statement: P(
      'Dựng ma trận chiếu P lên đường span của ',
      M('a=(2,1)'),
      '. Kiểm tra ',
      M('P^2=P'),
      ' và ',
      M('P^\\top=P'),
      ', rồi dùng P để chiếu ',
      M('b=(3,4)'),
      '.'
    ),
    steps: [
      {
        title: 'Dựng a aᵀ và aᵀa',
        content: MB('a\\,a^\\top = \\begin{bmatrix}4 & 2\\\\2 & 1\\end{bmatrix}, \\qquad a^\\top a = 5.'),
      },
      {
        title: 'Ma trận chiếu',
        content: MB(
          'P = \\frac{a\\,a^\\top}{a^\\top a} = \\tfrac{1}{5}\\begin{bmatrix}4 & 2\\\\2 & 1\\end{bmatrix} = \\begin{bmatrix}0.8 & 0.4\\\\0.4 & 0.2\\end{bmatrix}.'
        ),
      },
      {
        title: 'Đối xứng & lũy đẳng',
        content: P(
          'P đối xứng vì ',
          M('a\\,a^\\top'),
          ' đối xứng. Còn ',
          M('P^2 = \\tfrac{1}{25}(a a^\\top)(a a^\\top) = \\tfrac{a^\\top a}{25}\\,a a^\\top = \\tfrac{1}{5}a a^\\top = P'),
          '.'
        ),
      },
      {
        title: 'Chiếu b',
        content: P(
          M('p = Pb = \\tfrac{1}{5}(4\\cdot 3 + 2\\cdot 4,\\ 2\\cdot 3 + 1\\cdot 4) = \\tfrac{1}{5}(20,10) = (4,2)'),
          '.'
        ),
      },
    ],
    answer: P(
      M('P=\\begin{bmatrix}0.8 & 0.4\\\\0.4 & 0.2\\end{bmatrix}'),
      '; thỏa ',
      M('P^2=P'),
      ' và ',
      M('P^\\top=P'),
      '; ',
      M('p=(4,2)'),
      '.'
    ),
  },

  // -------------------------------------------------------------------------
  {
    id: 'gram-schmidt-1',
    chapterId: 'ch8-orthogonality',
    difficulty: 'medium',
    topic: 'Gram–Schmidt',
    statement: P(
      'Áp dụng Gram–Schmidt cho ',
      M('v_1=(1,1,0)'),
      ' và ',
      M('v_2=(1,0,1)'),
      ' để thu được một cặp orthonormal ',
      M('q_1,q_2'),
      '.'
    ),
    steps: [
      {
        title: 'Chuẩn hóa v₁ thành q₁',
        content: P(M('\\|v_1\\| = \\sqrt{2}'), ', nên ', M('q_1 = \\tfrac{1}{\\sqrt2}(1,1,0)'), '.'),
      },
      {
        title: 'Bóng của v₂ trên q₁',
        content: P(
          M('v_2\\cdot q_1 = \\tfrac{1}{\\sqrt2}(1\\cdot 1 + 0\\cdot 1 + 1\\cdot 0) = \\tfrac{1}{\\sqrt2}'),
          ', bóng ',
          M('(v_2\\cdot q_1)q_1 = (\\tfrac12,\\tfrac12,0)'),
          '.'
        ),
      },
      {
        title: 'Trừ bóng để bẻ vuông',
        content: P(
          M('w_2 = v_2 - (\\tfrac12,\\tfrac12,0) = (\\tfrac12,-\\tfrac12,1)'),
          ', ',
          M('\\|w_2\\| = \\sqrt{\\tfrac14+\\tfrac14+1} = \\tfrac{\\sqrt6}{2}'),
          '.'
        ),
      },
      {
        title: 'Chuẩn hóa w₂ thành q₂',
        content: P(
          M('q_2 = \\tfrac{w_2}{\\|w_2\\|} = \\tfrac{1}{\\sqrt6}(1,-1,2)'),
          '. Kiểm tra ',
          M('q_1\\cdot q_2 = \\tfrac{1}{\\sqrt{12}}(1-1+0) = 0'),
          ' ✓.'
        ),
      },
    ],
    answer: P(
      M('q_1 = \\tfrac{1}{\\sqrt2}(1,1,0)'),
      ', ',
      M('q_2 = \\tfrac{1}{\\sqrt6}(1,-1,2)'),
      '.'
    ),
  },

  // -------------------------------------------------------------------------
  {
    id: 'qr-1',
    chapterId: 'ch8-orthogonality',
    difficulty: 'hard',
    topic: 'QR decomposition',
    statement: P(
      'Tìm phân tích QR của ',
      M('A = \\begin{bmatrix}1 & 2\\\\1 & 1\\end{bmatrix}'),
      ' (hai cột ',
      M('a_1=(1,1),\\ a_2=(2,1)'),
      ').'
    ),
    steps: [
      {
        title: 'Cột đầu: q₁ và r₁₁',
        content: P(
          M('r_{11} = \\|a_1\\| = \\sqrt2'),
          ', ',
          M('q_1 = \\tfrac{1}{\\sqrt2}(1,1)'),
          '.'
        ),
      },
      {
        title: 'Hệ số r₁₂',
        content: P(
          M('r_{12} = q_1\\cdot a_2 = \\tfrac{1}{\\sqrt2}(2+1) = \\tfrac{3}{\\sqrt2}'),
          '.'
        ),
      },
      {
        title: 'w₂, r₂₂ và q₂',
        content: P(
          M('w_2 = a_2 - r_{12}q_1 = (2,1)-(\\tfrac32,\\tfrac32) = (\\tfrac12,-\\tfrac12)'),
          ', ',
          M('r_{22} = \\|w_2\\| = \\tfrac{1}{\\sqrt2}'),
          ', ',
          M('q_2 = \\tfrac{1}{\\sqrt2}(1,-1)'),
          '.'
        ),
      },
      {
        title: 'Ghép Q, R và kiểm tra',
        content: F(
          MB(
            'Q = \\tfrac{1}{\\sqrt2}\\begin{bmatrix}1 & 1\\\\1 & -1\\end{bmatrix}, \\qquad R = \\begin{bmatrix}\\sqrt2 & \\tfrac{3}{\\sqrt2}\\\\0 & \\tfrac{1}{\\sqrt2}\\end{bmatrix}.'
          ),
          P(
            'Nhân lại: ',
            M('QR = \\begin{bmatrix}1 & 2\\\\1 & 1\\end{bmatrix} = A'),
            ' ✓, và R đúng là tam giác trên.'
          )
        ),
      },
    ],
    answer: P(
      M('Q = \\tfrac{1}{\\sqrt2}\\begin{bmatrix}1 & 1\\\\1 & -1\\end{bmatrix}'),
      ', ',
      M('R = \\begin{bmatrix}\\sqrt2 & 3/\\sqrt2\\\\0 & 1/\\sqrt2\\end{bmatrix}'),
      '.'
    ),
  },

  // -------------------------------------------------------------------------
  {
    id: 'least-squares-1',
    chapterId: 'ch8-orthogonality',
    difficulty: 'exam',
    topic: 'Least squares',
    statement: P(
      'Tìm đường thẳng ',
      M('y = b_0 + b_1 x'),
      ' khớp least squares với 4 điểm ',
      M('(-1,0),\\ (0,1),\\ (1,2),\\ (2,2)'),
      '. Viết normal equation, giải, rồi tính SSE.'
    ),
    steps: [
      {
        title: 'Ma trận thiết kế X và y',
        content: MB(
          'X = \\begin{bmatrix}1 & -1\\\\1 & 0\\\\1 & 1\\\\1 & 2\\end{bmatrix}, \\qquad y = \\begin{bmatrix}0\\\\1\\\\2\\\\2\\end{bmatrix}.'
        ),
      },
      {
        title: 'Dựng XᵀX và Xᵀy',
        content: F(
          P(
            'Với ',
            M('n=4,\\ \\textstyle\\sum x=2,\\ \\sum x^2=6,\\ \\sum y=5,\\ \\sum xy=6'),
            ':'
          ),
          MB(
            'X^\\top X = \\begin{bmatrix}4 & 2\\\\2 & 6\\end{bmatrix}, \\qquad X^\\top y = \\begin{bmatrix}5\\\\6\\end{bmatrix}.'
          )
        ),
      },
      {
        title: 'Giải normal equation',
        content: P(
          M('\\det(X^\\top X) = 24-4 = 20'),
          ', nên ',
          M('\\hat\\beta = \\tfrac{1}{20}\\begin{bmatrix}6 & -2\\\\-2 & 4\\end{bmatrix}\\begin{bmatrix}5\\\\6\\end{bmatrix} = \\tfrac{1}{20}\\begin{bmatrix}18\\\\14\\end{bmatrix} = \\begin{bmatrix}0.9\\\\0.7\\end{bmatrix}'),
          '.'
        ),
      },
      {
        title: 'Đường khớp & residual',
        content: P(
          'Đường ',
          M('y = 0.9 + 0.7x'),
          '. Residual tại 4 điểm lần lượt là ',
          M('-0.2,\\ 0.1,\\ 0.4,\\ -0.3'),
          ' (tổng residual = 0, đúng dấu hiệu của least squares có hệ số chặn).'
        ),
      },
      {
        title: 'Tổng bình phương sai số',
        content: P(
          M('\\text{SSE} = 0.2^2 + 0.1^2 + 0.4^2 + 0.3^2 = 0.04+0.01+0.16+0.09 = 0.30'),
          '.'
        ),
      },
    ],
    answer: P('Đường khớp ', M('y = 0.9 + 0.7x'), ', với ', M('\\text{SSE} = 0.30'), '.'),
  },
];
