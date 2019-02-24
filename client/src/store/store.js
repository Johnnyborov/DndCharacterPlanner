import Vue from 'vue'
import Vuex from 'vuex'
import characterConfig from './modules/characterConfig.js'
import stats from './modules/stats.js'

Vue.use(Vuex)

const debug= process.env.NODE_ENV !=='production'

export default new Vuex.Store({
  strict: debug,
  modules: {
    characterConfig,
    stats
  }
})
