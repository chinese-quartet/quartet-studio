// ie polyfill
import '@babel/polyfill'

import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store/'
import { VueAxios } from './utils/request'

import * as Sentry from "@sentry/vue";
import { Integrations } from "@sentry/tracing";

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

Sentry.init({
  Vue,
  dsn: "https://7c09f78e46084fc1b0fd4b70b332a2e4@o143851.ingest.sentry.io/6093286",
  integrations: [
    new Integrations.BrowserTracing({
      routingInstrumentation: Sentry.vueRouterInstrumentation(router),
      tracingOrigins: ["localhost", "chinese-quartet.org", /^\//],
    }),
  ],
  // Set tracesSampleRate to 1.0 to capture 100%
  // of transactions for performance monitoring.
  // We recommend adjusting this value in production
  tracesSampleRate: 1.0,
});

new Vue({
  router,
  store,
  i18n,
  created: bootstrap,
  render: h => h(App)
}).$mount('#app')
