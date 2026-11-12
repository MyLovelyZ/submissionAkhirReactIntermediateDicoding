import { useSelector } from 'react-redux';

function Loading() {
  const isLoading = useSelector((state) => state.loading > 0);

  if (!isLoading) return null;
  return <div className="loading-bar" role="progressbar" aria-label="Memuat data" />;
}

export default Loading;
