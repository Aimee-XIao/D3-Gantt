// 唯一性校验
// basicTableMixin.vue的methods里定义
/* var unique = (rule, value, callback) => {
  if (value != '') {
    let key = rule.field
    let data = {
      key: value
    }
    postData(this.baseUrl + '/checkExist', data).then(response => {
      if (response.code == 0 && response.data.hasOwnProperty('exist')) {
        if (response.data.exist > 0) {
          callback(new Error('当前编号已存在'))
        }
      } else {
        callback(new Error('请求失败'))
      }
    })
  }
  callback()
} */

// 数字、大写字母或-_/ => 1~20
var idReg = (rule, value, callback) => {
  if (value != '' && value != null) {
    let reg = /^[A-Z0-9-_/]{1,20}$/
    if (!reg.test(value)) {
      callback(new Error('必须由数字、大写字母或-_/组成'))
    } else {
      callback()
    }
  } else {
    callback()
  }
}

// 数字、字母 => *
var maxENReg = (rule, value, callback) => {
  if (value != '' && value != null) {
    let reg = /^[A-Za-z0-9]*$/
    if (!reg.test(value)) {
      callback(new Error('必须由数字或字母组成'))
    } else {
      callback()
    }
  } else {
    callback()
  }
}

// 2位大写字母/数字 => 2
var ndENReg = (rule, value, callback) => {
  if (value != '' && value != null) {
    let reg = /^[A-Z0-9]{2}$/
    if (!reg.test(value)) {
      callback(new Error('必须由2位大写字母或数字'))
    } else {
      callback()
    }
  } else {
    callback()
  }
}

// 3位大写字母/数字 => 3
var rdENReg = (rule, value, callback) => {
  if (value != '' && value != null) {
    let reg = /^[A-Z0-9]{3}$/
    if (!reg.test(value)) {
      callback(new Error('必须由3位大写字母或者数字组成'))
    } else {
      callback()
    }
  } else {
    callback()
  }
}

// 3位大写字母 => 3
var rdEReg = (rule, value, callback) => {
  if (value != '' && value != null) {
    let reg = /^[A-Z]{3}$/
    if (!reg.test(value)) {
      callback(new Error('必须由3位大写字母组成'))
    } else {
      callback()
    }
  } else {
    callback()
  }
}

// 4位大写字母 => 4
var rthEReg = (rule, value, callback) => {
  if (value != '' && value != null) {
    let reg = /^[A-Z]{4}$/
    if (!reg.test(value)) {
      callback(new Error('必须由4位大写字母组成'))
    } else {
      callback()
    }
  } else {
    callback()
  }
}

// 数字 => *
var idNumReg = (rule, value, callback) => {
  if (value != '' && value != null) {
    let reg = /^[0-9]*$/
    if (!reg.test(value)) {
      callback(new Error('必须由纯数字组成'))
    } else {
      callback()
    }
  } else {
    callback()
  }
}

// 数字 => *
var phoneReg = (rule, value, callback) => {
  if (value != '' && value != null) {
    let reg = /^(\d{3}-\d{8}|\d{4}-\d{7,8}|((1[3,5,8][0-9])|(14[1,5,6,7,8])|(16[6,7])|(17[0,1,4,5,6,7,8])|(19[1,7,8,9]))(-)?\d{4}(-)?\d{4})?$/
    if (!reg.test(value)) {
      callback(new Error('该号码格式或位数有误'))
    } else {
      callback()
    }
  } else {
    callback()
  }
}

// ±9999999.99之间 => 1~11
var sevDotTwoDigit = (rule, value, callback) => {
  if (value != '' && value != null) {
    let reg = /^[0-9]{1,7}(\.([0-9]{1,2}))?$/
    if (!reg.test(value)) {
      callback(new Error('必须在0~9999999.99之间'))
    } else {
      callback()
    }
  } else {
    callback()
  }
}

// ±99999.99之间
var fiveDotTwoDigit = (rule, value, callback) => {
  if (value != '' && value != null) {
    let reg = /^-?[0-9]{1,5}(\.([0-9]{1,2}))?$/
    if (!reg.test(value)) {
      callback(new Error('必须在[-99999.99, 99999.99]之间'))
    } else {
      callback()
    }
  } else {
    callback()
  }
}

// 0~9999999.99之间 => 1~13
var sixDotTwoDigit = (rule, value, callback) => {
  if (value != '' && value != null) {
    let reg = /^((\d{1})|([1-9]{1}\d{1,6})){1}(\.\d{1,2})?$/
    if (!reg.test(value)) {
      callback(new Error('必须在[0,9999999.99]之间'))
    } else {
      callback()
    }
  } else {
    callback()
  }
}

