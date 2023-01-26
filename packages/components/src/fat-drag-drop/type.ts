import { ToHEmitDefinition } from '../utils';
import type { DragRef } from './dragRef';
import type { DropListRef } from './dropListRef';

export interface DragConfig {
  /**
   * 锁定移动方向
   *
   * 默认为不限制
   */
  lockAxis?: 'x' | 'y';
  dragStartDelay: number;
  previewClass?: string | string[];
  zIndex: number;
  /**
   * 拖拽移动了多少个像素才需要进行处理
   */
  dragStartThreshold: number;
  /**
   * 鼠标移动了多少个像素才需要进行更新
   */
  pointerDirectionChangeThreshold: number;
  placeholderClass?: string | string[];
}

export interface Point {
  x: number;
  y: number;
}

export interface Delta {
  x: -1 | 0 | 1;
  y: -1 | 0 | 1;
}

export interface FatDragItemEvents {
  /**
   * 拖拽移动
   * @param payload
   * @returns
   */
  onMove?: (payload: {
    source: DragRef;
    pointerPosition: Point;
    event: MouseEvent | TouchEvent;
    distance: Point;
  }) => void;
  /**
   * 拖拽开始
   * @param payload
   * @returns
   */
  onStarted?: (payload: { source: DragRef; event: MouseEvent | TouchEvent }) => void;
  /**
   * 拖拽释放
   * @param payload
   * @returns
   */
  onRelease?: (payload: { source: DragRef; event: MouseEvent | TouchEvent }) => void;
  /**
   * 拖拽结束
   * @param payload
   * @returns
   */
  onEnded?: (payload: { source: DragRef; distance: Point; dropPoint: Point; event: MouseEvent | TouchEvent }) => void;
  /**
   * 拖拽对象离开容器
   * @param payload
   * @returns
   */
  onExited?: (payload: { source: DragRef; container: any }) => void;
  /**
   * 拖拽对象进入容器
   * @param payload
   * @returns
   */
  onEnter?: (payload: { source: DragRef; container: any; index: number }) => void;
  /**
   * 拖拽元素落在容器上
   * @param payload
   * @returns
   */
  onDropped?: (payload: {
    previousIndex: number;
    currentIndex: number;
    item: DragRef;
    container?: DropListRef;
    previousContainer?: DropListRef;
    distance: Point;
    dropPoint: Point;
    event: MouseEvent | TouchEvent;
  }) => void;
}

export interface FatDragItemSlots {
  /**
   * 拖拽过程中的预览显示
   */
  renderPreview?: (data?: any) => any;
  /**
   * 位于拖拽列表中的占位显示
   */
  renderPlaceholder?: (data?: any) => any;
}

export interface FatDragItemMethods {
  /**
   * 重置拖拽状态
   */
  reset(): void;
}

export interface FatDragItemProps
  extends FatDragItemEvents,
    FatDragItemSlots,
    Omit<DragConfig, 'dragStartDelay' | 'zIndex' | 'pointerDirectionChangeThreshold' | 'dragStartThreshold'> {
  /**
   * 允许拖拽
   */
  disabled?: boolean;

  /**
   * 按下鼠标后持续多久才进行响应拖拽事件
   */
  dragDelay?: number;

  /**
   * 所对应的数据源
   *
   * @remarks
   * 只有在初始化的时候进行一次赋值 后续变动是不会进行更新的
   */
  data: any;

  /**
   * 预览元素的容器位置
   */
  previewContainer?: HTMLElement;
}

export type DragRefEvents = ToHEmitDefinition<FatDragItemEvents>;

export type Orientation = 'vertical' | 'horizontal';

export interface FatDropListProps extends Omit<FatDragItemProps, 'lockAxis'> {
  /**
   * 允许拖拽元素移动到哪些容器上
   *
   */
  connectTo?: DropListRef[];

  /**
   * 数据列表
   */
  data: any[];

  /**
   * 排序位置
   *
   * 默认为 `vertical`
   */
  orientation?: Orientation;

  /**
   * 是否允许拖拽对象进入该容器
   * @param drag
   * @param dropList
   */
  enterPredicate?: (drag: DragRef, dropList: DropListRef) => boolean;

  /**
   * 判断鼠标是否靠近容器的宽容值
   */
  dropSortThreshold?: number;
}

export type FatDropListEvents = FatDragItemEvents;

export type FatDropListSlots = FatDragItemSlots;
