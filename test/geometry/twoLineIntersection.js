import { should, expect } from 'chai';
import { twoLineIntersection } from '../../src/geometry';

should();

describe('twoLineIntersection', () =>
{
  it('It has interselection', () =>
  {
    twoLineIntersection(
      { x: 5, y: 10 },
      { x: 5, y: 1 },
      { x: 1, y: 5 },
      { x: 10, y: 5 },
    ).should.to.deep.equal(
      { x: 5, y: 5 },
    );
  });

  it('Two parallel line', () =>
  {
    expect(twoLineIntersection(
      { x: 5, y: 10 },
      { x: 5, y: 1 },
      { x: 6, y: 1 },
      { x: 6, y: 10 },
    )).to.be.null;
  });


  it('No Intersection', () =>
  {
    expect(twoLineIntersection(
      { x: 5, y: 10 },
      { x: 5, y: 1 },
      { x: 6, y: 1 },
      { x: 7, y: 11 },
    )).to.be.null;
  });
});
