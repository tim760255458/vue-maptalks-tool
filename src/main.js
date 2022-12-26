import Vue from "vue";
import App from "./App.vue";
import { directiveMap } from "../lib/main";
import * as maptalks from "maptalks";
import "maptalks/dist/maptalks.css";
// import { directiveMap } from "../dist/vue-maptalks-tool";

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
Vue.directive("map", directiveMap(maptalks, mapOption));

new Vue({
  render: (h) => h(App),
}).$mount("#app");
