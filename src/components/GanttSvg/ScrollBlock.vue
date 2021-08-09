<template>
  <g ref="scrollGroup" :id="'scrollGroup' + cId" class="scrollGroup">
    <rect :id="'scrollBg' + cId" ref="scrollBg"
      :rx="rx" :ry="ry" :fill="bgColor" :stroke="bgBorderColor" class="scrollBg"></rect>
    <rect :id="'scrollBk' + cId" ref="scrollBk"
      :rx="rx" :ry="ry" :fill="bkColor" :stroke="bkBorderColor" class="scrollBk"></rect>
  </g>
</template>

<script>

import { mapState } from 'vuex'
import { randomStr } from '../../util/util'
import _ from 'lodash'
export default {
  props: {
    refresh: {
      type: Array,
      default: () => []
    },
    per: {
      type: Number,
      default: 1
    },
    height: {
      type: Number,
      default: 10
    },
    boundaryGap: {
      type: Array,
      default: () => [10, 10]
    },
    rx: {
      type: Number,
      default: 5
    },
    ry: {
      type: Number,
      default: 5
    },
    bgBorderColor: {
      type: String,
      default: '#7a939e'
    },
    bgColor: {
      type: String,
      default: 'transparent'
    },
    bkBorderColor: {
      type: String,
      default: '#6796E6'
    },
    bkColor: {
      type: String,
      default: '#6796E6'
    },
    scrollType: {
      type: String,
      default: 'x'
    }
  },
  data () {
    return {
      name: ['x', 'scroll', 'all'],
      cId: '',
      bgWidth: 0,
      bgHeight: 0,
      scrollGroup: null,
      scrollBg: null,
      scrollBk: null,
      blockDraggable: null,
      isInit: false
    }
  },
  created () {
    this.$set(this, 'cId', randomStr())
    this.$set(this.name, 0, this.scrollType)
  },
  mounted () {
    let that = this
    this.$nextTick(() => {
      this.blockDraggable = window.Draggable.create(this.$refs.scrollBk, {
        type: this.scrollType,
        lockAxis: true,
        trigger: '#scrollBk' + this.cId,
        autoScroll: true,
        bounds: '#scrollBg' + this.cId,
        onDrag: function (e) {
          that.dragUpdate(e, this)
        },
        // onThrowUpdate: this.dragUpdate,
        throwProps: true,
        dragClickables: true,
        maxDuration: 0.8,
        overshootTolerance: 0
      })
    })
  },
  computed: {
    ...mapState({
      conf (state) {
        return (this.scrollType === 'x' ? state.gantt.xAxis.scroll : state.gantt.yAxis.scroll)
      }
    }),
    blockWidth () {
      return this.bgWidth ? (this.scrollType === 'x' ? this.conf.per : 1) * this.conf.width : 0
    },
    blockHeight () {
      return this.bgHeight ? (this.scrollType === 'y' ? this.conf.per : 1) * this.conf.height : 0
    }
  },
  methods: {
    init () {
      let x = (this.scrollType === 'y') ? (this.conf.x - this.bgWidth) : this.boundaryGap[0]
      let y = (this.scrollType === 'x') ? (this.conf.y - this.bgHeight) : this.boundaryGap[0]
      this.$d3.select(this.scrollBg)
        .attr('x', x)
        .attr('y', y)
        .attr('width', this.bgWidth)
        .attr('height', this.bgHeight)
        .attr('fill', this.bgColor)
        .attr('stroke', this.bgBorderColor)
        .attr('stroke-width', 1)
      this.$d3.select(this.scrollBk)
        .attr('x', x)
        .attr('y', y)
        .attr('width', this.blockWidth)
        .attr('height', this.blockHeight)
        .attr('fill', this.bkColor)
        .attr('stroke', this.bkBorderColor)
        .attr('stroke-width', 1)
    },
    dragUpdate (e, _this) {
      this.$emit('scroll', {e: e, _this: _this})
    }
  },
  watch: {
    refresh: {
      handler (val) {
        if (_.intersection(val || [], this.name)) {
          if (this.conf.per < 1) {
            if (this.scrollType === 'x') {
              this.$set(this, 'bgWidth', this.conf.width - this.boundaryGap[0] - this.boundaryGap[1])
              this.$set(this, 'bgHeight', this.conf.height)
            } else {
              this.$set(this, 'bgWidth', this.conf.width)
              this.$set(this, 'bgHeight', this.conf.height - this.boundaryGap[0] - this.boundaryGap[1])
            }
            if (this.scrollGroup && this.scrollBg && this.scrollBk) {
              this.init()
            } else {
              this.$nextTick(() => {
                this.scrollGroup = this.$refs.scrollGroup
                this.scrollBg = this.$refs.scrollGroup.querySelector('.scrollBg')
                this.scrollBk = this.$refs.scrollGroup.querySelector('.scrollBk')
                this.init()
              })
            }
          } else {
            this.$set(this, 'bgWidth', 0)
            this.$set(this, 'bgHeight', 0)
            if (this.scrollGroup && this.scrollBg && this.scrollBk) {
              this.init()
            }
          }
        }
      }
    }
  }
}
</script>

<style lang="scss" >

</style>
