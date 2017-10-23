import { should } from 'chai';
import { pointInRect } from '../../src/geometry';

should();

describe('pointInRect', () =>
{
  it('Observe', (done) =>
  {
    pointInRect(
      { x: 1, y: 1 },
      { x: 1, y: 2 },
      { x: 1, y: 4 },
    ).should.to.equal(false);

    pointInRect(
      { x: 1, y: 3 },
      { x: 1, y: 2 },
      { x: 1, y: 4 },
    ).should.to.equal(true);

    pointInRect(
      { x: 3, y: 2 },
      { x: 1, y: 2 },
      { x: 3, y: 2 },
    ).should.to.equal(true);

    done();
  });
});
