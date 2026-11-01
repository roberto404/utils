/**
 * @fileOverview Date / time utilities
 * @namespace date
 */

import calculateAge from './date/calculateAge';
import formatLogDay from './date/formatLogDay';
import granularityFromRange, {
  granularityFromDates, DAY_MAX_DAYS, MONTH_MAX_DAYS,
} from './date/granularityFromRange';

export type { Granularity } from './date/granularityFromRange';

export {
  calculateAge,
  formatLogDay,
  granularityFromRange,
  granularityFromDates,
  DAY_MAX_DAYS,
  MONTH_MAX_DAYS,
};

export default {
  calculateAge,
  formatLogDay,
  granularityFromRange,
  granularityFromDates,
  DAY_MAX_DAYS,
  MONTH_MAX_DAYS,
};
