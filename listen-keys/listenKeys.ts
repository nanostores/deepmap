
export type StoreValue<SomeStore> = SomeStore extends {
  get(): infer Value
} ? Value : never

export function listenKeys<
  SomeStore extends { setKey: (key: any, value: any) => void }
>(
  $store: SomeStore,
  keys: SomeStore extends { setKey: (key: infer Key, value: never) => unknown }
    ? readonly Key[]
    : never,
  listener: (
    value: StoreValue<SomeStore>,
    oldValue: StoreValue<SomeStore>,
    changed: SomeStore extends {
      setKey: (key: infer Key, value: never) => unknown
    }
      ? Key[]
      : never
  ) => void
): () => void

export function subscribeKeys<
  SomeStore extends { setKey: (key: any, value: any) => void }
>(
  $store: SomeStore,
  keys: SomeStore extends { setKey: (key: infer Key, value: never) => unknown }
    ? readonly Key[]
    : never,
  listener: (
    value: StoreValue<SomeStore>,
    oldValue: StoreValue<SomeStore>,
    changed: SomeStore extends {
      setKey: (key: infer Key, value: never) => unknown
    }
      ? Key[]
      : never
  ) => void
): () => void


export function listenKeys($store, keys, listener) {
  let keysSet = new Set(keys).add(undefined)
  return $store.listen((value, oldValue, changed) => {
    if (keysSet.has(changed)) {
      listener(value, oldValue, changed)
    }
  })
}

export function subscribeKeys($store, keys, listener) {
  let unbind = listenKeys($store, keys, listener)
  listener($store.value)
  return unbind
}