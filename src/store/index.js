import Vue from 'vue'
import Vuex from 'vuex'

import app from './modules/app'
import user from './modules/user'
import workflow from './modules/workflow'
import report from './modules/report'
import project from './modules/project'
import notification from './modules/notification'
import choppyApp from './modules/choppy_app'
import fs from './modules/fs'
import data from './modules/data_commons'
import materials from './modules/materials'
import i18n from './modules/i18n'
import permission from './modules/permission'
import getters from './getters'

Vue.use(Vuex)
Vue.config.devtools = true

export default new Vuex.Store({
  modules: {
    app,
    user,
    workflow,
    report,
    project,
    notification,
    choppyApp,
    fs,
    materials,
    data,
    i18n,
    permission
  },
  state: {},
  mutations: {},
  actions: {},
  getters
})