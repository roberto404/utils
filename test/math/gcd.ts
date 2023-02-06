import { expect, should } from 'chai';
import gcd, { gcdTwoNumbers } from '../../src/math/gcd';

should();

describe('gcdTwoNumbers', () =>
{
  it('Normal', (done) =>
  {
    gcdTwoNumbers(100, 50).should.to.equal(50);
    done();
  });
});

describe('gcd', () =>
{
  it('Normal', (done) =>
  {
    gcd([1000, 50, 100, 200]).should.to.equal(50);
    done();
  });
});
