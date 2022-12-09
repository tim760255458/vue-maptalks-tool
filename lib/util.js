// @ts-check

export function getVueVersion(appInsOrVue) {
  return Number(appInsOrVue.version.split(".")[0]);
}
