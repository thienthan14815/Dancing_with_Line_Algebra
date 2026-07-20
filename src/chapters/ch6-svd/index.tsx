import type { ComponentType } from 'react';
import Lesson1RotateStretch from './Lesson1RotateStretch';
import Lesson2Singular from './Lesson2Singular';
import Lesson3EigenLink from './Lesson3EigenLink';
import Lesson4Compression from './Lesson4Compression';
import Lesson5PCA from './Lesson5PCA';

const LESSONS: Record<string, ComponentType> = {
  'rotate-stretch': Lesson1RotateStretch,
  singular: Lesson2Singular,
  'eigen-link': Lesson3EigenLink,
  compression: Lesson4Compression,
  pca: Lesson5PCA,
};

export default function Chapter({ lessonId }: { lessonId: string }) {
  const Comp = LESSONS[lessonId] ?? Lesson1RotateStretch;
  return <Comp />;
}
