import { expect, should } from 'chai';
import PropTypes from 'prop-types';

import checkPropTypes from '../../src/propType/checkPropTypes'

const SCHEMA = {
  id: PropTypes.string.isRequired,
  handler: PropTypes.func.isRequired,
  arguments: PropTypes.arrayOf(PropTypes.string),
  status: PropTypes.bool.isRequired,
};

describe('checkPropTypes', () =>
{
  const env = process.env.NODE_ENV;

  before(() =>
  {
    process.env.NODE_ENV = 'production';
  });

  after(() =>
  {
    process.env.NODE_ENV = env;
  });

  it('No errors', () =>
  {
    expect(checkPropTypes('string', SCHEMA.id)).to.not.exist;
    expect(checkPropTypes(
      {
        id: 'string',
        handler: a => a,
        arguments: ['test'],
        status: true,
      },
      SCHEMA,
    )).to.not.exist;
  });

  it('Has errors', () =>
  {
    expect((checkPropTypes('string', SCHEMA) || []).length).to.exist;
    expect((checkPropTypes(111, SCHEMA.id) || []).length).to.exist;

    expect(checkPropTypes(
      {
        id: 111,
        handler: a => a,
        arguments: ['test'],
        status: true,
      },
      SCHEMA,
    )).to.exist;
  });
});
