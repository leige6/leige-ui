export default [{
  path: '/login',
  name: '登录页',
  component: () =>
            import(/* webpackChunkName: "page" */ '@/pages/login/index'),
  meta: {
    keepAlive: true,
    isTab: false,
    isAuth: false
  }
},
{
  path: '/404',
  component: () =>
            import(/* webpackChunkName: "page" */ '@/components/error-page/404'),
  name: '404',
  meta: {
    keepAlive: true,
    isTab: false,
    isAuth: false
  }

},
{
  path: '/403',
  component: () =>
            import(/* webpackChunkName: "page" */ '@/components/error-page/403'),
  name: '403',
  meta: {
    keepAlive: true,
    isTab: false,
    isAuth: false
  }
},
{
  path: '/500',
  component: () =>
            import(/* webpackChunkName: "page" */ '@/components/error-page/500'),
  name: '500',
  meta: {
    keepAlive: true,
    isTab: false,
    isAuth: false
  }
},
{
  path: '*',
  redirect: '/404'
}
]
