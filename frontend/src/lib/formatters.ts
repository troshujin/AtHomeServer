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
