<template>
  <div class="gantt-center-view center" :style="{height: pStyle.contentHeight + 'px'}">
    <div id="ganttArea" class="left"
         :style="{width: computeLeftWidth + 'px'}">
<!--      <div v-show="showBlock.leftTop.show" class="top" :class="['svg-scroll', cursorStatus ? 'cut' : '']" :scss="{height: computeLeftTopHeight + 'px'}">-->
<!--        <div class="title" :scss="{width: (xAxis.left - 8) + 'px', height: (yAxisNd.top - 8) + 'px'}">{{ganttTypeTitle}}</div>-->
<!--        <svg ref="svgTop" class="svg-whole" :scss="{left: pStyle.carkMargin + 'px', top: pStyle.carkMargin + 'px'}"-->
<!--             :width="computeLeftWidth - 2 * pStyle.cardMargin" :height="computeLeftTopHeight - 2 * pStyle.cardMargin" baseProfile="full" version="1.1">&lt;!&ndash;  @mousewheel="scrollEvent" &ndash;&gt;-->
<!--          <defs>-->
<!--            <filter id="box-shadow-seriesNd">-->
<!--              <feDropShadow dx="0" dy="0" stdDeviation="4" flood-color="#ff0000"/>-->
<!--            </filter>-->
<!--          </defs>-->
<!--          <foreignObject :x="xAxis.left" :y="yAxisNd.top" :width="computeLeftWidth - xAxis.left - 2 * pStyle.cardMargin" :height="computeLeftTopHeight - yAxisNd.top - 2 * pStyle.cardMargin">-->
<!--            <div ref="svgTopContent" class="svg-scroll">-->
<!--              <svg :width="xAxis.width" :height="yAxisNd.height">-->
<!--                <custom-row ref="svgTopData" id="svgTopData" :yAxisKey="'yAxisNd'" :colorTypeKey="'gateColorTypes'" :colorConfigKey="'gateColorConfig'"-->
<!--                            :seriesKey="'seriesNd'" :dragType="'between'" :betweenJudge="betweenJudge" :rowRegColor="rowRegColor" :selfRef="'svgTop'" :otherRef="'svgBottom'"-->
<!--                            :refresh="refresh" :seriesRef="seriesNdRefresh" @clickBlock="showFlight($event, 'seriesNd')" @betweenDrag="betweenDrag" @betweenDragstart="betweenDragstart"></custom-row>-->
<!--              </svg>-->
<!--            </div>-->
<!--          </foreignObject>-->
<!--          <svg :x="xAxis.left">-->
<!--            <time-axis ref="xAxisTop" id="xAxisTop" :refresh="refresh"></time-axis>-->
<!--            <g ref="markLineTop" class="markLine">-->
<!--              <line class="mark-line" :y1="markLineTop.y" :y2="markLineTop.y + markLineTop.height" :stroke="markLineTop.color"></line>-->
<!--              <text class="mark-line-font"/>-->
<!--            </g>-->
<!--          </svg>-->
<!--          <svg :y="yAxisNd.top">-->
<!--            <category-axis ref="yAxisTop" id="yAxisTop" :yAxisKey="'yAxisNd'" :seriesKey="'seriesNd'" :colorTypeKey="'gateColorTypes'" :colorConfigKey="'gateColorConfig'"-->
<!--                           :refresh="refresh" :seriesRef="seriesNdRefresh" :customDrawColor="drawColor"></category-axis>-->
<!--          </svg>-->
<!--        </svg>-->
<!--      </div>-->
      <div v-show="showBlock.leftBottom.show" class="bottom" :class="['svg-scroll', cursorStatus ? 'cut' : '']"
           :style="{height: computeLeftBottomHeight + 'px'}">
        <div class="filter-select" :style="{width: (xAxis.left - 10) + 'px', margin: `${(yAxisNd.top - 32) / 2}px 5px`}">
          <y-select style="width: 100%;" placeholder="请选择" v-model="filterData.value" :multiple="filterData.multiple" filterable clearable default-first-option>
            <y-select-option v-for="item in filterData.options" :key="item[filterData.props.key]" :label="item[filterData.props.label]" :value="item[filterData.props.key]" :placeholder="filterData.placeholder">
              <span style="float: left">{{ item[filterData.props.label] }}</span>
              <span style="float: right; color: #8492a6; font-size: 13px">{{ item[filterData.props.labelSpan] }}</span>
            </y-select-option>
          </y-select>
          <i class="el-icon-circle-close" @click="filterData.value = []"></i>
        </div>
        <svg ref="svgBottom" class="svg-whole" :style="{left: pStyle.carkMargin + 'px', top: pStyle.carkMargin + 'px'}"
             :width="computeLeftWidth - 2 * pStyle.cardMargin" :height="computeLeftBottomHeight - 2 * pStyle.cardMargin" baseProfile="full" version="1.1"><!--  @mousewheel="scrollEvent" -->
          <defs>
            <filter id="box-shadow-series">
              <feDropShadow dx="0" dy="0" stdDeviation="10" flood-color="#ff0000"/>
            </filter>
          </defs>
          <foreignObject :x="xAxis.left" :y="yAxis.top" :width="computeLeftWidth - xAxis.left - 2 * pStyle.cardMargin" :height="computeLeftBottomHeight - yAxis.top - 2 * pStyle.cardMargin">
            <div ref="svgBottomContent" class="svg-scroll">
              <svg :width="xAxis.width" height="3880">
                <custom-row ref="svgBottomData" id="svgBottomData" :colorTypeKey="'gateColorTypes'" :colorConfigKey="'gateColorConfig'"
                            :dragType="'self'" :selfJudge="selfJudge" :rowRegColor="rowRegColor" :selfRef="'svgBottom'"
                            :refresh="refresh" :seriesRef="seriesRefresh"
                            @clickBlock="showFlight($event, 'series')" @selfDrag="selfDrag" @selfDragstart="selfDragstart" @contextmenu="contextmenu($event, 'Flight')"></custom-row>
              </svg>
            </div>
          </foreignObject>
          <svg :x="xAxis.left">
            <time-axis ref="xAxisBottom" id="xAxisBottom" :refresh="refresh"></time-axis>
            <g ref="markLineBottom" class="markLine" transform="translate(-10, 0)">
              <line class="mark-line" :y1="markLineBottom.y" :y2="markLineBottom.y + markLineBottom.height" :stroke="markLineBottom.color"></line>
              <text class="mark-line-font"/>
            </g>
          </svg>
          <svg :y="yAxis.top">
            <category-axis ref="yAxisBottom" id="yAxisBottom"  :seriesKey="'seriesNd'" :colorTypeKey="'gateColorTypes'" :colorConfigKey="'gateColorConfig'"
                           :refresh="refresh" :seriesRef="seriesRefresh" :customDrawColor="drawColor"
                           @contextmenu="contextmenu($event, 'Gate')"></category-axis>
          </svg>
        </svg>
      </div>
    </div>
  </div>
</template>

