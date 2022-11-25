<template>
  <div>
    <!-- 导航栏 -->
    <van-nav-bar class="page-nav-bar" left-arrow title="创建工单" @click-left="$router.back()"></van-nav-bar>
    <!-- /导航栏 -->
    <div class="bluebg"></div>
    <div class="main-wrap">
      <template>
        <div class="title">基础信息</div>
        <van-form ref="myForm">
          <van-field v-model="form.workOrderType" readonly clickable label="运维工单类型" placeholder="选择运维工单类型" @click="workOrderType.showPicker = true" />
          <van-popup v-model="workOrderType.showPicker" round position="bottom">
            <van-picker show-toolbar :columns="workOrderType.columns" @cancel="workOrderType.showPicker = false" @confirm="onConfirm1" />
          </van-popup>
          <van-field required v-model="form.userNumber" label="用户编号" @blur="getUserInfo(form.userNumber)" value="" placeholder="用户编号" />
          <!-- <van-field v-model="form.workOrderCode" label="运维工单编号" placeholder="运维工单编号"/> -->
          <van-field required v-model="form.productLevel" label="产品层级" is-link readonly placeholder="请选择产品层级" @click="productShow = true" />
          <van-popup v-model="productShow" round position="bottom">
            <van-cascader v-model="cascaderValue" title="请选择产品层级" :options="productOptions" @close="productShow = false" :field-names="fieldNames" @finish="onFinish" />
          </van-popup>
          <van-field required v-model="form.repairCategory" label="报修类型" placeholder="报修类型" />
          <van-field v-model="form.repairAddress" label="报修地址" placeholder="报修地址" />
          <van-field required v-model="form.repairContact" label="报修联系人" placeholder="报修联系人" />
          <van-field required v-model="form.repairContactNumber" label="报修联系电话" placeholder="报修联系电话" :rules="[
            { required: true, message: '请输入手机号' },
            { validator, message: '请输入正确的手机号' }
          ]" />
          <van-field v-model="form.repairSource" label="报修来源" placeholder="报修来源" />
          <!-- <van-field v-model="form.repairTime" label="报修时间" /> -->
          <van-field required readonly clickable name="datetimePicker" :value="form.repairTime" label="选择报修时间" placeholder="点击选择报修时间" @click="showRepairTimePicker = true" />
          <van-popup v-model="showRepairTimePicker" position="bottom">
            <van-datetime-picker v-model="currentDate" type="datetime" @confirm="onConfirmRepaireTime" @cancel="showRepairTimePicker = false" />
          </van-popup>
          <van-field v-model="form.areaBelongs" label="所属片区" placeholder="所属片区" />
          <!-- <van-field v-model="form.requireCompletionTime" label="要求完工时间" /> -->
          <van-field required readonly clickable name="datetimePicker" :value="form.requireCompletionTime" label="选择要求完工时间" placeholder="点击选择要求完工时间" @click="showrequireCompletionTimePicker = true" />
          <van-popup v-model="showrequireCompletionTimePicker" position="bottom">
            <van-datetime-picker v-model="currentDate1" type="datetime" @confirm="onConfirmRequireCompletionTime" @cancel="showrequireCompletionTimePicker = false" />
          </van-popup>
          <van-field v-if="form.workOrderType== '特殊'" v-model="form.faultLocation" label="故障地点" placeholder="故障地点" />
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
          <van-field label="默认派发" v-model="empty" clickable @click="form.distributeDepartmentAddFormList = [];empty='默认派发';assign=''" readonly />
          <van-field label="指定派发" v-model="assign" clickable readonly @click="redistributeShow=true" />
        </van-form>
        <van-popup v-model="redistributeShow" get-container="body" round position="bottom" :style="{ height: '60%' }">
          <van-form @submit="onSure">
            <van-field label="选择指定部门" readonly></van-field>
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
              <van-button round block type="info" native-type="submit">确定</van-button>
            </div>
          </van-form>
        </van-popup>
        <div class="title">附件</div>
        <van-form>
          <van-field name="uploader" label="文件上传">
            <template #input>
              <van-uploader :after-read="afterRead" v-model="fileList" />
            </template>
          </van-field>
        </van-form>
        <div class="title">其他备注</div>
        <van-form>
          <van-field type="textarea" v-model="form.faultDescription" rows="3" placeholder="请填写备注信息，字数不超过200字" maxlength="200" show-word-limit />
        </van-form>
        <div style="margin: 16px;">
          <van-button round block type="info" @click="onSubmit">提交</van-button>
        </div>
      </template>
    </div>
  </div>
