import PropTypes from 'prop-types';
import { getVote } from '../utils/vote';

function Arrow({ direction }) {
  return (
    <svg viewBox="0 0 24 24" width="16" height="16" aria-hidden="true">
      <path
        d={direction === 'up' ? 'M12 4l9 15H3z' : 'M12 20L3 5h18z'}
        fill="currentColor"
      />
    </svg>
  );
}

Arrow.propTypes = {
  direction: PropTypes.oneOf(['up', 'down']).isRequired,
};

function VoteButtons({
  upVotesBy, downVotesBy, authUserId = undefined, onVote,
}) {
  const current = getVote({ upVotesBy, downVotesBy }, authUserId);

  return (
    <div className="votes">
      <button
        type="button"
        className={`vote vote--up${current === 'up' ? ' is-active' : ''}`}
        aria-pressed={current === 'up'}
        aria-label={`Upvote, ${upVotesBy.length} suara`}
        onClick={() => onVote('up')}
      >
        <Arrow direction="up" />
        <span>{upVotesBy.length}</span>
      </button>
      <button
        type="button"
        className={`vote vote--down${current === 'down' ? ' is-active' : ''}`}
        aria-pressed={current === 'down'}
        aria-label={`Downvote, ${downVotesBy.length} suara`}
        onClick={() => onVote('down')}
      >
        <Arrow direction="down" />
        <span>{downVotesBy.length}</span>
      </button>
    </div>
  );
}

VoteButtons.propTypes = {
  upVotesBy: PropTypes.arrayOf(PropTypes.string).isRequired,
  downVotesBy: PropTypes.arrayOf(PropTypes.string).isRequired,
  authUserId: PropTypes.string,
  onVote: PropTypes.func.isRequired,
};

export default VoteButtons;
