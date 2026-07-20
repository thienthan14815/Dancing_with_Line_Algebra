import type { ComponentType } from 'react';
import Lesson1Form from './Lesson1Form';
import Lesson2Definite from './Lesson2Definite';
import Lesson3Spectral from './Lesson3Spectral';
import Lesson4Conic from './Lesson4Conic';

const LESSONS: Record<string, ComponentType> = {
  form: Lesson1Form,
  definite: Lesson2Definite,
  spectral: Lesson3Spectral,
  conic: Lesson4Conic,
};

export default function Chapter({ lessonId }: { lessonId: string }) {
  const Comp = LESSONS[lessonId] ?? Lesson1Form;
  return <Comp />;
}
