import { ActionTree, MutationTree } from 'vuex'

export interface IToken {
  accessToken: string
  refreshToken: string
  expiresAt: string
  issuedAt: string
}

export const state = () => ({
  selectedMatchId: '',
  isFriendMenu: false,
  isAuthenticated: false,
  is2FAuthenticated: false,
  gToken: '',
  token: {} as IToken,
  twoFactorStatus: '',
  authStatus: '',
})

export type RootState = ReturnType<typeof state>

export const mutations: MutationTree<RootState> = {
  SELECTED_MATCH_ID: (state, matchID: string) => {
    state.selectedMatchId = matchID
  },
  FRIEND_MENU: (state, value: boolean) => {
    state.isFriendMenu = value
  },
  AUTH_REQUEST: (state) => {
    state.authStatus = 'loading'
  },
  AUTH_SUCCESS: (state, token: IToken) => {
    state.authStatus = 'success'
    state.isAuthenticated = true
    state.token = token
  },
  AUTH_ERROR: (state) => {
    state.authStatus = 'error'
  },
  AUTH_LOGOUT: (state) => {
    state.authStatus = ''
    state.isAuthenticated = false
    state.token = {} as IToken
    state.twoFactorStatus = ''
    state.is2FAuthenticated = false
    state.gToken = ''
  },
  TWO_FACTOR_REQUEST: (state) => {
    state.twoFactorStatus = 'loading'
  },
  TWO_FACTOR_SUCCESS: (state, gToken: string) => {
    state.twoFactorStatus = 'success'
    state.is2FAuthenticated = true
    state.gToken = gToken
  },
  TWO_FACTOR_ERROR: (state) => {
    state.twoFactorStatus = 'error'
  },
}

export const actions: ActionTree<RootState, RootState> = {
  async login({ commit }, authCode: string) {
    commit('AUTH_REQUEST')
    try {
      const res = await this.$axios.$get(`/auth/callback?code=${authCode}`)
      const { accessToken } = res
      this.$cookies.set('access_token', accessToken)
      commit('AUTH_SUCCESS', res)
      return res
    } catch (err) {
      this.$cookies.removeAll()
      commit('AUTH_ERROR')
      throw err
    }
  },
  async authTwoFactor({ commit }, code: string) {
    commit('TWO_FACTOR_REQUEST')
    try {
      const res = await this.$axios.$post(`/auth/qrcode&gcode=${code}`)
      const { gToken } = res
      this.$cookies.set('g_token', gToken)
      commit('TWO_FACTOR_SUCCESS', gToken)
      return res
    } catch(err) {
      this.$cookies.removeAll()
      commit('TWO_FACTOR_ERROR')
      throw err
    }
  },
  logout({ commit }) {
    this.$cookies.removeAll()
    commit('AUTH_LOGOUT')
  },
}