<script>
import TimeAxis from '../components/GanttSvg/TimeAxis'
import CategoryAxis from '../components/GanttSvg/CategoryAxis'
import ScrollBlock from '../components/GanttSvg/ScrollBlock'
import CustomRow from '../components/GanttSvg/CustomRowByD3'
import ganttMixin from '../mixin/ganttMixin'
import basicMsgMixin from '../mixin/basicMsgMixin'
import { getQueryAll, queryAll, queryAllAiis, postData, postAiisData } from '@/api/base'
import _ from 'lodash'
import { flattenDeep, selectIdByCssFilter } from '@/util/util.js'
import { mapState } from 'vuex'
export default {
  components: {
    TimeAxis,
    CategoryAxis,
    ScrollBlock,
    CustomRow,
  },
  mixins: [ganttMixin, basicMsgMixin],
  props: ['pStyle', 'queryData', 'ganttTypeTitle', 'xConf', 'firstQuery', 'highlight'],
  data () {
    return {
      refreshOther: 'rememberOtherScroll',
      newTime: null,
      intervalTime: 1 * 60 * 1000,
      timer: null,
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
      filterData: {
        queryUrl: '',
        filterKey: 'TERMINAL',
        value: [],
        multiple: true,
        placeholder: '全部航站楼',
        props: {key: 'CODE', label: 'CODE', labelSpan: 'ATTRCN'},
        optionsKey: 'terminal',
        options: [
          {
            ATTRCN: '国际',
            CODE:'T1',
          },
          {
            ATTRCN: '国内',
            CODE:'T2',
          },
          {
            ATTRCN: '国际',
            CODE:'T11',
          }

        ]
      },
      /* 配置相关的参数 */
      configs: {
        queryConfigUrl: '/basicdata/sysUserCustom/list/gateGanttConfig',
        saveConfigUrl: '/basicdata/sysUserCustom/save/gateGanttConfig',
        queryConfigsUrl: '/basicdata/sysUserCustom/queryAll',
        queryColorUrl: '/resource/gantt/gate/queryColour',
        key: 'confItem',
        value: 'confValue',
        data: {
          customType: 'gateGanttConfig'
        }
      },
      gateConfigs: {
        loading: false,
        visible: false,
        title: '个人显示登机口配置',
        url: '/basicdata/sysUserCustom/save/gateGanttConfig',
        key: 'gateSort',
        label: '登机口',
        props: {key: 'CODE', labelSpan: 'ATTRCN'},
        optionsKey: 'allGate',
        options: [
          {
            ATTR: "I",
            ATTRCN: "国际",
            CODE: "G11(T1)",
            NAME: "G11(T1)",
            TERMINAL: "T1",
          },
          {
            ATTR: "I",
            ATTRCN: "国际",
            CODE: "G12(T1)",
            NAME: "G12(T1)",
            TERMINAL: "T1",
          }
        ],
        temp: [],
        data: []
      },
      flightConfigs: {
        loading: false,
        visible: false,
        title: '甘特条显示内容配置',
        url: '/basicdata/sysUserCustom/save/gateGanttConfig',
        key: 'flightFont',
        optionsKey: 'confFont',
        typeOptions: [
          {key: 'D', label: '出港航班'}
        ],
        type: 'D',
        options: {
          'D': {
            all: [
              {key: 'flightNumD', label: '航班号'},
              {key: 'gate', label: '登机口'},
              {key: 'stand', label: '机位'},
              {key: 'progressStatusDCn', label: '航班状态'},
              {key: 'taskDCn', label: '航班任务'}
            ]
          }
        },
        temp: {
          'D': {
            left: 'stand',
            center: 'flightNumD',
            right: 'gate'
          }
        },
        data: {
          'D': {
            left: 'stand',
            center: 'flightNumD',
            right: 'gate'
          }
        }
      },
      /* 查询甘特图相关 */
      queryUrls: {
        queryResourceUrl: '/resource/gateGantt/getSelectBox',
        gates: '/resource/gateGantt/queryFlightGate',
        queryUrl: '/resource/gateGantt/queryFlightInfo',
        division: '/resource/gateGantt/queryFlightDivisionGate',
        conflict: '/resource/gateGantt/queryFlightConflitTime',
        unconfirmed: '/resource/gateGantt/queryFlightGateNoAck',
        aircraftUsed: '/resource/gateGantt/queryAircraftResourceUsed'
      },
      /* 菜单栏 */
      cursorStatus: 0,
      hoverDlgData: {
        visible: false,
        left: 0,
        top: 0,
        width: 0,
        info: ''
      },
      // 登机口设置显隐控制
      settingVisible: {
        visible: false
      },
      // 甘特图配置显隐控制
      colorConfigData: {
        visible: false,
        type: 'gate'
      },
      /* 航班详情 */
      flightDetail: {
        url: '/resource/gateGantt/queryGanttFlightInfoDetail',
        data: {},
        fields: [
          {key: 'flightNumD', label: '出港航班号'},
          {key: 'attrDCn', label: '属性'},
          {key: 'taskDCn', label: '航班任务'},
          {key: 'terminalStationDCn', label: '目的站'},
          {key: 'routeDCn', label: '下一站'},
          {key: 'progressStatusDNameC', label: '正常状态'},
          {key: 'abnormalStatusDNameC', label: '异常状态'},
          {key: 'abnormalReasonDNameC', label: '出港异常原因'},
          {key: 'std', label: '计划出港', formatter: this.formatterWholeMin},
          {key: 'atd', label: '实际出港', formatter: this.formatterWholeMin},
          {key: 'stand', label: '机位'},
          {key: 'vipDFlag', label: '出港VIP', format: this.formatYN},
          {key: 'gate', label: '登机口', format: this.formatResource, bgColor: 'rgba(177,223,246,1)', aircraftShow: true},
          {key: 'ats', label: '开始登机时间', formatter: this.formatterWholeMin, bgColor: 'rgba(198,229,245,1)', aircraftShow: true, color: '#007CCA'},
          {key: 'ate', label: '结束登机时间', formatter: this.formatterWholeMin, bgColor: 'rgba(177,223,246,1)', aircraftShow: true, color: '#007CCA'},
          {key: 'aircraftNo', label: '机号', bgColor: 'rgba(198,229,245,1)', aircraftShow: true},
          {key: 'aircraftType', label: '机型', bgColor: 'rgba(177,223,246,1)', aircraftShow: true},
          {key: 'aircraftTypeConflict', label: '机型冲突', format: this.formatYN, props: {Y: '冲突'}},
          {key: 'timeConflict', label: '时间冲突', format: this.formatYN, props: {Y: '冲突'}},
          {key: 'airlineConflict', label: '航司冲突', format: this.formatYN, props: {Y: '冲突'}},
          {key: 'taskConflict', label: '任务冲突', format: this.formatYN, props: {Y: '冲突'}},
          {key: 'attrConflict', label: '属性冲突', format: this.formatYN, props: {Y: '冲突'}}
        ]
      },
      /* 右键菜单 */
      menuFlight: {
        show: false,
        url: '/dynamicFlight/status/his',
        style: {
          x: 0,
          y: 0,
          maxWidth: 206,
          maxLength: 6
        },
        data: {},
        items: [
          {
            label: '登机口确认',
            disabled: true,
            method: this.resourceConfirm,
            data: {
              title: '登机口',
              url: '/resource/flightConfirm/update',
              type: 'gateConfirm',
              key: ['resourceType', 'flag'],
              value: ['GATE', 'confirm']
            },
            reg: [
              {
                key: 'inOutFlag',
                value: ['D', 'A|D']
              },
              {
                key: 'gateFlag',
                value: true
              },
              {
                key: ['resourceConfirmFlag', 'GATE'],
                value: true
              },
              {
                key: 'ats',
                value: [null, '']
              },
              {
                key: 'endFlag',
                disValue: ['Y', 'Y|Y']
              },
              {
                key: 'hisFlag',
                value: 'N'
              }
            ]
          },
          {
            label: '登机口取消确认',
            disabled: true,
            method: this.resourceConfirm,
            data: {
              title: '登机口',
              url: '/resource/flightConfirm/update',
              type: 'gateConfirm',
              key: ['resourceType', 'flag'],
              value: ['GATE', 'cancel']
            },
            reg: [
              {
                key: 'inOutFlag',
                value: ['D', 'A|D']
              },
              {
                key: 'gateFlag',
                value: true
              },
              {
                key: ['resourceConfirmFlag', 'GATE'],
                value: false
              },
              {
                key: 'ats',
                value: [null, '']
              },
              {
                key: 'endFlag',
                disValue: ['Y', 'Y|Y']
              },
              {
                key: 'hisFlag',
                value: 'N'
              }
            ]
          },
          {
            label: '登机口分配更多',
            disabled: false,
            method: this.startGateDistMore,
            data: {
            },
            affectedEndFlag: true,
            reg: [
              {
                key: 'dynamicResourceNo',
                disValue: [null, '']
              },
              {
                key: 'lockedFlag',
                disValue: 'Y'
              },
              {
                key: 'ats',
                value: [null, '']
              },
              {
                key: 'hisFlag',
                value: 'N'
              }
            ]
          },
          {
            label: '登机口回收',
            disabled: false,
            method: this.gateRecoveryTooltip,
            data: {
              url: '/resource/gateGantt/gateRecovery/save'
            },
            affectedEndFlag: true,
            reg: [
              {
                key: 'dynamicResourceNo',
                disValue: [null, '']
              },
              {
                key: 'lockedFlag',
                disValue: 'Y'
              },
              {
                key: 'ats',
                value: [null, '']
              },
              {
                key: 'hisFlag',
                value: 'N'
              }
            ]
          },
          {
            label: '航班业务审计',
            disabled: false,
            method: this.flightAudit,
            data: {
              title: '航班业务审计',
              url: '/operLog/queryLog',
              type: 'flightAudit',
              key: 'remark',
              value: '全部'
            },
            reg: [
            ]
          }
        ]
      },
      menuGate: {
        show: false,
        url: '/resource/gateGantt/gate/status',
        style: {
          x: 0,
          y: 0,
          maxWidth: 206,
          maxLength: 6
        },
        data: {},
        items: [
          {
            label: '登机口-航空公司约束',
            disabled: true,
            method: this.openConstraint,
            data: {
              title: '登机口-航空公司约束',
              label: '航司',
              type: 'constraint',
              key: 'gateNo',
              value: 'airline',
              props: {key: 'CODE', label: 'NAME'}
            },
            reg: [
              {
                key: 'gateNo',
                disValue: [null, '']
              },
              {
                key: 'constraintUseable',
                disValue: ['N']
              },
              {
                key: 'isOccupied',
                disValue: true
              }
            ]
          },
          {
            label: '登机口-任务约束',
            disabled: true,
            method: this.openConstraint,
            data: {
              title: '登机口-任务约束',
              label: '任务',
              type: 'constraint',
              key: 'gateNo',
              value: 'task',
              props: {key: 'CODE', label: 'NAME'}
            },
            reg: [
              {
                key: 'gateNo',
                disValue: [null, '']
              },
              {
                key: 'constraintUseable',
                disValue: ['N']
              },
              {
                key: 'isOccupied',
                disValue: true
              }
            ]
          },
          {
            label: '登机口-机型约束',
            disabled: true,
            method: this.openConstraint,
            data: {
              title: '登机口-机型约束',
              label: '机型',
              type: 'constraint',
              key: 'gateNo',
              value: 'aircraftType',
              props: {key: 'CODE'}
            },
            reg: [
              {
                key: 'gateNo',
                disValue: [null, '']
              },
              {
                key: 'constraintUseable',
                disValue: ['N']
              },
              {
                key: 'isOccupied',
                disValue: true
              }
            ]
          },
          {
            label: '登机口-属性约束',
            disabled: true,
            method: this.openConstraint,
            data: {
              title: '登机口-属性约束',
              label: '属性',
              type: 'constraint',
              key: 'gateNo',
              value: 'attr',
              props: {key: 'CODE', label: 'NAME'},
              opts: [
                {CODE: 'D', NAME: '国内'},
                {CODE: 'I', NAME: '国际'},
                {CODE: 'R', NAME: '地区'},
                {CODE: 'M', NAME: '混合'}
              ]
            },
            reg: [
              {
                key: 'gateNo',
                disValue: [null, '']
              },
              {
                key: 'constraintUseable',
                disValue: ['N']
              },
              {
                key: 'isOccupied',
                disValue: true
              }
            ]
          },
          {
            label: '登机口其他限制约束',
            disabled: true,
            method: this.openConstraint,
            data: {
              title: '登机口其他限制约束',
              type: 'constraint',
              key: 'gateNo',
              value: 'other'
            },
            reg: [
              {
                key: 'gateNo',
                disValue: [null, '']
              },
              {
                key: 'isOccupied',
                disValue: true
              }
            ]
          },
          {
            label: '登机口是否可用设置',
            disabled: false,
            method: this.gateIsUseable,
            data: {
              title: '设置登机口可用/不可用',
              url: '/resource/gateGantt/gate/useable',
              type: 'isUseable',
              key: 'isUseable',
              value: ''
            },
            reg: [
              {
                key: 'gateNo',
                disValue: [null, '']
              },
              {
                key: 'isOccupied',
                disValue: true
              }
            ]
          },
          {
            label: '登机口约束是否可用设置',
            disabled: false,
            method: this.gateConstraintUseable,
            data: {
              title: '设置登机口约束可用/不可用',
              url: '/resource/gateGantt/gateConstraint/updateUseable',
              type: 'constraintUseable',
              key: 'isUseable',
              value: ''
            },
            reg: [
              {
                key: 'gateNo',
                disValue: [null, '']
              },
              {
                key: 'isOccupied',
                disValue: true
              }
            ]
          }
        ]
      },
      /* 登机口右键 */
      constraintData: {
        loading: false,
        visible: false,
        title: '登机口-{类型}约束',
        queryUrl: '/resource/gateGantt/{type}/queryGateConstraint',
        url: '/resource/gateGantt/{type}/updateGateConstraint',
        type: '',
        label: '',
        props: {},
        opts: [],
        data: {
          gateNo: '',
          selected: []
        },
        otherData: {
          title: '登机口维护记录',
          loading: false,
          visible: false,
          addUrl: '/airportResource/resourceMaintenanceRecord/save',
          editUrl: '/airportResource/resourceMaintenanceRecord/update',
          deleteUrl: '/airportResource/resourceMaintenanceRecord/delete',
          type: '',
          data: {
            beginTime: '',
            endTime: '',
            resourceNo: '',
            terminal: '',
            resourceType: 'GATE',
            maintenanceId: ''
          }
        },
        tableData: {
          data: [],
          key: 'maintenanceId',
          multipleData: [],
          selectIndex: -1,
          fields: [
            {prop: 'beginTime', label: '维护开始时间', align: 'center', width: 150, formatter: this.formatterWholeMin},
            {prop: 'endTime', label: '维护结束时间', align: 'center', width: 150, formatter: this.formatterWholeMin}
          ]
        }
      },
      /* 甘特条拖拽 */
      distributeData: {
        status: false,
        url: '/resource/gateGantt/gate/saveSelf',
        regUrl: '/resource/gateGantt/gate/querySelf',
        confUrl: '/resource/gateGantt/selectSetBox',
        disFields: [
          {prop: 'checkAttrConflict', label: '航班属性冲突', code: 'gate_check_attr_conflict', hidden: false},
          {prop: 'checkTerminal', label: '航班航站楼冲突', code: 'gate_check_terminal', hidden: false}
        ],
        checkFields: [
          {prop: 'checkAttrConflict', label: '航班属性冲突', regColorType: 'fltAttrReg', code: 'gate_check_attr_conflict', hidden: false},
          {prop: 'checkTerminal', label: '航班航站楼冲突', regColorType: 'terminalReg', code: 'gate_check_terminal', hidden: false},
          {prop: 'checkTime', label: '时间冲突', regColorType: 'timeConflict'},
          {prop: 'checkTask', label: '登机口-任务冲突', regColorType: 'taskReg', code: 'gate_check_task', hidden: false},
          {prop: 'checkAircraftType', label: '机型冲突', regColorType: 'aircraftTypeReg', code: 'gate_check_aircraft_type', hidden: false},
          {prop: 'checkAirline', label: '登机口-航司冲突', regColorType: 'airlineReg', code: 'gate_check_airline', hidden: false},
          {prop: 'checkAttr', label: '登机口-属性冲突', regColorType: 'attrReg', code: 'gate_check_attr', hidden: false},
          {prop: 'checkBridge', label: '廊桥不可用', regColorType: 'bridgeReg'},
          {prop: 'checkMaint', label: '登机口维护', regColorType: 'maintGate'},
          {prop: 'checkUseable', label: '登机口不可用', regColorType: 'gateUsable'}
        ]
      },
      /* 甘特图配置 */
      allGateData: [],
      xAxisConf: {
        start: '2020-02-28 00:00',
        width: 0
        /* scroll: {
          per: 0.3,
          width: 10,
          height: 10,
          x: 0,
          y: 500,
          bottom: 0
        } */
      },
      yAxisConf: {
        conf: {
          id: 'gateNo',
          value: 'gateNo'
        },
        height:3880
      },
      series: {
        data: [],
        rowConf: {
          id: 'gateNo',
          value: 'dataArray',
          height: 60,
          margin: [9.5]
        },
        colConf: {
          id: 'dynamicResourceId',
          s: ['ats', 'ets'],
          e: ['ate', 'ete'],
          strokeDasharray: [5, 5],
          labels: {
            'D': {
              left: 'stand',
              center: 'flightNumD',
              right: 'gate'
            },
            'A|D': {
              left: 'stand',
              center: 'flightNumD',
              right: 'gate'
            }
          },
          aircraftLabel: 'aircraftNo'
        }
      },
      yAxisNdConf: {
        conf: {
          id: 'rowkey',
          value: 'gateNo'
        },
        height: 0
      },
      seriesNd: {
        data: [],
        rowConf: {
          id: 'rowkey',
          value: 'dataArray',
          height: 60,
          margin: [9.5]
        },
        colConf: {
          id: 'dynamicResourceId',
          s: ['ats', 'ets'],
          e: ['ate', 'ete'],
          strokeDasharray: [5, 5],
          labels: {
            'D': {
              left: 'stand',
              center: 'flightNumD',
              right: 'gate'
            },
            'A|D': {
              left: 'stand',
              center: 'flightNumD',
              right: 'gate'
            }
          },
          aircraftLabel: 'aircraftNo'
        }
      },
      markLineTop: {
        y: 0,
        boundaryGap: [10, 30],
        height: 0,
        color: '#333'
      },
      markLineBottom: {
        y: 0,
        boundaryGap: [10, 30],
        height: 0,
        color: '#333'
      },
      refresh: [],
      seriesRefresh: false,
      seriesNdRefresh: false,
      // 右键航班业务审计弹框数据
      auditData: {
        visible: false,
        data: {
          flight: {},
          logs: []
        },
        topData: [
          {prop: 'flightNumAD', label: '航班号'},
          {prop: 'strExecDate', label: '执行日期', class: 'special'},
          {prop: 'inOutFlagCn', label: '进出港标识', class: 'special-large'},
          {prop: 'taskNameC', label: '任务'},
          {prop: 'aircraftNo', label: '机号', class: 'special'},
          {prop: 'aircraftType', label: '机型', class: 'special-large'},
          {prop: 'gate', label: '国内登机口'},
          {prop: 'gateI', label: '国际登机口', class: 'special'},
          {prop: 'attrCn', label: '属性', class: 'special-large'}
        ],
        centerData: [
          {prop: 'logDetail', label: '描述'},
          {prop: 'logUser', label: '操作员'},
          {prop: 'logTime', label: '操作时间'}
        ],
        bottomBtns: [
          {label: '进出', isChecked: false},
          {label: '机位', isChecked: false},
          {label: '登机口', isChecked: false},
          {label: '值机柜台', isChecked: false},
          {label: '行李转盘', isChecked: false},
          {label: '全部', isChecked: true}
        ]
      },
      // 冲突提示
      promptData: {
        title: '时间冲突提示',
        data: []
      }
    }
  },
  computed: {
    ...mapState({
      xAxis: state => state.gantt.xAxis,
      yAxis: state => state.gantt.yAxis,
      yAxisNd: state => state.gantt.yAxisNd,
      conflicts: state => state.gantt.conflicts,
      colorTypes: state => state.gantt.gateColorTypes,
      colorConfig: state => state.gantt.gateColorConfig
    }),
    computeLeftWidth () {
      return (this.pStyle.leftWidth + (this.showBlock.right ? 0 : this.pStyle.rightWidth))
    },
    computeLeftTopHeight () {
      return (this.pStyle.topHeight + (this.showBlock.leftBottom.show ? 0 : this.pStyle.bottomHeight))
    },
    computeLeftBottomHeight () {
      return (this.pStyle.bottomHeight + (this.showBlock.leftTop.show ? 0 : (this.pStyle.topHeight + 12)))
    },
    customQueryFields () {
      if (this.queryData.index > -1) {
        return this.queryData['fields' + this.queryData.index]
      } else {
        return (this.showBlock.leftTop.type === 'Q') ? this.queryData.fields : []
      }
    },
    computedDetail () {
      return function (data, field) {
        let value = ''
        if (field.format) {
          value = field.format(data, field) || ''
        } else if (field.keys) {
          for (let i = 0; i < field.keys.length; i++) {
            value = _.get(data, field.keys[i])
            if (value) {
              break
            } else {
              value = ''
            }
          }
        } else {
          value = _.get(data, field.key) || ''
        }
        if (field.formatter) {
          value = field.formatter(value)
        }
        return value
      }
    }
  },
  created () {
    this.$emit('clearAllQuery', true)
    this.$set(this.xAxisConf, 'timeSMult', this.xConf.timeSection[0])
    this.$store.commit('setGanttConf', [
      {key: 'xAxis', value: this.xAxisConf},
      {key: 'yAxis', value: this.yAxisConf},
      {key: 'series', value: this.series},
      {key: 'yAxisNd', value: this.yAxisNdConf},
      {key: 'seriesNd', value: this.seriesNd}
    ])
    this.initMenuIndex(this.menuFlight.items)
    this.initMenuIndex(this.menuGate.items)
    this.initQueryResource()
    this.initCustomConfig()
    this.initColorConfig()
    this.initCheckConfig()
    getQueryAll('/', null).then(res => {
      this.newTime = new Date(res.headers.date)
      this.refrushNowTime()
      this.timer = setInterval(this.refrushNowTime, this.intervalTime)
    })
  },
  mounted () {

    // this.queryGates()
    this.$nextTick(() => {
      let customScroll = this.customScroll
      window.addEventListener('click', customScroll)
      this.$set(this.markLineTop, 'y', this.xAxis.top + this.xAxis.lineStyle.l)
      this.$set(this.markLineTop, 'height', this.computeLeftTopHeight - this.markLineTop.y - this.yAxis.boundaryGap[1])
      this.$set(this.markLineBottom, 'y', this.xAxis.top + this.xAxis.lineStyle.l)
      this.$set(this.markLineBottom, 'height', this.computeLeftBottomHeight - this.markLineBottom.y - this.yAxis.boundaryGap[1])
      // this.$refs.svgTopContent.onscroll = function () {
      //   window.TweenMax.to('#xAxisTop', 0.5, {
      //     x: -this.scrollLeft
      //   })
      //   window.TweenMax.to('#yAxisTop', 0.5, {
      //     y: -this.scrollTop
      //   })
      //   customScroll()
      //   /* d3.select('#xAxisTop')
      //     .attr('x', -this.scrollLeft)
      //   d3.select('#yAxisTop')
      //     .attr('y', -this.scrollTop) */
      // }
      this.$refs.svgBottomContent.onscroll = function () {
        window.TweenMax.to('#xAxisBottom', 0, {
          x: -this.scrollLeft
        })
        window.TweenMax.to('#yAxisBottom', 0, {
          y: -this.scrollTop
        })
        customScroll()
        /* d3.select('#xAxisBottom')
          .attr('x', -this.scrollLeft)
        d3.select('#yAxisBottom')
          .attr('y', -this.scrollTop) */
      }
      this.$set(this, 'refresh', ['all'])
      // let top = this.$refs.svgTopContent.querySelector('svg')
      let mousemove = this.mousemove
      let mouseleave = this.mouseleave
      // this.$d3.select(this.$refs.svgTopContent)
      //   .on('mousemove touchmove', function () {
      //     mousemove(top, 'Top')
      //   })
      //   .on('mouseleave', function () {
      //     mouseleave(top, 'Top')
      //   })
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
  destroyed () {
    clearInterval(this.timer)
    window.removeEventListener('click', this.customScroll)
    // this.$refs.svgTopContent.onscroll = null
  },
  methods: {
    /* websocket刷新 */
    customWsOnMessage (data) {
      if (data.type === '2') {
        this.refreshGantt()
      } else if (data.type === '8') {
        this.$store.commit('setGanttConf', [
          {key: 'gateColorConfig', value: data.data}
        ])
      } else if (data.type === '4') {
        this.$store.commit('setGanttConf', [
          {key: 'sysColorConfig', value: data.data}
        ])
      } else if (data.type === '10') {
        if (data.data.flag) {
          this.$set(this.promptData, 'data', data.data.list || [])
        }
        debugger
        // 更新有时间冲突的航班信息
        data.data.list.forEach(o => {
          let i = _.findIndex(this.allGateData, ['dynamicResourceNo', o.standNo])
          if (~i && (o.dynamicResourceIdList || []).length) {
            o.dynamicResourceIdList.forEach(id => {
              let c = _.findIndex(this.allGateData[i][this.series.rowConf.value], [this.series.colConf.id, id])
              if (~c) {
                this.$set(this.allGateData[i][this.series.rowConf.value], c, {...this.allGateData[i][this.series.rowConf.value][c], timeConflict: 'Y'})
              }
            })
          }
          if ((this.seriesNd.data || []).length) {
            this.seriesNd.data.forEach(obj => {
              if (obj.dynamicResourceNo === o.dynamicResourceNo && (o.dynamicResourceIdList || []).length) {
                o.dynamicResourceIdList.forEach(id => {
                  let cs = _.findIndex(obj[this.seriesNd.rowConf.value], [this.seriesNd.colConf.id, id])
                  if (~cs) {
                    this.$set(obj[this.seriesNd.rowConf.value], cs, {...obj[this.seriesNd.rowConf.value][cs], timeConflict: 'Y'})
                  }
                })
              }
            })
          }
        })
      } else if (data.type === '9') {
        this.initCheckConfig()
      }
    },
    customScroll () {
      this.$set(this.menuFlight, 'show', false)
      this.$set(this.menuGate, 'show', false)
    },
    setSelfData ({key, ckey, value}) {
      this.$set(_.get(this, key), ckey, value)
      if (key.includes('series')) {
        this.$set(this, key + 'Refresh', !this[key + 'Refresh'])
      }
    },
    /* 甘特图初始化、个人配置初始化 */
    initQueryResource (callback) {
      queryAllAiis(this.queryUrls.queryResourceUrl, {}).then(res => {
        if (res.data.code === 0) {
          // this.$set(this.filterData, 'options', res.data.data[this.filterData.optionsKey] || [])
          // this.$set(this.gateConfigs, 'options', res.data.data[this.gateConfigs.optionsKey] || [])
          if (this.gateConfigs.init) {
            this.$set(this.gateConfigs, 'data', _.map(this.gateConfigs.options, this.gateConfigs.props.key))
            this.$set(this.gateConfigs, 'temp', _.cloneDeep(this.gateConfigs.data))
          }
        }
        callback && callback()
      }).catch(() => {
        this.showWarning('请求')
        callback && callback()
      })
    },
    initCustomConfig () {
      queryAll(this.configs.queryConfigsUrl, this.configs.data).then(res => {
        if (res.data.code === 0) {
          let gateConf = _.find(res.data.data, [this.configs.key, this.gateConfigs.key])
          if (gateConf) {
            this.$set(this.gateConfigs, 'data', gateConf[this.configs.value])
          } else if ((this.gateConfigs.options || []).length) {
            this.$set(this.gateConfigs, 'data', _.map(this.gateConfigs.options, this.gateConfigs.props.key))
          } else {
            this.$set(this.gateConfigs, 'init', true)
            this.$set(this.gateConfigs, 'data', [])
          }
          this.$set(this.gateConfigs, 'temp', _.cloneDeep(this.gateConfigs.data))
          let flightConf = _.find(res.data.data, [this.configs.key, this.flightConfigs.key])
          if (flightConf) {
            this.$set(this.flightConfigs, 'data', flightConf ? flightConf[this.configs.value] : [])
            this.$set(this.flightConfigs, 'temp', _.cloneDeep(this.flightConfigs.data))
          }
        } else {
          this.showError('获取个人配置相关信息', '请重新获取')
        }
      }).catch(() => {
        console.warn('initCustomConfig--个人配置初始化异常')
        this.showWarning('获取个人配置相关信息')
      })
    },
    initColorConfig () {
      queryAllAiis(this.configs.queryColorUrl, null).then(res => {
        if (res.data.code === 0) {
          this.$store.commit('setGateColorConfig', res.data.data)
        } else {
          this.showError('"数据请求"', '请重新尝试')
        }
      })
    },
    initCheckConfig () {
      queryAllAiis(this.distributeData.confUrl, null).then(res => {
        if (res.data.code === 0) {
          if ((res.data.data.sysParams || []).length) {
            let arr = res.data.data.sysParams
            this.distributeData.checkFields.forEach(field => {
              if (field.code) {
                let obj = _.find(arr, ['paramCode', field.code])
                if (obj) {
                  if (obj.paramValue === 'Y') {
                    this.$set(field, 'hidden', false)
                  } else {
                    this.$set(field, 'hidden', true)
                  }
                }
              }
            })
          }
        }
      })
    },

    showSetting () {
      this.$set(this.settingVisible, 'visible', true)
    },
    /* 甘特图查询及初始化 */
    queryGates: _.throttle(function (callback) {
      if (!this.distributeData.status) {
        let result = 'success'
        postAiisData(this.queryUrls.gates, null).then(res => {
          let scroll = null
          if (this.$refs.svgBottomContent) {
            scroll = {
              top: this.$refs.svgBottomContent.scrollTop,
              left: this.$refs.svgBottomContent.scrollLeft
            }
          }
          let refArr = []
          this.newTime = new Date(res.headers.date)
          let sTime = this.formatYMD(new Date(this.newTime - 24 * 60 * 60 * 1000))
          if (sTime !== this.formatYMD(this.xAxisConf.start) && this.showBlock.leftTop.show) {
            this.queryOthers(this.refreshOther)
            refArr.push('start')
          }
          this.$set(this.xAxisConf, 'now', `${this.formatYMD(this.newTime)} ${this.formatHM(this.newTime)}`)
          this.$set(this.xAxisConf, 'start', `${sTime} 00:00`)
          this.$store.commit('setGanttConf', [
            {key: 'xAxis.now', value: this.xAxisConf.now},
            {key: 'xAxis.start', value: this.xAxisConf.start}
          ])
          refArr.push('now')
          if (res.data.code == 0) {
            this.$emit('setSelfData', {key: 'highlight.position', ckey: 'count', value: -1})
            this.$set(this, 'allGateData', res.data.data)
            this.$set(this, 'refresh', refArr)
            this.$nextTick(() => {
              scroll && this.$refs.svgBottomContent && this.$refs.svgBottomContent.scrollTo(scroll)
            })
          } else {
            this.showError('获取登机口甘特图信息', '请重新尝试')
            result = 'fail'
          }
          callback && callback(result)
        }).catch(() => {
          console.warn('queryGates--登机口甘特图查询异常')
          this.showWarning('获取登机口甘特图信息', '请重新尝试')
          result = 'error'
          callback && callback(result)
        })
      }
    }, 1000),
    queryOthers: _.throttle(function (flag, callback) {
      if (this.queryData.url) {
        if (this.queryData.url === this.queryUrls.queryUrl && _.isEmpty(this.queryData.data)) {
          return
        }
        let result = 'success'
        postAiisData(this.queryData.url, _.isEmpty(this.queryData.data) ? null : this.queryData.data).then(res => {
          let scroll = null
          if (flag === this.refreshOther) {
            scroll = {
              // top: this.$refs.svgTopContent.scrollTop,
              left: this.$refs.svgTopContent.scrollLeft
            }
          }
          let refArr = []
          this.newTime = new Date(res.headers.date)
          let sTime = this.formatYMD(new Date(this.newTime - 24 * 60 * 60 * 1000))
          if (sTime !== this.formatYMD(this.xAxisConf.start)) {
            this.queryGates()
            refArr.push('start')
          }
          this.$set(this.xAxisConf, 'now', `${this.formatYMD(this.newTime)} ${this.formatHM(this.newTime)}`)
          this.$set(this.xAxisConf, 'start', `${sTime} 00:00`)
          this.$store.commit('setGanttConf', [
            {key: 'xAxis.now', value: this.xAxisConf.now},
            {key: 'xAxis.start', value: this.xAxisConf.start}
          ])
          refArr.push('now')
          if (res.data.code === 0) {
            this.$emit('setSelfData', {key: 'highlight.position', ckey: 'count', value: -1})
            this.$set(this.seriesNd, 'data', res.data.data)
            this.$store.commit('setGanttConf', [
              {key: 'seriesNd.data', value: res.data.data}
            ])
            this.$set(this.showBlock.leftTop, 'show', true)
            this.$emit('setSelfData', {key: 'showBlock.leftTop', ckey: 'show', value: true})
            this.$set(this, 'refresh', refArr)
            this.$set(this, 'seriesNdRefresh', !this.seriesNdRefresh)
            this.$nextTick(() => {
              // scroll && this.$refs.svgTopContent && this.$refs.svgTopContent.scrollTo(scroll)
            })
            if (!flag) {
              this.$emit('closeQueryDialog')
            }
          } else {
            this.$emit('loadingQueryFalse')
            this.showError('查询', '请重新尝试')
            result = 'fail'
          }
          callback && callback(result)
        }).catch(() => {
          console.warn('queryOthers--其他甘特图查询异常')
          this.$emit('loadingQueryFalse')
          this.showWarning('请求', '请检查网络连接')
          result = 'error'
          callback && callback(result)
        })
      }
    }, 1000),
    /* 甘特图刷新 */
    refreshGantt () {
      let result = []
      this.queryGates(res => {
        result.push(res)
        if (this.firstQuery && result.length === 2) {
          this.$emit('initEnd')
        }
      })
      if (this.firstQuery) {
        this.$emit('showQueryDialog', 'N', undefined, res => {
          result.push(res)
          if (result.length === 2) {
            this.$emit('initEnd')
          }
        })
      } else {
        this.showBlock.leftTop.show && this.queryOthers(this.refreshOther)
        this.showBlock.right && this.showFlight(this.flightDetail.data)
      }
    },
    /* 工具方法 */
    refrushNowTime (flag) {
      let refArr = []
      this.newTime = new Date(this.newTime.getTime() + this.intervalTime)
      let today = this.newTime
      let hour = this.addZero(today.getHours())
      let min = this.addZero(today.getMinutes())
      let now = `${hour}:${min}`
      let date = this.formatYMD(today) + ' ' + this.formatHM(today)
      let sTime = this.formatYMD(new Date(today - 24 * 60 * 60 * 1000))
      if (this.xAxisConf && this.xAxisConf.start && sTime !== this.formatYMD(this.xAxisConf.start)) {
        this.refreshGantt()
        refArr.push('start')
      }
      this.$set(this.xAxisConf, 'now', `${this.formatYMD(today)} ${this.formatHM(today)}`)
      this.$set(this.xAxisConf, 'start', `${sTime} 00:00`)
      this.$store.commit('setGanttConf', [
        {key: 'xAxis.now', value: this.xAxisConf.now},
        {key: 'xAxis.start', value: this.xAxisConf.start}
      ])
      refArr.push('now')
      this.$set(this, 'refresh', refArr)
      let sT = new Date(`${sTime} 00:00:00`)
      let lT = new Date(`${this.formatYMD(today)} ${this.formatHM(today)}:00`)
      let i = (lT.getTime() - sT.getTime()) / this.xAxis.timestempUnit
      if (flag === 'series') {
        this.$refs.svgBottomContent.scrollTo({left: i * (this.xAxis.timeSpace + this.xAxis.timeMultSpace * this.xAxis.timeSMult) - this.computeLeftWidth / 2})
      } else if (flag === 'seriesNd') {
        // this.$refs.svgTopContent.scrollTo({left: i * (this.xAxis.timeSpace + this.xAxis.timeMultSpace * this.xAxis.timeSMult) - this.computeLeftWidth / 2})
      } else {
        if (!this.distributeData.status) {
          // this.$refs.svgTopContent.scrollTo({left: i * (this.xAxis.timeSpace + this.xAxis.timeMultSpace * this.xAxis.timeSMult) - this.computeLeftWidth / 2})
          this.$refs.svgBottomContent.scrollTo({left: i * (this.xAxis.timeSpace + this.xAxis.timeMultSpace * this.xAxis.timeSMult) - this.computeLeftWidth / 2})
        }
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
    addZero (value) {
      if (value < 10) {
        return `0${value}`
      } else {
        return value
      }
    },
    /* 个人配置 */
    // 查询
    queryConfigs (key) {
      queryAll(this.configs.queryConfigUrl + '/' + this[key + 'Configs'].key, {}).then(res => {
        if (res.data.code === 0) {
          this.$set(this[key + 'Configs'], 'data', res.data.data || [])
        } else {
          this.showError('获取' + this[key + 'Configs'].title, '请重新获取')
        }
      }).catch(() => {
        console.warn('queryConfigs--个人配置获取异常')
        this.showWarning('获取' + this[key + 'Configs'].title)
      })
    },
    showConfig (key) {
      this.$set(this[key + 'Configs'], 'visible', true)
      this.$set(this[key + 'Configs'], 'temp', _.cloneDeep(this[key + 'Configs'].data))
    },
    handleConfigConfirm (key) {
      this.$set(this[key + 'Configs'], 'loading', true)
      this.$set(this[key + 'Configs'], 'data', _.cloneDeep(this[key + 'Configs'].temp))
      postData(this.configs.saveConfigUrl + '/' + this[key + 'Configs'].key, this[key + 'Configs'].temp).then(res => {
        if (res.data.code === 0) {
          this.showSuccess(this[key + 'Configs'].title)
          this.queryConfigs(key)
          if (key === 'gate') {
            this.closeGateConfigDialog()
          } else if (key === 'flight') {
            this.closeFlightConfigDialog()
          }
        } else {
          this.showError('保存' + this[key + 'Configs'].title, '请重新尝试')
        }
        this.$set(this[key + 'Configs'], 'loading', false)
      }).catch(() => {
        console.warn('handleConfigConfirm--保存个人配置异常')
        this.showWarning('保存' + this[key + 'Configs'].title)
        this.$set(this[key + 'Configs'], 'loading', true)
      })
    },
    resetFlightConfigs () {
      if (this.flightConfigs.type === 'D') {
        this.$set(this.flightConfigs.temp, 'D', {
          left: 'stand',
          center: 'flightNumD',
          right: 'gate'
        })
      }
    },
    closeGateConfigDialog (flag) {
      this.$set(this.gateConfigs, 'loading', false)
      this.$set(this.gateConfigs, 'visible', false)
      this.$set(this.gateConfigs, 'temp', _.cloneDeep(this.gateConfigs.data))
      this.handleTransChange('gateConfigTransfer')
    },
    closeFlightConfigDialog (flag) {
      this.$set(this.flightConfigs, 'loading', false)
      this.$set(this.flightConfigs, 'visible', false)
      this.$set(this.flightConfigs, 'type', 'D')
      this.$set(this.flightConfigs, 'temp', _.cloneDeep(this.flightConfigs.data))
    },
    /* 菜单栏-功能 */
    showColorDialog () {
      this.colorConfigData.visible = true
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
    hiddenBlock (position) {
      if (position === 'right') {
        this.$set(this.showBlock, 'right', !this.showBlock.right)
        this.$emit('setSelfData', {key: 'showBlock', ckey: 'right', value: this.showBlock.right})
      } else if (position === 'leftBottom') {
        this.$set(this.showBlock.leftBottom, 'show', !this.showBlock.leftBottom.show)
        this.$emit('setSelfData', {key: 'showBlock.leftBottom', ckey: 'show', value: this.showBlock.leftBottom.show})
        this.$set(this.markLineTop, 'height', this.computeLeftTopHeight - this.markLineTop.y - this.yAxis.boundaryGap[1])
        this.$set(this.markLineBottom, 'height', this.computeLeftBottomHeight - this.markLineBottom.y - this.yAxis.boundaryGap[1])
        // d3.select(this.$refs.markLineTop.querySelector('mark-line'))
        //   .attr('y2', this.markLineTop.y + this.markLineTop.height)
        // d3.select(this.$refs.markLineBottom.querySelector('mark-line'))
        //   .attr('y2', this.markLineBottom.y + this.markLineBottom.height)
      } else if (position === 'leftTop') {
        this.$set(this.showBlock.leftTop, 'show', !this.showBlock.leftTop.show)
        this.$emit('setSelfData', {key: 'showBlock.leftBottom', ckey: 'show', value: this.showBlock.leftBottom.show})
        this.$set(this.markLineTop, 'height', this.computeLeftTopHeight - this.markLineTop.y - this.yAxis.boundaryGap[1])
        this.$set(this.markLineBottom, 'height', this.computeLeftBottomHeight - this.markLineBottom.y - this.yAxis.boundaryGap[1])
        // d3.select(this.$refs.markLineTop.querySelector('mark-line'))
        //   .attr('y2', this.markLineTop.y + this.markLineTop.height)
        // d3.select(this.$refs.markLineBottom.querySelector('mark-line'))
        //   .attr('y2', this.markLineBottom.y + this.markLineBottom.height)
        if (!this.showBlock.leftTop.show) {
          let highlightArr = _.filter(this.highlight.data, (o) => {return o.seriesKey !== 'seriesNd'})
          this.$emit('setSelfData', {key: 'highlight', ckey: 'data', value: highlightArr})
        } else {
          this.queryOthers(this.refreshOther)
        }
      }
    },
    enterDlgHover: _.debounce(function (info, event) {
      if (event.target.scrollWidth > event.target.offsetWidth) {
        this.$set(this.hoverDlgData, 'info', _.cloneDeep(info))
        this.$set(this.hoverDlgData, 'top', event.target.getBoundingClientRect().top + 10)
        if ((event.target.scrollWidth + 20) > window.innerWidth) {
          this.$set(this.hoverDlgData, 'width', window.innerWidth - 30)
          this.$set(this.hoverDlgData, 'left', 10)
        } else if ((event.target.scrollWidth + 13 + event.target.getBoundingClientRect().left) > window.innerWidth) {
          this.$set(this.hoverDlgData, 'width', event.target.scrollWidth + 13)
          this.$set(this.hoverDlgData, 'left', window.innerWidth - 20 - event.target.scrollWidth)
        } else {
          this.$set(this.hoverDlgData, 'width', event.target.scrollWidth + 13)
          this.$set(this.hoverDlgData, 'left', event.target.getBoundingClientRect().left)
        }
        this.$set(this.hoverDlgData, 'visible', true)
      }
    }, 0),
    leaveDlgHover: _.debounce(function () {
      this.$set(this.hoverDlgData, 'visible', false)
    }, 0),
    /* 右键初始化 */
    initMenuIndex (arr, index) {
      if (!index) {
        index = []
      }
      arr.forEach((item, i) => {
        let iArr = [...index, i]
        this.$set(item, 'index', iArr.join('-'))
        if (item.hasOwnProperty('children')) {
          this.initMenuIndex(item.children, iArr)
        }
      })
    },
    changeMenuDisabled (data, key) {
      let items = []
      flattenDeep(this['menu' + key].items, items, 0)
      _.forEach(items, (obj) => {
        let arr = obj.index.split('-')
        let str = '[' + arr.join('].children[') + ']'
        if (data.hisFlag === 'Y' && obj.label !== '航班业务审计') {
          this.$set(_.get(this['menu' + key].items, str), 'disabled', true)
          return
        }
        let result = false
        if (obj.affectedEndFlag) {
          let ioArr = data.inOutFlag.split('|')
          result = true
          for (let i = 0; i < ioArr.length; i++) {
            if (data['endFlag' + ioArr[i]] !== 'Y') {
              result = false
              break
            }
          }
        }
        if (!result) {
          if (obj.reg) {
            for (let i = 0; i < obj.reg.length; i++) {
              if (obj.reg[i].hasOwnProperty('disValue')) {
                if (_.isArray(obj.reg[i].disValue)) {
                  result = obj.reg[i].disValue.includes(_.get(data, obj.reg[i].key))
                } else {
                  result = (_.get(data, obj.reg[i].key) === obj.reg[i].disValue)
                }
                if (result) {
                  break
                }
              }
              if (obj.reg[i].hasOwnProperty('value')) {
                if (_.isArray(obj.reg[i].value)) {
                  result = !obj.reg[i].value.includes(_.get(data, obj.reg[i].key))
                } else {
                  result = (_.get(data, obj.reg[i].key) !== obj.reg[i].value)
                }
                if (result) {
                  break
                }
              }
            }
          }
        }
        if (arr.length) {
          this.$set(_.get(this['menu' + key].items, str), 'disabled', result)
          if (obj.data.type === 'isUseable') {
            if (data.isUseable === 'Y') {
              this.$set(_.get(this['menu' + key].items, str), 'label', '设置登机口不可用')
              this.$set(_.get(this['menu' + key].items, str + '.data'), 'title', '设置登机口不可用')
              this.$set(_.get(this['menu' + key].items, str + '.data'), 'value', 'N')
              /* if (data.isOccupied) { // 登机口占用中，不能设置为不可用
                this.$set(_.get(this['menu' + key].items, str), 'disabled', true)
              } */
            } else {
              this.$set(_.get(this['menu' + key].items, str), 'label', '设置登机口可用')
              this.$set(_.get(this['menu' + key].items, str + '.data'), 'title', '设置登机口可用')
              this.$set(_.get(this['menu' + key].items, str + '.data'), 'value', 'Y')
            }
          } else if (obj.data.type === 'constraintUseable') {
            if (data.constraintUseable === 'Y') {
              this.$set(_.get(this['menu' + key].items, str), 'hidden', false)
              this.$set(_.get(this['menu' + key].items, str), 'label', '设置登机口约束不可用')
              this.$set(_.get(this['menu' + key].items, str + '.data'), 'title', '设置登机口约束不可用')
              this.$set(_.get(this['menu' + key].items, str + '.data'), 'value', 'N')
            } else if (data.constraintUseable === 'N') {
              this.$set(_.get(this['menu' + key].items, str), 'hidden', false)
              this.$set(_.get(this['menu' + key].items, str), 'label', '设置登机口约束可用')
              this.$set(_.get(this['menu' + key].items, str + '.data'), 'title', '设置登机口约束可用')
              this.$set(_.get(this['menu' + key].items, str + '.data'), 'value', 'Y')
            } else if (!data.constraintUseable) {
              this.$set(_.get(this['menu' + key].items, str), 'hidden', true)
            }
          }
        }
      })
    },
    contextmenu (obj, key) {
      this['menu' + key].style.x = this.$d3.event.clientX
      this['menu' + key].style.y = this.$d3.event.clientY
      let ks = ['Flight', 'Gate']
      ks.forEach(k => {
        this.$set(this['menu' + k], 'show', false)
      })
      if (key === 'Gate') {
        queryAllAiis(this['menu' + key].url, obj.gateNo).then(res => {
          if (res.data.code === 0) {
            this.$set(this['menu' + key], 'data', {...obj, ...(res.data.data || {})})
            this.$set(this['menu' + key], 'show', true)
          } else {
            this.showError('获取登机口相关信息', '请重新尝试 !')
          }
        })
      } else if (key === 'Flight') {
        queryAllAiis(this['menu' + key].url, obj.afid).then(res => {
          if (res.data.code === 0) {
            this.$set(this['menu' + key], 'data', {...obj, ...(res.data.data || {}), attrD: obj.attrDFlag})
            this.$set(this['menu' + key], 'show', true)
          } else {
            this.showError('获取航班相关信息', '请重新尝试 !')
          }
        })
      } else {
        this.$set(this['menu' + key], 'data', {...obj})
        this.$set(this['menu' + key], 'show', true)
      }
    },
    /* 甘特条右键 */
    resourceConfirm (data, item, index) {
      /* if (data.inOutFlag === 'A|D') {
        let flightNum = ''
        let msgCont = ''
        let msgTip = ''
        if (index === '0') { // 登机口确认
          flightNum = data.resourceConfirmFlag.GATE ? data.flightNumD : ''
          msgCont = `是否对航班 ${flightNum} 进行登机口确认`
          msgTip = `若确认，则进行登机口确认操作`
        } else { // 登机口取消确认
          flightNum = !data.resourceConfirmFlag.GATE ? data.flightNumD : ''
          msgCont = `是否对航班 ${flightNum} 进行登机口取消确认`
          msgTip = `若确认，则进行登机口取消确认操作`
        }
        this.gateConfirmTooltip(data, item, index, msgCont, msgTip)
      } else { */
      this.openResourceConfirm(data, item, index)
      // }
    },
    gateConfirmTooltip (data, item, index, msgCont, msgTip) {
      this.$confirm(`
        <div class="warn-log">
          <div class="cancel-warn-img"></div>
        </div>
        <div><p class="other-msg-cont">${msgCont}</p></div>
        <div><p class="other-msg-tip">${msgTip}</p></div>`, '提示', {
        dangerouslyUseHTMLString: true,
        customClass: 'share-msg-dialog',
        closeOnClickModal: false
      }).then(() => {
        this.openResourceConfirm(data, item, index)
      }).catch(() => {
      })
    },
    openResourceConfirm (data, item, index) {
      if (!item.loading) {
        let obj = {
          afids: [data.afid]
        }
        if (_.isArray(item.key)) {
          item.key.forEach((key, i) => {
            this.$set(obj, key, item.value[i])
          })
        } else {
          this.$set(obj, item.key, item.value)
        }
        queryAllAiis(item.url, obj).then(res => {
          if (res.data.code === 0) {
            this.showSuccess('该航班所有' + item.title + '全部' + (item.value[1] === 'cancel' ? '取消确认' : '确认'))
          } else {
            this.showError('该航班所有' + item.title + '全部' + (item.value[1] === 'cancel' ? '取消确认' : '确认'), '请重新尝试')
          }
          this.$set(item, 'loading', false)
        }).catch(() => {
          this.showWarning('请求', '请重新尝试')
          this.$set(item, 'loading', false)
        })
      } else {
        this.showWarning('操作', '请勿频繁请求')
      }
    },
    gateRecoveryTooltip (data, item, index) {
      this.$confirm(`
        <div class="warn-log">
          <div class="cancel-warn-img"></div>
        </div>
        <div><p class="other-msg-cont">确定要进行登机口回收吗？</p></div>
        <div><p class="other-msg-tip">若确定，则回收该登机口${data.confirmedFlag === 'Y' ? '，同时取消确认该航班其他登机口' : ''}</p></div>`, '提示', {
        dangerouslyUseHTMLString: true,
        customClass: 'share-msg-dialog',
        closeOnClickModal: false
      }).then(() => {
        this.gateRecovery(data, item, index)
      }).catch(() => {
      })
    },
    gateRecovery (data, item, index) {
      if (!item.loading) {
        this.$set(item, 'loading', true)
        queryAllAiis(item.url, {afid: data.afid, gateNo: data.dynamicResourceNo, resourceType: 'GATE', isDelete: 'N'}).then(res => {
          if (res.data.code === 0) {
            if (res.data.data.recoveryType === 'Y') {
              this.$delete(item, 'loading')
              this.showSuccess(item.title)
            } else if (res.data.data.recoveryType === 'F') {
              this.$confirm(`
                <div class="warn-log">
                  <div class="cancel-warn-img"></div>
                </div>
                <div><p class="other-msg-cont">该航班次类资源信息已发布，是否强制回收登机口？</p></div>
                <div><p class="other-msg-tip"></p></div>`, '提示', {
                dangerouslyUseHTMLString: true,
                showCancelButton: true,
                confirmButtonText: '强制回收',
                cancelButtonText: '取消',
                customClass: 'share-msg-dialog',
                closeOnClickModal: false,
                beforeClose: (action, instance, done) => {
                  if (action === 'confirm') {
                    instance.confirmButtonLoading = true
                    queryAllAiis(item.url, {afid: data.afid, gateNo: data.dynamicResourceNo, resourceType: 'GATE', isDelete: 'Y'}).then(res => {
                      if (res.data.code === 0) {
                        if (res.data.data.recoveryType === 'Y') {
                          this.showSuccess('登机口强制回收')
                        } else if (res.data.data.recoveryType === 'N') {
                          this.showErrorCustom('登机口不可回收', '')
                        }
                        done()
                      } else {
                        this.showError(item.title, '请重新尝试')
                      }
                      instance.confirmButtonLoading = false
                    })
                  } else {
                    done()
                  }
                }
              }).then(() => {
                this.$delete(item, 'loading')
              }).catch(() => {
                console.log('gateRecovery--取消回收')
              })
            } else if (res.data.data.recoveryType === 'N') {
              this.showErrorCustom('登机口不可回收', '')
            }
          } else {
            this.showError(item.title, '请重新尝试')
          }
          this.$delete(item, 'loading')
        })
      } else {
        this.showWarning('操作', '请勿频繁请求')
      }
    },
    // 航班审计方法
    flightAudit (data, item, index) {
      if (!item.loading) {
        let obj = {
          afid: data.afid
        }
        if (_.isArray(item.key)) {
          item.key.forEach((key, i) => {
            this.$set(obj, key, item.value[i])
          })
        } else {
          this.$set(obj, item.key, item.value)
        }
        this.$set(this.auditData.bottomBtns[5], 'isChecked', true)
        _.forEach(this.auditData.bottomBtns, val => {
          if (val.label !== '全部') {
            val.isChecked = false
          }
        })
        this.$set(this.auditData, 'data', {flight: {}, logs: []})
        queryAllAiis(item.url, obj).then(res => {
          if (res.data.code === 0) {
            this.$set(this.auditData, 'data', res.data.data)
            this.auditData.visible = true
          } else {
            this.showError(item.title, '请重新尝试')
          }
          this.$set(item, 'loading', false)
        }).catch(() => {
          console.warn('flightAudit--航班业务审计方法异常')
          this.showWarning('请求', '请重新尝试')
          this.$set(item, 'loading', false)
        })
      } else {
        this.showWarning('操作', '请勿频繁请求')
      }
    },
    // 航班日志审计查询
    queryAuditData (type, index) {
      if (type === '关闭') {
        this.auditData.visible = false
      } else {
        this.$set(this.auditData.bottomBtns[index], 'isChecked', true)
        _.forEach(this.auditData.bottomBtns, val => {
          if (val.label !== type) {
            val.isChecked = false
          }
        })
        let obj = {
          afid: this.auditData.data.flight.afid,
          remark: type
        }
        this.$set(this.auditData.data, 'logs', [])
        queryAllAiis('/operLog/queryLog', obj).then(res => {
          if (res.data.code === 0) {
            this.$set(this.auditData.data, 'logs', res.data.data.logs)
          } else {
            this.showError('航班业务审计', '请重新尝试')
          }
        }).catch(() => {
          console.log('queryAuditData--航班业务审计查询异常')
          this.showWarning('请求', '请重新尝试')
        })
      }
    },
    showExecDate (item, field, k) {
      if (item.execDateA === item.execDateD) {
        return item.execDateA
      } else {
        let arr = []
        item.execDateA && arr.push(item.execDateA)
        item.execDateD && arr.push(item.execDateD)
        return arr.join('|')
      }
    },
    /* 登机口右键 */
    /* 约束 */
    openConstraint (data, item, index) {
      this.$set(this.constraintData, 'loading', false)
      this.$set(this.constraintData, 'type', item.value)
      this.$set(this.constraintData, 'title', item.title)
      this.$set(this.constraintData, 'label', item.label)
      this.$set(this.constraintData, 'props', item.props)
      let obj = {}
      this.$set(obj, item.key, data[item.key])
      if (item.value === 'other') {
        this.queryConstraintOther(obj)
      } else {
        queryAllAiis(this.constraintData.queryUrl.replace('{type}', this.constraintData.type), obj).then(res => {
          if (res.data.code === 0) {
            this.$set(this.constraintData, 'opts', item.opts ? item.opts : res.data.data.allInfo)
            this.$set(this.constraintData.data, 'gateNo', res.data.data.gateNo)
            this.$set(this.constraintData.data, 'selected', res.data.data.selected)
            this.$set(this.constraintData, 'tempData', res.data.data.selected)
            this.$set(this.constraintData, 'visible', true)
          } else {
            this.showErrorCustom('获取约束信息', '请重新尝试')
          }
        })
      }
    },
    queryConstraintOther (obj, hold) {
      queryAllAiis(this.constraintData.queryUrl.replace('{type}', this.constraintData.type), obj).then(res => {
        if (res.data.code === 0) {
          this.$set(this.constraintData.data, 'gate', res.data.data.gateNo)
          this.$set(this.constraintData.data, 'gateNo', res.data.data.gateNo)
          this.$set(this.constraintData.tableData, 'data', res.data.data.selected)
          !hold && this.$set(this.constraintData, 'visible', true)
        } else {
          this.showErrorCustom('获取约束信息', '请重新尝试')
        }
      })
    },
    handleConstraintConfirm () {
      if (!_.isEqual(this.constraintData.tempData, this.constraintData.data.selected)) {
        this.$confirm(`
          <div class="warn-log">
            <div class="cancel-warn-img"></div>
          </div>
          <div><p class="other-msg-cont">约束关系已发生变更，是否确定保存？</p></div>
          <div><p class="other-msg-tip"></p></div>`, '提示', {
          dangerouslyUseHTMLString: true,
          customClass: 'change-acft-msg-dialog',
          closeOnClickModal: false
        }).then(() => {
          this.saveConstraint()
        }).catch(() => {
          console.log('catch')
        })
      } else {
        this.saveConstraint()
      }
    },
    saveConstraint () {
      this.$set(this.constraintData, 'loading', true)
      postAiisData(this.constraintData.url.replace('{type}', this.constraintData.type), this.constraintData.data).then(res => {
        if (res.data.code === 0) {
          this.showSuccess('更新' + this.constraintData.title)
          this.closeConstraintDialog()
        } else {
          this.showError('更新' + this.constraintData.title, '请重新尝试')
        }
        this.$set(this.constraintData, 'loading', false)
      }).catch(() => {
        console.warn('saveConstraint--登机口约束确认异常')
        this.showWarning('请求异常', '请重新尝试')
        this.$set(this.constraintData, 'loading', false)
      })
    },
    closeConstraintDialog () {
      this.$set(this.constraintData, 'loading', false)
      this.$set(this.constraintData, 'visible', false)
      this.$set(this.constraintData, 'type', '')
      this.$set(this.constraintData, 'title', '')
      this.$set(this.constraintData, 'label', '')
      this.$set(this.constraintData, 'props', {})
      this.$set(this.constraintData, 'opts', [])
      this.$set(this.constraintData, 'data', {
        gateNo: '',
        selected: []
      })
      this.$set(this.constraintData, 'tempData', [])
      if (this.$refs.constraintTransfer) {
        this.$refs.constraintTransfer.clearQuery('left')
        this.$refs.constraintTransfer.clearQuery('right')
      }
    },
    addConstraintOther () {
      this.$set(this.constraintData.otherData, 'type', 'add')
      this.$set(this.constraintData.otherData, 'title', '新增登机口维护信息')
      this.$set(this.constraintData.otherData, 'data', {beginTime: '', endTime: '', resourceType: 'GATE'})
      let reg = /(.*?)\((.*?)\)/
      let arr = reg.exec(this.constraintData.data.gateNo)
      if (!arr || (arr || []).length < 3) {
        this.showErrorCustom('当前登机口信息异常', '请重新尝试')
      }
      this.$set(this.constraintData.otherData.data, 'resourceNo', arr[1])
      this.$set(this.constraintData.otherData.data, 'terminal', arr[2])
      this.$set(this.constraintData.otherData, 'visible', true)
    },
    editConstraintOther (row, index) {
      this.clickRow('constraintData', index)
      this.$set(this.constraintData.otherData, 'type', 'edit')
      this.$set(this.constraintData.otherData, 'title', '更新登机口维护信息')
      this.$set(this.constraintData.otherData, 'data', _.cloneDeep(row))
      this.$set(this.constraintData.otherData, 'visible', true)
    },
    deleteConstraintOther (row, index) {
      this.clickRow('constraintData', index)
      this.$confirm(`
        <div class="warn-log">
          <div class="cancel-warn-img"></div>
        </div>
        <div><p class="other-msg-cont">是否删除此维护信息？</p></div>
        <div><p class="other-msg-tip"></p></div>`, '提示', {
        dangerouslyUseHTMLString: true,
        customClass: 'change-acft-msg-dialog',
        closeOnClickModal: false
      }).then(() => {
        postData(this.constraintData.otherData.deleteUrl, row[this.constraintData.tableData.key]).then(res => {
          if (res.data.code === 0) {
            this.showSuccess('登机口维护记录删除')
            this.clickRow('constraintData')
            this.queryConstraintOther({gateNo: this.constraintData.data.gateNo}, true)
          } else {
            this.showError('登机口维护记录删除', '请重新尝试')
          }
        })
      }).catch(() => {
        console.warn('deleteConstraintOther--登机口其他约束删除异常')
      })
    },
    handleGateRecConfirm () {
      let result = this.regGateRec(this.constraintData.otherData.data)
      if (result) {
        this.$set(this.constraintData.otherData, 'loading', true)
        postData(this.constraintData.otherData[this.constraintData.otherData.type + 'Url'], this.constraintData.otherData.data).then(res => {
          if (res.data.code === 0) {
            this.showSuccess('登机口维护记录' + (this.constraintData.otherData.type === 'add' ? '新增' : '更新'))
            this.closeGateRecDialog()
            this.clickRow('constraintData')
            this.queryConstraintOther({gateNo: this.constraintData.data.gateNo}, true)
          } else {
            this.showError('登机口维护记录' + (this.constraintData.otherData.type === 'add' ? '新增' : '更新'), '请重新尝试')
          }
          this.$set(this.constraintData.otherData, 'loading', false)
        })
      }
    },
    closeGateRecDialog () {
      this.$set(this.constraintData.otherData, 'loading', false)
      this.$set(this.constraintData.otherData, 'visible', false)
      this.$set(this.constraintData.otherData, 'type', '')
      this.$set(this.constraintData.otherData, 'data', {beginTime: '', endTime: '', resourceType: 'GATE'})
    },
    regGateRec (data) {
      if (!data.resourceNo || !data.terminal) {
        this.showWarning('登机口信息异常', '请重新尝试')
        this.closeGateRecDialog()
        this.clickRow('constraintData')
        this.queryConstraintOther({gateNo: this.constraintData.data.gateNo}, true)
        return false
      }
      if (!data.beginTime) {
        this.showErrorCustom('开始时间不能为空')
        return false
      }
      if (data.beginTime && data.endTime && Date.parse(data.beginTime) >= Date.parse(data.endTime)) {
        this.showErrorCustom('开始时间必须小于结束时间')
        return false
      }
      return true
    },
    /* 登机口是否可用 */
    gateIsUseable (data, item, index) {
      if (!item.loading) {
        let obj = {
          gateNo: data.gateNo
        }
        this.$set(obj, item.key, item.value)
        this.$confirm(`
          <div class="warn-log">
            <div class="cancel-warn-img"></div>
          </div>
          <div><p class="other-msg-cont">是否将该登机口设置为${item.value === 'N' ? '不' : ''}可用登机口？</p></div>
          <div><p class="other-msg-tip"></p></div>`, '提示', {
          dangerouslyUseHTMLString: true,
          customClass: 'change-acft-msg-dialog',
          closeOnClickModal: false
        }).then(() => {
          this.postGateIsUseable(data, item, obj)
        }).catch(() => {
          console.warn('deleteConstraintOther--登机口其他约束删除异常')
        })
      } else {
        this.showWarning('操作', '请勿频繁请求')
      }
    },
    postGateIsUseable (data, item, obj) {
      queryAllAiis(item.url, obj).then(res => {
        if (res.data.code === 0) {
          this.showSuccess(item.title)
        } else {
          this.showError(item.title, '请重新尝试')
        }
        this.$set(item, 'loading', false)
      }).catch(() => {
        console.warn('gateIsUseable--登机口设置可用/不可用异常')
        this.showWarning('请求', '请重新尝试')
        this.$set(item, 'loading', false)
      })
    },
    /* 登机口约束是否可用 */
    gateConstraintUseable (data, item, index) {
      if (!item.loading) {
        let obj = {
          gate: data.gateNo
        }
        this.$set(obj, item.key, item.value)
        if (item.value === 'N') {
          this.$confirm(`
            <div class="warn-log">
              <div class="cancel-warn-img"></div>
            </div>
            <div><p class="other-msg-cont">是否将该登机口约束设置为不可用？</p></div>
            <div><p class="other-msg-tip"></p></div>`, '提示', {
            dangerouslyUseHTMLString: true,
            customClass: 'change-acft-msg-dialog',
            closeOnClickModal: false
          }).then(() => {
            this.postGateConstraintUseable(data, item, obj)
          }).catch(() => {
            console.warn('gateConstraintUseable--设置登机口约束不可用异常')
          })
        } else {
          this.$confirm(`
            <div class="warn-log">
              <div class="cancel-warn-img"></div>
            </div>
            <div><p class="other-msg-cont">是否将该登机口约束设置为可用？</p></div>
            <div><p class="other-msg-tip"></p></div>`, '提示', {
            dangerouslyUseHTMLString: true,
            customClass: 'change-acft-msg-dialog',
            closeOnClickModal: false
          }).then(() => {
            this.postGateConstraintUseable(data, item, obj)
          }).catch(() => {
            console.warn('gateConstraintUseable--设置登机口约束可用异常')
          })
        }
      } else {
        this.showWarning('操作', '请勿频繁请求')
      }
    },
    postGateConstraintUseable (data, item, obj) {
      queryAllAiis(item.url, obj).then(res => {
        if (res.data.code === 0) {
          this.showSuccess(item.title)
        } else {
          this.showError(item.title, '请重新尝试')
        }
        this.$set(item, 'loading', false)
      }).catch(() => {
        console.warn('gateIsUseable--机位设置可用/不可用异常')
        this.showWarning('请求', '请重新尝试')
        this.$set(item, 'loading', false)
      })
    },
    /* 甘特条点击 */
    showFlight: _.throttle(function (obj, seriesKey) {
      if (obj.afid || obj.dynamicResourceId) {
        if (seriesKey === 'seriesNd') {
          // this.$refs.svgBottomContent.scrollTo({left: this.$refs.svgTopContent.scrollLeft})
          if (obj.dynamicResourceId) {
            this.$emit('setSelfData', {key: 'highlight', ckey: 'data', value: [{seriesKey: 'series', id: obj.dynamicResourceId}]})
          } else {
            this.$emit('setSelfData', {key: 'highlight', ckey: 'data', value: []})
          }
        } else {
        }
        postAiisData(this.flightDetail.url, obj).then(res => {
          if (res.data.code === 0) {
            this.$set(this.showBlock, 'right', true)
            this.$emit('setSelfData', {key: 'showBlock', ckey: 'right', value: true})
            if (res.data.data) {
              this.$set(this.flightDetail, 'data', {...obj, ...res.data.data})
            } else {
              this.$set(this.flightDetail, 'data', {})
            }
          } else {
            this.$set(this.flightDetail, 'data', {})
            this.showError('获取航班详情', '请重新尝试')
          }
        })
      }
    }, 500),
    /* 工具方法 */
    formatRelateGate (data, field) {
      let arr = _.get(data, field.key) || []
      if (arr.length && data.dynamicResourceId) {
        let index = _.findIndex(arr, ['dynamicResourceId', data.dynamicResourceId])
        if (~index) {
          let tmp = []
          if (index < arr.length - 1) {
            tmp.push('F：' + (arr[index + 1].dynamicResourceNo || '-'))
          }
          if (index > 0) {
            tmp.push('T：' + (arr[index - 1].dynamicResourceNo || '-'))
          }
          return tmp.join(', ')
        } else {
          return ''
        }
      } else {
        return ''
      }
    },
    /* 甘特条拖拽 */
    selfJudge (obj) {
      let result = true
      if (obj.ats || obj.lockedFlag === 'Y') {
        result = false
      }
      return result
    },
    betweenJudge (obj) {
      let result = true
      if (obj.ats || obj.lockedFlag === 'Y' || obj.abnormalStatusA === 'CAN' || obj.abnormalStatusD === 'CAN') {
        result = false
      }
      return result
    },
    selfDragstart (obj) {
      if (this.distributeData.status) {
        this.$d3.selectAll('.gantt-mask').select(function () {
          this.style.display = 'none'
        })
      }
      this.$store.commit('setGanttConf', [
        {key: 'conflicts.start', value: true}
      ])
      let data = {
        afid: obj.afid,
        ets: obj.ets,
        ete: obj.ete,
        attr: obj.attrDFlag
      }
      queryAllAiis(this.distributeData.regUrl, data).then(res => {
        if (res.data.code === 0 && this.conflicts.start) {
          this.$store.commit('setGanttConf', [
            {key: 'conflicts.checkGates', value: res.data.data}
          ])
        }
      })
    },
    betweenDragstart (obj) {
      // this.$refs.svgBottomContent.scrollTo({left: this.$refs.svgTopContent.scrollLeft})
      if (obj.dynamicResourceNo) {
        let element = document.getElementById('rseries' + obj.dynamicResourceNo)
        if (element) {
          element.scrollIntoView(
            {block: 'start'}
          )
          if (obj.dynamicResourceId) {
            this.$emit('setSelfData', {key: 'highlight', ckey: 'data', value: [{seriesKey: 'series', id: obj.dynamicResourceId}]})
          }
        }
      }
      this.$store.commit('setGanttConf', [
        {key: 'conflicts.start', value: true}
      ])
      let data = {
        afid: obj.afid,
        ets: obj.ets,
        ete: obj.ete,
        attr: obj.attrDFlag
      }
      queryAllAiis(this.distributeData.regUrl, data).then(res => {
        if (res.data.code === 0 && this.conflicts.start) {
          this.$store.commit('setGanttConf', [
            {key: 'conflicts.checkGates', value: res.data.data}
          ])
        }
      })
    },
    rowRegColor (obj, targetObj) {
      let defaultPass = '#2EA634'
      let color = 'transparent'
      if (obj.dynamicResourceNo !== targetObj.gateNo) {
        color = (_.find(this.colorConfig, ['paramCode', this.colorTypes.passReg]) || {}).paramValue || defaultPass
        let conflictObj = _.find(this.conflicts.checkGates, o => {
          return `${o.resourceNo}(${o.terminal})` === targetObj.gateNo
        })
        if (conflictObj) {
          for (let i = 0; i < this.distributeData.checkFields.length; i++) {
            let tmp = this.distributeData.checkFields[i]
            if (tmp.regColorType && conflictObj[tmp.prop] === 'N') {
              color = (_.find(this.colorConfig, ['paramCode', this.colorTypes[tmp.regColorType]]) || {}).paramValue || defaultPass
              break
            } else {
              continue
            }
          }
        }
      }
      return color
    },
    selfDrag (obj, targetObj) {
      this.releaseDistGate()
      if (obj.dynamicResourceNo === targetObj.gateNo) {
        this.returnSelfScroll()
        return false
      }
      let data = {
        afid: obj.afid,
        ets: obj.ets,
        ete: obj.ete,
        attr: obj.attrDFlag,
        gate: targetObj.gateNo,
        oldGate: obj.dynamicResourceNo,
        confirmedFlag: obj.confirmedFlag
      }
      if (data.gate === data.oldGate) {
        this.showErrorCustom('当前分配的登机口无变更，无须分配')
        this.returnSelfScroll()
        return
      }
      let checkGate = _.find(this.conflicts.checkGates, o => {
        return `${o.resourceNo}(${o.terminal})` === targetObj.gateNo
      })
      if (checkGate) {
        let arr = []
        this.distributeData.disFields.forEach(field => {
          if (checkGate[field.prop] === 'N') {
            arr.push(field.label)
          }
        })
        if (arr.length) {
          this.showErrorCustom(`该航班与登机口存在冲突，无法分配`, `与登机口 ${data.gate} 的冲突：${arr.join('、')}`)
          this.returnSelfScroll()
          return
        }
        this.distributeData.checkFields.forEach(field => {
          if (checkGate[field.prop] === 'N' && !field.hidden) {
            arr.push(field.label)
          }
        })
        if (arr.length) {
          this.$confirm(`
            <div class="warn-log">
              <div class="cancel-warn-img"></div>
            </div>
            <div><p class="other-msg-cont">该航班与登机口${data.gate}存在约束冲突，是否继续分配？</p></div>
            <div><p class="other-msg-tip">包括：${arr.join('、')}` + (checkGate.remark ? `<br>${checkGate.remark}` : '') + `</p></div>`, '提示', {
            dangerouslyUseHTMLString: true,
            customClass: 'gate-dist-msg-dialog',
            closeOnClickModal: false
          }).then(() => {
            this.postDistGate(data)
          }).catch(() => {
            this.returnSelfScroll()
            return false
          })
        } else if (checkGate.remark) {
          this.$confirm(`
            <div class="warn-log">
              <div class="cancel-warn-img"></div>
            </div>
            <div><p class="other-msg-cont">${checkGate.remark}</p></div>
            <div><p class="other-msg-tip"></p></div>`, '提示', {
            dangerouslyUseHTMLString: true,
            customClass: 'gate-dist-msg-dialog',
            closeOnClickModal: false
          }).then(() => {
            this.postDistGate(data)
          }).catch(() => {
            this.returnSelfScroll()
            return false
          })
        } else {
          this.postDistGate(data)
        }
      } else {
        this.postDistGate(data)
      }
    },
    betweenDrag (obj, targetObj) {
      this.releaseDistGate()
      let data = {
        afid: obj.afid,
        ets: obj.ets,
        ete: obj.ete,
        attr: obj.attrDFlag,
        gate: targetObj.gateNo,
        oldGate: obj.dynamicResourceNo,
        confirmedFlag: obj.confirmedFlag
      }
      if (data.gate === data.oldGate) {
        this.showErrorCustom('当前分配的登机口无变更，无须分配')
        this.returnSelfScroll()
        return
      }
      let checkGate = _.find(this.conflicts.checkGates, o => {
        return `${o.resourceNo}(${o.terminal})` === targetObj.gateNo
      })
      if (checkGate) {
        let arr = []
        this.distributeData.disFields.forEach(field => {
          if (checkGate[field.prop] === 'N') {
            arr.push(field.label)
          }
        })
        if (arr.length) {
          this.showErrorCustom(`该航班与登机口存在冲突，无法分配`, `与登机口 ${data.gate} 的冲突：${arr.join('、')}`)
          this.returnSelfScroll()
          return
        }
        this.distributeData.checkFields.forEach(field => {
          if (checkGate[field.prop] === 'N' && !field.hidden) {
            arr.push(field.label)
          }
        })
        if (arr.length) {
          this.$confirm(`
            <div class="warn-log">
              <div class="cancel-warn-img"></div>
            </div>
            <div><p class="other-msg-cont">该航班与登机口${data.gate}存在约束冲突，是否继续分配？</p></div>
            <div><p class="other-msg-tip">包括：${arr.join('、')}` + (checkGate.remark ? `<br>${checkGate.remark}` : '') + `</p></div>`, '提示', {
            dangerouslyUseHTMLString: true,
            customClass: 'gate-dist-msg-dialog',
            closeOnClickModal: false
          }).then(() => {
            this.postDistGate(data)
          }).catch(() => {
            this.returnSelfScroll()
            return false
          })
        } else if (checkGate.remark) {
          this.$confirm(`
            <div class="warn-log">
              <div class="cancel-warn-img"></div>
            </div>
            <div><p class="other-msg-cont">${checkGate.remark}</p></div>
            <div><p class="other-msg-tip"></p></div>`, '提示', {
            dangerouslyUseHTMLString: true,
            customClass: 'gate-dist-msg-dialog',
            closeOnClickModal: false
          }).then(() => {
            this.postDistGate(data)
          }).catch(() => {
            this.returnSelfScroll()
            return false
          })
        } else {
          this.postDistGate(data)
        }
      } else {
        this.postDistGate(data)
      }
    },
    releaseDistGate () {
      if (this.distributeData.status) {
        this.$d3.selectAll('.gantt-mask').select(function () {
          this.style.display = 'block'
        })
      }
      this.$store.commit('setGanttConf', [
        {key: 'conflicts.start', value: false},
        {key: 'conflicts.checkGates', value: []}
      ])
      console.log('selfDrag--登机口甘特条拖拽释放')
    },
    returnSelfScroll () {
      this.$nextTick(() => {
        this.dragScroll && this.$refs.svgBottomContent && this.$refs.svgBottomContent.scrollTo(this.dragScroll)
      })
    },
    postDistGate (data, url) {
      if (data.confirmedFlag === 'Y') {
        this.$confirm(`
          <div class="warn-log">
            <div class="cancel-warn-img"></div>
          </div>
          <div><p class="other-msg-cont">确定要继续分配登机口吗？</p></div>
          <div><p class="other-msg-tip">若确定，将取消确认该航班所有登机口</p></div>`, '提示', {
          dangerouslyUseHTMLString: true,
          customClass: 'share-msg-dialog',
          closeOnClickModal: false
        }).then(() => {
          this.postDistGateNext(data, url)
        }).catch(() => {
          this.returnSelfScroll()
        })
      } else {
        this.postDistGateNext(data, url)
      }
    },
    postDistGateNext (data, url) {
      this.$set(data, 'confirmedFlag', 'N')
      if (!url) {
        if (this.distributeData.status) {
          this.$set(data, 'flag', 'I')
        } else {
          this.$set(data, 'flag', data.oldGate ? 'U' : 'I')
        }
      }
      postAiisData(url || this.distributeData.url, data).then(res => {
        if (res.data.code === 0) {
          if (this.distributeData.status) {
            this.showSuccess('登机口分配更多')
            this.clearGateDistMore()
          } else {
            this.showSuccess('登机口手动分配', res.data.msg)
          }
        } else {
          if (this.distributeData.status) {
            this.showError('登机口分配更多', res.data.msg)
          } else {
            this.showError('登机口手动分配', res.data.msg)
          }
          this.returnSelfScroll()
        }
      }).catch(() => {
        if (this.distributeData.status) {
          this.showWarning('登机口分配更多请求', '请重新尝试')
        } else {
          this.showWarning('登机口手动分配请求', '请重新尝试')
        }
        this.returnSelfScroll()
      })
    },
    drawColor (obj) {
      let color = 'transparent'
      if (obj.isBridge === 'Y') {
        color = (_.find(this.colorConfig, ['paramCode', this.colorTypes.bridgeGate]) || {}).paramValue || color
      } else if (obj.isBridge === 'N') {
        color = (_.find(this.colorConfig, ['paramCode', this.colorTypes.farStandGate]) || {}).paramValue || color
      }
      return color
    },
    getFlightColor (obj, colorParamValue, colorDefaultCol) {
      let arr = ['']
      if (obj.vipDFlag === 'Y') {
        arr[0] = (_.find(this.colorConfig, ['paramCode', this.colorTypes.vip]) || {})[colorParamValue] || colorDefaultCol
      } else {
        if (['POK', 'DEP'].includes(obj.progressStatusD)) { // 登机结束/起飞
          arr[0] = (_.find(this.colorConfig, ['paramCode', this.colorTypes.END]) || {})[colorParamValue] || colorDefaultCol
        } else if (['BOR', 'TBR', 'LBD'].includes(obj.progressStatusD)) { // 开始登机/过站登机/催促登机
          arr[0] = (_.find(this.colorConfig, ['paramCode', this.colorTypes.START]) || {})[colorParamValue] || colorDefaultCol
        } else { // 开始登机之前
          arr[0] = (_.find(this.colorConfig, ['paramCode', this.colorTypes.BEFORE]) || {})[colorParamValue] || colorDefaultCol
        }
      }
      return arr
    },
    /*
     * @param values: Array -> [string] (for the filter's terminal) ['G1(T1)']
     * @param options: Array -> [object] (for all gates in the gate's configs) [{ATTR: 'I', ATTRCN: '国际', CODE: 'G56(T1)', NAME: 'G56(T1)', TERMINAL: 'T1'}]
     * @param data: Array -> [string] (for select gates in the gate's configs) ['G1(T1)']
     * @param sourceData: Array -> {object} (for all datas for svg) [{dataArray: [...], gateNo: 'G23(T2)', isBridge: 'Y', isUseable: 'Y'}]
     */
    filterTerminalGate (values, options, data, sourceData) {
      let arr = []
      let filters = []
      if ((values || []).length) {
        filters = _.filter(options, o => {
          return values.includes(o[this.filterData.filterKey])
        })
      } else {
        filters = _.cloneDeep(options)
      }
      data.forEach(o => {
        if (_.find(filters, [this.gateConfigs.props.key, o])) {
          let obj = _.find(sourceData, ['gateNo', o])
          obj && arr.push(obj)
        }
      })
      this.$set(this.series, 'data', arr || [])
    },
    // 登机口分配更多功能
    startGateDistMore (data) {
      this.$set(this.distributeData, 'status', true)
      let that = this
      // 时间计算
      let sT = Date.parse(data.ats || data.ets)
      let start = Date.parse(this.xAxis.start)
      if (sT < start) {
        sT = start
      }
      let i = (sT - start) / this.xAxis.timestempUnit
      this.$refs.svgBottomContent.scrollTo({left: i * (this.xAxis.timeSpace + this.xAxis.timeMultSpace * this.xAxis.timeSMult) - this.computeLeftWidth / 2})

      let pBox = this.$refs.svgBottomContent.getBoundingClientRect()
      let box = this.$refs.svgBottomContent.querySelector(selectIdByCssFilter('#gseries' + data[this.series.colConf.id])).getBoundingClientRect()

      // 遮罩
      let t = box.top > pBox.top ? box.top : pBox.top
      let r = ((window.innerWidth - pBox.left - pBox.width) > (window.innerWidth - box.left - box.width)) ? (window.innerWidth - pBox.left - pBox.width) : (window.innerWidth - box.left - box.width)
      let b = ((window.innerHeight - pBox.top - pBox.height) > (window.innerHeight - box.top - box.height)) ? (window.innerHeight - pBox.top - pBox.height) : (window.innerHeight - box.top - box.height)
      let l = box.left > pBox.left ? box.left : pBox.left
      this.$d3.select(document.getElementsByClassName('body-view')[0])
        .append('div')
        .attr('class', 'gantt-mask')
        .attr('style', `position: fixed; left: 0; top: 0; width: ${window.innerWidth}px; height: ${t}px;`)
      this.$d3.select(document.getElementsByClassName('body-view')[0])
        .append('div')
        .attr('class', 'gantt-mask')
        .attr('style', `position: fixed; right: 0; top: ${t}px; width: ${r}px; height: ${box.height}px;`)
      this.$d3.select(document.getElementsByClassName('body-view')[0])
        .append('div')
        .attr('class', 'gantt-mask')
        .attr('style', `position: fixed; left: 0; bottom: 0; width: ${window.innerWidth}px; height: ${b}px;`)
      this.$d3.select(document.getElementsByClassName('body-view')[0])
        .append('div')
        .attr('class', 'gantt-mask')
        .attr('style', `position: fixed; left: 0; top: ${t}px; width: ${l}px; height: ${box.height}px;`)
      this.$d3.select(document.getElementsByClassName('body-view')[0])
        .append('div')
        .attr('class', 'gantt-mask highlight')
        .attr('style', `position: fixed; left: ${l}px; right: ${r}px; top: ${t}px; height: ${box.height}px;`)
      // 事件
      let dragEvent = this.$d3.drag()
        .on('start', function () {that.$refs.svgBottomData.dragstartSelf(this, data)})
        .on('drag', function () {that.$refs.svgBottomData.dragSelf(this, data)})
        .on('end', function () {that.$refs.svgBottomData.dragendSelf(this, data)})
      let clone = this.$d3.select(selectIdByCssFilter('#gseries' + data[this.series.colConf.id])).clone()
      // 如航班是进出港，则仅显示出港
      let fill = this.$d3.select(selectIdByCssFilter('#gseries' + data[this.series.colConf.id])).select('.colBlock').attr('fill')
      // 克隆完整甘特条
      clone
        .attr('class', 'clone-flight colGroup')
        .attr('transform', this.transformToNum(this.$d3.select(selectIdByCssFilter('#gseries' + data[this.series.colConf.id])), 0))
        .attr('stroke', 'transparent')
        .call(dragEvent)
      let path = clone.append('path')
      path
        .attr('fill', fill)
      this.drawPath(0, 0, box.width, box.height, data, path)
      let fontG = this.$refs.svgBottomContent.querySelector(selectIdByCssFilter('#gseries' + data[this.series.colConf.id])).querySelector('.fontGroup').cloneNode()
      let font = this.$d3.select(selectIdByCssFilter('#gseries' + data[this.series.colConf.id])).select(data.flightNumD ? '.fontRight' : '.fontLeft')
      clone.append(function () {
        return this.appendChild(fontG)
      })
      let txt = this.$d3.select(fontG)
        .append('text')
      txt.attr('fill', font.attr('fill'))
        .attr('stroke', font.attr('stroke'))
        .attr('class', font.attr('class'))
        .style('text-anchor', 'start')
        .attr('transform', data.flightNumD ? this.transformToNum(font, 5, true) : this.transformToNum(font, 5, true))
      txt.text(data.flightNumD || data.flightNumA)

      this.$set(this.$parent.highlight.position, 'visible', false)
      this.dragScroll = {
        top: this.$refs.svgBottomContent.scrollTop,
        left: this.$refs.svgBottomContent.scrollLeft
      }
      this.$d3.selectAll('.gantt-mask').select(function () {
        this.oncontextmenu = that.cancelGateDistMore
      })
      clearInterval(this.timer)
      this.timer = null
    },
    cancelGateDistMore () {
      event && event.preventDefault()
      this.$confirm(`
        <div class="warn-log">
          <div class="cancel-warn-img"></div>
        </div>
        <div><p class="other-msg-cont">是否确认取消分配更多？</p></div>
        <div><p class="other-msg-tip">当前操作无法恢复</p></div>`, '提示', {
        dangerouslyUseHTMLString: true,
        customClass: 'share-msg-dialog',
        closeOnClickModal: false
      }).then(() => {
        this.clearGateDistMore()
      }).catch(() => {
      })
    },
    drawPath (x, y, w, h, obj, colBlock) {
      let floatX = h * 2 / 5
      let t = floatX * 2
      let radius = 3
      let points = []
      if (obj.confirmedFlag === 'Y') {
        points.push(['M', x + t, y].join(' '))
        points.push(['H', x + w - t].join(' '))
        points.push(['L', x + w, y + h / 2].join(' '))
        points.push(['L', x + w - t, y + h].join(' '))
        points.push(['H', x + t].join(' '))
        points.push(['L', x, y + h / 2].join(' '))
        points.push('Z')
        colBlock
          .attr('d', points)
      } else {
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
        colBlock
          .attr('d', points)
      }
    },
    clearGateDistMore () {
      this.$set(this.distributeData, 'status', false)
      this.$d3.selectAll('.gantt-mask').select(function () {
        this.remove()
      })
      this.$d3.selectAll('.clone-flight').select(function () {
        this.remove()
      })
      !this.timer && (this.timer = setInterval(this.refrushNowTime, this.intervalTime))
    }
  },
  watch: {
    'showBlock.leftTop.show': {
      handler (val, oldVal) {
        if (!oldVal && val) {
          this.$nextTick(() => {
            this.refrushNowTime('seriesNd')
          })
        }
      }
    },
    allGateData: {
      handler (data) {
        this.filterTerminalGate(this.filterData.value, this.gateConfigs.options, this.gateConfigs.data, data)
      },
      deep: true
    },
    'filterData.value': {
      handler (values) {
        this.filterTerminalGate(values, this.gateConfigs.options, this.gateConfigs.data, this.allGateData)
      },
      deep: true
    },
    'gateConfigs.options': {
      handler (data, oldData) {
        if (_.isEqual(data, oldData)) {
          return
        }
        this.filterTerminalGate(this.filterData.value, data, this.gateConfigs.data, this.allGateData)
      },
      deep: true
    },
    'gateConfigs.data': {
      handler (data, oldData) {
        if (_.isEqual(data, oldData)) {
          return
        }
        this.filterTerminalGate(this.filterData.value, this.gateConfigs.options, data, this.allGateData)
      },
      deep: true
    },
    'series.data': {
      handler (data) {
        this.$store.commit('setGanttConf', [
          {key: 'series.data', value: data}
        ])
        this.$set(this, 'seriesRefresh', !this.seriesRefresh)
        this.$parent.filterHighlight()
      },
      deep: true
    },
    'flightConfigs.data': {
      handler (data, oldData) {
        if (_.isEqual(data, oldData)) {
          return
        }
        this.$set(this.series.colConf, 'labels', data)
        this.$set(this.seriesNd.colConf, 'labels', data)
        this.$store.commit('setGanttConf', [
          {key: 'series.colConf.labels', value: this.series.colConf.labels},
          {key: 'seriesNd.colConf.labels', value: this.seriesNd.colConf.labels}
        ])
        this.$set(this, 'refresh', ['fonts'])
      },
      deep: true
    },
    colorConfig: {
      handler (config) {
        this.$set(this, 'refresh', ['color'])
      },
      deep: true
    },
    'menuFlight.data': {
      handler (data) {
        this.changeMenuDisabled(data, 'Flight')
      },
      deep: true
    },
    'menuGate.data': {
      handler (data) {
        this.changeMenuDisabled(data, 'Gate')
      },
      deep: true
    },
    'highlight.data': {
      handler (data, oldData) {
        let direct = {
          seriesNd: this.$refs.svgTopData,
          series: this.$refs.svgBottomData
        }
        oldData.forEach(obj => {
          if (direct[obj.seriesKey]) {
            this.$d3.select(direct[obj.seriesKey].$el.querySelector(selectIdByCssFilter('#c' + obj.seriesKey + obj.id)))
              .attr('style', '')
          }
        })
        data.forEach((obj, i) => {
          if (!i) {
            direct[obj.seriesKey].$el.querySelector(selectIdByCssFilter('#c' + obj.seriesKey + obj.id)) && direct[obj.seriesKey].$el.querySelector(selectIdByCssFilter('#c' + obj.seriesKey + obj.id)).scrollIntoView(
              {block: 'center', inline: 'start'}
            )
          }
          this.$d3.select(direct[obj.seriesKey].$el.querySelector(selectIdByCssFilter('#c' + obj.seriesKey + obj.id)))
            .attr('style', this.highlight.style.replace('seriesKey', obj.seriesKey))
        })
      },
      deep: true
    }/* ,
    'flightDetail.data': {
      handler (data) {
        if (!_.isEmpty(data)) {
          let i = _.findIndex(this.flightDetail.fields, ['key', 'prevDepTime'])
          if (_.get(data, this.flightDetail.fields[i].keys[0])) {
            this.$set(this.flightDetail.fields[i], 'color', '#D9415A')
          } else {
            this.$delete(this.flightDetail.fields[i], 'color')
          }
        }
      },
      deep: true
    } */
    /* 'refresh': {
      handler (arr, oldArr) {
        if (arr.length) {
        }
      },
      deep: true
    } */
  }
}
</script>

<style lang="scss" >
@import './scss/gantt.scoped';
</style>
