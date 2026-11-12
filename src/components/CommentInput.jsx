import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import useInput from '../hooks/useInput';

function CommentInput({ isLoggedIn, onSubmit }) {
  const [content, onContentChange, setContent] = useInput();

  if (!isLoggedIn) {
    return (
      <p className="card notice-card">
        <Link to="/login">Masuk</Link>
        {' '}
        untuk ikut berkomentar.
      </p>
    );
  }

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (await onSubmit(content.trim())) setContent('');
  };

  return (
    <form className="card form" onSubmit={handleSubmit}>
      <label htmlFor="comment-content">
        Tulis komentar
        <textarea
          id="comment-content"
          rows="4"
          placeholder="Bagikan pendapatmu…"
          value={content}
          onChange={onContentChange}
          required
        />
      </label>
      <button type="submit" className="btn btn--primary" disabled={!content.trim()}>
        Kirim komentar
      </button>
    </form>
  );
}

CommentInput.propTypes = {
  isLoggedIn: PropTypes.bool.isRequired,
  onSubmit: PropTypes.func.isRequired,
};

export default CommentInput;
