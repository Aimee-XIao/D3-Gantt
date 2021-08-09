<script>
import { getQueryAll } from '@/api/base'
import _ from 'lodash'
/* global someFunction d3:true */
/* global someFunction domtoimage:true */
export default {
  methods: {
    exportImg () {
      let width = this.$refs.svgBottomData.$el.parentElement.getBoundingClientRect().width + this.yAxis.transStyle.width
      let height = this.$refs.svgBottomData.$el.getBoundingClientRect().height + document.getElementById('xAxisBottom').getBoundingClientRect().height + this.yAxis.top
      let serializer = new XMLSerializer()
      let svg = d3.select(document.body).append('svg')
      svg.attr('id', 'temp-export-image')
        .attr('version', 1.1)
        .attr('xmlns', 'http://www.w3.org/2000/svg')
        .attr('width', width)
        .attr('height', height)
        .style('background-color', '#fff')
      svg.html(this.$refs.svgBottom.innerHTML)
      svg.select('foreignObject')
        .attr('width', width)
        .attr('height', height)
      svg.select('#xAxisBottom').attr('transform', 'matrix(1,0,0,1,0,0)')
      svg.select('#yAxisBottom').attr('transform', 'matrix(1,0,0,1,0,0)')
      domtoimage.toSvg(document.getElementById('temp-export-image')).then(function (dataUrl) {
        let a = document.createElement('a')
        a.download = `${name}.svg`
        a.href = dataUrl
        a.click()
        document.getElementById('temp-export-image') && document.getElementById('temp-export-image').remove()
      })
    },
    /* 工具方法 */
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
    handleSelectList (name, row) {
      if (row) {
        let index = (this[name].tableData.multipleData || []).indexOf(row[this[name].tableData.key])
        if (~index) {
          this[name].tableData.multipleData.splice(index, 1)
        } else {
          this[name].tableData.multipleData.push(row[this[name].tableData.key])
        }
      } else {
        if (this[name].tableData.multipleData.length === this[name].tableData.data.length && this[name].tableData.multipleData.length > 0) {
          this.$set(this[name].tableData, 'multipleData', [])
        } else {
          this.$set(this[name].tableData, 'multipleData', _.map(this[name].tableData.data, this[name].tableData.key))
        }
      }
    },
    clickRow (name, rIndex) {
      if (rIndex === null || _.get(this, name).tableData.selectIndex === rIndex) {
        this.$set(_.get(this, name).tableData, 'selectIndex', -1)
      } else {
        this.$set(_.get(this, name).tableData, 'selectIndex', rIndex)
      }
    },
    upOpt (data, val, key) {
      let i = (data[key] || []).indexOf(val)
      if (i > 0) {
        let arr = _.cloneDeep(data[key])
        this.$set(data, key, [])
        arr.splice(i, 1)
        arr.splice(i - 1, 0, val)
        this.$set(data, key, arr)
      }
    },
    downOpt (data, val, key) {
      let i = (data[key] || []).indexOf(val)
      if (i < ((data[key] || []).length - 1)) {
        let arr = _.cloneDeep(data[key])
        this.$set(data, key, [])
        arr.splice(i, 1)
        arr.splice(i + 1, 0, val)
        this.$set(data, key, arr)
      }
    },
    inputToUpper (obj, key, val) {
      this.$set(obj, key, (val || '').toUpperCase())
    },
    /* 格式化 */
    transformToNum (block, add, flag) {
      let reg = /\([\-0-9.]*,/
      let transform = block.attr('transform')
      let num = Number(reg.exec(transform)[0].replace('(', '').replace(',', '')) || 0
      return transform.replace(num, (flag ? 0 : num) + add)
    },
    formatResource (data, field) {
      let value = _.get(data, field.key) || ''
      let valueI = _.get(data, field.key + 'I') || ''
      let arr = []
      value && arr.push('国内：' + value)
      valueI && arr.push('国际：' + valueI)
      return arr.join('；')
    },
    formatYN (data, field) {
      let value = _.get(data, field.key) || ''
      let arr = value.split('|')
      arr.forEach((str, i) => {
        arr[i] = (str === 'Y') ? ((field.props && field.props.Y) || '是') : ((field.props && field.props.N) || '')
      })
      return arr.join('|')
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
    formatYMDHM (time) {
      if (time) {
        let date
        if (_.isDate(time)) {
          date = new Date(time)
        } else {
          date = new Date(time.substr(0, 10) + ':00:00')
        }
        let hour = date.getHours() < 10 ? `0${date.getHours()}` : date.getHours()
        let minite = date.getMinutes() < 10 ? `0${date.getMinutes()}` : date.getMinutes()
        let dateStr = `${date.getFullYear()}-${this.addZero(date.getMonth() + 1)}-${this.addZero(date.getDate())} ${hour}:${minite}`
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
    formatterWholeMin (value) {
      return value ? value.substr(0, 16).replace('T', ' ') : ''
    },
    formatterMin (value) {
      return value ? value.substr(11, 5).replace('T', ' ') : ''
    },
    addZero (value) {
      if (value < 10) {
        return `0${value}`
      } else {
        return value
      }
    },
    /* 过滤 */
    selectFilterMethod (item, value) {
      let count = 0
      let arr = []
      if (value) {
        _.forEach(item.options, (obj, index) => {
          let result = false
          if (typeof obj === 'object') {
            if (obj['CODE']) {
              let val = obj['CODE'].toString()
              if (val.toUpperCase().includes(value.toUpperCase())) {
                result = true
              }
            }
            if (obj['NAME']) {
              let val = obj['NAME'].toString()
              if (val.toUpperCase().includes(value.toUpperCase())) {
                result = true
              }
            }
          } else {
            let val = obj.toString()
            if (val.toUpperCase().includes(value.toUpperCase())) {
              result = true
            }
          }
          result && arr.push(obj)
        })
      }
      this.$set(item, 'filterOpts', arr)
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
    remoteSelectFocus (item) {
      this.selectFilterMethod(item, '')
    }
  }
}
</script>
