<template>
  <div>
    <!-- 登陆后 -->
    <div class="header header-login" v-if="flag">
      <div class="avatar">
        <div class="left">
          <van-image
            width="1.76rem"
            height="1.76rem"
            round
            src="https://img01.yzcdn.cn/vant/cat.jpeg"
          ></van-image>
          <span>黑马头条号</span>
        </div>
        <div class="btn">编辑资料</div>
      </div>
      <ul class="list">
        <li>
          <p>8</p>
          <p>头条</p>
        </li>
        <li>
          <p>8</p>
          <p>头条</p>
        </li>
        <li>
          <p>8</p>
          <p>头条</p>
        </li>
        <li>
          <p>8</p>
          <p>头条</p>
        </li>
      </ul>
    </div>
    <!-- 未登录 -->
    <div class="header header-notlogin" v-else>
      <div class="inner">
        <img src="@/assets/mobile.png" alt="" />
        <p>登录/注册</p>
      </div>
    </div>
    <van-grid :column-num="2">
      <van-grid-item text="收藏">
        <template #icon>
          <i class="toutiao toutiao-shoucang"></i>
        </template>
      </van-grid-item>
      <van-grid-item text="历史">
        <template #icon>
          <i class="toutiao toutiao-lishi"></i>
        </template>
      </van-grid-item>
    </van-grid>
    <van-cell-group>
      <van-cell title="消息通知" is-link/>
      <van-cell title="小智同学" is-link/>
    </van-cell-group>
    <van-button class="logout" type="default" block>退出登录</van-button>
  </div>
</template>

<script>
export default {
  created () { },
  data () {
    return {
      flag: true
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
.header {
  width: 750px;
  height: 400px;
  background: rgb(50, 150, 250, 0.7) url("@/assets/banner.png") no-repeat;
  background-size: cover;
}
.header-notlogin {
  display: flex;
  justify-content: center;
  align-items: center;
  img {
    width: 132px;
    height: 132px;
    margin-bottom: 15px;
  }
  p {
    font-size: 28px;
    font-weight: normal;
    color: #ffffff;
    margin: 0;
    padding: 0;
  }
}
.header-login {
  padding-top: 116px;
  .avatar {
    margin-bottom: 55px;
    padding-left: 32px;
    padding-right: 33px;
    display: flex;
    justify-content: space-between;
    align-items: center;
    .btn {
      width: 115px;
      height: 32px;
      background: #ffffff;
      border-radius: 16px;
      line-height: 32px;
      text-align: center;
      font-size: 20px;
      font-weight: normal;
      color: #666666;
    }
    .left {
      display: flex;
      align-items: center;
      span {
        margin-left: 22px;
        font-size: 30px;
        font-weight: normal;
        color: #fff;
      }
    }
  }
  .list {
    display: flex;
    li {
      flex: 1;
      text-align: center;
      p {
        color: #fff;
        font-weight: normal;
        &:nth-child(1) {
          font-size: 36px;
        }
        &:nth-child(2) {
          font-size: 23px;
        }
      }
    }
  }
}
.toutiao {
  font-size: 45px;
}
.van-grid-item {
  &:nth-child(1) {
    color: #eb5253;
  }
  &:nth-child(2) {
    color: #ff9d1d;
  }
}
/deep/ .van-grid-item__text {
  font-size: 28px;
}
.van-cell-group{
margin: 9px 0;
}
.logout {
  color:#d86262
}
</style>
