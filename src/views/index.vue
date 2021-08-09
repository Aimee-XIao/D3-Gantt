<template>
<div>
  <component :is="ganttComp.type" ref="center" :pStyle="style" :queryData="queryData" :ganttTypeTitle="ganttType.title"
  :xConf="xConf" :firstQuery="firstQuery" :highlight="highlight"
  @initEnd="initEnd"
  @setSelfData="setSelfData" @closeQueryDialog="closeQueryDialog" @loadingQueryFalse="loadingQueryFalse"
   @showQueryDialog="showQueryDialog"
   @clearAllQuery="clearAllQuery"></component>
</div>
</template>

<script>
import { getQueryAll, queryAll, queryAllAiis, postData, postAiisData } from '../api/base';
import ganttMixin from '../mixin/ganttMixin'
import basicMsgMixin from '../mixin/basicMsgMixin'
import exportGanttMixin from '../mixin/exportGanttMixin'
import Gantt from '../components/gantt'
import _ from 'lodash'
import { mapState } from 'vuex'
export default {
  name: "index",
  mixins: [ganttMixin, basicMsgMixin,  exportGanttMixin],
  components: {
    Gantt
  },
  data () {
    return {
      showBlock: {
        leftTop: {
          show: true,
          type: 'Q'
        },
        leftBottom: {
          show: true,
          type: 'stand'
        },
        right: true
      },
      ganttType: {
        title: '查询区',
        types: [
          {key: 'Q', label: '查询', title: '查询区', icon: 'el-icon-search', show: ['stand', 'gate']},
          {key: 'A', label: '单进航班', title: '单进', data: {inOutFlag: 'A'}, show: ['stand']},
          {key: 'D', label: '单出航班', title: '单出', data: {inOutFlag: 'D'}, show: ['stand', 'gate']},
          {key: 'V', label: 'VIP航班', title: 'VIP', data: {VIP: 'Y'}, show: ['stand', 'gate']},
          {key: 'T', label: '航空器占用', title: '航空器', urlKey: 'aircraftUsed', show: ['stand']},
          {key: 'U', label: '{资源}未确认', title: '未确认', urlKey: 'unconfirmed', show: ['stand', 'gate']},
          {key: 'O', label: '前起未分', title: '前起未分', data: {beforeTakeOff: 'Y'}, show: ['stand']},
          {key: 'N', label: '待分航班', title: '待分配', data: {noDistribute: 'Y'}, show: ['stand', 'gate']},
          {key: 'S', label: '分割航班', title: '分割', urlKey: 'division', show: ['stand']},
          {key: 'C', label: '时间冲突', title: '时间冲突', urlKey: 'conflict', show: ['stand', 'gate']},
          {key: 'preAssign', label: '{资源}预分配', show: ['stand']},
          {key: 'autoAssign', label: '{资源}自动分配', show: ['stand', 'gate']},
          {key: '{type}Settings', label: '{资源}设置', show: ['stand', 'gate']}
        ]
      },
      /* 高亮设置 */
      highlight: {
        style: 'filter: url(#box-shadow-seriesKey);',
        position: {
          visible: false,
          count: -1,
          value: ''
        },
        data: []
      },
      /* 甘特图页面布局 */
      style: {
        menuHeight: 34,
        contentHeight:867,
        leftWidth: 1500,
        rightWidth: 300,
        topHeight: 400,
        bottomHeight: 867,
        cardMargin: 8
      },
      xConf: {
        timeSection: [0.5, 10]
      },
      queryUrls: {
        queryResourceUrl: '/resource/gantt/getSelectBox',
        queryUrl: {
          stand: '/resource/gantt/queryFlightInfo',
          gate: '/resource/gateGantt/queryFlightInfo'
        },
        division: '/resource/gantt/queryFlightDivisionStand',
        conflict: {
          stand: '/resource/gantt/queryFlightConflitTime',
          gate: '/resource/gateGantt/queryFlightConflitTime'
        },
        unconfirmed: {
          stand: '/resource/gantt/queryFlightStandNoAck',
          gate: '/resource/gateGantt/queryFlightGateNoAck'
        },
        aircraftUsed: '/resource/gantt/queryAircraftResourceUsed'
      },
      /* 甘特图配置 */
      firstQuery: true,
      queryData: {
        title: '甘特图查询',
        visible: false,
        loading: false,
        status: -1,
        index: -1,
        url: '',
        data: {},
        baseType: {},
        shortcutKeys: [113, 118, 119, 120, 121],
        fields: [
          {key: 'flightNos', label: '航班号', type: 'input', value: '', defaultValue: ''},
          {key: 'aircraftNos', label: '机号', type: 'select', multiple: true, value: [], optionsKey: 'aircraft'},
          {key: 'airlines', label: '航空公司', type: 'select', multiple: true, value: [], optionsKey: 'airline'},
          {key: 'aircraftTypes', label: '机型', type: 'select', multiple: true, value: [], optionsKey: 'aircraftType'},
          {key: 'tasks', label: '任务', type: 'select', multiple: true, value: [], optionsKey: 'flightTask'},
          {key: 'startStations', label: '始发站', type: 'select', multiple: true, value: [], optionsKey: 'airport'},
          {key: 'terminalStations', label: '目的站', type: 'select', multiple: true, value: [], optionsKey: 'airport'},
          {key: '{type}Distribute', label: '{资源}分配情况', type: 'tabs', value: 'all', defaultValue: 'all', options: [
              {key: 'N', label: '未分配{资源}'},
              {key: 'Y', label: '已分配{资源}'},
              {key: 'all', label: '全部'}
            ]},
          {key: 'inOutFlag', label: '航班进出情况', type: 'tabs', value: 'all', defaultValue: 'all', options: [
              {key: 'A', label: '进港'},
              {key: 'D', label: '出港'},
              {key: 'A|D', label: '拼接'},
              {key: 'all', label: '全部'}
            ]},
          {key: 'abnormalStatus', label: '异常状态', type: 'checkbox', value: [], options: [
              {key: 'RTN', label: '返航'},
              {key: 'ALT', label: '备降'},
              {key: 'DLY', label: '延误'},
              {key: 'CAN', label: '取消'},
              {key: 'BAK', label: '滑回'}
            ]},
          {key: 'attrs', label: '属性', type: 'checkbox', value: [], options: [
              {key: 'D', label: '国内'},
              {key: 'I', label: '国际'},
              {key: 'M', label: '混合'},
              {key: 'R', label: '地区'}
            ]}
        ],
        fields0: [
          {key: 'flightNos', label: '航班号', type: 'input', value: '', defaultValue: ''}
        ],
        fields1: [
          {key: 'aircraftNos', label: '机号', type: 'select', multiple: true, value: [], optionsKey: 'aircraft'}
        ],
        fields2: [
          {key: 'airlines', label: '航空公司', type: 'select', multiple: true, value: [], optionsKey: 'airline'}
        ],
        fields3: [
          {key: 'aircraftTypes', label: '机型', type: 'select', multiple: true, value: [], optionsKey: 'aircraftType'}
        ]
      },
      ganttComp: {
        type: "gantt",
        title: "行李转盘",
        loading: false,
        opts: [
          { key: "stand", label: "机位"},
          { key: "gantt", label: "行李转盘"}
          // {key: 'belt', label: '行李转盘'},
          // {key: 'chute', label: '行李滑槽'},
          // {key: 'counter', label: '值机柜台'}
        ],
        stand: {
          colorTypeKey: "colorTypes",
          colorConfigKey: "colorConfig",
          customDrawColor: null
        },
        gantt: {
          colorTypeKey: "gateColorTypes",
          colorConfigKey: "gateColorConfig",
          customDrawColor: null
        }
      },
    }
  },
  computed: {
    ...mapState({
      xAxis: state => state.gantt.xAxis
    }),
    customQueryFields () {
      if (this.queryData.index > -1) {
        return this.queryData['fields' + this.queryData.index]
      } else {
        return (this.showBlock.leftTop.type === 'Q') ? this.queryData.fields : []
      }
    },
  },
  methods: {
    filterHighlight () {
      let arr = []
      if (this.showBlock.leftTop.show) {
        let topArr = [];
        (this.$refs.center.seriesNd.data || []).forEach(row => {
          if ((row[this.$refs.center.seriesNd.rowConf.value] || []).length) {
            row[this.$refs.center.seriesNd.rowConf.value].forEach(col => {
              topArr.push({...col, pId: row[this.$refs.center.seriesNd.rowConf.id]})
            })
          }
        })
        topArr.forEach(o => {
          let id = o[this.$refs.center.seriesNd.colConf.id] || o.pId
          if (!id) {
            return
          }
          if (o.flightNumA === this.highlight.position.value) {
            arr.push({seriesKey: 'seriesNd', id: id})
          } else if (o.flightNumD === this.highlight.position.value) {
            arr.push({seriesKey: 'seriesNd', id: id})
          }
        })
      }
      let bottomArr = []
      this.$refs.center.series.data.forEach(row => {
        if ((row[this.$refs.center.series.rowConf.value] || []).length) {
          row[this.$refs.center.series.rowConf.value].forEach(col => {
            bottomArr.push({...col, pId: row[this.$refs.center.series.rowConf.id]})
          })
        }
      })
      bottomArr.forEach(o => {
        let id = o[this.$refs.center.series.colConf.id] || o.pId
        if (!id) {
          return
        }
        if (o.flightNumA === this.highlight.position.value) {
          arr.push({seriesKey: 'series', id: id})
        } else if (o.flightNumD === this.highlight.position.value) {
          arr.push({seriesKey: 'series', id: id})
        }
      })
      this.$set(this.highlight, 'data', arr || [])
    },
    clearAllQuery (init) {
      console.log('clear', this.queryData)

      this.queryData.fields.forEach((item, i) => {
        if (item.hasOwnProperty('defaultValue')) {
          this.$set(item, 'value', item.defaultValue)
        } else {
          this.$set(item, 'value', [])
        }
      })
      if (!init) {
        this.$set(this.ganttType, 'title', '查询区')
        this.$store.commit('setGanttConf', [
          {key: 'seriesNd.data', value: []}
        ])
        this.$refs.center.setSelfData({key: 'seriesNd', ckey: 'data', value: []})
      }
      this.queryData.data = {}
      this.queryData.url = ''
    },
    showQueryDialog (key, index, callback) {
      let obj = _.find(this.ganttType.types, ['key', key])
      // 机位预分配 & 机位自动分配功能移植
      if (key === 'preAssign') {
        this.$set(this.preAssignData, 'isShowCondition', true)
      } else if (key === 'autoAssign') {
        if (this.ganttComp.type === 'stand') {
          this.$set(this.autoAssignData, 'isShowCondition', true)
        } else {
          this.$set(this.isShowSecResDialog, 'visible', true)
        }
      } else if (['standSettings', 'gateSettings'].includes(key)) { // 机位设置 / 登机口设置
        this.$refs.center.showSetting()
      } else {
        index = _.isUndefined(index) ? -1 : index
        this.$set(this.queryData, 'index', index)
        this.setSelfData({key: 'showBlock.leftTop', ckey: 'type', value: key})
        this.$refs.center.setSelfData({key: 'showBlock.leftTop', ckey: 'type', value: key})
        if (key !== 'Q') {
          this.$set(this.queryData, 'baseType', _.cloneDeep(obj))
        }
        if (obj.urlKey) {
          this.queryData.url = this.queryUrls[obj.urlKey][this.ganttComp.type] || this.queryUrls[obj.urlKey]
        } else {
          this.queryData.url = this.queryUrls.queryUrl[this.ganttComp.type]
        }
        if (obj.data) {
          this.queryData.data = _.cloneDeep(obj.data)
          this.handleQueryConfirm(undefined, result => {
            callback && callback(result)
          })
        } else {
          if (this.queryData.status === 0) {
            if (key === 'Q') {
              this.$set(this.queryData, 'visible', true)
            } else {
              this.queryData.data = {}
              this.handleQueryConfirm()
            }
          } else {
            this.initQueryResource(() => {
              if (this.queryData.status === 0) {
                if (key === 'Q') {
                  this.$set(this.queryData, 'visible', true)
                } else {
                  this.queryData.data = {}
                  this.handleQueryConfirm()
                }
              } else if (this.queryData.status === -1) {
                this.showError('获取查询相关资源信息', '请重新尝试')
              }
            })
          }
        }
      }
    },
    handleQueryConfirm (flag, callback) {
      if (this.queryData.baseType.title) {
        this.$set(this.ganttType, 'title', this.queryData.baseType.title)
      }
      let obj = {}
      if (this.showBlock.leftTop.type === 'Q') {
        if (this.queryData.index === -1) {
          this.$set(this.queryData, 'baseType', _.cloneDeep(_.find(this.ganttType.types, ['key', 'Q'])))
          this.$set(this.ganttType, 'title', this.queryData.baseType.title)
        } else {
          if (this.queryData.baseType.key !== 'Q') {
            obj = _.cloneDeep(this.queryData.baseType.data || {})
          }
        }
      } else {
        obj = _.cloneDeep(this.queryData.baseType.data || {})
      }
      this.customQueryFields.forEach(item => {
        if (!item.hidden) {
          let arr = item.value
          if (item.type === 'input') {
            let val = (item.value || '').toUpperCase()
            arr = val.split(/[，,]/)
            if (arr.length === 1 && arr[0] === '') {
              arr = []
            }
          }
          this.$set(obj, item.key.replace('{type}', this.ganttComp.type), arr)
        }
      })
      this.$set(this.queryData, 'data', obj)
      this.$set(this.queryData, 'loading', true)
      this.$refs.center.queryOthers(undefined, result => {
        callback && callback(result)
      })
    },
    initEnd () {
      this.$set(this, 'firstQuery', false)
      this.$set(this.ganttComp, 'loading', false)
    },
    setSelfData ({key, ckey, value}) {
      this.$set(_.get(this, key), ckey, value)
    },
    closeQueryDialog () {
      this.queryData.fields.forEach(field => {
        field.type === 'select' && this.$refs[field.key] && this.$refs[field.key].length && this.$refs[field.key][0].blur()
      })
      Array.from(document.querySelectorAll('.el-select-dropdown')).forEach(node => {
        node.style.display = 'none'
      })
      this.$set(this.queryData, 'visible', false)
      this.$set(this.queryData, 'loading', false)
      if (this.queryData.index > -1) {
        let obj = this.queryData['fields' + this.queryData.index][0]
        this.$set(obj, 'value', obj.hasOwnProperty('defaultValue') ? obj.defaultValue : [])
      }
    },
    loadingQueryFalse () {
      this.$set(this.queryData, 'loading', false)
    },
  }
};
</script>

<style lang="scss" >
@import '../components/scss/gantt.scoped';
</style>

<style lang="scss">
@import '../components/scss/gantt';
</style>
