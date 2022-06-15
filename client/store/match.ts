import { ActionTree, MutationTree } from 'vuex'
import { RootState } from '@/store'

export interface IMatch {
  id: string
  FirstPlayer: string
  SecondPlayer: string
  scoreFirstPlayer: number
  scoreSecondPlayer: number
  winner: string
}

export const state = () => ({
  matchs: [] as IMatch[],
})

export type MatchState = ReturnType<typeof state>

export const mutations: MutationTree<MatchState> = {
  FETCH: (state, matchs: IMatch[]) => {
    state.matchs = matchs
  },
}

export const actions: ActionTree<MatchState, RootState> = {
  async fetch({ commit }) {
    try {
      const res = await this.$axios.$get('/matchs')
      commit('FETCH', res)
      return res
    } catch (err) {
      throw err
    }
  },
}
