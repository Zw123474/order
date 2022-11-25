import request from '@/utils/request'

export default {
  // 获取部门列表
  getNotice (data) {
    return request({
      url: '/announcementEntity/pageList',
      type: 'get',
      params: data
    })
  },
  // 获取部门同运维人员列表
  getNoticeDetails (data) {
    return request({
      url: '/announcementEntity/details',
      type: 'get',
      params: data
    })
  },
}