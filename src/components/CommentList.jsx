import PropTypes from 'prop-types';
import { commentShape } from '../utils/shapes';
import CommentItem from './CommentItem';

function CommentList({ comments, authUserId = undefined, onVote }) {
  if (comments.length === 0) {
    return <p className="empty">Belum ada komentar. Jadilah yang pertama!</p>;
  }

  return (
    <ul className="stack comment-list">
      {comments.map((comment) => (
        <CommentItem
          key={comment.id}
          comment={comment}
          authUserId={authUserId}
          onVote={onVote}
        />
      ))}
    </ul>
  );
}

CommentList.propTypes = {
  comments: PropTypes.arrayOf(commentShape).isRequired,
  authUserId: PropTypes.string,
  onVote: PropTypes.func.isRequired,
};

export default CommentList;
