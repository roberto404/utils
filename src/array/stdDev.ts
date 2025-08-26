/**
 * Function returns the standard deviation of an array of numbers.
 * Standard deviation is the square root of variance, showing dispersion in original units.
 *
 * @since 5.4.0
 * @static
 * @memberof array
 * @param  {Array<number>} array The array to inspect.
 * @return {number|null} The standard deviation or null if array is empty.
 * @example
 *
 * stdDev([2,4,4,4,5,5,7,9]);
 * // => 2
 */
const stdDev = (array: Array<number>): number | null => {
  if (!array.length) return null;

  const mean = array.reduce((sum, num) => sum + num, 0) / array.length;
  const squaredDiffs = array.map(num => Math.pow(num - mean, 2));
  const variance = squaredDiffs.reduce((sum, val) => sum + val, 0) / array.length;
  return Math.sqrt(variance);
};

export default stdDev;