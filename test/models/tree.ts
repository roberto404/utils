//@ts-nocheck

import { should } from 'chai';
import deepFreeze from 'deep-freeze';
import Tree from '../../src/models/tree';

should();


const sampleData = [
  {
    id: 1,
    title: 'Menu',
    pid: 0,
    pos: 0,
  },
  {
    id: 2,
    title: 'Menu 0',
    pid: 1,
    pos: 0,
  },
  {
    id: 6,
    title: 'Menu 2',
    pid: 1,
    pos: 2,
  },
  {
    id: 3,
    title: 'Menu 1',
    pid: 1,
    pos: 1,
  },
  {
    id: 8,
    title: 'Menu 1.1',
    pid: 3,
    pos: 1,
  },
  {
    id: 5,
    title: 'Menu 1.0',
    pid: 3,
    pos: 0,
  },
  {
    id: 11,
    title: 'Menu 0.0',
    pid: 2,
    pos: 0,
  },
  {
    id: 9,
    title: 'Menu 0.0.0',
    pid: 11,
    pos: 0,
  },
  {
    id: 4,
    title: 'Menu 3',
    pid: 1,
    pos: 3,
  },
];

const sampleData2 = [
 { id: "1", title: "matrac", pid: "0", pos: "0" },
 { id: "2", title: "alapanyag", pid: "1", pos: "0" },
 { id: "3", title: "rugós", pid: "2", pos: "0" },
 { id: "4", title: "hideghab", pid: "2", pos: "1" },
 { id: "5", title: "bio", pid: "2", pos: "2" },
 { id: "6", title: "rugó fajátja", pid: "3", pos: "0" },
 { id: "7", title: "bonell", pid: "6", pos: "0" },
 { id: "8", title: "táska", pid: "6", pos: "1" },
 { id: "9", title: "csomagolás", pid: "4", pos: "0" },
 { id: "10", title: "vakuum", pid: "9", pos: "0" },
 { id: "11", title: "normál", pid: "9", pos: "1" }
];

deepFreeze(sampleData);

let treeModel;

