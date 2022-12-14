// @ts-check

import MapUtil from "./mapUtilV2";

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
 * @param {object} maptalks - maptalks 引用
 * @param {object} option 地图配置
 * @returns {object} map 指令配置
 */
function directiveMap(maptalks, option) {
  const vueVersion = 2;

  return {
    [Hooks[vueVersion]["mounted"]](el) {
      el.mapUtil = new MapUtil(maptalks, el, option);
    },
    [Hooks[vueVersion]["unmounted"]](el) {
      el.mapUtil.destroy();
      el.mapUtil = null;
    },
  };
}

export default directiveMap;
