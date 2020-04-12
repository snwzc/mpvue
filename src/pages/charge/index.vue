<template>
  <div class="wrapper">
    <div class="step1" v-if="step==1">
      <div class="weui-flex">
        <div
          v-for="(item,index) in list"
          :key="index"
          class="weui-flex__item"
          @click="itemClick(item.id)"
        >
          <div class="item_box">
            <div :class="[activeId==item.id?'item_top active_item_bg':'item_top']">
              <span class="time">{{item.idea}}</span> 小时
            </div>
            <div class="item_bottom">{{item.cost}} 元</div>
          </div>
        </div>
      </div>
      <!-- 付款按钮 -->
      <div class="btn_group">
        <div class="btn" @click="pay">立即支付</div>
        <div :class="[freeNum<=0?'btn btn_disabled':'btn']" @click="free">免费充电</div>
        <div class="msg">
          您还有
          <span style="color:red">{{freeNum}}</span> 次免费充电的机会
        </div>
      </div>
    </div>
    <!--  -->
    <div class="step2" v-if="step==2">
      <div class="time_down">{{downtext}}</div>
      <div class="msg_text1">剩余时间</div>
      <div class="msg_text2">在设备上输入下列密码，即开始充电</div>
      <div class="code">{{lineKey}}</div>
      <!--  -->
      <div class="help" @click="goHelp">设备故障?</div>
    </div>
    <!--  -->
    <div class="step3" v-if="step==3">
      设备未激活,请联系老板
      <br />更换设备
    </div>
    <!--  -->
    <div class="use-record" @click="useRecord">使用记录 ></div>
  </div>
</template>

<script>
import { TimeDown } from '@/utils/index'
import { queryComboMsg, getPayResult, getLineKey } from '@/api/api'
export default {
  data () {
    return {
      step: 2, // 步骤
      timer: '',
      activeId: 0, // 选中ID
      list: [], // 套餐列表
      downtext: '00:00:00', // 倒计时
      ssDown: 3600000, // 剩余毫秒
      freeNum: 1, // 剩余充电次数
      orderNo: '', // 单号
      deviceId: '',
      lineKey: '00000' // 密码
    }
  },
  methods: {
    itemClick (idx) {
      this.activeId = idx
    },
    // 免费充电
    free () {
      mpvue.showLoading({
        title: '加载中...',
        mask: true,
        content: '加载中...'
      })
      var that = this
      // eslint-disable-next-line eqeqeq
      if (that.freeNum <= 0) {
        mpvue.showToast({
          title: '每天只能使用1次免费充电哦',
          content: '每天只能使用1次免费充电哦',
          icon: 'none',
          duration: 2000
        })
      } else {
        if (mpvuePlatform === 'wx') {
          wx.showModal({
            content: '是否使用免费充电机会',
            confirmText: '确定',
            cancelText: '取消',
            success: function (res) {
              if (res.confirm) {
                that.getPayResult(3)
              }
            },
            complete () {
              mpvue.hideLoading()
            }
          })
        } else if (mpvuePlatform === 'my') {
          my.confirm({
            title: '提示',
            content: '是否使用免费充电机会',
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            success: (result) => {
              if (result.confirm) {
                that.getPayResult(3)
              }
            },
            complete () {
              mpvue.hideLoading()
            }
          })
        }
      }
    },
    // 倒计时
    timeDown () {
      this.downtext = TimeDown(this.ssDown)
      this.timer = setInterval(() => {
        this.ssDown -= 1000
        if (this.ssDown < 0) {
          clearInterval(this.timer)
          this.step = 1
        } else {
          this.downtext = TimeDown(this.ssDown)
        }
      }, 1000)
    },
    // 支付
    getPayResult (type) {
      // type 4 微信小程序  3免费  5 支付宝小程序
      // eslint-disable-next-line one-var
      var ideaId = this.activeId, deviceId = this.deviceId
      let that = this
      getPayResult({ ideaId, deviceId, type }).then(res => {
        that.orderNo = res.orderNo

        // eslint-disable-next-line eqeqeq
        if (type == 4) {
          wx.requestPayment({
            timeStamp: res.timeStamp,
            nonceStr: res.nonceStr,
            package: res.package,
            signType: res.signType,
            paySign: res.sign,
            success (res) {
              that.getLineKey()
            },
            fail (err) {
              console.log(err)
            }
          })
          // eslint-disable-next-line eqeqeq
        } else if (type == 3) {
          that.getLineKey()
          // eslint-disable-next-line eqeqeq
        } else if (type == 5) {
          that.orderNo = res.outtradeNo
          my.tradePay({
            tradeNO: res.tradeNo,
            success: (res) => {
              // eslint-disable-next-line eqeqeq
              if (res.resultCode == 9000) {
                that.getLineKey()
              }
            }
          })
        }
      }).catch(err => {
        mpvue.showToast({
          title: err.msg,
          content: err.msg,
          icon: 'none',
          duration: 2000
        })
        return false
      })
    },
    pay () {
      // 立即支付
      var type = ''
      if (mpvuePlatform === 'wx') {
        type = 4
      } else if (mpvuePlatform === 'my') {
        type = 5
      }
      this.getPayResult(type)
    },
    // 获取密码
    getLineKey () {
      // eslint-disable-next-line one-var
      var deviceId = this.deviceId, lineKey = '', orderNo = this.orderNo

      getLineKey({ deviceId, orderNo }).then(res => {
        // eslint-disable-next-line one-var
        let endTime = res.endTime, list = res.activeCode
        for (let key in list) {
          lineKey += list[key].word
        }
        this.lineKey = lineKey
        this.ssDown = endTime * 1000 - Date.parse(new Date())
        this.step = 2
        this.timeDown()

        if (mpvuePlatform === 'wx') {
          wx.setStorage({
            key: 'resetLineKey',
            data: 'false'
          })
        } else if (mpvuePlatform === 'my') {
          my.setStorageSync({
            key: 'resetLineKey',
            data: 'false'
          })
        }
      })
    },
    goHelp () {
      mpvue.navigateTo({ url: '../faultHandling/main?deviceId=' + this.deviceId + '&orderNo=' + this.orderNo })
    },
    // 使用记录
    useRecord () {
      mpvue.navigateTo({ url: '../chargeOrderList/main' })
    }
  },
  onLoad: function (options) {
    clearInterval(this.timer)
    // eslint-disable-next-line one-var
    var deviceId = this.deviceId = options.deviceId, step = this.step = options.step

    this.orderNo = options.orderNo

    // eslint-disable-next-line eqeqeq
    if (step == 1) { // 获取套餐
      let token

      if (mpvuePlatform === 'wx') {
        token = wx.getStorageSync('openId')
      } else if (mpvuePlatform === 'my') {
        my.getStorage({
          key: 'openId',
          success: function (res) {
            token = res.data
          }
        })
      }
      queryComboMsg({ token, deviceId }).then(res => {
        var list = res.entrys
        for (let i = 0; i < list.length; i++) {
          // eslint-disable-next-line eqeqeq
          this.activeId = i == 0 ? list[0].id : ''
          list[i].idea = list[i].idea.replace(/[^0-9]/ig, '')
        }
        this.list = list
        this.freeNum = res.free
      }).catch(() => {
        this.step = 3
      })
      // eslint-disable-next-line eqeqeq
    } else if (step == 2) { // 获取订单密码
      this.getLineKey()
    }
  },
  onShow () {
    let that = this
    //   使用Storage 储存是否重新获取密码
    if (mpvuePlatform === 'wx') {
      wx.getStorage({
        key: 'resetLineKey',
        success (res) {
          // eslint-disable-next-line eqeqeq
          if (res.data == 'true') {
            clearInterval(that.timer)
            that.getLineKey()
          }
        }
      })
    } else if (mpvuePlatform === 'my') {
      my.getStorage({
        key: 'resetLineKey',
        success: function (res) {
          // eslint-disable-next-line eqeqeq
          if (res.data == 'true') {
            clearInterval(that.timer)
            that.getLineKey()
          }
        }
      })
    }
  }
}
</script>

