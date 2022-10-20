import { ref } from '@wakeadmin/demi';
import { FatFormItem } from '../fat-form';
import { expectType, test } from '.';
import { MyGenericComponent } from './MyGenericComponent';
import { ADateValue } from '../builtin-atomic';

test('MyGenericComponent jsx 正常推断类型', () => {
  const instance = ref<{ getValue(): number }>();

  <MyGenericComponent
    ref={instance}
    value={1}
    onChange={e => {
      expectType<number>(e);
    }}
    v-slots={{
      label: scope => {
        expectType<{ foo: number; value: number }>(scope);
      },
    }}
  ></MyGenericComponent>;

  <MyGenericComponent
    value="string"
    // @ts-expect-error 报错，类型不兼容
    ref={instance}
  />;
});

test('FatFormItem', () => {
  // @ts-expect-error prop 不能为空
  <FatFormItem />;

  <FatFormItem
    prop="text"
    // 默认推断为 text props
    valueProps={{
      // @ts-expect-error 类型错误
      type: 'unknown',
      renderPreview(value) {
        expectType<string | undefined>(value);
        return '';
      },
    }}
  ></FatFormItem>;

  <FatFormItem
    prop="text"
    valueType="date"
    valueProps={{
      renderPreview(value) {
        expectType<ADateValue | undefined>(value);
        return '';
      },
    }}
  ></FatFormItem>;

  <FatFormItem
    prop="checkbox"
    valueType="checkbox"
    // 可以正常推断类型 checkbox props
    valueProps={{
      label: active => {
        expectType<boolean>(active);
        return '';
      },

      renderPreview(value, label) {
        expectType<boolean>(value);
        return '';
      },
    }}
  ></FatFormItem>;
});
