import { createSlice } from '@reduxjs/toolkit';

let noticeId = 0;

const noticeSlice = createSlice({
  name: 'notice',
  initialState: null,
  reducers: {
    showNotice: {
      reducer: (state, action) => action.payload,
      prepare: (message, type = 'error') => {
        noticeId += 1;
        return { payload: { id: noticeId, message, type } };
      },
    },
    clearNotice: () => null,
  },
});

export const { showNotice, clearNotice } = noticeSlice.actions;
export default noticeSlice.reducer;
