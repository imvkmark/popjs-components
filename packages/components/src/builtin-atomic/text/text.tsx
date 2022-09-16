import { InputProps, Input, model } from '@wakeadmin/element-adapter';

import { defineAtomic, defineAtomicComponent, DefineAtomicProps } from '../../atomic';
import { useFatConfigurable } from '../../fat-configurable';
import { FatText, FatTextOwnProps } from '../../fat-text';

export type ATextProps = DefineAtomicProps<
  string,
  InputProps,
  {
    renderPreview?: (value: any) => any;
  } & FatTextOwnProps
>;

declare global {
  interface AtomicProps {
    text: ATextProps;
  }
}

export const ATextComponent = defineAtomicComponent(
  (props: ATextProps) => {
    const configurable = useFatConfigurable();

    return () => {
      const {
        value,
        mode,
        onChange,
        renderPreview,
        scene,
        context,
        ellipsis,
        copyable,
        tag,
        underline,
        color,
        ...other
      } = props;

      if (mode === 'preview') {
        if (renderPreview) {
          return renderPreview(value);
        }

        if (value == null) {
          return (
            <span class={other.class} style={other.style}>
              {configurable.undefinedPlaceholder}
            </span>
          );
        }

        return (
          <FatText class={other.class} style={other.style} {...{ ellipsis, copyable, tag, underline, color }}>
            {String(value)}
          </FatText>
        );
      }

      return <Input {...other} {...model(value, onChange!)} />;
    };
  },
  { name: 'AText', globalConfigKey: 'aTextProps' }
);

export const AText = defineAtomic({
  name: 'text',
  component: ATextComponent,
  description: '文本输入',
  author: 'ivan-lee',
});
