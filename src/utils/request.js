import { authTest } from '../api/api'

export default function request (data) {
  return new Promise((resolve, reject) => {
    var params = data.params || {}

    // 区分小程序
    var openId
    var token
    if (mpvuePlatform === 'wx') {
      try {
        openId = wx.getStorageSync('openId')
        token = wx.getStorageSync('token')
      } catch (e) { }
    } else if (mpvuePlatform === 'my') {
      openId = my.getStorageSync({ key: 'openId' }).data
      token = my.getStorageSync({ key: 'token' }).data
    }
    if (openId) {
      params.openId = openId
      params.token = token
    }

    if (!params.type) {
      if (mpvuePlatform === 'wx') {
        params.type = '1'// 微信类型
      } else if (mpvuePlatform === 'my') {
        params.type = '2'// 支付宝类型
      }
    }
    mpvue.showLoading({
      title: '加载中...',
      mask: true,
      content: '加载中...'
    })
    // 请求
    mpvue.request({
      url: process.env.API_HOST + data.url || '',
      data: params,
      header: data.header || {},
      method: data.method || 'get',
      dataType: data.dataType || 'json',
      success (res) {
        mpvue.hideLoading()
        // eslint-disable-next-line eqeqeq
        if (res.data.code == '0') {
          resolve(res.data.body)
          // eslint-disable-next-line eqeqeq
        } else if (res.data.code == '300000') { // 错误单独处理
          // eslint-disable-next-line eqeqeq
          reject(res.data)
          mpvue.showToast({ title: res.data.msg, content: res.data.msg, duration: 2000, icon: 'none' })
          // eslint-disable-next-line eqeqeq
        } else if (res.data.code == '400000' || res.data.code == '421000') { // 查询订单未授权错误单独处理
          reject(res.data)
          // eslint-disable-next-line eqeqeq
        } else if (res.data.code == '430000' || res.data.code == '200000') { // 未授权错误单独处理
          mpvue.showToast({ title: '登录超时,已从新登录.', content: '登录超时,已从新登录.', duration: 2000, icon: 'none' })
          authTest()
        } else {
          // 微信 400 错误处理
          // eslint-disable-next-line eqeqeq
          if (res.statusCode == 400) {
            authTest()
            mpvue.showToast({ title: '登录超时,已从新登录.', content: '登录超时,已从新登录.', duration: 2000, icon: 'none' })
          } else {
            mpvue.showToast({ title: res.data.msg || '稍后重试!', content: res.data.msg || '稍后重试!', duration: 2000, icon: 'none' })
          }
        }
      },
      fail (err) {
        // 支付宝 400 错误处理
        mpvue.hideLoading()
        // eslint-disable-next-line eqeqeq
        if (err.status == 400) {
          mpvue.showToast({ title: '登录超时,已从新登录.', content: '登录超时,已从新登录.', duration: 2000, icon: 'none' })
          authTest()
        } else {
          mpvue.showToast({ title: '稍后再试', content: '稍后再试', duration: 2000, icon: 'none' })
        }
      }
    })
  })
}
