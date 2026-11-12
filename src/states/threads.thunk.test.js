import { configureStore } from '@reduxjs/toolkit';
import {
  beforeEach, describe, expect, it, vi,
} from 'vitest';
import { forumApi } from '../api/forumApi';
import authUser from './authUser';
import notice from './notice';
import threadDetail from './threadDetail';
import threads, { asyncCreateThread, asyncPopulateThreads, asyncVoteThread } from './threads';
import users from './users';

vi.mock('../api/forumApi', () => ({
  forumApi: {
    getAllUsers: vi.fn(),
    getAllThreads: vi.fn(),
    createThread: vi.fn(),
    voteThread: vi.fn(),
  },
}));

/**
 * Skenario pengujian thunk threads:
 * - asyncPopulateThreads
 *   - sukses: users dan threads terisi dari API (men-dispatch receiveUsers & receiveThreads).
 *   - gagal: state tidak berubah dan notice error muncul.
 * - asyncCreateThread
 *   - sukses: mengembalikan id thread dan menampilkan notice success.
 *   - gagal: mengembalikan null dan menampilkan notice error.
 * - asyncVoteThread
 *   - belum login: API tidak dipanggil, muncul notice info.
 *   - upvote: state langsung berubah (optimistic) dan API dipanggil dengan 'up'.
 *   - klik upvote ulang: vote dibatalkan ('none').
 *   - API gagal: vote dikembalikan ke kondisi semula dan notice error muncul.
 *   - thread yang sedang dibuka ikut berubah (threadDetail).
 */
describe('threads thunks', () => {
  const baseThread = {
    id: 't1', title: 'Judul', upVotesBy: [], downVotesBy: [], comments: [],
  };
  const makeStore = ({ user = { id: 'u1' }, items = [baseThread], detail = null } = {}) => configureStore({
    reducer: {
      authUser, users, threads, threadDetail, notice,
    },
    preloadedState: {
      authUser: { user, isPreloading: false },
      users: [],
      threads: { items, category: '' },
      threadDetail: { thread: detail },
      notice: null,
    },
  });

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('asyncPopulateThreads mengisi users dan threads', async () => {
    forumApi.getAllUsers.mockResolvedValue([{ id: 'u1', name: 'Budi' }]);
    forumApi.getAllThreads.mockResolvedValue([{ ...baseThread, id: 't7' }]);
    const store = makeStore({ items: [] });

    await store.dispatch(asyncPopulateThreads());

    expect(store.getState().users).toEqual([{ id: 'u1', name: 'Budi' }]);
    expect(store.getState().threads.items.map((t) => t.id)).toEqual(['t7']);
  });

  it('asyncPopulateThreads gagal menampilkan notice', async () => {
    forumApi.getAllUsers.mockRejectedValue(new Error('network down'));
    forumApi.getAllThreads.mockResolvedValue([]);
    const store = makeStore();

    await store.dispatch(asyncPopulateThreads());

    expect(store.getState().threads.items).toEqual([baseThread]);
    expect(store.getState().notice).toMatchObject({ message: 'network down', type: 'error' });
  });

  it('asyncCreateThread sukses mengembalikan id', async () => {
    forumApi.createThread.mockResolvedValue({ id: 'baru' });
    const store = makeStore();

    const id = await store.dispatch(asyncCreateThread({ title: 'a', body: 'b', category: 'c' })).unwrap();

    expect(id).toBe('baru');
    expect(store.getState().notice).toMatchObject({ type: 'success' });
  });

  it('asyncCreateThread gagal mengembalikan null', async () => {
    forumApi.createThread.mockRejectedValue(new Error('title is required'));
    const store = makeStore();

    const id = await store.dispatch(asyncCreateThread({ title: '', body: 'b', category: 'c' })).unwrap();

    expect(id).toBeNull();
    expect(store.getState().notice).toMatchObject({ message: 'title is required' });
  });

  it('asyncVoteThread menolak user yang belum login', async () => {
    const store = makeStore({ user: null });

    await store.dispatch(asyncVoteThread({ threadId: 't1', vote: 'up' }));

    expect(forumApi.voteThread).not.toHaveBeenCalled();
    expect(store.getState().notice).toMatchObject({ type: 'info' });
    expect(store.getState().threads.items[0].upVotesBy).toEqual([]);
  });

  it('asyncVoteThread mengubah state secara optimistic lalu memanggil API', async () => {
    let resolveApi;
    forumApi.voteThread.mockReturnValue(new Promise((resolve) => { resolveApi = resolve; }));
    const store = makeStore();

    const pending = store.dispatch(asyncVoteThread({ threadId: 't1', vote: 'up' }));
    expect(store.getState().threads.items[0].upVotesBy).toEqual(['u1']);
    expect(forumApi.voteThread).toHaveBeenCalledWith('t1', 'up');

    resolveApi({});
    await pending;
    expect(store.getState().threads.items[0].upVotesBy).toEqual(['u1']);
  });

  it('asyncVoteThread membatalkan vote saat tombol yang sama diklik lagi', async () => {
    forumApi.voteThread.mockResolvedValue({});
    const store = makeStore({ items: [{ ...baseThread, upVotesBy: ['u1'] }] });

    await store.dispatch(asyncVoteThread({ threadId: 't1', vote: 'up' }));

    expect(forumApi.voteThread).toHaveBeenCalledWith('t1', 'none');
    expect(store.getState().threads.items[0].upVotesBy).toEqual([]);
  });

  it('asyncVoteThread mengembalikan vote bila API gagal', async () => {
    forumApi.voteThread.mockRejectedValue(new Error('unauthorized'));
    const store = makeStore({ items: [{ ...baseThread, downVotesBy: ['u1'] }] });

    await store.dispatch(asyncVoteThread({ threadId: 't1', vote: 'up' }));

    const [thread] = store.getState().threads.items;
    expect(thread.upVotesBy).toEqual([]);
    expect(thread.downVotesBy).toEqual(['u1']);
    expect(store.getState().notice).toMatchObject({ message: 'unauthorized' });
  });

  it('asyncVoteThread ikut memperbarui thread yang sedang dibuka', async () => {
    forumApi.voteThread.mockResolvedValue({});
    const store = makeStore({ detail: { ...baseThread } });

    await store.dispatch(asyncVoteThread({ threadId: 't1', vote: 'down' }));

    expect(store.getState().threadDetail.thread.downVotesBy).toEqual(['u1']);
    expect(store.getState().threads.items[0].downVotesBy).toEqual(['u1']);
  });
});
