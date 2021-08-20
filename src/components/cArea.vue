<template>
  <g :ref="cId + 'customRow'" :id="cId + 'customRow'" class="customRow">
    <rect
      ref="customRowHidden"
      class="customRowHidden"
      fill="transparent"
    ></rect>
    <rect
      ref="beforeNow"
      class="beforeNow"
      fill="rgba(238, 238, 238, 0.6)"
    ></rect>
    <g class="rowGroup">
      <line class="rowLine" style="stroke: #e0e0e0; stroke-width: 1"></line>
      <g class="colGroup">
        <path d="" class="colBlock"></path>
        <g class="fontGroup">
          <text
            class="fontLeft"
            :fill="'#000'"
            stroke="none"
            style="
              font-size: 14px;
              text-shadow: #fff 1px 0 0, #fff 0px 1px 0, #fff -1px 0 0,
                #fff 0 -1px 0;
              text-anchor: start;
              dominant-baseline: ideographic;
            "
          ></text>
          <!--          <text class="fontCenter" :fill="'#000'" stroke="none" style="font-size: 18px; text-shadow: #fff 1px 0 0, #fff 0px 1px 0, #fff -1px 0 0, #fff 0 -1px 0; text-anchor: middle; dominant-baseline: ideographic;"></text>-->
          <text
            class="fontRight"
            :fill="'#000'"
            stroke="none"
            style="
              font-size: 14px;
              text-shadow: #fff 1px 0 0, #fff 0px 1px 0, #fff -1px 0 0,
                #fff 0 -1px 0;
              text-anchor: end;
              dominant-baseline: ideographic;
            "
          ></text>
        </g>
      </g>
    </g>
    <rect
      ref="markRect"
      class="markRect"
      :stroke-dasharray="markRect.bkDash.join(',')"
      :fill="markRect.bgColor"
      :stroke="markRect.bkColor"
    ></rect>
  </g>
</template>

