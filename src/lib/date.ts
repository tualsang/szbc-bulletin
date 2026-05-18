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

export function formatDate(iso: string, opts: { withDay?: boolean } = {}): string {
  const [y, m, d] = iso.split('-').map(Number);
  const dt = new Date(Date.UTC(y, m - 1, d));
  const month = MONTHS[dt.getUTCMonth()];
  const day = dt.getUTCDate();
  const year = dt.getUTCFullYear();
  const base = `${month} ${day}, ${year}`;
  if (opts.withDay) return `${DAYS[dt.getUTCDay()]}, ${base}`;
  return base;
}

export function dayName(iso: string): string {
  const [y, m, d] = iso.split('-').map(Number);
  return DAYS[new Date(Date.UTC(y, m - 1, d)).getUTCDay()];
}
