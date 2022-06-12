import { ActionTree, MutationTree } from 'vuex'
import { RootState } from '@/store'

export interface IChannel {
  id: string
  name: string
  status: string
  permissions: string
  password: string
}

export const state = () => ({
  channels: [] as IChannel[],
})

export type ChannelState = ReturnType<typeof state>

export const mutations: MutationTree<ChannelState> = {
  FETCH: (state, channels: IChannel[]) => {
    state.channels = channels
  },
  CREATE: (state, channel: IChannel) => {
    state.channels.push(channel)
  },
  UPDATE: (state, channel: IChannel) => {
    state.channels = state.channels.map((el) =>
      el.id === channel.id ? channel : el
    )
  },
  DELETE: (state, channelID: string) => {
    state.channels = state.channels.filter((el) => el.id !== channelID)
  },
}

export const actions: ActionTree<ChannelState, RootState> = {
  async fetch({ commit }) {
    try {
      const res = await this.$axios.$get(`/channel`)
      commit('FETCH', res)
      return res
    } catch (err) {
      throw err
    }
  },
  async create({ commit }, channel: IChannel) {
    try {
      const res = await this.$axios.$post(`/channel/create`, channel)
      commit('CREATE', res)
      return res
    } catch (err) {
      throw err
    }
  },
  async update(
    { commit },
    { channelID, channel }: { channelID: string; channel: IChannel }
  ) {
    try {
      const res = await this.$axios.$patch(`/channels/${channelID}`, channel)
      commit('UPDATE', res)
      return res
    } catch (err) {
      throw err
    }
  },
  async delete({ commit }, channelID: string) {
    try {
      const res = await this.$axios.$delete(`/channels/${channelID}`)
      commit('DELETE', channelID)
      return res
    } catch (err) {
      throw err
    }
  },
}
