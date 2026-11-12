import PropTypes from 'prop-types';
import { commentShape } from '../utils/shapes';
import HtmlContent from './HtmlContent';
import UserBadge from './UserBadge';
import VoteButtons from './VoteButtons';

function CommentItem({ comment, authUserId = undefined, onVote }) {
  return (
    <li className="card comment">
      <UserBadge user={comment.owner} createdAt={comment.createdAt} size={36} />
      <HtmlContent html={comment.content} />
      <VoteButtons
        upVotesBy={comment.upVotesBy}
        downVotesBy={comment.downVotesBy}
        authUserId={authUserId}
        onVote={(vote) => onVote(comment.id, vote)}
      />
    </li>
  );
}

CommentItem.propTypes = {
  comment: commentShape.isRequired,
  authUserId: PropTypes.string,
  onVote: PropTypes.func.isRequired,
};

export default CommentItem;
