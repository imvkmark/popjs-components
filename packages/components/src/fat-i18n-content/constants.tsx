import { InjectionKey } from '@wakeadmin/demi';
import { FatI18nContentOptions } from './types';
import { UsePromiseCacheState } from '../hooks';

export const FatI18nContentKey: InjectionKey<FatI18nContentOptions> = Symbol('FatI18nContent');

/**
 * 本地缓存
 */
export interface FatI18nContentCache {
  save(uuid: string, key: string, value: any): void;
  get(uuid: string, key: string): any;

  // 本地 promise 缓存
  localPromiseCache: Map<string, UsePromiseCacheState>;
}

export const FatI18nContentCacheKey: InjectionKey<FatI18nContentCache> = Symbol('FatI18nContentCache');

let uuid = 0;

/**
 * 默认配置
 */
export const FatI18nContentDefaultOptions = {
  enable: true,
  position: 'rightCenter',
  sourceLanguage: 'zh',
  list: [
    {
      icon: '🇨🇳',
      tag: 'zh',
      name: '简体中文',
    },
    {
      icon: '🇺🇸',
      tag: 'en',
      name: 'English',
    },
  ],
  genUUID: async () => {
    console.warn('FatI18nContent: genUUID is not implemented');
    return `${Math.random()}${Date.now()}${uuid++}`;
  },
  format: '__i18n__({default},{uuid})',
  inject: (props, badge, target) => {
    return (
      <div class="fat-i18n-content-wrapper">
        {target()}
        {badge()}
      </div>
    );
  },
  save: async (id, changed, content) => {
    throw new Error('FatI18nContent: save is not implemented');
  },
  get: async id => {
    throw new Error('FatI18nContent: get is not implemented');
  },
} satisfies FatI18nContentOptions;
