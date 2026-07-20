import MathText from '../../components/MathText';

export interface RichTextProps {
  text: string;
}

/**
 * Render văn bản có thể chứa LaTeX xen kẽ: `$...$` (inline) và `$$...$$` (block).
 * Phần chữ thường giữ nguyên; phần toán dùng lại <MathText> (KaTeX).
 * An toàn cho chuỗi thuần (không có `$`) — trả lại đúng chữ.
 */
export default function RichText({ text }: RichTextProps) {
  const parts = text.split(/(\$\$[^$]+\$\$|\$[^$]+\$)/g);
  return (
    <>
      {parts.map((p, i) => {
        if (p.startsWith('$$') && p.endsWith('$$') && p.length > 4) {
          return <MathText key={i} tex={p.slice(2, -2)} block />;
        }
        if (p.startsWith('$') && p.endsWith('$') && p.length > 2) {
          return <MathText key={i} tex={p.slice(1, -1)} />;
        }
        return <span key={i}>{p}</span>;
      })}
    </>
  );
}
