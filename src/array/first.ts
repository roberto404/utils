/**
 * First element of an array (undefined when empty).
 *
 * @since 5.6.0
 * @static
 * @memberof array
 * @param  {Array<T>} array
 * @return {T|undefined}
 * @example
 * first([10, 20, 30]); // => 10
 */
const first = <T>(array: T[] = []): T | undefined => (array.length ? array[0] : undefined);

export default first;
