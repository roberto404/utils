import quartiles from './quartiles';


/**
 * Function returns the Interquartile Range (IQR) of an array of numbers.
 *
 * IQR = Q3 - Q1, representing the spread of the middle 50% of data.
 *
 * @since 5.4.0
 * @static
 * @memberof array
 * @param  {Array<number>} array The array to inspect.
 * @return {number|null} The IQR or null if array is empty.
 * @example
 *
 * iqr([1,2,3,4,5,6,7,8]);
 * // => 4.5
 */

const iqr = (array: Array<number>): number | null => {
  if (!array.length) return null;

  const q = quartiles(array);
  return q ? q.Q3 - q.Q1 : null;
};

export default iqr;
