// @flow

// '55,23', '3 444', '5 555,3'
export const NOT_NAN_REGEX = /^-?[1-9]{1}[0-9]{0,2}[ ]*([0-9]{3}[ ]*)*(,[0-9]+)?$/;

/**
 * Cast string to number
 *
 * @since 3.6.0
 * @static
 * @memberof string
 * @param {string} string handle string
 * @return {number}
 * @example
 *
 * toNumber('500,50');
 * // => 500.5
 *
 * toNumber('1 300');
 * // => 1300
 */
const toNumber = (string: string): number =>
{
  if (typeof string === 'number')
  {
    return string;
  }

  if (typeof string !== 'string' || !NOT_NAN_REGEX.test(string))
  {
    return NaN;
  }
  return Number(string.replace(/ /g, '').replace(',', '.'));
};

export default toNumber;
