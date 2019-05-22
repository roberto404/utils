import { expect, should } from 'chai';
import deepFreeze from 'deep-freeze';
import store from 'store';

import { Storage } from '../../src/models';



should();

const sessionTime = 60;
const password = 'hellopassword';
const userSession = {
  name: 'John',
  gender: 'male',
};
const MIN_TO_MSEC = 60 * 1000;

describe('Model: Storage:', () =>
{
  const env = process.env.NODE_ENV;

  afterEach(() =>
  {
    process.env.NODE_ENV = env;
  });

  beforeEach(() =>
  {
    new Storage().flush();
  });

  it('Initial', () =>
  {
    const now = new Date().getTime();
    let StorageModel;

    StorageModel = new Storage(userSession, { sessionTime, password });

    StorageModel.sessionTime.should.to.equal(sessionTime * MIN_TO_MSEC);
    StorageModel.password.should.to.equal(password);
    StorageModel.data.name.should.to.equal(userSession.name);
    StorageModel.data.timestamp.should.at.least(now);
    StorageModel.flush();

    StorageModel = new Storage(userSession);
    StorageModel.data.name.should.to.equal(userSession.name);
    StorageModel.data.timestamp.should.at.least(now);
    StorageModel.flush();

    StorageModel = new Storage({});
    StorageModel.data.should.to.be.deep.equal({});
  });

  it('Initial error', () =>
  {
    let StorageModel;

    StorageModel = new Storage('');
    StorageModel.data.should.to.be.deep.equal({});

    StorageModel = new Storage();
    StorageModel.data.should.to.be.deep.equal({});

    StorageModel = new Storage(false);
    StorageModel.data.should.to.be.deep.equal({});

    StorageModel = new Storage(null);
    StorageModel.data.should.to.be.deep.equal({});


    let StorageModel2;

    try
    {
      StorageModel2 = new Storage(null, null);
    }
    catch (e)
    {
      e.constructor.name.should.to.be.equal('Error');
    }

    expect(StorageModel2).to.be.an('undefined');
  });

  it('Set data', () =>
  {
    const StorageModel = new Storage();

    StorageModel.data = { name: 'John' };
    StorageModel.data.name.should.to.be.equal('John');

    try
    {
      StorageModel.data = {};
    }
    catch (e)
    {
      e.constructor.name.should.to.be.equal('Error');
      StorageModel.data.name.should.to.be.equal('John');
    }

    try
    {
      StorageModel.data = 'wrong data type';
    }
    catch (e)
    {
      e.constructor.name.should.to.be.equal('Error');
      StorageModel.data.name.should.to.be.equal('John');
    }

    StorageModel.data = { name: 'Bravo' };
    StorageModel.data.name.should.to.be.equal('Bravo');
  });

  it('Get data from localStorage (prev session)', () =>
  {
    let StorageModel = new Storage({ name: 'John' });
    StorageModel = new Storage({});
    StorageModel.data.name.should.to.be.equal('John');

    store.set('data', 'false_data');
    const StorageModel3 = new Storage();
    StorageModel3.data.should.to.be.deep.equal({});
  });

  it('Validate', () =>
  {
    let StorageModel;

    const now = new Date().getTime();

    StorageModel = new Storage({ name: 'John' });
    StorageModel._validate(now).should.to.be.true;

    StorageModel._validate(null).should.to.be.false;
    StorageModel._validate(false).should.to.be.false;
    StorageModel._validate('abc').should.to.be.false;

    StorageModel.sessionTime = -10;
    StorageModel._validate(now).should.to.be.false;

    StorageModel.flush();
  });

  it('Refurbish', () =>
  {
    let StorageModel;

    StorageModel = new Storage({ name: 'John' });

    const now = new Date().getTime();
    StorageModel.data.timestamp.should.at.most(now);

    StorageModel.refurbish();
    StorageModel.data.timestamp.should.at.least(now);
  });

  it('Flush', () =>
  {
    let StorageModel;

    StorageModel = new Storage({ name: 'John' });
    StorageModel.flush();

    StorageModel.data.should.to.deep.equal({});
  });

  it('SessionTime', () =>
  {
    let StorageModel;

    StorageModel = new Storage({ name: 'John' });
    StorageModel.sessionTime = 10;
    StorageModel.sessionTime.should.to.be.equal(10 * MIN_TO_MSEC);

    StorageModel.sessionTime = false;
    StorageModel.sessionTime.should.to.be.equal(30 * MIN_TO_MSEC);

    // protected password
    StorageModel = new Storage(userSession);
    process.env.NODE_ENV = 'production';

    let protectedTime;

    try
    {
      protectedTime = StorageModel.sessionTime;
    }
    catch (e)
    {
      e.constructor.name.should.to.be.equal('Error');
    }
    expect(typeof protectedTime).to.be.equal('undefined');
  });

  it('Password', () =>
  {
    let StorageModel;

    StorageModel = new Storage({ name: 'John' });
    const password = StorageModel.password;

    // change password
    try
    {
      StorageModel.password = 'password';
    }
    catch (e)
    {
      e.constructor.name.should.to.be.equal('Error');
    }
    StorageModel.password.should.to.be.equal(password);
    StorageModel.flush();


    // wrong password type
    try
    {
      StorageModel = new Storage({ name: 'John' }, { password: { only: 'string' } });
    }
    catch (e)
    {
      e.constructor.name.should.to.be.equal('Error');
    }
    StorageModel.password.should.to.be.equal(password);
    StorageModel.flush();

    // no encryption: null || false || ''
    StorageModel = new Storage(userSession, { password: null });
    StorageModel.data.name.should.to.be.equal(JSON.parse(store.get('data')).name);
    StorageModel.flush();


    // protected password
    StorageModel = new Storage(userSession);
    process.env.NODE_ENV = 'production';

    let protectedPassword;

    try
    {
      protectedPassword = StorageModel.password;
    }
    catch (e)
    {
      e.constructor.name.should.to.be.equal('Error');
    }
    expect(typeof protectedPassword).to.be.equal('undefined');
  });

  it('Key', () =>
  {
    let StorageModel;

    StorageModel = new Storage({});
    StorageModel.key.should.to.be.equal('data');

    StorageModel = new Storage({}, { key: 'storage' });
    StorageModel.key.should.to.be.equal('storage');

    StorageModel.key = 'key';
    StorageModel.key.should.to.be.equal('key');


    // change key, when data exist
    StorageModel.data = { name: 'John' };
    try
    {
      StorageModel.key = 'storage';
    }
    catch (e)
    {
      e.constructor.name.should.to.be.equal('Error');
    }
    StorageModel.key.should.to.be.equal('key');
    StorageModel.flush();


    StorageModel = new Storage(userSession, { key: 'user' });

    try
    {
      StorageModel.key = 'storage';
    }
    catch (e)
    {
      e.constructor.name.should.to.be.equal('Error');
    }
    StorageModel.key.should.to.be.equal('user');
  });


  it('Data', () =>
  {
    let StorageModel;

    // wrong data type
    try
    {
      StorageModel = new Storage('data');
    }
    catch (e)
    {
      e.constructor.name.should.to.be.equal('Error');
    }
    expect(StorageModel).to.be.an('undefined');

    try
    {
      StorageModel = new Storage(userSession);
      StorageModel.data = 'data';
    }
    catch (e)
    {
      e.constructor.name.should.to.be.equal('Error');
    }
    StorageModel.data.name.should.to.be.equal(userSession.name);


    StorageModel = new Storage(userSession);
    StorageModel.data = null;

    StorageModel.data.should.to.be.deep.equal({});
  });

  it('Add', () =>
  {
    const StorageModel = new Storage({ name: 'John' });
    StorageModel.add({ gender: 1 });

    const data = {
      ...StorageModel.data,
      gender: 1,
    };

    StorageModel.data.should.to.be.deep.equal(data);

    // wrong data type
    try
    {
      StorageModel.add(12233);
    }
    catch (e)
    {
      e.constructor.name.should.to.be.equal('Error');
    }

    StorageModel.data.should.to.be.deep.equal(data);
  });


  it('Two model conflict', () =>
  {

    const User = new Storage({ name: 'John'}, { password: 'user', key: 'user', sessionTime: 10 });
    const App = new Storage({ lang: 'en' }, { password: 'app' });

    User.data.name.should.to.be.equal('John');
    User.password.should.to.be.equal('user');
    expect(App.data.name).to.be.an('undefined');
    App.data.lang.should.to.be.equal('en');
    App.password.should.to.be.equal('app');
    App.sessionTime.should.to.be.equal(30 *  MIN_TO_MSEC);
    App.key.should.to.be.equal('data');

    // const Data = new Storage({}, { password: 'data' });
    // console.log(Data.key);
    // Data.data.lang.should.to.be.equal(App.data.lang);
  });
});
