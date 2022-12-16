import Vue from 'vue'
import VueX from 'vuex'
import state from './state.js'
import mutations from './mutations.js'
import actions from './actions.js'


Vue.use(VueX)

export default new VueX.Store({
  state,
  actions,
  mutations
})