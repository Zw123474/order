<template>
  <div>
    <van-cell-group inset border v-for="item in WorkOrderList" :key="item.id" style="margin-bottom:0.5rem">
      <van-cell class="article-item">
        <van-cell v-if="title !=='全部'" :title="title=='运维人员待接单' ? '待接单' : title">
          <template #default>
            <!-- 查看详情，所有角色可查看 -->
            <van-button type="info" size="mini" @click="checkDetails(item.id)">详情</van-button>
            <!-- 待接单和退回状态下，总调度可编辑 -->
            <van-button type="info" size="mini" @click="editDetails(item.id)" v-if="title =='待接单' || title == '退回'" v-show="isTotalSchedule=='1'">编辑</van-button>
            <!-- 待接单状态下，部门主管可退回 -->
            <van-button type="info" size="mini" @click="returnWorkOrder(item.id)" v-if="title =='待接单'" v-show="isTotalSchedule=='-1' &&isDepartmentHeads=='1'">退回</van-button>
            <van-popup v-model="returnShow" round position="bottom" :style="{ height: '50%' }" get-container="body" :overlay-style="{color:'#ccc'}">
              <van-form @submit="onSubmitReturn">
                <van-field label="退回" readonly></van-field>
                <van-field type="textarea" v-model="returns.returnReason" name="退回原因" label="退回原因" placeholder="退回原因" />
                <div style="margin: 16px;">
                  <van-button round block type="info" native-type="submit">提交</van-button>
                </div>
              </van-form>
            </van-popup>
            <!-- 待接单状态下，部门主管可指派 -->
            <van-button type="info" size="mini" @click="assignOrders(item.id)" v-if="title =='待接单'" v-show="isTotalSchedule=='-1' &&isDepartmentHeads=='1'">指派</van-button>
            <van-popup v-model="AssignShow" round position="bottom" :style="{ height: '60%' }" get-container="body">
              <van-form @submit="onSubmitAssign">
                <van-field label="指派运维人员" readonly></van-field>
                <van-checkbox-group v-model="assignCheckGroup">
                  <van-cell-group>
                    <van-cell v-for="(op, index) in operator" clickable :key="op.id" :title="op.userName" @click="toggle1(index)">
                      <template #right-icon>
                        <van-checkbox :name="op.userName" ref="checkassignboxes" />
                      </template>
                    </van-cell>
                  </van-cell-group>
                </van-checkbox-group>
                <div style="margin: 16px;">
                  <van-button round block type="info" native-type="submit">提交</van-button>
                </div>
              </van-form>
            </van-popup>
            <!-- 处理中，已驳回状态下，运维人员添加字段 -->
            <van-button type="info" size="mini" @click="replenish(item.id)" v-if="title =='处理中' || title == '已驳回'" v-show="isOprator=='1'">编辑</van-button>
            <!-- <van-button type="info" size="mini" @click="replenish(item.id)">编辑</van-button> -->
            <!-- 处理中状态下，运维人员可改状态为处理完成 -->
            <van-button type="info" size="mini" @click="completePending(item.id)" v-if="title =='处理中' || title == '已驳回'" v-show="isOprator=='1'">处理完成</van-button>
            <!-- 退回状态下，总调度可重新派发 -->
            <van-button type="info" size="mini" @click="redistribute(item.id)" v-if="title =='退回'" v-show="isTotalSchedule=='1'">重新派发</van-button>
            <van-popup v-model="redistributeShow" round position="bottom" :style="{ height: '60%' }" get-container="body">
              <van-form @submit="onSubmit">
                <van-field label="重新派发部门" readonly></van-field>
                <van-checkbox-group v-model="checkboxGroup">
                  <van-cell-group>
                    <van-cell v-for="(dept, index) in dept" clickable :key="dept.id" :title="dept.name" @click="toggle(index)">
                      <template #right-icon>
                        <van-checkbox :name="dept.name" ref="checkboxes" />
                      </template>
                    </van-cell>
                  </van-cell-group>
                </van-checkbox-group>
                <div style="margin: 16px;">
                  <van-button round block type="info" native-type="submit">提交</van-button>
                </div>
              </van-form>
            </van-popup>
            <!-- 退回状态下，部门主管可撤销退回 -->
            <van-button type="info" size="mini" @click="revoke(item.id)" v-if="title =='退回'" v-show="isTotalSchedule=='-1' &&isDepartmentHeads=='1'">撤销</van-button>
            <!-- 处理完成待接单状态下，总调度可驳回 -->
            <van-button type="info" size="mini" @click="turnDown(item.id)" v-if="title =='处理完成待结单'" v-show="isTotalSchedule=='1'">驳回</van-button>
            <van-popup v-model="turnDownShow" round position="bottom" :style="{ height: '50%' }" get-container="body">
              <van-form @submit="onSubmitTurnDown">
                <van-field label="驳回" readonly></van-field>
                <van-field v-model="turnDowns.turnDownReason" name="驳回原因" label="驳回原因" placeholder="驳回原因" />
                <van-field type="textarea" v-model="turnDowns.reviewNotes" name="审核备注" label="审核备注" placeholder="审核备注" />
                <div style="margin: 16px;">
                  <van-button round block type="info" native-type="submit">提交</van-button>
                </div>
              </van-form>
            </van-popup>
            <!-- 处理完成待结单状态下，总调度可完结 -->
            <van-button type="info" size="mini" @click="bossFinish(item.id)" v-if="title =='处理完成待结单'" v-show="isTotalSchedule=='1'">完结</van-button>
            <!-- 处理完成待结单状态下，运维人员可撤销改状态 -->
            <van-button type="info" size="mini" @click="revokeCompletePending(item.id)" v-if="title =='处理完成待结单'" v-show="isOprator=='1'">撤销</van-button>
            <!-- 运维人员待接单状态下，即工单池中的工单，运维人员可接单 -->
            <van-button type="info" size="mini" @click="receiveOrder(item.id)" v-if="title =='运维人员待接单'" v-show="isOprator=='1'">接单</van-button>
          </template>
        </van-cell>
        <van-cell v-else :title="item.workOrderStatus">
          <template #default>
            <!-- 查看详情，所有角色可查看 -->
            <van-button type="info" size="mini" @click="checkDetails(item.id)">详情</van-button>
          </template>
        </van-cell>
        <van-cell>
          <van-col span="12">
            <div class="content-title">运维工单编号</div>
            <div class="content-blue">{{item.workOrderCode}}</div>
          </van-col>
          <van-col span="12">
            <div class="content-title">用户编号</div>
            <div class="content-blue">{{item.userNumber}}</div>
          </van-col>
          <van-col span="12">
            <div class="content-title">报修类别</div>
            <div class="content-black">{{item.repairCategory}}</div>
          </van-col>
          <van-col span="12">
            <div class="content-title">报修联系人</div>
            <div class="content-black">{{item.repairContact}}</div>
          </van-col>
          <van-col span="12">
            <div class="content-title">报修联系电话</div>
            <div class="content-black">{{item.repairContactNumber}}</div>
          </van-col>
          <van-col span="12">
            <div class="content-title">报修时间</div>
            <div class="content-black">{{item.repairTime}}</div>
          </van-col>
          <van-col span="12">
            <div class="content-title">客户经理</div>
            <div class="content-black">{{item.repairContactNumber}}</div>
          </van-col>
          <van-col span="12">
            <div class="content-title">要求完工时间</div>
            <div class="content-black">{{item.requireCompletionTime}}</div>
          </van-col>
          <van-col span="24">
            <div class="content-title">报修来源</div>
            <div class="content-black">{{item.repairSource}}</div>
          </van-col>
          <van-col span="24">
            <div class="content-title">报修地址</div>
            <div class="content-black">{{item.repairAddress}}</div>
          </van-col>
          <van-col span="24">
            <div class="content-title">备注</div>
            <div class="content-black">{{item.faultDescription}}</div>
          </van-col>
        </van-cell>
      </van-cell>
    </van-cell-group>
    <van-empty image="search" description="暂无数据" v-show="WorkOrderList.length == 0" />
  </div>
