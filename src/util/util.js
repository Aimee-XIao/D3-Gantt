// import JsPDF from 'jspdf'
import _ from 'lodash'

export function compareNum (prop) {
  return function (obj1, obj2) {
    var val1 = obj1[prop]
    var val2 = obj2[prop]
    if (val1 < val2) {
      return -1
    } else if (val1 > val2) {
      return 1
    } else {
      return 0
    }
  }
}

// 数组排序方式
export function compareSort (sortKey, sortMeth) {
  if (sortMeth == 'asc') {
    return function (a, b) {
      var value1 = a[sortKey]
      var value2 = b[sortKey]
      return value1 - value2
    }
  } else {
    return function (a, b) {
      var value1 = a[sortKey]
      var value2 = b[sortKey]
      return value2 - value1
    }
  }
}

// 深度平铺MAP
export function flattenDeep (arr, tmpArr, pNode, childKey) {
  childKey = childKey || 'children'
  for (let i = 0; i < arr.length; i++) {
    if (arr[i].hasOwnProperty(childKey) && (arr[i][childKey] != null) && (arr[i][childKey].length > 0)) {
      let obj = JSON.parse(JSON.stringify(arr[i]))
      obj.pNode = pNode || null
      delete obj[childKey]
      tmpArr.push(obj)
      flattenDeep(arr[i][childKey], tmpArr, arr[i], childKey)
    } else {
      let obj = JSON.parse(JSON.stringify(arr[i]))
      obj.pNode = pNode || null
      tmpArr.push(obj)
    }
  }
}

// 深度查找对象
export function findDeepObj ({arr, key, value, childKey}) {
  for (let i = 0; i < arr.length; i++) {
    if (arr[i][key] === value) {
      return arr[i]
    } else if (arr[i][childKey]) {
      let obj = findDeepObj({arr: (arr[i][childKey] || []), key, value, childKey})
      if (obj) {
        return obj
      }
    }
  }
  return null
}

export function exportPDF (echarts, titles, arrs, widths, fileName, groupSize, direct) {
  // groupSize = groupSize || 24
  // fileName = fileName || '统计数据导出'
  // var doc
  // if (echarts) {
  //   // a4纸的尺寸[595.28,841.89]
  //   let opts = {
  //     type: 'png',
  //     // dark
  //     // backgroundColor: 'rgba(8, 29, 45, 0.96)',
  //     // light
  //     backgroundColor: 'rgb(255, 255, 255)',
  //     excludeComponents: ['toolbox']
  //   }
  //   if (_.isArray(echarts)) {
  //     echarts.forEach(echart => {
  //       let img = echart.getConnectedDataURL(opts)
  //       doc = new JsPDF({
  //         orientation: 'l',
  //         width: 595,
  //         height: 842
  //       })
  //       doc.addImage(img, 'png', 12, 30, 273, 150)
  //       doc.addPage('a4', direct || 'p')
  //     })
  //   } else {
  //     let img = echarts.getConnectedDataURL(opts)
  //     doc = new JsPDF({
  //       orientation: 'l',
  //       width: 595,
  //       height: 842
  //     })
  //     doc.addImage(img, 'png', 12, 30, 273, 150)
  //     doc.addPage('a4', direct || 'p')
  //   }
  // } else {
  //   doc = new JsPDF({
  //     orientation: direct || 'p',
  //     width: 595,
  //     height: 842
  //   })
  // }
  // let tmpFlts = JSON.parse(JSON.stringify(arrs[0]))
  // tmpFlts.unshift(titles[0])
  // let datas = _.chunk(tmpFlts, groupSize)
  // let element = []
  // datas.forEach((data, x) => {
  //   element.push(document.createElement('div'))
  //   element[x].className = 'export-view'
  // })
  // datas.forEach((data, x) => {
  //   let html = `
  //   <table class="echarts-table" border="1" cellpadding="0" cellspacing="0">
  //     <tbody>`
  //   let index = x * groupSize - 1
  //   data.forEach((item, i) => {
  //     html += `<tr>`
  //     titles.forEach((title, j) => {
  //       html += `<td scss="width: ${widths[j]}px;">${!x && !i ? titles[j] : arrs[j][index + i]}</td>`
  //     })
  //     html += `</tr>`
  //   })
  //   html += `
  //     </tbody>
  //   </table>`
  //   element[x].insertAdjacentHTML('beforeend', html)
  //   document.body.appendChild(element[x])
  //   var options = {
  //       pagesplit: false // 不分页
  //   }
  //   doc.addHTML(element[x], 12, 15, options, function () {
  //     if (x < datas.length - 1) {
  //       doc.addPage('a4', direct || 'p')
  //     } else {
  //       doc.save(fileName + '.pdf')
  //     }
  //   })
  // })
}

