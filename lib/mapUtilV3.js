// @ts-check

import { createApp } from "vue";
import MapUtil from "./mapUtilCore";

MapUtil.prototype.createApp = (componentTemp, props) => {
  const divDom = document.createElement("div");
  return createApp(componentTemp, props).mount(divDom);
};

export default MapUtil;
