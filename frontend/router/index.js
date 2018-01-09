import Vue from 'vue'
import Router from 'vue-router'
import dashboard from '../components/dashboard/dashboard.vue'

Vue.use(Router)

export default new Router({
  mode: 'history',
  routes: [
    {
      path: '/job/:name/:build',
      name: 'dashboard',
      component: dashboard
    },
    {
      path: '/job/:name',
      name: 'dashboard',
      component: dashboard
    },
    {
      path: '/job',
      name: 'dashboard',
      component: dashboard
    },
    {
      path: '/',
      redirect: '/job'
    }
  ]
})
