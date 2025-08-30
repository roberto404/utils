import toNumber from '../string/toNumber';

/**
 * Function returns the mode (most frequently occurring value) of an array of numbers.
 *
 * If multiple values have the same highest frequency, it returns all of them in an array.
 *
 * @since 5.4.0
 * @static
 * @memberof array
 * @param  {Array<number>} array The array to inspect.
 * @return {Array<number>} An array of the most frequent value(s). Empty array if input is empty.
 * @example
 *
 * mode([1,2,2,3,3,3]);
 * // => [3]
 *
 * mode([1,1,2,2]);
 * // => [1, 2]
 */
const mode = (array: Array<number>): Array<number> => {

  if (!array.length) return [];

    const nums = array.map(toNumber).filter(n => !Number.isNaN(n));

  if (nums.length === 0) return null;

  const frequency: Record<number, number> = {};
  let maxFreq = 0;

  for (const num of nums) {
    frequency[num] = (frequency[num] || 0) + 1;
    if (frequency[num] > maxFreq) {
      maxFreq = frequency[num];
    }
  }

  return Object.keys(frequency)
    .filter(num => frequency[Number(num)] === maxFreq)
    .map(Number);
};

export default mode;
