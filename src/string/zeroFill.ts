


export const fill = (string: string, length = 0, fillChar = '0', pre = true): string =>
{
  let fillString = '';

  for (let index = string.length; index < length; index++){

    fillString += fillChar;
  }

  const result = [fillString, string];

  if (!pre)
  {
    result.reverse();
  }

  return result.join('');
}



/**
 * Thousand Separator / string format
 *
 * @since 5.1.0
 * @static
 * @memberof string
 * @param {number} number
 * @param {string} length
 * @return {string}
 * @example
 *
 * zeroFill(1,3)
 * // => '001'
 */
const zeroFill = (number: number, length = 4): string =>
{
  return fill(number.toString(), length);
}

export default zeroFill;