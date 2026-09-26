import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { DEVELOPER_MODE_KEY, readDeveloperMode, useDeveloperMode } from './developerMode';
import { useLearnStore } from './progress/store';
import { useCompletion } from '../app/state/completion';
import { useProgress } from '../lib/progress';
import { COURSE } from './content/course';
import { sectionIsAccessible } from '../app/lib/access';

const memory = new Map<string, string>();
const attempt = {
  exerciseId: 'preview-question', skillId: 'vector_addition', lessonId: 'preview-lesson',
  isCorrect: true, responseTimeMs: 100, hintsUsed: 0, attemptNumber: 1,
};

describe('Developer mode', () => {
  beforeEach(() => {
    memory.clear();
    vi.stubGlobal('localStorage', {
      getItem: (key: string) => memory.get(key) ?? null,
      setItem: (key: string, value: string) => memory.set(key, value),
      removeItem: (key: string) => memory.delete(key),
    });
    useDeveloperMode.getState().setEnabled(false);
    useLearnStore.getState().resetProgress();
    useCompletion.getState().reset();
  });
  afterEach(() => {
    useDeveloperMode.getState().setEnabled(false);
    vi.unstubAllGlobals();
  });

  it('defaults off, persists both states and ignores malformed stored values', () => {
    expect(readDeveloperMode()).toBe(false);
    useDeveloperMode.getState().setEnabled(true);
    expect(readDeveloperMode()).toBe(true);
    expect(memory.get(DEVELOPER_MODE_KEY)).toBe('true');
    useDeveloperMode.getState().setEnabled(false);
    expect(readDeveloperMode()).toBe(false);
    memory.set(DEVELOPER_MODE_KEY, '{invalid');
    expect(readDeveloperMode()).toBe(false);
  });

  it('works in memory if storage is blocked', () => {
    vi.stubGlobal('localStorage', {
      getItem: () => { throw new Error('blocked'); },
      setItem: () => { throw new Error('blocked'); },
    });
    expect(readDeveloperMode()).toBe(false);
    useDeveloperMode.getState().setEnabled(true);
    expect(useDeveloperMode.getState().enabled).toBe(true);
  });

  it('opens every registered section at zero progress and restores prerequisites when disabled', () => {
    const zeroProgress = () => 0;
    const locked = COURSE.sections.filter((section) => !sectionIsAccessible(section, COURSE.sections, zeroProgress, false));
    expect(locked.length).toBeGreaterThan(0);
    for (const section of COURSE.sections) {
      expect(sectionIsAccessible(section, COURSE.sections, zeroProgress, true)).toBe(true);
    }
    for (const section of locked) {
      expect(sectionIsAccessible(section, COURSE.sections, zeroProgress, false)).toBe(false);
      expect(sectionIsAccessible(section, COURSE.sections, () => 0.6, false)).toBe(true);
    }
  });

  it('preview leaves attempts, XP, mastery, SRS, streak, achievements and both completion stores untouched', () => {
    const before = useLearnStore.getState();
    const legacyBefore = useProgress.getState();
    const completionBefore = useCompletion.getState();
    useDeveloperMode.getState().setEnabled(true);
    const api = useLearnStore.getState();
    api.recordAttempt(attempt);
    api.completeLesson('preview-lesson', ['vector_addition'], { perfect: true });
    api.awardXp(100, 'preview');
    api.gradeFlashcard('vector_addition', 'easy');
    api.toggleBookmark('lesson:preview-lesson');
    api.saveNote('preview-lesson', 'Temporary preview note');
    useCompletion.getState().markDone('preview-lesson');
    useProgress.getState().markComplete('preview-lesson');
    useProgress.getState().setQuizScore('preview-lesson', 100);
    expect(useLearnStore.getState()).toBe(before);
    expect(useCompletion.getState()).toBe(completionBefore);
    expect(useProgress.getState()).toBe(legacyBefore);
  });

  it('normal learning records results again after leaving preview', () => {
    useDeveloperMode.getState().setEnabled(true);
    useLearnStore.getState().recordAttempt(attempt);
    useDeveloperMode.getState().setEnabled(false);
    useLearnStore.getState().recordAttempt(attempt);
    useLearnStore.getState().completeLesson('real-lesson', ['vector_addition']);
    useCompletion.getState().markDone('real-lesson');
    expect(useLearnStore.getState().attempts).toHaveLength(1);
    expect(useLearnStore.getState().xpTotal).toBeGreaterThan(0);
    expect(useLearnStore.getState().lessonsCompleted).toBe(1);
    expect(useCompletion.getState().done['real-lesson']).toBeTruthy();
  });
});
