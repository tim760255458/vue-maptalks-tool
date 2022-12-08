import * as Vue from 'vue'

export function getVueVersion() {
  return Number(Vue.version.split('.')[0])
}