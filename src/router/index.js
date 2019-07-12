import VueRouter from 'vue-router'
import PageRouter from './page/'
import ViewsRouter from './views/'
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
Router.addRoutes([...PageRouter, ...ViewsRouter])
export default Router
