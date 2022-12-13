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

import Vue from 'vue'
import * as maptalks from "maptalks"
import "maptalks/dist/maptalks.css"
import { directiveMap } from 'vue-maptalks-tool'

const mapOption = {
  center: [-0.113049, 51.498568],
  zoom: 14,
  baseLayer: ...
}
Vue.directive("map", directiveMap(Vue, maptalks, mapOption))
// or in vue3
// app.directive("map", directiveMap(app, maptalks, mapOption))


// demo.vue
<template>
  <div v-map ref="map">
    <template v-if="mapUtil">
      <MarkerInfoWindow ref="infoWindow" />
    </template>
  </div>
</template>
<script>
import MarkerInfoWindow from './MarkerInfoWindow.vue'

export default {
  components: { MarkerInfoWindow },
  data: () => ({
    mapUtil: null,
    isShow: true
  }),
  mounted() {
    this.mapUtil = this.$refs?.map?.mapUtil;
    this.load();
  },
  methods: {
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