</template>

<script>
import { Dialog, Notify } from 'vant'
export default {
  name: 'WorkOrderItem',
  components: {},
  props: {
    title: {
      type: String,
      require: true
    },
    type: {
      type: String,
      require: true
    },
    userNumber: {
      type: String,
      require: true
    },
    workOrderCode: {
      type: String,
      require: true
    }
  },
  data () {
    return {
      refTitle: '',
      WorkOrderList: [],
      // 判断用户是否部门主管
      isDepartmentHeads: '',
      // 判断用户是否总调度
      isTotalSchedule: '',
      isOprator: '-1',
      redistributeShow: false,
      turnDownShow: false,
      returnShow: false,
      AssignShow: false,
      id: '',
      checkboxGroup: [],
      dept: [],
      departmentIds: [],
      turnDowns: {
        turnDownReason: '',
        reviewNotes: ''
      },
      returns: {
        returnReason: ''
      },
      assignCheckGroup: [],
      operator: [],
      maintenanceStaffIds: [],
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
      }
      ],
      titleFormatter: '1'
    }
  },
  computed: {},
  created () {
    this.refTitle = this.title
    this.isDepartmentHeads = JSON.parse(localStorage.getItem('userInfo')).isDepartmentHeads
    this.isTotalSchedule = JSON.parse(localStorage.getItem('userInfo')).isTotalSchedule
    if (this.isTotalSchedule == '-1') {
      if (this.isDepartmentHeads == '-1') {
        this.isOprator = '1'
      }
    }
    this.getWorkOrderList()
    this.getDept()
    this.getOperator()
  },
  mounted () {
    // console.log(this.titleFormatter);
    // this.getWorkOrderList()
    // console.log(JSON.parse(localStorage.getItem('userInfo')));
    // console.log(this.isDepartmentHeads);
    // console.log(this.isTotalSchedule);
    // this.getDept()
    // this.getOperator()
    //  this.getWorkOrderList()
  },
  methods: {
    toggle (index) {
      this.$refs.checkboxes[index].toggle();
    },
    toggle1 (index) {
      this.$refs.checkassignboxes[index].toggle();
    },
    // 查询工单
    getWorkOrderList () {
      let data = {
        current: 1,
        size: 9999,
        workOrderStatus: this.type,
        userNumber: this.userNumber,
        workOrderCode: this.workOrderCode
      }
      this.$Apis.getWorkOrder(data).then(res => {
        this.WorkOrderList = res.data.list
        this.WorkOrderList.map(order => {
          this.channels.forEach(ele => {
            if (order.workOrderStatus == ele.value) {
              order.workOrderStatus = ele.label
            }
          })
        })
      })
    },
    // 获取同部门运维人员 for 部门主管派单
    getOperator () {
      let data = {
        current: 1,
        size: 99,
        deptId: JSON.parse(localStorage.getItem('userInfo')).deptId
      }
      this.$Apis.getDeptOperator(data).then(res => {
        this.operator = res.data.list
      })
    },
    // 获取部门列表 for 重新派发
    getDept () {
      let data = {
        current: 1,
        size: 99
      }
      this.$Apis.getDept(data).then(res => {
        // console.log(res);
        this.dept = res.data.list
      })
    },
    checkDetails (id) {
      this.$router.push({ path: './checkDetails', query: { id: id } })
    },
    editDetails (id) {
      this.$router.push({ path: './editDetails', query: { id: id } })
    },
    // 总调度重新派发
    redistribute (id) {
      this.redistributeShow = true
      this.id = id
    },
    onSubmit () {
      this.checkboxGroup.map(item => {
        this.dept.map(e => {
          if (item === e.name) {
            this.departmentIds.push(e.id)
          }
        })
      })
      // console.log(this.checkboxGroup);
      let data = {
        departmentIds: this.departmentIds.join(','),
        id: this.id
      }
      this.$Apis.redistribute(data).then(res => {
        if (res.code == '200') {
          Notify({ type: 'success', message: '操作成功' });
          this.getWorkOrderList()
        } else {
          Notify({
            message: res.msg,
            type: 'danger',
          });
        }
      })
    },
    // 驳回
    turnDown (id) {
      this.turnDownShow = true
      this.id = id
    },
    onSubmitTurnDown () {
      let data = {
        turnDownReason: this.turnDowns.turnDownReason,
        reviewNotes: this.turnDowns.reviewNotes,
        id: this.id
      }
      this.$Apis.turnDown(data).then(res => {
        if (res.code == '200') {
          this.turnDownShow = false
          Notify({ type: 'success', message: '操作成功' });
          this.getWorkOrderList()
        } else {
          Notify({
            message: res.msg,
            type: 'danger',
          });
        }
      })
    },
    // 总调度完结
    bossFinish (id) {
      Dialog.confirm({
        title: '完结工单',
        message: '确认要完结该工单吗',
      })
        .then(() => {
          let data = {
            id: id
          }
          this.$Apis.bossFinish(data).then(res => {
            if (res.code == '200') {
              Notify({ type: 'success', message: '操作成功' });
              this.getWorkOrderList()
            } else {
              Notify({
                message: res.msg,
                type: 'danger',
              });
            }
          })
        })
        .catch(() => {

        });
    },
    // 部门主管退回
    returnWorkOrder (id) {
      this.returnShow = true
      this.id = id
    },
    onSubmitReturn () {
      let data = {
        returnReason: this.returns.returnReason,
        maintenanceWorkOrderId: this.id
      }
      this.$Apis.returnWorkOrder(data).then(res => {
        if (res.code == '200') {
          this.returnShow = false
          Notify({ type: 'success', message: '操作成功' });
          this.getWorkOrderList()
        } else {
          Notify({
            message: res.msg,
            type: 'danger',
          });
        }
      })
    },
    // 部门主管撤销
    revoke (id) {
      Dialog.confirm({
        title: '撤销退回',
        message: '确认要撤销退回该工单吗',
      })
        .then(() => {
          let data = {
            maintenanceWorkOrderId: id
          }
          this.$Apis.revoke(data).then(res => {
            if (res.code == '200') {
              Notify({ type: 'success', message: '撤销成功' });
              this.getWorkOrderList()
            } else {
              Notify({
                message: res.msg,
                type: 'danger',
              });
            }
          })
        })
        .catch(() => {
        });
    },
    // 部门主管派发工单
    assignOrders (id) {
      this.AssignShow = true
      this.id = id
    },
    onSubmitAssign () {
      this.assignCheckGroup.map(item => {
        this.operator.map(e => {
          if (item === e.userName) {
            this.maintenanceStaffIds.push(e.id)
          }
        })
      })
      let data = {
        maintenanceWorkOrderId: this.id,
        maintenanceStaffIds: this.maintenanceStaffIds.join(',')
      }
      this.$Apis.assignOrders(data).then(res => {
        if (res.code == '200') {
          this.AssignShow = false
          Notify({ type: 'success', message: '操作成功' });
          this.getWorkOrderList()
        } else {
          Notify({
            message: res.msg,
            type: 'danger',
          });
        }
      })
    },
    // 运维人员处理完成待结单
    completePending (id) {
      Dialog.confirm({
        title: '处理完成',
        message: '确认处理完成该工单吗',
      })
        .then(() => {
          let data = {
            id: id
          }
          this.$Apis.completePending(data).then(res => {
            if (res.code == '200') {
              Notify({ type: 'success', message: '处理成功' });
              this.getWorkOrderList()
            } else {
              Notify({
                message: res.msg == '运维工单[修复状态]字段不能为空,请补充信息后操作' ? '请先编辑修复状态' : res.msg,
                type: 'danger',
              });
            }
          })
        })
        .catch(() => {
        });
    },
    // 运维人员撤销处理完成待结单
    revokeCompletePending (id) {
      Dialog.confirm({
        title: '撤销处理完成',
        message: '确认撤销处理完成该工单吗',
      })
        .then(() => {
          let data = {
            id: id
          }
          this.$Apis.revokeCompletePending(data).then(res => {
            if (res.code == '200') {
              Notify({ type: 'success', message: '撤销成功' });
              this.getWorkOrderList()
            } else {
              Notify({
                message: res.msg,
                type: 'danger',
              });
            }
          })
        })
        .catch(() => {
        });
    },
    // 运维人员在工单池中接单
    receiveOrder (id) {
      Dialog.confirm({
        title: '接单',
        message: '确认接收该工单吗',
      })
        .then(() => {
          let data = {
            id: id
          }
          this.$Apis.receiveOrder(data).then(res => {
            if (res.code == '200') {
              Notify({ type: 'success', message: '接单成功' });
              this.getWorkOrderList()
            } else {
              Notify({
                message: res.msg,
                type: 'danger',
              });
            }
          })
        })
        .catch(() => {
        });
    },
    // 运维人员补充字段
    replenish (id) {
      this.$router.push({ path: './replenish', query: { id: id } })
    },
  }
}
</script>

<style scoped lang="less">
.article-item {
  .title {
    font-size: 32px;
    color: #3a3a3a;
  }
  .van-cell {
    padding-left: 5px;
    padding-right: 5px;
  }
  .van-cell::after {
    border: 2px solid #c0c4cc;
    width: 100%;
    left: 0;
  }
  .content-title {
    margin-top: 5px;
    font-size: 24px;
    color: #888888;
  }
  .content-blue {
    margin-top: 5px;
    color: #246ee8;
    font-size: 28px;
    font-weight: 700;
  }
  .content-black {
    margin-top: 5px;
    color: #606266;
    font-size: 28px;
    font-weight: 700;
  }
  /deep/.van-col--12 {
    width: 45%;
    margin-right: 5%;
    height: 130px;
  }
}
</style>
