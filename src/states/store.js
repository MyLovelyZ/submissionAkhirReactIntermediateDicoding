import { configureStore } from '@reduxjs/toolkit';
import authUser from './authUser';
import leaderboards from './leaderboards';
import loading from './loading';
import notice from './notice';
import threadDetail from './threadDetail';
import threads from './threads';
import users from './users';

const store = configureStore({
  reducer: {
    authUser, users, threads, threadDetail, leaderboards, loading, notice,
  },
});

export default store;
