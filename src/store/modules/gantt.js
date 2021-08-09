import _ from 'lodash'
export default {
  state: {
    xmlns: 'http://www.w3.org/2000/svg',
    xAxis: {
      timeSpace: 3,
      timeMultSpace: 1,
      timestempUnit: 60 * 1000,
      minutesInHour: 60, // 一小时 n s
      timeSMult: 2,
      lineStyle: {l: 10.5, m: 7, s: 5},
      width: 0,
      spanning: 4 * 24 * 60,
      boundaryGap: [25.5, 25.5],
      top: 30,
      left: 130,
      right: 20
      /* scroll: {
        per: 0.3,
        width: 10,
        height: 10,
        x: 0,
        y: 500,
        bottom: 0
      } */
    },
    yAxis: {
      conf: {
        id: 'standNo',
        value: 'standNo'
      },
      transStyle: {
        width: 130,
        height: 40
      },
      fontStyle: {
        fontSize: 14
      },
      boundaryGap: [0, 0],
      top: 50,
      bottom: 20,
      margin: [0.5],
      height: 3880
      // offsetY: 2,
      /* scroll: {
        per: 0.3,
        width: 10,
        height: 10,
        x: 1200,
        y: 0,
        right: 0
      } */
    },
    series: {
      data: [],
      rowConf: {
        id: 'standNo',
        value: 'dataArray'
      },
      colConf: {
        s: 'beginTime',
        e: 'endTime',
        id: 'id',
        labels: {
          'A': {
            left: 'flightNumA',
            center: 'aircraftNo',
            right: 'aircraftType'
          },
          'D': {
            left: 'aircraftType',
            center: 'aircraftNo',
            right: 'flightNumD'
          },
          'A|D': {
            left: 'flightNumA',
            center: 'aircraftNo',
            right: 'flightNumD'
          }
        },
        aircraftLabel: 'aircraftNo'
      }
    },
    yAxisNd: {
      conf: {
        id: 'standNo',
        value: 'standNo'
      },
      transStyle: {
        width: 130,
        height: 40
      },
      fontStyle: {
        fontSize: 14
      },
      boundaryGap: [0, 0],
      top: 50,
      bottom: 20,
      margin: [0.5],
      height: 0
      // offsetY: 2,
      /* scroll: {
        per: 0.3,
        width: 10,
        height: 10,
        x: 1200,
        y: 0,
        right: 0
      } */
    },
    seriesNd: {
      data: [],
      rowConf: {
        id: 'standNo',
        value: 'dataArray'
      },
      colConf: {
        s: 'beginTime',
        e: 'endTime',
        id: 'id',
        labels: {
          'A': {
            left: 'flightNumA',
            center: 'aircraftNo',
            right: 'aircraftType'
          },
          'D': {
            left: 'aircraftType',
            center: 'aircraftNo',
            right: 'flightNumD'
          },
          'A|D': {
            left: 'flightNumA',
            center: 'aircraftNo',
            right: 'flightNumD'
          }
        },
        aircraftLabel: 'aircraftNo'
      }
    },
    exportXAxis: {
      timeSpace: 3,
      timeMultSpace: 1,
      timestempUnit: 60 * 1000,
      minutesInHour: 60, // 一小时 n s
      timeSMult: 2,
      lineStyle: {l: 10.5, m: 7, s: 5},
      width: 0,
      spanning: 4 * 24 * 60,
      boundaryGap: [25.5, 25.5],
      top: 30,
      left: 130,
      right: 20
      /* scroll: {
        per: 0.3,
        width: 10,
        height: 10,
        x: 0,
        y: 500,
        bottom: 0
      } */
    },
    exportYAxis: {
      conf: {
        id: 'standNo',
        value: 'standNo'
      },
      transStyle: {
        width: 130,
        height: 40
      },
      fontStyle: {
        fontSize: 14
      },
      boundaryGap: [0, 0],
      top: 50,
      bottom: 20,
      margin: [0.5],
      height: 0
      // offsetY: 2,
      /* scroll: {
        per: 0.3,
        width: 10,
        height: 10,
        x: 1200,
        y: 0,
        right: 0
      } */
    },
    exportSeries: {
      data: [],
      rowConf: {
        id: 'standNo',
        value: 'dataArray'
      },
      colConf: {
        s: 'beginTime',
        e: 'endTime',
        id: 'id',
        labels: {
          'A': {
            left: 'flightNumA',
            center: 'aircraftNo',
            right: 'aircraftType'
          },
          'D': {
            left: 'aircraftType',
            center: 'aircraftNo',
            right: 'flightNumD'
          },
          'A|D': {
            left: 'flightNumA',
            center: 'aircraftNo',
            right: 'flightNumD'
          }
        },
        aircraftLabel: 'aircraftNo'
      }
    },
    conflicts: {
      start: false,
      checkStands: []
    },
    colorTypes: {
      timeConflict: 'GT-01', // 拖拽/甘特条-时间冲突
      passReg: 'GT-02', // 拖拽-可用机位
      bridgeReg: 'GT-03', // 拖拽-廊桥不可用
      airlineReg: 'GT-04', // 拖拽-航司冲突
      attrReg: 'GT-05', // 拖拽-属性冲突
      aircraftTypeReg: 'GT-06', // 拖拽-机型冲突
      taskReg: 'GT-07', // 拖拽-任务冲突
      routeReg: 'GT-08', // 拖拽-航线冲突
      aircraftNoReg: 'GT-09', // 拖拽-机号冲突
      maintStand: 'GT-10', // 拖拽-机位维护
      farStand: 'GT-11', // 机位-远机位
      nearStand: 'GT-12', // 机位-近机位
      unuse: 'GT-13', // 机位行-机位不可用
      standUsable: 'GT-14', // 拖拽-机位不可用
      standPCOccupied: 'GT-26', // 拖拽-父子机位占用
      vip: 'GT-15', // 甘特条-vip
      disONR: 'GT-16', // 甘特条-前站未起
      ONR: 'GT-17', // 甘特条-前站起飞
      ARR: 'GT-18', // 甘特条-本站
      DEP: 'GT-19', // 甘特条-本站起飞
      aircraftOccupied: 'GT-20', // 甘特条-航空器占用
      fontD: 'GT-21', // 字体-国内
      fontI: 'GT-22', // 字体-国际
      fontM: 'GT-23', // 字体-混合
      fontR: 'GT-24', // 字体-地区
      fontAircraft: 'GT-25' // 字体-航空器
    },
    gateColorTypes: {
      timeConflict: 'GT-01', // 拖拽/甘特条-时间冲突
      passReg: 'GT-02', // 拖拽-可用登机口
      bridgeReg: 'GT-03', // 拖拽-廊桥不可用
      airlineReg: 'GT-04', // 拖拽-航司冲突
      attrReg: 'GT-05', // 拖拽-属性冲突
      aircraftTypeReg: 'GT-06', // 拖拽-机型冲突
      taskReg: 'GT-07', // 拖拽-任务冲突
      maintGate: 'GT-08', // 拖拽-登机口维护
      bridgeGate: 'GT-09', // 登机口-廊桥登机口
      farStandGate: 'GT-10', // 登机口-远机位登机口
      unuse: 'GT-11', // 登机口行-登机口不可用
      gateUsable: 'GT-12', // 拖拽-登机口不可用
      vip: 'GT-13', // 甘特条-vip
      BEFORE: 'GT-14', // 甘特条-未开始登机
      START: 'GT-15', // 甘特条-开始登机
      END: 'GT-16', // 甘特条-登机结束
      fontD: 'GT-17', // 字体-国内
      fontI: 'GT-18', // 字体-国际
      fontM: 'GT-19', // 字体-混合
      fontR: 'GT-20', // 字体-地区
      fltAttrReg: 'GT-21', // 拖拽-登机口/航班属性冲突
      terminalReg: 'GT-22' // 拖拽-航站楼冲突
    },
    sysColorTypes: {
      vip: 'DF-15',
      attrD: 'DF-16',
      attrI: 'DF-17',
      ata: 'DF-18',
      eta: 'DF-19',
      sta: 'DF-20',
      atd: 'DF-21',
      etd: 'DF-22',
      std: 'DF-23',
      blkOn: 'DF-24',
      blkOff: 'DF-25',
      stand: 'DF-26', // 机位分配 -- 字体背景色
      standCg: 'DF-27', // 机位变更 -- 字体背景色
      resUncfm: 'DF-28', // 资源未确认
      resCfm: 'DF-29', // 资源已确认
      pfltCfm: 'PF-30', // 航班已确认 -- 次日计划
      pfltUncfm: 'PF-31', // 航班未确认 -- 次日计划
      vfltCfm: 'VF-32', // 航班已确认 -- 要客计划
      vfltUncfm: 'VF-33', // 航班未确认 -- 要客计划
      tfltCfm: 'TF-34', // 航班已确认 -- 临时计划
      tfltUncfm: 'TF-35', // 航班未确认 -- 临时计划
      DLY: 'DF-10', // 延误
      CAN: 'DF-11', // 取消
      ALT: 'DF-12', // 备降
      RTN: 'DF-13', // 返航
      BAK: 'DF-14', // 滑回
      PLAN: 'DF-03', // 计划航班 -- 基础色
      ONR: 'DF-02', // 前方起飞 -- 基础色
      ARR: 'DF-01', // 本站到达/本场航班 -- 基础色
      BOR: 'DF-06', // 开始登机
      TBR: 'DF-07', // 过站登机
      LBD: 'DF-08', // 催促登机
      POK: 'DF-09', // 登机结束
      DEP: 'DF-04', // 本站起飞 -- 基础色
      END: 'DF-05' // 结束航班 -- 基础色
    },
    colorConfig: [], // 甘特图颜色配置
    gateColorConfig: [], // 甘特图颜色配置
    sysColorConfig: [] // 系统颜色配置
  },
  getters: {
    getXmlns: state => {
      return state.xmlns
    },
    getGanttConf: (state) => (key) => {
      let value = _.get(state, key)
      return value
    },
    getColorConfig: state => {
      return state.colorConfig
    },
    getGateColorConfig: state => {
      return state.gateColorConfig
    },
    getSysColorConfig: state => {
      return state.sysColorConfig
    }
    // getConfigValue: state => {
    //   return state.configValue
    // },
  },
  mutations: {
    setGanttConf (state, obj) {
      let keys = []
      let values = []
      if (_.isArray(obj)) {
        obj.forEach(o => {
          keys.push(o.key)
          values.push(o.value)
        })
      } else {
        keys.push(obj.key)
        values.push(obj.value)
      }
      keys.forEach((key, i) => {
        if (_.isObject(values[i]) && !(key.includes('data') && key.indexOf('data') === key.length - 4)) {
          _.set(state, key, _.cloneDeep(_.assign(_.get(state, key), values[i])))
        } else {
          _.set(state, key, _.cloneDeep(values[i]))
        }
      })
    },
    setColorConfig (state, obj) {
      state.colorConfig = _.cloneDeep(obj)
    },
    setGateColorConfig (state, obj) {
      state.gateColorConfig = _.cloneDeep(obj)
    }
  },
  actions: {
  }
}
