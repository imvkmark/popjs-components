import { declareComponent, declareEmits, declareProps, declareSlots } from '@wakeadmin/h';
import { computed, ref, watch } from '@wakeadmin/demi';

import { hasSlots, renderSlot, ToHSlotDefinition, ToHEmitDefinition } from '../utils';

import { isWakeadminBayEnabled, ceSlot } from './utils';
import { FatCard } from './fat-card';

export interface FatContainerSlots {
  /**
   * 标题区
   */
  renderTitle?: () => any;

  /**
   * 标题额外区域
   */
  renderExtra?: () => any;

  /**
   * 筛选区, 可选
   */
  renderQuery?: () => any;

  /**
   * 内容区域
   */
  renderDefault?: () => any;
}

export interface FatContainerTab {
  key: string | number;
  title?: string;
  renderTitle?: () => any;
}

export interface FatContainerEvents {
  onActiveKeyChange?: (key: string | number) => void;
}

export interface FatContainerProps extends FatContainerSlots, FatContainerEvents {
  /**
   * 标题， 也可以使用 renderTitle 或者 #title slot
   */
  title?: string;

  /**
   * 标签形式
   */
  tabs?: FatContainerTab[];

  /**
   * 当前激活的 tab key
   */
  activeKey?: string | number;

  /**
   * 在微前端环境是否直接使用基座提供的 wkc-header，默认 true
   */
  reuseBayIfNeed?: boolean;
}

/**
 * 页面布局
 */
export const FatContainer = declareComponent({
  name: 'FatContainer',
  props: declareProps<Omit<FatContainerProps, keyof FatContainerEvents>>({
    title: null,
    tabs: null,
    activeKey: null,
    reuseBayIfNeed: { type: Boolean, default: true },

    // slots
    renderTitle: null,
    renderExtra: null,
    renderQuery: null,
    renderDefault: null,
  }),
  emits: declareEmits<ToHEmitDefinition<FatContainerEvents>>(),
  slots: declareSlots<ToHSlotDefinition<FatContainerSlots>>(),
  setup(props, { slots, emit, attrs }) {
    const hasQuerySlots = computed(() => hasSlots(props, slots, 'query'));
    const hasDefaultSlot = computed(() => hasSlots(props, slots, 'default'));
    const hasTitleSlots = computed(() => hasSlots(props, slots, 'title'));
    const hasExtraSlots = computed(() => hasSlots(props, slots, 'extra'));

    const activeKey = ref<string | number | undefined>();

    const realActiveKey = computed(() => {
      if (activeKey.value != null) {
        return activeKey.value;
      }

      // 默认选择第一个
      return props.tabs?.[0]?.key;
    });

    const handleTabClick = (key: string | number) => {
      activeKey.value = key;

      emit('activeKeyChange', key);
    };

    watch(
      () => props.activeKey,
      () => {
        const nextActiveKey = props.activeKey;
        if (nextActiveKey !== activeKey.value) {
          activeKey.value = nextActiveKey;
        }
      },
      { immediate: true }
    );

    return () => {
      const wakeadminBayEnabled = isWakeadminBayEnabled();

      // 使用 惟客云 基座实现
      if (wakeadminBayEnabled && props.reuseBayIfNeed) {
        return (
          <wkc-header class={['fat-container', attrs.class]} style={attrs.style} title={props.title}>
            {!!hasTitleSlots.value && <div {...ceSlot('title')}>{renderSlot(props, slots, 'title')}</div>}
            {!!hasExtraSlots.value && <div {...ceSlot('extra')}>{renderSlot(props, slots, 'extra')}</div>}
            {/* 筛选区， 通常是条件筛选 */}
            {hasQuerySlots.value && <div class="fat-container__query">{renderSlot(props, slots, 'query')}</div>}
            {/* 内容区， 可以放置列表或表格 */}
            {hasDefaultSlot.value && <div class="fat-container__body">{renderSlot(props, slots, 'default')}</div>}
          </wkc-header>
        );
      }

      return (
        <FatCard
          class={['fat-container', attrs.class]}
          style={attrs.style}
          padding={false}
          v-slots={{
            title: () =>
              props.tabs ? (
                <div class="fat-container__tabs">
                  {props.tabs.map(menu => {
                    return (
                      <div
                        class={['fat-container__tab', { active: menu.key === realActiveKey.value }]}
                        key={menu.key}
                        onClick={() => handleTabClick(menu.key)}
                      >
                        {menu.renderTitle ? menu.renderTitle() : menu.title}
                      </div>
                    );
                  })}
                </div>
              ) : hasTitleSlots.value ? (
                renderSlot(props, slots, 'title')
              ) : (
                props.title
              ),
            /* 扩展区域，通常放置按钮 */
            extra: () => renderSlot(props, slots, 'extra'),
          }}
        >
          {/* 筛选区， 通常是条件筛选 */}
          {hasQuerySlots.value && <div class="fat-container__query">{renderSlot(props, slots, 'query')}</div>}
          {/* 内容区， 可以放置列表或表格 */}
          {hasDefaultSlot.value && <div class="fat-container__body">{renderSlot(props, slots, 'default')}</div>}
        </FatCard>
      );
    };
  },
});
