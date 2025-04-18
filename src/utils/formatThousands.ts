export function formatThousands(cents: number): string {
  const dollars = cents / 100;
  if (Math.abs(dollars) < 1000) return Math.round(dollars).toString();
  const hundreds = Math.round(dollars / 100);
  return `${hundreds / 10}k`;
}
