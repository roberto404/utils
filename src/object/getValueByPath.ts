/**
 * Safely access a nested property of an object using a dot-separated string path.
 *
 * @template T The type of the object to access.
 * @param obj The object to read from.
 * @param path Dot-separated string representing the nested path.
 * @param fallback A value to return if the path doesn't exist (default is undefined).
 * @returns The value at the given path or the fallback.
 *
 * @example
 * const data = { invoices: { priceGross: 123 } };
 * getValueByPath(data, "invoices.priceGross"); // 123
 */
export function getValueByPath<T>(
  obj: T,
  path: string,
  fallback?: unknown
): unknown {
  
  if (!path || typeof path !== 'string') return fallback;

  try {
    return path.split('.').reduce((acc: any, key: string) => {
      if (acc && typeof acc === 'object' && key in acc) {
        return acc[key];
      }
      throw new Error(`Property '${key}' not found in path '${path}'`);
    }, obj);
  } catch (e) {
    return fallback;
  }
}



export default getValueByPath;
