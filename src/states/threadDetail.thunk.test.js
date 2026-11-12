import { configureStore } from '@reduxjs/toolkit';
import {
  beforeEach, describe, expect, it, vi,
} from 'vitest';
import { forumApi } from '../api/forumApi';
import authUser from './authUser';
import notice from './notice';
import threadDetail, {
  asyncAddComment, asyncGetThreadDetail, asyncVoteComment,
} from './threadDetail';

vi.mock('../api/forumApi', () => ({
  forumApi: {
    getThreadDetail: vi.fn(),
    createComment: vi.fn(),
    voteComment: vi.fn(),
  },
}));

/**
 * Skenario pengujian thunk threadDetail:
 * - asyncGetThreadDetail
 *   - sukses: detail thread tersimpan di store.
 *   - gagal: thread tetap kosong dan notice error muncul.
 * - asyncAddComment
 *   - sukses: komentar baru muncul paling atas dengan data pemilik dari user yang login.
 *   - gagal: mengembalikan false dan notice error muncul.
 * - asyncVoteComment
 *   - belum login: API tidak dipanggil, notice info muncul.
 *   - downvote: state berubah optimistic dan API dipanggil dengan 'down'.
 *   - API gagal: vote komentar dikembalikan seperti semula.
 *   - komentar tidak ditemukan: tidak ada panggilan API.
 */
describe('threadDetail thunks', () => {
  const comment = (id, up = [], down = []) => ({
    id, content: id, upVotesBy: up, downVotesBy: down, owner: { id: 'u9', name: 'Lain' },
  });
  const detail = { id: 't1', comments: [comment('c1', ['u1']), comment('c2')] };
  const me = { id: 'u1', name: 'Budi', avatar: 'a.png' };
  const makeStore = ({ user = me, thread = detail } = {}) => configureStore({
    reducer: { authUser, threadDetail, notice },
    preloadedState: {
      authUser: { user, isPreloading: false },
      threadDetail: { thread },
      notice: null,
    },
  });

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('asyncGetThreadDetail menyimpan detail thread', async () => {
    forumApi.getThreadDetail.mockResolvedValue(detail);
    const store = makeStore({ thread: null });

    await store.dispatch(asyncGetThreadDetail('t1'));

    expect(forumApi.getThreadDetail).toHaveBeenCalledWith('t1');
    expect(store.getState().threadDetail.thread).toEqual(detail);
  });

  it('asyncGetThreadDetail gagal menampilkan notice', async () => {
    forumApi.getThreadDetail.mockRejectedValue(new Error('thread not found'));
    const store = makeStore({ thread: null });

    await store.dispatch(asyncGetThreadDetail('x'));

    expect(store.getState().threadDetail.thread).toBeNull();
    expect(store.getState().notice).toMatchObject({ message: 'thread not found' });
  });

  it('asyncAddComment menaruh komentar baru di atas dengan data pemilik', async () => {
    forumApi.createComment.mockResolvedValue({
      ...comment('c3'), owner: { id: 'u1', email: 'budi@mail.com' },
    });
    const store = makeStore();

    const ok = await store.dispatch(asyncAddComment({ threadId: 't1', content: 'halo' })).unwrap();

    const [first] = store.getState().threadDetail.thread.comments;
    expect(ok).toBe(true);
    expect(first.id).toBe('c3');
    expect(first.owner).toMatchObject({ id: 'u1', name: 'Budi', avatar: 'a.png' });
  });

  it('asyncAddComment gagal mengembalikan false', async () => {
    forumApi.createComment.mockRejectedValue(new Error('content required'));
    const store = makeStore();

    const ok = await store.dispatch(asyncAddComment({ threadId: 't1', content: '' })).unwrap();

    expect(ok).toBe(false);
    expect(store.getState().threadDetail.thread.comments).toHaveLength(2);
    expect(store.getState().notice).toMatchObject({ message: 'content required' });
  });

  it('asyncVoteComment menolak user yang belum login', async () => {
    const store = makeStore({ user: null });

    await store.dispatch(asyncVoteComment({ threadId: 't1', commentId: 'c1', vote: 'up' }));

    expect(forumApi.voteComment).not.toHaveBeenCalled();
    expect(store.getState().notice).toMatchObject({ type: 'info' });
  });

  it('asyncVoteComment downvote mengubah state dan memanggil API', async () => {
    forumApi.voteComment.mockResolvedValue({});
    const store = makeStore();

    await store.dispatch(asyncVoteComment({ threadId: 't1', commentId: 'c1', vote: 'down' }));

    expect(forumApi.voteComment).toHaveBeenCalledWith('t1', 'c1', 'down');
    const [c1] = store.getState().threadDetail.thread.comments;
    expect(c1.upVotesBy).toEqual([]);
    expect(c1.downVotesBy).toEqual(['u1']);
  });

  it('asyncVoteComment mengembalikan vote bila API gagal', async () => {
    forumApi.voteComment.mockRejectedValue(new Error('server error'));
    const store = makeStore();

    await store.dispatch(asyncVoteComment({ threadId: 't1', commentId: 'c1', vote: 'down' }));

    const [c1] = store.getState().threadDetail.thread.comments;
    expect(c1.upVotesBy).toEqual(['u1']);
    expect(c1.downVotesBy).toEqual([]);
    expect(store.getState().notice).toMatchObject({ message: 'server error' });
  });

  it('asyncVoteComment mengabaikan komentar yang tidak ada', async () => {
    const store = makeStore();

    await store.dispatch(asyncVoteComment({ threadId: 't1', commentId: 'nope', vote: 'up' }));

    expect(forumApi.voteComment).not.toHaveBeenCalled();
  });
});
