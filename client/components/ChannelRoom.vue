<template>
  <v-sheet width="100%">
    <v-card height="320px"></v-card>
    <v-toolbar>
      <v-text-field
        v-model="messageText"
        hide-details
      ></v-text-field>
      <v-btn icon @click="emitHelloWorld"><v-icon>mdi-pencil</v-icon></v-btn>
    </v-toolbar>
  </v-sheet>
</template>

<script lang="ts">
import Vue from 'vue'
import { mapState } from 'vuex'
import { NuxtSocket } from 'nuxt-socket-io'

export default Vue.extend({

  props: {
    channelName: String as () => string
  },

  data: () => ({
    messageText: '',
    messages: [] as string[],
    socket: null as NuxtSocket | null,
  }),

  computed: {
    ...mapState({
      accessToken: (state: any) => state.token.accessToken,
    })
  },

  mounted() {
    this.socket = this.$nuxtSocket({
      extraHeaders: {
        Authorization: this.accessToken,
        channel: this.channelName,
      },
      path: "/api/socket.io/",
    })
    this.socket.on('channel', (msg, cb) => {
      console.log('hey')
      console.log(msg)
      console.log(cb)
    })
  },

  methods: {
    emitHelloWorld() {
      if (this.socket) {
        this.socket.emit('channel', 'Hello World!', (resp: any) => {
            console.log(resp)
        })
      }
    }
  }
})
</script>
