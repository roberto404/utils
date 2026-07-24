/**
 * @fileOverview Pick a time-axis granularity from a date range.
 *
 * Drives the dynamic period selector (CalendarCarousel): a short range is
 * browsed by day, a medium one by month, a long one by year.
 *
 * @namespace date
 */

export type Granularity = 'day' | 'month' | 'year';

type DateLike = Date | number | string;

const DAY_MS = 24 * 60 * 60 * 1000;

/**
 * Up to this many days the range is shown day by day.
 */
export const DAY_MAX_DAYS = 14;

/**
 * Up to this many days (~24 months) the range is shown month by month; above it,
 * year by year.
 */
export const MONTH_MAX_DAYS = 730;

const toMs = (date: DateLike): number =>
  (date instanceof Date ? date.getTime() : new Date(date).getTime());

/**
 * Granularity for a `[start, end]` range.
 *
 * @since 5.6.0
 * @static
 * @memberof date
 * @example
 * granularityFromRange('2025-06-01', '2025-06-07'); // => 'day'
 * granularityFromRange('2025-01-01', '2025-08-01'); // => 'month'
 * granularityFromRange('2019-01-01', '2025-01-01'); // => 'year'
 */
const granularityFromRange = (start: DateLike, end: DateLike): Granularity => {
  const days = Math.abs(toMs(end) - toMs(start)) / DAY_MS;

  if (days <= DAY_MAX_DAYS) {
    return 'day';
  }

  if (days <= MONTH_MAX_DAYS) {
    return 'month';
  }

  return 'year';
};

/**
 * Granularity spanning a list of dates (uses their min & max).
 */
export const granularityFromDates = (dates: DateLike[] = []): Granularity => {
  if (dates.length < 2) {
    return 'day';
  }

  const times = dates.map(toMs);

  return granularityFromRange(Math.min(...times), Math.max(...times));
};

export default granularityFromRange;
