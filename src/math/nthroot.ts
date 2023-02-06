/**
 * nth root function is a missing Math method
 * Math.sqrt(4) = Math.nthroot(4,2)
 *
 * @since 3.11.0
 * @static
 * @memberof math
 * @param  {int} value under root value
 * @param  {int} nth   on root value
 * @return {int}       result
 * @example
 *
 * nthroot(8, 3);
 * // => 2
 * // => 2 * 2 * 2 = 8
 */
const nthroot = (
  value: number,
  nth: number,
): number =>
  Math.exp((1 / nth) * Math.log(value));

export default nthroot;
