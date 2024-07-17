import { expect } from 'chai';
import { arrayMoveMutable, arrayMoveImmutable } from '../../src/array/move';

let data: [number, number, number, number];


describe('array move', () =>
{
  beforeEach(() => {
    data = [0,1,2,3];
  });

  it('mutable forward', () => {
    arrayMoveMutable(data, 0, 1);
    expect(data).to.deep.equal([1,0,2,3]);
  });

  it('mutable backward', () => {
    arrayMoveMutable(data, -2, -3);
    expect(data).to.deep.equal([0,2,1,3]);
  });

  it('immutable forward', () => {
    const data2 = arrayMoveImmutable(data, 0, 1);
    expect(data).to.deep.equal([0,1,2,3]);
    expect(data2).to.deep.equal([1,0,2,3]);
  });
  
  it('immutable backward', () => {
    const data2 = arrayMoveImmutable(data, -2, -3);
    expect(data).to.deep.equal([0,1,2,3]);
    expect(data2).to.deep.equal([0,2,1,3]);
  });  
});
