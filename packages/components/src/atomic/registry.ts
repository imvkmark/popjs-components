import { NamedRegistry, NamedRegistrySubscriber } from '@wakeadmin/utils';
import { Atomic, Registry } from './types';

function __createRegistry(parent?: Registry): Registry {
  const registry = new NamedRegistry<Atomic>();

  return {
    register: registry.register,
    unregister: registry.unregister,
    subscribe: (subscriber: NamedRegistrySubscriber<Atomic>) => {
      const disposers = [registry.subscribe(subscriber)];
      if (parent) {
        disposers.push(parent.subscribe(subscriber));
      }

      return () => {
        return disposers.map(i => i())[0];
      };
    },
    unsubscribe: (subscriber: NamedRegistrySubscriber<Atomic>) => {
      parent?.unsubscribe(subscriber);

      return registry.unsubscribe(subscriber);
    },
    registered(name: string) {
      const value = registry.registered(name);
      if (value == null && parent != null) {
        return parent.registered(name);
      }

      return value;
    },
  };
}

/**
 * 全局注册器
 */
export const globalRegistry: Registry = __createRegistry();

/**
 * 创建注册器
 * @param parent
 * @returns
 */
export function createRegistry(parent = globalRegistry): Registry {
  return __createRegistry(parent);
}
