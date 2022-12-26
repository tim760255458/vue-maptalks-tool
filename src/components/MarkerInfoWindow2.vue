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
};
</script>
<template>
  <div :data-option="JSON.stringify(geometoryOption)">
    <!-- geometryData 为 geometry property 的值 -->
    {{ name }}
    <button @click="closeInfoWindow">关闭</button>
  </div>
</template>
