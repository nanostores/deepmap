import { BaseDeepMap, AllPaths, FromPath } from './path.js'

function normalizePath(path: string): Array<string> {
    if (path === undefined) throw new Error('Path are required')
    return path
        .replace(/\[(\d+)\]/g, '.$1') // 'a.b[10]' -> 'a.b.10'
        .replace(/^\./, '')          // '[10]' -> '.10' -> '10'
        .split('.');                // 'a.b.c' -> ['a', 'b', 'c']
}


export function experimentalGetPath<
    K extends AllPaths<T> | '',
    T extends BaseDeepMap
>(path: K, obj: T): FromPath<T, K> {
    const keys = normalizePath(path);

    if (keys.length === 1 && keys[0] === '') {
        return Array.isArray(obj) ? [...obj] as any : { ...obj } as any;
    }

    let current: any = obj;

    for (const key of keys) {
        if (current === null || typeof current !== 'object') return undefined as any;
        current = current[key];
    }
    return current as any;
}

export function experimentalSetPath<
    K extends AllPaths<T>,
    V extends FromPath<T, K>,
    T extends BaseDeepMap
>(path: K, value: V, obj: T): T {
    let keys = normalizePath(path)

    if (path === '') {
        return value as any;
    }

    let copy = (Array.isArray(obj) ? [...obj] : { ...obj }) as any;
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
            const isSpreadablObject = (typeof originalNode === 'object' && originalNode !== null && !Array.isArray(originalNode));
            newNode = isSpreadablObject ? { ...originalNode } : {};
        }

        pointer[key] = newNode;
        pointer = pointer[key];
    }

    const lastKey = keys[keys.length - 1];
    pointer[lastKey] = value;
    return copy;
}