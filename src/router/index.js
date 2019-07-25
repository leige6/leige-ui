import VueRouter from 'vue-router'
import DynamicRouter from './dynamic-router'
import PageRouter from './page/'
import ViewsRouter from './views/'
import Store from '../store/'
let Router = new VueRouter({
  scrollBehavior (to, from, savedPosition) {
    if (savedPosition) {
      return savedPosition
    } else {
      if (from.meta.keepAlive) {
        from.meta.savedPosition = document.body.scrollTop
      }
      return {
        x: 0,
        y: to.meta.savedPosition || 0
      }
    }
  },
  routes: [].concat([])
})
DynamicRouter.install(Router, Store)
Router.$dynamicRouter.formatRoutes(Store.state.user.menu, true)
Router.addRoutes([...PageRouter, ...ViewsRouter])
export default Router