export function hexify (color) {
  var values = color
    .replace(/rgba?\(/, '')
    .replace(/\)/, '')
    .replace(/[\s+]/g, '')
    .split(',')
    let a = parseFloat(values[3] || 1)
    let r = Math.floor(a * parseInt(values[0]) + (1 - a) * 255)
    let g = Math.floor(a * parseInt(values[1]) + (1 - a) * 255)
    let b = Math.floor(a * parseInt(values[2]) + (1 - a) * 255)
  return '#' +
    ('0' + r.toString(16)).slice(-2) +
    ('0' + g.toString(16)).slice(-2) +
    ('0' + b.toString(16)).slice(-2)
}

export function objKeySort (arys) {
  var newkey = Object.keys(arys).sort()
  var newObj = {}
  for (var i = 0; i < newkey.length; i++) {
      newObj[newkey[i]] = arys[newkey[i]]
  }
  return newObj
}

export function rangeArray (start, end) {
  // Array(end - start + 1).fill(0).map((v, i) => i + start) // es6
  return Array.apply(null, {length: end - start + 1}).map((v, i) => i + start) // es5
}

// 生成从minNum到maxNum的随机数
export function randomNum (minNum, maxNum) {
  switch (arguments.length) {
    case 1:
      return parseInt(Math.random() * minNum + 1, 10)
    case 2:
      return parseInt(Math.random() * (maxNum - minNum + 1) + minNum, 10)
    default:
      return 0
  }
}

export function filterTree (arr, value, child, filterKeys, flag) {
  let tree
  if (flag) {
    tree = arr
  } else {
    tree = _.cloneDeep(arr)
  }
  if (value) {
    for (let j = 0; j < tree.length; j++) {
      let node = tree[j]
      let result = false
      for (let i = 0; i < filterKeys.length; i++) {
        if (typeof node[filterKeys[i]] === 'number') {
          if (node[filterKeys[i]] === Number(value)) {
            result = true
            break
          }
        } else if (typeof node[filterKeys[i]] === 'string') {
          if (~node[filterKeys[i]].indexOf(value)) {
            result = true
            break
          }
        }
      }
      if (node.hasOwnProperty(child) && node[child] && node[child].length > 0) {
        let arrChild = filterTree(node[child], value, child, filterKeys, true)
        if (arrChild.length === 0) {
          delete node[child]
          if (!result) {
            tree.splice(j, 1)
            j--
          }
        }
      } else {
        if (!result) {
          tree.splice(j, 1)
          j--
        }
      }
    }
  }
  return tree
}

export function randomStr () {
  return Math.random().toString(36).substr(2, 15)
}

export function createGuid () {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
    let r = Math.random() * 16 | 0
    let v = c == 'x' ? r : (r & 0x3 | 0x8)
    return v.toString(16)
  })
}

/* export function replaceIdLRBrackets (str) {
  return (str || '').replace(/\(/g, '.').replace(/\)/g, '.')
}

export function unReplaceIdLRBrackets (str) {
  return (str || '').replace(/\./g, '(').replace(/\./g, ')')
} */

export function selectIdByCssFilter (str) {
  // let s = (str || '').replace(/\(/g, '.').replace(/\)/g, '.')
  let s = str
  return `*[id="${s.replace('#', '')}"]`
}

/*
 * @param {string} key: 属性名
 * @param {Array} referArr: 参照数组
 * @use sortArr.sort(sortArrByArr(key, referArr))
*/
export function sortArrByArr (key, referArr) {
  let arr = referArr
  if (key && (referArr || []).length && typeof referArr[0] === 'object') {
    arr = _.map(referArr, key)
  }
  return (prev, next) => {
    return arr.indexOf(key ? prev[key] : prev) - arr.indexOf(key ? next[key] : next)
  }
}
