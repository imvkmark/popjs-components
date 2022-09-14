import { SelectProps, Select, Option, model, OptionProps } from '@wakeadmin/element-adapter';
import { computed } from '@wakeadmin/demi';
import { booleanPredicate, NoopArray } from '@wakeadmin/utils';

import { defineAtomic, globalRegistry, defineAtomicComponent, DefineAtomicProps } from '../../atomic';
import { useFatConfigurable } from '../../fat-configurable';
import { useOptions } from './loader';

export type AMultiSelectValue = (string | number | boolean)[];

export type AMultiSelectProps = DefineAtomicProps<
  AMultiSelectValue,
  SelectProps,
  {
    options?: OptionProps[] | (() => Promise<OptionProps[]>);
    /**
     * 分隔符，默认', '
     */
    separator?: string;

    /**
     * 自定义预览渲染
     */
    renderPreview?: (options: OptionProps[]) => any;
  }
>;

export const AMultiSelectComponent = defineAtomicComponent(
  (props: AMultiSelectProps) => {
    const { loading, options } = useOptions(props);
    const configurable = useFatConfigurable();

    const active = computed(() => {
      const value = props.value ?? NoopArray;
      return value.map(i => options.value.find(j => j.value === i)).filter(booleanPredicate);
    });

    return () => {
      const { mode, value, onChange, context, scene, options: _, ...other } = props;

      if (mode === 'preview') {
        return (
          <span>
            {props.renderPreview
              ? props.renderPreview(active.value)
              : active.value.length
              ? active.value.map(i => i.label).join(props.separator ?? ', ')
              : configurable.undefinedPlaceholder}
          </span>
        );
      }

      return (
        <Select loading={loading.value} multiple {...other} {...model(value, onChange!)}>
          {options.value.map((i, idx) => {
            return <Option key={i.value ?? idx} {...i}></Option>;
          })}
        </Select>
      );
    };
  },
  { name: 'AMultiSelect', globalConfigKey: 'aMultiSelectProps' }
);

declare global {
  interface AtomicProps {
    'multi-select': AMultiSelectProps;
  }
}

export const AMultiSelect = defineAtomic({
  name: 'multi-select',
  component: AMultiSelectComponent,
  description: '多选下拉选择器',
  author: 'ivan-lee',
});

globalRegistry.register('multi-select', AMultiSelect);
