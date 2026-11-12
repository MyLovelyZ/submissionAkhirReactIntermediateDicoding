import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import LeaderboardItem from '../components/LeaderboardItem';
import Spinner from '../components/Spinner';
import { asyncGetLeaderboards } from '../states/leaderboards';

function LeaderboardPage() {
  const dispatch = useDispatch();
  const leaderboards = useSelector((state) => state.leaderboards);
  const isLoading = useSelector((state) => state.loading > 0);

  useEffect(() => {
    dispatch(asyncGetLeaderboards());
  }, [dispatch]);

  return (
    <section className="stack">
      <div className="page-head">
        <div>
          <h1>Leaderboard</h1>
          <p className="muted">Pengguna paling aktif di Warung Diskusi.</p>
        </div>
      </div>
      {isLoading && leaderboards.length === 0 && <Spinner />}
      <ol className="stack leaderboard">
        {leaderboards.map(({ user, score }, index) => (
          <LeaderboardItem key={user.id} user={user} score={score} rank={index + 1} />
        ))}
      </ol>
    </section>
  );
}

export default LeaderboardPage;
