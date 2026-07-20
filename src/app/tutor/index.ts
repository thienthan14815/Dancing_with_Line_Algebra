// AI TUTOR — barrel export cho module trợ giảng.
// Lesson Player nhập từ đây: `import { TutorPanel } from '../tutor';`

export { default as TutorPanel } from './TutorPanel';
export type { TutorPanelProps } from './TutorPanel';

export {
  HeuristicTutor,
  LLMTutor,
  buildSocraticPrompt,
} from './provider';
export type {
  TutorProvider,
  TutorContext,
  HintLevel,
  LLMTutorConfig,
} from './provider';
