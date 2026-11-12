import PropTypes from 'prop-types';
import { userShape } from '../utils/shapes';
import Avatar from './Avatar';

function LeaderboardItem({ user, score, rank }) {
  return (
    <li className={`card leaderboard-item${rank <= 3 ? ` is-top rank-${rank}` : ''}`}>
      <span className="leaderboard-item__rank">{rank}</span>
      <Avatar src={user.avatar} name={user.name} size={44} />
      <strong className="leaderboard-item__name">{user.name}</strong>
      <span className="leaderboard-item__score">
        {score}
        <small> poin</small>
      </span>
    </li>
  );
}

LeaderboardItem.propTypes = {
  user: userShape.isRequired,
  score: PropTypes.number.isRequired,
  rank: PropTypes.number.isRequired,
};

export default LeaderboardItem;
