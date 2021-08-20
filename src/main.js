import Vue from "vue";
import App from "./App.vue";
import router from "./router";



import YtDesign from 'yt-design-vue'
import 'yt-design-vue/dist/yt.css'

import * as echarts from 'echarts'
Vue.prototype.$echarts = echarts

Vue.use(YtDesign)

Vue.config.productionTip = false;

import * as d3 from 'd3'
Vue.prototype.$d3 = d3

new Vue({
  router,
  render: (h) => h(App),
}).$mount("#app");
