<!-- 使用 infoWindowMixin 将组件放在地图 infowindow 里 -->
<script>
import {infoWindowMixin} from '../../lib/main'

export default {
  mixins: [infoWindowMixin],
  data: () => ({})
}
</script>
<template>
  <div>
    <!-- geometryData 为 geometry property 的值 -->
    {{geometryData.name}}
    <button @click="closeInfoWindow">关闭</button>
  </div>
</template>