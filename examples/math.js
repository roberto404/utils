// @flow

// npx babel-node ./examples/math
// or watch:
// npx babel-watch ./examples/math

import { clamp } from '../src/math';

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

clamp(122, 2, 22);
// => 22
