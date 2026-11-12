import { useEffect, useMemo } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import CategoryFilter from '../components/CategoryFilter';
import Spinner from '../components/Spinner';
import ThreadList from '../components/ThreadList';
import { asyncPopulateThreads, asyncVoteThread, setCategory } from '../states/threads';

function HomePage() {
  const dispatch = useDispatch();
  const { items, category } = useSelector((state) => state.threads);
  const users = useSelector((state) => state.users);
  const authUser = useSelector((state) => state.authUser.user);
  const isLoading = useSelector((state) => state.loading > 0);

  useEffect(() => {
    dispatch(asyncPopulateThreads());
  }, [dispatch]);

  const categories = useMemo(
    () => [...new Set(items.map((thread) => thread.category))].sort(),
    [items],
  );

  const threads = useMemo(
    () => items
      .filter((thread) => !category || thread.category === category)
      .map((thread) => ({ ...thread, owner: users.find((user) => user.id === thread.ownerId) })),
    [items, users, category],
  );

  return (
    <section>
      <div className="page-head">
        <div>
          <h1>Diskusi terbaru</h1>
          <p className="muted">Tanya, jawab, dan berbagi bersama komunitas.</p>
        </div>
        <Link to="/new" className="btn btn--primary">+ Buat thread</Link>
      </div>

      <CategoryFilter
        categories={categories}
        selected={category}
        onSelect={(value) => dispatch(setCategory(value))}
      />

      {isLoading && items.length === 0 ? (
        <Spinner />
      ) : (
        <ThreadList
          threads={threads}
          authUserId={authUser?.id}
          onVote={(threadId, vote) => dispatch(asyncVoteThread({ threadId, vote }))}
          onSelectCategory={(value) => dispatch(setCategory(value))}
        />
      )}
    </section>
  );
}

export default HomePage;
