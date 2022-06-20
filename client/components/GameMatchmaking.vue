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

    <v-list v-if="!matches.length">
      <v-list-item>No matches to spectate.</v-list-item>
    </v-list>

    <v-list>
      <v-list-item v-for="(match, i) in matches" :key="i" class="my-2">
        <v-btn class="mr-2" @click="gameWatcher(match.id)">
          <v-icon> mdi-binoculars </v-icon>
        </v-btn>

        <v-avatar class="mr-2">
          <v-img :src="getAvatarPath(match.FirstPlayer)" />
        </v-avatar>
        <v-btn class="mr-2">
          {{ getLogin(match.FirstPlayer) }}
        </v-btn>

        <v-avatar class="mr-2">
          <v-img :src="getAvatarPath(match.SecondPlayer)" />
        </v-avatar>
        <v-btn>
          {{ getLogin(match.SecondPlayer) }}
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
    matches: [] as IMatch[],
  }),

  async fetch() {
    try {
      const res = await this.$axios.$get('/matchs?status=STARTED')
      this.matches = res
    } catch (err: any) {
      if (err.response.status === 401) {
        this.$store.dispatch('logout')
        this.$router.push('/login')
      }
    }
  },

  computed: {
    ...mapState({
      accessToken: (state: any): string => state.token.accessToken,
      username: (state: any): string => state.user.authUser.user_name,
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
    this.socket.on('wait', async (username1, username2, msg, matchID) => {
      if (msg === 'ready') {
        if (this.username === username1 || this.username === username2) {
          this.$store.commit('SELECTED_MATCH_ID', matchID)
          this.waiting = false
          this.ready = true
          this.$emit('next')
        }
        try {
          const res = await this.$axios.$get(`/matchs/${matchID}`)
          this.matches.push(res)
        } catch (err: any) {
          if (err.response.status === 401) {
            this.$store.dispatch('logout')
            this.$router.push('/login')
          }
        }
      }
    })
    this.socket.on('gameAction', (matchID, msg) => {
      if (msg === 'FINISH') {
        this.matches = this.matches.filter((el) => el.id !== matchID)
      }
    })
  },

  methods: {
    getLogin(user: IUser): string {
      return user?.display_name || ''
    },
    getAvatarPath(user: IUser): string {
      return (
        'https://ft.localhost:4500/api/image/' + user?.avatar || 'default.png'
      )
    },
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
    gameWatcher(matchID: string) {
      this.$store.commit('SELECTED_MATCH_ID', matchID)
      this.waiting = false
      this.ready = true
      this.$emit('next')
    },
  },
})
</script>
