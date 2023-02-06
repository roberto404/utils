//@ts-nocheck

// import { expect, should } from 'chai';
// import { JSDOM } from 'jsdom';
// import { Application } from '../../src/models';


// const listenerTest1 = [
//   'keydown',
//   () => console.log(1),
//   { extra1: 1 },
// ];

// const listenerTest2 = [
//   'keydown',
//   () => console.log(2),
//   { extra1: 2 },
// ];


// should();

// describe('Model: Application:', () =>
// {
//   const env = process.env.NODE_ENV;
//   let Model;

//   afterEach(() =>
//   {
//     process.env.NODE_ENV = env;
//   });

//   beforeEach(() =>
//   {
//     const jsdom = new JSDOM('<!doctype html><html><body></body></html>');
//     const { window } = jsdom;
//     global.window = window;
//     global.document = window.document;
//     global.location = window.location;
//     location.hash = 'config';

//     Model = new Application();
//   });

//   it('Initial', () =>
//   {
//     Model.config.document.pageName.should.to.be.equal('blank#config');
//     Model.getPageName().should.to.be.equal('blank#config');

//     const jsdom = new JSDOM('<!doctype html><html><base href="/admin/"></base><body></body></html>');
//     const { window } = jsdom;
//     global.window = window;
//     global.document = window.document;

//     global.location = {
//       pathname: '/admin/landing/',
//       hash: undefined,
//     };

//     Model = new Application();

//     Model.config.document.baseDir.should.to.be.equal('/admin/');
//     Model.config.document.pathName.should.to.be.equal('landing');
//   });

//   it('Initial error', () =>
//   {
//     let error;

//     try
//     {
//       Model = new Application(false);
//     }
//     catch(e)
//     {
//       error = true;
//       e.constructor.name.should.to.be.equal('Error');
//     }

//     error.should.to.be.true;

//     // not strict
//     // try
//     // {
//     //   Model = new Application({
//     //     notvalid: 123,
//     //   });
//     // }
//     // catch(e)
//     // {
//     //   error = false;
//     //   e.constructor.name.should.to.be.equal('Error');
//     // }
//     //
//     // error.should.to.be.false;



//   });

//   it('Config', () =>
//   {
//     try
//     {
//       Model.config = { document: 'bar' };
//     }
//     catch (e)
//     {
//       e.constructor.name.should.to.be.equal('Error');
//     }

//     Model.config.document.baseDir.should.to.be.equal('/');


//     // protected config
//     process.env.NODE_ENV = 'production';

//     let config;

//     try
//     {
//       config = Model.config;
//     }
//     catch (e)
//     {
//       e.constructor.name.should.to.be.equal('Error');
//     }

//     expect(typeof config).to.be.equal('undefined');
//   });

//   it('Actions', () =>
//   {
//     const actions = {
//       '.*': [() => 'all'],
//       '^$': [() => 'home'],
//     };
//     const actionsBlank = {
//       '^blank$': [() => 'strict'],
//       '^blank': [() => 'blank', () => 'blank2'],
//       '^blank#config': [() => 'hash'],
//     }

//     Model.setActions(actions);
//     Model.setActions(actionsBlank);

//     const result = [
//       actions['.*'][0],
//       actionsBlank['^blank'][0],
//       actionsBlank['^blank'][1],
//       actionsBlank['^blank#config'][0],
//     ];

//     Model._getActions().should.be.deep.equal(result);

//     // Error

//     let error;

//     try
//     {
//       Model.setActions('fff');
//     }
//     catch (e)
//     {
//       error = true;
//       e.constructor.name.should.to.be.equal('Error');
//     }
//   });

//   it('Dispatching', () =>
//   {
//     let config = {};

//     const actionMethod = (App) =>
//     {
//       config = App.config;
//     };

//     const actions = {
//       '.*': [actionMethod],
//     }

//     Model = new Application({
//       actions,
//     });

//     Model.dispatch();

//     config.should.to.be.deep.equal(Model.config);
//   });

//   it('inactivateListeners', () =>
//   {
//     Model.addListener(...listenerTest1);
//     Model.inactivateListeners(listenerTest1[0], listenerTest1[2]);
    
//     Model.addListener(...listenerTest1);
//     Model.addListener(...listenerTest2);

//     Model.inactivateListeners(listenerTest1[0], listenerTest1[2]);
//     Model.inactivateListeners(listenerTest1[0], listenerTest1[2]);
//     Model.inactivateListeners(listenerTest1[0], listenerTest1[2]);
    
//     Model.listeners.length.should.to.be.equal(1);
//     Model.inactiveListeners.length.should.to.be.equal(1);
//   });
// });
