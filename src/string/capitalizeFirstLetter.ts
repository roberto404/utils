/**
 * Capitalize the first letter of string
 *
 * @since 3.1.0
 * @static
 * @memberof string
 * @param {string} string - The string to capitalize.
 * @return {string} The string with the first letter capitalized.
 * @example
 *
 * capitalizeFirstLetter('lorem ipsum');
 */
const capitalizeFirstLetter = (string: string): string => {
  if (typeof string !== 'string' || typeof string[0] === 'undefined') {
    return '';
  }

  return string[0].toUpperCase() + string.slice(1);
};

export default capitalizeFirstLetter;
