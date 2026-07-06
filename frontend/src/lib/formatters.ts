// A displayable name for an identity whose username may be missing (the
// `/me` UserProxy shape) - falls back through real name and email.
export const formatUserName = (user: {
  username?: string | null;
  firstName?: string | null;
  lastName?: string | null;
  email?: string | null;
}): string => {
  if (user.username) return user.username;
  const realName = [user.firstName, user.lastName].filter(Boolean).join(' ');
  return realName || user.email || 'Me';
};

// Volume-style kg figures: locale thousands separators ("1.234,5").
export const formatKg = (value: number, locale: string = 'nl-NL'): string =>
  new Intl.NumberFormat(locale).format(value);

// Single-weight kg figures: compact, half-kg aware ("80" / "80.5").
export const formatWeight = (value: number): string =>
  Number.isInteger(value) ? String(value) : value.toFixed(1);

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

// A null end means "still going" - shown as an open-ended range.
export const formatTimeRange = (start: Date, end: Date | null, locale: string = 'nl-NL'): string => {
  return end ? `${formatTime(start, locale)}–${formatTime(end, locale)}` : `${formatTime(start, locale)}–…`;
};

// A null end means "still going" - the duration elapsed so far.
export const formatDuration = (start: Date, end: Date | null): string => {
  const effectiveEnd = end ?? new Date();
  const totalMinutes = Math.max(0, Math.round((effectiveEnd.getTime() - start.getTime()) / 60000));
  const hours = Math.floor(totalMinutes / 60);
  const minutes = totalMinutes % 60;
  if (hours === 0) return `${minutes}m`;
  if (minutes === 0) return `${hours}h`;
  return `${hours}h ${minutes}m`;
};
