// @flow

// npx babel-node ./examples/math
// or watch:
// npx babel-watch ./examples/math

import { clamp, simplify, nthroot } from '../src/math';

/**
 * Flow errors
 */

// clamp('a');
// => NaN

// clamp('a', 'b', 'c');
// => NaN

/**
 * Flow works
 */



console.log(

  // clamp(122, 2, 22),
  // => 22

  // simplify(1024 * 4, 1024, ['B', 'KB', 'GB', 'MB']),
  // => 4Kb

  // simplify(100999, 1000, ['', 'E', 'M', 'Mrd']),
  // => 101E

  simplify(-1999, 1000, ['', 'E', 'M', 'Mrd']),
  // => -2E

);
