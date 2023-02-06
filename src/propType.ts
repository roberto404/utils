/**
 * @fileOverview PropType utilities
 * @namespace proptype
 */

// PropTypes not working on production mode:
// https://github.com/facebook/prop-types/blob/424dace93a04503ea5f259dac20957cf5855a9f1/index.js#L29
// import PropTypes from 'prop-types';
import factoryWithTypeCheckers from 'prop-types/factoryWithTypeCheckers';
import checkPropTypes from './propType/checkPropTypes';

const PropTypes = factoryWithTypeCheckers(() => true);

export { checkPropTypes };

export default PropTypes;
