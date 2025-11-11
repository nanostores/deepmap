import { atom } from 'nanostores'
import type { WritableAtom } from 'nanostores';
import { AllPaths, BaseDeepMap, FromPathWithIndexSignatureUndefined } from './path.js';
import { experimentalGetPath, experimentalSetPath } from './pathEx';

type DeepMapStore<T extends BaseDeepMap> = {
    value: T
    listen(
        listener: (
            value: T,
            oldValue: T,
            changedKey: AllPaths<T> | undefined
        ) => void
    ): () => void

    notify(oldValue?: T, changedKey?: AllPaths<T>): void

    setKey: <K extends AllPaths<T>>(
        key: K,
        value: FromPathWithIndexSignatureUndefined<T, K> | undefined
    ) => void
    updateKey: <K extends AllPaths<T>>(
        key: K,
        value: Partial<FromPathWithIndexSignatureUndefined<T, K>> | undefined
    ) => void

    subscribe(
        listener: (
            value: T,
            oldValue: T | undefined,
            changedKey: AllPaths<T> | undefined
        ) => void
    ): () => void
} & Omit<WritableAtom<T>, 'listen' | 'notify' | 'setKey' | 'subscribe'>

export function deepMap<T extends BaseDeepMap>(init?: T): DeepMapStore<T> {
    let $deepmap = atom(init) as DeepMapStore<T>

    $deepmap.setKey = <K extends AllPaths<T>>(
        key: K,
        value: FromPathWithIndexSignatureUndefined<T, K> | undefined
    ): void => {
        if (experimentalGetPath(key, $deepmap.value as BaseDeepMap) !== value) {
            let oldValue = $deepmap.value
            $deepmap.value = experimentalSetPath(key, value, $deepmap.value as BaseDeepMap) as T
            $deepmap.notify(oldValue, key)
        }
    }

    $deepmap.updateKey = <K extends AllPaths<T>>(
        key: K,
        value: Partial<FromPathWithIndexSignatureUndefined<T, K>> | undefined
    ): void => {
        const oldValue = experimentalGetPath(key, $deepmap.value as BaseDeepMap)
        let newValue: any;

        if (value === undefined) {
            newValue = undefined;
        } else if (typeof oldValue === 'object' && oldValue !== null && !Array.isArray(oldValue) &&
            typeof value === 'object' && value !== null && !Array.isArray(value)) {
            newValue = { ...oldValue, ...value };
        } else {
            newValue = value;
        }

        $deepmap.setKey(key, newValue as any);
    }

    return $deepmap
}

const $myStore = deepMap({ a: 1 })
