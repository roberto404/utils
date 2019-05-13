// @flow

/**
 * Create array width numbers
 *
 * @since 3.7.0
 * @static
 * @memberof array
 *
 * @param  {Number}  [start=0]         first number
 * @param  {Number}  [end=0]          last iterated number
 * @param  {Function} [transform=false] you can transform iterated number in array
 * @return {Array}
 *
 * @example
 * produceNumericArray(0, 24);
 * // => [0,1,2,...,24]
 *
 * @example transform
 * produceNumericArray(0, 24, i => ({ id: i, title: i }));
 * // => [{ id: 0, title: 0 }, ..., { id: 24, title: 24 }]
 */
const produceNumericArray = (start:number = 0, end:number = 0, transform?:Function): Array<any> =>
{
  const array = [];

  for (let i = parseInt(start); i <= parseInt(end); i += 1)
  {
    array.push((typeof transform === 'function') ? transform(i) : i);
  }

  return array;
};

export default produceNumericArray;
