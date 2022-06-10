import { ActionTree, MutationTree } from 'vuex'
import { RootState } from '.'

export interface IUser {
  id: string,
  first_name: string,
  last_name: string,
  user_name: string,
  email: string,
  avatar: string,
  status: string,
  in_game: string,
  win: number,
  loose: number,
  rank: number,
  ratio: number,
}

export const state = () => ({
  authUser: {} as IUser,
  users: [] as IUser[],
  // rankList: [] as IUser[],
})

export type UserState = ReturnType<typeof state>

export const mutations: MutationTree<UserState> = {
  FETCH_AUTH: (state, user: IUser) => {
    state.authUser = user
  },
  FETCH: (state, users: IUser[]) => {
    state.users = users
  },
  UPDATE: (state, user: IUser) => {
    state.users = state.users.map(el => el.id === user.id ? user : el)
  },
  DELETE: (state, userID: string) => {
    state.users = state.users.filter(el => el.id !== userID)
  },
}

export const actions: ActionTree<UserState, RootState> = {
  async fetchAuth({ commit }) {
    try {
      const res = await this.$axios.$get(`/users/me`)
      console.log(res)
      commit('FETCH_AUTH', res)
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
  async update({ commit },
    { userID, user }: { userID: string, user: IUser }) {
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