<script>
import _ from "lodash";
import { selectIdByCssFilter } from "../util/util";
import { colorConfigArr } from "../json/colorConfig";
import xAxis from "./xAxis";
import { dataArr } from "../json/datas";
export default {
  name: "cArea",
  props: ["xAxis", "yAxis", "series", "refresh"],
  data() {
    return {
      // dragType: "self",
      cId: "",
      name: ["all", "start", "now", "x", "fonts", "color"],
      width: 0,
      height: 0,
      blockRadius: 3,
      rectHidden: null,
      rectMark: null,
      beforeNow: null,
      rowGroup: null,
      colGroup: null,
      oldSMult: 0,
      start: "",
      now: "",
      oldData: [],
      markRect: {
        x: 0,
        y: 0,
        bgColor: "transparent",
        bkColor: "transparent",
        bkDash: [5, 5],
      },
      colorDefault: {
        col: "#90ff96",
        unuse: "#8d9092",
        font: "#000000",
      },
      initFlag: false,
      initFuncs: [],
      errorDraw: false,
      timer: null,
      holdTimes: 1500,
      ownRefresh: [],
      seriesKey: "series",
      xmlns: "http://www.w3.org/2000/svg",
      seriesObj: {
        data: this.series,
        rowConf: {
          id: "standNo",
          value: "arr",
        },
        colConf: {
          e: ["ate", "ete"],
          s: ["ats", "ets"],
          id: "dynamicResourceId",
          labels: {
            A: {
              left: "flightNumA",
              center: "aircraftNo",
              right: "aircraftType",
            },
            D: {
              left: "aircraftType",
              center: "aircraftNo",
              right: "flightNumD",
            },
            "A|D": {
              left: "flightNumA",
              center: "aircraftNo",
              right: "flightNumD",
            },
          },
          aircraftLabel: "aircraftNo",
          strokeDasharray: [5, 5],
        },
      },
      colorTypes: {
        timeConflict: "GT-01", // 拖拽/甘特条-时间冲突
        passReg: "GT-02", // 拖拽-可用机位
        bridgeReg: "GT-03", // 拖拽-廊桥不可用
        airlineReg: "GT-04", // 拖拽-航司冲突
        attrReg: "GT-05", // 拖拽-属性冲突
        aircraftTypeReg: "GT-06", // 拖拽-机型冲突
        taskReg: "GT-07", // 拖拽-任务冲突
        routeReg: "GT-08", // 拖拽-航线冲突
        aircraftNoReg: "GT-09", // 拖拽-机号冲突
        maintStand: "GT-10", // 拖拽-机位维护
        farStand: "GT-11", // 机位-远机位
        nearStand: "GT-12", // 机位-近机位
        unuse: "GT-13", // 机位行-机位不可用
        standUsable: "GT-14", // 拖拽-机位不可用
        standPCOccupied: "GT-26", // 拖拽-父子机位占用
        vip: "GT-15", // 甘特条-vip
        disONR: "GT-16", // 甘特条-前站未起
        ONR: "GT-17", // 甘特条-前站起飞
        ARR: "GT-18", // 甘特条-本站
        DEP: "GT-19", // 甘特条-本站起飞
        aircraftOccupied: "GT-20", // 甘特条-航空器占用
        fontD: "GT-21", // 字体-国内
        fontI: "GT-22", // 字体-国际
        fontM: "GT-23", // 字体-混合
        fontR: "GT-24", // 字体-地区
        fontAircraft: "GT-25", // 字体-航空器
      },
    };
  },
  computed: {
    svgHeight() {
      let len = this.series.length
      for(let i = 0; i< this.series.length; i++){
        if(this.series[i].dataArray.length > 1) {
          len = len + this.series[i].dataArray.length - 1
        }
      }
      return len * this.yAxis.transStyle.height;
    },
    randomStr() {
      return Math.random().toString(36).substr(2, 15);
    },
    colorConfig() {
      return colorConfigArr;
    },
    topY() {
      return function (i) {
        return i * this.yAxis.transStyle.height;
      };
    },
    lineX() {
      return function (i) {
        let xAxis = this.xAxis;
        return i * (xAxis.timeSpace + xAxis.timeMultSpace * xAxis.timeSMult);
      };
    },
    margin() {
      let val = [];
      let margins = {
        top: 0,
        right: 0,
        bottom: 0,
        left: 0,
      };
      switch (val.length) {
        case 1:
          margins.top = val[0];
          margins.bottom = val[0];
          break;
        case 2:
          margins.top = val[0];
          margins.bottom = val[1];
          break;
      }
      return margins;
    },
    computedFunc() {
      if (this.initFuncs.includes("init")) {
        return ["init"];
      } else if (this.initFuncs.includes("reInit")) {
        return ["reInit"];
      } else {
        let arr = [];
        if (this.initFuncs.includes("reInitFonts")) {
          arr.push("reInitFonts");
        }
        if (this.initFuncs.includes("reInitColor")) {
          arr.push("reInitColor");
        }
        return arr;
      }
    },
    computedInOutFlag() {
      return function (obj) {
        if (obj.inOutFlag === "A|D") {
          if (obj.relateT && !obj.relateF) {
            return "A";
          } else if (obj.relateF) {
            return "D";
          }
          return "A|D";
        }
        return obj.inOutFlag;
      };
    },
  },
  created() {
    this.$set(this, "cId", this.randomStr);
    // this.refreshGantt()
  },
  watch: {
    refresh: {
      handler(val) {
        this.$set(this, "ownRefresh", _.cloneDeep(val) || []);
        if (_.intersection(this.ownRefresh, this.name).length) {
          let xAxis = this.xAxis;
          let series = this.seriesObj;
          if (!_.isEqual(series.data, this.oldData)) {
            if (xAxis.now) {
              // all
              this.$set(this, "start", xAxis.start);
              this.$set(this, "now", xAxis.now);
              this.$set(this, "oldData", series.data);
              this.oldSMult = xAxis.timeSMult;
              this.refreshGantt("all");
            }
          } else if (series.data.length && this.initFlag) {
            if (
              !_.isEqual(xAxis.timeSMult, this.oldSMult) ||
              !_.isEqual(xAxis.start.substr(0, 10), this.start.substr(0, 10))
            ) {
              // redraw
              this.oldSMult = xAxis.timeSMult;
              this.$set(this, "start", xAxis.start);
              this.refreshGantt("redraw");
            } else if (!_.isEqual(xAxis.now, this.now)) {
              // reInit
              this.$set(this, "now", xAxis.now);
              let sTime = new Date(this.start.substr(0, 16) + ":00");
              let lTime = new Date(this.now.substr(0, 16) + ":00");
              let i = (lTime.getTime() - sTime.getTime()) / xAxis.timestempUnit;
              this.$nextTick(() => {
                let w = this.lineX(i) + xAxis.boundaryGap[0];
                this.$d3.select(this.beforeNow).attr("width", w < 0 ? 0 : w);
                this.refreshGantt("reInit");
              });
            } else if (_.isEqual(val, ["fonts"])) {
              // reInitFonts
              this.refreshGantt("reInitFonts");
            } else if (_.isEqual(val, ["color"])) {
              // reInitColor
              this.refreshGantt("reInitColor");
            }
          }
        }
      },
    },
    series: {
      handler(newData) {
        console.log('yt7y',newData)
        this.$set(this.seriesObj, "data", newData);
        this.refreshGantt("all");
      },
      deep: true
    },
    seriesRef(bool) {
      let xAxis = this.xAxis;
      let series = this.seriesObj;
      if (!_.isEqual(series.data, this.oldData)) {
        if (xAxis.now) {
          // all
          this.$set(this, "start", xAxis.start);
          this.$set(this, "now", xAxis.now);
          this.$set(this, "oldData", series.data);
          this.oldSMult = xAxis.timeSMult;
          this.refreshGantt("all");
        }
      } else if (series.data.length && this.initFlag) {
        if (!_.isEqual(xAxis.now, this.now)) {
          // reInit
          this.$set(this, "now", xAxis.now);
          let sTime = new Date(this.start.substr(0, 16) + ":00");
          let lTime = new Date(this.now.substr(0, 16) + ":00");
          let i = (lTime.getTime() - sTime.getTime()) / xAxis.timestempUnit;
          this.$nextTick(() => {
            let w = this.lineX(i) + xAxis.boundaryGap[0];
            this.$d3.select(this.beforeNow).attr("width", w < 0 ? 0 : w);
            this.refreshGantt("reInit");
          });
        }
      }
    },
    colorConfig: {
      handler(config, oldConfig) {
        if (_.isEmpty(oldConfig) && !_.isEmpty(config) && this.errorDraw) {
          this.initFuncs.push("init");
          this.allInit();
          this.ownRefresh.splice(0, this.ownRefresh.length);
        }
      },
      deep: true,
    },
    "xAxis.width": {
      handler(width) {
        let xAxis = this.xAxis;
        this.$d3.select(this.rectHidden).attr("width", width);
        this.$d3
          .select(this.rectMark)
          .attr("width", width - xAxis.boundaryGap[0] - xAxis.boundaryGap[1]);
      },
    },
  },
  methods: {
    refreshGantt(flag) {
      let xAxis = this.xAxis;
      let yAxis = this.yAxis;
      let series = this.seriesObj;
      if (flag === "all") {
        if (series && (series.data || []).length) {
          this.initFuncs.push("init");
          this.startFlag = true;
          let sTime = new Date(this.start.substr(0, 16) + ":00");
          let lTime = new Date(this.now.substr(0, 16) + ":00");
          let i = (lTime.getTime() - sTime.getTime()) / xAxis.timestempUnit;
          // let height =
          //   (series.data || []).length * yAxis.transStyle.height +
          //   yAxis.boundaryGap[0];
          let height = this.svgHeight
          this.$nextTick(() => {
            this.rectHidden =
              this.$refs[this.cId + "customRow"].querySelector(
                ".customRowHidden"
              );
            this.rectMark =
              this.$refs[this.cId + "customRow"].querySelector(".markRect");
            this.beforeNow =
              this.$refs[this.cId + "customRow"].querySelector(".beforeNow");
            this.rowGroup =
              this.$refs[this.cId + "customRow"].querySelector(".rowGroup");
            this.colGroup = this.rowGroup.querySelector(".colGroup");
            this.$d3
              .select(this.rectMark)
              .attr("height", yAxis.transStyle.height)
              .attr(
                "width",
                xAxis.width - xAxis.boundaryGap[0] - xAxis.boundaryGap[1]
              );
            this.$d3
              .select(this.rectHidden)
              .attr("width", xAxis.width)
              .attr("height", height);
            let w = this.lineX(i) + xAxis.boundaryGap[0];
            this.$d3
              .select(this.beforeNow)
              .attr("transform", `translate(0, 0)`)
              .attr("width", w < 0 ? 0 : w)
              .attr("height", height);
            if (this.colorConfig.length) {
              this.allInit();
            } else {
              this.errorDraw = true;
            }
          });
        } else {
          this.$nextTick(() => {
            this.rectHidden =
              this.$refs[this.cId + "customRow"].querySelector(
                ".customRowHidden"
              );
            this.beforeNow =
              this.$refs[this.cId + "customRow"].querySelector(".beforeNow");
            this.$d3.select(this.rectHidden).attr("height", 0);
            this.$d3.select(this.beforeNow).attr("height", 0);
          });
          this.clear();
        }
      } else if (flag === "redraw") {
        if (series && (series.data || []).length) {
          this.initFuncs.push("reInit");
          let sTime = new Date(this.start.substr(0, 16) + ":00");
          let lTime = new Date(this.now.substr(0, 16) + ":00");
          let i = (lTime.getTime() - sTime.getTime()) / xAxis.timestempUnit;
          this.$nextTick(() => {
            this.$d3
              .select(this.rectMark)
              .attr("height", yAxis.transStyle.height)
              .attr(
                "width",
                xAxis.width - xAxis.boundaryGap[0] - xAxis.boundaryGap[1]
              );
            this.$d3.select(this.rectHidden).attr("width", xAxis.width);
            let w = this.lineX(i) + xAxis.boundaryGap[0];
            this.$d3
              .select(this.beforeNow)
              .attr("transform", `translate(0, 0)`)
              .attr("width", w < 0 ? 0 : w);
            this.colorConfig.length && this.allInit();
          });
        } else {
          this.$nextTick(() => {
            this.$d3.select(this.rectHidden).attr("height", 0);
            this.$d3.select(this.beforeNow).attr("height", 0);
          });
          this.clear();
        }
      } else if (flag === "reInit") {
        this.initFuncs.push("reInit");
        this.colorConfig.length && this.allInit();
      } else if (flag === "reInitFonts") {
        this.initFuncs.push("reInitFonts");
        this.colorConfig.length && this.allInit();
      } else if (flag === "reInitColor") {
        this.initFuncs.push("reInitColor");
        this.allInit();
      }
      this.ownRefresh.splice(0, this.ownRefresh.length);
    },
    allInit() {
      if (!this.timer) {
        if ((this.computedFunc || []).length) {
          console.log(
            this.seriesKey +
              " -- cusD3 -- timer -- start => " +
              this.computedFunc
          );
        } else {
          console.log(
            this.seriesKey + " -- cusD3 -- timer -- start is cleaning."
          );
        }
        if ((this.computedFunc || []).length) {
          this.computedFunc.forEach((key) => {
            this[key]();
          });
        }
        this.$set(this, "initFuncs", []);
        this.timer = setTimeout(() => {
          if ((this.computedFunc || []).length) {
            console.log(
              this.seriesKey +
                " -- cusD3 -- timer -- delay => " +
                this.computedFunc
            );
          } else {
            console.log(
              this.seriesKey + " -- cusD3 -- timer -- delay is all clear."
            );
          }
          if ((this.computedFunc || []).length) {
            this.computedFunc.forEach((key) => {
              this[key]();
            });
          }
          this.timer = null;
        }, this.holdTimes);
      } else {
        console.warn(this.seriesKey + " -- cusD3 -- " + "timering");
      }
    },
    init() {

      let xAxis = this.xAxis;
      let yAxis = this.yAxis;
      let series = this.seriesObj;
      this.clear();
      let rowGroup, colGroup, colBlock;
      let h = yAxis.transStyle.height;
      // let h  = 20
      let arrI = []
      for(let i = 0; i< series.data.length; i++){
        let newObj = {
          arr:[],
          isUseable: "",
          isBridge: "",
          standNo: "",
          terminal: "",
        }
        if(series.data[i].dataArray.length > 1) {
          let obj = series.data[i].dataArray
         for(let j=0; j < obj.length; j++){
           newObj = {
             arr:[],
             isUseable: "",
             isBridge: "",
             standNo: "",
             terminal: "",
           }
           newObj.arr = [obj[j]]
             newObj.isUseable = series.data[i].isUseable
             newObj.isBridge = series.data[i].isBridge
             newObj.standNo = series.data[i].standNo
             newObj.terminal = series.data[i].terminal
             arrI.push(newObj)

         }
        }else {
          newObj.arr = series.data[i].dataArray
          newObj.isUseable = series.data[i].isUseable
          newObj.isBridge = series.data[i].isBridge
          newObj.standNo = series.data[i].standNo
          newObj.terminal = series.data[i].terminal
          arrI.push(newObj)
        }
      }
      // let arrI = series.data || [];

      for (let i = 0; i < arrI.length; i++) {

        // let h = obj.dataArray && obj.dataArray.length> 1 ? this.yAxis.transStyle.height * obj.dataArray.length : this.yAxis.transStyle.height
        // newHeight = newHeight + h
        let topY = this.topY(i) + yAxis.boundaryGap[0];
        rowGroup = this.rowGroup.cloneNode(true);
        this.$refs[this.cId + "customRow"].appendChild(rowGroup);
        this.$d3
          .select(rowGroup)
          .attr("id", "r" + this.seriesKey + arrI[i][series.rowConf.id])
          .attr("transform", `translate(${xAxis.boundaryGap[0]}, ${topY})`)
          .attr(
            "width",
            xAxis.width - xAxis.boundaryGap[0] - xAxis.boundaryGap[1]
          )
          .attr("height", h - this.margin.top - this.margin.bottom)
          .attr("fill", "transparent")
          .attr("stroke", "#0c1070")
          .attr("stroke-width", 1);
        this.$d3
          .select(rowGroup.querySelector(".rowLine"))
          .attr("y1", h - 0.5)
          .attr("x2", xAxis.width - xAxis.boundaryGap[0] * 2 - 10)
          .attr("y2", h - 0.5);
        if (arrI[i].isUseable === "N") {
          // 机位/登机口不可用
          let floatY = 4;
          let rect = document.createElementNS(this.xmlns, "rect");
          rowGroup.appendChild(rect);
          this.$d3
            .select(rect)
            .attr("class", "unuse")
            .attr("transform", `translate(0, ${floatY})`)
            .attr(
              "width",
              xAxis.width - xAxis.boundaryGap[0] - xAxis.boundaryGap[1]
            )
            .attr("height", h - floatY * 2)
            .attr(
              "fill",
              (_.find(this.colorConfig, ["paramCode", this.colorTypes.unuse]) ||
                {})[this.colorParamValue] || this.colorDefault.unuse
            )
            .attr("stroke", "transparent");
        }
        let arrJ = arrI[i][series.rowConf.value] || [];
        if (arrJ.length) {
          for (let j = 0; j < arrJ.length; j++) {
            let s = series.colConf.s;
            let e = series.colConf.e;
            let doing = false;
            if (_.isArray(s) && _.isArray(e)) {
              let tmpS, tmpE;
              for (let sIndex = 0; sIndex < s.length; sIndex++) {
                if (_.get(arrJ[j], s[sIndex]) && _.get(arrJ[j], e[sIndex])) {
                  tmpS = s[sIndex];
                  tmpE = e[sIndex];
                  if (sIndex > 0 && _.get(arrJ[j], s[0])) {
                    // 有实际开始没有实际结束
                    doing = true;
                    tmpS = s[0];
                  }
                  break;
                }
              }
              s = tmpS;
              e = tmpE;
            }
            if (!s || !e) {
              this.showErrorCustom("配置信息有误", "请检查后重新尝试");
              console.warn("init--s和e为非正常key值");
              break;
            }
            if (_.get(arrJ[j], s) && _.get(arrJ[j], e)) {
              // 当前时间
              let now = new Date(this.now.substr(0, 16) + ":00");
              // 甘特图开始时间
              let sTime = new Date(this.start.substr(0, 16) + ":00");
              // 甘特图结束时间
              let eTime = new Date(
                sTime.getTime() + xAxis.spanning * xAxis.timestempUnit
              );
              // 甘特条开始时间
              let lTime = new Date(_.get(arrJ[j], s).substr(0, 16) + ":00");
              if (lTime < sTime) {
                lTime = sTime;
              } else if (lTime > eTime) {
                lTime = eTime;
              }

              let rTime = new Date(_.get(arrJ[j], e).substr(0, 16) + ":00");

              // if (rTime > eTime) {
              //   rTime = eTime
              // } else if (doing && rTime < now) {
              //   rTime = now
              // } else if (rTime < sTime) {
              //   rTime = sTime
              // }
              let li =
                (lTime.getTime() - sTime.getTime()) / xAxis.timestempUnit;
              let lX = this.lineX(li);
              let ri =
                (rTime.getTime() - sTime.getTime()) / xAxis.timestempUnit;
              let rX = this.lineX(ri);
              let width = rX - lX;
              // let lY = this.margin.top //  + ((j % 2) ? yAxis.offsetY : -yAxis.offsetY)
              colGroup = rowGroup.querySelector(".colGroup").cloneNode(true);
              rowGroup.appendChild(colGroup);
              colBlock = colGroup.querySelector(".colBlock");
              let clickBlock = this.clickBlock;
              this.$d3
                .select(colGroup)
                .attr(
                  "id",
                  "g" +
                    this.seriesKey +
                    (arrJ[j][series.colConf.id] || arrI[i][series.rowConf.id])
                )
                .attr("transform", `translate(${lX}, ${this.margin.top})`)
                .on("click", function () {
                  clickBlock(colBlock, arrJ[j]);
                });
              let blockH = h - 10 * 2;

              if (width < 0) {
                continue;
              }
              this.$d3
                .select(colBlock)
                .attr(
                  "id",
                  "c" +
                    this.seriesKey +
                    (arrJ[j][series.colConf.id] || arrI[i][series.rowConf.id])
                )
                // .attr('x', lX)
                // .attr('y', lY)
                // .attr('width', width)
                // .attr('height', blockH)
                .attr("fill", "transparent") // '#90ff96')
                .attr("stroke", "transparent")
                .attr("transform", "translate(0,10)");
              // .attr('stroke-width', 1)
              /* 根据状态判断添加哪些形状 */
              this.drawPath(colGroup, 0, 0, width, blockH, arrJ[j], colBlock);
              // if (arrJ[j].afid) {
              //   if (this.dragType === 'self') {
              //     let dragstartSelf = this.dragstartSelf
              //     let dragSelf = this.dragSelf
              //     let dragendSelf = this.dragendSelf
              //     let contextmenuSelf = this.contextmenuSelf
              //     let dragEvent =  this.$d3.drag()
              //       .on('start', function () {dragstartSelf(this, arrJ[j])})
              //       .on('drag', function () {dragSelf(this, arrJ[j])})
              //       .on('end', function () {dragendSelf(this, arrJ[j])})
              //     this.$d3.select(colGroup)
              //       .on('contextmenu', function () {
              //         this.$d3.event.preventDefault()
              //         contextmenuSelf(colBlock, arrJ[j])
              //       })
              //     this.selfJudge(arrJ[j]) &&  this.$d3.select(colGroup).call(dragEvent)
              //   } else if (this.dragType === 'between') {
              //     let dragstartBetween = this.dragstartBetween
              //     let dragBetween = this.dragBetween
              //     let dragendBetween = this.dragendBetween
              //     let dragEvent =  this.$d3.drag()
              //       .on('start', function () {dragstartBetween(this, arrJ[j])})
              //       .on('drag', function () {dragBetween(this, arrJ[j])})
              //       .on('end', function () {dragendBetween(this, arrJ[j])})
              //     this.betweenJudge(arrJ[j]) &&  this.$d3.select(colGroup)
              //       .call(dragEvent)
              //   }
              // }

              let fontGroup = colGroup.querySelector(".fontGroup");
              this.$d3
                .select(fontGroup)
                .attr("transform", `translate(0,  ${h / 2})`);
              // let center = fontGroup.querySelector('.fontCenter')
              // this.$d3.select(center)
              //   .attr('transform', `translate(${width / 2}, ${blockH / 2})`)
              if (arrJ[j].afid) {
                let inOutFlag = this.computedInOutFlag(arrJ[j]);
                let right = fontGroup.querySelector(".fontRight");
                let left = fontGroup.querySelector(".fontLeft");
                this.$d3
                  .select(right)
                  .text(arrJ[j].afid)
                  .attr("transform", `translate(${width - 40}, ${h / 4})`)
                  .text(_.get(arrJ[j], series.colConf.labels[inOutFlag].right));
                this.$d3
                  .select(left)
                  .text(arrJ[j].afid)
                  .attr("transform", `translate(40, ${h / 4})`)
                  .text(_.get(arrJ[j], series.colConf.labels[inOutFlag].right));
              }
            }
          }
        }
      }
      this.initFlag = true;
    },
    reInit() {
      let xAxis = this.xAxis;
      let yAxis = this.yAxis;
      let series = this.seriesObj;
      let rowGroup, colGroup, colBlock;
      let h = yAxis.transStyle.height;
      let arrI = series.data || [];
      for (let i = 0; i < arrI.length; i++) {
        let topY = this.topY(i) + yAxis.boundaryGap[0];
        rowGroup = this.$refs[this.cId + "customRow"].querySelector(
          selectIdByCssFilter(
            "#r" + this.seriesKey + arrI[i][series.rowConf.id]
          )
        );
        this.$d3
          .select(rowGroup)
          .attr("transform", `translate(${xAxis.boundaryGap[0]}, ${topY})`)
          .attr(
            "width",
            xAxis.width - xAxis.boundaryGap[0] - xAxis.boundaryGap[1]
          )
          .attr("height", h - this.margin.top - this.margin.bottom)
          .attr("fill", "transparent")
          .attr("stroke", "#0c1070")
          .attr("stroke-width", 1);
        this.$d3
          .select(rowGroup.querySelector(".rowLine"))
          .attr("y1", h - 0.5)
          .attr("x2", xAxis.width - xAxis.boundaryGap[0] - xAxis.boundaryGap[1])
          .attr("y2", h - 0.5);
        if (arrI[i].isUseable === "N") {
          // 机位/登机口不可用
          let floatY = 4;
          let rect = rowGroup.querySelector(".unuse");
          if (!rect) {
            rect = document.createElementNS(this.xmlns, "rect");
            rowGroup.appendChild(rect);
          }
          this.$d3
            .select(rect)
            .attr("transform", `translate(0, ${floatY})`)
            .attr(
              "width",
              xAxis.width - xAxis.boundaryGap[0] - xAxis.boundaryGap[1]
            )
            .attr("height", h - floatY * 2)
            .attr(
              "fill",
              (_.find(this.colorConfig, ["paramCode", this.colorTypes.unuse]) ||
                {})[this.colorParamValue] || this.colorDefault.unuse
            )
            .attr("stroke", "transparent");
        } else {
          let rect = rowGroup.querySelector(".unuse");
          if (rect) {
            rect.remove();
          }
        }
        let arrJ = arrI[i][series.rowConf.value] || [];
        if (arrJ.length) {
          for (let j = 0; j < arrJ.length; j++) {
            let s = series.colConf.s;
            let e = series.colConf.e;
            let doing = false;
            if (_.isArray(s) && _.isArray(e)) {
              let tmpS, tmpE;
              for (let sIndex = 0; sIndex < s.length; sIndex++) {
                if (_.get(arrJ[j], s[sIndex]) && _.get(arrJ[j], e[sIndex])) {
                  tmpS = s[sIndex];
                  tmpE = e[sIndex];
                  if (sIndex > 0 && _.get(arrJ[j], s[0])) {
                    // 有实际开始没有实际结束
                    doing = true;
                    tmpS = s[0];
                  }
                  break;
                }
              }
              s = tmpS;
              e = tmpE;
            }
            if (!s || !e) {
              this.showErrorCustom("配置信息有误", "请检查后重新尝试");
              console.warn("reInit--s和e为非正常key值");
              break;
            }
            if (_.get(arrJ[j], s) && _.get(arrJ[j], e)) {
              // 当前时间
              let now = new Date(this.now.substr(0, 16) + ":00");
              // 甘特图开始时间
              let sTime = new Date(this.start.substr(0, 16) + ":00");
              // 甘特图结束时间
              let eTime = new Date(
                sTime.getTime() + xAxis.spanning * xAxis.timestempUnit
              );
              // 甘特条开始时间
              let lTime = new Date(_.get(arrJ[j], s).substr(0, 16) + ":00");
              if (lTime < sTime) {
                lTime = sTime;
              } else if (lTime > eTime) {
                lTime = eTime;
              }
              let rTime = new Date(_.get(arrJ[j], e).substr(0, 16) + ":00");
              if (rTime > eTime) {
                rTime = eTime;
              } else if (doing && rTime < now) {
                rTime = now;
              } else if (rTime < sTime) {
                rTime = sTime;
              }
              let li =
                (lTime.getTime() - sTime.getTime()) / xAxis.timestempUnit;
              let lX = this.lineX(li);
              let ri =
                (rTime.getTime() - sTime.getTime()) / xAxis.timestempUnit;
              let rX = this.lineX(ri);
              let width = rX - lX;
              // let lY = this.margin.top //  + ((j % 2) ? yAxis.offsetY : -yAxis.offsetY)

              colGroup = rowGroup.querySelector(
                selectIdByCssFilter(
                  "#g" +
                    this.seriesKey +
                    (arrJ[j][series.colConf.id] || arrI[i][series.rowConf.id])
                )
              );
              if (colGroup) {
                colBlock = colGroup.querySelector(".colBlock");
                let clickBlock = this.clickBlock;
                this.$d3
                  .select(colGroup)
                  .attr(
                    "id",
                    "g" +
                      this.seriesKey +
                      (arrJ[j][series.colConf.id] || arrI[i][series.rowConf.id])
                  )
                  .attr("transform", `translate(${lX}, ${this.margin.top})`)
                  .on("click", function () {
                    clickBlock(colBlock, arrJ[j]);
                  });
                let blockH = h - this.margin.top - this.margin.bottom;
                if (width < 0) {
                  continue;
                }
                this.$d3
                  .select(colBlock)
                  .attr(
                    "id",
                    "c" +
                      this.seriesKey +
                      (arrJ[j][series.colConf.id] || arrI[i][series.rowConf.id])
                  )
                  .attr("fill", "transparent") // '#90ff96')
                  .attr("stroke", "transparent");
                // .attr('stroke-width', 1)
                /* 根据状态判断添加哪些形状 */
                let tmp = this.drawPath(
                  colGroup,
                  0,
                  0,
                  width,
                  blockH,
                  arrJ[j],
                  colBlock
                );
                let fontGroup = colGroup.querySelector(".fontGroup");
                this.$d3.select(fontGroup).attr("transform", `translate(0, 0)`);
                let center = fontGroup.querySelector(".fontCenter");
                this.$d3
                  .select(center)
                  .attr("transform", `translate(${width / 2}, ${h / 2})`);
                if (arrJ[j].afid) {
                  let inOutFlag = this.computedInOutFlag(arrJ[j]);
                  if (this.dragType === "self") {
                    let dragstartSelf = this.dragstartSelf;
                    let dragSelf = this.dragSelf;
                    let dragendSelf = this.dragendSelf;
                    let contextmenuSelf = this.contextmenuSelf;
                    let dragEvent = this.$d3
                      .drag()
                      .on("start", function () {
                        dragstartSelf(this, arrJ[j]);
                      })
                      .on("drag", function () {
                        dragSelf(this, arrJ[j]);
                      })
                      .on("end", function () {
                        dragendSelf(this, arrJ[j]);
                      });
                    let dragNoneEvent = this.$d3
                      .drag()
                      .on("start", null)
                      .on("drag", null)
                      .on("end", null);
                    this.$d3.select(colGroup).on("contextmenu", function () {
                      this.$d3.event.preventDefault();
                      contextmenuSelf(colBlock, arrJ[j]);
                    });
                    this.$d3
                      .select(colGroup)
                      .call(
                        this.selfJudge(arrJ[j]) ? dragEvent : dragNoneEvent
                      );
                  } else if (this.dragType === "between") {
                    let dragstartBetween = this.dragstartBetween;
                    let dragBetween = this.dragBetween;
                    let dragendBetween = this.dragendBetween;
                    let dragEvent = this.$d3
                      .drag()
                      .on("start", function () {
                        dragstartBetween(this, arrJ[j]);
                      })
                      .on("drag", function () {
                        dragBetween(this, arrJ[j]);
                      })
                      .on("end", function () {
                        dragendBetween(this, arrJ[j]);
                      });
                    let dragNoneEvent = this.$d3
                      .drag()
                      .on("start", null)
                      .on("drag", null)
                      .on("end", null);
                    this.$d3
                      .select(colGroup)
                      .call(
                        this.betweenJudge(arrJ[j]) ? dragEvent : dragNoneEvent
                      );
                  }
                  let left = fontGroup.querySelector(".fontLeft");
                  let right = fontGroup.querySelector(".fontRight");
                  // let fontY = h / 2 + 2 // + ((j % 2) ? yAxis.offsetY : -yAxis.offsetY)
                  let offsetFontX = 10 + (h * 2) / 5;
                  this.$d3
                    .select(left)
                    .attr("transform", `translate(${offsetFontX}, ${h / 2})`)
                    .attr(
                      "fill",
                      this.drawFont(
                        series.colConf.labels[inOutFlag].left,
                        arrJ[j]
                      )
                    );
                  this.$d3
                    .select(center)
                    .attr(
                      "fill",
                      this.drawFont(
                        series.colConf.labels[inOutFlag].center,
                        arrJ[j]
                      )
                    );
                  this.$d3
                    .select(right)
                    .attr(
                      "transform",
                      `translate(${width - offsetFontX}, ${h / 2})`
                    )
                    .attr(
                      "fill",
                      this.drawFont(
                        series.colConf.labels[inOutFlag].right,
                        arrJ[j]
                      )
                    );
                  let show = [];
                  if (
                    series.colConf.labels[inOutFlag].left &&
                    offsetFontX >= tmp.left &&
                    width - offsetFontX <= tmp.right
                  ) {
                    this.$d3
                      .select(left)
                      .text(
                        _.get(arrJ[j], series.colConf.labels[inOutFlag].left)
                      );
                    show.push("left");
                  } else {
                    this.$d3.select(left).text("");
                  }
                  if (series.colConf.labels[inOutFlag].center) {
                    this.$d3
                      .select(center)
                      .text(
                        _.get(arrJ[j], series.colConf.labels[inOutFlag].center)
                      );
                    show.push("center");
                    if (show.includes("left")) {
                      if (
                        width / 2 + center.getBBox().x <
                        offsetFontX + left.getBBox().width
                      ) {
                        this.$d3.select(left).text("");
                        _.pull(show, "left");
                      }
                    }
                    if (
                      width / 2 + center.getBBox().x < tmp.left ||
                      width / 2 + center.getBBox().x + center.getBBox().width >
                        tmp.right
                    ) {
                      this.$d3.select(center).text("");
                      _.pull(show, "center");
                    }
                  }
                  if (series.colConf.labels[inOutFlag].right) {
                    if (show.includes("center") || show.includes("left")) {
                      this.$d3
                        .select(right)
                        .text(
                          _.get(arrJ[j], series.colConf.labels[inOutFlag].right)
                        );
                      if (show.includes("center")) {
                        if (
                          width - offsetFontX + right.getBBox().x <
                          width / 2 +
                            center.getBBox().x +
                            center.getBBox().width
                        ) {
                          this.$d3.select(right).text("");
                        }
                      } else if (show.includes("left")) {
                        if (
                          width - offsetFontX + right.getBBox().x <
                          offsetFontX + left.getBBox().width
                        ) {
                          this.$d3.select(right).text("");
                        }
                      }
                    }
                  }
                } else {
                  this.$d3
                    .select(center)
                    .attr(
                      "fill",
                      (_.find(this.colorConfig, [
                        "paramCode",
                        this.colorTypes.fontAircraft,
                      ]) || {})[this.colorParamValue] || this.colorDefault.font
                    )
                    .text(_.get(arrJ[j], series.colConf.aircraftLabel));
                }
              }
            }
          }
        }
      }
    },
    reInitFonts() {
      let yAxis = this.yAxis;
      let series = this.seriesObj;
      let rowGroup, colGroup, colBlock;
      let h = yAxis.transStyle.height;
      let arrI = series.data || [];
      for (let i = 0; i < arrI.length; i++) {
        let topY = this.topY(i) + yAxis.boundaryGap[0];
        rowGroup = this.$refs[this.cId + "customRow"].querySelector(
          selectIdByCssFilter(
            "#r" + this.seriesKey + arrI[i][series.rowConf.id]
          )
        );
        let arrJ = arrI[i][series.rowConf.value] || [];
        if (arrJ.length) {
          for (let j = 0; j < arrJ.length; j++) {
            let s = series.colConf.s;
            let e = series.colConf.e;
            if (_.isArray(s) && _.isArray(e)) {
              let tmpS, tmpE;
              for (let sIndex = 0; sIndex < s.length; sIndex++) {
                if (_.get(arrJ[j], s[sIndex]) && _.get(arrJ[j], e[sIndex])) {
                  tmpS = s[sIndex];
                  tmpE = e[sIndex];
                  if (sIndex > 0 && _.get(arrJ[j], s[0])) {
                    // 有实际开始没有实际结束
                    tmpS = s[0];
                  }
                  break;
                }
              }
              s = tmpS;
              e = tmpE;
            }
            if (!s || !e) {
              this.showErrorCustom("配置信息有误", "请检查后重新尝试");
              console.warn("reInitFonts--s和e为非正常key值");
              break;
            }
            if (_.get(arrJ[j], s) && _.get(arrJ[j], e)) {
              let blockH = h - this.margin.top - this.margin.bottom;
              colGroup = rowGroup.querySelector(
                selectIdByCssFilter(
                  "#g" +
                    this.seriesKey +
                    (arrJ[j][series.colConf.id] || arrI[i][series.rowConf.id])
                )
              );
              colBlock = colGroup.querySelector(".colBlock");
              let width = colBlock.getBoundingClientRect().width;
              let tmp = this.getPadding(0, width, blockH, arrJ[j]);
              let fontGroup = colGroup.querySelector(".fontGroup");
              let center = fontGroup.querySelector(".fontCenter");
              if (arrJ[j].afid) {
                let inOutFlag = this.computedInOutFlag(arrJ[j]);
                let offsetFontX = 10 + (h * 2) / 5;
                let left = fontGroup.querySelector(".fontLeft");
                let right = fontGroup.querySelector(".fontRight");
                this.$d3
                  .select(left)
                  .attr(
                    "fill",
                    this.drawFont(
                      series.colConf.labels[inOutFlag].left,
                      arrJ[j]
                    )
                  );
                this.$d3
                  .select(center)
                  .attr(
                    "fill",
                    this.drawFont(
                      series.colConf.labels[inOutFlag].center,
                      arrJ[j]
                    )
                  );
                this.$d3
                  .select(right)
                  .attr(
                    "fill",
                    this.drawFont(
                      series.colConf.labels[inOutFlag].right,
                      arrJ[j]
                    )
                  );
                let show = [];
                if (
                  series.colConf.labels[inOutFlag].left &&
                  offsetFontX >= tmp.left &&
                  width - offsetFontX <= tmp.right
                ) {
                  this.$d3
                    .select(left)
                    .text(
                      _.get(arrJ[j], series.colConf.labels[inOutFlag].left)
                    );
                  show.push("left");
                } else {
                  this.$d3.select(left).text("");
                }
                if (series.colConf.labels[inOutFlag].center) {
                  this.$d3
                    .select(center)
                    .text(
                      _.get(arrJ[j], series.colConf.labels[inOutFlag].center)
                    );
                  show.push("center");
                  if (show.includes("left")) {
                    if (
                      width / 2 + center.getBBox().x <
                      offsetFontX + left.getBBox().width
                    ) {
                      this.$d3.select(left).text("");
                      _.pull(show, "left");
                    }
                  }
                  if (
                    width / 2 + center.getBBox().x < tmp.left ||
                    width / 2 + center.getBBox().x + center.getBBox().width >
                      tmp.right
                  ) {
                    this.$d3.select(center).text("");
                    _.pull(show, "center");
                  }
                }
                if (series.colConf.labels[inOutFlag].right) {
                  if (show.includes("center") || show.includes("left")) {
                    this.$d3
                      .select(right)
                      .text(
                        _.get(arrJ[j], series.colConf.labels[inOutFlag].right)
                      );
                    if (show.includes("center")) {
                      if (
                        width - offsetFontX + right.getBBox().x <
                        width / 2 + center.getBBox().x + center.getBBox().width
                      ) {
                        this.$d3.select(right).text("");
                      }
                    } else if (show.includes("left")) {
                      if (
                        width - offsetFontX + right.getBBox().x <
                        offsetFontX + left.getBBox().width
                      ) {
                        this.$d3.select(right).text("");
                      }
                    }
                  }
                }
              } else {
                this.$d3
                  .select(center)
                  .text(_.get(arrJ[j], series.colConf.aircraftLabel));
              }
            }
          }
        }
      }
    },
    reInitColor() {
      let yAxis = this.yAxis;
      let series = this.seriesObj;
      let rowGroup, colGroup, colBlock;
      let h = yAxis.transStyle.height;
      let arrI = series.data || [];
      for (let i = 0; i < arrI.length; i++) {
        rowGroup = this.$refs[this.cId + "customRow"].querySelector(
          selectIdByCssFilter(
            "#r" + this.seriesKey + arrI[i][series.rowConf.id]
          )
        );
        let rect = rowGroup.querySelector(".unuse");
        rect &&
          this.$d3
            .select(rect)
            .attr(
              "fill",
              (_.find(this.colorConfig, ["paramCode", this.colorTypes.unuse]) ||
                {})[this.colorParamValue] || this.colorDefault.unuse
            );
        let arrJ = arrI[i][series.rowConf.value] || [];
        if (arrJ.length) {
          for (let j = 0; j < arrJ.length; j++) {
            colGroup = rowGroup.querySelector(
              selectIdByCssFilter(
                "#g" +
                  this.seriesKey +
                  (arrJ[j][series.colConf.id] || arrI[i][series.rowConf.id])
              )
            );
            if (rowGroup) {
              colBlock = colGroup.querySelector(".colBlock");
              if (!colBlock) {
                continue;
              }
              this.$d3
                .select(colBlock)
                .attr("fill", "#90ff96") // '#90ff96')
                .attr("stroke", "#90ff96");
              /* 根据状态判断添加哪些形状 */
              this.redrawPathColor(colGroup, arrJ[j], colBlock);
              let fontGroup = colGroup.querySelector(".fontGroup");
              let left = fontGroup.querySelector(".fontLeft");
              let center = fontGroup.querySelector(".fontCenter");
              let right = fontGroup.querySelector(".fontRight");
              this.$d3.select(fontGroup).attr("transform", `translate(0, 0)`);
              this.$d3.select(center);
              if (arrJ[j].afid) {
                let inOutFlag = this.computedInOutFlag(arrJ[j]);
                let left = fontGroup.querySelector(".fontLeft");
                let right = fontGroup.querySelector(".fontRight");
                this.$d3
                  .select(left)
                  .attr(
                    "fill",
                    this.drawFont(
                      series.colConf.labels[inOutFlag].left,
                      arrJ[j]
                    )
                  );
                this.$d3
                  .select(center)
                  .attr(
                    "fill",
                    this.drawFont(
                      series.colConf.labels[inOutFlag].center,
                      arrJ[j]
                    )
                  );
                this.$d3
                  .select(right)
                  .attr(
                    "fill",
                    this.drawFont(
                      series.colConf.labels[inOutFlag].right,
                      arrJ[j]
                    )
                  );
              } else {
                this.$d3
                  .select(center)
                  .attr(
                    "fill",
                    (_.find(this.colorConfig, [
                      "paramCode",
                      this.colorTypes.fontAircraft,
                    ]) || {})[this.colorParamValue] || this.colorDefault.font
                  );
              }
            }
          }
        }
      }
    },
    clear() {
      if (this.rowGroup && this.colGroup) {
        if (
          this.$refs[this.cId + "customRow"].querySelectorAll(".rowGroup")
            .length
        ) {
          Array.from(
            this.$refs[this.cId + "customRow"].querySelectorAll(".rowGroup")
          ).forEach((child, i) => {
            i && this.$refs[this.cId + "customRow"].removeChild(child);
          });
        }
      }
    },
    getPadding(x, w, h, obj) {
      let inOutFlag = this.computedInOutFlag(obj);
      let tmp = {
        left: 0,
        right: w,
      };
      let offsetX = 6;
      let float = 10;
      let floatX = h / 4;
      let t = h / 2;
      if (!obj.afid) {
        return;
      }
      if (inOutFlag.includes("A") && obj.expressFlagA !== "Y") {
        // 左箭头<
        // 非快线
        // 单进：左箭头<
        // 一进一出：左右箭头<>
        tmp.left = x + offsetX + floatX;
      }
      if (inOutFlag.includes("D") && obj.expressFlagD !== "Y") {
        // 右箭头>
        // 非快线
        // 单出：右箭头>
        // 一进一出：左右箭头<>
        tmp.right = x + w - offsetX - floatX;
      }
      if (obj.expressFlagA === "Y" && inOutFlag.includes("A")) {
        // 左三角◁
        // 进港快线：左三角◁
        tmp.left = x + t;
      }
      if (obj.expressFlagD === "Y" && inOutFlag.includes("D")) {
        // 右三角▷
        // 出港快线：右三角▷
        tmp.right = x + w - t;
      }
      if (obj.relateF) {
        // 左三角◀
        // 分割后：箭头 + 左三角◀
        tmp.left = x + floatX + float;
      }
      if (obj.relateT) {
        // 右三角▶
        // 分割前：箭头 + 右三角▶
        tmp.right = x + w - floatX - float;
      }
      return tmp;
    },
    drawPath(colGroup, x, y, w, h, obj, colBlock) {
      let e = ["ate", "ete"];
      let s = ["ats", "ets"];
      if (_.isArray(s) && _.isArray(e)) {
        let tmpS, tmpE;
        for (let sIndex = 0; sIndex < s.length; sIndex++) {
          if (_.get(obj, s[sIndex]) && _.get(obj, e[sIndex])) {
            tmpS = s[sIndex];
            tmpE = e[sIndex];
            if (sIndex > 0 && _.get(obj, s[0])) {
              // 有实际开始没有实际结束
              tmpS = s[0];
            }
            break;
          }
        }
        s = tmpS;
        e = tmpE;
      }
      let colorArr = [
        "rgb(144, 255, 150)",
        "rgb(14, 124, 237)",
        "rgb(177, 223, 246)",
      ];
      let color = colorArr[0];

      let now = new Date(this.xAxis.now.substr(0, 16) + ":00");
      let end = new Date(_.get(obj, e).substr(0, 16) + ":00");
      let start = new Date(_.get(obj, s).substr(0, 16) + ":00");

      // N : 未占用
      // F : 已停止
      // Y : 正在运行
      if (start > now) {
        this.$set(obj, "status", "N");
        color = colorArr[1];
        // return;
      } else if (end < now) {
        this.$set(obj, "status", "F");
        color = colorArr[2];
      } else if (start < now && end > now) {
        this.$set(obj, "status", "Y");
        color = colorArr[0];
      }

      // let inOutFlag = this.computedInOutFlag(obj)
      let tmp = {
        left: 0,
        right: w,
      };
      let offsetX = 6;
      let float = 10;
      let floatY = h / 4 - 0.5;
      let floatX = h / 4;
      let t = 0;
      let radius = 3;
      let blockPath = [];
      if (!obj.afid) {
        let points = [];
        points.push(["M", x + t, y].join(" "));
        points.push(["H", x + w - t].join(" "));
        points.push(["L", x + w, y + h / 2].join(" "));
        points.push(["L", x + w - t, y + h].join(" "));
        points.push(["H", x + t].join(" "));
        points.push(["L", x, y + h / 2].join(" "));
        points.push("Z");
        /* points.push(x + t)
        points.push([y, x + w - t].join(' '))
        points.push([y, x + w].join(' '))
        points.push([y + h / 2, x + w - t].join(' '))
        points.push([y + h, x + t].join(' '))
        points.push([y + h, x].join(' '))
        points.push(y + h / 2) */

        this.$d3
          .select(colBlock)
          .attr("d", points)
          .attr("fill", color)
          .attr("stroke", color);
        return;
      }
      let colorsKey = [];
      if (obj.timeConflict === "Y") {
        colorsKey.push(
          (_.find(this.colorConfig, [
            "paramCode",
            this.colorTypes.timeConflict,
          ]) || {})[this.colorParamValue] || this.colorDefault.col
        );
      } else {
        colorsKey = this.getFlightColor(obj);
        /* if (inOutFlag.includes('A')) {
          if (obj.vipAFlag === 'Y') {
            colorsKey.push((_.find(this.colorConfig, ['paramCode', this.colorTypes.vip]) || {})[this.colorParamValue] || this.colorDefault.col)
          } else {
            if (obj.progressStatusA === null) { // 前站未起
              colorsKey.push((_.find(this.colorConfig, ['paramCode', this.colorTypes.disONR]) || {})[this.colorParamValue] || this.colorDefault.col)
            } else if (obj.progressStatusA === 'ONR') { // 前站起飞
              colorsKey.push((_.find(this.colorConfig, ['paramCode', this.colorTypes.ONR]) || {})[this.colorParamValue] || this.colorDefault.col)
            } else if (obj.progressStatusA === 'ARR') { // 本站
              colorsKey.push((_.find(this.colorConfig, ['paramCode', this.colorTypes.ARR]) || {})[this.colorParamValue] || this.colorDefault.col)
            }
          }
        }
        if (inOutFlag.includes('D')) {
          if (obj.vipDFlag === 'Y') {
            colorsKey.push((_.find(this.colorConfig, ['paramCode', this.colorTypes.vip]) || {})[this.colorParamValue] || this.colorDefault.col)
          } else {
            if (obj.progressStatusD === 'DEP') { // 起飞
              colorsKey.push((_.find(this.colorConfig, ['paramCode', this.colorTypes.DEP]) || {})[this.colorParamValue] || this.colorDefault.col)
            } else { // 本站
              colorsKey.push((_.find(this.colorConfig, ['paramCode', this.colorTypes.ARR]) || {})[this.colorParamValue] || this.colorDefault.col)
            }
          }
        } */
        if (colorsKey.length === 2 && colorsKey[0] === colorsKey[1]) {
          colorsKey.pop();
        }
      }

      if (obj.confirmedFlag === "Y") {
        // 确认：左右空白K和反向K
        let points = [];
        points.push(["M", x + t, y].join(" "));
        points.push(["H", x + w - t].join(" "));
        points.push(["L", x + w, y + h / 2].join(" "));
        points.push(["L", x + w - t, y + h].join(" "));
        points.push(["H", x + t].join(" "));
        points.push(["L", x, y + h / 2].join(" "));
        points.push("Z");
        blockPath = points;
        blockPath = points;
        this.$d3
          .select(colBlock)
          .attr("d", points)
          .attr("fill", color)
          .attr("stroke-linejoin", "round")
          .attr("rx", 0);
        let pathD = colGroup.querySelector(".fillD");
        if (colorsKey.length > 1) {
          if (!pathD) {
            pathD = document.createElementNS(this.xmlns, "path");
            colGroup.insertBefore(pathD, colBlock.nextElementSibling);
          }
          let pointsD = [];
          pointsD.push(["M", x + w / 2, y].join(" "));
          pointsD.push(["H", x + w - t].join(" "));
          pointsD.push(["L", x + w, y + h / 2].join(" "));
          pointsD.push(["L", x + w - t, y + h].join(" "));
          pointsD.push(["H", x + w / 2].join(" "));
          pointsD.push("Z");
          /* points.push(x + w / 2)
          points.push([y, x + w - t].join(' '))
          points.push([y, x + w].join(' '))
          points.push([y + h / 2, x + w - t].join(' '))
          points.push([y + h, x + w / 2].join(' '))
          points.push(y + h) */
          this.$d3
            .select(pathD)
            .attr("class", "fillD")
            .attr("d", pointsD)
            .attr("fill", color || "transparent")
            .attr("stroke", color || "transparent");
        } else {
          pathD && pathD.remove();
        }
      } else {
        let points = [];
        points.push(["M", x + radius, y].join(" "));
        points.push(["H", x + w - radius].join(" "));
        points.push(["Q", x + w, [y, x + w].join(), y + radius].join(" "));
        points.push(["V", y + h - radius].join(" "));
        points.push(
          ["Q", x + w, [y + h, x + w - radius].join(), y + h].join(" ")
        );
        points.push(["H", x + radius].join(" "));
        points.push(["Q", x, [y + h, x].join(), y + h - radius].join(" "));
        points.push(["V", y + radius].join(" "));
        points.push(["Q", x, [y, x + radius].join(), y].join(" "));
        points.push("Z");
        blockPath = points;
        this.$d3
          .select(colBlock)
          .attr("d", points)
          .attr("fill", color || "transparent")
          .attr("rx", this.blockRadius);
        let pathD = colGroup.querySelector(".fillD");
        if (colorsKey.length > 1) {
          if (!pathD) {
            pathD = document.createElementNS(this.xmlns, "path");
            colGroup.insertBefore(pathD, colBlock.nextElementSibling);
          }
          let pointsD = [];
          pointsD.push(["M", x + w / 2, y].join(" "));
          pointsD.push(["H", x + w - radius].join(" "));
          pointsD.push(["Q", x + w, [y, x + w].join(), y + radius].join(" "));
          pointsD.push(["V", y + h - radius].join(" "));
          pointsD.push(
            ["Q", x + w, [y + h, x + w - radius].join(), y + h].join(" ")
          );
          pointsD.push(["H", x + w / 2].join(" "));
          pointsD.push(["V", y].join(" "));
          pointsD.push("Z");
          this.$d3
            .select(pathD)
            .attr("class", "fillD")
            // .attr('points', `${w / 2},0 ${w},0 ${w},${h} ${w / 2},${h}`)
            .attr("d", pointsD)
            .attr("fill", color || "transparent")
            .attr("stroke", color || "transparent");
        } else {
          pathD && pathD.remove();
        }
      }
      return tmp;
    },
    drawFont(fontKey, obj) {
      let color = this.colorDefault.font;
      if (["flightNumA", "flightNumD"].includes(fontKey)) {
        color =
          (_.find(this.colorConfig, [
            "paramCode",
            this.colorTypes[
              "font" + _.get(obj, "attr" + fontKey.replace("flightNum", ""))
            ],
          ]) || {})[this.colorParamValue] || this.colorDefault.font;
      }
      return color;
    },
    redrawPathColor(colGroup, obj, colBlock) {
      let inOutFlag = this.computedInOutFlag(obj);
      if (!obj.afid) {
        this.$d3
          .select(colBlock)
          .attr(
            "fill",
            (_.find(this.colorConfig, [
              "paramCode",
              this.colorTypes.aircraftOccupied,
            ]) || {})[this.colorParamValue] || this.colorDefault.col
          );
        return;
      }
      let colorsKey = [];
      if (obj.timeConflict === "Y") {
        colorsKey.push(
          (_.find(this.colorConfig, [
            "paramCode",
            this.colorTypes.timeConflict,
          ]) || {})[this.colorParamValue] || this.colorDefault.col
        );
      } else {
        colorsKey = this.getFlightColor(obj);
        if (colorsKey.length === 2 && colorsKey[0] === colorsKey[1]) {
          colorsKey.pop();
        }
      }
      if (obj.confirmedFlag === "Y") {
        // 重叠时有问题
        // 确认：左右空白K和反向K
        this.$d3.select(colBlock).attr("fill", colorsKey[0] || "transparent");
        let pathD = colGroup.querySelector(".fillD");
        if (colorsKey.length > 1) {
          this.$d3
            .select(pathD)
            .attr("fill", colorsKey[1] || "transparent")
            .attr("stroke", colorsKey[1] || "transparent");
        }
      } else {
        this.$d3.select(colBlock).attr("fill", colorsKey[0] || "transparent");
        let pathD = colGroup.querySelector(".fillD");
        if (colorsKey.length > 1) {
          this.$d3
            .select(pathD)
            .attr("fill", colorsKey[1] || "transparent")
            .attr("stroke", colorsKey[1] || "transparent");
        }
      }
    },
    getFlightColor(obj) {
      if (this.getFlightColors) {
        return this.getFlightColors(
          obj,
          this.colorParamValue,
          this.colorDefault.col
        );
      }
      return [];
    },
    getFlightColors(obj, colorParamValue, colorDefaultCol) {
      let arr = [""];
      if (obj.progressStatusD === "DEP") {
        // 起飞
        arr[0] =
          (_.find(this.colorConfig, ["paramCode", this.colorTypes.DEP]) || {})[
            colorParamValue
          ] || colorDefaultCol;
      } else if (obj.progressStatusA === "ARR" || obj.inOutFlag === "D") {
        // 本站
        arr[0] =
          (_.find(this.colorConfig, ["paramCode", this.colorTypes.ARR]) || {})[
            colorParamValue
          ] || colorDefaultCol;
      } else if (obj.progressStatusA === "ONR") {
        // 前站起飞
        arr[0] =
          (_.find(this.colorConfig, ["paramCode", this.colorTypes.ONR]) || {})[
            colorParamValue
          ] || colorDefaultCol;
      } else {
        // 前站未起
        arr[0] =
          (_.find(this.colorConfig, ["paramCode", this.colorTypes.disONR]) ||
            {})[colorParamValue] || colorDefaultCol;
      }
      if (["A", "D"].includes(obj.inOutFlag)) {
        if (obj.vipAFlag === "Y" || obj.vipDFlag === "Y") {
          arr[0] =
            (_.find(this.colorConfig, ["paramCode", this.colorTypes.vip]) ||
              {})[colorParamValue] || colorDefaultCol;
        }
      } else {
        if (obj.vipAFlag === obj.vipDFlag) {
          if (obj.vipAFlag === "Y") {
            arr[0] =
              (_.find(this.colorConfig, ["paramCode", this.colorTypes.vip]) ||
                {})[colorParamValue] || colorDefaultCol;
          }
        } else {
          arr.push(arr[0]);
          if (obj.vipAFlag === "Y") {
            arr[0] =
              (_.find(this.colorConfig, ["paramCode", this.colorTypes.vip]) ||
                {})[colorParamValue] || colorDefaultCol;
          } else {
            arr[1] =
              (_.find(this.colorConfig, ["paramCode", this.colorTypes.vip]) ||
                {})[colorParamValue] || colorDefaultCol;
          }
        }
      }
      return arr;
    },

    clickBlock(block, obj) {
      this.$emit("clickBlock", obj);
    },
    contextmenuSelf(block, obj) {
      this.$emit("contextmenu", obj);
    },
    dragstartSelf(_this, obj) {
      let pNode = document.getElementById("ganttArea");
      let dragSvg = document.createElementNS(this.xmlns, "svg");
      let dragEl = _this.cloneNode(true);
      let cutPath = document.createElementNS(this.xmlns, "rect");
      let nodeArr = Array.from(pNode.querySelectorAll("foreignObject"));
      if (nodeArr.length) {
        let obj = nodeArr[nodeArr.length - 1];
        let box = obj.getBoundingClientRect();
        this.$d3
          .select(cutPath)
          .attr(
            "x",
            box.left -
              this.$d3.event.sourceEvent.currentTarget.getBoundingClientRect()
                .left
          )
          .attr(
            "y",
            box.top -
              this.$d3.event.sourceEvent.currentTarget.getBoundingClientRect()
                .top
          )
          .attr("width", box.width)
          .attr("height", box.height)
          .attr("fill", "transparent")
          .attr("stroke", "transparent");
      }
      let clipPath = document.createElementNS(this.xmlns, "clipPath");
      this.$d3.select(clipPath).attr("id", "cut-path");
      clipPath.appendChild(cutPath);
      dragSvg.appendChild(
        document.createElementNS(this.xmlns, "defs").appendChild(clipPath)
      );
      this.$d3.select(dragEl).attr("clip-path", "url(#cut-path)");
      dragSvg.appendChild(dragEl);
      pNode.appendChild(dragSvg);
      let box = dragEl.getBoundingClientRect();
      this.$d3
        .select(dragSvg)
        .attr("id", "dragTempSvg")
        .attr("class", "customRow")
        .attr("width", box.width)
        .attr("height", box.height)
        .attr(
          "style",
          `position: fixed; left: ${
            this.$d3.event.sourceEvent.currentTarget.getBoundingClientRect()
              .left
          }px; top: 1px; pointer-events: none;`
        );
      window.TweenMax.to("#dragTempSvg", 0, {
        y: this.$d3.event.sourceEvent.clientY,
      });
      this.$d3.select(dragEl).attr("transform", `translate(0, 0)`);
      this.$emit("selfDragstart", obj);
    },
    dragstartBetween(_this, obj) {
      let pNode = document.getElementById("ganttArea");
      let dragSvg = document.createElementNS(this.xmlns, "svg");
      let dragEl = _this.cloneNode(true);
      let cutPaths = [];
      let nodeArr = Array.from(pNode.querySelectorAll("foreignObject"));
      if (nodeArr.length) {
        nodeArr.forEach((obj, i) => {
          let box = obj.getBoundingClientRect();
          cutPaths.push(document.createElementNS(this.xmlns, "rect"));
          this.$d3
            .select(cutPaths[i])
            .attr(
              "x",
              box.left -
                this.$d3.event.sourceEvent.currentTarget.getBoundingClientRect()
                  .left
            )
            .attr(
              "y",
              box.top -
                this.$d3.event.sourceEvent.currentTarget.getBoundingClientRect()
                  .top
            )
            .attr("width", box.width)
            .attr("height", box.height)
            .attr("fill", "transparent")
            .attr("stroke", "transparent");
        });
      }
      let clipPath = document.createElementNS(this.xmlns, "clipPath");
      this.$d3.select(clipPath).attr("id", "cut-path");
      cutPaths.forEach((path) => {
        clipPath.appendChild(path);
      });
      dragSvg.appendChild(
        document.createElementNS(this.xmlns, "defs").appendChild(clipPath)
      );
      this.$d3.select(dragEl).attr("clip-path", "url(#cut-path)");
      dragSvg.appendChild(dragEl);
      pNode.appendChild(dragSvg);
      let box = dragEl.getBoundingClientRect();
      this.$d3
        .select(dragSvg)
        .attr("id", "dragTempSvg")
        .attr("class", "customRow")
        .attr("width", box.width)
        .attr("height", box.height)
        .attr(
          "style",
          `position: fixed; left: ${
            this.$d3.event.sourceEvent.currentTarget.getBoundingClientRect()
              .left
          }px; top: 1px; pointer-events: none;`
        );
      window.TweenMax.to("#dragTempSvg", 0, {
        y: this.$d3.event.sourceEvent.clientY,
      });
      this.$d3.select(dragEl).attr("transform", `translate(0, 0)`);
      this.$emit("betweenDragstart", obj);
    },
    dragSelf(_this, obj) {
      let xAxis = this.xAxis;
      let yAxis = this.yAxis;
      let series = this.seriesObj;
      window.TweenMax.to("#dragTempSvg", 0, {
        y: this.$d3.event.sourceEvent.clientY,
      });
      if (this.$d3.event.sourceEvent.path.length > 12) {
        let result = false;
        if (
          this.$d3.event.sourceEvent.target.firstElementChild &&
          this.$d3.event.sourceEvent.target.firstElementChild.id ===
            this.selfRef + "Data"
        ) {
          result = true;
        } else {
          for (let t = 0; t < this.$d3.event.sourceEvent.path.length; t++) {
            if (
              this.$d3.event.sourceEvent.path[t].id ===
              this.selfRef + "Data"
            ) {
              result = true;
              break;
            }
          }
        }
        if (result) {
          let n = Math.floor(
            (this.$d3.event.sourceEvent.offsetY - yAxis.boundaryGap[0]) /
              yAxis.transStyle.height
          );
          if (n >= 0 && n <= (series.data || []).length - 1) {
            this.$d3
              .select(this.rectMark)
              .attr("x", xAxis.boundaryGap[0])
              .attr("y", n * yAxis.transStyle.height + yAxis.boundaryGap[0])
              .attr("fill", this.rowRegColor(obj, series.data[n]));
            document.getElementById("dragTempSvg").style.visibility = "visible";
            return;
          }
        }
      }
      document.getElementById("dragTempSvg").style.visibility = "hidden";
      this.$d3.select(this.rectMark).attr("fill", this.markRect.bgColor);
    },
    dragBetween(_this, obj) {
      let yAxis = this.customYAxis || this.yAxis;
      window.TweenMax.to("#dragTempSvg", 0, {
        y: this.$d3.event.sourceEvent.clientY,
      });
      let otherThis = this.$parent.$refs[this.otherRef + "Data"];
      if (this.$d3.event.sourceEvent.path.length > 12) {
        let result = false;
        if (
          this.$d3.event.sourceEvent.target.firstElementChild &&
          this.$d3.event.sourceEvent.target.firstElementChild.id ===
            this.otherRef + "Data"
        ) {
          result = true;
        } else {
          for (let t = 0; t < this.$d3.event.sourceEvent.path.length; t++) {
            if (
              this.$d3.event.sourceEvent.path[t].id ===
              this.otherRef + "Data"
            ) {
              result = true;
              break;
            }
          }
        }
        if (result) {
          let n = Math.floor(
            (this.$d3.event.sourceEvent.offsetY -
              otherThis.yAxis.boundaryGap[0]) /
              otherThis.yAxis.transStyle.height
          );
          if (n >= 0 && n <= (otherThis.seriesObj.data || []).length - 1) {
            this.$d3
              .select(otherThis.rectMark)
              .attr("x", otherThis.xAxis.boundaryGap[0])
              .attr(
                "y",
                n * otherThis.yAxis.transStyle.height + yAxis.boundaryGap[0]
              )
              .attr(
                "fill",
                otherThis.rowRegColor(obj, otherThis.seriesObj.data[n])
              );
            document.getElementById("dragTempSvg").style.visibility = "visible";
            return;
          }
        }
      }
      this.$d3
        .select(otherThis.rectMark)
        .attr("fill", otherThis.markRect.bgColor);
      if (this.$d3.event.sourceEvent.path.length > 12) {
        let result = false;
        if (
          this.$d3.event.sourceEvent.target.firstElementChild &&
          this.$d3.event.sourceEvent.target.firstElementChild.id ===
            this.selfRef + "Data"
        ) {
          result = true;
        } else {
          for (let t = 0; t < this.$d3.event.sourceEvent.path.length; t++) {
            if (
              this.$d3.event.sourceEvent.path[t].id ===
              this.selfRef + "Data"
            ) {
              result = true;
              break;
            }
          }
        }
        if (result) {
          document.getElementById("dragTempSvg").style.visibility = "visible";
          return;
        }
      }
      document.getElementById("dragTempSvg").style.visibility = "hidden";
    },
    dragendSelf(_this, obj) {
      let yAxis = this.yAxis;
      let series = this.seriesObj;
      let dragSvg = document.getElementById("dragTempSvg");
      dragSvg && dragSvg.remove();
      if (this.$d3.event.sourceEvent.path.length > 12) {
        let result = false;
        if (
          this.$d3.event.sourceEvent.target.firstElementChild &&
          this.$d3.event.sourceEvent.target.firstElementChild.id ===
            this.selfRef + "Data"
        ) {
          result = true;
        } else {
          for (let t = 0; t < this.$d3.event.sourceEvent.path.length; t++) {
            if (
              this.$d3.event.sourceEvent.path[t].id ===
              this.selfRef + "Data"
            ) {
              result = true;
              break;
            }
          }
        }
        if (result) {
          let n = Math.floor(
            (this.$d3.event.sourceEvent.offsetY - yAxis.boundaryGap[0]) /
              yAxis.transStyle.height
          );
          if (n >= 0 && n <= (series.data || []).length - 1) {
            this.$d3.select(this.rectMark).attr("fill", this.markRect.bgColor);
            this.$emit("selfDrag", obj, series.data[n]);
            return;
          }
        }
      }
      this.$d3.select(this.rectMark).attr("fill", this.markRect.bgColor);
    },
    dragendBetween(_this, obj) {
      let dragSvg = document.getElementById("dragTempSvg");
      dragSvg && dragSvg.remove();
      let otherThis = this.$parent.$refs[this.otherRef + "Data"];
      if (this.$d3.event.sourceEvent.path.length > 12) {
        let result = false;
        if (
          this.$d3.event.sourceEvent.target.firstElementChild &&
          this.$d3.event.sourceEvent.target.firstElementChild.id ===
            this.otherRef + "Data"
        ) {
          result = true;
        } else {
          for (let t = 0; t < this.$d3.event.sourceEvent.path.length; t++) {
            if (
              this.$d3.event.sourceEvent.path[t].id ===
              this.otherRef + "Data"
            ) {
              result = true;
              break;
            }
          }
        }
        if (result) {
          let n = Math.floor(
            (this.$d3.event.sourceEvent.offsetY -
              otherThis.yAxis.boundaryGap[0]) /
              otherThis.yAxis.transStyle.height
          );
          if (n >= 0 && n <= (otherObj.data || []).length - 1) {
            this.$d3
              .select(otherThis.rectMark)
              .attr("fill", otherThis.markRect.bgColor);
            this.$emit("betweenDrag", obj, otherThis.seriesObj.data[n]);
            return;
          }
        }
      }
      this.$d3
        .select(otherThis.rectMark)
        .attr("fill", otherThis.markRect.bgColor);
    },
    format(info, func) {
      let o = info || "";
      if (func) {
        o = func(o);
      }
      return _.isUndefined(o) || _.isNull(o) ? "" : o;
    },
  },
};
</script>

