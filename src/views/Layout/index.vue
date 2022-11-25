<template>
  <div>
    <!-- <keep-alive :include="['Home']">
      <router-view class="main" />
    </keep-alive> -->
    <router-view class="main" />
    <van-tabbar route safe-area-inset-bottom class="tabbar">
      <van-tabbar-item replace to="/home" icon="home-o">运维工单
        <!-- <svg-icon icon-class="home" class="bellIcon"></svg-icon> -->
      </van-tabbar-item>
      <van-tabbar-item replace to="/addWorkOrder" icon="add-o" v-if="isTotalSchedule == '1'">创建工单
      </van-tabbar-item>
      <van-tabbar-item replace to="/workOrderList" icon="description" v-if="isTotalSchedule == '-1'">工单池
      </van-tabbar-item>
      <van-tabbar-item replace to="/notice" icon="bulb-o">消息通知
      </van-tabbar-item>
      <van-tabbar-item replace to="/my" icon="contact">我的
      </van-tabbar-item>
    </van-tabbar>
  </div>
</template>

<script>
export default {
  created () {
    this.isTotalSchedule = JSON.parse(localStorage.getItem('userInfo')).isTotalSchedule
    console.log(this.isTotalSchedule);
    if (JSON.parse(localStorage.getItem('userInfo')).isTotalSchedule == '-1') {
      if (JSON.parse(localStorage.getItem('userInfo')).isDepartmentHeads == '-1') {
        this.isOperator = '1'
      } else {
        this.isOperator = '-1'
      }
    }
  },
  data () {
    return {
      isOperator: '',
      isTotalSchedule: ''
    }
  },
  methods: {},
  computed: {},
  watch: {},
  filters: {},
  components: {}
}
</script>

<style scoped lang="less">
/deep/ .van-tabbar-item__text {
  font-size: 20px !important;
}
.main {
  padding-bottom: 100px;
  background-color: #f5f7f9;
}
.tabbar {
  padding-bottom: constant(safe-area-inset-bottom); /*兼容 IOS<11.2*/
  padding-bottom: env(safe-area-inset-bottom);
}
</style>
