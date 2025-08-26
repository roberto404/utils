/**
 * Function returns the variance of an array of numbers.
 * Variance measures how far values in the dataset are spread out from the mean.
 *
 * @since 5.4.0
 * @static
 * @memberof array
 * @param  {Array<number>} array The array to inspect.
 * @return {number|null} The variance or null if the array is empty.
 * @example
 *
 * variance([2,4,4,4,5,5,7,9]);
 * // => 4
 */
const variance = (array: Array<number>): number | null => {
  if (!array.length) return null;

  const mean = array.reduce((sum, num) => sum + num, 0) / array.length;
  const squaredDiffs = array.map(num => Math.pow(num - mean, 2));
  return squaredDiffs.reduce((sum, val) => sum + val, 0) / array.length;
};

export default variance;