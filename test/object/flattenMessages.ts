//@ts-nocheck

import { should } from 'chai';
import flattenMessages, { flattenMessagesRevert } from '../../src/object/flattenMessages';

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

// describe('flattenMessagesRevert', () =>
// {
//   it('perfect attributes', () =>
//   {
//     const input = { ...nestedMessages };
//     delete input.foo4;

//     flattenMessagesRevert(flattenMessages(input)).should.to.be.deep.equal(input);
//   });
// });
