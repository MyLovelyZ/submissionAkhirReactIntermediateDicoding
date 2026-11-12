import PropTypes from 'prop-types';
import useInput from '../hooks/useInput';

function ThreadInput({ onSubmit }) {
  const [title, onTitleChange] = useInput();
  const [category, onCategoryChange] = useInput('general');
  const [body, onBodyChange] = useInput();

  const handleSubmit = (event) => {
    event.preventDefault();
    onSubmit({
      title: title.trim(),
      category: category.trim().toLowerCase(),
      body: body.trim(),
    });
  };

  return (
    <form className="card form" onSubmit={handleSubmit}>
      <label htmlFor="thread-title">
        Judul
        <input
          id="thread-title"
          type="text"
          placeholder="Apa yang ingin kamu diskusikan?"
          value={title}
          onChange={onTitleChange}
          required
        />
      </label>
      <label htmlFor="thread-category">
        Kategori
        <input
          id="thread-category"
          type="text"
          placeholder="contoh: redux"
          value={category}
          onChange={onCategoryChange}
        />
      </label>
      <label htmlFor="thread-body">
        Isi thread
        <textarea
          id="thread-body"
          rows="8"
          placeholder="Ceritakan lebih lengkap…"
          value={body}
          onChange={onBodyChange}
          required
        />
      </label>
      <button type="submit" className="btn btn--primary">Terbitkan thread</button>
    </form>
  );
}

ThreadInput.propTypes = {
  onSubmit: PropTypes.func.isRequired,
};

export default ThreadInput;
