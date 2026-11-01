import { should, expect } from 'chai';
import diffValues from '../../src/object/diffValues';

should();

describe('object: diffValues', () => {
  it('equal values -> no change', () => {
    diffValues(['HUN', 'MA'], ['MA', 'HUN']).should.to.deep.equal([]);
    diffValues({ w: '206' }, { w: 206 }).should.to.deep.equal([]);
    diffValues(null, '').should.to.deep.equal([]);
    diffValues(5, 5).should.to.deep.equal([]);
  });

  it('arrays: added and removed elements', () => {
    diffValues(['HUN', 'MA', 'G_SEARCH'], ['HUN', 'G_SEARCH', 'SALE']).should.to.deep.equal([
      { type: 'added', value: 'SALE' },
      { type: 'removed', value: 'MA' },
    ]);
  });

  it('arrays from / to empty', () => {
    diffValues(null, [1, 2]).should.to.deep.equal([
      { type: 'added', value: 1 },
      { type: 'added', value: 2 },
    ]);
    diffValues([1], []).should.to.deep.equal([{ type: 'removed', value: 1 }]);
  });

  it('arrays of objects compared by content', () => {
    diffValues(
      [{ id: '1', ext: 'jpg' }, { id: '2', ext: 'jpg' }],
      [{ ext: 'jpg', id: '1' }, { id: '3', ext: 'jpg' }],
    ).should.to.deep.equal([
      { type: 'added', value: { id: '3', ext: 'jpg' } },
      { type: 'removed', value: { id: '2', ext: 'jpg' } },
    ]);
  });

  it('objects: changed, added, removed keys', () => {
    diffValues({ w: '206', h: '95', e: 'x' }, { w: '210', h: '95', d: '97' }).should.to.deep.equal([
      { type: 'changed', key: 'w', from: '206', to: '210' },
      { type: 'removed', key: 'e', value: 'x' },
      { type: 'added', key: 'd', value: '97' },
    ]);
  });

  it('objects: arrays under the same key element-wise', () => {
    diffValues({ 1: ['7'], 18: '1' }, { 1: ['7', '9'], 18: '2' }).should.to.deep.equal([
      { type: 'added', key: '1', value: '9' },
      { type: 'changed', key: '18', from: '1', to: '2' },
    ]);
  });

  it('objects: false / empty value counts as removed', () => {
    diffValues({ 30: true }, { 30: '' }).should.to.deep.equal([{ type: 'removed', key: '30', value: true }]);
  });

  it('scalars -> changed', () => {
    diffValues(209990, 189990).should.to.deep.equal([{ type: 'changed', from: 209990, to: 189990 }]);
    diffValues('a', null).should.to.deep.equal([{ type: 'changed', from: 'a', to: null }]);
    expect(diffValues(undefined, 'b')[0].type).to.equal('changed');
  });
});
