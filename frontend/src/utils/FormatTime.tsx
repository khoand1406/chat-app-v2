export function toLocalTime(date: string | Date, offsetHours = 7): Date {
  const d = new Date(date);
  return new Date(d.getTime() + offsetHours * 60 * 60 * 1000);
}

export function formatTime(
  date: string | Date,
  locale: string = "vi-VN",
  timeZone: string = "Asia/Ho_Chi_Minh"
): string {
  return new Date(date).toLocaleString(locale, { timeZone });
}

export function formatHourMinute(date: Date): string {
  const h = date.getHours();
  const m = date.getMinutes();
  return `${h}:${m.toString().padStart(2, "0")}`;
}