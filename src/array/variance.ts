import toNumber from '../string/toNumber';

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

  const nums = array.map(toNumber).filter(n => !Number.isNaN(n));

  if (nums.length === 0) return null;

  const mean = nums.reduce((sum, num) => sum + num, 0) / nums.length;
  const squaredDiffs = nums.map(num => Math.pow(num - mean, 2));
  
  return squaredDiffs.reduce((sum, val) => sum + val, 0) / nums.length;
};

export default variance;