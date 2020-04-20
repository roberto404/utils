// @flow

// 20Kb -> 1
import reduce from 'lodash/reduce';
import isMatch from 'lodash/isMatch';

// 2Kb -> 0
import PropTypes, { checkPropTypes } from '../propType';

// 90Kb
import Storage, { IMMORTAL_SESSIONTIME } from './storage';


/* !- Constants */

const ActionsType = PropTypes.objectOf(
  PropTypes.arrayOf(
    PropTypes.func,
  ),
);

const ConfigType = PropTypes.shape({
  application: PropTypes.shape({
    id: PropTypes.string.isRequired,
    password: PropTypes.oneOfType([
      PropTypes.bool,
      PropTypes.string,
    ]).isRequired,
  }).isRequired,
});

const StoreType = PropTypes.shape({
  dispatch: PropTypes.func.isRequired,
  getState: PropTypes.func.isRequired,
  replaceReducer: PropTypes.func.isRequired,
  subscribe: PropTypes.func.isRequired,
});

/**
 * https://developer.mozilla.org/en-US/docs/Web/Events
 */
const AVAILABLE_LISTENERS = ['orientation', 'keydown', 'click', 'scroll'];


/* !- Flow Types */

type shortcutType =
{
  keyCode: string,
  handler: () => void,
  description?: string,
};


