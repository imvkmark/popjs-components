import { Message } from '@wakeadmin/element-adapter';
import { Ref, ref, unref } from '@wakeadmin/demi';
import { MaybeRef } from '@wakeadmin/h';

export function useLazyOptions<T>(options: MaybeRef<T | (() => Promise<T>) | undefined>, defaultValue: T) {
  const loading = ref(false);

  const unwrapOptions = unref(options);

  if (typeof unwrapOptions === 'function') {
    // 加载器模式
    const value = ref<T>(defaultValue) as Ref<T>;

    const load = async () => {
      try {
        loading.value = true;
        const results = await (unwrapOptions as () => Promise<T>)();

        value.value = results;
      } catch (err) {
        console.error(err);
        Message.error(`选项加载失败：${(err as Error).message}`);
      } finally {
        loading.value = false;
      }
    };

    // 立即执行
    load();

    return {
      value,
      loading,
    };
  }

  const value = ref<T>(options as T);

  return { loading, value };
}
