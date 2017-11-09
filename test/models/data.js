import { expect, should } from 'chai';
import deepFreeze from 'deep-freeze';
import
{
  findIndex,
  clone,
  chain,
  sum,
  max,
  min,
  mean,
} from 'lodash';
import { foo } from '../../src/array';
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

  it('Ordering process', () =>
  {
    dataModel.order = { column: 'color', direction: 'asc' };
    dataModel.results.should.not.to.deep.equal(sampleData);
    dataModel.results.should.satisfy(
      results => results
                 .every(r => findIndex(sampleData, r) > -1),
    );
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
    dataModel.getPivotTable('category', count).should.to.equal(7);
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
  })
});
