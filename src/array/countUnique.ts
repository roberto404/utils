import unique from './unique';

/**
 * Function returns the count value of unique items array.
 *
 * @since 3.2.0
 * @static
 * @memberof array
 * @param  {array} array inspected array
 * @return {int}
 * @example
 *
 * countUnique([1,1,2]);
 * // => 2
 */
const countUnique = (array: Array<number|string>): number => unique(array).length;

export default countUnique;
