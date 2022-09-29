import { getCurrentInstance, isVue2, Fragment, isVNode } from '@wakeadmin/demi';
import { NoopObject, upperFirst } from '@wakeadmin/utils';

/**
 * 是否存在事件订阅者
 * note: 不支持修饰符
 * @param name
 * @returns
 */
export function hasListener(name: string, instance?: any) {
  instance ??= getCurrentInstance()?.proxy;

  if (isVue2) {
    return name in (instance?.$listeners ?? NoopObject);
  } else {
    return `on${upperFirst(name)}` in (instance?.$attrs ?? NoopObject);
  }
}

/**
 * 判断是否声明了 slots
 */
export function hasSlots(props: any, slots: any, name: string) {
  return typeof props[`render${upperFirst(name)}`] === 'function' || typeof slots[name] === 'function';
}

function safeCall(fn: any, args: any[]) {
  if (fn == null) {
    return;
  }

  if (typeof fn !== 'function' && process.env.NODE_ENV !== 'production') {
    throw new Error(`[@wakeadmin/components] 期望接收到的是函数，当前为 ${typeof fn}`);
  }

  // eslint-disable-next-line consistent-return
  return fn.apply(null, args);
}

/**
 * 渲染 slot
 * @param props
 * @param slots
 * @param name
 * @param args
 * @returns
 */
export function renderSlot(props: any, slots: any, name: string, ...args: any[]) {
  const renderFn = props[`render${upperFirst(name)}`];
  const slot = slots[name];

  return renderFn && slot
    ? [safeCall(renderFn, args), safeCall(slot, args)]
    : slot != null
    ? safeCall(slot, args)
    : safeCall(renderFn, args);
}

/**
 * 从 VNode 中提取 props
 * @param vnode
 */
export function extraProps(vnode: any) {
  if (!vnode || typeof vnode !== 'object') {
    return undefined;
  }

  if (isVue2) {
    if (vnode.componentOptions != null) {
      return vnode.componentOptions.propsData;
    }

    if (vnode.data != null) {
      return vnode.data.attrs;
    }
  } else {
    return vnode.props;
  }

  return undefined;
}

export function isFragment(vnode: any) {
  return isVNode(vnode) && vnode.type === Fragment;
}

/**
 * 从 children 中提取 props
 * @param children
 * @returns
 */
export function extraPropsFromChildren(children: any[] | undefined | null) {
  if (!children || !Array.isArray(children)) {
    return undefined;
  }

  return children
    .map(i => {
      if (isVue2) {
        return extraProps(i);
      } else {
        if (isFragment(i)) {
          return i.children.map(extraProps);
        }
        return extraProps(i);
      }
    })
    .flat();
}
