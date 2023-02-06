/**
 * Function returns the unique items of array.
 *
 * @since 3.2.0
 * @static
 * @memberof array
 * @param  {array} array inspected array
 * @return {array}
 * @example
 *
 * unique([1,2,2]);
 * // => [1,2]
 */
const unique = <T extends number|string>(array: Array<T>): Array<T> =>
  array.reduce(
    (result: Array<T>, value) =>
    {
      if (typeof value !== 'undefined' && result.indexOf(value) === -1)
      {
        result.push(value);
      }
      return result;
    },
    [],
  );

export default unique;