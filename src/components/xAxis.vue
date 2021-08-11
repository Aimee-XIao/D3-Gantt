<template>
  <g ref="timeAxis" class="timeAxisGroup">
    <line class="timeLine"></line>
    <g class="timeLineGroup"/>
    <text class="timeLabel" style="text-anchor: middle; fill: #4C4C4C; font-size: 16px; font-weight: 500;"/>
  </g>
</template>

<script>
import _ from 'lodash'
export default {
  name: "xAxis",
  props: {
    refresh: {
      type: Array,
      default: () => []
    },
    xAxis: {
      type: Object,
      default: () => {}
    }
  },
  data() {
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
      ownRefresh: [],
      xmlns: 'http://www.w3.org/2000/svg',
    }
  },
  watch: {
    refresh: {
      handler (val) {
        this.$set(this, 'ownRefresh', _.cloneDeep(val) || [])
        if (_.intersection(this.ownRefresh, this.name).length) {
          let xAxis =  this.xAxis
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
  },
  computed: {
    lineX () {
      return function (i) {
        let xAxis = this.xAxis
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
  // mounted() {
  //   this.init()
  // },
  methods:{
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
    init() {
      this.$set(this, 'height', this.xAxis.top + this.xAxis.lineStyle.l)
      this.$set(this, 'width', this.lineX(this.xAxis.spanning) + this.xAxis.boundaryGap[0] + this.xAxis.boundaryGap[1])
      this.timeLineGroup = this.$refs.timeAxis.querySelector('.timeLineGroup')
      this.timeLineGroup.innerHTML = ''
      this.$d3.select(this.$refs.timeAxis.querySelector('.timeLine'))
        .attr('transform', `translate(${this.xAxis.boundaryGap[0]}, ${this.xAxis.top + this.xAxis.lineStyle.l})`)
        .attr('x2', this.lineX(this.xAxis.spanning))
        .attr('stroke', this.timeColor)
      let marker, labelGroup
      let sInterval = this.lineS[this.xAxis.timeSMult] || 1
      let mInterval = this.lineM[this.xAxis.timeSMult] || 5
      let lInterval = this.lineL[this.xAxis.timeSMult] || 10
      for(let i=0; i<= this.xAxis.spanning; i++) {
        let time = this.formatHM(new Date(this.sTime.getTime() + i * this.xAxis.timestempUnit))
        if ((new Date(this.sTime.getTime() + i * this.xAxis.timestempUnit) - this.sTime) % (24 * 60 * 60 * 1000) === 0) {
          time = this.formatYMD(new Date(this.sTime.getTime() + i * this.xAxis.timestempUnit)).substr(5, 5)
        }
        marker = document.createElementNS(this.xmlns, 'line')
        let lineX = this.lineX(i) + this.xAxis.boundaryGap[0]
       if(i % lInterval == 0) {
         this.timeLineGroup.appendChild(marker)
         let label = document.createElementNS(this.xmlns, 'text')
         this.timeLineGroup.appendChild(label)
         this.$d3.select(marker)
           .attr('transform', `translate(${lineX}, ${this.xAxis.top + this.xAxis.lineStyle.l})`)
           .attr('y2', -this.xAxis.lineStyle.l)
           .attr('stroke', this.timeColor)
         this.$d3.select(label)
           .classed('timeLabel', true)
           .attr('transform', `translate(${lineX}, ${this.xAxis.top - 5})`)
           .attr('fill', '#4C4C4C')
           .text(time)
       }else if (i % mInterval == 0) {
         this.timeLineGroup.appendChild(marker)
         this.$d3.select(marker)
           .attr('transform', `translate(${lineX}, ${this.xAxis.top + this.xAxis.lineStyle.l})`)
           .attr('y2', -this.xAxis.lineStyle.m)
           .attr('stroke', this.timeColor)
       } else if (i % sInterval == 0) {
         this.timeLineGroup.appendChild(marker)
         this.$d3.select(marker)
           .attr('transform', `translate(${lineX}, ${this.xAxis.top + this.xAxis.lineStyle.l})`)
           .attr('y2', -this.xAxis.lineStyle.s)
           .attr('stroke', this.timeColor)
       }






      }

    },
    formatHM (time) {
      if (time) {
        let date
        if (_.isDate(time)) {
          date = new Date(time)
        } else {
          date = new Date(time.substr(0, 16) + ':00')
        }
        let hour = date.getHours() < 10 ? `0${date.getHours()}` : date.getHours()
        let minite = date.getMinutes() < 10 ? `0${date.getMinutes()}` : date.getMinutes()
        return `${hour}:${minite}`
      } else {
        return ''
      }
    },
    formatYMD (time) {
      if (time) {
        let date
        if (_.isDate(time)) {
          date = new Date(time)
        } else {
          date = new Date(time.substr(0, 10) + ':00:00')
        }
        let dateStr = `${date.getFullYear()}-${this.addZero(date.getMonth() + 1)}-${this.addZero(date.getDate())}`
        return `${dateStr}`
      } else {
        return ''
      }
    },
    addZero (value) {
      if (value < 10) {
        return `0${value}`
      } else {
        return value
      }
    },
  }
};
</script>

<style scoped lang="scss">
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
