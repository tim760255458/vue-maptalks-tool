<script>
export default {
  props: {
    name: String,
  },
  data: () => ({
    geometoryOption: {
      custom: true,
    },
  }),
  methods: {
    handleClose() {
      this.closeInfoWindow();
    },
  },
};
</script>
<template>
  <div>
    <!-- geometryData 为 geometry property 的值 -->
    {{ name }}
    <button @click="handleClose">关闭</button>
  </div>
</template>
