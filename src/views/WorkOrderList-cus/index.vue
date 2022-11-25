<template>
  <div>
    <van-nav-bar title="运维工单池" />
    <!-- <van-tabs v-model="active" background="#246dea">
      <van-tab> -->
        <WorkOrderList ref="tabContent" title="运维人员待接单" type="PENDING_ORDER"></WorkOrderList>
      <!-- </van-tab>
    </van-tabs> -->
  </div>
</template>

<script>
import WorkOrderList from '@/components/WorkOrderList.vue'
export default {
  name: 'Home',
  created () {
  },
  data () {
    return {
      active: 0,
      channels: {
        value: "PENDING_ORDER",
        label: "全部",
      },
      isChannelPanelShow: true,
      isShow: true
    }
  },
  methods: {
  },
  computed: {},
  watch: {
  },
  filters: {},
  components: {
    WorkOrderList
  }
}
</script>

<style scoped lang="less">
/deep/.van-nav-bar__title {
  max-width: unset;
}
.van-hairline--bottom::after {
  border-bottom: none;
}
.search-btn {
  width: 555px;
  height: 64px;
  background: rgba(255, 255, 255, 0.2);
  border-radius: 32px;
}
/deep/ .van-tabs__wrap--scrollable .van-tab {
  padding: 0 30px;
}
/deep/ .van-tabs__line {
  width: 40px;
  background-color: #fff;
}
.menu {
  min-width: 100px;
  height: 82px;
  background-color: #246dea;
  position: fixed;
  right: 0;
  color: #fff;
  text-align: center;
  line-height: 82px;
  .toutiao {
    font-size: 33px;
  }
}
.menu1 {
  min-width: 100px;
  height: 82px;
  background-color: #246dea;
}
/deep/.van-tabs__wrap {
  width: 750px;
  position: fixed;
  top: 92px;
  z-index: 1;
}
/deep/.van-pull-refresh {
  height: calc(100vh - 184px);
  overflow: auto;
}
/deep/ .van-hairline--top-bottom::after, .van-hairline-unset--top-bottom::after{
  display: none;
}
</style>

