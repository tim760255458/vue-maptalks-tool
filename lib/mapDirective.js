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

function directiveMap(appInsOrVue, maptalks, option) {
  const vueVersion = getVueVersion(appInsOrVue);

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
