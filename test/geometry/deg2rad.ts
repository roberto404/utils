import { expect, should } from 'chai';
import { deg2rad } from '../../src/geometry';

should();

describe('deg2rad', () =>
{
  it('Calculate', () =>
  {
    deg2rad(180).should.to.equal(Math.PI);
  });
});