</template>
<script>
import { Notify } from 'vant'
import website from '@/utils/website'
export default {
  name: 'checkDetails',
  props: {
  },
  data () {
    return {
      fileList: [],
      fieldNames: {
        text: 'label',
        value: 'id',
        children: 'children',
      },
      form: {
        workOrderType: '',
        workOrderCode: '',
        userNumber: '',
        productLevel: '',
        repairCategory: '',
        repairAddress: '',
        repairContact: '',
        repairContactNumber: '',
        repairSource: '',
        repairTime: '',
        areaBelongs: '',
        requireCompletionTime: '',
        faultLocation: '',
        faultDescription: '',
        distributeDepartmentAddFormList: [],
        faultDescription: '',
        annex: ''
      },

      assign: '',
      redistributeShow: false,
      empty: '',
      userNumberInfo: {},
      dept: [],
      departmentIds: [],
      checkboxGroup: [],
      workOrderType: {
        columns: ['常规', '特殊'],
        showPicker: false
      },
      productShow: false,
      productOptions: [],
      cascaderValue: '',
      ids: [],
      showRepairTimePicker: false,
      currentDate: new Date(),
      showrequireCompletionTimePicker: false,
      currentDate1: new Date(),
      annexList: []
    }
  },
  computed: {},
  watch: {
  },
  created () {
  },
  mounted () {
    this.getDept()
    this.getProductOptions()
  },
  methods: {
    // 手机验证
    validator (val) {
      return /^1(?:3\d|4[4-9]|5[0-35-9]|6[67]|7[013-8]|8\d|9\d)\d{8}$/.test(val);
    },
    afterRead (file) {
      console.log(file);
      const addData = new FormData()
      addData.append('file', file.file)
      addData.append('moduleName', 'client')
      this.$Apis.uploadImg(addData).then(res => {
        this.annexList.push(website.imgProxy + res.data)
        console.log(this.form)
      })
    },
    onConfirmRequireCompletionTime (time) {
      // this.repairTime = this.formatTime(time, 'Y--M--D');

      this.showrequireCompletionTimePicker = false;
      this.form.requireCompletionTime =
        this.currentDate1.getFullYear() +
        "-" +
        ((Number(this.currentDate1.getMonth()) + 1) >= 10 ? (Number(this.currentDate1.getMonth()) + 1) : "0" + (Number(this.currentDate1.getMonth()) + 1)) +
        "-" +
        (this.currentDate1.getDate() >= 10 ? this.currentDate1.getDate() : "0" + this.currentDate1.getDate()) +
        " " +
        (this.currentDate1.getHours() >= 10 ? this.currentDate1.getHours() : "0" + this.currentDate1.getHours()) +
        ":" +
        (this.currentDate1.getMinutes() >= 10 ? this.currentDate1.getMinutes() : "0" + this.currentDate1.getMinutes()) +
        ":" +
        (this.currentDate1.getSeconds() >= 10 ? this.currentDate1.getSeconds() : "0" + this.currentDate1.getSeconds())
    },
    onConfirmRepaireTime (time) {
      // this.repairTime = this.formatTime(time, 'Y--M--D');

      this.showRepairTimePicker = false;
      this.form.repairTime =
        this.currentDate.getFullYear() +
        "-" +
        ((Number(this.currentDate.getMonth()) + 1) >= 10 ? (Number(this.currentDate.getMonth()) + 1) : "0" + (Number(this.currentDate.getMonth()) + 1)) +
        "-" +
        (this.currentDate.getDate() >= 10 ? this.currentDate.getDate() : "0" + this.currentDate.getDate()) +
        " " +
        (this.currentDate.getHours() >= 10 ? this.currentDate.getHours() : "0" + this.currentDate.getHours()) +
        ":" +
        (this.currentDate.getMinutes() >= 10 ? this.currentDate.getMinutes() : "0" + this.currentDate.getMinutes()) +
        ":" +
        (this.currentDate.getSeconds() >= 10 ? this.currentDate.getSeconds() : "0" + this.currentDate.getSeconds())
    },
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
    onFinish ({ selectedOptions }) {
      this.productShow = false;
      this.form.productLevel = selectedOptions.map((option) => option.label).join('>');
      this.ids = selectedOptions.map((option) => option.id).join(',');
      console.log(this.ids);
    },
    onConfirm1 (value) {
      this.form.workOrderType = value;
      this.workOrderType.showPicker = false;
    },
    getUserInfo (userNumber) {
      this.userNumberInfo = {}
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
    onSubmit () {
      // console.log(this.ids.length);
      if (this.ids.length == 0) {
        Notify({ type: 'danger', message: '请选择产品层级' });
      } else {
        this.form.workOrderType = this.form.workOrderType == '特殊' ? 'SPECIAL' : 'ROUTINE'
        this.form.productLevel = this.ids
        console.log(this.form);
        console.log(this.cascaderValue);
        this.form.annex = this.annexList.join(',')
        let data = this.form
        console.log(data);
        this.$Apis.save(data).then(res => {
          if (res.code == '200') {
            Notify({ type: 'success', message: '创建成功' });
            this.$router.push({ name: 'home' })
          } else {
            Notify({
              message: res.msg,
              type: 'danger',
            });
          }
        })
      }
    },
    // 获取部门列表 for 重新派发
    getDept () {
      let data = {
        current: 1,
        size: 99
      }
      this.$Apis.getDept(data).then(res => {
        console.log(res);
        console.log(res.data.list);
        this.dept = res.data.list
      })
    },
    toggle (index) {
      this.$refs.checkboxes[index].toggle();
    },
    onSure () {
      this.empty = ''
      this.assign = this.checkboxGroup.join(' ')
      this.form.distributeDepartmentAddFormList = []
      this.checkboxGroup.map(item => {
        this.dept.map(e => {
          if (item === e.name) {
            this.form.distributeDepartmentAddFormList.push({ departmentName: e.name, departmentId: e.id })
          }
        })
      })
      this.redistributeShow = false
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
  /deep/.van-checkbox__icon {
    height: 1.5em;
  }
}
</style>
