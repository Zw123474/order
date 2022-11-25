<template>
  <div>
    <!-- 导航栏 -->
    <van-nav-bar class="page-nav-bar" left-arrow title="工单详情" @click-left="$router.back()"></van-nav-bar>
    <!-- /导航栏 -->
    <div class="bluebg"></div>
    <div class="main-wrap">
      <template>
        <div class="title">基础信息</div>
        <van-form>
          <van-field v-model="form.workOrderType" readonly label="运维工单类型" />
          <van-field v-model="form.userNumber" readonly label="用户编号" />
          <van-field v-model="form.workOrderCode" readonly label="运维工单编号" />
          <van-field v-model="form.productLevelNameStr" readonly label="产品层级" />
          <van-field v-model="form.repairCategory" readonly label="报修类型" />
          <van-field v-model="form.repairAddress" readonly label="报修地址" />
          <van-field v-model="form.repairContact" readonly label="报修联系人" />
          <van-field v-model="form.repairContactNumber" readonly label="报修联系电话" />
          <van-field v-model="form.repairSource" readonly label="报修来源" />
          <van-field v-model="form.repairTime" readonly label="报修时间" />
          <van-field v-model="form.areaBelongs" readonly label="所属片区" />
          <van-field v-model="form.requireCompletionTime" readonly label="要求完工时间" />
          <van-field v-if="form.workOrderType== '特殊'" v-model="form.faultLocation" readonly label="故障地点" />
        </van-form>
        <div class="title">用户信息</div>
        <van-form>
          <van-field v-model="userNumberInfo.userName" readonly label="用户名称" />
          <van-field v-model="userNumberInfo.vpnName" readonly label="VPN名称" />
          <van-field v-model="userNumberInfo.userAddress" readonly label="用户地址" />
          <van-field v-model="userNumberInfo.mobilePhone" readonly label="移动电话" />
          <van-field v-model="userNumberInfo.contact" readonly label="联系人" />
          <van-field v-model="userNumberInfo.contactNumber" readonly label="联系电话" />
          <van-field v-model="userNumberInfo.developEmployees" readonly label="发展雇员" />
        </van-form>
        <div class="title" v-if="form.workOrderType== '特殊'">派发部门</div>
        <van-form class="bluetxt" v-if="form.workOrderType== '特殊'">
          <van-field v-model="form.distributeDepartmentVoList" readonly label="指定部门" />
        </van-form>
        <div class="title">附件</div>
        <van-form>
          <van-field v-if="fileList[0]" name="uploader" readonly label="文件上传">
            <template #input>
              <van-uploader v-model="fileList" :deletable="false"/>
            </template>
          </van-field>
          <van-field v-else v-model="emptyFile" name="uploader" readonly label="文件上传">
          </van-field>
        </van-form>
        <div class="title">其他备注</div>
        <van-form>
          <van-field type="textarea" readonly v-model="form.faultDescription" rows="3" />
        </van-form>
        <div class="title" v-if="form.distributeMaintenanceStaffVoList[0]">运维人员补充字段</div>
        <van-form label-width="100" v-if="form.distributeMaintenanceStaffVoList[0]">
          <van-field v-if="form.distributeMaintenanceStaffVoList[0]" v-model="form.distributeMaintenanceStaffVoList[0].maintenanceStaffName" readonly label="运维人员" />
          <van-field v-if="form.distributeMaintenanceStaffVoList[1]" v-model="form.distributeMaintenanceStaffVoList[1].maintenanceStaffName" readonly label="其他运维人员" />
          <van-field v-model="form.faultTypeId" readonly label="故障类型判定" />
          <van-field v-model="form.agentMaintainUnitId" readonly label="代维单位" />
          <van-field v-model="form.constructionTeam" readonly label="是否调用施工队" />
        </van-form>
        <div class="title" v-if="form.returnRecordVoList[0]">运维单退回记录</div>
        <van-form v-for="returnItem in form.returnRecordVoList" :key="returnItem.id">
          <van-field v-model="returnItem.operatorName" readonly label="退回操作人" />
          <van-field type="textarea" v-model="form.returnReason" rows="3" readonly label="退回原因" />
        </van-form>
      </template>
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
      fieldNames: {
        text: 'label',
        value: 'id',
        children: 'children',
      },
      form: {
        distributeMaintenanceStaffVoList: [],
        returnRecordVoList: [],
        distributeDepartmentVoList: '',
        workOrderType: '',
        userNumber: '',
      },
      fileList: [],
      emptyFile:'该工单无附件',
      workOrderStatus: [{
        value: "PENDING_ORDER",
        label: "待接单",
      },
      {
        value: "RETURN",
        label: "退回",
      },
      {
        value: "PROCESSING",
        label: "处理中",
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
      }],
      userNumberInfo: {},
      productOptions: [],
      // cascaderValue: '',
      productLevel: ''
    }
  },
  computed: {},
  watch: {
  },
  created () {
    this.getWorkOrderDetails()
    this.getProductOptions()
  },
  // mounted () {
  //   this.getWorkOrderDetails()
  // },
  methods: {
    // 处理产品层级数组，删除没有children的一项
    deleteChildren (arr) {
      let childs = arr
      for (let i = childs.length; i--; i > 0) {
        if (childs[i].children) {
          if (childs[i].children.length) {
            this.deleteChildren(childs[i].children)
          } else {
            delete childs[i].children
          }
        }
      }
      return arr
    },
    // 获取产品层级下拉框选项
    getProductOptions () {
      this.$Apis.getProductOptions().then(res => {
        console.log(res);
        let obj = res.data
        this.productOptions = this.deleteChildren(obj)
      })
    },
    getWorkOrderDetails () {
      let data = {
        id: this.$route.query.id
      }
      this.$Apis.getWorkOrderDetails(data).then(res => {
        console.log(res);
        this.form = res.data
        this.form.distributeDepartmentVoList = res.data.distributeDepartmentVoList.map(item => {
          return item.departmentName
        }).join(' ')
        this.form.distributeDepartmentVoList = this.form.distributeDepartmentVoList.length >0 ? this.form.distributeDepartmentVoList : '默认派发'
        console.log(this.form);
        this.form.workOrderType = res.data.workOrderType == 'SPECIAL' ? '特殊' : '常规'
        // if (res.data.annex) {
        //   this.fileList.push({ url: res.data.annex })
        // }
        if (res.data.annex) {
          res.data.annex.split(',').forEach(file => {
            this.fileList.push({ url: file })
          })
        }
        // this.workOrderStatus.map(e => {
        //   if (this.form.workOrderStatus == e.value) {
        //     this.form.workOrderStatus = e.label
        //   }
        // })
        // console.log(res.data.productLevel);
        // this.form.productLevel = res.data.productLevel.split(',').map(ele => {
        //   this.productOptions.map(i =>{
        //     if(ele = i.value){
        //       return
        //     }
        //   })
        // })
        this.getUserInfo(res.data.userNumber)
      })
    },
    getUserInfo (userNumber) {
      let data = {
        current: 1,
        size: 999,
        userNumber: userNumber
      }
      this.$Apis.getUserNumberInfo(data).then(res => {
        console.log(res);
        if (res.data.list[0]) {
          this.userNumberInfo = res.data.list[0]
        }
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
}
.main-wrap {
  position: fixed;
  left: 0;
  right: 0;
  top: 190px;
  bottom: 100px;
  border-radius: 50px 50px 0 0;
  overflow-y: scroll;
  background-color: #f8f9ff;
  z-index: 3;
  padding: 30px 50px;
  .title {
    font-size: 32px;
    padding-bottom: 20px;
    color: #414149;
    font-weight: 700;
    margin-top: 30px;
  }
  /deep/.van-field__control:read-only {
    color: #016eff;
  }
  /deep/ .van-uploader__upload{
    display: none;
  }
}
</style>