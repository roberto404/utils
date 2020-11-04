// @flow

/* eslint-disable */


import forEach from 'lodash/forEach';
import map from 'lodash/map';
import reduce from 'lodash/reduce';
import capitalizeFirstLetter from '../string/capitalizeFirstLetter';
import slugify from '../string/slugify';

export const WHITESPACE = '\xA0';

class Tree
{
  _root: number;

  /**
   * source data cached version (there is no need find method)
   * @type {Object}
   * @example
   * { '#8' : { id: 8, title, pid, pos }, ... }
   */
  _menu: {};

  /**
   * cached object determine childrens order by position
   * @example
   * { 1: { 0: { ..., pos: 0 }, 1: { ..., pos: 1 } } }
   * @type {Object}
   */
  _parents: {};

  /**
   * source data modified to nested order
   * @example
   * {
   *  '#1': [ 0, 1 ],
   *  '#2': [ 0, 1, 2 ],
   *  '#11': [ 0, 1, 2, 11 ],
   *  '#3': [ 0, 1, 3 ],
   * }
   * @type {Object}
   */
  _tree: {};
  // me: 0;
  // family: [];
  // sibling: [];
  // path: [];
  // child: [];


  constructor(
    data: [{ id: number, title: string, pid: number, pos: number }],
  )
  {
    this._menu = {};
    this._parents = {};

    if (data)
    {
      data.forEach((item) =>
      {
        this._menu[`#${item.id}`] = item;

        if (!this._parents[item.pid])
        {
          this._parents[item.pid] = {};
        }

        this._parents[item.pid][item.pos] = item;
      });
    }

    this.structure();
  }

  setRoot(id: number|string)
  {
    this._root = id.toString();
  }

  /* !- Private methods */

  structure()
  {
    this._tree = {};

    /**
     * thisId [int] current menu id
     * thisPath [array] path to current id
     * thisPosition [int] the depth of a node, sibling position
     * parentPosition [array]  count the current position of all parents
     */
    let i = 0;
    let thisId = 0;
    const thisPath = [0];
    let thisPosition = 0;
    const parentPositions = {};

    while (i < Object.keys(this._menu).length)
    {
      // get position: If the previous (hightest sibling) path reached the end,
      // than iteration go back to common parent
      thisPosition = (thisId && parentPositions[thisId]) ? parentPositions[thisId] : 0;

      // define the parentPosition, where thisId mean the parent Id
      if (thisId !== undefined)
      {
        parentPositions[thisId] = 1;
      }

      // set new thisId: previous thisId mean the parent Id
      if (
        thisId !== undefined
        && this._parents[thisId]
        && this._parents[thisId][thisPosition]
      )
      {
        thisId = this._parents[thisId][thisPosition].id;
      }
      // skip the inactive or missing sibling
      else if (this._parents[thisId] && this._parents[thisId].length > thisPosition + 1)
      {
        thisPosition += 1;
        continue;
      }
      else
      {
        thisId = undefined;
      }

      // This condition execute, when it has not got child
      while (thisId === undefined)
      {
        // because it has not got child thisPath go back one
        thisPath.pop();

        // break process, because we came back to the root
        if (thisPath.length === 0)
        {
          break;
        }

        // get this parent Id
        this.thisParent = thisPath[thisPath.length - 1];

        // set this position
        thisPosition = parentPositions[this.thisParent];
        parentPositions[this.thisParent] += 1;

        // get new item id, if it is valid
        // based on next sibling from this parent
        if (this._parents[this.thisParent][thisPosition] !== undefined)
        {
          thisId = this._parents[this.thisParent][thisPosition].id;
        }
        else
        {
          continue;
        }
      }

      if (thisId !== undefined)
      {
        // In the end of each iteration:
        // The current path expanding the thisId
        thisPath.push(thisId);

        // Hash hook, because the order is important!
        // In Array the integer index is auto-sorting
        this._tree[`#${thisId}`] = [...thisPath];
      }

      i += 1;
    }
  }


