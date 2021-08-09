import { queryAll } from '@/api/base'
export function postMessageAuth (key, callback, value) {
  let id = JSON.parse(localStorage.getItem('empId'))
  queryAll('/basicdata/sysUserCustom/' + key + '/messageAuth/' + id, value || null).then(res => {
    callback(res.data)
  }).catch((e) => {
    console.warn(e)
    callback(null)
  })
}