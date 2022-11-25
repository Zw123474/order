import request from '@/utils/request'

export default {
  // 登录
  getUserInfo (data) {
    return request({
      url: '/user/query',
      type: 'get',
      params: data
    })
  },
}
