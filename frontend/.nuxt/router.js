import Vue from 'vue'
import Router from 'vue-router'
import { normalizeURL, decode } from 'ufo'
import { interopDefault } from './utils'
import scrollBehavior from './router.scrollBehavior.js'

const _43a422e5 = () => interopDefault(import('../pages/Account.vue' /* webpackChunkName: "pages/Account" */))
const _43a34d60 = () => interopDefault(import('../pages/Chat.vue' /* webpackChunkName: "pages/Chat" */))
const _63cdee4d = () => interopDefault(import('../pages/Friends.vue' /* webpackChunkName: "pages/Friends" */))
const _1f0e34ea = () => interopDefault(import('../pages/Game.vue' /* webpackChunkName: "pages/Game" */))
const _5554a313 = () => interopDefault(import('../pages/Image.vue' /* webpackChunkName: "pages/Image" */))
const _3de54532 = () => interopDefault(import('../pages/inspire.vue' /* webpackChunkName: "pages/inspire" */))
const _28415f58 = () => interopDefault(import('../pages/Podium.vue' /* webpackChunkName: "pages/Podium" */))
const _3bcf21ac = () => interopDefault(import('../pages/index.vue' /* webpackChunkName: "pages/index" */))

const emptyFn = () => {}

Vue.use(Router)

export const routerOptions = {
  mode: 'history',
  base: '/',
  linkActiveClass: 'nuxt-link-active',
  linkExactActiveClass: 'nuxt-link-exact-active',
  scrollBehavior,

  routes: [{
    path: "/Account",
    component: _43a422e5,
    name: "Account"
  }, {
    path: "/Chat",
    component: _43a34d60,
    name: "Chat"
  }, {
    path: "/Friends",
    component: _63cdee4d,
    name: "Friends"
  }, {
    path: "/Game",
    component: _1f0e34ea,
    name: "Game"
  }, {
    path: "/Image",
    component: _5554a313,
    name: "Image"
  }, {
    path: "/inspire",
    component: _3de54532,
    name: "inspire"
  }, {
    path: "/Podium",
    component: _28415f58,
    name: "Podium"
  }, {
    path: "/",
    component: _3bcf21ac,
    name: "index"
  }],

  fallback: false
}

export function createRouter (ssrContext, config) {
  const base = (config._app && config._app.basePath) || routerOptions.base
  const router = new Router({ ...routerOptions, base  })

  // TODO: remove in Nuxt 3
  const originalPush = router.push
  router.push = function push (location, onComplete = emptyFn, onAbort) {
    return originalPush.call(this, location, onComplete, onAbort)
  }

  const resolve = router.resolve.bind(router)
  router.resolve = (to, current, append) => {
    if (typeof to === 'string') {
      to = normalizeURL(to)
    }
    return resolve(to, current, append)
  }

  return router
}
