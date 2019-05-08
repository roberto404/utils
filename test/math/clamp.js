import { expect, should } from 'chai';
import { clamp } from '../../src/math'

should();

describe('clamp', () =>
{
  it('Normal', (done) =>
  {
    clamp(10, 1, 8).should.to.equal(8);
    done();
  });

  it('Minimum', (done) =>
  {
    clamp(10, 15, 20).should.to.equal(15);
    done();
  });

  it('Maximum', (done) =>
  {
    clamp(10, 1, 5).should.to.equal(5);
    done();
  });

  it('Max < Min -> Max not apply', (done) =>
  {
    clamp(10, 11, 5).should.to.equal(11);
    done();
  });

  it('Min not defined', (done) =>
  {
    clamp(10, null, 5).should.to.equal(5);
    clamp(10, false, 5).should.to.equal(5);
    clamp(10, 0, 20).should.to.equal(10);
    done();
  });

  it('Max not define', (done) =>
  {
    clamp(10, 20).should.to.equal(20);
    done();
  });

  it('Min, Max not define', (done) =>
  {
    clamp(10).should.to.equal(10);
    done();
  });

  it('Negative', (done) =>
  {
    clamp(-10, 0).should.to.equal(0);
    clamp(-10, -10, 0).should.to.equal(-10);
    clamp(-10, false, 0).should.to.equal(0);
    done();
  });
});
