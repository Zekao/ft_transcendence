<template>
  <v-card
    height="calc(100% - 76px)"
    color="grey lighten-1"
    class="d-flex flex-column justify-center align-center"
  >
    <v-sheet color="#00000000" class="mb-8">
    <v-btn x-large :loading="waiting" class="mr-4" @click="emitJoin">
      Join queue
    </v-btn>
    <v-btn x-large :disabled="!waiting" @click="emitLeave"> Leave </v-btn>

    </v-sheet>

    <v-list>
      <v-list-item
        v-for="(match, i) in matches"
        :key="i"
        class="my-2">
            <v-btn class="mr-2" @click="gameWatcher(match.id)">
              <v-icon> mdi-binoculars </v-icon>
            </v-btn>

              <v-avatar class="mr-2">
                <v-img :src="'https://ft.localhost:4500/api/image/' + match.FirstPlayer.avatar" />
              </v-avatar>
              <v-btn class="mr-2">
             {{ match.FirstPlayer.display_name }}

              </v-btn>


              <v-avatar class="mr-2">
                 <v-img :src="'https://ft.localhost:4500/api/image/' + match.SecondPlayer.avatar" />
              </v-avatar>
              <v-btn>
              {{ match.SecondPlayer.display_name }}

              </v-btn>
      </v-list-item>
    </v-list>
  </v-card>
</template>

<script lang="ts">
import Vue from 'vue'
import { mapState } from 'vuex'
import { NuxtSocket } from 'nuxt-socket-io'
import { IUser } from '~/store/user'
import { IMatch } from '~/store/match'

export default Vue.extend({
  name: 'GameMatchmaking',

  data: () => ({
    waiting: false,
    ready: false,
    socket: null as NuxtSocket | null,
    matches: [{
      id: 'fb85a072-5b90-4a2d-afe9-045cd0335c5e',
      FirstPlayer: {
        display_name: 'lusehair',
        avatar: 'default.png',
      } as IUser,
      SecondPlayer: {
        display_name: 'gamarcha',
        avatar: 'default.png',
      } as IUser,
      scoreFirstPlayer: 7,
      scoreSecondPlayer: 4,
    }] as IMatch[],
  }),

  computed: {
    ...mapState({
      accessToken: (state: any): string => state.token.accessToken,
      authUser: (state: any): IUser => state.user.authUser,
    }),
  },

  mounted() {
    this.socket = this.$nuxtSocket({
      channel: '/game',
      auth: {
        Authorization: this.accessToken,
        waitinglist: '1',
      },
      path: '/api/socket.io/',
    } as any)
    this.socket.on('wait', (userName, msg, matchID) => {
      if (userName === this.authUser.user_name && msg === 'ready') {
        this.$store.commit('SELECTED_MATCH_ID', matchID)
        this.waiting = false
        this.ready = true
        this.$emit('next')
      }
    })
  },

  methods: {
    emitJoin() {
      if (this.socket) {
        this.waiting = true
        this.socket.emit('action', 'join')
      }
    },
    emitLeave() {
      if (this.socket && this.waiting) {
        this.waiting = false
        this.socket.emit('action', 'leave')
      }
    },
  },
})
</script>
