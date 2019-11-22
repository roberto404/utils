/**
 * Return URL get params to object
 * 
 * @param  {String} [param=''] Observed get param key or get every param
 * @return {Object}            params
 * @example
 * import getParam from '@1studio/utils/location/getParam';
 * getParam('examples')
 * // http://localhost:9009?example=caroussel
 * //=> { examples: 'caroussel'}
 */
const getParam = (param = '') =>
{
  const get = {};

  // location.search = _GET
  const regex = /([^=?&]+)=([^&]+)/g;
  let m;

  while ((m = regex.exec(decodeURI(location.search))) !== null) // eslint-disable-line
  {
    get[m[1]] = m[2];
  }

  if (param)
  {
    return get[param] || '';
  }

  return get;
};


export default getParam;
