import { TimePicker, TimePickerProps, model } from '@wakeadmin/element-adapter';

import { formatDate } from '../../utils';
import { defineAtomic, defineAtomicComponent, DefineAtomicProps } from '../../atomic';
import { useFatConfigurable } from '../../fat-configurable';

export type ATimeRangeValue = string[] | Date[] | number[];
export type ATimeRangeProps = DefineAtomicProps<
  ATimeRangeValue,
  TimePickerProps,
  {
    /**
     * 预览时日期格式，默认同 format
     */
    previewFormat?: string;

    /**
     * 自定义预览
     */
    renderPreview?: (value?: ATimeRangeValue) => any;
    /**
     * 未定义时的占位符
     */
    undefinedPlaceholder?: any;
  }
>;

export const ATimeRangeComponent = defineAtomicComponent(
  (props: ATimeRangeProps) => {
    const configurable = useFatConfigurable();

    const preview = (value: any, format: string, rangeSeparator: string) => {
      if (value == null) {
        return props.undefinedPlaceholder ?? configurable.undefinedPlaceholder;
      }

      const f = (v: any) => {
        if (v == null) {
          return props.undefinedPlaceholder ?? configurable.undefinedPlaceholder;
        }

        return formatDate(v, format);
      };

      if (Array.isArray(value)) {
        return `${f(value[0])} ${rangeSeparator} ${f(value[1])}`;
      } else {
        return f(value);
      }
    };

    return () => {
      let { value, mode, onChange, previewFormat, scene, context, renderPreview, ...other } = props;

      previewFormat ??= other.format ?? configurable.timeFormat ?? 'HH:mm';
      const rangeSeparator = other.rangeSeparator ?? '-';

      if (mode === 'preview') {
        if (renderPreview) {
          return renderPreview(value);
        }

        return (
          <span class={other.class} style={other.style}>
            {preview(value, previewFormat, rangeSeparator)}
          </span>
        );
      }

      return <TimePicker isRange {...other} {...model(value, onChange!)} />;
    };
  },
  { name: 'ATimeRange', globalConfigKey: 'aTimeRangeProps' }
);

declare global {
  interface AtomicProps {
    'time-range': ATimeRangeProps;
  }
}

export const ATimeRange = defineAtomic({
  name: 'time-range',
  component: ATimeRangeComponent,
  description: '时间范围',
  author: 'ivan-lee',
});
