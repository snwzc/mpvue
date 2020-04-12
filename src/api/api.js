import request from '@/utils/request'

// 支付宝 、微信 登录未绑定手机号 时使用openId 替代token

// 登录接口
export function login () {
  // eslint-disable-next-line eqeqeq
  if (mpvuePlatform == 'wx') {
    var openId = mpvue.getStorageSync('openId')
    if (!openId) {
      authTest()
    }
    // eslint-disable-next-line eqeqeq
  } else if (mpvuePlatform == 'my') {
    my.getStorage({
      key: 'openId',
      success: function (res) {
        if (!res.data) { // 未登录
          authTest()
        }
      }
    })
  }
}

function authTest (callback) {
  // 发起网络请求
  var type = 1

  if (mpvuePlatform === 'wx') {
    type = 1
    wx.login({
      success (res) {
        if (res.code) {
          requestLoginApi(res.code, type)
          if (callback) {
            // eslint-disable-next-line standard/no-callback-literal
            callback(true)// 成功回调
          }
        } else {
          console.log('登录失败！' + res.errMsg)
        }
      }
    })
  } else if (mpvuePlatform === 'my') {
    type = 2
    my.getAuthCode({
      scopes: 'auth_user',
      success: (res) => {
        requestLoginApi(res.authCode, type)
        if (callback) {
          // eslint-disable-next-line standard/no-callback-literal
          callback(true)// 成功回调
        }
      }
    })
  }
}

function requestLoginApi (code, type) {
  request({
    url: 'lotteryTicket-service/user/auth',
    params: { code, type }
  }).then(res => {
    // 获取token
    // eslint-disable-next-line eqeqeq
    if (mpvuePlatform == 'wx') {
      wx.setStorageSync('openId', res.openId)
      wx.setStorageSync('token', res.token)
      // eslint-disable-next-line eqeqeq
    } else if (mpvuePlatform == 'my') {
      my.setStorageSync({
        key: 'openId',
        data: res.openId
      })
      my.setStorageSync({
        key: 'token',
        data: res.token
      })
    }
  })
}

// 绑定手机、获取 号
export function bindPhone (params) {
  return request({
    url: 'lotteryTicket-service/user/getPhone',
    params
  })
}
// 查询充电套餐信息
export function queryComboMsg (params) {
  return request({
    url: 'jihu-c/ChargBox/chargHomePage',
    params
  })
}
// 获取支付结果
export function getPayResult (params) {
  return request({
    url: 'jihu-c/ChargBox/getOrder',
    params
  })
}
// 获取密码
export function getLineKey (params) {
  return request({ url: 'jihu-c/ChargBox/boxPassword', params })
}
// 是否服务中
export function isSeverOrder (params) {
  return request({
    url: 'jihu-c/ChargBox/isCharg',
    params
  })
}
// 发送验证
export function sendCode (params) {
  return request({
    url: 'lotteryTicket-service/user/smsCode',
    params
  })
}
// 重置密码
export function resetLineKey (params) {
  return request({ url: 'jihu-c/ChargBox/refPass', params })
}
// 查询充值记录
export function orderList () {
  return request({
    url: 'jihu-c/ChargBox/boxOrder'
  })
}
export {
  authTest
}
