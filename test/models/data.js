import { expect, should } from 'chai';
import { findIndex, clone } from 'lodash';
import { Data } from '../../src/models'

should();


const sampleData = [
  {
    id: 1,
    color: 'red',
    value: '#f00',
  },
  {
    id: 2,
    color: 'green',
    value: '#0f0',
  },
  {
    id: 3,
    color: 'blue',
    value: '#00f',
  },
  {
    id: 4,
    color: 'cyan',
    value: '#0ff',
  },
  {
    id: 5,
    color: 'magenta',
    value: '#f0f',
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

let dataModel;

describe('Model: Data:', () =>
{
  beforeEach(() =>
  {
    dataModel = new Data(sampleData);
  });

  it('Initial', (done) =>
  {
    const dataModel2 = new Data(sampleData, { order: { column: 'color', direction: 'asc' } });
    dataModel.results.should.not.to.deep.equal(dataModel2.results);
    dataModel.order = { column: 'color', direction: 'asc' }
    dataModel.results.should.to.deep.equal(dataModel2.results);

    done();
  });

  it('Ordering process', (done) =>
  {
    dataModel.order = { column: 'color', direction: 'asc' }
    dataModel.results.should.not.to.deep.equal(sampleData);
    dataModel.results.should.satisfy(
      results => results
                 .every(r => findIndex(sampleData, r) > -1 )
    );

    done();
  });

  it('Failed set order', (done) =>
  {
    const results = clone(dataModel.results);

    // invalid order type: array
    dataModel.order = ['111', '222'];
    dataModel.results.should.to.deep.equal(results);

    // invalid order type: string
    dataModel.order = '1111';
    dataModel.results.should.to.deep.equal(results);

    // invalid order props object
    dataModel.order = { column: 'foo', direction: 'bar' }
    dataModel.results.should.to.deep.equal(results);

    // reverse direction test
    dataModel.order = { column: 'color', direction: 'asc' }
    const resultA = dataModel.getResultByIndex(0);
    dataModel.order = { column: 'color', direction: 'desc' }
    const resultB = dataModel.getResultByIndex(dataModel.results.length - 1);
    resultA.should.to.deep.equal(resultB);

    // order by integer
    dataModel.order = { column: 'id', direction: 'desc' }
    dataModel.results.should.to.deep.equal(sampleData.reverse());

    dataModel.order = { column: 'id' };
    dataModel.results.should.to.deep.equal(sampleData);

    done();
  });

  it('Filter', (done) =>
  {
    let firstChar = 'f';

    const firstCharHandler = (record, char) =>
    {
      return record.value[1] === char;
    }

    dataModel.filters = [
      {
        id: 'hexcolor',
        handler: firstCharHandler,
        arguments: [firstChar],
        status: true,
      }
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

    done();
  });

  it('Pagination', (done) =>
  {
    dataModel.paginate.results.length.should.to.equal(sampleData.length);

    dataModel.paginate = { page:4, limit:1 };
    dataModel.paginate.results.should.to.deep.equal([sampleData[3]]);

    // invalid paginate type
    const paginateBefore = dataModel.paginate;
    dataModel.paginate = '123';
    dataModel.paginate.should.to.deep.equal(paginateBefore);

    done();
  });

  it('Group by', (done) =>
  {
    dataModel.getResultsGroupBy('color').should.satisfy(
      results => results
                  .every(r => findIndex(sampleData, { color: r.label }) > -1)
    );

    dataModel.getResultsGroupBy('color').length.should.to.equal(sampleData.length);

    done();
  });

  it('getDataByIndex', (done) =>
  {
    dataModel.getDataByIndex(0).should.to.equal(sampleData[0]);
    dataModel.getDataByIndex(sampleData.length).should.to.be.false;
    done();
  });

  it('getResultByIndex', (done) =>
  {
    dataModel.getResultByIndex(0).should.to.equal(sampleData[0]);
    dataModel.getResultByIndex(sampleData.length).should.to.be.false;
    done();
  });
});
