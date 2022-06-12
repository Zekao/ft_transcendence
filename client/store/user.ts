import { ActionTree, MutationTree } from 'vuex'
import { RootState } from '@/store'
import { IMatch } from '@/store/match'

export interface IUser {
  id: string
  first_name: string
  last_name: string
  user_name: string
  display_name: string
  email: string
  avatar: string
  TwoFA: boolean
  status: string
  in_game: string
  win: number
  loose: number
  rank: number
  ratio: number
}

export const state = () => ({
  authUser: {} as IUser,
  authUserFriends: [] as IUser[],
  authUserBlocked: [] as IUser[],
  authUserMatches: [] as IMatch[],
  selectedUserMatches: [] as IMatch[],
  users: [] as IUser[],
  // rankList: [] as IUser[],
})

export type UserState = ReturnType<typeof state>

export const mutations: MutationTree<UserState> = {
  FETCH_AUTH: (state, user: IUser) => {
    state.authUser = user
  },
  FETCH_AUTH_FRIENDS: (state, users: IUser[]) => {
    state.authUserFriends = users
  },
  CREATE_AUTH_FRIEND: (state, user: IUser) => {
    state.authUserFriends.push(user)
  },
  DELETE_AUTH_FRIEND: (state, userID: string) => {
    state.authUserFriends = state.authUserFriends.filter(
      (el) => el.id !== userID
    )
  },
  FETCH_AUTH_BLOCKED: (state, users: IUser[]) => {
    state.authUserBlocked = users
  },
  CREATE_AUTH_BLOCKED: (state, user: IUser) => {
    state.authUserBlocked.push(user)
  },
  DELETE_AUTH_BLOCKED: (state, userID: string) => {
    state.authUserBlocked = state.authUserFriends.filter(
      (el) => el.id !== userID
    )
  },
  FETCH_AUTH_MATCHES: (state, matches: IMatch[]) => {
    state.authUserMatches = matches
  },
  FETCH: (state, users: IUser[]) => {
    state.users = users
  },
  FETCH_MATCHES: (state, matches: IMatch[]) => {
    state.selectedUserMatches = matches
  },
  UPDATE_AUTH_AVATAR: (state, userAvatar: string) => {
    state.authUser.avatar = userAvatar + '#' + new Date().getTime()
  },
  UPDATE_AUTH: (state, user: IUser) => {
    state.authUser = user
  },
  UPDATE: (state, user: IUser) => {
    state.users = state.users.map((el) => (el.id === user.id ? user : el))
  },
  DELETE: (state, userID: string) => {
    state.users = state.users.filter((el) => el.id !== userID)
  },
}

export const actions: ActionTree<UserState, RootState> = {
  async fetchAuth({ commit }) {
    try {
      const res = await this.$axios.$get(`/users/me`)
      commit('FETCH_AUTH', res)
      return res
    } catch (err) {
      throw err
    }
  },
  async fetchAuthFriends({ state, commit }) {
    try {
      const res = await this.$axios.$get(`/users/me/friends`)
      commit('FETCH_AUTH_FRIENDS', res)
      return res
    } catch (err) {
      throw err
    }
  },
  async createAuthFriend({ state, commit }, userID: string) {
    try {
      const res = await this.$axios.$post(
        `/users/me/friends?friend=${userID}`
      )
      commit('CREATE_AUTH_FRIEND', res)
      return res
    } catch (err) {
      throw err
    }
  },
  async deleteAuthFriend({ state, commit }, userID: string) {
    try {
      const res = await this.$axios.$delete(
        `/users/me/friends?friend=${userID}`
      )
      commit('DELETE_AUTH_FRIEND', res)
      return res
    } catch (err) {
      throw err
    }
  },
  async fetchAuthBlocked({ state, commit }) {
    try {
      const res = await this.$axios.$get(`/users/me/blocked`)
      commit('FETCH_AUTH_BLOCKED', res)
      return res
    } catch (err) {
      throw err
    }
  },
  async createAuthBlocked({ state, commit }, userID: string) {
    try {
      const res = await this.$axios.$post(
        `/users/me/blocked?blocked=${userID}`
      )
      commit('CREATE_AUTH_BLOCKED', res)
      return res
    } catch (err) {
      throw err
    }
  },
  async deleteAuthBlocked({ state, commit }, userID: string) {
    try {
      const res = await this.$axios.$delete(
        `/users/me/blocked?blocked=${userID}`
      )
      commit('DELETE_AUTH_BLOCKED', res)
      return res
    } catch (err) {
      throw err
    }
  },
  async fetchAuthMatches({ state, commit }) {
    try {
      const res = await this.$axios.$get(`/users/me/matches`)
      commit('FETCH_AUTH_MATCHES', res)
      return res
    } catch (err) {
      throw err
    }
  },
  async fetch({ commit }) {
    try {
      const res = await this.$axios.$get(`/users`)
      commit('FETCH', res)
      return res
    } catch (err) {
      throw err
    }
  },
  async fetchMatches({ commit }, userID: string) {
    try {
      const res = await this.$axios.$get(`/users/${userID}/matches`)
      commit('FETCH_MATCHES', res)
      return res
    } catch (err) {
      throw err
    }
  },
  async updateAuth({ state, commit }, user: IUser) {
    try {
      const res = await this.$axios.$patch(`/users/${state.authUser.id}`, user)
      commit('UPDATE_AUTH', res)
      commit('UPDATE', res)
      return res
    } catch (err) {
      throw err
    }
  },
  async updateAuthAvatar({ commit }, formData: FormData) {
    try {
      const res = await this.$axios.$post(`/users/me/upload`, formData)
      commit('UPDATE_AUTH_AVATAR', res.filename)
      return res
    } catch (err) {
      throw err
    }
  },
  async update({ commit }, { userID, user }: { userID: string; user: IUser }) {
    try {
      const res = await this.$axios.$patch(`/users/${userID}`, user)
      commit('UPDATE', res)
      return res
    } catch (err) {
      throw err
    }
  },
  async delete({ commit }, userID: string) {
    try {
      const res = await this.$axios.$delete(`/users/${userID}`)
      commit('DELETE', userID)
      return res
    } catch (err) {
      throw err
    }
  },
}
