# Nano Stores DeepMap

<img align="right" width="92" height="92" title="Nano Stores logo"
src="[https://nanostores.github.io/nanostores/logo.svg](https://nanostores.github.io/nanostores/logo.svg)"\>

helper for [Nanostores](https://github.com/nanostores/nanostores) to create deep maps.

## Install

```sh
npm install @nanostores/deep-map
```

## Usage

### Basic Usage

Import `deepMap` from this package instead of `nanostores` (which no longer has it).

```ts
import { deepMap } from '@nanostores/deep-map'

const $store = deepMap({ 
  count: 0, 
  user: {
    name: 'Luke',
    age: 19,
    image_url: 'hhttps://example.com/default.png'
  } 
})

$store.setKey('count', 1)
```

### TypeScript Support

The package is written in TypeScript and provides type inference:

```ts
interface User {
  id: number
  name: string
  settings: {
    theme: 'light' | 'dark'
    notifications: boolean
  }
}

const $user = deepMap<User>({
  id: 1,
  name: 'John',
  settings: {
    theme: 'light',
    notifications: true
  }
})

// TypeScript (with a proper path utility type) can validate paths
$user.setKey('settings.theme', 'dark') // ✓ OK
$user.s_etKey('settings.theme', 'blue') // ✗ Type Error
```

## License

MIT

## Credits

  * [Nanostores](https://github.com/nanostores/nanostores) - The original state manager.