import { intervalToDuration } from 'date-fns';

/**
 * Get a human-readable duration string between two dates.
 * Example: "1 month and 5 days"
 */
export const getDurationString = (startDate, endDate) => {
  if (!startDate || !endDate) return '';

  const duration = intervalToDuration({
    start: new Date(startDate),
    end: new Date(endDate)
  });

  const { years, months, days } = duration;

  const parts = [];

  if (years) parts.push(`${years} year${years > 1 ? 's' : ''}`);
  if (months) parts.push(`${months} month${months > 1 ? 's' : ''}`);
  if (days) parts.push(`${days} day${days > 1 ? 's' : ''}`);

  // Only return values that are > 0
  if (parts.length === 0) return '0 days';

  return parts.join(' and ');
};
