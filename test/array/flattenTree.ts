// @ts-nocheck

import { expect, should } from 'chai';
import flattenTree from '../../src/array/flattenTree';
import { flattenTree as flattenTreeBarrel } from '../../src/array';

should();


/**
 * 1
 * ├ 2
 * │ └ 4
 * └ 5
 * 3
 */
const data = [
  { id: 1, title: '1' },
  { id: 2, pid: 1, title: '1.1' },
  { id: 3, title: '2' },
  { id: 4, pid: 2, title: '1.1.1' },
  { id: 5, pid: 1, title: '1.2' },
];

const toRows = nodes => nodes.map(({ record, level }) => [record.id, level]);


describe('flattenTree', () =>
{
  it('registered in the barrel', () =>
  {
    flattenTreeBarrel.should.to.equal(flattenTree);
  });

  it('closed tree: only the roots', () =>
  {
    toRows(flattenTree(data)).should.to.deep.equal([[1, 0], [3, 0]]);
  });

  it('opened root: the children in input order', () =>
  {
    toRows(flattenTree(data, { expanded: [1] }))
      .should.to.deep.equal([[1, 0], [2, 1], [5, 1], [3, 0]]);
  });

  it('every node open (expanded: true): depth-first', () =>
  {
    toRows(flattenTree(data, { expanded: true }))
      .should.to.deep.equal([[1, 0], [2, 1], [4, 2], [5, 1], [3, 0]]);
  });

  it('open child of a closed parent stays hidden', () =>
  {
    toRows(flattenTree(data, { expanded: [2] })).should.to.deep.equal([[1, 0], [3, 0]]);
  });

  it('string ids in expanded', () =>
  {
    toRows(flattenTree(data, { expanded: ['1', '2'] }))
      .should.to.deep.equal([[1, 0], [2, 1], [4, 2], [5, 1], [3, 0]]);
  });

  it('node meta: parentId, hasChildren, isExpanded', () =>
  {
    const nodes = flattenTree(data, { expanded: [1] });

    expect(nodes[0].parentId).to.equal(undefined);
    nodes[0].hasChildren.should.to.equal(true);
    nodes[0].isExpanded.should.to.equal(true);

    nodes[1].parentId.should.to.equal(1);
    nodes[1].hasChildren.should.to.equal(true);
    nodes[1].isExpanded.should.to.equal(false);

    nodes[2].hasChildren.should.to.equal(false);
    nodes[2].isExpanded.should.to.equal(false);
  });

  it('keeps the original record', () =>
  {
    flattenTree(data)[0].record.should.to.equal(data[0]);
  });

  it('leaf in expanded is not expanded', () =>
  {
    flattenTree(data, { expanded: [3] })[1].isExpanded.should.to.equal(false);
  });

  it('missing parent (filtered list): the record is a root', () =>
  {
    toRows(flattenTree(data.filter(({ id }) => id !== 1), { expanded: true }))
      .should.to.deep.equal([[2, 0], [4, 1], [3, 0], [5, 0]]);
  });

  it('null / 0 parent is a root', () =>
  {
    toRows(flattenTree([{ id: 1, pid: null }, { id: 2, pid: 0 }]))
      .should.to.deep.equal([[1, 0], [2, 0]]);
  });

  it('self reference is a root', () =>
  {
    toRows(flattenTree([{ id: 1, pid: 1 }])).should.to.deep.equal([[1, 0]]);
  });

  it('circular reference does not loop', () =>
  {
    toRows(flattenTree([{ id: 1 }, { id: 2, pid: 1 }, { id: 3, pid: 2 }, { id: 2, pid: 3 }], { expanded: true }))
      .should.to.deep.equal([[1, 0], [2, 1], [3, 2]]);
  });

  it('custom keys', () =>
  {
    toRows(
      flattenTree(
        [{ key: 'a' }, { key: 'b', parent: 'a' }].map(record => ({ ...record, id: record.key })),
        { expanded: ['a'], idKey: 'key', parentKey: 'parent' },
      ),
    ).should.to.deep.equal([['a', 0], ['b', 1]]);
  });

  it('invalid input', () =>
  {
    flattenTree().should.to.deep.equal([]);
    flattenTree(null).should.to.deep.equal([]);
    flattenTree('foo').should.to.deep.equal([]);
    flattenTree([]).should.to.deep.equal([]);
  });
});