export default (() =>
{
  const privateProps = new WeakMap();

  privateProps.add = (key, object) =>
  {
    privateProps.set(
      key,
      {
        ...privateProps.get(key),
        ...object,
      },
    );
  };

  /**
   * Read all html document config: Language, baseUrl, documentId
   * @type {Object} { lang, regionName, regionCode, baseDir, pathName, pageName, title }
   * @private
   */
  const getDocumentConfig = () =>
  {
    let title = '';

    if (document.getElementsByTagName('title')[0])
    {
      title = document.getElementsByTagName('title')[0].innerHTML;
    }

    /**
     * ISO 639 is a standardized nomenclature used to classify languages.
     * ISO 639-1: two-letter codes.
     * @type {String}
     * @public
     * @default [en]
     */
    const lang = document.documentElement.lang || 'en';

    /**
     * Region Code.
     * Language identifiers as specified by RFC 3066.
     * @type {String}
     * @public
     * @default [hu]
     * @example
     *
     * lang + '-' + regionCode.toUpperCase();
     * // => For example, en-US (English, U.S.)
     *
     * this.locale
     * // => en-US
     */
    const regionCode = document.documentElement.dataset.regioncode || 'hu';

    /**
     * Region Name.
     * Language identifiers as specified by RFC 3066.
     * @type {String}
     * @public
     * @default [Hungary]
     */
    const regionName = document.documentElement.dataset.regionname || 'Hungary';

    /**
     * Specify a default URL and a default target for all links on a page
     * @type {String}
     * @public
     * @default [/]
     */
    let baseDir = '/';

    if (document.getElementsByTagName('base')[0])
    {
      baseDir = document.getElementsByTagName('base')[0].getAttribute('href');
    }

    /**
     * Cleaned location.pathname. Remove baseDir and last slash
     * @type {String}
     * @public
     */
    let pathName = location.pathname.replace(new RegExp(`^${baseDir}(.*)$`), '$1');

    if (pathName[pathName.length - 1] === '/')
    {
      pathName = pathName.substr(0, [pathName.length - 1]);
    }

    if (location.hash)
    {
      pathName += location.hash;
    }

    /**
     * Current page Id: document.id or pathnam
     * @type {String}
     * @public
     */
    const pageName = document.body.id || pathName;

    /**
     * CSS responsive media: desktop, mobile, tablet.
     * @type {String}
     * @public
     */
    let media;

    const node = document.createElement('DIV');
    node.setAttribute('id', 'respond-to');

    media = window
      .getComputedStyle(document.body.appendChild(node))
      .getPropertyValue('content');

    media = media.replace(/"/g, '');
    document.body.removeChild(node);


    return {
      lang,
      regionName,
      regionCode,
      baseDir,
      pathName,
      pageName,
      title,
      media,
    };
  };


  /**
  * Application model
  * Handles configurations
  * Dispatching attached methods based page ID or pathname
  *
  * @example
  * // React-Redux application loader
  *
  * // 94Kb
  * import Application from '/utils/models/application';
  * import Contact from './contact';
  * import Vip from './vip';
  *
  * const init = () =>
  *   request
  *     .get('/app.json')
  *     .then((response) =>
  *     {
  *       const config = response.body;
  *       const App = new Application({
  *         store: store(),
  *         config,
  *         actions: {
  *           '.*': [Vip],
  *           'contact': [Contact],
  *         },
  *       });
  *
  *       if (config.application.global || process.env.NODE_ENV !== 'production')
  *       {
  *         window.App = App;
  *       }
  *     });
  *
  *   window.onload = init;
  *
  * @since 3.7.0
  * @class
  * @example
  */
  class Application
  {
    register = {}
    listeners = []

    /**
    * @constructs
    * @private
    * @param  {Object} data     full data Object
    * @param  {Object} [settings]
    */
    constructor(
      // data: {},
      settings?: {
        store?: {},
        actions?: {},
        config?: {},
      } = {},
    )
    {
      if (
        checkPropTypes(
          settings,
          PropTypes.shape({
            store: StoreType,
            actions: ActionsType,
            config: ConfigType,
          }),
        )
      )
      {
        throw new Error('Application settings error.');
      }

      // Initial privateProps type
      privateProps.set(this, {});

      // config
      const config = settings.config || {};
      const document = getDocumentConfig();

      this.config = {
        ...config,
        document,
      };

      this.locale = `${document.lang}-${document.regionCode.toUpperCase()}`;

      if (settings.actions)
      {
        this.setActions(settings.actions);
      }

      if (settings.store)
      {
        this.store = settings.store;
      }


      this.register = new Storage(
        {},
        {
          key: config.application.id,
          password: config.application.password,
          sessionTime: IMMORTAL_SESSIONTIME,
        },
      );

      this.vendors = [];

      window.addEventListener('orientationchange', this.OrientationChangeListener);

      this.dispatch();
    }


    /* !- Getter Setter */

    /**
    * Return config object.
    * Config is protected in production mode.
    * @return {Object}
    */
    get config(): {}
    {
      if (process.env.NODE_ENV === 'production')
      {
        throw new Error('Config is protected.');
      }

      return privateProps.get(this).config;
    }

    /**
    * Set config in private storage.
    * If config is defined, you cannot set new object.
    * @param  {Object} config
    * @example
    * const Model = new Application();
    *
    * Model.config({ name: 'John', thumbnail: 'john.jpg' });
    *
    * // or
    *
    * const Model = new Application({config: { name: 'John'}});
    */
    set config(config: {}): void
    {
      if (privateProps.get(this).config)
      {
        throw new Error('Config defined yet.');
      }

      privateProps.add(this, { config });
    }

    /**
     * Get name of page
     * @return {String} pageName
     */
    getPageName(): string
    {
      return privateProps.get(this).config.document.pageName;
    }

    /**
     * Return CSS media screen type
     * @return {string}        [desktop|mobile|tablet]
     */
    getMedia(): string
    {
      return privateProps.get(this).config.document.media;
    }

    static getOrientation(): string
    {
      return window.matchMedia('(orientation: portrait)').matches ? 'portrait' : 'landscape';
    }

    /**
     * Return html Title content
     * @return {string}        title
     */
    getPageTitle(): string
    {
      return privateProps.get(this).config.document.title;
    }

    /**
     * Change HTML document title
     * @param {string} title
     * @todo modify privateProps value
     */
    static setPageTitle(title: string)
    {
      // #todo !!!!!!!!!!!!!!!!!!!!!!!!
      // config = privateProps.get(this).config;
      // privateProps.add(this, { config });
      // default title-t megtartani / rs kontakt2 getPageTitle használja a régi eléréséhez
      document.getElementsByTagName('title')[0].innerHTML = title;
    }

    /**
     * Return config.project[module]
     * @param  {string} [module] index of config.project
     * @return {object}        [description]
     */
    getProjectConfig(module?: string): {}
    {
      if (!module)
      {
        return privateProps.get(this).config.project;
      }
      return privateProps.get(this).config.project[module];
    }

    /**
     * Add actions, every action will be invoke when dispatching.
     * If action match with pageName, pushed method execute.
     * @param {Object} actions
     * @example
     * const Model = new Application({ actions: ['.*': [() => 'all']]});
     * Model.setActions({'^$': [() => 'home']})
     *
     * //=> merge two action array
     */
    setActions(actions: {})
    {
      if (
        checkPropTypes(
          actions,
          ActionsType.isRequired,
        )
      )
      {
        throw new Error('Invalid action type');
      }

      const currentActions = privateProps.get(this).actions || {};

      privateProps.add(this, { actions: {
        ...currentActions,
        ...actions,
      } });
    }


    addListener = (event: string, handler: void, extra: {}) =>
    {
      if (AVAILABLE_LISTENERS.indexOf(event) === -1)
      {
        throw new Error(`${event} not available listeners (${AVAILABLE_LISTENERS.join(', ')})`);
      }

      document.addEventListener(event, handler);

      this.listeners.push({ event, handler, ...extra });
    }

    removeListener = (handler: void) =>
    {
      const index = this.listeners.findIndex(listenter => listenter.handler === handler);

      if (index !== -1)
      {
        const { event, handler } = this.listeners[index];  // eslint-disable-line no-shadow

        document.removeEventListener(event, handler);
        this.listeners = this.listeners.slice(0, index).concat(this.listeners.slice(index + 1));
      }
    }

    /**
     * Compare the keyboard event and key
     * @param {string} keyCode shortcut: "CTRL+S", "CTRL+SHIFT+S"
     */
    isShortcut(keyCode: string, event: SyntheticKeyboardEvent<>) :boolean // eslint-disable-line
    {
      // shiftKey: true
      // ctrlKey: true
      // altKey: false
      // metaKey: false
      // key: "S"
      return keyCode
        .split('+')
        .map(key => key.toLowerCase())
        .every(key => event[`${key}Key`] === true || event.key.toLowerCase() === key);
    }

    /**
     * @param {Array} shortcuts
     * @exmaple
     addShortCuts([
       {
         keyCode: "CTRL+S",
         handler: (e) => console.log(e),
         description: 'Save you project',
       },
       {
         keyCode: 'CTRL+Z',
         handler: (else) => console.log(e),
         description: 'Undo',
       },
     ], 'collection');

     */
    addShortcuts = (shortcuts: Array<shortcutType>, collection:? string): void =>
    {
      shortcuts.forEach((shortcut) =>
      {
        this.addListener(
          'keydown',
          event => this.isShortcut(shortcut.keyCode, event) && shortcut.handler(event),
          {
            keyCode: shortcut.keyCode,
            collection,
          },
        );
      });
    }

    /**
     * Remove keyCode or Collection from shortcut listeners
     * @param  {array|string} shortcutsOrCollection ['CTRL+S'] or 'collectionName'
     *
     * @example
     * removeShortcuts('collectionName');
     * removeShortcuts(['CTRL+S']);
     */
    removeShortcuts = (shortcutsOrCollection: Array<string> | string): void =>
    {
      /**
       * Affected shortcuts
       * @type {Array}
       * @example
       * [{ collection: 'collectionName'}]
       * or
       * [{ keyCode: 'CTRL+S'},...]
       */
      const shortcuts = Array.isArray(shortcutsOrCollection) ?
        shortcutsOrCollection.map(shortcut => ({ keyCode: shortcut }))
        : [{ collection: shortcutsOrCollection }];


      /**
       * find and remove listener which affected
       */
      this.listeners
        .filter(listener =>
          listener.event === 'keydown'
          && shortcuts.some(shortcut => isMatch(listener, shortcut)),
        )
        .forEach(listener => this.removeListener(listener.handler));
    }


    loadVendor(url, callback)
    {
      const regex = /\.(js|css)(\?.*)?$/;

      const matches = regex.exec(url);

      if (matches === null)
      {
        return false;
      }

      const extension = matches[1];


      const vendor = this.vendors.find(vendor => vendor.url === url);

      if (vendor)
      {
        if (typeof callback === 'function')
        {
          if (vendor.status)
          {
            callback()
          }
          else
          {
            vendor.callback.push(callback);
          }
        }
      }
      else
      {
        this.vendors.push({
          url,
          extension,
          callback: [callback]
        });

        const vendorListener = (event) =>
        {
          if (event.type === 'load')
          {
            const vendor = this.vendors.find(vendor => vendor.url === url);

            vendor.status === true;
            vendor.callback.forEach((cb) =>
            {
              if (typeof cb === 'function')
              {
                cb();
              }
            });
            vendor.callback = [];
          }
        }

        let element;

        switch (extension)
        {
          case 'js':
          {
            element = document.createElement('script');

            element.type = 'text/javascript';
            element.async = false; // Load in order
            element.src = url;

            break;
          }

          case 'css':
          {
            element = document.createElement('link');

            element.href = url;
            element.rel = 'stylesheet';

            break;
          }
        }

        element.onreadystatechange = vendorListener;

        //  page has finished loading.
        element.addEventListener('load', vendorListener);
        element.addEventListener('error', vendorListener);

        document.getElementsByTagName('body')[0].appendChild(element);
      }
    }

    /* !- Listeners */

    OrientationChangeListener = () =>
    {
      if (this.listeners.orientation)
      {
        this.listeners.orientation.forEach(listener => listener(this.getOrientation()));
      }
    }

    /* !- Public methods */

    /**
     * Dispatching attached methods based page ID or pathname.
     * If action match with pageName, pushed method execute.
     * @return {void}
     */
    dispatch(): void
    {
      this._getActions().map(method => method(this));
    }


    /* !- Private methods */

    /**
     * Inspect the pageName match with aciton key
     * @private
     * @return {Array}         matched actions
     */
    _getActions(): []
    {
      const pageName = this.getPageName();

      return reduce(
        privateProps.get(this).actions || {},
        (results, actions, pattern) =>
        {
          if (pageName.match(new RegExp(pattern)))
          {
            return [...results, ...actions];
          }
          return results;
        },
        [],
      );
    }
  }

  return Application;
})();
