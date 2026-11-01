/**
 * @fileOverview Change list between two values (log / history snapshots).
 *
 * @namespace object
 */

export type DiffEntry = {
  type: 'added' | 'removed' | 'changed',
  // object key the change belongs to (e.g. feature id, dimension key)
  key?: string,
  // added / removed element or value
  value?: any,
  // changed: the old and the new value
  from?: any,
  to?: any,
};

const isObject = (value: unknown): value is Record<string, any> =>
  value !== null && typeof value === 'object' && !Array.isArray(value);

const isEmpty = (value: unknown) =>
  value === null || value === undefined || value === ''
  || (Array.isArray(value) && !value.length)
  || (isObject(value) && !Object.keys(value).length);

/**
 * Comparable key: objects with sorted keys, scalars as string ("206" = 206)
 */
const toKey = (value: any): string => {
  if (Array.isArray(value)) {
    return `[${value.map(toKey).join(',')}]`;
  }

  if (isObject(value)) {
    return `{${Object.keys(value).sort().map((key) => `${key}:${toKey(value[key])}`).join(',')}}`;
  }

  return value === null || value === undefined ? '' : String(value);
};

const diffArrays = (prev: any[], next: any[], key?: string): DiffEntry[] => {
  const prevKeys = prev.map(toKey);
  const nextKeys = next.map(toKey);

  const withKey = (entry: DiffEntry) => (key === undefined ? entry : { ...entry, key });

  return [
    ...next
      .filter((value, index) => prevKeys.indexOf(nextKeys[index]) === -1)
      .map((value) => withKey({ type: 'added', value })),
    ...prev
      .filter((value, index) => nextKeys.indexOf(prevKeys[index]) === -1)
      .map((value) => withKey({ type: 'removed', value })),
  ];
};

/**
 * Only the changes between two values:
 * - arrays: added / removed elements (order does not count),
 * - objects: added / removed keys, changed values by key (arrays under the same key element-wise),
 * - anything else: one `changed` entry.
 *
 * @example
 * diffValues(['HUN', 'MA'], ['HUN', 'SALE'])
 * // => [{ type: 'added', value: 'SALE' }, { type: 'removed', value: 'MA' }]
 *
 * diffValues({ w: '206', h: '95' }, { w: '210', h: '95', d: '97' })
 * // => [{ type: 'changed', key: 'w', from: '206', to: '210' }, { type: 'added', key: 'd', value: '97' }]
 */
const diffValues = (prev: any, next: any): DiffEntry[] => {
  if (toKey(prev) === toKey(next)) {
    return [];
  }

  if ((Array.isArray(prev) || isEmpty(prev)) && (Array.isArray(next) || isEmpty(next))
    && (Array.isArray(prev) || Array.isArray(next))) {
    return diffArrays(Array.isArray(prev) ? prev : [], Array.isArray(next) ? next : []);
  }

  if ((isObject(prev) || isEmpty(prev)) && (isObject(next) || isEmpty(next))
    && (isObject(prev) || isObject(next))) {
    const before = isObject(prev) ? prev : {};
    const after = isObject(next) ? next : {};

    const keys = [...Object.keys(before), ...Object.keys(after).filter((key) => !(key in before))];

    return keys.reduce((result: DiffEntry[], key) => {
      const from = before[key];
      const to = after[key];

      if (toKey(from) === toKey(to)) {
        return result;
      }

      if (isEmpty(from)) {
        return [...result, { type: 'added', key, value: to }];
      }

      if (isEmpty(to)) {
        return [...result, { type: 'removed', key, value: from }];
      }

      if (Array.isArray(from) && Array.isArray(to)) {
        return [...result, ...diffArrays(from, to, key)];
      }

      return [...result, { type: 'changed', key, from, to }];
    }, []);
  }

  return [{ type: 'changed', from: prev, to: next }];
};

export default diffValues;
