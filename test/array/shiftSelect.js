import { expect, should } from 'chai';
import shiftSelect from '../../src/array/shiftSelect';

should();


const data = [0,1,2,3,4,5,6,7,8,9];



describe('shiftSelect', () =>
{
  it('one prev elemet forward', () =>
  {
    shiftSelect([1], 4).should.to.deep.equal([1,2,3,4]);
  });

  it('two prev elemet forward', () =>
  {
    shiftSelect([0,1], 4).should.to.deep.equal([0,1,2,3,4]);
  });

  it('two reverse prev elemet forward', () =>
  {
    shiftSelect([1,0], 4).should.to.deep.equal([0,1,2,3,4]);
  });

  it('two gap prev elemet forward', () =>
  {
    shiftSelect([3,0], 4).should.to.deep.equal([0,1,2,3,4]);
  });

  it('two gap prev elemet forward', () =>
  {
    shiftSelect([0, 3], 4).should.to.deep.equal([0,3,4]);
  });
  
});
