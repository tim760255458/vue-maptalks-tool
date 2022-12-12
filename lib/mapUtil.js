// @ts-check

import { getVueVersion } from "./util";

const vueVersion = getVueVersion();

/**
 * 地图工具类，包含常用操作，不能把工具类的实例赋值给 vue 的响应性值
 */
class MapUtil {
  /**
   * MapUtil类实例化函数
   * @param {object} maptalks - maptalks库的引用
   * @param {object} domRef - 地图要挂载的dom引用
   * @param {object} option - 地图配置
   */
  constructor(maptalks, domRef, option = {}) {
    if (!maptalks || !domRef) return;

    this.maptalks = maptalks;
    this.option = option;

    this.mapIns = null;
    this.drawTool = null;

    this.init(domRef, option);
    this.initDrawTool();
  }

  /**
   * 初始化地图
   * @param {object} domRef - 地图要挂载的dom引用
   * @param {object} option - 地图配置
   * @returns 地图实例
   */
  init(domRef, option) {
    const mapIns = new this.maptalks.Map(domRef, option);
    this.mapIns = mapIns;
    return mapIns;
  }

  /**
   * 添加图层
   * @param {string} type - layer类型
   * @param {string} id - layer id 唯一
   * @param  {...any} args - layer 需要的其它参数
   * @returns layer实例
   */
  addLayer(type, id, ...args) {
    let layer = null;
    if (this.mapIns.getLayer(id)) {
      layer = this.mapIns.getLayer(id);
    } else {
      layer = new this.maptalks[type](id, ...args);
      if (this.mapIns) {
        layer.addTo(this.mapIns);
      }
    }
    return layer;
  }

  /**
   * 设置图层显隐
   * @param {string} id - 目标图层 id
   * @param {boolean} isShow - 是否显示
   */
  toggleLayer(id, isShow) {
    if (id) {
      const fnName = isShow ? "show" : "hide";
      this.mapIns.getLayer(id)[fnName]();
    }
  }

  /**
   * 添加 geometry
   * @param {object[]} data - 要渲染的数据
   * @param {function} optionCb - 数据 -> geometry配置 的函数(函数要返回一个数组，数组值的顺序是： geometry类型、生成geometry所需的参数(数组形式)、要监听的方法(可选))
   * @param {string} targetLayer - 目标layer id
   * @param {object} infoWindowRef - infoWindow的ref
   * @returns {object[]} geometrys
   */
  addGeometry(data, optionCb, targetLayer, infoWindowRef) {
    if (!(data && optionCb)) {
      throw "addGeometry 失败：缺少 data 或 optionCb";
    }

    let infoWindowIns = null;
    const infoWindowRefLink =
      vueVersion === 3 ? infoWindowRef.value : infoWindowRef;
    if (infoWindowRefLink) {
      infoWindowIns = new this.maptalks.ui.InfoWindow(
        infoWindowRefLink.geometoryOption
      );
      infoWindowIns.setContent(infoWindowRefLink.$el);
      infoWindowRefLink.setInfoWindowCb({
        close: () => infoWindowIns.hide(),
        ins: infoWindowIns,
      });
    }

    const geometrys = data
      .map((el) => optionCb(el))
      .map(([type, args, callbacks = {}]) => {
        const geometry = new this.maptalks[type](...args);
        Object.entries(callbacks).forEach(([key, fn]) => geometry.on(key, fn));

        if (infoWindowIns) {
          geometry.on("click", () => {
            const coordinatesName =
              type === "Marker" ? "getCoordinates" : "getCenter";
            infoWindowIns.addTo(geometry).show(geometry[coordinatesName]());
            if (infoWindowRefLink.pushInfoWindowProperty) {
              infoWindowRefLink.pushInfoWindowProperty(
                geometry.getProperties()
              );
            }
          });
        }

        return geometry;
      });

    if (targetLayer) {
      this.mapIns.getLayer(targetLayer).addGeometry(geometrys);
    }

    return geometrys;
  }

  /**
   * 添加 geometry 实例
   * @param {object | object[]} geometryIns - geometry实例或实例数组
   * @param {string} targetLayer - 目标layer id
   */
  addGeometryIns(geometryIns, targetLayer) {
    if (targetLayer) {
      this.mapIns.getLayer(targetLayer).addGeometry(geometryIns);
    }
  }

  /**
   * 绘制
   * @param {string} mode - 图形类型
   * @param {object} symbolOption - drawTool.symbol 的配置参数
   * @returns {promise} promise resolve 后返回绘制的 geometry 的相关信息
   */
  draw(mode, symbolOption) {
    return new Promise((resolve) => {
      const _endCb = (params) => {
        resolve(this.getGeometryInfo(params.geometry));
        // 绘制结束后，取消对 drawend 的监听，防止重复监听报错
        this.drawTool.off("drawend", _endCb);
      };

      if (mode) {
        this.drawTool.setMode(mode);
      }
      if (symbolOption) {
        this.drawTool.setSymbol(symbolOption);
      }
      this.drawTool.on("drawend", _endCb);
      this.drawTool.enable();
    });
  }

  /**
   * 销毁
   */
  destroy() {
    this.mapIns.getLayers().map((layer) => layer.clear());
    this.mapIns.remove();
    this.mapIns = null;
  }

  /**
   * 获取 geometry 实例的相关信息
   * @param {object} geometry - geometry 实例
   * @returns {object} geometry 的相关信息，area 面积(平方千米)，length 长度(千米)
   */
  getGeometryInfo(geometry) {
    if (!geometry) return null;
    return {
      type: geometry.getType(),
      area: geometry.getArea() / 1000000,
      length: geometry.getLength() / 1000,
      center: this.maptalks.Coordinate.toNumberArrays(geometry.getCenter()),
      property: geometry.getProperties(),
      symbol: geometry.getSymbol(),
      geoJsonGeometry: geometry.toGeoJSONGeometry(),
      geoJson: geometry.toGeoJSON(),
      json: geometry.toJSON(),
      geometry: geometry,
    };
  }

  /**
   * 初始化 drawTool
   * @param {object} symbol - symbol 配置
   * @param {object} option - drawTool 配置
   */
  initDrawTool(symbol = null, option = {}) {
    const options = {
      mode: "Polygon",
      once: true,
      ...option,
    };
    if (symbol) {
      options.symbol = symbol;
    }
    this.drawTool = new this.maptalks.DrawTool(options)
      .addTo(this.mapIns)
      .disable();
  }
}

export default MapUtil;
