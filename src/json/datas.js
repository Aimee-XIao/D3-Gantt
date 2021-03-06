import _ from "lodash";
var dataArr = [
  {
    dataArray: [
      {
        dynamicFlightIdA: 45482,
        dynamicFlightIdD: 45483,
        flightNumA: "MU2114",
        flightNumD: "MU2114",
        inOutFlag: "A|D",
        afid: "W/Z-CN7669-20201031-A|W/Z-CN7670-20201031-D",
        sta: "2021-08-11T10:10",
        eta: "2020-10-31T10:10",
        ata: "2020-10-31T10:10",
        std: "2021-08-11T10:10",
        etd: null,
        atd: null,
        ets: "2021-08-11T10:10",
        ete: "2021-08-11T12:05",
        ats: "2021-08-11T10:10",
        ate: null,
        exectDateA: null,
        exectDateD: null,
        dynamicResourceNo: "105",
        dynamicResourceId: 15290796,
        confirmedFlag: "Y",
        lockedFlag: "N",
        splitFlag: "Y",
        relateT: false,
        relateF: true,
        aircraftNo: "5482",
        aircraftType: "B738",
        progressStatusA: "ARR",
        progressStatusD: null,
        progressStatusACn: "到达",
        progressStatusDCn: null,
        taskACn: "正班",
        taskDCn: "正班",
        endFlagA: "N",
        endFlagD: "N",
        expressFlagA: "N",
        expressFlagD: "N",
        vipAFlag: "N",
        vipDFlag: "N",
        timeConflict: null,
        isBridge: null,
        attrA: "D",
        attrD: "D",
        attrDFlag: null,
        prevDepTimeA: 1604102100000,
        sort: 0,
        sortDate: 1628748328974,
        abnormalStatusA: null,
        abnormalStatusD: null,
        checkPCOccupied: null,
        flightNum: null,
        gate: null,
        gateI: null,
        stand: null,
      },
    ],
    isUseable: "Y",
    isBridge: "Y",
    standNo: "105",
    terminal: "T1",
  },
  {
    dataArray: [],
    isUseable: "Y",
    isBridge: "N",
    standNo: "109",
    terminal: "T1",
  },
  {
    dataArray: [],
    isUseable: "Y",
    isBridge: "Y",
    standNo: "1",
    terminal: "T1",
  },
  {
    dataArray: [
      {
        dynamicFlightIdA: 45482,
        dynamicFlightIdD: 45483,
        flightNumA: "MU2367",
        flightNumD: "MU2367",
        inOutFlag: "A|D",
        afid: "W/Z-CN7669-20201031-A|W/Z-CN7670-20201031-D",
        sta: "2021-08-11T02:30",
        eta: "2020-10-31T10:10",
        ata: "2020-10-31T10:10",
        std: "2021-08-11T02:30",
        etd: null,
        atd: null,
        ets: "2021-08-11T02:30",
        ete: "2021-08-11T04:05",
        ats: "2021-08-11T02:30",
        ate: null,
        exectDateA: null,
        exectDateD: null,
        dynamicResourceNo: "101",
        dynamicResourceId: 15290796,
        confirmedFlag: "Y",
        lockedFlag: "N",
        splitFlag: "Y",
        relateT: false,
        relateF: true,
        aircraftNo: "5482",
        aircraftType: "B738",
        progressStatusA: "ARR",
        progressStatusD: null,
        progressStatusACn: "到达",
        progressStatusDCn: null,
        taskACn: "正班",
        taskDCn: "正班",
        endFlagA: "N",
        endFlagD: "N",
        expressFlagA: "N",
        expressFlagD: "N",
        vipAFlag: "N",
        vipDFlag: "N",
        timeConflict: null,
        isBridge: null,
        attrA: "D",
        attrD: "D",
        attrDFlag: null,
        prevDepTimeA: 1604102100000,
        sort: 0,
        sortDate: 1628748328974,
        abnormalStatusA: null,
        abnormalStatusD: null,
        checkPCOccupied: null,
        flightNum: null,
        gate: null,
        gateI: null,
        stand: null,
      },
      {
        dynamicFlightIdA: 45482,
        dynamicFlightIdD: 45483,
        flightNumA: "MU2467",
        flightNumD: "MU2467",
        inOutFlag: "A|D",
        afid: "W/Z-CN7669-20201031-A|W/Z-CN7670-20201031-D",
        sta: "2021-08-11T01:20",
        eta: "2020-10-31T10:10",
        ata: "2020-10-31T10:10",
        std: "2021-08-11T01:20",
        etd: null,
        atd: null,
        ets: "2021-08-11T01:20",
        ete: "2021-08-11T03:50",
        ats: "2021-08-11T01:20",
        ate: null,
        exectDateA: null,
        exectDateD: null,
        dynamicResourceNo: "101",
        dynamicResourceId: 15290796,
        confirmedFlag: "Y",
        lockedFlag: "N",
        splitFlag: "Y",
        relateT: false,
        relateF: true,
        aircraftNo: "5482",
        aircraftType: "B738",
        progressStatusA: "ARR",
        progressStatusD: null,
        progressStatusACn: "到达",
        progressStatusDCn: null,
        taskACn: "正班",
        taskDCn: "正班",
        endFlagA: "N",
        endFlagD: "N",
        expressFlagA: "N",
        expressFlagD: "N",
        vipAFlag: "N",
        vipDFlag: "N",
        timeConflict: null,
        isBridge: null,
        attrA: "D",
        attrD: "D",
        attrDFlag: null,
        prevDepTimeA: 1604102100000,
        sort: 0,
        sortDate: 1628748328974,
        abnormalStatusA: null,
        abnormalStatusD: null,
        checkPCOccupied: null,
        flightNum: null,
        gate: null,
        gateI: null,
        stand: null,
      },
      {
        dynamicFlightIdA: 45482,
        dynamicFlightIdD: 45483,
        flightNumA: "MU2567",
        flightNumD: "MU2567",
        inOutFlag: "A|D",
        afid: "W/Z-CN7669-20201031-A|W/Z-CN7670-20201031-D",
        sta: "2021-08-11T06:50",
        eta: "2020-10-31T10:10",
        ata: "2020-10-31T10:10",
        std: "2021-08-11T06:50",
        etd: null,
        atd: null,
        ets: "2021-08-11T06:50",
        ete: "2021-08-11T08:30",
        ats: "2021-08-11T06:50",
        ate: null,
        exectDateA: null,
        exectDateD: null,
        dynamicResourceNo: "101",
        dynamicResourceId: 15290796,
        confirmedFlag: "Y",
        lockedFlag: "N",
        splitFlag: "Y",
        relateT: false,
        relateF: true,
        aircraftNo: "5482",
        aircraftType: "B738",
        progressStatusA: "ARR",
        progressStatusD: null,
        progressStatusACn: "到达",
        progressStatusDCn: null,
        taskACn: "正班",
        taskDCn: "正班",
        endFlagA: "N",
        endFlagD: "N",
        expressFlagA: "N",
        expressFlagD: "N",
        vipAFlag: "N",
        vipDFlag: "N",
        timeConflict: null,
        isBridge: null,
        attrA: "D",
        attrD: "D",
        attrDFlag: null,
        prevDepTimeA: 1604102100000,
        sort: 0,
        sortDate: 1628748328974,
        abnormalStatusA: null,
        abnormalStatusD: null,
        checkPCOccupied: null,
        flightNum: null,
        gate: null,
        gateI: null,
        stand: null,
      },
      {
        dynamicFlightIdA: 45482,
        dynamicFlightIdD: 45483,
        flightNumA: "MU2567",
        flightNumD: "MU2567",
        inOutFlag: "A|D",
        afid: "W/Z-CN7669-20201031-A|W/Z-CN7670-20201031-D",
        sta: "2021-08-11T07:50",
        eta: "2020-10-31T10:10",
        ata: "2020-10-31T10:10",
        std: "2021-08-11T07:50",
        etd: null,
        atd: null,
        ets: "2021-08-11T07:50",
        ete: "2021-08-11T09:30",
        ats: "2021-08-11T07:50",
        ate: null,
        exectDateA: null,
        exectDateD: null,
        dynamicResourceNo: "101",
        dynamicResourceId: 15290796,
        confirmedFlag: "Y",
        lockedFlag: "N",
        splitFlag: "Y",
        relateT: false,
        relateF: true,
        aircraftNo: "5482",
        aircraftType: "B738",
        progressStatusA: "ARR",
        progressStatusD: null,
        progressStatusACn: "到达",
        progressStatusDCn: null,
        taskACn: "正班",
        taskDCn: "正班",
        endFlagA: "N",
        endFlagD: "N",
        expressFlagA: "N",
        expressFlagD: "N",
        vipAFlag: "N",
        vipDFlag: "N",
        timeConflict: null,
        isBridge: null,
        attrA: "D",
        attrD: "D",
        attrDFlag: null,
        prevDepTimeA: 1604102100000,
        sort: 0,
        sortDate: 1628748328974,
        abnormalStatusA: null,
        abnormalStatusD: null,
        checkPCOccupied: null,
        flightNum: null,
        gate: null,
        gateI: null,
        stand: null,
      }
    ],
    isUseable: "Y",
    isBridge: "Y",
    standNo: "101",
    terminal: "T2",
  },
  {
    dataArray: [
      {
        dynamicFlightIdA: 45482,
        dynamicFlightIdD: 45483,
        flightNumA: "CZ2367",
        flightNumD: "CZ2367",
        inOutFlag: "A|D",
        afid: "W/Z-CN7669-20201031-A|W/Z-CN7670-20201031-D",
        sta: "2021-08-11T01:30",
        eta: "2020-10-31T10:10",
        ata: "2020-10-31T10:10",
        std: "2021-08-11T01:30",
        etd: null,
        atd: null,
        ets: "2021-08-11T00:30",
        ete: "2021-08-11T04:30",
        ats: "2021-08-11T01:30",
        ate: null,
        exectDateA: null,
        exectDateD: null,
        dynamicResourceNo: "102",
        dynamicResourceId: 15290796,
        confirmedFlag: "Y",
        lockedFlag: "N",
        splitFlag: "Y",
        relateT: false,
        relateF: true,
        aircraftNo: "5482",
        aircraftType: "B738",
        progressStatusA: "ARR",
        progressStatusD: null,
        progressStatusACn: "到达",
        progressStatusDCn: null,
        taskACn: "正班",
        taskDCn: "正班",
        endFlagA: "N",
        endFlagD: "N",
        expressFlagA: "N",
        expressFlagD: "N",
        vipAFlag: "N",
        vipDFlag: "N",
        timeConflict: null,
        isBridge: null,
        attrA: "D",
        attrD: "D",
        attrDFlag: null,
        prevDepTimeA: 1604102100000,
        sort: 0,
        sortDate: 1628748328974,
        abnormalStatusA: null,
        abnormalStatusD: null,
        checkPCOccupied: null,
        flightNum: null,
        gate: null,
        gateI: null,
        stand: null,
      },
    ],
    isUseable: "Y",
    isBridge: "N",
    standNo: "102",
    terminal: "T2",
  },
  {
    dataArray: [
      {
        dynamicFlightIdA: 45482,
        dynamicFlightIdD: 45483,
        flightNumA: "HU9667",
        flightNumD: "HU9667",
        inOutFlag: "A|D",
        afid: "W/Z-CN7669-20201031-A|W/Z-CN7670-20201031-D",
        sta: "2021-08-11T04:30",
        eta: "2020-10-31T10:10",
        ata: "2020-10-31T10:10",
        std: "2021-08-11T04:30",
        etd: null,
        atd: null,
        ets: "2021-08-11T00:30",
        ete: "2021-08-11T06:30",
        ats: "2021-08-11T04:30",
        ate: null,
        exectDateA: null,
        exectDateD: null,
        dynamicResourceNo: "103",
        dynamicResourceId: 15290796,
        confirmedFlag: "Y",
        lockedFlag: "N",
        splitFlag: "Y",
        relateT: false,
        relateF: true,
        aircraftNo: "5482",
        aircraftType: "B738",
        progressStatusA: "ARR",
        progressStatusD: null,
        progressStatusACn: "到达",
        progressStatusDCn: null,
        taskACn: "正班",
        taskDCn: "正班",
        endFlagA: "N",
        endFlagD: "N",
        expressFlagA: "N",
        expressFlagD: "N",
        vipAFlag: "N",
        vipDFlag: "N",
        timeConflict: null,
        isBridge: null,
        attrA: "D",
        attrD: "D",
        attrDFlag: null,
        prevDepTimeA: 1604102100000,
        sort: 0,
        sortDate: 1628748328974,
        abnormalStatusA: null,
        abnormalStatusD: null,
        checkPCOccupied: null,
        flightNum: null,
        gate: null,
        gateI: null,
        stand: null,
      },
    ],
    isUseable: "Y",
    isBridge: "Y",
    standNo: "103",
    terminal: "T2",
  },
  {
    dataArray: [
      {
        dynamicFlightIdA: 45482,
        dynamicFlightIdD: 45483,
        flightNumA: "FU6523",
        flightNumD: "FU6523",
        inOutFlag: "A|D",
        afid: "W/Z-CN7669-20201031-A|W/Z-CN7670-20201031-D",
        sta: "2021-08-11T07:30",
        eta: "2020-10-31T10:10",
        ata: "2020-10-31T10:10",
        std: "2021-08-11T07:30",
        etd: null,
        atd: null,
        ets: "2021-08-11T00:30",
        ete: "2021-08-11T09:30",
        ats: "2021-08-11T07:30",
        ate: null,
        exectDateA: null,
        exectDateD: null,
        dynamicResourceNo: "104",
        dynamicResourceId: 15290796,
        confirmedFlag: "Y",
        lockedFlag: "N",
        splitFlag: "Y",
        relateT: false,
        relateF: true,
        aircraftNo: "5482",
        aircraftType: "B738",
        progressStatusA: "ARR",
        progressStatusD: null,
        progressStatusACn: "到达",
        progressStatusDCn: null,
        taskACn: "正班",
        taskDCn: "正班",
        endFlagA: "N",
        endFlagD: "N",
        expressFlagA: "N",
        expressFlagD: "N",
        vipAFlag: "N",
        vipDFlag: "N",
        timeConflict: null,
        isBridge: null,
        attrA: "D",
        attrD: "D",
        attrDFlag: null,
        prevDepTimeA: 1604102100000,
        sort: 0,
        sortDate: 1628748328974,
        abnormalStatusA: null,
        abnormalStatusD: null,
        checkPCOccupied: null,
        flightNum: null,
        gate: null,
        gateI: null,
        stand: null,
      },
      {
        dynamicFlightIdA: 45482,
        dynamicFlightIdD: 45483,
        flightNumA: "FU6663",
        flightNumD: "FU6663",
        inOutFlag: "A|D",
        afid: "W/Z-CN7669-20201031-A|W/Z-CN7670-20201031-D",
        sta: "2021-08-11T10:30",
        eta: "2020-10-31T10:10",
        ata: "2020-10-31T10:10",
        std: "2021-08-11T10:30",
        etd: null,
        atd: null,
        ets: "2021-08-11T10:30",
        ete: "2021-08-11T12:30",
        ats: "2021-08-11T10:30",
        ate: null,
        exectDateA: null,
        exectDateD: null,
        dynamicResourceNo: "104",
        dynamicResourceId: 15290796,
        confirmedFlag: "Y",
        lockedFlag: "N",
        splitFlag: "Y",
        relateT: false,
        relateF: true,
        aircraftNo: "5482",
        aircraftType: "B738",
        progressStatusA: "ARR",
        progressStatusD: null,
        progressStatusACn: "到达",
        progressStatusDCn: null,
        taskACn: "正班",
        taskDCn: "正班",
        endFlagA: "N",
        endFlagD: "N",
        expressFlagA: "N",
        expressFlagD: "N",
        vipAFlag: "N",
        vipDFlag: "N",
        timeConflict: null,
        isBridge: null,
        attrA: "D",
        attrD: "D",
        attrDFlag: null,
        prevDepTimeA: 1604102100000,
        sort: 0,
        sortDate: 1628748328974,
        abnormalStatusA: null,
        abnormalStatusD: null,
        checkPCOccupied: null,
        flightNum: null,
        gate: null,
        gateI: null,
        stand: null,
      },
    ],
    isUseable: "Y",
    isBridge: "N",
    standNo: "104",
    terminal: "T2",
  },
  {
    dataArray: [
      {
        dynamicFlightIdA: 45482,
        dynamicFlightIdD: 45483,
        flightNumA: "CN7669",
        flightNumD: "CN7670",
        inOutFlag: "A|D",
        afid: "W/Z-CN7669-20201031-A|W/Z-CN7670-20201031-D",
        sta: "2021-08-11T07:30",
        eta: "2020-10-31T10:10",
        ata: "2020-10-31T10:10",
        std: "2021-08-11T07:30",
        etd: null,
        atd: null,
        ets: "2021-08-11T00:30",
        ete: "2021-08-11T09:30",
        ats: "2021-08-11T07:30",
        ate: null,
        exectDateA: null,
        exectDateD: null,
        dynamicResourceNo: "106",
        dynamicResourceId: 15290796,
        confirmedFlag: "Y",
        lockedFlag: "N",
        splitFlag: "Y",
        relateT: false,
        relateF: true,
        aircraftNo: "5482",
        aircraftType: "B738",
        progressStatusA: "ARR",
        progressStatusD: null,
        progressStatusACn: "到达",
        progressStatusDCn: null,
        taskACn: "正班",
        taskDCn: "正班",
        endFlagA: "N",
        endFlagD: "N",
        expressFlagA: "N",
        expressFlagD: "N",
        vipAFlag: "N",
        vipDFlag: "N",
        timeConflict: null,
        isBridge: null,
        attrA: "D",
        attrD: "D",
        attrDFlag: null,
        prevDepTimeA: 1604102100000,
        sort: 0,
        sortDate: 1628748328974,
        abnormalStatusA: null,
        abnormalStatusD: null,
        checkPCOccupied: null,
        flightNum: null,
        gate: null,
        gateI: null,
        stand: null,
      },
    ],
    isUseable: "Y",
    isBridge: "N",
    standNo: "106",
    terminal: "T3",
  },
  {
    dataArray: [
      {
        dynamicFlightIdA: 45482,
        dynamicFlightIdD: 45483,
        flightNumA: "CA1205",
        flightNumD: "CA1205",
        inOutFlag: "A|D",
        afid: "W/Z-CN7669-20201031-A|W/Z-CN7670-20201031-D",
        sta: "2021-08-11T00:10",
        eta: "2020-10-31T10:10",
        ata: "2020-10-31T10:10",
        std: "2021-08-11T00:30",
        etd: null,
        atd: null,
        ets: "2021-08-11T00:10",
        ete: "2021-08-11T02:05",
        ats: "2021-08-11T00:10",
        ate: null,
        exectDateA: null,
        exectDateD: null,
        dynamicResourceNo: "107",
        dynamicResourceId: 15290796,
        confirmedFlag: "Y",
        lockedFlag: "N",
        splitFlag: "Y",
        relateT: false,
        relateF: true,
        aircraftNo: "5482",
        aircraftType: "B738",
        progressStatusA: "ARR",
        progressStatusD: null,
        progressStatusACn: "到达",
        progressStatusDCn: null,
        taskACn: "正班",
        taskDCn: "正班",
        endFlagA: "N",
        endFlagD: "N",
        expressFlagA: "N",
        expressFlagD: "N",
        vipAFlag: "N",
        vipDFlag: "N",
        timeConflict: null,
        isBridge: null,
        attrA: "D",
        attrD: "D",
        attrDFlag: null,
        prevDepTimeA: 1604102100000,
        sort: 0,
        sortDate: 1628748328974,
        abnormalStatusA: null,
        abnormalStatusD: null,
        checkPCOccupied: null,
        flightNum: null,
        gate: null,
        gateI: null,
        stand: null,
      },
    ],
    isUseable: "Y",
    isBridge: "Y",
    standNo: "107",
    terminal: "T3",
  },
  {
    dataArray: [
      {
        dynamicFlightIdA: 45482,
        dynamicFlightIdD: 45483,
        flightNumA: "CN7669",
        flightNumD: "CN7670",
        inOutFlag: "A|D",
        afid: "W/Z-CN7669-20201031-A|W/Z-CN7670-20201031-D",
        sta: "2021-08-11T01:10",
        eta: "2020-10-31T10:10",
        ata: "2020-10-31T10:10",
        std: "2021-08-11T00:30",
        etd: null,
        atd: null,
        ets: "2021-08-11T01:10",
        ete: "2021-08-11T03:05",
        ats: "2021-08-11T01:10",
        ate: null,
        exectDateA: null,
        exectDateD: null,
        dynamicResourceNo: "108",
        dynamicResourceId: 15290796,
        confirmedFlag: "Y",
        lockedFlag: "N",
        splitFlag: "Y",
        relateT: false,
        relateF: true,
        aircraftNo: "5482",
        aircraftType: "B738",
        progressStatusA: "ARR",
        progressStatusD: null,
        progressStatusACn: "到达",
        progressStatusDCn: null,
        taskACn: "正班",
        taskDCn: "正班",
        endFlagA: "N",
        endFlagD: "N",
        expressFlagA: "N",
        expressFlagD: "N",
        vipAFlag: "N",
        vipDFlag: "N",
        timeConflict: null,
        isBridge: null,
        attrA: "D",
        attrD: "D",
        attrDFlag: null,
        prevDepTimeA: 1604102100000,
        sort: 0,
        sortDate: 1628748328974,
        abnormalStatusA: null,
        abnormalStatusD: null,
        checkPCOccupied: null,
        flightNum: null,
        gate: null,
        gateI: null,
        stand: null,
      },
    ],
    isUseable: "Y",
    isBridge: "N",
    standNo: "108",
    terminal: "T3",
  },
  {
    dataArray: [
      {
        dynamicFlightIdA: 45482,
        dynamicFlightIdD: 45483,
        flightNumA: "MU2124",
        flightNumD: "MU2124",
        inOutFlag: "A|D",
        afid: "W/Z-CN7669-20201031-A|W/Z-CN7670-20201031-D",
        sta: "2021-08-11T10:00",
        eta: "2020-10-31T10:10",
        ata: "2020-10-31T10:10",
        std: "2021-08-11T10:00",
        etd: null,
        atd: null,
        ets: "2021-08-11T10:00",
        ete: "2021-08-11T14:05",
        ats: "2021-08-11T10:00",
        ate: null,
        exectDateA: null,
        exectDateD: null,
        dynamicResourceNo: "110",
        dynamicResourceId: 15290796,
        confirmedFlag: "Y",
        lockedFlag: "N",
        splitFlag: "Y",
        relateT: false,
        relateF: true,
        aircraftNo: "5482",
        aircraftType: "B738",
        progressStatusA: "ARR",
        progressStatusD: null,
        progressStatusACn: "到达",
        progressStatusDCn: null,
        taskACn: "正班",
        taskDCn: "正班",
        endFlagA: "N",
        endFlagD: "N",
        expressFlagA: "N",
        expressFlagD: "N",
        vipAFlag: "N",
        vipDFlag: "N",
        timeConflict: null,
        isBridge: null,
        attrA: "D",
        attrD: "D",
        attrDFlag: null,
        prevDepTimeA: 1604102100000,
        sort: 0,
        sortDate: 1628748328974,
        abnormalStatusA: null,
        abnormalStatusD: null,
        checkPCOccupied: null,
        flightNum: null,
        gate: null,
        gateI: null,
        stand: null,
      },
      {
        dynamicFlightIdA: 45482,
        dynamicFlightIdD: 45483,
        flightNumA: "MU2324",
        flightNumD: "MU2324",
        inOutFlag: "A|D",
        afid: "W/Z-CN7669-20201031-A|W/Z-CN7670-20201031-D",
        sta: "2021-08-11T10:10",
        eta: "2020-10-31T10:10",
        ata: "2020-10-31T10:10",
        std: "2021-08-11T11:00",
        etd: null,
        atd: null,
        ets: "2021-08-11T10:10",
        ete: "2021-08-11T16:05",
        ats: "2021-08-11T10:10",
        ate: null,
        exectDateA: null,
        exectDateD: null,
        dynamicResourceNo: "110",
        dynamicResourceId: 15290796,
        confirmedFlag: "Y",
        lockedFlag: "N",
        splitFlag: "Y",
        relateT: false,
        relateF: true,
        aircraftNo: "5482",
        aircraftType: "B738",
        progressStatusA: "ARR",
        progressStatusD: null,
        progressStatusACn: "到达",
        progressStatusDCn: null,
        taskACn: "正班",
        taskDCn: "正班",
        endFlagA: "N",
        endFlagD: "N",
        expressFlagA: "N",
        expressFlagD: "N",
        vipAFlag: "N",
        vipDFlag: "N",
        timeConflict: null,
        isBridge: null,
        attrA: "D",
        attrD: "D",
        attrDFlag: null,
        prevDepTimeA: 1604102100000,
        sort: 0,
        sortDate: 1628748328974,
        abnormalStatusA: null,
        abnormalStatusD: null,
        checkPCOccupied: null,
        flightNum: null,
        gate: null,
        gateI: null,
        stand: null,
      },
      {
        dynamicFlightIdA: 45482,
        dynamicFlightIdD: 45483,
        flightNumA: "MU2355",
        flightNumD: "MU2355",
        inOutFlag: "A|D",
        afid: "W/Z-CN7669-20201031-A|W/Z-CN7670-20201031-D",
        sta: "2021-08-11T15:10",
        eta: "2020-10-31T10:10",
        ata: "2020-10-31T10:10",
        std: "2021-08-11T15:10",
        etd: null,
        atd: null,
        ets: "2021-08-11T15:10",
        ete: "2021-08-11T17:05",
        ats: "2021-08-11T15:10",
        ate: null,
        exectDateA: null,
        exectDateD: null,
        dynamicResourceNo: "110",
        dynamicResourceId: 15290796,
        confirmedFlag: "Y",
        lockedFlag: "N",
        splitFlag: "Y",
        relateT: false,
        relateF: true,
        aircraftNo: "5482",
        aircraftType: "B738",
        progressStatusA: "ARR",
        progressStatusD: null,
        progressStatusACn: "到达",
        progressStatusDCn: null,
        taskACn: "正班",
        taskDCn: "正班",
        endFlagA: "N",
        endFlagD: "N",
        expressFlagA: "N",
        expressFlagD: "N",
        vipAFlag: "N",
        vipDFlag: "N",
        timeConflict: null,
        isBridge: null,
        attrA: "D",
        attrD: "D",
        attrDFlag: null,
        prevDepTimeA: 1604102100000,
        sort: 0,
        sortDate: 1628748328974,
        abnormalStatusA: null,
        abnormalStatusD: null,
        checkPCOccupied: null,
        flightNum: null,
        gate: null,
        gateI: null,
        stand: null,
      },
    ],
    isUseable: "Y",
    isBridge: "N",
    standNo: "110",
    terminal: "T3",
  },
  {
    dataArray: [],
    isUseable: "Y",
    isBridge: "Y",
    standNo: "111",
    terminal: "T3",
  },
  {
    dataArray: [],
    isUseable: "Y",
    isBridge: "N",
    standNo: "112",
    terminal: "T3",
  },
  {
    dataArray: [],
    isUseable: "Y",
    isBridge: "Y",
    standNo: "113",
    terminal: "T3",
  },
  {
    dataArray: [
      {
        dynamicFlightIdA: 45482,
        dynamicFlightIdD: 45483,
        flightNumA: "HU2114",
        flightNumD: "HU2114",
        inOutFlag: "A|D",
        afid: "W/Z-CN7669-20201031-A|W/Z-CN7670-20201031-D",
        sta: "2021-08-11T09:40",
        eta: "2020-10-31T10:10",
        ata: "2020-10-31T10:10",
        std: "2021-08-11T09:40",
        etd: null,
        atd: null,
        ets: "2021-08-11T09:40",
        ete: "2021-08-11T11:05",
        ats: "2021-08-11T09:40",
        ate: null,
        exectDateA: null,
        exectDateD: null,
        dynamicResourceNo: "114",
        dynamicResourceId: 15290796,
        confirmedFlag: "Y",
        lockedFlag: "N",
        splitFlag: "Y",
        relateT: false,
        relateF: true,
        aircraftNo: "5482",
        aircraftType: "B738",
        progressStatusA: "ARR",
        progressStatusD: null,
        progressStatusACn: "到达",
        progressStatusDCn: null,
        taskACn: "正班",
        taskDCn: "正班",
        endFlagA: "N",
        endFlagD: "N",
        expressFlagA: "N",
        expressFlagD: "N",
        vipAFlag: "N",
        vipDFlag: "N",
        timeConflict: null,
        isBridge: null,
        attrA: "D",
        attrD: "D",
        attrDFlag: null,
        prevDepTimeA: 1604102100000,
        sort: 0,
        sortDate: 1628748328974,
        abnormalStatusA: null,
        abnormalStatusD: null,
        checkPCOccupied: null,
        flightNum: null,
        gate: null,
        gateI: null,
        stand: null,
      },
    ],
    isUseable: "Y",
    isBridge: "N",
    standNo: "114",
    terminal: "T3",
  },
  {
    dataArray: [],
    isUseable: "Y",
    isBridge: "Y",
    standNo: "115",
    terminal: "T3",
  },
  {
    dataArray: [],
    isUseable: "Y",
    isBridge: "N",
    standNo: "116",
    terminal: "T3",
  },
  {
    dataArray: [],
    isUseable: "Y",
    isBridge: "Y",
    standNo: "117",
    terminal: "T3",
  },
  {
    dataArray: [],
    isUseable: "Y",
    isBridge: "N",
    standNo: "118",
    terminal: "T3",
  },
  {
    dataArray: [
      {
        dynamicFlightIdA: 45482,
        dynamicFlightIdD: 45483,
        flightNumA: "MU2119",
        flightNumD: "MU2119",
        inOutFlag: "A|D",
        afid: "W/Z-CN7669-20201031-A|W/Z-CN7670-20201031-D",
        sta: "2021-08-11T08:40",
        eta: "2020-10-31T10:10",
        ata: "2020-10-31T10:10",
        std: "2021-08-11T08:40",
        etd: null,
        atd: null,
        ets: "2021-08-11T08:40",
        ete: "2021-08-11T10:10",
        ats: "2021-08-11T08:40",
        ate: null,
        exectDateA: null,
        exectDateD: null,
        dynamicResourceNo: "119",
        dynamicResourceId: 15290796,
        confirmedFlag: "Y",
        lockedFlag: "N",
        splitFlag: "Y",
        relateT: false,
        relateF: true,
        aircraftNo: "5482",
        aircraftType: "B738",
        progressStatusA: "ARR",
        progressStatusD: null,
        progressStatusACn: "到达",
        progressStatusDCn: null,
        taskACn: "正班",
        taskDCn: "正班",
        endFlagA: "N",
        endFlagD: "N",
        expressFlagA: "N",
        expressFlagD: "N",
        vipAFlag: "N",
        vipDFlag: "N",
        timeConflict: null,
        isBridge: null,
        attrA: "D",
        attrD: "D",
        attrDFlag: null,
        prevDepTimeA: 1604102100000,
        sort: 0,
        sortDate: 1628748328974,
        abnormalStatusA: null,
        abnormalStatusD: null,
        checkPCOccupied: null,
        flightNum: null,
        gate: null,
        gateI: null,
        stand: null,
      },
    ],
    isUseable: "Y",
    isBridge: "N",
    standNo: "119",
    terminal: "T3",
  },
  {
    dataArray: [],
    isUseable: "Y",
    isBridge: "N",
    standNo: "120",
    terminal: "T3",
  },
];

