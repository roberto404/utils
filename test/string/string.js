import { expect, should } from 'chai';
import { capitalizeFirstLetter, slugify, toNumber } from '../../src/string'

should();

describe('capitalizeFirstLetter', () =>
{
  it('Normal', () =>
  {
    capitalizeFirstLetter('lorem ipsum').should.to.equal('Lorem ipsum');
  });
});

describe('slugify', () =>
{
  it('Normal', () =>
  {
    slugify('Lorem    ipSum').should.to.equal('lorem_ipsum');
    slugify('Lorem    ipSum').should.to.equal('lorem_ipsum');
    slugify('    LOREM   Ipsum    ').should.to.equal('lorem_ipsum');
    slugify('lorem#Ipsum').should.to.equal('lorem-ipsum');
    slugify('±!@$%^&*()+~|?><}{,.').should.to.equal('');
    slugify('íéáűúüóőö').should.to.equal('ieauuuooo');
    slugify('ŤŢŦȚ').should.to.equal('tttt');
    slugify('  lorém_Íp_sum').should.to.equal('lorem_ip_sum');
  });
});


describe('toNumber', () =>
{
  it('cast to Number', () =>
  {
    toNumber('1 300').should.to.be.an('number');
    toNumber('-1 300').should.to.be.an('number');
    toNumber('foo').should.to.be.an('number');
  });

  it('failed type of param', () =>
  {
    isNaN(toNumber('-1 3-00')).should.to.be.true;
    isNaN(toNumber('1,3,0,0')).should.to.be.true;
    isNaN(toNumber('1.3.0.0')).should.to.be.true;
    isNaN(toNumber('~1300')).should.to.be.true;
    isNaN(toNumber(undefined)).should.to.be.true;
    isNaN(toNumber(null)).should.to.be.true;
    isNaN(toNumber([1, false])).should.to.be.true;

    toNumber(1300).should.to.be.equal(1300);
  });

  it('correct param', () =>
  {
    toNumber('1 300').should.to.be.equal(1300);
    toNumber('1,300').should.to.be.equal(1.3);
  });

  it('negativ param', () =>
  {
    toNumber('-1 300').should.to.be.equal(-1300);
    toNumber('-1,300').should.to.be.equal(-1.3);
  });
});