import request from '@/utils/request'

export default {
  // 获取一机一档用户信息
  getUserNumberInfo (data) {
    return request({
      url: '/userInfoEntity/pageList',
      type: 'get',
      params: data
    })
  },
}