// @flow

/**
 * Find the Greatest Common Divisor or GCD between two number.
 *
 * @since 3.12.0
 * @static
 * @memberof math
 * @param  {int} a observed number
 * @param  {int} b observed number
 * @return {int}
 * @example
 *
 * gcdTwoNumbers(100, 50);
 * // => 50;
 */
export const gcdTwoNumbers = (a: number, b: number): number =>
  !b ? a : gcdTwoNumbers(b, a % b)

/**
 * Find the Greatest Common Divisor or GCD between numbers.
 *
 * @since 3.12.0
 * @static
 * @memberof math
 * @param  {array} numbers observed numbers
 * @return {int}
 * @example
 *
 * gcd([50, 100, 200]);
 * // => 50
 */
const gcd = (
  numbers: Array<number>,
): number|bool =>
{
  if (!Array.isArray(numbers))
  {
    return false;
  }

  const numbersLenght = numbers.length;

  if ( !numbersLenght )
  {
    return false;
  }

  let a = numbers[0];
  let b = numbers[1];

  for ( var i = 1; i < numbersLenght; i++ )
  {
    b = numbers[i];
    a = gcdTwoNumbers(a, b);
  }

  return a;
};


export default gcd;
