// @flow

// npx babel-node ./examples/string
// or watch:
// npx babel-watch ./examples/string

import { capitalizeFirstLetter, formatThousand } from '../src/string';

capitalizeFirstLetter('lorem ipsum');
// => Lorem ipsum




console.log(

  formatThousand(1000000.25)
  // => 1 000 000.25

);
