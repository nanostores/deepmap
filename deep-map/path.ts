import {
  BaseDeepMap,
  AllPaths,
  FromPath,
  FromPathWithIndexSignatureUndefined
} from './path.d.js'

/**
 * Normalize path to array of keys.
 *
 * ```js
 * normalizePath('a.b[10].c') // ['a', 'b', '10', 'c']
 * ```
 *
 * @param path Path to normalize.
 * @returns Array of keys.
 */
export function normalizePath(path: string): Array<string> {
  if (path === undefined) throw new Error('Path are required')
  const parts = path
    .replace(/\[(\d+)\]/g, '.$1')   // 'a.b[10]' -> 'a.b.10'
    .replace(/^\./, '')             // '[10]' -> '.10' -> '10'
    .split('.');                    // 'a.b.c' -> ['a', 'b', 'c']
  const keys = parts.filter(key => key !== '');
  return keys.length === 0 ? [''] : keys;
}

export function isObject(obj: any): boolean {
  return typeof obj === 'object' && obj !== null && !Array.isArray(obj)
}

/**
 * Get value from object by path.
 *
 * ```js
 * const obj = { a: { b: { c: 1 } } }
 * const arr = [{ a: { b: { c: 2 } } }]
 * getPath('a.b.c', obj) // 1
 * getPath('[0].a.b.c', arr) // 2
 * ```
 *
 * @param path Path to value.
 * @param obj Object to get value from.
 * @returns Value from object.
 */
export function getPath<
  K extends AllPaths<T> | '',
  T extends BaseDeepMap
>(
  path: K,
  obj: T
): FromPath<T, K> {
  const keys = normalizePath(path);

  const result = keys.reduce((current, key) => {
    if (current === null || typeof current !== 'object') return undefined;
    return (current as any)[key];
  }, obj);

  return result as any;
}

/**
 * Set value in object by path.
 *
 * ```js
 * const obj = { a: { b: { c: 1 } } }
 * const arr = [{ a: { b: { c: 2 } } }]
 * setPath('a.b.c', 3, obj) // { a: { b: { c: 3 } } }
 * setPath('[0].a.b.c', 4, arr) // [{ a: { b: { c: 4 } } }]
 * ```
 *
 * @param path Path to value.
 * @param value Value to set.
 * @param obj Object to set value in.
 * @returns New object with value set.
 */
export function setPath<
  K extends AllPaths<T>,
  T extends BaseDeepMap
>(
  path: K,
  value: FromPathWithIndexSignatureUndefined<T, K> | undefined,
  obj: T
): T {
  const keys = normalizePath(path)

  if (path === '') {
    return value as any;
  }

  const copy = (Array.isArray(obj) ? [...obj] : { ...obj }) as any;
  let pointer = copy;

  for (let i = 0; i < keys.length - 1; i++) {
    const key = keys[i];
    const nextKey = keys[i + 1];

    const originalNode = pointer[key];
    const isNextNodeArray = /^\d+$/.test(nextKey);

    let newNode;
    if (isNextNodeArray) {
      newNode = Array.isArray(originalNode) ? [...originalNode] : [];
    } else {
      newNode = isObject(originalNode) ? { ...originalNode } : {};
    }

    pointer[key] = newNode;
    pointer = pointer[key];
  }

  const lastKey = keys[keys.length - 1];
  if (value === undefined) {
    if (Array.isArray(pointer) && /^\d+$/.test(lastKey)) {
      pointer.splice(Number(lastKey), 1);
    } else if (typeof pointer === 'object' && pointer !== null) {
      delete pointer[lastKey];
    }
  } else {
    pointer[lastKey] = value;
  }
  return copy;
}
