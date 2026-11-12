const UNITS = [
  ['year', 31536000],
  ['month', 2592000],
  ['day', 86400],
  ['hour', 3600],
  ['minute', 60],
];

const formatter = new Intl.RelativeTimeFormat('id', { numeric: 'auto' });

export function postedAt(date) {
  const diffInSeconds = (new Date(date).getTime() - Date.now()) / 1000;
  const match = UNITS.find(([, seconds]) => Math.abs(diffInSeconds) >= seconds);
  if (!match) return 'baru saja';
  const [unit, seconds] = match;
  return formatter.format(Math.round(diffInSeconds / seconds), unit);
}

export function fullDate(date) {
  return new Date(date).toLocaleString('id-ID', { dateStyle: 'long', timeStyle: 'short' });
}
