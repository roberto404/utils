// @flow

// npx babel-node ./examples/propType
// or watch:
// npx babel-watch ./examples/propType

import PropTypes from 'prop-types';
import checkPropTypes from '../src/propType/checkPropTypes';

console.log(checkPropTypes(1, PropTypes.string));
// => [error]
