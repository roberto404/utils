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
 *
 * 100 [{},{}...] record same performace
 * 1.000 [{},{}...] record ~1.000x faster
 * 10.000 [{},{}...] record ~10.000x faster
 *
 * @param  {array} array
 * @param  {function} compare
 * @return {array}
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
