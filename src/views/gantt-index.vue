<template>
  <div class="bottom svg-scroll" style="height: 100%">
    <div style="display: flex; justify-content: center; align-items: center;margin-top: 10px;">
      <p style=" margin-right: 20px;">图例</p>
      <p style=" margin-right: 20px;"><p style="width: 20px;
    height: 10px;
    background: rgb(177, 223, 246);margin-right: 10px;"></p>已停止运行 </p>
      <p style=" margin-right: 20px;">  <p style="width: 20px;
    height: 10px;
    background: rgb(144, 255, 150);margin-right: 10px;"></p>正在运行</p>
      <p style=" margin-right: 20px;">  <p style="width: 20px;
    height: 10px;
    background: rgb(14, 124, 237);margin-right: 10px;"></p>待运行</p>
      <p style=" margin-right: 20px;">  <p style="width: 20px; height: 10px; background:rgba(245,3,3,0.6);margin-right: 10px;"></p>时间冲突</p>
    </div>
    <p  style="
        position: absolute;
        top: 10px;
        left: 40px;
        z-index: 3;
      ">当前时间为：{{xAxis.now}} </p>
    <div class="btn">
      缩放
      <y-button :disabled="xAxis.timeSpace==3" type="primary" class="add-box" @click="add">+</y-button>
      <y-button :disabled="xAxis.timeSpace==0.5" class="add-box" @click="reduce">-</y-button>
    </div>
    <y-select
      v-model="terminal"
      placeholder="请选择"
      style="
        width: 130px;
        position: absolute;
        top: 40px;
        left: 40px;
        z-index: 3;
      "
      allowClear
      @change="handleChange"
    >
      <y-select-option v-for="(item, index) in terminalArr" :value="item.id">{{
        item.label
      }}</y-select-option>
    </y-select>
    <svg
      :style="{ left: pStyle.carkMargin + 'px', top: pStyle.carkMargin + 'px' }"
      :width="computeLeftWidth - 2 * pStyle.cardMargin"
      :height="computeLeftBottomHeight - 2 * pStyle.cardMargin"
      baseProfile="full"
      class="svg-whole"
    >
      <defs>
        <filter id="box-shadow-series">
          <feDropShadow
            dx="0"
            dy="0"
            stdDeviation="10"
            flood-color="#ff0000"
          ></feDropShadow>
        </filter>
      </defs>
      <!--内容区域-->
      <foreignObject
        :x="xAxis.left"
        :y="yAxis.top"
        :width="computeLeftWidth - xAxis.left - 2 * pStyle.cardMargin"
        :height="computeLeftBottomHeight - yAxis.top - 2 * pStyle.cardMargin"
      >
        <div ref="svgBottomContent" class="svg-scroll">
          <svg :width="xAxis.width" :height="svgHeight">
            <mArea
              @clickBlock="clickBlock"
              :selfRef="'svgBottom'"
              ref="svgBottomData"
              id="svgBottomData"
              :refresh="refresh"
              :xAxis="xAxis"
              :yAxis="yAxis"
              :series="dataArrs"
            ></mArea>
          </svg>
        </div>
      </foreignObject>
      <!--坐标 x-->
      <svg :x="xAxis.left">
        <xAxis
          ref="xAxisBottom"
          id="xAxisBottom"
          :xAxis="xAxis"
          :refresh="refresh"
        ></xAxis>
        <g ref="markLineBottom" class="markLine" transform="translate(-10, 0)">
          <line
            class="mark-line"
            :y1="markLineBottom.y"
            :y2="markLineBottom.y + markLineBottom.height"
            :stroke="markLineBottom.color"
          ></line>
          <text class="mark-line-font" />
        </g>
      </svg>
      <!--坐标 y-->
      <svg :y="yAxis.top">
        <yAxis
          ref="yAxisBottom"
          id="yAxisBottom"
          :refresh="refresh"
          :series="dataArrs"
          :yAxis="yAxis"
          @rightClick="rightClick"
          @leftClick="leftClick"
        ></yAxis>
      </svg>
    </svg>
    <RightMenu v-if="visable" :currentObj="currentObj" :selfStyle="selfStyle" @config="config"></RightMenu>
    <y-modal
      :title="modal.title"
      v-model="modal.visible"
      :footer="null"
    >
      <formModal :list="lists" :formData="ruleForm"  @submit="submit" @cancle="cancle"></formModal>
    </y-modal>
  </div>
