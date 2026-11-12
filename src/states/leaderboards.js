import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { forumApi } from '../api/forumApi';
import { showNotice } from './notice';

const leaderboardsSlice = createSlice({
  name: 'leaderboards',
  initialState: [],
  reducers: {
    receiveLeaderboards: (state, action) => action.payload,
  },
});

export const { receiveLeaderboards } = leaderboardsSlice.actions;

export const asyncGetLeaderboards = createAsyncThunk('leaderboards/get', async (_, { dispatch }) => {
  try {
    dispatch(receiveLeaderboards(await forumApi.getLeaderboards()));
  } catch (error) {
    dispatch(showNotice(error.message));
  }
});

export default leaderboardsSlice.reducer;