// 0~99999.99之间
var fivePositiveDotTwo = (rule, value, callback) => {
  if (value != '' && value != null) {
    if (value == 0) {
      callback(new Error('必须在(0,99999.99]之间'))
    } else {
      let reg = /^((\d{1})|([1-9]{1}\d{1,4})){1}(\.\d{1,2})?$/
      if (!reg.test(value)) {
        callback(new Error('必须在(0,99999.99]之间'))
      } else {
        callback()
      }
    }
  } else {
    callback()
  }
}

// 0~999.99之间
var threeDotTwoDigit = (rule, value, callback) => {
  if (value != '' && value != null) {
    let reg = /^((\d{1})|([1-9]{1}\d{1,2})){1}(\.\d{1,2})?$/
    if (!reg.test(value)) {
      callback(new Error('必须在[0,999.99]之间'))
    } else {
      callback()
    }
  } else {
    callback()
  }
}

// 3位正整数 => 0~3
var threeD = (rule, value, callback) => {
  if (value != '' && value != null) {
    let reg = /^([1-9]\d{0,2})?$/
    if (!reg.test(value)) {
      callback(new Error('必须由0-3位正整数组成'))
    } else {
      callback()
    }
  } else {
    callback()
  }
}

// 5位正整数
var fiveD = (rule, value, callback) => {
  if (value != '' && value != null) {
    let reg = /^([1-9]\d{0,4})?$/
    if (!reg.test(value)) {
      callback(new Error('必须由0-5位正整数组成'))
    } else {
      callback()
    }
  } else {
    callback()
  }
}

// 正整数
var mustD = (rule, value, callback) => {
  if (value != '' && value != null) {
    let reg = /^\d+$/
    if (!reg.test(value)) {
      callback(new Error('必须由正整数组成'))
    } else {
      callback()
    }
  } else {
    callback()
  }
}

// 0~360° => 3
var degreePos = (rule, value, callback) => {
  if (value != '' && value != null) {
    let reg = /^(([0-9]{1})|([1-9]{1}[0-9]{1})|([1-2]{1}[0-9]{2})|([3]{1}[0-5]{1}[0-9]{1})){1}(\.\d{1,4})?$/
    if (!reg.test(value)) {
      callback(new Error('必须在[0°,359.9999°]之间'))
    } else {
      callback()
    }
  } else {
    callback()
  }
}

// 0~360° => 3
var degreePosTwo = (rule, value, callback) => {
  if (value != '' && value != null) {
    let reg = /^((([1-9]\d{0,2})|[0])(.\d{1,2})?)?$/
    if (!reg.test(value)) {
      callback(new Error('必须在[0°,360°]之间且最多保留2位小数'))
    } else {
      let val = Number(value)
      if (val < 0 || val > 360) {
        callback(new Error('必须在[0°,360°]之间且最多保留2位小数'))
      } else {
        callback()
      }
    }
  } else {
    callback()
  }
}

// 0~90° => 3
var slopePosTwo = (rule, value, callback) => {
  if (value != '' && value != null) {
    let reg = /^((([1-9]\d{0,1})|[0])(.\d{1,2})?)?$/
    if (!reg.test(value)) {
      callback(new Error('必须在[0°,90°]之间且最多保留2位小数'))
    } else {
      let val = Number(value)
      if (val < 0 || val > 90) {
        callback(new Error('必须在[0°,90°]之间且最多保留2位小数'))
      } else {
        callback()
      }
    }
  } else {
    callback()
  }
}

// 位数在6-8位 => 6-8
var passwordReg = (rule, value, callback) => {
  if (value != '' && value != null) {
    let reg = /^.{6,8}$/
    if (!reg.test(value)) {
      callback(new Error('必须输入6-8位字符'))
    } else {
      callback()
    }
  } else {
    callback()
  }
}

var loginPasswordReg = (rule, value, callback) => {
  if (value != '' && value != null) {
    let reg = /^(?=.*\d)(?=.*[a-zA-Z])[\da-zA-Z]{8,}$/
    if (!reg.test(value)) {
      callback(new Error('字母加数字，最少不能低于8个字符'))
    } else {
      callback()
    }
  } else {
    callback()
  }
}

// 数字 => 0~6
var sixNum = (rule, value, callback) => {
  if (value != '' && value != null) {
    let reg = /^[0-9]{0,6}$/
    if (!reg.test(value)) {
      callback(new Error('必须由0-6位纯数字组成'))
    } else {
      callback()
    }
  } else {
    callback()
  }
}

// 数字 => 1~9
var nineNum = (rule, value, callback) => {
  if (value != '' && value != null) {
    let reg = /^[0-9]{1,9}$/
    if (!reg.test(value)) {
      callback(new Error('必须由1-9位纯数字组成'))
    } else {
      callback()
    }
  } else {
    callback()
  }
}

