/**
 * Last element of an array (undefined when empty).
 *
 * @since 5.6.0
 * @static
 * @memberof array
 * @param  {Array<T>} array
 * @return {T|undefined}
 * @example
 * last([10, 20, 30]); // => 30
 */
const last = <T>(array: T[] = []): T | undefined => (array.length ? array[array.length - 1] : undefined);

export default last;
