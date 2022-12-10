# vue-maptalks-tool

vue 下的 maptalks 工具函数，支持 vue2/3

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

```js
// main.js

// vue2
import Vue from 'vue'
import { bindMap } from 'vue-maptalks-tool'
bindMap(Vue)

// or vue3
import { createApp } from "vue";
import App from "./App.vue";
const app = createApp(App);
bindMap(app);
app.mount("#app");

// demo.vue
<template>
  <div id="app">
    <div style="width: 400px;height: 400px;" ref="map">
      {/* in vue3 not need v-if="mapUtil", but need template */}
      <template v-if="mapUtil">
        <MarkerInfoWindow ref="infoWindow" />
      </template>
    </div>
    <button @click="handleDraw">画图</button>
    <button @click="handleShow">显隐</button>
  </div>
</template>
<script>
import { MapUtil } from 'vue-maptalks-tool'
import MarkerInfoWindow from './MarkerInfoWindow.vue'

export default {
  components: { MarkerInfoWindow },
  data: () => ({
    mapUtil: null,
    isShow: true
  }),
  mounted() {
    this.initMap()
    this.load()
  },
  methods: {
    initMap() {
      this.mapUtil = new MapUtil(this.$mp, this.$refs.map, {
        center: [-0.113049, 51.498568],
        zoom: 14,
        baseLayer: new this.$mp.TileLayer("base", {
          urlTemplate:
            "https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}.png",
          subdomains: ["a", "b", "c", "d"]
        }),
      })
    },
    async load() {
      this.mapUtil.addLayer('VectorLayer', 'layerId1')
      const list = await new Promise((resolve, reject) => setTimeout(() => resolve([
        { name: '点位1', center: [-0.113049, 51.498568] },
        { name: '点位2', center: [-0.115049, 51.500568] },
      ]), 300))
      this.mapUtil.addGeometry(list, this.cb, 'layerId1', this.$refs.infoWindow)
    },
    cb(option) {
      return ['Marker', [option.center, {
        properties: option,
        symbol: {
          'textName': option.name,
          'textFill': '#ff0000',
        }
      }], {
          click: () => console.log('click', option.name)
        }]
    },
    async handleDraw() {
      const drawResult = await this.mapUtil.draw('LineString', {lineWidth: 3, lineColor: '#f00'})
      this.mapUtil.addGeometryIns(drawResult.geometry, 'layerId1')
    },
    handleShow() {
      this.mapUtil.toggleLayer('layerId1', this.isShow = !this.isShow)
    }
  },
};
</script>

// or use Composition API
<script setup>
import { computed, getCurrentInstance, onMounted, ref } from "vue";
import { MapUtil } from "vue-maptalks-tool";

const instance = getCurrentInstance();
const golbalObj = computed(() => instance.appContext.config.globalProperties);

const map = ref(null);
let mapUtil

const initMap = () => {
  const mp = golbalObj.value.$mp;
  mapUtil = new MapUtil(mp, map.value, {
    center: [-0.113049, 51.498568],
    zoom: 14,
    baseLayer: new mp.TileLayer("base", {
      urlTemplate:
        "https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}.png",
      subdomains: ["a", "b", "c", "d"],
    }),
  });
};

onMounted(initMap);
</script>

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
