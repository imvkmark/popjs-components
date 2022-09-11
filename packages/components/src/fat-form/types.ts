import {
  ClassValue,
  ColProps,
  FormMethods,
  RowProps,
  Size,
  StyleValue,
  Rule,
  Rules,
  CommonProps,
  ButtonProps,
} from '@wakeadmin/component-adapter';
import { Ref } from '@wakeadmin/demi';

import { Atomic } from '../atomic';
import { FatSpaceSize } from '../fat-space/types';

/**
 * 参考 antd-pro https://procomponents.ant.design/components/field-set#%E5%AE%BD%E5%BA%A6
 */
export type FatFormItemWidth = 'mini' | 'small' | 'medium' | 'large' | 'huge';

/**
 * 表单模式
 */
export type FatFormMode = 'preview' | 'editable';

export type FatFormLayout = 'horizontal' | 'vertical' | 'inline';

/**
 * fat 表单实例方法
 */
export interface FatFormMethods<Store extends {}> {
  /**
   * 表单模式
   */
  readonly mode: FatFormMode;

  /**
   * 表单布局
   */
  readonly layout: FatFormLayout;

  /**
   * 表单 label 宽度
   */
  readonly labelWidth?: string | number;

  /**
   * 表单标签后缀
   */
  readonly labelSuffix?: string;

  /**
   * 是否已禁用
   */
  readonly disabled: boolean;

  /**
   * 是否可清理
   */
  readonly clearable?: boolean;

  /**
   * 错误信息
   */
  readonly error?: Error;

  /**
   * 正在加载中
   */
  readonly loading: boolean;

  /**
   * 表单提交中
   */
  readonly submitting: boolean;

  /**
   * 表单值
   */
  values: Store;

  /**
   * 底层 form 实例
   */
  readonly formRef?: FormMethods;

  /**
   * 表单提交
   */
  submit(): Promise<void>;

  /**
   * 手动发起请求, 当 requestOnMounted 关闭时使用
   */
  request(): Promise<void>;

  /**
   * 重置表单
   */
  reset(): void;

  /**
   * 对整个表单的内容进行验证。返回 true 表示验证通过, 验证失败抛出异常
   */
  validate: () => Promise<boolean>;

  /**
   * 验证某个字段
   */
  validateField: (props: string | string[]) => Promise<boolean>;

  /**
   * 检查对应字段是否被用户操作过
   * @param allTouched 如果传递多个 prop, allTouched 用于控制是否所有字段都 touch 了才返回true。默认为 true
   */
  isFieldTouched: (props: string | string[], allTouched?: boolean) => boolean;

  /**
   * 清除表单验证
   */
  clearValidate: (props?: string | string[]) => void;

  /**
   * 获取指定字段的值
   * @param prop
   */
  getFieldValue(prop: string): any;

  /**
   * 设置指定字段的值
   * @param prop
   * @param value
   */
  setFieldValue(prop: string, value: any): void;

  // 以下是私有方法

  /**
   * 设置字段值，prop 为字段路径，同 FatFormItemProps
   *
   * 这个方法用于初始化 prop，在 vue2 中这是必须的，否则对象无法响应
   *
   * @param prop
   * @param value 初始值，可选
   */
  __setInitialValue(prop: string, value?: any): void;

  /**
   * 注册表单项
   * @param item
   */
  __registerFormItem(item: FatFormItemMethods<Store>): void;

  /**
   * 释放表单项
   * @param item
   */
  __unregisterFormItem(item: FatFormItemMethods<Store>): void;

  /**
   * 注册子表单
   * @param form
   */
  __registerChildForm(form: FatFormMethods<any>): void;

  /**
   * 释放子表单
   * @param form
   */
  __unregisterChildForm(form: FatFormMethods<any>): void;
}

/**
 * fat 表单事件
 */
export interface FatFormEvents<Store extends {}, Submit extends {} = Store> {
  /**
   * 加载成功时触发
   */
  onLoad?: (values: Store) => void;

  /**
   * 加载失败
   */
  onLoadFailed?: (error: Error) => void;

  /**
   * 数据提交完成时触发
   */
  onFinish?: (values: Submit) => void;

  /**
   * 提交失败时触发
   */
  onSubmitFailed?: (values: Submit, error: Error) => void;

  /**
   * 任一表单项被校验后触发
   */
  onValidate?: (prop: string, isValid: boolean, message?: string) => void;

  /**
   * 数据验证失败时触发
   */
  onValidateFailed?: (values: Store, error: Record<string, any>) => void;

