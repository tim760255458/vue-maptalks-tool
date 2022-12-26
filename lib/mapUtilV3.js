// @ts-check

import { createApp } from "vue";
import MapUtil from "./mapUtilCore";

MapUtil.prototype.createApp = (componentTemp, props) =>
  createApp(componentTemp, { ...props }).mount();

export default MapUtil;
