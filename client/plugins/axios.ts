import { Plugin } from '@nuxt/types'

const axios: Plugin = ({ $cookies, $axios }) => {
  $axios.onRequest((config) => {
    const accessToken = $cookies.get('access_token')
    if (accessToken) config.headers.Authorization = 'Bearer ' + accessToken
  })
}

export default axios
