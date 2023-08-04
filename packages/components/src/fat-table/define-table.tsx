import { CommonProps } from '@wakeadmin/element-adapter';
import { computed, unref, Ref } from '@wakeadmin/demi';
import { declareComponent } from '@wakeadmin/h';

import { DefineOurComponent, forwardExpose, inheritProps, mergeProps, pickEnumerable, identity } from '../utils';
import { FatTablePublicMethodKeys } from './constants';

import { FatTable } from './fat-table';
import { useFatTableRef } from './hooks';
import { FatTableMethods, FatTableProps, FatTableColumn, FatTableSlots, FatTableEvents } from './types';

export type FatTableDefineProps<Item extends {}, Query extends {}, Extra extends {}> = Partial<
  FatTableProps<Item, Query> & { extra?: Extra }
>;

export type FatTableDefine<Item extends {}, Query extends {}, Extra extends {}> =
  | (FatTableProps<Item, Query> & CommonProps)
  | ((context: {
      table: Ref<FatTableMethods<Item, Query> | undefined>;
      column: <ValueType extends keyof AtomicProps = 'text'>(column: FatTableColumn<Item, Query, ValueType>) => any;
      props: FatTableDefineProps<Item, Query, Extra>;
      /**
       * 支持简单的 prop 类型安全验证
       */
      p: (key: keyof Item) => string;
      emit: (key: string, ...args: any[]) => void;
    }) => () => FatTableProps<Item, Query> & CommonProps);

/**
 * 定义列。可以获取到更好的类型检查
 * @param column
 * @returns
 */
export function defineFatTableColumn<Item extends {}, Query extends {}, ValueType extends keyof AtomicProps>(
  column: FatTableColumn<Item, Query, ValueType>
) {
  return column;
}

/**
 * 定义表格组件
 * @template Item 行记录类型
 * @template Query 查询参数类型
 * @params definitions 可以指定定义 fat-table 参数，或者使用类似 setup 的语法
 * @returns 返回一个 table 组件
 *
 * @example
 *
 * ```html
 * <template>
 *   <MyTable />
 *   <MyAnotherTable />
 * </template>
 *
 * <script lang="tsx" setup>
 *   const MyTable = defineFatTable({})
 *   // or
 *
 *   const MyTable = defineFatTable(() => {
 *     const someState = ref(0)
 *     return () => ({
 *       class: {active: someState},
 *       // ....
 *     })
 *   })
 * </script>
 * ```
 *
 */
export function defineFatTable<Item extends {}, Query extends {} = {}, Extra extends {} = {}>(
  definitions: FatTableDefine<Item, Query, Extra>,
  options?: { name?: string }
): DefineOurComponent<
  FatTableDefineProps<Item, Query, Extra>,
  FatTableSlots<Item, Query>,
  FatTableEvents<Item, Query>,
  FatTableMethods<Item, Query>
> {
  return declareComponent({
    name: options?.name ?? 'PreDefinedFatTable',
    setup(_, { slots, expose, attrs, emit }) {
      const tableRef = useFatTableRef<Item, Query>();
      const extraDefinitions =
        typeof definitions === 'function'
          ? computed(
              definitions({
                table: tableRef,
                column: defineFatTableColumn,
                props: attrs as any,
                emit,
                p: identity as any,
              })
            )
          : definitions;

      const instance = {};

      forwardExpose(instance, FatTablePublicMethodKeys, tableRef);

      expose(instance);

      return () => {
        const preDefineProps = unref(extraDefinitions);

        return (
          // @ts-expect-error
          <FatTable
            ref={tableRef}
            // events && attrs passthrough
            {...mergeProps(preDefineProps, inheritProps(false))}
            // slots passthrough
            v-slots={pickEnumerable(slots)}
          />
        );
      };
    },
  }) as any;
}
