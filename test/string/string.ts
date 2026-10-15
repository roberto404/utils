//@ts-nocheck

import { expect, should } from 'chai';
import {
  capitalizeFirstLetter,
  slugify,
  toNumber,
  encrypt,
  decrypt,
  formatThousand,
  formatPhone,
  random,
  decimalToRoman,
  romanToDecimal,
  snakeToCamelCase,
  extractLabeledValues,
  parseTemplate,
  stringifyTemplate,
  diffWords,
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


// describe('Encrypt/decrypt', () =>
// {
//   it('Use default algorithm', () =>
//   {
//     const text = 'hellotest';
//     const password = 'hellopass';

//     decrypt(encrypt(text, password), password).should.to.equal(text);
//   });
// });

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

describe('formatPhone', () =>
{
  it('strips +36 country code by default', () =>
  {
    formatPhone('+36203539677').should.to.equal('20 353-9677');
  });

  it('strips 36 country code by default', () =>
  {
    formatPhone('36203539677').should.to.equal('20 353-9677');
  });

  it('strips 06 dial-out prefix', () =>
  {
    formatPhone('06203539677').should.to.equal('20 353-9677');
  });

  it('formats local number without prefix', () =>
  {
    formatPhone('203539677').should.to.equal('20 353-9677');
  });

  it('keeps country code when hideCountry is false', () =>
  {
    formatPhone('+36203539677', false).should.to.equal('+36 20 353-9677');
    formatPhone('36203539677', false).should.to.equal('+36 20 353-9677');
  });

  it('does not prepend country code when input had none', () =>
  {
    formatPhone('203539677', false).should.to.equal('20 353-9677');
  });

  it('ignores spaces, dashes and other separators in input', () =>
  {
    formatPhone('+36 20 353-9677').should.to.equal('20 353-9677');
    formatPhone('06-20-353-9677').should.to.equal('20 353-9677');
    formatPhone('(+36) 20/353 9677').should.to.equal('20 353-9677');
  });

  it('accepts numeric input', () =>
  {
    formatPhone(36203539677).should.to.equal('20 353-9677');
  });

  it('returns empty string for empty/null/undefined', () =>
  {
    expect(formatPhone('')).to.equal('');
    expect(formatPhone(null)).to.equal('');
    expect(formatPhone(undefined)).to.equal('');
  });

  it('returns original input when too short to format', () =>
  {
    formatPhone('1234').should.to.equal('1234');
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

describe('romanToDecimal', () =>
{
  it('normal use', () =>
  {
    romanToDecimal('XIV').should.to.equal(14);
    romanToDecimal('xiv').should.to.equal(14);
    romanToDecimal('XIV.').should.to.equal(14);
    romanToDecimal('IV...').should.to.equal(4);
  });

  it('invalid input', () =>
  {
    isNaN(romanToDecimal('')).should.to.be.true;
    isNaN(romanToDecimal('FOO')).should.to.be.true;
    isNaN(romanToDecimal('IM')).should.to.be.true;
    isNaN(romanToDecimal(null)).should.to.be.true;
  });
});

describe('snakeToCamelCase', () =>
{
  it('normal use', () =>
  {
    snakeToCamelCase('lorem_ipsum').should.to.equal('loremIpsum');
  });

  it('dot separated use', () =>
  {
    snakeToCamelCase('lorem.ipsum', false, '.').should.to.equal('loremIpsum');
  });

  it('PascalCase', () =>
  {
    snakeToCamelCase('lorem_ipsum', true).should.to.equal('LoremIpsum');
  });
});

describe('extractLabeledValues', () =>
{
  const DESCRIPTION = 'Test színe: 116 KORPUSZ FEHÉR bútorlap ; Ajtó színe: 116 KORPUSZ FEHÉR bútorlap ; Fogó: R-19 (9,6) fogantyú; Kivetőpánt: GTV Kivetőpánt ráütődő /sima/; Ajtós-fiókos rész állása (szemből): Jobb oldali; ';

  it('normal use', () =>
  {
    const result = extractLabeledValues(DESCRIPTION, ['Test színe', 'Fogó', 'Ajtós-fiókos rész állása (szemből)']);

    expect(result.values).to.deep.equal({
      'Test színe': '116 KORPUSZ FEHÉR bútorlap',
      'Fogó': 'R-19 (9,6) fogantyú',
      'Ajtós-fiókos rész állása (szemből)': 'Jobb oldali',
    });
    result.rest.should.to.equal('Ajtó színe: 116 KORPUSZ FEHÉR bútorlap; Kivetőpánt: GTV Kivetőpánt ráütődő /sima/');
  });

  it('keeps label order and fills missing labels with empty string', () =>
  {
    const result = extractLabeledValues(DESCRIPTION, ['Fióksín', 'Fogó']);

    Object.keys(result.values).should.to.deep.equal(['Fióksín', 'Fogó']);
    result.values['Fióksín'].should.to.equal('');
  });

  it('case and whitespace insensitive labels', () =>
  {
    extractLabeledValues('ajtó  SZÍNE : fehér', [' Ajtó színe'])
      .values[' Ajtó színe'].should.to.equal('fehér');
  });

  it('value with delimiter and segment without label', () =>
  {
    const result = extractLabeledValues('Idő: 10:30; szabad szöveg', ['Idő']);

    result.values['Idő'].should.to.equal('10:30');
    result.rest.should.to.equal('szabad szöveg');
  });

  it('custom separator and delimiter', () =>
  {
    extractLabeledValues('a=1|b=2', ['b'], { separator: '|', delimiter: '=' })
      .should.to.deep.equal({ values: { b: '2' }, rest: 'a=1' });
  });

  it('invalid input', () =>
  {
    extractLabeledValues(null, ['a']).should.to.deep.equal({ values: { a: '' }, rest: '' });
    extractLabeledValues('a: 1', undefined).should.to.deep.equal({ values: {}, rest: 'a: 1' });
  });
});


describe('parseTemplate / stringifyTemplate', () =>
{
  const TITLES = [
    { id: '{features/10}', title: 'Szín' },
    { id: '{dimension/w}', title: 'Szélesség' },
  ];

  it('variables, free texts, last text is the input string', () =>
  {
    parseTemplate('{features/10}, {features/35} cm', TITLES).should.to.deep.equal([
      { id: '{features/10}', title: 'Szín' },
      { text: ', ' },
      { id: '{features/35}', title: '{features/35}' },
      ' cm',
    ]);
  });

  it('text glued to the variables', () =>
  {
    parseTemplate('matrac {dimension/w}x{dimension/d}', TITLES).should.to.deep.equal([
      { text: 'matrac ' },
      { id: '{dimension/w}', title: 'Szélesség' },
      { text: 'x' },
      { id: '{dimension/d}', title: '{dimension/d}' },
    ]);
  });

  it('lossless round trip', () =>
  {
    [
      '{features/10},  {features/35}, {features/55}',
      'matrac {dimension/w}x{dimension/d} cm',
      '{features/3} {features/1} {features/4} {features/7} ',
      '{category}',
      'csak szöveg',
      '',
    ].forEach((template) =>
    {
      stringifyTemplate(parseTemplate(template, TITLES)).should.to.equal(template);
    });
  });

  it('invalid input', () =>
  {
    parseTemplate(null).should.to.deep.equal([]);
    parseTemplate(undefined).should.to.deep.equal([]);
    stringifyTemplate(undefined).should.to.equal('');
    stringifyTemplate('{features/1}').should.to.equal('');
  });
});


describe('diffWords', () =>
{
  const changed = tokens => tokens.filter(({ changed }) => changed).map(({ text }) => text);
  const join = tokens => tokens.map(({ text }) => text).join('');

  it('replaced word', () =>
  {
    const { removed, added, isChanged } = diffWords('matrac 80x200 cm, habszivacs', 'matrac 80x200 cm, kókusz');

    changed(removed).should.to.deep.equal(['habszivacs']);
    changed(added).should.to.deep.equal(['kókusz']);
    isChanged.should.to.equal(true);
  });

  it('tokens give back the original texts', () =>
  {
    const oldText = 'sarokgarnitúra (világosszürke), rugós';
    const newText = 'sarokgarnitúra (világos szürke) ágyneműtartós';
    const { removed, added } = diffWords(oldText, newText);

    join(removed).should.to.equal(oldText);
    join(added).should.to.equal(newText);
  });

  it('punctuation is a separate token', () =>
  {
    const { removed, added } = diffWords('habszivacs,', 'habszivacs');

    changed(removed).should.to.deep.equal([',']);
    changed(added).should.to.deep.equal([]);
  });

  it('whitespace never changed', () =>
  {
    const { removed, added, isChanged } = diffWords('a  b', 'a b');

    changed(removed).should.to.deep.equal([]);
    changed(added).should.to.deep.equal([]);
    isChanged.should.to.equal(false);
  });

  it('empty and invalid input', () =>
  {
    changed(diffWords('', 'új név').added).should.to.deep.equal(['új', 'név']);
    changed(diffWords('régi', null).removed).should.to.deep.equal(['régi']);
    diffWords(undefined, undefined).should.to.deep.equal({ removed: [], added: [], isChanged: false });
  });
});
