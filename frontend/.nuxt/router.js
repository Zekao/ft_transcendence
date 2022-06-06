import Vue from 'vue'
import Router from 'vue-router'
import { normalizeURL, decode } from 'ufo'
import { interopDefault } from './utils'
import scrollBehavior from './router.scrollBehavior.js'

const _908dee36 = () => interopDefault(import('../pages/Account.vue' /* webpackChunkName: "pages/Account" */))
const _62999960 = () => interopDefault(import('../pages/Chat.vue' /* webpackChunkName: "pages/Chat" */))
const _503a5766 = () => interopDefault(import('../pages/Friends.vue' /* webpackChunkName: "pages/Friends" */))
const _0f930eea = () => interopDefault(import('../pages/Game.vue' /* webpackChunkName: "pages/Game" */))
const _756b0913 = () => interopDefault(import('../pages/Image.vue' /* webpackChunkName: "pages/Image" */))
const _9c0ba99c = () => interopDefault(import('../pages/inspire.vue' /* webpackChunkName: "pages/inspire" */))
const _62d4ab58 = () => interopDefault(import('../pages/Podium.vue' /* webpackChunkName: "pages/Podium" */))
const _34abb78a = () => interopDefault(import('../pages/Test.vue' /* webpackChunkName: "pages/Test" */))
const _2d1e7990 = () => interopDefault(import('../pages/test2.vue' /* webpackChunkName: "pages/test2" */))
const _022ed52a = () => interopDefault(import('../pages/index.vue' /* webpackChunkName: "pages/index" */))

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
    component: _908dee36,
    name: "Account"
  }, {
    path: "/Chat",
    component: _62999960,
    name: "Chat"
  }, {
    path: "/Friends",
    component: _503a5766,
    name: "Friends"
  }, {
    path: "/Game",
    component: _0f930eea,
    name: "Game"
  }, {
    path: "/Image",
    component: _756b0913,
    name: "Image"
  }, {
    path: "/inspire",
    component: _9c0ba99c,
    name: "inspire"
  }, {
    path: "/Podium",
    component: _62d4ab58,
    name: "Podium"
  }, {
    path: "/Test",
    component: _34abb78a,
    name: "Test"
  }, {
    path: "/test2",
    component: _2d1e7990,
    name: "test2"
  }, {
    path: "/",
    component: _022ed52a,
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
