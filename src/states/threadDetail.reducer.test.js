import { describe, expect, it } from 'vitest';
import reducer, {
  addComment, clearThreadDetail, receiveThreadDetail, setCommentVote,
} from './threadDetail';
import { setThreadVote } from './threads';

/**
 * Skenario pengujian reducer threadDetail:
 * - initial state tanpa thread.
 * - receiveThreadDetail menyimpan thread dan clearThreadDetail menghapusnya.
 * - addComment menaruh komentar baru di urutan paling atas.
 * - addComment aman bila thread belum dimuat.
 * - setCommentVote hanya mengubah komentar yang dituju.
 * - setCommentVote pada komentar yang tidak ada tidak mengubah state.
 * - setThreadVote (slice threads) ikut memperbarui detail bila id thread sama.
 * - setThreadVote untuk thread lain diabaikan.
 */
describe('threadDetail reducer', () => {
  const detail = {
    id: 't1',
    upVotesBy: [],
    downVotesBy: [],
    comments: [
      { id: 'c1', upVotesBy: ['u1'], downVotesBy: [] },
      { id: 'c2', upVotesBy: [], downVotesBy: [] },
    ],
  };
  const loaded = reducer(undefined, receiveThreadDetail(detail));

  it('initial state tanpa thread', () => {
    expect(reducer(undefined, { type: 'UNKNOWN' })).toEqual({ thread: null });
  });

  it('receive lalu clear thread detail', () => {
    expect(loaded.thread.id).toBe('t1');
    expect(reducer(loaded, clearThreadDetail()).thread).toBeNull();
  });

  it('addComment menambah komentar di paling atas', () => {
    const next = reducer(loaded, addComment({ id: 'c3', upVotesBy: [], downVotesBy: [] }));
    expect(next.thread.comments.map((c) => c.id)).toEqual(['c3', 'c1', 'c2']);
  });

  it('addComment aman saat thread belum dimuat', () => {
    expect(reducer({ thread: null }, addComment({ id: 'c3' }))).toEqual({ thread: null });
  });

  it('setCommentVote hanya mengubah komentar target', () => {
    const next = reducer(loaded, setCommentVote({ commentId: 'c1', userId: 'u1', vote: 'down' }));
    expect(next.thread.comments[0]).toMatchObject({ upVotesBy: [], downVotesBy: ['u1'] });
    expect(next.thread.comments[1]).toEqual(loaded.thread.comments[1]);
  });

  it('setCommentVote untuk komentar tidak dikenal tidak mengubah state', () => {
    const next = reducer(loaded, setCommentVote({ commentId: 'zz', userId: 'u1', vote: 'up' }));
    expect(next).toEqual(loaded);
  });

  it('mengikuti setThreadVote untuk thread yang sama', () => {
    const next = reducer(loaded, setThreadVote({ threadId: 't1', userId: 'u2', vote: 'up' }));
    expect(next.thread.upVotesBy).toEqual(['u2']);
  });

  it('mengabaikan setThreadVote thread lain', () => {
    const next = reducer(loaded, setThreadVote({ threadId: 'other', userId: 'u2', vote: 'up' }));
    expect(next.thread.upVotesBy).toEqual([]);
  });
});
