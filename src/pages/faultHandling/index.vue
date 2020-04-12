<template>
  <div class="wrapper">
    <div class="pic" @click="resetLineKey">
      <img src="http://p2a60yqmm.bkt.clouddn.com/wxapp/imagesfaultHanding01.png" />
    </div>
    <!-- <div class="pic">
      <img src="http://p2a60yqmm.bkt.clouddn.com/wxapp/imagesfaultHanding02.png" />
    </div>-->
  </div>
</template>

<script>
import { resetLineKey } from '@/api/api'
export default {
  name: '',
  data () {
    return {
      orderNo: '',
      deviceId: ''
    }
  },
  methods: {
    resetLineKey () {
      let that = this
      if (mpvuePlatform === 'wx') {
        //   使用strorage 储存是否重新获取密码状态
        wx.showModal({
          title: '提示',
          content: '确定要重置吗?',
          success (res) {
            if (res.confirm) {
              // eslint-disable-next-line one-var
              that.resetReq()
            }
          }
        })
      } else if (mpvuePlatform === 'my') {
        my.confirm({
          title: '提示',
          content: '确定要重置吗',
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          success: (result) => {
            that.resetReq()
          }
        })
      }
    },
    resetReq () {
      let that = this
      // eslint-disable-next-line one-var
      let orderNo = that.orderNo, deviceId = that.deviceId
      resetLineKey({ orderNo, deviceId }).then(res => {
        // eslint-disable-next-line eqeqeq
        if (mpvuePlatform == 'wx') {
          wx.setStorage({
            key: 'resetLineKey',
            data: 'true'
          })
          // eslint-disable-next-line eqeqeq
        } else if (mpvuePlatform == 'my') {
          my.setStorageSync({
            key: 'resetLineKey',
            data: 'true'
          })
        }
        mpvue.navigateBack()
      })
    }
  },
  onLoad (options) {
    this.orderNo = options.orderNo
    this.deviceId = options.deviceId
  }
}
</script>

<style lang="" scoped>
img {
  width: 100%;
  height: 205px;
}
</style>