/**
 * Percentage change from the first to the last numeric value of an array.
 *
 * Returns a signed percentage (e.g. `0.44` for +0.44%). Falls back to `0` when
 * the array is empty or the base value is `0` (avoids dividing by zero).
 *
 * @since 5.6.0
 * @static
 * @memberof array
 * @param  {Array<number|string>} array  The array to inspect.
 * @param  {number} [digits]  optional rounding precision (decimals); unrounded when omitted
 * @return {number}
 * @example
 * percentChange([100, 130]);          // => 30
 * percentChange([0.7413, 0.7446], 2); // => 0.45
 */
const percentChange = (array: Array<number | string> = [], digits?: number): number => {
  if (array.length < 1) {
    return 0;
  }

  const base = Number(array[0]);
  const head = Number(array[array.length - 1]);

  if (isNaN(base) || isNaN(head) || base === 0) {
    return 0;
  }

  const change = ((head - base) / Math.abs(base)) * 100;

  if (typeof digits !== 'number') {
    return change;
  }

  const factor = 10 ** digits;

  return Math.round(change * factor) / factor;
};

export default percentChange;
