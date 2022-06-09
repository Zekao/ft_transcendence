import Vue from 'vue'
import Router from 'vue-router'
import { normalizeURL, decode } from 'ufo'
import { interopDefault } from './utils'
import scrollBehavior from './router.scrollBehavior.js'

const _35b554ed = () => interopDefault(import('../pages/Account.vue' /* webpackChunkName: "pages/Account" */))
const _5751a448 = () => interopDefault(import('../pages/Chat.vue' /* webpackChunkName: "pages/Chat" */))
const _55df2055 = () => interopDefault(import('../pages/Friends.vue' /* webpackChunkName: "pages/Friends" */))
const _cf9d003c = () => interopDefault(import('../pages/Game.vue' /* webpackChunkName: "pages/Game" */))
const _009ab71b = () => interopDefault(import('../pages/Image.vue' /* webpackChunkName: "pages/Image" */))
const _2ff6773a = () => interopDefault(import('../pages/inspire.vue' /* webpackChunkName: "pages/inspire" */))
const _57062649 = () => interopDefault(import('../pages/login.vue' /* webpackChunkName: "pages/login" */))
const _ad488568 = () => interopDefault(import('../pages/Podium.vue' /* webpackChunkName: "pages/Podium" */))
const _0cac3669 = () => interopDefault(import('../pages/Profile.vue' /* webpackChunkName: "pages/Profile" */))
const _468493da = () => interopDefault(import('../pages/Register.vue' /* webpackChunkName: "pages/Register" */))
const _856baefc = () => interopDefault(import('../pages/Test.vue' /* webpackChunkName: "pages/Test" */))
const _74a07140 = () => interopDefault(import('../pages/test2.vue' /* webpackChunkName: "pages/test2" */))
const _e542f99c = () => interopDefault(import('../pages/index.vue' /* webpackChunkName: "pages/index" */))

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
    component: _35b554ed,
    name: "Account"
  }, {
    path: "/Chat",
    component: _5751a448,
    name: "Chat"
  }, {
    path: "/Friends",
    component: _55df2055,
    name: "Friends"
  }, {
    path: "/Game",
    component: _cf9d003c,
    name: "Game"
  }, {
    path: "/Image",
    component: _009ab71b,
    name: "Image"
  }, {
    path: "/inspire",
    component: _2ff6773a,
    name: "inspire"
  }, {
    path: "/login",
    component: _57062649,
    name: "login"
  }, {
    path: "/Podium",
    component: _ad488568,
    name: "Podium"
  }, {
    path: "/Profile",
    component: _0cac3669,
    name: "Profile"
  }, {
    path: "/Register",
    component: _468493da,
    name: "Register"
  }, {
    path: "/Test",
    component: _856baefc,
    name: "Test"
  }, {
    path: "/test2",
    component: _74a07140,
    name: "test2"
  }, {
    path: "/",
    component: _e542f99c,
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
