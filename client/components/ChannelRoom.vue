<template>
  <div> {{ channelName }} </div>
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
    socket: null as NuxtSocket | null,
  }),

  computed: {
    ...mapState({
      accessToken: (state: any) => state.accessToken,
    })
  },

  mounted() {
    this.socket = this.$nuxtSocket({
      channel: '/hello',
      extraHeaders: {
        Authorization: this.accessToken,
      },
      path: "/api/socket.io",
    })
    this.socket.on('Hello', (msg, cb) => {
      console.log(msg)
      console.log(cb)
    })
  },

  methods: {
    emitHelloWorld() {
      if (this.socket) {
        this.socket.emit('Hello', {
            hello: 'world'
          }, (resp: any) => {
            console.log(resp)
        })
      }
    }
  }
})
</script>
