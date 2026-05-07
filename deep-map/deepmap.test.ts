import { describe, it, expect } from 'vitest'
import { deepMap } from './deepmap.js'
import { setPath, getPath, normalizePath } from './path.js'

type Obj1 = {
  a?: {
    b?: string
    d?: boolean
  }
  c?: string
  arr?: string[]
}
type Arr1 = Array<Obj1>

describe('Test initial values', () => {
  it('Should initialize with object value', () => {
    const $storeObj1 = deepMap<Obj1>({ c: 'initial' })
    expect($storeObj1.value).toEqual({ c: 'initial' })
  })

  it('Should initialize with array value', () => {
    const $storeArr1 = deepMap<Arr1>([{ c: 'initial' }])
    expect($storeArr1.value).toEqual([{ c: 'initial' }])
  })
})

describe('Test setKey', () => {
  it('Should set key in object', () => {
    const $storeObj1 = deepMap<Obj1>({ c: 'initial' })
    $storeObj1.setKey('a.b', 'value')
    expect($storeObj1.value).toEqual({ a: { b: 'value' }, c: 'initial' })
  })

  it('Should set key in array', () => {
    const $storeArr1 = deepMap<Arr1>([{ c: 'initial' }])
    $storeArr1.setKey('[0].a.b', 'value')
    expect($storeArr1.value).toEqual([{ a: { b: 'value' }, c: 'initial' }])
  })

  it('Should delete object property when set to undefined', () => {
    const $storeObj1 = deepMap<Obj1>({ c: 'initial' })
    $storeObj1.setKey('c', undefined)
    expect($storeObj1.value).toEqual({})
  })

  it('Should delete array item when set to undefined', () => {
    const $storeObj1 = deepMap<Obj1>({ arr: ['initial'] })
    $storeObj1.setKey('arr[0]', undefined)
    expect($storeObj1.value).toEqual({ arr: [] })
  })

  it('Should replace root object', () => {
    const $storeObj1 = deepMap<Obj1>({ c: 'initial' })
    $storeObj1.setKey('', { a: { b: 'value' } })
    expect($storeObj1.value).toEqual({ a: { b: 'value' } })
  })

  it('Should replace root array', () => {
    const $storeArr1 = deepMap<Arr1>([{ c: 'initial' }])
    $storeArr1.setKey('[0].c', undefined)
    expect($storeArr1.value).toEqual([{}])
  })

  it('Should add to array at new index', () => {
    const $storeArr1 = deepMap<Obj1>({ arr: ['initial'] })
    $storeArr1.setKey('arr[1]', 'value')
    expect($storeArr1.value).toEqual({ arr: ['initial', 'value'] })
  })
})

describe('Test updateKey', () => {
  it('Should update/merge key in object', () => {
    const $storeObj1 = deepMap<Obj1>({ a: { b: 'value' } })
    $storeObj1.updateKey('a', { d: true })
    expect($storeObj1.value).toEqual({ a: { b: 'value', d: true } })
  })

  it('Should update/merge key in array', () => {
    const $storeArr1 = deepMap<Obj1[]>([{ c: 'initial' }])
    $storeArr1.updateKey('', [{c: 'updated'}])
    expect($storeArr1.value).toEqual([{c: 'initial'}, {c: 'updated'}])
  })
})


describe('Test path functions', () => {
  it('Should throw error when path is undefined', () => {
    const badCall = () => {
      normalizePath(undefined as any)
    }

    expect(badCall).toThrow()
  })
})


describe('getPath', () => {
  const state = {
    user: {
      name: 'John',
      tags: ['a', 'b'],
    },
    c: 2,
  }

  it('Should get a root value', () => {
    expect(getPath('c', state)).toBe(2)
  })

  it('Should get a nested object value', () => {
    expect(getPath('user.name', state)).toBe('John')
  })

  it('Should get a nested array value', () => {
    expect(getPath('user.tags[0]', state)).toBe('a')
  })
})

describe('setPath', () => {
  const originalState = {
    a: { b: 1 },
    c: 2,
  }

  it('Should set a nested value immutably', () => {
    const newState = setPath('a.b', 99, originalState)

    expect(newState).toEqual({ a: { b: 99 }, c: 2 })

    expect(originalState).toEqual({ a: { b: 1 }, c: 2 })

    expect(newState).not.toBe(originalState)
    expect(newState.a).not.toBe(originalState.a)
  })

  it('Should delete a key when value is undefined', () => {
    const state = { a: 1, b: 2 }
    const newState = setPath('b', undefined, state)

    expect(newState).toEqual({ a: 1 })
    expect(state).toEqual({ a: 1, b: 2 })
  })

  it('Should add items to an array immutably', () => {
    const state = { items: ['a', 'b'] }
    const newState = setPath('items[2]', 'c', state)

    expect(newState).toEqual({ items: ['a', 'b', 'c'] })
    expect(state).toEqual({ items: ['a', 'b'] })
    expect(newState.items).not.toBe(state.items)
  })
})

describe('getKey', () => {
  it('Should get a value from store', () => {
    const $storeObj1 = deepMap<Obj1>({ c: 'initial' })
    expect($storeObj1.getKey('c')).toBe('initial')
  })
})
