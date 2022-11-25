<template>
  <div>
    <!-- 一级占位符 -->
    <router-view></router-view>
  </div>
</template>

<script>
import * as dd from 'dingtalk-jsapi';
export default {
  created () {
    this.Dingding()
    this.getNotice()
    // this.getUserInfo()
  },
  data () {
    return {
      // userId:'172026491135077456',  // 部门主管调试
      // userId:'142250454420344787',  // 运维人员调试
      // userId:'010604033233788234',  // 总调度调试
      userId: ''
    }
  },
  methods: {
    Dingding () {
      if (dd.env.platform != 'notInDingTalk') {
        // console.log(111111111111111111111111);
        let _this = this
        dd.ready(function () {
          // console.log(22222222222222222222);
          // dd.ready参数为回调函数，在环境准备就绪时触发，jsapi的调用需要保证在该回调函数触发后调用，否则无效。
          dd.runtime.permission.requestAuthCode({
            corpId: "dingdf914f4d1d753d5cf2c783f7214b6d69",
            onSuccess: (result) => {
              // console.log(3333333333333333333);
              _this.$Apis.login({
                authCode: result.code
              }).then(res => {
                // console.log(44444444444444444444);
                localStorage.setItem('token',res.data.tokenValue)
                // localStorage.getItem('userInfo').userName
                _this.userId = res.data.loginId
                _this.getUserInfo()
                // alert(res)
                // alert(JSON.stringify(res))
              })
            },
            onFail: function (err) {
              // alert(err)
              console.log(err);
            }
          });
        });
      }
    },
    getUserInfo () {
      let data = {
        id: this.userId
      }
      this.$Apis.getUserInfo(data).then(res => {
        console.log(res);
        localStorage.setItem('userInfo', JSON.stringify(res.data))
      })
    },
    getNotice () {
      let data = {
        current: 1,
        size: 999
      }
      this.$Apis.getNotice(data).then(res => {
        console.log(res);
        this.information = res.data.list
        localStorage.setItem('noticeTotal',res.data.total)
      })
    },
  },
  mounted () {
    // this.Dingding()
    // this.getUserInfo()
  },
  computed: {},
  watch: {},
  filters: {},
  components: {}
}
</script>

<style scoped>
</style>
