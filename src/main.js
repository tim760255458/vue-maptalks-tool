import Vue from 'vue'
import App from './App.vue'
import { bindMap } from '../lib/main'

bindMap(Vue)

new Vue({
  render: (h) => h(App)
}).$mount('#app')