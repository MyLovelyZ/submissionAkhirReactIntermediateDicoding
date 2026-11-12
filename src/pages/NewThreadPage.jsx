import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import ThreadInput from '../components/ThreadInput';
import { asyncCreateThread } from '../states/threads';

function NewThreadPage() {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleSubmit = async (payload) => {
    const threadId = await dispatch(asyncCreateThread(payload)).unwrap();
    if (threadId) navigate(`/threads/${threadId}`);
  };

  return (
    <section className="stack">
      <h1>Buat thread baru</h1>
      <ThreadInput onSubmit={handleSubmit} />
    </section>
  );
}

export default NewThreadPage;
