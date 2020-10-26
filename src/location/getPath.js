import getParam from './getParam';


const getPath = (path = window.location.pathname) =>
{
  const slashIndexOf = path.lastIndexOf('/');

  const folders = path.substring(0, slashIndexOf);
  const page = path.substring(slashIndexOf + 1).replace(/^([^?]*).*/, "$1");
  const query = path.substring(folders.length + 1 + page.length);

  return ({
    full: `${folders}/${page}`,
    folders,
    page,
    param: getParam(false, query),
    query,
  });
};


export default getPath;
