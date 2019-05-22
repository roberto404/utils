// @flow

// npx babel-node ./examples/storage
// or watch:
// npx babel-watch ./examples/storage

import Storage from '../src/models/storage';


/**
 * Flow works
 */

const App: Storage = new Storage({ lang: 'en' }, { key: 'app' });

const User: Storage = new Storage(
  {
    id: 1,
    name: 'Megan J. Cushman',
    gender: 1,
    visits: '2017-07-23',
  },
  {
    password: 'encryption-password',
    key: 'localstorage-key',
    sessionTime: 10
  }
);

// change data;
User.data = {
  id: 2,
  name: 'John Doe',
  gender: 1,
  visits: '',
}

// change session time in minutes
User.sessionTime = 20;


console.log(User.data);
console.log(App.data);
