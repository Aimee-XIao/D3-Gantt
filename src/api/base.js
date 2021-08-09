import Vue from 'vue'

var vue = new Vue({})

export function queryPageDataList (url, data) {
  return vue.axios({
    url: url,
    method: 'post',
    data: {
      pageNum: data.pageNum,
      pageSize: data.pageSize,
      data: data.data
    }
  })
}

export function queryAiisPageDataList (url, data) {
  return vue.axiosAiis({
    url: url,
    method: 'post',
    data: {
      pageNum: data.pageNum,
      pageSize: data.pageSize,
      data: data.data
    }
  })
}
export function queryMqttPageDataList (url, data) {
  return vue.axiosMqtt({
    url: url,
    method: 'post',
    data: {
      pageNum: data.pageNum,
      pageSize: data.pageSize,
      data: data.data
    }
  })
}

export function getQueryAll (url, data) {
  return vue.axios({
    url: url,
    method: 'get',
    data: data
  })
}

export function getBufferQueryAll (url, data) {
  return vue.axios({
    url: url,
    method: 'get',
    data: data,
    responseType: 'arraybuffer'
  })
}

export function getQueryAllMqtt (url, data) {
  return vue.axiosMqtt({
    url: url,
    method: 'get',
    data: data
  })
}

export function postDataEndPage (urls, datas) {
  let arr = []
  urls.forEach((url, index) => {
    if (index == urls.length - 1) {
      arr.push(queryPageDataList(url, datas[index]))
    } else {
      arr.push(postData(url, datas[index]))
    }
  })
  return vue.axios.all(arr)
}

export function postAllData (urls, datas) {
  let arr = []
  urls.forEach((url, index) => {
    arr.push(postData(url, datas[index]))
  })
  return vue.axios.all(arr)
}

export function postAllAiisData (urls, datas) {
  let arr = []
  urls.forEach((url, index) => {
    arr.push(postAiisData(url, datas[index]))
  })
  return vue.axiosAiis.all(arr)
}

export function postAllMqttData (urls, datas) {
  let arr = []
  urls.forEach((url, index) => {
    arr.push(postMqttData(url, datas[index]))
  })
  return vue.axiosMqtt.all(arr)
}

export function postData (url, data) {
  return vue.axios({
    url: url,
    method: 'post',
    data: data
  })
}

export function postAiisData (url, data) {
  return vue.axiosAiis({
    url: url,
    method: 'post',
    data: data
  })
}

export function postMqttData (url, data) {
  return vue.axiosMqtt({
    url: url,
    method: 'post',
    data: data
  })
}

export function postDataNone (url, data) {
  return vue.axiosNone({
    url: url,
    method: 'post',
    data: data
  })
}

export function postDataOther (url, data) {
  return vue.axiosOther({
    url: url,
    method: 'post',
    data: data
  })
}

export function download (url, data, pageSize) {
  return vue.axios({
    url: url,
    method: 'post',
    responseType: 'blob',
    data: pageSize ? {
      data: data,
      pageSize: pageSize,
      pageNum: 1
    } : data
  })
}

export function downloadAiis (url, data, pageSize) {
  return vue.axiosAiis({
    url: url,
    method: 'post',
    responseType: 'blob',
    data: pageSize ? {
      data: data,
      pageSize: pageSize,
      pageNum: 1
    } : data
  })
}

export function downloadFile (url) {
  return vue.axios({
    url: url,
    method: 'get',
    responseType: 'blob'
  })
}

export function queryAll (url, data) {
  return vue.axios({
    url: url,
    method: 'post',
    data: data || {}
  })
}

export function queryAllAiis (url, data) {
  return vue.axiosAiis({
    url: url,
    method: 'post',
    data: data || {}
  })
}

export function queryAllStat (url, data) {
  return vue.axiosStat({
    url: url,
    method: 'post',
    data: data || {}
  })
}

export function dfsPost (url, data, callback) {
  return vue.dfs({
    url: url,
    method: 'post',
    data: data,
    onUploadProgress: progressEvent => {
      let complete = (progressEvent.loaded / progressEvent.total * 100 || 0)
      callback(complete)
      /* console.log(complete) // 进度值
      this.onprogress = complete */
    }
  })
}

export function upload (url, data) {
  return vue.axiosUpload({
    url: url,
    method: 'post',
    data: data
    // data: data,
    // onUploadProgress: progressEvent => {
    //   var complete = (progressEvent.loaded / progressEvent.total * 100 | 0)
    //   callback(complete)
    //   /* console.log(complete) // 进度值
    //   this.onprogress = complete */
    // }
  })
}

export function uploadAiis (url, data) {
  return vue.axiosUploadAiis({
    url: url,
    method: 'post',
    data: data
    // data: data,
    // onUploadProgress: progressEvent => {
    //   var complete = (progressEvent.loaded / progressEvent.total * 100 | 0)
    //   callback(complete)
    //   /* console.log(complete) // 进度值
    //   this.onprogress = complete */
    // }
  })
}

export function queryClassifyType () {
  postData('basicdata/classifyCode/queryAllClassify', null).then(response => {
    return response.data.data
  })
}

export function queryAllClassify () {
  postData('basicdata/classifyCode/queryAll', {}).then(response => {
    return response.data.data
  })
}
