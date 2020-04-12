<template>
  <div class="wrapper">
    <div class="item">
      <div class="pic">
        <img src="http://p2a60yqmm.bkt.clouddn.com/wxapp/images/taobao.png" />
      </div>
      <div class="item-btn" @click="hint">查看详情</div>
    </div>
    <div class="item">
      <div class="pic">
        <img src="http://p2a60yqmm.bkt.clouddn.com/wxapp/images/jd.png" />
      </div>
      <div class="item-btn" @click="hint">查看详情</div>
    </div>
    <div class="item">
      <div class="pic">
        <img src="http://p2a60yqmm.bkt.clouddn.com/wxapp/images/yunshanfu.png" />
      </div>
      <div class="item-btn" @click="hint">查看详情</div>
    </div>
    <div class="item">
      <div class="pic">
        <img src="http://p2a60yqmm.bkt.clouddn.com/wxapp/images/meituan.png" />
      </div>
      <div class="item-btn" @click="hint">查看详情</div>
    </div>
    <div class="item">
      <div class="pic">
        <img src="http://p2a60yqmm.bkt.clouddn.com/wxapp/images/baidu.png" />
      </div>
      <div class="item-btn" @click="hint">查看详情</div>
    </div>
    <div class="item">
      <div class="pic">
        <img src="http://p2a60yqmm.bkt.clouddn.com/wxapp/images/douyin.png" />
      </div>
      <div class="item-btn" @click="hint">查看详情</div>
    </div>
  </div>
</template>

<script>
export default {
  data () {
    return {
    }
  },
  methods: {
    hint () {
      mpvue.showToast({
        title: '暂未上线,敬请期待!',
        content: '暂未上线,敬请期待!',
        icon: 'none',
        duration: 2000
      })
    }
  }
}
</script>

<style>
.wrapper {
  background: rgba(246, 246, 247, 1);
  padding: 10px 0;
}
img {
  height: 100%;
  width: 100%;
}
.item {
  position: relative;
}
.pic {
  margin: 10px;
  height: 118px;
}
.item-btn {
  position: absolute;
  right: 36px;
  bottom: 18px;
  padding: 2px 19px;
  color: #63a2ff;
  border: 1px solid #63a2ff;
  font-size: 11px;
  border-radius: 9px;
}
</style>