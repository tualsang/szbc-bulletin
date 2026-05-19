export function addDays(iso: string, days: number): string {
  const [y, m, d] = iso.split('-').map(Number);
  const dt = new Date(Date.UTC(y, m - 1, d));
  dt.setUTCDate(dt.getUTCDate() + days);
  return dt.toISOString().slice(0, 10);
}

export function getUpcomingSunday(today: Date = new Date()): string {
  const dt = new Date(Date.UTC(today.getFullYear(), today.getMonth(), today.getDate()));
  const dow = dt.getUTCDay(); // 0 = Sunday
  const offset = (7 - dow) % 7;
  dt.setUTCDate(dt.getUTCDate() + offset);
  return dt.toISOString().slice(0, 10);
}

const MONTHS = [
  'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December',
];
const DAYS = [
  'Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday',
];

/** "17 May 2026" — the format used in the printed bulletin header. */
export function formatDateShort(iso: string): string {
  const [y, m, d] = iso.split('-').map(Number);
  const dt = new Date(Date.UTC(y, m - 1, d));
  return `${dt.getUTCDate()} ${MONTHS[dt.getUTCMonth()]} ${dt.getUTCFullYear()}`;
}

/** "May 17, 2026" — for the form UI subtitles. */
export function formatDate(iso: string, opts: { withDay?: boolean } = {}): string {
  const [y, m, d] = iso.split('-').map(Number);
  const dt = new Date(Date.UTC(y, m - 1, d));
  const base = `${MONTHS[dt.getUTCMonth()]} ${dt.getUTCDate()}, ${dt.getUTCFullYear()}`;
  if (opts.withDay) return `${DAYS[dt.getUTCDay()]}, ${base}`;
  return base;
}

export function dayName(iso: string): string {
  const [y, m, d] = iso.split('-').map(Number);
  return DAYS[new Date(Date.UTC(y, m - 1, d)).getUTCDay()];
}
