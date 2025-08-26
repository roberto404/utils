/**
 * Function returns the median (middle value) of an array of numbers.
 *
 * If the array has an even number of elements, it returns the average of the two middle values.
 *
 * @since 5.4.0
 * @static
 * @memberof array
 * @param  {Array<number>} array The array to inspect.
 * @return {number|null} The median value or null if array is empty.
 * @example
 *
 * median([1,3,2]);
 * // => 2
 *
 * median([1,2,3,4]);
 * // => 2.5
 */
const median = (array: Array<number>): number | null => {
  
  if (!array.length) return null;

  const sorted = [...array].sort((a, b) => a - b);
  const mid = Math.floor(sorted.length / 2);

  return sorted.length % 2 === 0
    ? (sorted[mid - 1] + sorted[mid]) / 2
    : sorted[mid];
};

export default median;
