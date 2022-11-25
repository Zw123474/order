import request from '@/utils/request'
// const url = '/api'
export default {
  // 登录
  login (data) {
    return request({
      url: '/user/login',
      method: 'post',
      params: data
    })
  },
  // 上传图片
  uploadImg (data) {
    return request({
      url: '/verification/img',
      method: 'post',
      params: data,
      qs: false
    })
  },
}