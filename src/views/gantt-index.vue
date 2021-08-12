<template>
  <div class="bottom svg-scroll" :style="{height: computeLeftBottomHeight + 'px'}">
    <svg  :style="{left: pStyle.carkMargin + 'px', top: pStyle.carkMargin + 'px'}"
          :width="computeLeftWidth - 2 * pStyle.cardMargin"
          :height="computeLeftBottomHeight - 2 * pStyle.cardMargin"
          baseProfile="full" class="svg-whole">
      <defs>
        <filter id="box-shadow-series">
          <feDropShadow dx="0" dy="0" stdDeviation="10" flood-color="#ff0000"></feDropShadow>
        </filter>
      </defs>
     <!--内容区域-->
      <foreignObject :x="xAxis.left" :y="yAxis.top" :width="computeLeftWidth - xAxis.left - 2 * pStyle.cardMargin" :height="computeLeftBottomHeight - yAxis.top - 2 * pStyle.cardMargin">
        <div ref="svgBottomContent" class="svg-scroll">
          <svg :width="xAxis.width" :height="yAxis.height">
            <mArea @clickBlock="clickBlock"  :selfRef="'svgBottom'" ref="svgBottomData" id="svgBottomData" :refresh="refresh" :xAxis="xAxis" :yAxis="yAxis" :series="dataArrs"></mArea>
          </svg>
        </div>
      </foreignObject>
     <!--坐标 x-->
      <svg :x="xAxis.left">
        <xAxis ref="xAxisBottom" id="xAxisBottom" :xAxis="xAxis" :refresh="refresh"></xAxis>
        <g ref="markLineBottom" class="markLine" transform="translate(-10, 0)">
          <line class="mark-line" :y1="markLineBottom.y" :y2="markLineBottom.y + markLineBottom.height" :stroke="markLineBottom.color"></line>
          <text class="mark-line-font"/>
        </g>
      </svg>
      <!--坐标 y-->
      <svg :y="yAxis.top">
        <yAxis ref="yAxisBottom" id="yAxisBottom"  :refresh="refresh" :series="dataArrs"  ></yAxis>
      </svg>
    </svg>

  </div>
