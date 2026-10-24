export type FlattenTreeNode<T> = {
  record: T;
  /**
   * depth of the node, roots are 0
   */
  level: number;
  /**
   * id of the parent, undefined at the roots
   */
  parentId?: string | number;
  hasChildren: boolean;
  isExpanded: boolean;
};

export type FlattenTreeOptions = {
  /**
   * ids of the open nodes; true: every node is open
   */
  expanded?: Array<string | number> | true;
  idKey?: string;
  parentKey?: string;
};

/**
 * Flat parent-child list (id / pid) to the visible rows of a tree in depth-first order.
 * The children of the closed nodes are skipped. The order of the siblings is the order
 * of the input (a sorted list stays sorted within the siblings).
 * A record whose parent is not in the list (filtered, paginated) is a root.
 *
 * @static
 * @memberof array
 * @param {array} data [{ id, pid, ... }]
 * @param {object} options { expanded, idKey = 'id', parentKey = 'pid' }
 * @return {array} visible nodes [{ record, level, parentId, hasChildren, isExpanded }]
 * @example
 *
 * flattenTree(
 *   [{ id: 1 }, { id: 2, pid: 1 }, { id: 3 }, { id: 4, pid: 2 }],
 *   { expanded: [1] },
 * ).map(({ record, level }) => [record.id, level]);
 * // => [[1, 0], [2, 1], [3, 0]]
 */
const flattenTree = <T extends Record<string, any>>(
  data: T[] = [],
  { expanded = [], idKey = 'id', parentKey = 'pid' }: FlattenTreeOptions = {},
): FlattenTreeNode<T>[] =>
{
  if (!Array.isArray(data))
  {
    return [];
  }

  const ids = new Set(data.map(record => String(record[idKey])));
  const open = expanded === true ? undefined : new Set((expanded || []).map(String));

  const children: { [parentId: string]: T[] } = {};
  const roots: T[] = [];

  data.forEach((record) =>
  {
    const parentId = record[parentKey];

    if (
      parentId === undefined
      || parentId === null
      || !ids.has(String(parentId))
      || String(parentId) === String(record[idKey])
    )
    {
      roots.push(record);
      return;
    }

    (children[String(parentId)] = children[String(parentId)] || []).push(record);
  });

  const results: FlattenTreeNode<T>[] = [];
  const visited = new Set<string>();

  const walk = (records: T[], level: number, parentId?: string | number) =>
  {
    records.forEach((record) =>
    {
      const id = String(record[idKey]);

      // circular reference
      if (visited.has(id))
      {
        return;
      }

      visited.add(id);

      const hasChildren = !!children[id];
      const isExpanded = hasChildren && (!open || open.has(id));

      results.push({ record, level, parentId, hasChildren, isExpanded });

      if (isExpanded)
      {
        walk(children[id], level + 1, record[idKey]);
      }
    });
  };

  walk(roots, 0);

  return results;
};

export default flattenTree;
