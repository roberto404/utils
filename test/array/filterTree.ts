// @ts-nocheck

import { expect, should } from 'chai';
import filterTree from '../../src/array/filterTree';
import { filterTree as filterTreeBarrel } from '../../src/array';

should();


/**
 * 1 Nappali
 * ├ 2 Kanapék
 * │ └ 4 Sarokkanapék
 * └ 5 Fotelek
 * 3 Hálószoba
 * └ 6 Ágyak
 */
const data = [
  { id: 1, title: 'Nappali' },
  { id: 2, pid: 1, title: 'Kanapék' },
  { id: 3, title: 'Hálószoba' },
  { id: 4, pid: 2, title: 'Sarokkanapék' },
  { id: 5, pid: 1, title: 'Fotelek' },
  { id: 6, pid: 3, title: 'Ágyak' },
];

const search = query => ({ title }) => title.toLowerCase().includes(query);
const ids = records => records.map(({ id }) => id);


describe('filterTree', () =>
{
  it('registered in the barrel', () =>
  {
    filterTreeBarrel.should.to.equal(filterTree);
  });

  it('deep match with every ancestor', () =>
  {
    const result = filterTree(data, search('sarok'));

    ids(result.records).should.to.deep.equal([1, 2, 4]);
    result.matches.should.to.deep.equal([4]);
    result.ancestors.should.to.deep.equal([2, 1]);
    result.parents.should.to.deep.equal([1, 2]);
  });

  it('more matches: input order, without duplicated ancestors', () =>
  {
    const result = filterTree(data, search('k'));

    // Kanapék, Sarokkanapék, Fotelek, Ágyak
    ids(result.records).should.to.deep.equal([1, 2, 3, 4, 5, 6]);
    result.matches.should.to.deep.equal([2, 4, 5, 6]);
    result.ancestors.should.to.deep.equal([1, 3]);
  });

  it('matched parent is not an ancestor', () =>
  {
    const result = filterTree(data, search('kanap'));

    ids(result.records).should.to.deep.equal([1, 2, 4]);
    result.matches.should.to.deep.equal([2, 4]);
    result.ancestors.should.to.deep.equal([1]);
    // the matched Kanapék has to be open too: Sarokkanapék is a match
    result.parents.should.to.deep.equal([1, 2]);
  });

  it('children of a match are not included', () =>
  {
    const result = filterTree(data, search('nappali'));

    ids(result.records).should.to.deep.equal([1]);
    result.parents.should.to.deep.equal([]);
  });

  it('no match', () =>
  {
    filterTree(data, search('xyz')).should.to.deep.equal({ records: [], matches: [], ancestors: [], parents: [] });
  });

  it('every record matches', () =>
  {
    const result = filterTree(data, () => true);

    result.records.should.to.deep.equal(data);
    result.ancestors.should.to.deep.equal([]);
  });

  it('missing parent: the chain ends', () =>
  {
    ids(filterTree([{ id: 2, pid: 1, title: 'a' }], () => true).records).should.to.deep.equal([2]);
  });

  it('circular reference does not loop', () =>
  {
    const result = filterTree([{ id: 1, pid: 2 }, { id: 2, pid: 1 }, { id: 3, pid: 3 }], ({ id }) => id !== 2);

    ids(result.records).should.to.deep.equal([1, 2, 3]);
    result.ancestors.should.to.deep.equal([2]);
    result.parents.should.to.deep.equal([1, 2]);
  });

  it('custom keys, string ids', () =>
  {
    const result = filterTree(
      [{ key: 'a' }, { key: 'b', parent: 'a' }],
      ({ key }) => key === 'b',
      { idKey: 'key', parentKey: 'parent' },
    );

    result.matches.should.to.deep.equal(['b']);
    result.ancestors.should.to.deep.equal(['a']);
  });

  it('invalid input', () =>
  {
    const empty = { records: [], matches: [], ancestors: [], parents: [] };

    filterTree(undefined, () => true).should.to.deep.equal(empty);
    filterTree(null, () => true).should.to.deep.equal(empty);
    filterTree(data).should.to.deep.equal(empty);
  });
});
