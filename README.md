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

import { createApp } from "vue";
import * as maptalks from "maptalks";
import "maptalks/dist/maptalks.css";
import { directiveMap } from "vue3-maptalks-tool";

const mapOption = {
  center: [-0.113049, 51.498568],
  zoom: 14,
  baseLayer: new maptalks.TileLayer("base", {
    urlTemplate: "https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}.png",
    subdomains: ["a", "b", "c", "d"],
  }),
};
const app = createApp(App);
app.directive("map", directiveMap(maptalks, mapOption));
app.mount("#app");
```

</details>

<details>
<summary>vue3 demo</summary>

```js
<script setup>
import { onMounted, ref } from "vue";
import MarkerInfoWindow from "./MarkerInfoWindow.vue";

const mapRef = ref();
let mapUtil = null;
const isShow = ref(true);

const loadData = async () => {
  mapUtil.addLayer("VectorLayer", "layerId1");
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
  mapUtil.addGeometry(list, cb, "layerId1", MarkerInfoWindow);
};
const cb = (option) => [
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

const handleDraw = async () => {
  const drawResult = await mapUtil.draw("LineString", {
    lineWidth: 3,
    lineColor: "#f00",
  });
  console.log(drawResult);
  mapUtil.addGeometryIns(drawResult.geometry, "layerId1");
};

const handleShow = () =>
  mapUtil.toggleLayer("layerId1", (isShow.value = !isShow.value));

onMounted(() => {
  mapUtil = mapRef.value.mapUtil;
  loadData();
});
</script>
<template>
  <div v-map class="map" ref="mapRef"></div>
  <div>
    <button @click="handleDraw">画图</button>
    <button @click="handleShow">显隐</button>
  </div>
</template>

// MarkerInfoWindow.vue
<script setup>
const props = defineProps({
  name: String,
  closeInfoWindow: Function,
});
const geometoryOption = {
  custom: true,
  single: false,
};
defineExpose({ geometoryOption });
</script>
<template>
  <div>
    <span>{{ name }}</span>
    <button @click="closeInfoWindow">关闭</button>
  </div>
</template>

```

</details>
