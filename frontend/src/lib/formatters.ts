export const formatDate = (
  date: Date | null,
  locale: string = 'nl-NL',
  options?: Intl.DateTimeFormatOptions,
): string => {
  if (!date) return 'N/A';
  const defaultOptions: Intl.DateTimeFormatOptions = {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
  };
  return new Intl.DateTimeFormat(locale, options || defaultOptions).format(date);
};

export const formatDateShort = (date: Date | null, locale: string = 'nl-NL'): string => {
  return formatDate(date, locale, {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
};

export const formatTime = (date: Date, locale: string = 'nl-NL'): string => {
  return new Intl.DateTimeFormat(locale, { hour: '2-digit', minute: '2-digit' }).format(date);
};

export const formatTimeRange = (start: Date, end: Date, locale: string = 'nl-NL'): string => {
  return `${formatTime(start, locale)}–${formatTime(end, locale)}`;
};

export const formatDuration = (start: Date, end: Date): string => {
  const totalMinutes = Math.max(0, Math.round((end.getTime() - start.getTime()) / 60000));
  const hours = Math.floor(totalMinutes / 60);
  const minutes = totalMinutes % 60;
  if (hours === 0) return `${minutes}m`;
  if (minutes === 0) return `${hours}h`;
  return `${hours}h ${minutes}m`;
};
