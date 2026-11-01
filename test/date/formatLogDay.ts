import { should } from 'chai';
import { formatLogDay } from '../../src/date';

should();

describe('date: formatLogDay', () => {
  const now = new Date(2026, 9, 31, 10, 0, 0);

  it('current year -> month + day', () => {
    formatLogDay('2026-10-12 08:30:00', now).should.to.equal('okt. 12.');
    formatLogDay('2026-01-02', now).should.to.equal('jan. 2.');
  });

  it('other year -> with the year', () => {
    formatLogDay('2025-10-12 08:30:00', now).should.to.equal('2025. okt. 12.');
    formatLogDay('2021-02-01 08:00:22', now).should.to.equal('2021. feb. 1.');
    formatLogDay('2027-03-05', now).should.to.equal('2027. márc. 5.');
  });

  it('same day of different years are different labels', () => {
    formatLogDay('2025-05-10', now).should.not.equal(formatLogDay('2026-05-10', now));
  });

  it('relative: today / yesterday', () => {
    formatLogDay('2026-10-31 00:00:01', now, { relative: true }).should.to.equal('Ma');
    formatLogDay('2026-10-30 23:59:59', now, { relative: true }).should.to.equal('Tegnap');
    formatLogDay('2026-10-29 12:00:00', now, { relative: true }).should.to.equal('okt. 29.');
    formatLogDay('2026-10-31 08:00:00', now).should.to.equal('okt. 31.');
  });

  it('yesterday over the year boundary', () => {
    formatLogDay('2025-12-31 20:00:00', new Date(2026, 0, 1), { relative: true }).should.to.equal('Tegnap');
    formatLogDay('2025-12-30 20:00:00', new Date(2026, 0, 1), { relative: true }).should.to.equal('2025. dec. 30.');
  });

  it('Date, timestamp and ISO input', () => {
    formatLogDay(new Date(2024, 6, 4), now).should.to.equal('2024. júl. 4.');
    formatLogDay(new Date(2026, 6, 4).getTime(), now).should.to.equal('júl. 4.');
    formatLogDay('2026-07-04T10:20:00', now).should.to.equal('júl. 4.');
  });

  it('invalid input -> empty string', () => {
    formatLogDay('', now).should.to.equal('');
    formatLogDay('nem dátum', now).should.to.equal('');
    formatLogDay(new Date('x'), now).should.to.equal('');
  });
});
