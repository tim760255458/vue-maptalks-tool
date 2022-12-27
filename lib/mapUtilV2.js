// @ts-check

import Vue from "vue";
import MapUtil from "./mapUtilCore";

MapUtil.prototype.createApp = (componentTemp, props) =>
  new Vue({
    render: (h) => h(componentTemp, { props }),
  }).$mount().$children[0];

export default MapUtil;
