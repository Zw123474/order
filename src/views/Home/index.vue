<template>
  <div>
    <van-nav-bar title="运维工单" />
    <van-tabs v-model="active" animated background="#246dea" @click="refresh" title-inactive-color="#ccc" title-active-color="white" swipe-threshold="4">
      <van-tab :title="item.label" v-for="(item,index) in channels" :key="index">
        <WorkOrderList ref="tabContent" :title="item.label" :type="item.value"></WorkOrderList>
      </van-tab>
      <template #nav-right>
        <div class="menu">
          <van-icon name="search" class="search" @click="isFormShow" />
        </div>
        <div class="menu1"></div>
      </template>
    </van-tabs>
  </div>
</template>

<script>
import WorkOrderList from '@/components/WorkOrderList.vue'
export default {
  name: 'Home',
  created () {
    if (JSON.parse(localStorage.getItem('userInfo')).isTotalSchedule == '-1') {
      if (JSON.parse(localStorage.getItem('userInfo')).isDepartmentHeads == '-1') {
        this.isOperator = 1
      }
    }
    this.delReturn()
  },
  data () {
    return {
      isOperator: '',
      active: 0,
      channels: [{
        value: "",
        label: "全部",
      }, {
        value: "PENDING_ORDER",
        label: "待接单",
      },
      {
        value: "PROCESSING",
        label: "处理中",
      },
      {
        value: "RETURN",
        label: "退回",
      },
      {
        value: "TURN_DOWN",
        label: "已驳回",
      },
      {
        value: "PENDING_BILL",
        label: "处理完成待结单",
      },
      {
        value: "CHECK",
        label: "已结单",
      },
      ],
      isChannelPanelShow: true,
      isShow: true,
      grandson: false
    }
  },
  methods: {
    refresh(){
      this.$refs.tabContent.forEach(e =>{
        return e.onSubmit()
      })
    },
    isFormShow () {
      if (this.isShow) {
        this.$refs.tabContent[0].formShow = true
        this.$refs.tabContent[0].popupheight = "height:65%"
        this.isShow = false
      } else {
        this.$refs.tabContent[0].formShow = false
        this.$refs.tabContent[0].popupheight = "height:85%"
        this.isShow = true
      }
    },
    // 判断channels的情况，如果是运维人员，删除退回状态
    delReturn () {
      if (this.isOperator == '1') {
        this.channels.splice(3, 1)
      }
    },
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
  align-items: center;
  .search {
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
</style>
