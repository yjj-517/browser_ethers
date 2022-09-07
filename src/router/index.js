import Vue from 'vue'
import VueRouter from 'vue-router'

Vue.use(VueRouter)

const routes = [
  {
    path: '/',
    name: 'Home',
    component: () => import('../views/Home.vue')
  },
  {
    path: '/Address',
    name: 'Address',
    component: () => import('../views/Address.vue')
  },
  {
    path: '/Block',
    name: 'Block',
    component: () => import('../views/Block.vue')
  },
  {
    path: '/Transaction',
    name: 'Transaction',
    component: () => import('../views/Transaction.vue')
  },
  {
    path: '/Ceshi',
    name: 'Ceshi',
    component: () => import('../views/Ceshi.vue')
  },
]

const router = new VueRouter({
  routes
})

export default router

