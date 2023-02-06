/**
 * Function returns the unique items of array sort by occurences.
 * 
 *  Array.reduce: { a: 1, b: 2 }
    Object.entries: [a, 1], [b, 2]
    Array.sort: [b,2], [a,2]
    Array.map: [b,a]
 *
 * @since 4.15.0
 * @static
 * @memberof array
 * @param  {array} array inspected array
 * @return {array}
 * @example
 *
 * uniqSort([1,9,2,9,1,9]);
 * // => [9,1,2]
 */
const uniqSort = (array: Array<number|string>): Array<number|string> =>
  Object.entries(
    array.reduce(
      (result: {[key: number|string]: number}, value) =>
      {
        if (typeof value !== 'undefined')
        {
          if (result[value] !== undefined)
          {
            result[value] += 1;
          }
          else
          {
            result[value] = 1;
          }
        }

        return result;
      },
      {},
    )
  )
  .sort((a, b) => b[1] - a[1])
  .map(value => value[0]);

export default uniqSort;


