// @ts-check

let vueVersion = 0;

/**
 * 获取 vue 版本号
 * @param {object} appInsOrVue vue 引用或实例
 * @returns {number} vue 版本号
 */
export function getVueVersion(appInsOrVue) {
  if (appInsOrVue) {
    vueVersion = Number(appInsOrVue.version.split(".")[0]);
  }
  return vueVersion;
}
