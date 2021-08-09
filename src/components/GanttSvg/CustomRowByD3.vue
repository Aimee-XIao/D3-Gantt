<template>
  <g :ref="cId + 'customRow'" :id="cId + 'customRow'" class="customRow">
    <rect ref="customRowHidden" class="customRowHidden" fill="transparent"></rect>
    <rect ref="beforeNow" class="beforeNow" fill="rgba(238, 238, 238, 0.6)"></rect>
    <g class="rowGroup">
      <line class="rowLine" style="stroke: #e0e0e0; stroke-width: 1;"></line>
      <g class="colGroup">
        <path d="" class="colBlock"></path>
        <g class="fontGroup">
          <text class="fontLeft" :fill="'#000'" stroke="none" style="font-size: 18px; text-shadow: #fff 1px 0 0, #fff 0px 1px 0, #fff -1px 0 0, #fff 0 -1px 0; text-anchor: start; dominant-baseline: ideographic;"></text>
          <text class="fontCenter" :fill="'#000'" stroke="none" style="font-size: 18px; text-shadow: #fff 1px 0 0, #fff 0px 1px 0, #fff -1px 0 0, #fff 0 -1px 0; text-anchor: middle; dominant-baseline: ideographic;"></text>
          <text class="fontRight" :fill="'#000'" stroke="none" style="font-size: 18px; text-shadow: #fff 1px 0 0, #fff 0px 1px 0, #fff -1px 0 0, #fff 0 -1px 0; text-anchor: end; dominant-baseline: ideographic;"></text>
        </g>
      </g>
    </g>
    <rect ref="markRect" class="markRect"
      :stroke-dasharray="markRect.bkDash.join(',')"  :fill="markRect.bgColor" :stroke="markRect.bkColor"></rect>
  </g>
</template>

<script>

