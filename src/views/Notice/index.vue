<template>
  <div>
    <!-- 导航栏 -->
    <van-nav-bar class="page-nav-bar" left-arrow title="公告公示" @click-left="$router.back()"></van-nav-bar>
    <!-- /导航栏 -->
    <div class="bluebg">
    </div>
    <div class="main-wrap">
      <van-cell class="noticeCell" v-for="item in information" :key="item.id">
        <h3>【消息】 {{item.title}}</h3>
        <div class="time">
          <p>
            <van-icon name="clock-o" />{{item.createTime}}
          </p>
          <p>
            <van-icon name="guide-o" />{{item.promulgator}}
          </p>
        </div>
        <div class="info">
          {{item.content}}
        </div>
        <van-cell is-link @click="toDetails(item.id)">
          <template #title>
            <span class="custom-title">查看详情</span>
          </template>
        </van-cell>
      </van-cell>
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
      information: []
    }
  },
  computed: {},
  watch: {
  },
  created () {
    this.getNotice()
  },
  mounted () { },
  methods: {
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
    toDetails(id){
      this.$router.push({ path: './noticeDetails', query: { id: id } })
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
  padding: 50px 50px;
  .noticeCell {
    margin-top: 30px;
  }
  .banner {
    background-color: #016eff;
  }
  h3 {
    font-size: 36px;
    color: #414149;
    font-weight: normal;
    margin-top: 20px;
  }
  .time {
    display: flex;
    font-size: 24px;
    color: #999999;
    margin-top: 20px;
    padding-bottom: 30px;
    border-bottom: 2px solid #c0c4cc;
    p {
      margin-right: 30px;
      .van-icon {
        margin-right: 5px;
      }
    }
  }
  .info {
    font-size: 24px;
    color: #666666;
    margin-top: 20px;
    overflow: hidden;
    white-space: nowrap;
    text-overflow: ellipsis;
  }
  .van-cell--clickable{
    padding:20px 0;
  }
}
</style>