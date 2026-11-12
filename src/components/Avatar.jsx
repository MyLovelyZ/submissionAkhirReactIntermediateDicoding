import PropTypes from 'prop-types';

function Avatar({ src = undefined, name, size = 40 }) {
  const fallback = `https://ui-avatars.com/api/?name=${encodeURIComponent(name)}&background=random`;
  return (
    <img
      className="avatar"
      src={src || fallback}
      alt={`Avatar ${name}`}
      width={size}
      height={size}
      loading="lazy"
    />
  );
}

Avatar.propTypes = {
  src: PropTypes.string,
  name: PropTypes.string.isRequired,
  size: PropTypes.number,
};

export default Avatar;
