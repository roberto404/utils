//@ts-nocheck

import browser from './browser';
// import request from 'superagent';


export const printIframe = (element, callback) =>
{
  // Focus
  element.focus();

  // If Edge or IE, try catch with execCommand
  if (browser.isEdge() || browser.isIE())
  {
    try
    {
      element.contentWindow.document.execCommand('print', false, null);
    }
    catch (e)
    {
      element.contentWindow.print();
    }
  }
  else
  {
    // Other browsers
    element.contentWindow.print();
  }

  const callbackHook = () =>
  {
    callback(element);
    window.removeEventListener('focus', callbackHook);
  }

  window.addEventListener('focus', callbackHook);
};

export const removeIframe = (element, callback) =>
{
  // Remove DOM printableElement
  setTimeout(
    () =>
    {
      document.getElementsByTagName('body')[0].removeChild(element);

      if (callback)
      {
        callback();
      }
    },
    1000,
  );
};


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
  iframeElement.contentWindow.document.body.setAttribute('id', 'printFrame');
  iframeElement.contentWindow.document.body.setAttribute('style', 'background-color: white');

  stylesheet.onload = () =>
  {
    if (printElement)
    {
      // Body: Fill target content
      iframeElement.contentWindow.document.body.innerHTML = printElement.innerHTML;

      setTimeout(
        () =>
        {
          printIframe(iframeElement, element => removeIframe(element, callback));
        },
        1000,
      );
    }
    else
    {
      iframeElement.onload = () =>
      {
        setTimeout(
          () =>
          {
            printIframe(iframeElement, element => removeIframe(element, callback));
          },
          1000,
        );
      };

      iframeElement.src = element;
    }
  };
};

export default print;
