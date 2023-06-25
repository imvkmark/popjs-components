import { Checkbox, CheckboxGroup, CheckboxGroupProps, model } from '@wakeadmin/element-adapter';
import { computed, VNodeChild } from '@wakeadmin/demi';
import { NoopArray, booleanPredicate, arrayJoin } from '@wakeadmin/utils';

import { defineAtomic, defineAtomicComponent, DefineAtomicProps } from '../../atomic';
import { useFatConfigurable } from '../../fat-configurable';
import { normalizeClassName } from '../../utils';

export type ACheckboxsValue = any[];

export interface ACheckboxsOption {
  label: VNodeChild | ((checked: boolean) => VNodeChild);
  value: any;
  disabled?: boolean;
}

export type ACheckboxsProps = DefineAtomicProps<
  ACheckboxsValue,
  CheckboxGroupProps,
  {
    options?: ACheckboxsOption[];

    /**
     * 分隔符，默认', '
     */
    separator?: VNodeChild;

    /**
     * 垂直布局
     */
    vertical?: boolean;

    /**
     * 自定义预览
     */
    renderPreview?: (options: ACheckboxsOption[]) => any;

    /**
     * 未定义时的占位符
     */
    undefinedPlaceholder?: any;
  }
>;

declare global {
  interface AtomicProps {
    checkboxs: ACheckboxsProps;
  }
}

export const ACheckboxsComponent = defineAtomicComponent(
  (props: ACheckboxsProps) => {
    const configurable = useFatConfigurable();
    const checkedOptions = computed(() => {
      const values = props.value ?? NoopArray;
      const options = props.options ?? NoopArray;

      return values
        .map(i => {
          return options.find(j => j.value === i);
        })
        .filter(booleanPredicate);
    });

    return () => {
      const {
        mode,
        scene,
        context,
        value,
        onChange,
        renderPreview,
        options = NoopArray,
        vertical,
        separator = ', ',
        undefinedPlaceholder,
        ...other
      } = props;

      if (mode === 'preview') {
        return renderPreview ? (
          renderPreview(checkedOptions.value)
        ) : (
          <span class={other.class} style={other.style}>
            {checkedOptions.value.length
              ? arrayJoin(
                  checkedOptions.value.map(i => (typeof i.label === 'function' ? i.label(true) : i.label)),
                  separator
                )
              : undefinedPlaceholder ?? configurable.undefinedPlaceholder}
          </span>
        );
      }

      return (
        <CheckboxGroup
          {...other}
          class={normalizeClassName(other.class, 'fat-a-checkboxs', { 'fat-a-checkboxs--vertical': vertical })}
          {...model(value ?? NoopArray, onChange!)}
        >
          {options.map((i, idx) => {
            return (
              <Checkbox key={`${i.label}_${idx}`} label={i.value} disabled={i.disabled}>
                {typeof i.label !== 'function' ? i.label : i.label(checkedOptions.value.includes(i))}
              </Checkbox>
            );
          })}
        </CheckboxGroup>
      );
    };
  },
  { name: 'ACheckboxs', globalConfigKey: 'aCheckboxsProps' }
);

export const ACheckboxs = defineAtomic({
  name: 'checkboxs',
  component: ACheckboxsComponent,
  description: '复选框',
  author: 'ivan-lee',
});
