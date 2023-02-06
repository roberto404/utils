/**
 * Convert string non latin-1 characters to Ascii code
 *
 * @since 4.8.0
 * @static
 * @memberof string
 * @param {string} string handle string
 * @return {string}
 * @example
 *
 * urlQueryEncoder('abc$#Á');
 */
const urlQueryEncoder = (string: string): string =>
  string
    .split('')
    .map(char => (/[a-z0-9A-Z]{1}/.test(char) ? char : `_${char.charCodeAt(0)}_`))
    .join('');

export default urlQueryEncoder;
