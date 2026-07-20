import { useState } from 'react';
import { Lesson, Section } from '../../components/Lesson';
import MathText from '../../components/MathText';
import Slider from '../../components/Slider';
import Quiz from '../../components/Quiz';

interface SymRow {
  sym: string;
  name: string;
  read: string;
  example: string;
}

const SYMBOLS: SymRow[] = [
  { sym: '\\in', name: 'thuộc', read: '"là phần tử của"', example: '3 \\in \\mathbb{R}' },
  { sym: '\\notin', name: 'không thuộc', read: '"không là phần tử của"', example: '\\tfrac{1}{2} \\notin \\mathbb{Z}' },
  { sym: '\\subset', name: 'tập con', read: '"là tập con của"', example: '\\mathbb{Z} \\subset \\mathbb{R}' },
  { sym: '\\mathbb{R}', name: 'số thực', read: '"tập các số thực"', example: '\\pi \\in \\mathbb{R}' },
  { sym: '\\mathbb{R}^n', name: 'không gian n chiều', read: '"tập các bộ n số thực"', example: '(1,2,3) \\in \\mathbb{R}^3' },
  { sym: '\\forall', name: 'với mọi', read: '"với mọi"', example: '\\forall x \\in \\mathbb{R}' },
  { sym: '\\exists', name: 'tồn tại', read: '"tồn tại (ít nhất một)"', example: '\\exists x : x^2 = 2' },
  { sym: '|\\vec{v}|', name: 'độ dài (norm)', read: '"độ dài của vector v"', example: '|\\vec{v}| = \\sqrt{v_1^2 + v_2^2}' },
  { sym: '\\vec{v}^{\\,T}', name: 'chuyển vị', read: '"v chuyển vị"', example: '\\vec{v}^{\\,T} \\text{ đổi cột thành hàng}' },
  { sym: '\\sum', name: 'tổng sigma', read: '"tổng của"', example: '\\sum_{i=1}^{3} i = 6' },
];