</template>
<script>
import '../assets/gsap.min.js'
import yAxis from '../components/yAxis'
import xAxis from '../components/xAxis'
import mArea from '../components/cArea'
import {dataArr}  from '../json/datas'
export default {
  components: {
    yAxis, xAxis, mArea
  },
  data() {
    return {
      refresh: [],
      xAxis: {
        timeSpace: 3,
        timeMultSpace: 1,
        timestempUnit: 60 * 1000,
        minutesInHour: 60, // 一小时 n s
        timeSMult: 0.5,
        lineStyle: {l: 10.5, m: 7, s: 5},
        width: 20211,
        spanning: 4 * 24 * 60,
        boundaryGap: [25.5, 25.5],
        top: 30,
        left: 130,
        right: 20,
        now: '2021-08-12 14:19',
        start: '2021-08-11 00:00'
      },
      markLineBottom: {
        y: 0,
        boundaryGap: [10, 30],
        height: 0,
        color: '#333'
      },
      pStyle: {
        menuHeight: 34,
        contentHeight:867,
        leftWidth: 1500,
        rightWidth: 300,
        topHeight: 400,
        bottomHeight: 867,
        cardMargin: 8
      },
      showBlock: {
        leftTop: {
          show: true,
          type: 'Q'
        },
        leftBottom: {
          show: true,
          type: 'gate'
        },
        right: true
      },
      markLineTop: {
        y: 0,
        boundaryGap: [10, 30],
        height: 0,
        color: '#333'
      },
      yAxis:{
        transStyle: {
          width: 130,
          height: 40
        },
        conf: {
          id: "standNo",
          value: "standNo"
        },
        fontStyle: {
          fontSize: 14
        },
        boundaryGap: [0, 0],
        top: 50,
        bottom: 20,
        margin: [0.5],
        height: 3880
      }
    }
  },
  computed: {
    computeLeftTopHeight () {
      return (this.pStyle.topHeight + (this.showBlock.leftBottom.show ? 0 : this.pStyle.bottomHeight))
    },
    computeLeftWidth () {
      return (this.pStyle.leftWidth + (this.showBlock.right ? 0 : this.pStyle.rightWidth))
    },
    computeLeftBottomHeight () {
      return (this.pStyle.bottomHeight + (this.showBlock.leftTop.show ? 0 : (this.pStyle.topHeight + 12)))
    },
    dataArrs() {
      return dataArr
    }
  },
  created() {

  },
  mounted() {
    this.$nextTick(() => {
      let customScroll = this.customScroll
      window.addEventListener('click', customScroll)
      this.$set(this.markLineTop, 'y', this.xAxis.top + this.xAxis.lineStyle.l)
      this.$set(this.markLineTop, 'height', this.computeLeftTopHeight - this.markLineTop.y - this.yAxis.boundaryGap[1])
      this.$set(this.markLineBottom, 'y', this.xAxis.top + this.xAxis.lineStyle.l)
      this.$set(this.markLineBottom, 'height', this.computeLeftBottomHeight - this.markLineBottom.y - this.yAxis.boundaryGap[1])
      this.$refs.svgBottomContent.onscroll = function () {
        window.TweenMax.to('#xAxisBottom', 0, {
          x: -this.scrollLeft
        })
        window.TweenMax.to('#yAxisBottom', 0, {
          y: -this.scrollTop
        })
        customScroll()
      }
      this.$set(this, 'refresh', ['all'])
      let mousemove = this.mousemove
      let mouseleave = this.mouseleave
      let bottom = this.$refs.svgBottomContent.querySelector('svg')
      this.$d3.select(this.$refs.svgBottomContent)
        .on('mousemove touchend', function () {
          mousemove( bottom, 'Bottom')
        })
        .on('mouseleave', function () {
          mouseleave(bottom, 'Bottom')
        })
    })
  },
  methods: {
    clickBlock(obj) {
      this.$emit("flight", obj)
      console.log('----------',obj )
    },
    customScroll () {
      // this.$set(this.menuFlight, 'show', false)
      // this.$set(this.menuStand, 'show', false)
    },
    /* 鼠标事件：移动 */
    mousemove (node, position) {
      const x = this.$d3.mouse(node)[0]
      let markLineFont = this.$refs['markLine' + position].querySelector('.mark-line-font')
      if (x > 0 && x >= this.xAxis.boundaryGap[0] && x <= (this.xAxis.width - this.xAxis.boundaryGap[1])) {
        let i = (x - this.xAxis.boundaryGap[0]) / (this.xAxis.timeSpace + this.xAxis.timeMultSpace * this.xAxis.timeSMult)
        let time = this.formatHM(new Date(new Date(this.xAxis.start.substr(0, 16) + ':00').getTime() + i * this.xAxis.timestempUnit))
        this.$d3.select(this.$refs['markLine' + position])
          .attr('transform', `translate(${this.$d3.event.layerX + 0.5}, 0)`)
        this.$d3.select(markLineFont)
          .attr('y', this.xAxis.top - 15)
          .text(time)
      } else {
        this.$d3.select(this.$refs['markLine' + position])
          .attr('transform', `translate(-1, 0)`)
        this.$d3.select(markLineFont)
          .text('')
      }
    },
    mouseleave (node, position) {
      let markLineFont = this.$refs['markLine' + position].querySelector('.mark-line-font')
      this.$d3.select(this.$refs['markLine' + position])
        .attr('transform', `translate(-1, 0)`)
      this.$d3.select(markLineFont)
        .text('')
    },
  }

}
</script>
<style lang="scss" scoped>
.svg-scroll {
  width: 100%;
  height: 867px;
  overflow: hidden;
  position: relative;
}
.svg-scroll::-webkit-scrollbar {
  width: 8px;
  height: 8px;
}

.svg-scroll::-webkit-scrollbar-track {
      background-color: #e6e6e7;
      -webkit-border-radius:  5px;
      -moz-border-radius:  5px;
      border-radius:  5px
}

.svg-scroll::-webkit-scrollbar-thumb {
  background-color: #b3b3b3;
  -webkit-border-radius: 5px;
  -moz-border-radius:  5px;
  border-radius:  5px;
}
.svg-whole {
  position: absolute;
  left: 8px;
  top: 8px;

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
  stroke: rgba(61,160,241,.67);
}


</style>
