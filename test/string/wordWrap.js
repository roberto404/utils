import { should } from 'chai';
import wordWrap from '../../src/string/wordWrap'

should();

const string = 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.';
const length = 50;
const results = [
  'Lorem ipsum dolor sit amet, consectetur adipiscing',
  'elit, sed do eiusmod tempor incididunt ut labore',
  'et dolore magna aliqua. Ut enim ad minim veniam,',
  'quis nostrud exercitation ullamco laboris nisi ut',
  'aliquip ex ea commodo consequat.',
];

describe('wordWrap', () =>
{
  it('correct wrapped lines', () =>
  {
    const wrappedString = wordWrap(string, length);
    wrappedString.split('\n').length.should.to.be.equal(results.length);
    wrappedString.split('\n')[3].length.should.to.be.equal(results[3].length);
  });

  it('width separator', () =>
  {
    const wrappedString = wordWrap(string.substr(100, 20), 10, { separator: '|' });
    const wrappedLength = wrappedString.split('|').length;
    ([1, 2].indexOf(wrappedLength) !== -1).should.to.be.true;
  });

  it('no empty line', () =>
  {
    for (let i = 10; i < string.length; i += 10)
    {
      const wrappedString = wordWrap(string.substr(0, i), 10);
      const wrapperArray = wrappedString.split('\n');

      (wrapperArray.indexOf('') === -1).should.to.be.true;
      (wrapperArray.length >= i / 10).should.to.be.true;
    }
  });

  it('trimmed empty line', () =>
  {
    const needTrim = '      Lorem ipsum dolor sit amet, consectetur ';
    (wordWrap(needTrim, 10).split('\n').indexOf('') === -1).should.to.be.true;
  })

  it('one line', () =>
  {
    (wordWrap('', 0) === '').should.to.be.true;
    (wordWrap('Lorem ipsum', 11) === 'Lorem ipsum').should.to.be.true;
    (wordWrap('Lorem ipsum', 20) === 'Lorem ipsum').should.to.be.true;
    (wordWrap('Loremipsum', 0) === 'Loremipsum').should.to.be.true;
    wordWrap('a s d f', 10).should.to.be.equal('a s d f');
  })


  it('failed type of param', () =>
  {
    // string
    wordWrap({}).should.to.be.empty;
    // length
    wordWrap('asdf', {}).should.to.be.equal('asdf');
    // options
    wordWrap('failed type', 8).should.to.be.equal('failed\ntype');
    wordWrap('failed type', 8, false).should.to.be.equal('failed\ntype');
    wordWrap('failed type', 8, {}).should.to.be.equal('failed\ntype');
  });

  it('no param', () =>
  {
    wordWrap().should.to.be.empty;
  });

  it('negativ length', () =>
  {
    wordWrap('asdf', -1).should.to.be.equal('asdf');
  });
});
