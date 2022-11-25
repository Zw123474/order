<template>
  <van-cell-group>
    <van-pull-refresh v-model="refreshing" @refresh="onRefresh" ref="pullrefresh" disabled>
      <van-form @submit="onSubmit" class="searchForm" v-show="formShow">
        <van-cell-group inset>
          <van-field v-model="search.workOrderCode" label="运维工单号" placeholder="请输入运维工单号" />
          <van-field v-model="search.userNumber" label="用户编号查询" placeholder="请输入用户编号查询" />
        </van-cell-group>
        <div style="margin: 16px;">
          <van-button block type="default" native-type="submit" size="normal">
            筛选
          </van-button>
        </div>
      </van-form>
      <div class="popup" :style="popupheight">
        <div class="upPull" @touchstart="touchstart" @touchmove="touchmove" @touchend="touchend">
          <div class="upPullContent"></div>
        </div>
        <van-list :finished="finished" finished-text="没有更多了">
          <!-- <van-cell
          v-for="(item, index) in articleList"
          :key="index"
          :title="item.title"
          value="内容1"
          label="描述信息"
        /> -->
          <!-- <ArticleItem v-for="(item, index) in articleList" :key="index" :article="item"></ArticleItem> -->
          <WorkOrderItem ref="requestData" :workOrderCode="search.workOrderCode" :userNumber="search.userNumber" :title="title" :type="type"></WorkOrderItem>
        </van-list>
      </div>
    </van-pull-refresh>
  </van-cell-group>
</template>

<script>
import WorkOrderItem from './WorkOrderItem.vue'
// let ele = null
// let scrollTop = 0
export default {
  props: {
    title: {
      type: String,
      require: true
    },
    type: {
      type: String,
      require: true
    }
  },
  name: 'WorkOrderList',
  created () {
    // this.getArticleList()
  },
  mounted () {
    // ele = this.$refs.pullrefresh.$el
    // this.$refs.pullrefresh.$el.addEventListener('scroll', function () {
    //   scrollTop = this.scrollTop
    // })
  },
  activated () {
    // ele.scrollTop = scrollTop
  },
  data () {
    return {
      loading: false,
      finished: false,
      list: [],
      refreshing: false,
      isChannelPanelShow: true,
      search: {
        workOrderCode: '',
        userNumber: ''
      },
      /* 移动所需参数 */
      startX: 0,
      startY: 0,
      endX: 0,
      endY: 0,
      isStatus: false,
      popupheight: "height:88%",
      formShow: false
    }
  },
  methods: {
    onSubmit () {
      this.$refs.requestData.getWorkOrderList()
    },
    onRefresh () {
      console.log('下拉刷新了')
      this.loading = true
      this.refreshing = false
    },
    /* 监听滑动开始 */
    touchstart (e) {
      e.preventDefault();
      this.startX = e.touches[0].pageX;
      this.startY = e.touches[0].pageY;
    },
    /* 监听滑动移动 */
    touchmove (e) {
      this.isStatus = true;
      this.endX = e.touches[0].pageX;
      this.endY = e.touches[0].pageY;
    },
    /* 监听滑动结束 */
    touchend (e) {
      /* 判断移动方向 */
      let X = this.endX - this.startX,
        Y = this.endY - this.startY;
      /* 判断是否移动还是点击 */
      if (this.isStatus) {
        if (Y < 0 && Math.abs(Y) > Math.abs(X)) {
          //向上
          this.formShow = false
          this.popupheight = "height:90%"
        } else if (Y > 0 && Math.abs(Y) > Math.abs(X)) {
          //向下
          this.formShow = true
          this.popupheight = "height:63%"
        }
      }
    },
  },
  computed: {
  },
  watch: {},
  filters: {},
  components: { WorkOrderItem }
}
</script>

<style scoped lang="less">
.pannel {
  position: relative;
  height: 100%;
}
.searchForm {
  // margin-top: 80px;
  overflow: hidden;
  position: fixed;
  margin: 0 auto;
  width: 100%;
  top: 10%;
  /deep/.van-field__label{
    color: #94BCFF;
  }
}
.van-cell-group {
  margin-top: 0px;
  background-color: #246dea;
  .searchForm {
    .van-cell {
      background-color: transparent;
    }
  }
}
.popup {
  background-color: #f8f9ff;
  position: fixed;
  bottom: 0;
  border-radius: 50px 50px 0 0;
  overflow: auto;
  width: 100%;
  .upPull {
    width: 100%;
    height: 80px;
    position: sticky;
    z-index: 3;
    top: 0;
    background-color: #f8f9ff;
    .upPullContent {
      width: 10%;
      height: 10px;
      background-color: #d2cfda;
      border-radius: 5px;
      position: absolute;
      top: 30px;
      left: 45%;
    }
  }
}
</style>
