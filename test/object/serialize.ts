//@ts-ignore

import { should } from 'chai';
import serialize from '../../src/object/serialize';

should();

const data = {
  foo: 'bar',
};

describe('serialize', () =>
{
  it('perfect attributes', () =>
  {
    serialize(data).should.to.be.equal('foo=bar');
  });
});
