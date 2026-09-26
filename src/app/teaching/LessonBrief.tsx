import { useId, useState } from 'react';
import { COURSE } from '../../core/content/course';
import { SKILL_BY_ID } from '../../core/content/skills';
import MathText from '../../components/MathText';
import { TEACHING_RULES } from './rules';
import RuleVisual from './RuleVisual';
import './teaching.css';

/** Read only the matching concept's skills, never a chapter review's combined skills. */
export function getLessonSkillIds(chapterId: string, lessonId: string): string[] {
  const unit = COURSE.sections.find(section => section.id === chapterId)?.units.find(unit => unit.id === `${chapterId}:${lessonId}`);
  const concept = unit?.lessons.find(lesson => lesson.id === `${chapterId}:${lessonId}:concept`);
  return concept?.skillIds ?? [];
}

export function RuleCard({ skillId }: { skillId: string }) {
  const rule = TEACHING_RULES[skillId];
  if (!rule) return null;
  return <div className="teach-rule">
    <p className="teach-rule-text"><strong>{rule.rule}</strong></p>
    <MathText block tex={rule.formula} />
    <p className="teach-condition"><strong>Điều kiện:</strong> {rule.condition}</p>
  </div>;
}

function SkillBrief({ skillId }: { skillId: string }) {
  const rule = TEACHING_RULES[skillId];
  const [stage, setStage] = useState(0);
  const id = useId();
  if (!rule) return null;
  return <div className="teach-skill">
    <nav className="teach-stages" aria-label="Các bước học">
      {['Nhìn quy luật', 'Làm theo mẫu', 'Tự kiểm tra'].map((name, i) =>
        <button key={name} type="button" aria-pressed={stage === i} aria-controls={`${id}-content`} onClick={() => setStage(i)}>
          <span>{i+1}</span>{name}
        </button>)}
    </nav>
    <div id={`${id}-content`} className="teach-stage-content">
      {stage === 0 && <><RuleCard skillId={skillId} /><RuleVisual skillId={skillId} rule={rule} /></>}
      {stage === 1 && <>
        <h3>Một ví dụ, ba bước</h3>
        <ol className="teach-example">{rule.example.map((step, i) => <li key={step}><span aria-hidden="true">{i+1}</span><p>{step}</p></li>)}</ol>
        <details className="teach-reminder"><summary>Xem lại công thức</summary><RuleCard skillId={skillId} /></details>
      </>}
      {stage === 2 && <>
        <h3>Nhớ quy luật, tránh nhầm lẫn</h3>
        <p className="teach-pitfall"><strong>Dễ nhầm:</strong> {rule.pitfall}</p>
        <p>Che ví dụ, tự giải thích quy tắc bằng một câu. Sau đó làm lại ba bước mà không nhìn lời giải.</p>
        <details className="teach-reminder"><summary>Đối chiếu quy luật</summary><RuleCard skillId={skillId} /></details>
      </>}
    </div>
    <div className="teach-navigation">
      <button type="button" disabled={stage === 0} onClick={() => setStage(stage - 1)}>← Bước trước</button>
      <span>{stage + 1} / 3</span>
      <button type="button" disabled={stage === 2} onClick={() => setStage(stage + 1)}>Bước tiếp →</button>
    </div>
  </div>;
}

export default function LessonBrief({ chapterId, lessonId }: { chapterId: string; lessonId: string }) {
  const skills = getLessonSkillIds(chapterId, lessonId).filter(id => TEACHING_RULES[id]);
  const [selected, setSelected] = useState<string | null>(null);
  const skillId = selected && skills.includes(selected) ? selected : skills[0];
  if (!skillId) return null;
  const title = SKILL_BY_ID[skillId]?.name ?? skillId;
  return <section className="teach-brief" aria-label="Học ngắn gọn theo quy luật">
    <header className="teach-header"><p className="teach-eyebrow">Hiểu quy luật · học từng bước</p><h2>{title}</h2></header>
    {skills.length > 1 && <nav className="teach-skills" aria-label="Các quy luật trong bài">
      {skills.map(id => <button type="button" key={id} aria-pressed={id === skillId} onClick={() => setSelected(id)}>{SKILL_BY_ID[id]?.name ?? id}</button>)}
    </nav>}
    <SkillBrief key={`${chapterId}:${lessonId}:${skillId}`} skillId={skillId} />
  </section>;
}
