import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import Vant from 'vant'
// import 'vant/lib/index.css'
import 'vant/lib/index.less'
import 'amfe-flexible'
// import '@/styles/icon.less'
// import '@/styles/reset.less'
import '@/styles/index.less'
import '@/icons' // icon
import * as obj from '@/filters'

import Vconsole from 'vconsole'
let vConsole = new Vconsole()
Vue.use(vConsole)

import Apis from '@/api'
Vue.prototype.$Apis = Apis

Vue.use(Vant)
Object.keys(obj).forEach(key => {
  Vue.filter(key, obj[key])
})
Vue.config.productionTip = false
// Vue.component('MyIcon', MyIcon)
new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