<style scoped>
.wrapper {
  padding-top: 34px;
}
.step1 {
  text-align: center;
}
.weui-flex {
  margin: 0 10px;
}
.weui-flex__item {
  height: 80px;
  margin: 0 10px;
  max-width: 33%;
}

.item_top {
  height: 50px;
  line-height: 50px;
  background: #656565;
  color: #fff;
  border-radius: 6px 6px 0 0;
}
.item_bottom {
  height: 26px;
  line-height: 26px;
  background: #fff;
  border-radius: 0 0 6px 6px;
  font-size: 13px;
  box-shadow: 0px 1px 6px 0px rgba(69, 25, 118, 0.11);
}
.time {
  font-size: 25px;
}
.active_item_bg {
  background: rgb(110, 95, 238);
}
.btn_group {
  margin-top: 50px;
  text-align: center;
  padding: 0 42px;
}
.btn_group .btn {
  width: 100%;
  height: 42px;
  line-height: 42px;
  color: rgb(110, 95, 238);
  font-size: 14px;
  border-radius: 20px;
  border: 1px solid rgb(110, 95, 238);
}
.btn_group div:first-child {
  margin-bottom: 30px;
}
.msg {
  color: #999999;
  font-size: 12px;
  text-align: center;
  margin-top: 20px;
}

.step2 {
  padding: 0 20px;
  text-align: center;
}
.time_down {
  font-size: 50px;
  font-weight: 600;
}
.msg_text1 {
  font-size: 12px;
  color: rgba(153, 153, 153, 1);
  margin-top: 10px;
}
.msg_text2 {
  text-align: left;
  font-size: 12px;
  color: rgba(68, 68, 68, 1);
  margin-top: 40px;
}
.code {
  height: 64px;
  line-height: 64px;
  background: rgba(242, 242, 242, 1);
  border-radius: 10px;
  margin-top: 20px;
  letter-spacing: 10px;
}
/*  */
.btn_disabled {
  border-color: rgba(204, 204, 204, 1) !important;
  color: rgba(204, 204, 204, 1) !important;
}
.help {
  margin-top: 10px;
  font-size: 12px;
  font-weight: 400;
  color: rgba(102, 102, 102, 1);
}
.step3 {
  font-size: 18px;
  text-align: center;
}
.use-record {
  width: 100px;
  text-align: center;
  color: rgb(110, 95, 238);
  position: fixed;
  bottom: 40px;
  left: 50%;
  margin-left: -50px;
}
</style>