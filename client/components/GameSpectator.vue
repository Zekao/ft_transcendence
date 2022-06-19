<template>
  <v-card height="calc(100% - 114px)" color="grey lighten-1" class="ma-6">
    <v-card
      height="calc(100% - 64px)"
      color="#00000000"
      class="d-flex justify-center align-center pa-4"
    >
      <v-progress-circular
        v-if="$fetchState.pending"
        indeterminate
        color="primary"
      ></v-progress-circular>
      <v-list v-else-if="$fetchState.error">
        <v-list-item dense>Failed to load match history.</v-list-item>
      </v-list>
      <v-list v-else-if="!matchs.length">
        <v-list-item dense>No match yet.</v-list-item>
      </v-list>
      <v-list v-else width="40%">
        <v-list-item v-for="(match, i) in matchs" :key="i">
          <v-list-item>
            <v-btn @click="gameWatcher(match.id)">
              <v-icon> mdi-binoculars </v-icon>
            </v-btn>
          </v-list-item>
          <v-list-item class="justify-center align-center">
            <v-avatar>
              <v-img
                :src="
                  'https://ft.localhost:4500/api/image/' +
                  match.FirstPlayer.avatar
                "
              />
            </v-avatar>
            {{ match.FirstPlayer.display_name }}
          </v-list-item>

          <v-list-item class="justify-center align-center">
            <v-avatar>
              <v-img
                :src="
                  'https://ft.localhost:4500/api/image/' +
                  match.SecondPlayer.avatar
                "
              />
            </v-avatar>
            {{ match.SecondPlayer.display_name }}
          </v-list-item>
        </v-list-item>
      </v-list>
    </v-card>
  </v-card>
</template>

<script lang="ts">
import Vue from 'vue'
import { mapState } from 'vuex'
import { IMatch } from '@/store/match'
import { IUser } from '@/store/user'

export default Vue.extend({
  name: 'GameSpectator',

  data: () => ({
    matchs: [
      {
        id: 'fb85a072-5b90-4a2d-afe9-045cd0335c5e',
        FirstPlayer: {
          display_name: 'lusehair',
          avatar: 'default.png',
        },
        SecondPlayer: {
          display_name: 'gamarcha',
          avatar: 'default.png',
        },
        scoreFirstPlayer: 7,
        scoreSecondPlayer: 4,
        winner: null,
        status: 'ENDED',
      },

      {
        id: 'fb85a072-5b90-4a2d-afe9-045cd0335c5e',
        FirstPlayer: {
          display_name: 'lusehair',
          avatar: 'default.png',
        },
        SecondPlayer: {
          display_name: 'gamarcha',
          avatar: 'default.png',
        },
        scoreFirstPlayer: 7,
        scoreSecondPlayer: 4,
        winner: null,
        status: 'ENDED',
      },

      {
        id: 'fb85a072-5b90-4a2d-afe9-045cd0335c5e',
        FirstPlayer: {
          display_name: 'lusehair',
          avatar: 'default.png',
        },
        SecondPlayer: {
          display_name: 'gamarcha',
          avatar: 'default.png',
        },
        scoreFirstPlayer: 7,
        scoreSecondPlayer: 4,
        winner: null,
        status: 'ENDED',
      },
    ],
  }),

  async fetch() {
    await this.$store.dispatch('user/fetchAuthMatchs')
  },

  computed: {
    ...mapState({
      users: (state: any): IUser[] => state.user.users,
      authUserMatches: (state: any): IMatch[] => state.user.authUserMatches,
      selectedUserMatches: (state: any): IMatch[] =>
        state.user.selectedUserMatches,
    }),
    userMatches(): IMatch[] {
      return this.selectedLogin
        ? this.selectedUserMatches
        : this.authUserMatches
    },
  },

  methods: {
    gameWatcher(gameId: string) {
      // Do somes stuff for redirecting to the game
    },
  },
})
</script>
