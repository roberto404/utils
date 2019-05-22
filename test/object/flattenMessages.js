import { should } from 'chai';
import flattenMessages from '../../src/object/flattenMessages';

should();

const nestedMessages = {
  foo: {
    bar: 2,
  },
  foo2: {
    bar: false,
  },
  foo3: {
    bar: '1',
  },
  foo4: {
    bar: undefined,
  },
};

const messages = {
  'foo.bar': 2,
  'foo2.bar': false,
  'foo3.bar': '1',
};

describe('flattenMessages', () =>
{
  it('perfect attributes', () =>
  {
    flattenMessages(nestedMessages).should.to.be.deep.equal(messages);
  });
});
