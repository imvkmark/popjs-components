import { switchVersion, loadModule } from './utils.js';

const Vue = loadModule('vue');

if (!Vue || typeof Vue.version !== 'string') {
  console.warn('[wakeadmin adapter] Vue is not found. Please run "npm install vue" to install.');
} else if (Vue.version.startsWith('2.')) {
  switchVersion(2);
} else if (Vue.version.startsWith('3.')) {
  switchVersion(3);
} else {
  console.warn(`[wakeadmin adapter] Vue version v${Vue.version} is not suppported.`);
}
