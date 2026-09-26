import { isValidElement, type ReactNode } from 'react';
import { useParams } from 'react-router-dom';
import MathText from '../../components/MathText';
import { COURSE } from '../../core/content/course';
import ExerciseIllustration from '../learning-visuals/ExerciseIllustration';

/** Read only visible question text; never inspect answer choices or solutions. */
export function questionText(node: ReactNode): string {
  if (typeof node === 'string' || typeof node === 'number') return String(node);
  if (Array.isArray(node)) return node.map(questionText).join(' ');
  if (isValidElement<{ tex?: string; children?: ReactNode }>(node)) {
    if (node.type === MathText) return node.props.tex ?? '';
    return questionText(node.props.children);
  }
  return '';
}

export default function LegacyIllustration({ question, id, skillId: suppliedSkill }: { question: ReactNode; id: string; skillId?: string }) {
  const { chapterId, lessonId } = useParams();
  const unit = COURSE.sections.find((section) => section.id === chapterId)?.units.find((entry) => entry.id === `${chapterId}:${lessonId}`);
  const skillId = suppliedSkill ?? unit?.lessons[0]?.skillIds[0] ?? 'legacy_prompt';
  return <ExerciseIllustration exercise={{
    id, skillId, prompt: questionText(question), type: 'numeric-input',
    dimension: 'concept', difficulty: 1, hints: [], answer: 0,
  }} />;
}
