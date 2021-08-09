import Vue from "vue";
import App from "./App.vue";
import router from "./router";
import store from "./store";


import YtDesign from 'yt-design-vue'
import 'yt-design-vue/dist/yt.css'

import * as echarts from 'echarts'
Vue.prototype.$echarts = echarts

Vue.use(YtDesign)

Vue.config.productionTip = false;
import { removePending, axiosReq, axiosReqStat, axiosReqAiis, axiosReqMqtt, axiosNoneReq, axiosOtherReq, axiosDfs, upload, uploadAiis } from './conf/axios.conf'
import * as d3 from 'd3'
Vue.prototype.$d3 = d3
Vue.config.productionTip = false
Vue.prototype.removePending = removePending
Vue.prototype.axios = axiosReq
Vue.prototype.axiosStat = axiosReqStat
Vue.prototype.axiosAiis = axiosReqAiis
Vue.prototype.axiosMqtt = axiosReqMqtt
Vue.prototype.axiosNone = axiosNoneReq
Vue.prototype.axiosOther = axiosOtherReq
Vue.prototype.dfs = axiosDfs
Vue.prototype.axiosUpload = upload
Vue.prototype.axiosUploadAiis = uploadAiis
new Vue({
  router,
  store,
  render: (h) => h(App),
}).$mount("#app");
