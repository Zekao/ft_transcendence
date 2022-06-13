import { ActionTree, MutationTree } from 'vuex'
import { RootState } from '@/store'

export interface IMatch {
  id: string
  FirstPlayer: string,
  SecondPlayer: string,
  scoreFirstPlayer: number,
  scoreSecondPlayer: number,
  winner: string
}

export const state = () => ({
  matches: [] as IMatch[],
})

export type MatchState = ReturnType<typeof state>

export const mutations: MutationTree<MatchState> = {
  FETCH: (state, matches: IMatch[]) => {
    state.matches = matches
  },
}

export const actions: ActionTree<MatchState, RootState> = {
  async fetch({ commit }) {
    try {
      const res = await this.$axios.$get('/matches')
      commit('FETCH', res)
      return res
    } catch(err) {
      throw err
    }
  }
}
