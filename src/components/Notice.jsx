import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { clearNotice } from '../states/notice';

function Notice() {
  const notice = useSelector((state) => state.notice);
  const dispatch = useDispatch();

  useEffect(() => {
    if (!notice) return undefined;
    const timer = setTimeout(() => dispatch(clearNotice()), 4000);
    return () => clearTimeout(timer);
  }, [notice, dispatch]);

  if (!notice) return null;
  return (
    <div className={`toast toast--${notice.type}`} role="alert">
      <span>{notice.message}</span>
      <button type="button" aria-label="Tutup pemberitahuan" onClick={() => dispatch(clearNotice())}>
        ×
      </button>
    </div>
  );
}

export default Notice;
