// @ts-check

let vueVersion = 0;
export function getVueVersion(appInsOrVue) {
  if (appInsOrVue) {
    vueVersion = Number(appInsOrVue.version.split(".")[0]);
  }
  return vueVersion;
}
