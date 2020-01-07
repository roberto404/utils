// @flow

/**
 * Convert Ascii code string to Latin
 *
 * @since 4.8.0
 * @static
 * @memberof string
 * @param {string} string handle string
 * @return {string}
 * @example
 *
 * urlQueryDencoder(urlQueryEncoder('abc$#Á'));
 */
const urlQueryDencoder = (string: string): string  =>
  string.replace(/_([0-9]+)_/g, (match, code) => String.fromCharCode(code));

export default urlQueryDencoder;
