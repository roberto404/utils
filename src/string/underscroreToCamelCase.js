// @flow

/**
 * Convert camel-case understore text
 *
 * @since 4.9.0
 * @static
 * @memberof string
 * @param {string} string handle string
 * @return {string}
 * @example
 *
 * underscroreToCamelCase('lorem_ipsum');
 * // => LoremIpsum
 */
 const underscroreToCamelCase = (string: string): string =>
   string
     .split('_')
     .map(word => word.charAt(0).toUpperCase() + word.slice(1))
     .join('');

export default underscroreToCamelCase;