  /**
   * 数据变更时触发
   */
  onValuesChange?: (values: Store, prop: string, value: any, oldValue: any) => void;

  /**
   * 表单重置时触发
   */
  onReset?: (values: Store) => void;
}

/**
 * 表单提交按钮配置
 */
export interface FatFormSubmitter<S extends {}> {
  /**
   * 是否开启提交/重置按钮，默认为 true
   */
  enableSubmitter?: boolean;

  /**
   * 提交按钮文本，默认为保存
   */
  submitText?: string;

  /**
   * 重置按钮文本，默认为 重置
   */
  resetText?: string;

  /**
   * 是否开启重置按钮， 默认开启
   */
  enableReset?: boolean;

  /**
   * 提交按钮属性
   */
  submitProps?: ButtonProps;

  /**
   * 重置按钮属性
   */
  resetProps?: ButtonProps;

  /**
   * 提交器 props
   */
  submitterProps?: FatFormGroupProps<S>;

  /**
   * 提交器类名
   */
  submitterClassName?: ClassValue;

  /**
   * 提交器内联样式
   */
  submitterStyle?: StyleValue;
}

export interface FatFormSlots<S extends {}> {
  /**
   * 自定义渲染 提交按钮
   * @param form 表单实例
   * @param buttons 默认按钮渲染
   */
  renderSubmitter?: (form: FatFormMethods<S>, buttons: () => any) => any;
}

/**
 * fat 表单属性
 * @template Store 表单存储的类型
 * @template Request 从后端请求回来的类型，默认等于 Store
 * @template Submit 提交给后端的类型，默认等于 Store
 */
export interface FatFormProps<Store extends {} = {}, Request extends {} = Store, Submit extends {} = Store>
  extends FatFormEvents<Store, Submit>,
    FatFormSubmitter<Store>,
    FatFormSlots<Store> {
  /**
   * 使用场景
   * preview 预览
   * editable 编辑
   *
   * 默认为 editable
   */
  mode?: FatFormMode;

  /**
   * 初始化值, 表单默认值，只有初始化(比如新建场景)以及重置时生效
   */
  initialValue?: Store;

  /**
   * 数据请求。用于预览、编辑场景
   * request 请求的数据高于 initialValue, 不推荐同时使用
   */
  request?: () => Promise<Request>;

  /**
   * 是否在挂在的时候就发起请求, 默认为 true
   *
   * 在新增场景可以关闭
   */
  requestOnMounted?: boolean;

  /**
   * 表单提交
   */
  submit?: (values: Submit) => Promise<void>;

  /**
   * 表单布局， 默认为 horizontal
   */
  layout?: 'horizontal' | 'vertical' | 'inline';

  /**
   * label 水平对齐方式， 默认 right
   */
  labelAlign?: 'left' | 'right';

  /**
   * 全局网格配置
   *
   * 该配置会让所有子级默认采用该网格配置
   */
  col?: ColProps;

  /**
   * 列配置，只有配置了 col 属性后生效
   */
  row?: Pick<RowProps, 'align' | 'justify'>;

  /**
   * 标签的长度，例如 '50px'。 作为 Form 直接子元素的 form-item 会继承该值。 可以使用 auto
   *
   * 默认为 'auto'
   */
  labelWidth?: string | number;

  /**
   * 表单域标签的后缀, 默认 '：'
   */
  labelSuffix?: string;

  /**
   * 用于控制该表单内组件的尺寸
   */
  size?: Size;

  /**
   * 是否禁用该表单内的所有组件。若设置为 true，则表单内组件上的 disabled 属性不再生效
   * 默认为 false
   */
  disabled?: boolean;

  /**
   * 是否支持清理，默认 false
   */
  clearable?: boolean;

  /**
   * 是否加载中
   */
  loading?: boolean;

  /**
   * 验证规则
   */
  rules?: Rules | ((values: Store, form: FatFormMethods<Store>) => Rules);

  /**
   * 是否隐藏必填字段的标签旁边的红色星号, 默认 false
   */
  hideRequiredAsterisk?: boolean;

  /**
   * 是否在 rules 属性改变后立即触发一次验证, 默认为true
   */
  validateOnRuleChange?: boolean;

  /**
   * 异常捕获，默认行为是消息提示. 可以提供这个方法来自定义错误处理
   */
  errorCapture?: (error: Error) => void;

  /**
   * 是否和父级 fat-form 建立关联。默认为 true
   *
   * 如果开启关联，父子 fat-form 会建立以下关联关系：
   *  1. 全局验证: 父 fat-form 在验证时，同时会触发子 fat-form 的验证
   *  2. 全局清理验证
   *
   * 注意，父子组件之间状态不会共享
   */
  hierarchyConnect?: boolean;

  /**
   * 支持状态外置, 特殊情况使用
   */
  _values?: () => Ref<Store>;
}

