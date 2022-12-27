# vue-maptalks-tool

vue2 下的 maptalks 工具函数

## 安装

```js
// npm
npm install vue-maptalks-tool

// yarn
yarn add vue-maptalks-tool

// pnpm
pnpm install vue-maptalks-tool
```

## docs

[api doc](https://tim760255458.github.io/vue-maptalks-tool/index.html)

## 使用

<details>
<summary>main.js</summary>

```js
// main.js

import Vue from "vue";
import * as maptalks from "maptalks";
import "maptalks/dist/maptalks.css";
import { directiveMap } from "vue-maptalks-tool";

const mapOption = {
  center: [-0.113049, 51.498568],
  zoom: 14,
  baseLayer: new maptalks.TileLayer("base", {
    urlTemplate: "https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}.png",
    subdomains: ["a", "b", "c", "d"],
  }),
};
Vue.directive("map", directiveMap(maptalks, mapOption));
```

</details>

<details>
<summary>vue2 demo</summary>

```js
<template>
  <div id="app">
    <div v-map ref="map"></div>
    <button @click="handleDraw1">画图</button>
    <button @click="handleShow1">显隐</button>
  </div>
</template>
<script>
import MarkerInfoWindow from "./MarkerInfoWindow.vue";

export default {
  data: (vm) => ({
    mapUtil1: null,
    isShow1: true,
  }),
  mounted() {
    this.mapUtil1 = this.$refs?.map?.mapUtil;
    this.load1();
  },
  methods: {
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
    load1() {
      this.mapUtil1.addLayer("VectorLayer", "layerId1");
      const list = [
        { name: "点位1", center: [-0.113049, 51.498568] },
        { name: "点位2", center: [-0.115049, 51.500568] },
      ]
      this.mapUtil1.addGeometry(
        list,
        this.cb,
        "layerId1",
        MarkerInfoWindow
      );
    },
    async handleDraw1() {
      const drawResult = await this.mapUtil1.draw("LineString", {
        lineWidth: 3,
        lineColor: "#f00",
      });
      this.mapUtil1.addGeometryIns(drawResult.geometry, "layerId1");
    },
    handleShow1() {
      this.mapUtil1.toggleLayer("layerId1", (this.isShow1 = !this.isShow1));
    },
  },
};
</script>

// MarkerInfoWindow.vue
<script>
export default {
  props: {
    name: String,
    closeInfoWindow: Function,
  },
  data: () => ({
    geometoryOption: {
      custom: true,
      single: false,
    },
  }),
}
</script>
<template>
  <div>
    {{ name }}
    <button @click="closeInfoWindow">关闭</button>
  </div>
</template>

```

</details>
