import { useState, type ReactNode } from 'react';
import { useProgress } from '../lib/progress';
import LegacyIllustration from '../app/learning-support/LegacyIllustration';

export interface QuizQuestion {
  q: ReactNode;
  options: ReactNode[];
  answer: number;
  explain: ReactNode;
}

export interface QuizProps {
  lessonKey: string;
  questions: QuizQuestion[];
}

export default function Quiz({ lessonKey, questions }: QuizProps) {
  const [picked, setPicked] = useState<Record<number, number>>({});
  const setQuizScore = useProgress((s) => s.setQuizScore);
  const markComplete = useProgress((s) => s.markComplete);

  const answeredCount = Object.keys(picked).length;
  const allDone = answeredCount === questions.length && questions.length > 0;

  const choose = (qi: number, oi: number) => {
    if (picked[qi] !== undefined) return; // đã trả lời
    const next = { ...picked, [qi]: oi };
    setPicked(next);
    if (Object.keys(next).length === questions.length) {
      let correct = 0;
      questions.forEach((q, idx) => {
        if (next[idx] === q.answer) correct++;
      });
      const score = Math.round((correct / questions.length) * 100);
      setQuizScore(lessonKey, score);
      markComplete(lessonKey);
    }
  };

  const score = allDone
    ? Math.round(
        (questions.filter((q, idx) => picked[idx] === q.answer).length /
          questions.length) *
          100
      )
    : 0;

  return (
    <div>
      {questions.map((q, qi) => {
        const chosen = picked[qi];
        const answered = chosen !== undefined;
        return (
          <div className="quiz-q" key={qi}>
            <div className="quiz-q-text">
              {qi + 1}. {q.q}
            </div>
            <LegacyIllustration question={q.q} id={`${lessonKey}:${qi}`} />
            <div className="quiz-options">
              {q.options.map((opt, oi) => {
                let cls = 'quiz-option';
                if (answered) {
                  if (oi === q.answer) cls += ' correct';
                  else if (oi === chosen) cls += ' wrong';
                }
                return (
                  <button
                    key={oi}
                    className={cls}
                    disabled={answered}
                    onClick={() => choose(qi, oi)}
                  >
                    {opt}
                  </button>
                );
              })}
            </div>
            {answered && (
              <div className="quiz-explain">
                {chosen === q.answer ? '✅ Chính xác! ' : '❌ Chưa đúng. '}
                {q.explain}
              </div>
            )}
          </div>
        );
      })}
      {allDone && (
        <div className="quiz-score">
          Điểm của bạn: {score}/100
          {score === 100 ? ' 🎉' : ''}
        </div>
      )}
    </div>
  );
}
