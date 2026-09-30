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

const STAGES = ['Quan sát và hiểu quy luật', 'Làm theo ví dụ', 'Tự kiểm tra và tránh nhầm'];
type ReadingMode = 'full' | 'guided';

function SkillBrief({ skillId, mode }: { skillId: string; mode: ReadingMode }) {
  const rule = TEACHING_RULES[skillId];
  const [stage, setStage] = useState(0);
  const id = useId();
  if (!rule) return null;
  const full = mode === 'full';
  return <div className={`teach-skill ${full ? 'teach-skill-full' : 'teach-skill-guided'}`}>
    {!full && <nav className="teach-stages" aria-label="Các bước học">
      {STAGES.map((name, i) =>
        <button key={name} type="button" aria-pressed={stage === i} aria-controls={`${id}-stage-${i}`} onClick={() => setStage(i)}>
          <span>{i + 1}</span>{name}
        </button>)}
    </nav>}
    <div className="teach-stage-content">
      <section className="teach-section" id={`${id}-stage-0`} hidden={!full && stage !== 0} aria-labelledby={`${id}-heading-0`}>
        <h4 id={`${id}-heading-0`}><span className="teach-section-number">01</span>{STAGES[0]}</h4>
        <RuleCard skillId={skillId} />
        <RuleVisual skillId={skillId} rule={rule} />
      </section>
      <section className="teach-section" id={`${id}-stage-1`} hidden={!full && stage !== 1} aria-labelledby={`${id}-heading-1`}>
        <h4 id={`${id}-heading-1`}><span className="teach-section-number">02</span>{STAGES[1]}</h4>
        <p className="teach-section-intro">Đọc dữ kiện, theo dõi từng phép biến đổi rồi kiểm tra kết quả.</p>
        <ol className="teach-example">{rule.example.map((step, i) => <li key={step}><span aria-hidden="true">{i + 1}</span><p>{step}</p></li>)}</ol>
        {!full && <details className="teach-reminder"><summary>Xem lại công thức</summary><RuleCard skillId={skillId} /></details>}
      </section>
      <section className="teach-section" id={`${id}-stage-2`} hidden={!full && stage !== 2} aria-labelledby={`${id}-heading-2`}>
        <h4 id={`${id}-heading-2`}><span className="teach-section-number">03</span>{STAGES[2]}</h4>
        <p className="teach-pitfall"><strong>Dễ nhầm:</strong> {rule.pitfall}</p>
        <div className="teach-retrieval">
          <p><strong>Tự làm trước khi đối chiếu</strong></p>
          <ol>
            <li>Giải thích quy luật bằng một câu và nêu điều kiện áp dụng.</li>
            <li>Che ví dụ, tự thực hiện lại ba bước rồi so sánh kết quả.</li>
            <li>Chỉ ra bước có thể mắc lỗi nêu trên và cách kiểm tra.</li>
          </ol>
        </div>
        {!full && <details className="teach-reminder"><summary>Đối chiếu quy luật</summary><RuleCard skillId={skillId} /></details>}
      </section>
    </div>
    {!full && <div className="teach-navigation">
      <button type="button" disabled={stage === 0} onClick={() => setStage(stage - 1)}>← Bước trước</button>
      <span aria-live="polite">{stage + 1} / {STAGES.length}</span>
      <button type="button" disabled={stage === STAGES.length - 1} onClick={() => setStage(stage + 1)}>Bước tiếp →</button>
    </div>}
  </div>;
}

export default function LessonBrief({ chapterId, lessonId }: { chapterId: string; lessonId: string }) {
  const skills = getLessonSkillIds(chapterId, lessonId).filter(id => TEACHING_RULES[id]);
  const [selected, setSelected] = useState<string | null>(null);
  const [mode, setMode] = useState<ReadingMode>('full');
  const id = useId();
  const skillId = selected && skills.includes(selected) ? selected : skills[0];
  if (!skillId) return null;
  const title = skills.length === 1 ? SKILL_BY_ID[skillId]?.name ?? skillId : 'Quy luật và cách vận dụng';
  const selectSkill = (target: string) => {
    setSelected(target);
    if (mode === 'full') {
      const element = document.getElementById(`${id}-skill-${target}`);
      element?.focus({ preventScroll: true });
      element?.scrollIntoView({ block: 'start' });
    }
  };
  return <section className="teach-brief" aria-label="Học ngắn gọn theo quy luật">
    <header className="teach-header">
      <p className="teach-eyebrow">Quan sát · hiểu cách làm · tự vận dụng</p>
      <h2>{title}</h2>
      <p className="teach-reading-intro">Đọc liền mạch từ quy luật đến ví dụ, hoặc tập trung vào từng bước học.</p>
    </header>
    <div className="teach-reading-modes" role="group" aria-label="Cách đọc bài">
      <button type="button" aria-pressed={mode === 'full'} aria-controls={`${id}-lessons`} onClick={() => setMode('full')}>Đọc toàn bài</button>
      <button type="button" aria-pressed={mode === 'guided'} aria-controls={`${id}-lessons`} onClick={() => setMode('guided')}>Học từng bước</button>
    </div>
    {skills.length > 1 && <nav className="teach-skills" aria-label="Các quy luật trong bài">
      {skills.map((skill, index) => <button type="button" key={skill} aria-pressed={mode === 'guided' ? skill === skillId : undefined}
        aria-controls={`${id}-skill-${skill}`} onClick={() => selectSkill(skill)}>
        <span>{index + 1}.</span> {SKILL_BY_ID[skill]?.name ?? skill}
      </button>)}
    </nav>}
    <div id={`${id}-lessons`} className="teach-lessons">
      {skills.map((skill, index) => <section key={`${chapterId}:${lessonId}:${skill}`} className="teach-skill-chapter"
        id={`${id}-skill-${skill}`} tabIndex={-1} hidden={mode === 'guided' && skill !== skillId} aria-labelledby={`${id}-title-${skill}`}>
        <h3 id={`${id}-title-${skill}`} className="teach-skill-title"><span>{String(index + 1).padStart(2, '0')}</span>{SKILL_BY_ID[skill]?.name ?? skill}</h3>
        <SkillBrief skillId={skill} mode={mode} />
      </section>)}
    </div>
  </section>;
}
