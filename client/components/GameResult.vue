<template>
  <v-card
    height="calc(100% - 76px)"
    color="grey lighten-1"
    class="d-flex justify-center align-center"
  >
    <v-list width="40%">
      <v-list-item>
        <v-list-item-action class="justify-center align-center">
          <v-badge
            v-if="getScoreOne() > getScoreTwo()"
            color="orange"
            icon="mdi-crown"
            overlap
          >
            <v-avatar>
              <v-img src=getAvatarTwo() />
            </v-avatar>
          </v-badge>
          <v-avatar v-else>
            <v-img src=getAvatarOne() />
          </v-avatar>
          <v-btn> {{getPlayerOne()}}   {{getScoreOne()}}</v-btn>
        </v-list-item-action>
        <v-list-item-content class="justify-center">
          <!-- {{ getPlayerOne() }} - {{ getPlayerTwo() }} -->
        </v-list-item-content>
        <v-list-item-action class="justify-center align-center">
          <v-badge
            v-if="getScoreTwo() > getScoreOne()"
            color="orange"
            icon="mdi-crown"
            overlap
          >
            <v-avatar>
              <v-img src="getAvatarOne" />
            </v-avatar>
          </v-badge>
          <v-avatar v-else>
            <v-img src="getAvatarTwo" />
          </v-avatar>
          <v-btn> {{getScoreTwo()}}   {{getPlayerTwo() }} </v-btn>
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
   // match: {} as IMatch,
   match: {
    id: 'fb85a072-5b90-4a2d-afe9-045cd0335c5e',
    FirstPlayer: {
      display_name: 'lusehair',
      avatar: 'default.png'
    },
    SecondPlayer: {
      display_name: 'gamarcha',
      avatar: 'default.png'
    },
    scoreFirstPlayer: 7,
    scoreSecondPlayer: 4,
    winner: null,
    status: 'ENDED'
   }
  }),

  computed: {
    ...mapState({
      selectedMatchId: (state: any) => state.selectedMatchId,
      matchDone: (state: any) => state.matchDone,
    }),
  },

  watch: {
    async matchDone(value) {
      if (value) {
        try {
          const res = await this.$axios.$get(`/match/${this.selectedMatchId}`)
          this.match = res
          console.log(res)
        } catch (err) {
          console.log(err)
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

    getPlayerOne() {
      return this.match.FirstPlayer?.display_name || 'Superman'
    },

    getPlayerTwo() {
      return this.match.SecondPlayer?.display_name || 'Homelander'
    },

    getScoreOne() {
      return this.match.scoreFirstPlayer || 69
    },

    getScoreTwo() {
      return this.match.scoreSecondPlayer || 64
    },

    getAvatarOne() {
      return (
        'https://ft.localhost:4500/api/image/' +
        this.match.FirstPlayer?.avatar || 'default.png'
      )
    },

    getAvatarTwo() {
      return (
        'https://ft.localhost:4500/api/image/' +
        this.match.SecondPlayer?.avatar || 'default.png'
      )
    },
  },
})
</script>
