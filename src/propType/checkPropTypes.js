// @flow

import ReactPropTypesSecret from 'prop-types/lib/ReactPropTypesSecret';
import reduce from 'lodash/reduce';

/**
 * Validate Object like as React component props
 *
 * @since 3.5.0
 * @static
 * @memberof proptype
 * @param  {any} subject  observed value or observe Object
 * @param  {function|object} propType one PropType or PropTypes object
 * @return {null|array}          errors array
 * @example
 * checkPropTypes(
 *  { id: 'something' status: true },
 *  {
 *    id: PropTypes.string.isRequired,
 *    status: PropTypes.bool.isRequired,
 *  }
 * );
 * // -> null
 *
 * or
 *
 * checkPropTypes('string', PropTypes.number);
 * // -> [errors]
 */
const checkPropTypes = (
  subject: any,
  propType: Function | { [string | number]: Function },
) : null | Array<{}> =>
{
  const subjects = (typeof propType === 'function') ? { 0: subject } : subject;
  const propTypes = (typeof propType === 'function') ? { 0: propType } : propType;

  const errors = reduce(
    propTypes,
    (result, validators, index) =>
    {
      const error = validators(subjects, index, JSON.stringify(subject), 'object', null, ReactPropTypesSecret);

      if (error)
      {
        result.push(error);
      }

      return result;
    },
    [],
  );

  return !errors.length ? null : errors;
};

export default checkPropTypes;
