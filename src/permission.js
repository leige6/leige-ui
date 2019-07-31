import router from './router'
import store from './store'
import {validatenull} from '@/utils/validate'
import NProgress from 'nprogress' // Progress 进度条
import 'nprogress/nprogress.css'// Progress 进度条样式
import { Message } from 'element-ui'

const whiteList = ['/login'] // 不重定向白名单
router.beforeEach((to, from, next) => {
  console.log(to.fullPath)
  console.log(to.meta.keepAlive)
  // 缓冲设置
  if (to.meta.keepAlive === true && store.state.tags.tagList.some(ele => {
    return ele.value === to.fullPath
  })) {
    to.meta.$keepAlive = true
  } else {
    NProgress.start()
    if (to.meta.keepAlive === true && validatenull(to.meta.$keepAlive)) {
      to.meta.$keepAlive = true
    } else {
      to.meta.$keepAlive = false
    }
  }
  const meta = to.meta || {}
  console.log(JSON.stringify(meta))
  if (store.getters.access_token) {
    if (to.path == '/login') {
      next({ path: '/' })
      NProgress.done()
    } else {
      if (store.getters.roles.length == 0) {
        store.dispatch('GetUserInfo').then(res => { // 拉取用户信息
          next({...to, replace: true})
        }).catch((err) => {
          store.dispatch('FedLogOut').then(() => {
            Message.error(err || 'Verification failed, please login again')
            next({ path: '/' })
          })
        })
      } else {
        const value = to.query.src || to.fullPath
        const label = to.query.name || to.name
        if (meta.isTab !== false && !validatenull(value) && !validatenull(label)) {
          store.commit('ADD_TAG', {
            label: label,
            value: value,
            params: to.params,
            query: to.query,
            keepAlive: to.meta.$keepAlive,
            group: router.$dynamicRouter.group || []
          })
        }
        next()
      }
    }
  } else {
    if (whiteList.indexOf(to.path) !== -1) {
      next()
    } else {
      next('/login')
      NProgress.done()
    }
  }
})

router.afterEach(() => {
  NProgress.done() // 结束Progress
  const title = store.getters.tag.label
  router.$dynamicRouter.setTitle(title)
})
