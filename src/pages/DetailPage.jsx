import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link, useParams } from 'react-router-dom';
import CommentInput from '../components/CommentInput';
import CommentList from '../components/CommentList';
import Spinner from '../components/Spinner';
import ThreadDetail from '../components/ThreadDetail';
import {
  asyncAddComment, asyncGetThreadDetail, asyncVoteComment, clearThreadDetail,
} from '../states/threadDetail';
import { asyncVoteThread } from '../states/threads';

function DetailPage() {
  const { id } = useParams();
  const dispatch = useDispatch();
  const thread = useSelector((state) => state.threadDetail.thread);
  const authUser = useSelector((state) => state.authUser.user);

  useEffect(() => {
    dispatch(asyncGetThreadDetail(id));
    return () => {
      dispatch(clearThreadDetail());
    };
  }, [id, dispatch]);

  if (!thread) return <Spinner />;

  return (
    <section className="stack">
      <Link to="/" className="back-link">← Kembali ke daftar</Link>
      <ThreadDetail
        thread={thread}
        authUserId={authUser?.id}
        onVote={(threadId, vote) => dispatch(asyncVoteThread({ threadId, vote }))}
      />
      <h2>{`Komentar (${thread.comments.length})`}</h2>
      <CommentInput
        isLoggedIn={Boolean(authUser)}
        onSubmit={(content) => dispatch(asyncAddComment({ threadId: thread.id, content })).unwrap()}
      />
      <CommentList
        comments={thread.comments}
        authUserId={authUser?.id}
        onVote={(commentId, vote) => dispatch(
          asyncVoteComment({ threadId: thread.id, commentId, vote }),
        )}
      />
    </section>
  );
}

export default DetailPage;
