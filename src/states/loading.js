import { createSlice } from '@reduxjs/toolkit';

// Vote memakai optimistic update, jadi tidak perlu memunculkan loading indicator.
const isTracked = (action) => !action.type.startsWith('vote/');
const isPending = (action) => action.type.endsWith('/pending') && isTracked(action);
const isSettled = (action) => (
  (action.type.endsWith('/fulfilled') || action.type.endsWith('/rejected')) && isTracked(action)
);

const loadingSlice = createSlice({
  name: 'loading',
  initialState: 0,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addMatcher(isPending, (state) => state + 1)
      .addMatcher(isSettled, (state) => Math.max(0, state - 1));
  },
});

export default loadingSlice.reducer;
