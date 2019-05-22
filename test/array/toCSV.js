import { expect, should } from 'chai';
import toCSV from '../../src/array/toCSV'


const data = [
  { id: 1, name: 'Megan J. Cushman', gender: 1, visits: '2017-07-23' },
  { id: 2, name: 'Taylor R. Fallin', gender: 2, visits: '2017-07-22' },
];

const csv = `id,name,gender,visits
1,Megan J. Cushman,1,2017-07-23
2,Taylor R. Fallin,2,2017-07-22
sep=,`;

const hook = {
  id: 'Id',
  name: {},
  gender: {
    title: 'Gender',
  },
  visits: {
    title: {
      props: {
        children: ['Visits'],
      },
    },
  },
};

should();

describe('toCSV', () =>
{
  it('basic', () =>
  {
    toCSV(data).should.to.be.equal(csv);
  });

  it('basic with hook', () =>
  {
    // console.log(toCSV(data, hook));

    const result = `Id,name,Gender,Visits
1,Megan J. Cushman,1,2017-07-23
2,Taylor R. Fallin,2,2017-07-22
sep=,`;
    toCSV(data, hook).should.to.be.equal(result);
  });
});
