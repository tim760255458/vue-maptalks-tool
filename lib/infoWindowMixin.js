// @ts-check

export default {
  props: {
    // 自定义 infowindow 配置
    option: {
      type: Object,
      default: () => ({}),
    },
  },
  computed: {
    // 用于配置 infoWindow
    geometoryOption() {
      return {
        custom: true,
        ...this.option,
      };
    },
  },
  data: () => ({
    geometryData: {},
    cbs: {},
  }),
  methods: {
    /**
     * 将 geometry 的 property 数据暴露出来
     * @param {object} obj geometry 的 property
     */
    pushInfoWindowProperty(obj) {
      this.geometryData = obj;
    },
    /**
     * 用于把 infowindow 的实例和相关函数暴露出来
     * @returns 包含 ins（infowindow实例）, close（关闭infowindow函数） 的对象
     */
    setInfoWindowCb(obj) {
      this.cbs = obj;
    },
    /**
     * 这种方式才能正确调用close函数
     */
    closeInfoWindow() {
      this.cbs.close();
    },
  },
};
