const generateString = () =>
  Math.random().toString(36).substring(2, 15);

/**
 * Create Random string (ID)
 *
 * @since 4.2.0
 * @static
 * @memberof string
 * @param {number} length length of created random string
 * @return {string}
 * @example
 *
 * random();
 * // => '16sv7s5hptkipicq4vf4oo'
 */
const random = (length: number = 28): string =>
{
  let result = '';

  while (result.length < length)
  {
    result += generateString();
  }

  return result.substring(0, length);
};

export default random;
