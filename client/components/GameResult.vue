<template>
  <v-card
    height="calc(100% - 76px)"
    color="grey lighten-1"
    class="d-flex justify-center align-center"
  >
    <v-list>
    <v-list-item>
      MatchID: {{ selectedMatchId }}
    </v-list-item>
    <v-list-item>
      <v-btn color="primary" @click="resetMatch"> Continue </v-btn>
    </v-list-item>
    </v-list>
  </v-card>
</template>

<script lang="ts">
import Vue from 'vue'
import { mapState } from 'vuex'
import { IMatch } from '@/store/match'

export default Vue.extend({
  name: 'GameResult',

  data: () => ({
    match: {} as IMatch,
  }),

  computed: {
    ...mapState({
      selectedMatchId: (state: any) => state.selectedMatchId,
      matchDone: (state: any) => state.matchDone,
    })
  },

  watch: {
    async matchDone(value) {
      if (value) {
        try {
          const res = await this.$axios.$get(`/match/${this.selectedMatchId}`)
          this.match = res
        } catch(err) {
          console.log(err)
        }
      }
    }
  },

  methods: {
    resetMatch() {
      this.$store.commit('SELECTED_MATCH_ID', '')
      this.$store.commit('MATCH_DONE', false)
      this.$emit('next')
    }
  }
})
</script>
