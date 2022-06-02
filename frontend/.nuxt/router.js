import Vue from 'vue'
import Router from 'vue-router'
import { normalizeURL, decode } from 'ufo'
import { interopDefault } from './utils'
import scrollBehavior from './router.scrollBehavior.js'

const _64dd30ae = () => interopDefault(import('../pages/Account.vue' /* webpackChunkName: "pages/Account" */))
const _7a2f6fb2 = () => interopDefault(import('../pages/Chat.vue' /* webpackChunkName: "pages/Chat" */))
const _f5f207d4 = () => interopDefault(import('../pages/Friends.vue' /* webpackChunkName: "pages/Friends" */))
const _03c823c1 = () => interopDefault(import('../pages/Game.vue' /* webpackChunkName: "pages/Game" */))
const _5f1e52fb = () => interopDefault(import('../pages/inspire.vue' /* webpackChunkName: "pages/inspire" */))
const _ec4e352a = () => interopDefault(import('../pages/Podium.vue' /* webpackChunkName: "pages/Podium" */))
const _d6c7499a = () => interopDefault(import('../pages/index.vue' /* webpackChunkName: "pages/index" */))

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
    component: _64dd30ae,
    name: "Account"
  }, {
    path: "/Chat",
    component: _7a2f6fb2,
    name: "Chat"
  }, {
    path: "/Friends",
    component: _f5f207d4,
    name: "Friends"
  }, {
    path: "/Game",
    component: _03c823c1,
    name: "Game"
  }, {
    path: "/inspire",
    component: _5f1e52fb,
    name: "inspire"
  }, {
    path: "/Podium",
    component: _ec4e352a,
    name: "Podium"
  }, {
    path: "/",
    component: _d6c7499a,
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
