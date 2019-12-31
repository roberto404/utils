// @flow

/**
 * @fileOverview Mathematical utilities
 * @namespace math
 */

import clamp from './math/clamp';
import nthroot from './math/nthroot';
import simplify from './math/simplify';
import gcd from './math/gcd';
import { remToPix } from './math/px';

export { clamp, nthroot, simplify, gcd, remToPix };

export default
{
  clamp,
  nthroot,
  simplify,
  gcd,
  remToPix,
};
