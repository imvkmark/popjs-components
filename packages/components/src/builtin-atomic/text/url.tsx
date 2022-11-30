import { InputProps, Input, model } from '@wakeadmin/element-adapter';

import { defineAtomic, defineAtomicComponent, DefineAtomicProps } from '../../atomic';
import { useFatConfigurable } from '../../fat-configurable';
import { FatLink, FatLinkProps, FatTextOwnProps } from '../../fat-text';

export type AUrlProps = DefineAtomicProps<
  string,
  InputProps,
  {
    renderPreview?: (value: any) => any;

    /**
     * 透传 FatLink 的参数
     */
    linkProps?: FatLinkProps;
  } & FatTextOwnProps
>;

declare global {
  interface AtomicProps {
    url: AUrlProps;
  }
}

export const AUrlComponent = defineAtomicComponent(
  (props: AUrlProps) => {
    const configurable = useFatConfigurable();

    return () => {
      const { value, mode, onChange, renderPreview, scene, context, ellipsis, copyable, tag, linkProps, ...other } =
        props;

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
          <FatLink class={other.class} style={other.style} copyable={!!value && copyable} href={value} {...linkProps}>
            {String(value)}
          </FatLink>
        );
      }

      return <Input {...other} {...model(value, onChange!)} />;
    };
  },
  { name: 'AUrl', globalConfigKey: 'aUrlProps' }
);

export const AUrl = defineAtomic({
  name: 'url',
  component: AUrlComponent,
  description: '链接',
  author: 'ivan-lee',
  validateTrigger: 'blur',
  async validate(value) {
    if (value && typeof value === 'string') {
      try {
        // eslint-disable-next-line no-new
        new URL(value);
      } catch (err) {
        throw new Error('请输入合法 URL');
      }
    }
  },
});
