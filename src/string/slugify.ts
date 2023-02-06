//@ts-nocheck

import trim from 'lodash/trim';

import translations from './addition/slugify';

/**
 * Makes URL-safe slug:
 * - remove html codes
 * - convert to basic Latin letters
 * - remove diacritical marks
 *
 * @since 3.6.0
 * @static
 * @memberof string
 * @param {string} string handle string
 * @return {string}
 * @example
 *
 * slugify('loRem#ipsüm');
 * // => 'lorem-ipsum'
 */
const slugify = (string: string): string =>
{
  let slug = trim(string);

  // html code
  slug = slug.replace(/(&[^;]+;)/g, '');

  Object
    .keys(translations)
    .forEach((key) =>
    {
      slug = slug.replace(new RegExp(key, 'g'), translations[key]);
    });

  slug = slug.replace(/[_]+/g, '_');

  return slug.replace(/[^A-z0-9_-]/g, '').toLowerCase();
};

export default slugify;
