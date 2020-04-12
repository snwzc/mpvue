<template>
  <div class="wrapper">
    <div class="top">
      <img src="../../../static/images/home/banner1.png" />
    </div>
    <div
      class="bottom"
      style="background-image: url('../../../static/images/home/scanCodeBg.png');background-size: 100% 100%;"
    >
      <div class="scancode" @click="scanCode">
        <img src="../../../static/images/home/scanCode.png" />
      </div>
    </div>

    <!-- <div>
      <button @click="clearstore">token 清理谨慎操作</button>
    </div>-->
  </div>
</template>

<script>
import { login, bindPhone, isSeverOrder, authTest } from '@/api/api'
import { getQueryUrl } from '@/utils/index'
export default {
  data () {
    return {

    }
  },
  created () {
    login()
  },
  methods: {
    // 扫码
    scanCode () {
      // 获取是否绑定手机号
      bindPhone().then(res => {
        if (res.phone) {
          isSeverOrder().then(res => {
            this.selectIsOrder(res)
          }).catch(err => {
            // eslint-disable-next-line eqeqeq
            if (err.code == '400000') {
              authTest((r) => {
                if (r) {
                  this.selectIsOrder(res)
                  console.log(r)
                }
              })
            }
          })
        } else { // 未绑定手机号跳转绑定手机
          mpvue.showToast({
            title: '请先绑定手机号',
            content: '请先绑定手机号',
            icon: 'none',
            duration: 2000
          })

          setTimeout(function () {
            mpvue.navigateTo({
              url: '../bindPhone/main'
            })
          }, 800)
        }
      })
    },
    clearstore () {
      mpvue.clearStorage()
    },
    selectIsOrder (res) {
      if (res.orderNo) { // 跳转获取密码页
        mpvue.navigateTo({
          url: '../charge/main?deviceId=' + res.deviceId + '&orderNo=' + res.orderNo + '&step=' + 2
        })
      } else { // 扫码
        if (mpvuePlatform === 'wx') {
          wx.scanCode({
            onlyFromCamera: true,
            success (res) {
              mpvue.navigateTo({
                url: '../charge/main?deviceId=' + getQueryUrl(res.result, 'deviceId') + '&step=' + 1
              })
            }
          })
        } else if (mpvuePlatform === 'my') {
          my.scan({
            type: 'qr',
            success: (res) => {
              mpvue.navigateTo({
                url: '../charge/main?deviceId=' + getQueryUrl(res.code, 'deviceId') + '&step=' + 1
              })
            }
          })
        }
      }
    }
  }
}
</script>

<style>
.wrapper {
  height: 100%;
}
img {
  width: 100%;
  height: 100%;
}
.top {
  height: 175px;
  margin: 0 16px;
}
.bottom {
  position: absolute;
  bottom: 0;
  width: 100%;
  height: 179px;
}
.scancode {
  width: 156px;
  height: 156px;
  margin: 0 auto;
  padding: 22px 0 0 0;
}
</style>