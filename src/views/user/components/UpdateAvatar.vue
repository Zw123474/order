<template>
  <div>
    <img :src="imgSrc" ref="img" />
    <van-button @click="onConfirm">确定</van-button>
  </div>
</template>

<script>
import 'cropperjs/dist/cropper.css'
import Cropper from 'cropperjs'
import { updateAvatar } from '@/api/user'
let cropper = null
export default {
  mounted () {
    const image = this.$refs.img
    cropper = new Cropper(image, {
      viewMode: 1, // 只能在裁剪的图片范围内移动
      dragMode: 'move', // 画布和图片都可以移动
      aspectRatio: 1, // 裁剪区默认正方形
      autoCropArea: 1, // 自动调整裁剪图片
      cropBoxMovable: false, // 禁止裁剪区移动
      cropBoxResizable: false, // 禁止裁剪区缩放
      background: false // 关闭默认背景
    })
    console.log(cropper)
  },
  props: {
    imgSrc: {
      type: String,
      required: true
    }
  },
  created () { },
  data () {
    return {}
  },
  methods: {
    onConfirm () {
      cropper.getCroppedCanvas().toBlob(async file => {
        const fd = new FormData()
        fd.append('photo', file)
        try {
          const res = await updateAvatar(fd)
          console.log(res)
          this.$emit('update:imgSrc', res.data.data.photo)
          this.$emit('close')
        } catch (err) {
          console.log(err)
        }
      })
    }
  },
  computed: {},
  watch: {},
  filters: {},
  components: {}
}
</script>

<style scoped lang='less'>
</style>
