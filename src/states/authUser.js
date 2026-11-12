import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import {
  forumApi, putAccessToken, removeAccessToken, getAccessToken,
} from '../api/forumApi';
import { showNotice } from './notice';

const authUserSlice = createSlice({
  name: 'authUser',
  initialState: { user: null, isPreloading: true },
  reducers: {
    setAuthUser: (state, action) => {
      state.user = action.payload;
    },
    finishPreload: (state) => {
      state.isPreloading = false;
    },
  },
});

export const { setAuthUser, finishPreload } = authUserSlice.actions;

export const asyncPreloadAuth = createAsyncThunk('auth/preload', async (_, { dispatch }) => {
  try {
    if (getAccessToken()) {
      dispatch(setAuthUser(await forumApi.getOwnProfile()));
    }
  } catch {
    removeAccessToken();
  } finally {
    dispatch(finishPreload());
  }
});

export const asyncRegister = createAsyncThunk('auth/register', async (payload, { dispatch }) => {
  try {
    await forumApi.register(payload);
    dispatch(showNotice('Akun berhasil dibuat. Silakan masuk.', 'success'));
    return true;
  } catch (error) {
    dispatch(showNotice(error.message));
    return false;
  }
});

export const asyncLogin = createAsyncThunk('auth/login', async (payload, { dispatch }) => {
  try {
    putAccessToken(await forumApi.login(payload));
    dispatch(setAuthUser(await forumApi.getOwnProfile()));
    return true;
  } catch (error) {
    dispatch(showNotice(error.message));
    return false;
  }
});

export const asyncLogout = createAsyncThunk('auth/logout', async (_, { dispatch }) => {
  removeAccessToken();
  dispatch(setAuthUser(null));
});

export default authUserSlice.reducer;
