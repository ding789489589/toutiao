import Vue from 'vue'
import VueRouter from 'vue-router'

Vue.use(VueRouter)

const routes = [
  {
    path:'/login',
    name:'login',
    component:()=> import ('@/views/login')  //懒加载的引入方式,只有访问到login时，才会引入
  },
  {
    path: '/article/:articleId',
    name: 'article',
    component: () => import ('@/views/article'),
    // 将路由动态参数映射到组件的 props 中，更推荐这种做法
    props: true
  },
  {
    path:'/',
    component:()=> import ('@/views/layout'),
    children:[
      {
        path:'',
        component:()=>import ('@/views/home')
      },
      {
        path:'qa',
        component:()=>import ('@/views/qa')
      },
      {
        path:'video',
        component:()=>import ('@/views/video')
      },
      {
        path:'my',
        component:()=>import ('@/views/my')
      }
    ]
  },
  {
    path: '/user/profile',
    component: () => import('@/views/user-profile/index.vue')
  }
 
]

const router = new VueRouter({
  routes
})

export default router
