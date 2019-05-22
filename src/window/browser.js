const browser =
  {
    // Firefox 1.0+
    isFirefox: () =>
      typeof InstallTrigger !== 'undefined',

    // Internet Explorer 6-11
    isIE: () =>
      navigator.userAgent.indexOf('MSIE') !== -1 || !!document.documentMode,

    // Edge 20+
    isEdge: () =>
      !browser.isIE() && !!window.StyleMedia,

    // Chrome 1+
    isChrome: () =>
      !!window.chrome && !!window.chrome.webstore,

    // At least Safari 3+: "[object HTMLElementConstructor]"
    isSafari: () =>
      Object.prototype.toString.call(window.HTMLElement).indexOf('Constructor') > 0 ||
          navigator.userAgent.toLowerCase().indexOf('safari') !== -1,
  };

export default browser;
