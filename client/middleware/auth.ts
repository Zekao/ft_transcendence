import { Middleware } from '@nuxt/types'

const auth: Middleware = async ({ $axios, $cookies, redirect, store }) => {
  const accessToken = $cookies.get('access_token')
  if (!accessToken) redirect('/login')
  try {
    const res = await store.dispatch('user/fetchAuth')
    if (res.TwoFA === true) {
      const gToken = $cookies.get('g_token')
      if (!gToken) redirect('/login')
      await $axios.$get('/auth/qrcode/verify').catch(() => redirect('/auth'))
    }
    store.commit('AUTH_SUCCESS', { accessToken })
    console.log(res)
  } catch (err) {
    store.dispatch('logout')
    redirect('/login')
  }
}

export default auth
