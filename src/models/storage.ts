/* eslint-disable */


// 10KB
import store from 'store';

// 7KB
import isEmpty from 'lodash/isEmpty';

// 55KB
import decrypt from '../string/decrypt';
import encrypt from '../string/encrypt';

// 2KB
import PropTypes, { checkPropTypes } from '../propType';


/* !- Constants */

export const DEFAULT_KEY = 'data';
export const DEFAULT_PASSWORD = 'fDoeF3$8490';
export const DEFAULT_SESSIONTIME = 30; // minutes
export const IMMORTAL_SESSIONTIME = 1000 * 365 * 24 * 60; // 1000 years
export const MIN_TO_MSEC = 60 * 1000;


/* !- Flow Types */

type dataType =
{
  timestamp?: number,
};


export default (() =>
{
  const privateProps = new WeakMap();

  /**
  * Storage model is a wrapper for the client data.
  * All data stores in localStorage with encryption and expiry.
  * If data expired the model flush all data, except the immortal data.
  *
  * @since 3.7.0
  * @class
  * @example
  * // create app key storage, default password and sessionTime.
  * // Key determine the localStorage id.
  * const App: Storage = new Storage({ lang: 'en' }, { key: 'app' });
  *
  * const User: Storage = new Storage(
  *   {
  *     id: 1,
  *     name: 'Megan J. Cushman',
  *     gender: 1,
  *     visits: '2017-07-23',
  *   },
  *   {
  *     password: 'encryption-password',
  *     key: 'localstorage-key',
  *     sessionTime: 10
  *   }
  * );
  *
  * // change data;
  * User.data = {
  *   id: 2,
  *   name: 'John Doe',
  *   gender: 1,
  *   visits: '',
  * }
  *
  * // change session time in minutes
  * User.sessionTime = 20;
  */
  class Storage
  {
    /**
    * @constructs
    * @private
    * @param  {Object} data     full data Object
    * @param  {Object} [settings] { key, password, sessionTime }
    */
    constructor(
      data: {},
      settings?: {
        key?: string,
        password?: string,
        sessionTime?: number,
      } = {},
    )
    {
      if (checkPropTypes(settings, PropTypes.object.isRequired))
      {
        throw new Error('Storage Settings error');
      }

      privateProps.set(this, {});

      this.key = settings.key;
      this.password = settings.password;
      this.sessionTime = settings.sessionTime;

      if (data)
      {
        this.data = data;
      }
    }

    /* !- Getter Setter */

    /**
    * Get data:
    * If empty read from localStorage,
    * if data outdate then erase data.
    *
    * @return {Object}
    * @example
    * const User = new Storage();
    *
    * User.data({ name: 'John' });
    * // User.data => { name: 'John' }
    */
    get data(): dataType
    {
      let data = privateProps.get(this).data || {};

      if (isEmpty(data))
      {
        // read from local storage
        data = this._getLocalStorage();
      }

      // if data is outdated
      if (!this._validate(data.timestamp))
      {
        this.erase();
      }

      return data;
    }

    /**
    * Set data:
    * Every data store in localStorage with timestamp.
    *
    * @param  {Object} data
    * @example
    * const User = new Storage();
    *
    * User.data({ name: 'John', thumbnail: 'john.jpg' });
    * // User.data.name => 'John'
    */
    set data(data: {})
    {
      if (checkPropTypes(data, PropTypes.object))
      {
        throw new Error('Type of storage data have to Object');
      }

      if (!data)
      {
        this.flush();
      }

      if (!isEmpty(data))
      {
        let next = {
          ...data,
          timestamp: new Date().getTime(),
        };

        privateProps.set(this, { ...privateProps.get(this), data: next });

        next = JSON.stringify(next);

        if (privateProps.get(this).password)
        {
          next = encrypt(next, privateProps.get(this).password);
        }

        store.set(
          this.key,
          next,
        );
      }
    }

    /**
    * Get LocalStorage key
    * @return {string}
    */
    get key(): string
    {
      const props = privateProps.get(this) || {};
      return props.key || DEFAULT_KEY;
    }

    /**
    * Set LocalStorage key
    * @param  {string} key
    * @return {void}
    */
    set key(next: string): void
    {
      if (privateProps.get(this).data)
      {
        throw new Error('You cannot change Storage key, when data exist.');
      }

      let key;

      if (checkPropTypes(next, PropTypes.string.isRequired))
      {
        key = DEFAULT_KEY;
      }
      else
      {
        key = next;
      }

      privateProps.set(this, { ...privateProps.get(this), key });
    }

    /**
    * Encryption password, in production mode this data is protected
    * @return {string}
    */
    get password(): string
    {
      if (process.env.NODE_ENV === 'production')
      {
        throw new Error('Password is protected');
      }

      return privateProps.get(this).password;
    }

    /**
    * Set password
    * @param  {string} password
    * @return {void}
    */
    set password(next: string = DEFAULT_PASSWORD): void
    {
      if (privateProps.get(this).data)
      {
        throw new Error('You cannot change Storage password when data exist.');
      }

      const password = (!next) ? '' : next;

      if (checkPropTypes(password, PropTypes.string))
      {
        throw new Error('Type of Storage password not string.');
      }
      else
      {
        privateProps.set(this, { ...privateProps.get(this), password });
      }
    }

    /**
    * Get session lifetime in minutes. This data is protected in production mode.
    * @return {int}
    */
    get sessionTime(): number
    {
      if (process.env.NODE_ENV === 'production')
      {
        throw new Error('SessionTime is protected');
      }

      return privateProps.get(this).sessionTime;
    }

    /**
    * Set session lifetime in minutes
    * @param  {int} minutes
    * @return {void}
    * @example
    * User.sessionTime = 2 * 60;
    * // => data live 2 hours.
    */
    set sessionTime(next: number): void
    {
      let sessionTime;

      if (checkPropTypes(next, PropTypes.number.isRequired))
      {
        sessionTime = DEFAULT_SESSIONTIME * MIN_TO_MSEC;
      }
      else
      {
        sessionTime = next * MIN_TO_MSEC;
      }

      privateProps.set(this, { ...privateProps.get(this), sessionTime });
    }


    /* !- Private methods */

    /**
     * Read and encrypt storage data from LocalStorage
     * @return {object} data
     */
    _getLocalStorage()
    {
      let localStorage = store.get(this.key);

      if (localStorage)
      {
        try
        {
          if (privateProps.get(this).password)
          {
            localStorage = decrypt(localStorage, privateProps.get(this).password);
          }
          return JSON.parse(localStorage);
        }
        catch (e)
        {
          this.flush();
          return {};
        }
      }

      return {};
    }

    /**
    * Validate timestamp
    * @private
    * @param  {string} timestamp
    * @return {boolean}
    */
    _validate(timestamp: number): boolean
    {
      if (isNaN(timestamp))
      {
        return false;
      }

      const now = new Date().getTime();

      return (now <= timestamp + privateProps.get(this).sessionTime);
    }

    /* !- Public methods */

    /**
     * Extend storage data with new object
     * @param {Object} object extra data
     * @return {Object} new data
     * @example
     * User.data = { name: 'John' };
     * User.add({ gender: 1 });
     * // => User.data => { name: 'John', gender: 1 }
     */
    add(object: {}): {}
    {
      if (checkPropTypes(object, PropTypes.object.isRequired))
      {
        throw new Error('Type of Storage data not object when use add method.');
      }

      this.data = {
        ...this.data,
        ...object,
      };

      return this.data;
    }

    /**
     * Remove keys form data storage
     *
     * @param  {Array|<Any>} keys transform array
     * @return {Object} new data
     */
    remove(keys: number|[]|string): {}
    {
      const arrayKeys = Array.isArray(keys) ? keys : [keys];

      arrayKeys.forEach(key => delete this.data[key]);

      return this.data;
    }

    /**
    * Repacking the data data, set up-to-date timestamp
    * If localStorage erased yet, data will flush
    * @private
    * @return {void}
    */
    refurbish(): void
    {
      if (isEmpty(this._getLocalStorage()))
      {
        this.flush();
      }
      else if (!isEmpty(this.data))
      {
        this.data = this.data;
      }
    }

    /**
     * Keep immortal data
     * @todo possible to attach immortal data, these data never will erase.
     */
    erase(): void
    {
      this.flush();
    }

    /**
    * Terminate all data data, also localStorage
    * @return {void}
    */
    flush(): void
    {
      privateProps.set(this, { ...privateProps.get(this), data: {} });
      store.remove(this.key);
    }
  }

  return Storage;
})();

/* eslint-enable */
