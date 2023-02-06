type CallbackResult = any;
type CallbackFunction = (number: number) => CallbackResult;

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
const produceNumericArray = (start: number = 0, end: number = 0, transform?: CallbackFunction): Array<CallbackResult> =>
{
  const array: Array<CallbackResult> = [];

  for (let i = start; i <= end; i += 1)
  {
    const value = (typeof transform === 'function') ? transform(i) : i;

    array.push(value);
  }

  return array;
};

export default produceNumericArray;
