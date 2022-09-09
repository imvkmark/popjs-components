/**
 * 选择 _ 开始的属性
 */
export type PickUnderScore<T extends {}> = {
  [K in keyof T as K extends `_${string}` ? K : never]: T[K];
};

/**
 * 忽略掉 _ 开始的属性
 */
export type OmitUnderScore<T extends {}> = Omit<T, keyof PickUnderScore<T>>;

export type TrimOnPrefix<K extends string> = K extends `on${infer E}`
  ? E extends `${infer F}${infer L}`
    ? `${Lowercase<F>}${L}`
    : E
  : K;

export type TrimRenderPrefix<K extends string> = K extends `render${infer E}`
  ? E extends `${infer F}${infer L}`
    ? `${Lowercase<F>}${L}`
    : E
  : K;

export type TrimOnEvents<T extends {}> = {
  [K in keyof T as TrimOnPrefix<string & K>]: T[K];
};

/**
 * 将 on* 类型的事件转换为 h 库的 emit 类型格式
 */
export type ToHEmitDefinition<T> = TrimOnEvents<Required<T>>;

export type TrimRenderFunction<T extends {}> = {
  [K in keyof T as TrimRenderPrefix<string & K>]: T[K] extends () => any
    ? any
    : T[K] extends (a: infer R, ...args: any[]) => any
    ? R
    : never;
};

/**
 * 将 render* 类型的渲染函数转换未 h 库的 slot 类型格式
 */
export type ToHSlotDefinition<T> = TrimRenderFunction<Required<T>>;

type UnionToIntersection<Union> = (Union extends any ? (arg: Union) => void : never) extends (arg: infer I) => void
  ? I
  : never;

type UnionToUoF<Union> = Union extends any ? (arg: Union) => void : never;
type UnionToIoF<Union> = UnionToIntersection<UnionToUoF<Union>>;

// eslint-disable-next-line @typescript-eslint/prefer-function-type
type FirstOfUnion<Union> = UnionToIoF<Union> extends { (arg: infer T): void } ? T : never;

type UnionToTupleRecurser<Union, Res extends any[]> = [
  FirstOfUnion<Union>,
  Exclude<Union, FirstOfUnion<Union>>
] extends [infer FirstElement, infer OtherElements]
  ? [FirstElement] extends [never]
    ? Res
    : UnionToTupleRecurser<OtherElements, [FirstElement, ...Res]>
  : never;

export type UnionToTuple<Union> = UnionToTupleRecurser<Union, []>;
