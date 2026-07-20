// Bài tập chương 5 (ch5-eigen). Nội dung gốc do agent soạn.
import { createElement as h, Fragment } from 'react';
import type { Problem } from '../types';
import MathText from '../../components/MathText';

const m = (tex: string) => h(MathText, { tex });
const mb = (tex: string) => h(MathText, { tex, block: true });

export const problems: Problem[] = [
  // 1 — basic: eigenvalue qua phương trình đặc trưng
  {
    id: 'ch5-eval-1',
    chapterId: 'ch5-eigen',
    difficulty: 'basic',
    topic: 'Characteristic equation',
    statement: h(
      Fragment,
      null,
      'Tìm các eigenvalue của ',
      m('A=\\begin{bmatrix}2&1\\\\1&2\\end{bmatrix}'),
      ' bằng phương trình đặc trưng (characteristic equation).',
    ),
    steps: [
      {
        title: 'Lập định thức',
        content: h(
          Fragment,
          null,
          mb(
            '\\det(A-\\lambda I)=\\det\\begin{bmatrix}2-\\lambda&1\\\\1&2-\\lambda\\end{bmatrix}=(2-\\lambda)^2-1',
          ),
        ),
      },
      {
        title: 'Giải phương trình đặc trưng',
        content: h(
          Fragment,
          null,
          m('(2-\\lambda)^2-1=\\lambda^2-4\\lambda+3=(\\lambda-1)(\\lambda-3)=0'),
          '.',
        ),
      },
    ],
    answer: h(Fragment, null, m('\\lambda_1=1,\\quad \\lambda_2=3')),
  },

  // 2 — medium: eigenvalue + eigenvector (ma trận không đối xứng)
  {
    id: 'ch5-evec-1',
    chapterId: 'ch5-eigen',
    difficulty: 'medium',
    topic: 'Eigenvectors',
    statement: h(
      Fragment,
      null,
      'Cho ',
      m('A=\\begin{bmatrix}4&1\\\\2&3\\end{bmatrix}'),
      '. Tìm các eigenvalue và một eigenvector ứng với mỗi giá trị.',
    ),
    steps: [
      {
        title: 'Eigenvalue',
        content: h(
          Fragment,
          null,
          m('\\det(A-\\lambda I)=(4-\\lambda)(3-\\lambda)-2=\\lambda^2-7\\lambda+10=(\\lambda-2)(\\lambda-5)'),
          '. Vậy ',
          m('\\lambda=2,5'),
          '.',
        ),
      },
      {
        title: 'Eigenvector cho λ = 5',
        content: h(
          Fragment,
          null,
          m('A-5I=\\begin{bmatrix}-1&1\\\\2&-2\\end{bmatrix}'),
          ' cho ',
          m('-x+y=0\\Rightarrow y=x'),
          '. Chọn ',
          m('v=(1,1)'),
          '. Kiểm tra ',
          m('A(1,1)=(5,5)=5(1,1)'),
          ' ✓',
        ),
      },
      {
        title: 'Eigenvector cho λ = 2',
        content: h(
          Fragment,
          null,
          m('A-2I=\\begin{bmatrix}2&1\\\\2&1\\end{bmatrix}'),
          ' cho ',
          m('2x+y=0\\Rightarrow y=-2x'),
          '. Chọn ',
          m('v=(1,-2)'),
          '. Kiểm tra ',
          m('A(1,-2)=(2,-4)=2(1,-2)'),
          ' ✓',
        ),
      },
    ],
    answer: h(
      Fragment,
      null,
      m('\\lambda=5\\to(1,1)'),
      ', ',
      m('\\lambda=2\\to(1,-2)'),
      '.',
    ),
  },

  // 3 — medium: chéo hóa A = P D P^{-1}
  {
    id: 'ch5-diag-1',
    chapterId: 'ch5-eigen',
    difficulty: 'medium',
    topic: 'Diagonalization',
    statement: h(
      Fragment,
      null,
      'Chéo hóa (diagonalize) ',
      m('A=\\begin{bmatrix}2&1\\\\1&2\\end{bmatrix}'),
      ' dưới dạng ',
      m('A=PDP^{-1}'),
      '.',
    ),
    steps: [
      {
        title: 'Eigenvalue & eigenvector',
        content: h(
          Fragment,
          null,
          'Như đã biết ',
          m('\\lambda=1,3'),
          '. Với ',
          m('\\lambda=1'),
          ': ',
          m('A-I=\\begin{bmatrix}1&1\\\\1&1\\end{bmatrix}\\Rightarrow v=(1,-1)'),
          '. Với ',
          m('\\lambda=3'),
          ': ',
          m('A-3I=\\begin{bmatrix}-1&1\\\\1&-1\\end{bmatrix}\\Rightarrow v=(1,1)'),
          '.',
        ),
      },
      {
        title: 'Lập P và D',
        content: h(
          Fragment,
          null,
          'Xếp eigenvector thành cột của ',
          m('P'),
          ', eigenvalue tương ứng lên đường chéo ',
          m('D'),
          ':',
          mb(
            'P=\\begin{bmatrix}1&1\\\\-1&1\\end{bmatrix},\\quad D=\\begin{bmatrix}1&0\\\\0&3\\end{bmatrix}',
          ),
        ),
      },
      {
        title: 'Tính P^{-1}',
        content: h(
          Fragment,
          null,
          m('\\det P=2'),
          ' nên ',
          m('P^{-1}=\\tfrac12\\begin{bmatrix}1&-1\\\\1&1\\end{bmatrix}'),
          '.',
        ),
      },
      {
        title: 'Kiểm tra',
        content: h(
          Fragment,
          null,
          m(
            'PDP^{-1}=\\begin{bmatrix}1&3\\\\-1&3\\end{bmatrix}\\cdot\\tfrac12\\begin{bmatrix}1&-1\\\\1&1\\end{bmatrix}=\\tfrac12\\begin{bmatrix}4&2\\\\2&4\\end{bmatrix}=A',
          ),
          ' ✓',
        ),
      },
    ],
    answer: h(
      Fragment,
      null,
      m(
        'P=\\begin{bmatrix}1&1\\\\-1&1\\end{bmatrix},\\; D=\\begin{bmatrix}1&0\\\\0&3\\end{bmatrix},\\; P^{-1}=\\tfrac12\\begin{bmatrix}1&-1\\\\1&1\\end{bmatrix}',
      ),
    ),
  },

  // 4 — hard: A^n bằng chéo hóa
  {
    id: 'ch5-power-1',
    chapterId: 'ch5-eigen',
    difficulty: 'hard',
    topic: 'Matrix powers via diagonalization',
    statement: h(
      Fragment,
      null,
      'Dùng chéo hóa để tìm công thức ',
      m('A^n'),
      ' cho ',
      m('A=\\begin{bmatrix}2&1\\\\1&2\\end{bmatrix}'),
      '.',
    ),
    steps: [
      {
        title: 'Ý tưởng',
        content: h(
          Fragment,
          null,
          'Vì ',
          m('A=PDP^{-1}'),
          ' nên ',
          m('A^n=PD^nP^{-1}'),
          ', mà ',
          m('D^n=\\operatorname{diag}(1^n,\\,3^n)=\\operatorname{diag}(1,\\,3^n)'),
          '.',
        ),
      },
      {
        title: 'Nhân ra',
        content: h(
          Fragment,
          null,
          'Với ',
          m('P=\\begin{bmatrix}1&1\\\\-1&1\\end{bmatrix}'),
          ', ',
          m('P^{-1}=\\tfrac12\\begin{bmatrix}1&-1\\\\1&1\\end{bmatrix}'),
          ':',
          mb(
            'A^n=\\begin{bmatrix}1&1\\\\-1&1\\end{bmatrix}\\begin{bmatrix}1&0\\\\0&3^n\\end{bmatrix}\\tfrac12\\begin{bmatrix}1&-1\\\\1&1\\end{bmatrix}=\\frac12\\begin{bmatrix}3^n+1&3^n-1\\\\3^n-1&3^n+1\\end{bmatrix}',
          ),
        ),
      },
      {
        title: 'Kiểm tra với n = 1',
        content: h(
          Fragment,
          null,
          m('\\tfrac12\\begin{bmatrix}4&2\\\\2&4\\end{bmatrix}=\\begin{bmatrix}2&1\\\\1&2\\end{bmatrix}=A'),
          ' ✓',
        ),
      },
    ],
    answer: h(
      Fragment,
      null,
      m('A^n=\\dfrac12\\begin{bmatrix}3^n+1&3^n-1\\\\3^n-1&3^n+1\\end{bmatrix}'),
    ),
  },

  // 5 — hard: dãy truy hồi giải bằng eigenvalue
  {
    id: 'ch5-recur-1',
    chapterId: 'ch5-eigen',
    difficulty: 'hard',
    topic: 'Recurrence via eigenvalues',
    statement: h(
      Fragment,
      null,
      'Dãy số thỏa ',
      m('x_{n+1}=5x_n-6x_{n-1}'),
      ' với ',
      m('x_0=0,\\;x_1=1'),
      '. Tìm công thức đóng của ',
      m('x_n'),
      ' bằng eigenvalue.',
    ),
    steps: [
      {
        title: 'Viết dạng ma trận',
        content: h(
          Fragment,
          null,
          'Đặt ',
          m('\\mathbf{u}_n=\\begin{bmatrix}x_{n+1}\\\\x_n\\end{bmatrix}'),
          ', khi đó ',
          m('\\mathbf{u}_n=C\\mathbf{u}_{n-1}'),
          ' với ma trận companion ',
          m('C=\\begin{bmatrix}5&-6\\\\1&0\\end{bmatrix}'),
          '.',
        ),
      },
      {
        title: 'Eigenvalue của C',
        content: h(
          Fragment,
          null,
          m('\\det(C-\\lambda I)=\\lambda^2-5\\lambda+6=(\\lambda-2)(\\lambda-3)=0'),
          ', nên ',
          m('\\lambda=2,3'),
          '.',
        ),
      },
      {
        title: 'Nghiệm tổng quát',
        content: h(
          Fragment,
          null,
          'Vì hai eigenvalue phân biệt, ',
          m('x_n=A\\cdot 2^n+B\\cdot 3^n'),
          '.',
        ),
      },
      {
        title: 'Khớp điều kiện đầu',
        content: h(
          Fragment,
          null,
          mb('\\begin{cases}x_0=A+B=0\\\\ x_1=2A+3B=1\\end{cases}\\Rightarrow B=1,\\;A=-1.'),
        ),
      },
      {
        title: 'Kiểm tra',
        content: h(
          Fragment,
          null,
          m('x_2=3^2-2^2=5'),
          ' và ',
          m('5x_1-6x_0=5'),
          ' ✓; ',
          m('x_3=27-8=19'),
          ' và ',
          m('5\\cdot5-6\\cdot1=19'),
          ' ✓',
        ),
      },
    ],
    answer: h(Fragment, null, m('x_n=3^n-2^n')),
  },

  // 6 — exam: hệ động lực Markov, trạng thái dừng qua eigenvalue
  {
    id: 'ch5-exam-1',
    chapterId: 'ch5-eigen',
    difficulty: 'exam',
    topic: 'Dynamical system (Markov)',
    statement: h(
      Fragment,
      null,
      'Một hệ động lực rời rạc ',
      m('\\mathbf{s}_{k+1}=P\\mathbf{s}_k'),
      ' với ma trận chuyển (mỗi cột tổng bằng 1) ',
      m('P=\\begin{bmatrix}0.8&0.3\\\\0.2&0.7\\end{bmatrix}'),
      '. (a) Tìm các eigenvalue; (b) tìm trạng thái dừng (steady state) là vector xác suất; (c) giải thích hành vi dài hạn.',
    ),
    steps: [
      {
        title: '(a) Eigenvalue',
        content: h(
          Fragment,
          null,
          m('\\operatorname{tr}P=1.5,\\;\\det P=0.56-0.06=0.5'),
          ', nên ',
          m('\\lambda^2-1.5\\lambda+0.5=(\\lambda-1)(\\lambda-0.5)=0'),
          '. Vậy ',
          m('\\lambda_1=1,\\;\\lambda_2=0.5'),
          '. (Ma trận Markov luôn có ',
          m('\\lambda=1'),
          '.)',
        ),
      },
      {
        title: '(b) Eigenvector của λ = 1',
        content: h(
          Fragment,
          null,
          m('P-I=\\begin{bmatrix}-0.2&0.3\\\\0.2&-0.3\\end{bmatrix}\\Rightarrow -0.2x+0.3y=0\\Rightarrow x=\\tfrac32 y'),
          '. Chọn ',
          m('(3,2)'),
          ', chuẩn hóa để tổng bằng 1: ',
          m('\\mathbf{s}^*=(0.6,\\,0.4)'),
          '.',
        ),
      },
      {
        title: 'Kiểm tra',
        content: h(
          Fragment,
          null,
          m(
            'P\\begin{bmatrix}0.6\\\\0.4\\end{bmatrix}=\\begin{bmatrix}0.48+0.12\\\\0.12+0.28\\end{bmatrix}=\\begin{bmatrix}0.6\\\\0.4\\end{bmatrix}',
          ),
          ' ✓',
        ),
      },
      {
        title: '(c) Hành vi dài hạn',
        content: h(
          Fragment,
          null,
          'Thành phần theo ',
          m('\\lambda=0.5'),
          ' co lại như ',
          m('0.5^k\\to0'),
          ', còn thành phần theo ',
          m('\\lambda=1'),
          ' giữ nguyên. Do đó với mọi trạng thái đầu là vector xác suất, ',
          m('\\mathbf{s}_k\\to(0.6,0.4)'),
          '.',
        ),
      },
    ],
    answer: h(
      Fragment,
      null,
      m('\\lambda=1,\\,0.5'),
      '; trạng thái dừng ',
      m('\\mathbf{s}^*=(0.6,\\,0.4)'),
      '.',
    ),
  },
];
