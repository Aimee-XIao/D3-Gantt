<template>
  <el-dialog v-if="visible" :visible.sync="visible" :close-on-click-modal="false" width="700px" append-to-body class="other-dialog export-gantt-dialog" @close="closeDialog">
    <div slot="title" class="dialog-header">
      <img :src="require('@img/title_deco.png')" />
      <span class="header-title">{{title}}</span>
    </div>
    <div class="dialog-body">
      <template v-if="step === 0">
        <div class="whole-row">
          <div class="label">开始时间</div>
          <div class="info">
            <el-input v-model="queryData['beginTime']" type="datetime-local" placeholder="请选择开始时间" max="9999-12-31T23:59">
              <i class="el-icon-refresh el-input__icon" slot="suffix" @click="resetNewStepTime(queryData, {key: 'beginTime'})"></i>
            </el-input>
          </div>
        </div>
        <div class="whole-row">
          <div class="label">结束时间</div>
          <div class="info">
            <el-input v-model="queryData['endTime']" type="datetime-local" placeholder="请选择结束时间" max="9999-12-31T23:59">
              <i class="el-icon-refresh el-input__icon" slot="suffix" @click="resetNewStepTime(queryData, {key: 'endTime'})"></i>
            </el-input>
          </div>
        </div>
        <div style="position: relative">
          <div class="error" v-if="queryData['beginTime'] && queryData['endTime'] && Date.parse(queryData['beginTime']) >= Date.parse(queryData['endTime'])">开始时间必须小于结束时间</div>
          <div class="error" v-else-if="!(Date.parse(queryData['beginTime']) >= startTime
          && Date.parse(queryData['beginTime']) < endTime
          && Date.parse(queryData['endTime']) >= startTime
          && Date.parse(queryData['endTime']) < endTime)">时间范围必须在 [ {{formatYMD(startTime) + ' ' + formatHM(startTime)}} 至 {{formatYMD(new Date(endTime - 1000)) + ' ' + formatHM(new Date(endTime - 1000))}} ] 之间</div>
        </div>
        <div class="whole-row">
          <div class="whole">
            <el-transfer ref="transType" :titles="['待选' + typeLabel, '已选' + typeLabel]" :data="opts[queryAllData.key[0]]" v-model="queryData[typeKey]" :props="customProps" :target-order="'unshift'"
            :filter-placeholder="'请输入' + typeLabel" filterable
            :filter-method="transFilterMethod.bind(null, customProps)"
            @change="handleTransChange('transType')"
            style="margin-left: 5%;">
              <span slot-scope="{ option }">{{ option[customProps.label]}}</span>
            </el-transfer>
          </div>
        </div>
      </template>
      <template v-else-if="step === 1">
        <div class="whole-row">
          <div class="whole">
            <el-transfer ref="transAirline" :titles="['待选航司', '已选航司']" :data="opts['Airline']" v-model="queryData['airline']" :props="{key: 'airlineIata', label: 'briefC'}" :target-order="'unshift'"
            :filter-placeholder="'请输入航司IATA码/名称'" filterable
            :filter-method="transFilterMethod.bind(null, {key: 'airlineIata', label: 'briefC'})"
            @change="handleTransChange('transAirline')"
            style="margin-left: 5%;">
              <span slot-scope="{ option }">{{ option.airlineIata + ' - ' + option.briefC }}</span>
            </el-transfer>
          </div>
        </div>
      </template>
      <svg class="svg-whole" ref="exportSvg" style="position: fixed; top: 10000px;">
        <foreignObject :x="xAxis.left" :y="yAxis.top" :width="xAxis.width" :height="yAxis.height">
          <svg :width="xAxis.width" :height="yAxis.height">
            <custom-row ref="svgBottomData" id="svgBottomData" :colorTypeKey="colorTypeKey" :colorConfigKey="colorConfigKey"
              :refresh="refresh" :xAxisKey="xAxisKey"  :yAxisKey="yAxisKey"  :seriesKey="seriesKey"></custom-row>
          </svg>
        </foreignObject>
        <svg :x="xAxis.left">
          <time-axis ref="xAxisBottom" id="xAxisBottom" :refresh="refresh" :xAxisKey="xAxisKey"></time-axis>
        </svg>
        <svg :y="yAxis.top">
          <category-axis id="yAxisBottom" :colorTypeKey="colorTypeKey" :colorConfigKey="colorConfigKey" :customDrawColor="customDrawColor" :refresh="refresh" :yAxisKey="yAxisKey"  :seriesKey="seriesKey"></category-axis>
        </svg>
      </svg>
    </div>
    <div slot="footer" class="dialog-footer">
      <el-button @click="closeDialog">关 闭</el-button>
      <el-button v-if="step !== 0" @click="prev()">上一步</el-button>
      <el-button type="primary" :loading="loading" @click="handleConfirm()"
      :disabled="!((
          step === 0
          && queryData['beginTime']
          && queryData['endTime']
          && Date.parse(queryData['beginTime']) < Date.parse(queryData['endTime'])
          && Date.parse(queryData['beginTime']) >= startTime
          && Date.parse(queryData['beginTime']) < endTime
          && Date.parse(queryData['endTime']) >= startTime
          && Date.parse(queryData['endTime']) < endTime
          && (queryData[this.typeKey] || []).length
        )
        || (step === 1 && (queryData['airline'] || []).length))">{{step === 0 ? '下一步' : '确 定'}}</el-button>
    </div>
  </el-dialog>
