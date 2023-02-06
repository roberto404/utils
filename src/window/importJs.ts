//@ts-nocheck

const importJs = (src, callback) =>
{
  const script = document.createElement('script');

  script.type = 'text/javascript';
  script.async = false; // Load in order
  // script.setAttribute('src', src);
  script.src = src;


  if (typeof callback === 'function')
  {
    script.onreadystatechange = callback;

    //  page has finished loading.
    script.addEventListener('load', callback);
    script.addEventListener('error', callback);
  }

  document.getElementsByTagName('body')[0].appendChild(script);

  window.assets.push(script);

  return script;
};


export default importJs;
