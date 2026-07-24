/**
 * @fileOverview Date / time utilities
 * @namespace date
 */

import calculateAge from './date/calculateAge';
import granularityFromRange, {
  granularityFromDates, DAY_MAX_DAYS, MONTH_MAX_DAYS,
} from './date/granularityFromRange';

export type { Granularity } from './date/granularityFromRange';

export {
  calculateAge,
  granularityFromRange,
  granularityFromDates,
  DAY_MAX_DAYS,
  MONTH_MAX_DAYS,
};

export default {
  calculateAge,
  granularityFromRange,
  granularityFromDates,
  DAY_MAX_DAYS,
  MONTH_MAX_DAYS,
};
