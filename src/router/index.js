import Vue from 'vue'
import Router from 'vue-router'
import login from '@/pages/login/index'

Vue.use(Router)

export const constantRouterMap = [
  {
    path: '/login',
    name: 'login',
    component: login
  }
]

export default new Router({
  routes: constantRouterMap
})
