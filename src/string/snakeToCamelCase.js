// @flow

/**
 * Convert camelCase snake_case text
 *
 * @since 4.9.0
 * @static
 * @memberof string
 * @param {string} string handle string
 * @return {string}
 * @example
 *
 * snakeToCamelCase('lorem_ipsum');
 * // => loremIpsum
 * 
 * snakeToCamelCase('lorem.ipsum', '.')
 * // => loremIpsum
 * 
 * snakeToCamelCase('lorem_ipsum', false, true);
 * // => LoremIpsum
 */
const snakeToCamelCase = (string: string, pascalCase = false, separator = '_'): string =>
  string
    .split(separator)
    .map((word, i) => (i || pascalCase ? word.charAt(0).toUpperCase() : word.charAt(0).toLowerCase())  + word.slice(1))
    .join('');

export default snakeToCamelCase;