dataArr.sort(function (a, b) {
  return a.standNo - b.standNo;
});

for(let i = 0; i < dataArr.length; i++ ) {
  let arrJ = dataArr[i].dataArray
  if(arrJ.length) {
    for(let j = 0; j < arrJ.length; j++){
      let s = ["ats", "ets"];
      let e = ["ate", "ete"];
      if (_.isArray(s) && _.isArray(e)) {
        let tmpS, tmpE;
        for (let sIndex = 0; sIndex < s.length; sIndex++) {
          if (_.get(arrJ[j], s[sIndex]) && _.get(arrJ[j], e[sIndex])) {
            tmpS = s[sIndex];
            tmpE = e[sIndex];
            if (sIndex > 0 && _.get(arrJ[j], s[0])) {
              // 有实际开始没有实际结束
              tmpS = s[0];
            }
            break;
          }
        }
        s = tmpS;
        e = tmpE;
      }

    }

    arrJ.sort(function(a,b){
      return b.ats < a.ats ? 1 : -1
    });
  }

  let q = 0
  for(let k = 0;k< arrJ.length;k++) {

    if(arrJ[k-1] && arrJ[k-1].ete < arrJ[k].ats) {

    } else {
      q++
    }
  }

  dataArr[i].len = q
}

export { dataArr };
