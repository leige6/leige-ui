import Layout from '@/pages/main/main'
export default [{
  path: '/',
  component: Layout,
  redirect: '/home',
  children: [{
    path: 'home',
    name: 'home',
    component: () => import('@/pages/home/index')
  },
  {
    path: 'demo-echarts',
    name: 'demo-echarts',
    component: () => import('@/pages/demo/echarts'),
    meta: {title: 'demo', icon: 'demo', isTab: true}
  }]
},
{
  path: '/myiframe',
  component: Layout,
  redirect: '/myiframe',
  children: [{
    path: ':routerPath',
    name: 'iframe',
    component: () => import('@/components/iframe/main'),
    props: true
  }]
}]
