import { expect, should } from 'chai';
import { getDistanceFromLatLonInKm } from '../../src/geometry';

should();

describe('getDistanceFromLatLonInKm', () =>
{
  it('Budapest - New York distance in km', () =>
  {
    const distance = getDistanceFromLatLonInKm(47.4925, 19.0513, 40.71448, -74.00598);
    distance.should.to.least(7000);
    distance.should.to.below(7010);
  });
});
