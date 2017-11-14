// @flow

/**
 * @fileOverview Array utilities
 * Export not working in [array].js
 * @namespace array
 */

import count from './array/count';
import countUnique from './array/countUnique';
import unique from './array/unique';
import sort from './array/sort';

// not working use:
// import ArrayMethods from 'utils/array'
//
export const lib = {
  count,
  countUnique,
  unique,
  sort,
};

export default lib;
