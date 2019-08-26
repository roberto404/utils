import browser from './browser';

const print = (element, callback) =>
{
  let printElement;

  if (element instanceof HTMLElement)
  {
    printElement = element;
  }
  else
  {
    printElement = document.getElementById(element);

    if (!printElement)
    {
      return;
    }
  }

  // Create a new iframe or embed element (IE prints blank pdf's if we use iframe)
  const iframeElement = document.createElement('iframe');

  // Hide iframe
  iframeElement.setAttribute('style', 'visibility: hidden; height: 0; width: 0; position: absolute;');

  // Append iframe element to document body
  document.getElementsByTagName('body')[0].appendChild(iframeElement);

  // Head: Add css
  const stylesheet = document.createElement('link');
  stylesheet.href = '/app.css';
  stylesheet.rel = 'stylesheet';
  stylesheet.type = 'text/css';
  iframeElement.contentWindow.document.head.appendChild(stylesheet);

  // Body: Fill target content
  iframeElement.contentWindow.document.body.innerHTML = printElement.innerHTML;
  iframeElement.contentWindow.document.body.setAttribute('id', 'printFrame');
  iframeElement.contentWindow.document.body.setAttribute('style', 'background-color: white');

  // Focus
  iframeElement.focus();

  stylesheet.onload = () =>
  {
    // If Edge or IE, try catch with execCommand
    if (browser.isEdge() || browser.isIE())
    {
      try
      {
        iframeElement.contentWindow.document.execCommand('print', false, null);
      }
      catch (e)
      {
        iframeElement.contentWindow.print();
      }
    }
    else
    {
      // Other browsers
      iframeElement.contentWindow.print();
    }

    // Remove DOM printableElement
    setTimeout(
      () =>
      {
        document.getElementsByTagName('body')[0].removeChild(iframeElement);

        if (callback)
        {
          callback();
        }
      },
      1000,
    );
  };
};

export default print;