// 整数
var intNum = (rule, value, callback) => {
  if (value != '' && value != null) {
    let reg = /^\d+$/
    if (!reg.test(value)) {
      callback(new Error('必须为整数'))
    } else {
      callback()
    }
  } else {
    callback()
  }
}

// 保留两位小数
var twoDecimal = (rule, value, callback) => {
  if (value != '' && value != null) {
    let reg = /^(([1-9]{1}\d*)|(0{1}))(\.\d{1,2})?$/
    if (!reg.test(value)) {
      callback(new Error('必须为正数且最多保留两位小数'))
    } else {
      callback()
    }
  } else {
    callback()
  }
}

// 保留两位小数 => ±
var twoDecimalAll = (rule, value, callback) => {
  if (value != '' && value != null) {
    let reg = /^-?(([1-9]{1}\d*)|(0{1}))(\.\d{1,2})?$/
    if (!reg.test(value)) {
      callback(new Error('最多保留两位小数'))
    } else {
      callback()
    }
  } else {
    callback()
  }
}

var IPReg = (rule, value, callback) => {
  if (value != '' && value != null) {
    let reg = /^(((25[0-5]|2[0-4]\d|((1\d{2})|([1-9]?\d)))\.){3}(25[0-5]|2[0-4]\d|((1\d{2})|([1-9]?\d))))?$/
    if (!reg.test(value)) {
      callback(new Error('IP地址格式不对'))
    } else {
      callback()
    }
  } else {
    callback()
  }
}

var IdCardReg = (rule, value, callback) => {
  if (value != '' && value != null) {
    let reg = /(^\d{8}(0\d|10|11|12)(0[1-9]|[1-2]\d|30|31)\d{3}$)|(^\d{6}(18|19|20)\d{2}(0\d|10|11|12)(0[1-9]|[1-2]\d|30|31)\d{3}(\d|X|x)$)/
    if (!reg.test(value)) {
      callback(new Error('身份证格式不对'))
    } else {
      callback()
    }
  } else {
    callback()
  }
}

// 正整数
var portReg = (rule, value, callback) => {
  if (value != '' && value != null) {
    let reg = /^[+]{0,1}(\d+)$/
    if (!reg.test(value)) {
      callback(new Error('端口号为正整数'))
    } else {
      callback()
    }
  } else {
    callback()
  }
}

// 中文
var chReg = (rule, value, callback) => {
  if (value != '' && value != null) {
    let reg = /^[\u4e00-\u9fa5]$/
    if (!reg.test(value)) {
      callback(new Error('必须为中文字符'))
    } else {
      callback()
    }
  } else {
    callback()
  }
}

// 中文
var flightNumReg = (rule, value, callback) => {
  if (value != '' && value != null) {
    let reg = /^[0-9]{3,4}[a-zA-Z]?$/
    if (!reg.test(value)) {
      callback(new Error('必须为3~4位数字加0~1位字母'))
    } else {
      callback()
    }
  } else {
    callback()
  }
}

// 邮箱验证
var emailReg = (rule, value, callback) => {
  if (value != '' && value != null) {
    // let reg = /^[a-z0-9]+([._\\-]*[a-z0-9])*@([a-z0-9]+[-a-z0-9]*[a-z0-9]+.){1,63}[a-z0-9]+$/
    // 不能以0字开；@ ；@后必须是数字与字母组成，长度为2-10位；结尾一组，字母长度为2-4位；.字母，最少一组，最多三组
    let reg = /^\w+@[a-zA-Z0-9]{2,10}(?:\.[a-z]{2,4}){1,3}$/
    if (!reg.test(value)) {
      callback(new Error('邮箱格式不正确'))
    } else {
      callback()
    }
  } else {
    callback()
  }
}

// [0, 1]，小数点后六位小数
var percentReg = (rule, value, callback) => {
  if (value != '' && value != null) {
    let reg = /^(([1]{1}\d*)|(0{1}))(\.\d{1,2})?$/
    if (value > 1) {
      callback(new Error('必须在[0,1]之间且最多保留2位小数'))
    } else {
      if (!reg.test(value)) {
        callback(new Error('必须在[0,1]之间且最多保留2位小数'))
      } else {
        callback()
      }
    }
  } else {
    callback()
  }
}

export { idReg, maxENReg, ndENReg, rdENReg, rdEReg, rthEReg, idNumReg, phoneReg, sevDotTwoDigit, fiveDotTwoDigit, sixDotTwoDigit, fivePositiveDotTwo, threeDotTwoDigit, threeD, fiveD, mustD, degreePos, degreePosTwo, slopePosTwo, passwordReg, loginPasswordReg, sixNum, nineNum, intNum, twoDecimal, twoDecimalAll, IPReg, IdCardReg, portReg, chReg, flightNumReg, emailReg, percentReg }
