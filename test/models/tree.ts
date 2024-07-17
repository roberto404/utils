//@ts-nocheck

import { should } from 'chai';
import deepFreeze from 'deep-freeze';
import Tree from '../../src/models/tree';

should();


const sampleData = [
  {
    id: 1,
    title: 'Menu',
    pid: 0,
    pos: 0,
  },
  {
    id: 2,
    title: 'Menu 0',
    pid: 1,
    pos: 0,
  },
  {
    id: 6,
    title: 'Menu 2',
    pid: 1,
    pos: 2,
  },
  {
    id: 3,
    title: 'Menu 1',
    pid: 1,
    pos: 1,
  },
  {
    id: 8,
    title: 'Menu 1.1',
    pid: 3,
    pos: 1,
  },
  {
    id: 5,
    title: 'Menu 1.0',
    pid: 3,
    pos: 0,
  },
  {
    id: 11,
    title: 'Menu 0.0',
    pid: 2,
    pos: 0,
  },
  {
    id: 9,
    title: 'Menu 0.0.0',
    pid: 11,
    pos: 0,
  },
  {
    id: 4,
    title: 'Menu 3',
    pid: 1,
    pos: 3,
  },
];

deepFreeze(sampleData);

let treeModel;

describe('Model: Tree:', () =>
{
  const env = process.env.NODE_ENV;

  before(() =>
  {
    process.env.NODE_ENV = 'production';
  });

  after(() =>
  {
    process.env.NODE_ENV = env;
  });

  beforeEach(() =>
  {
    treeModel = new Tree(sampleData);
  });

  // it('Initial', () =>
  // {
  // });

  // it('Initial error', () =>
  // {
  // });

  it('getChildren', () =>
  {
    treeModel.getChildren(1).should.to.deep.equal(
      sampleData
        .filter(d => d.pid === 1)
        .sort((a,b) => a.pos - b.pos)
    );
  });

  it('getChildren not continuous sequence', () =>
  {
    const sampleDataNotContinous = [
      {
        id: 1,
        title: 'Menu',
        pid: 0,
        pos: 0,
      },
      {
        id: 2,
        title: 'Menu 0',
        pid: 1,
        pos: 0,
      },
      {
        id: 6,
        title: 'Menu 2',
        pid: 1,
        pos: 4,
      },
    ];

    treeModel = new Tree(sampleDataNotContinous);

    treeModel.getChildren(1).should.to.deep.equal(
      sampleDataNotContinous
        .filter(d => d.pid === 1)
        .sort((a,b) => a.pos - b.pos)
    );
  });

  it('getChildren wrong params', () =>
  {
  });

  it('test', () =>
  {
    const data = [
      {
        "id": 1,
        "title": "Menu 0",
        "pid": 0,
        "pos": 0,
      },
      {
        "id": 2,
        "title": "Menu 1",
        "pid": 0,
        "pos": 1,
      },
      {
        "id": 4,
        "title": "Menu 1.0",
        "pid": 1,
        "pos": 0,
      },
      {
        "id": 5,
        "title": "Menu 1.1",
        "pid": 1,
        "pos": 1,
      },
      {
        "id": 3,
        "title": "Menu 2",
        "pid": 0,
        "pos": 2,
      },
      // {
      //   "id": 4,
      //   "status": 1,
      //   "title": "Üzenetek",
      //   "pid": 0,
      //   "pos": 9,
      //   "active": false
      // },
      // {
      //   "id": 5,
      //   "status": 1,
      //   "title": "Beállítások",
      //   "pid": 0,
      //   "pos": 10,
      //   "active": false
      // },
      // {
      //   "id": 13,
      //   "status": 1,
      //   "title": "RS pontok",
      //   "pid": 5,
      //   "pos": 0,
      //   "active": false
      // },
      // {
      //   "id": 14,
      //   "status": 1,
      //   "title": "Engedélyezésre vár",
      //   "pid": 0,
      //   "pos": 5,
      //   "active": false
      // },
      // {
      //   "id": 15,
      //   "status": 1,
      //   "title": "Áruforgalomra vár",
      //   "pid": 0,
      //   "pos": 6,
      //   "active": false
      // }
    ];

    treeModel = new Tree(data);

    console.log(treeModel.getTree().map(i => i.id));
  })

  it('getItem', () =>
  {
    // miért nem csak find???
    // console.log(treeModel.getItem(1));
    // console.log(treeModel.getItem(2));
  });

  it('getTree', () =>
  {
    // miért nem csak find???
    // console.log(treeModel.getPath(11));
    // console.log(treeModel.getTree());
    // console.log(treeModel.getNestedTree());
    // console.log(treeModel.getChildren(2));
  });
});
