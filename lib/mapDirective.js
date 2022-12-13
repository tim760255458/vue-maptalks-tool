// @ts-check

import { getVueVersion } from "./util";
import MapUtil from "./mapUtil";

const Hooks = {
  2: {
    created: "bind",
    mounted: "inserted",
    updated: "componentUpdated",
    unmounted: "unbind",
  },
  3: {
    created: "created",
    mounted: "mounted",
    updated: "updated",
    unmounted: "unmounted",
  },
};

/**
 * 生成 map 指令配置
 * @param {object} appInsOrVue vue 引用或实例
 * @param {object} maptalks - maptalks 引用
 * @param {object} option 地图配置
 * @returns {object} map 指令配置
 */
function directiveMap(appInsOrVue, maptalks, option) {
  const vueVersion = getVueVersion(appInsOrVue);

  return {
    [Hooks[vueVersion]["mounted"]](el) {
      el.mapUtil = new MapUtil(maptalks, el, option, vueVersion);
    },
    [Hooks[vueVersion]["unmounted"]](el) {
      el.mapUtil.destroy();
      el.mapUtil = null;
    },
  };
}

export default directiveMap;
