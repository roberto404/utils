/**
 * Largest numeric value in an array.
 *
 * Converts string values to numbers if possible; ignores invalid numbers (NaN).
 *
 * @since 5.6.0
 * @static
 * @memberof array
 * @param  {Array<number|string>} array The array to inspect.
 * @return {number} The maximum of valid numbers (0 if none).
 * @example
 * max(['3', 1, 2]); // => 3
 */
const max = (array: Array<number | string> = []): number => {
  let result: number | null = null;

  for (let i = 0; i < array.length; i++) {
    const num = Number(array[i]);
    if (!isNaN(num) && (result === null || num > result)) {
      result = num;
    }
  }

  return result === null ? 0 : result;
};

export default max;
