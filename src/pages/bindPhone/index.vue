<template>
  <div class="wrapper">
    <div class="weui-cells weui-cells_form">
      <div class="weui-cell">
        <div class="weui-cell__hd">
          <label class="weui-label">绑定手机号</label>
        </div>
        <div class="weui-cell__bd">
          <input
            class="weui-input"
            type="number"
            placeholder="请输入手机号"
            v-model="phone"
            maxlength="11"
            placeholder-style="font-size: 16px "
          />
        </div>
      </div>
      <div class="weui-cell weui-cell_vcode">
        <div class="weui-cell__hd">
          <label class="weui-label">验证码</label>
        </div>
        <div class="weui-cell__bd">
          <input
            class="weui-input"
            type="number"
            placeholder="请输入验证码"
            placeholder-style="font-size: 16px "
            maxlength="6"
            v-model="code"
          />
        </div>
        <div class="weui-cell__ft">
          <a class="weui-vcode-btn" v-if="codeSwitch==true" @click="sendCode">获取验证码</a>
          <a class="weui-vcode-btn" v-if="codeSwitch==false">{{downTimeText}}</a>
        </div>
      </div>
    </div>

    <!--  -->
    <div style="margin:20px 10px;font-size:14px">
      <button class="app-color" bindtap="primary" @click="bindPhone">确认绑定</button>
    </div>
  </div>
</template>

<script>
import { bindPhone, sendCode } from '@/api/api'
export default {
  data () {
    return {
      phone: '',
      code: '',
      downTimeText: '获取验证码',
      time: 60,
      codeSwitch: true,
      timer: null
    }
  },
  methods: {
    //   绑定手机号
    bindPhone () {
      // eslint-disable-next-line one-var
      var code = this.code, phone = this.phone
      // eslint-disable-next-line eqeqeq
      if (this.codeSwitch) {
        mpvue.showToast({
          title: '请先获取验证码',
          content: '请先获取验证码',
          icon: 'none',
          duration: 2000
        })
        return false
      }
      if (!code) {
        mpvue.showToast({
          title: '验证码不能为空',
          content: '验证码不能为空',
          icon: 'none',
          duration: 2000
        })
        return false
      }

      bindPhone({ phone, code }).then(res => {
        // eslint-disable-next-line eqeqeq
        if (!res.code) {
          mpvue.showToast({
            title: '绑定成功',
            content: '绑定成功',
            duration: 2000
          })
          if (mpvuePlatform === 'wx') {
            wx.setStorageSync('openId', res.openId)
            wx.setStorageSync('token', res.token)
          } else if (mpvuePlatform === 'my') {
            my.setStorageSync({
              key: 'openId',
              data: res.openId
            })
            my.setStorageSync({
              key: 'token',
              data: res.token
            })
          }
          setTimeout(() => {
            mpvue.navigateBack()
          }, 500)
        }
      })
    },
    // 获取验证码
    sendCode () {
      var phone = this.phone
      if (!this.codeSwitch) {
        return false
      }
      // eslint-disable-next-line eqeqeq
      if (phone == '') {
        mpvue.showToast({
          title: '手机号不能为空',
          content: '手机号不能为空',
          icon: 'none',
          duration: 2000
        })
        return false
      }
      if (!(/^1[3456789]\d{9}$/.test(phone))) {
        mpvue.showToast({
          title: '手机号格式不正确',
          content: '手机号格式不正确',
          icon: 'none',
          duration: 2000
        })
        return false
      }

      sendCode({ phone: this.phone }).then(res => {
        this.codeSwitch = false
        clearInterval(this.timer)
        this.timeDown()
        mpvue.showToast({
          title: '验证码发送成功',
          content: '验证码发送成功',
          icon: 'success',
          duration: 2000
        })
      })
    },
    // 倒计时60s
    timeDown () {
      let time = this.time

      this.timer = setInterval(() => {
        if (time <= 0) {
          clearInterval(this.timer)
          time = 60
          this.codeSwitch = true
          this.downTimeText = '获取验证码'
        } else {
          time -= 1
          this.downTimeText = time + 'S'
        }
      }, 1000)
    }
  },
  onUnload () {
    // 页面被关闭
    this.phone = ''
    this.code = ''
    this.time = 60
    this.codeSwitch = true
    clearInterval(this.timer)
  }

}
</script>

<style lang="" scoped>
button {
  color: #fff;
}
.weui-input {
  padding: 0 10px;
}
</style>