import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import useInput from '../hooks/useInput';

function LoginInput({ onLogin }) {
  const [email, onEmailChange] = useInput();
  const [password, onPasswordChange] = useInput();

  const handleSubmit = (event) => {
    event.preventDefault();
    onLogin({ email, password });
  };

  return (
    <form className="card form form--narrow" onSubmit={handleSubmit}>
      <h1>Masuk</h1>
      <label htmlFor="login-email">
        Email
        <input
          id="login-email"
          type="email"
          autoComplete="email"
          value={email}
          onChange={onEmailChange}
          required
        />
      </label>
      <label htmlFor="login-password">
        Password
        <input
          id="login-password"
          type="password"
          autoComplete="current-password"
          value={password}
          onChange={onPasswordChange}
          required
        />
      </label>
      <button type="submit" className="btn btn--primary">Masuk</button>
      <p className="form__hint">
        Belum punya akun?
        {' '}
        <Link to="/register">Daftar</Link>
      </p>
    </form>
  );
}

LoginInput.propTypes = {
  onLogin: PropTypes.func.isRequired,
};

export default LoginInput;
