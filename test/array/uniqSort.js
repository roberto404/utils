import { expect, should } from 'chai';
import { uniqSort } from '../../src/array';

should();



describe('uniqSort', () =>
{
  it('uniqSort', () =>
  {
    uniqSort(['apple', 'apple', 'orange']).should.to.deep.equal(['apple', 'orange']);
    uniqSort(['apple', 'orange', 'orange', 'orange']).should.to.deep.equal(['orange', 'apple']);
    uniqSort(['apple', 'orange', 'pear', 'pear']).should.to.deep.equal(['pear', 'apple', 'orange']);
  });
});
