import Vue from "vue";
import App from "./App.vue";
import { bindMap } from "../lib/main";
import directiveMap from "../lib/mapDirective";
import * as maptalks from "maptalks";

bindMap(Vue);

const mapOption = {
  center: [-0.113049, 51.498568],
  zoom: 14,
  baseLayer: new maptalks.TileLayer("base", {
    urlTemplate: "https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}.png",
    subdomains: ["a", "b", "c", "d"],
    attribution:
      '&copy; <a href="http://osm.org">OpenStreetMap</a> contributors, &copy; <a href="https://carto.com/">CARTO</a>',
  }),
};
Vue.directive("map", directiveMap(Vue, maptalks, mapOption));

new Vue({
  render: (h) => h(App),
}).$mount("#app");
