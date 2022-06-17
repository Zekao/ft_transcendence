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

  


  </v-card>
</template>

<script lang="ts">
import Vue from 'vue'
import { mapState } from 'vuex'
import { NuxtSocket } from 'nuxt-socket-io'
import { IUser } from '~/store/user'

export default Vue.extend({
  name: 'GameMatchmaking',

  data: () => ({
    waiting: false,
    ready: false,
    socket: null as NuxtSocket | null,
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
