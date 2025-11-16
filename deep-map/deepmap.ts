import { atom } from 'nanostores'
import type { WritableAtom } from 'nanostores';
import { AllPaths, BaseDeepMap, FromPathWithIndexSignatureUndefined } from './path.d.js';
import { getPath, isObject, setPath } from './path.js';

export type DeepMapStore<T extends BaseDeepMap> = {
  value: T

  /**
 * Subscribe to store changes.
 *
 * In contrast with {@link Store#subscribe} it do not call listener
 * immediately.
 *
 * @param listener Callback with store value and old value.
 * @param changedKey Key that was changed. Will present only if `setKey`
 *                   has been used to change a store.
 * @returns Function to remove listener.
 */
  listen(
    listener: (
      value: T,
      oldValue: T,
      changedKey: AllPaths<T> | undefined
    ) => void
  ): () => void

  /**
 * Low-level method to notify listeners about changes in the store.
 *
 * Can cause unexpected behaviour when combined with frontend frameworks
 * doing equality checks for values, e.g. React.
 */
  notify(oldValue?: T, changedKey?: AllPaths<T>): void

  /**
 * Change key in store value. Copies are made at each level of `key` so that
 * no part of the original object is mutated.
 *
 * ```js
 * $settings.setKey('visuals.theme', 'dark')
 * ```
 *
 * @param key The key name. Attributes can be split with a dot `.` and `[]`.
 * @param value New value.
 */
  setKey: <K extends AllPaths<T> | ''>(
    key: K,
    value: FromPathWithIndexSignatureUndefined<T, K> | undefined
  ) => void

  /**
 * Change key in store value. Copies are made at each level of `key` so that
 * no part of the original object is mutated.
 *
 * ```js
 * $settings.updateKey('settings', { theme: 'dark' })
 * ```
 *
 * @param key The key name. Attributes can be split with a dot `.` and `[]`.
 * @param value New value.
 */
  updateKey: <K extends AllPaths<T> | ''>(
    key: K,
    value: Partial<FromPathWithIndexSignatureUndefined<T, K>> | undefined
  ) => void

  /**
 * Subscribe to store changes and call listener immediately.
 *
 * ```
 * import { $settings } from '../store'
 *
 * $settings.subscribe(settings => {
 *   console.log(settings)
 * })
 * ```
 *
 * @param listener Callback with store value and old value.
 * @param changedKey Key that was changed. Will present only
 *                   if `setKey` has been used to change a store.
 * @returns Function to remove listener.
 */
  subscribe(
    listener: (
      value: T,
      oldValue: T | undefined,
      changedKey: AllPaths<T> | undefined
    ) => void
  ): () => void
} & Omit<WritableAtom<T>, 'listen' | 'notify' | 'setKey' | 'subscribe'>

/**
 * Create deep map store. Deep map store is a store with an object as store
 * value, that supports fine-grained reactivity for deeply nested properties.
 *
 * @param init Initialize store and return store destructor.
 * @returns The store object with methods to subscribe.
 */
export function deepMap<T extends BaseDeepMap>(init?: T): DeepMapStore<T> {
  const $deepmap = atom(init) as DeepMapStore<T>

  $deepmap.setKey = <K extends AllPaths<T> | ''>(
    key: K,
    value: FromPathWithIndexSignatureUndefined<T, K> | undefined
  ): void => {
    if (getPath(key, $deepmap.value as BaseDeepMap) !== value) {
      const oldValue = $deepmap.value
      $deepmap.value = setPath(key, value, $deepmap.value as BaseDeepMap) as T
      $deepmap.notify(oldValue, key as AllPaths<T>)
    }
  }

  $deepmap.updateKey = <K extends AllPaths<T> | ''>(
    key: K,
    value: Partial<FromPathWithIndexSignatureUndefined<T, K>> | undefined
  ): void => {
    const oldValue = getPath(key, $deepmap.value as BaseDeepMap)
    let newValue: any = value;

    if (isObject(oldValue) && isObject(value)) {
      newValue = { ...oldValue as object, ...value };
    }

    $deepmap.setKey(key, newValue as any);
  }

  return $deepmap
}
