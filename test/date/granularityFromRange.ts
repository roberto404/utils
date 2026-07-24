import { should } from 'chai';
import { granularityFromRange, granularityFromDates } from '../../src/date';

should();

describe('date: granularityFromRange', () => {
  it('<= 14 days -> day', () => {
    granularityFromRange('2025-06-01', '2025-06-07').should.to.equal('day');
    granularityFromRange('2025-06-01', '2025-06-15').should.to.equal('day');
  });

  it('<= 24 months -> month', () => {
    granularityFromRange('2025-01-01', '2025-08-01').should.to.equal('month');
    granularityFromRange('2024-01-01', '2025-12-01').should.to.equal('month');
  });

  it('> 24 months -> year', () => {
    granularityFromRange('2019-01-01', '2025-01-01').should.to.equal('year');
  });

  it('accepts Date and ms, order independent', () => {
    granularityFromRange(new Date('2025-06-01'), new Date('2025-06-05')).should.to.equal('day');
    granularityFromRange(0, 5 * 24 * 60 * 60 * 1000).should.to.equal('day');
    granularityFromRange('2025-06-07', '2025-06-01').should.to.equal('day');
  });

  it('granularityFromDates uses min & max', () => {
    granularityFromDates(['2025-06-03', '2025-06-01', '2025-06-05']).should.to.equal('day');
    granularityFromDates(['2025-01-01', '2020-01-01', '2025-06-01']).should.to.equal('year');
    granularityFromDates([]).should.to.equal('day');
  });
});
