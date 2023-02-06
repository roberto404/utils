import { should } from 'chai';
import { distance } from '../../src/geometry';

should();

describe('distance', () =>
{
  it('Calculate', () =>
  {
    distance({ x: 1, y: 1 }, { x: 2, y: 2 }).should.to.equal(Math.sqrt(2));
  });
});
