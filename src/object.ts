/**
 * @fileOverview Object utilities
 * @namespace object
 */

import diffValues from './object/diffValues';
import flattenMessages from './object/flattenMessages';
import serialize from './object/serialize';
import stringify from './object/stringify';

export type { DiffEntry } from './object/diffValues';

export {
  diffValues,
  flattenMessages,
  serialize,
  stringify,
};

export default {
  diffValues,
  flattenMessages,
  serialize,
  stringify,
};
