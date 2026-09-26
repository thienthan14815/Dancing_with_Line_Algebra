import { useState } from 'react';
import { Link, Navigate } from 'react-router-dom';
import MathText from '../../../components/MathText';
import { useLessonView } from '../../../components/Lesson';
import { lessons } from './lessons';
import './digital.css';

function GateLab() {
  const [a, setA] = useState(0);
  const [b, setB] = useState(1);
  const outputs = [a & b, a | b, a ^ b, 1 - (a & b), 1 - (a | b), 1 - (a ^ b)];
  return (
    <section className="digital-lab" aria-label="Thử cổng logic">
      <h3>Thử cổng logic</h3>
      <p>Bấm để đổi bit đầu vào; so sánh OR và XOR khi A = B = 1.</p>
      <div className="digital-controls">
        <button type="button" aria-pressed={a === 1} onClick={() => setA(1 - a)}>A = {a}</button>
        <button type="button" aria-pressed={b === 1} onClick={() => setB(1 - b)}>B = {b}</button>
      </div>
      <div className="digital-table" aria-live="polite">
        <table><caption>Kết quả với đầu vào hiện tại</caption>
          <thead><tr>{['AND','OR','XOR','NAND','NOR','XNOR'].map((name) => <th scope="col" key={name}>{name}</th>)}</tr></thead>
          <tbody><tr>{outputs.map((value, i) => <td key={i}>{value}</td>)}</tr></tbody>
        </table>
        <p>NOT A = {1 - a}; NOT B = {1 - b}.</p>
      </div>
    </section>
  );
}

function AdderLab() {
  const [a, setA] = useState(11);
  const [b, setB] = useState(6);
  const [carryIn, setCarryIn] = useState(0);
  let carry = carryIn;
  const rows = Array.from({ length: 4 }, (_, i) => {
    const ai = (a >> i) & 1;
    const bi = (b >> i) & 1;
    const input = carry;
    const sum = ai ^ bi ^ input;
    carry = (ai & bi) | (ai & input) | (bi & input);
    return [i, ai, bi, input, sum, carry];
  });
  const bits = (n: number) => n.toString(2).padStart(4, '0');
  const total = a + b + carryIn;
  return (
    <section className="digital-lab" aria-label="Thử bộ cộng 4 bit">
      <h3>Thử bộ cộng 4 bit</h3>
      <p>Chọn hai số không dấu 0–15. Đọc bảng từ bit thấp (0) đến bit cao (3).</p>
      <div className="digital-controls">
        <label>A (thập phân)
          <select value={a} onChange={(event) => setA(Number(event.target.value))}>
            {Array.from({ length: 16 }, (_, i) => <option key={i} value={i}>{i} — {bits(i)}₂</option>)}
          </select>
        </label>
        <label>B (thập phân)
          <select value={b} onChange={(event) => setB(Number(event.target.value))}>
            {Array.from({ length: 16 }, (_, i) => <option key={i} value={i}>{i} — {bits(i)}₂</option>)}
          </select>
        </label>
        <button type="button" aria-pressed={carryIn === 1} onClick={() => setCarryIn(1 - carryIn)}>C₀ = {carryIn}</button>
      </div>
      <div aria-live="polite">
        <p><strong>{bits(a)}₂ + {bits(b)}₂ + {carryIn} = {total.toString(2).padStart(5, '0')}₂ = {total}₁₀</strong></p>
        <div className="digital-table"><table>
          <caption>Carry đi từ FA₀ → FA₁ → FA₂ → FA₃</caption>
          <thead><tr>{['Bit i','Aᵢ','Bᵢ','Cᵢ (vào)','Sᵢ','Cᵢ₊₁ (ra)'].map((name) => <th scope="col" key={name}>{name}</th>)}</tr></thead>
          <tbody>{rows.map((row) => <tr key={row[0]}>{row.map((value, i) => <td key={i}>{value}</td>)}</tr>)}</tbody>
        </table></div>
        <p>Bốn bit tổng: <strong>{bits(total & 15)}</strong>. Nhớ ra C₄: <strong>{carry}</strong>.</p>
      </div>
    </section>
  );
}

export default function DigitalLesson({ lessonId }: { lessonId: string }) {
  const view = useLessonView();
  const index = lessons.findIndex((lesson) => lesson.id === lessonId);
  const lesson = lessons[index];
  if (!lesson) return <div className="panel">Không tìm thấy bài học.</div>;
  if (view === 'quiz') return <Navigate replace to={`/learn/digital-circuits:${lessonId}:practice`} />;
  return (
    <article className="panel digital-lesson">
      <p className="muted">Hệ đếm & Mạch số · Bài {index + 1}/{lessons.length}</p>
      <h2>{lesson.title}</h2>
      <p className="digital-objective"><strong>Mục tiêu:</strong> {lesson.objective}</p>
      {lesson.paragraphs.map((paragraph) => <p key={paragraph}>{paragraph}</p>)}
      {lesson.formula && <MathText block tex={lesson.formula} />}
      {lesson.table && <div className="digital-table"><table>
        <caption>{lesson.table.caption}</caption>
        <thead><tr>{lesson.table.headers.map((header) => <th scope="col" key={header}>{header}</th>)}</tr></thead>
        <tbody>{lesson.table.rows.map((row, i) => <tr key={i}>{row.map((cell, j) => <td key={j}>{cell}</td>)}</tr>)}</tbody>
      </table></div>}
      <h3>Ví dụ & cách làm</h3>
      <ol>{lesson.steps.map((step) => <li key={step}>{step}</li>)}</ol>
      {lesson.id === 'transistors-gates' && <GateLab />}
      {lesson.id === 'adder' && <AdderLab />}
      <p className="digital-objective"><strong>Ghi nhớ:</strong> {lesson.takeaway}</p>
      <nav className="digital-controls" aria-label="Điều hướng bài học mạch số">
        {index > 0 && <Link to={`/ch/digital-circuits/${lessons[index - 1].id}`}>← {lessons[index - 1].title}</Link>}
        {index < lessons.length - 1 && <Link to={`/ch/digital-circuits/${lessons[index + 1].id}`}>{lessons[index + 1].title} →</Link>}
      </nav>
    </article>
  );
}
