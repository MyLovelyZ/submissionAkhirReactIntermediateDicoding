import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import useInput from '../hooks/useInput';

function RegisterInput({ onRegister }) {
  const [name, onNameChange] = useInput();
  const [email, onEmailChange] = useInput();
  const [password, onPasswordChange] = useInput();

  const handleSubmit = (event) => {
    event.preventDefault();
    onRegister({ name: name.trim(), email, password });
  };

  return (
    <form className="card form form--narrow" onSubmit={handleSubmit}>
      <h1>Buat akun</h1>
      <label htmlFor="register-name">
        Nama
        <input
          id="register-name"
          type="text"
          autoComplete="name"
          value={name}
          onChange={onNameChange}
          required
        />
      </label>
      <label htmlFor="register-email">
        Email
        <input
          id="register-email"
          type="email"
          autoComplete="email"
          value={email}
          onChange={onEmailChange}
          required
        />
      </label>
      <label htmlFor="register-password">
        Password (minimal 6 karakter)
        <input
          id="register-password"
          type="password"
          autoComplete="new-password"
          minLength={6}
          value={password}
          onChange={onPasswordChange}
          required
        />
      </label>
      <button type="submit" className="btn btn--primary">Daftar</button>
      <p className="form__hint">
        Sudah punya akun?
        {' '}
        <Link to="/login">Masuk</Link>
      </p>
    </form>
  );
}

RegisterInput.propTypes = {
  onRegister: PropTypes.func.isRequired,
};

export default RegisterInput;
