export function formatMoney(raw: string): string {
  if (!raw) return '';
  const n = parseFloat(raw);
  if (isNaN(n)) return '';
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
  }).format(n);
}
