<template>
  <div>
    <!-- 导航栏 -->
    <van-nav-bar class="page-nav-bar" left-arrow title="编辑" @click-left="$router.back()"></van-nav-bar>
    <!-- /导航栏 -->
    <div class="bluebg"></div>
    <div class="main-wrap">
      <template>
        <div class="title">运维人员补充字段</div>
        <van-form label-width="100">
          <!-- <van-field v-model="form.distributeMaintenanceStaffVoList[0].maintenanceStaffName" label="运维人员">
            <template #button>
              <van-button size="mini" type="primary" @click="click">添加运维人员</van-button>
            </template>
          </van-field>
          <van-field v-model="form.distributeMaintenanceStaffVoList[1].maintenanceStaffName" label="其他运维人员" />
          <van-field v-if="form.distributeMaintenanceStaffVoList[2].maintenanceStaffName" v-model="form.distributeMaintenanceStaffVoList[2].maintenanceStaffName" label="其他运维人员" /> -->
          <van-field v-for="responser in responsers" v-model="responser.maintenanceStaffName" label="运维人员" :key="responser.id" readonly>
          </van-field>
          <van-field v-model="responserName" readonly clickable label="其他运维人员" @click="responserShowPicker = true" placeholder="添加运维人员"></van-field>
          <van-popup v-model="responserShowPicker" round position="bottom" :style="{ height: '60%' }" get-container="body">
            <van-form @submit="onSubmitResponser">
              <van-field label="添加运维人员" readonly></van-field>
              <van-checkbox-group v-model="responserCheckGroup">
                <van-cell-group>
                  <van-cell v-for="(op, index) in operator" clickable :key="index" :title="op.userName" @click="toggleIndex(index)">
                    <template #right-icon>
                      <van-checkbox :name="op.userName" ref="checkResponserboxes" />
                    </template>
                  </van-cell>
                </van-cell-group>
              </van-checkbox-group>
              <div style="margin: 16px;">
                <van-button round block type="info" native-type="submit">提交</van-button>
              </div>
            </van-form>
          </van-popup>
          <van-field name="switch" label="是否调用施工队">
            <template #input>
              <van-switch v-model="form.constructionTeam" size="20" />
            </template>
          </van-field>
          <van-field v-model="form.faultCause" label="故障原因" />
          <van-field v-model="form.faultTypeId" label="故障类型判定" />
          <van-field readonly clickable name="picker" :value="value" label="修复状态" placeholder="点击选择修复状态" @click="showPicker = true" />
          <van-popup v-model="showPicker" position="bottom">
            <van-picker show-toolbar :columns="columns" @confirm="onConfirm" @cancel="showPicker = false" />
          </van-popup>
          <van-field type="textarea" label="备注" v-model="form.remark" rows="3" />
        </van-form>
        <div style="margin: 16px;">
          <van-button round block type="info" @click="onSubmit">提交</van-button>
        </div>
      </template>
    </div>
  </div>
</template>
<script>
import {  Notify } from 'vant'
export default {
  name: 'checkDetails',
  props: {
  },
  data () {
    return {
      responserName: '',
      responserShowPicker: false,
      operator: [],
      value: '',
      showPicker: false,
      form: {
        id: '',
        constructionTeam: false,
        faultCause: '',
        faultTypeId: '',
        remark: '',
        repairStatus: '',
        distributeMaintenanceStaffVoList: [
        ]
      },
      value: '',
      fileList: [],
      columns: ['未修复', '已修复', '无法修复'],
      responserCheckGroup: [],
      workOrderStatus: [{
        value: "NOT_REPAIRED",
        label: "未修复",
      },
      {
        value: "ALREADY_FIXED",
        label: "已修复",
      },
      {
        value: "CAN_NOT_FIX",
        label: "无法修复",
      }],
      responsers: []
    }
  },
  computed: {},
  watch: {
  },
  created () {
    this.form.id = this.$route.query.id
    this.getWorkOrderDetails()
    this.getOperator()
  },
  mounted () {
  },
  methods: {
    toggleIndex (index) {
      this.$refs.checkResponserboxes[index].toggle();
    },
    // 获取同部门运维人员
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
    onSubmitResponser () {
      this.responserCheckGroup.map(item => {
        this.operator.map(e => {
          if (item === e.userName) {
            this.form.distributeMaintenanceStaffVoList.push({ maintenanceStaffName: e.userName, maintenanceStaffId: e.id })
          }
        })
      })
      this.responserName = this.responserCheckGroup.join(' , ')
      this.responserShowPicker = false
    },
    getWorkOrderDetails () {
      let data = {
        id: this.$route.query.id
      }
      this.$Apis.getWorkOrderDetails(data).then(res => {
        console.log(res);
        this.responsers = res.data.distributeMaintenanceStaffVoList
        this.form.constructionTeam = res.data.constructionTeam == 'Yes' ? true : false
        this.form.faultCause = res.data.faultCause
        this.form.faultTypeId = res.data.faultTypeId
        this.form.remark = res.data.remark
      })
    },
    onConfirm (value) {
      this.value = value;
      this.showPicker = false;
    },
    onSubmit () {
      console.log(this.form);
      this.form.constructionTeam = this.form.constructionTeam == false ? 'NO' : 'YES'
      this.workOrderStatus.forEach(item => {
        if (item.label == this.value) {
          this.form.repairStatus = item.value
        }
      })
      this.form.distributeMaintenanceStaffVoList = this.form.distributeMaintenanceStaffVoList.concat(this.responsers)
      let data = this.form
      console.log(data);
      this.$Apis.replenish(data).then(res => {
        if (res.code == '200') {
          Notify({ type: 'success', message: '操作成功' });
          this.$router.push({ path: 'home' })
        } else {
          Notify({
            message: res.msg,
            type: 'danger',
          });
        }
      })
    }
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
}
</style>