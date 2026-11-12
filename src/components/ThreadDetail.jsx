import PropTypes from 'prop-types';
import { threadShape } from '../utils/shapes';
import HtmlContent from './HtmlContent';
import UserBadge from './UserBadge';
import VoteButtons from './VoteButtons';

function ThreadDetail({ thread, authUserId = undefined, onVote }) {
  return (
    <article className="card thread-detail">
      <span className="tag tag--static">
        #
        {thread.category}
      </span>
      <h1>{thread.title}</h1>
      <UserBadge user={thread.owner} createdAt={thread.createdAt} size={44} />
      <HtmlContent html={thread.body} />
      <VoteButtons
        upVotesBy={thread.upVotesBy}
        downVotesBy={thread.downVotesBy}
        authUserId={authUserId}
        onVote={(vote) => onVote(thread.id, vote)}
      />
    </article>
  );
}

ThreadDetail.propTypes = {
  thread: threadShape.isRequired,
  authUserId: PropTypes.string,
  onVote: PropTypes.func.isRequired,
};

export default ThreadDetail;
