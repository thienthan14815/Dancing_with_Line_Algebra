import type { ComponentType } from 'react';
import GraphicsLesson from './GraphicsLesson';
import LeastSquaresLesson from './LeastSquaresLesson';
import PageRankLesson from './PageRankLesson';
import SvdImageLesson from './SvdImageLesson';

const LESSONS: Record<string, ComponentType> = {
  graphics: GraphicsLesson,
  'least-squares': LeastSquaresLesson,
  pagerank: PageRankLesson,
  'svd-image': SvdImageLesson,
};

export default function Chapter({ lessonId }: { lessonId: string }) {
  const LessonComp = LESSONS[lessonId] ?? GraphicsLesson;
  return <LessonComp />;
}
