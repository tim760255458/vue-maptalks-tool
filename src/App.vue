<template>
  <div id="app">
    <h2>使用 MapUtil</h2>
    <div style="width: 400px; height: 400px" ref="map">
      <template v-if="mapUtil">
        <MarkerInfoWindow ref="infoWindow" />
      </template>
    </div>
    <button @click="handleDraw">画图</button>
    <button @click="handleShow">显隐</button>
    <h2>使用 v-map 指令</h2>
    <div v-map style="width: 400px; height: 400px" ref="map1">
      <template v-if="mapUtil1">
        <MarkerInfoWindow ref="infoWindow2" />
      </template>
    </div>
    <button @click="handleDraw1">画图</button>
    <button @click="handleShow1">显隐</button>
  </div>
</template>
<script>
import { MapUtil } from "../lib/main";
import MarkerInfoWindow from "./components/MarkerInfoWindow.vue";

export default {
  components: { MarkerInfoWindow },
  data: (vm) => ({
    mapUtil: null,
    mapUtil1: null,
    isShow: true,
    isShow1: true,
  }),
  mounted() {
    setTimeout(() => {
      this.initMap();
      setTimeout(() => {
        this.load();
      }, 1000 * 2);
    }, 300);

    this.mapUtil1 = this.$refs?.map1?.mapUtil;
    this.load1();
  },
  methods: {
    initMap() {
      this.mapUtil = new MapUtil(this.$mp, this.$refs.map, {
        center: [-0.113049, 51.498568],
        zoom: 14,
        baseLayer: new this.$mp.TileLayer("base", {
          urlTemplate:
            "https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}.png",
          subdomains: ["a", "b", "c", "d"],
          attribution:
            '&copy; <a href="http://osm.org">OpenStreetMap</a> contributors, &copy; <a href="https://carto.com/">CARTO</a>',
        }),
      });
    },
    async load() {
      this.mapUtil.addLayer("VectorLayer", "layerId1");
      const list = await new Promise((resolve, reject) =>
        setTimeout(
          () =>
            resolve([
              { name: "点位1", center: [-0.113049, 51.498568] },
              { name: "点位2", center: [-0.115049, 51.500568] },
            ]),
          300
        )
      );
      this.mapUtil.addGeometry(
        list,
        this.cb,
        "layerId1",
        this.$refs.infoWindow
      );
    },
    cb(option) {
      return [
        "Marker",
        [
          option.center,
          {
            properties: option,
            symbol: {
              textName: option.name,
              textFill: "#ff0000",
            },
          },
        ],
        {
          click: () => console.log("click", option.name),
        },
      ];
    },
    async handleDraw() {
      const drawResult = await this.mapUtil.draw("LineString", {
        lineWidth: 3,
        lineColor: "#f00",
      });
      console.log(drawResult);
      this.mapUtil.addGeometryIns(drawResult.geometry, "layerId1");
    },
    handleShow() {
      this.mapUtil.toggleLayer("layerId1", (this.isShow = !this.isShow));
    },
    async load1() {
      this.mapUtil1.addLayer("VectorLayer", "layerId1");
      const list = await new Promise((resolve) =>
        setTimeout(
          () =>
            resolve([
              { name: "点位1", center: [-0.113049, 51.498568] },
              { name: "点位2", center: [-0.115049, 51.500568] },
            ]),
          300
        )
      );
      this.mapUtil1.addGeometry(
        list,
        this.cb,
        "layerId1",
        this.$refs.infoWindow2
      );
    },
    async handleDraw1() {
      const drawResult = await this.mapUtil1.draw("LineString", {
        lineWidth: 3,
        lineColor: "#f00",
      });
      console.log(drawResult);
      this.mapUtil1.addGeometryIns(drawResult.geometry, "layerId1");
    },
    handleShow1() {
      this.mapUtil1.toggleLayer("layerId1", (this.isShow1 = !this.isShow1));
    },
  },
};
</script>
