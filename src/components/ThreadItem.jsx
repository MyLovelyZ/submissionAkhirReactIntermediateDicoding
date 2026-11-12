import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import { threadShape } from '../utils/shapes';
import { toPlainText } from '../utils/text';
import UserBadge from './UserBadge';
import VoteButtons from './VoteButtons';

function ThreadItem({
  thread, authUserId = undefined, onVote, onSelectCategory,
}) {
  return (
    <article className="card thread-item">
      <button
        type="button"
        className="tag"
        onClick={() => onSelectCategory(thread.category)}
        title="Filter berdasarkan kategori ini"
      >
        #
        {thread.category}
      </button>
      <h2 className="thread-item__title">
        <Link to={`/threads/${thread.id}`}>{thread.title}</Link>
      </h2>
      <p className="thread-item__excerpt">{toPlainText(thread.body)}</p>
      <div className="thread-item__footer">
        <UserBadge user={thread.owner} createdAt={thread.createdAt} size={32} />
        <div className="thread-item__meta">
          <VoteButtons
            upVotesBy={thread.upVotesBy}
            downVotesBy={thread.downVotesBy}
            authUserId={authUserId}
            onVote={(vote) => onVote(thread.id, vote)}
          />
          <Link className="comment-count" to={`/threads/${thread.id}`}>
            {`💬 ${thread.totalComments ?? 0} komentar`}
          </Link>
        </div>
      </div>
    </article>
  );
}

ThreadItem.propTypes = {
  thread: threadShape.isRequired,
  authUserId: PropTypes.string,
  onVote: PropTypes.func.isRequired,
  onSelectCategory: PropTypes.func.isRequired,
};

export default ThreadItem;
