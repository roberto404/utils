// @flow

// npx babel-node ./examples/error
// or watch:
// npx babel-watch ./examples/error

import UserError from '../src/error/userError';


console.log(

  (new UserError(
    'error',
    {
      code: 'mercur',
      level: 'emergency',
      message: 'Opps',
      dev: { foo: 'bar' },
    }
  ))

);
