<template>
  <v-card
    height="calc(100% - 76px)"
    color="grey lighten-1"
    class="d-flex d-flex-column justify-center align-center"
  >
    <v-btn x-large :loading="waiting" class="mr-4" @click="emitJoin">
      Join queue
    </v-btn>
    <v-btn x-large :disabled="!waiting" @click="emitLeave"> Leave </v-btn>

    <!-- IMPLEMENT LIST OF MATCHS PENDING -->
    <!-- SAME HAS FRIENDLIST BUT FROM MATCH TABLE WITH STARTED STATUS  -->
    <!-- DONT FORGET TO SHOW ONLY GAMES WITH NON_BLOCKED USER -->

    <!-- <v-list>
    <v-subheader> Watch current games </v-subheader>
    <v-list-item
      v-for="(match, i) in matches"
      :key="i"
      three-line
      class="d-flex d-flex-column"> 
      
      
      
      
      </v-list-item>
  </v-list> -->
  </v-card>
</template>

<script lang="ts">
import Vue from 'vue'
import { mapState } from 'vuex'
import { NuxtSocket } from 'nuxt-socket-io'
import { IUser } from '~/store/user'
// import { IMatch } from '~/store/match'

export default Vue.extend({
  name: 'GameMatchmaking',

  data: () => ({
    waiting: false,
    ready: false,
    socket: null as NuxtSocket | null,
    // matches: [] as IMatch[],
  }),

  computed: {
    ...mapState({
      accessToken: (state: any): string => state.token.accessToken,
      authUser: (state: any): IUser => state.user.authUser,
      // matchDone: (state: any) => state.matchStarted, // Need to create a new store for this
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
