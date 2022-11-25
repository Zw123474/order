<template>
  <div>
    <!-- 导航栏 -->
    <van-nav-bar class="page-nav-bar" left-arrow title="公告公示" @click-left="$router.back()"></van-nav-bar>
    <!-- /导航栏 -->
    <div class="bluebg">
    </div>
    <div class="main-wrap">
      <div class="banner">
        <img src="@/assets/banner.png" alt="">
      </div>
      <h3>{{noticeDetails.title}}</h3>
      <div class="time">
        <p><van-icon name="clock-o" />{{noticeDetails.createTime}}</p>
        <p><van-icon name="guide-o" />{{noticeDetails.promulgator}}</p>
      </div>
      <div class="info">
        {{noticeDetails.content}}
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
      order: [{ type: '运维工单总数', num: '211' }, { type: '运维工单总数', num: '211' }, { type: '运维工单总数', num: '211' }, { type: '运维工单总数', num: '211' }, { type: '运维工单总数', num: '211' }, { type: '运维工单总数', num: '211' },
      ],
      noticeDetails:{}
    }
  },
  computed: {},
  watch: {
  },
  created () {
    this.getNoticeDetails()
  },
  mounted () { },
  methods: {
    getNoticeDetails () {
      let data = {
        id:this.$route.query.id
      }
      this.$Apis.getNoticeDetails(data).then(res => {
        console.log(res);
        this.noticeDetails = res.data
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
  padding: 50px 50px;
  .banner {
    background-color: #016eff;
  }
  h3{
    font-size: 36px;
    color: #414149;
    font-weight: normal;
    margin-top: 20px;
  }
  .time{
    display: flex;
    font-size: 24px;
    color: #999999;
    margin-top: 20px;
    padding-bottom: 30px;
    border-bottom: 2px solid #C0C4CC;
    p{
      margin-right: 30px;
      .van-icon{
        margin-right:5px
      }
    }
  }
  .info{
    font-size: 24px;
    color: #666666;
    margin-top: 20px;
    word-break: break-all;
    word-wrap: break-word;
    }
}
</style>