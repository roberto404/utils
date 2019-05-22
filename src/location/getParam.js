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
