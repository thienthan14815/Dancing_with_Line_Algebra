// Bài tập chương 2 (ch2-systems). Nội dung gốc, tự soạn.
import { createElement as h, Fragment, type ReactNode } from 'react';
import type { Problem } from '../types';
import MathText from '../../components/MathText';

const m = (tex: string): ReactNode => h(MathText, { tex });
const mb = (tex: string): ReactNode => h(MathText, { tex, block: true });
const f = (...kids: ReactNode[]): ReactNode => h(Fragment, null, ...kids);

export const problems: Problem[] = [
  {
    id: 'gauss-2x2',
    chapterId: 'ch2-systems',
    difficulty: 'basic',
    topic: 'Khử Gauss 2×2',
    statement: f(
      'Giải hệ sau bằng phép khử Gauss (viết các bước biến đổi hàng):',
      mb('\\begin{cases} x+2y=5 \\\\ 3x-y=1 \\end{cases}'),
    ),
    steps: [
      {
        title: 'Ma trận bổ sung',
        content: mb('\\left[\\begin{array}{cc|c} 1 & 2 & 5 \\\\ 3 & -1 & 1 \\end{array}\\right]'),
      },
      {
        title: 'Khử phần tử dưới pivot',
        content: f(
          'Lấy ',
          m('R_2 \\to R_2 - 3R_1'),
          ':',
          mb('\\left[\\begin{array}{cc|c} 1 & 2 & 5 \\\\ 0 & -7 & -14 \\end{array}\\right]'),
        ),
      },
      {
        title: 'Thế ngược',
        content: f(
          'Hàng 2: ',
          m('-7y=-14 \\Rightarrow y=2'),
          '. Hàng 1: ',
          m('x+2(2)=5 \\Rightarrow x=1'),
          '.',
        ),
      },
    ],
    answer: f(m('(x,y)=(1,2)'), '.'),
  },
  {
    id: 'gauss-3x3',
    chapterId: 'ch2-systems',
    difficulty: 'medium',
    topic: 'Khử Gauss 3×3 – nghiệm duy nhất',
    statement: f(
      'Giải hệ bằng phép khử Gauss:',
      mb('\\begin{cases} x+y+z=6 \\\\ 2x-y+z=3 \\\\ x+2y-z=2 \\end{cases}'),
    ),
    steps: [
      {
        title: 'Ma trận bổ sung',
        content: mb(
          '\\left[\\begin{array}{ccc|c} 1&1&1&6 \\\\ 2&-1&1&3 \\\\ 1&2&-1&2 \\end{array}\\right]',
        ),
      },
      {
        title: 'Khử cột 1',
        content: f(
          m('R_2\\to R_2-2R_1'),
          ', ',
          m('R_3\\to R_3-R_1'),
          ':',
          mb('\\left[\\begin{array}{ccc|c} 1&1&1&6 \\\\ 0&-3&-1&-9 \\\\ 0&1&-2&-4 \\end{array}\\right]'),
        ),
      },
      {
        title: 'Đưa về dạng bậc thang',
        content: f(
          'Đổi chỗ ',
          m('R_2\\leftrightarrow R_3'),
          ', rồi ',
          m('R_3\\to R_3+3R_2'),
          ':',
          mb('\\left[\\begin{array}{ccc|c} 1&1&1&6 \\\\ 0&1&-2&-4 \\\\ 0&0&-7&-21 \\end{array}\\right]'),
        ),
      },
      {
        title: 'Thế ngược',
        content: f(
          'Hàng 3: ',
          m('-7z=-21\\Rightarrow z=3'),
          '. Hàng 2: ',
          m('y-2(3)=-4\\Rightarrow y=2'),
          '. Hàng 1: ',
          m('x+2+3=6\\Rightarrow x=1'),
          '.',
        ),
      },
    ],
    answer: f(m('(x,y,z)=(1,2,3)'), '.'),
  },
  {
    id: 'infinite-general',
    chapterId: 'ch2-systems',
    difficulty: 'hard',
    topic: 'Vô số nghiệm – nghiệm tổng quát',
    statement: f(
      'Giải và biện luận hệ sau; nếu có vô số nghiệm, viết nghiệm tổng quát theo tham số:',
      mb('\\begin{cases} x+y+2z=4 \\\\ 2x+3y+4z=9 \\\\ 3x+4y+6z=13 \\end{cases}'),
    ),
    steps: [
      {
        title: 'Ma trận bổ sung',
        content: mb(
          '\\left[\\begin{array}{ccc|c} 1&1&2&4 \\\\ 2&3&4&9 \\\\ 3&4&6&13 \\end{array}\\right]',
        ),
      },
      {
        title: 'Khử cột 1',
        content: f(
          m('R_2\\to R_2-2R_1'),
          ', ',
          m('R_3\\to R_3-3R_1'),
          ':',
          mb('\\left[\\begin{array}{ccc|c} 1&1&2&4 \\\\ 0&1&0&1 \\\\ 0&1&0&1 \\end{array}\\right]'),
        ),
      },
      {
        title: 'Khử cột 2',
        content: f(
          m('R_3\\to R_3-R_2'),
          ' cho hàng toàn 0:',
          mb('\\left[\\begin{array}{ccc|c} 1&1&2&4 \\\\ 0&1&0&1 \\\\ 0&0&0&0 \\end{array}\\right]'),
          'Hàng cuối ',
          m('0=0'),
          ' luôn đúng, nên hệ có vô số nghiệm (hạng ',
          m('=2<3'),
          ' ẩn).',
        ),
      },
      {
        title: 'Chọn tham số',
        content: f(
          'Biến ',
          m('z'),
          ' tự do; đặt ',
          m('z=t'),
          '. Từ hàng 2: ',
          m('y=1'),
          '. Từ hàng 1: ',
          m('x=4-y-2z=4-1-2t=3-2t'),
          '.',
        ),
      },
      {
        title: 'Nghiệm tổng quát',
        content: mb(
          '(x,y,z)=(3-2t,\\ 1,\\ t)=(3,1,0)+t(-2,0,1),\\quad t\\in\\mathbb{R}',
        ),
      },
    ],
    answer: f(
      'Vô số nghiệm: ',
      m('(x,y,z)=(3-2t,\\,1,\\,t),\\ t\\in\\mathbb{R}'),
      '.',
    ),
  },
  {
    id: 'no-solution',
    chapterId: 'ch2-systems',
    difficulty: 'medium',
    topic: 'Phân loại nghiệm – vô nghiệm',
    statement: f(
      'Giải và biện luận hệ:',
      mb('\\begin{cases} x+y+z=2 \\\\ 2x+3y+z=3 \\\\ 3x+4y+2z=8 \\end{cases}'),
    ),
    steps: [
      {
        title: 'Ma trận bổ sung',
        content: mb(
          '\\left[\\begin{array}{ccc|c} 1&1&1&2 \\\\ 2&3&1&3 \\\\ 3&4&2&8 \\end{array}\\right]',
        ),
      },
      {
        title: 'Khử cột 1',
        content: f(
          m('R_2\\to R_2-2R_1'),
          ', ',
          m('R_3\\to R_3-3R_1'),
          ':',
          mb('\\left[\\begin{array}{ccc|c} 1&1&1&2 \\\\ 0&1&-1&-1 \\\\ 0&1&-1&2 \\end{array}\\right]'),
        ),
      },
      {
        title: 'Khử cột 2',
        content: f(
          m('R_3\\to R_3-R_2'),
          ':',
          mb('\\left[\\begin{array}{ccc|c} 1&1&1&2 \\\\ 0&1&-1&-1 \\\\ 0&0&0&3 \\end{array}\\right]'),
        ),
      },
      {
        title: 'Kết luận',
        content: f(
          'Hàng cuối tương ứng ',
          m('0x+0y+0z=3'),
          ', tức ',
          m('0=3'),
          ', vô lý. Vậy hệ vô nghiệm.',
        ),
      },
    ],
    answer: 'Hệ vô nghiệm (không tương thích).',
  },
  {
    id: 'column-space',
    chapterId: 'ch2-systems',
    difficulty: 'medium',
    topic: 'b có thuộc column space?',
    statement: f(
      'Cho ',
      m('A=\\begin{bmatrix}1&2\\\\2&1\\\\3&3\\end{bmatrix}'),
      ' với các cột ',
      m('\\mathbf{c}_1=(1,2,3)'),
      ', ',
      m('\\mathbf{c}_2=(2,1,3)'),
      '. Column space của ',
      m('A'),
      ' là ',
      m('\\operatorname{span}\\{\\mathbf{c}_1,\\mathbf{c}_2\\}'),
      '. Hỏi mỗi vector sau có thuộc column space không: (a) ',
      m('\\mathbf{b}_1=(4,5,9)'),
      '; (b) ',
      m('\\mathbf{b}_2=(1,1,1)'),
      '.',
    ),
    steps: [
      {
        title: 'Điều kiện thuộc column space',
        content: f(
          m('\\mathbf{b}\\in\\operatorname{Col}(A)'),
          ' khi tồn tại ',
          m('x,y'),
          ' sao cho ',
          m('x\\mathbf{c}_1+y\\mathbf{c}_2=\\mathbf{b}'),
          ', tức hệ ',
          m('A\\mathbf{x}=\\mathbf{b}'),
          ' có nghiệm.',
        ),
      },
      {
        title: '(a) b₁ = (4,5,9)',
        content: f(
          'Hệ:',
          mb('\\begin{cases} x+2y=4 \\\\ 2x+y=5 \\\\ 3x+3y=9 \\end{cases}'),
          'Lấy hai phương trình đầu trừ nhau: ',
          m('(x+2y)-(2x+y)=4-5\\Rightarrow -x+y=-1'),
          '. Cộng với ',
          m('x+2y=4'),
          ' được ',
          m('3y=3\\Rightarrow y=1'),
          ', rồi ',
          m('x=2'),
          '. Kiểm tra phương trình 3: ',
          m('3(2)+3(1)=9'),
          ' ✓. Vậy ',
          m('\\mathbf{b}_1=2\\mathbf{c}_1+\\mathbf{c}_2\\in\\operatorname{Col}(A)'),
          '.',
        ),
      },
      {
        title: '(b) b₂ = (1,1,1)',
        content: f(
          'Hệ:',
          mb('\\begin{cases} x+2y=1 \\\\ 2x+y=1 \\\\ 3x+3y=1 \\end{cases}'),
          'Từ hai phương trình đầu: ',
          m('(2x+y)-(x+2y)=0\\Rightarrow x-y=0\\Rightarrow y=x'),
          ', rồi ',
          m('x+2x=1\\Rightarrow x=\\tfrac13,\\ y=\\tfrac13'),
          '. Nhưng phương trình 3: ',
          m('3(\\tfrac13)+3(\\tfrac13)=2\\neq1'),
          '. Mâu thuẫn, hệ vô nghiệm. Vậy ',
          m('\\mathbf{b}_2\\notin\\operatorname{Col}(A)'),
          '.',
        ),
      },
    ],
    answer: f('(a) Có, ', m('\\mathbf{b}_1=2\\mathbf{c}_1+\\mathbf{c}_2'), '. (b) Không.'),
  },
  {
    id: 'model-Ax-b',
    chapterId: 'ch2-systems',
    difficulty: 'exam',
    topic: 'Mô hình → Ax=b',
    statement: f(
      'Một tiệm bánh làm ba loại bánh A, B, C. Gọi ',
      m('x,y,z'),
      ' lần lượt là số phần (chục cái) bánh A, B, C làm trong một ngày. Biết: tổng cộng 6 phần; lượng bột dùng là ',
      m('2x+y+3z=14'),
      ' (cốc); lượng đường dùng là ',
      m('x+3y+2z=11'),
      ' (cốc). (a) Viết hệ dưới dạng ',
      m('A\\mathbf{x}=\\mathbf{b}'),
      '. (b) Tìm ',
      m('x,y,z'),
      '.',
    ),
    steps: [
      {
        title: 'Lập hệ',
        content: f(
          'Ràng buộc tổng số phần: ',
          m('x+y+z=6'),
          '. Cùng hai ràng buộc đã cho:',
          mb('\\begin{cases} x+y+z=6 \\\\ 2x+y+3z=14 \\\\ x+3y+2z=11 \\end{cases}'),
        ),
      },
      {
        title: 'Dạng ma trận',
        content: mb(
          'A=\\begin{bmatrix}1&1&1\\\\2&1&3\\\\1&3&2\\end{bmatrix},\\quad \\mathbf{b}=\\begin{bmatrix}6\\\\14\\\\11\\end{bmatrix}',
        ),
      },
      {
        title: 'Khử Gauss',
        content: f(
          m('R_2\\to R_2-2R_1'),
          ', ',
          m('R_3\\to R_3-R_1'),
          ':',
          mb('\\left[\\begin{array}{ccc|c} 1&1&1&6 \\\\ 0&-1&1&2 \\\\ 0&2&1&5 \\end{array}\\right]'),
        ),
      },
      {
        title: 'Tiếp tục khử',
        content: f(
          m('R_3\\to R_3+2R_2'),
          ':',
          mb('\\left[\\begin{array}{ccc|c} 1&1&1&6 \\\\ 0&-1&1&2 \\\\ 0&0&3&9 \\end{array}\\right]'),
        ),
      },
      {
        title: 'Thế ngược',
        content: f(
          'Hàng 3: ',
          m('3z=9\\Rightarrow z=3'),
          '. Hàng 2: ',
          m('-y+z=2\\Rightarrow -y+3=2\\Rightarrow y=1'),
          '. Hàng 1: ',
          m('x+y+z=6\\Rightarrow x=2'),
          '.',
        ),
      },
    ],
    answer: f(m('x=2,\\ y=1,\\ z=3'), ' (tức 20 bánh A, 10 bánh B, 30 bánh C).'),
  },
];
