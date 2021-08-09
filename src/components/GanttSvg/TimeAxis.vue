<template>
  <g ref="timeAxis" class="timeAxisGroup">
    <line class="timeLine"></line>
    <g class="timeLineGroup"/>
    <text class="timeLabel" style="text-anchor: middle; fill: #4C4C4C; font-size: 16px; font-weight: 500;"/>
  </g>
</template>

<script>

import ganttMixin from '../../mixin/ganttMixin'
import _ from 'lodash'
import { mapState } from 'vuex'
export default {
  mixins: [ganttMixin],
  props: {
    refresh: {
      type: Array,
      default: () => []
    },
    xAxisKey: {
      type: String,
      default: 'xAxis'
    },
    seriesKey: {
      type: String,
      default: 'series'
    },
    customXAxis: {
      default: null
    }
  },
  data () {
    return {
      name: ['all', 'start', 'x'],
      height: 0,
      width: 0,
      timeColor: '#8a8a8a',
      timeLineGroup: null,
      lineS: {'0.5': 10, 1: 5, 2: 3, 3: 2}, // 1
      lineM: {'0.5': 30, 1: 15, 2: 15, 3: 10}, // 5
      lineL: {'0.5': 60, 1: 45, 2: 30, 3: 30, 4: 20, 5: 15, 6: 15}, // 10
      sTime: '',
      initFlag: false,
      initFuncs: [],
      timer: null,
      holdTimes: 1500,
      ownRefresh: []
    }
  },
  computed: {
    ...mapState({
      xAxis (state) {
        return state.gantt[this.xAxisKey]
      }
    }),
    getGanttConf () {
      return function (key) {
        return this.$store.getters.getGanttConf(key)
      }
    },
    lineX () {
      return function (i) {
        let xAxis = this.customXAxis || this.xAxis
        return (i * (xAxis.timeSpace + xAxis.timeMultSpace * xAxis.timeSMult))
      }
    },
    computedFunc () {
      if (this.initFuncs.includes('init')) {
        return 'init'
      }
      return ''
    }
  },
  mounted () {
  },
  methods: {
    allInit () {
      if (!this.timer) {
        console.warn('time -- timer -- start')
        this.computedFunc && this[this.computedFunc]()
        this.$set(this, 'initFuncs', [])
        this.timer = setTimeout(() => {
          if ((this.computedFunc || []).length) {
            console.log('time -- timer -- delay => ' + this.computedFunc)
          } else {
            console.log('time -- timer -- delay is all clear.')
          }
          this.computedFunc && this[this.computedFunc]()
          this.timer = null
        }, this.holdTimes)
      } else {
        console.warn('time -- ' + 'timering')
      }
    },
    init () {
      let xAxis = this.customXAxis || this.xAxis
      this.$set(this, 'height', xAxis.top + xAxis.lineStyle.l)
      this.$set(this, 'width', this.lineX(xAxis.spanning) + xAxis.boundaryGap[0] + xAxis.boundaryGap[1])
      if (this.customXAxis) {
        this.$emit('setSelfData', {key: 'xAxis', ckey: 'width', value: this.width})
      } else {
        this.$store.commit('setGanttConf', {key: 'xAxis.width', value: this.width})
      }
      if (this.timeLineGroup) {
        this.initAxis()
      } else {
        this.$nextTick(() => {
          this.timeLineGroup = this.$refs.timeAxis.querySelector('.timeLineGroup')
          this.initAxis()
        })
      }
    },
    initAxis () {
      let xAxis = this.customXAxis || this.xAxis
      this.timeLineGroup.innerHTML = ''
      this.$d3.select(this.$refs.timeAxis.querySelector('.timeLine'))
        .attr('transform', `translate(${xAxis.boundaryGap[0]}, ${xAxis.top + xAxis.lineStyle.l})`)
        .attr('x2', this.lineX(xAxis.spanning))
        .attr('stroke', this.timeColor)
      let marker, labelGroup
      let sInterval = this.lineS[xAxis.timeSMult] || 1
      let mInterval = this.lineM[xAxis.timeSMult] || 5
      let lInterval = this.lineL[xAxis.timeSMult] || 10

      for (let i = 0; i <= xAxis.spanning; i++) {
        let time = this.formatHM(new Date(this.sTime.getTime() + i * xAxis.timestempUnit))
        if ((new Date(this.sTime.getTime() + i * xAxis.timestempUnit) - this.sTime) % (24 * 60 * 60 * 1000) === 0) {
          time = this.formatYMD(new Date(this.sTime.getTime() + i * xAxis.timestempUnit)).substr(5, 5)
        }
        marker = document.createElementNS(this.$store.getters.getXmlns, 'line')
        let lineX = this.lineX(i) + xAxis.boundaryGap[0]
        if (i % lInterval == 0) {
          this.timeLineGroup.appendChild(marker)
          let label = document.createElementNS(this.$store.getters.getXmlns, 'text')
          this.timeLineGroup.appendChild(label)
          this.$d3.select(marker)
            .attr('transform', `translate(${lineX}, ${xAxis.top + xAxis.lineStyle.l})`)
            .attr('y2', -xAxis.lineStyle.l)
            .attr('stroke', this.timeColor)
          this.$d3.select(label)
            .classed('timeLabel', true)
            .attr('transform', `translate(${lineX}, ${xAxis.top - 5})`)
            .attr('fill', '#4C4C4C')
            .text(time)
        } else if (i % mInterval == 0) {
          this.timeLineGroup.appendChild(marker)
          this.$d3.select(marker)
            .attr('transform', `translate(${lineX}, ${xAxis.top + xAxis.lineStyle.l})`)
            .attr('y2', -xAxis.lineStyle.m)
            .attr('stroke', this.timeColor)
        } else if (i % sInterval == 0) {
          this.timeLineGroup.appendChild(marker)
          this.$d3.select(marker)
            .attr('transform', `translate(${lineX}, ${xAxis.top + xAxis.lineStyle.l})`)
            .attr('y2', -xAxis.lineStyle.s)
            .attr('stroke', this.timeColor)
        }
      }
    }
  },
  watch: {
    refresh: {
      handler (val) {
        this.$set(this, 'ownRefresh', _.cloneDeep(val) || [])
        if (_.intersection(this.ownRefresh, this.name).length) {
          let xAxis = this.customXAxis || this.xAxis
          let sTime = new Date(new Date(xAxis.start.substr(0, 16) + ':00'))
          if (val === ['start']) {
            if (sTime !== this.sTime) {
              this.$set(this, 'sTime', sTime)
              this.initFuncs.push('init')
              this.allInit()
            }
          } else {
            this.$set(this, 'sTime', sTime)
            this.initFuncs.push('init')
            this.allInit()
          }
        }
        this.ownRefresh.splice(0, this.ownRefresh.length)
      }
    }
  }
}
</script>

<style lang="scss">
.timeAxisGroup {
  user-select: none;
  .timeLabel {
    text-anchor: middle;
    fill: #4C4C4C;
    font-size: 16px;
    font-weight: 500;
  }
}
</style>
