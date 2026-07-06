// Conversion helpers for `<input type="datetime-local">`, which is a
// different concern from lib/formatters.ts (locale-aware display strings):
// this is always the fixed, locale-independent `YYYY-MM-DDTHH:mm` the
// native input reads and writes.
const pad = (value: number): string => String(value).padStart(2, '0');

export const toDateTimeLocalValue = (date: Date): string => {
  const year = date.getFullYear();
  const month = pad(date.getMonth() + 1);
  const day = pad(date.getDate());
  const hours = pad(date.getHours());
  const minutes = pad(date.getMinutes());
  return `${year}-${month}-${day}T${hours}:${minutes}`;
};

export const fromDateTimeLocalValue = (value: string): Date => new Date(value);

export const toTimeInputValue = (date: Date): string => `${pad(date.getHours())}:${pad(date.getMinutes())}`;

// Combines a wall-clock "HH:mm" with a reference date, rolling over to the
// next day if the resulting time would land before the reference - lets a
// workout/exercise time range cross midnight without the input rejecting it.
export const applyTimeToDate = (reference: Date, time: string): Date => {
  const [hours, minutes] = time.split(':').map(Number);
  const result = new Date(reference);
  result.setHours(hours, minutes, 0, 0);
  if (result.getTime() < reference.getTime()) {
    result.setDate(result.getDate() + 1);
  }
  return result;
};
