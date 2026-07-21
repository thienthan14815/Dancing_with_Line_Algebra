import { describe, it, expect, beforeEach } from 'vitest';
import { useLearnStore } from './store';

/**
 * Bookmark ⭐ + ghi chú: field additive, persist-safe (không đổi STATE_KEY).
 * Chỉ kiểm hành vi store, không chạm UI.
 */
describe('bookmarks + notes (store)', () => {
  beforeEach(() => {
    useLearnStore.getState().resetProgress();
  });

  it('defaults to empty collections', () => {
    const st = useLearnStore.getState();
    expect(st.bookmarks).toEqual([]);
    expect(st.notes).toEqual({});
    expect(st.isBookmarked('lesson:intro')).toBe(false);
  });

  it('toggles a bookmark on and off (idempotent id)', () => {
    const api = useLearnStore.getState();
    api.toggleBookmark('lesson:intro');
    expect(useLearnStore.getState().isBookmarked('lesson:intro')).toBe(true);
    expect(useLearnStore.getState().bookmarks).toEqual(['lesson:intro']);

    // Thêm lại cùng id không nhân đôi — toggle off.
    useLearnStore.getState().toggleBookmark('lesson:intro');
    expect(useLearnStore.getState().isBookmarked('lesson:intro')).toBe(false);
    expect(useLearnStore.getState().bookmarks).toEqual([]);
  });

  it('keeps insertion order across mixed types', () => {
    const api = useLearnStore.getState();
    api.toggleBookmark('lesson:a');
    useLearnStore.getState().toggleBookmark('formula:dot');
    useLearnStore.getState().toggleBookmark('symbol:sigma');
    expect(useLearnStore.getState().bookmarks).toEqual([
      'lesson:a',
      'formula:dot',
      'symbol:sigma',
    ]);
  });

  it('saves a note and clears the key when trimmed-empty', () => {
    const api = useLearnStore.getState();
    api.saveNote('lesson:a', '  ');
    expect(useLearnStore.getState().notes['lesson:a']).toBeUndefined();

    useLearnStore.getState().saveNote('lesson:a', 'x = $A^{-1}b$');
    expect(useLearnStore.getState().notes['lesson:a']).toBe('x = $A^{-1}b$');

    // Xoá ghi chú: lưu chuỗi rỗng → key biến mất (không để lại rác).
    useLearnStore.getState().saveNote('lesson:a', '');
    expect(useLearnStore.getState().notes['lesson:a']).toBeUndefined();
  });

  it('resetProgress wipes bookmarks and notes', () => {
    const api = useLearnStore.getState();
    api.toggleBookmark('lesson:a');
    useLearnStore.getState().saveNote('lesson:a', 'note');
    useLearnStore.getState().resetProgress();
    const st = useLearnStore.getState();
    expect(st.bookmarks).toEqual([]);
    expect(st.notes).toEqual({});
  });
});
