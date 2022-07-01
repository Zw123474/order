<template>
  <div>
    <div class="channel-container">
      <div class="title">
        <h3>我的频道</h3>
        <van-button
          size="mini"
          plain
          type="danger"
          round
          @click="isCloseShow = !isCloseShow"
          >{{ isCloseShow ? "完成" : "编辑" }}</van-button
        >
      </div>
      <van-row>
        <van-col span="6" v-for="(item, index) in channels" :key="item.id">
          <div
            class="inner"
            @click="onClick(index)"
            :style="{ color: active === index ? 'red' : '' }"
          >
            {{ item.name }}
            <van-icon
              name="close"
              class="iconclose"
              v-if="index != 0"
              :style="{ color: active === index ? 'red' : '' }"
              @click="del(item.id)"
              v-show="isCloseShow"
            />
          </div>
        </van-col>
      </van-row>
    </div>
    <div class="channel-container">
      <div class="title">
        <h3>推荐频道</h3>
      </div>
      <van-row>
        <van-col span="6" v-for="item in recommendChannels" :key="item.id">
          <div class="inner" van-ellipsis @click="add(item.id)">
            +{{ item.name }}
          </div>
        </van-col>
      </van-row>
    </div>
  </div>
</template>

<script>
import { setItem } from '@/utils/storage'
import { getAllArticleList, saveChannels } from '@/api/home'
const CHANNELS = 'CHANNELS'
export default {
  props: {
    channels: {
      type: Array,
      requied: true
    },
    active: {
      type: Number,
      requied: true
    }
  },
  async created () {
    try {
      const res = await getAllArticleList()
      console.log(res)
      this.recommendChannels = res.data.data.channels.filter(item => this.channels.every(item1 => item1.id !== item.id))
    } catch (err) {
      console.log(err)
    }
  },
  // 原理：
  // var arr = [
  //   { id: 1, name: '吃饭' },
  //   { id: 2, name: '睡觉' },
  //   { id: 3, name: '打豆豆' },
  // ]

  //     var arr1 = [{ id: 2, name: '睡觉' }]

  //     //   filter筛选 every 每一个要符合条件就是true,否则就是false
  //     console.log(
  //   arr.filter((item) => arr1.every((item1) => item1.id !== item.id))
  // )
  data () {
    return {
      recommendChannels: [],
      isCloseShow: false
    }
  },
  methods: {
    add (id) {
      const index = this.recommendChannels.findIndex(item => item.id === id)
      this.channels.push(this.recommendChannels[index])
      this.recommendChannels.splice(index, 1)
    },
    onClick (index) {
      if (this.isCloseShow) {
        if (index === 0) return
        const obj = this.channels[index]
        this.channels.splice(index, 1)
        this.recommendChannels.push(obj)
        if (index < this.active) {
          this.$emit('del-event', this.active - 1)
        }
      } else {
        this.$emit('change-active', index)
      }
    }
  },
  computed: {},
  watch: {
    watch: {
      channels: {
        async handler (newVal) {
          if (this.$store.state.user && this.$store.state.user.token) {
            const arr = []
            newVal.forEach((item, index) => {
              arr.push({ id: item.id, seq: index })
            })
            console.log(arr)
            try {
              const res = await saveChannels(arr)
              console.log(res)
            } catch (err) {
              console.log(err)
            }
            // 登陆过
          } else {
            setItem(CHANNELS, newVal)
          }
        },
        deep: true
      }
    }
  },
  filters: {},
  components: {}
}
</script>

<style scoped lang="less">
.channel-container {
  .title {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding-left: 24px;
    padding-right: 16px;
    margin-bottom: 20px;
    h3 {
      font-size: 32px;
      font-weight: 400;
      color: #333333;
    }
    .van-button {
      width: 104px;
      height: 48px;
      border-radius: 20px;
    }
  }
}
.inner {
  position: relative;
  width: 160px;
  height: 86px;
  border-radius: 6px;
  background: #f4f5f6;
  font-size: 28px;
  font-weight: normal;
  color: #222222;
  text-align: center;
  line-height: 86px;
  margin-left: 13px;
  margin-bottom: 22px;
  .iconclose {
    position: absolute;
    right: 0px;
    top: 0px;
    transform: translate(50%, -50%);
  }
}
</style>
