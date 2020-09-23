/**
 * 基础路由
 * @type { *[] }
 */
export const constantRouterMap = [
  {
    path: '/',
    component: () => import('@/views/layouts/index'),
    // redirect: '/home/parkMes',
    redirect: '/home/login',
    meta: {
      title: '首页',
      keepAlive: false
    },
    children: [
      {
        path: '/home/index',
        name: 'Index',
        component: () => import('@/views/home/index'),
        meta: { title: '首页', keepAlive: false }
      },
      {
        path: '/home/createPark',
        name: 'CreatePark',
        component: () => import('@/views/home/createPark'),
        meta: { title: '车道编辑', keepAlive: false }
      },
      {
        path: '/home/parkMes',
        name: 'ParkMes',
        component: () => import('@/views/home/parkMes'),
        meta: { title: '车场信息', keepAlive: false }
      },
      {
        path: '/home/rate',
        name: 'Rate',
        component: () => import('@/views/home/rate'),
        meta: { title: '银行卡', keepAlive: false }
      },
      {
        path: '/home/parkAuth',
        name: 'ParkAuth',
        component: () => import('@/views/home/parkAuth'),
        meta: { title: '车道配置', keepAlive: false }
      },
      {
        path: '/home/login',
        name: 'Login',
        component: () => import('@/views/home/login'),
        meta: { title: '登录', keepAlive: false }
      },
      // bilRules
      {
        path: '/home/bilRules',
        name: 'BilRules',
        component: () => import('@/views/home/bilRules'),
        meta: { title: '计费', keepAlive: false }
      },
      {
        path: '/home/invoice',
        name: 'Invoice',
        component: () => import('@/views/home/invoice'),
        meta: { title: '电子发票', keepAlive: false }
      },
      {
        path: '/home/agentList',
        name: 'agentList',
        component: () => import('@/views/home/agentList'),
        meta: { title: '代理商列表', keepAlive: false }
      },
      {
        path: '/home/password',
        name: 'Password',
        component: () => import('@/views/home/password'),
        meta: { title: '代理商列表', keepAlive: false }
      },
      {
        path: '/home/map',
        name: 'Map',
        component: () => import('@/views/home/map'),
        meta: { title: '地图', keepAlive: false }
      },
      {
        path: '/home/bind',
        name: 'Bind',
        component: () => import('@/views/home/bind'),
        meta: { title: '地图', keepAlive: false }
      },
      // {
      //   path: '/layouts/homePage',
      //   name: 'HomePage',
      //   component: () => import('@/views/layouts/homePage'),
      //   meta: { title: '计费', keepAlive: false }
      // },
    ]
  },
  // {
  //   path: '/layouts/homePage',
  //   name: 'HomePage',
  //   component: () => import('@/views/layouts/homePage'),
  //   redirect: '/layouts/homePage'
  // }
]
