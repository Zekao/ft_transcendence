import { Middleware } from '@nuxt/types'

const auth: Middleware = async ({ $cookies, redirect, store }) => {
  const accessToken = $cookies.get('access_token')
  if (!accessToken) redirect('/login')
  store.commit('auth/AUTH_SUCCESS', { accessToken })
  try {
    await store.dispatch('user/fetchAuth')
  } catch (err) {
    store.dispatch('auth/logout')
    redirect('/login')
  }
}

export default auth
