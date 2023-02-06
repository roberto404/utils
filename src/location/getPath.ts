import getParam from './getParam';

type Path = {
  full: string,
  folders: string,
  page: string,
  param: object,
  query: string,
}

const getPath = (path = window.location.pathname): Path =>
{
  const slashIndexOf = path.lastIndexOf('/');

  const folders = path.substring(0, slashIndexOf);
  const page = path.substring(slashIndexOf + 1).replace(/^([^?]*).*/, "$1");
  const query = path.substring(folders.length + 1 + page.length);

  return ({
    full: `${folders}/${page}`,
    folders,
    page,
    param: getParam('', query),
    query,
  });
};


export default getPath;