import basicMsgBoxMixin from '../../mixin/basicMsgMixin'
import _ from 'lodash'
import { mapState } from 'vuex'
import { randomStr, selectIdByCssFilter } from '../../util/util'
export default {
  components: {
  },
  mixins: [basicMsgBoxMixin],
  props: {
    xAxisKey: {
      type: String,
      default: 'xAxis'
    },
    yAxisKey: {
      type: String,
      default: 'yAxis'
    },
    seriesKey: {
      type: String,
      default: 'series'
    },
    colorTypeKey: {
      type: String,
      default: 'colorTypes'
    },
    colorConfigKey: {
      type: String,
      default: 'colorConfig'
    },
    dragType: {
      type: String,
      default: ''
    },
    selfRef: {
      type: String,
      default: ''
    },
    otherRef: {
      type: String,
      default: ''
    },
    refresh: {
      type: Array,
      default: () => []
    },
    seriesRef: {
      default: false
    },
    selfJudge: {
      type: Function
    },
    betweenJudge: {
      type: Function
    },
    rowRegColor: {
      type: Function
    },
    colorParamValue: {
      default: 'paramValue'
    },
    customXAxis: {
      default: null
    },
    customYAxis: {
      default: null
    },
    customSeries: {
      default: null
    }
  },
  data () {
    return {
      cId: '',
      name: ['all', 'start', 'now', 'x', 'fonts', 'color'],
      width: 0,
      height: 0,
      blockRadius: 3,
      rectHidden: null,
      rectMark: null,
      beforeNow: null,
      rowGroup: null,
      colGroup: null,
      oldSMult: 0,
      start: '',
      now: '',
      oldData: [],
      markRect: {
        x: 0,
        y: 0,
        bgColor: 'transparent',
        bkColor: 'transparent',
        bkDash: [5, 5]
      },
      colorDefault: {
        col: '#90ff96',
        unuse: '#8d9092',
        font: '#000000'
      },
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
      xAxis (state) {
        return state.gantt[this.xAxisKey]
      },
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
    margin () {
      let val = (this.customSeries || this.series).rowConf.margin || []
      let margins = {
        top: 0,
        right: 0,
        bottom: 0,
        left: 0
      }
      switch (val.length) {
        case 1: margins.top = val[0]
                margins.bottom = val[0]
                break
        case 2: margins.top = val[0]
                margins.bottom = val[1]
                break
      }
      return margins
    },
    topY () {
      return function (i) {
        return i * (this.customYAxis || this.yAxis).transStyle.height
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
        return ['init']
      } else if (this.initFuncs.includes('reInit')) {
        return ['reInit']
      } else {
        let arr = []
        if (this.initFuncs.includes('reInitFonts')) {
          arr.push('reInitFonts')
        }
        if (this.initFuncs.includes('reInitColor')) {
          arr.push('reInitColor')
        }
        return arr
      }
    },
    computedInOutFlag () {
      return function (obj) {
        if (obj.inOutFlag === 'A|D') {
          if (obj.relateT && !obj.relateF) {
            return 'A'
          } else if (obj.relateF) {
            return 'D'
          }
          return 'A|D'
        }
        return obj.inOutFlag
      }
    }
  },
  created () {
    this.$set(this, 'cId', randomStr())
  },
  methods: {
    refreshGantt (flag) {
      let xAxis = this.customXAxis || this.xAxis
      let yAxis = this.customYAxis || this.yAxis
      let series = this.customSeries || this.series
      if (flag === 'all') {
        if (series && (series.data || []).length) {
          this.initFuncs.push('init')
          this.startFlag = true
          let sTime = new Date(this.start.substr(0, 16) + ':00')
          let lTime = new Date(this.now.substr(0, 16) + ':00')
          let i = (lTime.getTime() - sTime.getTime()) / xAxis.timestempUnit
          let height = (series.data || []).length * yAxis.transStyle.height + yAxis.boundaryGap[0]
          this.$nextTick(() => {
            this.rectHidden = this.$refs[this.cId + 'customRow'].querySelector('.customRowHidden')
            this.rectMark = this.$refs[this.cId + 'customRow'].querySelector('.markRect')
            this.beforeNow = this.$refs[this.cId + 'customRow'].querySelector('.beforeNow')
            this.rowGroup = this.$refs[this.cId + 'customRow'].querySelector('.rowGroup')
            this.colGroup = this.rowGroup.querySelector('.colGroup')
            this.$d3.select(this.rectMark)
              .attr('height', yAxis.transStyle.height)
              .attr('width', xAxis.width - xAxis.boundaryGap[0] - xAxis.boundaryGap[1])
            this.$d3.select(this.rectHidden)
              .attr('width', xAxis.width)
              .attr('height', height)
            let w = this.lineX(i) + xAxis.boundaryGap[0]
            this.$d3.select(this.beforeNow)
              .attr('transform', `translate(0, 0)`)
              .attr('width', w < 0 ? 0 : w)
              .attr('height', height)
            if (this.colorConfig.length) {
              this.allInit()
            } else {
              this.errorDraw = true
            }
          })
        } else {
          this.$nextTick(() => {
            this.rectHidden = this.$refs[this.cId + 'customRow'].querySelector('.customRowHidden')
            this.beforeNow = this.$refs[this.cId + 'customRow'].querySelector('.beforeNow')
            this.$d3.select(this.rectHidden)
              .attr('height', 0)
            this.$d3.select(this.beforeNow)
              .attr('height', 0)
          })
          this.clear()
        }
      } else if (flag === 'redraw') {
        if (series && (series.data || []).length) {
          this.initFuncs.push('reInit')
          let sTime = new Date(this.start.substr(0, 16) + ':00')
          let lTime = new Date(this.now.substr(0, 16) + ':00')
          let i = (lTime.getTime() - sTime.getTime()) / xAxis.timestempUnit
          this.$nextTick(() => {
            this.$d3.select(this.rectMark)
              .attr('height', yAxis.transStyle.height)
              .attr('width', xAxis.width - xAxis.boundaryGap[0] - xAxis.boundaryGap[1])
            this.$d3.select(this.rectHidden)
              .attr('width', xAxis.width)
            let w = this.lineX(i) + xAxis.boundaryGap[0]
            this.$d3.select(this.beforeNow)
              .attr('transform', `translate(0, 0)`)
              .attr('width', w < 0 ? 0 : w)
            this.colorConfig.length && this.allInit()
          })
        } else {
          this.$nextTick(() => {
            this.$d3.select(this.rectHidden)
              .attr('height', 0)
            this.$d3.select(this.beforeNow)
              .attr('height', 0)
          })
          this.clear()
        }
      } else if (flag === 'reInit') {
        this.initFuncs.push('reInit')
        this.colorConfig.length && this.allInit()
      } else if (flag === 'reInitFonts') {
        this.initFuncs.push('reInitFonts')
        this.colorConfig.length && this.allInit()
      } else if (flag === 'reInitColor') {
        this.initFuncs.push('reInitColor')
        this.allInit()
      }
      this.ownRefresh.splice(0, this.ownRefresh.length)
    },
    allInit () {
      if (!this.timer) {
        if ((this.computedFunc || []).length) {
          console.log(this.seriesKey + ' -- cusD3 -- timer -- start => ' + this.computedFunc)
        } else {
          console.log(this.seriesKey + ' -- cusD3 -- timer -- start is cleaning.')
        }
        if ((this.computedFunc || []).length) {
          this.computedFunc.forEach(key => {
            this[key]()
          })
        }
        this.$set(this, 'initFuncs', [])
        this.timer = setTimeout(() => {
          if ((this.computedFunc || []).length) {
            console.log(this.seriesKey + ' -- cusD3 -- timer -- delay => ' + this.computedFunc)
          } else {
            console.log(this.seriesKey + ' -- cusD3 -- timer -- delay is all clear.')
          }
          if ((this.computedFunc || []).length) {
            this.computedFunc.forEach(key => {
              this[key]()
            })
          }
          this.timer = null
        }, this.holdTimes)
      } else {
        console.warn(this.seriesKey + ' -- cusD3 -- ' + 'timering')
      }
    },
    init () {
      let xAxis = this.customXAxis || this.xAxis
      let yAxis = this.customYAxis || this.yAxis
      let series = this.customSeries || this.series
      this.clear()
      let rowGroup, colGroup, colBlock
      let h = yAxis.transStyle.height
      let arrI = series.data || []
      for (let i = 0; i < arrI.length; i++) {
        let topY = this.topY(i) + yAxis.boundaryGap[0]
        rowGroup = this.rowGroup.cloneNode(true)
        this.$refs[this.cId + 'customRow'].appendChild(rowGroup)
        this.$d3.select(rowGroup)
          .attr('id', 'r' + this.seriesKey + arrI[i][series.rowConf.id])
          .attr('transform', `translate(${xAxis.boundaryGap[0]}, ${topY})`)
          .attr('width', xAxis.width - xAxis.boundaryGap[0] - xAxis.boundaryGap[1])
          .attr('height', h - this.margin.top - this.margin.bottom)
          .attr('fill', 'transparent')
          .attr('stroke', '#0c1070')
          .attr('stroke-width', 1)
        this.$d3.select(rowGroup.querySelector('.rowLine'))
          .attr('y1', h - 0.5)
          .attr('x2', xAxis.width - xAxis.boundaryGap[0] - xAxis.boundaryGap[1])
          .attr('y2', h - 0.5)
        if (arrI[i].isUseable === 'N') { // 机位/登机口不可用
          let floatY = 4
          let rect = document.createElementNS(this.$store.getters.getXmlns, 'rect')
          rowGroup.appendChild(rect)
          this.$d3.select(rect)
            .attr('class', 'unuse')
            .attr('transform', `translate(0, ${floatY})`)
            .attr('width', xAxis.width - xAxis.boundaryGap[0] - xAxis.boundaryGap[1])
            .attr('height', h - floatY * 2)
            .attr('fill', (_.find(this.colorConfig, ['paramCode', this.colorTypes.unuse]) || {})[this.colorParamValue] || this.colorDefault.unuse)
            .attr('stroke', 'transparent')
        }
        let arrJ = arrI[i][series.rowConf.value] || []
        if (arrJ.length) {
          for (let j = 0; j < arrJ.length; j++) {
            let s = series.colConf.s
            let e = series.colConf.e
            let doing = false
            if (_.isArray(s) && _.isArray(e)) {
              let tmpS, tmpE
              for (let sIndex = 0; sIndex < s.length; sIndex++) {
                if (_.get(arrJ[j], s[sIndex]) && _.get(arrJ[j], e[sIndex])) {
                  tmpS = s[sIndex]
                  tmpE = e[sIndex]
                  if (sIndex > 0 && _.get(arrJ[j], s[0])) {
                    // 有实际开始没有实际结束
                    doing = true
                    tmpS = s[0]
                  }
                  break
                }
              }
              s = tmpS
              e = tmpE
            }
            if (!s || !e) {
              this.showErrorCustom('配置信息有误', '请检查后重新尝试')
              console.warn('init--s和e为非正常key值')
              break
            }
            if (_.get(arrJ[j], s) && _.get(arrJ[j], e)) {
              // 当前时间
              let now = new Date(this.now.substr(0, 16) + ':00')
              // 甘特图开始时间
              let sTime = new Date(this.start.substr(0, 16) + ':00')
              // 甘特图结束时间
              let eTime = new Date(sTime.getTime() + xAxis.spanning * xAxis.timestempUnit)
              // 甘特条开始时间
              let lTime = new Date(_.get(arrJ[j], s).substr(0, 16) + ':00')
              if (lTime < sTime) {
                lTime = sTime
              } else if (lTime > eTime) {
                lTime = eTime
              }
              let rTime = new Date(_.get(arrJ[j], e).substr(0, 16) + ':00')
              if (rTime > eTime) {
                rTime = eTime
              } else if (doing && rTime < now) {
                rTime = now
              } else if (rTime < sTime) {
                rTime = sTime
              }
              let li = (lTime.getTime() - sTime.getTime()) / xAxis.timestempUnit
              let lX = this.lineX(li)
              let ri = (rTime.getTime() - sTime.getTime()) / xAxis.timestempUnit
              let rX = this.lineX(ri)
              let width = rX - lX
              // let lY = this.margin.top //  + ((j % 2) ? yAxis.offsetY : -yAxis.offsetY)

              colGroup = rowGroup.querySelector('.colGroup').cloneNode(true)
              rowGroup.appendChild(colGroup)
              colBlock = colGroup.querySelector('.colBlock')
              let clickBlock = this.clickBlock
              this.$d3.select(colGroup)
                .attr('id', 'g' + this.seriesKey + (arrJ[j][series.colConf.id] || arrI[i][series.rowConf.id]))
                .attr('transform', `translate(${lX}, ${this.margin.top})`)
                .on('click', function () {
                  clickBlock(colBlock, arrJ[j])
                })
              let blockH = h - this.margin.top - this.margin.bottom
              if (width < 0) {
                continue
              }
              this.$d3.select(colBlock)
                .attr('id', 'c' + this.seriesKey + (arrJ[j][series.colConf.id] || arrI[i][series.rowConf.id]))
                // .attr('x', lX)
                // .attr('y', lY)
                // .attr('width', width)
                // .attr('height', blockH)
                .attr('fill', 'transparent') // '#90ff96')
                .attr('stroke', 'transparent')
                // .attr('stroke-width', 1)
              /* 根据状态判断添加哪些形状 */
              let tmp = this.drawPath(colGroup, 0, 0, width, blockH, arrJ[j], colBlock)
              if (arrJ[j].afid) {
                if (this.dragType === 'self') {
                  let dragstartSelf = this.dragstartSelf
                  let dragSelf = this.dragSelf
                  let dragendSelf = this.dragendSelf
                  let contextmenuSelf = this.contextmenuSelf
                  let dragEvent = this.$d3.drag()
                    .on('start', function () {dragstartSelf(this, arrJ[j])})
                    .on('drag', function () {dragSelf(this, arrJ[j])})
                    .on('end', function () {dragendSelf(this, arrJ[j])})
                  this.$d3.select(colGroup)
                    .on('contextmenu', function () {
                      this.$d3.event.preventDefault()
                      contextmenuSelf(colBlock, arrJ[j])
                    })
                  this.selfJudge(arrJ[j]) && this.$d3.select(colGroup).call(dragEvent)
                } else if (this.dragType === 'between') {
                  let dragstartBetween = this.dragstartBetween
                  let dragBetween = this.dragBetween
                  let dragendBetween = this.dragendBetween
                  let dragEvent = this.$d3.drag()
                    .on('start', function () {dragstartBetween(this, arrJ[j])})
                    .on('drag', function () {dragBetween(this, arrJ[j])})
                    .on('end', function () {dragendBetween(this, arrJ[j])})
                  this.betweenJudge(arrJ[j]) && this.$d3.select(colGroup)
                    .call(dragEvent)
                }
              }
              let fontGroup = colGroup.querySelector('.fontGroup')
              this.$d3.select(fontGroup)
                .attr('transform', `translate(0, 0)`)
              let center = fontGroup.querySelector('.fontCenter')
              this.$d3.select(center)
                .attr('transform', `translate(${width / 2}, ${h / 2})`)
              if (arrJ[j].afid) {
                let inOutFlag = this.computedInOutFlag(arrJ[j])
                let left = fontGroup.querySelector('.fontLeft')
                let right = fontGroup.querySelector('.fontRight')
                // let fontY = h / 2 + 2 // + ((j % 2) ? yAxis.offsetY : -yAxis.offsetY)
                let offsetFontX = 10 + h * 2 / 5
                this.$d3.select(left)
                  .attr('transform', `translate(${offsetFontX}, ${h / 2})`)
                  .attr('fill', this.drawFont(series.colConf.labels[inOutFlag].left, arrJ[j]))
                this.$d3.select(center)
                  .attr('fill', this.drawFont(series.colConf.labels[inOutFlag].center, arrJ[j]))
                this.$d3.select(right)
                  .attr('transform', `translate(${width - offsetFontX}, ${h / 2})`)
                  .attr('fill', this.drawFont(series.colConf.labels[inOutFlag].right, arrJ[j]))
                let show = []
                if (series.colConf.labels[inOutFlag].left && offsetFontX >= tmp.left && (width - offsetFontX) <= tmp.right) {
                  this.$d3.select(left)
                    .text(_.get(arrJ[j], series.colConf.labels[inOutFlag].left))
                  show.push('left')
                }
                if (series.colConf.labels[inOutFlag].center) {
                  this.$d3.select(center)
                    .text(_.get(arrJ[j], series.colConf.labels[inOutFlag].center))
                  show.push('center')
                  if (show.includes('left')) {
                    if ((width / 2 + center.getBBox().x) < (offsetFontX + left.getBBox().width)) {
                      this.$d3.select(left)
                        .text('')
                      _.pull(show, 'left')
                    }
                  }
                  if ((width / 2 + center.getBBox().x) < tmp.left || (width / 2 + center.getBBox().x + center.getBBox().width) > tmp.right) {
                    this.$d3.select(center)
                      .text('')
                    _.pull(show, 'center')
                  }
                }
                if (series.colConf.labels[inOutFlag].right) {
                  if (show.includes('center') || show.includes('left')) {
                    this.$d3.select(right)
                      .text(_.get(arrJ[j], series.colConf.labels[inOutFlag].right))
                    if (show.includes('center')) {
                      if ((width - offsetFontX + right.getBBox().x) < (width / 2 + center.getBBox().x + center.getBBox().width)) {
                        this.$d3.select(right)
                          .text('')
                      }
                    } else if (show.includes('left')) {
                      if ((width - offsetFontX + right.getBBox().x) < (offsetFontX + left.getBBox().width)) {
                        this.$d3.select(right)
                          .text('')
                      }
                    }
                  }
                }
              } else {
                this.$d3.select(center)
                  .attr('fill', (_.find(this.colorConfig, ['paramCode', this.colorTypes.fontAircraft]) || {})[this.colorParamValue] || this.colorDefault.font)
                  .text(_.get(arrJ[j], series.colConf.aircraftLabel))
              }
            }
          }
        }
      }
      this.initFlag = true
    },
    reInit () {
      let xAxis = this.customXAxis || this.xAxis
      let yAxis = this.customYAxis || this.yAxis
      let series = this.customSeries || this.series
      let rowGroup, colGroup, colBlock
      let h = yAxis.transStyle.height
      let arrI = series.data || []
      for (let i = 0; i < arrI.length; i++) {
        let topY = this.topY(i) + yAxis.boundaryGap[0]
        rowGroup = this.$refs[this.cId + 'customRow'].querySelector(selectIdByCssFilter('#r' + this.seriesKey + arrI[i][series.rowConf.id]))
        this.$d3.select(rowGroup)
          .attr('transform', `translate(${xAxis.boundaryGap[0]}, ${topY})`)
          .attr('width', xAxis.width - xAxis.boundaryGap[0] - xAxis.boundaryGap[1])
          .attr('height', h - this.margin.top - this.margin.bottom)
          .attr('fill', 'transparent')
          .attr('stroke', '#0c1070')
          .attr('stroke-width', 1)
        this.$d3.select(rowGroup.querySelector('.rowLine'))
          .attr('y1', h - 0.5)
          .attr('x2', xAxis.width - xAxis.boundaryGap[0] - xAxis.boundaryGap[1])
          .attr('y2', h - 0.5)
        if (arrI[i].isUseable === 'N') { // 机位/登机口不可用
          let floatY = 4
          let rect = rowGroup.querySelector('.unuse')
          if (!rect) {
            rect = document.createElementNS(this.$store.getters.getXmlns, 'rect')
            rowGroup.appendChild(rect)
          }
          this.$d3.select(rect)
            .attr('transform', `translate(0, ${floatY})`)
            .attr('width', xAxis.width - xAxis.boundaryGap[0] - xAxis.boundaryGap[1])
            .attr('height', h - floatY * 2)
            .attr('fill', (_.find(this.colorConfig, ['paramCode', this.colorTypes.unuse]) || {})[this.colorParamValue] || this.colorDefault.unuse)
            .attr('stroke', 'transparent')
        } else {
          let rect = rowGroup.querySelector('.unuse')
          if (rect) {
            rect.remove()
          }
        }
        let arrJ = arrI[i][series.rowConf.value] || []
        if (arrJ.length) {
          for (let j = 0; j < arrJ.length; j++) {
            let s = series.colConf.s
            let e = series.colConf.e
            let doing = false
            if (_.isArray(s) && _.isArray(e)) {
              let tmpS, tmpE
              for (let sIndex = 0; sIndex < s.length; sIndex++) {
                if (_.get(arrJ[j], s[sIndex]) && _.get(arrJ[j], e[sIndex])) {
                  tmpS = s[sIndex]
                  tmpE = e[sIndex]
                  if (sIndex > 0 && _.get(arrJ[j], s[0])) {
                    // 有实际开始没有实际结束
                    doing = true
                    tmpS = s[0]
                  }
                  break
                }
              }
              s = tmpS
              e = tmpE
            }
            if (!s || !e) {
              this.showErrorCustom('配置信息有误', '请检查后重新尝试')
              console.warn('reInit--s和e为非正常key值')
              break
            }
            if (_.get(arrJ[j], s) && _.get(arrJ[j], e)) {
              // 当前时间
              let now = new Date(this.now.substr(0, 16) + ':00')
              // 甘特图开始时间
              let sTime = new Date(this.start.substr(0, 16) + ':00')
              // 甘特图结束时间
              let eTime = new Date(sTime.getTime() + xAxis.spanning * xAxis.timestempUnit)
              // 甘特条开始时间
              let lTime = new Date(_.get(arrJ[j], s).substr(0, 16) + ':00')
              if (lTime < sTime) {
                lTime = sTime
              } else if (lTime > eTime) {
                lTime = eTime
              }
              let rTime = new Date(_.get(arrJ[j], e).substr(0, 16) + ':00')
              if (rTime > eTime) {
                rTime = eTime
              } else if (doing && rTime < now) {
                rTime = now
              } else if (rTime < sTime) {
                rTime = sTime
              }
              let li = (lTime.getTime() - sTime.getTime()) / xAxis.timestempUnit
              let lX = this.lineX(li)
              let ri = (rTime.getTime() - sTime.getTime()) / xAxis.timestempUnit
              let rX = this.lineX(ri)
              let width = rX - lX
              // let lY = this.margin.top //  + ((j % 2) ? yAxis.offsetY : -yAxis.offsetY)

              colGroup = rowGroup.querySelector(selectIdByCssFilter('#g' + this.seriesKey + (arrJ[j][series.colConf.id] || arrI[i][series.rowConf.id])))
              if (colGroup) {
                colBlock = colGroup.querySelector('.colBlock')
                let clickBlock = this.clickBlock
                this.$d3.select(colGroup)
                  .attr('id', 'g' + this.seriesKey + (arrJ[j][series.colConf.id] || arrI[i][series.rowConf.id]))
                  .attr('transform', `translate(${lX}, ${this.margin.top})`)
                  .on('click', function () {
                    clickBlock(colBlock, arrJ[j])
                  })
                let blockH = h - this.margin.top - this.margin.bottom
                if (width < 0) {
                  continue
                }
                this.$d3.select(colBlock)
                  .attr('id', 'c' + this.seriesKey + (arrJ[j][series.colConf.id] || arrI[i][series.rowConf.id]))
                  .attr('fill', 'transparent') // '#90ff96')
                  .attr('stroke', 'transparent')
                  // .attr('stroke-width', 1)
                /* 根据状态判断添加哪些形状 */
                let tmp = this.drawPath(colGroup, 0, 0, width, blockH, arrJ[j], colBlock)
                let fontGroup = colGroup.querySelector('.fontGroup')
                this.$d3.select(fontGroup)
                  .attr('transform', `translate(0, 0)`)
                let center = fontGroup.querySelector('.fontCenter')
                this.$d3.select(center)
                  .attr('transform', `translate(${width / 2}, ${h / 2})`)
                if (arrJ[j].afid) {
                  let inOutFlag = this.computedInOutFlag(arrJ[j])
                  if (this.dragType === 'self') {
                    let dragstartSelf = this.dragstartSelf
                    let dragSelf = this.dragSelf
                    let dragendSelf = this.dragendSelf
                    let contextmenuSelf = this.contextmenuSelf
                    let dragEvent = this.$d3.drag()
                      .on('start', function () {dragstartSelf(this, arrJ[j])})
                      .on('drag', function () {dragSelf(this, arrJ[j])})
                      .on('end', function () {dragendSelf(this, arrJ[j])})
                    let dragNoneEvent = this.$d3.drag()
                      .on('start', null)
                      .on('drag', null)
                      .on('end', null)
                    this.$d3.select(colGroup)
                      .on('contextmenu', function () {
                        this.$d3.event.preventDefault()
                        contextmenuSelf(colBlock, arrJ[j])
                      })
                    this.$d3.select(colGroup)
                      .call(this.selfJudge(arrJ[j]) ? dragEvent : dragNoneEvent)
                  } else if (this.dragType === 'between') {
                    let dragstartBetween = this.dragstartBetween
                    let dragBetween = this.dragBetween
                    let dragendBetween = this.dragendBetween
                    let dragEvent = this.$d3.drag()
                      .on('start', function () {dragstartBetween(this, arrJ[j])})
                      .on('drag', function () {dragBetween(this, arrJ[j])})
                      .on('end', function () {dragendBetween(this, arrJ[j])})
                    let dragNoneEvent = this.$d3.drag()
                      .on('start', null)
                      .on('drag', null)
                      .on('end', null)
                    this.$d3.select(colGroup)
                      .call(this.betweenJudge(arrJ[j]) ? dragEvent : dragNoneEvent)
                  }
                  let left = fontGroup.querySelector('.fontLeft')
                  let right = fontGroup.querySelector('.fontRight')
                  // let fontY = h / 2 + 2 // + ((j % 2) ? yAxis.offsetY : -yAxis.offsetY)
                  let offsetFontX = 10 + h * 2 / 5
                  this.$d3.select(left)
                    .attr('transform', `translate(${offsetFontX}, ${h / 2})`)
                    .attr('fill', this.drawFont(series.colConf.labels[inOutFlag].left, arrJ[j]))
                  this.$d3.select(center)
                    .attr('fill', this.drawFont(series.colConf.labels[inOutFlag].center, arrJ[j]))
                  this.$d3.select(right)
                    .attr('transform', `translate(${width - offsetFontX}, ${h / 2})`)
                    .attr('fill', this.drawFont(series.colConf.labels[inOutFlag].right, arrJ[j]))
                  let show = []
                  if (series.colConf.labels[inOutFlag].left && offsetFontX >= tmp.left && (width - offsetFontX) <= tmp.right) {
                    this.$d3.select(left)
                      .text(_.get(arrJ[j], series.colConf.labels[inOutFlag].left))
                    show.push('left')
                  } else {
                    this.$d3.select(left)
                      .text('')
                  }
                  if (series.colConf.labels[inOutFlag].center) {
                    this.$d3.select(center)
                      .text(_.get(arrJ[j], series.colConf.labels[inOutFlag].center))
                    show.push('center')
                    if (show.includes('left')) {
                      if ((width / 2 + center.getBBox().x) < (offsetFontX + left.getBBox().width)) {
                        this.$d3.select(left)
                          .text('')
                        _.pull(show, 'left')
                      }
                    }
                    if ((width / 2 + center.getBBox().x) < tmp.left || (width / 2 + center.getBBox().x + center.getBBox().width) > tmp.right) {
                      this.$d3.select(center)
                        .text('')
                      _.pull(show, 'center')
                    }
                  }
                  if (series.colConf.labels[inOutFlag].right) {
                    if (show.includes('center') || show.includes('left')) {
                      this.$d3.select(right)
                        .text(_.get(arrJ[j], series.colConf.labels[inOutFlag].right))
                      if (show.includes('center')) {
                        if ((width - offsetFontX + right.getBBox().x) < (width / 2 + center.getBBox().x + center.getBBox().width)) {
                          this.$d3.select(right)
                            .text('')
                        }
                      } else if (show.includes('left')) {
                        if ((width - offsetFontX + right.getBBox().x) < (offsetFontX + left.getBBox().width)) {
                          this.$d3.select(right)
                            .text('')
                        }
                      }
                    }
                  }
                } else {
                  this.$d3.select(center)
                    .attr('fill', (_.find(this.colorConfig, ['paramCode', this.colorTypes.fontAircraft]) || {})[this.colorParamValue] || this.colorDefault.font)
                    .text(_.get(arrJ[j], series.colConf.aircraftLabel))
                }
              }
            }
          }
        }
      }
    },
    reInitFonts () {
      let yAxis = this.customYAxis || this.yAxis
      let series = this.customSeries || this.series
      let rowGroup, colGroup, colBlock
      let h = yAxis.transStyle.height
      let arrI = series.data || []
      for (let i = 0; i < arrI.length; i++) {
        let topY = this.topY(i) + yAxis.boundaryGap[0]
        rowGroup = this.$refs[this.cId + 'customRow'].querySelector(selectIdByCssFilter('#r' + this.seriesKey + arrI[i][series.rowConf.id]))
        let arrJ = arrI[i][series.rowConf.value] || []
        if (arrJ.length) {
          for (let j = 0; j < arrJ.length; j++) {
            let s = series.colConf.s
            let e = series.colConf.e
            if (_.isArray(s) && _.isArray(e)) {
              let tmpS, tmpE
              for (let sIndex = 0; sIndex < s.length; sIndex++) {
                if (_.get(arrJ[j], s[sIndex]) && _.get(arrJ[j], e[sIndex])) {
                  tmpS = s[sIndex]
                  tmpE = e[sIndex]
                  if (sIndex > 0 && _.get(arrJ[j], s[0])) {
                    // 有实际开始没有实际结束
                    tmpS = s[0]
                  }
                  break
                }
              }
              s = tmpS
              e = tmpE
            }
            if (!s || !e) {
              this.showErrorCustom('配置信息有误', '请检查后重新尝试')
              console.warn('reInitFonts--s和e为非正常key值')
              break
            }
            if (_.get(arrJ[j], s) && _.get(arrJ[j], e)) {
              let blockH = h - this.margin.top - this.margin.bottom
              colGroup = rowGroup.querySelector(selectIdByCssFilter('#g' + this.seriesKey + (arrJ[j][series.colConf.id] || arrI[i][series.rowConf.id])))
              colBlock = colGroup.querySelector('.colBlock')
              let width = colBlock.getBoundingClientRect().width
              let tmp = this.getPadding(0, width, blockH, arrJ[j])
              let fontGroup = colGroup.querySelector('.fontGroup')
              let center = fontGroup.querySelector('.fontCenter')
              if (arrJ[j].afid) {
                let inOutFlag = this.computedInOutFlag(arrJ[j])
                let offsetFontX = 10 + h * 2 / 5
                let left = fontGroup.querySelector('.fontLeft')
                let right = fontGroup.querySelector('.fontRight')
                this.$d3.select(left).attr('fill', this.drawFont(series.colConf.labels[inOutFlag].left, arrJ[j]))
                this.$d3.select(center).attr('fill', this.drawFont(series.colConf.labels[inOutFlag].center, arrJ[j]))
                this.$d3.select(right).attr('fill', this.drawFont(series.colConf.labels[inOutFlag].right, arrJ[j]))
                let show = []
                if (series.colConf.labels[inOutFlag].left && offsetFontX >= tmp.left && (width - offsetFontX) <= tmp.right) {
                  this.$d3.select(left)
                    .text(_.get(arrJ[j], series.colConf.labels[inOutFlag].left))
                  show.push('left')
                } else {
                  this.$d3.select(left)
                    .text('')
                }
                if (series.colConf.labels[inOutFlag].center) {
                  this.$d3.select(center)
                    .text(_.get(arrJ[j], series.colConf.labels[inOutFlag].center))
                  show.push('center')
                  if (show.includes('left')) {
                    if ((width / 2 + center.getBBox().x) < (offsetFontX + left.getBBox().width)) {
                      this.$d3.select(left)
                        .text('')
                      _.pull(show, 'left')
                    }
                  }
                  if ((width / 2 + center.getBBox().x) < tmp.left || (width / 2 + center.getBBox().x + center.getBBox().width) > tmp.right) {
                    this.$d3.select(center)
                      .text('')
                    _.pull(show, 'center')
                  }
                }
                if (series.colConf.labels[inOutFlag].right) {
                  if (show.includes('center') || show.includes('left')) {
                    this.$d3.select(right)
                      .text(_.get(arrJ[j], series.colConf.labels[inOutFlag].right))
                    if (show.includes('center')) {
                      if ((width - offsetFontX + right.getBBox().x) < (width / 2 + center.getBBox().x + center.getBBox().width)) {
                        this.$d3.select(right)
                          .text('')
                      }
                    } else if (show.includes('left')) {
                      if ((width - offsetFontX + right.getBBox().x) < (offsetFontX + left.getBBox().width)) {
                        this.$d3.select(right)
                          .text('')
                      }
                    }
                  }
                }
              } else {
                this.$d3.select(center)
                  .text(_.get(arrJ[j], series.colConf.aircraftLabel))
              }
            }
          }
        }
      }
    },
    reInitColor () {
      let yAxis = this.customYAxis || this.yAxis
      let series = this.customSeries || this.series
      let rowGroup, colGroup, colBlock
      let h = yAxis.transStyle.height
      let arrI = series.data || []
      for (let i = 0; i < arrI.length; i++) {
        rowGroup = this.$refs[this.cId + 'customRow'].querySelector(selectIdByCssFilter('#r' + this.seriesKey + arrI[i][series.rowConf.id]))
        let rect = rowGroup.querySelector('.unuse')
        rect && this.$d3.select(rect)
          .attr('fill', (_.find(this.colorConfig, ['paramCode', this.colorTypes.unuse]) || {})[this.colorParamValue] || this.colorDefault.unuse)
        let arrJ = arrI[i][series.rowConf.value] || []
        if (arrJ.length) {
          for (let j = 0; j < arrJ.length; j++) {
            colGroup = rowGroup.querySelector(selectIdByCssFilter('#g' + this.seriesKey + (arrJ[j][series.colConf.id] || arrI[i][series.rowConf.id])))
            if (rowGroup) {
              colBlock = colGroup.querySelector('.colBlock')
              if (!colBlock) {
                continue
              }
              this.$d3.select(colBlock)
                .attr('fill', 'transparent') // '#90ff96')
                .attr('stroke', 'transparent')
              /* 根据状态判断添加哪些形状 */
              this.redrawPathColor(colGroup, arrJ[j], colBlock)
              let fontGroup = colGroup.querySelector('.fontGroup')
              let left = fontGroup.querySelector('.fontLeft')
              let center = fontGroup.querySelector('.fontCenter')
              let right = fontGroup.querySelector('.fontRight')
              this.$d3.select(fontGroup)
                .attr('transform', `translate(0, 0)`)
              this.$d3.select(center)
              if (arrJ[j].afid) {
                let inOutFlag = this.computedInOutFlag(arrJ[j])
                let left = fontGroup.querySelector('.fontLeft')
                let right = fontGroup.querySelector('.fontRight')
                this.$d3.select(left).attr('fill', this.drawFont(series.colConf.labels[inOutFlag].left, arrJ[j]))
                this.$d3.select(center).attr('fill', this.drawFont(series.colConf.labels[inOutFlag].center, arrJ[j]))
                this.$d3.select(right).attr('fill', this.drawFont(series.colConf.labels[inOutFlag].right, arrJ[j]))
              } else {
                this.$d3.select(center)
                  .attr('fill', (_.find(this.colorConfig, ['paramCode', this.colorTypes.fontAircraft]) || {})[this.colorParamValue] || this.colorDefault.font)
              }
            }
          }
        }
      }
    },
    clear () {
      if (this.rowGroup && this.colGroup) {
        if (this.$refs[this.cId + 'customRow'].querySelectorAll('.rowGroup').length) {
          Array.from(this.$refs[this.cId + 'customRow'].querySelectorAll('.rowGroup')).forEach((child, i) => {
            i && this.$refs[this.cId + 'customRow'].removeChild(child)
          })
        }
      }
    },
    getPadding (x, w, h, obj) {
      let inOutFlag = this.computedInOutFlag(obj)
      let tmp = {
        left: 0,
        right: w
      }
      let offsetX = 6
      let float = 10
      let floatX = h / 4
      let t = h / 2
      if (!obj.afid) {
        return
      }
      if (inOutFlag.includes('A') && obj.expressFlagA !== 'Y') { // 左箭头<
        // 非快线
        // 单进：左箭头<
        // 一进一出：左右箭头<>
        tmp.left = x + offsetX + floatX
      }
      if (inOutFlag.includes('D') && obj.expressFlagD !== 'Y') { // 右箭头>
        // 非快线
        // 单出：右箭头>
        // 一进一出：左右箭头<>
        tmp.right = x + w - offsetX - floatX
      }
      if (obj.expressFlagA === 'Y' && inOutFlag.includes('A')) { // 左三角◁
        // 进港快线：左三角◁
        tmp.left = x + t
      }
      if (obj.expressFlagD === 'Y' && inOutFlag.includes('D')) { // 右三角▷
        // 出港快线：右三角▷
        tmp.right = x + w - t
      }
      if (obj.relateF) { // 左三角◀
        // 分割后：箭头 + 左三角◀
        tmp.left = x + floatX + float
      }
      if (obj.relateT) { // 右三角▶
        // 分割前：箭头 + 右三角▶
        tmp.right = x + w - floatX - float
      }
      return tmp
    },
    drawPath (colGroup, x, y, w, h, obj, colBlock) {
      let inOutFlag = this.computedInOutFlag(obj)
      let tmp = {
        left: 0,
        right: w
      }
      let offsetX = 6
      let float = 10
      let floatY = h / 4 - 0.5
      let floatX = h / 4
      let t = h / 2
      let radius = 3
      let blockPath = []
      if (!obj.afid) {
        let points = []
        points.push(['M', x + t, y].join(' '))
        points.push(['H', x + w - t].join(' '))
        points.push(['L', x + w, y + h / 2].join(' '))
        points.push(['L', x + w - t, y + h].join(' '))
        points.push(['H', x + t].join(' '))
        points.push(['L', x, y + h / 2].join(' '))
        points.push('Z')
        /* points.push(x + t)
        points.push([y, x + w - t].join(' '))
        points.push([y, x + w].join(' '))
        points.push([y + h / 2, x + w - t].join(' '))
        points.push([y + h, x + t].join(' '))
        points.push([y + h, x].join(' '))
        points.push(y + h / 2) */
        this.$d3.select(colBlock)
          .attr('d', points)
          .attr('fill', (_.find(this.colorConfig, ['paramCode', this.colorTypes.aircraftOccupied]) || {})[this.colorParamValue] || this.colorDefault.col)
          .attr('stroke', '#4C4C4C')
        return
      }
      let colorsKey = []
      if (obj.timeConflict === 'Y') {
        colorsKey.push((_.find(this.colorConfig, ['paramCode', this.colorTypes.timeConflict]) || {})[this.colorParamValue] || this.colorDefault.col)
      } else {
        colorsKey = this.getFlightColor(obj)
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
          colorsKey.pop()
        }
      }
      if (obj.confirmedFlag === 'Y') {
        // 确认：左右空白K和反向K
        let points = []
        points.push(['M', x + t, y].join(' '))
        points.push(['H', x + w - t].join(' '))
        points.push(['L', x + w, y + h / 2].join(' '))
        points.push(['L', x + w - t, y + h].join(' '))
        points.push(['H', x + t].join(' '))
        points.push(['L', x, y + h / 2].join(' '))
        points.push('Z')
        /* points.push(x + t)
        points.push([y, x + w - t].join(' '))
        points.push([y, x + w].join(' '))
        points.push([y + h / 2, x + w - t].join(' '))
        points.push([y + h, x + t].join(' '))
        points.push([y + h, x].join(' '))
        points.push(y + h / 2) */
        blockPath = points
        this.$d3.select(colBlock)
          .attr('d', points)
          .attr('fill', colorsKey[0] || 'transparent')
          .attr('stroke-linejoin', 'round')
          .attr('rx', 0)
        let pathD = colGroup.querySelector('.fillD')
        if (colorsKey.length > 1) {
          if (!pathD) {
            pathD = document.createElementNS(this.$store.getters.getXmlns, 'path')
            colGroup.insertBefore(pathD, colBlock.nextElementSibling)
          }
          let pointsD = []
          pointsD.push(['M', x + w / 2, y].join(' '))
          pointsD.push(['H', x + w - t].join(' '))
          pointsD.push(['L', x + w, y + h / 2].join(' '))
          pointsD.push(['L', x + w - t, y + h].join(' '))
          pointsD.push(['H', x + w / 2].join(' '))
          pointsD.push('Z')
          /* points.push(x + w / 2)
          points.push([y, x + w - t].join(' '))
          points.push([y, x + w].join(' '))
          points.push([y + h / 2, x + w - t].join(' '))
          points.push([y + h, x + w / 2].join(' '))
          points.push(y + h) */
          this.$d3.select(pathD)
            .attr('class', 'fillD')
            .attr('d', pointsD)
            .attr('fill', colorsKey[1] || 'transparent')
            .attr('stroke', colorsKey[1] || 'transparent')
        } else {
          pathD && pathD.remove()
        }
      } else {
        let points = []
        points.push(['M', x + radius, y].join(' '))
        points.push(['H', x + w - radius].join(' '))
        points.push(['Q', x + w, [y, x + w].join(), y + radius].join(' '))
        points.push(['V', y + h - radius].join(' '))
        points.push(['Q', x + w, [y + h, x + w - radius].join(), y + h].join(' '))
        points.push(['H', x + radius].join(' '))
        points.push(['Q', x, [y + h, x].join(), y + h - radius].join(' '))
        points.push(['V', y + radius].join(' '))
        points.push(['Q', x, [y, x + radius].join(), y].join(' '))
        points.push('Z')
        blockPath = points
        this.$d3.select(colBlock)
          .attr('d', points)
          .attr('fill', colorsKey[0] || 'transparent')
          .attr('rx', this.blockRadius)
        let pathD = colGroup.querySelector('.fillD')
        if (colorsKey.length > 1) {
          if (!pathD) {
            pathD = document.createElementNS(this.$store.getters.getXmlns, 'path')
            colGroup.insertBefore(pathD, colBlock.nextElementSibling)
          }
          let pointsD = []
          pointsD.push(['M', x + w / 2, y].join(' '))
          pointsD.push(['H', x + w - radius].join(' '))
          pointsD.push(['Q', x + w, [y, x + w].join(), y + radius].join(' '))
          pointsD.push(['V', y + h - radius].join(' '))
          pointsD.push(['Q', x + w, [y + h, x + w - radius].join(), y + h].join(' '))
          pointsD.push(['H', x + w / 2].join(' '))
          pointsD.push(['V', y].join(' '))
          pointsD.push('Z')
          this.$d3.select(pathD)
            .attr('class', 'fillD')
            // .attr('points', `${w / 2},0 ${w},0 ${w},${h} ${w / 2},${h}`)
            .attr('d', pointsD)
            .attr('fill', colorsKey[1] || 'transparent')
            .attr('stroke', colorsKey[1] || 'transparent')
        } else {
          pathD && pathD.remove()
        }
      }
      if (inOutFlag.includes('A') && obj.expressFlagA !== 'Y') { // 左箭头<
        // 非快线
        // 单进：左箭头<
        // 一进一出：左右箭头<>
        let path = colGroup.querySelector('.in')
        if (!path) {
          path = document.createElementNS(this.$store.getters.getXmlns, 'path')
          colGroup.appendChild(path)
        }
        let points = []
        points.push(['M', x + offsetX + floatX, y + h / 6].join(' '))
        points.push(['L', x + offsetX, y + h / 2].join(' '))
        points.push(['L', x + offsetX + floatX, y + h - h / 6].join(' '))
        /* points.push(x + offsetX + floatX)
        points.push([y + floatY, x + offsetX].join(' '))
        points.push([y + h / 2, x + offsetX + floatX].join(' '))
        points.push(y - floatY + h) */
        this.$d3.select(path)
          .attr('class', 'in')
          .attr('d', points)
          .attr('fill', 'transparent')
          .attr('stroke', '#4C4C4C')
          .attr('stroke-width', 2)
          .attr('stroke-linejoin', 'round')
        tmp.left = x + offsetX + floatX
      } else {
        let path = colGroup.querySelector('.in')
        path && path.remove()
      }
      if (inOutFlag.includes('D') && obj.expressFlagD !== 'Y') { // 右箭头>
        // 非快线
        // 单出：右箭头>
        // 一进一出：左右箭头<>
        let path = colGroup.querySelector('.out')
        if (!path) {
          path = document.createElementNS(this.$store.getters.getXmlns, 'path')
          colGroup.appendChild(path)
        }
        let points = []
        points.push(['M', x + w - offsetX - floatX, y + floatY].join(' '))
        points.push(['L', x + w - offsetX, y + h / 2].join(' '))
        points.push(['L', x + w - offsetX - floatX, y + h - floatY].join(' '))
        /* points.push(x + w - offsetX - floatX)
        points.push([y + floatY, x + w - offsetX].join(' '))
        points.push([y + h / 2, x + w - offsetX - floatX].join(' '))
        points.push(y - floatY + h) */
        this.$d3.select(path)
          .attr('class', 'out')
          .attr('d', points)
          .attr('fill', 'transparent')
          .attr('stroke', '#4C4C4C')
          .attr('stroke-width', 2)
          .attr('stroke-linejoin', 'round')
        tmp.right = x + w - offsetX - floatX
      } else {
        let path = colGroup.querySelector('.out')
        path && path.remove()
      }
      if (obj.expressFlagA === 'Y' && inOutFlag.includes('A')) { // 左三角◁
        // 进港快线：左三角◁
        let path = colGroup.querySelector('.in-express')
        if (!path) {
          path = document.createElementNS(this.$store.getters.getXmlns, 'path')
          colGroup.appendChild(path)
        }
        let points = []
        points.push(['M', x + t * 2 / 3, y + h / 6].join(' '))
        points.push(['L', x, y + h / 2].join(' '))
        points.push(['L', x + t * 2 / 3, y + h - h / 6].join(' '))
        points.push('Z')
        /* points.push(x + t)
        points.push([y, x].join(' '))
        points.push([y + h / 2, x + t].join(' '))
        points.push(y + h) */
        this.$d3.select(path)
          .attr('class', 'in-express')
          .attr('d', points)
          .attr('fill', '#4C4C4C')
          .attr('stroke', 'transparent')
        tmp.left = x + t
      } else {
        let path = colGroup.querySelector('.in-express')
        path && path.remove()
      }
      if (obj.expressFlagD === 'Y' && inOutFlag.includes('D')) { // 右三角▷
        // 出港快线：右三角▷
        let path = colGroup.querySelector('.out-express')
        if (!path) {
          path = document.createElementNS(this.$store.getters.getXmlns, 'path')
          colGroup.appendChild(path)
        }
        let points = []
        points.push(['M', x + w - t * 2 / 3, y + floatY].join(' '))
        points.push(['L', x + w, y + h / 2].join(' '))
        points.push(['L', x + w - t * 2 / 3, y + h - floatY].join(' '))
        points.push('Z')
        /* points.push(x + w - t)
        points.push([y, x + w].join(' '))
        points.push([y + h / 2, x + w - t].join(' '))
        points.push(y + h) */
        this.$d3.select(path)
          .attr('class', 'out-express')
          .attr('d', points)
          .attr('fill', '#4C4C4C')
          .attr('stroke', 'transparent')
        tmp.right = x + w - t
      } else {
        let path = colGroup.querySelector('.out-express')
        path && path.remove()
      }
      if (obj.lockedFlag === 'Y') { // 边框▭
        // 锁定：边框▭
        let path = colGroup.querySelector('.locked')
        if (!path) {
          path = document.createElementNS(this.$store.getters.getXmlns, 'path')
          colGroup.appendChild(path)
        }
        this.$d3.select(path)
          .attr('class', 'locked')
          .attr('d', blockPath)
          // .attr('transform', `translate(${x}, ${y})`)
          // .attr('width', w)
          // .attr('height', h)
          .attr('fill', 'transparent')
          .attr('stroke', '#4C4C4C')
          .attr('stroke-width', 1)
      } else {
        let path = colGroup.querySelector('.locked')
        path && path.remove()
      }
      if (obj.relateF) { // 左三角◀
        // 分割后：箭头 + 左三角◀
        let path = colGroup.querySelector('.split-before')
        if (!path) {
          path = document.createElementNS(this.$store.getters.getXmlns, 'path')
          colGroup.appendChild(path)
        }
        let points = []
        points.push(['M', x + floatX + float, y + floatY].join(' '))
        points.push(['L', x + float, y + h / 2].join(' '))
        points.push(['L', x + floatX + float, y - floatY + h].join(' '))
        points.push('Z')
        /* points.push(x + floatX + float)
        points.push([y + floatY, x + float].join(' '))
        points.push([y + h / 2, x + floatX + float].join(' '))
        points.push(y - floatY + h) */
        this.$d3.select(path)
          .attr('class', 'split-before')
          .attr('d', points)
          .attr('fill', '#4C4C4C')
          .attr('stroke', '#4C4C4C')
          .attr('stroke-width', 2)
          .attr('stroke-linejoin', 'round')
        tmp.left = x + floatX + float
      } else {
        let path = colGroup.querySelector('.split-before')
        path && path.remove()
      }
      if (obj.relateT) { // 右三角▶
        // 分割前：箭头 + 右三角▶
        let path = colGroup.querySelector('.split-after')
        if (!path) {
          path = document.createElementNS(this.$store.getters.getXmlns, 'path')
          colGroup.appendChild(path)
        }
        let points = []
        points.push(['M', x + w - floatX - float, y + floatY].join(' '))
        points.push(['L', x + w - float, y + h / 2].join(' '))
        points.push(['L', x + w - floatX - float, y - floatY + h].join(' '))
        points.push('Z')
        /* points.push(x + w - floatX - float)
        points.push([y + floatY, x + w - float].join(' '))
        points.push([y + h / 2, x + w - floatX - float].join(' '))
        points.push(y - floatY + h) */
        this.$d3.select(path)
          .attr('class', 'split-after')
          .attr('d', points)
          .attr('fill', '#4C4C4C')
          .attr('stroke', '#4C4C4C')
          .attr('stroke-width', 2)
          .attr('stroke-linejoin', 'round')
        tmp.right = x + w - floatX - float
      } else {
        let path = colGroup.querySelector('.split-after')
        path && path.remove()
      }
      return tmp
    },
    drawFont (fontKey, obj) {
      let color = this.colorDefault.font
      if (['flightNumA', 'flightNumD'].includes(fontKey)) {
        color = (_.find(this.colorConfig, ['paramCode', this.colorTypes['font' + _.get(obj, 'attr' + fontKey.replace('flightNum', ''))]]) || {})[this.colorParamValue] || this.colorDefault.font
      }
      return color
    },
    redrawPathColor (colGroup, obj, colBlock) {
      let inOutFlag = this.computedInOutFlag(obj)
      if (!obj.afid) {
        this.$d3.select(colBlock)
          .attr('fill', (_.find(this.colorConfig, ['paramCode', this.colorTypes.aircraftOccupied]) || {})[this.colorParamValue] || this.colorDefault.col)
        return
      }
      let colorsKey = []
      if (obj.timeConflict === 'Y') {
        colorsKey.push((_.find(this.colorConfig, ['paramCode', this.colorTypes.timeConflict]) || {})[this.colorParamValue] || this.colorDefault.col)
      } else {
        colorsKey = this.getFlightColor(obj)
        if (colorsKey.length === 2 && colorsKey[0] === colorsKey[1]) {
          colorsKey.pop()
        }
      }
      if (obj.confirmedFlag === 'Y') { // 重叠时有问题
        // 确认：左右空白K和反向K
        this.$d3.select(colBlock)
          .attr('fill', colorsKey[0] || 'transparent')
        let pathD = colGroup.querySelector('.fillD')
        if (colorsKey.length > 1) {
          this.$d3.select(pathD)
            .attr('fill', colorsKey[1] || 'transparent')
            .attr('stroke', colorsKey[1] || 'transparent')
        }
      } else {
        this.$d3.select(colBlock)
          .attr('fill', colorsKey[0] || 'transparent')
        let pathD = colGroup.querySelector('.fillD')
        if (colorsKey.length > 1) {
          this.$d3.select(pathD)
            .attr('fill', colorsKey[1] || 'transparent')
            .attr('stroke', colorsKey[1] || 'transparent')
        }
      }
    },
    getFlightColor (obj) {
      if (this.$parent.getFlightColor) {
        return this.$parent.getFlightColor(obj, this.colorParamValue, this.colorDefault.col)
      } else if (this.$parent.$parent.getFlightColor) {
        return this.$parent.$parent.getFlightColor(obj, this.colorParamValue, this.colorDefault.col)
      }
      return []
    },
    clickBlock (block, obj) {
      this.$emit('clickBlock', obj)
    },
    contextmenuSelf (block, obj) {
      this.$emit('contextmenu', obj)
    },
    dragstartSelf (_this, obj) {
      let pNode = document.getElementById('ganttArea')
      let dragSvg = document.createElementNS(this.$store.getters.getXmlns, 'svg')
      let dragEl = _this.cloneNode(true)
      let cutPath = document.createElementNS(this.$store.getters.getXmlns, 'rect')
      let nodeArr = Array.from(pNode.querySelectorAll('foreignObject'))
      if (nodeArr.length) {
        let obj = nodeArr[nodeArr.length - 1]
        let box = obj.getBoundingClientRect()
        this.$d3.select(cutPath)
          .attr('x', box.left - this.$d3.event.sourceEvent.currentTarget.getBoundingClientRect().left)
          .attr('y', box.top - this.$d3.event.sourceEvent.currentTarget.getBoundingClientRect().top)
          .attr('width', box.width)
          .attr('height', box.height)
          .attr('fill', 'transparent')
          .attr('stroke', 'transparent')
      }
      let clipPath = document.createElementNS(this.$store.getters.getXmlns, 'clipPath')
      this.$d3.select(clipPath).attr('id', 'cut-path')
      clipPath.appendChild(cutPath)
      dragSvg.appendChild(document.createElementNS(this.$store.getters.getXmlns, 'defs').appendChild(clipPath))
      this.$d3.select(dragEl)
        .attr('clip-path', 'url(#cut-path)')
      dragSvg.appendChild(dragEl)
      pNode.appendChild(dragSvg)
      let box = dragEl.getBoundingClientRect()
      this.$d3.select(dragSvg)
        .attr('id', 'dragTempSvg')
        .attr('class', 'customRow')
        .attr('width', box.width)
        .attr('height', box.height)
        .attr('style', `position: fixed; left: ${this.$d3.event.sourceEvent.currentTarget.getBoundingClientRect().left}px; top: 1px; pointer-events: none;`)
      window.TweenMax.to('#dragTempSvg', 0, {
        y: this.$d3.event.sourceEvent.clientY
      })
      this.$d3.select(dragEl)
        .attr('transform', `translate(0, 0)`)
      this.$emit('selfDragstart', obj)
    },
    dragstartBetween (_this, obj) {
      let pNode = document.getElementById('ganttArea')
      let dragSvg = document.createElementNS(this.$store.getters.getXmlns, 'svg')
      let dragEl = _this.cloneNode(true)
      let cutPaths = []
      let nodeArr = Array.from(pNode.querySelectorAll('foreignObject'))
      if (nodeArr.length) {
        nodeArr.forEach((obj, i) => {
          let box = obj.getBoundingClientRect()
          cutPaths.push(document.createElementNS(this.$store.getters.getXmlns, 'rect'))
          this.$d3.select(cutPaths[i])
            .attr('x', box.left - this.$d3.event.sourceEvent.currentTarget.getBoundingClientRect().left)
            .attr('y', box.top - this.$d3.event.sourceEvent.currentTarget.getBoundingClientRect().top)
            .attr('width', box.width)
            .attr('height', box.height)
            .attr('fill', 'transparent')
            .attr('stroke', 'transparent')
        })
      }
      let clipPath = document.createElementNS(this.$store.getters.getXmlns, 'clipPath')
      this.$d3.select(clipPath).attr('id', 'cut-path')
      cutPaths.forEach(path => {
        clipPath.appendChild(path)
      })
      dragSvg.appendChild(document.createElementNS(this.$store.getters.getXmlns, 'defs').appendChild(clipPath))
      this.$d3.select(dragEl)
        .attr('clip-path', 'url(#cut-path)')
      dragSvg.appendChild(dragEl)
      pNode.appendChild(dragSvg)
      let box = dragEl.getBoundingClientRect()
      this.$d3.select(dragSvg)
        .attr('id', 'dragTempSvg')
        .attr('class', 'customRow')
        .attr('width', box.width)
        .attr('height', box.height)
        .attr('style', `position: fixed; left: ${this.$d3.event.sourceEvent.currentTarget.getBoundingClientRect().left}px; top: 1px; pointer-events: none;`)
      window.TweenMax.to('#dragTempSvg', 0, {
        y: this.$d3.event.sourceEvent.clientY
      })
      this.$d3.select(dragEl)
        .attr('transform', `translate(0, 0)`)
      this.$emit('betweenDragstart', obj)
    },
    dragSelf (_this, obj) {
      let xAxis = this.customXAxis || this.xAxis
      let yAxis = this.customYAxis || this.yAxis
      let series = this.customSeries || this.series
      window.TweenMax.to('#dragTempSvg', 0, {
        y: this.$d3.event.sourceEvent.clientY
      })
      if (this.$d3.event.sourceEvent.path.length > 12) {
        let result = false
        if (this.$d3.event.sourceEvent.target.firstElementChild && this.$d3.event.sourceEvent.target.firstElementChild.id === this.selfRef + 'Data') {
          result = true
        } else {
          for (let t = 0; t < this.$d3.event.sourceEvent.path.length; t++) {
            if (this.$d3.event.sourceEvent.path[t].id === this.selfRef + 'Data') {
              result = true
              break
            }
          }
        }
        if (result) {
          let n = Math.floor((this.$d3.event.sourceEvent.offsetY - yAxis.boundaryGap[0]) / yAxis.transStyle.height)
          if (n >= 0 && n <= (series.data || []).length - 1) {
            this.$d3.select(this.rectMark)
              .attr('x', xAxis.boundaryGap[0])
              .attr('y', n * yAxis.transStyle.height + yAxis.boundaryGap[0])
              .attr('fill', this.rowRegColor(obj, series.data[n]))
            document.getElementById('dragTempSvg').style.visibility = 'visible'
            return
          }
        }
      }
      document.getElementById('dragTempSvg').style.visibility = 'hidden'
      this.$d3.select(this.rectMark)
        .attr('fill', this.markRect.bgColor)
    },
    dragBetween (_this, obj) {
      let yAxis = this.customYAxis || this.yAxis
      window.TweenMax.to('#dragTempSvg', 0, {
        y: this.$d3.event.sourceEvent.clientY
      })
      let otherThis = this.$parent.$refs[this.otherRef + 'Data']
      if (this.$d3.event.sourceEvent.path.length > 12) {
        let result = false
        if (this.$d3.event.sourceEvent.target.firstElementChild && this.$d3.event.sourceEvent.target.firstElementChild.id === this.otherRef + 'Data') {
          result = true
        } else {
          for (let t = 0; t < this.$d3.event.sourceEvent.path.length; t++) {
            if (this.$d3.event.sourceEvent.path[t].id === this.otherRef + 'Data') {
              result = true
              break
            }
          }
        }
        if (result) {
          let n = Math.floor((this.$d3.event.sourceEvent.offsetY - otherThis.yAxis.boundaryGap[0]) / otherThis.yAxis.transStyle.height)
          if (n >= 0 && n <= (otherThis.series.data || []).length - 1) {
            this.$d3.select(otherThis.rectMark)
              .attr('x', otherThis.xAxis.boundaryGap[0])
              .attr('y', n * otherThis.yAxis.transStyle.height + yAxis.boundaryGap[0])
              .attr('fill', otherThis.rowRegColor(obj, otherThis.series.data[n]))
            document.getElementById('dragTempSvg').style.visibility = 'visible'
            return
          }
        }
      }
      this.$d3.select(otherThis.rectMark)
        .attr('fill', otherThis.markRect.bgColor)
      if (this.$d3.event.sourceEvent.path.length > 12) {
        let result = false
        if (this.$d3.event.sourceEvent.target.firstElementChild && this.$d3.event.sourceEvent.target.firstElementChild.id === this.selfRef + 'Data') {
          result = true
        } else {
          for (let t = 0; t < this.$d3.event.sourceEvent.path.length; t++) {
            if (this.$d3.event.sourceEvent.path[t].id === this.selfRef + 'Data') {
              result = true
              break
            }
          }
        }
        if (result) {
          document.getElementById('dragTempSvg').style.visibility = 'visible'
          return
        }
      }
      document.getElementById('dragTempSvg').style.visibility = 'hidden'
    },
    dragendSelf (_this, obj) {
      let yAxis = this.customYAxis || this.yAxis
      let series = this.customSeries || this.series
      let dragSvg = document.getElementById('dragTempSvg')
      dragSvg && dragSvg.remove()
      if (this.$d3.event.sourceEvent.path.length > 12) {
        let result = false
        if (this.$d3.event.sourceEvent.target.firstElementChild && this.$d3.event.sourceEvent.target.firstElementChild.id === this.selfRef + 'Data') {
          result = true
        } else {
          for (let t = 0; t < this.$d3.event.sourceEvent.path.length; t++) {
            if (this.$d3.event.sourceEvent.path[t].id === this.selfRef + 'Data') {
              result = true
              break
            }
          }
        }
        if (result) {
          let n = Math.floor((this.$d3.event.sourceEvent.offsetY - yAxis.boundaryGap[0]) / yAxis.transStyle.height)
          if (n >= 0 && n <= (series.data || []).length - 1) {
            this.$d3.select(this.rectMark)
              .attr('fill', this.markRect.bgColor)
            this.$emit('selfDrag', obj, series.data[n])
            return
          }
        }
      }
      this.$d3.select(this.rectMark)
        .attr('fill', this.markRect.bgColor)
    },
    dragendBetween (_this, obj) {
      let dragSvg = document.getElementById('dragTempSvg')
      dragSvg && dragSvg.remove()
      let otherThis = this.$parent.$refs[this.otherRef + 'Data']
      if (this.$d3.event.sourceEvent.path.length > 12) {
        let result = false
        if (this.$d3.event.sourceEvent.target.firstElementChild && this.$d3.event.sourceEvent.target.firstElementChild.id === this.otherRef + 'Data') {
          result = true
        } else {
          for (let t = 0; t < this.$d3.event.sourceEvent.path.length; t++) {
            if (this.$d3.event.sourceEvent.path[t].id === this.otherRef + 'Data') {
              result = true
              break
            }
          }
        }
        if (result) {
          let n = Math.floor((this.$d3.event.sourceEvent.offsetY - otherThis.yAxis.boundaryGap[0]) / otherThis.yAxis.transStyle.height)
          if (n >= 0 && n <= (otherThis.series.data || []).length - 1) {
            this.$d3.select(otherThis.rectMark)
              .attr('fill', otherThis.markRect.bgColor)
            this.$emit('betweenDrag', obj, otherThis.series.data[n])
            return
          }
        }
      }
      this.$d3.select(otherThis.rectMark)
        .attr('fill', otherThis.markRect.bgColor)
    },
    format (info, func) {
      let o = info || ''
      if (func) {
        o = func(o)
      }
      return ((_.isUndefined(o) || _.isNull(o)) ? '' : o)
    }
  },
  watch: {
    refresh: {
      handler (val) {
        this.$set(this, 'ownRefresh', _.cloneDeep(val) || [])
        if (_.intersection(this.ownRefresh, this.name).length) {
          let xAxis = this.customXAxis || this.xAxis
          let series = this.customSeries || this.series
          if (!_.isEqual(series.data, this.oldData)) {
            if (xAxis.now) { // all
              this.$set(this, 'start', xAxis.start)
              this.$set(this, 'now', xAxis.now)
              this.$set(this, 'oldData', series.data)
              this.oldSMult = xAxis.timeSMult
              this.refreshGantt('all')
            }
          } else if (series.data.length && this.initFlag) {
            if (!_.isEqual(xAxis.timeSMult, this.oldSMult) ||
            !_.isEqual(xAxis.start.substr(0, 10), this.start.substr(0, 10))) { // redraw
              this.oldSMult = xAxis.timeSMult
              this.$set(this, 'start', xAxis.start)
              this.refreshGantt('redraw')
            } else if (!_.isEqual(xAxis.now, this.now)) { // reInit
              this.$set(this, 'now', xAxis.now)
              let sTime = new Date(this.start.substr(0, 16) + ':00')
              let lTime = new Date(this.now.substr(0, 16) + ':00')
              let i = (lTime.getTime() - sTime.getTime()) / xAxis.timestempUnit
              this.$nextTick(() => {
                let w = this.lineX(i) + xAxis.boundaryGap[0]
                this.$d3.select(this.beforeNow)
                  .attr('width', w < 0 ? 0 : w)
                this.refreshGantt('reInit')
              })
            } else if (_.isEqual(val, ['fonts'])) { // reInitFonts
              this.refreshGantt('reInitFonts')
            } else if (_.isEqual(val, ['color'])) { // reInitColor
              this.refreshGantt('reInitColor')
            }
          }
        }
      }
    },
    seriesRef (bool) {
      let xAxis = this.customXAxis || this.xAxis
      let series = this.customSeries || this.series
      if (!_.isEqual(series.data, this.oldData)) {
        if (xAxis.now) { // all
          this.$set(this, 'start', xAxis.start)
          this.$set(this, 'now', xAxis.now)
          this.$set(this, 'oldData', series.data)
          this.oldSMult = xAxis.timeSMult
          this.refreshGantt('all')
        }
      } else if (series.data.length && this.initFlag) {
        if (!_.isEqual(xAxis.now, this.now)) { // reInit
          this.$set(this, 'now', xAxis.now)
          let sTime = new Date(this.start.substr(0, 16) + ':00')
          let lTime = new Date(this.now.substr(0, 16) + ':00')
          let i = (lTime.getTime() - sTime.getTime()) / xAxis.timestempUnit
          this.$nextTick(() => {
            let w = this.lineX(i) + xAxis.boundaryGap[0]
            this.$d3.select(this.beforeNow)
              .attr('width', w < 0 ? 0 : w)
            this.refreshGantt('reInit')
          })
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
    'xAxis.width': {
      handler (width) {
        let xAxis = this.customXAxis || this.xAxis
        this.$d3.select(this.rectHidden)
          .attr('width', width)
        this.$d3.select(this.rectMark)
          .attr('width', width - xAxis.boundaryGap[0] - xAxis.boundaryGap[1])
      }
    }
  }
}
</script>

<style lang="scss" >
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
