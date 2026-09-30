export interface EditorialLesson {
  lead: string;
  prerequisites: string[];
  intuition: string[];
  method: { title: string; detail: string }[];
  worked: {
    title: string;
    prompt: string;
    steps: { tex: string; explanation: string }[];
    result: string;
    check: string;
  };
  transfer: { prompt: string; answer: string; explanation: string };
  connections: string[];
  checkpoint: { prompt: string; options: string[]; answerIndex: number; explain: string };
}
