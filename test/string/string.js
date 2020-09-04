import { expect, should } from 'chai';
import {
  capitalizeFirstLetter,
  slugify,
  toNumber,
  encrypt,
  decrypt,
  formatThousand,
  random,
  decimalToRoman,
} from '../../src/string'

should();

describe('capitalizeFirstLetter', () =>
{
  it('Normal', () =>
  {
    capitalizeFirstLetter('lorem ipsum').should.to.equal('Lorem ipsum');
  });

  it('Wrong attributes', () =>
  {

    expect(capitalizeFirstLetter('')).to.be.empty;
    expect(capitalizeFirstLetter(null)).to.be.empty;
    expect(capitalizeFirstLetter()).to.be.empty;
    capitalizeFirstLetter({ foo: 'bar' }).should.to.be.empty;
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

  it('Wrong input', () =>
  {
    slugify(1111).should.to.equal('1111');
    slugify([1, 2, 'bar']).should.to.equal('12bar');
    slugify({ foo: 'bar' }).should.to.equal('[object_object]');
    slugify(false).should.to.equal('false');
    slugify(undefined).should.to.equal('');
    slugify(null).should.to.equal('');
  });
});


describe('toNumber', () =>
{
  it('cast to Number', () =>
  {
    toNumber('1 300').should.to.be.an('number');
    toNumber('-1 300').should.to.be.an('number');
    toNumber('-1 300,500').should.to.be.an('number');
    toNumber('foo').should.to.be.an('number');
    toNumber('1 300').should.to.be.equal(1300);
    toNumber('-1 300,500').should.to.be.equal(-1300.5);
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
    // toNumber([1, false]).should.to.be.equal([1, false]);

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


describe('Encrypt/decrypt', () =>
{
  it('Use default algorithm', () =>
  {
    const text = 'hellotest';
    const password = 'hellopass';

    decrypt(encrypt(text, password), password).should.to.equal(text);
  });
});

describe('formatThousand', () =>
{
  it('normal use', () =>
  {
    formatThousand(1000000.25).should.to.equal('1 000 000.25');
    formatThousand(1000000).should.to.equal('1 000 000');
    formatThousand(1000000.25121).should.to.equal('1 000 000.25121');
    formatThousand(100).should.to.equal('100');
    formatThousand(1000000.25, '~').should.to.equal('1~000~000.25');
  });
});

describe('random', () =>
{
  it('normal use', () =>
  {
    random().length.should.to.equal(28);
    random(2).length.should.to.equal(2);
  });
});

describe('decimalToRoman', () =>
{
  it('normal use', () =>
  {
    decimalToRoman(14).should.to.equal('XIV');
  });
});
