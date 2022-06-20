<template>
  <v-card
    height="calc(100% - 76px)"
    color="grey lighten-1"
    class="d-flex justify-center align-center"
  >
    <v-list width="40%">
      <v-list-item class="justify-center align-center">
        <v-list-item-action class="justify-center align-center">
          <v-badge
            v-if="getScoreOne > getScoreTwo"
            color="orange"
            icon="mdi-crown"
            overlap
          >
            <v-avatar>
              <v-img :src="getAvatarOne" />
            </v-avatar>
          </v-badge>
          <v-avatar v-else>
            <v-img :src="getAvatarOne" />
          </v-avatar>
          <v-btn> {{ getPlayerOne }} - {{ getScoreOne }} </v-btn>
        </v-list-item-action>
        <v-list-item-action class="justify-center align-center">
          <v-badge
            v-if="getScoreTwo > getScoreOne"
            color="orange"
            icon="mdi-crown"
            overlap
          >
            <v-avatar>
              <v-img :src="getAvatarTwo" />
            </v-avatar>
          </v-badge>
          <v-avatar v-else>
            <v-img :src="getAvatarTwo" />
          </v-avatar>
          <v-btn> {{ getScoreTwo }} - {{ getPlayerTwo }} </v-btn>
        </v-list-item-action>
      </v-list-item>
      <v-list-item>
        <v-btn
          color="primary"
          class="justify-center align-center"
          @click="resetMatch"
        >
          Continue
        </v-btn>
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
    }),
    getPlayerOne() {
      return this.match.FirstPlayer?.display_name || ''
    },
    getPlayerTwo() {
      return this.match.SecondPlayer?.display_name || ''
    },
    getScoreOne() {
      return this.match.scoreFirstPlayer || 0
    },
    getScoreTwo() {
      return this.match.scoreSecondPlayer || 0
    },
    getAvatarOne() {
      return (
        this.$config.imageUrl +
          this.match.FirstPlayer?.avatar || 'default.png'
      )
    },
    getAvatarTwo() {
      return (
        this.$config.imageUrl +
          this.match.SecondPlayer?.avatar || 'default.png'
      )
    },
  },

  watch: {
    async matchDone(value) {
      if (value) {
        try {
          const res = await this.$axios.$get(`/matchs/${this.selectedMatchId}`)
          this.match = res
        } catch (err: any) {
          if (err.response.status === 401) {
            this.$store.dispatch('logout')
            this.$router.push('/login')
          }
        }
      }
    },
  },

  methods: {
    resetMatch() {
      this.$store.commit('SELECTED_MATCH_ID', '')
      this.$store.commit('MATCH_DONE', false)
      this.$store.commit('SET_VALUE', 1)
      this.$emit('next')
    },
  },
})
</script>
