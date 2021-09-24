// ie polyfill
import '@babel/polyfill'

import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store/'
import { VueAxios } from './utils/request'

// mock
// import './mock'

import bootstrap from './core/bootstrap'
// Lazy
// import './core/lazy_use'

// Non Lazy
import './core/use'
import './permission' // permission control
import './utils/filter' // global filter
import i18n from './locales'
import { config } from '@/config/defaultSettings'

if (config.production) {
  Vue.config.devtools = false
  Vue.config.productionTip = false
} else {
  Vue.config.devtools = true
  Vue.config.productionTip = true
}

import VueShepherd from 'vue-shepherd'
Vue.use(VueShepherd)

// mount axios Vue.$http and this.$http
Vue.use(VueAxios)

new Vue({
  router,
  store,
  i18n,
  created: bootstrap,
  render: h => h(App)
}).$mount('#app')
