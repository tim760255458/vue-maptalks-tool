// @ts-check

import { getVueVersion } from "./util";
import * as maptalks from "maptalks";
import "maptalks/dist/maptalks.css";

/**
 * 将 maptalks 绑定到 vue 全局对象上的 $mp
 * @param {object} appInsOrVue vue 引用
 */
const bindMap = (appInsOrVue) => {
  const vueVersion = getVueVersion(appInsOrVue);
  if (vueVersion === 2) {
    appInsOrVue.prototype.$mp = maptalks;
  } else if (vueVersion === 3) {
    appInsOrVue.config.globalProperties.$mp = maptalks;
  }
};

export default bindMap;
