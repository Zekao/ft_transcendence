<template>
  <div>
    <canvas
      ref="game"
      height="calc(100% - 76px)"
      width="600px"
      color="grey lighten-1"
      class="d-flex justify-center align-center"
      style="border: 1px solid black;">
    </canvas>
    <p>
      <button @:click="move('up')">Up</button>
      <button @:click="move('down')">Down</button>
    </p>
  </div>
</template>

<script lang="ts">
import Vue from 'vue'
import { mapState } from 'vuex'
import { NuxtSocket } from 'nuxt-socket-io'
import { IUser } from '@/store/user'

export default Vue.extend({

  props: {
    user: Object as () => IUser
  },

  data: () => ({
    messageText: '',
    messages: [] as string[],
    socket: null as NuxtSocket | null,
  }),

  computed: {
    ...mapState({
      authUser: (state: any) => state.user.authUser,
      accessToken: (state: any) => state.token.accessToken,
    })
  },

  mounted() {
    this.socket = this.$nuxtSocket({
      channel: "/game",
      extraHeaders: {
        Authorization: this.accessToken,
        game: "a",
      },
      path: "/api/socket.io/",
    })
    this.socket.on('msg', (msg, cb) => {
      this.messages.push(msg)
    })
  },

  methods: {
    move(direction) {
      this.socket.emit("move", direction);
    }
  }
})
</script>
