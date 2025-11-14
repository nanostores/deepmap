type ConcatPath<T extends string, P extends string> = T extends ''
  ? P
  : `${T}.${P}`

type Length<T extends any[]> = T extends { length: infer L } ? L : never

type BuildTuple<L extends number, T extends any[] = []> = T extends {
  length: L
}
  ? T
  : BuildTuple<L, [...T, any]>

type Subtract<A extends number, B extends number> = BuildTuple<A> extends [
  ...infer U,
  ...BuildTuple<B>
]
  ? Length<U>
  : never

export type AllPaths<
  T,
  P extends string = '',
  MaxDepth extends number = 12
> = T extends null | undefined
  ? never
  : T extends (infer U)[]
  ?
  | `${P}[${number}]`
  | AllPaths<U, `${P}[${number}]`, Subtract<MaxDepth, 1>>
  | P
  : T extends BaseDeepMap
  ? MaxDepth extends 0
  ? never
  : {
    [K in keyof T]-?: K extends number | string
    ?
    | AllPaths<T[K], ConcatPath<P, `${K}`>, Subtract<MaxDepth, 1>>
    | (P extends '' ? never : P)
    : never
  }[keyof T]
  : P

type IsNumber<T extends string> = T extends `${number}` ? true : false

type ElementType<T> = T extends (infer U)[] ? U : never

type Unwrap<T, P> = P extends `[${infer I}]${infer R}`
  ? [ElementType<T>, IsNumber<I>] extends [infer Item, true]
  ? R extends ''
  ? Item
  : Unwrap<Item, R>
  : never
  : never

type NestedObjKey<T, P> = P extends `${infer A}.${infer B}`
  ? A extends keyof T
  ? FromPath<NonNullable<T[A]>, B>
  : never
  : never

type NestedObjKeyWithIndexSignatureUndefined<T, P> =
  P extends `${infer A}.${infer B}`
  ? A extends keyof T
  ? FromPathWithIndexSignatureUndefined<NonNullable<T[A]>, B>
  : never
  : never

type NestedArrKey<T, P> = P extends `${infer A}[${infer I}]${infer R}`
  ? IsNumber<I> extends true
  ? (A extends '' ? T : (A extends keyof T ? NonNullable<T[A]> : never)) extends infer ArrayType
  ? ArrayType extends (infer Item)[]
  ? R extends ''
  ? Item
  : R extends `.${infer NewR}`
  ? FromPath<Item, NewR>
  : R extends `${infer Indices}.${infer MoreR}`
  ? FromPath<Unwrap<Item, Indices>, MoreR>
  : Unwrap<Item, R>
  : never
  : never
  : never
  : never

export type FromPath<T, P> = T extends unknown
  ? NestedArrKey<T, P> extends never
  ? NestedObjKey<T, P> extends never
  ? P extends keyof T
  ? T[P]
  : never
  : NestedObjKey<T, P>
  : NestedArrKey<T, P>
  : never

export type FromPathWithIndexSignatureUndefined<T, P> = T extends unknown
  ? NestedArrKey<T, P> extends never
  ? NestedObjKeyWithIndexSignatureUndefined<T, P> extends never
  ? P extends keyof T
  ? T[P]
  : never
  : NestedObjKeyWithIndexSignatureUndefined<T, P>
  : NestedArrKey<T, P>
  : never

export type BaseDeepMap = Record<string, unknown> | Array<unknown>;