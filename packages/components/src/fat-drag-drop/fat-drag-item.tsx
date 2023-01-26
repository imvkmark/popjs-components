import { computed, getCurrentInstance, inject, provide, watch, onUnmounted, onMounted } from '@wakeadmin/demi';
import { declareComponent, declareEmits, declareProps, declareSlots } from '@wakeadmin/h';

import { hasSlots, OurComponentInstance, renderSlot, ToHEmitDefinition, ToHSlotDefinition } from '../utils';

import { DragRef } from './dragRef';
import { FatDragRefToken, FatDropContainerToken } from './token';
import { FatDragItemEvents, FatDragItemProps, FatDragItemSlots } from './type';

const FatDragItemInner = declareComponent({
  name: 'FatDragItem',
  props: declareProps<FatDragItemProps>({
    data: null,
    dragDelay: {
      type: Number,
      default: 0,
    },
    lockAxis: null,
    disabled: {
      type: Boolean,
      default: false,
    },
    previewContainer: undefined,

    // emits
    onDropped: null,
    onEnded: null,
    onEnter: null,
    onExited: null,
    onMove: null,
    onRelease: null,
    onStarted: null,

    // slots
    renderPlaceholder: null,
    renderPreview: null,
  }),
  emits: declareEmits<ToHEmitDefinition<FatDragItemEvents>>(),
  slots: declareSlots<ToHSlotDefinition<FatDragItemSlots>>(),
  setup(props, { emit, slots }) {
    const instance = getCurrentInstance()!.proxy!;
    const dropContainer = inject(FatDropContainerToken, null);
    const parentDragContainer = inject(FatDragRefToken, null);

    const renderPlaceholder = computed(() => {
      if (hasSlots(props, slots, 'placeholder')) {
        return () => renderSlot(props, slots, 'placeholder', props.data);
      }
      if (dropContainer?.renderPlaceholder) {
        return () => dropContainer.renderPlaceholder!(props.data);
      }
      return undefined;
    });

    const renderPreview = computed(() => {
      if (hasSlots(props, slots, 'preview')) {
        return () => renderSlot(props, slots, 'preview', props.data);
      }
      if (dropContainer?.renderPreview) {
        return () => dropContainer.renderPreview!(props.data);
      }
      return undefined;
    });

    const dragInstance = new DragRef(
      // 这个时候无法获取到对应的dom实例
      null as any,
      instance,
      props.previewContainer || document.body,
      renderPreview.value,
      renderPlaceholder.value,
      // 这里暂时只暴露这些配置出去
      {
        dragStartDelay: props.dragDelay,
        lockAxis: props.lockAxis,
      }
    );

    dragInstance.withData(props.data);

    if (parentDragContainer) {
      dragInstance.withParentDragRef(parentDragContainer);
    }
    if (dropContainer) {
      dragInstance.withDropContainer(dropContainer.instance);
      dropContainer.instance.addItem(dragInstance);
      dragInstance.forwardSubscribeToEmit(dropContainer.emits, ['ended', 'move', 'release', 'started']);
    }

    // 对内部进行暴露
    // 以便允许自定义 Handler
    provide(FatDragRefToken, dragInstance);

    watch(
      () => props.disabled,
      val => {
        if (val) {
          dragInstance.disableDrag();
        } else {
          dragInstance.enableDrag();
        }
      },
      {
        immediate: true,
      }
    );

    dragInstance.forwardSubscribeToEmit(emit);

    onMounted(() => {
      dragInstance.withRootElement(instance.$el as any);
    });

    onUnmounted(() => {
      dragInstance.destroy();
    });

    return () => {
      return <div class="fat-drag-item">{renderSlot(props, slots, 'default')}</div>;
    };
  },
});

export const FatDragItem = FatDragItemInner as unknown as new (props: FatDragItemProps) => OurComponentInstance<
  typeof props,
  FatDragItemSlots,
  FatDragItemEvents
>;
