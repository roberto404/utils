/**
 * Function returns a new array where the element at the given index
 * is replaced by the provided value. The original array is not mutated.
 *
 * @since 5.5.0
 * @static
 * @memberof array
 * @template T
 * @param  {Array<T>} array The original array.
 * @param  {number} index The index of the element to replace.
 * @param  {T} value The new value to insert.
 * @return {Array<T>} A new array with the replaced element.
 * @example
 *
 * replaceAt([1,2,3,4], 2, 99);
 * // => [1,2,99,4]
 */
const replaceAt = <T>(array: Array<T>, index: number, value: T): Array<T> => {
  if (index < 0 || index >= array.length) {
    // index out of range → visszaadja az eredeti tömböt
    return [...array];
  }

  return [
    ...array.slice(0, index),
    value,
    ...array.slice(index + 1)
  ];
};

export default replaceAt;
