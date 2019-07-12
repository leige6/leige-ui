import Layout from '@/pages/index/layout'
export default [{
  path: '/wel',
  component: Layout,
  redirect: '/wel/index',
  children: [{
    path: 'index',
    name: '首页',
    component: () =>
            import(/* webpackChunkName: "views" */ '@/pages/wel')
  }]
}]
