// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import 'element-ui/lib/theme-chalk/index.css'
import '@/components/element/element-ui'
import '@/components/element/element-ui-theme'
import { loadStyle } from '@/utils/util'
import { urls, iconfontUrl, iconfontVersion } from '@/config/env'
import '@/assets/scss/index.scss'
import App from './App'
import router from './router/index'
import VueRouter from 'vue-router'
import store from './store'
import '@/permission' // permission control
import basicContainer from '@/components/basic-container/main'

// 加载相关url地址
Object.keys(urls).forEach(key => {
  Vue.prototype[key] = urls[key]
})
// 注册全局容器
Vue.component('basicContainer', basicContainer)

// 动态加载阿里云字体库
iconfontVersion.forEach(ele => {
  loadStyle(iconfontUrl.replace('$key', ele))
})
Vue.use(VueRouter)
Vue.config.productionTip = false
// Vue.use(ElementUI, { locale })
/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  store,
  components: { App },
  template: '<App/>'
})
