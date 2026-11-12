import PropTypes from 'prop-types';
import { threadShape } from '../utils/shapes';
import ThreadItem from './ThreadItem';

function ThreadList({
  threads, authUserId = undefined, onVote, onSelectCategory,
}) {
  if (threads.length === 0) {
    return <p className="empty">Belum ada thread untuk ditampilkan.</p>;
  }

  return (
    <div className="stack">
      {threads.map((thread) => (
        <ThreadItem
          key={thread.id}
          thread={thread}
          authUserId={authUserId}
          onVote={onVote}
          onSelectCategory={onSelectCategory}
        />
      ))}
    </div>
  );
}

ThreadList.propTypes = {
  threads: PropTypes.arrayOf(threadShape).isRequired,
  authUserId: PropTypes.string,
  onVote: PropTypes.func.isRequired,
  onSelectCategory: PropTypes.func.isRequired,
};

export default ThreadList;
