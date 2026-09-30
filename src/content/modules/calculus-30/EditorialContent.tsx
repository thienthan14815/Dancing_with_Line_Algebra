import { useState } from 'react';
import RichText from '../../../app/ui/RichText';
import MathText from '../../../components/MathText';
import type { EditorialLesson } from './editorial/types';
import CalculusFigure from './CalculusFigure';

const Text = ({ text }: { text: string }) => <RichText text={text} />;

export function EditorialOpening({ lesson, day }: { lesson: EditorialLesson; day: number }) {
  return <>
    <section className="calc-reading-section calc-prerequisites" id="calc-start">
      <h2><span>01</span> Chuẩn bị trước khi học</h2>
      <p className="calc-lead"><Text text={lesson.lead} /></p>
      <h3>Kiến thức cần nhớ</h3>
      <ul>{lesson.prerequisites.map(text => <li key={text}><Text text={text} /></li>)}</ul>
    </section>
    <section className="calc-reading-section" id="calc-observe">
      <h2><span>02</span> Nhìn hình, hiểu bản chất</h2>
      <CalculusFigure day={day} />
      {lesson.intuition.map(text => <p key={text}><Text text={text} /></p>)}
    </section>
    <section className="calc-reading-section" id="calc-method">
      <h2><span>03</span> Chọn phương pháp</h2>
      <ol className="calc-method">{lesson.method.map(step => <li key={step.title}>
        <h3>{step.title}</h3><p><Text text={step.detail} /></p>
      </li>)}</ol>
    </section>
    <section className="calc-reading-section" id="calc-worked">
      <h2><span>04</span> Làm mẫu và kiểm chứng</h2>
      <h3>{lesson.worked.title}</h3>
      <p><Text text={lesson.worked.prompt} /></p>
      <ol className="calc-derivation">{lesson.worked.steps.map((step, index) => <li key={index}>
        <MathText tex={step.tex} block /><p><Text text={step.explanation} /></p>
      </li>)}</ol>
      <div className="calc-result"><strong>Kết luận</strong><p><Text text={lesson.worked.result} /></p></div>
      <div className="calc-check"><strong>Kiểm chứng độc lập</strong><p><Text text={lesson.worked.check} /></p></div>
    </section>
  </>;
}

export function EditorialPractice({ lesson }: { lesson: EditorialLesson }) {
  const [selected, setSelected] = useState<number | null>(null);
  const [checked, setChecked] = useState(false);
  return <section className="calc-reading-section" id="calc-transfer">
    <h2><span>06</span> Tự làm và kết nối</h2>
    <h3>Đổi dữ kiện, giữ cách nghĩ</h3>
    <p><Text text={lesson.transfer.prompt} /></p>
    <details className="calc-solution"><summary>Đối chiếu lời giải bài chuyển dạng</summary>
      <p><Text text={lesson.transfer.answer} /></p><p><Text text={lesson.transfer.explanation} /></p>
    </details>
    <fieldset className="calc-checkpoint">
      <legend>Kiểm tra cách hiểu</legend>
      <p><Text text={lesson.checkpoint.prompt} /></p>
      {lesson.checkpoint.options.map((option, index) => <label key={index}>
        <input type="radio" name="calculus-checkpoint" checked={selected === index}
          onChange={() => { setSelected(index); setChecked(false); }} />
        <Text text={option} />
      </label>)}
      <button className="dl-btn dl-btn-primary" disabled={selected === null} onClick={() => setChecked(true)}>Kiểm tra cách hiểu</button>
      {checked && <div role="status" className="calc-check">
        <strong>{selected === lesson.checkpoint.answerIndex ? 'Đúng — bạn đã nắm được ý chính.' : 'Hãy đối chiếu lại điều kiện của quy tắc.'}</strong>
        <p><Text text={lesson.checkpoint.explain} /></p>
      </div>}
      <small>Câu hỏi tại trang đọc giúp tự kiểm tra. Tiến độ luyện tập được ghi ở phần luyện tập chấm điểm.</small>
    </fieldset>
    <h3>Kết nối với bài tiếp theo</h3>
    <ul>{lesson.connections.map(text => <li key={text}><Text text={text} /></li>)}</ul>
  </section>;
}
