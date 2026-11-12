import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { forumApi } from '../api/forumApi';
import { applyVote, getVote } from '../utils/vote';
import { showNotice } from './notice';
import { receiveUsers } from './users';

const threadsSlice = createSlice({
  name: 'threads',
  initialState: { items: [], category: '' },
  reducers: {
    receiveThreads: (state, action) => {
      state.items = action.payload;
    },
    setCategory: (state, action) => {
      state.category = state.category === action.payload ? '' : action.payload;
    },
    setThreadVote: (state, action) => {
      const { threadId, userId, vote } = action.payload;
      const thread = state.items.find((item) => item.id === threadId);
      if (thread) Object.assign(thread, applyVote(thread, userId, vote));
    },
  },
});

export const { receiveThreads, setCategory, setThreadVote } = threadsSlice.actions;

export const asyncPopulateThreads = createAsyncThunk('threads/populate', async (_, { dispatch }) => {
  try {
    const [users, threads] = await Promise.all([forumApi.getAllUsers(), forumApi.getAllThreads()]);
    dispatch(receiveUsers(users));
    dispatch(receiveThreads(threads));
  } catch (error) {
    dispatch(showNotice(error.message));
  }
});

export const asyncCreateThread = createAsyncThunk('threads/create', async (payload, { dispatch }) => {
  try {
    const thread = await forumApi.createThread(payload);
    dispatch(showNotice('Thread berhasil dibuat.', 'success'));
    return thread.id;
  } catch (error) {
    dispatch(showNotice(error.message));
    return null;
  }
});

// Optimistic update: state diubah lebih dulu, dikembalikan bila request gagal.
export const asyncVoteThread = createAsyncThunk(
  'vote/thread',
  async ({ threadId, vote }, { dispatch, getState }) => {
    const { authUser, threads, threadDetail } = getState();
    if (!authUser.user) {
      dispatch(showNotice('Silakan masuk untuk memberikan vote.', 'info'));
      return;
    }
    const thread = threadDetail.thread?.id === threadId
      ? threadDetail.thread
      : threads.items.find((item) => item.id === threadId);
    if (!thread) return;

    const userId = authUser.user.id;
    const previous = getVote(thread, userId);
    const next = previous === vote ? 'none' : vote;

    dispatch(setThreadVote({ threadId, userId, vote: next }));
    try {
      await forumApi.voteThread(threadId, next);
    } catch (error) {
      dispatch(setThreadVote({ threadId, userId, vote: previous }));
      dispatch(showNotice(error.message));
    }
  },
);

export default threadsSlice.reducer;
