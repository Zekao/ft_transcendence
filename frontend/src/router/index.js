import Vue from 'vue'
import Router from 'vue-router'
import Account from '../views/Account.vue'
import Podium from '../views/Podium.vue'
import Game from '../views/Game.vue'
import Chat from '../views/Chat.vue'
import Friends from '../views/Friends.vue'
import Connection from '../views/Connection.vue'


Vue.use(Router)

// const routes = [
//   {
//     path: '/',
//     name: 'home',
//     component: HomeView
//   },
//   {
//     path: '/about',
//     name: 'about',
//     // route level code-splitting
//     // this generates a separate chunk (about.[hash].js) for this route
//     // which is lazy-loaded when the route is visited.
//     component: () => import(/* webpackChunkName: "about" */ '../views/AboutView.vue')
//   }
// ]

export default new Router({
  mode: 'history',
  base: process.env.BASE_URL,
  routes: [
    {
      path: '/', 
      name: 'connection', 
      component: Connection
    },
    {
      path: '/Account', 
      name: 'account', 
      component: Account
    }, 
    {
      path: '/Podium', 
      name: 'podium', 
      component: Podium
    },
    {
      path: '/Game', 
      name: 'Game', 
      component: Game
    },
    {
      path: '/Chat', 
      name: 'chat', 
      component: Chat 
    }, 
    {
      path: '/Friends', 
      name: 'friends', 
      component: Friends 
    }, 
  ]
})

