import axios from 'axios'
import { Message } from 'element-ui'
import {serialize} from '@/utils/util'
import {getStore} from '@/utils/store'
import store from '../store'
import router from '@/router/index'
import errorCode from '@/const/errorCode'
axios.defaults.timeout = 15000
// 返回其他状态吗
axios.defaults.validateStatus = function (status) {
  return status >= 200 && status <= 500 // 默认的
}
// 跨域请求，允许保存cookie
axios.defaults.withCredentials = true /
// request拦截器
axios.interceptors.request.use(config => {
  const TENANT_ID = getStore({name: 'tenantId'})
  const isToken = (config.headers || {}).isToken === false
  let token = store.getters.access_token
  if (token && !isToken) {
    config.headers['Authorization'] = 'Bearer ' + token// token
  }
  if (TENANT_ID) {
    config.headers['TENANT_ID'] = TENANT_ID // 租户ID
  }
  // headers中配置serialize为true开启序列化
  if (config.methods === 'post' && config.headers.serialize) {
    config.data = serialize(config.data)
    delete config.data.serialize
  }
  return config
}, error => {
  return Promise.reject(error)
})

// respone拦截器
axios.interceptors.response.use(
  response => {
  /**
  * code为非200是抛错 可结合自己业务进行修改
  */
    const status = Number(response.status) || 200
    const message = response.data.msg || errorCode[status] || errorCode['default']
    if (status === 401) {
      store.dispatch('FedLogOut').then(() => {
        router.push({path: '/login'})
      })
      return
    }
    if (status !== 200 || response.data.code === 1) {
      Message({
        message: message,
        type: 'error'
      })
      return Promise.reject(new Error(message))
    }
    return response
  },
  error => {
    const status = error.response.status
    const message = errorCode[status] || error.response.message || errorCode['default']
    Message({
      message: message,
      type: 'error',
      duration: 3 * 1000
    })
    return Promise.reject(error)
  }
)

export default axios