describe('Model: Tree:', () =>
{
  const env = process.env.NODE_ENV;

  before(() =>
  {
    process.env.NODE_ENV = 'production';
  });

  after(() =>
  {
    process.env.NODE_ENV = env;
  });

  beforeEach(() =>
  {
    treeModel = new Tree(sampleData2);
  });

  it('Initial', () =>
  {
    // const treeModel2 = new Data(sampleData, { order: { column: 'color', direction: 'asc' } });
    // treeModel.results.should.not.to.deep.equal(treeModel2.results);
    // treeModel.order = { column: 'color', direction: 'asc' };
    // treeModel.results.should.to.deep.equal(treeModel2.results);
  });

  it('Initial error', () =>
  {
    // const treeModel2 = new Data(undefined, false);
    // treeModel2.results.should.to.be.be.an('array').that.is.empty;
    //
    // const treeModel3 = new Data(sampleData, false);
    // treeModel3.results.should.to.be.be.an('array').that.is.empty;
    //
    // const treeModel4 = new Data(null, 1);
    // treeModel4.results.should.to.be.be.an('array').that.is.empty;
  });

  it('getChildren', () =>
  {
    // console.log(treeModel.getChildren(1));
    // console.log(treeModel.getChildren(2));


    // miért nem csak filter???
    // Object.keys(treeModel.getChildren(1)).length.should.to.be.equal(
    //   sampleData.filter(d => d.pid === 1).length
    // );
  });

  it('getChildren wrong params', () =>
  {
  });

  it('getItem', () =>
  {
    // miért nem csak find???
    // console.log(treeModel.getItem(1));
    // console.log(treeModel.getItem(2));
  });

  it('getTree', () =>
  {
    // miért nem csak find???
    // console.log(treeModel.getPath(11));
    // console.log(treeModel.getTree());
    // console.log(treeModel.getNestedTree());
    console.log(treeModel.getChildren(2));

  });





  //
  // it('Reverse order', () =>
  // {
  //   treeModel.order = { column: 'color', direction: 'desc' };
  //   treeModel.results.should.to.deep.equal([
  //     {
  //       id: 6,
  //       color: 'yellow',
  //       value: '#ff0',
  //     },
  //     {
  //       id: 1,
  //       color: 'red',
  //       value: '#f00',
  //       category: 'A',
  //     },
  //     {
  //       id: 5,
  //       color: 'magenta',
  //       value: '#f0f',
  //       category: 'B',
  //     },
  //     {
  //       id: 2,
  //       color: 'green',
  //       value: '#0f0',
  //       category: 'A',
  //     },
  //     {
  //       id: 4,
  //       color: 'cyan',
  //       value: '#0ff',
  //       category: 'A',
  //     },
  //     {
  //       id: 3,
  //       color: 'blue',
  //       value: '#00f',
  //       category: 'B',
  //     },
  //     {
  //       id: 7,
  //       color: 'black',
  //       value: '#000',
  //     },
  //   ]);
  // });
  //
  // it('Failed set order', () =>
  // {
  //   const results = treeModel.results;
  //
  //   // invalid order type: array
  //   treeModel.order = ['111', '222'];
  //   treeModel.results.should.to.deep.equal(results);
  //
  //   // invalid order type: string
  //   treeModel.order = '1111';
  //   treeModel.results.should.to.deep.equal(results);
  //
  //   // invalid order props object
  //   treeModel.order = { column: 'foo', direction: 'bar' };
  //   treeModel.results.should.to.deep.equal(results);
  //
  //   // reverse direction test
  //   treeModel.order = { column: 'color', direction: 'asc' };
  //   const resultA = treeModel.getResultByIndex(0);
  //   treeModel.order = { column: 'color', direction: 'desc' };
  //   const resultB = treeModel.getResultByIndex(treeModel.results.length - 1);
  //   resultA.should.to.deep.equal(resultB);
  //
  //   // order by integer
  //   treeModel.order = { column: 'id', direction: 'desc' };
  //   treeModel.results.should.to.deep.equal(sampleData.concat([]).reverse());
  //
  //   treeModel.order = { column: 'id' };
  //   treeModel.results.should.to.deep.equal(sampleData);
  // });
  //
  // it('Filter', () =>
  // {
  //   let firstChar = 'f';
  //
  //   const firstCharHandler = (record, char) =>
  //     record.value[1] === char;
  //
  //   treeModel.filters = [
  //     {
  //       id: 'hexcolor',
  //       handler: firstCharHandler,
  //       arguments: [firstChar],
  //       status: true,
  //     },
  //   ];
  //
  //   let filteredSampleDataLenght =
  //         sampleData
  //           .filter(record => firstCharHandler(record, firstChar))
  //           .length;
  //
  //   treeModel.results.length.should.to.equal(filteredSampleDataLenght);
  //
  //   firstChar = '0';
  //   treeModel.filters = [{ id: 'hexcolor', arguments: [firstChar] }];
  //   filteredSampleDataLenght =
  //     sampleData
  //       .filter(record => firstCharHandler(record, firstChar))
  //       .length;
  //
  //   treeModel.results.length.should.to.equal(filteredSampleDataLenght);
  //
  //   treeModel.filters = { id: 'hexcolor' };
  //   treeModel.results.length.should.to.equal(sampleData.length);
  //
  //   // missing filter handler
  //   treeModel.filters = [{ id: 'missing', status: true, arguments: [1] }];
  //   treeModel.filters = [{ id: 'hexcolor', status: true, arguments: [firstChar] }];
  // });
  //
  // it('Pagination', () =>
  // {
  //   treeModel.paginate.results.length.should.to.equal(sampleData.length);
  //
  //   treeModel.paginate = { page: 4, limit: 1 };
  //   treeModel.paginate.results.should.to.deep.equal([sampleData[3]]);
  //
  //   // invalid paginate type
  //   const paginateBefore = treeModel.paginate;
  //   treeModel.paginate = '123';
  //   treeModel.paginate.should.to.deep.equal(paginateBefore);
  // });
  //
  // it('Pagination no-limit', () =>
  // {
  //   const limitBefore = treeModel.paginate.limit;
  //   treeModel.paginate = { limit: 'string' };
  //   treeModel.paginate.limit.should.to.equal(limitBefore);
  //
  //   treeModel.paginate = { limit: 1 };
  //   treeModel.paginate.totalPage.should.to.equal(sampleData.length);
  //
  //   treeModel.paginate = { limit: 0 };
  //   treeModel.paginate.results.should.to.deep.equal(sampleData);
  // });
  //
  // it('Group by', () =>
  // {
  //   treeModel.getResultsGroupBy('color').should.satisfy(
  //     results => results
  //                 .every(r => findIndex(sampleData, { color: r.id }) > -1),
  //   );
  //
  //   treeModel.getResultsGroupBy('color').length.should.to.equal(sampleData.length);
  // });
  //
  // it('getDataByIndex', () =>
  // {
  //   treeModel.getDataByIndex(0).should.to.equal(sampleData[0]);
  //   treeModel.getDataByIndex(sampleData.length).should.to.be.false;
  // });
  //
  //
  // it('PivotTable', () =>
  // {
  //   treeModel.getPivotTable('id', sum).should.to.equal(28);
  //   treeModel.getPivotTable('category', count).should.to.equal(5);
  //   treeModel.getPivotTable('category', countUnique).should.to.equal(2);
  //   treeModel.getPivotTable('id', mean).should.to.equal(28 / 7);
  //   treeModel.getPivotTable('id', max).should.to.equal(7);
  //   treeModel.getPivotTable('id', min).should.to.equal(1);
  // });
  //
  // it('PivotTable with group', () =>
  // {
  //   treeModel.getPivotTable('id', max, 'category').should.to.deep.equal([
  //     { id: 'A', title: 4 },
  //     { id: 'B', title: 5 },
  //     { id: 'undefined', title: 7 },
  //     { id: 'max', title: 7 },
  //   ]);
  // });
  //
  // it('PivotTable only method', () =>
  // {
  //   treeModel.getPivotTable(countUnique).should.to.deep.equal({
  //     id: 7,
  //     color: 7,
  //     value: 7,
  //     category: 2,
  //   });
  // });
  //
  // it('Compact method', () =>
  // {
  //   const data = [
  //     { id: 0, A: 1, B: 'foo' },
  //     { id: 1, A: 1, B: 'bar' },
  //     { id: 2, A: 1, B: 'bar' },
  //     { id: 3, A: 2, B: 'bar' },
  //     { id: 4, A: 1, B: 'foo' },
  //     { id: 5, A: 1, B: 'foo' },
  //   ];
  //
  //   treeModel = new Data(data);
  //
  //   deepFreeze(data);
  //   deepFreeze(treeModel.results);
  //
  //   treeModel.compact('id').should.to.deep.equal([
  //     { id: [0, 4, 5], A: 1, B: 'foo' },
  //     { id: [1, 2], A: 1, B: 'bar' },
  //     { id: [3], A: 2, B: 'bar' },
  //   ]);
  // });
});
