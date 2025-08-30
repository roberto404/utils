/**
 * Function checks if the given array is a collection of objects with an `id` property.
 *
 * Returns `true` if the array is not empty and its first element is an object
 * containing an `id` key. Otherwise, returns `false`.
 *
 * @since 5.6.0
 * @static
 * @memberof array
 * @param  {Array<any>} arr The array to inspect.
 * @return {boolean} True if the array contains objects with an `id` property.
 * @example
 *
 * isCollection([1, '2', null]);
 * // => false
 *
 * isCollection([{ id: 1 }, { id: 2 }]);
 * // => true
 */
const isCollection = (arr: any[]): boolean =>
  Array.isArray(arr) &&
  arr.length > 0 &&
  typeof arr[0] === 'object' &&
  arr[0] !== null &&
  'id' in arr[0];

export default isCollection;