  /**
   * Get element children's data object
   * @param  {int} id Parent's id
   * @return {object} child object
   *
   * @example
   * model.getChildren(2);
   * // ->
   * [ { id, title, pid, pos }, ...]
   */
  getChildren = (id: number = 0) =>
  {
    if (isNaN(id) || this._parents[id] === undefined)
    {
      return [];
    }

    return reduce(this._parents[id], (results, item) => [...results, item], []);
  }

  /**
   * Get element only childer titles
   * @param  {int} id Parent's id
   * @return {array} key hash id, value title
   */
  getChildrenTitles = (id) =>
  {
    const results = {};

    forEach(this.getChildren(id), data => results[`#${data.id}`] = data.title); // eslint-disable-line no-return-assign

    return results;
  }

  /**
   * Get element by id or path
   * @example
   * getItem(2);
   * getItem('menu1/menu12/menu113')
   */
  getItem = (id: number|string): {}|boolean =>
  {
    if (!isNaN(id) && this._menu[`#${id}`] !== undefined)
    {
      return this._menu[`#${id}`];
    }

    if (typeof id === 'string')
    {
      return id
        .split('/')
        .filter(i => i !== "")
        .reduce(
          (result, slug) =>
          {
            if (result)
            {
              result = this.getChildren(result.id).find(({ title }) => slugify(title) === slugify(slug));
            }

            return result;
          },
          {
            id: this._root,
          },
        );
    }

    return false;
  }

  /**
   * @param {bool} [formatted=false] in formatted version title contains whitespaces
   * @return {array} full tree nested order
   * @example
   * // =>
   * [
   *  { id: 1, title: '1', level: 1 ...},
   *  { id: 2, title: '1.1', level: 2 ...},
   *  ...
   * ]
   * @example
   * // => formated version
   * [
   *  { id: 1, title: '1.' },
   *  { id: 2, title: '   1.1' },
   * ]
   */
  getTree = (formatted:bool = false) =>
    map(
      this._tree,
      (item, index) =>
        (formatted ?
        {
          id: this._menu[index].id,
          title: WHITESPACE.repeat((item.length - 1) * 5) +
            capitalizeFirstLetter(this._menu[index].title),
        }
        :
        {
          ...this._menu[index],
          level: item.length - 1,
        }),
    )

  getNestedTree = (id: string|number = 0) =>
    reduce(
      this._parents[id],
      (results, child) => ({
        ...results,
        [`#${child.id}`]: this.getNestedTree(child.id),
      }),
      {},
    );

  /**
   * [getNestedTree description]
   * @return {[type]} [description]
   * @example
   * // =>
   * {'#1': {#1: {}, #2: {#4, #5}, #3: {}}}
   */
  getNestedTree2 = () =>
  {
    // console.log(this.getTree());
    // console.log(this._tree);
    // console.log(this._parents);


//    '#0': { #1: {}, #2: {} }

    // const results = {};
    // console.log(this._parents['0'], '---');
    return this.iterator('0');

    // for (let i = 0; i < size(this._menu); i += 1)
    // {
    //   break;
    // }
  }

  getPath = (id: number): [number] =>
  {
    const tree = this._tree[`#${id}`];

    if (this._root && tree)
    {
      const index = tree.indexOf(this._root);

      if (index)
      {
        return [0, ...this._tree[`#${id}`].slice(index + 1)];
      }
    }

    return tree;
  }

  getUrl = (id: number): string =>
    (this.getPath(id) || []).map(parentId => slugify((this.getItem(parentId) || {}).title)).join('/');

  getBreadcrumb = (id: number): {} =>
    (this.getPath(id) || []).map(parentId => ({ ...this.getItem(parentId), url: this.getUrl(parentId) }));


  findByUrl = (url: string): {} =>
    String(url)
      .split('/')
      .reduce(
        (item, url) =>
          Object.keys(item).indexOf('id') === -1 ?
            {}
            :
            this
              .getChildren(item.id)
              .find(({ id }) =>
              {
                const fullUrl = this.getUrl(parseInt(id));
                return fullUrl.substring(fullUrl.lastIndexOf('/') + 1) === url;
              }) || {}
        ,
        { id: undefined },
      );

}

/* eslint-enable */


export default Tree;
