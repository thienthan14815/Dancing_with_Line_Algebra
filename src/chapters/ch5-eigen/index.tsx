import type { ComponentType } from 'react';
import Lesson1Discover from './Lesson1Discover';
import Lesson2Characteristic from './Lesson2Characteristic';
import Lesson3Eigenspace from './Lesson3Eigenspace';
import Lesson4Diagonalization from './Lesson4Diagonalization';
import Lesson5Powers from './Lesson5Powers';

const LESSONS: Record<string, ComponentType> = {
  discover: Lesson1Discover,
  characteristic: Lesson2Characteristic,
  eigenspace: Lesson3Eigenspace,
  diagonalization: Lesson4Diagonalization,
  powers: Lesson5Powers,
};

export default function Chapter({ lessonId }: { lessonId: string }) {
  const Comp = LESSONS[lessonId] ?? Lesson1Discover;
  return <Comp />;
}
