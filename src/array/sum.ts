/**
 * Function returns the sum of all numeric values in an array.
 *
 * Converts string values to numbers if possible; ignores invalid numbers (NaN).
 *
 * @since 5.5.0
 * @static
 * @memberof array
 * @param  {Array<number|string>} array The array to inspect.
 * @return {number} The sum of all valid numbers (0 if none).
 * @example
 *
 * sumNumbers(['1', '2', 3]);
 * // => 6
 */
const sum = (array: Array<number | string>): number => {

  let total = 0;
  
  for (let i = 0; i < array.length; i++) {
    const num = Number(array[i]);
    if (!isNaN(num)) {
      total += num;
    }
  }
  
  return total;
};

export default sum;