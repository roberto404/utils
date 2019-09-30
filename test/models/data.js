import { expect, should } from 'chai';
import deepFreeze from 'deep-freeze';
import
{
  findIndex,
  sum,
  max,
  min,
  mean,
} from 'lodash';
import count from '../../src/array/count';
import countUnique from '../../src/array/countUnique';
import { Data } from '../../src/models';


should();


const sampleData = [
  {
    id: 1,
    color: 'red',
    value: '#f00',
    category: 'A',
  },
  {
    id: 2,
    color: 'green',
    value: '#0f0',
    category: 'A',
  },
  {
    id: 3,
    color: 'blue',
    value: '#00f',
    category: 'B',
  },
  {
    id: 4,
    color: 'cyan',
    value: '#0ff',
    category: 'A',
  },
  {
    id: 5,
    color: 'magenta',
    value: '#f0f',
    category: 'B',
  },
  {
    id: 6,
    color: 'yellow',
    value: '#ff0',
  },
  {
    id: 7,
    color: 'black',
    value: '#000',
  },
];

deepFreeze(sampleData);

let dataModel;

describe('Model: Data:', () =>
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
    dataModel = new Data(sampleData);
  });

  it('Initial', () =>
  {
    const dataModel2 = new Data(sampleData, { order: { column: 'color', direction: 'asc' } });
    dataModel.results.should.not.to.deep.equal(dataModel2.results);
    dataModel.order = { column: 'color', direction: 'asc' };
    dataModel.results.should.to.deep.equal(dataModel2.results);
  });

  it('Initial error', () =>
  {
    const dataModel2 = new Data(undefined, false);
    dataModel2.results.should.to.be.be.an('array').that.is.empty;

    const dataModel3 = new Data(sampleData, false);
    dataModel3.results.should.to.be.be.an('array').that.is.empty;

    const dataModel4 = new Data(null, 1);
    dataModel4.results.should.to.be.be.an('array').that.is.empty;
  });

  it('Ordering process', () =>
  {
    dataModel.order = { column: 'color', direction: 'asc' };
    dataModel.results.should.not.to.deep.equal(sampleData);
    dataModel.results.should.satisfy(
      results => results
                 .every(r => findIndex(sampleData, r) > -1),
    );
  });

  it('Reverse order', () =>
  {
    dataModel.order = { column: 'color', direction: 'desc' };
    dataModel.results.should.to.deep.equal([
      {
        id: 6,
        color: 'yellow',
        value: '#ff0',
      },
      {
        id: 1,
        color: 'red',
        value: '#f00',
        category: 'A',
      },
      {
        id: 5,
        color: 'magenta',
        value: '#f0f',
        category: 'B',
      },
      {
        id: 2,
        color: 'green',
        value: '#0f0',
        category: 'A',
      },
      {
        id: 4,
        color: 'cyan',
        value: '#0ff',
        category: 'A',
      },
      {
        id: 3,
        color: 'blue',
        value: '#00f',
        category: 'B',
      },
      {
        id: 7,
        color: 'black',
        value: '#000',
      },
    ]);
  });

  it('Failed set order', () =>
  {
    const results = dataModel.results;

    // invalid order type: array
    dataModel.order = ['111', '222'];
    dataModel.results.should.to.deep.equal(results);

    // invalid order type: string
    dataModel.order = '1111';
    dataModel.results.should.to.deep.equal(results);

    // invalid order props object
    dataModel.order = { column: 'foo', direction: 'bar' };
    dataModel.results.should.to.deep.equal(results);

    // reverse direction test
    dataModel.order = { column: 'color', direction: 'asc' };
    const resultA = dataModel.getResultByIndex(0);
    dataModel.order = { column: 'color', direction: 'desc' };
    const resultB = dataModel.getResultByIndex(dataModel.results.length - 1);
    resultA.should.to.deep.equal(resultB);

    // order by integer
    dataModel.order = { column: 'id', direction: 'desc' };
    dataModel.results.should.to.deep.equal(sampleData.concat([]).reverse());

    dataModel.order = { column: 'id' };
    dataModel.results.should.to.deep.equal(sampleData);
  });

  it('Set order seems like isNaN', () =>
  {
    const results = [
      { id: 4, title: 1 },
      { id: 1, title: '2' },
      { id: 3, title: 'abc' },
      { id: 2, title: 'cba' },
    ];

    const isNanSampleData1 = [
      { id: 1, title: '2' },
      { id: 2, title: 'cba' },
      { id: 3, title: 'abc' },
      { id: 4, title: 1 },
    ];

    const isNanSampleData2 = [
      { id: 4, title: 1 },
      { id: 2, title: 'cba' },
      { id: 3, title: 'abc' },
      { id: 1, title: '2' },
    ];

    const dataModel1 = new Data(isNanSampleData1, { order: { column: 'title', direction: 'asc' } });
    dataModel1.results.should.to.deep.equal(results);

    const dataModel3 = new Data(isNanSampleData2, { order: { column: 'title', direction: 'asc' } });
    dataModel3.results.should.to.deep.equal(results);
  });

  it('Filter', () =>
  {
    let firstChar = 'f';

    const firstCharHandler = (record, char) =>
      record.value[1] === char;

    dataModel.filters = [
      {
        id: 'hexcolor',
        handler: firstCharHandler,
        arguments: [firstChar],
        status: true,
      },
    ];

    let filteredSampleDataLenght =
          sampleData
            .filter(record => firstCharHandler(record, firstChar))
            .length;

    dataModel.results.length.should.to.equal(filteredSampleDataLenght);

    firstChar = '0';
    dataModel.filters = [{ id: 'hexcolor', arguments: [firstChar] }];
    filteredSampleDataLenght =
      sampleData
        .filter(record => firstCharHandler(record, firstChar))
        .length;

    dataModel.results.length.should.to.equal(filteredSampleDataLenght);

    dataModel.filters = { id: 'hexcolor' };
    dataModel.results.length.should.to.equal(sampleData.length);

    // missing filter handler
    dataModel.filters = [{ id: 'missing', status: true, arguments: [1] }];
    dataModel.filters = [{ id: 'hexcolor', status: true, arguments: [firstChar] }];
  });

  it('Pagination', () =>
  {
    dataModel.paginate.results.length.should.to.equal(sampleData.length);

    dataModel.paginate = { page: 4, limit: 1 };
    dataModel.paginate.results.should.to.deep.equal([sampleData[3]]);

    // invalid paginate type
    const paginateBefore = dataModel.paginate;
    dataModel.paginate = '123';
    dataModel.paginate.should.to.deep.equal(paginateBefore);
  });

  it('Pagination no-limit', () =>
  {
    const limitBefore = dataModel.paginate.limit;
    dataModel.paginate = { limit: 'string' };
    dataModel.paginate.limit.should.to.equal(limitBefore);

    dataModel.paginate = { limit: 1 };
    dataModel.paginate.totalPage.should.to.equal(sampleData.length);

    dataModel.paginate = { limit: 0 };
    dataModel.paginate.results.should.to.deep.equal(sampleData);
  });

  it('Group by', () =>
  {
    dataModel.getResultsGroupBy('color').should.satisfy(
      results => results
                  .every(r => findIndex(sampleData, { color: r.id }) > -1),
    );

    dataModel.getResultsGroupBy('color').length.should.to.equal(sampleData.length);
  });

  it('getDataByIndex', () =>
  {
    dataModel.getDataByIndex(0).should.to.equal(sampleData[0]);
    dataModel.getDataByIndex(sampleData.length).should.to.be.false;
  });


  it('PivotTable', () =>
  {
    dataModel.getPivotTable('id', sum).should.to.equal(28);
    dataModel.getPivotTable('category', count).should.to.equal(5);
    dataModel.getPivotTable('category', countUnique).should.to.equal(2);
    dataModel.getPivotTable('id', mean).should.to.equal(28 / 7);
    dataModel.getPivotTable('id', max).should.to.equal(7);
    dataModel.getPivotTable('id', min).should.to.equal(1);
  });

  it('PivotTable with group', () =>
  {
    dataModel.getPivotTable('id', max, 'category').should.to.deep.equal([
      { id: 'A', title: 4 },
      { id: 'B', title: 5 },
      { id: 'undefined', title: 7 },
      { id: 'max', title: 7 },
    ]);
  });

  it('PivotTable only method', () =>
  {
    dataModel.getPivotTable(countUnique).should.to.deep.equal({
      id: 7,
      color: 7,
      value: 7,
      category: 2,
    });
  });

  it('Compact method', () =>
  {
    const data = [
      { id: 0, A: 1, B: 'foo' },
      { id: 1, A: 1, B: 'bar' },
      { id: 2, A: 1, B: 'bar' },
      { id: 3, A: 2, B: 'bar' },
      { id: 4, A: 1, B: 'foo' },
      { id: 5, A: 1, B: 'foo' },
    ];

    dataModel = new Data(data);

    deepFreeze(data);
    deepFreeze(dataModel.results);

    dataModel.compact('id').should.to.deep.equal([
      { id: [0, 4, 5], A: 1, B: 'foo' },
      { id: [1, 2], A: 1, B: 'bar' },
      { id: [3], A: 2, B: 'bar' },
    ]);
  });
});
