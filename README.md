# vue3-maptalks-tool

vue3 下的 maptalks 工具函数

## 安装

```js
// npm
npm install vue3-maptalks-tool

// yarn
yarn add vue3-maptalks-tool

// pnpm
pnpm install vue3-maptalks-tool
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
Vue.directive("map", directiveMap(Vue, maptalks, mapOption));
// or in vue3
// app.directive("map", directiveMap(app, maptalks, mapOption))
```

</details>

<details>
<summary>vue2 demo</summary>

```js
<template>
  <div id="app">
    <button @click="handleDraw1">画图</button>
    <button @click="handleShow1">显隐</button>
    <div v-map ref="map1">
      <template v-if="mapUtil1">
        <MarkerInfoWindow ref="infoWindow2" />
      </template>
    </div>
  </div>
</template>
<script>
import MarkerInfoWindow from "./MarkerInfoWindow.vue";

export default {
  components: { MarkerInfoWindow },
  data: (vm) => ({
    mapUtil1: null,
    isShow1: true,
  }),
  mounted() {
    this.mapUtil1 = this.$refs?.map1?.mapUtil;
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
      this.mapUtil1.addGeometryIns(drawResult.geometry, "layerId1");
    },
    handleShow1() {
      this.mapUtil1.toggleLayer("layerId1", (this.isShow1 = !this.isShow1));
    },
  },
};
</script>
<style>
html,
body,
#app {
  height: 100%;
}
body {
  margin: 0;
}

#app {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 10px;
}
.panel-item h2 {
  height: 40px;
  line-height: 40px;
  margin: 0;
}
.panel-item > div {
  width: 100%;
  height: calc(100% - 40px);
}
</style>

// MarkerInfoWindow.vue
// 使用 infoWindowMixin 将组件放在地图 infowindow 里
<script>
import {infoWindowMixin} from 'vue-maptalks-tool'

export default {
  mixins: [infoWindowMixin],
}
</script>
<template>
  <div>
    <!-- geometryData 为 geometry property 的值 -->
    {{geometryData.name}}
    <button @click="closeInfoWindow">关闭</button>
  </div>
</template>

```

</details>
<details>
<summary>vue3 demo</summary>

```js
<script setup>
import { computed, getCurrentInstance, onMounted, ref } from "vue";
import MarkerInfoWindow2Vue from "./MarkerInfoWindow2.vue";

const map2 = ref(null);
const infoWindow2 = ref(null);
const mapUtilIns = computed(() => map2.value.mapUtil);
const load2 = async () => {
  const list = await new Promise((resolve, reject) =>
    setTimeout(
      () =>
        resolve([
          { name: "点位1", center: [-0.113049, 51.498568] },
          { name: "点位2", center: [-0.115049, 51.500568] },
        ]),
      3000
    )
  );
  mapUtilIns.value.addLayer("VectorLayer", "layerId1");
  mapUtilIns.value.addGeometry(list, cb, "layerId1", infoWindow2);
};
const handleDraw2 = async () => {
  const drawResult = await mapUtilIns.value.draw("LineString", {
    lineWidth: 3,
    lineColor: "#f00",
  });
  mapUtilIns.value.addGeometryIns(drawResult.geometry, "layerId1");
};
const handleShow2 = () =>
  mapUtilIns.value.toggleLayer("layerId1", (isShow.value = !isShow.value));

onMounted(() => {
  load2();
});
</script>

<template>
  <div v-map ref="map2" style="width: 400px; height: 400px">
    <template>
      <MarkerInfoWindow2Vue ref="infoWindow2" />
    </template>
  </div>
  <button @click="handleDraw2">画图</button>
  <button @click="handleShow2">显隐</button>
</template>
```

</details>
