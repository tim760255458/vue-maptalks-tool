# vue-maptalks-tool

vue 下的 maptalks 工具函数，支持 vue2/3

## 安装

```shell
npm install vue-maptalks-tool
```

## docs

```js
// clone this project
git clone ...project url

// install packages
yarn

// generate docs, will create /docs
yarn doc

// then open /docs/index.html on browser
```

## 使用

```js
// main.js

// vue2
import Vue from 'vue'

// or vue3
import * as Vue from 'vue'

import { bindMap } from 'vue-maptalks-tool'

// 如果 maptalks 是作为 npm 依赖引入的，使用这个方式将 maptalks 绑定到 vue
// 如果 maptalks 不是作为依赖引入的，忽略这行，在初始化 MapUtil 时，传入 maptalks 引用即可
bindMap(Vue)

// demo.vue
<template>
  <div id="app">
    <div style="width: 400px;height: 400px;" ref="map">
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
    setTimeout(() => {
      this.initMap()
      setTimeout(() => {
        this.load()
      }, 1000 * 2);
    }, 300);
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