</template>

<script>

import TimeAxis from './TimeAxis'
import CategoryAxis from './CategoryAxis'
import CustomRow from './CustomRowByD3'
// import { getQueryAll, queryAll, postAiisData } from '@/api/base'
import { mapState } from 'vuex'
import _ from 'lodash'


export default {
  components: {
    TimeAxis,
    CategoryAxis,
    CustomRow
  },
  props: {
    visible: {
      type: Boolean,
      default: false
    },
    typeKey: {
      default: 'stand'
    },
    typeLabel: {
      default: '机位'
    },
    customProps: {
      default: () => ({key: 'standNo', label: 'standNo'})
    },
    queryUrl: {
      type: String,
      default: '/resource/gantt/queryFlightInfoForPrint'
    },
    queryAllData: {
      default: () => ({key: ['AircraftStand', 'Airline'], label: ['机位', '航司']})
    },
    colorTypeKey: {},
    colorConfigKey: {},
    customDrawColor: {}
  },
  data () {
    return {
      title: '甘特图打印',
      refresh: [],
      step: 0,
      loading: false,
      xAxisKey: 'exportXAxis',
      yAxisKey: 'exportYAxis',
      seriesKey: 'exportSeries',
      queryAllUrl: '/dynamicFlight/queryAllByCode',
      opts: {
        AircraftStand: [],
        Gate: [],
        Airline: []
      },
      queryData: {
        beginTime: '',
        endTime: '',
        airline: [],
        queryTime: ''
      },
      data: []
    }
  },
  computed: {
    ...mapState({
      defaultXAxis: state => state.gantt.xAxis,
      defaultYAxis: state => state.gantt.yAxis,
      defaultSeries: state => state.gantt.series,
      xAxis (state) {
        return state.gantt[this.xAxisKey]
      },
      yAxis (state) {
        return state.gantt[this.yAxisKey]
      },
      series (state) {
        return state.gantt[this.seriesKey]
      }
    }),
    startTime () {
      return new Date(new Date(this.defaultXAxis.start.substr(0, 16) + ':00'))
    },
    endTime () {
      return new Date(this.startTime.getTime() + this.defaultXAxis.spanning * this.defaultXAxis.timestempUnit)
    }
  },
  created () {
    this.$set(this.queryData, this.typeKey, [])
  },
  methods: {
    init () {
      queryAll(this.queryAllUrl, {key: (this.queryAllData.key || []).join(',')}).then(res => {
        if (res.data.code == 0) {
          Object.keys(res.data.data).forEach(key => {
            if ((this.queryAllData.options || {}).hasOwnProperty(key)) {
              this.$set(this.opts, key, this.queryAllData.options[key] || [])
            } else {
              this.$set(this.opts, key, res.data.data[key] || [])
            }
          })
        } else {
          this.showError('获取 ' + this.queryAllData.label.join(' 和 ') + ' 信息', '请重新尝试')
        }
      })
    },
    prev () {
      if (this.step === 1) {
        this.$set(this, 'step', this.step - 1)
      }
    },
    handleConfirm () {
      if (!this.step) {
        this.$set(this, 'step', this.step + 1)
      } else {
        getQueryAll('/', null).then(res => {
          let time = new Date(res.headers.date)
          this.$set(this.queryData, 'queryTime', `${this.formatYMD(time)}T${this.formatHM(time)}`)
          this.queryDataReq()
        })
      }
    },
    closeDialog () {
      this.$emit('closeDialog')
      this.$set(this, 'refresh', [])
    },
    queryDataReq () {
      this.$set(this, 'loading', true)
      postAiisData(this.queryUrl, this.queryData).then(res => {
        if (res.data.code === 0) {
          this.$set(this, 'data', res.data.data)
          this.exportSvg()
        } else {
          this.closeDialog()
        }
      })
    },
    exportSvg () {
      this.$store.commit('setGanttConf', [
        {key: this.xAxisKey, value: this.defaultXAxis},
        {key: this.yAxisKey, value: this.defaultYAxis},
        {key: this.seriesKey, value: this.defaultSeries},
        {key: this.xAxisKey + '.now', value: this.queryData.queryTime},
        {key: this.seriesKey + '.data', value: this.data}
      ])
      this.refresh.push('all')
      setTimeout(this.exportImg, 2 * 1000)
    },
    exportImg () {
      let width = this.$refs.svgBottomData.$el.parentElement.getBoundingClientRect().width + this.yAxis.transStyle.width
      let height = this.$refs.svgBottomData.$el.getBoundingClientRect().height + this.$refs.xAxisBottom.$el.getBoundingClientRect().height + this.yAxis.top
      let serializer = new XMLSerializer()
      let svg = this.$d3.select(this.$refs.exportSvg)
      svg.attr('width', width)
        .attr('height', height)
        .style('background-color', '#fff')
      svg.select('#xAxisBottom').attr('transform', 'matrix(1,0,0,1,0,0)')
      let tmpSvg = this.$d3.select(document.body).append('svg')
      tmpSvg.attr('id', 'temp-export-image')
        .attr('version', 1.1)
        .attr('xmlns', 'http://www.w3.org/2000/svg')
        .attr('width', width)
        .attr('height', height)
        .style('background-color', '#fff')
      tmpSvg.html(this.$refs.exportSvg.innerHTML)
      let closeDialog = this.closeDialog
      domtoimage.toSvg(document.getElementById('temp-export-image')).then((dataUrl) => {
        let a = document.createElement('a')
        a.download = `${this.typeLabel}甘特图.svg`
        a.href = dataUrl
        a.click()
        closeDialog()
        document.getElementById('temp-export-image') && document.getElementById('temp-export-image').remove()
      })
    },
    /* 工具方法 */
    addZero (value) {
      if (value < 10) {
        return `0${value}`
      } else {
        return value
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
    resetNewStepTime (obj, field) {
      let date = new Date()
      let split = '-'
      let dateStr = `${date.getFullYear()}${split}${this.addZero(date.getMonth() + 1)}${split}${this.addZero(date.getDate())}`
      let hour = date.getHours() < 10 ? `0${date.getHours()}` : date.getHours()
      let minite = date.getMinutes() < 10 ? `0${date.getMinutes()}` : date.getMinutes()
      this.$set(obj, field.key, `${dateStr}T${hour}:${minite}`)
      if (field.change) {
        field.change(obj[field.key])
      }
    },
    transFilterMethod (props, value, option) {
      let tmp = (value || '').toUpperCase()
      if (tmp === '') {
        return true
      } else if ((option[props.key] || '').toUpperCase().includes(tmp) || (props.label && (option[props.label] || '').toUpperCase().includes(tmp))) {
        return true
      } else {
        return false
      }
    },
    handleTransChange (name) {
      this.$nextTick(() => {
        if (this.$refs[name]) {
          this.$refs[name].clearQuery('left')
          this.$refs[name].clearQuery('right')
        }
      })
    },
    getFlightColor (obj, colorParamValue, colorDefaultCol) {
      return this.$parent.$refs.center.getFlightColor(obj, colorParamValue, colorDefaultCol)
    }
  },
  watch: {
    visible: {
      handler (val) {
        if (val) {
          this.init()
        }
        this.$set(this, 'loading', false)
        this.$set(this, 'step', 0)
        this.$set(this, 'queryData', {
          beginTime: '',
          endTime: '',
          airline: []
        })
        this.$set(this.queryData, this.typeKey, [])
        this.$set(this, 'data', [])
      }
    }
  }
}
</script>

<style lang="scss">
.export-gantt-dialog {
  .el-dialog {
    height: fit-content;
  }
}
</style>

<style lang="scss" >
.export-gantt-dialog {
  .dialog-body {
    .whole-row {
      display: flex;
      justify-content: flex-start;
      align-items: center;
      min-height: 32px;
      margin-bottom: 24px;
      text-align: left;
      &.column {
        flex-direction: column;
      }
      >.label {
        padding-left: 20px;
        width: 120px;
        font-size: 18px;
      }
      >.info {
        width: calc(100% - 120px);
        font-size: 18px;
      }
      >.whole {
        width: 100%;
      }
    }
  }
  .dialog-footer {
    .left {
      float: left;
    }
    .right {
      float: right;
    }
  }
}
.export-gantt-dialog {
  .error {
    position: absolute;
    text-align: left;
    left: 20px;
    top: -22px;
    color: #d9415a;
  }
}
</style>
