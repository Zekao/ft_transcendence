<template>
  <v-card
    height="calc(100% - 76px)"
    color="grey lighten-1"
    class="d-flex d-flex-column justify-center align-center"
  >
    <v-btn x-large :loading="waiting" class="mr-4" @click="emitJoin"> Join </v-btn>
    <v-btn x-large :disabled="!waiting" @click="emitLeave"> Leave </v-btn>
    <p> {{ !ready ? 'Not ready' : 'READY' }} </p>
  </v-card>
</template>

<script lang="ts">
import Vue from 'vue'
import { mapState } from 'vuex'
import { NuxtSocket } from 'nuxt-socket-io'

export default Vue.extend({
  name: 'GameMatchmaking',

  data: () => ({
    waiting: false,
    ready: false,
    socket: null as NuxtSocket | null,
  }),

  computed: {
    ...mapState({
      accessToken: (state: any) => state.token.accessToken
    })
  },

  mounted() {
    this.socket = this.$nuxtSocket({
      channel: '/game',
      auth: {
        Authorization: this.accessToken,
        waitinglist: "1",
      },
      path: '/api/socket.io/',
    } as any)
    this.socket.on('waitinglist', (msg, matchID) => {
      if (msg === 'ready') {
        this.$store.state.commit('SELECTED_MATCH_ID', matchID)
        this.$emit('next')
        this.ready = true
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
    }
  }
})
</script>
