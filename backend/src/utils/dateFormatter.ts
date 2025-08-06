export function formatDateToSQL(date: Date): string {
  return date.toISOString().slice(0, 19).replace('T', ' ');
}