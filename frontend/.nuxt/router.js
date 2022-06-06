import Vue from 'vue'
import Router from 'vue-router'
import { normalizeURL, decode } from 'ufo'
import { interopDefault } from './utils'
import scrollBehavior from './router.scrollBehavior.js'

const _2bff9940 = () => interopDefault(import('../pages/Account.vue' /* webpackChunkName: "pages/Account" */))
const _400992b5 = () => interopDefault(import('../pages/Chat.vue' /* webpackChunkName: "pages/Chat" */))
const _0a29fec8 = () => interopDefault(import('../pages/Friends.vue' /* webpackChunkName: "pages/Friends" */))
const _fe2d2362 = () => interopDefault(import('../pages/Game.vue' /* webpackChunkName: "pages/Game" */))
const _2ee0964e = () => interopDefault(import('../pages/Image.vue' /* webpackChunkName: "pages/Image" */))
const _377d54a6 = () => interopDefault(import('../pages/inspire.vue' /* webpackChunkName: "pages/inspire" */))
const _43d1c479 = () => interopDefault(import('../pages/Podium.vue' /* webpackChunkName: "pages/Podium" */))
const _b3fbd222 = () => interopDefault(import('../pages/Test.vue' /* webpackChunkName: "pages/Test" */))
const _ba335f1a = () => interopDefault(import('../pages/test2.vue' /* webpackChunkName: "pages/test2" */))
const _88b73b36 = () => interopDefault(import('../pages/index.vue' /* webpackChunkName: "pages/index" */))

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
    component: _2bff9940,
    name: "Account"
  }, {
    path: "/Chat",
    component: _400992b5,
    name: "Chat"
  }, {
    path: "/Friends",
    component: _0a29fec8,
    name: "Friends"
  }, {
    path: "/Game",
    component: _fe2d2362,
    name: "Game"
  }, {
    path: "/Image",
    component: _2ee0964e,
    name: "Image"
  }, {
    path: "/inspire",
    component: _377d54a6,
    name: "inspire"
  }, {
    path: "/Podium",
    component: _43d1c479,
    name: "Podium"
  }, {
    path: "/Test",
    component: _b3fbd222,
    name: "Test"
  }, {
    path: "/test2",
    component: _ba335f1a,
    name: "test2"
  }, {
    path: "/",
    component: _88b73b36,
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
