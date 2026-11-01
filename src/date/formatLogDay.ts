/**
 * @fileOverview Day label of a log / history entry (group title of the change list).
 *
 * @namespace date
 */

type DateLike = Date | number | string;

type Options = {
  // "Ma" / "Tegnap" for today / yesterday
  relative?: boolean,
};

// moment `hu` monthsShort (same as the former `MMM Do` labels)
const MONTHS = ['jan.', 'feb.', 'márc.', 'ápr.', 'máj.', 'jún.', 'júl.', 'aug.', 'szept.', 'okt.', 'nov.', 'dec.'];

const DATETIME = /^(\d{4})-(\d{2})-(\d{2})(?:[ T](\d{2}):(\d{2})(?::(\d{2}))?)?/;

/**
 * Local date: "YYYY-MM-DD HH:mm:ss" is parsed by hand (not every browser accepts the space)
 */
const toDate = (date: DateLike): Date | null => {
  if (date instanceof Date) {
    return Number.isNaN(date.getTime()) ? null : date;
  }

  if (typeof date === 'string') {
    const match = DATETIME.exec(date);

    if (match) {
      const [, year, month, day, hour = '0', minute = '0', second = '0'] = match;

      return new Date(+year, +month - 1, +day, +hour, +minute, +second);
    }
  }

  const parsed = new Date(date as any);

  return Number.isNaN(parsed.getTime()) ? null : parsed;
};

const isSameDay = (a: Date, b: Date) =>
  a.getFullYear() === b.getFullYear() && a.getMonth() === b.getMonth() && a.getDate() === b.getDate();

/**
 * "okt. 31." in the current year, "2025. okt. 31." before (or after) it.
 * The label is also the group key, so different years never merge into one day.
 *
 * @example
 * formatLogDay('2026-10-12 08:30:00', new Date(2026, 9, 31)) // => 'okt. 12.'
 * formatLogDay('2025-10-12 08:30:00', new Date(2026, 9, 31)) // => '2025. okt. 12.'
 * formatLogDay('2026-10-31 08:30:00', new Date(2026, 9, 31), { relative: true }) // => 'Ma'
 */
const formatLogDay = (date: DateLike, now: DateLike = new Date(), { relative = false }: Options = {}): string => {
  const day = toDate(date);
  const today = toDate(now) || new Date();

  if (!day) {
    return '';
  }

  if (relative) {
    const yesterday = new Date(today.getFullYear(), today.getMonth(), today.getDate() - 1);

    if (isSameDay(day, today)) {
      return 'Ma';
    }

    if (isSameDay(day, yesterday)) {
      return 'Tegnap';
    }
  }

  const label = `${MONTHS[day.getMonth()]} ${day.getDate()}.`;

  return day.getFullYear() === today.getFullYear() ? label : `${day.getFullYear()}. ${label}`;
};

export default formatLogDay;
