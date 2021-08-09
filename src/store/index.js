import Vue from "vue";
import Vuex from "vuex";
import ganttStore from './modules/gantt'
Vue.use(Vuex);

export default new Vuex.Store({
  modules: {
    gantt: ganttStore,
  },
});
