# Nano Stores DeepMap

<img align="right" width="64" height="64" title="Nano Stores logo"
src="https://nanostores.github.io/nanostores/logo.svg">

Deep maps extensionfor [Nano Stores](https://github.com/nanostores/nanostores) state manager.

## Install

```sh
npm install @nanostores/deep-map
```

## Usage

Import `deepMap` from this package instead of `nanostores` (which no longer has it).

Use `setKey` to create, replace, or delete any value at a specific path.

```ts
import { deepMap } from '@nanostores/deep-map'

type storeProps = {
  user?: {
    name: string
    age: number
  }
  count?: number
}

const $store = deepMap<storeProps>({ 
  user: {
    name: 'Luke',
    age: 19,
  } 
  count: 0, 
})

// Replaces the value at 'count'
$store.setKey('count', 1) // -> { ...restValues, count: 1 }

```
Use `updateKey` to merge new data into an existing object. If the target isn't an object, it will be replaced.

```ts
// 'updateKey' merges, keeping 'name' and only changing 'age'
$store.updateKey('user', { age: 42 }) 
// -> { user: { name: 'Luke', age: 42 }, ... }
```
To delete a property from an object or an item from an array, just set its path to `undefined`.

```ts
// Deletes 'count' from the store
$store.setKey('count', undefined)
// -> { user: { name: 'Luke', age: 42 } }
```
### Working with Arrays
DeepMap fully supports arrays as the root value or nested within your state. You can use standard array syntax [index] in your paths.

```ts
//Before
const $store = deepMap<storeProps[]>([{}]) // Type Error

//After
const $store = deepMap<storeProps[]>([{}]) // OK

```

### TypeScript Support

The package is written in TypeScript and provides autocomplete for all methods and properties.

```ts
// Define your type with 'type' keyword instead of 'interface'
// for better autocomplete
type UserType = {
  id?: string
}

const $userT = deepMap<UserType>({})

$userT.setKey('id', 'uuidString') // Suggestion autocomplete

```
Typescript automatically infers the type of the store value.

```ts
type StoreProps = {
  count?: number
}

const $store = deepMap<StoreProps>({})

$store.setKey('count', 'randomString') 
// Type Error -> 'string' is not assignable to 'number'

// IMPORTANT: an empty path ('') is treated as the root object
$someStore.setKey('', 'randomString') // Replaces the entire store
```

## License

MIT

## Credits

  * [Nanostores](https://github.com/nanostores/nanostores) - The original state manager.