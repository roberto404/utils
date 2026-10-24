export type FilterTreeOptions = {
  idKey?: string;
  parentKey?: string;
};

export type FilterTreeResult<T> = {
  /**
   * matched records and their ancestors in input order
   */
  records: T[];
  /**
   * ids of the matched records
   */
  matches: Array<string | number>;
  /**
   * ids of the not matched ancestors
   */
  ancestors: Array<string | number>;
  /**
   * ids of the records with a visible child: these have to be open to show every match
   */
  parents: Array<string | number>;
};

/**
 * Filter of a flat parent-child list (id / pid): the matched records with their ancestors,
 * so the matches are visible in their place in the tree (see flattenTree).
 *
 * @static
 * @memberof array
 * @param {array} data [{ id, pid, ... }]
 * @param {function} predicate (record) => boolean
 * @param {object} options { idKey = 'id', parentKey = 'pid' }
 * @return {object} { records, matches, ancestors, parents }
 * @example
 *
 * filterTree(
 *   [{ id: 1, title: 'A' }, { id: 2, pid: 1, title: 'B' }, { id: 3, title: 'C' }],
 *   ({ title }) => title === 'B',
 * );
 * // => { records: [{ id: 1, ... }, { id: 2, ... }], matches: [2], ancestors: [1], parents: [1] }
 */
const filterTree = <T extends Record<string, any>>(
  data: T[] = [],
  predicate: (record: T) => boolean,
  { idKey = 'id', parentKey = 'pid' }: FilterTreeOptions = {},
): FilterTreeResult<T> =>
{
  if (!Array.isArray(data) || typeof predicate !== 'function')
  {
    return { records: [], matches: [], ancestors: [], parents: [] };
  }

  const byId: { [id: string]: T } = {};

  data.forEach((record) =>
  {
    byId[String(record[idKey])] = record;
  });

  const matches = data.filter(predicate).map(record => record[idKey]);
  const visible = new Set(matches.map(String));
  const ancestors: Array<string | number> = [];

  matches.forEach((id) =>
  {
    let parent = byId[String(byId[String(id)][parentKey])];

    // visible.has: the parent (and its ancestors) are visible yet, or circular reference
    while (parent && !visible.has(String(parent[idKey])))
    {
      visible.add(String(parent[idKey]));
      ancestors.push(parent[idKey]);
      parent = byId[String(parent[parentKey])];
    }
  });

  const records = data.filter(record => visible.has(String(record[idKey])));
  // self reference is not a child
  const parentIds = new Set(
    records
      .filter(record => String(record[parentKey]) !== String(record[idKey]))
      .map(record => String(record[parentKey])),
  );

  return {
    records,
    matches,
    ancestors,
    parents: records
      .filter(record => parentIds.has(String(record[idKey])))
      .map(record => record[idKey]),
  };
};

export default filterTree;
