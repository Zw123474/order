import Vue from 'vue'
import VueRouter from 'vue-router'
import Layout from '@/views/Layout'
const Home = () => import('@/views/Home')
const WorkOrderList = () => import('@/views/WorkOrderList-cus')
const Notice = () => import('@/views/Notice')
const My = () => import('@/views/My')
const CheckDetails = () => import('@/views/workOrderDetails/check.vue')
const EditDetails = () => import('@/views/workOrderDetails/edit.vue')
const AddWorkOrder = () => import('@/views/addWorkOrder')
const Replenish = () => import('@/views/workOrderDetails/replenish.vue')
const NoticeDetails = () => import('@/views/Notice/details.vue')

Vue.use(VueRouter)

const routes = [
  {
    path: '/',
    component: Layout,
    redirect: 'home',
    children: [
      { path: 'home', component: Home, name:'home' },
      { path: 'addWorkOrder', component: AddWorkOrder, name: 'addWorkOrder' },
      { path: 'workOrderList', component: WorkOrderList, name: 'workOrderList' },
      { path: 'notice', component: Notice, name:'notice' },
      { path: 'my', component: My, name: 'my' },
      { path: 'editDetails', component: EditDetails, name: 'editDetails' },
      { path: 'checkDetails', component: CheckDetails, name: 'checkDetails' },
      { path: 'replenish', component: Replenish, name: 'replenish' },
      { path: 'noticeDetails', component: NoticeDetails, name: 'noticeDetails' },
    ]
  },
]

const router = new VueRouter({
  routes
})

export default router
