import { expect, should } from 'chai';
import { capitalizeFirstLetter } from '../../src/string'

should();

describe('capitalizeFirstLetter', () =>
{
  it('Normal', () =>
  {
    capitalizeFirstLetter('lorem ipsum').should.to.equal('Lorem ipsum');
  });
});
