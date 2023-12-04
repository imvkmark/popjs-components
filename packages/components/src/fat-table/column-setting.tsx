import { declareComponent, declareEmits, declareProps } from '@wakeadmin/h';
import { Setting } from '@wakeadmin/icons';
import { Popover, Checkbox, model } from '@wakeadmin/element-adapter';
import { ref, computed } from '@wakeadmin/demi';

import { FatIcon } from '../fat-icon';
import { FatTableColumn } from './types';
import { NoopArray, booleanPredicate } from '@wakeadmin/utils';

import { FatTableSettingPayload } from './types-inner';

export const ColumnSetting = declareComponent({
  name: 'FatTableColumnSetting',
  props: declareProps<{
    columns: FatTableColumn<any>[];
    modelValue?: FatTableSettingPayload;
  }>(['columns', 'modelValue']),
  emits: declareEmits<{
    'update:modelValue': (value: FatTableSettingPayload) => void;
  }>(),
  setup(props, { emit }) {
    const visible = ref(false);
    const tempSelected = ref<string[]>([]);

    const selectedInSet = computed(() => {
      return new Set(tempSelected.value ?? NoopArray);
    });

    const allSelected = computed(() => {
      return props.columns.every(column => selectedInSet.value.has(column.key!));
    });

    const handleToggleSelectAll = (value: boolean) => {
      if (value) {
        tempSelected.value = props.columns.map(column => column.key!).filter(booleanPredicate);
      } else {
        tempSelected.value = [];
      }
    };

    const handleVisibleChange = (value: boolean) => {
      visible.value = value;
    };

    const show = () => {
      tempSelected.value = (props.modelValue?.visible ?? NoopArray).slice();
      handleVisibleChange(true);
    };

    const hide = () => {
      handleVisibleChange(false);
    };

    const confirm = () => {
      emit('update:modelValue', { visible: tempSelected.value.slice() });
      hide();
    };

    return () => {
      return (
        <Popover
          trigger="manual"
          visible={visible.value}
          onUpdate:visible={handleVisibleChange}
          placement="bottom-end"
          width="280px"
          v-slots={{
            reference: (
              <div class="fat-table__column-setting" onClick={show}>
                <FatIcon>
                  <Setting />
                </FatIcon>
                <span>列设置</span>
              </div>
            ),
          }}
        >
          <div class="fat-table__column-setting-hd">
            <Checkbox {...model(allSelected.value, handleToggleSelectAll)}>列展示</Checkbox>
            <div class="fat-table__column-setting-btn">
              <div role="cancel" onClick={hide}>
                取消
              </div>
              <div role="confirm" onClick={confirm}>
                确定
              </div>
            </div>
          </div>
          <div class="fat-table__column-setting-bd">
            {props.columns.map((column, idx) => {
              return (
                <Checkbox
                  {...model(selectedInSet.value.has(column.key!), checked => {
                    if (checked) {
                      tempSelected.value.push(column.key!);
                    } else {
                      tempSelected.value.splice(tempSelected.value.indexOf(column.key!), 1);
                    }
                  })}
                  class="fat-table__column-setting-ck"
                >
                  <span class="fat-table__column-setting-ck-label">
                    {column.label ?? column.renderLabel?.(idx, column)}
                  </span>
                </Checkbox>
              );
            })}
          </div>
        </Popover>
      );
    };
  },
});
