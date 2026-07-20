import type { ComponentType } from 'react';
import Lesson1Transform from './Lesson1Transform';
import Lesson2Composition from './Lesson2Composition';
import Lesson3Determinant from './Lesson3Determinant';
import Lesson4Inverse from './Lesson4Inverse';
import Lesson5Special from './Lesson5Special';

const LESSONS: Record<string, ComponentType> = {
  transform: Lesson1Transform,
  composition: Lesson2Composition,
  determinant: Lesson3Determinant,
  inverse: Lesson4Inverse,
  special: Lesson5Special,
};

export default function Chapter({ lessonId }: { lessonId: string }) {
  const Comp = LESSONS[lessonId] ?? Lesson1Transform;
  return <Comp />;
}
