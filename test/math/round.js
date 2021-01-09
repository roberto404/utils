import { expect, should } from 'chai';
import {
  roundInteger,
  roundIntegerCeil,
  roundIntegerFloor,
  roundDecimal,
  roundDecimalCeil,
  roundDecimalFloor,
} from '../../src/math/round';

should();

describe('round', () =>
{
  it('roundDecimal', (done) =>
  {
    roundDecimal(100.00001, 100).should.to.equal(100);
    roundDecimalCeil(100.00001, 100).should.to.equal(100.01);
    roundDecimalFloor(100.00001, 100).should.to.equal(100);
    done();
  });

  it('roundInteger', (done) =>
  {
    roundInteger(100011, 100).should.to.equal(100000);
    roundIntegerCeil(100011, 100).should.to.equal(100100);
    roundIntegerFloor(100011, 100).should.to.equal(100000);
  });


  it('roundInteger with decimals', (done) =>
  {
    roundInteger(100.00001, 100).should.to.equal(100);
    roundIntegerCeil(100.00001, 100).should.to.equal(200);
    roundIntegerFloor(100.00001, 100).should.to.equal(100);
    done();
  });
});
