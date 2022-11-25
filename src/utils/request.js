import axios from 'axios'
import store from '@/store'
import sign from '@/utils/signature'
import qs from 'qs'
const service = axios.create({
  baseURL: '/api'
})


// 全局拦截请求
service.interceptors.request.use(config => {
  // showLoading();
  config.headers.base_token = localStorage.getItem('token');
  // config.headers.base_token = '9fb6e4858fd04f1397c7b3c30907a717';
  // console.log(config);
  // config.headers.verificationCodeKey = localStorage.getItem('ToUserVerificationCodeKey');

  return sign.configure(config)
}, (error) => Promise.reject(error))

// // 添加响应拦截器
// instance.interceptors.response.use(function (response) {
//   // 对响应数据做点什么
//   return response
// }, function (error) {
//   // 对响应错误做点什么
//   return Promise.reject(error)
// })

// 全局拦截响应
service.interceptors.response.use(response => {
  // closeLoading()
  const res = response.data
  if (res.code == 101) {
    localStorage.clear()
    // 重设路由
    resetRouter()
  } else {
    return res
  }

  // 如果接口正常，直接返回数据
  // return json
}, (error) => {
  // closeLoading()
  if (error.name == 'Error') {
    Message.error({
      content: error.msg,
    })
  }
  return Promise.reject(error)
})

// ajax entry
const suffix = '' // 后缀
// nginx 大屏代理
const screenProxy = ''
const ajax = function (obj) {
  // loadOpen()
  const _suffix = obj.suffix !== undefined ? obj.suffix : suffix
  const url = screenProxy + obj.url + _suffix
  const type = obj.type ? obj.type.toUpperCase() : 'POST'
  let params = obj.params
  if (obj.qs !== false && type === 'POST') {
    params = qs.stringify(params)
  } else if (obj.qs == false && type === 'POST') {
    if (url != '/api/verification/file' && url != '/api/verification/img' && url != '/verification/file' && url != '/verification/img') {
      var headers = { headers: { 'Content-Type': 'application/json' } }
    }

  }
  switch (type) {
    case 'GET':
      return service.get(url, { params: params })
    case 'POST':
      return service.post(url, params, headers)
    case 'PUT':
      return service.put(url, params, headers)
    case 'DELETE':
      return service.delete(url, params)
    case 'PATCH':
      return service.patch(url, params, headers)
    default:
  }
}


export default ajax
