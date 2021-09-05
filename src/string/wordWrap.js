// @flow

/**
 * Wrap words to a specified length.
 *
 * @since 3.7.0
 * @static
 * @memberof string
 * @param {string} string handle string
 * @param {number} length length of wrap
 * @param {object} options { separator: "\n" }
 * @return {string}
 * @example
 *
 * wordWrap('Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod
 * temporincididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud
 * exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.', 50);
 * // =>
 * Lorem ipsum dolor sit amet, consectetur adipiscing
 * elit, sed do eiusmod tempor incididunt ut labore
 * et dolore magna aliqua. Ut enim ad minim veniam,
 * quis nostrud exercitation ullamco laboris nisi ut
 * aliquip ex ea commodo consequat.
 */
const wordWrap = (
  string: string,
  length?: number = 50,
  options?:{ separator?: string } = {},
): string =>
{
  if (typeof string !== 'string')
  {
    return '';
  }

  if (typeof length !== 'number' || length < 1)
  {
    return string;
  }

  const SEPARATOR = (typeof options === 'object' && options.separator) || '\n';

  let currentLineLength = 0;

  return string
    .split(' ')
    .map((value) =>
    {
      currentLineLength += value.length + 1;

      if (currentLineLength > length + 1)
      {
        currentLineLength = value.length + 1;
        return SEPARATOR + value;
      }

      if (value.indexOf(SEPARATOR) != -1)
      {
        currentLineLength = (value.length - 1) - value.lastIndexOf('\n')
      }

      return value;
    })
    .join(' ')
    .replace(new RegExp(` [${SEPARATOR}]`, 'g'), SEPARATOR)
    .replace(/^\s+|\s+$/g, '');
};


export default wordWrap;
