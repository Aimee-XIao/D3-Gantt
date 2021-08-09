<template>
  <g ref="categoryAxis" class="categoryAxisGroup">
    <line ref="rowLine" class="rowLine" style="stroke: #e0e0e0; stroke-width: 1;"></line>
    <g class="categotyMemberGroup">
      <rect class="categoryBlock"/>
      <text class="categoryLabel"
        style="font-family: 'Microsoft YaHei', sans-serif; fill: rgb(51,51,51); text-anchor: middle; dominant-baseline: middle; font-weight: bold;"/>
      <line class="rowLine" style="stroke: #e0e0e0; stroke-width: 1;"></line>
    </g>
  </g>
</template>

<script>

import _ from 'lodash'
import { mapState } from 'vuex'
import { selectIdByCssFilter } from '../../util/util'
export default {
  props: {
    yAxisKey: {
      type: String,
      default: 'yAxis'
    },
    seriesKey: {
      type: String,
      default: 'seriesNd'
    },
    colorTypeKey: {
      type: String,
      default: 'colorTypes'
    },
    colorConfigKey: {
      type: String,
      default: 'colorConfig'
    },
    refresh: {
      type: Array,
      default: () => []
    },
    seriesRef: {
      default: false
    },
    colorParamValue: {
      default: 'paramValue'
    },
    customYAxis: {
      default: null
    },
    customSeries: {
      default: null
    },
    customDrawColor: {
      type: Function
    }
  },
  data () {
    return {
      name: ['all', 'color'],
      width: 0,
      height: 0,
      categotyMemberGroup: null,
      oldData: [],
      startFlag: false,
      initFlag: false,
      initFuncs: [],
      errorDraw: false,
      timer: null,
      holdTimes: 1500,
      ownRefresh: []
    }
  },
  computed: {
    ...mapState({
      yAxis (state) {
        return state.gantt[this.yAxisKey]
      },
      series (state) {
        return state.gantt[this.seriesKey]
      },
      colorTypes (state) {
        return state.gantt[this.colorTypeKey]
      },
      colorConfig (state) {
        return state.gantt[this.colorConfigKey]
      }
    }),
    topY () {
      return function (i) {
        return i * (this.customYAxis || this.yAxis).transStyle.height
      }
    },
    margin () {
      let val = (this.customYAxis || this.yAxis).margin || []
      let margins = {
        top: 0,
        right: 0,
        bottom: 0,
        left: 0
      }
      switch (val.length) {
        case 1: margins = {
                  top: val[0],
                  right: val[0],
                  bottom: val[0],
                  left: val[0]
                }
                break
        case 2: margins = {
                  top: val[0],
                  right: val[1],
                  bottom: val[0],
                  left: val[1]
                }
                break
        case 3: margins = {
                  top: val[0],
                  right: val[1],
                  bottom: val[2],
                  left: val[1]
                }
                break
        case 4: margins = {
                  top: val[0],
                  right: val[1],
                  bottom: val[2],
                  left: val[3]
                }
                break
      }
      return margins
    },
    computedFunc () {
      if (this.initFuncs.includes('init')) {
        return 'init'
      } else if (this.initFuncs.includes('reInit')) {
        return 'reInit'
      } else if (this.initFuncs.includes('reInitColor')) {
        return 'reInitColor'
      }
      return ''
    }
  },
  created () {
  },
  methods: {
    refreshGantt (flag) {
      let yAxis = this.customYAxis || this.yAxis
      let series = this.customSeries || this.series
      if (flag === 'all') {
        this.initFuncs.push('init')
        this.$set(this, 'width', yAxis.transStyle.width)
        this.$nextTick(() => {
          this.categotyMemberGroup = this.$refs.categoryAxis.querySelector('.categotyMemberGroup')
          if (this.colorConfig.length) {
            this.allInit()
          } else {
            this.errorDraw = true
          }
        })
      } else if (flag === 'reInit') {
        this.initFuncs.push('reInit')
        if (this.colorConfig.length) {
          this.allInit()
        }
      } else if (flag === 'reInitColor') {
        this.initFuncs.push('reInitColor')
        this.allInit()
      }
      this.ownRefresh.splice(0, this.ownRefresh.length)
    },
    allInit () {
      if (!this.timer) {
        if ((this.computedFunc || []).length) {
          console.log(this.seriesKey + ' -- cate -- timer -- start => ' + this.computedFunc)
        } else {
          console.log(this.seriesKey + ' -- cate -- timer -- start is cleaning.')
        }
        this.computedFunc && this[this.computedFunc]()
        this.$set(this, 'initFuncs', [])
        this.timer = setTimeout(() => {
          if ((this.computedFunc || []).length) {
            console.log(this.seriesKey + ' -- cate -- timer -- delay => ' + this.computedFunc)
          } else {
            console.log(this.seriesKey + ' -- cate -- timer -- delay is all clear.')
          }
          this.computedFunc && this[this.computedFunc]()
          this.timer = null
        }, this.holdTimes)
      } else {
        console.warn(this.seriesKey + ' -- cate -- ' + 'timering')
      }
    },
    clear () {
      if (this.$refs.categoryAxis.childElementCount) {
        Array.from(this.$refs.categoryAxis.children).forEach((child, i) => {
          (i > 1) && this.$refs.categoryAxis.removeChild(child)
        })
      }
    },
    init () {
      debugger
      let yAxis = this.customYAxis || this.yAxis
      let series = this.customSeries || this.series

      if (this.$refs.rowLine) {
        this.$d3.select(this.$refs.rowLine)
          .attr('x1', this.margin.left)
          .attr('y1', 0)
          .attr('x2', yAxis.transStyle.width - this.margin.right)
          .attr('y2', 0)
      }
      this.startFlag = true
      this.clear()
      let memberGroup, block, label
      let drawColor = this.customDrawColor || this.drawColor
      for (let i = 0; i < series.data.length; i++) {
        let obj = series.data[i]
        let info, id
        if (yAxis.conf.id && yAxis.conf.value && _.isObject(obj)) {
          info = obj[yAxis.conf.value]
          id = obj[yAxis.conf.id]
        } else {
          info = obj
          id = obj
        }
        let topY = this.topY(i) + yAxis.boundaryGap[0]
        memberGroup = this.categotyMemberGroup.cloneNode(true)
        this.$refs.categoryAxis.appendChild(memberGroup)
        block = memberGroup.querySelector('.categoryBlock')
        let contextmenu = this.contextmenu
        this.$d3.select(memberGroup)
          .attr('id', 'm' + id)
          .attr('transform', `translate(0, ${topY})`)
          .attr('width', yAxis.transStyle.width)
          .attr('height', yAxis.transStyle.height)
          .on('contextmenu', function () {
            this.$d3.event.preventDefault()
            contextmenu(memberGroup, obj)
          })
        this.$d3.select(block)
          .attr('transform', `translate(${this.margin.left}, 0)`)
          .attr('width', yAxis.transStyle.width - this.margin.left - this.margin.right)
          .attr('height', yAxis.transStyle.height - this.margin.top - this.margin.bottom)
          .attr('fill', drawColor(obj))
          .attr('stroke-width', 0)
        label = memberGroup.querySelector('.categoryLabel')
        this.$d3.select(label)
          .attr('transform', `translate(${yAxis.transStyle.width / 2}, ${yAxis.transStyle.height / 2})`)
          .attr('font-size', yAxis.fontStyle.fontSize)
          .text(info)
        this.$d3.select(memberGroup.querySelector('.rowLine'))
            .attr('x1', this.margin.left)
            .attr('y1', yAxis.transStyle.height - this.margin.bottom)
            .attr('x2', yAxis.transStyle.width - this.margin.right)
            .attr('y2', yAxis.transStyle.height - this.margin.bottom)
      }
      this.initFlag = true
    },
    reInit () {
      let yAxis = this.customYAxis || this.yAxis
      let series = this.customSeries || this.series
      let memberGroup, block, label
      let drawColor = this.customDrawColor || this.drawColor
      for (let i = 0; i < series.data.length; i++) {
        let obj = series.data[i]
        let info, id
        if (yAxis.conf.id && yAxis.conf.value && _.isObject(obj)) {
          info = obj[yAxis.conf.value]
          id = obj[yAxis.conf.id]
        } else {
          info = obj
          id = obj
        }
        let topY = this.topY(i) + yAxis.boundaryGap[0]
        memberGroup = this.$refs.categoryAxis.querySelector(selectIdByCssFilter('#m' + id))
        if (memberGroup) {
          block = memberGroup.querySelector('.categoryBlock')
          let contextmenu = this.contextmenu
          this.$d3.select(memberGroup)
            .attr('transform', `translate(0, ${topY})`)
            .attr('width', yAxis.transStyle.width)
            .attr('height', yAxis.transStyle.height)
            .on('contextmenu', function () {
              this.$d3.event.preventDefault()
              contextmenu(memberGroup, obj)
            })
          this.$d3.select(block)
            .attr('transform', `translate(${this.margin.left}, 0)`)
            .attr('width', yAxis.transStyle.width - this.margin.left - this.margin.right)
            .attr('height', yAxis.transStyle.height - this.margin.top - this.margin.bottom)
            .attr('fill', drawColor(obj))
            .attr('stroke-width', 0)
          label = memberGroup.querySelector('.categoryLabel')
          this.$d3.select(label)
            .attr('transform', `translate(${yAxis.transStyle.width / 2}, ${yAxis.transStyle.height / 2})`)
            .attr('font-size', yAxis.fontStyle.fontSize)
            .text(info)
          this.$d3.select(memberGroup.querySelector('.rowLine'))
            .attr('x1', this.margin.left)
            .attr('y1', yAxis.transStyle.height - this.margin.bottom)
            .attr('x2', yAxis.transStyle.width - this.margin.right)
            .attr('y2', yAxis.transStyle.height - this.margin.bottom)
        }
      }
    },
    reInitColor () {
      let yAxis = this.customYAxis || this.yAxis
      let series = this.customSeries || this.series
      let memberGroup, block
      let drawColor = this.customDrawColor || this.drawColor
      for (let i = 0; i < series.data.length; i++) {
        let obj = series.data[i]
        let id
        if (yAxis.conf.id && yAxis.conf.value && _.isObject(obj)) {
          id = obj[yAxis.conf.id]
        } else {
          id = obj
        }
        memberGroup = this.$refs.categoryAxis.querySelector(selectIdByCssFilter('#m' + id))
        if (memberGroup) {
          block = memberGroup.querySelector('.categoryBlock')
          this.$d3.select(block)
            .attr('fill', drawColor(obj))
        }
      }
    },
    drawColor (obj) {
      let color = 'transparent'
      if (obj.isBridge === 'Y') {
        color = (_.find(this.colorConfig, ['paramCode', this.colorTypes.nearStand]) || {})[this.colorParamValue] || color
      } else if (obj.isBridge === 'N') {
        color = (_.find(this.colorConfig, ['paramCode', this.colorTypes.farStand]) || {})[this.colorParamValue] || color
      }
      return color
    },
    contextmenu (block, obj) {
      this.$emit('contextmenu', obj)
    },
    dataWatch () {
      let yAxis = this.customYAxis || this.yAxis
      let series = this.customSeries || this.series
      this.$set(this, 'height', (series.data || []).length * yAxis.transStyle.height + yAxis.boundaryGap[0] + yAxis.boundaryGap[1])
      if (this.customYAxis) {
        this.$emit('setSelfData', {key: 'yAxis', ckey: 'height', value: this.height})
      } else {
        this.$store.commit('setGanttConf', {key: this.yAxisKey + '.height', value: this.height})
      }
    }
  },
  watch: {
    refresh: {
      handler (val) {
        this.$set(this, 'ownRefresh', _.cloneDeep(val) || [])
        if (_.intersection(this.ownRefresh, this.name).length) {
          let series = this.customSeries || this.series
          if (!_.isEqual(series.data, this.oldData)) { // all/seriesKey
            this.$set(this, 'oldData', series.data)
            if (series.data.length) {
              this.refreshGantt('all') // init
            } else {
              this.clear()
            }
          } else if (this.initFlag) {
            if (series.data.length) {
              if (_.isEqual(val, ['color'])) { // reInitColor
                this.refreshGantt('reInitColor')
              } else { // reInit
                this.refreshGantt('reInit')
              }
            }
          }
        }
      }
    },
    seriesRef (bool) {
      let series = this.customSeries || this.series
      if (!_.isEqual(series.data, this.oldData)) { // all/seriesKey
        this.$set(this, 'oldData', series.data)
        if (series.data.length) {
          this.refreshGantt('all') // init
        } else {
          this.clear()
        }
      } else if (this.initFlag) {
        if (series.data.length) {
          this.refreshGantt('reInit')
        }
      }
    },
    colorConfig: {
      handler (config, oldConfig) {
        if (_.isEmpty(oldConfig) && !_.isEmpty(config) && this.errorDraw) {
          this.initFuncs.push('init')
          this.allInit()
          this.ownRefresh.splice(0, this.ownRefresh.length)
        }
      },
      deep: true
    },
    'customSeries': {
      handler () {
        this.dataWatch()
      },
      deep: true,
      immediate: true
    },
    'series.data': {
      handler () {
        !this.customSeries && this.dataWatch()
      },
      deep: true,
      immediate: true
    }
  }
}
</script>

<style lang="scss" >
.categoryAxisGroup {
  user-select: none;
  /* .categotyMemberGroup {
    .categoryLabel {
      font-family: 'Microsoft YaHei', sans-serif;
      fill: rgb(51,51,51);
      text-anchor: middle;
      dominant-baseline: middle;
    }
  } */
}
</style>
