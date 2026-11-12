import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { forumApi } from '../api/forumApi';
import { applyVote, getVote } from '../utils/vote';
import { showNotice } from './notice';
import { setThreadVote } from './threads';

const threadDetailSlice = createSlice({
  name: 'threadDetail',
  initialState: { thread: null },
  reducers: {
    receiveThreadDetail: (state, action) => {
      state.thread = action.payload;
    },
    clearThreadDetail: (state) => {
      state.thread = null;
    },
    addComment: (state, action) => {
      if (state.thread) state.thread.comments.unshift(action.payload);
    },
    setCommentVote: (state, action) => {
      const { commentId, userId, vote } = action.payload;
      const comment = state.thread?.comments.find((item) => item.id === commentId);
      if (comment) Object.assign(comment, applyVote(comment, userId, vote));
    },
  },
  extraReducers: (builder) => {
    builder.addCase(setThreadVote, (state, action) => {
      const { threadId, userId, vote } = action.payload;
      if (state.thread?.id === threadId) {
        Object.assign(state.thread, applyVote(state.thread, userId, vote));
      }
    });
  },
});

export const {
  receiveThreadDetail, clearThreadDetail, addComment, setCommentVote,
} = threadDetailSlice.actions;

export const asyncGetThreadDetail = createAsyncThunk('threadDetail/get', async (id, { dispatch }) => {
  try {
    dispatch(receiveThreadDetail(await forumApi.getThreadDetail(id)));
  } catch (error) {
    dispatch(showNotice(error.message));
  }
});

export const asyncAddComment = createAsyncThunk(
  'threadDetail/addComment',
  async ({ threadId, content }, { dispatch, getState }) => {
    try {
      const comment = await forumApi.createComment({ threadId, content });
      const { user } = getState().authUser;
      dispatch(addComment({ ...comment, owner: { ...comment.owner, ...user } }));
      return true;
    } catch (error) {
      dispatch(showNotice(error.message));
      return false;
    }
  },
);

export const asyncVoteComment = createAsyncThunk(
  'vote/comment',
  async ({ threadId, commentId, vote }, { dispatch, getState }) => {
    const { authUser, threadDetail } = getState();
    if (!authUser.user) {
      dispatch(showNotice('Silakan masuk untuk memberikan vote.', 'info'));
      return;
    }
    const comment = threadDetail.thread?.comments.find((item) => item.id === commentId);
    if (!comment) return;

    const userId = authUser.user.id;
    const previous = getVote(comment, userId);
    const next = previous === vote ? 'none' : vote;

    dispatch(setCommentVote({ commentId, userId, vote: next }));
    try {
      await forumApi.voteComment(threadId, commentId, next);
    } catch (error) {
      dispatch(setCommentVote({ commentId, userId, vote: previous }));
      dispatch(showNotice(error.message));
    }
  },
);

export default threadDetailSlice.reducer;
