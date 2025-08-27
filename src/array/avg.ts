/**
 * Function returns the average (mean) of all numeric values in an array.
 *
 * Converts string values to numbers if possible; ignores invalid numbers (NaN).
 *
 * @since 5.5.0
 * @static
 * @memberof array
 * @param  {Array<number|string>} array The array to inspect.
 * @return {number} The average of valid numbers (0 if none).
 * @example
 *
 * avgNumbers(['1', '2', 3]);
 * // => 2
 */
const avg = (array: Array<number | string>): number => {

  let total = 0;
  let count = 0;
  
  for (let i = 0; i < array.length; i++) {
    const num = Number(array[i]);
    if (!isNaN(num)) {
      total += num;
      count++;
    }
  }
  
  return count === 0 ? 0 : total / count;
};

export default avg;
