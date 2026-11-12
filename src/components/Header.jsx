import PropTypes from 'prop-types';
import { NavLink, Link } from 'react-router-dom';
import { userShape } from '../utils/shapes';
import Avatar from './Avatar';

function Header({ authUser = undefined, onLogout }) {
  return (
    <header className="header">
      <div className="container header__inner">
        <Link to="/" className="brand">
          <span aria-hidden="true">💬</span>
          {' '}
          Warung Diskusi
        </Link>
        <nav className="nav" aria-label="Navigasi utama">
          <NavLink to="/" end>Beranda</NavLink>
          <NavLink to="/leaderboards">Leaderboard</NavLink>
        </nav>
        <div className="header__user">
          {authUser ? (
            <>
              <Avatar src={authUser.avatar} name={authUser.name} size={32} />
              <span className="header__name">{authUser.name}</span>
              <button type="button" className="btn btn--ghost" onClick={onLogout}>Keluar</button>
            </>
          ) : (
            <>
              <Link className="btn btn--ghost" to="/login">Masuk</Link>
              <Link className="btn btn--primary" to="/register">Daftar</Link>
            </>
          )}
        </div>
      </div>
    </header>
  );
}

Header.propTypes = {
  authUser: userShape,
  onLogout: PropTypes.func.isRequired,
};

export default Header;
