import PropTypes from 'prop-types';
import { fullDate, postedAt } from '../utils/time';
import { userShape } from '../utils/shapes';
import Avatar from './Avatar';

function UserBadge({ user = undefined, createdAt, size = 40 }) {
  return (
    <div className="user-badge">
      <Avatar src={user?.avatar} name={user?.name ?? 'Pengguna'} size={size} />
      <div className="user-badge__text">
        <strong>{user?.name ?? 'Pengguna tidak dikenal'}</strong>
        <time dateTime={createdAt} title={fullDate(createdAt)}>{postedAt(createdAt)}</time>
      </div>
    </div>
  );
}

UserBadge.propTypes = {
  user: userShape,
  createdAt: PropTypes.string.isRequired,
  size: PropTypes.number,
};

export default UserBadge;
