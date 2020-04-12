<template>
  <div class="wrapper">
    <div class="weui-flex" v-for="(item,index) in list" :key="index">
      <div class="weui-flex__item">
        <div class="title">订单号：{{item.orderNo}}</div>
        <div class="content">
          <div class="item">
            <div class="item-left">网点:</div>
            <div class="item-right">{{item.storeAddress}}</div>
          </div>
          <div class="item">
            <div class="item-left">使用时长:</div>
            <div class="item-right">{{item.description}}</div>
          </div>
          <div class="item">
            <div class="item-left time">{{item.createTime}}</div>
            <div class="item-right">{{item.status}}</div>
          </div>
        </div>
      </div>
    </div>
    <!--  -->
    <div class="none-record" v-if="list.length<=0">
      <img src="../../../static/images/chargeOrderList/none_record.png" alt />
    </div>
  </div>
</template>

<script>
import { orderList } from '@/api/api'

export default {
  data () {
    return {
      list: []
    }
  },
  methods: {
    orderList () {
      orderList().then(res => {
        this.list = res
      })
    }
  },
  onLoad () {
    this.orderList()
  }
}
</script>

<style lang="" scoped>
.wrapper {
  padding: 15px 20px 0 15px;
}
.title {
  color: rgba(51, 51, 51, 1);
  font-size: 14px;
  font-weight: 600;
}
.content {
  margin-top: 10px;
  background: rgba(242, 242, 242, 1);
  border-radius: 10px;
  padding: 15px;
}
.item {
  display: flex;
  justify-content: space-between;
  line-height: 30px;
}
.item-left {
  font-size: 14px;
  color: rgba(68, 68, 68, 1);
}
.item-right,
.time {
  font-size: 12px;
  color: rgba(153, 153, 153, 1);
}
.weui-flex__item {
  padding-top: 15px;
}
.none-record {
  text-align: center;
  width: 134px;
  height: 137px;
  margin: 173px auto 0;
}
.none-record img {
  width: 100%;
  height: 100%;
}
</style>