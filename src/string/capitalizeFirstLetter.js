// @flow

/**
 * Capitalize the first letter of string
 *
 * @since 3.1.0
 * @static
 * @memberof string
 * @param {string} string handle string
 * @return {string}
 * @example
 *
 * capitalizeFirstLetter('lorem ipsum');
 */
const capitalizeFirstLetter = (string: string): string => string[0].toUpperCase() + string.slice(1);

export default capitalizeFirstLetter;
