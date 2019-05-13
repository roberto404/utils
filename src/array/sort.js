// @flow

const merge = (left: Array<any>, right: Array<any>, compare: Function): Array<any> =>
{
  let result = [];

  while ((left.length > 0) && (right.length > 0))
  {
    if (!compare(left[0], right[0]))
    {
      result.push(left.shift());
    }
    else
    {
      result.push(right.shift());
    }
  }

  result = result.concat(left, right);
  return result;
};

/**
 * Array sort better performace than native sort
 * Useful for big data
 *
 * @since 3.2.0
 * @static
 * @memberof array
 * @param  {array} array
 * @param  {function} compare
 * @return {array}
 *
 * @example
 *
 * const results = sort(
 *    [8, 4, 1, 0, 10, 2],
 *    (a, b) => a >= b,
 *  );
 * // => [0, 1, 2, 4, 8, 10]
 *
 */
const sort = (array: Array<any>, compare: Function): Array<any> =>
{
  const len = array.length;

  if (len < 2)
  {
    return array;
  }

  const pivot = Math.ceil(len / 2);

  return merge(
    sort(array.slice(0, pivot), compare),
    sort(array.slice(pivot), compare),
    compare,
  );
};

export default sort;
