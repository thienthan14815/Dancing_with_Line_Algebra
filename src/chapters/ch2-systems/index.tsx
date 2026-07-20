import type { ComponentType } from 'react';
import RowColumn from './RowColumn';
import Gauss from './Gauss';
import Solutions from './Solutions';

const LESSONS: Record<string, ComponentType> = {
  'row-column': RowColumn,
  gauss: Gauss,
  solutions: Solutions,
};

export default function Chapter({ lessonId }: { lessonId: string }) {
  const LessonComp = LESSONS[lessonId] ?? RowColumn;
  return <LessonComp />;
}
