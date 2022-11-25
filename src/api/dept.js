import request from '@/utils/request'
//
export default {
  // 获取部门列表
  getDept (data) {
    return request({
      url: '/dept/pageList',
      type: 'get',
      params: data
    })
  },
  // 获取部门同运维人员列表
  getDeptOperator (data) {
    return request({
      url: '/user/list',
      type: 'get',
      params: data
    })
  },
  // 获取产品层级下拉框
  getProductOptions () {
    return request({
      url: '/productLevelEntity/treeOption',
      type: 'get'
      // params: data
    })
  },
}