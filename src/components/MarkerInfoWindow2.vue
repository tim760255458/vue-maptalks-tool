<script>
export default {
  props: {
    name: String,
    closeInfoWindow: Function,
  },
  data: () => ({
    infowindowOption: {
      custom: true,
      single: false,
    },
  }),
};
</script>
<template>
  <div>
    <!-- geometryData 为 geometry property 的值 -->
    {{ name }}
    <button @click="closeInfoWindow">关闭</button>
  </div>
</template>