/**
 * 用于获取表单实例，实现一些表单联动的场景
 */
export interface FatFormConsumerProps<S extends {} = {}> {
  /**
   * 也可以通过 #default slot
   */
  renderDefault?: (form: FatFormMethods<S>) => any;
}

export interface FatFormItemMethods<Store extends {}> {
  readonly form: FatFormMethods<Store>;
  readonly value: any;
  readonly prop: string;
  readonly props: FatFormItemProps<Store, any>;
  readonly disabled?: boolean;
  readonly clearable?: boolean;
  readonly hidden?: boolean;
  readonly mode?: FatFormMode;
  readonly atom: Atomic<any, any>;

  /**
   * 后转换
   */
  transform?: (value: any, values: Store, prop: string) => any;

  /**
   * 前转换
   */
  convert?: (value: any, values: any, prop: string) => any;
}

export interface FatFormItemShared {
  /**
   * 显式指定字段的模式。适用于编辑模式下，某些字段禁止编辑的场景
   */
  mode?: FatFormMode;

  /**
   * 标签, 也可以使用 label slot 或 renderLabel
   */
  label?: any;

  /**
   * 表单域标签的的宽度，例如 '50px'。支持 auto
   */
  labelWidth?: string;

  /**
   * 会在 label 右侧增加一个 icon，悬浮后提示信息.
   *
   * 也可以使用 renderTooltip 或 tooltip slot
   */
  tooltip?: string;

  /**
   * 在表单下方展示提示信息
   * 也可以使用 renderMessage 或 message slot
   */
  message?: string;

  /**
   * 内联形式的消息，默认 false
   */
  inlineMessage?: boolean;

  /**
   * 网格列配置
   * 如果配置了该项， 会使用 el-col 包裹
   */
  col?: false | (ColProps & CommonProps);

  /**
   * 字段宽度(不包含label)
   */
  width?: number | FatFormItemWidth;

  /**
   * 表单大小, 会覆盖 FatForm 指定的大小
   */
  size?: Size;

  /**
   * 内容区类名
   */
  contentClassName?: ClassValue;

  /**
   * 内容区内联样式
   */
  contentStyle?: StyleValue;
}

/**
 * 可以按层级继承的属性
 */
export interface FatFormItemInheritableProps {
  mode?: FatFormMode;
  disabled?: boolean;
  size?: Size;
  hidden?: boolean;
  clearable?: boolean;
  // 浅层 col 配置
  col?: ColProps;
}

export interface FatFormGroupSlots<S extends {}> {
  renderLabel?: (inst: FatFormMethods<S>) => any;
  renderDefault?: (inst: FatFormMethods<S>) => any;
  renderTooltip?: (inst: FatFormMethods<S>) => any;
  renderMessage?: (inst: FatFormMethods<S>) => any;
}

/**
 * fat 表单分组属性
 */
export interface FatFormGroupProps<S extends {}> extends FatFormItemShared, FatFormGroupSlots<S> {
  /**
   * 间隔大小.
   * 当开启了 row， gutter 会设置 row 的 gutter props
   * 否则作为  fat-space 组件的 size
   *
   * 默认 huge
   */
  gutter?: FatSpaceSize;

  /**
   * 是否作为 el-row, 当设置了改属性，children 会使用 el-row 包裹
   * 如果未指定，默认使用 fat-space 布局
   */
  row?: RowProps & CommonProps;

  /**
   * fat-space 模式使用垂直布局, 默认 false
   */
  vertical?: boolean;

  /**
   * 是否隐藏。下级 form-item 会继承
   *
   * 隐藏后当前字段将不会进行校验
   */
  hidden?: boolean | ((instance: FatFormMethods<S>) => boolean);

  /**
   * 是否禁用。下级 form-item 会继承
   *
   * 禁用后当前字段将不会进行校验
   */
  disabled?: boolean | ((instance: FatFormMethods<S>) => boolean);

  /**
   * 是否支持清除
   */
  clearable?: boolean;

