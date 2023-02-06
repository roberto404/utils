//@ts-ignore

/**
 * Return URL get params to object
 *
 * @param  {String} [param=''] Observed get param key or get every param
 * @param  {String} [query=location.search] Observed get param key or get every param
 * @return {Object}            params
 * @example
 * import getParam from '@1studio/utils/location/getParam';
 * getParam('examples')
 * // http://localhost:9009?example=caroussel
 * //=> { examples: 'caroussel'}
 */
const getParam = (param: string = '', query: string = location.search): object =>
{
  const get = {};

  // location.search = _GET
  const regex = /([^=?&]+)=([^&]+)/g;
  let m;

  while ((m = regex.exec(decodeURI(query))) !== null) // eslint-disable-line
  {
    get[m[1]] = m[2];
  }

  if (param)
  {
    return get[param] || '';
  }

  if (Object.keys(get).length === 0 && query[0] === '?')
  {
    return decodeURI(query).substring(1);
  }

  return get;
};


export default getParam;
