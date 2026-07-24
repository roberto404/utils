/**
 * Smallest numeric value in an array.
 *
 * Converts string values to numbers if possible; ignores invalid numbers (NaN).
 *
 * @since 5.6.0
 * @static
 * @memberof array
 * @param  {Array<number|string>} array The array to inspect.
 * @return {number} The minimum of valid numbers (0 if none).
 * @example
 * min(['3', 1, 2]); // => 1
 */
const min = (array: Array<number | string> = []): number => {
  let result: number | null = null;

  for (let i = 0; i < array.length; i++) {
    const num = Number(array[i]);
    if (!isNaN(num) && (result === null || num < result)) {
      result = num;
    }
  }

  return result === null ? 0 : result;
};

export default min;
