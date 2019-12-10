// @flow

// npx babel-node ./examples/tree
// or watch:
// npx babel-watch ./examples/tree

import Tree from '../src/models/tree';


/**
 * Flow works
 */

const rawData = [
  {
    id: '1',
    pid: '117',
    pos: '0',
    props: '',
    status: '1',
    title: 'Otthon',
  },
  {
    id: '4',
    pid: '1',
    pos: '0',
    status: '1',
    title: 'Nappali bútorok',
  },
  {
    id: '5',
    pid: '1',
    pos: '1',
    status: '1',
    title: 'Hálószoba bútorok',
  },
  {
    id: '16',
    pid: '4',
    pos: '0',
    status: '1',
    title: 'Szekrények',
  },
  {
    id: '117',
    pid: '0',
    pos: '0',
    status: '1',
    title: 'Főoldal',
  },
];

// const settings

const Menu = new Tree(rawData);

// Menu.setRoot(117);


console.log(
  Menu.getItem('/fooldal/otthon/nappali_butorok'),
  Menu.getItem('/otthon/nappali_butorok'),
  Menu.getUrl('4'),
  Menu.getPath('4'),
);
