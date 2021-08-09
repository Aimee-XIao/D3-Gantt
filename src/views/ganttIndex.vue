<template>
  <div>
    <div style="width: 125px;position: fixed;top: 35px;left: 45px;z-index: 2">
      <y-select style="width: 100%;" placeholder="请选择" v-model="filterData"  filterable clearable default-first-option>
        <y-select-option v-for="item in lugList" :key="item.terminal" :label="item.label" :value="item.terminal" placeholder="请选择">
          <span style="float: left">{{ item.terminal }}</span>
          <span style="float: right; color: #8492a6; font-size: 13px">{{ item.label }}</span>
        </y-select-option>
      </y-select>
    </div>
    <div id="myChart" style="width:100%;height:867px;"></div>
  </div>
</template>

<script>
import  rawData  from '../api/ganttData.json'
export default {
name: "ganttIndex",
data(){
  return {
    xData: ['08-04','01:00','02:00','03:00','04:00','05:00','06:00','07:00','08:00','09:00','10:00','11:00','12:00','13:00','14:00','15:00','16:00','17:00','18:00','19:00','20:00','21:00','22:00','23:00'],
    yData: ['L01', 'L02', 'L03', 'L04','L05','L06','L07','L08','L09','L10','L11','L12','L13'],
    draggable: false,
    myChart: null,
    HEIGHT_RATIO : 0.6,
    DIM_CATEGORY_INDEX : 0,
    DIM_TIME_ARRIVAL : 1,
    DIM_TIME_DEPARTURE : 2,
    DATA_ZOOM_AUTO_MOVE_THROTTLE : 30,
    DATA_ZOOM_X_INSIDE_INDEX : 1,
    filterData: 'T1',
    DATA_ZOOM_Y_INSIDE_INDEX : 3,
    DATA_ZOOM_AUTO_MOVE_SPEED : 0.2,
    DATA_ZOOM_AUTO_MOVE_DETECT_AREA_WIDTH :30,
    draggingEl: null,
    dropShadow: null,
    draggingCursorOffset :[0, 0],
    draggingTimeLength: null,
    draggingRecord: null,
    dropRecord: null,
    cartesianXBounds : [],
    cartesianYBounds : [],
    autoDataZoomAnimator: null,
    lugList: [
      {
        terminal : 'T1',
        label: '国内'
      },
      {
        terminal : 'T2',
        label: '国内'
      },
      {
        terminal : 'T3',
        label: '国内'
      }
    ]
  }
},
mounted() {
  this.myChart =  this.$echarts.init(document.getElementById('myChart'))
  this.getGantt()
  this.initDrag();
},
methods: {
  getGantt() {
    var opt = {
      animation: false,
      title: {
        text: 'Gantt of Baggage carousel',
        left: 'center'
      },
      dataZoom: [{
        type: 'slider',
        xAxisIndex: 0,
        filterMode: 'weakFilter',
        height: 10,
        bottom: 10,
        start: 0,
        end: 26,
        showDetail: false
      }, {
        type: 'inside',
        id: 'insideX',
        xAxisIndex: 0,
        filterMode: 'weakFilter',
        start: 0,
        end: 26,
        zoomOnMouseWheel: false,
        moveOnMouseMove: true
      }, {
        type: 'slider',
        yAxisIndex: 0,
        zoomLock: true,
        width: 10,
        right: 10,
        top: 70,
        bottom: 20,
        start: 95,
        end: 100,
        handleSize: 0,
        showDetail: false,
      }, {
        type: 'inside',
        id: 'insideY',
        yAxisIndex: 0,
        start: 95,
        end: 100,
        zoomOnMouseWheel: false,
        moveOnMouseMove: true,
        moveOnMouseWheel: true
      }],
      grid: {
        show: true,
        top: 70,
        bottom: 20,
        left: 100,
        right: 20,
        backgroundColor: '#fff',
        borderWidth: 0
      },
      xAxis: {
        type: 'time',
        position: 'top',
        splitLine: {
          lineStyle: {
            color: ['#E9EDFF']
          }
        },
        axisLine: {
          show: false
        },
        axisTick: {
          lineStyle: {
            color: '#929ABA'
          }
        },
        axisLabel: {
          color: '#929ABA',
          inside: false,
          align: 'center'
        },

      },
      yAxis: {
        axisTick: {show: false},
        splitLine: {show: false},
        axisLine: {show: false},
        axisLabel: {show: false},
        min: 0,
        max: rawData.parkingApron.data.length
      },
      series: [{
        id: 'flightData',
        type: 'custom',
        renderItem: this.renderGanttItem,
        dimensions: rawData.flight.dimensions,
        encode: {
          x: [this.DIM_TIME_ARRIVAL, this.DIM_TIME_DEPARTURE],
          y: this.DIM_CATEGORY_INDEX,
          tooltip: [this.DIM_CATEGORY_INDEX, this.DIM_TIME_ARRIVAL, this.DIM_TIME_DEPARTURE]
        },
        data: rawData.flight.data
      }, {
        type: 'custom',
        renderItem: this.renderAxisLabelItem,
        dimensions: rawData.parkingApron.dimensions,
        encode: {
          x: -1, // Then this series will not controlled by x.
          y: 0
        },
        data: rawData.parkingApron.data.map(function (item, index) {
          return [index].concat(item);
        })
      }]
    }
    this.myChart.setOption(opt)
    let that = this
    this.myChart.on('click', function (param) {
      if(param.componentIndex == 1) return
      that.$emit('flightMsg', param.value)
    });

  },
  renderGanttItem(params, api) {

    var categoryIndex = api.value(this.DIM_CATEGORY_INDEX);
    var timeArrival = api.coord([api.value(this.DIM_TIME_ARRIVAL), categoryIndex]);
    var timeDeparture = api.coord([api.value(this.DIM_TIME_DEPARTURE), categoryIndex]);

    var coordSys = params.coordSys;
    this.cartesianXBounds[0] = coordSys.x;
    this.cartesianXBounds[1] = coordSys.x + coordSys.width;
    this.cartesianXBounds[0] = coordSys.y;
    this.cartesianXBounds[1] = coordSys.y + coordSys.height;
    var barLength = timeDeparture[0] - timeArrival[0];
    console.log('========', barLength)
    // Get the heigth corresponds to length 1 on y axis.
    var barHeight = api.size([0, 1])[1] * this.HEIGHT_RATIO;
    var x = timeArrival[0];
    var y = timeArrival[1] - barHeight;
    var flightNumber = api.value(3) + '';
    var flightNumberWidth = this.$echarts.format.getTextRect(flightNumber).width;
    var text = (barLength > flightNumberWidth + 40 && x + barLength >= 180) ? flightNumber : '';
    var rectNormal = this.clipRectByRect(params, { x: x, y: y, width: barLength, height: barHeight });
    var rectVIP = this.clipRectByRect(params, { x: x, y: y, width: (barLength) / 2, height: barHeight});
    var rectText = this.clipRectByRect(params, {x: x, y: y, width: barLength, height: barHeight});
    return {
      type: 'group',
      children: [
        {
        type: 'rect',
        ignore: !rectNormal,
        shape: rectNormal,
        style: api.style({fill: '#ccc'})
        },
        {
        type: 'rect',
        ignore: !rectVIP && !api.value(4),
        shape: rectVIP,
        style: api.style({fill: '#ccc'})
        },
        {
        type: 'rect',
        ignore: !rectText,
        shape: rectText,
        style: api.style({
            fill: 'transparent',
            stroke: 'transparent',
            text: text,
            textFill: '#fff'
         })
      }
      ]
    };
},
  clipRectByRect(params, rect) {
    return this.$echarts.graphic.clipRectByRect(rect, {
      x: params.coordSys.x,
      y: params.coordSys.y,
      width: params.coordSys.width,
      height: params.coordSys.height
      });
  },
  renderAxisLabelItem(params, api) {
    var y = api.coord([0, api.value(0)])[1];
    if (y < params.coordSys.y + 5) {
      return;
    }
    return {
     type: 'group',
     position: [
        10,
        y
      ],
     children: [
       {
         type: 'path',
         shape: {
           d: 'M0,0 L0,-20 L30,-20 C42,-20 38,-1 50,-1 L70,-1 L70,0 Z',
           x: 0,
           y: -20,
           width: 90,
           height: 20,
           layout: 'cover'
         },
         style: {
          fill: '#368c6c'
         }
       },
       {
         type: 'text',
         style: {
           x: 24,
           y: -3,
           text: api.value(1),
           textVerticalAlign: 'bottom',
           textAlign: 'center',
           textFill: '#fff'
         }
       }
    ]
    };
  },
  initDrag() {

    this.autoDataZoomAnimator = this.makeAnimator(this.dispatchDataZoom);
    this.myChart.on('mousedown', function (param) {
      if (!this.draggable || !param || param.seriesIndex == null) {
        return;
      }
      // Drag start
      this.draggingRecord = {
        dataIndex: param.dataIndex,
        categoryIndex: param.value[this.DIM_CATEGORY_INDEX],
        timeArrival: param.value[this.DIM_TIME_ARRIVAL],
        timeDeparture: param.value[this.DIM_TIME_DEPARTURE]
      };
      console.log('0000000000000000000', this.draggingRecord)
      var style = {lineWidth: 2, fill: 'rgba(255,0,0,0.1)', stroke: 'rgba(255,0,0,0.8)', lineDash: [6, 3]};
      this.draggingEl = this.addOrUpdateBar(this.draggingEl, this.draggingRecord, style, 100);
      this.draggingCursorOffset = [
        this.draggingEl.position[0] - param.event.offsetX,
        this.draggingEl.position[1] - param.event.offsetY
      ];
      this.draggingTimeLength = this.draggingRecord.timeDeparture - this.draggingRecord.timeArrival;
    });
    this.myChart.getZr().on('mousemove', function (event) {
      if (!this.draggingEl) {return;}
      var cursorX = event.offsetX;
      var cursorY = event.offsetY;
      // Move this.draggingEl.
      this.draggingEl.attr('position', [
        this.draggingCursorOffset[0] + cursorX,
        this.draggingCursorOffset[1] + cursorY,
      ]);
      this.prepareDrop();
      this.autoDataZoomWhenDraggingOutside(cursorX, cursorY);
    });
    let that = this
    this.myChart.getZr().on('mouseup', function () {
      // Drop
      if (this.draggingEl && this.dropRecord) {
        this.updateRawData() && this.myChart.setOption({
          series: {
            id: 'flightData',
            data: rawData.flight.data
          }
        });
      }
      that.dragRelease();
    });
    this.myChart.getZr().on('globalout', this.dragRelease);
  },
  dragRelease() {
    this.autoDataZoomAnimator.stop();
    if (this.draggingEl) {
      this.myChart.getZr().remove(this.draggingEl);
      this.draggingEl = null;
    }
    if (this.dropShadow) {
      this.myChart.getZr().remove(this.dropShadow);
      this.dropShadow = null;
    }
    this.dropRecord = this.draggingRecord = null;
  },
  addOrUpdateBar(el, itemData, style, z) {
    var pointArrival = this.myChart.convertToPixel('grid', [itemData.timeArrival, itemData.categoryIndex]);
    var pointDeparture = this.myChart.convertToPixel('grid', [itemData.timeDeparture, itemData.categoryIndex]);
    var barLength = pointDeparture[0] - pointArrival[0];
    var barHeight = Math.abs(
     this.myChart.convertToPixel('grid', [0, 0])[1] - this.myChart.convertToPixel('grid', [0, 1])[1]
     ) * this.HEIGHT_RATIO;
    if (!el) {
      el = new this.$echarts.graphic.Rect({
        shape: {x: 0, y: 0, width: 0, height: 0},
        style: style,
        z: z
      });
      this.myChart.getZr().add(el);
    }
    el.attr({
      shape: {x: 0, y: 0, width: barLength, height: barHeight},
      position: [pointArrival[0], pointArrival[1] - barHeight]
    });
    return el;
  },
  prepareDrop() {
    // Check droppable place.
    var xPixel = this.draggingEl.shape.x + this.draggingEl.position[0];
    var yPixel = this.draggingEl.shape.y + this.draggingEl.position[1];
    var cursorData = this.myChart.convertFromPixel('grid', [xPixel, yPixel]);
    if (cursorData) {
      // Make drop shadow and _dropRecord
      this.dropRecord = {
        categoryIndex: Math.floor(cursorData[1]),
        timeArrival: cursorData[0],
        timeDeparture: cursorData[0] + this.draggingTimeLength
      };
      var style = {fill: 'rgba(0,0,0,0.4)'};
      this.dropShadow = this.addOrUpdateBar(this.dropShadow, this.dropRecord, style, 99);
    }
  },
  // This is some business logic, don't care about it.
  updateRawData() {
    var flightData = rawData.flight.data;
    var movingItem = flightData[this.draggingRecord.dataIndex];
    // Check conflict
    for (var i = 0; i < flightData.length; i++) {
      var dataItem = flightData[i];
      if (dataItem !== movingItem
        && this.dropRecord.categoryIndex === dataItem[this.DIM_CATEGORY_INDEX]
        && this.dropRecord.timeArrival < dataItem[this.DIM_TIME_DEPARTURE]
        && this.dropRecord.timeDeparture > dataItem[this.DIM_TIME_ARRIVAL]
      ) {
        alert('Conflict! Find a free space to settle the bar!');
        return;
      }
    }
    // No conflict.
    movingItem[this.DIM_CATEGORY_INDEX] = this.dropRecord.categoryIndex;
    movingItem[this.DIM_TIME_ARRIVAL] = this.dropRecord.timeArrival;
    movingItem[this.DIM_TIME_DEPARTURE] = this.dropRecord.timeDeparture;
    return true;
  },
  autoDataZoomWhenDraggingOutside(cursorX, cursorY) {
    // When cursor is outside the cartesian and being dragging,
    // auto move the dataZooms.
    var cursorDistX = this.getCursorCartesianDist(cursorX, this.cartesianXBounds);
    var cursorDistY = this.getCursorCartesianDist(cursorY, this.cartesianXBounds);
    if (cursorDistX !== 0 || cursorDistY !== 0) {
      this.autoDataZoomAnimator.start({
      cursorDistX: cursorDistX,
      cursorDistY: cursorDistY
    });
    } else {
    this.autoDataZoomAnimator.stop();
  }
  },
  dispatchDataZoom(params) {
    var option = this.myChart.getOption();
    var optionInsideX = option.dataZoom[this.DATA_ZOOM_X_INSIDE_INDEX];
    var optionInsideY = option.dataZoom[this.DATA_ZOOM_Y_INSIDE_INDEX];
    var batch = [];
    this.prepareBatch(batch, 'insideX', optionInsideX.start, optionInsideX.end, params.cursorDistX);
    this.prepareBatch(batch, 'insideY', optionInsideY.start, optionInsideY.end, -params.cursorDistY);
    batch.length && this.myChart.dispatchAction({
      type: 'dataZoom',
      batch: batch
    });
 },
  prepareBatch(batch, id, start, end, cursorDist) {
    if (cursorDist === 0) {
      return;
    }
    var sign = cursorDist / Math.abs(cursorDist);
    var size = end - start;
    var delta = this.DATA_ZOOM_AUTO_MOVE_SPEED * sign;
    start += delta;
    end += delta;
    if (end > 100) {
      end = 100;
      start = end - size;
    }
    if (start < 0) {
      start = 0;
      end = start + size;
    }
    batch.push({
      dataZoomId: id,
      start: start,
      end: end
    });
  },
  getCursorCartesianDist(cursorXY, bounds) {
    console.log('=====================================', bounds)
    var dist0 = cursorXY - (bounds[0] + this.DATA_ZOOM_AUTO_MOVE_DETECT_AREA_WIDTH);
    var dist1 = cursorXY - (bounds[1] - this.DATA_ZOOM_AUTO_MOVE_DETECT_AREA_WIDTH);
    return dist0 * dist1 <= 0 ? 0  : dist0 < 0 ? dist0  : dist1;
 },
  makeAnimator(callback) {
  var requestId;
  var callbackParams;
  // Use throttle to prevent from calling dispatchAction frequently.
  callback = this.$echarts.throttle(callback, this.DATA_ZOOM_AUTO_MOVE_THROTTLE);

  function onFrame() {
    callback(callbackParams);
    requestId = requestAnimationFrame(onFrame);
  }

  return {
    start: function (params) {
      callbackParams = params;
      if (requestId == null) {
        onFrame();
      }
    },
    stop: function () {
      if (requestId != null) {
        cancelAnimationFrame(requestId);
      }
      requestId = callbackParams = null;
    }
  };
}
 }
}
</script>

<style scoped>

</style>
