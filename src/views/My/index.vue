<template>
  <div>
    <!-- 导航栏 -->
    <van-nav-bar class="page-nav-bar" left-arrow title="我的" @click-left="$router.back()"></van-nav-bar>
    <!-- /导航栏 -->
    <div class="bluebg">
      <div class="avatar">
        <div class="left">
          <van-image width="1.76rem" height="1.76rem" round v-if="userInfo.headUrl" :src="userInfo.headUrl" fit="cover"></van-image>
          <van-image width="1.76rem" height="1.76rem" round v-else src="https://img01.yzcdn.cn/vant/cat.jpeg" fit="cover"></van-image>
        </div>
        <div class="right">
          <div class="namePosition">
            <h3>{{userInfo.userName}}</h3>
            <p v-if="userInfo.title">{{userInfo.isTotalSchedule == 1 ? '总调度' : userInfo.isDepartmentHeads == 1 ? '部门主管' : '运维人员'}} | {{userInfo.title}}</p>
            <p v-else>{{userInfo.isTotalSchedule == 1 ? '总调度' : userInfo.isDepartmentHeads == 1 ? '部门主管' : '运维人员'}}</p>
          </div>
          <span>{{userInfo.phone}}</span>
        </div>
      </div>
    </div>
    <div class="main-wrap">
      <van-row>
        <van-col span="10" v-for="(order,index) in order" :key="index">
          <van-cell value="内容">
            <template #title>
              <div class="orderType">{{order.type}}</div>
              <div class="num">{{order.num}}</div>
            </template>
            <template #default>
              <div>
                <van-icon class="icon" name="weapp-nav" />
              </div>
            </template>
          </van-cell>
        </van-col>
      </van-row>
      <div class="notice">
        <van-cell title="公示公告" icon="orders-o" :value="noticeTotal" is-link to="./notice" style="background-color:#F8F9FF" />
      </div>
    </div>
  </div>
</template>
<script>
export default {
  name: 'checkDetails',
  props: {
  },
  data () {
    return {
      avatar: 'https://img01.yzcdn.cn/vant/cat.jpeg',
      name: '许三多',
      phone: '15695468124',
      order: [{ type: '运维工单总数', num: '' }, { type: '待接单', num: '' }, { type: '退回', num: '' }, { type: '处理中', num: '' }, { type: '处理完成待接单', num: '' }, { type: '已驳回', num: '' }, { type: '完结', num: '' }
      ],
      userInfo: {},
      nickName: '',
      noticeTotal: '',
    }
  },
  computed: {},
  watch: {
  },
  created () {
    this.noticeTotal = localStorage.getItem('noticeTotal')
  },
  mounted () {
    this.userInfo = JSON.parse(localStorage.getItem('userInfo'))
    console.log(this.userInfo);
    console.log(JSON.parse(localStorage.getItem('userInfo')));
    this.getWorkOrderList()
    this.getWorkOrderList1()
    this.getWorkOrderList2()
    this.getWorkOrderList3()
    this.getWorkOrderList4()
    this.getWorkOrderList5()
    this.getWorkOrderList6()
  },
  methods: {
    getWorkOrderList () {
      let data = {
        current: 1,
        size: 9999,
        isTransferOrder: 0,
      }
      this.$Apis.getWorkOrder(data).then(res => {
        this.order[0].num = res.data.total
      })
    },
    getWorkOrderList1 () {
      let data = {
        current: 1,
        size: 9999,
        isTransferOrder: 0,
        workOrderStatus: 'PENDING_ORDER'
      }
      this.$Apis.getWorkOrder(data).then(res => {
        this.order[1].num = res.data.total
      })
    },
    getWorkOrderList2 () {
      let data = {
        current: 1,
        size: 9999,
        isTransferOrder: 0,
        workOrderStatus: 'RETURN'
      }
      this.$Apis.getWorkOrder(data).then(res => {
        this.order[2].num = res.data.total
      })
    },
    getWorkOrderList3 () {
      let data = {
        current: 1,
        size: 9999,
        isTransferOrder: 0,
        workOrderStatus: 'PROCESSING'
      }
      this.$Apis.getWorkOrder(data).then(res => {
        this.order[3].num = res.data.total
      })
    },
    getWorkOrderList4 () {
      let data = {
        current: 1,
        size: 9999,
        isTransferOrder: 0,
        workOrderStatus: 'PENDING_BILL'
      }
      this.$Apis.getWorkOrder(data).then(res => {
        this.order[4].num = res.data.total
      })
    },
    getWorkOrderList5 () {
      let data = {
        current: 1,
        size: 9999,
        isTransferOrder: 0,
        workOrderStatus: 'TURN_DOWN'
      }
      this.$Apis.getWorkOrder(data).then(res => {
        this.order[5].num = res.data.total
      })
    },
    getWorkOrderList6 () {
      let data = {
        current: 1,
        size: 9999,
        isTransferOrder: 0,
        workOrderStatus: 'CHECK'
      }
      this.$Apis.getWorkOrder(data).then(res => {
        this.order[6].num = res.data.total
      })
    },
  }
}
</script>

<style scoped lang="less">
.bluebg {
  height: 300px;
  width: 100%;
  position: fixed;
  top: 90px;
  background-color: #246ee8;
  z-index: 2;
  .avatar {
    margin-top: 80px;
    padding-left: 50px;
    padding-right: 33px;
    display: flex;
    align-items: center;
    .right {
      display: flex;
      flex-direction: column;
      margin-left: 30px;
      margin-bottom: 20px;
      .namePosition {
        display: flex;
        align-items: center;
        h3 {
          font-size: 40px;
          color: #fff;
          margin-bottom: 10px;
        }
        p {
          font-size: 28px;
          color: #fff;
          margin-left: 20px;
          border: 1px solid #fff;
          border-radius: 20px;
          padding: 0 10px;
        }
      }
      span {
        font-size: 28px;
        color: #ffffff;
      }
    }
  }
}
.main-wrap {
  position: fixed;
  left: 0;
  right: 0;
  top: 350px;
  bottom: 100px;
  border-radius: 50px 50px 0 0;
  overflow-y: scroll;
  background-color: #f8f9ff;
  z-index: 3;
  padding: 50px 50px;
  .orderType {
    font-size: 24px;
    color: #414149;
    white-space: nowrap;
  }
  .num {
    font-size: 48px;
    margin-top: 10px;
  }
  .icon {
    color: blue;
  }
  .van-col {
    margin: 20px;
  }
  .notice {
    .van-cell__value {
      color: #e82424;
    }
    /deep/.van-cell__left-icon {
      color: #246ee8;
    }
  }
}
</style>