  /**
   * 是否必填，会显示必填符号，但不会有实际作用
   */
  required?: boolean;
}

/**
 * fat 表单项插槽
 */
export interface FatFormItemSlots<S extends {}> {
  /**
   * 自定义标签渲染
   */
  renderLabel?: (inst: FatFormItemMethods<S>) => any;

  /**
   * 原件之前
   */
  renderBefore?: (inst: FatFormItemMethods<S>) => any;

  /**
   * 原件之后
   */
  renderDefault?: (inst: FatFormItemMethods<S>) => any;

  /**
   * 渲染提示消息
   */
  renderMessage?: (inst: FatFormItemMethods<S>) => any;

  /**
   * 渲染标签提示消息
   */
  renderTooltip?: (inst: FatFormItemMethods<S>) => any;
}

/**
 * fat 表单项属性
 * @template Store 表单存储值
 * @template ValueType 原件类型
 * @template Request 后端请求的值, 默认等于 Store
 */
export interface FatFormItemProps<
  Store extends {},
  ValueType extends keyof AtomicProps | Atomic,
  Request extends {} = Store
> extends FatFormItemShared,
    FatFormItemSlots<Store> {
  /**
   * 字段路径。例如 a.b.c、b[0]
   */
  prop: string;

  /**
   * 字段初始值
   *
   * note: 优先级会高于 FatForm 定义的 initialValues
   */
  initialValue?: any;

  /**
   * 原件类型, 默认为 text
   */
  valueType?: ValueType;

  /**
   * 原件属性
   */
  valueProps?: ValueType extends keyof AtomicProps
    ? AtomicProps[ValueType]
    : ValueType extends Atomic<any, infer B>
    ? B
    : Record<string, any>;

  /**
   * **数据提交前**的转换，比如转换为 后端 需要的字段和格式
   *
   * 用于转换表单的数据，比如前端使用 dataRange 字段来表示时间范围，而后端需要的是 startTime、endTime
   * 那么就可以在这里设置转换规则。
   *
   * 如果返回一个对象，key 为新属性的 path, 例如 {'a.b': 0, 'a.c': 2, 'a.d[0]': 3}, 同时原本的字段会被移除
   * 如果 transform 返回非对象的值，将作为当前字段的值
   *
   * 假设：
   *  prop 为  dataRange
   *  transform 返回的是 {startTime、endTime}
   *  最后的结果是 dataRange 会从 query 中移除，并且 startTime、endTime 会合并到 query 中
   *
   * 如果需要更灵活的转换，可以在 fat-form submit 中处理
   *
   * @param value 当前值
   * @param values 当前所有表单的值
   * @param prop 字段路径
   *
   */
  transform?: (value: any, values: Store, prop: string) => any;

  /**
   * **对 request 返回数据**的转换，比如转换为**组件能识别的格式**
   *
   * 另外原件本身也支持 convert
   *
   * 注意，这里不会转换 initialValue
   *
   * @param value 当前字段值
   * @param values request 请求回来的值
   * @param prop 字段路径
   */
  convert?: (value: any, values: Request, prop: string) => any;

  /**
   * 验证规则
   */
  rules?: Rule | ((values: Store, form: FatFormMethods<Store>) => Rule);

  /**
   * 是否隐藏
   *
   * 隐藏后当前字段将不会进行校验
   */
  hidden?: boolean | ((instance: FatFormItemMethods<Store>) => boolean);

  /**
   * 是否禁用
   *
   * 禁用后当前字段将不会进行校验
   */
  disabled?: boolean | ((instance: FatFormItemMethods<Store>) => boolean);

  /**
   * 是否支持清理
   */
  clearable?: boolean;

  /**
   * 声明该字段依赖的字段，格式同 prop
   * 当列表中的字段变更后，通知当前字段进行重新验证
   */
  dependencies?: string[] | string;

  /**
   * 原件类名
   */
  valueClassName?: ClassValue;

  /**
   * 原件内联样式
   */
  valueStyle?: StyleValue;
}

export { Rules, Rule } from '@wakeadmin/component-adapter';

export interface FatFormSectionSlots {
  /**
   * 自定义渲染标题
   */
  renderTitle?: () => any;
}
/**
 * 表单分段
 */
export interface FatFormSectionProps extends FatFormSectionSlots {
  /**
   * 标题
   */
  title?: string;

  /**
   * 是否支持折叠，默认关闭
   */
  collapsable?: boolean;

  /**
   * 默认是否折叠
   */
  defaultCollapse?: boolean;
}
