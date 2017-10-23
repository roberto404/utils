import { should } from 'chai';
import { twoLineIntersection } from '../../src/geometry';

should();

describe('twoLineIntersection', () =>
{
  it('Observe', (done) =>
  {
    twoLineIntersection(
      { x: 5, y: 10 },
      { x: 5, y: 1 },
      { x: 1, y: 5 },
      { x: 10, y: 5 },
    ).should.to.deep.equal(
      { x: 5, y: 5 },
    );

    done();
  });
});
