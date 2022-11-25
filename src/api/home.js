import request from '@/utils/request'

export default {
  // 获取工单列表
  getWorkOrder (data) {
    return request({
      url: '/maintenanceWorkOrderEntity/pageList',
      type: 'get',
      params: data
    })
  },
  // 工单列表详情
  getWorkOrderDetails (data) {
    return request({
      url: '/maintenanceWorkOrderEntity/details',
      type: 'get',
      params: data
    })
  },
  // 部门主管给运维人员派单
  assignOrders (data) {
    return request({
      url: '/maintenanceWorkOrderEntity/assignOrders',
      method: 'post',
      params: data
    })
  },
  // 运维人员修改工单状态（处理完成待结单）
  completePending (data) {
    return request({
      url: '/maintenanceWorkOrderEntity/completePending',
      method: 'post',
      params: data
    })
  },
  // 总调度编辑运维工单
  bossEdit (data) {
    return request({
      url: '/maintenanceWorkOrderEntity/edit',
      method: 'post',
      params: data,
      qs: false
    })
  },
  // 总调度审核运维工单时完结工单
  bossFinish (data) {
    return request({
      url: '/maintenanceWorkOrderEntity/finish',
      method: 'post',
      params: data
    })
  },
  // 运维人员接单
  receiveOrder (data) {
    return request({
      url: '/maintenanceWorkOrderEntity/receiveOrder',
      method: 'post',
      params: data
    })
  },
  // 总调度在退回状态工单重新派发
  redistribute (data) {
    return request({
      url: '/maintenanceWorkOrderEntity/redistribute',
      method: 'post',
      params: data
    })
  },
  // 运维人员补充字段信息
  replenish (data) {
    return request({
      url: '/maintenanceWorkOrderEntity/replenish',
      method: 'post',
      params: data,
      qs: false
    })
  },
  // 部门主管退回工单
  returnWorkOrder (data) {
    return request({
      url: '/maintenanceWorkOrderEntity/returnWorkOrder',
      method: 'post',
      params: data
    })
  },
  // 部门主管撤销退回工单
  revoke (data) {
    return request({
      url: '/maintenanceWorkOrderEntity/revoke',
      method: 'post',
      params: data
    })
  },
  // 运维人员撤销处理完成待结单运维工单接口
  revokeCompletePending (data) {
    return request({
      url: '/maintenanceWorkOrderEntity/revokeCompletePending',
      method: 'post',
      params: data
    })
  },
  // 总调度新增运维工单接口
  save (data) {
    return request({
      url: '/maintenanceWorkOrderEntity/save',
      method: 'post',
      params: data,
      qs: false
    })
  },
  // 总调度驳回运维工单接口
  turnDown (data) {
    return request({
      url: '/maintenanceWorkOrderEntity/turnDown',
      method: 'post',
      params: data
    })
  },
}