</template>
<script>
import "../assets/gsap.min.js";
import yAxis from "../components/yAxis";
import xAxis from "../components/xAxis";
import mArea from "../components/cArea";
import RightMenu from "../components/fightContent"
import { dataArr } from "../json/datas";
import formModal from '../components/formModal.vue'

import moment from "moment-mini";
export default {
  components: {
    yAxis,
    xAxis,
    mArea,
    RightMenu,
    formModal
  },
  data() {
    return {
      lists:[],
      scaleNum: 1,
      disabledB: false,
      modal: {
        visible: false,
        title: '',
        data: {}
      },
      ruleForm:{},
      currentObj:{},
      timelist:[
        {
          key: 'flightNumD',
          type: 'text',
          label:'航班号',
          disabled: false,
          placeholder: '请输入'
        },
        {
          key: 'dynamicResourceNo',
          type: 'text',
          label:'行李转盘号',
          disabled: true,
          placeholder: '请输入'
        },
        {
          key:'std',
          type: 'datePicker',
          label:'开始运行时间',
          showTime: true,
          placeholder: '请选择'
        },
        {
          key:'ete',
          type: 'datePicker',
          label:'结束运行时间',
          showTime: true,
          placeholder: '请选择'
        }
      ],
      standlist:[
        {
          key: 'dynamicResourceNo',
          type: 'text',
          label:'行李转盘号',
          disabled: true,
          placeholder: '请输入'
        },
        {
          key: 'isNear',
          type: 'radio',
          label:'是否近机位',
          arr: [
            {
              isNear: 'Y',
              label: '是'
            },
            {
              isNear: 'N',
              label: '否'
            }
          ]
        },
        {
          key:'seat',
          type: 'select',
          label:'机位选择',
          placeholder: '请选择',
          arr: [
            {
              seat: '21L',
              isNear: 'Y',
              seatName: '普通机位'
            },
            {
              seat: '124',
              isNear: 'N',
              seatName: '货运机位'
            },
            {
              seat: '126',
              isNear: 'N',
              seatName: '普通机位'
            },
            {
              seat: '129',
              isNear: 'Y',
              seatName: '临时机位'
            }
          ]
        }
      ],
      visable:false,
      selfStyle:{
        top:"",
        left: "",
      },
      terminalArr: [
        {
          id: "T1",
          label: "T1",
        },
         {
          id: "T2",
          label: "T2",
        },
         {
          id: "T3",
          label: "T3",
        },
      ],
      terminal: undefined,
      refresh: [],
      xAxis: {
        timeSpace: 3,
        timeMultSpace: 1,
        timestempUnit:  60 * 1000,
        minutesInHour: 60, // 一小时 n s
        timeSMult: 0.5,
        lineStyle: { l: 10.5, m: 7, s: 5 },
        width: 5100,
        spanning: 1 * 24 * 60,
        boundaryGap: [25.5, 100],
        top: 30,
        left: 130,
        right: 20,
        now: "2021-08-11 10:20",
        start: "2021-08-11 00:00",
      },
      markLineBottom: {
        y: 0,
        boundaryGap: [10, 30],
        height: 0,
        color: "#333",
      },
      pStyle: {
        menuHeight: 34,
        contentHeight: 867,
        leftWidth: 1500,
        rightWidth: 300,
        topHeight: 400,
        bottomHeight: 867,
        cardMargin: 8,
      },
      showBlock: {
        leftTop: {
          show: true,
          type: "Q",
        },
        leftBottom: {
          show: true,
          type: "gate",
        },
        right: true,
      },
      markLineTop: {
        y: 0,
        boundaryGap: [10, 30],
        height: 0,
        color: "#333",
      },
      dataArrs:[],
      yAxis: {
        transStyle: {
          width: 130,
          height: 40,
          interval: 10,
          column: 20
        },
        conf: {
          id: "standNo",
          value: "standNo",
        },
        fontStyle: {
          fontSize: 14,
        },
        boundaryGap: [0, 0],
        top: 50,
        bottom: 20,
        margin: [0.5],
        height: 3880,
      },
    };
  },
  computed: {
    svgHeight() {
        let len = this.dataArrs.length
        let h = 0
        for(let i = 0; i< this.dataArrs.length; i++){
          if(this.dataArrs[i].len > 1) {
            len = len - 1
            h = h + this.dataArrs[i].len * this.yAxis.transStyle.column + (this.dataArrs[i].len + 1) * this.yAxis.transStyle.interval
          }
        }
        return len * this.yAxis.transStyle.height + h;
    },
    computeLeftTopHeight() {
      return (
        this.pStyle.topHeight +
        (this.showBlock.leftBottom.show ? 0 : this.pStyle.bottomHeight)
      );
    },
    computeLeftWidth() {
      return (
        this.pStyle.leftWidth +
        (this.showBlock.right ? 0 : this.pStyle.rightWidth)
      );
    },
    computeLeftBottomHeight() {
      return (
        this.pStyle.bottomHeight +
        (this.showBlock.leftTop.show ? 0 : this.pStyle.topHeight + 12)
      );
    },
  },
  created() {
    this.dataArrs = dataArr
  },
  mounted() {
    this.$nextTick(() => {
      let customScroll = this.customScroll;
      window.addEventListener("click", customScroll);
      this.$set(this.markLineTop, "y", this.xAxis.top + this.xAxis.lineStyle.l);
      this.$set(
        this.markLineTop,
        "height",
        this.computeLeftTopHeight -
          this.markLineTop.y -
          this.yAxis.boundaryGap[1]
      );
      this.$set(
        this.markLineBottom,
        "y",
        this.xAxis.top + this.xAxis.lineStyle.l
      );
      this.$set(
        this.markLineBottom,
        "height",
        this.computeLeftBottomHeight -
          this.markLineBottom.y -
          this.yAxis.boundaryGap[1]
      );
      var that = this
      this.$refs.svgBottomContent.onscroll = function () {

        that.visable = false
        window.TweenMax.to("#xAxisBottom", 0, {
          x: -this.scrollLeft,
        });
        window.TweenMax.to("#yAxisBottom", 0, {
          y: -this.scrollTop,
        });
        customScroll();
      };
      this.$set(this, "refresh", ["all"]);
      let mousemove = this.mousemove;
      let mouseleave = this.mouseleave;
      let bottom = this.$refs.svgBottomContent.querySelector("svg");
      this.$d3
        .select(this.$refs.svgBottomContent)
        .on("mousemove touchend", function () {
          mousemove(bottom, "Bottom");
        })
        .on("mouseleave", function () {
          mouseleave(bottom, "Bottom");
        });

            let now = new Date(this.xAxis.now.substr(0, 16) + ":00");
            let sTime = new Date(this.xAxis.start.substr(0, 16) + ":00");
              let ri =
                (now.getTime() - sTime.getTime()) / this.xAxis.timestempUnit;
              let rX = ri * 2.34
              let width = rX;

         let dragScroll = null
          if (this.$refs.svgBottomContent) {
            dragScroll = {
              top: this.$refs.svgBottomContent.scrollTop,
              left:  width
            }
          }
           dragScroll && this.$refs.svgBottomContent && this.$refs.svgBottomContent.scrollTo(dragScroll)
    });
  },

  methods: {
    reduce() {
      this.xAxis.timeSpace -= 0.5
      this.xAxis.width -= 720
      let now = new Date(this.xAxis.now.substr(0, 16) + ":00");
      let sTime = new Date(this.xAxis.start.substr(0, 16) + ":00");
      let ri =
        (now.getTime() - sTime.getTime()) / this.xAxis.timestempUnit;
      let fama =  this.xAxis.timeSpace - 0.5 > 1 ? this.xAxis.timeSpace - 0.5 : 1
      let rX = ri * fama
      let width = rX;

      let dragScroll = null
      if (this.$refs.svgBottomContent) {
        dragScroll = {
          top: this.$refs.svgBottomContent.scrollTop,
          left:  width
        }
      }
      dragScroll && this.$refs.svgBottomContent && this.$refs.svgBottomContent.scrollTo(dragScroll)

      this.$set(this, "refresh", ["all"]);
    },
    add() {
      this.xAxis.timeSpace += 0.5
      this.xAxis.width += 720
      let now = new Date(this.xAxis.now.substr(0, 16) + ":00");
      let sTime = new Date(this.xAxis.start.substr(0, 16) + ":00");
      let ri =
        (now.getTime() - sTime.getTime()) / this.xAxis.timestempUnit;
      let fama =  this.xAxis.timeSpace + 0.5 < 2.34 ? this.xAxis.timeSpace + 0.5 : 2.34
      let rX = ri * fama
      let width = rX;

      let dragScroll = null
      if (this.$refs.svgBottomContent) {
        dragScroll = {
          top: this.$refs.svgBottomContent.scrollTop,
          left:  width
        }
      }
      dragScroll && this.$refs.svgBottomContent && this.$refs.svgBottomContent.scrollTo(dragScroll)

      this.$set(this, "refresh", ["all"]);
    },
    submit(form) {
      for(let key in form) {
        if(key == 'ete' ||  key == 'std') {
          form[key] = moment(form[key]).format('YYYY-MM-DDTHH:mm')
        }
      }
      for(let i=0; i < dataArr.length; i++){
        if(dataArr[i].standNo == form.dynamicResourceNo){
          let obj = {
            dynamicFlightIdA: 45482,
            dynamicFlightIdD: 45483,
            flightNumA: form.flightNumD,
            flightNumD: form.flightNumD,
            inOutFlag: "A|D",
            afid: "W/Z-CN7669-20201031-A|W/Z-CN7670-20201031-D",
            sta: moment(form.std).format('YYYY-MM-DDTHH:mm'),
            eta: "2020-10-31T10:10",
            ata: "2020-10-31T10:10",
            std: moment(form.std).format('YYYY-MM-DDTHH:mm'),
            etd: null,
            atd: null,
            ets: moment(form.std).format('YYYY-MM-DDTHH:mm'),
            ete: moment(form.ete).format('YYYY-MM-DDTHH:mm'),
            ats: moment(form.std).format('YYYY-MM-DDTHH:mm'),
            ate: null,
            exectDateA: null,
            exectDateD: null,
            dynamicResourceNo: form.dynamicResourceNo,
          }
          dataArr[i].dataArray.push(obj)
        }
      }
      this.$set(this, 'dataArrs', dataArr)
      this.$set(this, "refresh", ["all"]);

      this.$set(this.modal, 'visible', false)
    },
    cancle(){
      this.$set(this.modal, 'visible', false)
    },
    config(item) {
      if(item.id == '01') {
        this.lists = this.standlist
      } else {
        this.lists = this.timelist
      }
      this.$set(this.modal, 'title', item.title)
      this.$set(this.modal, 'visible', true)
      if(this.currentObj.standNo && this.currentObj.dataArray && this.currentObj.dataArray.length > 0) {
        this.ruleForm = this.currentObj.dataArray[0]
      }else {
        this.ruleForm = {}
        this.$set(this.ruleForm, 'dynamicResourceNo', this.currentObj.standNo)
      }
    },
    leftClick() {
      this.visable = false
    },
    rightClick(obj, event) {
      this.visable = false
      this.$nextTick(()=> {
        this.currentObj = obj
        this.$set(this.selfStyle, 'top', event.y)
        this.$set(this.selfStyle, 'left', event.x)
        this.visable = true
      })
    },
    lineX() {
      return function (i) {
        let xAxis = this.xAxis;
        return i * (xAxis.timeSpace + xAxis.timeMultSpace * xAxis.timeSMult);
      };
    },
    handleChange(value) {
      this.$emit("flight", {});
      if(!value) {
      this.$set(this, 'dataArrs', dataArr)
      this.$set(this, "refresh", ["all"]);
      return
      }
      let newArr = []
      for( let i=0 ; i< dataArr.length; i++) {
          if(value == dataArr[i].terminal){
            newArr.push(dataArr[i])
          }
      }
      this.$set(this, 'dataArrs', newArr)
      this.$set(this, "refresh", ["all"]);
      // this.dataArrs = newArr

    },
    clickBlock(obj) {
      this.$emit("flight", obj);
    },
    customScroll() {
      this.visable = false
      // this.$set(this.menuFlight, 'show', false)
      // this.$set(this.menuStand, 'show', false)
    },
    /* 鼠标事件：移动 */
    mousemove(node, position) {
      const x = this.$d3.mouse(node)[0];
      let markLineFont =
        this.$refs["markLine" + position].querySelector(".mark-line-font");
      if (
        x > 0 &&
        x >= this.xAxis.boundaryGap[0] &&
        x <= this.xAxis.width - this.xAxis.boundaryGap[1]
      ) {
        let i =
          (x - this.xAxis.boundaryGap[0]) /
          (this.xAxis.timeSpace +
            this.xAxis.timeMultSpace * this.xAxis.timeSMult);
        let time = this.formatHM(
          new Date(
            new Date(this.xAxis.start.substr(0, 16) + ":00").getTime() +
              i * this.xAxis.timestempUnit
          )
        );
        this.$d3
          .select(this.$refs["markLine" + position])
          .attr("transform", `translate(${this.$d3.event.layerX + 0.5}, 0)`);
        this.$d3
          .select(markLineFont)
          .attr("y", this.xAxis.top - 15)
          .text(time);
      } else {
        this.$d3
          .select(this.$refs["markLine" + position])
          .attr("transform", `translate(-1, 0)`);
        this.$d3.select(markLineFont).text("");
      }
    },
    mouseleave(node, position) {
      let markLineFont =
        this.$refs["markLine" + position].querySelector(".mark-line-font");
      this.$d3
        .select(this.$refs["markLine" + position])
        .attr("transform", `translate(-1, 0)`);
      this.$d3.select(markLineFont).text("");
    },
  },
};
</script>
<style lang="scss" scoped>
.svg-scroll {
  width: 100%;
  height: 867px;
  overflow: hidden;
  position: relative;
}
.btn {
  position: absolute;
  top: 10px;
  right: 40px;
  z-index: 3;
  display: flex;
  justify-content: flex-end;
  .add-box {
    width: 30px;
    height: 20px;
    border: 1px solid #ccc;
    margin-left: 10px;
    display: flex;
    justify-content: center;
    align-items: center;
  }
}
.svg-scroll::-webkit-scrollbar {
  width: 8px;
  height: 8px;
}
.svg-scroll::-webkit-scrollbar-track {
  background-color: #e6e6e7;
  -webkit-border-radius: 5px;
  -moz-border-radius: 5px;
  border-radius: 5px;
}

.svg-scroll::-webkit-scrollbar-thumb {
  background-color: #b3b3b3;
  -webkit-border-radius: 5px;
  -moz-border-radius: 5px;
  border-radius: 5px;
}
.svg-whole {
  position: absolute;
  left: 40px;
  top: 30px;
}
.svg-whole {
  .svg-scroll {
    width: 100%;
    height: 100%;
    overflow: auto;
    -webkit-user-select: none;
    -moz-user-select: none;
    -ms-user-select: none;
    user-select: none;
  }
}
.mark-line {
  text-anchor: middle;
}
.markLine {
  pointer-events: none;
}
.mark-line-font {
  text-anchor: middle;
  fill: #149dec;
  stroke: rgba(61, 160, 241, 0.67);
}
</style>