export default function Notation() {
  const [n, setN] = useState(5);

  const terms = Array.from({ length: n }, (_, i) => i + 1);
  const sum = terms.reduce((a, b) => a + b, 0);
  const expansion = terms.join(' + ');
  const sigmaTex = `\\sum_{i=1}^{${n}} i = ${expansion} = ${sum}`;

  return (
    <Lesson id="notation" title="Ký hiệu toán học">
      <Section kind="explore" title="Ký hiệu Σ: tổng gọn trong một dấu">
        <p className="muted">
          Ký hiệu <MathText tex="\sum" /> (chữ Sigma hoa) chỉ là cách viết gọn của
          "cộng dồn". Hãy <b>kéo thanh trượt <MathText tex="n" /></b> và xem tổng{' '}
          <MathText tex="\sum_{i=1}^{n} i" /> tự khai triển ra từng số hạng.
        </p>

        <Slider label="n" min={1} max={10} step={1} value={n} onChange={(v) => setN(Math.round(v))} format={(v) => String(Math.round(v))} />

        <div style={{ margin: '10px 0', overflowX: 'auto' }}>
          <MathText block tex={sigmaTex} />
        </div>

        <p className="dim" style={{ fontSize: 13 }}>
          Đọc thành lời: "tổng của <MathText tex="i" />, khi <MathText tex="i" /> chạy
          từ 1 đến {n}". Con số dưới dấu Σ (<MathText tex="i = 1" />) là điểm bắt đầu,
          con số trên (<MathText tex={String(n)} />) là điểm dừng, còn{' '}
          <MathText tex="i" /> là "biến đếm" nhảy từng bước.
        </p>
      </Section>

      <Section kind="explore" title="Bảng ký hiệu thường gặp">
        <p className="muted">
          Đây là "bộ chữ cái" bạn sẽ gặp suốt cả app. Chưa cần thuộc — cứ quay lại tra
          khi nào quên. Cột cuối là một ví dụ cho mỗi ký hiệu.
        </p>
        <div style={{ overflowX: 'auto' }}>
          <table style={{ borderCollapse: 'collapse', width: '100%', fontSize: 14 }}>
            <thead>
              <tr style={{ textAlign: 'left', color: 'var(--text-muted)' }}>
                <th style={{ padding: '8px 12px', borderBottom: '1px solid var(--border)' }}>Ký hiệu</th>
                <th style={{ padding: '8px 12px', borderBottom: '1px solid var(--border)' }}>Tên</th>
                <th style={{ padding: '8px 12px', borderBottom: '1px solid var(--border)' }}>Đọc là</th>
                <th style={{ padding: '8px 12px', borderBottom: '1px solid var(--border)' }}>Ví dụ</th>
              </tr>
            </thead>
            <tbody>
              {SYMBOLS.map((row) => (
                <tr key={row.sym}>
                  <td style={{ padding: '8px 12px', borderBottom: '1px solid var(--border-soft)' }}>
                    <MathText tex={row.sym} />
                  </td>
                  <td style={{ padding: '8px 12px', borderBottom: '1px solid var(--border-soft)' }}>{row.name}</td>
                  <td style={{ padding: '8px 12px', borderBottom: '1px solid var(--border-soft)', color: 'var(--text-muted)' }}>
                    {row.read}
                  </td>
                  <td style={{ padding: '8px 12px', borderBottom: '1px solid var(--border-soft)' }}>
                    <MathText tex={row.example} />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Section>

      <Section kind="theory" title="Ký hiệu là một ngôn ngữ, không phải bùa chú">
        <p>
          Nhiều người sợ toán vì trang giấy đầy ký hiệu lạ. Nhưng hãy nghĩ thế này:
          ký hiệu toán chỉ là <b>chữ viết tắt cực kỳ đặc</b>. Mỗi ký hiệu thay cho cả
          một câu tiếng Việt. Khi bạn đọc trôi chảy, một dòng công thức thực ra là một
          đoạn văn.
        </p>
        <p>
          Ví dụ, đọc câu này ra lời:
        </p>
        <MathText block tex="\forall \vec{v} \in \mathbb{R}^n : |\vec{v}| \ge 0" />
        <p>
          Dịch: "<b>với mọi</b> vector <MathText tex="\vec{v}" /> <b>thuộc</b> không
          gian <MathText tex="n" /> chiều, <b>độ dài</b> của{' '}
          <MathText tex="\vec{v}" /> <b>lớn hơn hoặc bằng</b> 0". Một câu hoàn chỉnh,
          gói trong bảy ký hiệu. Cái lợi không chỉ là ngắn: khi đã quen, bạn <i>nghĩ</i>{' '}
          nhanh hơn vì không phải lôi cả câu dài ra mỗi lần.
        </p>
        <p>
          Mẹo thực hành: gặp công thức lạ, đừng đọc lướt. Chỉ tay vào từng ký hiệu và
          đọc thành lời, đúng như ta vừa làm. Dần dần mắt bạn sẽ "nghe" được công thức.
        </p>
        <div className="panel" style={{ borderColor: 'var(--accent)', background: 'rgba(56,189,248,0.06)' }}>
          <b style={{ color: 'var(--accent)' }}>Phân biệt nhanh các tập số.</b>{' '}
          <MathText tex="\mathbb{N}" /> số tự nhiên (0,1,2,…),{' '}
          <MathText tex="\mathbb{Z}" /> số nguyên (…,−1,0,1,…),{' '}
          <MathText tex="\mathbb{Q}" /> số hữu tỉ (phân số),{' '}
          <MathText tex="\mathbb{R}" /> số thực (cả <MathText tex="\pi" />,{' '}
          <MathText tex="\sqrt{2}" />). Chúng lồng nhau:{' '}
          <MathText tex="\mathbb{N} \subset \mathbb{Z} \subset \mathbb{Q} \subset \mathbb{R}" />.
        </div>
      </Section>

      <Section kind="quiz" title="Kiểm tra hiểu">
        <Quiz
          lessonKey="ch0/notation"
          questions={[
            {
              q: <>Biểu thức <MathText tex="\sum_{i=1}^{4} i" /> bằng bao nhiêu?</>,
              options: ['4', '10', '24', '16'],
              answer: 1,
              explain: (
                <>
                  Khai triển: <MathText tex="1 + 2 + 3 + 4 = 10" />. Bạn có thể đặt{' '}
                  <MathText tex="n = 4" /> ở thanh trượt phía trên để kiểm chứng.
                </>
              ),
            },
            {
              q: <>Câu <MathText tex="\pi \in \mathbb{R}" /> đọc là gì?</>,
              options: [
                'π lớn hơn R',
                'π là phần tử của tập số thực',
                'π là tập con của R',
                'π không thuộc R',
              ],
              answer: 1,
              explain: (
                <>
                  <MathText tex="\in" /> nghĩa là "thuộc / là phần tử của". Và đúng
                  vậy, <MathText tex="\pi" /> là một số thực.
                </>
              ),
            },
            {
              q: <>Ký hiệu <MathText tex="|\vec{v}|" /> biểu thị điều gì?</>,
              options: [
                'Số phần tử của v',
                'Độ dài (norm) của vector v',
                'Giá trị tuyệt đối của số v luôn dương',
                'Chuyển vị của v',
              ],
              answer: 1,
              explain: (
                <>
                  Với một vector, hai vạch đứng chỉ <b>độ dài</b> của nó — mở rộng của
                  khái niệm giá trị tuyệt đối sang nhiều chiều.
                </>
              ),
            },
            {
              q: <>Vì sao <MathText tex="\mathbb{Z} \subset \mathbb{R}" /> là đúng?</>,
              options: [
                'Vì mọi số thực đều là số nguyên',
                'Vì mọi số nguyên cũng là một số thực, nên tập số nguyên nằm trọn trong tập số thực',
                'Vì hai tập bằng nhau',
                'Vì số nguyên nhiều hơn số thực',
              ],
              answer: 1,
              explain: (
                <>
                  <MathText tex="\subset" /> nghĩa là "tập con". Mọi số nguyên như 3
                  hay −5 đều là số thực, nên <MathText tex="\mathbb{Z}" /> nằm gọn
                  trong <MathText tex="\mathbb{R}" /> (nhưng không ngược lại, vì{' '}
                  <MathText tex="\pi \notin \mathbb{Z}" />).
                </>
              ),
            },
          ]}
        />
      </Section>
    </Lesson>
  );
}
