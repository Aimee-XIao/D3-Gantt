<template>
  <div class="body">
    <div class="leftBox">
      <gnattIndex @flight="flightMsg" />
    </div>
    <div class="rightBox">
      <Flight :propData="initFlight"></Flight>
    </div>
  </div>
</template>

<script>
import gantt from "./ganttIndex";
import Flight from "./flightMsg";
import moment from "moment-mini";
import Dgantt from "./d3-gantt";
import gnattIndex from "./gantt-index";
import example from "./example";
export default {
  data() {
    return {
      initData: "",
      /* 甘特图页面布局 */
      style: {
        menuHeight: 34,
        contentHeight: 0,
        leftWidth: 2000,
        rightWidth: 300,
        topHeight: 400,
        bottomHeight: 400,
        cardMargin: 8,
      },
      firstQuery: true,
      xConf: {
        timeSection: [0.5, 10],
      },
      highlight: {
        style: "filter: url(#box-shadow-seriesKey);",
        position: {
          visible: false,
          count: -1,
          value: "",
        },
        data: [],
      },
      initFlight: {
        title: "航班详情",
        flgMsg: {
          flightNo: "",
          lugNo: "",
          sta: "",
          ata: "",
          eta: "",
          operationTime: "3",
          line: "",
        },
      },
    };
  },
  components: { gantt, Flight, Dgantt, gnattIndex, example },
  methods: {
    flightMsg(e) {
      this.initFlight = {
        title: "航班详情",
        flgMsg: {
          flightNo: e.flightNumD,
          lugNo: e.dynamicResourceNo,
          sta: e.ets ? moment(e.ets).format("YYYY-MM-DD HH:mm"): '',
          ata: e.ete ? moment(e.ete).format("YYYY-MM-DD HH:mm") : '',
          eta: e.ete? moment(e.ete).format("YYYY-MM-DD HH:mm"): '',
          line: e.status? ( e.status == "F" ? "已停止运行" : "正在运行"): '',
        },
      };
    },
  },
};
</script>

<style lang="scss">
@import "@/style/custom/var.global";
@import "@/style/gantt";
.body {
  width: 100%;
  height: 100vh;
  padding: 20px 20px !important;
  box-sizing: border-box;
  background-image: url("../assets/bg.jpg");
  text-align: center;
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  p {
    padding: 0;
    margin: 0;
  }
  .leftBox {
    width: 1564px;
    height: 100%;
    background-color: #fff;
    border-radius: 12px;
    //padding: 15px;
    box-sizing: border-box;
  }
  .rightBox {
    flex: 1;
    height: 100%;
    background-color: #fff;
    margin-left: 10px;
    border-radius: 12px;
  }
}
</style>