<style lang="scss">
.customRow {
  .customRowHidden {
    pointer-events: none;
  }
  .beforeNow {
    pointer-events: none;
  }
  .rowGroup {
    .rowLine {
      stroke: #e0e0e0;
      stroke-width: 1;
    }
  }
  .markRect {
    pointer-events: none;
  }
}
</style>

<style lang="scss">
.customRow {
  .colGroup {
    cursor: pointer;
    .colBlock {
      fill-rule: evenodd;
    }
  }
  .fontGroup {
    .fontLeft {
      font-size: 18px;
      text-shadow: #fff 1px 0 0, #fff 0px 1px 0, #fff -1px 0 0, #fff 0 -1px 0;
      text-anchor: start;
      dominant-baseline: ideographic;
    }
    .fontCenter {
      font-size: 18px;
      text-shadow: #fff 1px 0 0, #fff 0px 1px 0, #fff -1px 0 0, #fff 0 -1px 0;
      text-anchor: middle;
      dominant-baseline: ideographic;
    }
    .fontRight {
      font-size: 18px;
      text-shadow: #fff 1px 0 0, #fff 0px 1px 0, #fff -1px 0 0, #fff 0 -1px 0;
      text-anchor: end;
      dominant-baseline: ideographic;
    }
  }
}
</style>
