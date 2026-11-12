import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  Navigate, Outlet, Route, Routes,
} from 'react-router-dom';
import Header from './components/Header';
import Loading from './components/Loading';
import Notice from './components/Notice';
import Spinner from './components/Spinner';
import DetailPage from './pages/DetailPage';
import HomePage from './pages/HomePage';
import LeaderboardPage from './pages/LeaderboardPage';
import LoginPage from './pages/LoginPage';
import NewThreadPage from './pages/NewThreadPage';
import RegisterPage from './pages/RegisterPage';
import { asyncLogout, asyncPreloadAuth } from './states/authUser';

function RequireAuth() {
  const authUser = useSelector((state) => state.authUser.user);
  return authUser ? <Outlet /> : <Navigate to="/login" replace />;
}

function GuestOnly() {
  const authUser = useSelector((state) => state.authUser.user);
  return authUser ? <Navigate to="/" replace /> : <Outlet />;
}

function App() {
  const dispatch = useDispatch();
  const { user, isPreloading } = useSelector((state) => state.authUser);

  useEffect(() => {
    dispatch(asyncPreloadAuth());
  }, [dispatch]);

  return (
    <>
      <Loading />
      <Notice />
      <Header authUser={user} onLogout={() => dispatch(asyncLogout())} />
      <main className="container main">
        {isPreloading ? (
          <Spinner />
        ) : (
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/threads/:id" element={<DetailPage />} />
            <Route path="/leaderboards" element={<LeaderboardPage />} />
            <Route element={<GuestOnly />}>
              <Route path="/login" element={<LoginPage />} />
              <Route path="/register" element={<RegisterPage />} />
            </Route>
            <Route element={<RequireAuth />}>
              <Route path="/new" element={<NewThreadPage />} />
            </Route>
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        )}
      </main>
    </>
  );
}

export default App;
