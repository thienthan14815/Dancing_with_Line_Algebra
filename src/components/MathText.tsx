import katex from 'katex';
import 'katex/dist/katex.min.css';

export interface MathTextProps {
  tex: string;
  block?: boolean;
}

export default function MathText({ tex, block = false }: MathTextProps) {
  const html = katex.renderToString(tex, {
    throwOnError: false,
    displayMode: block,
  });
  if (block) {
    return <div className="mathtext-block" dangerouslySetInnerHTML={{ __html: html }} />;
  }
  return <span dangerouslySetInnerHTML={{ __html: html }} />;
}
