// @flow

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
const unique = (array: Array<number|string>): Array<number|string> =>
  array.reduce(
    (result, value) =>
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
